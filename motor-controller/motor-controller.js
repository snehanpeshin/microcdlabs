const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  port: null,
  reader: null,
  writer: null,
  connected: false,
  reading: false,
  readPromise: null,
  inputBuffer: "",
  logging: false,
  csvRows: [],
  csvFilename: null,
  current: { target: null, measured: null, error: null },
  history: [],
  profileToken: null,
  profileStart: null,
  profileStartedAt: null,
  profileSamples: [],
  profileSteps: [],
};

const telemetryPattern = /TARGET_RPM\s*=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\s+MEASURED_RPM\s*=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\s+ERROR_RPM\s*=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)/i;
const targetSetPattern = /TARGET_RPM_SET_TO\s*=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)/i;
const statusPattern = /^(STATUS|ERROR)\s*=\s*(.+)$/i;

function timestamp() {
  return new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 });
}

function appendLog(direction, message) {
  const log = $("#serial-log");
  log.textContent += `[${timestamp()}] ${direction.padEnd(3)}  ${message}\n`;
  const lines = log.textContent.split("\n");
  if (lines.length > 2001) log.textContent = lines.slice(-2001).join("\n");
  log.scrollTop = log.scrollHeight;
}

function setConnectionState(connected, label = connected ? "Connected" : "Disconnected") {
  state.connected = connected;
  $("#connection-status").textContent = label;
  $("#connection-dot").classList.toggle("connected", connected);
  $("#connect-button").textContent = connected ? "Disconnect" : "Connect USB device";
  $("#baud-rate").disabled = connected;
  $$(".requires-connection").forEach((element) => { element.disabled = !connected; });
  // Hardware safety: STOP remains enabled for the full connected lifetime.
  $("#emergency-stop").disabled = !connected;
  $("#stop-profile").disabled = !connected || !state.profileToken;
}

async function connectSerial() {
  if (!("serial" in navigator)) return;
  if (state.connected) {
    await disconnectSerial(true);
    return;
  }
  try {
    const baudRate = Number($("#baud-rate").value);
    state.port = await navigator.serial.requestPort();
    await state.port.open({ baudRate });
    state.writer = state.port.writable.getWriter();
    state.connected = true;
    setConnectionState(true);
    $("#last-status").textContent = "Connected — motor remains idle until a command is sent";
    appendLog("SYS", `Connected at ${baudRate} baud`);
    state.readPromise = readSerial().catch(handleSerialFailure);
  } catch (error) {
    if (error.name !== "NotFoundError") handleSerialFailure(error);
  }
}

async function readSerial() {
  state.reading = true;
  const decoder = new TextDecoder();
  while (state.port?.readable && state.reading) {
    state.reader = state.port.readable.getReader();
    try {
      while (state.reading) {
        const { value, done } = await state.reader.read();
        if (done) break;
        state.inputBuffer += decoder.decode(value, { stream: true });
        const parts = state.inputBuffer.split(/[\r\n;]+/);
        state.inputBuffer = parts.pop() || "";
        parts.filter(Boolean).forEach(handleLine);
      }
    } finally {
      state.reader.releaseLock();
      state.reader = null;
    }
  }
}

async function sendCommand(command, emergency = false) {
  if (!state.connected || !state.writer) {
    appendLog("ERR", `Not connected; command not sent: ${command}`);
    return false;
  }
  try {
    await state.writer.write(new TextEncoder().encode(`${command.trim()}\n`));
    appendLog("TX", command.trim());
    return true;
  } catch (error) {
    handleSerialFailure(error);
    return false;
  }
}

async function emergencyStop() {
  if (!state.connected) return;
  // Hardware safety: short stop is always issued before the explicit hard stop.
  await sendCommand("S", true);
  await sendCommand("STOP", true);
  if (state.profileToken) finishProfile("stopped");
  $("#last-status").textContent = "Emergency stop requested — S and STOP sent";
}

async function disconnectSerial(sendStop) {
  if (!state.port) return;
  if (sendStop && state.connected) await emergencyStop();
  state.reading = false;
  try { await state.reader?.cancel(); } catch (_) { /* Port may already be gone. */ }
  try { await state.readPromise; } catch (_) { /* The read loop reports its own failure. */ }
  state.readPromise = null;
  try { state.writer?.releaseLock(); } catch (_) { /* Lock may already be released. */ }
  state.writer = null;
  try { await state.port.close(); } catch (_) { /* Disconnected devices may reject close. */ }
  state.port = null;
  setConnectionState(false);
  appendLog("SYS", "Disconnected");
}

function handleSerialFailure(error) {
  appendLog("ERR", `Serial connection lost: ${error.message || error}`);
  $("#last-status").textContent = `Serial connection lost: ${error.message || error}`;
  state.connected = false;
  state.reading = false;
  state.writer = null;
  state.port = null;
  setConnectionState(false);
  if (state.profileToken) finishProfile("connection-lost");
}

function handleLine(rawLine) {
  const line = rawLine.trim();
  if (!line) return;
  appendLog("RX", line);
  const telemetry = line.match(telemetryPattern);
  const targetSet = line.match(targetSetPattern);
  const status = line.match(statusPattern);
  if (telemetry) {
    state.current.target = Number(telemetry[1]);
    state.current.measured = Number(telemetry[2]);
    state.current.error = Number(telemetry[3]);
    $("#target-rpm").textContent = state.current.target.toFixed(2);
    $("#measured-rpm").textContent = state.current.measured.toFixed(2);
    $("#error-rpm").textContent = state.current.error.toFixed(2);
    state.history.push({ target: state.current.target, measured: state.current.measured });
    if (state.history.length > 300) state.history.shift();
    if (state.profileToken) state.profileSamples.push({ measured: state.current.measured, error: state.current.error });
    drawPlot();
  } else if (targetSet) {
    state.current.target = Number(targetSet[1]);
    $("#target-rpm").textContent = state.current.target.toFixed(2);
  } else if (status) {
    $("#last-status").textContent = `${status[1].toUpperCase()}: ${status[2]}`;
  }
  if (state.logging) state.csvRows.push([new Date().toISOString(), state.current.target, state.current.measured, state.current.error, line]);
}

function sendRpm(value) {
  const rpm = Number(value);
  const limit = Number($("#max-rpm").value);
  if (!Number.isFinite(rpm) || Math.abs(rpm) > limit) {
    window.alert(`RPM must be a finite value within ±${limit}.`);
    return false;
  }
  sendCommand(`RPM,${rpm}`);
  return true;
}

function addProfileRow(rpm = 0, hold = 1) {
  const row = document.createElement("tr");
  row.innerHTML = `<td><input class="step-rpm" type="number" step="0.1" value="${rpm}"></td><td><input class="step-hold" type="number" min="0.001" step="0.1" value="${hold}"></td><td><button class="remove-step" type="button" aria-label="Remove profile step">Remove</button></td>`;
  row.querySelector(".remove-step").addEventListener("click", () => row.remove());
  $("#profile-body").append(row);
}

function readProfile() {
  const limit = Number($("#max-rpm").value);
  const steps = $$("#profile-body tr").map((row, index) => {
    const rpm = Number(row.querySelector(".step-rpm").value);
    const holdSeconds = Number(row.querySelector(".step-hold").value);
    if (!Number.isFinite(rpm) || !Number.isFinite(holdSeconds) || holdSeconds <= 0) throw new Error(`Step ${index + 1} contains invalid values.`);
    if (Math.abs(rpm) > limit) throw new Error(`Step ${index + 1} exceeds the application max RPM.`);
    return { rpm, hold_seconds: holdSeconds };
  });
  if (!steps.length) throw new Error("Add at least one profile step.");
  return steps;
}

async function runProfile() {
  let steps;
  try { steps = readProfile(); } catch (error) { window.alert(error.message); return; }
  const token = Symbol("profile");
  state.profileToken = token;
  state.profileStart = performance.now();
  state.profileStartedAt = new Date();
  state.profileSamples = [];
  state.profileSteps = steps;
  $("#run-profile").disabled = true;
  $("#stop-profile").disabled = false;
  for (let index = 0; index < steps.length && state.profileToken === token; index += 1) {
    const step = steps[index];
    $("#profile-status").textContent = `Step ${index + 1}/${steps.length}: ${step.rpm} RPM for ${step.hold_seconds} s`;
    await sendCommand(`RPM,${step.rpm}`);
    await new Promise((resolve) => setTimeout(resolve, step.hold_seconds * 1000));
  }
  if (state.profileToken === token) {
    await sendCommand("STOP");
    finishProfile("completed");
  }
}

function finishProfile(outcome) {
  if (!state.profileToken) return;
  state.profileToken = null;
  $("#run-profile").disabled = !state.connected;
  $("#stop-profile").disabled = true;
  $("#profile-status").textContent = outcome === "completed" ? "Profile complete — STOP sent" : `Profile ${outcome}`;
  const duration = (performance.now() - state.profileStart) / 1000;
  const maximum = state.profileSamples.length ? Math.max(...state.profileSamples.map((sample) => Math.abs(sample.measured))) : null;
  const averageError = state.profileSamples.length ? state.profileSamples.reduce((sum, sample) => sum + Math.abs(sample.error), 0) / state.profileSamples.length : null;
  const report = { format:"microcdlabs-clair-run-report", version:1, outcome, started_at:state.profileStartedAt.toISOString(), finished_at:new Date().toISOString(), duration_seconds:Number(duration.toFixed(3)), max_rpm:maximum === null ? null : Number(maximum.toFixed(3)), max_rpm_definition:"peak absolute measured RPM", average_error_rpm:averageError === null ? null : Number(averageError.toFixed(3)), average_error_definition:"mean absolute telemetry ERROR_RPM", telemetry_samples:state.profileSamples.length, csv_path:state.csvFilename, profile_steps:state.profileSteps };
  downloadJson(report, `clair_profile_report_${fileStamp()}.json`);
  appendLog("SYS", `Profile report downloaded (${outcome})`);
}

function fileStamp() { return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); }
function downloadBlob(content, type, filename) { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }
function downloadJson(value, filename) { downloadBlob(`${JSON.stringify(value, null, 2)}\n`, "application/json", filename); }

function exportProfile() {
  try { downloadJson({ format:"microcdlabs-clair-rpm-profile", version:1, steps:readProfile() }, "clair_rpm_profile.json"); } catch (error) { window.alert(error.message); }
}

async function importProfile(file) {
  try {
    const documentValue = JSON.parse(await file.text());
    if (documentValue.format !== "microcdlabs-clair-rpm-profile" || documentValue.version !== 1 || !Array.isArray(documentValue.steps)) throw new Error("Unsupported Clair profile file.");
    const limit = Number($("#max-rpm").value);
    const steps = documentValue.steps.map((step, index) => {
      const rpm = Number(step.rpm); const hold = Number(step.hold_seconds);
      if (!Number.isFinite(rpm) || !Number.isFinite(hold) || hold <= 0 || Math.abs(rpm) > limit) throw new Error(`Step ${index + 1} is invalid or exceeds the application limit.`);
      return { rpm, hold_seconds:hold };
    });
    if (!steps.length) throw new Error("Profile contains no steps.");
    $("#profile-body").replaceChildren();
    steps.forEach((step) => addProfileRow(step.rpm, step.hold_seconds));
    $("#profile-status").textContent = `Imported ${file.name} · ${steps.length} steps`;
  } catch (error) { window.alert(`Unable to import profile: ${error.message}`); }
}

function csvEscape(value) { const text = value ?? ""; return /[",\n]/.test(String(text)) ? `"${String(text).replaceAll('"', '""')}"` : String(text); }
function startLogging() { state.logging = true; state.csvRows = [["timestamp","target_rpm","measured_rpm","error_rpm","raw_line"]]; state.csvFilename = `clair_telemetry_${fileStamp()}.csv`; $("#start-logging").disabled = true; $("#stop-logging").disabled = false; $("#logging-state").textContent = `Recording ${state.csvFilename}`; appendLog("SYS", "CSV logging started"); }
function stopLogging() { if (!state.logging) return; state.logging = false; downloadBlob(state.csvRows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n", "text/csv", state.csvFilename); $("#start-logging").disabled = false; $("#stop-logging").disabled = true; $("#logging-state").textContent = "Not logging"; appendLog("SYS", `CSV downloaded: ${state.csvFilename}`); }

function drawPlot() {
  const canvas = $("#rpm-plot"); const context = canvas.getContext("2d"); const ratio = window.devicePixelRatio || 1; const width = canvas.clientWidth; const height = canvas.clientHeight;
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) { canvas.width = width * ratio; canvas.height = height * ratio; }
  context.setTransform(ratio,0,0,ratio,0,0); context.clearRect(0,0,width,height);
  const styles = getComputedStyle(document.body); const grid = styles.getPropertyValue("--mc-grid"); const muted = styles.getPropertyValue("--mc-muted");
  context.strokeStyle = grid; context.lineWidth = 1; for (let x=48;x<width;x+=Math.max(50,(width-60)/10)) { context.beginPath(); context.moveTo(x,12); context.lineTo(x,height-28); context.stroke(); } for (let y=12;y<height-28;y+=(height-40)/6) { context.beginPath(); context.moveTo(48,y); context.lineTo(width-12,y); context.stroke(); }
  context.fillStyle = muted; context.font = "11px system-ui"; context.fillText("RPM",8,18); context.fillText("Samples",width-58,height-8);
  if (state.history.length < 2) return;
  const values = state.history.flatMap((point) => [point.target,point.measured]); const minimum = Math.min(0,...values); const maximum = Math.max(1,...values); const range = maximum-minimum || 1;
  const plotLine = (key,color) => { context.strokeStyle=color; context.lineWidth=2; context.beginPath(); state.history.forEach((point,index) => { const x=48+(index/(Math.max(1,state.history.length-1)))*(width-60); const y=12+((maximum-point[key])/range)*(height-40); if(index===0)context.moveTo(x,y);else context.lineTo(x,y); }); context.stroke(); };
  plotLine("target",styles.getPropertyValue("--mc-target")); plotLine("measured",styles.getPropertyValue("--mc-measured"));
}

function applyTheme(theme) { document.body.dataset.theme = theme; localStorage.setItem("clair-motor-theme",theme); $("#theme-toggle").textContent = theme === "dark" ? "Light theme" : "Dark theme"; drawPlot(); }

$("#connect-button").addEventListener("click", connectSerial);
$("#send-rpm").addEventListener("click", () => sendRpm($("#rpm-input").value));
$$('.preset').forEach((button) => button.addEventListener("click", () => sendRpm(button.dataset.rpm)));
$("#emergency-stop").addEventListener("click", emergencyStop);
$("#send-max").addEventListener("click", () => sendCommand(`MAX,${Number($("#max-rpm").value)}`));
$("#send-limit").addEventListener("click", () => sendCommand(`LIMIT,${Number($("#voltage-limit").value)}`));
$("#add-step").addEventListener("click", () => addProfileRow());
$("#export-profile").addEventListener("click", exportProfile);
$("#import-profile").addEventListener("click", () => $("#profile-file").click());
$("#profile-file").addEventListener("change", (event) => { if (event.target.files[0]) importProfile(event.target.files[0]); event.target.value=""; });
$("#run-profile").addEventListener("click", runProfile);
$("#stop-profile").addEventListener("click", emergencyStop);
$("#start-logging").addEventListener("click", startLogging);
$("#stop-logging").addEventListener("click", stopLogging);
$("#clear-log").addEventListener("click", () => { $("#serial-log").textContent=""; });
$("#theme-toggle").addEventListener("click", () => applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
window.addEventListener("resize", drawPlot);
navigator.serial?.addEventListener("disconnect", () => handleSerialFailure(new Error("USB device disconnected")));

const supported = "serial" in navigator;
$("#browser-support").textContent = supported ? "Web Serial ready · Chrome or Edge" : "Web Serial unavailable · use Chrome or Edge";
$("#browser-support").classList.add(supported ? "supported" : "unsupported");
$("#connect-button").disabled = !supported;
applyTheme(localStorage.getItem("clair-motor-theme") || "dark");
setConnectionState(false);
addProfileRow(50,5); addProfileRow(100,5); addProfileRow(150,5);
drawPlot();
