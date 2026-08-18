# Microfluidic Modeler beta — Quick start

1. Choose a component in the left toolbar, then click the 2D canvas to place it.
2. Select a feature on the canvas or in the project tree. Shift-click selects multiple features.
3. Edit position and dimensions in the Inspector. Values are millimetres; rotation is degrees.
4. Review advisory issues in the Validation panel. Selecting an issue focuses the affected features.
5. For flow-dependent estimates, select a rectangular channel and enter flow rate, density, and dynamic viscosity.
6. The project autosaves in the current browser. Use **Save** for an explicit versioned JSON download and **Open** to restore it.
7. Export SVG for supported 2D geometry, PNG for a snapshot, CSV for a feature list, or use the preserved 3D workspace for GLB.

Keyboard: Escape cancels the active placement tool, Delete removes selected features, and Command/Ctrl+Z undoes. Layer visibility and locking are available in the project tree.

The fabrication profiles and design rules are editable starting assumptions, not validated manufacturing limits. The engineering panel reports reduced-order estimates, not CFD.
