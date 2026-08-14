const microcdCompanyEmail = "info@microcdlabs.com";

function injectLabOpsLinks() {
  const footerLinks = document.querySelector(".site-footer > p");
  if (footerLinks && !footerLinks.querySelector('[href^="https://labops.microcdlabs.com"]')) {
    const link = document.createElement("a");
    link.href = "https://labops.microcdlabs.com/";
    link.rel = "noreferrer";
    link.textContent = "MicroCD LabOps";
    footerLinks.appendChild(link);
  }
}

function initPageNavigationAids() {
  const main = document.querySelector("main");
  if (main && !document.querySelector(".skip-link")) {
    main.id ||= "main-content";
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${main.id}`;
    skipLink.textContent = "Skip to main content";
    document.body.prepend(skipLink);
  }

  const currentPath = new URL(window.location.href).pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".main-nav a[href]").forEach((link) => {
    const target = new URL(link.href, window.location.href);
    const targetPath = target.pathname.replace(/\/$/, "/index.html");
    if (target.origin === window.location.origin && targetPath === currentPath) {
      link.setAttribute("aria-current", "page");
      link.closest(".nav-menu")?.querySelector("summary")?.classList.add("has-current-page");
    }
  });
}

function initSiteNavigation() {
  const navigation = document.querySelector(".main-nav");
  const header = navigation?.closest(".site-header");
  const menus = Array.from(document.querySelectorAll(".nav-menu"));
  if (!navigation || !header || !menus.length || header.querySelector(".nav-toggle")) return;

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

function initUltrasoundConceptInquiryForm() {
  const form = document.querySelector("#ultrasound-conceptInquiryForm");
  if (!form) return;
  const status = document.querySelector("#ultrasound-conceptInquiryStatus");
  const submit = form.querySelector('button[type="submit"]');

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
    const subject = encodeURIComponent(`Clip-on ultrasound research collaboration - ${data.get("organization")}`);
    const body = encodeURIComponent([
      "MicroCD Labs clip-on ultrasound research collaboration inquiry",
      "",
      `Name: ${data.get("name")}`,
      `Organization: ${data.get("organization")}`,
      `Work email: ${data.get("email")}`,
      `Area of interest: ${data.get("interest")}`,
      "",
      "Intended research application:",
      data.get("application"),
      "",
      "This initial inquiry is non-confidential and does not include patient information.",
    ].join("\n"));

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    setFormStatus(status, "Preparing your collaboration email…", "loading");
    window.setTimeout(() => {
      window.location.href = `mailto:${microcdCompanyEmail}?subject=${subject}&body=${body}`;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      setFormStatus(status, "Your email app should open with the inquiry prepared. Review it before sending.", "success");
    }, 250);
  });
}

injectLabOpsLinks();
initPageNavigationAids();
initSiteNavigation();
initHeroDots();
initProjectInquiryForm();
initRecommendationForm();
initUltrasoundConceptInquiryForm();
