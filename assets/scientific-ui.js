export const APP_VERSION = "2.0.0-beta.1";

export function toast(message, tone = "info") {
  let region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    document.body.append(region);
  }
  const item = document.createElement("div");
  item.className = `toast${tone === "error" ? " toast--error" : ""}`;
  item.setAttribute("role", tone === "error" ? "alert" : "status");
  item.textContent = message;
  region.append(item);
  setTimeout(() => item.remove(), 4200);
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function downloadText(filename, text, type = "text/plain;charset=utf-8") {
  downloadBlob(filename, new Blob([text], { type }));
}

export function safeFilename(value, fallback = "microcd-project") {
  const cleaned = String(value || fallback).trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

export function setupTabs(root = document) {
  root.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab, tabs));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const targetIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[targetIndex].focus();
        activateTab(tabs[targetIndex], tabs);
      });
    });
  });
}

function activateTab(tab, tabs) {
  tabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(candidate.getAttribute("aria-controls"));
    if (panel) panel.hidden = !selected;
  });
}

export function bindDialog(dialog, openers, closeSelector = "[data-dialog-close]") {
  openers.forEach((opener) => opener.addEventListener("click", () => dialog.showModal()));
  dialog.querySelectorAll(closeSelector).forEach((closer) => closer.addEventListener("click", () => dialog.close()));
}

export async function sha256(fileOrText) {
  const data = typeof fileOrText === "string" ? new TextEncoder().encode(fileOrText) : await fileOrText.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, "0")).join("");
}
