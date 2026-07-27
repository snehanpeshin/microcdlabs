import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  "accessibility.html",
  "careers.html",
  "credits.html",
  "karigari-wellness-lens-instructions.html",
  "privacy.html",
  "refunds.html",
  "terms.html",
];
let updated = 0;

for (const relativePath of targets) {
  const file = path.join(root, relativePath);
  const html = fs.readFileSync(file, "utf8");
  if (html.includes('property="og:title"')) continue;

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/)?.[1];
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/)?.[1];
  if (!title || !description || !canonical) {
    throw new Error(`Missing source metadata in ${relativePath}`);
  }

  const social = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />`;
  const revised = html.replace(
    /(<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>)/,
    `$1${social}`,
  );
  fs.writeFileSync(file, revised);
  updated += 1;
}

console.log(`Added social metadata to ${updated} pages.`);
