import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {packageStaticSite, validateStaticBundle} from '../tools/package-static-site.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'microcd-package-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
    fs.writeFileSync(path.join(root, file), content);
  };
  return {root, write};
}

test('deployment keeps public application assets and help while excluding project source', t => {
  const {root, write} = fixture(t);
  write('index.html', '<a href="modeler/">Tool</a><script src="site.js"></script>');
  write('site.js', '// Public script');
  write('modeler/index.html', '<a href="/docs/modeler-quick-start.md">Help</a><img src="../assets/demo.svg">');
  write('assets/demo.svg', '<svg/>');
  write('docs/modeler-quick-start.md', '# Help');
  for (const file of ['backend/inquiries/handler.mjs', 'tests/private.test.mjs', 'tools/internal.mjs',
    '.env', '.git/config', '.github/workflows/checks.yml', 'package.json', 'README.md',
    'email_signature.html', 'docs/website-visibility-review.md']) write(file, 'Not a website asset');
  const {destination} = packageStaticSite(root);
  assert.doesNotThrow(() => validateStaticBundle(destination));
  assert.ok(fs.existsSync(path.join(destination, 'assets/demo.svg')));
  for (const file of ['backend', 'tests', 'tools', '.env', '.git', '.github', 'package.json',
    'README.md', 'email_signature.html', 'docs/website-visibility-review.md']) {
    assert.equal(fs.existsSync(path.join(destination, file)), false, file);
  }
});

test('a missing packaged asset blocks deployment', t => {
  const {root, write} = fixture(t);
  write('index.html', '<script src="missing.js"></script>');
  const {destination} = packageStaticSite(root);
  assert.throws(() => validateStaticBundle(destination), /missing deployed asset missing.js/);
});

test('a symlink cannot copy files from outside the public bundle', t => {
  const {root, write} = fixture(t);
  write('index.html', '<h1>Home</h1>');
  write('private/secret.txt', 'Not public');
  fs.mkdirSync(path.join(root, 'assets'));
  fs.symlinkSync('../private/secret.txt', path.join(root, 'assets/secret.txt'));
  assert.throws(() => packageStaticSite(root), /Symbolic link is not a deployable asset/);
});
