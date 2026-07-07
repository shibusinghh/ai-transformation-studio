---
name: weekly-digest
description: Generate the weekly Field Digest (which fields are disrupted, client-demand patterns, how orgs must adapt) and refresh the Signals Map in the same run. Use when the user says "run the digest", "weekly digest", "update the map", or on the first session of a new week.
---

# Weekly Field Digest + Signals Map refresh

One run, two outputs: `content/digest/YYYY-Www.md` and updated `content/map.json`.
Run weekly (Monday). If this week's digest exists, ask before regenerating.

## Research (4-6 web searches)

1. People Advisory disruption: org design/reorg news, job architecture and skills-based moves.
2. HRIS & HR tech: Workday, SAP SuccessFactors, ServiceNow, Oracle HCM agent/AI announcements.
3. Client-demand signals: what enterprises are buying — RFP patterns, consulting bookings,
   new practice launches, outcome-based pricing moves.
4. AI transformation programs: named enterprise rollouts, scale-ups, failures.
5. Regulation: EU AI Act milestones, transparency/literacy obligations, national divergence.
6. Review the week's radar briefs and pulse for items worth elevating.

## Digest structure (follow content/digest/2026-W28.md)

- **Most disrupted field this week** — name one, argue it with sources, close with a
  "read for practitioners" line.
- One or two thematic sections on the week's pattern (e.g. HRIS going agentic).
- **What clients are asking for now** — numbered demand-pattern shifts, each sourced.
  This section is the digest's core: demand signals, not product news.
- **How an organization needs to adapt** — 3-5 synthesis bullets in imperative voice.
- Every claim linked; single-source items marked "(single source — verify)".

## Signals Map update rules

- Add 3-8 new signals to `content/map.json` from the week's research. Each needs:
  lat/lng (city-level), country, city, category (org-design / job-architecture / hris /
  ai-transformation / workforce / regulation), title, 2-3 sentence summary written through
  the People Advisory lens, date, source URL, and `verified` (true only with a solid source;
  user-supplied leads get `verified: false` and "LEAD — needs source verification" in the summary).
- Never invent a location: pin to the company's HQ or the event's stated location. If
  neither is known, the signal doesn't go on the map.
- Prune: keep the map under ~40 signals; retire the oldest low-relevance ones (move nothing
  to the trash silently — list retired ids in the digest's footer).
- Update the top-level `updated` date in map.json.

## After writing

Register the digest in `content/manifest.json` under `digest`; update `updated`.
Suggest one digest insight as this week's second LinkedIn post.
