import { sandboxPaymentLink } from "./invoice-email.mjs";

const sandboxAccount = "acct_1Tj1MwCAcBbMzZu0";

export function parseSandboxCredentials(secretString) {
  const parsed = JSON.parse(secretString);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Stripe sandbox credentials must be a JSON object.");
  }
  const entries = new Map();
  for (const [label, value] of Object.entries(parsed)) {
    const name = label.trim().toLowerCase();
    if (name !== "apikey" && name !== "webhooksecret") continue;
    if (typeof value !== "string" || entries.has(name)) {
      throw new Error("Stripe sandbox credential fields must be unique strings.");
    }
    entries.set(name, value.trim());
  }
  const apiKey = entries.get("apikey");
  const webhookSecret = entries.get("webhooksecret");
  if (!/^(?:sk|rk)_test_[A-Za-z0-9]+$/.test(apiKey ?? "") ||
      !/^whsec_[A-Za-z0-9]+$/.test(webhookSecret ?? "")) {
    throw new Error("Stripe sandbox credentials are incomplete.");
  }
  return { apiKey, webhookSecret };
}

export function createStripe(key, fetcher = fetch) {
  if (!/^(?:sk|rk)_test_[A-Za-z0-9]+$/.test(key ?? "")) throw new Error("Stripe sandbox key required.");

  async function call(path, { body, idempotency } = {}) {
    const headers = { authorization: "Bearer " + key };
    if (idempotency) headers["idempotency-key"] = idempotency;
    if (body) headers["content-type"] = "application/x-www-form-urlencoded";
    const response = await fetcher("https://api.stripe.com/v1/" + path, {
      headers, method: body ? "POST" : "GET", body: body && new URLSearchParams(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Stripe sandbox request failed.");
    return response.json();
  }

  function mutate(path, record, action, body = {}) {
    return call(path, { body, idempotency: "microcd-sourcing-v1:" + record.reference + ":" + action });
  }

  return {
    async verifyAccount() {
      if ((await call("account")).id !== sandboxAccount) throw new Error("Wrong Stripe sandbox account.");
    },
    async createInvoice(record) {
      const customer = await mutate("customers", record, "customer", {
        email: record.email, name: record.organization || record.name,
        "metadata[microcd_quote]": record.reference,
      });
      const invoice = await mutate("invoices", record, "draft", {
        customer: customer.id, currency: "usd", collection_method: "send_invoice", days_until_due: "30",
        auto_advance: "false", pending_invoice_items_behavior: "exclude",
        "metadata[microcd_quote]": record.reference, description: "MicroCD Labs sourcing quote " + record.reference,
      });
      await mutate("invoiceitems", record, "line", {
        customer: customer.id, invoice: invoice.id, currency: "usd", amount: String(record.cents),
        description: record.invoiceDescription,
      });
      return invoice.id;
    },
    async finalizeInvoice(record, id) {
      const invoice = await mutate("invoices/" + id + "/finalize", record, "finalize", { auto_advance: "false" });
      if (invoice.livemode !== false || invoice.id !== id || invoice.amount_due !== record.cents ||
          invoice.currency !== "usd" || invoice.status !== "open" || !invoice.hosted_invoice_url) {
        throw new Error("Final invoice does not match the approved sandbox quote.");
      }
      return sandboxPaymentLink(invoice.hosted_invoice_url, sandboxAccount);
    },
  };
}
