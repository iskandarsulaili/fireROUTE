# Airtel IP

## Provider metadata
- Category: `Geocoding`
- Provider slug: `airtel-ip`
- Docs URL from category index: `https://sys.airtel.lv/ip2country/1.1.1.1/?full=true`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://sys.airtel.lv/ip2country/1.1.1.1/?full=true`
  - `https://sys.airtel.lv/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed sample endpoint currently loads with browser title `Just a moment...` instead of API output.
- Its visible content is a Cloudflare interstitial headed `sys.airtel.lv` and `Performing security verification`.
- The sample page also displays the anti-bot message `This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.` and embeds a `Widget containing a Cloudflare security challenge` iframe.
- The official root `https://sys.airtel.lv/` currently shows the same Cloudflare verification surface rather than a provider-controlled docs or API landing page.
- Because both reviewed official entry points are challenge-gated, no current base URL statement, route list, methods, parameters, auth rules, pagination notes, rate limits, errors, or response-format details could be manually confirmed from an official readable source.

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
- The official Airtel host is currently hidden behind a Cloudflare security-verification interstitial on both the indexed sample URL and the official root.
- No readable official alternative page was exposed on the reviewed provider-controlled host in this pass.
- fireROUTE should keep this provider at `manual_blocker_documented` until the official host exposes manually inspectable route-level documentation or endpoint output.

## Important usage notes
- Do not infer a canonical API contract from the sample URL shape alone while the official host is challenge-gated.
- Do not promote stale third-party references or guessed `ip2country` behavior into canonical fireROUTE routes.
- Reattempt this provider only when the official Airtel pages become browser-readable in the configured manual-review environment.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
