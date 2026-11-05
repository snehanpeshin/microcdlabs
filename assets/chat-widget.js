// Keep the existing Zendesk integration. Use an in-flow launcher on small screens.
(() => {
  if (typeof window.zE !== "function") return;
  const compact = window.matchMedia("(max-width: 760px)");
  const footer = document.querySelector(".site-footer");
  window.zE("messenger:set", "customization", {position:{side:"left"}});
  if (!footer) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "review-chat-launcher";
  button.textContent = "Open chat";
  const note = document.createElement("p");
  note.className = "review-chat-note";
  note.setAttribute("role", "status");
  note.textContent = "You can also email info@microcdlabs.com.";
  footer.append(button, note);
  let opened = false;
  function sync() {
    if (compact.matches && !opened) window.zE("messenger", "hide");
    if (!compact.matches) window.zE("messenger", "show");
    button.hidden = !compact.matches;
    note.hidden = !compact.matches;
  }
  button.addEventListener("click", () => {
    opened = true;
    window.zE("messenger", "show");
    window.zE("messenger", "open");
  });
  window.zE("messenger:on", "close", () => {
    opened = false;
    if (compact.matches) {
      window.zE("messenger", "hide");
      button.focus();
    }
  });
  compact.addEventListener("change", sync);
  sync();
})();
