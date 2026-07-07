const SECTIONS = ["radar", "lab", "portfolio", "linkedin"];
let manifest = null;

async function init() {
  try {
    const res = await fetch("content/manifest.json", { cache: "no-store" });
    manifest = await res.json();
  } catch (e) {
    document.getElementById("list-radar").innerHTML =
      '<div class="empty">Could not load content/manifest.json — serve this folder over HTTP (see README).</div>';
    return;
  }

  document.getElementById("last-updated").textContent = "updated " + (manifest.updated || "—");

  for (const s of SECTIONS) renderList(s);

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
  document.getElementById("back-btn").addEventListener("click", closeReader);
}

function renderList(section) {
  const items = (manifest[section] || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const el = document.getElementById("list-" + section);
  const countEl = document.getElementById("count-" + section);
  if (countEl) countEl.textContent = items.length || "";

  if (!items.length) {
    el.innerHTML = '<div class="empty">Nothing here yet.</div>';
    return;
  }

  el.innerHTML = "";
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML =
      '<div class="item-top">' +
      '<span class="item-date">' + esc(item.date || "") + "</span>" +
      (item.status ? '<span class="badge badge-' + esc(item.status) + '">' + esc(item.status) + "</span>" : "") +
      "</div>" +
      '<div class="item-title">' + esc(item.title || item.file) + "</div>" +
      (item.tags && item.tags.length
        ? '<div class="item-tags">' + item.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>"
        : "");
    card.addEventListener("click", () => openReader(item));
    el.appendChild(card);
  }
}

async function openReader(item) {
  const reader = document.getElementById("reader");
  const body = document.getElementById("reader-body");
  try {
    const res = await fetch("content/" + item.file, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const md = await res.text();
    body.innerHTML = marked.parse(md);
    body.querySelectorAll("a[href^='http']").forEach((a) => {
      a.target = "_blank";
      a.rel = "noopener";
    });
  } catch (e) {
    body.innerHTML = '<div class="empty">Could not load ' + esc(item.file) + "</div>";
  }
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
  reader.hidden = false;
  window.scrollTo(0, 0);
}

function closeReader() {
  document.getElementById("reader").hidden = true;
  const active = document.querySelector(".nav-item.active");
  showSection(active ? active.dataset.section : "radar");
}

function showSection(name) {
  document.getElementById("reader").hidden = true;
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.section === name));
  document.querySelectorAll(".section").forEach((s) => s.classList.toggle("active", s.id === "section-" + name));
  window.scrollTo(0, 0);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

init();
