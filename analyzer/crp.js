import { CRP_VERSION, imageSignal, combineSignals, interpolate, recordSnapshot } from './crp-core.js';
const $ = id => document.getElementById(id);
const state = { images: {}, regions: { sample: { x: .35, y: .5 }, reference: { x: .7, y: .5 } }, stream: null, signal: null, optical: null, result: null, records: [], selectedRecord: null, generation: { early: 0, endpoint: 0 }, saving: false };
const canvas = $('chamber-canvas'), context = canvas.getContext('2d');
const fmt = n => Number(n.toPrecision(5)).toString();
const errorText = error => error?.message || String(error);
function status(id, text, error = false) { $(id).textContent = text; $(id).classList.toggle('crp-error', error); }
function invalidate() { $('confirmed').checked = false; status('save-status', ''); update(); }
function update() {
  state.signal = null; state.optical = null; state.result = { status: 'unavailable', concentration: null, message: 'Add a final image and select the two regions.' };
  try {
    if (!state.images.endpoint) throw new Error('Add a final image and select the two regions.');
    const mode = $('mode').value, early = state.images.early, end = state.images.endpoint;
    if (mode === 'change' && early && (end.sourceWidth !== early.sourceWidth || end.sourceHeight !== early.sourceHeight)) throw new Error('Early and final images need matching dimensions and alignment.');
    const read = image => imageSignal(image.pixels, state.regions.sample, state.regions.reference, $('channel').value);
    const finalReading = read(end), earlyReading = mode === 'change' && early ? read(early) : null;
    state.signal = combineSignals(finalReading, earlyReading, mode);
    state.optical = { endpoint: finalReading, early: earlyReading };
    state.result = { status: 'uncalibrated', concentration: null, message: 'Optical signal only. Enter measured standards and confirm a matching calibration profile.' };
    if ($('confirmed').checked && $('profile').value.trim()) state.result = interpolate(state.signal, $('calibration').value);
  } catch (error) { state.result = { status: 'unavailable', concentration: null, message: errorText(error) }; }
  $('optical-signal').textContent = state.signal === null ? 'Not measured' : fmt(state.signal);
  $('crp-result').textContent = state.result.message;
  const ready = state.signal !== null && $('crp-sample-id').value.trim() !== '';
  $('save-record').disabled = !ready || state.saving;
  $('export-record').disabled = !ready;
}
function draw() {
  const image = state.images[$('view-image').value];
  $('image-workspace').hidden = !Object.keys(state.images).length;
  if (!image) { context.clearRect(0, 0, canvas.width, canvas.height); return; }
  canvas.width = image.pixels.width; canvas.height = image.pixels.height;
  context.putImageData(image.pixels, 0, 0);
  for (const [name, point] of Object.entries(state.regions)) {
    const color = name === 'sample' ? '#ffad32' : '#63cfff', x = point.x * canvas.width, y = point.y * canvas.height;
    context.strokeStyle = color; context.lineWidth = 3;
    context.strokeRect(x - canvas.width * .04, y - canvas.height * .04, canvas.width * .08, canvas.height * .08);
    context.font = 'bold 20px sans-serif'; context.fillStyle = '#101923'; context.fillRect(x - 12, y - 12, 24, 24);
    context.fillStyle = color; context.fillText(name === 'sample' ? 'S' : 'R', x - 7, y + 7);
  }
  const selected = state.regions[$('region').value];
  $('region-x').value = (selected.x * 100).toFixed(1); $('region-y').value = (selected.y * 100).toFixed(1);
}
async function acceptImage(blob, role, captureDetails) {
  const generation = ++state.generation[role];
  delete state.images[role]; invalidate(); draw();
  if (blob.size > 20 * 1024 * 1024 || !/^image\/(png|jpeg|webp)$/.test(blob.type)) throw new Error('Choose a PNG, JPEG or WebP image no larger than 20 MB.');
  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  try {
    if (bitmap.width * bitmap.height > 80_000_000 || !bitmap.width || !bitmap.height) throw new Error('Image exceeds 80 megapixels. Choose a smaller image.');
    const surface = document.createElement('canvas'); surface.width = 600; surface.height = Math.max(1, Math.round(600 * bitmap.height / bitmap.width));
    if (surface.height > 6000) throw new Error('Image aspect ratio is too tall. Crop to the chamber and reference.');
    const ctx = surface.getContext('2d', { willReadFrequently: true }); ctx.drawImage(bitmap, 0, 0, surface.width, surface.height);
    const pixels = ctx.getImageData(0, 0, surface.width, surface.height);
    const normalized = await new Promise(resolve => surface.toBlob(resolve, 'image/png'));
    if (!normalized) throw new Error('Could not prepare image.');
    if (state.generation[role] !== generation) return;
    state.images[role] = { pixels, blob: normalized, sourceWidth: bitmap.width, sourceHeight: bitmap.height, acquiredAt: new Date().toISOString(), captureDetails };
    $('view-image').value = role;
    status('image-status', `${role === 'early' ? 'Early' : 'Final'} image ready. Select the liquid and reference regions.`);
    invalidate(); draw();
  } finally { bitmap.close(); }
}
for (const role of ['endpoint', 'early']) $(role + '-file').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  try { await acceptImage(file, role, { source: 'file', name: file.name, controls: 'unknown; timestamp is import time' }); }
  catch (error) { status('image-status', errorText(error), true); }
});
$('mode').addEventListener('change', () => { $('early-field').hidden = $('mode').value !== 'change'; $('capture-target-label').hidden = $('mode').value !== 'change'; if ($('mode').value === 'endpoint') $('capture-target').value = 'endpoint'; invalidate(); });
for (const id of ['channel', 'profile', 'calibration']) $(id).addEventListener('input', invalidate);
$('confirmed').addEventListener('change', update); $('crp-sample-id').addEventListener('input', update);
$('region').addEventListener('change', draw); $('view-image').addEventListener('change', draw);
canvas.addEventListener('click', event => {
  const rect = canvas.getBoundingClientRect();
  state.regions[$('region').value] = { x: Math.max(.04, Math.min(.96, (event.clientX - rect.left) / rect.width)), y: Math.max(.04, Math.min(.96, (event.clientY - rect.top) / rect.height)) };
  invalidate(); draw();
});
for (const [id, axis] of [['region-x', 'x'], ['region-y', 'y']]) $(id).addEventListener('change', () => {
  const v = Number($(id).value); if (Number.isFinite(v) && v >= 4 && v <= 96) state.regions[$('region').value][axis] = v / 100;
  invalidate(); draw();
});
function closeCamera() { state.stream?.getTracks().forEach(t => t.stop()); state.stream = null; $('camera-video').srcObject = null; $('live-camera').hidden = true; $('capture-frame').disabled = true; $('start-camera').disabled = false; }
$('start-camera').addEventListener('click', async () => {
  $('start-camera').disabled = true;
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Live camera requires HTTPS and browser support. Use the image picker instead.');
    state.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    if (document.hidden) { closeCamera(); return; }
    $('camera-video').srcObject = state.stream; $('live-camera').hidden = false;
    await $('camera-video').play(); $('capture-frame').disabled = false;
    status('camera-status', 'Live camera ready. Automatic controls may change the signal. Try locking available controls; use identical settings for standards and samples.');
    state.stream.getVideoTracks()[0].addEventListener('ended', () => { closeCamera(); status('camera-status', 'Camera disconnected. Reopen it or import an image.'); });
  } catch (error) { closeCamera(); status('camera-status', `Camera unavailable: ${errorText(error)} Use the image picker instead.`, true); }
});
$('stop-camera').addEventListener('click', closeCamera);
window.addEventListener('pagehide', closeCamera);
document.addEventListener('visibilitychange', () => { if (document.hidden) closeCamera(); });
$('lock-camera').addEventListener('click', async () => {
  const track = state.stream?.getVideoTracks()[0]; if (!track) return;
  const capabilities = track.getCapabilities?.() || {}, settings = track.getSettings();
  const advanced = {};
  for (const [mode, values] of [['exposureMode', ['exposureTime', 'iso']], ['focusMode', ['focusDistance']], ['whiteBalanceMode', ['colorTemperature']]]) {
    if (capabilities[mode]?.includes('manual') && values.every(k => Number.isFinite(settings[k]))) {
      advanced[mode] = 'manual'; for (const key of values) advanced[key] = settings[key];
    }
  }
  if (!Object.keys(advanced).length) { status('camera-status', 'This browser does not expose lockable camera controls. Use a calibrated fixed capture setup or the native iPhone app.'); return; }
  try {
    await track.applyConstraints({ advanced: [advanced] });
    const actual = track.getSettings(); const modes = Object.keys(advanced).filter(k => k.endsWith('Mode'));
    const locked = modes.filter(k => actual[k] === 'manual');
    status('camera-status', locked.length ? `Browser reports manual ${locked.join(', ')}. Other controls and image processing may remain automatic. Settings are stored in each capture record.` : 'The browser did not confirm the requested locks. Treat controls as automatic.');
  } catch (error) { status('camera-status', `Could not lock controls: ${errorText(error)}`, true); }
});
$('capture-frame').addEventListener('click', async () => {
  const video = $('camera-video'), track = state.stream?.getVideoTracks()[0];
  if (!track || !video.videoWidth || !video.videoHeight) return;
  $('capture-frame').disabled = true;
  try {
    const surface = document.createElement('canvas'); surface.width = video.videoWidth; surface.height = video.videoHeight;
    surface.getContext('2d').drawImage(video, 0, 0);
    const settings = { ...track.getSettings() }; delete settings.deviceId; delete settings.groupId;
    const blob = await new Promise(resolve => surface.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Camera frame unavailable.');
    await acceptImage(blob, $('capture-target').value, { source: 'browser-camera', settings, controls: $('camera-status').textContent });
    closeCamera();
  } catch (error) { status('image-status', errorText(error), true); $('capture-frame').disabled = !state.stream; }
});
function currentRecord() {
  const roles = $('mode').value === 'change' ? ['early', 'endpoint'] : ['endpoint'];
  return recordSnapshot({ id: crypto.randomUUID(), sampleId: $('crp-sample-id').value.trim(), mode: $('mode').value, channel: $('channel').value,
    regions: state.regions, signal: state.signal, optical: state.optical, profile: $('profile').value, calibration: $('calibration').value,
    calibrationConfirmed: $('confirmed').checked, result: state.result,
    images: roles.map(role => { const image = state.images[role]; return { role, blob: image.blob, acquiredAt: image.acquiredAt, captureDetails: image.captureDetails, sourceWidth: image.sourceWidth, sourceHeight: image.sourceHeight, width: image.pixels.width, height: image.pixels.height }; }) });
}
let dbPromise;
function database() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('microcd-crp-records', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other analyzer tabs and try again.'));
  }).catch(error => { dbPromise = null; throw error; });
  return dbPromise;
}
async function saveRecord(record) {
  const db = await database();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction('records', 'readwrite'); transaction.objectStore('records').add(record);
    transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error || new Error('Save cancelled.'));
  });
}
async function refresh() {
  try {
    const db = await database();
    state.records = await new Promise((resolve, reject) => { const request = db.transaction('records').objectStore('records').getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    state.records.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    $('record-list').replaceChildren(); $('record-list').classList.remove('crp-error');
    if (!state.records.length) $('record-list').textContent = 'No saved measurements yet.';
    for (const record of state.records) {
      const row = document.createElement('div'); row.className = 'crp-record-row';
      const info = document.createElement('div'), title = document.createElement('strong'), detail = document.createElement('p'), button = document.createElement('button');
      title.textContent = record.sampleId; detail.textContent = `${new Date(record.savedAt).toLocaleString()} · ${record.result.message}`;
      info.append(title, detail); button.className = 'button'; button.textContent = 'Open record'; button.addEventListener('click', () => openRecord(record)); row.append(info, button); $('record-list').append(row);
    }
  } catch (error) { status('record-list', `Local storage unavailable: ${errorText(error)}. You can still export a record without saving it.`, true); }
}
$('save-record').addEventListener('click', async () => {
  state.saving = true; update();
  try { const record = currentRecord(); await saveRecord(record); status('save-status', `Saved ${record.sampleId} with its image and calibration in this browser.`); await refresh(); }
  catch (error) { status('save-status', `Save failed: ${errorText(error)}. Export a record to keep a copy.`, true); }
  finally { state.saving = false; update(); }
});
const blobDataURL = blob => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });
async function exportRecord(record) {
  const images = await Promise.all(record.images.map(async ({ blob, ...metadata }) => ({ ...metadata, pngDataURL: await blobDataURL(blob) })));
  const blob = new Blob([JSON.stringify({ ...record, images }, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = `${record.sampleId.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80)}-crp.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('export-record').addEventListener('click', async () => { try { await exportRecord(currentRecord()); status('save-status', 'Record export prepared, including images.'); } catch (error) { status('save-status', errorText(error), true); } });
$('refresh-records').addEventListener('click', refresh);
let detailURLs = [];
function openRecord(record) {
  closeCamera(); state.selectedRecord = record; $('record-title').textContent = record.sampleId;
  detailURLs.forEach(URL.revokeObjectURL); detailURLs = []; $('record-detail').replaceChildren();
  const result = document.createElement('p'); result.textContent = record.result.message; $('record-detail').append(result);
  const text = document.createElement('pre'); text.textContent = `Saved: ${record.savedAt}\nMode: ${record.mode}; channel: ${record.channel}\nSignal: ${record.signal}\nProfile: ${record.profile || 'Not supplied'}\nCalibration confirmed: ${record.calibrationConfirmed}\nStandards (mg/L, signal):\n${record.calibration}\nRegions: ${JSON.stringify(record.regions)}`; $('record-detail').append(text);
  for (const item of record.images) {
    const heading = document.createElement('h3'), details = document.createElement('p'), image = document.createElement('img');
    heading.textContent = `${item.role === 'early' ? 'Early' : 'Final'} image`;
    details.textContent = `${item.acquiredAt} · ${JSON.stringify(item.captureDetails)}`;
    image.alt = `${item.role} chamber image for ${record.sampleId}`; const url = URL.createObjectURL(item.blob); detailURLs.push(url); image.src = url;
    $('record-detail').append(heading, details, image);
  }
  $('record-dialog').showModal();
}
$('close-record').addEventListener('click', () => $('record-dialog').close());
$('record-dialog').addEventListener('close', () => { detailURLs.forEach(URL.revokeObjectURL); detailURLs = []; state.selectedRecord = null; });
$('download-saved').addEventListener('click', async () => { try { if (state.selectedRecord) await exportRecord(state.selectedRecord); } catch (error) { status('save-status', errorText(error), true); } });
update(); refresh();
