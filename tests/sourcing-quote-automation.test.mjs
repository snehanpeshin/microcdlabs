import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { createWorkflow } from "../backend/sourcing-quotes/workflow.mjs";
import { createStripe, parseSandboxCredentials, parseStripeCredentials } from "../backend/sourcing-quotes/stripe.mjs";
import { sandboxInvoiceMessage, sandboxPaymentLink } from "../backend/sourcing-quotes/invoice-email.mjs";
import { createHandler } from "../backend/inquiries/handler.mjs";

const reference = "MCD-0123456789ABCDEF";
const sandboxAccount = "acct_1Tj1MwCAcBbMzZu0";
const hosted = "https://invoice.stripe.com/i/" + sandboxAccount + "/test_fixture";
const paymentLink = sandboxPaymentLink(hosted, sandboxAccount);
const recipient = "sandbox@example.test";
const secret = "whsec_fixture_only";
const amount = "25.00";
const time = 1795460400000;
const action = { reference, approved: true, amount, description: "Approved prototype sample" };
const admin = data => ({
  routeKey: "POST /sourcing-quotes/invoice",
  requestContext: { authorizer: { jwt: { claims: { token_use: "access", sub: "staff-fixture" } } } },
  body: JSON.stringify(data),
});
const signedEvent = (overrides = {}, epoch = time, live = false) => {
  const body = JSON.stringify({
    type: "invoice.payment_succeeded", livemode: live,
    data: { object: {
      id: "in_fixture", metadata: { microcd_quote: reference }, status: "paid", currency: "usd", amount_paid: 2500,
      ...overrides,
    } },
  });
  const timestamp = Math.floor(epoch / 1000);
  const signature = createHmac("sha256", secret).update(timestamp + "." + body).digest("hex");
  return { body, headers: { "stripe-signature": "t=" + timestamp + ",v1=" + signature } };
};

function fixture() {
  const record = { reference, email: recipient, status: "pending" };
  const calls = [];
  const store = {
    get: async () => record,
    approve: async (input, at) => {
      if (record.status === "pending") Object.assign(record, input, { status: "approved", approvedAt: at });
      return record;
    },
    linkInvoice: async (_, id) => { record.invoiceId = id; },
    claimInvoiceEmail: async (_, id, at) => {
      if (record.invoiceEmailStartedAt || record.status !== "approved" || record.invoiceId !== id) return false;
      record.invoiceEmailStartedAt = at;
      return true;
    },
    markSent: async () => {
      if (record.status === "approved") record.status = "sent";
      return record;
    },
    markPaid: async () => {
      if (record.status === "paid") return false;
      record.status = "paid";
      return true;
    },
  };
  const stripe = {
    verifyAccount: async () => calls.push("account"),
    createInvoice: async () => { calls.push("create"); return "in_fixture"; },
    finalizeInvoice: async () => { calls.push("finalize"); return paymentLink; },
  };
  const mail = { send: async () => { calls.push("email"); } };
  const workflow = createWorkflow({
    store, stripe, recipient, webhookSecret: secret, now: () => time,
    emailInvoice: (...args) => mail.send(...args),
    notifyPaid: async () => { calls.push("notify"); },
  });
  return { workflow, stripe, record, calls, mail };
}

test("only approved staff-authorized sandbox requests can create and send an invoice", async () => {
  const { workflow, record, calls } = fixture();
  assert.equal((await workflow.admin({ ...admin(action), requestContext: {} })).statusCode, 403);
  assert.equal((await workflow.admin(admin({ ...action, approved: false }))).statusCode, 400);
  assert.equal((await workflow.admin(admin({ ...action, amount: "25.001" }))).statusCode, 400);
  record.email = "real-customer@example.test";
  assert.equal((await workflow.admin(admin(action))).statusCode, 422);
  assert.deepEqual(calls, []);
  record.email = recipient;
  assert.equal((await workflow.admin(admin(action))).statusCode, 200);
  assert.equal(record.approvedBy, "staff-fixture");
  assert.equal(record.invoiceId, "in_fixture");
  assert.equal(record.status, "sent");
  assert.equal((await workflow.admin(admin(action))).statusCode, 200);
  assert.equal((await workflow.admin(admin({ ...action, amount: "26.00" }))).statusCode, 409);
  assert.deepEqual(calls, ["account", "create", "finalize", "email"]);
});

test("retries resume from the stored invoice and expired approvals require reconciliation", async () => {
  const { workflow, record, calls, stripe } = fixture();
  const finalize = stripe.finalizeInvoice;
  stripe.finalizeInvoice = async () => { throw new Error("temporary Stripe failure"); };
  assert.equal((await workflow.admin(admin(action))).statusCode, 503);
  assert.equal(record.status, "approved");
  assert.equal(record.invoiceId, "in_fixture");
  record.approvedAt -= 21 * 3600000;
  assert.equal((await workflow.admin(admin(action))).statusCode, 409);
  record.approvedAt = time;
  stripe.finalizeInvoice = finalize;
  assert.equal((await workflow.admin(admin(action))).statusCode, 200);
  assert.equal(calls.filter(call => call === "create").length, 1);
});

test("a signed Stripe sandbox payment changes the matched quote and notifies once", async () => {
  const { workflow, record, calls } = fixture();
  await workflow.admin(admin(action));
  assert.equal((await workflow.webhook({ ...signedEvent(), headers: {} })).statusCode, 400);
  assert.equal((await workflow.webhook(signedEvent({}, time - 301000))).statusCode, 400);
  await workflow.webhook(signedEvent({ amount_paid: 2499 }));
  await workflow.webhook(signedEvent({ id: "in_other" }));
  assert.equal(record.status, "sent");
  const payment = signedEvent();
  assert.equal((await workflow.webhook(payment)).statusCode, 200);
  assert.equal((await workflow.webhook(payment)).statusCode, 200);
  assert.equal(record.status, "paid");
  assert.equal(calls.filter(call => call === "notify").length, 1);
});

test("Stripe requests are scoped to the sandbox and use deterministic mutation keys", async () => {
  assert.throws(() => createStripe("sk_live_fixture"), /sandbox key/);
  const calls = [];
  const stripe = createStripe("sk_test_fixture", async (url, options) => {
    calls.push({ url, options });
    const path = new URL(url).pathname;
    const data = path === "/v1/account" ? { id: "acct_1Tj1MwCAcBbMzZu0" }
      : path === "/v1/customers" ? { id: "cus_fixture" }
      : path.endsWith("/finalize") ? { id: "in_fixture", livemode: false, amount_due: 2500, status: "open", currency: "usd", hosted_invoice_url: hosted }
      : { id: "in_fixture" };
    return { ok: true, json: async () => data };
  });
  const record = { reference, email: recipient, name: "Fixture", cents: 2500, invoiceDescription: "Approved lines" };
  await stripe.verifyAccount();
  const id = await stripe.createInvoice(record);
  assert.equal(await stripe.finalizeInvoice(record, id), paymentLink);
  assert.deepEqual(calls.slice(1).map(call => call.options.headers["idempotency-key"]),
    ["customer", "draft", "line", "finalize"].map(action => "microcd-sourcing-v1:" + reference + ":" + action));
  assert.equal(calls[2].options.body.get("collection_method"), "send_invoice");
  assert.equal(calls[3].options.body.get("amount"), "2500");
});

test("only the configured synthetic sourcing request reaches the sandbox queue", async () => {
  const calls = [];
  const origin = "https://www.microcdlabs.com";
  const handler = createHandler({
    env: { SENDER_EMAIL: recipient, RECIPIENT_EMAIL: recipient, ALLOWED_ORIGINS: origin, QUOTE_SANDBOX_RECIPIENT: recipient },
    storeQuote: async ref => { calls.push(ref); return true; },
    sendEmail: async () => { calls.push("email"); return { MessageId: "fixture" }; },
  });
  const request = (email, projectType) => ({
    headers: { origin, "content-type": "application/json" },
    requestContext: { http: { method: "POST" } },
    body: JSON.stringify({ email, projectType, name: "Fixture", description: "Fixture requirements" }),
  });
  const subject = "Component sourcing quote request — " + reference;
  assert.equal((await handler(request(recipient, subject))).statusCode, 200);
  await handler(request("real-customer@example.test", subject));
  await handler(request(recipient, "Engineering consultation"));
  assert.deepEqual(calls, [reference, "email", "email"]);
});

test("normalizes console credential labels while rejecting live, missing, or ambiguous credentials", () => {
  assert.deepEqual(
    parseSandboxCredentials(JSON.stringify({ " APIKEY ": " sk_test_Fixture ", "WebhookSecret ": " whsec_Fixture " })),
    { apiKey: "sk_test_Fixture", webhookSecret: "whsec_Fixture" },
  );
  for (const values of [
    { apiKey: "sk_live_Fixture", webhookSecret: "whsec_Fixture" },
    { apiKey: "rk_test_Fixture" },
    { apiKey: "rk_test_Fixture", APIKEY: "sk_test_Other", webhookSecret: "whsec_Fixture" },
  ]) assert.throws(() => parseSandboxCredentials(JSON.stringify(values)));
});

test("an uncertain email send is held for reconciliation instead of repeating delivery", async () => {
  const { workflow, record, mail } = fixture();
  let attempts = 0;
  mail.send = async (_, link) => {
    attempts++;
    assert.equal(link, paymentLink);
    throw new Error("SES timed out");
  };
  for (let retry = 0; retry < 2; retry++) {
    const response = await workflow.admin(admin(action));
    assert.equal(response.statusCode, 409);
    assert.match(response.body, /delivery is unconfirmed/);
  }
  assert.equal(record.status, "approved");
  assert.equal(attempts, 1);
});

test("concurrent approval requests claim at most one sandbox invoice email", async () => {
  const { workflow, record, calls } = fixture();
  const responses = await Promise.all([workflow.admin(admin(action)), workflow.admin(admin(action))]);
  assert.ok(responses.some(response => response.statusCode === 200));
  assert.equal(record.status, "sent");
  assert.equal(calls.filter(call => call === "email").length, 1);
});

test("sandbox email uses a branded test payment link and rejects other hosts and live invoices", () => {
  const link = new URL(sandboxPaymentLink(hosted + "?s=ap", sandboxAccount));
  assert.equal(link.origin + link.pathname, "https://www.microcdlabs.com/quote-payment.html");
  assert.equal(link.search, "");
  assert.equal(new URLSearchParams(link.hash.slice(1)).get("invoice"), hosted);
  assert.throws(() => sandboxPaymentLink(hosted.replace("test_", "live_"), sandboxAccount));
  assert.throws(() => sandboxPaymentLink(hosted.replace("invoice.stripe.com", "example.test"), sandboxAccount));
  assert.throws(() => sandboxPaymentLink(hosted.replace(sandboxAccount, "acct_other"), sandboxAccount));
  const message = sandboxInvoiceMessage(reference, 2500, link.href);
  assert.equal(message.Subject.Data, "[Sandbox] MicroCD Labs invoice for " + reference);
  assert.match(message.Body.Text.Data, /Test amount: \$25.00 USD/);
  assert.ok(message.Body.Text.Data.includes(link.href));
});

test("live pilot is paused by default and accepts only the designated quote under the cap", async () => {
  const calls = [];
  let row;
  const store = {
    get: async () => row,
    ensurePilot: async (input) => { row ||= { ...input }; calls.push("ensure"); },
    approve: async (input, at) => {
      if (row.status === "pending") Object.assign(row, input, { status: "approved", approvedAt: at });
      return row;
    },
    linkInvoice: async (_, id) => { row.invoiceId = id; },
    markSent: async () => (row.status = "sent", row),
    markPaid: async () => (row.status = "paid", true),
  };
  const stripe = {
    verifyAccount: async () => calls.push("account"),
    createInvoice: async () => "in_fixture",
    finalizeInvoice: async () => { calls.push("finalize"); },
    sendLiveInvoice: async () => { calls.push("live-send"); },
  };
  const options = {
    store, stripe, recipient, webhookSecret: secret, live: true,
    pilot: { reference, name: "Pilot buyer", maxCents: 2500 },
    now: () => time,
  };
  const liveAdmin = input => ({ ...admin(input), routeKey: "POST /sourcing-quotes-live/invoice" });
  const paused = createWorkflow(options);
  assert.equal((await paused.admin(liveAdmin(action))).statusCode, 409);
  const liveWorkflow = createWorkflow({ ...options, enabled: true });
  assert.equal((await liveWorkflow.admin(liveAdmin({ ...action, reference: "MCD-FFFFFFFFFFFFFFFF" }))).statusCode, 404);
  assert.equal((await liveWorkflow.admin(liveAdmin({ ...action, amount: "25.01" }))).statusCode, 422);
  assert.deepEqual(calls, []);
  assert.equal((await liveWorkflow.admin(liveAdmin(action))).statusCode, 200);
  assert.equal(row.email, recipient);
  assert.equal(row.invoiceId, "in_fixture");
  assert.equal((await liveWorkflow.admin(liveAdmin(action))).statusCode, 200);
  assert.equal(calls.filter(call => call === "live-send").length, 1);
  assert.equal((await liveWorkflow.webhook(signedEvent())).statusCode, 400);
  assert.equal((await paused.webhook(signedEvent({}, time, true))).statusCode, 200);
  assert.equal(row.status, "paid");
});

test("live Stripe requires a restricted key and verifies the business has payments enabled", async () => {
  const config = JSON.stringify({apiKey: "rk_live_Fixture", webhookSecret: "whsec_Fixture"});
  assert.equal(parseStripeCredentials(config, true).apiKey, "rk_live_Fixture");
  assert.throws(() => parseSandboxCredentials(config));
  assert.throws(() => createStripe("sk_live_Fixture", fetch, true), /Restricted/);
  let chargesEnabled = false;
  const stripe = createStripe("rk_live_Fixture", async () => ({
    ok: true,
    json: async () => ({ id: "acct_1Tj1MhFpqcjE8MaK", charges_enabled: chargesEnabled }),
  }), true);
  await assert.rejects(stripe.verifyAccount(), /not enabled/);
  chargesEnabled = true;
  await stripe.verifyAccount();
});
