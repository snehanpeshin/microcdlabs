import { createHmac, timingSafeEqual } from "node:crypto";

const referencePattern = /^MCD-[A-F0-9]{16}$/;
const invoicePattern = /^in_[A-Za-z0-9]+$/;
const retryWindow = 20 * 60 * 60 * 1000;
const error = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const json = (statusCode, data) => ({
  statusCode,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: JSON.stringify(data),
});

function parseRequest(value) {
  if (typeof value !== "string" || value.length > 4096) throw error(400, "Invalid invoice request.");
  let data;
  try { data = JSON.parse(value); } catch { throw error(400, "Invalid invoice request."); }
  const { reference, approved, amount, description } = data ?? {};
  if (!referencePattern.test(reference ?? "") || approved !== true ||
      typeof amount !== "string" || !/^\d{1,6}\.\d{2}$/.test(amount) ||
      typeof description !== "string" || !description.trim() || description.trim().length > 500) {
    throw error(400, "Enter the approved amount, invoice description, and buyer approval.");
  }
  const cents = Number(amount.replace(".", ""));
  if (cents < 50 || cents > 99999999) throw error(400, "Enter an approved USD amount of at least $0.50.");
  return { reference, cents, invoiceDescription: description.trim() };
}

export function verifyEvent(raw, header, secret, now) {
  if (!raw || raw.length > 256000 || !header || !/^whsec_/.test(secret ?? "")) return null;
  const parts = header.split(",").map(entry => entry.trim());
  const timestamp = parts.find(value => /^t=\d+$/.test(value))?.slice(2);
  if (!timestamp || Math.abs(Math.floor(now / 1000) - Number(timestamp)) > 300) return null;
  const digest = createHmac("sha256", secret).update(timestamp + ".").update(raw).digest();
  const signed = parts.some(value => /^v1=[a-f0-9]{64}$/.test(value) &&
    timingSafeEqual(digest, Buffer.from(value.slice(3), "hex")));
  if (!signed) return null;
  try { return JSON.parse(raw.toString("utf8")); } catch { return null; }
}

export function createWorkflow({ store, stripe, webhookSecret, recipient, emailInvoice, notifyPaid,
  live = false, pilot, allLiveQuotes = false, enabled = !live, now = Date.now, report = () => {} }) {
  const route = live ? "/sourcing-quotes-live" : "/sourcing-quotes";
  const eligiblePilot = live && referencePattern.test(pilot?.reference ?? "") &&
    typeof pilot.name === "string" && pilot.name.trim() && Number.isInteger(pilot.maxCents) && pilot.maxCents >= 50 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient ?? "");
  const pilotQuote = eligiblePilot ? {
    reference: pilot.reference, name: pilot.name, description: "Staff-designated live invoice pilot.",
    email: recipient, status: "pending",
  } : null;
  const deliveryUnconfirmed = () => error(409,
    "Invoice email delivery is unconfirmed. Check the sandbox inbox before sending anything again.");

  async function sendInvoice(input) {
    if (live && !enabled) throw error(409, "Live invoice sending is paused.");
    if (live && (!allLiveQuotes || input.reference === pilotQuote?.reference)) {
      if (!pilotQuote) throw error(409, "Live invoice sending is paused.");
      if (input.reference !== pilotQuote.reference) throw error(404, "Quote is outside the live pilot.");
      if (input.cents > pilot.maxCents) throw error(422, "The total exceeds the approved live pilot limit.");
      await store.ensurePilot(pilotQuote, now());
    }
    const current = await store.get(input.reference);
    if (!current) throw error(404, "Quote request not found.");
    if ((!live || !allLiveQuotes || input.reference === pilotQuote?.reference) &&
        current.email.toLowerCase() !== recipient?.toLowerCase()) {
      throw error(422, "Only the configured invoice recipient can receive this invoice.");
    }

    const record = await store.approve(input, now());
    if (!record) throw error(404, "Quote request not found.");
    if (record.cents !== input.cents || record.invoiceDescription !== input.invoiceDescription) {
      throw error(409, "This quote already has an approved total and invoice description.");
    }
    if (["sent", "paid"].includes(record.status)) return record;
    if (record.invoiceEmailStartedAt) throw deliveryUnconfirmed();
    if (now() - record.approvedAt >= retryWindow) {
      throw error(409, "Reconcile the existing invoice in Stripe before retrying this quote.");
    }

    await stripe.verifyAccount();
    const invoiceId = record.invoiceId || await stripe.createInvoice(record);
    if (!invoicePattern.test(invoiceId)) throw error(503, "Stripe invoice could not be verified.");
    await store.linkInvoice(record.reference, invoiceId);
    const paymentLink = await stripe.finalizeInvoice(record, invoiceId);
    if (live) {
      // Stripe idempotency covers the provider send itself.
      await stripe.sendLiveInvoice(record, invoiceId);
      return store.markSent(record.reference);
    }
    const claimed = await store.claimInvoiceEmail(record.reference, invoiceId, now());
    if (!claimed) {
      const latest = await store.get(record.reference);
      if (latest && ["sent", "paid"].includes(latest.status)) return latest;
      throw deliveryUnconfirmed();
    }

    try {
      await emailInvoice(record, paymentLink);
      return await store.markSent(record.reference);
    } catch {
      report("sourcing_quote_invoice_email_unconfirmed");
      throw deliveryUnconfirmed();
    }
  }

  return {
    async admin(event) {
      const claims = event.requestContext?.authorizer?.jwt?.claims;
      if (claims?.token_use !== "access" || !claims.sub) {
        return json(403, { error: "Staff sign-in required." });
      }
      try {
        if (event.routeKey === "GET " + route) {
          if (live && !allLiveQuotes) {
            const row = pilotQuote && await store.get(pilotQuote.reference);
            return json(200, {
              quotes: row || pilotQuote ? [row || pilotQuote] : [], cursor: null, enabled: enabled && Boolean(pilotQuote),
            });
          }
          const cursor = event.queryStringParameters?.cursor;
          if (cursor !== undefined && !referencePattern.test(cursor)) throw error(400, "Invalid quote cursor.");
          const page = await store.list(cursor);
          return json(200, live ? { ...page, enabled } : page);
        }
        if (event.routeKey === "POST " + route + "/invoice" && !event.isBase64Encoded) {
          const record = await sendInvoice({ ...parseRequest(event.body), approvedBy: claims.sub });
          return json(200, { reference: record.reference, status: record.status });
        }
        return json(404, { error: "Unknown quote action." });
      } catch (failure) {
        if (failure.statusCode) return json(failure.statusCode, { error: failure.message });
        report("sourcing_quote_admin_failed");
        return json(503, { error: "The request is pending. Retry with the same approved invoice details." });
      }
    },

    async webhook(event) {
      if (typeof event.body !== "string" || event.body.length > 350000) {
        return json(400, { error: "Invalid Stripe payment event." });
      }
      const raw = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
      const signed = verifyEvent(raw, event.headers?.["stripe-signature"], webhookSecret, now());
      if (signed?.livemode !== live) return json(400, { error: "Invalid Stripe payment event." });
      if (signed.type !== "invoice.payment_succeeded") return json(200, { accepted: true });

      const invoice = signed.data?.object;
      const reference = invoice?.metadata?.microcd_quote;
      if (!referencePattern.test(reference ?? "") || !invoicePattern.test(invoice?.id ?? "") ||
          invoice.status !== "paid" || invoice.currency !== "usd") return json(200, { accepted: true });

      try {
        const record = await store.get(reference);
        if (record?.invoiceId === invoice.id && record.cents === invoice.amount_paid) {
          const changed = await store.markPaid(reference, invoice.id, now());
          if (changed && notifyPaid) {
            try { await notifyPaid(reference); } catch { report("sourcing_quote_paid_notification_failed"); }
          }
        }
        return json(200, { accepted: true });
      } catch {
        report("sourcing_quote_webhook_failed");
        return json(503, { error: "Payment update temporarily unavailable." });
      }
    },
  };
}
