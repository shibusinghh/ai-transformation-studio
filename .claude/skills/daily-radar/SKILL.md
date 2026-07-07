---
name: daily-radar
description: Generate today's tailored intelligence brief on agentic AI, enterprise AI adoption, consulting-market moves, and workforce/change-management signals. Writes content/radar/YYYY-MM-DD.md and updates the manifest. Use when the user says "run the radar", "daily brief", "what's new today", or starts a morning session.
---

# Daily Radar

Produce one brief per day at `content/radar/YYYY-MM-DD.md`. If today's file already
exists, ask before regenerating.

## Search coverage (run 4-6 web searches)

1. Agentic AI enterprise deployment and adoption news (last 48h preferred).
2. Consulting market: MBB, Big 4, Accenture AI practice moves, restructurings, partnerships.
3. AI labs enterprise moves: Anthropic, OpenAI, Google, Microsoft enterprise/Copilot/Gemini announcements.
4. Workforce and change management: layoffs tied to AI, org redesign, adoption failures, employee-trust stories.
5. **Firm watch (mandatory):** working methodologies, new initiatives, internal processes, and
   benchmarks published or leaked by the target firms (MBB, Big 4, Accenture, AI labs) —
   e.g. new numbered frameworks, internal AI platform metrics (seats, agents, usage),
   member-firm initiatives (the KPMG Malta pattern: local BCM practice + AI tied to EU
   transparency law), certification firsts (ISO/IEC 42001), adoption benchmarks they publish.
6. Regulatory tie-ins: EU AI Act milestones and enforcement, AI literacy obligations,
   transparency requirements — anything that converts change management into a compliance duty.

## Brief structure additions

Besides the news items, every brief includes a **Firm Watch** section: 2-4 entries on
methodology/initiative/benchmark news, each with the firm named, what they run internally or
sell as method, the concrete numbers, and what it means for Shibu's positioning or interview
prep. Quotable benchmarks (adoption %, seat counts, timelines) are the priority — they are
ammunition for client conversations and interviews.

## Brief format

Follow the structure of `content/radar/2026-07-07.md`:
- 4-6 items maximum. Selectivity over volume.
- Per item: **What happened** (facts, dated), **Why it matters for you** (always through the
  change-management x AI-transformation lens, tied to his positioning), **Angle** (a post or
  scenario hook), **Source** (markdown links).
- End with: **Pick for today's Lab** (one item) and **Backlog**.

## Guardrails

- Every claim carries a source link. Single-source items are marked `(single source — verify before publishing)`.
- Never invent statistics or dates. If search results conflict, say so.
- Vendor claims labeled as vendor claims.
- Plain language. Explain jargon on first use.

## After writing the brief

1. Add the entry to `content/manifest.json` under `radar` with `status: "unread"`, a title
   that names the 2-3 biggest items, and 2-4 tags. Update the top-level `updated` date.
2. Tell the user the one item you'd take into the Scenario Lab today, and why, in two sentences.
