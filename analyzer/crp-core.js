export const CRP_VERSION = '2.1.0-beta.1';
export const REGION_FRACTION = 0.08;
export function parseCalibration(text) {
  const rows = text.trim().split(/\r?\n/).filter(line => line.trim());
  const points = rows.map((line, i) => {
    const fields = line.split(',').map(x => x.trim());
    if (fields.length !== 2 || fields.some(x => x === '') || fields.some(x => !Number.isFinite(Number(x))) || Number(fields[0]) < 0) throw new Error(`Standard ${i + 1}: enter concentration,index as two finite numbers.`);
    return { concentration: Number(fields[0]), signal: Number(fields[1]) };
  }).sort((a, b) => a.concentration - b.concentration);
  if (points.length < 3 || points[0].concentration !== 0) throw new Error('Include a zero-CRP blank and at least two nonzero standards.');
  for (let i = 1; i < points.length; i++) {
    if (points[i].concentration <= points[i - 1].concentration || points[i].signal <= points[i - 1].signal) throw new Error('Standards need unique concentrations and strictly increasing signals.');
  }
  return points;
}
export function interpolate(signal, text) {
  if (!Number.isFinite(signal)) throw new Error('Measure a valid optical signal first.');
  const points = parseCalibration(text);
  if (signal < points[0].signal) return { status: 'below-range', concentration: null, message: 'Below calibration range — no concentration reported.' };
  if (signal > points.at(-1).signal) return { status: 'above-range', concentration: null, message: 'Above calibration range — no concentration reported.' };
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (signal <= b.signal) {
      const concentration = a.concentration + (signal - a.signal) / (b.signal - a.signal) * (b.concentration - a.concentration);
      return { status: 'experimental', concentration, message: `Experimental CRP estimate: ${Number(concentration.toPrecision(5))} mg/L. Not validated for canine saliva.` };
    }
  }
}
export function imageSignal(image, sample, reference, channel = 'green') {
  const { width, height, data } = image;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || data.length !== width * height * 4) throw new Error('Invalid image dimensions.');
  const offset = { red: 0, green: 1, blue: 2 }[channel];
  if (offset === undefined) throw new Error('Choose a valid color channel.');
  for (const p of [sample, reference]) {
    if (![p.x, p.y].every(v => Number.isFinite(v) && v >= .04 && v <= .96)) throw new Error('Keep both measurement boxes inside the image.');
  }
  if (Math.abs(sample.x - reference.x) < REGION_FRACTION && Math.abs(sample.y - reference.y) < REGION_FRACTION) throw new Error('Chamber and reference boxes overlap.');
  function region(p) {
    const x0 = Math.floor((p.x - .04) * width), x1 = Math.floor((p.x + .04) * width);
    const y0 = Math.floor((p.y - .04) * height), y1 = Math.floor((p.y + .04) * height);
    let sum = 0, count = 0, clipped = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4, value = data[i + offset];
      if (data[i + 3] < 255) throw new Error('Measurement regions must not contain transparent pixels.');
      sum += value; count++; if (value <= 5 || value >= 250) clipped++;
    }
    if (!count || clipped / count >= .05 || sum / count <= 5) throw new Error('Region too dark or clipped. Reposition or retake the image.');
    return { mean: sum / count, clippedFraction: clipped / count, pixels: count };
  }
  const s = region(sample), r = region(reference);
  return { index: -Math.log10(s.mean / r.mean), sample: s, reference: r };
}
export function combineSignals(endpoint, early, mode) {
  if (mode === 'endpoint') return endpoint.index;
  if (mode !== 'change') throw new Error('Unknown measurement mode.');
  if (!early) throw new Error('Add an early image to measure the reaction change.');
  return endpoint.index - early.index;
}
export function recordSnapshot(metadata) {
  if (!metadata.sampleId?.trim()) throw new Error('Enter a sample ID before saving.');
  if (!Number.isFinite(metadata.signal)) throw new Error('Measure a valid signal before saving.');
  return structuredClone({ ...metadata, schema: 'microcd.crp.measurement', schemaVersion: 1, applicationVersion: CRP_VERSION,
    algorithm: 'image-attenuation-v1; -log10(sample/reference); 8% regions; piecewise-linear interpolation', savedAt: new Date().toISOString() });
}
