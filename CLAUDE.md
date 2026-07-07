# CLAUDE.md — AI Transformation Studio

Personal credibility engine for Shibu Singh: portfolio, daily intelligence radar, scenario
lab, and LinkedIn pipeline. Positioning: change management and people advisory (6 years,
Deloitte/EY) extended into AI transformation and agentic AI adoption (EDHEC MBA, AI & Strategy).

## The operating rhythm

- **Daily:** `/daily-radar` — tailored brief into `content/radar/`. Read it in the site's Radar tab.
- **~3x per week:** `/scenario-lab` — turn one radar item into a worked scenario in `content/lab/`.
- **2x per week (Tue/Thu):** `/linkedin-drafts` — distill a lab note into a post in `content/linkedin/`.
- **Ongoing:** add sanitized case studies to `content/portfolio/` using `_TEMPLATE-case-study.md`.

## How the site works

Static, no build step. `index.html` + `assets/` render whatever `content/manifest.json` lists.
Every new content file MUST be registered in the manifest or it will not appear. Serve locally
with `python3 -m http.server` from the repo root; deployable to GitHub Pages unchanged.

## Guardrails

1. **NDA wall.** Nothing from the Amadeus/EDHEC study's client materials, data, or findings
   enters this repo. Methodology descriptions only, client anonymized until disclosure is
   confirmed in writing. Same rule for Deloitte and EY client work.
2. **No invented facts.** Every radar and lab claim carries a source link. Single-source
   claims are flagged before anything is published. Vendor claims labeled as vendor claims.
3. **Human gate on publishing.** Claude drafts; Shibu publishes. Never post anywhere on his behalf.
4. **Voice.** Plain language, practitioner tone, one uncomfortable truth per piece. No
   marketing filler, no throat-clearing openers, no hashtag walls.
5. **Manifest discipline.** Content file + manifest entry always change together.

## File map

```
index.html, assets/          the site (edit design here, never generated content into it)
content/manifest.json        single source of truth for what the site shows
content/radar/               daily briefs (YYYY-MM-DD.md)
content/lab/                 scenario notes (YYYY-MM-DD-slug.md)
content/portfolio/           case studies + _TEMPLATE-case-study.md
content/linkedin/            post drafts (target-date-slug.md)
.claude/skills/              daily-radar, scenario-lab, linkedin-drafts
```
