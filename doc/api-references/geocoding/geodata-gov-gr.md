# Geodata.gov.gr

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geodata-gov-gr`
- Docs URL from category index: `https://geodata.gov.gr/en/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this shard:
  - `https://geodata.gov.gr/en/`
  - `https://geodata.gov.gr/`
  - `https://geodata.gov.gr/api/3`
  - `https://geodata.gov.gr/el/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- A fresh manual browser attempt against `https://geodata.gov.gr/en/` failed during navigation with `net::ERR_ABORTED` before any readable provider page loaded.
- A fresh manual browser attempt against `https://geodata.gov.gr/` also failed during navigation with `net::ERR_ABORTED` before any readable provider page loaded.
- A dedicated CDP-backed page-navigation check against `https://geodata.gov.gr/api/3` returned `net::ERR_CONNECTION_TIMED_OUT`.
- A dedicated CDP-backed page-navigation check against `https://geodata.gov.gr/el/` also returned `net::ERR_CONNECTION_TIMED_OUT`.
- Because the official domain did not produce a readable provider-controlled page in this shard pass, no live official base URL statement, endpoint inventory, methods, parameters, authentication guide, rate-limit policy, pagination contract, error model, response examples, or format notes could be inspected.

## Confirmed API surface
- Confirmed base URL: none
- Confirmed endpoint paths: none
- Confirmed HTTP methods: none
- Confirmed parameters: none
- Confirmed authentication contract: none
- Confirmed rate-limit policy: none
- Confirmed pagination model: none
- Confirmed error schema: none
- Confirmed response formats: none
- Confirmed route count: `0`

## Explicit blocker
- The indexed English page and three same-host alternatives failed before any readable official page loaded.
- Without a successfully loaded provider-controlled page, fireROUTE cannot safely confirm any current Geodata.gov.gr API contract details.
- Keep this provider at `manual_blocker_documented` until the official host becomes reachable again or a stable official route-level reference can be manually reviewed.

## Important usage notes
- Do not promote guessed CKAN-style conventions such as `/api/3` into canonical fireROUTE routes while the official host is not yielding readable documentation.
- Reattempt only when the official site becomes reachable again.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
