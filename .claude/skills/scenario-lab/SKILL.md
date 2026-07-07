---
name: scenario-lab
description: Turn a radar item into a worked change-management/AI-transformation scenario and write it as a lab note. Use when the user says "run the lab", "work this scenario", "analyze item N", or picks a story from a radar brief.
---

# Scenario Lab

Convert one radar item into a lab note at `content/lab/YYYY-MM-DD-<slug>.md`.

## Two modes

**Quick note** (default): the short structure below — situation, mechanism, scenario, one-liner.

**Deep mode** (user says "deep", "full plan", "end to end", or the topic deserves it): act as
the engaged change-management consultant and produce a complete transformation plan. Follow the
structure of `content/lab/2026-07-07-agentic-rollout-transformation-plan.md`:
executive summary; client context (invent a realistic composite client, clearly labeled
fictional); objectives with measurable success definitions benchmarked against published
industry numbers; explicit assumptions (numbered, each with what breaks if it's wrong);
stakeholder map and governance; phased roadmap with workstreams, owners, and timeline;
change and communications plan; AI-literacy/training plan (cite EU AI Act Article 4 where
relevant); full risk register (likelihood x impact, mitigations, named tripwires);
guardrails; KPI framework (leading + lagging); value realization and benefits tracking;
"what makes it stick" section; open questions. Every external number cited to a source.
Deep-mode notes are portfolio-grade: write them so a partner could hand them to a client.

## Process

1. If the user didn't specify an item, read the newest radar brief and propose its "Pick for
   today's Lab"; confirm before writing.
2. Research the item further if needed (1-2 extra searches) — the lab note must stand on
   verified facts, not just the brief's summary.
3. Write the note using the structure of `content/lab/2026-07-07-cisco-agent-rollout.md`:
   - **The situation** — facts only.
   - **Why this breaks / why this works, in change-management terms** — numbered, mechanism-level
     reasoning, not platitudes.
   - **The scenario** — put the user in the seat ("you're the CM lead and X constraint holds").
     Give concrete levers, and include what to do when leadership says no.
   - **What I'd tell a client in one line.**
   - **Reusable asset** — name the checklist/framework this could become.
   - **LinkedIn candidate** — yes/no; if yes, note the planned draft filename.
4. The analysis must contain at least one uncomfortable or contrarian point. If it reads as
   safe consensus, sharpen it before saving.

## Depth option

For meaty scenarios, invoke one of the installed strategy skills (war-gaming,
stakeholder-alignment, risk-and-mitigation, strategic-options) and fold its output in —
credit the framework used in the note.

## After writing

1. Update `content/manifest.json`: add the lab entry (`status: "done"`), and flip the source
   radar item to `status: "read"`.
2. If the note is a LinkedIn candidate, offer to run `/linkedin-drafts` immediately.
