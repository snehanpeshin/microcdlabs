export function renderSiteNavigation(prefix = "") {
  const href = (path) => `${prefix}${path}`;

  return `      <nav class="main-nav" aria-label="Primary navigation">
        <details class="nav-menu">
          <summary>Capabilities</summary>
          <div class="nav-menu-list">
            <a href="${href("services.html")}">Product development <span>Microfluidics, cartridges, prototyping, and engineering</span></a>
            <a href="${href("diagnostics.html")}">Diagnostics &amp; assays <span>LFIA, lab-on-disc, and kinetic analysis support</span></a>
            <a href="${href("automation.html")}">OEM workflow design <span>Simpler operation for fluidic instruments and devices</span></a>
            <a href="${href("consultation.html")}">Technical consultation <span>Define the next practical development step</span></a>
          </div>
        </details>
        <details class="nav-menu nav-menu-wide">
          <summary>Products</summary>
          <div class="nav-menu-list">
            <a class="nav-menu-overview" href="${href("products.html")}">Browse all products <span>Research parts, consumables, kits, and service packages</span></a>
            <a href="${href("microfluidic-chips/")}">Microfluidic chips <span>PDMS, glass, COC, PMMA, and custom formats</span></a>
            <a href="${href("microfluidic-tubing/")}">Tubing <span>Materials, dimensions, and fluid-path selection</span></a>
            <a href="${href("microfluidic-fittings-connectors/")}">Fittings &amp; connectors <span>Interfaces, manifolds, and reservoirs</span></a>
            <a href="${href("microfluidic-pumps-flow-control/")}">Pumps &amp; flow control <span>Pumps, controllers, valves, and sensors</span></a>
            <a href="${href("lateral-flow-assay-materials/")}">LFIA materials <span>Membranes, pads, housings, and development</span></a>
            <a href="${href("kits.html")}">Starter kits <span>Beginner, flow-testing, and prototyping kits</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Software</summary>
          <div class="nav-menu-list">
            <a href="https://labops.microcdlabs.com/" rel="noreferrer">MicroCD LabOps <span>Engineering reports and traceability workspace</span></a>
            <a href="${href("platform.html")}">Microfluidic Modeler <span>Cartridge geometry and concept workspace</span></a>
            <a href="${href("analyzer/")}">Kinetic Assay Enhancer <span>Time-resolved assay analysis workspace</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Research</summary>
          <div class="nav-menu-list">
            <a href="${href("news.html")}">Research updates <span>Publications, concepts, and company progress</span></a>
            <a href="${href("diagnostics.html#publication")}">Kinetic assay preprint <span>Time-resolved signal extraction research</span></a>
            <a href="${href("products/invertadx/")}">InvertaDx <span>Origami-based centrifugal microfluidic concept</span></a>
            <a href="${href("products.html#research-platforms")}">Reader concepts <span>Exploratory fluorescence imaging platform</span></a>
            <a href="${href("products/clip-on-ultrasound/")}">Ultrasound concept <span>Directional imaging research platform</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Company</summary>
          <div class="nav-menu-list">
            <a href="${href("about.html")}">About <span>Technical focus and company background</span></a>
            <a href="${href("partners.html")}">Partners <span>Supplier and collaboration approach</span></a>
            <a href="${href("careers.html")}">Careers <span>Internship and technical opportunities</span></a>
            <a href="${href("consultation.html")}">Contact <span>Discuss a technical project</span></a>
          </div>
        </details>
      </nav>`;
}
