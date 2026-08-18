# Scientific methodology

## Modeler

- Hydraulic diameter for a rectangular channel: `Dh = 2wh / (w + h)`.
- Internal volume: `V = w h L`.
- Mean velocity: `v = Q / (wh)`; residence time: `t = V/Q`.
- Reynolds number: `Re = ρ v Dh / μ`.
- Hydraulic resistance uses the common low-aspect-ratio rectangular-channel approximation `R ≈ 12 μ L / [W H³ (1 − 0.63 H/W)]`, where `H ≤ W`; pressure drop is `ΔP = RQ`.
- Pressure-driven mode calculates `Q = ΔP/R` from inlet minus outlet pressure.
- Wall shear rate and stress use the parallel-plate estimates `γ̇ ≈ 6v/H` and `τ ≈ μγ̇`, where `H` is the smaller channel dimension.
- Optional transport estimates are `Pe = vDh/D` and `Ca = μv/γ`.

These are reduced-order, steady, single-phase, rigid-channel estimates. Entrance effects, compressibility, non-Newtonian behavior, surface effects, roughness, deformation and network junction losses are not modeled. Results are not CFD or validated simulation.

Connection checks compare explicit component anchors on the same layer. An anchor gap of `≤ 0.25 mm` is reported as connected, `0.25–3 mm` as near, and `> 3 mm` as separate. Auto-connect translates one selected component so the nearest pair of anchors coincide; it does not rotate components or validate network topology. Other design-rule checks compare feature bounding boxes and configured dimensions against editable advisory profiles.

## Analyzer

- Background subtraction: `test − background` at each time point.
- Control normalization: the current processed value divided by the matched control value.
- Baseline correction: subtraction of the first observation after earlier configured steps.
- Moving-average smoothing: centered arithmetic mean with truncated windows at series boundaries.
- Endpoint: last chronological processed observation.
- Initial slope: ordinary least squares on the configured first N points. R² is reported for the same window.
- Maximum slope: maximum adjacent-point finite difference.
- AUC: selected trapezoidal or left-rectangle numerical integration relative to processed zero.
- Time to threshold: first crossing using linear interpolation between adjacent points.
- SNR: endpoint net signal divided by sample standard deviation of provided background observations.
- Replicate statistics: arithmetic mean, sample standard deviation (`n − 1`), and absolute `100 × SD/mean` CV.

LoB/LoD/LoQ are intentionally not reported when method selection and required blank/low-concentration replicate evidence are absent. 4PL/5PL fits are deferred until a maintained numerical implementation with convergence and confidence reporting is available.
