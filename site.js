const microcdCompanyEmail = "info@microcdlabs.com";

if (!document.querySelector('link[href*="restructure.css"]')) {
  const focusedStyles = document.createElement("link");
  focusedStyles.rel = "stylesheet";
  focusedStyles.href = "restructure.css?v=20260715a";
  document.head.appendChild(focusedStyles);
}

function normalizeSiteChrome() {
  const navigation = document.querySelector(".main-nav");
  if (navigation) {
    navigation.innerHTML = `
      <a href="services.html">Services</a>
      <a href="applications.html">Applications</a>
      <a href="tools.html">Tools</a>
      <a href="about.html">About</a>
      <a href="consultation.html">Contact</a>`;
  }

  const headerActions = document.querySelector(".header-actions");
  if (headerActions) {
    headerActions.innerHTML = '<a class="header-cta" href="consultation.html">Request consultation</a>';
  }

  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="footer-brand-block">
        <img class="footer-logo" src="assets/microcd-labs-wordmark.svg?v=boxed" alt="MicroCD Labs" />
        <p class="company-legal">MicroCD Labs, a division of Karigari Home LLC</p>
        <p>Microfluidic and diagnostic product-development support for research and engineering teams.</p>
        <p>Catalog images are representative. Products are for non-clinical research use unless stated otherwise.</p>
        <a href="mailto:info@microcdlabs.com">info@microcdlabs.com</a>
      </div>
      <div class="footer-link-groups">
        <div><strong>Company</strong><a href="about.html">About</a><a href="consultation.html">Contact</a><a href="news.html">News</a><a href="partners.html">Partners</a><a href="careers.html">Careers</a></div>
        <div><strong>Products</strong><a href="products.html">Catalog</a><a href="recommendations.html">Parts recommendations</a><a href="kits.html">Starter kits</a><a href="products.html#quote">Request a quote</a></div>
        <div><strong>Policies</strong><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="refunds.html">Refunds</a><a href="accessibility.html">Accessibility</a><a href="credits.html">Image credits</a></div>
        <div><strong>Tools</strong><a href="tools.html">Tools</a><a href="karigari-wellness-lens-instructions.html">Karigari Wellness Lens</a><a href="https://www.linkedin.com/company/microcd-labs/about/?viewAsMember=true" target="_blank" rel="noreferrer">LinkedIn</a></div>
      </div>`;
  }
}

function initSiteNavigation() {
  const navigation = document.querySelector(".main-nav");
  const header = navigation?.closest(".site-header");
  const menus = Array.from(document.querySelectorAll(".nav-menu"));
  if (!navigation || !header || header.querySelector(".nav-toggle")) return;

  const desktopWidth = window.matchMedia("(min-width: 761px)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const closeTimers = new WeakMap();
  navigation.id ||= "primaryNavigation";

  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", navigation.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
  toggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
  header.insertBefore(toggle, navigation);

  function closeMenus(except = null) {
    menus.forEach((menu) => {
      if (menu !== except) menu.removeAttribute("open");
    });
  }

  function closeMobileNavigation() {
    header.classList.remove("mobile-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    closeMenus();
  }

  function clearCloseTimer(menu) {
    const timer = closeTimers.get(menu);
    if (timer) window.clearTimeout(timer);
    closeTimers.delete(menu);
  }

  function scheduleClose(menu, delay = 120) {
    clearCloseTimer(menu);
    closeTimers.set(menu, window.setTimeout(() => menu.removeAttribute("open"), delay));
  }

  function useDesktopInteraction(event = null) {
    return desktopWidth.matches && (finePointer.matches || event?.pointerType === "mouse");
  }

  function openMenu(menu) {
    clearCloseTimer(menu);
    closeMenus(menu);
    menu.setAttribute("open", "");
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("mobile-nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    if (!isOpen) closeMenus();
  });

  menus.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeMenus(menu);
    });
    menu.addEventListener("pointerenter", (event) => {
      if (useDesktopInteraction(event)) openMenu(menu);
    });
    menu.addEventListener("pointerleave", (event) => {
      if (useDesktopInteraction(event)) scheduleClose(menu);
    });
    menu.addEventListener("focusin", () => {
      if (useDesktopInteraction()) openMenu(menu);
    });
    menu.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (useDesktopInteraction() && !menu.contains(document.activeElement)) scheduleClose(menu, 0);
      }, 0);
    });
    menu.addEventListener("click", (event) => {
      if (useDesktopInteraction(event) && event.target.closest("summary")) {
        event.preventDefault();
        openMenu(menu);
      }
      if (event.target.closest("a")) closeMobileNavigation();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      closeMenus();
      if (!desktopWidth.matches) closeMobileNavigation();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNavigation();
  });
  desktopWidth.addEventListener("change", () => closeMobileNavigation());
}

function initHeroDots() {
  const canvas = document.querySelector("#heroDotField");
  const hero = canvas?.closest(".hero");
  const context = canvas?.getContext("2d");
  if (!canvas || !hero || !context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let dots = [];
  let pointer = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;

  function resize() {
    const rect = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const spacing = width < 720 ? 24 : 28;
    dots = [];
    for (let y = -spacing / 2; y < height + spacing; y += spacing) {
      for (let x = -spacing / 2; x < width + spacing; x += spacing) dots.push({ x, y });
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    dots.forEach((dot) => {
      const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
      const influence = pointer.active && !reduceMotion.matches ? Math.max(0, 1 - distance / 150) : 0;
      context.beginPath();
      context.arc(dot.x, dot.y, 1.05 + influence * 2.15, 0, Math.PI * 2);
      context.fillStyle = influence > 0.02 ? `rgba(31, 207, 143, ${0.3 + influence * 0.66})` : "rgba(49, 95, 120, 0.16)";
      context.shadowColor = influence > 0.02 ? "rgba(31, 207, 143, 0.55)" : "transparent";
      context.shadowBlur = influence * 14;
      context.fill();
    });
    context.shadowBlur = 0;
  }

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    draw();
  });
  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
    draw();
  });
  window.addEventListener("resize", () => {
    resize();
    draw();
  });
  resize();
  draw();
}

function setFormStatus(element, message, state = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = state;
}

function validateProjectForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    const empty = !field.value.trim();
    const invalidEmail = field.type === "email" && field.value && field.validity.typeMismatch;
    const tooShort = field.validity.tooShort;
    const message = empty
      ? "This field is required."
      : invalidEmail
        ? "Enter a valid work email."
        : tooShort
          ? `Please add at least ${field.minLength} characters.`
          : "";
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
    if (message) valid = false;
  });
  return valid;
}

function initProjectInquiryForm() {
  const form = document.querySelector("#projectInquiryForm");
  if (!form) return;
  const status = document.querySelector("#projectInquiryStatus");
  const submit = form.querySelector('button[type="submit"]');
  const requestedProject = new URLSearchParams(window.location.search).get("project");
  const projectAliases = {
    "microfluidic-development": "Microfluidic product development",
    "diagnostic-cartridge": "Diagnostic cartridge or consumable",
    "lab-on-disc": "Lab-on-disc or centrifugal microfluidics",
    "engineering-design": "Engineering design or prototyping",
    "verification-planning": "Verification and validation planning",
    "system-integration": "Microfluidic product development",
    diagnostics: "Diagnostic cartridge or consumable",
    "technical-consulting": "Technical consulting or commercialization",
  };
  const projectSelect = form.querySelector("#projectType");
  if (requestedProject && projectSelect && projectAliases[requestedProject]) {
    projectSelect.value = projectAliases[requestedProject];
  }

  form.addEventListener("input", (event) => {
    const field = event.target.closest("input, select, textarea");
    if (!field) return;
    field.removeAttribute("aria-invalid");
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateProjectForm(form)) {
      setFormStatus(status, "Please review the highlighted fields.", "error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = new FormData(form);
    const lines = [
      "MicroCD Labs technical consultation request",
      "",
      `Name: ${data.get("name")}`,
      `Organization: ${data.get("organization")}`,
      `Work email: ${data.get("email")}`,
      `Project type: ${data.get("projectType")}`,
      `Development stage: ${data.get("developmentStage")}`,
      `Preferred next step: ${data.get("nextStep")}`,
      `Support needed: ${data.get("supportNeeded") || "Not provided"}`,
      `Target timeline: ${data.get("targetTimeline") || "Not provided"}`,
      "",
      "Project description:",
      data.get("description"),
    ];
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    setFormStatus(status, "Preparing your consultation email…", "loading");
    window.setTimeout(() => {
      const subject = encodeURIComponent(`Technical consultation request — ${data.get("organization")}`);
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${microcdCompanyEmail}?subject=${subject}&body=${body}`;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      setFormStatus(status, "Your email app should open with the project details prepared. Review the message before sending.", "success");
    }, 250);
  });
}

function initRecommendationForm() {
  const form = document.querySelector("#recommendationForm");
  if (!form) return;
  const status = document.querySelector("#recommendationStatus");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setFormStatus(status, "Please add your name, work email, and sourcing need.", "error");
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent("MicroCD Labs parts recommendation request");
    const body = encodeURIComponent([
      "MicroCD Labs parts recommendation request", "",
      `Name: ${data.get("name")}`, `Work email: ${data.get("email")}`,
      `Organisation: ${data.get("organisation") || "Not provided"}`,
      `Package interest: ${data.get("package")}`, `Budget: ${data.get("budget") || "Not provided"}`,
      `Timeline: ${data.get("timeline") || "Not provided"}`, "", "What I need help sourcing:", data.get("need"),
    ].join("\n"));
    setFormStatus(status, "Your email app should open with the request prepared. Review it before sending.", "success");
    window.location.href = `mailto:${microcdCompanyEmail}?subject=${subject}&body=${body}`;
  });
}

normalizeSiteChrome();
initSiteNavigation();
initHeroDots();
initProjectInquiryForm();
initRecommendationForm();
