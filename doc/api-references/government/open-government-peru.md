# Open Government, Peru

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-peru`
- Assigned docs URL: `https://www.datosabiertos.gob.pe/`
- Official docs/pages reviewed in this run:
  - `https://www.datosabiertos.gob.pe/`
  - `https://www.datosabiertos.gob.pe/dataset`
  - `https://www.datosabiertos.gob.pe/api/3/action/package_search`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official Peru pages in this run
- Authentication model: not confirmable from a reachable official Peru documentation or API page in this run
- Response format: not confirmable from a reachable official Peru documentation or API page in this run
- Rate limits: not confirmable from the reviewed official Peru pages in this run
- Pagination: not confirmable from the reviewed official Peru pages in this run
- Error format: no provider-owned machine-readable API error schema could be confirmed from the reviewed official Peru pages in this run
- Manually confirmed route count: `0`

## What was confirmed from the official site
- The assigned official root `https://www.datosabiertos.gob.pe/` rendered only an HTML denial page titled `403 Forbidden`.
- The official catalogue path `https://www.datosabiertos.gob.pe/dataset` returned the same-host HTML denial page titled `403 Forbidden` with visible body text `403 Forbidden` and footer `nginx/1.28.1`.
- The official CKAN-style action route `https://www.datosabiertos.gob.pe/api/3/action/package_search` also returned the same-host HTML denial page titled `403 Forbidden` with visible body text `403 Forbidden` and footer `nginx/1.28.1`.
- Because the reviewed official root, catalogue path, and API action route never exposed a usable portal, dataset page, or developer reference, no live Peru-owned route inventory could be inspected further in this run.

## Why this remains blocked
- The official Peru open-data host is still not manually reviewable as a live API or catalogue surface in this browser environment.
- The assigned root, the catalogue path, and the same-host API candidate all exposed only same-host `403 Forbidden` responses instead of browsable portal or developer content.
- Without a reachable official dataset catalogue page, developer guide, OpenAPI artifact, or successful same-host endpoint response, no canonical base URL, route inventory, methods, parameters, auth contract, pagination model, rate-limit policy, or error schema can be verified safely for fireROUTE normalization.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable from the reviewed official Peru pages.
- Rate limits: no official quota or throttling guidance was reachable.
- Pagination: not confirmable because no official catalogue or successful API collection response was reachable.
- Errors: the only directly confirmed provider behavior in this run was the same-host HTML `403 Forbidden` response on `/`, `/dataset`, and `/api/3/action/package_search`.
- Format notes: no Peru-owned machine-readable response body was reachable; the inspected responses were denial/error pages.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until `datosabiertos.gob.pe` exposes a manually reviewable official portal or API page.
- Do not infer Peru routes from generic CKAN conventions alone while the official host remains blocked at the web-server layer.
- Reattempt this provider only after the official Peru host stops returning the same same-host `403 Forbidden` responses on root, catalogue, and API candidates.
