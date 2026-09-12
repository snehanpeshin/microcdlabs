import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCalibration, interpolate, imageSignal, combineSignals, recordSnapshot } from '../analyzer/crp-core.js';
const calibration = '0,0\n1,0.1\n5,0.5';
const sample = { x: .25, y: .25 }, reference = { x: .75, y: .25 };
function image() {
  const width = 100, height = 100, data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4; data[i] = 150; data[i + 1] = x < 50 ? (y < 50 ? 100 : 50) : 200; data[i + 2] = 150; data[i + 3] = 255;
  }
  return { width, height, data };
}
test('interpolates within measured calibration without extrapolation', () => {
  assert.ok(Math.abs(interpolate(.3, calibration).concentration - 3) < 1e-10);
  assert.equal(interpolate(0, calibration).concentration, 0);
  assert.equal(interpolate(.5, calibration).concentration, 5);
  assert.equal(interpolate(-.1, calibration).concentration, null);
  assert.equal(interpolate(.6, calibration).status, 'above-range');
});
test('rejects incomplete, duplicate, nonmonotonic and nonfinite standards', () => {
  for (const text of ['', '1,0\n2,.1\n3,.2', '0,0\n1,.1\n1,.2', '0,0\n1,.2\n2,.1', '0,0\n1,NaN\n2,.2', '0,0\n1,\n2,.2', '0,0\n-1,.1\n2,.2']) assert.throws(() => parseCalibration(text));
  assert.throws(() => interpolate(NaN, calibration));
});
test('measures known green-channel attenuation at the selected coordinates', () => {
  assert.ok(Math.abs(imageSignal(image(), sample, reference).index - Math.log10(2)) < 1e-10);
  assert.ok(Math.abs(imageSignal(image(), { x: .25, y: .75 }, { x: .75, y: .75 }).index - Math.log10(4)) < 1e-10);
  assert.equal(imageSignal(image(), sample, reference, 'red').index, -0);
});
test('rejects overlap, clipped, transparent and invalid regions', () => {
  assert.throws(() => imageSignal(image(), sample, sample));
  assert.throws(() => imageSignal(image(), { x: NaN, y: .25 }, reference));
  assert.throws(() => imageSignal(image(), { x: .01, y: .25 }, reference));
  const clipped = image(); clipped.data.fill(255); assert.throws(() => imageSignal(clipped, sample, reference));
  const dark = image(); for (let i = 1; i < dark.data.length; i += 4) dark.data[i] = 0; assert.throws(() => imageSignal(dark, sample, reference));
  const transparent = image(); for (let i = 3; i < transparent.data.length; i += 4) transparent.data[i] = 0; assert.throws(() => imageSignal(transparent, sample, reference));
});
test('early image correction uses reference-normalized change', () => {
  assert.equal(combineSignals({ index: .5 }, { index: .2 }, 'change'), .3);
  assert.equal(combineSignals({ index: .5 }, null, 'endpoint'), .5);
  assert.throws(() => combineSignals({ index: .5 }, null, 'change'));
});
test('record snapshot keeps original calibration, image blob and regions', async () => {
  const metadata = { sampleId: 'test', signal: .3, calibration, regions: { sample: { ...sample } }, images: [{ blob: new Blob(['image-test']) }] };
  const saved = recordSnapshot(metadata); metadata.calibration = 'changed'; metadata.regions.sample.x = .8;
  assert.equal(saved.calibration, calibration); assert.equal(saved.regions.sample.x, .25);
  assert.equal(await saved.images[0].blob.text(), 'image-test'); assert.equal(saved.schemaVersion, 1);
  assert.throws(() => recordSnapshot({ sampleId: '', signal: 0 }));
  assert.throws(() => recordSnapshot({ sampleId: 'test', signal: Infinity }));
});
