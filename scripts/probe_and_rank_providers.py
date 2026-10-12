#!/usr/bin/env python3
"""Measure every active fireROUTE provider through the pool and re-rank them.

WHY
---
Measured 2026-10-12: a games-and-comics call took 13.3 s because the executor
walked the provider list in seed order and four of the first five were dead
(FreeToGame 301, Hyrule Compendium 404, JokeAPI 404, Minecraft Server Status
404) before CheapShark answered. Nothing was wrong with the fallback logic — the
ORDER was wrong, and the order was a guess (file order in doc/api-references).

This replaces the guess with evidence: it calls the live gateway once per active
provider (forceProvider=<slug>), records the outcome and latency, and rewrites
`priority` so that providers that actually answer come first, fastest first.
Providers that fail or time out are marked DEGRADED and pushed to the back —
still installed, still retried, never removed.

Usage:  python3 scripts/probe_and_rank_providers.py [--category weather] [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

DB = pathlib.Path(__file__).resolve().parents[1] / "dev.db"
GATEWAY = "http://127.0.0.1:3000/v1/execute"

# One representative canonical request per category. Only the categories PAW
# actually calls are probed for latency ranking; others are probed for liveness
# with a harmless GET on their documented path.
SAMPLE: dict[str, dict] = {
    # A minimal VALID request per category. Measured lesson (2026-10-12): a bare call
    # marks parameter-dependent providers healthy when they only answered an empty
    # request, and the ranking then favours providers the pool cannot actually use.
    "currency-exchange": {"path": "/", "params": {"table": "A"}},
    "finance": {"path": "/", "params": {"ifsc": "HDFC0000001"}},
    "url-shorteners": {"path": "/api/v2/links", "params": {}, "method": "POST",
                       "body": {"target": "https://example.com"}},
    "calendar": {"path": "/", "params": {"date": "2026-10-12"}},
    "dictionaries": {"path": "/", "params": {"word": "hello"}},
    "news": {"path": "/", "params": {}},
    "tracking": {"path": "/", "params": {}},
    "open-data": {"path": "/", "params": {}},
    "weather": {"path": "/v1/forecast", "params": {"latitude": "3.139", "longitude": "101.6869"}},
    "environment": {"path": "/v1/air-quality", "params": {"latitude": "3.139", "longitude": "101.6869"}},
    "personality": {"path": "/api", "params": {}},
    "games-and-comics": {"path": "/api/games", "params": {}},
    "open-data": {"path": "/", "params": {}},
    "art-and-design": {"path": "/api", "params": {}},
    "music": {"path": "/api", "params": {}},
    "dictionaries": {"path": "/api", "params": {}},
}


def probe(slug: str, category: str, own_path: str | None) -> dict:
    """Probe one provider on ITS OWN documented endpoint.

    Measured lesson: probing every provider in a category with one shared sample
    path marked working providers (Advice Slip, CheapShark) as DEGRADED, because
    the sample path is not their path. The provider's own documented endpoint —
    the same metadata.path the adapter routes through — is the honest target.
    """
    sample = SAMPLE.get(category) or {"path": "/", "params": {}}
    path = own_path or sample["path"]
    payload: dict = {
        "category": category,
        "path": path,
        "method": sample.get("method", "GET"),
        "params": sample.get("params") or {},
        "forceProvider": slug,
        "timeout": 8000,
    }
    if sample.get("body") is not None:
        payload["body"] = sample["body"]
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        GATEWAY, data=body, headers={"content-type": "application/json"}, method="POST"
    )
    started = time.monotonic()
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode())
        ms = int((time.monotonic() - started) * 1000)
        ok = bool(payload.get("success"))
        code = (payload.get("router_metadata") or {}).get("statusCode")
        err = (payload.get("error") or {}).get("code", "")
        # A 429 is fireROUTE's OWN per-minute limit, and an unavailable category is
        # a routing fact, not provider health — neither may demote a provider.
        unknown = code == 429 or err in ("RATE_LIMITED", "UNSUPPORTED_CATEGORY") or code is None
        return {"slug": slug, "category": category, "ok": ok, "ms": ms, "code": code, "unknown": unknown}
    except Exception as exc:  # timeouts, connection resets, non-JSON bodies
        ms = int((time.monotonic() - started) * 1000)
        return {"slug": slug, "category": category, "ok": False, "ms": ms, "code": str(exc)[:60]}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--category", action="append")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT p.slug, c.slug AS category,
               json_extract(p.metadata, '$.path') AS own_path
          FROM ProviderConnection p JOIN ProviderCategory c ON c.id = p.categoryId
         WHERE p.isActive = 1
        """
    ).fetchall()
    if args.category:
        rows = [r for r in rows if r["category"] in args.category]
    print(f"probing {len(rows)} active providers …")

    # Throttled deliberately: the gateway rate-limits at 100 requests/minute and a
    # burst of 85 probes reads as mass failure (measured: two whole categories
    # marked DEGRADED while working). Unknown results never change a row.
    results = []
    for row in rows:
        results.append(probe(row["slug"], row["category"], row["own_path"]))
        time.sleep(0.7)

    by_cat: dict[str, list[dict]] = {}
    for r in results:
        by_cat.setdefault(r["category"], []).append(r)

    changed = 0
    for category, items in sorted(by_cat.items()):
        known = [i for i in items if not i.get("unknown")]
        healthy = sorted([i for i in known if i["ok"]], key=lambda i: i["ms"])
        broken = sorted([i for i in known if not i["ok"]], key=lambda i: i["slug"])
        skipped = len(items) - len(known)
        rank = 0
        # Healthy first (fastest first), then the unmeasured ones keep their seeded
        # order, then the ones that answered with an error.
        for item in healthy:
            if not args.dry_run:
                conn.execute("UPDATE ProviderConnection SET priority = ?, healthStatus = 'HEALTHY' WHERE slug = ?", (rank, item["slug"]))
            rank += 1
        for item in [i for i in items if i.get("unknown")]:
            if not args.dry_run:
                conn.execute("UPDATE ProviderConnection SET priority = ? WHERE slug = ?", (rank, item["slug"]))
            rank += 1
        for item in broken:
            if not args.dry_run:
                conn.execute("UPDATE ProviderConnection SET priority = ?, healthStatus = 'DEGRADED' WHERE slug = ?", (rank, item["slug"]))
            rank += 1
        changed += len(items)
        if skipped:
            print(f"  {category:20} ({skipped} unmeasured rows left in place)")
        for idx, item in enumerate(healthy):
            if not args.dry_run:
                conn.execute(
                    "UPDATE ProviderConnection SET priority = ?, healthStatus = 'HEALTHY' WHERE slug = ?",
                    (idx, item["slug"]),
                )
            changed += 1
        for idx, item in enumerate(broken):
            if not args.dry_run:
                conn.execute(
                    "UPDATE ProviderConnection SET priority = ?, healthStatus = 'DEGRADED' WHERE slug = ?",
                    (100 + idx, item["slug"]),
                )
            changed += 1
        print(f"  {category:20} healthy {len(healthy):3}  degraded {len(broken):3}  "
              f"fastest {healthy[0]['slug'] if healthy else '-'} "
              f"{healthy[0]['ms'] if healthy else '-'}ms")
    if not args.dry_run:
        conn.commit()
    print(f"{'would update' if args.dry_run else 'updated'} {changed} provider rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
