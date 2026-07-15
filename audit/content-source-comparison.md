# Legacy-content comparison for the structured site

Prepared 2026-07-15 against pre-restructure commit `3ee00d1`.

## Rule used

The structured site may change navigation, grouping, page order, card layout, and links. Public-facing claims, descriptions, contact details, maturity statements, and service language must be traceable to text already present in the pre-restructure repository.

## Findings from the first structured pass

- The first structured pass introduced 60 unmatched phrases on Home, 35 on Services, 25 on Applications, 23 on Tools, and 17 on Contact.
- Most additions were new marketing summaries derived from the restructuring brief rather than copied from the existing site.
- The repository consistently uses `info@microcdlabs.com`. No `developmentinfo@microcdlabs.com` or `development@microcdlabs.com` address exists in the old or corrected source.
- The apparent `developmentinfo@microcdlabs.com` string was caused by adjacent announcement text and the email displaying without a textual separator.

## Corrections

| Structured area | Legacy source used |
|---|---|
| Home hero | Original Home hero |
| Problem cards | Original Home “Start here” cards |
| Core services | Original Home capability matrix |
| Engagement process | Original Home engagement steps |
| Applications summary | Original Home, Diagnostics, Automation, and Services text |
| Founder credibility | Original Home founder preview |
| Tools summary | Original Platform, News, Diagnostics, and Automation text |
| Sourcing summary | Original Recommendations page |
| Final CTA | Original Home contact section |
| Services details | Original seven service descriptions grouped under four visual areas |
| Contact | Original Contact page and original form restored verbatim |
| Shared footer | Original Home footer statements |

## Structural changes retained

- Primary navigation remains Services, Applications, Tools, About, and Contact.
- Applications and Tools remain consolidated landing pages.
- Services remain organized into four primary visual groups, with the original lab-on-disc, supplier, and commercialization content nested in the relevant group.
- Catalog, recommendations, kits, company pages, policies, tools, routes, forms, and email actions remain available.

## Automated comparison result

Visible text segments of 18 or more characters on Home, Services, Applications, Tools, and Contact were normalized and checked against the complete legacy HTML/text corpus. After correction, zero unmatched public-facing phrases remained.

All MicroCD Labs email references were separately checked; the only address is `info@microcdlabs.com` (including mailto links with subjects).
