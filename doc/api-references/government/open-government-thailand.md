# Open Government, Thailand

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-thailand`
- Assigned docs URL: `https://data.go.th/`
- Official docs/pages reviewed in this run:
  - `https://data.go.th/`
  - `https://data.go.th/en`
  - `https://data.go.th/api/3/action/package_search`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official Thailand URLs in this run
- Authentication model: not confirmable from reachable official Thailand documentation in this run
- Response format: not confirmable from reachable official Thailand documentation in this run
- Rate limits: not confirmable from the reviewed official Thailand pages in this run
- Pagination: not confirmable from the reviewed official Thailand pages in this run
- Error format: no provider-owned API error schema was confirmed from the reviewed official Thailand pages in this run
- Manually confirmed canonical route count: `0`

## What was confirmed from the official site
- The assigned official root `https://data.go.th/` rendered an official `Access Denied` page instead of a browsable portal or API reference.
- A direct inspection of that root denial page confirmed the message `Your request has been blocked by our security systems.` plus diagnostic `Ray ID: 9fd17d96bc0efc5d` and visible IP field `175.143.58.84`.
- The official English variant `https://data.go.th/en` also returned the same `Access Denied` page title and the same denial message, with diagnostic `Ray ID: 9fd17f3469e3c7bd`.
- The official CKAN-style action-route candidate `https://data.go.th/api/3/action/package_search` also returned the same blocked official surface instead of a live machine-readable response, with diagnostic `Ray ID: 9fd1843b79fdc7bd`.
- Because the reviewed official root, English alternative, and same-host API candidate all stopped at the same provider security layer, no live Thailand-owned dataset catalogue, developer guide, or machine-readable route inventory could be inspected in this run.

## Why this remains blocked
- The official Thailand open-data portal is actively blocking the configured browser on both human-facing and same-host API paths.
- Since no reviewed official path exposed stable developer documentation or a live inspectable API response, no canonical base URL, endpoint inventory, methods, parameters, authentication flow, pagination behavior, rate-limit policy, error schema, or response format can be confirmed safely for fireROUTE normalization.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable from the reviewed official Thailand pages.
- Rate limits: not confirmable from the reviewed official Thailand pages.
- Pagination: not confirmable from the reviewed official Thailand pages.
- Errors: the only directly confirmed provider behavior in this run was the official `Access Denied` security page shown across the reviewed root, English, and same-host API-candidate URLs.
- Format notes: no official Thailand machine-readable response body or media type could be verified because the reviewed official URLs never progressed past the denial page.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until `data.go.th` exposes a manually reviewable official portal or API page in this environment.
- Do not normalize Thailand fireROUTE routes from generic CKAN assumptions, stale summaries, or third-party mirrors while the official host remains blocked.
- Reattempt this provider only after the official Thailand host stops returning the same provider security page across both portal and same-host API candidates.
