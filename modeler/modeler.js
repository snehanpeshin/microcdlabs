import { APP_VERSION, bindDialog, downloadBlob, downloadText, safeFilename, setupTabs, toast } from "../assets/scientific-ui.js";

export const PROJECT_SCHEMA = "microcd.modeler.project";
export const PROJECT_VERSION = 2;
const STORAGE_KEY = "microcd-modeler-autosave-v2";
const SCALE = 6;

export const COMPONENTS = {
  "straight-channel": { name: "Straight channel", length: 30, width: 1, depth: .2 },
  "curved-channel": { name: "Curved channel", length: 30, width: 1, depth: .2, radius: 8 },
  serpentine: { name: "Serpentine", length: 60, width: 1, depth: .2, turns: 4 },
  "t-junction": { name: "T-junction", length: 20, width: 1, depth: .2 },
  "y-junction": { name: "Y-junction", length: 20, width: 1, depth: .2, angle: 45 },
  inlet: { name: "Inlet", diameter: 3, depth: 1 },
  outlet: { name: "Outlet", diameter: 3, depth: 1 },
  "circular-chamber": { name: "Circular chamber", diameter: 12, depth: 1 },
  "rectangular-chamber": { name: "Rectangular chamber", length: 18, width: 10, depth: 1 },
  "detection-chamber": { name: "Detection chamber", length: 16, width: 8, depth: .5 },
  mixer: { name: "Mixer placeholder", length: 20, width: 8, depth: .5 },
  "filter-pocket": { name: "Filter / membrane pocket", length: 18, width: 12, depth: 1 },
  "lateral-flow-pocket": { name: "Lateral-flow strip pocket", length: 45, width: 8, depth: 1 },
  "radial-channel": { name: "Lab-on-disc radial channel", length: 30, width: 1.2, depth: .3, angle: 0 },
  cuvette: { name: "Lab-on-disc cuvette", length: 12, width: 8, depth: 2 }
};

export const DEFAULT_PROFILE = {
  name: "PDMS starting defaults", minWidth: .15, minWall: .15, minSpacing: .2, edgeClearance: 1,
  portClearance: 2, minRadius: .2, maxAspectRatio: 10
};
export const PROFILES = {
  pdms: { name: "PDMS starting defaults", minWidth: .15, minWall: .15, minSpacing: .2, edgeClearance: 1, portClearance: 2, minRadius: .2, maxAspectRatio: 10 },
  cnc: { name: "CNC starting defaults", minWidth: .5, minWall: .6, minSpacing: .6, edgeClearance: 2, portClearance: 3, minRadius: .5, maxAspectRatio: 6 },
  laser: { name: "Laser cutting starting defaults", minWidth: .25, minWall: .4, minSpacing: .4, edgeClearance: 1.5, portClearance: 2.5, minRadius: .25, maxAspectRatio: 8 },
  printing: { name: "3D printing starting defaults", minWidth: .6, minWall: .8, minSpacing: .8, edgeClearance: 2, portClearance: 3, minRadius: .6, maxAspectRatio: 6 }
};

export function createProject(name = "Untitled microfluidic project") {
  return {
    schema: PROJECT_SCHEMA, version: PROJECT_VERSION, appVersion: APP_VERSION, id: uid("project"), name,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), units: "mm",
    canvas: { width: 200, height: 120, grid: .5, snap: true },
    layers: [{ id: uid("layer"), name: "Flow layer", visible: true, locked: false }],
    features: [], profile: { ...DEFAULT_PROFILE }, engineering: { flowRateUlMin: "", densityKgM3: "", viscosityPaS: "" }
  };
}

export function migrateProject(input) {
  if (!input || typeof input !== "object") throw new Error("Project must be a JSON object.");
  if (input.schema === PROJECT_SCHEMA && input.version === 2) return normalizeProject(input);
  if (!input.version || input.version === 1) {
    const migrated = createProject(input.name || "Migrated project");
    migrated.id = input.id || migrated.id;
    migrated.features = (input.features || input.components || []).map((feature, index) => normalizeFeature({
      ...feature, id: feature.id || uid("feature"), name: feature.name || `Feature ${index + 1}`,
      type: feature.type || "straight-channel", layerId: feature.layerId || migrated.layers[0].id,
      position: feature.position || { x: feature.x || 20, y: feature.y || 20 }, parameters: feature.parameters || feature.dimensions || {}
    }, migrated.layers[0].id));
    return migrated;
  }
  throw new Error(`Unsupported project schema version: ${input.version}.`);
}

export function normalizeProject(input) {
  if (input.schema !== PROJECT_SCHEMA) throw new Error("Unrecognized project schema.");
  const project = createProject(input.name);
  Object.assign(project, input, { version: PROJECT_VERSION });
  project.layers = Array.isArray(input.layers) && input.layers.length ? input.layers.map((layer) => ({ id: String(layer.id), name: String(layer.name || "Layer"), visible: layer.visible !== false, locked: Boolean(layer.locked) })) : project.layers;
  project.features = (input.features || []).map((feature) => normalizeFeature(feature, project.layers[0].id));
  project.canvas = { ...project.canvas, ...(input.canvas || {}) };
  project.profile = { ...DEFAULT_PROFILE, ...(input.profile || {}) };
  project.engineering = { ...project.engineering, ...(input.engineering || {}) };
  return project;
}

export function makeFeature(type, position, layerId) {
  const definition = COMPONENTS[type];
  if (!definition) throw new Error(`Unknown component type: ${type}`);
  const { name, ...parameters } = definition;
  return { id: uid("feature"), name, type, position: { x: position.x, y: position.y }, rotation: 0, layerId, parameters };
}

function normalizeFeature(feature, layerId) {
  const definition = COMPONENTS[feature.type] || COMPONENTS["straight-channel"];
  const { name, ...defaults } = definition;
  return {
    id: String(feature.id || uid("feature")), name: String(feature.name || name), type: COMPONENTS[feature.type] ? feature.type : "straight-channel",
    position: { x: finite(feature.position?.x, 20), y: finite(feature.position?.y, 20) }, rotation: finite(feature.rotation, 0),
    layerId: String(feature.layerId || layerId), parameters: { ...defaults, ...(feature.parameters || {}) }
  };
}

export function featureBounds(feature) {
  const p = feature.parameters;
  if (["inlet", "outlet", "circular-chamber"].includes(feature.type)) {
    const d = finite(p.diameter, 0); return { x: feature.position.x - d / 2, y: feature.position.y - d / 2, width: d, height: d };
  }
  const length = finite(p.length, 10); const width = feature.type.includes("channel") || feature.type.includes("junction") || feature.type === "serpentine" ? Math.max(finite(p.width, 1), 3) : finite(p.width, 8);
  return { x: feature.position.x - length / 2, y: feature.position.y - width / 2, width: length, height: width };
}

export function validateProject(project) {
  const issues = [];
  const profile = project.profile;
  const add = (severity, ruleId, explanation, featureIds, actual, required, action) => issues.push({ severity, ruleId, explanation, featureIds, actual, required, action });
  const ports = project.features.filter((feature) => ["inlet", "outlet"].includes(feature.type));
  if (!project.features.some((feature) => feature.type === "inlet")) add("error", "FLOW_MISSING_INLET", "No inlet is present.", [], 0, 1, "Add at least one inlet.");
  if (!project.features.some((feature) => feature.type === "outlet")) add("error", "FLOW_MISSING_OUTLET", "No outlet is present.", [], 0, 1, "Add at least one outlet.");
  project.features.forEach((feature) => {
    const p = feature.parameters;
    const dimensional = Object.entries(p).filter(([key]) => ["length", "width", "depth", "diameter", "radius"].includes(key));
    dimensional.forEach(([key, value]) => { if (!Number.isFinite(Number(value)) || Number(value) <= 0) add("error", "DIM_INVALID", `${feature.name} has an invalid ${key}.`, [feature.id], value, "> 0", `Enter a positive ${key}.`); });
    const width = Number(p.width || p.diameter);
    if (Number.isFinite(width) && width < profile.minWidth) add("warning", "MIN_FEATURE_WIDTH", `${feature.name} is narrower than the configured advisory minimum.`, [feature.id], `${width} mm`, `${profile.minWidth} mm`, "Increase width or review the fabrication profile.");
    if (p.radius && Number(p.radius) < profile.minRadius) add("warning", "MIN_INTERNAL_RADIUS", `${feature.name} has a small internal radius.`, [feature.id], `${p.radius} mm`, `${profile.minRadius} mm`, "Increase radius or document the process capability.");
    if (p.width && p.depth && Number(p.depth) > 0 && Number(p.width) / Number(p.depth) > profile.maxAspectRatio) add("warning", "ASPECT_RATIO", `${feature.name} exceeds the configured aspect-ratio advisory.`, [feature.id], (Number(p.width) / Number(p.depth)).toFixed(2), profile.maxAspectRatio, "Adjust width/depth or review process assumptions.");
    const b = featureBounds(feature);
    const edge = Math.min(b.x, b.y, project.canvas.width - b.x - b.width, project.canvas.height - b.y - b.height);
    if (edge < profile.edgeClearance) add("warning", "EDGE_CLEARANCE", `${feature.name} is close to the design boundary.`, [feature.id], `${edge.toFixed(2)} mm`, `${profile.edgeClearance} mm`, "Move the feature inward or revise the configured clearance.");
  });
  for (let i = 0; i < project.features.length; i += 1) for (let j = i + 1; j < project.features.length; j += 1) {
    const a = project.features[i], b = project.features[j], ab = featureBounds(a), bb = featureBounds(b);
    const overlapX = Math.min(ab.x + ab.width, bb.x + bb.width) - Math.max(ab.x, bb.x);
    const overlapY = Math.min(ab.y + ab.height, bb.y + bb.height) - Math.max(ab.y, bb.y);
    if (overlapX > .05 && overlapY > .05) add("warning", "FEATURE_OVERLAP", `${a.name} overlaps ${b.name}.`, [a.id, b.id], `${Math.min(overlapX, overlapY).toFixed(2)} mm`, "0 mm", "Separate features or confirm the overlap is an intentional connection.");
    else {
      const gapX=Math.max(0,Math.max(ab.x,bb.x)-Math.min(ab.x+ab.width,bb.x+bb.width));const gapY=Math.max(0,Math.max(ab.y,bb.y)-Math.min(ab.y+ab.height,bb.y+bb.height));const gap=Math.hypot(gapX,gapY);
      if(gap>0&&gap<profile.minSpacing)add("warning","MIN_FEATURE_SPACING",`${a.name} and ${b.name} are closer than the configured feature spacing.`,[a.id,b.id],`${gap.toFixed(2)} mm`,`${profile.minSpacing} mm`,"Increase spacing or review the process profile.");
      if(gap>0&&gap<profile.minWall)add("warning","MIN_WALL_THICKNESS",`The apparent wall between ${a.name} and ${b.name} is below the configured advisory.`,[a.id,b.id],`${gap.toFixed(2)} mm`,`${profile.minWall} mm`,"Increase the separation or document the intended shared wall.");
      if(["inlet","outlet"].includes(a.type)&&["inlet","outlet"].includes(b.type)&&gap<profile.portClearance)add("warning","PORT_CLEARANCE",`${a.name} and ${b.name} are close together.`,[a.id,b.id],`${gap.toFixed(2)} mm`,`${profile.portClearance} mm`,"Increase port spacing or review connector geometry.");
    }
  }
  if (ports.length === 1) add("warning", "PORT_CLEARANCE", "Only one port is defined; a complete flow path normally needs an inlet and outlet.", [ports[0].id], 1, 2, "Add the missing port.");
  project.features.filter((feature)=>feature.type.includes("channel")||feature.type.includes("junction")||feature.type==="serpentine").forEach((feature)=>{
    const bounds=featureBounds(feature);const connected=project.features.some((other)=>{if(other.id===feature.id)return false;const b=featureBounds(other);return !(bounds.x+bounds.width<b.x||b.x+b.width<bounds.x||bounds.y+bounds.height<b.y||b.y+b.height<bounds.y);});
    if(!connected)add("warning","DISCONNECTED_FLOW_PATH",`${feature.name} is not connected to another feature by the current 2D bounding-box check.`,[feature.id],"Disconnected","Connected","Move it into contact with a port, chamber, or channel.");
  });
  return issues;
}

export function engineeringEstimates(feature, inputs = {}) {
  if (!feature) return [];
  const p = feature.parameters; const w = Number(p.width); const h = Number(p.depth); const length = Number(p.length);
  if (![w, h, length].every((value) => Number.isFinite(value) && value > 0)) return [{ key: "status", label: "Not calculated", value: "Missing positive width, depth, or length", unit: "", method: "Input completeness check", warning: true }];
  const wm = w / 1000, hm = h / 1000, lm = length / 1000;
  const dh = 2 * wm * hm / (wm + hm); const volume = wm * hm * lm;
  const results = [
    { key: "hydraulicDiameter", label: "Hydraulic diameter", value: dh * 1000, unit: "mm", method: "Dh = 2wh/(w+h)" },
    { key: "volume", label: "Internal volume", value: volume * 1e9, unit: "µL", method: "Rectangular prism, V = w·h·L" }
  ];
  const q = Number(inputs.flowRateUlMin) * 1e-9 / 60, rho = Number(inputs.densityKgM3), mu = Number(inputs.viscosityPaS);
  if (!(q > 0)) return results.concat({ key: "flow", label: "Not calculated", value: "Flow rate required", unit: "", method: "Flow-dependent estimates", warning: true });
  const area = wm * hm, velocity = q / area;
  results.push({ key: "residence", label: "Residence time", value: volume / q, unit: "s", method: "t = V/Q" });
  if (!(rho > 0) || !(mu > 0)) return results.concat({ key: "fluid", label: "Not calculated", value: "Density and viscosity required", unit: "", method: "Reynolds / pressure estimates", warning: true });
  const alpha = Math.min(hm, wm) / Math.max(hm, wm);
  const correction = Math.max(1 - .63 * alpha, .1);
  const resistance = 12 * mu * lm / (Math.max(wm, hm) * Math.pow(Math.min(wm, hm), 3) * correction);
  results.push(
    { key: "reynolds", label: "Reynolds number", value: rho * velocity * dh / mu, unit: "", method: "Re = ρvDh/µ", warning: alpha > 1 },
    { key: "resistance", label: "Hydraulic resistance", value: resistance, unit: "Pa·s/m³", method: "Rectangular-channel approximation" },
    { key: "pressure", label: "Pressure drop", value: resistance * q / 1000, unit: "kPa", method: "ΔP = RQ", warning: true }
  );
  return results;
}

function uid(prefix) { return `${prefix}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`; }
function finite(value, fallback) { const number = Number(value); return Number.isFinite(number) ? number : fallback; }

if (typeof document !== "undefined") init();

function init() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("/modeler/sw.js").catch(() => {});
  setupTabs();
  let project = recoverProject(); let selected = new Set(); let activeType = null; let history = []; let future = []; let dragging = null;
  const canvas = document.querySelector("#design-canvas"); const geometry = document.querySelector("#geometry-layer");
  const projectTree = document.querySelector("#project-tree"); const inspector = document.querySelector("#inspector-body");
  const projectName = document.querySelector("#project-name"); const exportDialog = document.querySelector("#export-dialog");
  bindDialog(exportDialog, [document.querySelector('[data-action="export"]')]);
  document.querySelector(".version").textContent = `v${APP_VERSION}`;

  function recoverProject() {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? migrateProject(JSON.parse(saved)) : createProject(); }
    catch { return createProject(); }
  }
  function snapshot() { history.push(JSON.stringify(project)); if (history.length > 80) history.shift(); future = []; }
  function commit(message) { project.updatedAt = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); document.querySelector("#save-state").textContent = "Autosaved just now"; updateHistoryButtons(); render(); if (message) toast(message); }
  function mutate(action, message) { snapshot(); action(); commit(message); }
  function updateHistoryButtons() { document.querySelector('[data-action="undo"]').disabled = !history.length; document.querySelector('[data-action="redo"]').disabled = !future.length; }
  function currentLayer() { return project.layers.find((layer) => !layer.locked) || project.layers[0]; }
  function snap(value) { return project.canvas.snap ? Math.round(value / project.canvas.grid) * project.canvas.grid : value; }
  function svgPoint(event) { const point = canvas.createSVGPoint(); point.x = event.clientX; point.y = event.clientY; const transformed = point.matrixTransform(canvas.getScreenCTM().inverse()); return { x: snap(transformed.x / SCALE), y: snap(transformed.y / SCALE) }; }

  function render() {
    projectName.value = project.name; document.querySelector("#grid-size").value = String(project.canvas.grid); document.querySelector("#snap-enabled").checked = project.canvas.snap;
    geometry.replaceChildren(...project.features.map(renderFeature));
    renderTree(); renderInspector(); renderIssues(); renderEstimates();
    document.querySelector("#selection-count").textContent = selected.size ? `${selected.size} selected` : "None";
    document.querySelectorAll('[data-action="duplicate"],[data-action="mirror"],[data-action="pattern"],[data-action="delete"]').forEach((button) => { button.disabled = !selected.size; });
  }

  function renderFeature(feature) {
    const layer = project.layers.find((item) => item.id === feature.layerId); const p = feature.parameters; const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g"); group.dataset.id = feature.id; group.setAttribute("transform", `translate(${feature.position.x * SCALE} ${feature.position.y * SCALE}) rotate(${feature.rotation || 0})`); if (!layer?.visible) group.setAttribute("display", "none");
    let shape;
    if (["inlet", "outlet", "circular-chamber"].includes(feature.type)) { shape = document.createElementNS(ns, "circle"); shape.setAttribute("r", String(p.diameter * SCALE / 2)); shape.classList.add("port"); }
    else if (feature.type === "curved-channel") { shape = document.createElementNS(ns, "path"); const r = p.radius * SCALE; shape.setAttribute("d", `M ${-p.length*SCALE/2} 0 Q 0 ${-r} ${p.length*SCALE/2} 0`); shape.setAttribute("fill", "none"); shape.setAttribute("stroke-width", String(Math.max(p.width*SCALE,3))); }
    else if (feature.type === "serpentine") { shape = document.createElementNS(ns, "path"); const l=p.length*SCALE/2, amp=12*SCALE/2; shape.setAttribute("d", `M ${-l} 0 C ${-l*.7} ${-amp},${-l*.3} ${amp},0 0 C ${l*.3} ${-amp},${l*.7} ${amp},${l} 0`); shape.setAttribute("fill", "none"); shape.setAttribute("stroke-width", String(Math.max(p.width*SCALE,3))); }
    else if (feature.type === "t-junction") { shape = document.createElementNS(ns, "path"); const l=p.length*SCALE/2; shape.setAttribute("d", `M ${-l} ${-l/2} H ${l} M 0 ${-l/2} V ${l/2}`); shape.setAttribute("fill", "none"); shape.setAttribute("stroke-width", String(Math.max(p.width*SCALE,3))); }
    else if (feature.type === "y-junction") { shape = document.createElementNS(ns, "path"); const l=p.length*SCALE/2; shape.setAttribute("d", `M 0 ${l/2} V 0 M 0 0 L ${-l} ${-l/2} M 0 0 L ${l} ${-l/2}`); shape.setAttribute("fill", "none"); shape.setAttribute("stroke-width", String(Math.max(p.width*SCALE,3))); }
    else { shape = document.createElementNS(ns, "rect"); const b=featureBounds({ ...feature, position:{x:0,y:0} }); shape.setAttribute("x", String(-b.width*SCALE/2)); shape.setAttribute("y", String(-b.height*SCALE/2)); shape.setAttribute("width", String(b.width*SCALE)); shape.setAttribute("height", String(b.height*SCALE)); shape.setAttribute("rx", feature.type.includes("channel") ? "4" : "8"); }
    shape.classList.add("feature-shape"); if (selected.has(feature.id)) shape.classList.add("is-selected");
    shape.setAttribute("tabindex", "0"); shape.setAttribute("role", "button"); shape.setAttribute("aria-label", feature.name);
    group.append(shape); return group;
  }

  function renderTree() {
    projectTree.innerHTML = project.layers.map((layer) => `<section class="tree-layer"><div class="tree-layer__head"><button class="tree-icon" data-layer-visible="${layer.id}" aria-label="${layer.visible?'Hide':'Show'} ${escapeHtml(layer.name)}">${layer.visible?'◉':'○'}</button><span>${escapeHtml(layer.name)}</span><button class="tree-icon" data-layer-lock="${layer.id}" aria-label="${layer.locked?'Unlock':'Lock'} ${escapeHtml(layer.name)}">${layer.locked?'🔒':'🔓'}</button></div>${project.features.filter((f)=>f.layerId===layer.id).map((feature)=>`<button class="tree-feature" role="treeitem" aria-selected="${selected.has(feature.id)}" data-select="${feature.id}"><span>${symbolFor(feature.type)}</span><span>${escapeHtml(feature.name)}</span><small>${escapeHtml(feature.type)}</small></button>`).join("") || '<div class="empty-state">No features</div>'}</section>`).join("");
  }
  function renderInspector() {
    const features = project.features.filter((feature) => selected.has(feature.id));
    if (features.length !== 1) { inspector.innerHTML = `<div class="empty-state">${features.length ? "Multiple features selected. Use toolbar commands for group operations." : "Select a feature to edit dimensions and parameters."}</div>`; return; }
    const feature = features[0]; const fields = Object.entries(feature.parameters).map(([key,value]) => `<label class="field">${labelize(key)} <input data-param="${key}" type="number" step="0.01" value="${Number(value)}"><span class="help">${["turns","angle"].includes(key) ? (key === "angle" ? "degrees" : "count") : project.units}</span></label>`).join("");
    const b=featureBounds(feature),depth=Number(feature.parameters.depth)||0,area=b.width*b.height,volume=area*depth;
    inspector.innerHTML = `<section class="inspector-section"><h3>Identity</h3><label class="field">Name<input data-feature-field="name" value="${escapeHtml(feature.name)}"></label><label class="field">Type<input value="${escapeHtml(feature.type)}" disabled></label><label class="field">Layer<select data-feature-field="layerId">${project.layers.map((l)=>`<option value="${l.id}" ${l.id===feature.layerId?'selected':''}>${escapeHtml(l.name)}</option>`).join("")}</select></label></section><section class="inspector-section"><h3>Position</h3><div class="field-row"><label class="field">X<input data-position="x" type="number" step="0.1" value="${feature.position.x}"></label><label class="field">Y<input data-position="y" type="number" step="0.1" value="${feature.position.y}"></label></div><label class="field">Rotation<input data-feature-field="rotation" type="number" step="1" value="${feature.rotation}"><span class="help">degrees</span></label></section><section class="inspector-section"><h3>Dimensions</h3>${fields}</section><section class="inspector-section"><h3>Measurements</h3><p>Length: ${formatNumber(feature.parameters.length||b.width)} mm<br>Diameter: ${feature.parameters.diameter?`${formatNumber(feature.parameters.diameter)} mm`:"Not applicable"}<br>Plan area: ${formatNumber(area)} mm²<br>Bounding volume: ${depth>0?`${formatNumber(volume)} µL`:"Not calculated — depth required"}</p></section>`;
  }
  function renderIssues() {
    const issues = validateProject(project); document.querySelector("#issue-count").textContent = String(issues.length);
    document.querySelectorAll("[data-profile]").forEach((input)=>{input.value=project.profile[input.dataset.profile]});
    document.querySelector("#issues").innerHTML = issues.length ? issues.map((issue,index)=>`<button class="issue" data-issue="${index}"><span class="status-badge status-badge--${issue.severity==='error'?'error':'warn'}">${issue.severity}</span><span><strong>${issue.ruleId}</strong> — ${escapeHtml(issue.explanation)}<br><small>Actual: ${escapeHtml(issue.actual)} · Configured: ${escapeHtml(issue.required)} · ${escapeHtml(issue.action)}</small></span><span>Focus →</span></button>`).join("") : '<div class="empty-state"><span class="status-badge status-badge--ok">No advisory issues</span><span>All configured checks pass. This is not manufacturing validation.</span></div>';
    document.querySelectorAll("[data-issue]").forEach((button)=>button.addEventListener("click",()=>{ const issue=issues[Number(button.dataset.issue)]; selected=new Set(issue.featureIds); render(); }));
  }
  function renderEstimates() {
    const feature = project.features.find((item)=>selected.has(item.id)); const results=engineeringEstimates(feature,project.engineering);
    document.querySelector("#estimates").innerHTML = `<div class="estimate-inputs field-row"><label class="field">Flow rate (µL/min)<input data-engineering="flowRateUlMin" type="number" step="0.1" value="${project.engineering.flowRateUlMin}"></label><label class="field">Density (kg/m³)<input data-engineering="densityKgM3" type="number" step="1" value="${project.engineering.densityKgM3}"></label><label class="field">Viscosity (Pa·s)<input data-engineering="viscosityPaS" type="number" step="0.0001" value="${project.engineering.viscosityPaS}"></label></div><div class="estimate-grid">${results.map((result)=>`<div class="estimate"><span>${result.label}</span><strong>${typeof result.value==='number'?formatNumber(result.value):escapeHtml(result.value)} ${result.unit}</strong><small>${result.method}${result.warning?' · Review assumptions':''}</small></div>`).join("") || '<div class="empty-state">Select a rectangular channel with valid dimensions.</div>'}</div>`;
  }

  document.addEventListener("click", (event) => {
    const componentButton=event.target.closest("[data-component]"); if(componentButton){activeType=componentButton.dataset.component;document.querySelectorAll(".tool").forEach((b)=>b.classList.toggle("is-active",b===componentButton));document.querySelector("#active-tool").textContent=`Place ${COMPONENTS[activeType].name}`;return;}
    const selectButton=event.target.closest("[data-tool=select]"); if(selectButton){activeType=null;document.querySelectorAll(".tool").forEach((b)=>b.classList.toggle("is-active",b===selectButton));document.querySelector("#active-tool").textContent="Select";}
    const treeSelection=event.target.closest("[data-select]"); if(treeSelection){selected=new Set([treeSelection.dataset.select]);render();}
    const visibility=event.target.closest("[data-layer-visible]"); if(visibility) mutate(()=>{const l=project.layers.find(x=>x.id===visibility.dataset.layerVisible);l.visible=!l.visible;},"Layer visibility updated");
    const lock=event.target.closest("[data-layer-lock]"); if(lock) mutate(()=>{const l=project.layers.find(x=>x.id===lock.dataset.layerLock);l.locked=!l.locked;},"Layer lock updated");
  });
  canvas.addEventListener("pointerdown", (event) => {
    const featureEl=event.target.closest("[data-id]");
    if(activeType && !featureEl){const layer=currentLayer();if(layer.locked){toast("Unlock a layer before placing features.","error");return;}const point=svgPoint(event);mutate(()=>{const feature=makeFeature(activeType,point,layer.id);project.features.push(feature);selected=new Set([feature.id]);},`${COMPONENTS[activeType].name} added`);return;}
    if(featureEl){const id=featureEl.dataset.id;if(event.shiftKey){selected.has(id)?selected.delete(id):selected.add(id);}else if(!selected.has(id))selected=new Set([id]);const feature=project.features.find(x=>x.id===id);const layer=project.layers.find(x=>x.id===feature.layerId);if(!layer.locked){snapshot();dragging={start:svgPoint(event),positions:new Map(project.features.filter(x=>selected.has(x.id)).map(x=>[x.id,{...x.position}]))};canvas.setPointerCapture(event.pointerId);}render();}
    else if(!activeType){selected.clear();render();}
  });
  canvas.addEventListener("pointermove",(event)=>{if(!dragging)return;const point=svgPoint(event);const dx=point.x-dragging.start.x,dy=point.y-dragging.start.y;project.features.forEach((f)=>{const start=dragging.positions.get(f.id);if(start){f.position.x=snap(start.x+dx);f.position.y=snap(start.y+dy);}});render();});
  canvas.addEventListener("pointerup",()=>{if(dragging){dragging=null;commit("Feature position updated");}});
  document.addEventListener("change",(event)=>{
    if(event.target===projectName){mutate(()=>project.name=event.target.value.trim()||"Untitled project","Project renamed");return;}
    if(event.target.id==="grid-size"){mutate(()=>project.canvas.grid=Number(event.target.value),"Grid updated");return;}
    if(event.target.id==="snap-enabled"){mutate(()=>project.canvas.snap=event.target.checked,"Snapping updated");return;}
    if(event.target.dataset.profile){mutate(()=>{project.profile[event.target.dataset.profile]=Number(event.target.value);project.profile.name="Custom";},"Advisory profile updated");return;}
    if(event.target.id==="profile-preset"){const preset=PROFILES[event.target.value];if(preset)mutate(()=>project.profile={...preset},"Fabrication starting defaults loaded");return;}
    const feature=project.features.find(x=>selected.has(x.id)); if(!feature)return;
    if(event.target.dataset.param) mutate(()=>feature.parameters[event.target.dataset.param]=Number(event.target.value),"Dimension updated");
    if(event.target.dataset.position) mutate(()=>feature.position[event.target.dataset.position]=Number(event.target.value),"Position updated");
    if(event.target.dataset.featureField) mutate(()=>feature[event.target.dataset.featureField]=event.target.type==="number"?Number(event.target.value):event.target.value,"Property updated");
    if(event.target.dataset.engineering) mutate(()=>project.engineering[event.target.dataset.engineering]=event.target.value);
  });
  document.addEventListener("keydown",(event)=>{if(["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName))return;if(event.key==="Escape"){activeType=null;selected.clear();document.querySelector('[data-tool="select"]').click();render();}if((event.key==="Delete"||event.key==="Backspace")&&selected.size)runAction("delete");if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="z"){event.preventDefault();runAction(event.shiftKey?"redo":"undo");}});
  document.querySelectorAll("[data-action]").forEach((button)=>button.addEventListener("click",()=>runAction(button.dataset.action)));
  function runAction(action){
    if(action==="new"&&confirm("Start a new project? Download the current project first if needed.")){history=[];future=[];selected.clear();project=createProject();commit("New project created");}
    if(action==="open"||action==="import")document.querySelector("#project-file").click();
    if(action==="save")exportJSON();
    if(action==="undo"&&history.length){future.push(JSON.stringify(project));project=normalizeProject(JSON.parse(history.pop()));selected.clear();commit("Undid last change");}
    if(action==="redo"&&future.length){history.push(JSON.stringify(project));project=normalizeProject(JSON.parse(future.pop()));selected.clear();commit("Redid change");}
    if(action==="delete")mutate(()=>{project.features=project.features.filter(x=>!selected.has(x.id));selected.clear();},"Selected features deleted");
    if(action==="duplicate")mutate(()=>{const copies=project.features.filter(x=>selected.has(x.id)).map(x=>({...structuredClone(x),id:uid("feature"),name:`${x.name} copy`,position:{x:x.position.x+3,y:x.position.y+3}}));project.features.push(...copies);selected=new Set(copies.map(x=>x.id));},"Features duplicated");
    if(action==="mirror")mutate(()=>{project.features.filter(x=>selected.has(x.id)).forEach(x=>{x.position.x=project.canvas.width-x.position.x;x.rotation=(360-x.rotation)%360;});},"Features mirrored across vertical centerline");
    if(action==="pattern")mutate(()=>{const copies=[];project.features.filter(x=>selected.has(x.id)).forEach(x=>{for(let i=1;i<=3;i++)copies.push({...structuredClone(x),id:uid("feature"),name:`${x.name} ${i+1}`,position:{x:x.position.x+i*5,y:x.position.y}})});project.features.push(...copies);selected=new Set(copies.map(x=>x.id));},"Linear pattern created");
    if(action==="add-layer")mutate(()=>project.layers.push({id:uid("layer"),name:`Layer ${project.layers.length+1}`,visible:true,locked:false}),"Layer added");
    if(action==="fit"||action==="reset-view")canvas.setAttribute("viewBox","0 0 1200 720");
  }
  document.querySelector("#project-file").addEventListener("change",async(event)=>{const file=event.target.files[0];if(!file)return;try{const incoming=migrateProject(JSON.parse(await file.text()));snapshot();project=incoming;selected.clear();commit(`Opened ${file.name}`);}catch(error){toast(error.message,"error");}event.target.value="";});
  document.querySelectorAll("[data-export]").forEach((button)=>button.addEventListener("click",()=>{const type=button.dataset.export;if(type==="json")exportJSON();if(type==="svg")exportSVG();if(type==="png")exportPNG();if(type==="csv")exportCSV();if(type==="glb"){document.querySelector('[aria-controls="canvas-3d"]').click();exportDialog.close();}}));
  function exportJSON(){downloadText(`${safeFilename(project.name)}.microcd.json`,JSON.stringify(project,null,2),"application/json");toast("Native project JSON downloaded");}
  function exportSVG(){const clone=canvas.cloneNode(true);clone.querySelector("#selection-layer")?.remove();downloadText(`${safeFilename(project.name)}.svg`,new XMLSerializer().serializeToString(clone),"image/svg+xml");toast("SVG geometry downloaded");}
  function exportPNG(){const clone=canvas.cloneNode(true);clone.querySelector("#selection-layer")?.remove();const svg=new XMLSerializer().serializeToString(clone);const image=new Image();image.onload=()=>{const out=document.createElement("canvas");out.width=1200;out.height=720;out.getContext("2d").drawImage(image,0,0);out.toBlob((blob)=>downloadBlob(`${safeFilename(project.name)}.png`,blob),"image/png");};image.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;toast("Preparing PNG snapshot");}
  function exportCSV(){const headers=["id","name","type","layer","x_mm","y_mm","rotation_deg","parameters_json"];const rows=project.features.map(f=>[f.id,f.name,f.type,project.layers.find(l=>l.id===f.layerId)?.name||"",f.position.x,f.position.y,f.rotation,JSON.stringify(f.parameters)]);downloadText(`${safeFilename(project.name)}-features.csv`,[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\n"),"text/csv");toast("Feature list downloaded");}
  render(); updateHistoryButtons();
}

function csvCell(value){const text=String(value??"");return /[",\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text;}
function labelize(value){return value.replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase());}
function symbolFor(type){return ({inlet:"●",outlet:"○","straight-channel":"━","curved-channel":"⌒",serpentine:"≋","t-junction":"┳","y-junction":"Y"})[type]||"◇";}
function formatNumber(value){if(!Number.isFinite(value))return "Not calculated";if(Math.abs(value)>=1e6||Math.abs(value)<.001&&value!==0)return value.toExponential(3);return new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(value);}
function escapeHtml(value){return String(value??"").replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);}
