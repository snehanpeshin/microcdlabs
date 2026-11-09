# Focused website improvements — November 8, 2026

Reviewed the current production source at d42dac5 and fetched the live homepage, contact and catalog routes directly. Search-index snapshots were stale; the deployed source was used as the baseline.

Implemented:
- Independent enquiry identities preserve multiple configurations of the same offering, including after reload and individual removal.
- Matching 1,000-character form and serialization limits preserve permitted technical requirements.
- Storage failure displays a visible warning and an in-page copyable draft before the visitor leaves.
- Contact instructions and buttons clearly separate copying the details from opening a subject-only email draft.
- Clipboard failure reveals and selects the complete preview for manual copying.
- Added a visible sourcing-purpose link on Contact and removed the stale quotation-basket wording.

Generic vendor-neutral listings, existing URLs, internal references, the current brand, saved tools and clinical development boundaries remain. No biographies, supplier claims, new backend services or dependencies were added. Version-1/2 enquiry lists migrate to version 3 without changing the storage key. Contact details are not persisted.

Verification: 31 unit/route tests and existing scientific-tool browser regressions passed. 100 broad layout checks and 25 focused checks passed, including focused regression coverage for duplicate configurations/long requirements, browser reload/removal/migration and storage/clipboard failures, keyboard menu focus, and 25 route/viewport checks at 360, 390, 768, 1024 and 1440 CSS pixels. No email or inquiry was sent.

Delivery still requires the visitor to paste the reviewed details into an email and send it. Server-side delivery configuration and approved evidence assets remain separate owner decisions.

Publishing approved by the owner on November 9, 2026. Deployment uses the existing Git-connected production branch.
