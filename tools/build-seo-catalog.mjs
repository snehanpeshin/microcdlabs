import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDate = "2026-07-28";
const siteUrl = "https://www.microcdlabs.com";

const categoryDefinitions = [
  {
    slug: "microfluidic-chips",
    title: "Microfluidic Chips for Research | MicroCD Labs",
    h1: "Microfluidic chips for research and product development",
    eyebrow: "Microfluidic chips",
    description: "Compare PDMS, glass, COC, and PMMA microfluidic chips for research, assay development, droplet generation, cell culture, and custom prototyping.",
    answer: "Choose a chip material around the fluid, optical method, channel geometry, required volume, and development stage. PDMS is practical for early soft-lithography work; glass supports optical and solvent-intensive workflows; COC and PMMA can suit cartridge-oriented development when the manufacturing path is considered early.",
    category: "microfluidics",
    image: "../assets/catalog-custom/microfluidic-chips.jpg",
    considerations: [
      ["Material and chemistry", "Review solvent exposure, adsorption, autofluorescence, gas permeability, and bonding method."],
      ["Geometry and interfaces", "Define channel dimensions, ports, dead volume, pressure, and compatible tubing or fittings."],
      ["Prototype to production", "Match the chip process to the current experiment and the likely scale-up route."],
    ],
  },
  {
    slug: "microfluidic-tubing",
    title: "Microfluidic Tubing by Material and Size | MicroCD Labs",
    h1: "Microfluidic tubing for controlled research flow",
    eyebrow: "Tubing selection",
    description: "Compare PTFE, FEP, PEEK, silicone, flexible laboratory, and microbore tubing for microfluidic systems by material, dimensions, flexibility, and application.",
    answer: "Choose microfluidic tubing by material compatibility first, then confirm inner diameter, outer diameter, pressure, bend radius, connection method, and required length. PTFE supports broad chemical resistance, FEP adds optical clarity and flexibility, PEEK is used for rigid high-performance fluid paths, and silicone suits compliant or peristaltic-pump sections.",
    category: "fluid-handling",
    subclass: "Tubing",
    image: "../assets/catalog-custom/tubing-assortment.jpg",
    considerations: [
      ["Material compatibility", "Confirm solvent, analyte, adsorption, leachables, sterilization, and temperature requirements."],
      ["ID and OD", "Inner diameter influences resistance and internal volume; outer diameter must match the connector."],
      ["System behavior", "Consider pressure, flexibility, pulsation, permeability, and whether the line enters a pump head."],
    ],
  },
  {
    slug: "microfluidic-fittings-connectors",
    title: "Microfluidic Fittings and Connectors | MicroCD Labs",
    h1: "Microfluidic fittings and connectors for reliable fluid paths",
    eyebrow: "Connections and manifolds",
    description: "Browse luer, barbed, compression, PEEK, manifold, and reservoir interfaces for research microfluidic tubing and chip connections.",
    answer: "Select a microfluidic connector by matching tube OD, thread or port standard, wetted material, pressure rating, and required dead volume. A connector that physically fits can still be unsuitable if its ferrule, bore, solvent resistance, or sealing method does not match the complete fluid path.",
    category: "fluid-handling",
    subclasses: ["Connectors and manifolds", "Reservoirs", "Fluidic accessories"],
    image: "../assets/catalog-custom/fittings-connectors.jpg",
    considerations: [
      ["Interface standard", "Confirm luer, barb, 1/4-28, 10-32, compression, press-fit, or application-specific geometry."],
      ["Wetted materials", "Review PEEK, ETFE, PTFE, polypropylene, elastomer, or metal exposure against the fluid."],
      ["Dead volume and service", "Minimize unswept volume and choose an interface that can be assembled consistently."],
    ],
  },
  {
    slug: "microfluidic-pumps-flow-control",
    title: "Microfluidic Pumps and Flow Control | MicroCD Labs",
    h1: "Microfluidic pumps and flow-control components",
    eyebrow: "Pumps and flow control",
    description: "Compare syringe pumps, peristaltic pumps, pressure controllers, valves, flow sensors, and pressure sensors for research microfluidic systems.",
    answer: "Use a syringe pump for direct programmed displacement, a pressure controller for responsive low-pulsation flow, and a peristaltic pump when tubing-only wetted paths or recirculation matter. Final selection depends on flow range, pressure, fluid properties, pulsation tolerance, feedback needs, and channel resistance.",
    category: "flow-control",
    image: "../assets/catalog-custom/pumps-flow-control.jpg",
    considerations: [
      ["Flow and pressure range", "Define minimum controllable flow, maximum pressure, stability, and transient response."],
      ["Control method", "Compare displacement, pressure-driven, and tubing-compression approaches for the experiment."],
      ["Feedback and automation", "Determine whether flow, pressure, valve state, software control, or closed-loop sensing is required."],
    ],
  },
  {
    slug: "lateral-flow-assay-materials",
    title: "Lateral Flow Assay Materials and Consumables | MicroCD Labs",
    h1: "Lateral flow assay materials for diagnostic research",
    eyebrow: "LFIA materials",
    description: "Browse nitrocellulose membranes, sample pads, conjugate pads, absorbent pads, housings, and development support for research lateral flow assays.",
    answer: "Select lateral flow assay materials as a system: membrane capillary behavior, sample treatment, conjugate release, absorbent capacity, overlap, housing compression, and assay chemistry all affect performance. Evaluate materials with the intended sample and reagent workflow rather than choosing each pad independently.",
    category: "diagnostics",
    image: "../assets/catalog-custom/diagnostics-consumables.jpg",
    considerations: [
      ["Membrane and flow", "Match capillary flow time, protein binding, pore structure, and test-line process to the assay."],
      ["Pads and chemistry", "Review sample conditioning, conjugate release, buffer compatibility, capacity, and overlap."],
      ["Housing and assembly", "Control strip alignment, compression, read window, sample port, tolerances, and lot traceability."],
    ],
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadCatalogModel() {
  const source = `${fs.readFileSync(path.join(root, "script.js"), "utf8")}
globalThis.__seoCatalog = {
  products,
  productCategoryLabels,
  getProductDetailPack,
  getProductOptions,
  getOptionPriceLabel
};`;
  const document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { dataset: {} },
    addEventListener: () => {},
  };
  const sandbox = {
    document,
    window: {
      location: { search: "", href: "" },
      matchMedia: () => ({ matches: false, addEventListener: () => {} }),
      addEventListener: () => {},
      setTimeout,
      clearTimeout,
      devicePixelRatio: 1,
    },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    URLSearchParams,
    FormData: class {},
    console,
    Map,
    Set,
    encodeURIComponent,
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.__seoCatalog;
}

const catalog = loadCatalogModel();

function localImageUrl(product, prefix = "../") {
  if (!product.image?.url) return "";
  return /^https?:\/\//i.test(product.image.url) ? product.image.url : `${prefix}${product.image.url}`;
}

function fallbackImage(product, prefix = "../") {
  const assets = {
    microfluidics: "assets/catalog-custom/microfluidic-chips.jpg",
    "fluid-handling": "assets/catalog-custom/tubing-assortment.jpg",
    "flow-control": "assets/catalog-custom/pumps-flow-control.jpg",
    diagnostics: "assets/catalog-custom/diagnostics-consumables.jpg",
    "lab-plastics": "assets/catalog-custom/lab-plastics-consumables.jpg",
    oem: "assets/catalog-custom/oem-manufacturing.jpg",
    services: "assets/catalog-custom/services-kits.jpg",
    "starter-kits": "assets/catalog-custom/services-kits.jpg",
  };
  return `${prefix}${assets[product.category] || assets.microfluidics}`;
}

function uniqueDescription(product) {
  const suffix = ` Review ${product.subclass.toLowerCase()} options, specifications, documentation, and quote requirements for research use.`;
  return `${product.description}${suffix}`.slice(0, 230);
}

function productStructuredData(product, detail, imageUrl) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products.html` },
          {
            "@type": "ListItem",
            position: 3,
            name: catalog.productCategoryLabels[product.category],
            item: `${siteUrl}/products.html#catalog`,
          },
          { "@type": "ListItem", position: 4, name: product.name, item: `${siteUrl}/catalog/${product.id}.html` },
        ],
      },
    ],
  };
}

function productMain(product) {
  const categoryLabel = catalog.productCategoryLabels[product.category] || product.category;
  const detail = catalog.getProductDetailPack(product);
  const options = catalog.getProductOptions(product);
  const price = catalog.getOptionPriceLabel(product, options[0]);
  const imageUrl = localImageUrl(product) || fallbackImage(product);
  const alt = product.image?.alt || `${product.name} representative research-use catalog image`;
  const requestSubject = encodeURIComponent(`MicroCD Labs quote request: ${product.name}`);
  const requestBody = encodeURIComponent(
    `Hello MicroCD Labs,\n\nPlease confirm availability, final price, lead time, shipping, compatible options, and documentation for:\n\n${product.name}\nMicroCD Cat. No. ${product.sku}\n\nIntended research-use application:\n\nDestination country:\n`,
  );

  return `    <main id="productDetail">
      <!-- SEO_PRODUCT_START -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a><span aria-hidden="true">/</span>
        <a href="../products.html">Products</a><span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtml(product.name)}</span>
      </nav>
      <section class="section product-detail-section" aria-labelledby="product-detail-title">
        <div class="product-detail-layout">
          <div class="product-detail-media">
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" width="960" height="640" />
            ${product.image ? `<span class="image-credit">${escapeHtml(product.image.credit)}</span>` : '<span class="image-credit">Representative category image</span>'}
          </div>
          <div class="product-detail-copy">
            <p class="eyebrow">${escapeHtml(categoryLabel)}</p>
            <h1 id="product-detail-title">${escapeHtml(product.name)}</h1>
            <strong class="product-detail-price">${escapeHtml(price)}</strong>
            <label class="product-option-field product-option-field-detail">
              <span>Available option</span>
              <select aria-label="Available options for ${escapeHtml(product.name)}">
                ${options.map((option) => `<option>${escapeHtml(option.label)} - ${escapeHtml(option.priceLabel)}</option>`).join("")}
              </select>
            </label>
            <dl class="product-detail-specs">
              <div><dt>MicroCD Cat. No.</dt><dd>${escapeHtml(product.sku)}</dd></div>
              <div><dt>Classification</dt><dd>${escapeHtml(categoryLabel)}</dd></div>
              <div><dt>Subclass</dt><dd>${escapeHtml(product.subclass)}</dd></div>
              <div><dt>Catalog source</dt><dd>${escapeHtml(detail.brand)}</dd></div>
              <div><dt>Order type</dt><dd>Generic research-use family reviewed by written quote</dd></div>
            </dl>
            <p>${escapeHtml(product.description)}</p>
            <p>${escapeHtml(detail.role)}</p>
            <div class="product-meta">${product.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            <div class="product-detail-actions">
              <a class="button button-primary" href="mailto:info@microcdlabs.com?subject=${requestSubject}&body=${requestBody}">Request quote for this item</a>
              <a class="button product-back-link" href="../products.html#catalog">Back to catalog</a>
            </div>
          </div>
        </div>
        <div class="product-detail-grid" aria-label="Detailed product information">
          <article class="detail-panel detail-panel-wide">
            <h2>Catalog status</h2>
            <p>${escapeHtml(detail.marketPosition)}</p>
            <p>MicroCD Labs uses catalog number <strong>${escapeHtml(product.sku)}</strong> for quoting, compatible variants, substitutions, and order review.</p>
          </article>
          <article class="detail-panel"><h2>Available variants</h2><ul>${detail.variants.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article class="detail-panel"><h2>Specification checklist</h2><ul>${detail.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article class="detail-panel">
            <h2>Documentation and order review</h2>
            <p>${escapeHtml(detail.documentationNote)}</p>
          </article>
        </div>
        <p class="catalog-disclaimer">Catalog details describe MicroCD Labs generic product families for research planning and quote review. No third-party branded product is offered, and no manufacturer, authorized-reseller, or distribution relationship is implied. Specifications, source, documentation, availability, and final price must be confirmed in writing before an order is accepted.</p>
      </section>
      <!-- SEO_PRODUCT_END -->
    </main>`;
}

async function updateProductPages() {
  await Promise.all(catalog.products.map(async (product) => {
    const file = path.join(root, "catalog", `${product.id}.html`);
    if (!fs.existsSync(file)) throw new Error(`Missing catalog page: ${file}`);
    let html = await fs.promises.readFile(file, "utf8");
    const detail = catalog.getProductDetailPack(product);
    const image = localImageUrl(product, `${siteUrl}/`) || `${siteUrl}/${fallbackImage(product, "")}`;
    const description = uniqueDescription(product);
    const generatedHead = `    <!-- SEO_PRODUCT_META_START -->
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtml(product.name)} | MicroCD Labs Catalog" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${siteUrl}/catalog/${product.id}.html" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">
${JSON.stringify(productStructuredData(product, detail, image), null, 6)}
    </script>
    <!-- SEO_PRODUCT_META_END -->
`;

    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(product.name)} | MicroCD Labs Catalog</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${siteUrl}/catalog/${product.id}.html" />`)
      .replace(/script\.js\?v=[^"]+/, "script.js?v=20260728b")
      .replace(/\s*<!-- SEO_PRODUCT_META_START -->[\s\S]*?<!-- SEO_PRODUCT_META_END -->\s*/g, "\n")
      .replace("</head>", `${generatedHead}  </head>`)
      .replace(/    <main id="productDetail">[\s\S]*?<\/main>/, productMain(product));
    await fs.promises.writeFile(file, html);
  }));
}

function productMatchesCategory(product, definition) {
  if (product.category !== definition.category) return false;
  if (definition.subclass && product.subclass !== definition.subclass) return false;
  if (definition.subclasses && !definition.subclasses.includes(product.subclass)) return false;
  return true;
}

function categoryCard(product) {
  const image = localImageUrl(product) || fallbackImage(product);
  return `<article class="seo-product-card">
            <a class="seo-product-card-image" href="../catalog/${product.id}.html">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(product.image?.alt || `${product.name} representative catalog image`)}" loading="lazy" width="480" height="320" />
            </a>
            <div>
              <p class="eyebrow">${escapeHtml(product.subclass)}</p>
              <h2><a href="../catalog/${product.id}.html">${escapeHtml(product.name)}</a></h2>
              <p>${escapeHtml(product.description)}</p>
              <dl><div><dt>Catalog no.</dt><dd>${escapeHtml(product.sku)}</dd></div><div><dt>Price status</dt><dd>${escapeHtml(product.price)}</dd></div></dl>
              <a class="text-link" href="../catalog/${product.id}.html">View specifications <span aria-hidden="true">&rarr;</span></a>
            </div>
          </article>`;
}

function categoryStructuredData(definition, products) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products.html` },
          { "@type": "ListItem", position: 3, name: definition.eyebrow, item: `${siteUrl}/${definition.slug}/` },
        ],
      },
      {
        "@type": "CollectionPage",
        name: definition.h1,
        description: definition.description,
        url: `${siteUrl}/${definition.slug}/`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/catalog/${product.id}.html`,
            name: product.name,
          })),
        },
      },
    ],
  };
}

function categoryPage(definition) {
  const products = catalog.products.filter((product) => productMatchesCategory(product, definition));
  return `<!doctype html>
<html lang="en">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18239515056"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied'});
      gtag('js', new Date());
      gtag('config', 'AW-18239515056');
    </script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(definition.title)}</title>
    <meta name="description" content="${escapeHtml(definition.description)}" />
    <link rel="canonical" href="${siteUrl}/${definition.slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(definition.title)}" />
    <meta property="og:description" content="${escapeHtml(definition.description)}" />
    <meta property="og:url" content="${siteUrl}/${definition.slug}/" />
    <meta property="og:image" content="${siteUrl}/${definition.image.replace("../", "")}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="../assets/microcd-tab-icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../styles.css?v=20260725b" />
    <script type="application/ld+json">
${JSON.stringify(categoryStructuredData(definition, products), null, 6)}
    </script>
  </head>
  <body class="seo-category-page">
    <header class="site-header">
      <a class="brand" href="../index.html#top" aria-label="MicroCD Labs home"><img class="brand-logo" src="../assets/microcd-labs-wordmark.svg?v=boxed" alt="microcd labs" /></a>
      <nav class="main-nav" aria-label="Primary navigation">
        <details class="nav-menu"><summary>Products</summary><div class="nav-menu-list"><a href="../products.html">Catalog <span>All parts, consumables, and equipment</span></a><a href="../microfluidic-chips/">Microfluidic chips <span>PDMS, glass, COC, PMMA, and custom chips</span></a><a href="../microfluidic-tubing/">Microfluidic tubing <span>Materials, dimensions, and fluid paths</span></a><a href="../microfluidic-fittings-connectors/">Fittings and connectors <span>Interfaces, manifolds, and reservoirs</span></a><a href="../microfluidic-pumps-flow-control/">Pumps and flow control <span>Pumps, controllers, valves, and sensors</span></a><a href="../lateral-flow-assay-materials/">LFIA materials <span>Membranes, pads, and housings</span></a></div></details>
        <details class="nav-menu"><summary>Capabilities</summary><div class="nav-menu-list"><a href="../services.html">Development services <span>Engineering, prototyping, and product support</span></a><a href="../automation.html">OEM workflows <span>Simplified microfluidic device operation</span></a><a href="../diagnostics.html">Diagnostics <span>Assay, LFIA, and kinetic analysis support</span></a></div></details>
        <details class="nav-menu"><summary>Tools</summary><div class="nav-menu-list"><a href="../platform.html">Microfluidic Modeler <span>Browser-based cartridge concept workspace</span></a><a href="../analyzer/">Kinetic Assay Enhancer <span>Time-resolved assay analysis</span></a></div></details>
        <details class="nav-menu"><summary>Company</summary><div class="nav-menu-list"><a href="../about.html">About <span>Technical focus and company background</span></a><a href="../news.html">News <span>Research and company updates</span></a><a href="../consultation.html">Contact <span>Discuss a technical project</span></a></div></details>
        <details class="nav-menu"><summary>Policies</summary><div class="nav-menu-list"><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="../refunds.html">Refunds</a><a href="../accessibility.html">Accessibility</a></div></details>
      </nav>
      <div class="header-actions"><a class="social-icon-link" href="https://www.linkedin.com/company/microcd-labs/" target="_blank" rel="noreferrer" aria-label="MicroCD Labs on LinkedIn"><span aria-hidden="true">in</span></a><a class="header-cta" href="../consultation.html">Request technical review</a></div>
    </header>
    <main>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../products.html">Products</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(definition.eyebrow)}</span></nav>
      <section class="seo-category-hero section" aria-labelledby="category-title">
        <div><p class="eyebrow">${escapeHtml(definition.eyebrow)}</p><h1 id="category-title">${escapeHtml(definition.h1)}</h1><p>${escapeHtml(definition.description)}</p><div class="hero-actions"><a class="button button-primary" href="#category-products">Browse ${products.length} items</a><a class="button button-secondary" href="../recommendations.html">Get a parts recommendation</a></div></div>
        <img src="${escapeHtml(definition.image)}" alt="${escapeHtml(definition.eyebrow)} arranged for research system planning" width="960" height="640" />
      </section>
      <section class="seo-direct-answer section" aria-labelledby="selection-answer-title"><div><p class="eyebrow">Selection answer</p><h2 id="selection-answer-title">How should you choose?</h2></div><div><p>${escapeHtml(definition.answer)}</p><p class="seo-review-note">Technical content reviewed by <a href="../about.html">MicroCD Labs</a> · Updated July 28, 2026. Confirm final selection against the written quote, applicable source documentation, and the complete research system.</p></div></section>
      <section class="seo-considerations section" aria-labelledby="considerations-title"><div class="section-heading"><div><p class="eyebrow">Before requesting a quote</p><h2 id="considerations-title">Confirm the complete system requirement</h2></div><p>MicroCD Labs reviews compatibility, documentation, final pricing, availability, and lead time before payment.</p></div><div class="seo-consideration-grid">${definition.considerations.map(([title, copy]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`).join("")}</div></section>
      <section id="category-products" class="seo-category-products section" aria-labelledby="category-products-title"><div class="section-heading"><div><p class="eyebrow">Research-use catalog</p><h2 id="category-products-title">${escapeHtml(definition.eyebrow)} products and product families</h2></div><p>Open an item for variants, specification questions, documentation links, and quote status.</p></div><div class="seo-product-grid">${products.map(categoryCard).join("")}</div></section>
      <section class="seo-category-cta section"><div><p class="eyebrow">Technical review</p><h2>Not sure which components fit together?</h2><p>Share the fluid, target flow or pressure, interface sizes, and intended research workflow. We can help build a compatible shortlist.</p></div><a class="button button-primary" href="../consultation.html?project=technical-consulting">Request a technical consultation</a></section>
    </main>
    <footer class="site-footer"><div><img class="footer-logo" src="../assets/microcd-labs-wordmark.svg?v=boxed" alt="microcd labs" /><p class="company-legal">MicroCD Labs, a division of Karigari Home LLC</p><p>Microfluidics parts supplier and product-development support for research teams.</p></div><p>Products are for non-clinical research use unless stated otherwise. <a href="mailto:info@microcdlabs.com">info@microcdlabs.com</a> <a href="../privacy.html">Privacy</a> <a href="../terms.html">Terms</a></p></footer>
    <script src="../site.js?v=20260725b"></script>
    <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=f6f042c5-f6ce-4381-8555-2da23e6aebd1"></script>
  </body>
</html>
`;
}

function writeCategoryPages() {
  for (const definition of categoryDefinitions) {
    const directory = path.join(root, definition.slug);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "index.html"), categoryPage(definition));
  }
}

function updateSitemap() {
  const sitemapPath = path.join(root, "sitemap.xml");
  const current = fs.readFileSync(sitemapPath, "utf8");
  const activeCatalogUrls = new Set(
    catalog.products.map((product) => `${siteUrl}/catalog/${product.id}.html`),
  );
  const currentEntries = [...current.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?[\s\S]*?<\/url>/g)]
    .map((match) => ({ loc: match[1], lastmod: match[2] || buildDate }))
    .filter((entry) => !entry.loc.includes("daily-wellness-lens-instructions"))
    .filter((entry) => !entry.loc.includes("/catalog/") || activeCatalogUrls.has(entry.loc));
  const byLocation = new Map(currentEntries.map((entry) => [entry.loc, entry]));

  for (const definition of categoryDefinitions) {
    byLocation.set(`${siteUrl}/${definition.slug}/`, { loc: `${siteUrl}/${definition.slug}/`, lastmod: buildDate });
  }
  for (const product of catalog.products) {
    byLocation.set(`${siteUrl}/catalog/${product.id}.html`, { loc: `${siteUrl}/catalog/${product.id}.html`, lastmod: buildDate });
  }

  const entries = [...byLocation.values()]
    .sort((a, b) => a.loc.localeCompare(b.loc))
    .map((entry) => `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`)
    .join("\n");
  fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
}

await updateProductPages();
writeCategoryPages();
updateSitemap();

console.log(`Pre-rendered ${catalog.products.length} product pages.`);
console.log(`Generated ${categoryDefinitions.length} category pages.`);
console.log("Updated sitemap.xml.");
