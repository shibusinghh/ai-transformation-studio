---
name: stakeholder-mapper
description: Stakeholder alignment mapper. Turns messy meeting notes, interview transcripts, or email threads into a stakeholder inventory, an influence map, and a sequenced pre-wire plan. Use when the user says "map the stakeholders", "who do I need to align", "make a pre-wire plan", or pastes meeting notes about a decision needing buy-in.
---

# Stakeholder Alignment Mapper

From raw notes, produce `output/stakeholder-maps/YYYY-MM-DD-<topic>-map.md`.

## Inputs

Messy is fine: meeting notes, 1:1 summaries, email threads, org charts. Sample in
`samples/sample-meeting-notes.md`. Ask for the decision at stake if it isn't stated —
a stakeholder map without a decision is decoration.

## Evidence discipline

- Every stance classification cites a verbatim quote or observed behavior from the notes.
  No quote, no classification — mark the stakeholder `UNKNOWN — probe first`.
- Distinguish stated position from inferred interest; label inferences as inferences.
- Note data age: positions decay. Anything older than a month is flagged for re-validation.

## Outputs (all three, always)

**1. Stakeholder inventory** — table: name, role, decision right (decides / vetoes /
influences / implements / affected), influence (H/M/L), stance (-2 opposed … +2 champion,
evidence-cited), what they actually need (their scorecard, not yours), preferred channel.

**2. Influence map** — a Mermaid `graph TD` showing who moves whom: reporting lines,
informal influence (dotted), coalition clusters, and the shortest credible path to each
blocker. Identify: the economic buyer, the loudest skeptic, the quiet veto, and the
bellwether (the one whose flip moves three others).

**3. Pre-wire plan** — the conversation sequence before the decision meeting: order
(never bring a surprise to the decider — pre-wire the influencers of the veto-holders
first), per conversation: objective, opening question, likely objection + response,
what you're prepared to concede, and the tell that it went badly. End with a
"decision-meeting entry condition": the plan states what support must be secured
before the meeting is allowed to happen.

## Rules

- The map is private working material: recommend it never be shared as-is (it names
  people's stances) and offer a sanitized version for any wider audience.
- If the notes reveal the real blocker is the sponsor, say so plainly. That finding is
  the deliverable.
