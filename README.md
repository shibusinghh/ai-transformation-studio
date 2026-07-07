# AI Transformation Studio

Personal portfolio + daily AI intelligence system. Built and operated with Claude Code.

**Today** — interactive dashboard: live pulse (auto-updated daily), stat tiles, 7-day volume chart, publishing pipeline.
**Radar** — tailored daily analysis brief on agentic AI, enterprise adoption, and the consulting market.
**Scenario Lab** — one radar signal per session, worked into a change-management scenario.
**Portfolio** — sanitized case studies from transformation engagements.
**LinkedIn Queue** — two drafts a week, distilled from lab notes.

## How it updates daily

Two layers:

1. **Live pulse (automatic).** `scripts/update_feed.py` pulls curated RSS feeds
   (TechCrunch AI, VentureBeat, The Verge, Wired, MIT Tech Review, Ars Technica),
   keeps only stories matching the AI-transformation/change-management keyword set,
   scores them, and writes `content/feed.json`. The GitHub Action in
   `.github/workflows/daily.yml` runs it every morning (05:30 UTC) and commits the
   result — once the repo is on GitHub with Pages enabled, the site refreshes itself
   with zero manual work. Run it locally anytime: `python3 scripts/update_feed.py`.
2. **Analysis layer (you + Claude).** `/daily-radar` writes the daily brief,
   `/scenario-lab` and `/linkedin-drafts` build on it. The dashboard nudges you when
   today's brief is missing.

## Run locally

```bash
cd ai-transformation-studio
python3 serve.py
# open http://localhost:4173
```

## Daily use (in Claude Code, from this folder)

```
/daily-radar        # morning brief
/scenario-lab       # work one item into a scenario
/linkedin-drafts    # queue a post (Tue/Thu cadence)
```

## Deploy

Push to GitHub, enable Pages on the main branch (Settings → Pages → Deploy from branch).
No build step needed. The daily workflow needs no secrets — it uses the default
`GITHUB_TOKEN` with `contents: write`.
