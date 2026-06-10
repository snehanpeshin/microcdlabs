const products = [
  {
    id: "ptfe-tubing",
    name: "PTFE Microbore Tubing",
    category: "fluid-path",
    description: "Chemically resistant tubing for low-volume flow paths, pump lines, and chip connections.",
    tags: ["0.5 mm ID", "PTFE", "Research use"],
    icon: "tubing",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Microfluidic_Device_%286842746147%29.jpg/960px-Microfluidic_Device_%286842746147%29.jpg",
      alt: "A microfluidic device with pipette and fluidic channel on a lab bench",
      credit: "Cooksey/NIST",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_Device_(6842746147).jpg",
      license: "Public domain",
    },
  },
  {
    id: "luer-kit",
    name: "Luer Connector Starter Pack",
    category: "fluid-path",
    description: "Assorted male, female, elbow, and barbed fittings for building clean lab setups.",
    tags: ["Assorted", "PP/PE", "Lab bench"],
    icon: "connectors",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Microfluidic_device_laminar_flow.png",
      alt: "A multi-input microfluidic device diagram with orange tubing and colored laminar flow",
      credit: "Courson & Rock",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_device_laminar_flow.png",
      license: "CC BY 2.5",
    },
  },
  {
    id: "chip-holder",
    name: "Universal Chip Holder",
    category: "fluid-path",
    description: "Compact holder for common glass and polymer chip formats used in bench experiments.",
    tags: ["Reusable", "Clamp style", "Bench setup"],
    icon: "holder",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Microfluidic_chip_for_point-of-care_medical_devices.jpg/960px-Microfluidic_chip_for_point-of-care_medical_devices.jpg",
      alt: "A transparent microfluidic chip with etched channels and electrodes",
      credit: "FMNLab",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_chip_for_point-of-care_medical_devices.jpg",
      license: "CC BY 4.0",
    },
  },
  {
    id: "syringe-pump",
    name: "Compact Syringe Pump",
    category: "equipment",
    description: "Single-channel benchtop pump option for controlled flow in non-clinical R&D workflows.",
    tags: ["1 channel", "USB", "Quote only"],
    icon: "pump",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg/960px-EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
      alt: "Close-up of a syringe pump controlling laboratory fluid flow",
      credit: "EPA/NARA",
      source: "https://commons.wikimedia.org/wiki/File:EPA_GULF_BREEZE_LABORATORY,_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP,_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
      license: "Public domain",
    },
  },
  {
    id: "flow-sensor",
    name: "Low-Flow Sensor Module",
    category: "equipment",
    description: "Inline flow monitoring option for experiments that need stable flow feedback.",
    tags: ["Inline", "Low flow", "Calibration"],
    icon: "sensor",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Microfluidic_device_laminar_flow.png",
      alt: "Colored laminar flow paths in a microfluidic device",
      credit: "Courson & Rock",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_device_laminar_flow.png",
      license: "CC BY 2.5",
    },
  },
  {
    id: "chip-pack",
    name: "Droplet Chip Sample Pack",
    category: "fluid-path",
    description: "Research-use chip assortment for droplet generation, mixing, and early feasibility trials.",
    tags: ["RUO", "Polymer", "Sample pack"],
    icon: "chip",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Microfluidic_chip_for_point-of-care_medical_devices.jpg/960px-Microfluidic_chip_for_point-of-care_medical_devices.jpg",
      alt: "A transparent lab-on-a-chip device with fine microfluidic channels",
      credit: "FMNLab",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_chip_for_point-of-care_medical_devices.jpg",
      license: "CC BY 4.0",
    },
  },
  {
    id: "plastic-parts",
    name: "Plastic Parts Refill Box",
    category: "fluid-path",
    description: "Caps, plugs, clips, ferrules, unions, and adapters for everyday lab spares.",
    tags: ["Refill", "Small parts", "Stockroom"],
    icon: "parts",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Pipette_tips-different_1.jpg/960px-Pipette_tips-different_1.jpg",
      alt: "Different sizes of clear plastic pipette tips",
      credit: "Nadine90",
      source: "https://commons.wikimedia.org/wiki/File:Pipette_tips-different_1.jpg",
      license: "CC BY-SA 3.0",
    },
  },
  {
    id: "starter-kit",
    name: "Microfluidics Starter Kit",
    category: "kits",
    description: "A quote-built bundle with tubing, connectors, chips, pump options, and setup notes.",
    tags: ["Bundle", "Custom quote", "UK/EU"],
    icon: "kit",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Microfluidic_Device_%286842746147%29.jpg/960px-Microfluidic_Device_%286842746147%29.jpg",
      alt: "A simple microfluidic device being prepared with a pipette",
      credit: "Cooksey/NIST",
      source: "https://commons.wikimedia.org/wiki/File:Microfluidic_Device_(6842746147).jpg",
      license: "Public domain",
    },
  },
];

const selected = new Map();
const productGrid = document.querySelector("#productGrid");
const quoteList = document.querySelector("#quoteList");
const emptyQuote = document.querySelector("#emptyQuote");
const quoteMail = document.querySelector("#quoteMail");
const quoteForm = document.querySelector("#quoteForm");
const creditList = document.querySelector("#creditList");
const filterButtons = document.querySelectorAll(".filter-button");

function iconSvg(type) {
  const common = 'fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';
  const accent = 'fill="currentColor" opacity="0.14"';

  const icons = {
    tubing: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><path ${accent} d="M14 54c0-22 18-40 40-40s34 14 34 30-13 30-30 30H22v-16h36c8 0 14-6 14-14s-7-14-18-14c-13 0-24 11-24 24v24H14V54z"/><path ${common} d="M22 76V54c0-18 14-32 32-32 15 0 26 9 26 22s-10 22-22 22H27"/><path ${common} d="M13 66h20"/></svg>`,
    connectors: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><rect ${accent} x="18" y="38" width="64" height="24" rx="8"/><path ${common} d="M12 50h28m20 0h28M40 34v32m20-32v32"/><path ${common} d="M22 30h18m20 40h18"/></svg>`,
    holder: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><rect ${accent} x="18" y="24" width="64" height="52" rx="8"/><rect ${common} x="18" y="24" width="64" height="52" rx="8"/><path ${common} d="M34 38h32M34 62h32M26 50h48"/></svg>`,
    pump: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><rect ${accent} x="15" y="32" width="70" height="42" rx="8"/><rect ${common} x="15" y="32" width="70" height="42" rx="8"/><path ${common} d="M28 22h44M72 22v20M28 54h24m14 0h8"/><circle ${common} cx="33" cy="66" r="2"/></svg>`,
    sensor: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><circle ${accent} cx="50" cy="50" r="28"/><circle ${common} cx="50" cy="50" r="28"/><path ${common} d="M10 50h22m36 0h22M42 58l8-20 8 20"/></svg>`,
    chip: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><rect ${accent} x="20" y="20" width="60" height="60" rx="6"/><rect ${common} x="20" y="20" width="60" height="60" rx="6"/><path ${common} d="M34 34h14v14H34zM52 52h14v14H52zM48 41h12M41 48v12"/></svg>`,
    parts: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><path ${accent} d="M18 32h64v42H18z"/><path ${common} d="M18 32h64v42H18zM18 46h64M38 32v42M62 32v42"/><circle ${common} cx="28" cy="60" r="5"/></svg>`,
    kit: `<svg class="part-icon" viewBox="0 0 100 100" aria-hidden="true"><rect ${accent} x="18" y="28" width="64" height="50" rx="8"/><rect ${common} x="18" y="28" width="64" height="50" rx="8"/><path ${common} d="M36 28v-8h28v8M31 53h38M50 40v26"/></svg>`,
  };

  return icons[type] || icons.parts;
}

function renderProducts(filter = "all") {
  const visible = filter === "all" ? products : products.filter((product) => product.category === filter);

  productGrid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card" data-category="${product.category}">
          <div class="product-visual">
            ${
              product.image
                ? `<img class="product-image" src="${product.image.url}" alt="${product.image.alt}" loading="lazy" /><span class="image-credit">${product.image.credit}</span>`
                : iconSvg(product.icon)
            }
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          <button class="button card-action ${selected.has(product.id) ? "selected" : ""}" type="button" data-product="${product.id}">
            ${selected.has(product.id) ? "Added" : "Add to quote"}
          </button>
        </article>
      `,
    )
    .join("");
}

function renderCredits() {
  const uniqueCredits = Array.from(
    products
      .filter((product) => product.image)
      .reduce((credits, product) => {
        credits.set(product.image.source, product.image);
        return credits;
      }, new Map())
      .values(),
  );

  creditList.innerHTML = uniqueCredits
    .map(
      (image) => `
        <li>
          <a href="${image.source}" target="_blank" rel="noreferrer">${image.credit}</a>
          <span>${image.license}</span>
        </li>
      `,
    )
    .join("");
}

function renderQuote() {
  const items = Array.from(selected.values());
  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const organisation = formData.get("organisation") || "";
  const notes = formData.get("notes") || "";

  quoteList.innerHTML = items
    .map(
      (product) => `
        <li>
          <span>${product.name}</span>
          <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remove ${product.name}">Remove</button>
        </li>
      `,
    )
    .join("");

  emptyQuote.hidden = items.length > 0;
  quoteMail.classList.toggle("disabled", items.length === 0);
  quoteMail.setAttribute("aria-disabled", String(items.length === 0));

  const subject = encodeURIComponent("MicroCD Labs microfluidics quote request");
  const body = encodeURIComponent(
    `Hello MicroCD Labs,\n\nI would like a quote for the following research-use microfluidics items:\n\n${items
      .map((item) => `- ${item.name}`)
      .join("\n")}\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}\nNotes: ${notes}\n\nThank you.`,
  );
  quoteMail.href = items.length ? `mailto:microcdlabs@gmail.com?subject=${subject}&body=${body}` : "#";
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (!button) return;

  const product = products.find((item) => item.id === button.dataset.product);
  if (!product) return;

  if (selected.has(product.id)) {
    selected.delete(product.id);
  } else {
    selected.set(product.id, product);
  }

  const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || "all";
  renderProducts(activeFilter);
  renderQuote();
});

quoteList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  selected.delete(button.dataset.remove);
  const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || "all";
  renderProducts(activeFilter);
  renderQuote();
});

quoteForm.addEventListener("input", renderQuote);

renderProducts();
renderQuote();
renderCredits();
