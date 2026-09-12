# CRP Camera — web update 2.1.0-beta.1

Open `/analyzer/crp/` from the Kinetic Assay Analyzer toolbar or import panel.

## Workflow

1. Choose final-image measurement or early-to-final change. Select the same color channel used for calibration.
2. Import a PNG/JPEG/WebP image or use a live browser camera. Two-image measurements require matching dimensions and manually verified alignment.
3. Place S inside the liquid and R over a reference window. The same normalized 8% boxes are used in both images. Keyboard users can use the numerical position fields.
4. Enter measured standards as concentration (mg/L),signal, including a zero blank and at least two nonzero standards. Confirm a matching matrix, reagent lot, phone, light, timing, channel and measurement mode.
5. Save to this browser or export a JSON containing the measurement, calibration, image provenance and normalized PNG images. Saved records retain the result at save time; current calibration edits never modify them.

## Optical method and limits

The channel mean in S and R produces an empirical index `-log10(S/R)`. Change mode subtracts the early index from the final index. JPEG/PNG pixels are processed and nonlinear; this is not physical absorbance. The supplied green default follows the native prototype; it does not reproduce a laboratory reader at 600 nm. Changing channel requires matched calibration.

Overlapping, transparent, dark or clipped regions fail. A region is rejected when at least 5% of pixels are at <=5 or >=250 in the selected channel. No automatic bubble identification, CRP specificity, prozone exclusion, saliva LOQ, or diagnostic classification is provided. Calibration is strictly increasing, piecewise linear, with no extrapolation.

Images are decoded with orientation handling and normalized to 600 pixels wide for analysis; normalized lossless PNGs are archived, not original full-resolution files. Import times are marked as import times, not original photograph timestamps. File uploads have unknown capture controls. Matching image dimensions does not establish correct physical alignment.

Browser capture requests the environment-facing camera. Optional manual control requests are limited to reported capabilities, and the UI reports only modes confirmed by the browser. This does not provide native iOS control parity or guarantee identical settings between sessions. Camera streams are stopped after capture, on close, when hidden and on page exit. Real iPhone/browser hardware testing remains outstanding.

## Storage

Records and normalized image blobs are saved together in one IndexedDB transaction, with unique IDs and `add` rather than overwriting existing records. Storage is device/browser/origin-specific and can be cleared by the browser. Downloads include PNG data URLs in JSON for portability. No server or cloud synchronization is configured.

## Assay references

- [Acuvet Turbovet canine CRP](https://www.acuvetbiotech.com/en/turbovet-canine-crp/)
- [Published Turbovet method](https://recursos.acvlab.es/wp-content/uploads/2021/09/2018-article-VCP2018-CRPc.pdf)
- [Gentian canine CRP](https://www.gentian.com/products/canine-crp-assay-blood-test)
- [Canine saliva CRP study](https://pubmed.ncbi.nlm.nih.gov/15825494/)

Neither serum assay is established for canine saliva on this platform. Bench demonstration with standards and matched unspiked/spiked saliva must precede use as a CRP reader.
