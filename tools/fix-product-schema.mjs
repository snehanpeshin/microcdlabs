import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogDirectory = path.join(root, "catalog");
const files = fs.readdirSync(catalogDirectory).filter((file) => file.endsWith(".html"));
let updated = 0;

for (const file of files) {
  const fullPath = path.join(catalogDirectory, file);
  const html = fs.readFileSync(fullPath, "utf8");
  const revised = html.replace(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g,
    (block, source) => {
      let data;
      try {
        data = JSON.parse(source);
      } catch {
        return block;
      }

      if (!Array.isArray(data["@graph"])) return block;
      const graph = data["@graph"].filter((entry) => {
        if (entry["@type"] !== "Product") return true;
        return Boolean(entry.offers || entry.review || entry.aggregateRating);
      });
      if (graph.length === data["@graph"].length) return block;

      data["@graph"] = graph;
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 6)}\n    </script>`;
    },
  );

  if (revised !== html) {
    fs.writeFileSync(fullPath, revised);
    updated += 1;
  }
}

console.log(`Removed unsupported Product rich-result markup from ${updated} catalog pages.`);
