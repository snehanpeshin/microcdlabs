import { parseStripeInvoice } from "../assets/quote-payment.js";

const args = process.argv.slice(2);
const live = args[0] === "--live";
if (args.length !== Number(live)) {
  console.error("Usage: node tools/quote-payment-link.mjs [--live] < invoice-url.txt");
  process.exitCode = 1;
} else {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
    if (input.length > 4096) break;
  }
  const invoice = parseStripeInvoice(input.trim());
  if (!invoice || invoice.sandbox === live) {
    console.error(live ? "Provide a live MicroCD Labs Stripe invoice URL." : "Provide a MicroCD Labs sandbox invoice URL.");
    process.exitCode = 1;
  } else {
    const paymentPage = new URL("https://www.microcdlabs.com/quote-payment.html");
    paymentPage.hash = new URLSearchParams({ invoice: invoice.href }).toString();
    console.log(paymentPage.href);
  }
}
