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
  fluigentOmi: {
    url: "assets/fluigent/omi.webp",
    alt: "Omi automated organ-on-a-chip platform",
    credit: "Fluigent",
    source: "assets/fluigent/omi.webp",
    license: "Provided product image",
  },
  fluigentAria: {
    url: "assets/fluigent/aria.webp",
    alt: "Aria automated perfusion system",
    credit: "Fluigent",
    source: "assets/fluigent/aria.webp",
    license: "Provided product image",
  },
  fluigentLineup: {
    url: "assets/fluigent/lineup-controller.webp",
    alt: "LineUp series microfluidic pressure-based flow controllers",
    credit: "Fluigent",
    source: "assets/fluigent/lineup-controller.webp",
    license: "Provided product image",
  },
  fluigentFlowEz: {
    url: "assets/fluigent/flow-ez-controller.webp",
    alt: "Flow EZ microfluidic flow and pressure controller",
    credit: "Fluigent",
    source: "assets/fluigent/flow-ez-controller.webp",
    license: "Provided product image",
  },
  fluigentMfcs: {
    url: "assets/fluigent/mfcs-system.webp",
    alt: "MFCS microfluidic flow control system",
    credit: "Fluigent",
    source: "assets/fluigent/mfcs-system.webp",
    license: "Provided product image",
  },
  fluigentPushPull: {
    url: "assets/fluigent/push-pull-controller.webp",
    alt: "Microfluidic push pull pressure controller",
    credit: "Fluigent",
    source: "assets/fluigent/push-pull-controller.webp",
    license: "Provided product image",
  },
  fluigentFlowRatePlatform: {
    url: "assets/fluigent/flow-rate-platform.webp",
    alt: "Microfluidic flow rate platform hub",
    credit: "Fluigent",
    source: "assets/fluigent/flow-rate-platform.webp",
    license: "Provided product image",
  },
  fluigentFlowUnit: {
    url: "assets/fluigent/flow-unit.webp",
    alt: "Bidirectional microfluidic flow sensor units",
    credit: "Fluigent",
    source: "assets/fluigent/flow-unit.webp",
    license: "Provided product image",
  },
  fluigentInlinePressureSensor: {
    url: "assets/fluigent/inline-pressure-sensor.webp",
    alt: "Microfluidic in-line pressure sensor",
    credit: "Fluigent",
    source: "assets/fluigent/inline-pressure-sensor.webp",
    license: "Provided product image",
  },
  fluigentFlowSensorHub: {
    url: "assets/fluigent/flow-sensor-hub.webp",
    alt: "Microfluidic flow sensor hub",
    credit: "Fluigent",
    source: "assets/fluigent/flow-sensor-hub.webp",
    license: "Provided product image",
  },
  fluigentInjectionValve: {
    url: "assets/fluigent/injection-valve.webp",
    alt: "Microfluidic injection valve",
    credit: "Fluigent",
    source: "assets/fluigent/injection-valve.webp",
    license: "Provided product image",
  },
  fluigentValveController: {
    url: "assets/fluigent/switch-ez-valve-controller.webp",
    alt: "Switch EZ microfluidic valve controller",
    credit: "Fluigent",
    source: "assets/fluigent/switch-ez-valve-controller.webp",
    license: "Provided product image",
  },
  fluigentBidirectionalValve: {
    url: "assets/fluigent/bidirectional-valve.webp",
    alt: "M-SWITCH microfluidic bidirectional valve",
    credit: "Fluigent",
    source: "assets/fluigent/bidirectional-valve.webp",
    license: "Provided product image",
  },
  fluigentRecirculationValve: {
    url: "assets/fluigent/recirculation-valve.webp",
    alt: "Microfluidic recirculation valve",
    credit: "Fluigent",
    source: "assets/fluigent/recirculation-valve.webp",
    license: "Provided product image",
  },
  fluigentSamplingValve: {
    url: "assets/fluigent/sampling-valve.webp",
    alt: "Microfluidic sampling valve",
    credit: "Fluigent",
    source: "assets/fluigent/sampling-valve.webp",
    license: "Provided product image",
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
    id: "omi-automated-organ-on-chip-platform",
    name: "Omi Automated Organ-On-A-Chip Platform",
    category: "microfluidics",
    description: "Automated organ-on-chip platform option for mimicking microphysiological conditions in research-use studies.",
    price: "Quote",
    tags: ["Organ-on-chip", "Automation", "New release"],
    icon: "chip",
    image: catalogImages.fluigentOmi,
  },
  {
    id: "aria-automated-perfusion-system",
    name: "Aria Automated Perfusion System",
    category: "microfluidics",
    description: "Automated perfusion system option for spatial omics, perfusion workflows, and controlled cell-culture studies.",
    price: "Quote",
    tags: ["Perfusion", "Spatial omics", "Best seller"],
    icon: "kit",
    image: catalogImages.fluigentAria,
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
    id: "elveflow-high-pressure-reservoir-350ml",
    name: "ELVEFLOW Microfluidic High Pressure Reservoir 350 mL",
    category: "fluid-handling",
    description: "High-pressure microfluidic reservoir option for pressure-driven flow setups and controlled reagent delivery.",
    price: "$700.83",
    tags: ["Reservoir", "Pressure", "350 mL"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "idex-microfluidic-y-connector-peek",
    name: "IDEX Microfluidic Y Connector PEEK",
    category: "fluid-handling",
    description: "PEEK Y connector for splitting or combining small-volume microfluidic flow paths.",
    price: "$37.91",
    tags: ["PEEK", "Y connector", "Flow path"],
    icon: "connectors",
    image: catalogImages.laminar,
  },
  {
    id: "elveflow-flow-resistance-kit",
    name: "ELVEFLOW Microfluidic Flow Resistance Kit",
    category: "fluid-handling",
    description: "Flow resistance kit for tuning pressure-driven flow behavior in microfluidic setups.",
    price: "$174.33",
    tags: ["Resistance", "Flow tuning", "Kit"],
    icon: "kit",
    image: catalogImages.laminar,
  },
  {
    id: "elveflow-gl45-bottle-cap-l",
    name: "ELVEFLOW Microfluidic Reservoir GL45 Bottle Cap - L",
    category: "fluid-handling",
    description: "GL45 bottle-cap reservoir interface for 100 mL bottles with 2/4 port configuration options.",
    price: "$174.33",
    tags: ["GL45", "100 mL", "2/4 ports"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "elveflow-falcon-reservoir-s",
    name: "ELVEFLOW Microfluidic Reservoir for 15 mL Falcon Tube - S",
    category: "fluid-handling",
    description: "Reservoir adapter for 15 mL Falcon-style tubes with 2/4 port configuration options.",
    price: "$169.65",
    tags: ["Falcon tube", "15 mL", "2/4 ports"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "elveflow-eppendorf-reservoir-xs",
    name: "ELVEFLOW Microfluidic Reservoir for 1.5 mL Eppendorf - XS",
    category: "fluid-handling",
    description: "Small-volume reservoir adapter for 1.5 mL Eppendorf-style tubes and low-volume assays.",
    price: "$169.65",
    tags: ["Eppendorf", "1.5 mL", "Low volume"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "innofluid-pulse-damper-general",
    name: "Innofluid Fluid Pulse Damper - General",
    category: "fluid-handling",
    description: "Pulse-damping accessory for smoothing flow variation in pump-driven fluidic setups.",
    price: "$53.94",
    tags: ["Pulse damping", "Flow smoothing", "Accessory"],
    icon: "sensor",
    image: catalogImages.laminar,
  },
  {
    id: "elveflow-pdms-chip-reservoir-xxs",
    name: "ELVEFLOW Microfluidic Reservoir for PDMS Chip - XXS",
    category: "fluid-handling",
    description: "Very small reservoir interface for PDMS chip workflows and low-volume microfluidic testing.",
    price: "$139.23",
    tags: ["PDMS", "XXS", "Reservoir"],
    icon: "holder",
    image: catalogImages.chip,
  },
  {
    id: "darwin-ptfe-tubing-1-32-od-030-id",
    name: "Darwin Microfluidics PTFE Tubing 1/32 in. OD x 0.30 mm ID",
    category: "fluid-handling",
    description: "PTFE tubing sized for microfluidic interconnects and low-volume flow paths.",
    price: "$95.82",
    tags: ["PTFE", "1/32 in. OD", "0.30 mm ID"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "idex-manifold-4-port-cross-etfe",
    name: "IDEX Manifold 4 Ports Cross 1/4-28 ETFE",
    category: "fluid-handling",
    description: "Four-port cross manifold for routing multiple 1/4-28 fluidic connections.",
    price: "$44.81",
    tags: ["Manifold", "4 port", "ETFE"],
    icon: "holder",
    image: catalogImages.laminar,
  },
  {
    id: "darwin-ptfe-tubing-1-8-od",
    name: "Darwin Microfluidics PTFE Tubing 1/8 in. OD",
    category: "fluid-handling",
    description: "PTFE tubing for larger microfluidic support lines, reagent feeds, and chemically compatible flow paths.",
    price: "$96.17",
    tags: ["PTFE", "1/8 in. OD", "Chemical resistant"],
    icon: "tubing",
    image: catalogImages.laminar,
  },
  {
    id: "idex-peek-capillary-tubing-1-16-od",
    name: "IDEX 1/16 in. OD PEEK Capillary Tubing",
    category: "fluid-handling",
    description: "PEEK capillary tubing for analytical and microfluidic connections requiring higher pressure compatibility.",
    price: "$48.91",
    tags: ["PEEK", "1/16 in. OD", "Capillary"],
    icon: "tubing",
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
    id: "innofluid-labn1-peristaltic-pump",
    name: "Innofluid LabN1 Flow Rate Peristaltic Pump",
    category: "flow-control",
    description: "Peristaltic pump option for controlled flow-rate testing, continuous transfer, and fluidic prototyping.",
    price: "$986.66",
    tags: ["Peristaltic", "Flow rate", "Benchtop"],
    icon: "pump",
    image: catalogImages.pump,
  },
  {
    id: "longer-bt100-3j-peristaltic-pump",
    name: "Longer BT100-3J Basic Peristaltic Pump",
    category: "flow-control",
    description: "Basic peristaltic pump option for routine transfer, flow testing, and early microfluidic setups.",
    price: "$846.38",
    tags: ["Peristaltic", "Basic pump", "Flow testing"],
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
    id: "lineup-pressure-flow-controller-series",
    name: "LineUp Microfluidic Pressure-Based Flow Controller Series",
    category: "flow-control",
    description: "Compact modular flow-control platform with automation capability, intuitive setup, and expandable pressure-based configurations.",
    price: "Quote",
    tags: ["LineUp", "Pressure controller", "Modular"],
    icon: "sensor",
    image: catalogImages.fluigentLineup,
  },
  {
    id: "flow-ez-microfluidic-flow-controller",
    name: "Flow EZ Microfluidic Flow Controller",
    category: "flow-control",
    description: "Pressure-based microfluidic flow and pressure controller option for stable, responsive benchtop flow control.",
    price: "Quote",
    tags: ["Flow EZ", "Pressure controller", "Compact"],
    icon: "sensor",
    image: catalogImages.fluigentFlowEz,
  },
  {
    id: "mfcs-microfluidic-flow-control-system",
    name: "MFCS Microfluidic Flow Control System",
    category: "flow-control",
    description: "Multi-channel microfluidic flow-control system option for coordinated pressure-driven experiments and instrument setups.",
    price: "Quote",
    tags: ["MFCS", "Multi-channel", "Pressure controller"],
    icon: "sensor",
    image: catalogImages.fluigentMfcs,
  },
  {
    id: "microfluidic-push-pull-controller",
    name: "Microfluidic Push Pull Controller",
    category: "flow-control",
    description: "Controller option for regulating negative and positive pressure in push-pull microfluidic workflows.",
    price: "Quote",
    tags: ["Push pull", "Positive pressure", "Negative pressure"],
    icon: "sensor",
    image: catalogImages.fluigentPushPull,
  },
  {
    id: "flow-rate-platform",
    name: "Microfluidic Flow Rate Platform",
    category: "flow-control",
    description: "Flow-rate platform and sensor hub option for connecting multiple flow sensors in microfluidic monitoring setups.",
    price: "Quote",
    tags: ["Flow sensor", "Flow rate", "Hub"],
    icon: "sensor",
    image: catalogImages.fluigentFlowRatePlatform,
  },
  {
    id: "flow-unit-bidirectional-microfluidic-flow-sensor",
    name: "Bidirectional Microfluidic Flow Sensor FLOW UNIT / FLOW UNIT+",
    category: "flow-control",
    description: "Bidirectional microfluidic flow sensor option for measuring low-flow rates in pressure- or pump-driven systems.",
    price: "Quote",
    tags: ["FLOW UNIT", "Bidirectional", "Flow sensor"],
    icon: "sensor",
    image: catalogImages.fluigentFlowUnit,
  },
  {
    id: "microfluidic-inline-pressure-sensor",
    name: "Microfluidic In-Line Pressure Sensor",
    category: "flow-control",
    description: "In-line pressure sensor option for monitoring pressure conditions inside microfluidic flow paths.",
    price: "Quote",
    tags: ["Pressure sensor", "Inline", "Monitoring"],
    icon: "sensor",
    image: catalogImages.fluigentInlinePressureSensor,
  },
  {
    id: "microfluidic-flow-sensor-hub",
    name: "Microfluidic Flow Sensor Hub",
    category: "flow-control",
    description: "Sensor hub option for organizing multiple flow-sensor connections in modular microfluidic systems.",
    price: "Quote",
    tags: ["Flow sensor", "Hub", "Modular"],
    icon: "sensor",
    image: catalogImages.fluigentFlowSensorHub,
  },
  {
    id: "microfluidic-injection-valve-l-switch",
    name: "Microfluidic Injection Valve L-SWITCH",
    category: "flow-control",
    description: "6-port/2-position L-SWITCH valve option for microfluidic sample injection and flow-path switching.",
    price: "Quote",
    tags: ["Valve", "Injection", "6-port"],
    icon: "sensor",
    image: catalogImages.fluigentInjectionValve,
  },
  {
    id: "switch-ez-microfluidic-valve-controller",
    name: "SWITCH EZ Microfluidic Valve Controller",
    category: "flow-control",
    description: "Valve controller option for automated flow redirection in modular microfluidic setups.",
    price: "Quote",
    tags: ["Valve controller", "Automation", "Flow redirection"],
    icon: "sensor",
    image: catalogImages.fluigentValveController,
  },
  {
    id: "m-switch-microfluidic-bidirectional-valve",
    name: "M-SWITCH Microfluidic Bidirectional Valve",
    category: "flow-control",
    description: "Bidirectional microfluidic valve option for switching and redirecting flow in compact assemblies.",
    price: "Quote",
    tags: ["Valve", "Bidirectional", "M-SWITCH"],
    icon: "sensor",
    image: catalogImages.fluigentBidirectionalValve,
  },
  {
    id: "microfluidic-recirculation-valve-l-switch",
    name: "Microfluidic Recirculation Valve L-SWITCH",
    category: "flow-control",
    description: "6-port/2-position L-SWITCH valve option for recirculation and closed-loop microfluidic workflows.",
    price: "Quote",
    tags: ["Valve", "Recirculation", "6-port"],
    icon: "sensor",
    image: catalogImages.fluigentRecirculationValve,
  },
  {
    id: "microfluidic-sampling-valve-2-switch",
    name: "Microfluidic Sampling Valve 2-SWITCH",
    category: "flow-control",
    description: "3-port/2-way sampling valve option for controlled sampling and routing in microfluidic experiments.",
    price: "Quote",
    tags: ["Valve", "Sampling", "3-port"],
    icon: "sensor",
    image: catalogImages.fluigentSamplingValve,
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
  {
    id: "technical-sourcing-service",
    name: "Technical Sourcing Service",
    category: "services",
    description: "Engineer-guided sourcing for pumps, tubing, fittings, connectors, chips, LFIA materials, and sensors when the right supplier path is unclear.",
    price: "$500-$2,000",
    tags: ["Sourcing", "Engineer review", "Parts list"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "microfluidic-supplier-search-package",
    name: "Microfluidic Supplier Search Package",
    category: "services",
    description: "Includes five supplier options, capability comparison, and a short recommendation memo for a microfluidic setup or component need.",
    price: "$499",
    tags: ["5 suppliers", "Comparison", "Memo"],
    icon: "kit",
    image: catalogImages.chip,
  },
  {
    id: "diagnostic-oem-match-package",
    name: "Diagnostic OEM Match Package",
    category: "services",
    description: "OEM/CDMO search package with supplier comparison and intro-email package for diagnostic consumables or assay hardware needs.",
    price: "$999",
    tags: ["OEM/CDMO", "Intro package", "Diagnostics"],
    icon: "kit",
    image: catalogImages.rapidTest,
  },
  {
    id: "oem-microfluidic-device-ux-package",
    name: "OEM Microfluidic Device UX Package",
    category: "services",
    description: "Workflow mapping for OEMs and equipment makers turning complex microfluidic tuning, priming, valve states, and assay timing into simpler RUO, clinical, or medical-facing operation.",
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
    price: "$199-$299",
    tags: ["Beginner", "Universities", "Students"],
    icon: "kit",
    image: catalogImages.laminar,
  },
  {
    id: "flow-testing-kit",
    name: "Flow Testing Kit",
    category: "starter-kits",
    description: "Flow setup kit with premium tubing, connectors, syringes, flow sensor, pressure gauge, and sample holder.",
    price: "$499",
    tags: ["Flow sensor", "Pressure gauge", "Testing"],
    icon: "kit",
    image: catalogImages.pump,
  },
  {
    id: "microfluidic-prototyping-kit",
    name: "Microfluidic Prototyping Kit",
    category: "starter-kits",
    description: "Advanced kit with tubing assortment, connector assortment, flow-control accessories, chip holders, sample chips, and technical consultation.",
    price: "$999",
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
  "omi-automated-organ-on-chip-platform",
  "aria-automated-perfusion-system",
  "cell-culture-microfluidic-devices",
  "custom-microfluidic-chip-fabrication",
  "syringe-pumps",
  "lineup-pressure-flow-controller-series",
  "flow-ez-microfluidic-flow-controller",
  "mfcs-microfluidic-flow-control-system",
  "microfluidic-push-pull-controller",
  "flow-rate-platform",
  "flow-unit-bidirectional-microfluidic-flow-sensor",
  "microfluidic-inline-pressure-sensor",
  "microfluidic-flow-sensor-hub",
  "microfluidic-injection-valve-l-switch",
  "switch-ez-microfluidic-valve-controller",
  "m-switch-microfluidic-bidirectional-valve",
  "microfluidic-recirculation-valve-l-switch",
  "microfluidic-sampling-valve-2-switch",
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
    if (text.includes("reservoir") || text.includes("bottle") || text.includes("falcon") || text.includes("eppendorf")) return "Reservoirs";
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
  catalogImages.fluigentOmi.source,
  catalogImages.fluigentAria.source,
  catalogImages.fluigentLineup.source,
  catalogImages.fluigentFlowEz.source,
  catalogImages.fluigentMfcs.source,
  catalogImages.fluigentPushPull.source,
  catalogImages.fluigentFlowRatePlatform.source,
  catalogImages.fluigentFlowUnit.source,
  catalogImages.fluigentInlinePressureSensor.source,
  catalogImages.fluigentFlowSensorHub.source,
  catalogImages.fluigentInjectionValve.source,
  catalogImages.fluigentValveController.source,
  catalogImages.fluigentBidirectionalValve.source,
  catalogImages.fluigentRecirculationValve.source,
  catalogImages.fluigentSamplingValve.source,
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

const selected = new Map();
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
const productDetail = document.querySelector("#productDetail");
const heroDotField = document.querySelector("#heroDotField");
const productDetailId = document.body.dataset.productDetail || "";
const catalogScope = document.body.dataset.catalogScope || "all";
const companyEmail = "info@microcdlabs.com";
const stripePaymentLinkUrl = "https://buy.stripe.com/7sY8wP3Ep3EX9HtggE3Ru02";

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
          : `rgba(255, 255, 255, ${Math.min(alpha, 0.22)})`;
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
    '<option value="all">All product classes</option>',
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

  if (catalogResultsCount) {
    catalogResultsCount.textContent = `${visible.length} ${visible.length === 1 ? "item" : "items"} shown`;
  }

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
            <div class="catalog-identifiers">
              <span>MicroCD Cat. No. ${product.sku}</span>
              <span>${productCategoryLabels[product.category] || product.category} / ${product.subclass}</span>
            </div>
            <p>${product.description}</p>
            <div class="product-meta">
              ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          <div class="product-card-actions">
            <a class="button card-detail-link" href="${getProductPageUrl(product)}">View catalog page</a>
            <button class="button card-action ${selected.has(product.id) ? "selected" : ""}" type="button" data-product="${product.id}">
              ${selected.has(product.id) ? "Add another" : "Add to cart"}
            </button>
          </div>
        </article>
      `,
    )
    .join("");

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
          <a href="${image.source}" target="_blank" rel="noreferrer">${image.credit}</a>
          <span>${image.license}</span>
        </li>
      `,
    )
    .join("");
}

function renderProductDetail() {
  if (!productDetail || !productDetailId) return;
  const product = products.find((item) => item.id === productDetailId);
  if (!product) {
    productDetail.innerHTML = `
      <section class="section product-detail-section">
        <p class="eyebrow">Catalog page</p>
        <h1>Catalog item not found.</h1>
        <p class="catalog-note">Return to the products catalog to browse available MicroCD Labs items.</p>
        <a class="button button-primary" href="../products.html#catalog">Back to products</a>
      </section>
    `;
    return;
  }

  const categoryLabel = productCategoryLabels[product.category] || product.category;
  const requestSubject = encodeURIComponent(`MicroCD Labs quote request: ${product.name}`);
  const requestBody = encodeURIComponent(
    `Hello MicroCD Labs,\n\nPlease send availability, final price, lead time, shipping, and documentation details for:\n\n${product.name}\nMicroCD Cat. No. ${product.sku}\nCategory: ${categoryLabel}\nSubclass: ${product.subclass}\nIndicative price: ${product.price}\n\nIntended research-use application:\n\nDestination country:\n\nThank you.`,
  );

  productDetail.innerHTML = `
    <section class="section product-detail-section" aria-labelledby="product-detail-title">
      <div class="product-detail-layout">
        <div class="product-detail-media">
          ${
            product.image
              ? `<img src="${resolveAssetUrl(product.image.url, "../")}" alt="${escapeHtml(product.image.alt)}" />`
              : iconSvg(product.icon)
          }
          ${product.image ? `<span class="image-credit">${escapeHtml(product.image.credit)}</span>` : ""}
        </div>
        <div class="product-detail-copy">
          <p class="eyebrow">${escapeHtml(categoryLabel)}</p>
          <h1 id="product-detail-title">${escapeHtml(product.name)}</h1>
          <strong class="product-detail-price">${escapeHtml(product.price)}</strong>
          <dl class="product-detail-specs">
            <div>
              <dt>MicroCD Cat. No.</dt>
              <dd>${escapeHtml(product.sku)}</dd>
            </div>
            <div>
              <dt>Classification</dt>
              <dd>${escapeHtml(categoryLabel)}</dd>
            </div>
            <div>
              <dt>Subclass</dt>
              <dd>${escapeHtml(product.subclass)}</dd>
            </div>
          </dl>
          <p>${escapeHtml(product.description)}</p>
          <div class="product-meta">
            ${product.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="product-detail-actions">
            <a class="button button-primary" href="mailto:${companyEmail}?subject=${requestSubject}&body=${requestBody}">Request quote for this item</a>
            <a class="button product-back-link" href="../products.html#catalog">Back to catalog</a>
          </div>
        </div>
      </div>
    </section>
  `;
  document.title = `${product.name} | MicroCD Labs Catalog`;
}

function renderQuote() {
  if (!quoteForm || !quoteList || !emptyQuote || !quoteMail) return;
  const items = Array.from(selected.values());
  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const organisation = formData.get("organisation") || "";
  const notes = formData.get("notes") || "";

  quoteList.innerHTML = items
    .map(
      (entry) => `
        <li>
          <span>${entry.product.name} <small>${entry.product.price}</small></span>
          <div class="quantity-control" aria-label="Quantity for ${entry.product.name}">
            <button type="button" data-quantity="${entry.product.id}" data-change="-1" aria-label="Decrease quantity">-</button>
            <output>${entry.quantity}</output>
            <button type="button" data-quantity="${entry.product.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-item" type="button" data-remove="${entry.product.id}" aria-label="Remove ${entry.product.name}">Remove</button>
        </li>
      `,
    )
    .join("");

  emptyQuote.hidden = items.length > 0;
  quoteMail.classList.toggle("disabled", items.length === 0);
  quoteMail.setAttribute("aria-disabled", String(items.length === 0));
  if (stripePayLink) {
    stripePayLink.classList.toggle("disabled", items.length === 0);
    stripePayLink.setAttribute("aria-disabled", String(items.length === 0));
  }

  if (cartSubtotal) {
    const subtotal = items.reduce((sum, entry) => {
      const startingPrice = getStartingPrice(entry.product);
      return startingPrice === null ? sum : sum + startingPrice * entry.quantity;
    }, 0);
    const hasQuoteOnly = items.some((entry) => getStartingPrice(entry.product) === null);
    cartSubtotal.hidden = items.length === 0;
    cartSubtotal.textContent = subtotal
      ? `Estimated starting subtotal: ${formatCurrency(subtotal)}${hasQuoteOnly ? " + quote-only items" : ""}. Final pricing is confirmed before payment.`
      : "Selected items require final quote before payment.";
  }

  const subject = encodeURIComponent("MicroCD Labs microfluidics order request");
  const body = encodeURIComponent(
    `Hello MicroCD Labs,\n\nI would like to request an order review for the following research-use microfluidics items:\n\n${items
      .map((entry) => `- ${entry.quantity} x ${entry.product.name} (${entry.product.price})`)
      .join("\n")}\n\nPlease confirm final price, availability, shipping, and payment link or invoice details.\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}\nNotes: ${notes}\n\nThank you.`,
  );
  quoteMail.href = items.length ? `mailto:${companyEmail}?subject=${subject}&body=${body}` : "#";

  if (stripePayLink) {
    const stripeSubject = encodeURIComponent("MicroCD Labs Stripe invoice request");
    const stripeBody = encodeURIComponent(
      `Hello MicroCD Labs,\n\nPlease review my cart and send a Stripe invoice or Stripe-hosted payment link for the following research-use items:\n\n${items
        .map((entry) => `- ${entry.quantity} x ${entry.product.name} (${entry.product.sku}; ${entry.product.price})`)
        .join("\n")}\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}\nNotes: ${notes}\n\nThank you.`,
    );
    stripePayLink.href =
      items.length && stripePaymentLinkUrl
        ? stripePaymentLinkUrl
        : items.length
          ? `mailto:${companyEmail}?subject=${stripeSubject}&body=${stripeBody}`
          : "#";
    stripePayLink.textContent = stripePaymentLinkUrl ? "Pay with Stripe" : "Request Stripe invoice";
    if (stripePaymentLinkUrl) {
      stripePayLink.setAttribute("target", "_blank");
      stripePayLink.setAttribute("rel", "noreferrer");
    } else {
      stripePayLink.removeAttribute("target");
      stripePayLink.removeAttribute("rel");
    }
  }
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

if (productGrid) {
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product]");
    if (!button) return;

    const product = products.find((item) => item.id === button.dataset.product);
    if (!product) return;

    if (selected.has(product.id)) {
      selected.get(product.id).quantity += 1;
    } else {
      selected.set(product.id, { product, quantity: 1 });
    }

    const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || null;
    renderProducts(activeFilter);
    renderQuote();
  });
}

if (quoteList) {
  quoteList.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-quantity]");
    if (quantityButton) {
      const entry = selected.get(quantityButton.dataset.quantity);
      if (!entry) return;
      entry.quantity += Number(quantityButton.dataset.change);
      if (entry.quantity < 1) selected.delete(quantityButton.dataset.quantity);
      const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || null;
      renderProducts(activeFilter);
      renderQuote();
      return;
    }

    const button = event.target.closest("[data-remove]");
    if (!button) return;

    selected.delete(button.dataset.remove);
    const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || null;
    renderProducts(activeFilter);
    renderQuote();
  });
}

function initCouponDialog() {
  if (!document.body.dataset.couponDialog || sessionStorage.getItem("microcdCouponClosed") === "true") return;

  const dialog = document.createElement("div");
  dialog.className = "coupon-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "couponTitle");
  dialog.innerHTML = `
    <div class="coupon-dialog__panel">
      <button class="coupon-dialog__close" type="button" aria-label="Close coupon offer">Close</button>
      <p class="eyebrow">MicroCD Labs offer</p>
      <h2 id="couponTitle">Get 10% off your first quote request.</h2>
      <p>Enter an email or phone number to reveal the code. This form does not store or submit your information.</p>
      <label>
        Email or phone
        <input id="couponContact" type="text" placeholder="you@lab.edu or phone number" />
      </label>
      <button class="button button-primary coupon-dialog__reveal" type="button">Reveal code</button>
      <p class="coupon-code" hidden>Use code <strong>MICROCD10</strong> in your order notes.</p>
    </div>
  `;

  function closeDialog() {
    sessionStorage.setItem("microcdCouponClosed", "true");
    dialog.remove();
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest(".coupon-dialog__close")) closeDialog();
    if (event.target.closest(".coupon-dialog__reveal")) {
      const code = dialog.querySelector(".coupon-code");
      if (code) code.hidden = false;
    }
  });

  document.body.append(dialog);
}

if (quoteForm) quoteForm.addEventListener("input", renderQuote);
if (contactForm) contactForm.addEventListener("input", renderContactMail);

renderProducts();
renderProductDetail();
renderQuote();
renderCredits();
renderContactMail();
initHeroDotField();
initCouponDialog();
