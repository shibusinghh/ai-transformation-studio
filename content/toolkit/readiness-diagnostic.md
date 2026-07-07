# Tool — Change-Readiness Diagnostic Agent

**What it does:** ingests org survey exports and/or stakeholder interview notes and produces a scored readiness assessment (six dimensions, 0-100) plus a risk register with named tripwires, for any AI or agent rollout.

**Why it's credible:** it inherits the evidence discipline from my competitive-intelligence work — **it never invents a score**. A dimension without data renders INSUFFICIENT EVIDENCE with a list of what to collect. Every score carries a confidence tag and quotes the evidence that drove it, and ambiguity moves scores down, never up.

**The six dimensions:** leadership alignment & sponsorship · workforce sentiment & trust · capability & AI literacy · workflow & process clarity · governance & risk maturity · change capacity & delivery.

**Bands:** 75+ ready · 50-74 conditionally ready · 25-49 not ready (remediate first) · <25 stop.

**How to run:** open Claude Code in this repo, drop your survey CSV or interview notes in, and say "run the readiness diagnostic on this". Sample input ships with the skill (`.claude/skills/readiness-diagnostic/samples/`).

**See it work:** the demo report in this Toolkit section ("Demo Run — Change-Readiness Diagnostic") was generated from the sample survey — including one dimension the tool refused to score for lack of evidence.
