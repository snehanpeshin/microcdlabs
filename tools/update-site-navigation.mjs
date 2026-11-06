import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSiteNavigation } from "./site-navigation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules"]);

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(target);
    return entry.isFile() && entry.name.endsWith(".html") ? [target] : [];
  });
}

const navigationPattern = /[ \t]*<nav class="main-nav" aria-label="Primary navigation">[\s\S]*?<\/nav>/;
let updated = 0;

for (const file of collectHtmlFiles(root)) {
  const html = fs.readFileSync(file, "utf8");
  if (!navigationPattern.test(html)) continue;

  const relativeDirectory = path.relative(root, path.dirname(file));
  const depth = relativeDirectory ? relativeDirectory.split(path.sep).length : 0;
  const prefix = "../".repeat(depth);
  const nextHtml = html
    .replace(navigationPattern, renderSiteNavigation(prefix))
    .replace(/site\.js\?v=[^"]+/g, "site.js?v=20261106")
    .replace(/chat-widget\.js\?v=[^"]+/g, "chat-widget.js?v=20261106");

  if (nextHtml !== html) {
    fs.writeFileSync(file, nextHtml);
    updated += 1;
  }
}

console.log(`Updated primary navigation in ${updated} HTML files.`);
