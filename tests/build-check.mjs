import { access, readFile } from "node:fs/promises";

const required = [
  "modeler/index.html",
  "modeler/modeler.js",
  "modeler/core.html",
  "analyzer/index.html",
  "analyzer/analyzer.js",
  "motor-controller/index.html",
  "motor-controller/motor-controller.css",
  "motor-controller/motor-controller.js",
  "assets/scientific-ui.css",
  "assets/scientific-ui.js",
];

for (const file of required) await access(new URL(`../${file}`, import.meta.url));

for (const entry of ["modeler/index.html", "analyzer/index.html", "motor-controller/index.html"]) {
  const html = await readFile(new URL(`../${entry}`, import.meta.url), "utf8");
  for (const match of html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)) {
    const path = match[1].split("?")[0];
    if (path.endsWith("/") || path.startsWith("/docs/") || path.startsWith("mailto:")) continue;
    await access(new URL(`..${path}`, import.meta.url));
  }
}

console.log(`Static build artifact check passed for ${required.length} required files.`);
