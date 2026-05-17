# Actinia Grass GIS

## Provider metadata
- Category: `Geocoding`
- Provider slug: `actinia-grass-gis`
- Docs URL from category index: `https://actinia.mundialis.de/api_docs/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://actinia.mundialis.de/api_docs/`
  - `https://actinia.mundialis.de/`
  - `https://actinia.mundialis.de/latest/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed docs URL `https://actinia.mundialis.de/api_docs/` failed browser navigation with `net::ERR_ABORTED` before any readable API reference rendered.
- The same-host alternative `https://actinia.mundialis.de/latest/` also failed browser navigation with `net::ERR_ABORTED` before any readable docs page rendered.
- The official root `https://actinia.mundialis.de/` did not expose an Actinia API/docs portal in this run. The browser landed on unrelated content at `https://spacex.land/api` with title `Page not found - SpaceX Land` and only unrelated navigation headings such as `Home`, `Launches`, `Rockets`, `Missions`, and `Ships`.
- Because none of the reviewed official entry points exposed a readable provider-controlled Actinia route reference, no current base URL, endpoint list, methods, parameters, auth model, pagination contract, rate limits, error schema, or response formats could be confirmed.

## Confirmed API surface
- Confirmed base URL: none browser-readable from the reviewed official pages
- Confirmed endpoint paths: none browser-readable from the reviewed official pages
- Confirmed HTTP methods: none browser-readable from the reviewed official pages
- Confirmed parameters: none browser-readable from the reviewed official pages
- Confirmed authentication contract: none browser-readable from the reviewed official pages
- Confirmed pagination model: none browser-readable from the reviewed official pages
- Confirmed rate-limit policy: none browser-readable from the reviewed official pages
- Confirmed error schema: none browser-readable from the reviewed official pages
- Confirmed response formats: none browser-readable from the reviewed official pages
- Confirmed route count: `0`

## Explicit blocker
- The indexed and same-host alternative docs URLs both aborted before rendering readable documentation.
- The official root resolved to unrelated third-party content instead of a provider-controlled API/docs surface.
- fireROUTE should keep this provider at `manual_blocker_documented` until `actinia.mundialis.de` again exposes readable official route-level documentation.

## Important usage notes
- Do not promote archived examples, stale mirrors, or unrelated redirected content into canonical fireROUTE routes.
- Reattempt this provider only if the official Actinia host again serves a readable developer/API surface.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
