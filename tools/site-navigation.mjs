export function renderSiteNavigation(prefix = "") {
  const href = (path) => `${prefix}${path}`;

  return `      <nav class="main-nav" aria-label="Primary navigation">
        <a class="nav-primary-link" href="${href("clair/")}">CLAIR</a>
        <details class="nav-menu nav-menu-wide">
          <summary>Capabilities</summary>
          <div class="nav-menu-list">
            <a class="nav-menu-overview" href="${href("services.html")}">Engineering &amp; diagnostic capabilities <span>Focused support behind CLAIR and selected customer development programs</span></a>
            <a href="${href("services.html#microfluidic-development")}">Microfluidics &amp; lab-on-disc <span>Architecture, workflows, cartridges, and test strategy</span></a>
            <a href="${href("services.html#engineering-design")}">Contract CAD &amp; prototyping <span>Mechanical design, interfaces, fixtures, and fabrication handoff</span></a>
            <a href="${href("diagnostics.html")}">Assay &amp; diagnostic development <span>LFIA, kinetic analysis, and evidence planning</span></a>
          </div>
        </details>
        <details class="nav-menu">
          <summary>Research</summary>
          <div class="nav-menu-list">
            <a href="${href("news.html")}">Research updates <span>Publications, concepts, and company progress</span></a>
            <a href="${href("diagnostics.html#publication")}">Kinetic assay preprint <span>Time-resolved signal extraction research</span></a>
            <a href="${href("modeler/")}">Microfluidic Modeler <span>Browser-based early geometry workspace</span></a>
            <a href="${href("analyzer/")}">Kinetic Assay Enhancer <span>Research demonstration for time-series analysis</span></a>
          </div>
        </details>
        <a class="nav-primary-link" href="${href("about.html")}">About</a>
        <a class="nav-primary-link" href="${href("consultation.html")}">Contact</a>
      </nav>`;
}
