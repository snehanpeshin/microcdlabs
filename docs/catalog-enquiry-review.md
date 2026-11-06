# Catalog enquiry correction — 2026-11-06

Essential changes only, retaining the current stack and brand.

- Generic listings: Research components & custom sourcing; no stock, manufacturer, fixed variant or confirmed quotation implied.
- PDMS: Custom Sourcing & Fabrication Enquiry, MCD-MF-001 as an internal enquiry reference, Specification review required, Pricing after specification review.
- Add to quote → Add to enquiry; quotation basket/cart → Your enquiry list; invoice shortcut removed.
- Category-specific requirements, quantity or To be determined, required final contact details, optional technical fields.
- One shared request builder and generated detail template. Requirements persist for this browser session; contact names/emails are not persisted.
- Email draft contains only the subject. Copy and paste the reviewed enquiry details, then send manually. No upload, delivery endpoint, invoice or payment was added.
- Unverified first-quote promotion and recommendation-package prices removed. No documented current item price basis was found.
- CLAIR and commercial engineering services remain separate.

Affected: products.html, all 57 catalog routes, five category routes, kits.html, recommendations.html, shared navigation/footer, consultation draft safety, and the pricing description in Terms. Existing URLs and references remain.

Checks: 30 Node tests passed; build and 90-page validator passed (one pre-existing unrelated wellness-instructions warning). 100 layout combinations and functional tool/enquiry checks ran; two tablet category overflows were corrected and retested at 390/768/1440. No enquiry/email/device command/invoice/payment was sent. Existing Modeler and Analyzer flows passed.

Owner facts still needed: accepted scope for broad lab-plastics/OEM categories; any defined product specifications, supplier relationships, manufacturing responsibility, availability or documented indicative price basis. Unconfirmed roles remain unconfirmed. No new claims of certification, compatibility, sterility or material grade are made. Existing legal entity wording is unchanged by this catalog task.

PDMS reference implementation is generated from script.js with the shared policy in assets/quote-state.js. The published title, description, scope, status, supply fields, representative-image label and requirement form use the same template as the no-JavaScript fallback.

Fictional generated sample follows; not sent:

```text
MicroCD Labs enquiry — requirements for review

Requested offering: PDMS Microfluidic Chips — Custom Sourcing & Fabrication Enquiry
Internal enquiry reference: MCD-MF-001
Enquiry type: Component sourcing enquiry
Commercial role: Unconfirmed
Requested configuration: Configuration to be defined
Quantity: 12
Application / design description: Fictional dye mixing study
Design starting point: Existing design
Sample / fluid description: Water and dye
Channel width / depth and overall dimensions, if known: 50 µm channel width; depth to be advised
Assembly required: Bonded assembly
Substrate / bonding requirements: To be confirmed
Ports / tubing requirements: To be confirmed
Flow rate / pressure, if known: To be confirmed
Coatings / treatment / sterility needs, if any: To be confirmed
Destination country / postcode: USA 10001
Desired receipt / completion date: 2027-02-01
Documentation / institutional purchasing needs: Institutional purchase order
Pricing after specification review
Supply source: To be confirmed in the proposal
Availability and lead time: Confirmed after specification and supplier review

Name: Alex Example
Organization: Fictional Research Group
Work email: alex@example.org
Additional enquiry notes: None provided

This is an enquiry, not an order or confirmed quotation. Pricing, source, availability, lead time and fabrication responsibility remain to be confirmed in a written proposal. Any paid feasibility, sourcing or engineering scope requires separate agreement.
```
