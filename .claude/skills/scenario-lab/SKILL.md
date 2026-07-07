---
name: scenario-lab
description: Turn a radar item into a worked change-management/AI-transformation scenario and write it as a lab note. Use when the user says "run the lab", "work this scenario", "analyze item N", or picks a story from a radar brief.
---

# Scenario Lab

Convert one radar item into a lab note at `content/lab/YYYY-MM-DD-<slug>.md`.

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
