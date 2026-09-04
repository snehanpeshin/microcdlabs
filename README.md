# MicroCD Labs Microfluidics Supply Site

A static website for MicroCD Labs, a division of Karigari Home LLC, focused on microfluidics parts and equipment supply.

## What is included

- Responsive landing page focused on microfluidic and diagnostic product development
- Dedicated About and Technical Consultation pages
- Development-service architecture covering cartridges, lab-on-disc, prototyping, verification planning, suppliers, and commercialization support
- Dedicated Products, Services, and Kits catalog pages
- Classified product catalog with product-class and subclass dropdowns
- Broad quote-based catalog for tubing, fittings, chips, pumps, sensors, diagnostic consumables, lab plastics, OEM items, starter kits, and productized sourcing services
- Careers page for a microfluidic testing internship
- Non-interruptive first-quote promotion shown within the product workflow
- Cart and order-request interaction with quantities
- Mailto order request draft with payment-link/invoice request
- Invoice-first payment workflow copy
- Stripe invoice/payment-link request button
- Terms & Payments page for quote-based ordering
- MicroCD catalog numbers for all products
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

The marketing site uses `site.js` for shared navigation, responsive behavior, and consultation forms. Catalog pages also load `script.js`, which contains the product data and quote-cart behavior. The original framework source and package manifests for the historical product exports are not included in this repository.

## Scientific applications beta

- `/modeler/` is a dependency-free, local-first parametric 2D microfluidic workspace. It retains the compiled legacy 3D/GLB workspace as a separate preview.
- `/analyzer/` is the Kinetic Assay Analyzer guided workflow. CSV and image processing runs in the browser; raw files are not uploaded or stored by the site.
- `/motor-controller/` is the CLAIR Motor Controller engineering beta. It uses the browser Web Serial API to communicate directly with supported USB serial hardware; serial data remains in the browser unless the user downloads a log or report.
- The Modeler and Analyzer share `assets/scientific-ui.css` and `assets/scientific-ui.js`; the Motor Controller uses its own hardware-console stylesheet and module alongside the main site theme.
- Product architecture and known gaps are documented in `docs/architecture-and-gap-assessment.md`. Scientific formulas and assumptions are documented in `docs/methodology.md`.

Run product checks with Node 20 or newer:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Payment setup

The live site is currently a static cart and order-request flow. It does not collect card numbers or bank details.

Recommended next step for real payments:

- Use Stripe Checkout, Stripe invoices, or Stripe Payment Links for customer payment.
- Connect Stripe payouts to the Mercury business bank account.
- Keep Stripe secret keys on a serverless backend, not in `index.html`, `products.html`, `services.html`, `kits.html`, or `script.js`.
- Add environment variables only when a backend checkout function is added, such as `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and product price IDs.
- Add terms, refund, shipping, and cancellation policy pages before enabling live checkout.

Current Stripe-ready setup:

- The product, service, and kit catalog pages have a `Request Stripe invoice` button that prepares an email with the selected cart items.
- To use a no-code Stripe Payment Link, create the link in Stripe Dashboard and paste it into `stripePaymentLinkUrl` in `script.js`.
- For true dynamic cart checkout, add a backend/API endpoint that creates Stripe Checkout Sessions and stores prices server-side.

## Notes

Before using this commercially, confirm the catalog against real supplier-approved items, prices, warranties, country-of-origin data, and compliance classifications.

The current catalog images are representative open-source images, not supplier product photos. Replace them with your own supplier-approved photos before launch, or keep the credit section if using Creative Commons/public-domain sources.

Do not copy third-party product photos or claim supplier affiliation, endorsement, distribution rights, or live inventory unless MicroCD Labs has written permission and a supplier-approved data feed or agreement.
