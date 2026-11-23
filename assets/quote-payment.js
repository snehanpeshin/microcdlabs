const invoiceOrigin = "https://invoice.stripe.com";
const accounts = new Map([
  ["acct_1Tj1MwCAcBbMzZu0", "test"],
  ["acct_1Tj1MhFpqcjE8MaK", "live"],
]);

export function parseStripeInvoice(value) {
  if (typeof value !== "string" || value.length > 2048) return null;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const match = /^\/i\/(acct_[A-Za-z0-9]+)\/(test|live)_[A-Za-z0-9_-]+$/.exec(url.pathname);
  if (url.origin !== invoiceOrigin || url.username || url.password || url.hash ||
      !match || accounts.get(match[1]) !== match[2]) {
    return null;
  }

  // Rebuild the URL from the verified account and path. Stripe's source tag is optional.
  const source = url.searchParams.get("s");
  const invoice = new URL(url.pathname, invoiceOrigin);
  if (source && /^[a-z]{1,5}$/.test(source)) invoice.searchParams.set("s", source);
  return { href: invoice.href, sandbox: match[2] === "test" };
}

export function showQuotePayment(document, hash) {
  const invoice = parseStripeInvoice(new URLSearchParams(hash.slice(1)).get("invoice"));
  document.querySelector("#payment-help").hidden = Boolean(invoice);
  document.querySelector("#payment-ready").hidden = !invoice;
  document.querySelector("#payment-test").hidden = !invoice?.sandbox;

  const button = document.querySelector("#stripe-invoice");
  button.textContent = invoice?.sandbox ? "Open Stripe test invoice" : "Pay with Stripe";
  if (invoice) {
    button.href = invoice.href;
  } else {
    button.removeAttribute("href");
  }
}
