# MicroCD Labs Microfluidics Supply Site

A static website for MicroCD Labs, a division of Karigari Home LLC, focused on microfluidics parts and equipment supply.

## What is included

- Responsive landing page with product-led hero
- Catalog for tubing, fittings, chip holders, pumps, sensors, plastic parts, and kits
- Catalog filters
- Quote list interaction
- Mailto quote request draft
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

## Notes

Before using this commercially, confirm the catalog against real supplier-approved items, prices, warranties, country-of-origin data, and compliance classifications.

The current catalog images are representative open-source images, not supplier product photos. Replace them with your own supplier-approved photos before launch, or keep the credit section if using Creative Commons/public-domain sources.
