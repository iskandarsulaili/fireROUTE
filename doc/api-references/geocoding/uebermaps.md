# Uebermaps

## Provider metadata
- Category: `Geocoding`
- Provider slug: `uebermaps`
- Docs URL from category index: `https://uebermaps.com/api/v2`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://uebermaps.com/api/v2`
  - `https://uebermaps.com/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed API URL `https://uebermaps.com/api/v2` currently loads a provider-controlled shutdown page with browser title `uebermaps - service shutdown by 31th july 2023`.
- The visible headline on that page says `Goodbye 😘 uebermaps by 31th of July 2023!`.
- The same shutdown page is also served from the official root `https://uebermaps.com/`.
- The live page thanks users for their support and exposes only a contact action (`Contact, for further information`); it does not publish any surviving API base URL, route list, auth instructions, pagination rules, rate limits, error schema, or response-format reference.

## Confirmed API surface
- Confirmed base URL: none currently published on the official site
- Confirmed endpoint paths: none currently published on the official site
- Confirmed HTTP methods: none currently published on the official site
- Confirmed parameters: none currently published on the official site
- Confirmed authentication contract: none currently published on the official site
- Confirmed pagination model: none currently published on the official site
- Confirmed rate-limit policy: none currently published on the official site
- Confirmed error schema: none currently published on the official site
- Confirmed response formats: none currently published on the official site
- Confirmed route count: `0`

## Explicit blocker
- The official domain now serves a service-shutdown notice instead of API documentation.
- No alternative official docs surface was exposed on the reviewed provider-controlled pages.
- fireROUTE should keep this provider at `manual_blocker_documented` unless Uebermaps relaunches and republishes an official route reference.

## Important usage notes
- Treat the shutdown page as authoritative evidence that the old API should not be documented as live.
- Do not rely on archived historical docs as canonical live routes.
- Reattempt this provider only if the official domain again publishes a current API surface.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
