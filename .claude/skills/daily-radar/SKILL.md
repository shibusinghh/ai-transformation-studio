---
name: daily-radar
description: Generate today's tailored intelligence brief on agentic AI, enterprise AI adoption, consulting-market moves, and workforce/change-management signals. Writes content/radar/YYYY-MM-DD.md and updates the manifest. Use when the user says "run the radar", "daily brief", "what's new today", or starts a morning session.
---

# Daily Radar

Produce one brief per day at `content/radar/YYYY-MM-DD.md`. If today's file already
exists, ask before regenerating.

## Search coverage (run 3-5 web searches)

1. Agentic AI enterprise deployment and adoption news (last 48h preferred).
2. Consulting market: MBB, Big 4, Accenture AI practice moves, restructurings, partnerships.
3. AI labs enterprise moves: Anthropic, OpenAI, Google, Microsoft enterprise/Copilot/Gemini announcements.
4. Workforce and change management: layoffs tied to AI, org redesign, adoption failures, employee-trust stories.
5. Rotate a wildcard: AI governance/regulation, agent interoperability, or a specific industry the user is studying.

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
