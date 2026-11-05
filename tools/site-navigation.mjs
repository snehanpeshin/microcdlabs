export function renderSiteNavigation(prefix = "") {
  const href = (path) => `${prefix}${path}`;

  return `      <nav class="main-nav" aria-label="Primary navigation">
        <a class="nav-primary-link" href="${href("clair/")}">CLAIR</a>
        <a class="nav-primary-link" href="${href("services.html")}">Engineering Services</a>
        <details class="nav-menu">
          <summary>Research &amp; Tools</summary>
          <div class="nav-menu-list">
            <a href="${href("diagnostics.html")}">Assay development <span>Methods and research context</span></a>
            <a href="${href("tools.html")}">All research tools <span>Browse tools and engineering workspaces</span></a>
            <a href="${href("news.html")}">Research updates <span>Publications, concepts, and company progress</span></a>
            <a href="${href("diagnostics.html#publication")}">Kinetic assay preprint <span>Time-resolved signal extraction research</span></a>
            <a href="${href("modeler/")}">Microfluidic Modeler <span>Browser-based early geometry workspace</span></a>
            <a href="${href("analyzer/")}">Kinetic Assay Analyzer <span>Research demonstration for time-series analysis</span></a>
            <a href="${href("motor-controller/")}">Motor Controller <span>USB serial console for CLAIR engineering</span></a>
            <a href="https://labops.microcdlabs.com">LabOps <span>Engineering evidence, traceability, and regulatory-readiness workspace</span></a>
          </div>
        </details>
        <a class="nav-primary-link" href="${href("about.html")}">About</a>
        <a class="nav-primary-link" href="${href("consultation.html")}">Contact</a>
      </nav>`;
}
