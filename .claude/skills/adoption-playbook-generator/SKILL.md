---
name: adoption-playbook-generator
description: AI adoption playbook generator for Copilot/Claude/agent enterprise rollouts. Takes a short intake questionnaire about the organization and generates a tailored end-to-end adoption playbook. Use when the user says "generate an adoption playbook", "build the rollout plan for", or describes an org about to deploy AI tools.
---

# AI Adoption Playbook Generator

Generate a tailored rollout playbook at `output/playbooks/YYYY-MM-DD-<org>-playbook.md`.

## Intake (ask what's missing; 12 questions)

1. Organization size, industry, and markets (EU presence? → AI Act obligations apply).
2. What is being deployed (Copilot / Claude / task-specific agents / mix) and current contract status.
3. Target timeline and what set it (board pressure? renewal date? regulation?).
4. Executive sponsor by name and role — and whether a hidden efficiency target exists.
5. Prior AI attempts and how they ended (publicly? silently?).
6. Restructurings in the last 24 months (the sequencing-collision check).
7. Works councils / unions / consultation obligations, by market.
8. The 2-6 candidate workflows, and whether each has a named owner today.
9. Current AI-literacy state and training infrastructure.
10. Governance today: AI use inventory? review body? incident playbook?
11. What success means to the sponsor in one sentence.
12. Change capacity: what else is the org absorbing right now?

## Generation rules

- Build on the **six-move sequence** from the Agentic CM Playbook (Inventory with amnesty →
  Buy trust with real currency → Redesign workflows not tasks → Managers first, proof
  cohorts, mandates last → Make governance boring → Dissolve the program), tailored to the
  intake answers — cut, reorder, and resize moves; never paste the generic sequence.
- Answers to Q5/Q6 drive the trust posture: recent restructuring or silent pilot deaths
  mean opt-in cohorts, published guarantees (no-displacement, telemetry exclusion), and a
  slower mandate line. Say this to the user even if it conflicts with the Q3 timeline —
  especially if it conflicts.
- EU footprint (Q1) inserts the Article 4 literacy workstream with evidence logging and
  the enforcement-calendar risk (main wave enforceable from 2 August 2026).
- Every playbook includes: wave plan with gates, guardrail set adapted from G1-G5, risk
  register with named tripwires, four-number scorecard (workflows in production /
  active-use-at-60-days / literacy coverage / registry breaches), comms cascade plan,
  manager enablement calendar, and a "what makes it stick" close.
- Benchmarks cited, not invented: 70% active use in 60 days, 2-4 owned workflows baseline,
  the 79%/11% adoption gap — with sources. If the user's targets beat the benchmarks,
  flag the gap; do not silently adopt heroic numbers.
- The playbook must contain at least one recommendation the sponsor will not like.
  If it reads as pure validation, it drifted.
