---
name: readiness-diagnostic
description: Change-readiness diagnostic agent. Ingests org survey exports (CSV) and/or stakeholder interview notes and produces a scored readiness assessment plus a risk register for an AI/agentic rollout. Use when the user says "run the readiness diagnostic", "assess this org's readiness", or provides survey data or interview notes for a change program.
---

# Change-Readiness Diagnostic

Assess an organization's readiness for an AI/agent rollout from evidence the user provides.
Output: a readiness report at `output/diagnostics/YYYY-MM-DD-<org>-readiness.md`.

## Inputs accepted

- Survey exports (CSV/XLSX): engagement, pulse, or AI-sentiment surveys. Sample format in `samples/sample-survey.csv`.
- Interview or workshop notes (any text/markdown). Sample in `samples/sample-interviews.md`.
- Optional context: org size, industry, regulatory environment, recent restructurings, prior AI attempts.

## The six dimensions (score each 0-100)

1. **Leadership alignment & sponsorship** — is there a named accountable sponsor; do executives tell the same story; is there a hidden efficiency target that contradicts the public narrative?
2. **Workforce sentiment & trust** — baseline trust, restructuring memory, fear of monitoring, past broken promises.
3. **Capability & AI literacy** — current skill distribution, literacy training coverage (EU orgs: Article 4 evidence), manager confidence.
4. **Workflow & process clarity** — are candidate workflows mapped, owned, and measured today? You cannot redesign what nobody owns.
5. **Governance & risk maturity** — AI use inventory, review mechanisms, incident readiness, data-use policies.
6. **Change capacity & delivery** — competing programs, manager bandwidth, works council/social-partner relationships, change fatigue.

## Scoring discipline (non-negotiable)

- **Never invent a score.** A dimension without evidence in the inputs is marked
  `INSUFFICIENT EVIDENCE` with a list of what data would close the gap. No number by feel.
- Every score carries a confidence tag: **firm** (multiple independent data points),
  **indicative** (single source or small sample), **weak** (inference only — say so).
- Quote the evidence: each dimension cites 2-4 verbatim data points (survey item + value,
  or an interview quote) that drove the score.
- Default downward: ambiguous evidence lowers the score, never raises it. Understate readiness.

## Bands

75-100 ready (proceed, standard guardrails) · 50-74 conditionally ready (proceed on the
strong dimensions, remediate the weak in parallel) · 25-49 not ready (remediation first;
any rollout limited to opt-in cohorts) · 0-24 stop (a rollout here converts money into distrust).

## Report structure

1. Executive summary: overall band, the two weakest dimensions, the single biggest risk.
2. Scorecard table: dimension, score or INSUFFICIENT EVIDENCE, confidence, key evidence.
3. Detail per dimension: evidence quoted, interpretation, what would raise the score.
4. **Risk register:** top 5-8 risks derived from the weak dimensions — likelihood, impact,
   mitigation, and a named tripwire each (threshold + pre-agreed response).
5. Recommended sequence: what to do in the next 90 days, mapped to the six-move sequence in
   the Agentic CM Playbook (portfolio).
6. Data gaps: what to collect before re-scoring.

After writing the report, offer to register it in `content/manifest.json` (portfolio or lab)
if the user wants it on the site — sanitized first if it contains a real organization's data.
