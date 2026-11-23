# MicroCD Labs Website

A static HTML/CSS/JavaScript website for MicroCD Labs: in-development CLAIR human and veterinary oral-health programs, engineering services, research tools, and a research-use catalog. Legal relationship wording requires confirmation before standardizing legacy legal pages.

## What is included

- Responsive landing page focused on microfluidic and diagnostic product development
- Dedicated About and Technical Consultation pages
- Development-service architecture covering cartridges, lab-on-disc, prototyping, verification planning, suppliers, and commercialization support
- Dedicated Products, Services, and Kits catalog pages
- Classified product catalog with product-class and subclass dropdowns
- Broad quote-based catalog for tubing, fittings, chips, pumps, sensors, diagnostic consumables, lab plastics, OEM items, starter kits, and productized sourcing services
- Careers page for a microfluidic testing internship
- Non-interruptive first-quote promotion shown within the product workflow
- Sourcing basket and online quote checkout with delivery and purchasing details
- Request confirmation reference and email fallback
- Stripe-hosted invoices after quote approval
- Terms & Payments page for quote-based ordering
- MicroCD catalog numbers for all products
- Research-use-only and export-aware positioning
- Original AI-generated illustrations for individual catalog listings, with source credits

## Run

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy on AWS Amplify

Use the existing Git-connected Amplify app with this repository as its app root.
`amplify.yml` selects Node 22, runs `npm run verify`, then `npm run package:site`.
Only the validated `dist/` website package is published. The enquiry backend is deployed
separately; it is not part of the public static bundle. See
`docs/site-and-aws-update-2026-11-17.md` for the deployment and AWS follow-up details.

The marketing site uses `site.js` for shared navigation, responsive behavior, and consultation forms. Catalog pages also load `script.js`, which contains the product data and quote-cart behavior. The original framework source and package manifests for the historical product exports are not included in this repository.

## Scientific applications beta

- `/modeler/` is a dependency-free, local-first parametric 2D microfluidic workspace. It retains the compiled legacy 3D/GLB workspace as a separate preview.
- `/analyzer/` is the Kinetic Assay Analyzer guided workflow. CSV and image processing runs in the browser; raw files are not uploaded or stored by the site.
- `/motor-controller/` is the CLAIR Motor Controller engineering beta. It uses the browser Web Serial API to communicate directly with supported USB serial hardware; serial data remains in the browser unless the user downloads a log or report.
- The Modeler and Analyzer share `assets/scientific-ui.css` and `assets/scientific-ui.js`; the Motor Controller uses its own hardware-console stylesheet and module alongside the main site theme.
- Product architecture and known gaps are documented in `docs/architecture-and-gap-assessment.md`. Scientific formulas and assumptions are documented in `docs/methodology.md`.

Run checks with Node 22 or newer:

```bash
npm run verify
npm run package:site
```

## Payment setup

Components Sourcing and Kits submit a quote request through the existing enquiry endpoint. They show a reference after the endpoint accepts the request. Larger requests can use the email fallback.

1. Find the request by its MCD reference in the enquiries inbox. Review the requested configuration, destination and supplier options.
2. Send a written quote with item quantities, prices, shipping, taxes where applicable, lead time and terms.
3. Once the buyer approves the quote, create a Stripe-hosted invoice in the business Stripe Dashboard. Include the MCD reference and the agreed charges. Finalize the invoice to obtain its hosted payment URL. Send the customer the Stripe invoice or use the website handoff below.
4. Verify the invoice is paid in Stripe before starting fulfillment. Confirm the order and send shipment or project updates to the customer.

The site does not collect card details or automatically create invoices, confirm payments, or publish order tracking.

## Notes

Before using this commercially, confirm the catalog against real supplier-approved items, prices, warranties, country-of-origin data, and compliance classifications.

**Website payment handoff.** From a repository checkout, run `node tools/quote-payment-link.mjs`, paste the hosted URL into its standard input, and press Enter then Ctrl+D. The command prints a customer-specific MicroCD Labs URL to use as the **Pay with Stripe** button target in your quote email. Include the direct Stripe URL as a fallback. Treat both URLs as private customer links.

The command accepts sandbox invoices by default. Use `node tools/quote-payment-link.mjs --live` for a live invoice after confirming the payment page with the business Stripe account. The landing page labels sandbox invoices and takes customers directly to Stripe to see the invoice and pay. Stripe remains the source of payment status.

Catalog illustrations depict representative items. Actual configurations and supplier documentation are confirmed during quote review.

Do not copy third-party product photos or claim supplier affiliation, endorsement, distribution rights, or live inventory unless MicroCD Labs has written permission and a supplier-approved data feed or agreement.

## Core-page review (November 5, 2026)

- No production deployment is included in these review changes.
- Source dates and content boundaries are recorded in docs/development-evidence.json.
- Shared primary navigation is generated by node tools/update-site-navigation.mjs.
- The form requires only purpose, name, email, and question. It prepares a draft; visitors send it themselves.
- Mobile chat uses the existing Zendesk integration from an in-flow footer button.

## Website maintenance (November 2026)

Capability facts: assets/tool-definitions.js. Synchronize directory/docs with node tools/sync-tool-content.mjs. Shared marketing chrome: node tools/sync-marketing.mjs. Run node --test tests/*.test.mjs, node tests/build-check.mjs, node tests/static-quality.mjs, and node tools/validate-site.mjs. Review-only upgrades are not deployed automatically from the review branch.

Browser regressions: serve this checkout, set TEST_BASE_URL to the local URL, TEST_ARTIFACT_DIR to an output folder, and PLAYWRIGHT_MODULE to the available Playwright installation if it is not on Node resolution paths. Then run node tests/browser-regressions.cjs. It does not connect hardware or send motor commands. Browser-library installation is a development prerequisite, not a production dependency.
