export function sandboxPaymentLink(hostedUrl, account) {
  const invoice = new URL(hostedUrl);
  const prefix = "/i/" + account + "/test_";
  if (invoice.origin !== "https://invoice.stripe.com" || invoice.username || invoice.password ||
      invoice.hash || !invoice.pathname.startsWith(prefix) ||
      !/^[A-Za-z0-9_-]+$/.test(invoice.pathname.slice(prefix.length))) {
    throw new Error("Unexpected sandbox invoice payment link.");
  }

  const direct = new URL(invoice.pathname, invoice.origin);
  const payment = new URL("/quote-payment.html", "https://www.microcdlabs.com");
  payment.hash = new URLSearchParams({ invoice: direct.href }).toString();
  return payment.href;
}

export function sandboxInvoiceMessage(reference, cents, paymentLink) {
  const total = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
  }).format(cents / 100);

  return {
    Subject: { Charset: "UTF-8", Data: "[Sandbox] MicroCD Labs invoice for " + reference },
    Body: {
      Text: {
        Charset: "UTF-8",
        Data: [
          "Your MicroCD Labs test invoice is ready.",
          "",
          "Quote reference: " + reference,
          "Test amount: " + total + " USD",
          "",
          "Open your Stripe test invoice: " + paymentLink,
          "",
          "Stripe sandbox payments are simulated.",
          "MicroCD Labs is a DBA of KARIGARI HOME LLC.",
        ].join("\n"),
      },
    },
  };
}
