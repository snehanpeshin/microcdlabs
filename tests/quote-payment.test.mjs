import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { parseStripeInvoice, showQuotePayment } from "../assets/quote-payment.js";

const sandbox = "https://invoice.stripe.com/i/acct_1Tj1MwCAcBbMzZu0/test_example";
const live = "https://invoice.stripe.com/i/acct_1Tj1MhFpqcjE8MaK/live_example";

test("limits payment destinations to matching MicroCD Labs Stripe accounts", () => {
  assert.deepEqual(parseStripeInvoice(sandbox + "?s=ap"), { href: sandbox + "?s=ap", sandbox: true });
  assert.deepEqual(parseStripeInvoice(live), { href: live, sandbox: false });
  assert.equal(parseStripeInvoice(live + "?next=https://example.com").href, live);
  for (const url of [
    sandbox.replace("invoice.stripe.com", "invoice.stripe.com.example.com"),
    sandbox.replace("https:", "http:"),
    sandbox.replace("https://", "https://account@"),
    sandbox.replace("acct_1Tj1MwCAcBbMzZu0", "acct_other"),
    sandbox.replace("test_", "live_"),
    live.replace("live_", "test_"),
    sandbox + "/extra",
    sandbox + "#redirect",
    sandbox + "/%2F",
    "javascript:alert(1)",
    "",
  ]) assert.equal(parseStripeInvoice(url), null, url);
});

test("reveals only a verified payment link and marks the sandbox", () => {
  const fields = {
    "#payment-help": { hidden: false },
    "#payment-ready": { hidden: true },
    "#payment-test": { hidden: true },
    "#stripe-invoice": { textContent: "Pay with Stripe" },
  };
  const button = fields["#stripe-invoice"];
  button.removeAttribute = name => { delete button[name]; };
  const document = { querySelector: selector => fields[selector] };
  showQuotePayment(document, "#invoice=https://example.com");
  assert.equal(fields["#payment-ready"].hidden, true);
  assert.equal(fields["#stripe-invoice"].href, undefined);

  showQuotePayment(document, "#" + new URLSearchParams({ invoice: sandbox }));
  assert.equal(fields["#payment-help"].hidden, true);
  assert.equal(fields["#payment-ready"].hidden, false);
  assert.equal(fields["#payment-test"].hidden, false);
  assert.equal(fields["#stripe-invoice"].textContent, "Open Stripe test invoice");
  assert.equal(fields["#stripe-invoice"].href, sandbox);

  showQuotePayment(document, "#" + new URLSearchParams({ invoice: live }));
  assert.equal(fields["#payment-test"].hidden, true);
  assert.equal(button.textContent, "Pay with Stripe");
  assert.equal(button.href, live);

  showQuotePayment(document, "");
  assert.equal(fields["#payment-help"].hidden, false);
  assert.equal(fields["#payment-ready"].hidden, true);
  assert.equal(button.href, undefined);
});

test("staff link generation defaults to sandbox and requires explicit live mode", () => {
  const generate = (invoice, ...args) => spawnSync(process.execPath,
    ["tools/quote-payment-link.mjs", ...args], { input: invoice, encoding: "utf8" });
  for (const [invoice, args] of [[sandbox, []], [live, ["--live"]]]) {
    const result = generate(invoice, ...args);
    assert.equal(result.status, 0, result.stderr);
    const link = new URL(result.stdout.trim());
    assert.equal(link.origin + link.pathname, "https://www.microcdlabs.com/quote-payment.html");
    assert.equal(link.search, "");
    assert.equal(new URLSearchParams(link.hash.slice(1)).get("invoice"), invoice);
  }
  assert.equal(generate(live).status, 1);
  assert.equal(generate(sandbox, "--live").status, 1);
});
