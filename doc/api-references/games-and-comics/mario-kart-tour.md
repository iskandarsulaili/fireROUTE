# Mario Kart Tour

## Overview
- Provider: `Mario Kart Tour`
- Category: `Games & Comics`
- Official docs URL: `https://mario-kart-tour-api.herokuapp.com/`
- Official pages inspected manually in this execution:
  - `https://mario-kart-tour-api.herokuapp.com/`
  - `https://mario-kart-tour-api.herokuapp.com/docs`
- Manual status: `manual_blocked`
- Confirmed route count: `0`

## What the official site showed
- `https://mario-kart-tour-api.herokuapp.com/` stayed on the same URL and loaded with title `No such app`.
- `https://mario-kart-tour-api.herokuapp.com/docs` also stayed on the same URL and loaded with title `No such app`.
- On both inspected pages, `document.contentType` was HTML and the body was only an iframe wrapper pointing to `//www.herokucdn.com/error-pages/no-such-app.html`.
- No provider-authored API homepage, route list, authentication guide, parameter reference, pagination notes, rate-limit policy, error model, or example payloads were visible on the official host.

## Confirmed integration details
- Stable official API base URL: not publicly confirmable from the current official host.
- Endpoint paths manually tested:
  - `/`
  - `/docs`
- Methods confirmed in this execution:
  - anonymous browser `GET` requests to the listed public URLs
- Parameters: not publicly confirmable from the current official host.
- Authentication: not publicly confirmable from the current official host.
- Rate limits: not publicly confirmable from the current official host.
- Pagination: not publicly confirmable from the current official host.
- Errors and failure behavior confirmed manually:
  - `/` -> inactive Heroku app page titled `No such app`
  - `/docs` -> inactive Heroku app page titled `No such app`
- Format notes: the only reachable output was host-level error HTML, not a trustworthy Mario Kart Tour API contract.
- Important usage notes:
  - the assigned official hostname does not currently expose a live Mario Kart Tour API or documentation surface
  - fireROUTE should not infer routes from historical mirrors, cached examples, or third-party summaries while the current first-party host exposes no verifiable contract

## Why this remains blocked for fireROUTE
- fireROUTE needs a provider-controlled API base URL or documentation page with verifiable route details.
- Both reviewed official URLs resolved only to Heroku's inactive-app error surface.
- Without a current first-party contract, fireROUTE cannot safely confirm routes, methods, parameters, auth requirements, rate limits, pagination behavior, errors, or response formats.

## fireROUTE integration note
- Keep this provider in `manual_blocked` state until the provider restores a working official API/docs host or publishes another current first-party route reference.
- Keep the confirmed route count at `0` until endpoint details are publicly visible and verifiable from official sources.

## Sources inspected
- `https://mario-kart-tour-api.herokuapp.com/`
- `https://mario-kart-tour-api.herokuapp.com/docs`
