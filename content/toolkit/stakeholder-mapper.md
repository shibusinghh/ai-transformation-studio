# Tool — Stakeholder Alignment Mapper

**What it does:** turns messy meeting notes, 1:1 summaries, and email threads into three artifacts: a stakeholder inventory (decision rights, influence, evidence-cited stance), an influence map (who moves whom — including the informal lines), and a sequenced pre-wire plan for winning the decision.

**The discipline:** no stance without a verbatim quote or observed behavior from the notes — stakeholders without evidence are marked UNKNOWN, probe first. Stated positions are separated from inferred interests, and inferences are labeled as inferences. Positions older than a month are flagged for re-validation.

**What makes the pre-wire plan real:** it sequences conversations (influencers of veto-holders before veto-holders; never a surprise for the decider), gives each conversation an objective, an opening question, the likely objection with a response, and the tell that it went badly. It ends with a decision-meeting entry condition: the support that must exist before the meeting is allowed to happen.

**Honesty rule:** if the notes reveal that the real blocker is the sponsor, the tool says so. That finding is the deliverable.

**How to run:** open Claude Code in this repo, paste your notes, and say "map the stakeholders for [decision]". A deliberately messy sample input ships with the skill (`.claude/skills/stakeholder-mapper/samples/`) — a Copilot steering committee with a impatient sponsor, a risk chief with kill authority, a silent ops director, and an unanswered works council letter.
