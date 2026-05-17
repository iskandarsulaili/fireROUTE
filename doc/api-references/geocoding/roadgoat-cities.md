# RoadGoat Cities

## Provider metadata
- Category: `Geocoding`
- Provider slug: `roadgoat-cities`
- Docs URL from category index: `https://www.roadgoat.com/business/cities-api`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://www.roadgoat.com/business/cities-api`
  - `https://roadgoat.com/`
  - `http://www.roadgoat.com/business/cities-api`
- Transport attempted on reviewed pages: `HTTP`, `HTTPS`

## What the official pages currently show
- The indexed business page `https://www.roadgoat.com/business/cities-api` currently fails browser navigation with `net::ERR_CERT_COMMON_NAME_INVALID`.
- Chromium's visible error page for the indexed business page says `Your connection is not private` and shows `NET::ERR_CERT_COMMON_NAME_INVALID`.
- The official root `https://roadgoat.com/` also currently fails browser navigation with the same `net::ERR_CERT_COMMON_NAME_INVALID` certificate error.
- The HTTP business-page variant `http://www.roadgoat.com/business/cities-api` also ends in the same certificate failure instead of exposing a readable fallback docs page.
- Because all reviewed official entry points stop at certificate failure, no current provider-controlled route reference was reachable for confirming base URL, endpoints, methods, parameters, auth, pagination, rate limits, errors, or response formats.

## Confirmed API surface
- Confirmed base URL: none browser-readable in this run
- Confirmed endpoint paths: none browser-readable in this run
- Confirmed HTTP methods: none browser-readable in this run
- Confirmed parameters: none browser-readable in this run
- Confirmed authentication contract: none browser-readable in this run
- Confirmed pagination model: none browser-readable in this run
- Confirmed rate-limit policy: none browser-readable in this run
- Confirmed error schema: none browser-readable in this run
- Confirmed response formats: none browser-readable in this run
- Confirmed route count: `0`

## Explicit blocker
- All reviewed official RoadGoat entry points currently fail at the browser certificate layer with `net::ERR_CERT_COMMON_NAME_INVALID`.
- No readable official alternative page was exposed after trying both HTTPS and HTTP variants.
- fireROUTE should keep this provider at `manual_blocker_documented` until RoadGoat again exposes a readable official API/docs surface.

## Important usage notes
- Do not promote stale snippets, cached product pages, or third-party descriptions into canonical fireROUTE routes while the official host is unreadable.
- Reattempt this provider only when the official RoadGoat host presents a readable provider-controlled API/docs page.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
