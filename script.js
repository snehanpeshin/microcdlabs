const QuoteState = globalThis.MicroCDQuote;
const catalogImages = {
  chip: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Microfluidic_Device_%286842746147%29.jpg/960px-Microfluidic_Device_%286842746147%29.jpg",
    title: "Microfluidic Device",
    alt: "A microfluidic device with pipette and fluidic channel on a lab bench",
    credit: "Cooksey/NIST",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_Device_(6842746147).jpg",
    license: "Public domain",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  chipClose: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Microfluidic_chip_for_point-of-care_medical_devices.jpg/960px-Microfluidic_chip_for_point-of-care_medical_devices.jpg",
    title: "Microfluidic chip for point-of-care medical devices",
    alt: "A transparent microfluidic chip with etched channels and electrodes",
    credit: "FMNLab",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_chip_for_point-of-care_medical_devices.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  laminar: {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Microfluidic_device_laminar_flow.png",
    title: "Microfluidic device laminar flow",
    alt: "A multi-input microfluidic device diagram showing colored laminar flow",
    credit: "Courson & Rock",
    source: "https://commons.wikimedia.org/wiki/File:Microfluidic_device_laminar_flow.png",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  pump: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg/960px-EPA_GULF_BREEZE_LABORATORY%2C_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP%2C_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
    title: "EPA Gulf Breeze Laboratory syringe pump",
    alt: "Close-up of a syringe pump controlling laboratory fluid flow",
    credit: "EPA/NARA",
    source: "https://commons.wikimedia.org/wiki/File:EPA_GULF_BREEZE_LABORATORY,_BIOASSAY_WET_LAB._THIS_IS_A_CLOSE-UP_OF_A_SYRINGE_PUMP,_WHICH_CONTROLS_THE_RATE_OF_FLOW..._-_NARA_-_546326.jpg",
    license: "Public domain",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  rapidTest: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/COVID-19_rapid_test.jpg/720px-COVID-19_rapid_test.jpg",
    title: "COVID-19 rapid test",
    alt: "Two lateral flow rapid test cassettes on a light background",
    credit: "Lennardywlee",
    source: "https://commons.wikimedia.org/wiki/File:COVID-19_rapid_test.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  microplate: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Microplate_with_hand.jpg/960px-Microplate_with_hand.jpg",
    title: "Microplate with hand",
    alt: "A clear 96-well microplate held by a gloved hand",
    credit: "Magnus Manske",
    source: "https://commons.wikimedia.org/wiki/File:Microplate_with_hand.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  tips: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Pipette_tips-different_1.jpg/960px-Pipette_tips-different_1.jpg",
    title: "Pipette tips-different 1",
    alt: "Different sizes of clear plastic pipette tips",
    credit: "Nadine90",
    source: "https://commons.wikimedia.org/wiki/File:Pipette_tips-different_1.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    modifications: "Displayed at reduced size and may be cropped by responsive layout.",
  },
  oemComplexTuning: {
    url: "assets/oem/complex-microfluidic-tuning.jpg",
    alt: "Vendor-neutral microfluidic prototype with controllers, tubing, valves, sensors, and chip connections",
    credit: "MicroCD Labs",
    source: "assets/oem/complex-microfluidic-tuning.jpg",
    license: "Generated custom website asset",
  },
  oemPlugAndPlay: {
    url: "assets/oem/plug-and-play-microfluidic-device.jpg",
    alt: "Vendor-neutral plug-and-play microfluidic instrument with cartridge slot and guided interface",
    credit: "MicroCD Labs",
    source: "assets/oem/plug-and-play-microfluidic-device.jpg",
    license: "Generated custom website asset",
  },
  customMicrofluidicChips: {
    url: "assets/catalog-custom/microfluidic-chips.jpg",
    alt: "Vendor-neutral assortment of transparent microfluidic chips and lab-on-chip materials",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/microfluidic-chips.jpg",
    license: "Generated custom catalog asset",
  },
  customTubing: {
    url: "assets/catalog-custom/tubing-assortment.jpg",
    alt: "Vendor-neutral assortment of microfluidic tubing in multiple materials and diameters",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/tubing-assortment.jpg",
    license: "Generated custom catalog asset",
  },
  customFittings: {
    url: "assets/catalog-custom/fittings-connectors.jpg",
    alt: "Vendor-neutral assortment of microfluidic fittings, connectors, ferrules, and manifolds",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/fittings-connectors.jpg",
    license: "Generated custom catalog asset",
  },
  customReservoirs: {
    url: "assets/catalog-custom/reservoirs-accessories.jpg",
    alt: "Vendor-neutral microfluidic reservoirs, bottle caps, adapters, and fluidic accessories",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/reservoirs-accessories.jpg",
    license: "Generated custom catalog asset",
  },
  customPumps: {
    url: "assets/catalog-custom/pumps-flow-control.jpg",
    alt: "Vendor-neutral pumps, pressure controller modules, meters, tubing, and transparent chip setup",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/pumps-flow-control.jpg",
    license: "Generated custom catalog asset",
  },
  customSensorsValves: {
    url: "assets/catalog-custom/sensors-valves.jpg",
    alt: "Vendor-neutral microfluidic sensors, meters, valves, and tubing connections",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/sensors-valves.jpg",
    license: "Generated custom catalog asset",
  },
  customDiagnostics: {
    url: "assets/catalog-custom/diagnostics-consumables.jpg",
    alt: "Vendor-neutral diagnostic consumables, LFIA materials, cartridges, and rapid test housings",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/diagnostics-consumables.jpg",
    license: "Generated custom catalog asset",
  },
  customLabPlastics: {
    url: "assets/catalog-custom/lab-plastics-consumables.jpg",
    alt: "Vendor-neutral lab plastics including plates, tubes, vials, reservoirs, bottles, and pipette tips",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/lab-plastics-consumables.jpg",
    license: "Generated custom catalog asset",
  },
  customOemManufacturing: {
    url: "assets/catalog-custom/oem-manufacturing.jpg",
    alt: "Vendor-neutral molded diagnostic cartridges, enclosures, reservoirs, and OEM plastic components",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/oem-manufacturing.jpg",
    license: "Generated custom catalog asset",
  },
  customServicesKits: {
    url: "assets/catalog-custom/services-kits.jpg",
    alt: "Vendor-neutral microfluidic sourcing kit with tubing, connectors, chip holder, sensor, and planning materials",
    credit: "MicroCD Labs",
    source: "assets/catalog-custom/services-kits.jpg",
    license: "Generated custom catalog asset",
  },
};

const products = [
  {
    id: "pdms-microfluidic-chips",
    name: "PDMS Microfluidic Chips",
    category: "microfluidics",
    description: "Soft-lithography style PDMS chips for early experiments, assay development, and proof-of-concept flow work.",
    price: "Quote",
    tags: ["PDMS", "Prototype", "RUO"],
    icon: "chip",
    image: catalogImages.chip,
  },
  {
    id: "glass-microfluidic-chips",
    name: "Glass Microfluidic Chips",
    category: "microfluidics",
    description: "Glass chips for optical clarity, solvent compatibility, and higher-performance analytical workflows.",
    price: "Quote",
    tags: ["Glass", "Solvent ready", "Optical"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "coc-microfluidic-chips",
    name: "COC Microfluidic Chips",
    category: "microfluidics",
    description: "Cyclic olefin copolymer chips for scalable diagnostic, optical, and cartridge-style development.",
    price: "Quote",
    tags: ["COC", "Diagnostic R&D", "Low autofluorescence"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "pmma-microfluidic-chips",
    name: "PMMA Microfluidic Chips",
    category: "microfluidics",
    description: "PMMA chips for clear, economical prototyping and application-specific microchannel layouts.",
    price: "Quote",
    tags: ["PMMA", "Acrylic", "Prototype"],
    icon: "chip",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-mixers",
    name: "Microfluidic Mixers",
    category: "microfluidics",
    description: "Passive mixer chip options for reagent blending, concentration gradients, and laminar-flow experiments.",
    price: "Quote",
    tags: ["Mixing", "Gradient", "Chip"],
    icon: "chip",
    image: catalogImages.laminar,
  },
  {
    id: "droplet-generation-chips",
    name: "Droplet Generation Chips",
    category: "microfluidics",
    description: "Flow-focusing and T-junction chip options for emulsions, droplets, and encapsulation studies.",
    price: "Quote",
    tags: ["Droplet", "T-junction", "Flow focusing"],
    icon: "chip",
    image: catalogImages.laminar,
  },
  {
    id: "organ-on-chip-devices",
    name: "Organ-on-Chip Devices",
    category: "microfluidics",
    description: "Research-use organ-on-chip formats for cell culture, perfusion, barrier, and tissue-model studies.",
    price: "Quote",
    tags: ["Cell model", "Perfusion", "RUO"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "cell-culture-microfluidic-devices",
    name: "Cell Culture Microfluidic Devices",
    category: "microfluidics",
    description: "Microfluidic culture devices for media perfusion, small-volume assays, and live-cell imaging workflows.",
    price: "Quote",
    tags: ["Cell culture", "Imaging", "Perfusion"],
    icon: "chip",
    image: catalogImages.chipClose,
  },
  {
    id: "custom-microfluidic-chip-fabrication",
    name: "Custom Microfluidic Chip Fabrication",
    category: "microfluidics",
    description: "Custom design-to-device support for channel layouts, material selection, ports, bonding, and small runs.",
    price: "Quote",
    tags: ["Custom", "Design support", "Small batch"],
    icon: "holder",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-prototyping-services",
    name: "Microfluidic Prototyping Services",
    category: "microfluidics",
    description: "Prototype planning and sourcing for early microfluidic experiments, holders, tubing, and flow hardware.",
    price: "Quote",
    tags: ["Prototype", "Consulting", "Build list"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "ptfe-tubing",
    name: "PTFE Tubing",
    category: "fluid-handling",
    description: "Chemically resistant PTFE tubing for low-volume flow paths, pump lines, and chip connections.",
    price: "Quote",
    tags: ["PTFE", "Chemical resistant", "Microbore"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "fep-tubing",
    name: "FEP Tubing",
    category: "fluid-handling",
    description: "Transparent fluoropolymer tubing for visible fluid paths and chemically compatible lab setups.",
    price: "Quote",
    tags: ["FEP", "Clear", "Fluoropolymer"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "peek-tubing",
    name: "PEEK Tubing",
    category: "fluid-handling",
    description: "PEEK tubing for higher-pressure analytical, HPLC-adjacent, and microfluidic connection workflows.",
    price: "Quote",
    tags: ["PEEK", "High pressure", "Analytical"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "silicone-tubing",
    name: "Silicone Tubing",
    category: "fluid-handling",
    description: "Flexible silicone tubing for peristaltic pumps, low-pressure transfer, and biocompatible lab setups.",
    price: "Quote",
    tags: ["Silicone", "Flexible", "Pump tubing"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "flexible-laboratory-tubing",
    name: "Flexible Laboratory Tubing",
    category: "fluid-handling",
    description: "General-purpose flexible laboratory tubing for pump and transfer applications where compatibility fits the fluid.",
    price: "Quote",
    tags: ["Flexible", "Laboratory tubing", "Transfer"],
    icon: "tubing",
    image: catalogImages.chip,
  },
  {
    id: "microbore-tubing",
    name: "Microbore Tubing",
    category: "fluid-handling",
    description: "Small-ID tubing selections for microfluidic interconnects, dead-volume reduction, and precise flow paths.",
    price: "Quote",
    tags: ["Small ID", "Low dead volume", "Microfluidics"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "luer-lock-connectors",
    name: "Luer Lock Connectors",
    category: "fluid-handling",
    description: "Male, female, threaded, and adapter luer connectors for syringe, tubing, and chip workflows.",
    price: "Quote",
    tags: ["Luer", "Adapters", "Assorted"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "barbed-fittings",
    name: "Barbed Fittings",
    category: "fluid-handling",
    description: "Straight, elbow, tee, and reducer barbed fittings for soft tubing and low-pressure lab assemblies.",
    price: "Quote",
    tags: ["Barbed", "Elbow", "Tee"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "compression-fittings",
    name: "Compression Fittings",
    category: "fluid-handling",
    description: "Compression fittings, nuts, ferrules, and unions for secure connections in small-bore tubing runs.",
    price: "Quote",
    tags: ["Ferrules", "Unions", "Leak control"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "fluidic-manifolds",
    name: "Fluidic Manifolds",
    category: "fluid-handling",
    description: "Distribution manifolds for routing multiple inputs, outputs, washing lines, and reagent feeds.",
    price: "Quote",
    tags: ["Manifold", "Routing", "Multi-port"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "syringe-pumps",
    name: "Syringe Pumps",
    category: "flow-control",
    description: "Single- and multi-channel syringe pump options for controlled microfluidic flow in R&D setups.",
    price: "Quote",
    tags: ["Syringe", "Flow rate", "Benchtop"],
    icon: "pump",
    image: catalogImages.pump,
  },
  {
    id: "peristaltic-pumps",
    name: "Peristaltic Pumps",
    category: "flow-control",
    description: "Peristaltic pump options for continuous transfer, recirculation, perfusion, and tubing-based flow.",
    price: "Quote",
    tags: ["Peristaltic", "Continuous", "Tubing"],
    icon: "pump",
    image: catalogImages.pump,
  },
  {
    id: "pressure-controllers",
    name: "Pressure Controllers",
    category: "flow-control",
    description: "Pressure-driven flow control options for stable microfluidic operation and fast response.",
    price: "Quote",
    tags: ["Pressure", "Stable flow", "Controller"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "solenoid-valves",
    name: "Solenoid Valves",
    category: "flow-control",
    description: "Miniature valves for automated switching, reagent routing, and instrument control.",
    price: "Quote",
    tags: ["Valve", "Switching", "Automation"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "pinch-valves",
    name: "Pinch Valves",
    category: "flow-control",
    description: "Pinch valves for contactless fluid control through flexible tubing.",
    price: "Quote",
    tags: ["Pinch", "Tubing", "Low contamination"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "flow-sensors",
    name: "Flow Sensors",
    category: "flow-control",
    description: "Inline sensors for monitoring low-flow performance and checking experimental stability.",
    price: "Quote",
    tags: ["Inline", "Low flow", "Monitoring"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "pressure-sensors",
    name: "Pressure Sensors",
    category: "flow-control",
    description: "Pressure sensing options for pumps, manifolds, cartridges, and controlled test systems.",
    price: "Quote",
    tags: ["Pressure", "Sensor", "Instrument"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "flow-meters",
    name: "Flow Meters",
    category: "flow-control",
    description: "Flow meters for calibration, verification, and routine checks in microfluidic systems.",
    price: "Quote",
    tags: ["Meter", "Calibration", "Verification"],
    icon: "sensor",
    image: catalogImages.pump,
  },
  {
    id: "lateral-flow-assay-materials",
    name: "Lateral Flow Assay Materials",
    category: "diagnostics",
    description: "Materials and consumables for lateral-flow assay development, strip builds, and feasibility testing.",
    price: "Quote",
    tags: ["LFIA", "Assay", "RUO"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "nitrocellulose-membranes",
    name: "Nitrocellulose Membranes",
    category: "diagnostics",
    description: "Nitrocellulose membrane options for LFIA line development, flow-rate tuning, and assay screening.",
    price: "Quote",
    tags: ["Membrane", "LFIA", "Capillary flow"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "sample-pads",
    name: "Sample Pads",
    category: "diagnostics",
    description: "Sample-pad materials for filtration, sample conditioning, and lateral-flow strip assembly.",
    price: "Quote",
    tags: ["Sample pad", "Strip build", "Screening"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "conjugate-pads",
    name: "Conjugate Pads",
    category: "diagnostics",
    description: "Conjugate pad materials for reagent deposition, drying, and release studies in rapid tests.",
    price: "Quote",
    tags: ["Conjugate", "Reagent release", "LFIA"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "absorbent-pads",
    name: "Absorbent Pads",
    category: "diagnostics",
    description: "Wicking and absorbent pads for lateral-flow strip backing, fluid draw, and assay timing control.",
    price: "Quote",
    tags: ["Absorbent", "Wicking", "Strip"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "diagnostic-cartridges",
    name: "Diagnostic Cartridges",
    category: "diagnostics",
    description: "Custom or sourced cartridge formats for assay integration, sample handling, and prototype testing.",
    price: "Quote",
    tags: ["Cartridge", "Prototype", "OEM"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "rapid-test-housings",
    name: "Rapid Test Housings",
    category: "diagnostics",
    description: "Plastic cassette housings for LFIA strip assembly, usability testing, and pilot production.",
    price: "Quote",
    tags: ["Cassette", "Housing", "Pilot run"],
    icon: "parts",
    image: catalogImages.rapidTest,
  },
  {
    id: "custom-lfia-development",
    name: "Custom LFIA Development",
    category: "diagnostics",
    description: "Development support for LFIA material selection, strip architecture, assay workflow, and prototype builds.",
    price: "Quote",
    tags: ["Custom", "Assay development", "LFIA"],
    icon: "kit",
    image: catalogImages.rapidTest,
  },
  {
    id: "96-well-plates",
    name: "96-Well Plates",
    category: "lab-plastics",
    description: "Clear, black, white, sterile, and assay-specific 96-well plate options for routine lab workflows.",
    price: "Quote",
    tags: ["96-well", "Assay", "Plate"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "pcr-plates",
    name: "PCR Plates",
    category: "lab-plastics",
    description: "PCR plate options for thermal cycling, qPCR-compatible workflows, and molecular biology setups.",
    price: "Quote",
    tags: ["PCR", "Thermal cycling", "Plate"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "pcr-tubes",
    name: "PCR Tubes",
    category: "lab-plastics",
    description: "PCR tubes and strips for amplification workflows, assay prep, and sample processing.",
    price: "Quote",
    tags: ["PCR", "Tubes", "Strips"],
    icon: "parts",
    image: catalogImages.microplate,
  },
  {
    id: "centrifuge-tubes",
    name: "Centrifuge Tubes",
    category: "lab-plastics",
    description: "15 mL, 50 mL, and specialty centrifuge tubes for sample handling and routine lab use.",
    price: "Quote",
    tags: ["15 mL", "50 mL", "Sample prep"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "cryovials",
    name: "Cryovials",
    category: "lab-plastics",
    description: "Cryogenic storage vial options for sample banking, cell work, and cold-chain workflows.",
    price: "Quote",
    tags: ["Cryo", "Storage", "Vials"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "reservoir-trays",
    name: "Reservoir Trays",
    category: "lab-plastics",
    description: "Reagent reservoirs and trays for multichannel pipetting, liquid handling, and assay setup.",
    price: "Quote",
    tags: ["Reservoir", "Pipetting", "Automation"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "reagent-bottles",
    name: "Reagent Bottles",
    category: "lab-plastics",
    description: "Reagent bottles in common volumes and materials for storage, dispensing, and lab operations.",
    price: "Quote",
    tags: ["Bottles", "Storage", "Reagents"],
    icon: "parts",
    image: catalogImages.tips,
  },
  {
    id: "pipette-tips",
    name: "Pipette Tips",
    category: "lab-plastics",
    description: "Filtered, sterile, low-retention, and standard pipette tip options for routine lab purchasing.",
    price: "Quote",
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
  {
    id: "technical-sourcing-service",
    name: "Technical Sourcing Service",
    category: "services",
    description: "Engineer-guided sourcing for pumps, tubing, fittings, connectors, chips, LFIA materials, and sensors when the right supplier path is unclear.",
    price: "Quote",
    tags: ["Sourcing", "Engineer review", "Parts list"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-supplier-search-package",
    name: "Microfluidic Supplier Search Package",
    category: "services",
    description: "Includes five supplier options, capability comparison, and a short recommendation memo for a microfluidic setup or component need.",
    price: "Quote",
    tags: ["5 suppliers", "Comparison", "Memo"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "diagnostic-oem-match-package",
    name: "Diagnostic OEM Match Package",
    category: "services",
    description: "OEM/CDMO search package with supplier comparison and intro-email package for diagnostic consumables or assay hardware needs.",
    price: "Quote",
    tags: ["OEM/CDMO", "Intro package", "Diagnostics"],
    icon: "kit",
    image: catalogImages.rapidTest,
  },
  {
    id: "oem-microfluidic-device-ux-package",
    name: "OEM Microfluidic Device UX Package",
    category: "services",
    description: "Workflow mapping for OEMs and equipment makers turning complex microfluidic tuning, priming, valve states, and assay timing into simpler research-use or product-development operation.",
    price: "Quote",
    tags: ["OEM UX", "Workflow mapping", "Plug-and-play"],
    icon: "kit",
    image: catalogImages.oemPlugAndPlay,
  },
  {
    id: "microfluidics-beginner-kit",
    name: "Microfluidics Beginner Kit",
    category: "starter-kits",
    description: "Entry kit with PTFE tubing, silicone tubing, luer connectors, T-connectors, Y-connectors, syringes, and a small tubing cutter.",
    price: "Quote",
    tags: ["Beginner", "Universities", "Students"],
    icon: "kit",
    image: catalogImages.laminar,
  },
  {
    id: "flow-testing-kit",
    name: "Flow Testing Kit",
    category: "starter-kits",
    description: "Flow setup kit with premium tubing, connectors, syringes, flow sensor, pressure gauge, and sample holder.",
    price: "Quote",
    tags: ["Flow sensor", "Pressure gauge", "Testing"],
    icon: "kit",
    image: catalogImages.pump,
  },
  {
    id: "microfluidic-prototyping-kit",
    name: "Microfluidic Prototyping Kit",
    category: "starter-kits",
    description: "Advanced kit with tubing assortment, connector assortment, flow-control accessories, chip holders, sample chips, and technical consultation.",
    price: "Quote",
    tags: ["Prototype", "Chip holders", "Consultation"],
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

const categoryCatalogPrefixes = {
  microfluidics: "MF",
  "fluid-handling": "FH",
  "flow-control": "FC",
  diagnostics: "DX",
  "lab-plastics": "LP",
  oem: "OEM",
  services: "SVC",
  "starter-kits": "KIT",
};

const productCategoryLabels = {
  microfluidics: "Microfluidics & Lab-on-Chip",
  "fluid-handling": "Tubing & Fluid Handling",
  "flow-control": "Syringe Pumps & Flow Control",
  diagnostics: "Diagnostics Consumables",
  "lab-plastics": "Lab Plastics",
  oem: "OEM Manufacturing",
  services: "Productized Services",
  "starter-kits": "Microfluidic Starter Kits",
};

const productCatalogCategories = [
  "microfluidics",
  "fluid-handling",
  "flow-control",
  "diagnostics",
  "lab-plastics",
  "oem",
];

function getProductSubclass(product) {
  const name = product.name.toLowerCase();
  const tags = product.tags.join(" ").toLowerCase();
  const text = `${name} ${tags}`;

  if (product.category === "microfluidics") {
    if (text.includes("custom") || text.includes("prototyping")) return "Custom fabrication";
    if (text.includes("droplet") || text.includes("mixer")) return "Chip functions";
    if (text.includes("organ") || text.includes("cell")) return "Cell and tissue chips";
    return "Chip materials";
  }

  if (product.category === "fluid-handling") {
    if (text.includes("tubing") || text.includes("ptfe") || text.includes("fep") || text.includes("peek")) return "Tubing";
    if (text.includes("connector") || text.includes("fitting") || text.includes("manifold")) return "Connectors and manifolds";
    if (text.includes("reservoir") || text.includes("bottle")) return "Reservoirs";
    return "Fluidic accessories";
  }

  if (product.category === "flow-control") {
    if (text.includes("pump")) return "Pumps";
    if (text.includes("valve")) return "Valves";
    if (text.includes("sensor") || text.includes("meter")) return "Sensors and meters";
    return "Controllers";
  }

  if (product.category === "diagnostics") {
    if (text.includes("lfia") || text.includes("membrane") || text.includes("pad")) return "LFIA materials";
    if (text.includes("cartridge") || text.includes("housing") || text.includes("cassette")) return "Cartridges and housings";
    return "Assay development";
  }

  if (product.category === "lab-plastics") {
    if (text.includes("plate")) return "Plates";
    if (text.includes("tube") || text.includes("vial")) return "Tubes and vials";
    return "Pipetting and storage";
  }

  if (product.category === "oem") {
    if (text.includes("mold") || text.includes("plastic")) return "Molded parts";
    if (text.includes("cartridge") || text.includes("cassette")) return "Cartridges and cassettes";
    return "Manufacturing support";
  }

  if (product.category === "services") {
    if (text.includes("sourcing") || text.includes("supplier")) return "Supplier search";
    return "OEM matching";
  }

  if (product.category === "starter-kits") {
    if (text.includes("beginner")) return "Beginner";
    if (text.includes("flow")) return "Flow testing";
    return "Prototyping";
  }

  return "General";
}

function assignCatalogMetadata() {
  const counters = new Map();
  products.forEach((product) => {
    const prefix = categoryCatalogPrefixes[product.category] || "GEN";
    const next = (counters.get(prefix) || 0) + 1;
    counters.set(prefix, next);
    product.sku = `MCD-${prefix}-${String(next).padStart(3, "0")}`;
    product.subclass = getProductSubclass(product);
  });
}

assignCatalogMetadata();
products.forEach(product=>{
 Object.assign(product,QuoteState.classify(product));
 if(product.id==="pdms-microfluidic-chips"){
 product.name="PDMS Microfluidic Chips — Custom Sourcing & Fabrication Enquiry";
 product.description="Tell us your experiment, channel geometry, assembly needs, and quantity. Requirements are reviewed to identify a suitable sourcing or fabrication route before a written proposal is issued.";
 }else{
 product.description=product.category==="services"?"Describe the scope, inputs and deliverables sought. The engineering work is reviewed before an agreed scope is proposed.":product.category==="starter-kits"?"Describe your intended experiment. Kit contents, compatibility, supply source and pricing are confirmed in the proposal.":"Discuss your requirements for "+product.name.toLowerCase()+". This enquiry category does not identify a fixed, stocked product. Specification, source and supply route require review.";
 }
});

products.forEach((product) => {
  if (!productsWithRepresentativeImages.has(product.id)) {
    product.image = null;
  }
});

const genericCatalogImageSources = new Set([
  catalogImages.chip.source,
  catalogImages.chipClose.source,
  catalogImages.laminar.source,
  catalogImages.pump.source,
  catalogImages.rapidTest.source,
  catalogImages.microplate.source,
  catalogImages.tips.source,
]);

const specificProductImageSources = new Set([
  catalogImages.oemPlugAndPlay.source,
]);

function getCustomCatalogImage(product) {
  if (specificProductImageSources.has(product.image?.source)) return product.image;

  if (product.category === "microfluidics") return catalogImages.customMicrofluidicChips;

  if (product.category === "fluid-handling") {
    if (product.subclass === "Tubing") return catalogImages.customTubing;
    if (product.subclass === "Connectors and manifolds") return catalogImages.customFittings;
    return catalogImages.customReservoirs;
  }

  if (product.category === "flow-control") {
    if (product.subclass === "Valves" || product.subclass === "Sensors and meters") return catalogImages.customSensorsValves;
    return catalogImages.customPumps;
  }

  if (product.category === "diagnostics") return catalogImages.customDiagnostics;
  if (product.category === "lab-plastics") return catalogImages.customLabPlastics;
  if (product.category === "oem") return catalogImages.customOemManufacturing;
  if (product.category === "services" && product.id === "oem-microfluidic-device-ux-package") return catalogImages.oemPlugAndPlay;
  if (product.category === "services" || product.category === "starter-kits") return catalogImages.customServicesKits;

  return catalogImages.customMicrofluidicChips;
}

products.forEach((product) => {
  if (!product.image || genericCatalogImageSources.has(product.image.source)) {
    product.image = getCustomCatalogImage(product);
  }
});

function isPriceRange(price) {
  return /\$[\d,.]+-\$?[\d,.]+/.test(price);
}

function isExactPrice(price) {
  return /^\$[\d,.]+(?:\.\d{2})?(?:\s*\/\s*[\w\s]+)?$/.test(price.trim());
}

function getOptionPriceLabel(product,option=null){return QuoteState.classify(product).pricing.status;}
function getOptionNumericPrice(product,option=null){const label=getOptionPriceLabel(product,option);const match=label.match(/^\$([\d,.]+)$/);return match?Number(match[1].replace(/,/g,"")):null;}

function makeOption(label, priceLabel = "Price on request", note = "Final supplier price confirmed before order") {
  const price = isExactPrice(priceLabel) ? priceLabel : "";
  return { label, price, priceLabel, note };
}

function getProductOptions(product){return [makeOption("Configuration to be defined","Pricing after specification review","Requirements, not a confirmed variant")];}
function getSelectedOptionIndex(product) {
  return Number(selectedOptions.get(product.id) || 0);
}

function getSelectedOption(product) {
  const options = getProductOptions(product);
  return options[getSelectedOptionIndex(product)] || options[0];
}

function getDisplayPrice(product){return getOptionPriceLabel(product,getSelectedOption(product));}

function getCartKey(product, optionIndex = getSelectedOptionIndex(product)) {
  return `${product.id}::${optionIndex}`;
}

function getMarketPosition(product){return "Enquiry category. Specification, source, availability and lead time require confirmation in the proposal.";}
function getDocumentationNote(){return "Tell us the documentation you require; availability must be confirmed. No certification or inspection is promised.";}
function getProductDetailPack(product){return {brand:"",role:product.commercialRole,marketPosition:getMarketPosition(product),variants:QuoteState.schema(product).map(f=>f.label),checklist:["Application / design","Quantity or To be determined","Destination","Documentation needs"],documentationNote:getDocumentationNote()};}

const selected = new Map();
const selectedOptions = new Map();
const productGrid = document.querySelector("#productGrid");
const quoteList = document.querySelector("#quoteList");
const emptyQuote = document.querySelector("#emptyQuote");
const quoteMail = document.querySelector("#quoteMail");
const stripePayLink = document.querySelector("#stripePayLink");
const cartSubtotal = document.querySelector("#cartSubtotal");
const quoteForm = document.querySelector("#quoteForm");
const contactForm = document.querySelector("#contactForm");
const contactMail = document.querySelector("#contactMail");
const creditList = document.querySelector("#creditList");
const filterButtons = document.querySelectorAll(".filter-button");
const classFilter = document.querySelector("#classFilter");
const subclassFilter = document.querySelector("#subclassFilter");
const catalogSearch = document.querySelector("#catalogSearch");
const catalogClassMenu = document.querySelector("#catalogClassMenu");
const catalogResultsCount = document.querySelector("#catalogResultsCount");
const catalogLoadMore = document.querySelector("#catalogLoadMore");
const catalogRouteLinks = document.querySelectorAll("[data-class-route]");
const productDetail = document.querySelector("#productDetail");
const heroDotField = document.querySelector("#heroDotField");
const recommendationForm = document.querySelector("#recommendationForm");
const recommendationStatus = document.querySelector("#recommendationStatus");
const productDetailId = document.body.dataset.productDetail || "";
const catalogScope = document.body.dataset.catalogScope || "all";
const companyEmail = "info@microcdlabs.com";
const catalogPageSize = 18;
let catalogDisplayLimit = catalogPageSize;
let catalogViewKey = "";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getProductPageUrl(product) {
  return `catalog/${product.id}.html`;
}

function getProductSearchText(product) {
  return [
    product.name,
    product.description,
    product.price,
    product.sku,
    productCategoryLabels[product.category],
    product.subclass,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();
}

function resolveAssetUrl(url, prefix = "") {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${prefix}${url}`;
}

function initHeroDotField() {
  if (!heroDotField) return;
  const hero = heroDotField.closest(".hero");
  const context = heroDotField.getContext("2d");
  if (!hero || !context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let dots = [];
  let pointer = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    heroDotField.width = Math.round(width * pixelRatio);
    heroDotField.height = Math.round(height * pixelRatio);
    heroDotField.style.width = `${width}px`;
    heroDotField.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const spacing = width < 720 ? 24 : 28;
    const rows = Math.ceil(height / spacing) + 2;
    const columns = Math.ceil(width / spacing) + 2;
    dots = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        dots.push({
          x: column * spacing - spacing / 2,
          y: row * spacing - spacing / 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function updatePointer(event) {
    const rect = hero.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
    draw();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    dots.forEach((dot) => {
      const dx = dot.x - pointer.x;
      const dy = dot.y - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = pointer.active ? Math.max(0, 1 - distance / 150) : 0;
      const shimmer = reduceMotion.matches ? 0 : (Math.sin(dot.phase) + 1) * 0.06;
      const radius = 1.05 + influence * 2.15 + shimmer;
      const alpha = 0.22 + influence * 0.78 + shimmer;

      context.beginPath();
      context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      context.fillStyle =
        influence > 0.02
          ? `rgba(69, 255, 172, ${Math.min(alpha, 0.96)})`
          : `rgba(39, 84, 119, ${Math.min(alpha, 0.18)})`;
      context.shadowColor = influence > 0.02 ? "rgba(69, 255, 172, 0.62)" : "transparent";
      context.shadowBlur = influence * 16;
      context.fill();
    });

    context.shadowBlur = 0;
  }

  resize();
  draw();
  hero.addEventListener("pointermove", updatePointer);
  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
    draw();
  });
  window.addEventListener("resize", () => {
    resize();
    draw();
  });
}

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

function getScopedProducts() {
  if (catalogScope === "products") return products.filter((product) => productCatalogCategories.includes(product.category));
  if (catalogScope === "services") return products.filter((product) => product.category === "services");
  if (catalogScope === "kits") return products.filter((product) => product.category === "starter-kits");
  return products;
}

function getCurrentCatalogFilters() {
  const activeButtonFilter = document.querySelector(".filter-button.active")?.dataset.filter || "all";
  return {
    category: classFilter?.value || activeButtonFilter,
    subclass: subclassFilter?.value || "all",
  };
}

function populateCatalogControls() {
  if (!classFilter) return;
  const scopedProducts = getScopedProducts();
  const categories = Array.from(new Set(scopedProducts.map((product) => product.category)));

  classFilter.innerHTML = [
    '<option value="all">All enquiry categories</option>',
    ...categories.map((category) => `<option value="${category}">${productCategoryLabels[category] || category}</option>`),
  ].join("");

  renderCatalogClassMenu(categories);
  updateSubclassOptions();
}

function renderCatalogClassMenu(categories) {
  if (!catalogClassMenu) return;
  catalogClassMenu.innerHTML = [
    '<button class="catalog-class-button active" type="button" data-class-menu="all">All</button>',
    ...categories.map(
      (category) =>
        `<button class="catalog-class-button" type="button" data-class-menu="${category}">${productCategoryLabels[category] || category}</button>`,
    ),
  ].join("");
}

function updateSubclassOptions() {
  if (!subclassFilter) return;
  const scopedProducts = getScopedProducts();
  const selectedCategory = classFilter?.value || "all";
  const subclassProducts =
    selectedCategory === "all" ? scopedProducts : scopedProducts.filter((product) => product.category === selectedCategory);
  const subclasses = Array.from(new Set(subclassProducts.map((product) => product.subclass))).sort();

  subclassFilter.innerHTML = [
    '<option value="all">All subclasses</option>',
    ...subclasses.map((subclass) => `<option value="${subclass}">${subclass}</option>`),
  ].join("");
}

function applyInitialCatalogParams() {
  if (!classFilter && !catalogSearch) return;
  const params = new URLSearchParams(window.location.search);
  const category = params.get("class");
  const subclass = params.get("subclass");
  const query = params.get("q");

  if (category && classFilter && Array.from(classFilter.options).some((option) => option.value === category)) {
    classFilter.value = category;
    updateSubclassOptions();
  }

  if (subclass && subclassFilter && Array.from(subclassFilter.options).some((option) => option.value === subclass)) {
    subclassFilter.value = subclass;
  }

  if (query && catalogSearch) {
    catalogSearch.value = query;
  }

  if (catalogClassMenu && classFilter) {
    catalogClassMenu.querySelectorAll("[data-class-menu]").forEach((button) => {
      button.classList.toggle("active", button.dataset.classMenu === classFilter.value);
    });
  }
}

function renderProducts(filter = null) {
  if (!productGrid) return;
  const scopedProducts = getScopedProducts();
  const filters = getCurrentCatalogFilters();
  const category = filter || filters.category || "all";
  const subclass = filters.subclass || "all";
  const searchTerm = (catalogSearch?.value || "").trim().toLowerCase();
  const visible = scopedProducts.filter((product) => {
    const categoryMatch = category === "all" || product.category === category;
    const subclassMatch = subclass === "all" || product.subclass === subclass;
    const searchMatch = !searchTerm || getProductSearchText(product).includes(searchTerm);
    return categoryMatch && subclassMatch && searchMatch;
  });
  const nextViewKey = `${category}|${subclass}|${searchTerm}`;
  if (nextViewKey !== catalogViewKey) {
    catalogDisplayLimit = catalogPageSize;
    catalogViewKey = nextViewKey;
  }
  const renderedProducts = visible.slice(0, catalogDisplayLimit);

  if (catalogResultsCount) {
    catalogResultsCount.textContent = visible.length > renderedProducts.length
      ? `${renderedProducts.length} of ${visible.length} items shown`
      : `${visible.length} ${visible.length === 1 ? "item" : "items"} shown`;
  }

  if (catalogLoadMore) {
    const remaining = Math.max(0, visible.length - renderedProducts.length);
    catalogLoadMore.hidden = remaining === 0;
    catalogLoadMore.textContent = remaining ? `Show more enquiries (${remaining} remaining)` : "All enquiries shown";
  }

  productGrid.innerHTML=renderedProducts.map(product=>'<article class="product-card"><a class="product-visual" href="'+getProductPageUrl(product)+'"><img class="product-image" src="'+escapeHtml(product.image.url)+'" alt="Representative illustration for '+escapeHtml(product.name)+'" loading="lazy" width="480" height="320"><span class="image-credit">Representative illustration; not an exact supplied item</span></a><div class="product-body"><p class="eyebrow">'+escapeHtml(product.offeringType)+'</p><h3>'+escapeHtml(product.name)+'</h3><p>'+escapeHtml(product.description)+'</p><p><strong>'+escapeHtml(product.specificationCompleteness)+'</strong><br>'+escapeHtml(product.pricing.status)+'</p><p>Enquiry reference: '+escapeHtml(product.sku)+'</p><p>Source, availability and lead time to be confirmed.</p></div><div class="product-card-actions"><a class="button button-primary" href="'+getProductPageUrl(product)+'#requirements">Describe requirements</a></div></article>').join("");
  if (!visible.length) {
    productGrid.innerHTML = '<p class="empty-catalog">No catalog items match this classification yet.</p>';
  }
}

function getStartingPrice(product) {
  const match = product.price.match(/\$([\d,.]+)/);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ""));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}

function renderCredits() {
  if (!creditList) return;
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
          <a href="${image.source}" target="_blank" rel="noreferrer">${escapeHtml(image.title || image.credit)}</a>
          <span>by ${escapeHtml(image.credit)}</span>
          ${
            image.licenseUrl
              ? `<a href="${image.licenseUrl}" target="_blank" rel="noreferrer">${escapeHtml(image.license)}</a>`
              : `<span>${escapeHtml(image.license)}</span>`
          }
          ${image.modifications ? `<span>${escapeHtml(image.modifications)}</span>` : ""}
        </li>
      `,
    )
    .join("");
}


function enquiryFieldsHTML(product, value={}, scope="detail", qty="To be determined"){
 const e=escapeHtml,common=(key,label,required=false,type="text")=>'<label>'+label+(required?' (required)':'')+'<input data-enquiry-field="'+key+'" name="'+scope+'-'+key+'" maxlength="'+QuoteState.fieldLimit+'" type="'+type+'" '+(required?'required ':'')+'value="'+e(value[key]||'')+'" placeholder="'+(required?'Brief non-confidential description':'Not sure—please advise')+'"></label>';
 return '<div class="enquiry-fields"><label>Application / design description (required)<textarea data-enquiry-field="application" maxlength="'+QuoteState.fieldLimit+'" required rows="3" placeholder="What are you trying to do? A short non-confidential description is enough.">'+e(value.application||'')+'</textarea></label><label>Quantity (required)<input data-enquiry-quantity required maxlength="24" value="'+e(qty)+'" placeholder="e.g. 10 or To be determined" aria-describedby="'+scope+'-quantity-help"></label><p id="'+scope+'-quantity-help" class="field-help">Enter 1–9999, or “To be determined”. For a service, use “To be determined” if scope is not yet agreed.</p><details class="enquiry-technical"><summary>Additional technical details (optional)</summary><div class="enquiry-fields">'+QuoteState.schema(product).map(f=>f.options?'<label>'+e(f.label)+'<select data-enquiry-field="'+f.key+'">'+f.options.map(o=>'<option '+(value[f.key]===o?'selected':'')+'>'+e(o)+'</option>').join('')+'</select></label>':common(f.key,e(f.label))).join('')+common('configuration','Requested configuration')+common('destination','Destination country and ZIP / postcode')+common('date',product.category==='services'?'Desired completion date':'Desired receipt date')+common('documentation','Documentation / institutional purchasing requirements')+'</div></details></div>';
}
function getEnquiryDetailHTML(product,prefix="../"){
 const e=escapeHtml,s=QuoteState.classify(product),isPDMS=product.id==="pdms-microfluidic-chips",service=s.offeringType==="Engineering service";
 const alternatives=isPDMS?'<nav class="material-alternatives" aria-label="Alternative material enquiries"><strong>Other materials, separate enquiries:</strong> <a href="glass-microfluidic-chips.html">Glass</a> · <a href="coc-microfluidic-chips.html">COC</a> · <a href="pmma-microfluidic-chips.html">PMMA</a></nav>':'';
 return '<section class="section product-detail-section" aria-labelledby="product-detail-title"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="'+prefix+'products.html">Research components &amp; custom sourcing</a><span aria-hidden="true">/</span><span>'+e(product.sku)+'</span></nav><div class="product-detail-layout"><div class="product-detail-media"><img src="'+e(resolveAssetUrl(product.image?.url||'assets/catalog-custom/microfluidic-chips.jpg',prefix))+'" width="960" height="640" alt="Representative illustration for '+e(product.name)+'"><p class="image-credit">Representative illustration, not the exact item to be supplied. '+'</p></div><div class="product-detail-copy"><p class="eyebrow">'+e(s.offeringType)+'</p><h1 id="product-detail-title">'+e(product.name)+'</h1><p>'+e(product.description)+'</p><p class="enquiry-status"><strong>'+e(s.specificationCompleteness)+'</strong><br>'+e(s.pricing.status)+'<br>'+e(s.supplyConfirmation)+'</p><a class="button button-primary" href="#requirements">'+(isPDMS?'Discuss your PDMS chip requirements':service?'Discuss the scope':'Describe your requirements')+'</a><dl class="product-detail-specs"><div><dt>Enquiry reference</dt><dd>'+e(product.sku)+'</dd></div><div><dt>Offering type</dt><dd>'+e(s.offeringType)+'</dd></div><div><dt>Commercial role</dt><dd>'+e(s.commercialRole)+'</dd></div><div><dt>Supply source</dt><dd>'+(service?'Service provider and fabrication responsibility to be confirmed in the proposal.':'To be confirmed in the proposal')+'</dd></div><div><dt>Availability and lead time</dt><dd>Confirmed after specification and supplier review</dd></div></dl>'+alternatives+'</div></div><section class="enquiry-scope"><h2>'+(service?'Agree the work before it starts':'From requirements to a suitable route')+'</h2><p>'+(isPDMS?'This configurable enquiry category does not identify a fixed chip design. ':'')+'Requirements clarification, supplier identification, RFQ preparation and coordination may be included within an agreed scope. Fabrication responsibility is identified in the proposal. These are generic enquiry categories, not references to particular suppliers or third-party product catalogs. No manufacturer relationship or inventory is implied.</p><p>Where applicable, the proposal distinguishes engineering fees, tooling or mold charges, components, and shipping. These charges do not apply automatically. Any paid feasibility, sourcing or engineering scope is stated for agreement before work begins.</p></section><form id="detailEnquiryForm" class="contact-form enquiry-form" aria-labelledby="requirements"><h2 id="requirements">Requirements to discuss</h2><p>Share non-confidential information only. “Not sure—please advise” is welcome. No drawing upload is required; files can be exchanged by email after the initial discussion. Opening an email draft does not attach files.</p>'+enquiryFieldsHTML(product,{},"detail")+'<div class="product-detail-actions"><button class="button button-primary" type="submit" data-add-enquiry="'+e(product.id)+'">Add to enquiry</button><a class="button button-secondary" href="'+prefix+'products.html#quote">Your enquiry list</a></div><p id="detailQuoteStatus" role="status"></p><section id="detailEnquiryFallback" class="quote-draft" hidden><label for="detailEnquiryDraft">Draft for manual copying (not saved or sent)</label><textarea id="detailEnquiryDraft" readonly rows="10"></textarea><p>Select and copy these details, then email them to <a href="mailto:info@microcdlabs.com">info@microcdlabs.com</a>. Do this before leaving or reloading this page.</p></section></form><noscript><style>.enquiry-form{display:none}</style><p>The interactive enquiry form needs JavaScript. Email your application, design needs, quantity, destination and documentation needs to <a href="mailto:info@microcdlabs.com?subject='+encodeURIComponent(QuoteState.subject([{product}]))+'">info@microcdlabs.com</a>, quoting '+e(product.sku)+'. Nothing is submitted by this page.</p></noscript></section>';
}
function renderProductDetail(){
 if(!productDetail||!productDetailId)return;
 const product=products.find(p=>p.id===productDetailId);if(!product)return;
 productDetail.innerHTML=getEnquiryDetailHTML(product);
 document.title=product.name+" | Research enquiry";
 document.querySelector("#detailEnquiryForm")?.addEventListener("submit",event=>{
  event.preventDefault();const form=event.currentTarget,q=form.querySelector("[data-enquiry-quantity]"),valid=QuoteState.quantity(q.value);
  q.setCustomValidity(valid?"":"Enter a whole number from 1 to 9999, or To be determined.");if(!form.reportValidity())return;
  const requirements={};form.querySelectorAll("[data-enquiry-field]").forEach(f=>requirements[f.dataset.enquiryField]=f.value);
  const key=QuoteState.newKey(product);selected.set(key,{key,product,option:getProductOptions(product)[0],optionIndex:0,quantity:valid,requirements,notes:""});
  const saved=renderQuote();document.querySelector("#detailQuoteStatus").innerHTML='Added to your enquiry list. Nothing has been sent. <a href="../products.html#quote">Review details and add your contact information</a>.';
  if(!saved){
   document.querySelector("#detailQuoteStatus").textContent="Your browser could not save this enquiry. It is available on this page only. Copy the draft below before leaving. Nothing has been sent.";
   const fallback=document.querySelector("#detailEnquiryFallback");fallback.hidden=false;
   const draft=fallback.querySelector("textarea");draft.value=QuoteState.request([...selected.values()]);draft.focus();draft.select();
  }
 });
 document.querySelector("[data-enquiry-quantity]")?.addEventListener("input",e=>e.target.setCustomValidity(""));
}

const QUOTE_STORAGE="microcd-quote-v1";
function persistQuote(){try{const old=JSON.parse(sessionStorage.getItem(QUOTE_STORAGE)||"{}");sessionStorage.setItem(QUOTE_STORAGE,JSON.stringify({version:3,items:QuoteState.serialize([...selected.values()]),notes:document.querySelector("#quoteNotes")?.value??old.notes??""}));return true;}catch{return false;}}
function restoreQuote(){
 try{const saved=JSON.parse(sessionStorage.getItem(QUOTE_STORAGE)||"{}");if(![1,2,3].includes(saved.version))return;
 for(const item of saved.items||[]){const product=products.find(p=>p.id===item.id);if(!product)continue;const key=typeof item.key==="string"&&item.key.startsWith(product.id+"::")&&/^[a-zA-Z0-9:_-]{1,180}$/.test(item.key)&&!selected.has(item.key)?item.key:QuoteState.newKey(product);selected.set(key,{key,product,option:getProductOptions(product)[0],optionIndex:0,quantity:QuoteState.quantity(String(item.quantity))||"To be determined",requirements:QuoteState.requirements(product,item.requirements),notes:QuoteState.cleanNotes(item.notes)});}
 if(document.querySelector("#quoteNotes"))document.querySelector("#quoteNotes").value=QuoteState.cleanNotes(saved.notes);
 }catch{}
}
function renderQuote(renderList=true){
 const saved=persistQuote();if(!quoteForm||!quoteList||!emptyQuote||!quoteMail)return saved;
 const storageStatus=document.querySelector("#enquiryStorageStatus");if(storageStatus){storageStatus.hidden=saved;storageStatus.textContent=saved?"":"Your browser could not save this enquiry list. Copy the prepared details before leaving or reloading this page.";}
 const items=[...selected.values()];
 if(renderList)quoteList.innerHTML=items.map((entry,i)=>'<li class="enquiry-item" data-enquiry-key="'+escapeHtml(entry.key)+'"><h3>'+escapeHtml(entry.product.name)+'</h3><p>Enquiry reference: '+escapeHtml(entry.product.sku)+' · '+escapeHtml(entry.product.offeringType)+'</p>'+enquiryFieldsHTML(entry.product,entry.requirements||{},"entry-"+i,entry.quantity)+(entry.notes?'<p>Saved notes: '+escapeHtml(entry.notes)+'</p>':'')+'<button class="button button-secondary" type="button" data-remove="'+escapeHtml(entry.key)+'">Remove enquiry</button></li>').join("");
 emptyQuote.hidden=!!items.length;
 if(cartSubtotal)cartSubtotal.hidden=true;
 if(stripePayLink)stripePayLink.hidden=true;
 const contact=Object.fromEntries(new FormData(quoteForm));
 const preview=document.querySelector("#quotePreview");if(preview)preview.value=QuoteState.request(items,contact);
 const subject=QuoteState.subject(items);
 // Requirements and personal details stay out of URLs. The reviewed draft is copied manually.
 quoteMail.href=items.length?"mailto:"+companyEmail+"?subject="+encodeURIComponent(subject):"#";
 quoteMail.classList.toggle("disabled",!items.length);quoteMail.setAttribute("aria-disabled",String(!items.length));
 const copy=document.querySelector("#copyQuote");if(copy)copy.disabled=!items.length;
 return saved;
}
function validEnquiry(){
 if(!selected.size){document.querySelector("#quoteStatus").textContent="Add an enquiry first.";return false;}
 for(const q of quoteList.querySelectorAll("[data-enquiry-quantity]"))q.setCustomValidity(QuoteState.quantity(q.value)?"":"Enter 1–9999, or To be determined.");
 const fields=[...quoteList.querySelectorAll("input,textarea,select"),...quoteForm.querySelectorAll("input,textarea")];
 const invalid=fields.find(f=>!f.checkValidity());if(invalid){invalid.reportValidity();invalid.focus();return false;}return true;
}
function renderContactMail() {
  if (!contactForm || !contactMail) return;
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

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderProducts(button.dataset.filter);
    });
  });
}

if (classFilter) {
  populateCatalogControls();
  applyInitialCatalogParams();
  classFilter.addEventListener("change", () => {
    updateSubclassOptions();
    if (catalogClassMenu) {
      catalogClassMenu.querySelectorAll("[data-class-menu]").forEach((button) => {
        button.classList.toggle("active", button.dataset.classMenu === classFilter.value);
      });
    }
    renderProducts();
  });
}

if (subclassFilter) {
  subclassFilter.addEventListener("change", () => renderProducts());
}

if (catalogSearch) {
  catalogSearch.addEventListener("input", () => renderProducts());
}

if (catalogLoadMore) {
  catalogLoadMore.addEventListener("click", () => {
    catalogDisplayLimit += catalogPageSize;
    renderProducts();
  });
}

if (catalogClassMenu) {
  catalogClassMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-class-menu]");
    if (!button || !classFilter) return;
    classFilter.value = button.dataset.classMenu;
    updateSubclassOptions();
    catalogClassMenu.querySelectorAll("[data-class-menu]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });
}

if (catalogRouteLinks.length) {
  catalogRouteLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!classFilter) return;
      event.preventDefault();
      const category = link.dataset.classRoute;
      if (!Array.from(classFilter.options).some((option) => option.value === category)) return;
      classFilter.value = category;
      if (catalogSearch) catalogSearch.value = "";
      updateSubclassOptions();
      if (catalogClassMenu) {
        catalogClassMenu.querySelectorAll("[data-class-menu]").forEach((button) => {
          button.classList.toggle("active", button.dataset.classMenu === category);
        });
      }
      catalogRouteLinks.forEach((item) => item.classList.toggle("active", item === link));
      renderProducts();
      document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

if(quoteList){
 quoteList.addEventListener("input",event=>{
  const item=event.target.closest("[data-enquiry-key]");if(!item)return;
  const entry=selected.get(item.dataset.enquiryKey);if(!entry)return;
  if(event.target.matches("[data-enquiry-quantity]")){entry.quantity=event.target.value;event.target.setCustomValidity("");}
  if(event.target.dataset.enquiryField)entry.requirements[event.target.dataset.enquiryField]=event.target.value;
  renderQuote(false);
 });
 quoteList.addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(!button)return;selected.delete(button.dataset.remove);renderQuote();});
}
function initNavigationMenus() {
  const menus = Array.from(document.querySelectorAll(".nav-menu"));
  if (!menus.length) return;
  const navigation = document.querySelector(".main-nav");
  const header = navigation?.closest(".site-header");
  const desktopQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const desktopWidthQuery = window.matchMedia("(min-width: 761px)");
  const closeTimers = new WeakMap();

  let navigationToggle = null;
  if (navigation && header) {
    navigation.id ||= "primaryNavigation";
    navigationToggle = document.createElement("button");
    navigationToggle.className = "nav-toggle";
    navigationToggle.type = "button";
    navigationToggle.setAttribute("aria-controls", navigation.id);
    navigationToggle.setAttribute("aria-expanded", "false");
    navigationToggle.setAttribute("aria-label", "Open navigation");
    navigationToggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
    header.insertBefore(navigationToggle, navigation);

    navigationToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("mobile-nav-open");
      navigationToggle.setAttribute("aria-expanded", String(isOpen));
      navigationToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      if (!isOpen) closeMenus();
    });
  }

  function closeMenus(exceptMenu = null) {
    menus.forEach((menu) => {
      if (menu !== exceptMenu) menu.removeAttribute("open");
    });
  }

  function clearCloseTimer(menu) {
    const timer = closeTimers.get(menu);
    if (timer) window.clearTimeout(timer);
    closeTimers.delete(menu);
  }

  function scheduleClose(menu, delay = 120) {
    clearCloseTimer(menu);
    closeTimers.set(
      menu,
      window.setTimeout(() => {
        menu.removeAttribute("open");
        closeTimers.delete(menu);
      }, delay),
    );
  }

  function openMenu(menu) {
    clearCloseTimer(menu);
    closeMenus(menu);
    menu.setAttribute("open", "");
  }

  function shouldUseDesktopMenu(event = null) {
    return desktopWidthQuery.matches && (desktopQuery.matches || event?.pointerType === "mouse");
  }

  menus.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeMenus(menu);
    });

    menu.addEventListener("pointerenter", (event) => {
      if (shouldUseDesktopMenu(event)) openMenu(menu);
    });

    menu.addEventListener("pointerleave", (event) => {
      if (shouldUseDesktopMenu(event)) scheduleClose(menu);
    });

    menu.addEventListener("focusin", () => {
      if (shouldUseDesktopMenu()) openMenu(menu);
    });

    menu.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (shouldUseDesktopMenu() && !menu.contains(document.activeElement)) scheduleClose(menu, 0);
      }, 0);
    });

    menu.addEventListener("click", (event) => {
      if (shouldUseDesktopMenu(event) && event.target.closest("summary")) {
        event.preventDefault();
        openMenu(menu);
        return;
      }
      if (event.target.closest(".nav-menu-list a")) {
        menu.removeAttribute("open");
        header?.classList.remove("mobile-nav-open");
        navigationToggle?.setAttribute("aria-expanded", "false");
        navigationToggle?.setAttribute("aria-label", "Open navigation");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".main-nav")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      header?.classList.remove("mobile-nav-open");
      navigationToggle?.setAttribute("aria-expanded", "false");
      navigationToggle?.setAttribute("aria-label", "Open navigation");
    }
  });

  desktopWidthQuery.addEventListener("change", (event) => {
    if (event.matches) {
      header?.classList.remove("mobile-nav-open");
      navigationToggle?.setAttribute("aria-expanded", "false");
      navigationToggle?.setAttribute("aria-label", "Open navigation");
    }
    closeMenus();
  });
}

if (quoteForm) quoteForm.addEventListener("input", ()=>renderQuote(false));
if (contactForm) contactForm.addEventListener("input", renderContactMail);

restoreQuote();
renderProducts();
renderProductDetail();
renderQuote();
renderCredits();
renderContactMail();
initHeroDotField();

if(!document.querySelector('script[src*="site.js"]'))initNavigationMenus();

document.querySelector("#copyQuote")?.addEventListener("click",async()=>{
 if(!validEnquiry())return;const status=document.querySelector("#quoteStatus");
 try{await navigator.clipboard.writeText(document.querySelector("#quotePreview").value);status.textContent="Enquiry copied. Nothing has been sent. Open an email draft, paste the details, and send it yourself.";}
 catch{status.textContent="Copy was blocked. Select the preview text and paste it into your email. Nothing has been sent.";}
});
quoteMail?.addEventListener("click",event=>{
 if(!validEnquiry()){event.preventDefault();return;}
 document.querySelector("#quoteStatus").textContent="Opening an email draft with a subject only. Paste the reviewed details and send it yourself. Nothing has been sent or received by this website.";
});
