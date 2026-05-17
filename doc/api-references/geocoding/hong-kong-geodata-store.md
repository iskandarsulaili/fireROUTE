# Hong Kong GeoData Store

## Provider metadata
- Category: `Geocoding`
- Provider slug: `hong-kong-geodata-store`
- Docs URL from category index: `https://geodata.gov.hk/gs/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://geodata.gov.hk/gs/`
  - `https://geodata.gov.hk/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed docs path `https://geodata.gov.hk/gs/` currently fails browser navigation with `net::ERR_HTTP_RESPONSE_CODE_FAILURE`.
- The browser-visible error page for the indexed path says `This geodata.gov.hk page can’t be found` and `HTTP ERROR 404`.
- The official root `https://geodata.gov.hk/` currently renders only a plain server error page titled `503 Service Temporarily Unavailable`.
- Because the indexed docs path now resolves only to a 404 browser error shell and the official root serves a 503 page, no provider-controlled API reference was reachable for confirming base URL, endpoint paths, methods, parameters, authentication, pagination, rate limits, errors, or response formats.

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
- The indexed official docs URL no longer exposes a readable provider-controlled docs surface and now ends at a browser-visible `HTTP ERROR 404` page.
- The official root currently serves only `503 Service Temporarily Unavailable`.
- fireROUTE should keep this provider at `manual_blocker_documented` until the official Hong Kong GeoData host again exposes a stable readable API/docs surface.

## Important usage notes
- Do not promote stale mirrors, cached copies, or third-party summaries into canonical fireROUTE routes while the official host is unavailable.
- Reattempt this provider only when the official site again serves readable provider-controlled documentation.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
