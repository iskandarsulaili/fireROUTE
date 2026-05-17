# CitySDK

## Provider metadata
- Category: `Geocoding`
- Provider slug: `citysdk`
- Docs URL from category index: `http://www.citysdk.eu/citysdk-toolkit/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `http://www.citysdk.eu/citysdk-toolkit/`
  - `https://www.citysdk.eu/tourism/`
- Transport attempted on reviewed pages: `HTTP`, `HTTPS`

## What the official pages currently show
- The indexed toolkit URL did not resolve into a readable route reference in this browser run and failed before any stable provider docs content could be inspected.
- The official `https://www.citysdk.eu/tourism/` page is live, but it currently renders an editorial `Smart Tourism: Transforming Travel with Open Data` page rather than an API reference.
- That tourism page describes a historical project and says `The main output of the Tourism pilot is the final API ... once deployed`, which is descriptive project copy rather than a current route contract.
- The same page footer now promotes `casino reviews`, `ratings`, `bonuses`, and `gambling guides`, confirming the current domain content is not a maintained API documentation surface.
- No current base URL, endpoint list, method table, auth contract, pagination model, rate-limit policy, error schema, or response-format reference was published on the reviewed official pages.

## Confirmed API surface
- Confirmed base URL: none currently documented on readable official pages in this run
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
- The indexed toolkit URL no longer exposed a readable CitySDK route reference in this browser run.
- The official alternative tourism page is now a repurposed editorial page about a historical pilot, not a current API documentation surface.
- fireROUTE should keep this provider at `manual_blocker_documented` until the provider again publishes a current route-level API reference on an official CitySDK-controlled page.

## Important usage notes
- Do not convert the tourism page's historical narrative about a `final API` into canonical routes.
- Do not use republished or third-party summaries as substitutes while current official route docs are absent.
- Reattempt this provider only if a current official CitySDK API reference resurfaces.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
