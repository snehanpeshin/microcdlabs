(() => {
  const svg = document.getElementById("modelCanvas");
  const viewport = document.getElementById("viewport");
  const pointerReadout = document.getElementById("pointerReadout");
  const cursorPanel = document.getElementById("cursorPanel");
  const cursorTool = document.getElementById("cursorTool");
  const cursorCoords = document.getElementById("cursorCoords");
  const cursorDims = document.getElementById("cursorDims");
  const selectedInfo = document.getElementById("selectedInfo");
  const drcList = document.getElementById("drcList");
  const summaryList = document.getElementById("summaryList");
  const nativeAdsBridge = window.webkit?.messageHandlers?.microcdAds;
  const rewardedAdBtn = document.getElementById("rewardedAdBtn");

  const state = {
    tool: "select",
    view: "iso",
    selectedId: null,
    pendingMeasure: null,
    layers: {
      base: true,
      channels: true,
      ports: true,
      cuts: true,
      annotations: true
    },
    base: {
      length: 75,
      width: 25,
      height: 3,
      radius: 2
    },
    features: []
  };

  const layerFor = {
    channel: "channels",
    mixer: "channels",
    port: "ports",
    chamber: "ports",
    valve: "channels",
    cut: "cuts",
    measure: "annotations",
    dimension: "annotations"
  };

  const els = {
    baseLength: document.getElementById("baseLength"),
    baseWidth: document.getElementById("baseWidth"),
    baseHeight: document.getElementById("baseHeight"),
    cornerRadius: document.getElementById("cornerRadius"),
    channelWidth: document.getElementById("channelWidth"),
    channelDepth: document.getElementById("channelDepth"),
    portDiameter: document.getElementById("portDiameter"),
    chamberDiameter: document.getElementById("chamberDiameter"),
    cutWidth: document.getElementById("cutWidth"),
    cutHeight: document.getElementById("cutHeight"),
    editX: document.getElementById("editX"),
    editY: document.getElementById("editY"),
    editA: document.getElementById("editA"),
    editB: document.getElementById("editB"),
    editDepth: document.getElementById("editDepth"),
    importFile: document.getElementById("importFile")
  };

  function num(id) {
    return Number(els[id].value) || 0;
  }

  function id(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function fmt(value) {
    return Number(value).toFixed(2);
  }

  function svgEl(name, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function screenToModel(event) {
    const rect = svg.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * 1000;
    const sy = ((event.clientY - rect.top) / rect.height) * 620;
    return canvasToModel(sx, sy);
  }

  function modelToCanvas(x, y, z = 0) {
    const scale = 8.5;
    const ox = 500;
    const oy = 305;
    if (state.view === "top") {
      return [ox + (x - state.base.length / 2) * scale, oy + (y - state.base.width / 2) * scale];
    }
    if (state.view === "front") {
      return [ox + (x - state.base.length / 2) * scale, oy - z * 18 + (state.base.height - z) * 2];
    }
    if (state.view === "right") {
      return [ox + (y - state.base.width / 2) * scale, oy - z * 18 + (state.base.height - z) * 2];
    }
    return [
      ox + (x - y) * scale * 0.72,
      oy + (x + y) * scale * 0.34 - z * 22
    ];
  }

  function canvasToModel(sx, sy) {
    const scale = 8.5;
    const ox = 500;
    const oy = 305;
    if (state.view === "top") {
      return {
        x: clamp((sx - ox) / scale + state.base.length / 2, 0, state.base.length),
        y: clamp((sy - oy) / scale + state.base.width / 2, 0, state.base.width),
        z: state.base.height
      };
    }
    if (state.view === "front") {
      return {
        x: clamp((sx - ox) / scale + state.base.length / 2, 0, state.base.length),
        y: state.base.width / 2,
        z: clamp((oy - sy) / 18, 0, state.base.height)
      };
    }
    if (state.view === "right") {
      return {
        x: state.base.length / 2,
        y: clamp((sx - ox) / scale + state.base.width / 2, 0, state.base.width),
        z: clamp((oy - sy) / 18, 0, state.base.height)
      };
    }
    const a = (sx - ox) / (scale * 0.72);
    const b = (sy - oy + state.base.height * 22) / (scale * 0.34);
    return {
      x: clamp((a + b) / 2, 0, state.base.length),
      y: clamp((b - a) / 2, 0, state.base.width),
      z: state.base.height
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundedTopPath() {
    const { length, width, radius } = state.base;
    const r = Math.min(radius, length / 3, width / 3);
    const pts = [
      [r, 0],
      [length - r, 0],
      [length, r],
      [length, width - r],
      [length - r, width],
      [r, width],
      [0, width - r],
      [0, r]
    ].map(([x, y]) => modelToCanvas(x, y, state.base.height));
    return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} Q ${modelToCanvas(length, 0, state.base.height).join(" ")} ${pts[2][0]} ${pts[2][1]} L ${pts[3][0]} ${pts[3][1]} Q ${modelToCanvas(length, width, state.base.height).join(" ")} ${pts[4][0]} ${pts[4][1]} L ${pts[5][0]} ${pts[5][1]} Q ${modelToCanvas(0, width, state.base.height).join(" ")} ${pts[6][0]} ${pts[6][1]} L ${pts[7][0]} ${pts[7][1]} Q ${modelToCanvas(0, 0, state.base.height).join(" ")} ${pts[0][0]} ${pts[0][1]} Z`;
  }

  function render() {
    viewport.replaceChildren();
    if (state.layers.base) renderBase();
    renderAxes();
    state.features.forEach(renderFeature);
    renderSummary();
    renderDrc();
    syncSelectionPanel();
  }

  function renderBase() {
    if (state.view === "iso") {
      const bottom = [[0, 0], [state.base.length, 0], [state.base.length, state.base.width], [0, state.base.width]]
        .map(([x, y]) => modelToCanvas(x, y, 0));
      const top = [[0, 0], [state.base.length, 0], [state.base.length, state.base.width], [0, state.base.width]]
        .map(([x, y]) => modelToCanvas(x, y, state.base.height));
      viewport.appendChild(svgEl("polygon", {
        points: [top[1], bottom[1], bottom[2], top[2]].map((p) => p.join(",")).join(" "),
        class: "base-side",
        filter: "url(#shadow)"
      }));
      viewport.appendChild(svgEl("polygon", {
        points: [top[2], bottom[2], bottom[3], top[3]].map((p) => p.join(",")).join(" "),
        class: "base-side"
      }));
    }
    viewport.appendChild(svgEl("path", {
      d: roundedTopPath(),
      class: "base-top",
      filter: state.view === "top" ? "url(#shadow)" : ""
    }));
  }

  function renderAxes() {
    const g = svgEl("g", { class: "axis" });
    const origin = modelToCanvas(2, 2, state.base.height + 0.4);
    const x = modelToCanvas(12, 2, state.base.height + 0.4);
    const y = modelToCanvas(2, 10, state.base.height + 0.4);
    const z = modelToCanvas(2, 2, state.base.height + 5);
    [
      [x, "#dc2626", "X"],
      [y, "#16a34a", "Y"],
      [z, "#2563eb", "Z"]
    ].forEach(([end, color, label]) => {
      g.appendChild(svgEl("line", { x1: origin[0], y1: origin[1], x2: end[0], y2: end[1], stroke: color, "stroke-width": 3 }));
      const text = svgEl("text", { x: end[0] + 5, y: end[1] + 4, fill: color });
      text.textContent = label;
      g.appendChild(text);
    });
    viewport.appendChild(g);
  }

  function renderFeature(feature) {
    const layer = layerFor[feature.type];
    if (layer && !state.layers[layer]) return;
    const selected = feature.id === state.selectedId ? " is-selected" : "";
    if (feature.type === "channel") {
      const a = modelToCanvas(feature.x, feature.y - feature.width / 2, state.base.height + 0.03);
      const b = modelToCanvas(feature.x + feature.length, feature.y - feature.width / 2, state.base.height + 0.03);
      const c = modelToCanvas(feature.x + feature.length, feature.y + feature.width / 2, state.base.height + 0.03);
      const d = modelToCanvas(feature.x, feature.y + feature.width / 2, state.base.height + 0.03);
      appendFeature("polygon", { points: [a, b, c, d].map((p) => p.join(",")).join(" "), class: `feature channel${selected}` }, feature.id);
    }
    if (feature.type === "port" || feature.type === "chamber") {
      const p = modelToCanvas(feature.x, feature.y, state.base.height + 0.06);
      appendFeature("circle", { cx: p[0], cy: p[1], r: feature.diameter * 4.2, class: `feature ${feature.type}${selected}` }, feature.id);
    }
    if (feature.type === "mixer") {
      const points = [];
      const turns = 6;
      for (let i = 0; i <= turns; i += 1) {
        const x = feature.x + (feature.length / turns) * i;
        const y = feature.y + (i % 2 === 0 ? -feature.width : feature.width);
        points.push(modelToCanvas(x, y, state.base.height + 0.08));
      }
      appendFeature("polyline", { points: points.map((p) => p.join(",")).join(" "), class: `feature mixer${selected}` }, feature.id);
    }
    if (feature.type === "valve") {
      const p = modelToCanvas(feature.x, feature.y, state.base.height + 0.07);
      const size = feature.width * 5;
      appendFeature("polygon", {
        points: `${p[0]},${p[1] - size} ${p[0] + size},${p[1]} ${p[0]},${p[1] + size} ${p[0] - size},${p[1]}`,
        class: `feature valve${selected}`
      }, feature.id);
    }
    if (feature.type === "cut") {
      const a = modelToCanvas(feature.x - feature.width / 2, feature.y - feature.height / 2, state.base.height + 0.1);
      const b = modelToCanvas(feature.x + feature.width / 2, feature.y - feature.height / 2, state.base.height + 0.1);
      const c = modelToCanvas(feature.x + feature.width / 2, feature.y + feature.height / 2, state.base.height + 0.1);
      const d = modelToCanvas(feature.x - feature.width / 2, feature.y + feature.height / 2, state.base.height + 0.1);
      appendFeature("polygon", { points: [a, b, c, d].map((p) => p.join(",")).join(" "), class: `feature cut${selected}` }, feature.id);
    }
    if (feature.type === "measure" || feature.type === "dimension") {
      const a = modelToCanvas(feature.x1, feature.y1, state.base.height + 0.15);
      const b = modelToCanvas(feature.x2, feature.y2, state.base.height + 0.15);
      appendFeature("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: `feature dimension${selected}` }, feature.id);
      const text = svgEl("text", { x: (a[0] + b[0]) / 2 + 6, y: (a[1] + b[1]) / 2 - 6, class: "dimension-text" });
      text.textContent = `${fmt(distance(feature.x1, feature.y1, feature.x2, feature.y2))} mm`;
      text.dataset.id = feature.id;
      viewport.appendChild(text);
    }
  }

  function appendFeature(name, attrs, featureId) {
    const node = svgEl(name, attrs);
    node.dataset.id = featureId;
    node.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      selectFeature(featureId);
    });
    viewport.appendChild(node);
  }

  function addFeature(type, point) {
    const margin = 0.5;
    const feature = { id: id(type), type };
    if (type === "channel") {
      Object.assign(feature, {
        x: clamp(point.x, margin, state.base.length - 12),
        y: point.y,
        length: Math.min(18, state.base.length - point.x - margin),
        width: num("channelWidth"),
        depth: num("channelDepth")
      });
    }
    if (type === "port") {
      Object.assign(feature, { x: point.x, y: point.y, diameter: num("portDiameter"), depth: state.base.height });
    }
    if (type === "chamber") {
      Object.assign(feature, { x: point.x, y: point.y, diameter: num("chamberDiameter"), depth: num("channelDepth") * 2 });
    }
    if (type === "mixer") {
      Object.assign(feature, { x: point.x, y: point.y, length: 18, width: num("channelWidth") * 3, depth: num("channelDepth") });
    }
    if (type === "valve") {
      Object.assign(feature, { x: point.x, y: point.y, width: num("channelWidth") * 2, depth: num("channelDepth"), subtype: "siphon" });
    }
    if (type === "cut") {
      Object.assign(feature, { x: point.x, y: point.y, width: num("cutWidth"), height: num("cutHeight"), depth: state.base.height });
    }
    state.features.push(boundFeature(feature));
    selectFeature(feature.id);
    render();
  }

  function addMeasurement(type, point) {
    if (!state.pendingMeasure) {
      state.pendingMeasure = point;
      return;
    }
    state.features.push({
      id: id(type),
      type,
      x1: state.pendingMeasure.x,
      y1: state.pendingMeasure.y,
      x2: point.x,
      y2: point.y
    });
    state.pendingMeasure = null;
    render();
  }

  function boundFeature(feature) {
    if ("x" in feature) feature.x = clamp(feature.x, 0, state.base.length);
    if ("y" in feature) feature.y = clamp(feature.y, 0, state.base.width);
    if ("length" in feature) feature.length = Math.max(0.2, Math.min(feature.length, state.base.length - feature.x));
    if ("width" in feature && feature.type !== "channel") feature.width = Math.max(0.1, feature.width);
    if ("diameter" in feature) feature.diameter = Math.max(0.2, feature.diameter);
    return feature;
  }

  function selectFeature(featureId) {
    state.selectedId = featureId;
    render();
  }

  function selectedFeature() {
    return state.features.find((feature) => feature.id === state.selectedId);
  }

  function syncSelectionPanel() {
    const feature = selectedFeature();
    if (!feature) {
      selectedInfo.textContent = "Select or place a feature to edit its dimensions.";
      ["editX", "editY", "editA", "editB", "editDepth"].forEach((key) => { els[key].value = ""; });
      return;
    }
    selectedInfo.textContent = `${feature.type.toUpperCase()} on ${layerFor[feature.type] || "annotations"} layer`;
    els.editX.value = fmt(feature.x ?? feature.x1 ?? 0);
    els.editY.value = fmt(feature.y ?? feature.y1 ?? 0);
    els.editA.value = fmt(feature.width ?? feature.diameter ?? distance(feature.x1, feature.y1, feature.x2, feature.y2));
    els.editB.value = fmt(feature.height ?? feature.length ?? 0);
    els.editDepth.value = fmt(feature.depth ?? 0);
  }

  function applyFeatureEdit() {
    const feature = selectedFeature();
    if (!feature) return;
    if ("x" in feature) feature.x = num("editX");
    if ("y" in feature) feature.y = num("editY");
    if ("diameter" in feature) feature.diameter = Math.max(0.2, num("editA"));
    if (feature.type === "channel" || feature.type === "mixer" || feature.type === "valve") feature.width = Math.max(0.05, num("editA"));
    if ("height" in feature) feature.height = Math.max(0.2, num("editB"));
    if ("length" in feature) feature.length = Math.max(0.2, num("editB"));
    if ("depth" in feature) feature.depth = Math.max(0, num("editDepth"));
    boundFeature(feature);
    render();
  }

  function deleteSelected() {
    if (!state.selectedId) return;
    state.features = state.features.filter((feature) => feature.id !== state.selectedId);
    state.selectedId = null;
    render();
  }

  function renderDrc() {
    const issues = [];
    const { length, width, height } = state.base;
    state.features.forEach((feature) => {
      if ("x" in feature && (feature.x < 0 || feature.x > length || feature.y < 0 || feature.y > width)) {
        issues.push(["fail", `${feature.type} is outside the cartridge outline.`]);
      }
      if ((feature.type === "channel" || feature.type === "mixer") && feature.depth >= height) {
        issues.push(["fail", `${feature.type} depth cuts through the full substrate.`]);
      }
      if (feature.type === "channel" && feature.width < 0.2) {
        issues.push(["warn", "Channel width below 0.20 mm may be difficult for common desktop fabrication."]);
      }
      if (feature.type === "port" && edgeDistance(feature.x, feature.y) < feature.diameter / 2 + 1) {
        issues.push(["warn", "Port is close to an outer edge; add sealing land or move inward."]);
      }
    });
    if (!state.features.some((feature) => feature.type === "port")) issues.push(["warn", "No inlet or outlet port has been added."]);
    if (!state.features.some((feature) => feature.type === "channel" || feature.type === "mixer")) issues.push(["warn", "No fluidic channel path has been added."]);
    if (!issues.length) issues.push(["ok", "No basic rule issues detected."]);
    drcList.replaceChildren(...issues.map(([type, text]) => {
      const li = document.createElement("li");
      li.className = type;
      li.textContent = text;
      return li;
    }));
  }

  function edgeDistance(x, y) {
    return Math.min(x, y, state.base.length - x, state.base.width - y);
  }

  function renderSummary() {
    const area = state.base.length * state.base.width;
    const volume = area * state.base.height;
    const fluidic = state.features.reduce((sum, feature) => {
      if (feature.type === "channel") return sum + feature.length * feature.width * feature.depth;
      if (feature.type === "chamber") return sum + Math.PI * (feature.diameter / 2) ** 2 * feature.depth;
      return sum;
    }, 0);
    const rows = [
      ["Base", `${state.base.length} x ${state.base.width} x ${state.base.height} mm`],
      ["Footprint", `${fmt(area)} mm2`],
      ["Substrate", `${fmt(volume)} mm3`],
      ["Fluid volume", `${fmt(fluidic)} uL approx.`],
      ["Features", String(state.features.length)]
    ];
    summaryList.replaceChildren(...rows.flatMap(([term, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = value;
      return [dt, dd];
    }));
  }

  function distance(x1, y1, x2, y2) {
    return Math.hypot((x2 || 0) - (x1 || 0), (y2 || 0) - (y1 || 0));
  }

  function updateBaseFromInputs() {
    state.base.length = Math.max(10, num("baseLength"));
    state.base.width = Math.max(10, num("baseWidth"));
    state.base.height = Math.max(0.5, num("baseHeight"));
    state.base.radius = Math.max(0, num("cornerRadius"));
    state.features.forEach(boundFeature);
    render();
  }

  function updatePointer(event) {
    const point = screenToModel(event);
    pointerReadout.textContent = `X ${fmt(point.x)} mm | Y ${fmt(point.y)} mm | Z ${fmt(point.z)} mm`;
    if (state.tool === "select") {
      cursorPanel.hidden = true;
      return;
    }
    cursorPanel.hidden = false;
    cursorPanel.style.left = `${event.clientX + 16}px`;
    cursorPanel.style.top = `${event.clientY + 16}px`;
    cursorTool.textContent = state.tool[0].toUpperCase() + state.tool.slice(1);
    cursorCoords.textContent = `X ${fmt(point.x)}, Y ${fmt(point.y)}, Z ${fmt(point.z)} mm`;
    const dims = {
      channel: `W ${fmt(num("channelWidth"))} x D ${fmt(num("channelDepth"))} mm`,
      port: `Diameter ${fmt(num("portDiameter"))} mm`,
      chamber: `Diameter ${fmt(num("chamberDiameter"))} mm`,
      mixer: `W ${fmt(num("channelWidth") * 3)} x D ${fmt(num("channelDepth"))} mm`,
      valve: `Siphon valve W ${fmt(num("channelWidth") * 2)} mm`,
      cut: `Cut ${fmt(num("cutWidth"))} x ${fmt(num("cutHeight"))} mm`,
      measure: state.pendingMeasure ? "Pick end point" : "Pick start point",
      dimension: state.pendingMeasure ? "Pick end point" : "Pick start point"
    };
    cursorDims.textContent = dims[state.tool] || "";
  }

  function setTool(tool) {
    state.tool = tool;
    state.pendingMeasure = null;
    document.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("is-active", button.dataset.tool === tool));
  }

  function setView(view) {
    state.view = view;
    document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    render();
  }

  function loadLfaExample() {
    state.base = { length: 78, width: 24, height: 3, radius: 2.5 };
    state.features = [
      { id: id("cut"), type: "cut", x: 39, y: 12, width: 56, height: 6.5, depth: 2.8 },
      { id: id("port"), type: "port", x: 10, y: 12, diameter: 3.5, depth: 3 },
      { id: id("channel"), type: "channel", x: 12, y: 12, length: 17, width: 1.2, depth: 0.35 },
      { id: id("chamber"), type: "chamber", x: 30, y: 12, diameter: 5, depth: 0.4 },
      { id: id("dimension"), type: "dimension", x1: 11, y1: 5, x2: 67, y2: 5 }
    ];
    syncBaseInputs();
    state.selectedId = null;
    render();
  }

  function loadCdExample() {
    state.base = { length: 86, width: 86, height: 2.5, radius: 43 };
    state.features = [
      { id: id("port"), type: "port", x: 43, y: 17, diameter: 4, depth: 2.5 },
      { id: id("chamber"), type: "chamber", x: 43, y: 28, diameter: 8, depth: 0.45 },
      { id: id("valve"), type: "valve", x: 43, y: 39, width: 1.4, depth: 0.25, subtype: "siphon" },
      { id: id("mixer"), type: "mixer", x: 31, y: 47, length: 24, width: 2.4, depth: 0.25 }
    ];
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      state.features.push({
        id: id("chamber"),
        type: "chamber",
        x: 43 + Math.cos(angle) * 24,
        y: 43 + Math.sin(angle) * 24,
        diameter: 4.6,
        depth: 0.35
      });
    }
    syncBaseInputs();
    state.selectedId = null;
    render();
  }

  function syncBaseInputs() {
    els.baseLength.value = state.base.length;
    els.baseWidth.value = state.base.width;
    els.baseHeight.value = state.base.height;
    els.cornerRadius.value = state.base.radius;
  }

  function projectData() {
    return {
      app: "MicroCD Labs Microfluidic Modeler",
      version: "1.1.0",
      units: "mm",
      generatedAt: new Date().toISOString(),
      base: state.base,
      features: state.features
    };
  }

  function exportFile(type) {
    const name = `microcd-model.${type}`;
    if (type === "json") return download("microcd-model.json", JSON.stringify(projectData(), null, 2), "application/json");
    if (type === "svg") return download(name, svg.outerHTML, "image/svg+xml");
    if (type === "dxf") return download(name, toDxf(), "application/dxf");
    if (type === "stl") return download(name, toStl(), "model/stl");
    if (type === "obj") return download(name, toObj(), "text/plain");
  }

  function download(filename, content, mime) {
    const nativeBridge = window.webkit?.messageHandlers?.microcdExport;
    if (nativeBridge) {
      nativeBridge.postMessage({
        filename,
        mimeType: mime,
        base64: btoa(unescape(encodeURIComponent(content)))
      });
      return;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function toDxf() {
    const lines = ["0", "SECTION", "2", "ENTITIES"];
    state.features.forEach((feature) => {
      if (feature.type === "channel") {
        lines.push("0", "LINE", "8", "CHANNELS", "10", feature.x, "20", feature.y, "11", feature.x + feature.length, "21", feature.y);
      }
      if (feature.type === "port" || feature.type === "chamber") {
        lines.push("0", "CIRCLE", "8", feature.type.toUpperCase(), "10", feature.x, "20", feature.y, "40", feature.diameter / 2);
      }
      if (feature.type === "cut") {
        const x0 = feature.x - feature.width / 2;
        const y0 = feature.y - feature.height / 2;
        const x1 = feature.x + feature.width / 2;
        const y1 = feature.y + feature.height / 2;
        [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]].forEach((l) => {
          lines.push("0", "LINE", "8", "CUTS", "10", l[0], "20", l[1], "11", l[2], "21", l[3]);
        });
      }
    });
    lines.push("0", "ENDSEC", "0", "EOF");
    return lines.join("\n");
  }

  function toStl() {
    const { length, width, height } = state.base;
    const v = [[0, 0, 0], [length, 0, 0], [length, width, 0], [0, width, 0], [0, 0, height], [length, 0, height], [length, width, height], [0, width, height]];
    const faces = [[0, 1, 2], [0, 2, 3], [4, 6, 5], [4, 7, 6], [0, 4, 5], [0, 5, 1], [1, 5, 6], [1, 6, 2], [2, 6, 7], [2, 7, 3], [3, 7, 4], [3, 4, 0]];
    return ["solid microcd_base", ...faces.map((f) => facet(v[f[0]], v[f[1]], v[f[2]])), "endsolid microcd_base"].join("\n");
  }

  function facet(a, b, c) {
    return `facet normal 0 0 0\n outer loop\n  vertex ${a.join(" ")}\n  vertex ${b.join(" ")}\n  vertex ${c.join(" ")}\n endloop\nendfacet`;
  }

  function toObj() {
    const { length, width, height } = state.base;
    return [
      "# MicroCD Labs Microfluidic Modeler OBJ",
      "v 0 0 0",
      `v ${length} 0 0`,
      `v ${length} ${width} 0`,
      `v 0 ${width} 0`,
      `v 0 0 ${height}`,
      `v ${length} 0 ${height}`,
      `v ${length} ${width} ${height}`,
      `v 0 ${width} ${height}`,
      "f 1 2 3 4",
      "f 5 8 7 6",
      "f 1 5 6 2",
      "f 2 6 7 3",
      "f 3 7 8 4",
      "f 4 8 5 1"
    ].join("\n");
  }

  document.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => setTool(button.dataset.tool)));
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", () => exportFile(button.dataset.export)));
  document.querySelectorAll(".layer-toggle").forEach((input) => {
    input.addEventListener("change", () => {
      state.layers[input.dataset.layer] = input.checked;
      render();
    });
  });
  ["baseLength", "baseWidth", "baseHeight", "cornerRadius"].forEach((key) => els[key].addEventListener("input", updateBaseFromInputs));
  svg.addEventListener("pointermove", updatePointer);
  svg.addEventListener("pointerleave", () => { cursorPanel.hidden = true; });
  svg.addEventListener("pointerdown", (event) => {
    const point = screenToModel(event);
    if (state.tool === "select") {
      state.selectedId = null;
      render();
      return;
    }
    if (state.tool === "measure" || state.tool === "dimension") addMeasurement(state.tool, point);
    else addFeature(state.tool, point);
  });
  document.getElementById("applyFeatureBtn").addEventListener("click", applyFeatureEdit);
  document.getElementById("deleteFeatureBtn").addEventListener("click", deleteSelected);
  document.getElementById("undoBtn").addEventListener("click", () => {
    state.features.pop();
    state.selectedId = null;
    render();
  });
  document.getElementById("clearBtn").addEventListener("click", () => {
    state.features = [];
    state.selectedId = null;
    render();
  });
  document.getElementById("lfaExample").addEventListener("click", loadLfaExample);
  document.getElementById("cdExample").addEventListener("click", loadCdExample);
  document.getElementById("importBtn").addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files[0];
    if (!file) return;
    const data = JSON.parse(await file.text());
    state.base = data.base || state.base;
    state.features = Array.isArray(data.features) ? data.features : [];
    state.selectedId = null;
    syncBaseInputs();
    render();
  });
  document.getElementById("exportBtn").addEventListener("click", () => exportFile("json"));
  if (nativeAdsBridge && rewardedAdBtn) {
    rewardedAdBtn.hidden = false;
    rewardedAdBtn.disabled = true;
    rewardedAdBtn.textContent = "Loading Ad";
    rewardedAdBtn.addEventListener("click", () => {
      nativeAdsBridge.postMessage({ action: "rewarded" });
      rewardedAdBtn.disabled = true;
      rewardedAdBtn.textContent = "Loading Ad";
    });
    window.microcdNativeAdStatus = ({ rewardedReady }) => {
      rewardedAdBtn.disabled = !rewardedReady;
      rewardedAdBtn.textContent = rewardedReady ? "Rewarded Ad" : "Loading Ad";
    };
    window.microcdNativeAdRewarded = () => {
      alert("Thanks for supporting Microfluidic Modeler.");
    };
    nativeAdsBridge.postMessage({ action: "status" });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setTool("select");
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      state.features.pop();
      render();
    }
  });

  loadLfaExample();
})();
