# Case Study — An AI-Augmented Competitive Intelligence Factory

**Role:** Designer and operator · **Context:** Graduate consulting study for a global travel-technology company (EDHEC) · **Year:** 2026
**Status:** Methodology write-up. Client deliverables are under NDA and are not reproduced here.

> NOTE TO SELF: confirm with the program director exactly what may be disclosed (client name, study title). Until confirmed, keep the client anonymous.

## The problem

Produce a batch of investor-grade competitive-intelligence one-pagers on AI-driven disruptors — fast, consistent, and trustworthy enough for an executive audience — using AI agents to do the heavy research without letting them hallucinate the conclusions.

## What I built

Not a chatbot workflow — an **operating system for AI-assisted research**, with the controls enterprises keep discovering they need after their pilots fail:

- **A single locked template.** The AI edits one data object; it can never touch layout or rendering code. Output consistency by construction, not by review.
- **Hard guardrails as written policy.** Never invent a score (missing data renders as DATA PENDING); never state a partnership, date, or funding figure without a source; ambiguous capability claims default *downward*.
- **Two-source verification.** Every single-source claim carries a visible VERIFY flag. Vendor claims are labeled as vendor claims and weighted below independent evidence.
- **Adversarial framing discipline.** Every profile must state the strongest case *against* the client's comfort before any mitigation — a structural defense against AI's tendency to please.
- **A QC gate.** A written checklist signed off line by line before a page ships, plus a verification log per page.

## Why it matters

The 2026 enterprise AI story is a 68-point gap between "adopted" (79%) and "in production" (11%). The gap is governance and trust. This project is that problem in miniature, solved: the interesting part was never the model — it was the guardrails, escalation rules, and definition of done that made AI output executive-safe.

## What I'd reuse with a client

1. Guardrails written as policy the agent reads every session, not tribal knowledge.
2. "Understate by default" rules for any AI-generated claim.
3. A human sign-off gate with named checks, so accountability stays human.
