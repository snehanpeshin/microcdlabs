import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const topLevelPages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && entry.name !== "email_signature.html")
  .map((entry) => entry.name);
const catalogPages = fs
  .readdirSync(path.join(root, "catalog"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => path.join("catalog", entry.name));
const researchProductPages = fs
  .readdirSync(path.join(root, "products"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, "products", entry.name, "index.html")))
  .map((entry) => path.join("products", entry.name, "index.html"));
const pages = [...topLevelPages, ...catalogPages, ...researchProductPages];
const failures = [];
const warnings = [];

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

function addWarning(file, message) {
  warnings.push(`${file}: ${message}`);
}

for (const file of pages) {
  if (process.env.DEBUG_VALIDATE) console.error(`Checking ${file}`);
  const absolute = path.join(root, file);
  const html = fs.readFileSync(absolute, "utf8");
  const isRedirectPage = file === "store.html";
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) addFailure(file, `duplicate IDs: ${[...new Set(duplicateIds)].join(", ")}`);
  if (!/<title>[^<]+<\/title>/.test(html)) addFailure(file, "missing title");
  if (!isRedirectPage && !/<meta\s+name="description"/s.test(html)) addFailure(file, "missing meta description");
  if (!/<link\s+rel="canonical"/s.test(html)) addFailure(file, "missing canonical URL");
  if (!file.startsWith("catalog/") && !isRedirectPage && !/<h1\b/.test(html)) addFailure(file, "missing H1");
  if (file.startsWith("catalog/") && !/data-product-detail=/.test(html)) addFailure(file, "missing product detail identifier");

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    const target = raw.split(/[?#]/)[0];
    if (!target || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(absolute), target);
    if (!fs.existsSync(resolved)) addFailure(file, `broken internal reference: ${raw}`);
  }

  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      addFailure(file, `invalid JSON-LD: ${error.message}`);
    }
  }

  if (!isRedirectPage && !file.startsWith("catalog/") && !/site\.js|script\.js/.test(html)) {
    addWarning(file, "no shared site behavior script");
  }
  if (!isRedirectPage && !/rel="icon"/.test(html)) addWarning(file, "missing favicon declaration");
  if (!isRedirectPage && !file.startsWith("catalog/") && !/property="og:title"/.test(html)) {
    addWarning(file, "missing Open Graph metadata");
  }
}

console.log(`Validated ${pages.length} HTML files.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
if (failures.length) {
  console.error(`\nFailures (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("\nNo blocking validation failures.");
}
