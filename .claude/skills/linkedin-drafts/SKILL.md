---
name: linkedin-drafts
description: Turn a lab note into a LinkedIn post draft and queue it. Use when the user says "draft the post", "linkedin this", or after a scenario-lab run flags a LinkedIn candidate. Target cadence is two posts per week.
---

# LinkedIn Drafts

Write post drafts to `content/linkedin/YYYY-MM-DD-<slug>.md` (date = target publish date).

## Voice rules (non-negotiable)

- First person, practitioner voice: six years of change management at Deloitte and EY, now
  building with AI agents. He has done the work; the posts should sound like it.
- Open with the concrete event or number, never with "In today's fast-paced world" or any
  throat-clearing. No hashtag walls (0-3 max). No emojis unless the user asks.
- One idea per post. 150-280 words. Short paragraphs, numbered lists where mechanisms are listed.
- Every post lands one uncomfortable truth and ends with a genuine question or a crisp take,
  not "Thoughts?"
- Facts must trace to the lab note's sources. Single-source claims: soften or verify first.
- Never reference NDA client work in identifiable terms.

## File format

Header block: status (draft/ready/published), target publish date, source lab note.
Then the post text between `---` markers. Then a **Notes** line: what to verify on publish
day, and a reminder to run the `linkedin-post-formatter` skill (if installed) for final
Unicode formatting.

## Cadence logic

Check the manifest before writing: if two posts already have target dates this week, propose
next week's slots instead. Tuesday and Thursday are the default slots.

## After writing

Update `content/manifest.json` under `linkedin` (`status: "draft"`). When the user says a post
went live, flip it to `published` and add the post URL to the file header.
