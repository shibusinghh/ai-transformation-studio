const SECTIONS = ["radar", "lab", "portfolio", "toolkit", "digest", "linkedin"];
let manifest = { radar: [], lab: [], portfolio: [], toolkit: [], digest: [], linkedin: [] };
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
  setupBuilder();
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
  if (name === "map") initMapOnce();
  window.scrollTo(0, 0);
}

/* ---------- signals map ---------- */
let mapState = { started: false, data: null, globe: null, active: new Set() };

async function initMapOnce() {
  if (mapState.started) return;
  mapState.started = true;
  try {
    const res = await fetch("content/map.json", { cache: "no-store" });
    mapState.data = await res.json();
  } catch (e) {
    document.getElementById("map-detail").innerHTML = '<div class="empty">Could not load map.json</div>';
    return;
  }
  mapState.active = new Set(Object.keys(mapState.data.categories));
  renderLegend();
  loadGlobeLib()
    .then(() => buildGlobe())
    .catch(() => showMapFallback());
}

function loadGlobeLib() {
  return new Promise((resolve, reject) => {
    if (window.Globe) return resolve();
    if (!window.WebGLRenderingContext) return reject(new Error("no webgl"));
    const s = document.createElement("script");
    s.src = "https://unpkg.com/globe.gl@2.32.2/dist/globe.gl.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("cdn failed"));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("timeout")), 12000);
  });
}

function activeSignals() {
  return mapState.data.signals.filter((x) => mapState.active.has(x.category));
}

function buildGlobe() {
  const el = document.getElementById("globe-container");
  const width = el.clientWidth || 700;
  try {
    mapState.globe = Globe()(el)
      .width(width).height(480)
      .backgroundColor("rgba(0,0,0,0)")
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
      .atmosphereColor("#5eead4").atmosphereAltitude(0.18)
      .pointAltitude(0.03).pointRadius(0.85)
      .pointColor((d) => mapState.data.categories[d.category].color)
      .pointLabel((d) => '<div style="font:12px Inter,sans-serif;max-width:240px;background:#161b24;padding:8px 10px;border-radius:8px;border:1px solid #232a36">' +
        '<b>' + esc(d.title) + '</b><br><span style="color:#8b95a7">' + esc(d.city) + ", " + esc(d.country) + '</span></div>')
      .onPointClick((d) => showSignalDetail(d))
      .pointsData(activeSignals());
    mapState.globe.controls().autoRotate = true;
    mapState.globe.controls().autoRotateSpeed = 0.6;
    mapState.globe.pointOfView({ lat: 45, lng: -5, altitude: 2.1 });
  } catch (e) {
    showMapFallback();
  }
}

function renderLegend() {
  const el = document.getElementById("map-legend");
  el.innerHTML = Object.entries(mapState.data.categories).map(([key, c]) =>
    '<button class="legend-chip active" data-cat="' + key + '" style="--chip:' + c.color + '">' +
    '<span class="chip-dot"></span>' + esc(c.label) +
    ' <span class="chip-n">' + mapState.data.signals.filter((s) => s.category === key).length + "</span></button>").join("");
  el.querySelectorAll(".legend-chip").forEach((btn) => btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;
    if (mapState.active.has(cat)) { mapState.active.delete(cat); btn.classList.remove("active"); }
    else { mapState.active.add(cat); btn.classList.add("active"); }
    if (mapState.globe) mapState.globe.pointsData(activeSignals());
    if (!document.getElementById("map-fallback").hidden) showMapFallback();
  }));
}

function showSignalDetail(d) {
  const c = mapState.data.categories[d.category];
  document.getElementById("map-detail").innerHTML =
    '<div class="item-top"><span class="tag" style="border-color:' + c.color + ";color:" + c.color + '">' + esc(c.label) + "</span>" +
    '<span class="item-date">' + esc(d.city) + ", " + esc(d.country) + " · " + esc(d.date) + "</span>" +
    (d.verified ? "" : '<span class="badge badge-demo">verify</span>') + "</div>" +
    '<div class="item-title">' + esc(d.title) + "</div>" +
    '<p class="detail-summary">' + esc(d.summary) + "</p>" +
    (d.source ? '<a class="detail-link" href="' + esc(d.source) + '" target="_blank" rel="noopener">Source ↗</a>'
              : '<span class="item-date">No public source yet — lead only.</span>');
}

function showMapFallback() {
  document.querySelector(".globe-wrap").hidden = true;
  const el = document.getElementById("map-fallback");
  el.hidden = false;
  el.innerHTML = activeSignals().map((d) => {
    const c = mapState.data.categories[d.category];
    return '<div class="item-card"><div class="item-top">' +
      '<span class="tag" style="border-color:' + c.color + ";color:" + c.color + '">' + esc(c.label) + "</span>" +
      '<span class="item-date">' + esc(d.city) + ", " + esc(d.country) + " · " + esc(d.date) + "</span></div>" +
      '<div class="item-title">' + esc(d.title) + "</div>" +
      '<p class="detail-summary">' + esc(d.summary) + "</p>" +
      (d.source ? '<a class="detail-link" href="' + esc(d.source) + '" target="_blank" rel="noopener">Source ↗</a>' : "") + "</div>";
  }).join("") || '<div class="empty">No categories selected.</div>';
}

/* ---------- scenario builder ---------- */
function setupBuilder() {
  const form = document.getElementById("builder-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const b = readBuilder();
    document.getElementById("builder-plan").innerHTML = marked.parse(buildSkeleton(b));
    document.getElementById("builder-output").hidden = false;
    document.getElementById("builder-output").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("copy-brief").addEventListener("click", () => {
    const b = readBuilder();
    navigator.clipboard.writeText(buildDeckBrief(b)).then(() => {
      const btn = document.getElementById("copy-brief");
      btn.textContent = "Copied ✓";
      setTimeout(() => (btn.textContent = "Copy full-deck brief"), 2000);
    });
  });
}

function readBuilder() {
  const v = (id) => document.getElementById(id).value;
  const c = (id) => document.getElementById(id).checked;
  return {
    org: v("b-org").trim() || "the organization",
    size: v("b-size"), industry: v("b-industry"), sector: v("b-sector"),
    region: v("b-region"), deploy: v("b-deploy"), timeline: parseInt(v("b-timeline"), 10),
    wc: c("b-wc"), restructure: c("b-restructure"), failed: c("b-failed"),
    pressure: c("b-pressure"), regulated: c("b-regulated"),
    problem: v("b-problem").trim() || "(no problem statement given)",
    goal: v("b-goal").trim() || "(no goal given)",
  };
}

const SIZE_META = {
  s: { label: "under 500 people", waves: 1, workflows: "1-2" },
  m: { label: "500-2,000 people", waves: 2, workflows: "2-3" },
  l: { label: "2,000-10,000 people", waves: 3, workflows: "2-4" },
  xl: { label: "10,000-50,000 people", waves: 4, workflows: "4-6" },
  xxl: { label: "50,000+ people", waves: 5, workflows: "4-6 per division" },
};

function buildSkeleton(b) {
  const size = SIZE_META[b.size];
  const eu = b.region === "eu" || b.region === "global";
  const trustHard = b.restructure || b.failed;
  const lines = [];

  lines.push("## Scenario: " + b.deploy + " at " + b.org);
  lines.push("*" + b.industry + " · " + b.sector + " · " + size.label + " · " + b.timeline + "-month ambition*");
  lines.push("\n**Problem:** " + b.problem);
  lines.push("\n**Goal:** " + b.goal);

  lines.push("\n### My reading of your situation");
  const reads = [];
  if (trustHard) reads.push("**Trust is your critical path, not technology.** " +
    (b.restructure ? "A restructuring inside 24 months means every AI message will be read as a headcount message. " : "") +
    (b.failed ? "Abandoned pilots taught the organization that AI announcements can be safely ignored — that lesson must be unlearned publicly. " : "") +
    "Plan for opt-in cohorts behind signed guarantees before any mandate.");
  if (b.wc) reads.push("**Works councils change the sequence.** Consultation happens before design freezes, with a written telemetry-exclusion commitment; the wave plan should lead with non-works-council units so the program never fully stalls.");
  if (eu) reads.push("**The EU AI Act is your forcing function.** Article 4 literacy (in force) and the August 2026 enforcement wave convert training and inventory work into funded compliance — use that budget to buy real capability.");
  if (b.pressure) reads.push("**The board deadline is a risk to manage, not a plan input.** Published benchmarks say ~79% of enterprises claim agent adoption while ~11% run agents in production; a deadline that ignores that gap produces adoption theater. Reset expectations with the four-number scorecard in month one.");
  if (b.regulated && !eu) reads.push("**Regulated industry:** human review stays on all external-facing agent output in year one; the audit trail is a design requirement, not a report.");
  if (!reads.length) reads.push("No acute trust or regulatory flags — your risk concentrates in ownership: workflows without named owners are where value quietly dies.");
  lines.push(reads.map((r) => "- " + r).join("\n"));

  lines.push("\n### Phase plan (" + b.timeline + " months, " + size.waves + " wave" + (size.waves > 1 ? "s" : "") + ")");
  const p1 = Math.max(2, Math.round(b.timeline * 0.17));
  const p2 = Math.max(3, Math.round(b.timeline * 0.33));
  lines.push("1. **Foundations (months 0-" + p1 + "):** AI use inventory with amnesty" + (b.failed ? " + public post-mortem of the abandoned pilots" : "") +
    "; governance stood up (review board with kill-switch authority); baseline trust/readiness survey" +
    (b.wc ? "; works council consultation opens" : "") + (eu ? "; Article 4 literacy tier 1 launches" : "") + ".");
  lines.push("2. **Prove (months " + p1 + "-" + p2 + "):** opt-in champion cohort; first " + size.workflows + " workflows redesigned around agents with named owners; results published monthly — including failures. Gate: 70%+ active use on the target task within 60 days.");
  lines.push("3. **Scale (months " + p2 + "-" + Math.round(b.timeline * 0.75) + "):** wave rollout" + (b.wc ? " (negotiated markets on their agreed timeline)" : "") + "; manager enablement 6 weeks ahead of each wave; quarterly telemetry reviews per workflow.");
  lines.push("4. **Embed (to month " + b.timeline + "):** governance and benefits move to the line; job architecture changes formalized. Gate — the stick test: the program can be dissolved without the capability degrading.");

  lines.push("\n### Guardrails to publish");
  const g = [];
  if (trustHard) g.push("**No-displacement guarantee** (time-boxed, signed by the sponsor) — the price of admission for redesigning work here.");
  g.push("**Telemetry exclusion:** agent usage data never feeds performance management" + (b.wc ? " (written into the works council agreement)" : "") + ".");
  g.push("**Named human accountability** for every agent action; registry-or-shutdown for unregistered use.");
  g.push("**Unmassaged reporting:** the board sees the four numbers (workflows in production · active use at 60 days · " + (eu ? "Article 4 evidence coverage" : "literacy coverage") + " · registry breaches) — nothing that counts prompts.");
  lines.push(g.map((x) => "- " + x).join("\n"));

  lines.push("\n### Top risks & tripwires");
  const risks = [];
  risks.push("- **Adoption theater** — L:H / I:H. Tripwire: <40% of cohort using the agent for the target task at day 45 → stop the wave, diagnose, redesign.");
  if (trustHard) risks.push("- **Trust collapse** — L:M / I:H. Tripwire: trust pulse drops >10pts or attrition >1pt over baseline in any affected team → pause expansion, sponsor-level reset.");
  if (b.wc) risks.push("- **Formal works council dispute** — L:M / I:H. Tripwire: any formal filing → market-level pause and joint-committee resolution before restart.");
  if (b.regulated || eu) risks.push("- **Agent incident reaching a customer or regulator** — L:M / I:H. Tripwire: any severity-1 incident → 72h freeze on that agent class, root cause to the review board.");
  if (b.pressure) risks.push("- **Deadline-driven scope inflation** — L:H / I:M. Tripwire: any wave brought forward without its gate met → steering escalation with the published gate criteria.");
  risks.push("- **Unowned workflows** — L:H / I:M. Tripwire: any workflow 2 weeks without a named accountable owner → removed from scope until owned.");
  lines.push(risks.join("\n"));

  lines.push("\n---\n*Skeleton generated by the rules engine from your inputs. For the full deck — stakeholder plays, comms calendar, complete risk register, slide structure — copy the brief and run `/deck-builder` in Claude Code.*");
  return lines.join("\n");
}

function buildDeckBrief(b) {
  const size = SIZE_META[b.size];
  return [
    "Run /deck-builder with this scenario brief:",
    "",
    "Organization: " + b.org + " (" + b.industry + ", " + b.sector + ", " + size.label + ", primary region: " + b.region.toUpperCase() + ")",
    "Deploying: " + b.deploy,
    "Timeline ambition: " + b.timeline + " months",
    "Problem statement: " + b.problem,
    "Main goal: " + b.goal,
    "Context flags: " +
      ([b.wc && "works councils/unions", b.restructure && "restructuring in last 24 months",
        b.failed && "prior AI pilots failed/abandoned", b.pressure && "hard board deadline",
        b.regulated && "heavily regulated industry"].filter(Boolean).join("; ") || "none"),
    "",
    "Produce the complete end-to-end change management deck: executive summary, situation reading, " +
    "objectives with benchmarked success definition, explicit assumptions, stakeholder map and plays, " +
    "phased roadmap with gates, comms and manager-enablement calendar, AI-literacy plan" +
    (b.region === "eu" || b.region === "global" ? " (EU AI Act Article 4 evidence logging)" : "") +
    ", full risk register with named tripwires, guardrails, KPI framework, value realization, " +
    "and a 'what makes it stick' close. Cite every external benchmark.",
  ].join("\n");
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
