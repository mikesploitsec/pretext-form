// pretext-form: a configurable, offline transfer-form prop. No network calls, no storage, no form submission.
"use strict";

const FIELD = (label, opts = {}) => Object.assign({ label, value: "", show: true, flag: false, lock: true }, opts);

const BASE = {
  title: "Online Banking Services",
  sub: "Business & Personal Accounts  |  Service message: funds transfers requested before 4:30 PM are processed the same business day",
  timer: "Session time remaining: 12:41",
  nav: ["Home", "Accounts", "Payments", "Transfers", "Statements", "Help"],
  crumb: "Home > Payments > International Funds Transfer > New Beneficiary",
  step: "International Funds Transfer  -  New Beneficiary  -  Step 2 of 3: Beneficiary Details",
  errhead: "Your form could not be submitted.",
  foot: "© Online Banking Services. All transfers are subject to verification.",
  colour: "#1A3C82",
};

const PRESETS = {
  "UK beneficiary (sort code)": [
    FIELD("Account name", { flag: true, lock: false }), FIELD("Account address", { lock: false }),
    FIELD("Account number", { value: "12345678" }), FIELD("Sort code", { value: "00-00-00" }),
    FIELD("IBAN", { value: "GB00 XXXX 0000 0000 0000 00" }), FIELD("SWIFT / BIC", { value: "XXXXGB2LXXX" }),
    FIELD("Beneficiary bank", { value: "Example Bank plc", hint: "resolved from SWIFT/BIC" }),
    FIELD("Beneficiary bank country", { value: "United Kingdom" }), FIELD("Transfer currency", { value: "GBP" }),
    FIELD("Payment reference", { lock: false }),
  ],
  "EU beneficiary (IBAN)": [
    FIELD("Account holder", { flag: true, lock: false }), FIELD("Holder address", { lock: false }),
    FIELD("IBAN", { value: "DE00 0000 0000 0000 0000 00" }), FIELD("BIC", { value: "XXXXDEFFXXX" }),
    FIELD("Beneficiary bank", { value: "Example Bank AG", hint: "resolved from BIC" }),
    FIELD("Beneficiary bank country", { value: "Germany" }), FIELD("Transfer currency", { value: "EUR" }),
    FIELD("Payment reference", { lock: false }),
  ],
  "US beneficiary (ABA routing)": [
    FIELD("Beneficiary name", { flag: true, lock: false }), FIELD("Beneficiary address", { lock: false }),
    FIELD("Account number", { value: "000123456789" }), FIELD("ABA routing number", { value: "000000000" }),
    FIELD("Account type", { value: "Checking" }),
    FIELD("Beneficiary bank", { value: "Example Bank, N.A.", hint: "resolved from routing number" }),
    FIELD("Transfer currency", { value: "USD" }), FIELD("Payment reference", { lock: false }),
  ],
  "Canadian beneficiary (transit / institution)": [
    FIELD("Beneficiary name", { flag: true, lock: false }), FIELD("Beneficiary address", { lock: false }),
    FIELD("Institution number", { value: "000" }), FIELD("Transit number", { value: "00000" }),
    FIELD("Account number", { value: "0000000" }),
    FIELD("Beneficiary bank", { value: "Example Bank of Canada", hint: "resolved from institution number" }),
    FIELD("Transfer currency", { value: "CAD" }), FIELD("Payment reference", { lock: false }),
  ],
  "Blank": [FIELD("Field 1", { lock: false })],
};

let S;
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); kids.forEach((k) => e.append(k)); return e; };
const clone = (o) => JSON.parse(JSON.stringify(o));

function load(name) { S = Object.assign(clone(BASE), { preset: name, fields: clone(PRESETS[name]) }); renderPanel(); render(); }

function render() {
  document.documentElement.style.setProperty("--mast", S.colour);
  $("m-title").textContent = S.title; $("m-sub").textContent = S.sub; $("m-timer").textContent = S.timer;
  $("m-nav").replaceChildren(...S.nav.map((n) => el("span", { textContent: n })));
  $("m-crumb").textContent = S.crumb; $("m-step").textContent = S.step; $("m-foot").textContent = S.foot;
  const shown = S.fields.filter((f) => f.show), bad = shown.filter((f) => f.flag);
  const tb = $("m-fields"); tb.replaceChildren();
  for (const f of shown) {
    const lbl = el("td", { className: "lbl" }); if (f.flag) lbl.append(el("span", { className: "req", textContent: "* " })); lbl.append(f.label);
    const val = el("span", { className: "val" + (f.lock && !f.flag ? " locked" : ""), textContent: f.flag ? "" : f.value });
    const cell = el("td", { className: f.flag ? "bad" : "" }, val); if (f.hint) cell.append(el("span", { className: "hint", textContent: " " + f.hint }));
    tb.append(el("tr", {}, lbl, cell));
    if (f.flag) tb.append(el("tr", {}, el("td", { className: "errline", colSpan: 2, textContent: `${f.label} is required and cannot be blank. Enter the ${f.label.toLowerCase()} exactly as it is registered.` })));
  }
  const err = $("m-err"); err.replaceChildren();
  if (bad.length) {
    const n = bad.length, one = n === 1;
    err.append(el("b", { textContent: S.errhead }), el("br"),
      `${n} required field${one ? " is" : "s are"} incomplete. The highlighted field${one ? "" : "s"} must be completed before this beneficiary can be saved and the transfer prepared.`);
  }
  const sub = $("b-submit"); sub.className = bad.length ? "" : "active"; sub.disabled = bad.length > 0;
}

function renderPanel() {
  $("p-preset").value = S.preset;
  for (const k of ["title", "sub", "timer", "crumb", "step", "errhead", "foot"]) $("t-" + k).value = S[k];
  $("t-colour").value = S.colour;
  const box = $("p-fields"); box.replaceChildren();
  S.fields.forEach((f, i) => {
    const chk = (key, text) => { const c = el("input", { type: "checkbox", checked: f[key] }); c.onchange = () => { f[key] = c.checked; renderPanel(); render(); }; return el("label", {}, c, " " + text); };
    const lab = el("input", { className: "lab", value: f.label, ariaLabel: "Field label" }); lab.oninput = () => { f.label = lab.value; render(); };
    const v = el("input", { className: "v", value: f.value, placeholder: "value shown on the form", ariaLabel: "Field value" }); v.oninput = () => { f.value = v.value; render(); };
    const btn = (t, fn, title) => el("button", { type: "button", textContent: t, title, onclick: () => { fn(); renderPanel(); render(); } });
    box.append(el("div", { className: "f" + (f.flag ? " flagged" : "") }, lab, v,
      el("div", { className: "opts" }, chk("show", "Show"), chk("flag", "Flag"), chk("lock", "Lock"), el("span", { className: "sp" }),
        btn("↑", () => i > 0 && S.fields.splice(i - 1, 0, S.fields.splice(i, 1)[0]), "Move up"),
        btn("↓", () => i < S.fields.length - 1 && S.fields.splice(i + 1, 0, S.fields.splice(i, 1)[0]), "Move down"),
        btn("✕", () => S.fields.splice(i, 1), "Remove"))));
  });
}

function init() {
  const sel = $("p-preset"); Object.keys(PRESETS).forEach((k) => sel.append(el("option", { value: k, textContent: k })));
  sel.onchange = () => load(sel.value);
  for (const k of ["title", "sub", "timer", "crumb", "step", "errhead", "foot"]) $("t-" + k).oninput = (e) => { S[k] = e.target.value; render(); };
  $("t-colour").oninput = (e) => { S.colour = e.target.value; render(); };
  $("p-add").onclick = () => { S.fields.push(FIELD("New field", { lock: false })); renderPanel(); render(); };
  $("p-reset").onclick = () => load(S.preset);
  const togglePanel = () => { if (document.body.classList.contains("capture")) document.body.classList.remove("capture"); else document.body.classList.toggle("nopanel"); };
  $("toggle").onclick = togglePanel; $("p-close").onclick = togglePanel;
  $("p-capture").onclick = () => document.body.classList.add("capture");
  document.addEventListener("keydown", (e) => { if ((e.key === "p" || e.key === "P") && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) togglePanel(); if (e.key === "Escape") document.body.classList.remove("capture"); });
  $("p-export").onclick = () => {
    const a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" })), download: "pretext-form.json" });
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $("p-import").onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try { const d = JSON.parse(await file.text()); if (!Array.isArray(d.fields)) throw new Error("no fields"); S = Object.assign(clone(BASE), d); if (!PRESETS[S.preset]) S.preset = "Blank"; renderPanel(); render(); }
    catch (err) { alert("That file is not a pretext-form export."); }
    e.target.value = "";
  };
  load("UK beneficiary (sort code)");
}
init();
