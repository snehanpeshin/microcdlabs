# MicroCD Labs Scientific Applications — Architecture & Gap Assessment

Date: 2026-08-17

## Repository architecture

- `microcdlabs/` is the authoritative deployable repository: a static site published by AWS Amplify with no build step.
- `modeler/` contains a compiled Vite/React-style WebGL geometry bundle plus hand-authored wrapper assets. Original framework source and package manifests are absent.
- `analyzer/` contains a static Next.js export. Original Next.js source and the FastAPI service described by the UI are absent.
- `MicrofluidicModelerApp/` is a UIKit `WKWebView` wrapper for the hosted modeler. It includes Google Mobile Ads and targets iOS 15.
- `KineticsHelperAppStore/` is a separate native SwiftUI calculator. It has no backend and is not the hosted Analyzer.

No `AGENTS.md`, JavaScript package manifest, Python manifest, backend source, API tests, or product source maps are present in the two hosted application trees.

## Routes and boundaries

- Marketing site: `/` and static catalog/content pages. This release leaves it unchanged.
- Modeler: `/modeler/`, with `/modeler/app/` used by the iOS wrapper.
- Analyzer: `/analyzer/`, with legacy exported routes at `/analyzer/new-experiment/`, `/dashboard/`, `/roi/`, `/calibration/`, and `/reports/`.

## Existing data and state

- The modeler bundle supports primitive sketching, selection, a part/feature tree, snap settings, view controls, save/load, and GLB export. Its compiled implementation is retained as a legacy 3D preview because editing the minified bundle would be unsafe.
- The analyzer export contains in-browser demo data, coordinate-form ROI controls, kinetic metrics, CSV export, and references to a missing FastAPI PDF/image-analysis backend.
- No database is present. Browser storage is the only suitable persistence mechanism in the deployable architecture.

## Gaps and risks

- Framework and backend source are missing, so backend hardening and component-level framework tests cannot be safely implemented here.
- Existing Analyzer copy implies server processing that is not deployable from this repository.
- Existing product pages load Google AdSense; the iOS modeler wrapper also contains Google Mobile Ads.
- The old Analyzer uses an undocumented composite enhancement score and makes default detection calls; both conflict with the requested scientific positioning.
- The modeler lacks a versioned public schema, migrations, auditable DRC output, and transparent reduced-order calculations.
- Deployment is static AWS Amplify. Any server-side image/PDF processing requires a separately versioned service and explicit origin configuration.
- The repository is stored in cloud-optimized local storage; some historical files and Git objects are currently data-less placeholders. New work must avoid depending on unavailable blobs.

## Implementation strategy

Create a dependency-free, local-first beta using maintainable HTML/CSS/ES modules:

1. Shared MicroCD design tokens and reusable browser components.
2. A new 2D parametric Modeler with versioned JSON, migration, autosave/recovery, history, SVG/PNG/CSV export, editable layers, advisory DRC, and reduced-order calculations. Retain the legacy 3D bundle as an explicitly labeled preview.
3. A five-stage Analyzer with local CSV/image-sequence import preview, visual rectangular ROI editing, deterministic preprocessing configuration, pure kinetic calculations, QC, manifest checksums, CSV/JSON/print reporting, and no network upload.
4. Redirect the old Analyzer routes into the new staged workspace.
5. Add dependency-free Node tests, methodology docs, quick starts, and a changelog.

## Expected files changed

- `assets/scientific-ui.css`, `assets/scientific-ui.js`
- `modeler/index.html`, `modeler/app/index.html`, `modeler/workspace.css`, `modeler/modeler.js`, `modeler/core.html`
- `analyzer/index.html`, `analyzer/analyzer.css`, `analyzer/analyzer.js`
- Analyzer legacy route `index.html` files
- `tests/*.test.mjs`, `package.json`
- `docs/modeler-quick-start.md`, `docs/analyzer-quick-start.md`, `docs/methodology.md`
- `README.md`, `CHANGELOG.md`, `customHttp.yml`
- iOS Modeler wrapper ad references and CocoaPods configuration

## Explicitly deferred

- FastAPI request hardening, ZIP extraction, TIFF decoding, PDF rendering, 4PL/5PL fitting, STL/STEP/DXF export, and end-to-end App Store packaging require source or infrastructure not present here. Controls for these capabilities will not be shown as enabled.
