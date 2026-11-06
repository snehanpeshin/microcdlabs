# Kinetic Assay Analyzer beta — Quick start

1. Import one tidy CSV or an ordered PNG/JPEG/TIFF sequence. CSV requires `time` and `signal`; optional columns are `background`, `control`, `sample`, and `replicate`.
2. Confirm the preview. The app checks file limits, types, timestamp order, and numeric values before analysis.
3. For images, add test, background, and control ROIs as needed. Drag regions on the image and refine their bounds in the synchronized fields.
4. Configure the ordered preprocessing pipeline. Raw input is retained separately and remains downloadable.
5. Select the initial-slope window, AUC integration method, and threshold, then run analysis.
6. Review quality flags and method identifiers before continuing.
7. Export raw and processed tidy CSV, results CSV, the analysis manifest, the plot SVG, and a printable report.

All analysis runs locally in the browser. Files are not uploaded. A threshold result appears only when the decision rule is explicitly enabled; it uses “Above configured threshold,” “Below configured threshold,” or “QC failure,” never a default diagnosis.

## CSV versus images

CSV uses time and signal columns, with optional background, control, sample and replicate. Image sequences require consistent dimensions and reviewed test/background/control ROIs; timestamps use numeric filenames or otherwise frame order. TIFF depends on browser decoding. Download analyzer/demo-series.csv to reproduce the built-in demo.

## Demo and reports

The exact built-in fixture with background subtraction, no normalization/baseline correction/smoothing, first-three-point OLS slope, and trapezoidal integration produces endpoint 199 a.u., initial slope 11.5 a.u./min, and AUC 1272.5 a.u.·min. These are illustrative data, not performance validation. Changing input or method settings invalidates prior results. The current stage and prerequisites are explicit. Reports are printed locally using browser Print / Save as PDF; no backend PDF service is present.
