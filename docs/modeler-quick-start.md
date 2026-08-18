# Microfluidic Modeler beta — Quick start

1. Choose a component in the left toolbar, then click the 2D canvas to place it.
2. Select a feature on the canvas or in the project tree. Shift-click selects multiple features.
3. Edit position and dimensions in the Inspector. Values are millimetres; rotation is degrees.
4. Select one component to see its nearest connection anchors and measured gap. Green means connected at `≤ 0.25 mm`; amber means near but not connected at `0.25–3 mm`; red means the nearest anchor is farther than `3 mm`.
5. When a component is near another, choose **Auto-connect** in the canvas toolbar or **Fix now** on the validation issue to close the anchor gap exactly. **Focus** selects the affected components without changing geometry.
6. For flow estimates, select a rectangular channel and choose either flow-rate or inlet-pressure control. Enter the inlet conditions plus density and dynamic viscosity. Optional diffusivity and surface tension enable Péclet and capillary numbers.
7. The project autosaves in the current browser. Use **Save** for an explicit versioned JSON download and **Open** to restore it.
8. Export SVG for supported 2D geometry, PNG for a snapshot, CSV for a feature list, or use the preserved 3D workspace for GLB.

Keyboard: Escape cancels the active placement tool, Delete removes selected features, and Command/Ctrl+Z undoes. Layer visibility and locking are available in the project tree.

The fabrication profiles and design rules are editable starting assumptions, not validated manufacturing limits. The engineering panel reports reduced-order estimates, not CFD.
