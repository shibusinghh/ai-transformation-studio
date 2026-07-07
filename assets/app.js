const SECTIONS = ["radar", "lab", "portfolio", "toolkit", "linkedin"];
let manifest = { radar: [], lab: [], portfolio: [], toolkit: [], linkedin: [] };
let feed = { updated: null, items: [] };

async function init() {
  const [mRes, fRes] = await Promise.allSettled([
    fetch("content/manifest.json", { cache: "no-store" }),
    fetch("content/feed.json", { cache: "no-store" }),
  ]);

  if (mRes.status === "fulfilled" && mRes.value.ok) {
    manifest = await mRes.value.json();
  } else {
    document.getElementById("stats-row").innerHTML =
      '<div class="empty">Could not load content/manifest.json — serve this folder over HTTP (see README).</div>';
  }
  if (fRes.status === "fulfilled" && fRes.value.ok) {
    try { feed = await fRes.value.json(); } catch (e) { /* keep empty feed */ }
  }

  document.getElementById("last-updated").textContent = "content " + (manifest.updated || "—");
  document.getElementById("today-title").textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  renderStats();
  renderPulse("");
  renderLatestBrief();
  renderChart();
  renderPipeline();
  for (const s of SECTIONS) renderList(s, "");

  document.querySelectorAll(".nav-item").forEach((btn) =>
    btn.addEventListener("click", () => showSection(btn.dataset.section)));
  document.getElementById("back-btn").addEventListener("click", closeReader);
  document.getElementById("pulse-search").addEventListener("input", (e) => renderPulse(e.target.value));
  document.querySelectorAll(".search[data-filter]").forEach((inp) =>
    inp.addEventListener("input", () => renderList(inp.dataset.filter, inp.value)));
}

/* ---------- today: stats ---------- */
function renderStats() {
  const li = manifest.linkedin || [];
  const published = li.filter((x) => x.status === "published").length;
  const todayIso = new Date().toISOString().slice(0, 10);
  const pulseToday = feed.items.filter((x) => (x.published || "").slice(0, 10) === todayIso).length;
  const tiles = [
    { n: feed.items.length, label: "stories on the pulse", sub: pulseToday + " today", cls: "t1" },
    { n: (manifest.radar || []).length, label: "radar briefs", sub: unreadCount() + " unread", cls: "t2" },
    { n: (manifest.lab || []).length, label: "lab scenarios", sub: "worked analyses", cls: "t3" },
    { n: published + "/" + li.length, label: "posts published", sub: (li.length - published) + " in queue", cls: "t4" },
  ];
  document.getElementById("stats-row").innerHTML = tiles.map((t) =>
    '<div class="stat ' + t.cls + '"><div class="stat-n">' + esc(t.n) + "</div>" +
    '<div class="stat-label">' + esc(t.label) + "</div>" +
    '<div class="stat-sub">' + esc(t.sub) + "</div></div>").join("");
}

function unreadCount() {
  return (manifest.radar || []).filter((x) => x.status === "unread").length;
}

/* ---------- today: live pulse ---------- */
function renderPulse(query) {
  const el = document.getElementById("pulse-list");
  const meta = document.getElementById("pulse-meta");
  meta.textContent = feed.updated
    ? "auto-updated " + timeAgo(feed.updated)
    : "run scripts/update_feed.py";

  const q = query.trim().toLowerCase();
  const items = feed.items.filter((it) =>
    !q || it.title.toLowerCase().includes(q) ||
    (it.matched || []).some((m) => m.includes(q)) ||
    it.source.toLowerCase().includes(q));

  if (!items.length) {
    el.innerHTML = '<div class="empty">' + (feed.items.length ? "No stories match." :
      "No feed yet — run <code>python3 scripts/update_feed.py</code> or wait for the daily action.") + "</div>";
    return;
  }
  el.innerHTML = items.map((it) =>
    '<a class="pulse-item" href="' + esc(it.link) + '" target="_blank" rel="noopener">' +
    '<div class="pulse-top"><span class="pulse-source">' + esc(it.source) + "</span>" +
    '<span class="pulse-time">' + timeAgo(it.published) + "</span>" +
    '<span class="pulse-score" title="relevance">' + "▮".repeat(Math.min(4, Math.ceil(it.score / 3))) + "</span></div>" +
    '<div class="pulse-title">' + esc(it.title) + "</div>" +
    ((it.matched || []).length ? '<div class="item-tags">' +
      it.matched.slice(0, 4).map((m) => '<span class="tag">' + esc(m) + "</span>").join("") + "</div>" : "") +
    "</a>").join("");
}

/* ---------- today: latest brief / chart / pipeline ---------- */
function renderLatestBrief() {
  const el = document.getElementById("latest-brief");
  const items = (manifest.radar || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (!items.length) { el.innerHTML = '<div class="empty">No briefs yet — run <code>/daily-radar</code>.</div>'; return; }
  const it = items[0];
  const stale = it.date !== new Date().toISOString().slice(0, 10);
  el.innerHTML =
    '<div class="brief-card" id="brief-card">' +
    '<div class="item-top"><span class="item-date">' + esc(it.date) + "</span>" +
    (stale ? '<span class="badge badge-unread">new brief due — run /daily-radar</span>' :
             '<span class="badge badge-done">fresh</span>') + "</div>" +
    '<div class="item-title">' + esc(it.title) + "</div></div>";
  document.getElementById("brief-card").addEventListener("click", () => openReader(it));
}

function renderChart() {
  const el = document.getElementById("pulse-chart");
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  const counts = days.map((d) => feed.items.filter((x) => (x.published || "").slice(0, 10) === d).length);
  const max = Math.max(1, ...counts);
  el.innerHTML = days.map((d, i) =>
    '<div class="bar-col"><div class="bar" style="height:' + Math.round((counts[i] / max) * 64 + 4) + 'px" title="' +
    counts[i] + ' stories"></div><div class="bar-label">' + d.slice(8) + "</div></div>").join("");
}

function renderPipeline() {
  const el = document.getElementById("pipeline");
  const items = (manifest.linkedin || []).slice().sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  if (!items.length) { el.innerHTML = '<div class="empty">Queue is empty — run <code>/linkedin-drafts</code>.</div>'; return; }
  el.innerHTML = items.map((it) =>
    '<div class="pipe-row" data-file="' + esc(it.file) + '">' +
    '<span class="badge badge-' + esc(it.status || "draft") + '">' + esc(it.status || "draft") + "</span>" +
    '<span class="pipe-title">' + esc(it.title) + '</span>' +
    '<span class="item-date">' + esc(it.date || "") + "</span></div>").join("");
  el.querySelectorAll(".pipe-row").forEach((row) => {
    const item = items.find((x) => x.file === row.dataset.file);
    row.addEventListener("click", () => openReader(item));
  });
}

/* ---------- section lists ---------- */
function renderList(section, query) {
  const q = (query || "").trim().toLowerCase();
  const all = (manifest[section] || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const items = all.filter((it) =>
    !q || (it.title || "").toLowerCase().includes(q) || (it.tags || []).some((t) => t.includes(q)));
  const el = document.getElementById("list-" + section);
  const countEl = document.getElementById("count-" + section);
  if (countEl) countEl.textContent = all.length || "";

  if (!items.length) {
    el.innerHTML = '<div class="empty">' + (all.length ? "Nothing matches." : "Nothing here yet.") + "</div>";
    return;
  }
  el.innerHTML = "";
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML =
      '<div class="item-top"><span class="item-date">' + esc(item.date || "") + "</span>" +
      (item.status ? '<span class="badge badge-' + esc(item.status) + '">' + esc(item.status) + "</span>" : "") + "</div>" +
      '<div class="item-title">' + esc(item.title || item.file) + "</div>" +
      ((item.tags || []).length ? '<div class="item-tags">' +
        item.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>" : "");
    card.addEventListener("click", () => openReader(item));
    el.appendChild(card);
  }
}

/* ---------- reader / navigation ---------- */
async function openReader(item) {
  const reader = document.getElementById("reader");
  const body = document.getElementById("reader-body");
  try {
    const res = await fetch("content/" + item.file, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    body.innerHTML = marked.parse(await res.text());
    body.querySelectorAll("a[href^='http']").forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });
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
  showSection(active ? active.dataset.section : "today");
}

function showSection(name) {
  document.getElementById("reader").hidden = true;
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.section === name));
  document.querySelectorAll(".section").forEach((s) => s.classList.toggle("active", s.id === "section-" + name));
  window.scrollTo(0, 0);
}

/* ---------- utils ---------- */
function timeAgo(iso) {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return Math.round(s / 60) + "m ago";
  if (s < 86400) return Math.round(s / 3600) + "h ago";
  return Math.round(s / 86400) + "d ago";
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

init();
