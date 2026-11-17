# Site and deployment improvements — 17 November 2026

## Website

Three substantive service pages separate the questions a prospective client may bring:

- `/microfluidic-consulting.html`: requirements, fluidic architectures, sequencing and prototype evidence.
- `/diagnostic-cartridge-design.html`: disposable workflow, assay/reader interfaces and evidence planning.
- `/engineering-prototyping.html`: CAD, fixtures, interfaces and a defined build-and-test decision.

Each page includes example deliverables, starting inputs, project questions, links to existing
development work, visible scope questions, Service/Breadcrumb structured data and an enquiry
action that selects the relevant purpose. They are linked from the home, services and tools
pages, the sitemap and llms.txt. No client results, biographies, prices or certifications were
invented. The new pages use the existing branding and do not load publisher ads.

`node tools/build-service-pages.mjs` regenerates these pages from the maintained services
header/footer. The content command includes this step. Content synchronizers skip `dist/`.

## GitHub and Amplify build

`npm run verify` runs unit/regression tests, syntax checks, static quality, static build checks
and site validation. `npm run package:site` creates and validates a fresh `dist/` directory.

The package contains public HTML, scripts, styles, assets, research applications, downloadable
PDFs, robots/sitemap files and the public tool help files. It excludes the backend, tests,
source-generation scripts, package manifests, internal reports, email signatures and Git data.
The packaging check fails if a deployed HTML file references a missing bundled resource.
Three regression tests cover public/private file separation, missing assets and symbolic links.

The existing Amplify app now installs Node 22, runs the verification gate and packages the
website before publishing `dist/`. No new app or cloud resource is required. `customHttp.yml`
continues to live at the repository root, where Amplify reads it. Core HTML is configured for
browser revalidation with a five-minute edge cache, and the public enquiry configuration is marked no-cache to avoid a stale endpoint
or conversion setting after deployment. Existing security headers remain in place.

The GitHub `Website checks` workflow runs on pushes to main and pull requests, with read-only
repository permissions and Node 22. Actions are pinned to the verified v4 commit revisions.
The main branch was unprotected when checked. After the workflow has run successfully,
require its `site-checks` job through the repository's branch rules if desired; the workflow
alone does not stop a direct push. Amplify's own verification gate still prevents a failing
build from replacing the live website.

## AWS account follow-up

The following checklist was prepared before live-account verification. The verified outcomes
below distinguish completed changes from remaining work:

1. In the existing Amplify app's Rewrites and redirects, locate the existing apex-to-www
   redirect. Change only its status from 302 to 301, retaining its source, destination,
   path handling and the other application/tool rules. Test both the homepage and a nested
   page with query parameters. Do not replace the complete redirect list with a guessed rule.
2. Review Google Workspace and SES sender settings. Publish the SPF and DKIM records actually
   required by the configured senders and MAIL FROM domains; do not guess SES DKIM tokens or
   add a second SPF record. The last DNS check found no apex SPF and no DKIM at common selectors;
   custom selectors must be verified in the sender consoles. Tighten DMARC only after alignment
   and delivery are verified.
3. Inspect current Lambda/API Gateway errors and throttles, and SES delivery/bounce/complaint
   metrics. Add appropriate CloudWatch alarms and an owner-selected notification destination.
   Review existing alarms and costs before creating duplicate resources. Do not log enquiry
   bodies, email addresses or proprietary technical information.
4. Confirm whether SES remains in its sandbox and request production access when real sending
   needs it. The existing verified sender-to-recipient enquiry path already worked in testing.
5. Keep the existing frontend and separately deployed enquiry backend rollback paths. A failed
   analytics request must never change a successful enquiry receipt.

The frontend source commit itself did not change account resources. Subsequent authorized AWS
changes and checks are recorded below. Google Ads remains at USD 10/day; no additional
advertising channel is launched.

## Follow-up growth work

Connect Search Console and GA4 to measure actual queries, landing sessions and enquiry
completion. Confirm the repaired lead event in a connected live test. Add real engineering
examples and client-approved evidence as it becomes available. Keep evaluation focused on
qualified enquiries, quotes and won work rather than laboratory SEO scores alone.

## Validation

The completion report records test, workflow and deployment outcomes. A source commit, a
successful GitHub job and a live Amplify deployment are separate results and must be reported
separately. No successful Google Ads conversion is implied by packaging or source checks.

## Verified live outcomes — 17 November 2026

- Source commit `57cd82a844e30c880f014c3c60c363d5d8a122ff` passed GitHub Website checks
  (run 44110332900). Amplify main job 145 succeeded for that same commit.
- The three service pages return HTTP 200. Live HTML cache headers match the configured
  revalidation policy, and `assets/inquiry-config.js` returns `Cache-Control: no-cache`.
- The existing apex-to-www redirect was changed from 302 to 301 while retaining the separate
  404-200 application fallback rule. Live HTTP checks confirmed the homepage redirect and
  `/services.html?utm_source=redirect-check` preserve path and query.
- Added the missing apex TXT value `v=spf1 include:_spf.google.com ~all` for the existing
  Google Workspace mailbox. Preserved the existing Google verification TXT value, MX,
  DMARC, Resend DKIM selector, and the separate `send.microcdlabs.com` SES SPF/MX records.
  A public Google DNS query returned the new SPF value after submission. Route 53 change
  ID: `C037171923YP1DG4KHTE8`. Resolver caches may retain old answers until expiry.
- SES in us-east-1 remains in sandbox mode. The existing `info@microcdlabs.com` email identity
  is verified and sending-enabled. No domain identity, IAM expansion, production-access
  request, notification subscription, or new paid monitoring resource was created.
- Enquiry Lambda's last-seven-day CloudWatch totals: 6 invocations, 0 Errors, 0 Throttles.
  These are invocation-level metrics, not confirmed leads or delivered emails. The handler
  catches mail-provider errors and can return HTTP 503 without incrementing Lambda Errors.
  No relevant CloudWatch metric alarm appeared in the returned alarm list.
- GA4 and Search Console connectors remain NOT_AUTHENTICATED on both connected profiles.
  Google sign-in is required before traffic, search-query and funnel reporting can proceed.
- Successful live Google Ads conversion dispatch and mail delivery still require an end-to-end
  receipt test. No increase in leads, rankings, or conversions is claimed from these checks.

Google Workspace SPF reference: https://knowledge.workspace.google.com/admin/security/set-up-spf
