# SpotSense

## Provider metadata
- Category: `Geocoding`
- Provider slug: `spotsense`
- Docs URL from category index: `https://spotsense.io/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://spotsense.io/`
  - `https://www.spotsense.io/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- Navigation to `https://spotsense.io/` currently fails with `net::ERR_NAME_NOT_RESOLVED`.
- Chromium's visible error page for the bare domain says `This site can’t be reached` and `ERR_NAME_NOT_RESOLVED`.
- Navigation to `https://www.spotsense.io/` also currently fails with `net::ERR_NAME_NOT_RESOLVED`.
- Chromium's error page for the `www` host says `This site can’t be reached`, `www.spotsense.io’s server IP address could not be found`, and `ERR_NAME_NOT_RESOLVED`.
- Because neither official hostname resolves in this browser environment, no provider-controlled website, docs page, or API landing surface was reachable for confirming routes, auth, parameters, rate limits, pagination, errors, or response formats.

## Confirmed API surface
- Confirmed base URL: none currently reachable
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
- Both official SpotSense hostnames currently fail DNS resolution with `net::ERR_NAME_NOT_RESOLVED`.
- No usable official alternative page was reachable from the provider-controlled domains in this run.
- fireROUTE should keep this provider at `manual_blocker_documented` until the official SpotSense domain resolves again and exposes a browsable API/docs surface.

## Important usage notes
- Do not replace this blocker with stale mirrors, cached pages, or third-party summaries.
- Reattempt this provider only when the official SpotSense domain becomes resolvable again.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
