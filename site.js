const microcdCompanyEmail = "info@microcdlabs.com";

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
    if (event.key === "Escape") {
      const wasMobileOpen = header.classList.contains("mobile-nav-open");
      const focusedMenu = document.activeElement.closest?.(".nav-menu[open]");
      closeMobileNavigation();
      if (wasMobileOpen) toggle.focus();
      else focusedMenu?.querySelector("summary")?.focus();
    }
  });
  desktopWidth.addEventListener("change", () => closeMobileNavigation());
}

function initHeroDots() {
  const canvas = document.querySelector("#heroDotField");
  const hero = canvas?.closest(".hero, .clair-home-hero");
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
      context.fillStyle = influence > 0.02 ? `rgba(31, 207, 143, ${0.3 + influence * 0.66})` : "rgba(255, 255, 255, 0.22)";
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
        ? "Enter a valid email address."
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
  const copy = form.querySelector("#copyProjectInquiry");
  const purpose = form.querySelector("#projectType");
  const requested = new URLSearchParams(location.search).get("project");
  const aliases = {
    clair: "CLAIR veterinary clinic collaboration",
    "clair-human": "CLAIR human oral-health research",
    "clair-veterinary": "CLAIR veterinary clinic collaboration",
    research: "Research or technical partnership",
    sourcing: "Supplier or manufacturing coordination",
    "microfluidic-development": "Microfluidic product development",
    "diagnostic-development": "Diagnostic cartridge or consumable",
    "diagnostic-cartridge": "Diagnostic cartridge or consumable",
    diagnostics: "Diagnostic cartridge or consumable",
    "lab-on-disc": "Lab-on-disc or centrifugal microfluidics",
    "engineering-design": "Engineering design or prototyping",
    "verification-planning": "Verification and validation planning",
    "supplier-coordination": "Supplier or manufacturing coordination",
    "technical-consulting": "Technical consulting or commercialization",
    "system-integration": "Microfluidic product development",
  };
  if (aliases[requested]) purpose.value = aliases[requested];
  const stage = form.querySelector("#developmentStage");
  const context = form.querySelector("#engineeringContext");
  const heading = document.querySelector("#inquiry-title");
  const description = document.querySelector("#inquiry-description");
  const message = form.querySelector("#projectDescription");
  const messageLabel = form.querySelector("#inquiry-message-label");
  const contextLabel = form.querySelector("#inquiry-context-label");
  function adaptPurpose() {
    const human = purpose.value === aliases["clair-human"];
    const vet = purpose.value === aliases["clair-veterinary"];
    const research = human || vet || purpose.value === aliases.research;
    const sourcing=purpose.value===aliases["supplier-coordination"];
    context.hidden = research || sourcing;
    stage.disabled = research || sourcing;
    stage.required = false;
    heading.textContent = !purpose.value ? "Choose the conversation you need." : sourcing ? "Discuss sourcing or manufacturing coordination." : human ? "Discuss human oral-health research." : vet ? "Discuss veterinary clinic workflow." : research ? "Explore a research collaboration." : "What engineering decision comes next?";
    description.textContent = sourcing ? "Share the component or supplier question, required specifications, quantity, destination, and compatibility needs. For component-specific requirements, use the enquiry list." : human ? "Tell us about your periodontal assessment or saliva-research question and where professional input could help." : vet ? "Tell us about oral assessment, saliva collection, or the practical evidence your clinic would need." : research ? "Share the scientific question, methods, or expertise you would like to discuss." : "Share the technical challenge and the decision or deliverable your team needs. A finished scope is not required.";
    const label = sourcing ? "Sourcing question" : human ? "Research question" : vet ? "Clinic or workflow question" : research ? "Collaboration question" : "Technical question";
    messageLabel.replaceChildren(document.createTextNode(label + " "));
    const star = document.createElement("span"); star.setAttribute("aria-hidden", "true"); star.textContent = "*"; messageLabel.append(star);
    message.placeholder = human ? "Which research question or assessment workflow would you like to discuss?" : vet ? "What would you like to discuss about canine oral assessment, collection, or clinic workflow?" : "What are you trying to resolve, and what next step would be useful?";
    contextLabel.textContent = vet ? "Clinical role or practice context (optional)" : human ? "Research role or study context (optional)" : "Constraints or relevant context (optional)";
    form.dataset.purpose = sourcing ? "sourcing" : human ? "clair-human" : vet ? "clair-veterinary" : research ? "research" : "engineering";
    document.querySelectorAll(".mcd-inquiry-paths a").forEach(a => {
      const query = new URL(a.href).searchParams.get("project");
      if (aliases[query] === purpose.value) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    setFormStatus(status, "Required: purpose, name, email, and question. No inquiry has been sent.");
  }
  form.querySelectorAll("[data-error-for]").forEach(error => {
    const field = document.getElementById(error.dataset.errorFor);
    if (field && error.id) field.setAttribute("aria-describedby", error.id);
  });
  adaptPurpose();
  purpose.addEventListener("change", adaptPurpose);
  form.addEventListener("input", event => {
    const field = event.target.closest("input, select, textarea");
    if (!field) return;
    field.removeAttribute("aria-invalid");
    const error = form.querySelector('[data-error-for="' + field.id + '"]');
    if (error) error.textContent = "";
  });
  function draftLines(data){return [
      "MicroCD Labs inquiry", "",
      "Purpose: " + data.get("projectType"),
      "Name: " + data.get("name").trim(),
      "Email: " + data.get("email").trim(),
      ...(data.get("organization")?.trim() ? ["Organization: " + data.get("organization").trim()] : []),
      ...(data.get("developmentStage") ? ["Development stage: " + data.get("developmentStage")] : []),
      ...(data.get("nextStep") ? ["Preferred next step: " + data.get("nextStep")] : []),
      "", "Question:", data.get("description").trim(),
      ...(data.get("context")?.trim() ? ["", "Additional context:", data.get("context").trim()] : []),
    ];}
  function updateDraftPreview(){
    const target=document.querySelector("#inquiryPreview");if(!target)return;
    const data=new FormData(form);
    target.value=draftLines(data).join("\n");
  }
  form.addEventListener("input",updateDraftPreview);form.addEventListener("change",updateDraftPreview);updateDraftPreview();
  function prepare() {
    if (!validateProjectForm(form)) {
      setFormStatus(status, "Please review the highlighted fields. No inquiry has been sent.", "error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return null;
    }
    const data = new FormData(form);
    const lines = draftLines(data);
    return {data, lines};
  }
  document.querySelector("#previewInquiry")?.addEventListener("click",()=>{
    const inquiry=prepare();if(!inquiry)return;
    const target=document.querySelector("#inquiryPreview");target.value=inquiry.lines.join("\n");target.closest("details").open=true;target.focus();
    setFormStatus(status,"Review the draft. Nothing has been sent.","info");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const inquiry = prepare();
    if (!inquiry) return;
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    setFormStatus(status, "Preparing an email draft. Nothing is being sent…", "loading");
    window.setTimeout(() => {
      try {
        const subject = encodeURIComponent("MicroCD Labs — " + inquiry.data.get("projectType"));
        window.location.href = "mailto:" + microcdCompanyEmail + "?subject=" + subject;
        setFormStatus(status, "Email app requested with a subject only; nothing has been sent. Copy the reviewed inquiry, paste it into the draft and send it yourself, or email " + microcdCompanyEmail + " directly.", "info");
      } catch {
        setFormStatus(status, "The email app could not be opened. No inquiry has been sent. Copy your inquiry or email " + microcdCompanyEmail + " directly.", "error");
      } finally {
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
      }
    }, 200);
  });
  copy?.addEventListener("click", async () => {
    const inquiry = prepare();
    if (!inquiry) return;
    copy.disabled = true;
    copy.setAttribute("aria-busy", "true");
    try {
      await navigator.clipboard.writeText(inquiry.lines.join("\n"));
      setFormStatus(status, "Inquiry copied; nothing has been sent. Paste it into an email to " + microcdCompanyEmail + " and send it yourself.", "info");
    } catch {
      const preview=document.querySelector("#inquiryPreview");preview.value=inquiry.lines.join("\n");preview.closest("details").open=true;preview.focus();preview.select();
      setFormStatus(status, "Copying was blocked. No inquiry has been sent. Select your text and email " + microcdCompanyEmail + " directly.", "error");
    } finally {
      copy.disabled = false; copy.removeAttribute("aria-busy");
    }
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

initPageNavigationAids();
initSiteNavigation();
function initHeaderOffset(){
 const header=document.querySelector(".site-header");if(!header)return;
 const update=()=>document.documentElement.style.setProperty("--site-header-offset",(header.getBoundingClientRect().height+16)+"px");
 update();if(typeof ResizeObserver!=="undefined")new ResizeObserver(update).observe(header);
 window.addEventListener("resize",update);
}
initHeaderOffset();
initHeroDots();
initProjectInquiryForm();
initRecommendationForm();

// Open a capability when visitors follow a section link from another page.
function initCapabilityLinks() {
  if (!document.querySelector('.mcd-capability')) return;
  function reveal() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.matches('.mcd-capability')) target.open = true;
  }
  reveal();
  window.addEventListener('hashchange', reveal);
}
initCapabilityLinks();

function initImpactPlanner() {
 const form=document.querySelector('#impactForm');if(!form)return;
 form.addEventListener('submit',(event)=>{event.preventDefault();if(!form.reportValidity())return;
 const value=id=>Number(document.getElementById(id).value);
 const recognized=value('impactCohort')*value('impactGain')/100;
 const care=recognized*value('impactTreatment')/100;
 const followup=care*value('impactFollowup')/100;
 const fmt=n=>n.toLocaleString(undefined,{maximumFractionDigits:1});
 document.querySelector('#impactResults').textContent=`Planning example: ${fmt(recognized)} additional recognized cases, ${fmt(care)} starting appropriate care, and ${fmt(followup)} completing follow-up. These are assumed counts, not measured CLAIR outcomes.`;
 });
}
initImpactPlanner();

function initSupportingAnchors() {
  function reveal() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.parentElement;
    while (parent) { if (parent.tagName === "DETAILS") parent.open = true; parent = parent.parentElement; }
    if (target.tagName === "DETAILS") target.open = true;
    if (location.hash) requestAnimationFrame(() => { const header=document.querySelector(".site-header");if(header)document.documentElement.style.setProperty("--site-header-offset",(header.getBoundingClientRect().height+16)+"px");target.scrollIntoView({block:"start"}); });
  }
  reveal();
  window.addEventListener("hashchange", reveal);
}
initSupportingAnchors();
