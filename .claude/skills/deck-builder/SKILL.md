---
name: deck-builder
description: Turn a Scenario Builder brief (or any client scenario description) into a complete end-to-end change management deck. Use when the user pastes a brief starting "Run /deck-builder", says "build the deck", or asks for a full change program for a described organization.
---

# Deck Builder

From a scenario brief (usually pasted from the site's Scenario Builder), produce a complete
change management deck.

## Outputs

1. Always: the full document at `output/decks/YYYY-MM-DD-<org-slug>-cm-deck.md`.
2. Offer: a slide version via the pptx skill (executive-ready, ~18-25 slides) at the same path
   with `.pptx`. Ask before generating; slides take longer.

## Structure (deck-grade, mirrors the deep-mode lab standard)

1. Executive summary (one page: the situation, the plan shape, the four success numbers, the ask).
2. Situation reading — including what the context flags mean (restructuring → trust is the
   critical path; failed pilots → public post-mortem first; works councils → consultation
   before design freeze; board deadline → expectation reset with benchmarks).
3. Objectives and success definition — the four-number scorecard, benchmarked against
   published numbers (70% active use in 60 days; 2-4 owned workflows baseline; the 79%/11%
   adoption gap). Cite sources; if the client's ambition beats the benchmarks, flag it.
4. Explicit assumptions — numbered, each with "what breaks if wrong" and the fallback.
5. Stakeholder map and plays (invent realistic roles for the org type; label as illustrative).
6. Phased roadmap with gates (scale waves to org size; timeline from the brief).
7. Change and communications plan — one narrative, three audiences; managers as the medium;
   listening loops.
8. AI literacy plan — tiered; EU footprint adds Article 4 evidence logging.
9. Full risk register — likelihood x impact, mitigation, and a NAMED TRIPWIRE per risk.
10. Guardrails — adapt G1-G5 (no-displacement, telemetry exclusion, named accountability,
    registry-or-shutdown, unmassaged reporting) to the context.
11. KPI framework — leading + lagging, anti-vanity rule stated.
12. Value realization — benefits on the line P&L, booked only after a quarter of telemetry.
13. What makes it stick — ownership beyond the program, job architecture changes, boring
    governance, the visible "no" list, trust bought with real currency.
14. Open questions for the client — including at least one the sponsor will not enjoy.

## Rules

- Fictional or unnamed clients: fine. Real client names: remind the user the deck must not
  enter the public repo (`output/` is gitignored for this reason) and never register it in
  the site manifest without explicit sanitization.
- Every external number cited. No invented benchmarks, partners, or dates.
- Plain language; explain jargon at first use; no em dashes; no marketing filler.
- The deck must contain at least one recommendation that costs the sponsor something real.
  Validation-shaped decks get rewritten before delivery.
