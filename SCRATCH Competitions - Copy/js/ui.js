(function () {
  const { safe } = window.CUBE_API;

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    (children || []).forEach(ch => {
      if (ch == null) return;
      node.appendChild(typeof ch === "string" ? document.createTextNode(ch) : ch);
    });
    return node;
  }

  function fmtDateIST(d) {
    if (!d) return "—";
    const ist = new Date(d.getTime() + 330 * 60 * 1000);
    const dd = String(ist.getUTCDate()).padStart(2, "0");
    const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
    const yy = ist.getUTCFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  function fmtDateTimeIST(d) {
    if (!d) return "—";
    const ist = new Date(d.getTime() + 330 * 60 * 1000);
    const dd = String(ist.getUTCDate()).padStart(2, "0");
    const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
    const yy = ist.getUTCFullYear();
    const hh = String(ist.getUTCHours()).padStart(2, "0");
    const mi = String(ist.getUTCMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yy} ${hh}:${mi}`;
  }

  function compactMoney(s) {
    const t = safe(s);
    if (!t) return "";
    return t.replace(/rs\.?/gi, "₹").replace(/inr/gi, "₹").replace(/\s+/g, " ").trim();
  }

  function humanEvents(eventsStr) {
    const t = safe(eventsStr);
    if (!t) return [];
    return t.split(/[,|]/).map(x => x.trim()).filter(Boolean);
  }

  function clampText(s, max = 90) {
    const t = safe(s);
    if (t.length <= max) return t;
    return t.slice(0, max - 1) + "…";
  }

  window.CUBE_UI = {
    el,
    fmtDateIST,
    fmtDateTimeIST,
    compactMoney,
    humanEvents,
    clampText
  };
})();
