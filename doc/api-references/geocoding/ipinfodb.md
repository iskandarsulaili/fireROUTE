# IPInfoDB

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipinfodb`
- Docs URL from category index: `https://www.ipinfodb.com/api`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://www.ipinfodb.com/api`
  - `https://www.ipinfodb.com/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed `/api` page currently loads with browser title `Just a moment...` instead of a readable API reference.
- The visible page content on the indexed URL shows `www.ipinfodb.com` and `Performing security verification`.
- The official root `https://www.ipinfodb.com/` currently loads the same Cloudflare verification surface with title `Just a moment...`.
- The root also visibly says `This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.`
- Because both reviewed official entry points are challenge-gated instead of exposing readable docs, no current base URL, methods, parameters, authentication details, pagination notes, rate limits, error schema, or response-format details could be manually confirmed from the official site.

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
- The indexed official docs entry and the official root do not expose readable route documentation in this environment and instead sit behind Cloudflare security verification.
- No usable official fallback docs page was reachable from the provider-controlled host in this pass.
- fireROUTE should keep this provider at `manual_blocker_documented` until the official IPInfoDB site again exposes a browser-readable API reference.

## Important usage notes
- Do not promote stale mirrors, guessed paths, or third-party summaries into canonical fireROUTE routes while the official host remains challenge-gated.
- Reattempt this provider only when the official IPInfoDB site becomes manually inspectable again.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
