const catalogImages = {
  chip: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Microfluidic_Device_%286842746147%29.jpg/960px-Microfluidic_Device_%286842746147%29.jpg",
    alt: "A microfluidic device with pipette and fluidic channel on a lab bench",
    credit: "Cooksey/NIST",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_Device_(6842746147).jpg",
    license: "Public domain",
  },
  chipClose: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Microfluidic_chip_for_point-of-care_medical_devices.jpg/960px-Microfluidic_chip_for_point-of-care_medical_devices.jpg",
    alt: "A transparent microfluidic chip with etched channels and electrodes",
    credit: "FMNLab",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_chip_for_point-of-care_medical_devices.jpg",
    license: "CC BY 4.0",
  },
  laminar: {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Microfluidic_device_laminar_flow.png",
    alt: "A multi-input microfluidic device diagram showing colored laminar flow",
    credit: "Courson & Rock",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_device_laminar_flow.png",
    license: "CC BY 2.5",
  },
  pump: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg/960px-EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
    alt: "Close-up of a syringe pump controlling laboratory fluid flow",
    credit: "EPA/NARA",
    source: "https://commons.wikimedia.org/wiki/File:EPA_GULF_BREEZE_LABORATORY,_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP,_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
    license: "Public domain",
  },
  rapidTest: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/COVID-19_rapid_test.jpg/720px-COVID-19_rapid_test.jpg",
    alt: "Two lateral flow rapid test cassettes on a light background",
    credit: "Lennardywlee",
    source: "https://commons.wikimedia.org/wiki/File:COVID-19_rapid_test.jpg",
    license: "CC BY-SA 4.0",
  },
  microplate: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Microplate_with_hand.jpg/960px-Microplate_with_hand.jpg",
    alt: "A clear 96-well microplate held by a gloved hand",
    credit: "Magnus Manske",
    source: "https://commons.wikimedia.org/wiki/File:Microplate_with_hand.jpg",
    license: "CC BY-SA 3.0",
  },
  tips: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Pipette_tips-different_1.jpg/960px-Pipette_tips-different_1.jpg",
    alt: "Different sizes of clear plastic pipette tips",
    credit: "Nadine90",
    source: "https://commons.wikimedia.org/wiki/File:Pipette_tips-different_1.jpg",
    license: "CC BY-SA 3.0",
  },
};

const products = [
  {
    id: "pdms-microfluidic-chips",
    name: "PDMS Microfluidic Chips",
    category: "microfluidics",
    description: "Soft-lithography style PDMS chips for early experiments, assay development, and proof-of-concept flow work.",
    price: "$450-$1,200",
    tags: ["PDMS", "Prototype", "RUO"],
    icon: "chip",
    image: catalogImages.chip,
  },
  {
    id: "glass-microfluidic-chips",
    name: "Glass Microfluidic Chips",
    category: "microfluidics",
    description: "Glass chips for optical clarity, solvent compatibility, and higher-performance analytical workflows.",
    price: "$650-$2,500",
    tags: ["Glass", "Solvent ready", "Optical"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "coc-microfluidic-chips",
    name: "COC Microfluidic Chips",
    category: "microfluidics",
    description: "Cyclic olefin copolymer chips for scalable diagnostic, optical, and cartridge-style development.",
    price: "$550-$1,800",
    tags: ["COC", "Diagnostic R&D", "Low autofluorescence"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "pmma-microfluidic-chips",
    name: "PMMA Microfluidic Chips",
    category: "microfluidics",
    description: "PMMA chips for clear, economical prototyping and application-specific microchannel layouts.",
    price: "$350-$1,500",
    tags: ["PMMA", "Acrylic", "Prototype"],
    icon: "chip",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-mixers",
    name: "Microfluidic Mixers",
    category: "microfluidics",
    description: "Passive mixer chip options for reagent blending, concentration gradients, and laminar-flow experiments.",
    price: "$250-$850",
    tags: ["Mixing", "Gradient", "Chip"],
    icon: "chip",
    image: catalogImages.laminar,
  },
  {
    id: "droplet-generation-chips",
    name: "Droplet Generation Chips",
    category: "microfluidics",
    description: "Flow-focusing and T-junction chip options for emulsions, droplets, and encapsulation studies.",
    price: "$450-$1,400",
    tags: ["Droplet", "T-junction", "Flow focusing"],
    icon: "chip",
    image: catalogImages.laminar,
  },
  {
    id: "organ-on-chip-devices",
    name: "Organ-on-Chip Devices",
    category: "microfluidics",
    description: "Research-use organ-on-chip formats for cell culture, perfusion, barrier, and tissue-model studies.",
    price: "$900-$3,500",
    tags: ["Cell model", "Perfusion", "RUO"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "cell-culture-microfluidic-devices",
    name: "Cell Culture Microfluidic Devices",
    category: "microfluidics",
    description: "Microfluidic culture devices for media perfusion, small-volume assays, and live-cell imaging workflows.",
    price: "$650-$2,200",
    tags: ["Cell culture", "Imaging", "Perfusion"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "custom-microfluidic-chip-fabrication",
    name: "Custom Microfluidic Chip Fabrication",
    category: "microfluidics",
    description: "Custom design-to-device support for channel layouts, material selection, ports, bonding, and small runs.",
    price: "From $1,500",
    tags: ["Custom", "Design support", "Small batch"],
    icon: "holder",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-prototyping-services",
    name: "Microfluidic Prototyping Services",
    category: "microfluidics",
    description: "Prototype planning and sourcing for early microfluidic experiments, holders, tubing, and flow hardware.",
    price: "From $950",
    tags: ["Prototype", "Consulting", "Build list"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "ptfe-tubing",
    name: "PTFE Tubing",
    category: "fluid-handling",
    description: "Chemically resistant PTFE tubing for low-volume flow paths, pump lines, and chip connections.",
    price: "$35-$110 / roll",
    tags: ["PTFE", "Chemical resistant", "Microbore"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "fep-tubing",
    name: "FEP Tubing",
    category: "fluid-handling",
    description: "Transparent fluoropolymer tubing for visible fluid paths and chemically compatible lab setups.",
    price: "$45-$140 / roll",
    tags: ["FEP", "Clear", "Fluoropolymer"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "peek-tubing",
    name: "PEEK Tubing",
    category: "fluid-handling",
    description: "PEEK tubing for higher-pressure analytical, HPLC-adjacent, and microfluidic connection workflows.",
    price: "$80-$250 / roll",
    tags: ["PEEK", "High pressure", "Analytical"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "silicone-tubing",
    name: "Silicone Tubing",
    category: "fluid-handling",
    description: "Flexible silicone tubing for peristaltic pumps, low-pressure transfer, and biocompatible lab setups.",
    price: "$25-$90 / pack",
    tags: ["Silicone", "Flexible", "Pump tubing"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "tygon-tubing",
    name: "Tygon Tubing",
    category: "fluid-handling",
    description: "General-purpose flexible tubing for pump and transfer applications where compatibility fits the fluid.",
    price: "$30-$120 / pack",
    tags: ["Tygon", "Flexible", "Transfer"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "microbore-tubing",
    name: "Microbore Tubing",
    category: "fluid-handling",
    description: "Small-ID tubing selections for microfluidic interconnects, dead-volume reduction, and precise flow paths.",
    price: "$40-$160 / roll",
    tags: ["Small ID", "Low dead volume", "Microfluidics"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "luer-lock-connectors",
    name: "Luer Lock Connectors",
    category: "fluid-handling",
    description: "Male, female, threaded, and adapter luer connectors for syringe, tubing, and chip workflows.",
    price: "$15-$85 / pack",
    tags: ["Luer", "Adapters", "Assorted"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "barbed-fittings",
    name: "Barbed Fittings",
    category: "fluid-handling",
    description: "Straight, elbow, tee, and reducer barbed fittings for soft tubing and low-pressure lab assemblies.",
    price: "$12-$65 / pack",
    tags: ["Barbed", "Elbow", "Tee"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "compression-fittings",
    name: "Compression Fittings",
    category: "fluid-handling",
    description: "Compression fittings, nuts, ferrules, and unions for secure connections in small-bore tubing runs.",
    price: "$35-$180 / pack",
    tags: ["Ferrules", "Unions", "Leak control"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "fluidic-manifolds",
    name: "Fluidic Manifolds",
    category: "fluid-handling",
    description: "Distribution manifolds for routing multiple inputs, outputs, washing lines, and reagent feeds.",
    price: "$120-$650",
    tags: ["Manifold", "Routing", "Multi-port"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "syringe-pumps",
    name: "Syringe Pumps",
    category: "flow-control",
    description: "Single- and multi-channel syringe pump options for controlled microfluidic flow in R&D setups.",
    price: "$650-$3,500",
    tags: ["Syringe", "Flow rate", "Benchtop"],
    icon: "pump",
    image: catalogImages.pump,
  },
  {
    id: "peristaltic-pumps",
    name: "Peristaltic Pumps",
    category: "flow-control",
    description: "Peristaltic pump options for continuous transfer, recirculation, perfusion, and tubing-based flow.",
    price: "$450-$2,500",
    tags: ["Peristaltic", "Continuous", "Tubing"],
    icon: "pump",
    image: catalogImages.pump,
  },
  {
    id: "pressure-controllers",
    name: "Pressure Controllers",
    category: "flow-control",
    description: "Pressure-driven flow control options for stable microfluidic operation and fast response.",
    price: "$2,200-$9,000",
    tags: ["Pressure", "Stable flow", "Controller"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "solenoid-valves",
    name: "Solenoid Valves",
    category: "flow-control",
    description: "Miniature valves for automated switching, reagent routing, and instrument control.",
    price: "$75-$350",
    tags: ["Valve", "Switching", "Automation"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "pinch-valves",
    name: "Pinch Valves",
    category: "flow-control",
    description: "Pinch valves for contactless fluid control through flexible tubing.",
    price: "$90-$450",
    tags: ["Pinch", "Tubing", "Low contamination"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "flow-sensors",
    name: "Flow Sensors",
    category: "flow-control",
    description: "Inline sensors for monitoring low-flow performance and checking experimental stability.",
    price: "$350-$1,800",
    tags: ["Inline", "Low flow", "Monitoring"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "pressure-sensors",
    name: "Pressure Sensors",
    category: "flow-control",
    description: "Pressure sensing options for pumps, manifolds, cartridges, and controlled test systems.",
    price: "$180-$900",
    tags: ["Pressure", "Sensor", "Instrument"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "flow-meters",
    name: "Flow Meters",
    category: "flow-control",
    description: "Flow meters for calibration, verification, and routine checks in microfluidic systems.",
    price: "$250-$1,500",
    tags: ["Meter", "Calibration", "Verification"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "lateral-flow-assay-materials",
    name: "Lateral Flow Assay Materials",
    category: "diagnostics",
    description: "Materials and consumables for lateral-flow assay development, strip builds, and feasibility testing.",
    price: "$95-$450",
    tags: ["LFIA", "Assay", "RUO"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "nitrocellulose-membranes",
    name: "Nitrocellulose Membranes",
    category: "diagnostics",
    description: "Nitrocellulose membrane options for LFIA line development, flow-rate tuning, and assay screening.",
    price: "$120-$700",
    tags: ["Membrane", "LFIA", "Capillary flow"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "sample-pads",
    name: "Sample Pads",
    category: "diagnostics",
    description: "Sample-pad materials for filtration, sample conditioning, and lateral-flow strip assembly.",
    price: "$60-$350",
    tags: ["Sample pad", "Strip build", "Screening"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "conjugate-pads",
    name: "Conjugate Pads",
    category: "diagnostics",
    description: "Conjugate pad materials for reagent deposition, drying, and release studies in rapid tests.",
    price: "$75-$400",
    tags: ["Conjugate", "Reagent release", "LFIA"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "absorbent-pads",
    name: "Absorbent Pads",
    category: "diagnostics",
    description: "Wicking and absorbent pads for lateral-flow strip backing, fluid draw, and assay timing control.",
    price: "$50-$280",
    tags: ["Absorbent", "Wicking", "Strip"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "diagnostic-cartridges",
    name: "Diagnostic Cartridges",
    category: "diagnostics",
    description: "Custom or sourced cartridge formats for assay integration, sample handling, and prototype testing.",
    price: "$2-$25 / unit or quote",
    tags: ["Cartridge", "Prototype", "OEM"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "rapid-test-housings",
    name: "Rapid Test Housings",
    category: "diagnostics",
    description: "Plastic cassette housings for LFIA strip assembly, usability testing, and pilot production.",
    price: "$0.40-$5 / unit or quote",
    tags: ["Cassette", "Housing", "Pilot run"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "custom-lfia-development",
    name: "Custom LFIA Development",
    category: "diagnostics",
    description: "Development support for LFIA material selection, strip architecture, assay workflow, and prototype builds.",
    price: "From $3,000",
    tags: ["Custom", "Assay development", "LFIA"],
    icon: "kit",
    image: catalogImages.rapidTest,
  },
  {
    id: "96-well-plates",
    name: "96-Well Plates",
    category: "lab-plastics",
    description: "Clear, black, white, sterile, and assay-specific 96-well plate options for routine lab workflows.",
    price: "$45-$180 / case",
    tags: ["96-well", "Assay", "Plate"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "pcr-plates",
    name: "PCR Plates",
    category: "lab-plastics",
    description: "PCR plate options for thermal cycling, qPCR-compatible workflows, and molecular biology setups.",
    price: "$80-$250 / case",
    tags: ["PCR", "Thermal cycling", "Plate"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "pcr-tubes",
    name: "PCR Tubes",
    category: "lab-plastics",
    description: "PCR tubes and strips for amplification workflows, assay prep, and sample processing.",
    price: "$25-$120 / pack",
    tags: ["PCR", "Tubes", "Strips"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "centrifuge-tubes",
    name: "Centrifuge Tubes",
    category: "lab-plastics",
    description: "15 mL, 50 mL, and specialty centrifuge tubes for sample handling and routine lab use.",
    price: "$35-$160 / case",
    tags: ["15 mL", "50 mL", "Sample prep"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "cryovials",
    name: "Cryovials",
    category: "lab-plastics",
    description: "Cryogenic storage vial options for sample banking, cell work, and cold-chain workflows.",
    price: "$60-$220 / case",
    tags: ["Cryo", "Storage", "Vials"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "reservoir-trays",
    name: "Reservoir Trays",
    category: "lab-plastics",
    description: "Reagent reservoirs and trays for multichannel pipetting, liquid handling, and assay setup.",
    price: "$70-$240 / case",
    tags: ["Reservoir", "Pipetting", "Automation"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "reagent-bottles",
    name: "Reagent Bottles",
    category: "lab-plastics",
    description: "Reagent bottles in common volumes and materials for storage, dispensing, and lab operations.",
    price: "$40-$180 / case",
    tags: ["Bottles", "Storage", "Reagents"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "pipette-tips",
    name: "Pipette Tips",
    category: "lab-plastics",
    description: "Filtered, sterile, low-retention, and standard pipette tip options for routine lab purchasing.",
    price: "$60-$350 / case",
    tags: ["Tips", "Filtered", "Sterile"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "injection-molded-plastic-parts",
    name: "Injection Molded Plastic Parts",
    category: "oem",
    description: "OEM plastic part sourcing and manufacturing support for housings, fixtures, and disposable components.",
    price: "Quote",
    tags: ["OEM", "Tooling", "Plastic"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "diagnostic-cartridge-molding",
    name: "Diagnostic Cartridge Molding",
    category: "oem",
    description: "Manufacturing pathways for diagnostic cartridge shells, fluidic features, and pilot-to-scale production.",
    price: "Quote",
    tags: ["Cartridge", "Molding", "Scale-up"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "medical-grade-plastic-enclosures",
    name: "Medical-Grade Plastic Enclosures",
    category: "oem",
    description: "Enclosure sourcing and development for diagnostic instruments, lab hardware, and protected assemblies.",
    price: "Quote",
    tags: ["Enclosure", "Instrument", "OEM"],
    icon: "holder",
    image: catalogImages.rapidTest,
  },
  {
    id: "custom-reagent-reservoirs",
    name: "Custom Reagent Reservoirs",
    category: "oem",
    description: "Custom reservoir concepts for reagents, buffers, wash fluids, and instrument-integrated consumables.",
    price: "Quote",
    tags: ["Reservoir", "Consumable", "Custom"],
    icon: "holder",
    image: catalogImages.tips,
  },
  {
    id: "disposable-assay-cassettes",
    name: "Disposable Assay Cassettes",
    category: "oem",
    description: "Disposable cassette sourcing and development for rapid tests, cartridges, and integrated assays.",
    price: "Quote",
    tags: ["Disposable", "Cassette", "Assay"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "prototype-to-production-manufacturing",
    name: "Prototype-to-Production Manufacturing",
    category: "oem",
    description: "Support for moving from prototype drawings and pilot units toward repeatable manufacturing supply.",
    price: "Quote",
    tags: ["Prototype", "Production", "Supplier support"],
    icon: "kit",
    image: catalogImages.chip,
  },
];

const productsWithRepresentativeImages = new Set([
  "pdms-microfluidic-chips",
  "glass-microfluidic-chips",
  "coc-microfluidic-chips",
  "pmma-microfluidic-chips",
  "microfluidic-mixers",
  "droplet-generation-chips",
  "organ-on-chip-devices",
  "cell-culture-microfluidic-devices",
  "custom-microfluidic-chip-fabrication",
  "syringe-pumps",
  "lateral-flow-assay-materials",
  "diagnostic-cartridges",
  "rapid-test-housings",
  "96-well-plates",
  "pcr-plates",
  "pipette-tips",
]);

products.forEach((product) => {
  if (!productsWithRepresentativeImages.has(product.id)) {
    product.image = null;
  }
});

const selected = new Map();
const productGrid = document.querySelector("#productGrid");
const quoteList = document.querySelector("#quoteList");
const emptyQuote = document.querySelector("#emptyQuote");
const quoteMail = document.querySelector("#quoteMail");
const quoteForm = document.querySelector("#quoteForm");
const contactForm = document.querySelector("#contactForm");
const contactMail = document.querySelector("#contactMail");
const creditList = document.querySelector("#creditList");
const filterButtons = document.querySelectorAll(".filter-button");
const companyEmail = "info@microcdlabs.com";

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
            <strong class="product-price">${product.price}</strong>
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
          <span>${product.name} <small>${product.price}</small></span>
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
      .map((item) => `- ${item.name} (${item.price})`)
      .join("\n")}\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}\nNotes: ${notes}\n\nThank you.`,
  );
  quoteMail.href = items.length ? `mailto:${companyEmail}?subject=${subject}&body=${body}` : "#";
}

function renderContactMail() {
  const formData = new FormData(contactForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";
  const subject = encodeURIComponent("MicroCD Labs contact request");
  const body = encodeURIComponent(
    `Hello MicroCD Labs,\n\n${message}\n\nName: ${name}\nEmail: ${email}\n\nThank you.`,
  );

  contactMail.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
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
contactForm.addEventListener("input", renderContactMail);

renderProducts();
renderQuote();
renderCredits();
renderContactMail();
