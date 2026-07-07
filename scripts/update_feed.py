"""Daily feed updater.

Pulls curated RSS/Atom feeds, keeps only items relevant to AI transformation /
agentic AI / change management, scores them, and writes content/feed.json.

Run locally:  python3 scripts/update_feed.py
Run in CI:    .github/workflows/daily.yml (daily cron)

Stdlib only — no dependencies.
"""
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

FEEDS = [
    ("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    ("VentureBeat AI", "https://venturebeat.com/feed/"),
    ("The Verge AI", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"),
    ("Wired AI", "https://www.wired.com/feed/tag/ai/latest/rss"),
    ("MIT Tech Review", "https://www.technologyreview.com/feed/"),
    ("Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"),
]
# NOTE: consultancy.eu / consultancy.uk RSS is bot-blocked (empty 200s); firm-watch
# coverage comes from the /daily-radar skill's web searches instead.

# Terms that make a story relevant to Shibu's positioning. Weight 2 for core, 1 for adjacent.
KEYWORDS = {
    "agentic": 2, "ai agent": 2, "ai agents": 2, "enterprise ai": 2, "ai adoption": 2,
    "ai transformation": 2, "change management": 2, "workforce": 2, "copilot": 2,
    "future of work": 2, "reskilling": 2, "operating model": 2, "ai governance": 2,
    "anthropic": 2, "claude": 2, "openai": 2, "gemini": 2, "layoff": 2, "layoffs": 2,
    "mckinsey": 2, "deloitte": 2, "accenture": 2, "bcg": 2, "bain": 2, "pwc": 2,
    "kpmg": 2, "consulting": 2, "eu ai act": 2, "ai act": 2, "trusted ai": 2,
    "responsible ai": 2, "iso 42001": 2, "framework": 1, "methodology": 1,
    "benchmark": 1, "compliance": 1, "regulation": 1, "transparency": 1, "audit": 1,
    "enterprise": 1, "adoption": 1, "agents": 1, "productivity": 1, "jobs": 1,
    "employees": 1, "rollout": 1, "deployment": 1, "governance": 1, "org design": 1,
    "hiring": 1, "automation": 1, "microsoft": 1, "google": 1, "chatgpt": 1,
}

MAX_ITEMS = 25
MAX_AGE_DAYS = 4
MIN_SCORE = 2

NS = {"atom": "http://www.w3.org/2005/Atom"}


UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")


def fetch(url, _depth=0):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    })
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read()
            if body[:2] == b"\x1f\x8b":  # gzip magic, in case a server ignores our headers
                import gzip
                body = gzip.decompress(body)
            if not body.strip():  # some CDNs serve empty bodies to non-browser TLS clients
                return fetch_curl(url)
            return body
    except urllib.error.HTTPError as e:
        # urllib does not follow 308; do it ourselves (bounded, relative-safe)
        if e.code == 308 and _depth < 3 and e.headers.get("Location"):
            from urllib.parse import urljoin
            return fetch(urljoin(url, e.headers["Location"]), _depth + 1)
        raise


def fetch_curl(url):
    import subprocess
    out = subprocess.run(
        ["curl", "-sL", "--max-time", "20", "-A", UA, url],
        capture_output=True, check=True,
    ).stdout
    if not out.strip():
        raise ValueError("empty response (urllib and curl)")
    return out


def text(el):
    return re.sub(r"<[^>]+>", " ", (el.text or "")).strip() if el is not None else ""


def parse_date(s):
    if not s:
        return None
    try:
        return parsedate_to_datetime(s)
    except Exception:
        pass
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None


def parse_feed(xml_bytes, source):
    root = ET.fromstring(xml_bytes)
    items = []
    # RSS 2.0
    for it in root.iter("item"):
        items.append({
            "title": text(it.find("title")),
            "link": text(it.find("link")) or (it.find("link").get("href") if it.find("link") is not None else ""),
            "summary": text(it.find("description"))[:400],
            "published": parse_date(text(it.find("pubDate"))),
            "source": source,
        })
    # Atom
    for it in root.iter("{http://www.w3.org/2005/Atom}entry"):
        link_el = it.find("atom:link[@rel='alternate']", NS) or it.find("atom:link", NS)
        items.append({
            "title": text(it.find("atom:title", NS)),
            "link": link_el.get("href") if link_el is not None else "",
            "summary": text(it.find("atom:summary", NS) or it.find("atom:content", NS))[:400],
            "published": parse_date(text(it.find("atom:updated", NS) or it.find("atom:published", NS))),
            "source": source,
        })
    return items


def score(item):
    hay_title = item["title"].lower()
    hay_body = item["summary"].lower()
    total, matched = 0, []
    for kw, w in KEYWORDS.items():
        in_title = kw in hay_title
        in_body = kw in hay_body
        if in_title or in_body:
            total += w * (2 if in_title else 1)
            matched.append(kw)
    return total, matched[:5]


def main():
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=MAX_AGE_DAYS)
    collected, errors = [], []

    for source, url in FEEDS:
        try:
            for item in parse_feed(fetch(url), source):
                if not item["title"] or not item["link"]:
                    continue
                pub = item["published"]
                if pub is None:
                    continue
                if pub.tzinfo is None:
                    pub = pub.replace(tzinfo=timezone.utc)
                if pub < cutoff:
                    continue
                s, matched = score(item)
                if s < MIN_SCORE:
                    continue
                collected.append({
                    "title": item["title"],
                    "link": item["link"],
                    "source": source,
                    "published": pub.isoformat(),
                    "score": s,
                    "matched": matched,
                })
        except Exception as e:
            errors.append(f"{source}: {type(e).__name__}: {e}")

    # Dedupe by title, rank by score then recency
    seen, unique = set(), []
    for it in sorted(collected, key=lambda x: (-x["score"], x["published"]), reverse=False):
        key = it["title"].lower()[:80]
        if key not in seen:
            seen.add(key)
            unique.append(it)
    unique.sort(key=lambda x: (-x["score"], x["published"]), reverse=False)
    top = sorted(unique, key=lambda x: -x["score"])[:MAX_ITEMS]
    top.sort(key=lambda x: x["published"], reverse=True)

    out = {
        "updated": now.isoformat(),
        "items": top,
        "errors": errors,
    }
    dest = Path(__file__).resolve().parent.parent / "content" / "feed.json"
    dest.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"wrote {len(top)} items to {dest}")
    if errors:
        print("feed errors (non-fatal):", *errors, sep="\n  ", file=sys.stderr)


if __name__ == "__main__":
    main()
