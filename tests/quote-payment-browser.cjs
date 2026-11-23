const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:8772";
const paymentPage = origin + "/quote-payment.html";
const sandboxUrl = "https://invoice.stripe.com/i/acct_1Tj1MwCAcBbMzZu0/test_example";
const liveUrl = "https://invoice.stripe.com/i/acct_1Tj1MhFpqcjE8MaK/live_example";

function quoteUrl(invoice) {
  return paymentPage + "#" + new URLSearchParams({ invoice });
}

async function verifyCheckout(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  let visitedInvoice;
  let referrer;

  try {
    await page.route("**/*", async route => {
      const url = route.request().url();
      if (url.startsWith(origin + "/")) return route.continue();
      if (url === sandboxUrl) {
        visitedInvoice = url;
        referrer = route.request().headers().referer;
        return route.fulfill({ contentType: "text/html", body: "<h1>Stripe sandbox invoice fixture</h1>" });
      }
      return route.abort();
    });

    await page.goto(paymentPage);
    await page.locator("#payment-help").waitFor({ state: "visible" });
    await page.getByText("MicroCD Labs is a DBA of KARIGARI HOME LLC", { exact: false }).waitFor();
    assert.equal(await page.locator("#stripe-invoice").isVisible(), false);

    await page.goto(quoteUrl(sandboxUrl));
    const testButton = page.getByRole("link", { name: "Open Stripe test invoice" });
    await testButton.waitFor();
    await page.locator("#payment-test").waitFor({ state: "visible" });
    assert.equal(await testButton.getAttribute("href"), sandboxUrl);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    await page.goto(quoteUrl(liveUrl));
    const liveButton = page.getByRole("link", { name: "Pay with Stripe" });
    await liveButton.waitFor();
    assert.equal(await liveButton.getAttribute("href"), liveUrl);
    assert.equal(await page.locator("#payment-test").isVisible(), false);

    await page.goto(quoteUrl("https://invoice.stripe.com/i/acct_other/test_example"));
    await page.locator("#payment-help").waitFor({ state: "visible" });
    assert.equal(await page.locator("#stripe-invoice").getAttribute("href"), null);

    await page.goto(quoteUrl(sandboxUrl));
    await testButton.click();
    await page.getByRole("heading", { name: "Stripe sandbox invoice fixture" }).waitFor();
    assert.equal(visitedInvoice, sandboxUrl);
    assert.equal(referrer, undefined);
    assert.deepEqual(pageErrors, []);
    console.log(`Stripe checkout handoff passed at ${width}px.`);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    for (const width of [390, 1440]) await verifyCheckout(browser, width);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
