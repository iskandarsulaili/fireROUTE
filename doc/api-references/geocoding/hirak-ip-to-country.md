# Hirak IP to Country

## Provider metadata
- Category: `Geocoding`
- Provider slug: `hirak-ip-to-country`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://iplocation.hirak.site/`
  - `https://hirak.site/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed official page `https://iplocation.hirak.site/` no longer exposes a provider-controlled API or docs surface.
- In this run it redirected away from the requested HTTPS URL to `http://ww1.hirak.site/`.
- After that redirect, the loaded page was a parked domain page with visible text including `hirak.site` and `Related Searches`, not an API reference.
- The official root `https://hirak.site/` behaved the same way, also redirecting to `http://ww1.hirak.site/` and exposing the same parked-domain content instead of a developer surface.
- Because neither official entry point now exposes a trustworthy API reference, I could not confirm a canonical base URL, route list, methods, parameters, authentication rules, pagination behavior, rate limits, error schema, or response format from live official pages.

## Confirmed API surface
- Confirmed base URL: none
- Confirmed endpoint paths: none
- Confirmed HTTP methods: none
- Confirmed parameters: none
- Confirmed authentication contract: none
- Confirmed pagination model: none
- Confirmed rate-limit policy: none
- Confirmed error schema: none
- Confirmed response formats: none
- Confirmed route count: `0`

## Explicit blocker
- Both reviewed Hirak-controlled entry points now redirect to `http://ww1.hirak.site/` and no longer expose a provider-controlled API/docs surface.
- The redirected page content in this run was clearly parked-domain search content rather than documentation.
- fireROUTE should keep this provider at `manual_blocker_documented` until a current Hirak-controlled domain again publishes browsable route-level documentation.

## Important usage notes
- Do not reconstruct this provider from stale mirrors, cached snippets, or third-party summaries while the official pages redirect into parked-domain content.
- Reattempt only when the official Hirak domain again exposes a stable developer surface.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
