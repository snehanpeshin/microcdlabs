const byId = id => document.getElementById(id);
const statusLabels = {
  pending: "Awaiting approval",
  approved: "Invoice pending — retry with approved details",
  sent: "Invoice sent",
  paid: "Paid — ready for fulfillment",
};

export function mountQuoteQueue(endpoint, accessToken, live = false) {
  const prefix = live ? "sourcing-live-quote" : "sourcing-quote";
  const mode = live ? "live" : "sandbox";
  const panel = byId(prefix + "-queue");
  const status = byId(prefix + "-status");
  const list = byId(prefix + "-list");
  const more = byId(prefix + "-more");
  const refresh = byId(prefix + "-refresh");
  let cursor;
  let loading = false;

  async function request(url, options = {}) {
    const headers = { Authorization: "Bearer " + accessToken, ...options.headers };
    const response = await fetch(url, { ...options, headers, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 404 && !data.error) throw new Error("The " + mode + " quote queue is awaiting backend setup.");
      throw new Error(data.error || "Could not reach the quote queue.");
    }
    return data;
  }

  function field(label, name, options = {}) {
    const wrapper = document.createElement("label");
    wrapper.append(label);
    const input = document.createElement(options.tag || "input");
    input.name = name;
    input.required = true;
    if (options.type) input.type = options.type;
    if (options.pattern) input.pattern = options.pattern;
    if (options.inputMode) input.inputMode = options.inputMode;
    if (options.maxLength) input.maxLength = options.maxLength;
    if (options.value !== undefined) {
      input.value = options.value;
      input.readOnly = true;
    }
    wrapper.append(input);
    return wrapper;
  }

  function entryFor(quote, enabled) {
    const card = document.createElement("article");
    card.className = "quote-admin-card";
    const title = document.createElement("h3");
    title.textContent = quote.reference + " · " + (statusLabels[quote.status] || quote.status);
    const contact = document.createElement("p");
    contact.textContent = [quote.name, quote.organization, quote.email].filter(Boolean).join(" · ");
    const detail = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Request requirements";
    const description = document.createElement("p");
    description.className = "quote-admin-description";
    description.textContent = [quote.description, quote.context].filter(Boolean).join("\n\n");
    detail.append(summary, description);
    card.append(title, contact, detail);
    if (!enabled || !["pending", "approved"].includes(quote.status)) return card;

    const form = document.createElement("form");
    form.className = "quote-admin-form";
    const amount = quote.cents === undefined ? undefined : (quote.cents / 100).toFixed(2);
    form.append(
      field("Approved total in USD, including shipping and tax if applicable", "amount", {
        inputMode: "decimal", pattern: "[0-9]{1,6}[.][0-9]{2}", value: amount,
      }),
      field("Invoice line description", "description", {
        tag: "textarea", maxLength: 500, value: quote.invoiceDescription,
      }),
      field(live ? "Buyer approved this total and billing email" : "Buyer approved this quote", "approved", { type: "checkbox" }),
    );
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = (quote.status === "approved" ? "Retry " : "Send ") + mode + " invoice";
    const result = document.createElement("p");
    result.setAttribute("role", "status");
    form.append(button, result);
    form.addEventListener("submit", async event => {
      event.preventDefault();
      button.disabled = true;
      const values = new FormData(form);
      result.textContent = "Processing the " + mode + " invoice…";
      try {
        const { status: next } = await request(endpoint + "/invoice", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: quote.reference, amount: values.get("amount"),
            description: values.get("description"), approved: values.has("approved"),
          }),
        });
        title.textContent = quote.reference + " · " + statusLabels[next];
        form.remove();
        title.tabIndex = -1;
        title.focus();
      } catch (error) {
        result.textContent = error.message;
        button.disabled = false;
      }
    });
    card.append(form);
    return card;
  }

  async function load(append = false) {
    if (loading) return;
    loading = true;
    more.disabled = true;
    refresh.disabled = true;
    status.textContent = "Loading " + mode + " quotes…";
    try {
      const url = new URL(endpoint);
      if (append && cursor) url.searchParams.set("cursor", cursor);
      const page = await request(url);
      if (!append) list.replaceChildren();
      const enabled = !live || page.enabled === true;
      for (const quote of page.quotes) list.append(entryFor(quote, enabled));
      cursor = page.cursor;
      more.hidden = !cursor;
      status.textContent = !enabled ? "Live invoice sending is paused."
        : list.childElementCount ? "" : "No " + mode + " quote requests yet.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      loading = false;
      more.disabled = false;
      refresh.disabled = false;
    }
  }

  panel.hidden = false;
  more.addEventListener("click", () => load(true));
  refresh.addEventListener("click", () => load());
  load();
}
