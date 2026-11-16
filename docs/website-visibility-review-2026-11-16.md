# MicroCD Labs website, visibility and advertising review

Reviewed 16 November 2026. Objective: qualified engineering enquiries and eventual sales.
Google Ads account 6777098315; campaign 24378975084. Budget remains USD 10/day.

## Evidence and limits

- Supermetrics 30-day campaign health snapshot: 96 impressions, 5 clicks, USD 14.33 spend,
  zero reported conversions. Search ad approved; Maximize Conversions is learning. This
  sample is too small to choose winners or justify a budget increase.
- Mobile PageSpeed laboratory baseline: home performance 71, LCP 4.0 s, CLS 0;
  services performance 47, LCP 4.9 s, CLS 0.638; enquiry page performance 45,
  LCP 4.9 s, CLS 0.938. Accessibility, best practices and technical SEO scored 100
  on all three. No field-user data was returned. Technical SEO scores are not rankings.
- Search retrieval surfaced the services, tools, products, news and catalog pages.
  Some retrieved snippets reflect older content. This establishes discoverability for
  those examples, not comprehensive Google index coverage or keyword rankings.
- Google Search Console, GA4 and Meta Ads are not authenticated on either available
  Supermetrics connection. Organic clicks, rankings, sessions, engagement, and paid-social
  performance therefore remain unmeasured in this review.
- Tagged services and enquiry URLs return HTTP 200. Tested Google click-id and UTM
  query parameters survive the landing request. Internal journey attribution was not
  established by that redirect test. The apex host redirects to www using HTTP 302.
- The live website lead destination was repaired in b4d1b4e. The success handler requires
  confirmed backend acceptance and a receipt before tracking; it sends the receipt as
  transaction_id, without form contact details. A post-fix live hit is not yet confirmed.

## Changes in this pass

1. Remove the AdSense ad loader from home, services, enquiry and about pages. These are
   the principal commercial lead journey. Keep publisher verification metadata on the
   home page; other publisher pages and the Google Ads measurement tags are unchanged.
   The marketing synchronizer preserves this exclusion.
2. Replace the services hero's generic slogan with a clear microfluidic design and
   diagnostic-engineering heading aligned with the search ad. Describe consulting,
   cartridge design, CAD and prototype planning in the introduction. Add a final project
   enquiry action and anchor the primary action at the enquiry form.
3. Declare accurate social-preview image dimensions and the site name on the four core
   pages. Update enquiry metadata to describe the live online submission flow.
4. Add Organization/Service structured data for the services already described on the
   page, without invented prices, ratings, locations, certifications or outcomes.
5. Link the privacy-policy reference in the online enquiry notice, and update the lead
   activation notes to reuse the existing verified conversion rather than create another.

## Next priorities

- Connect Search Console and GA4, selecting the MicroCD Labs site/property. Verify the
  existing measurement setup before adding any new analytics destination. Measure
  landing sessions → form interaction → successful enquiry → qualified enquiry → quote
  → won work, keeping contact content out of analytics events.
- Confirm one real website conversion after deployment. Keep the Google-hosted lead
  form as a separate action. Do not inflate purchases or count CTA clicks as enquiries.
- Build a small register of real leads and outcomes. Evaluate qualified-lead cost and
  quotes/won work rather than click volume alone. No CRM or new paid tool is required.
- Use the services page for engineering ads; retain the home page's CLAIR research
  purpose. Send research collaborators to the relevant human/veterinary research page.
- Add campaign sitelinks to actual engineering evidence, services and the enquiry page;
  review actual search terms before adding negatives. Do not expand broad keywords or
  launch Meta/LinkedIn campaigns with the current limited budget and evidence.
- Once measurement works, create substantive pages around microfluidic consulting,
  diagnostic cartridge design and mechanical prototyping using actual work and
  deliverables. Avoid near-duplicate keyword pages or invented case studies.
- Review the legacy AW-18239515056 destination (shown as NoveSprout Learning in Tag
  Assistant) before consolidating tags. Do not assume it can be removed globally.
- Change the apex-to-www redirect to permanent in the existing hosting configuration
  when that configuration is available. No hosting access settings were changed here.

## Validation

39 existing unit/regression tests, JavaScript syntax checks, static-quality checks,
static build checks and the 90-page site validator passed. One pre-existing validator
warning remains on karigari-wellness-lens-instructions.html (no shared behavior script).
Post-deployment mobile and performance checks are recorded in the completion report;
the baseline above is not a claim about the result of these changes.
