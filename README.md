# MicroCD Labs Microfluidics Supply Site

A static website for MicroCD Labs, a division of Karigari Home LLC, focused on microfluidics parts and equipment supply.

## What is included

- Responsive landing page with product-led hero
- Dedicated store page for the full microfluidics catalog
- Catalog for tubing, fittings, chip holders, pumps, sensors, plastic parts, and kits
- Catalog filters
- Cart and order-request interaction with quantities
- Mailto order request draft with payment-link/invoice request
- Invoice-first payment workflow copy
- MicroCD catalog numbers for all products
- Fisher Scientific reference links for comparable publicly listed supply items where available
- Research-use-only and export-aware positioning
- Online catalog imagery from Wikimedia Commons/NIST/NARA with source credits rendered on the page

## Run

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy on AWS Amplify

Use this folder as the Amplify app root:

```text
microfluidics-supply-site
```

The included `amplify.yml` publishes the static files directly and does not need an npm build.

## Payment setup

The live site is currently a static cart and order-request flow. It does not collect card numbers or bank details.

Recommended next step for real payments:

- Use Stripe Checkout, Stripe invoices, or Stripe Payment Links for customer payment.
- Connect Stripe payouts to the Mercury business bank account.
- Keep Stripe secret keys on a serverless backend, not in `index.html`, `store.html`, or `script.js`.
- Add environment variables only when a backend checkout function is added, such as `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and product price IDs.
- Add terms, refund, shipping, and cancellation policy pages before enabling live checkout.

## Notes

Before using this commercially, confirm the catalog against real supplier-approved items, prices, warranties, country-of-origin data, and compliance classifications.

The current catalog images are representative open-source images, not supplier product photos. Replace them with your own supplier-approved photos before launch, or keep the credit section if using Creative Commons/public-domain sources.

Fisher Scientific references are used as comparable sourcing references only. Do not copy Fisher product photos or claim Fisher pricing, affiliation, endorsement, distribution rights, or live inventory unless MicroCD Labs has written permission and a supplier-approved data feed or agreement.
