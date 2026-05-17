# Open Government, Saudi Arabia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-saudi-arabia`
- Assigned docs URL: `https://data.gov.sa`
- Official docs/pages reviewed in this run:
  - `https://data.gov.sa/`
  - `https://api.data.gov.sa/`
  - `https://api.data.gov.sa/about-en`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official Saudi pages in this run
- Authentication model: not confirmable from a reachable official Saudi documentation or API page in this run
- Response format: not confirmable from a reachable official Saudi documentation or API page in this run
- Rate limits: not confirmable from the reviewed official Saudi pages in this run
- Pagination: not confirmable from the reviewed official Saudi pages in this run
- Error format: no provider-owned API error schema could be confirmed from the reviewed official Saudi pages in this run
- Manually confirmed route count: `0`

## What was confirmed from the official site
- Direct navigation to the assigned official portal `https://data.gov.sa/` timed out at `Page.navigate` before any stable official page rendered.
- The reviewed official API-host root `https://api.data.gov.sa/` returned `net::ERR_CONNECTION_TIMED_OUT` and rendered a browser error page stating `api.data.gov.sa took too long to respond`.
- The reviewed official English information page `https://api.data.gov.sa/about-en` also timed out at `Page.navigate` before any stable official page or response body became inspectable.
- Because the reviewed official Saudi pages never produced a stable portal page, API console, or machine-readable endpoint response, no route-level Saudi contract could be extracted in this run.

## Why this remains blocked
- The assigned Saudi portal and API host are still not stably reviewable in this browser environment.
- The main portal timed out, the API root timed out at the network layer, and the reviewed English information page likewise did not render inspectable official content.
- Without a reachable official page or successful official endpoint response, no canonical base URL, endpoint inventory, methods, parameters, authentication flow, pagination behavior, rate-limit policy, error schema, or response format can be verified safely for fireROUTE normalization.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable from the reviewed official Saudi pages.
- Rate limits: not confirmable from the reviewed official Saudi pages.
- Pagination: not confirmable from the reviewed official Saudi pages.
- Errors: the only directly confirmed behaviors in this run were `Page.navigate` timeouts on `https://data.gov.sa/` and `https://api.data.gov.sa/about-en`, plus `net::ERR_CONNECTION_TIMED_OUT` on `https://api.data.gov.sa/`.
- Format notes: no official Saudi response envelope or media type could be verified from a successful page or API response in this run.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until `data.gov.sa` or `api.data.gov.sa` becomes manually reviewable with stable official documentation.
- Do not infer fireROUTE routes from generic portal assumptions, third-party mirrors, or stale summaries while the official Saudi pages remain unreachable.
- Reattempt this provider only after the official Saudi hosts stop timing out and expose inspectable documentation or successful official API responses.
