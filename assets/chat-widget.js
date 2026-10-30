// Keep the Zendesk messaging launcher and conversation window on the left.
if (typeof window.zE === "function") {
  window.zE("messenger:set", "customization", {
    position: { side: "left" },
  });
}
