export function renderSiteNavigation(prefix = "") {
  const href = (path) => `${prefix}${path}`;

  return `      <nav class="main-nav" aria-label="Primary navigation">
        <a class="nav-primary-link" href="${href("clair/")}">CLAIR</a>
        <a class="nav-primary-link" href="${href("tools.html")}">Tools</a>
        <details class="nav-menu nav-menu-wide">
          <summary>Capabilities</summary>
          <div class="nav-menu-list">
            <a class="nav-menu-overview" href="${href("services.html")}">Engineering &amp; diagnostic capabilities <span>Focused support behind CLAIR and customer development programs</span></a>
            <a href="${href("services.html#microfluidic-development")}">Microfluidics &amp; lab-on-disc <span>Architecture, workflows, cartridges, and test strategy</span></a>
            <a href="${href("services.html#engineering-design")}">Contract CAD &amp; prototyping <span>Mechanical design, interfaces, fixtures, and fabrication handoff</span></a>
            <a href="${href("diagnostics.html")}">Assay &amp; diagnostic development <span>LFIA, kinetic analysis, and evidence planning</span></a>
            <a href="${href("automation.html")}">OEM workflow design <span>Simpler operation for fluidic instruments and devices</span></a>
            <a href="${href("products.html")}">Research-use catalog <span>Quote-reviewed components, consumables, and kits</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Research</summary>
          <div class="nav-menu-list">
            <a href="${href("news.html")}">Research updates <span>Publications, concepts, and company progress</span></a>
            <a href="${href("diagnostics.html#publication")}">Kinetic assay preprint <span>Time-resolved signal extraction research</span></a>
            <a href="${href("news.html#experimental-concepts")}">Experimental concepts <span>Clearly labeled exploratory hardware and research directions</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Company</summary>
          <div class="nav-menu-list">
            <a href="${href("about.html")}">About <span>Technical focus and company background</span></a>
            <a href="${href("partners.html")}">Partners <span>Supplier and collaboration approach</span></a>
            <a href="${href("careers.html")}">Careers <span>Internship and technical opportunities</span></a>
          </div>
        </details>
        <a class="nav-primary-link" href="${href("consultation.html")}">Contact</a>
      </nav>`;
}
