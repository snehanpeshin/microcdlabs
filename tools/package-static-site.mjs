import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const staticDirectories = ['assets', 'catalog', 'clair', 'products', 'modeler', 'analyzer',
  'motor-controller', 'microfluidic-chips', 'microfluidic-tubing',
  'microfluidic-fittings-connectors', 'microfluidic-pumps-flow-control', 'lateral-flow-assay-materials'];
const publicDocs = ['modeler-quick-start.md', 'analyzer-quick-start.md', 'methodology.md',
  'crp-camera.md', 'tool-capabilities.json'];
const rootExtensions = new Set(['.html', '.css', '.js', '.txt', '.xml', '.pdf']);

// A dedicated output directory prevents source, backend and test files becoming web assets.
export function packageStaticSite(root) {
  const destination = path.join(root, 'dist');
  if (fs.existsSync(destination) && fs.lstatSync(destination).isSymbolicLink()) {
    throw new Error('The static output directory must not be a symbolic link.');
  }
  fs.rmSync(destination, {recursive: true, force: true});
  fs.mkdirSync(destination);
  let count = 0;
  function copy(relative) {
    const source = path.join(root, relative);
    const stat = fs.lstatSync(source);
    if (stat.isSymbolicLink()) throw new Error(`Symbolic link is not a deployable asset: ${relative}`);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(source)) {
        if (!entry.startsWith('.') && !['node_modules', 'test-artifacts'].includes(entry)) copy(path.join(relative, entry));
      }
    } else if (stat.isFile()) {
      const target = path.join(destination, relative);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.copyFileSync(source, target);
      count++;
    }
  }
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    if (!entry.name.startsWith('.') && !entry.name.startsWith('email_signature') &&
      rootExtensions.has(path.extname(entry.name)) && !entry.isDirectory()) copy(entry.name);
  }
  for (const directory of staticDirectories) if (fs.existsSync(path.join(root, directory))) copy(directory);
  for (const name of publicDocs) if (fs.existsSync(path.join(root, 'docs', name))) copy(path.join('docs', name));
  return {destination, count};
}

export function validateStaticBundle(destination) {
  const failures = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) {
        const html = fs.readFileSync(file, 'utf8');
        for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
          const raw = match[1];
          if (/^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/.test(raw)) continue;
          const pathname = raw.split(/[?#]/)[0];
          if (!pathname) continue;
          let target = path.resolve(pathname.startsWith('/') ? destination : path.dirname(file), pathname.replace(/^\//, ''));
          if (!target.startsWith(destination + path.sep) && target !== destination) {
            failures.push(`${path.relative(destination, file)}: path escapes bundle (${raw})`);
            continue;
          }
          if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
          if (!fs.existsSync(target)) failures.push(`${path.relative(destination, file)}: missing deployed asset ${raw}`);
        }
      }
    }
  }
  walk(destination);
  if (!fs.existsSync(path.join(destination, 'index.html'))) failures.push('Missing homepage');
  if (failures.length) throw new Error(failures.join('\n'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = packageStaticSite(root);
  validateStaticBundle(result.destination);
  console.log(`Packaged and checked ${result.count} public website files in dist/.`);
}
