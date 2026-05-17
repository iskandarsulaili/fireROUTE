# Hytale

## Overview
- Provider: `Hytale`
- Category: `Games & Comics`
- Official docs URL from index: `https://hytale-api.com/`
- Official pages inspected in this pass:
  - `https://hytale-api.com/`
  - `https://hytale-api.com/docs/`
  - `https://hytale-api.com/api/`
- Preferred API base URL: not verifiable from current official-host behavior
- Manual review outcome: `manual_blocked`
- Confirmed route count: `0`
- Authentication: not verifiable from current official-host behavior
- Pagination: not verifiable from current official-host behavior
- Rate limits: not verifiable from current official-host behavior
- Response format notes: not verifiable from current official-host behavior

## Verified findings
- Manual CDP browser inspection of `https://hytale-api.com/` returned navigation error `net::ERR_TOO_MANY_REDIRECTS`.
- After the failed navigation, the browser landed on `chrome-error://chromewebdata/`.
- The browser error-page title was `hytale-api.com`.
- The visible error-page text included `This page isn’t working`, `hytale-api.com redirected you too many times.`, and `ERR_TOO_MANY_REDIRECTS`.
- Manual CDP browser inspection of `https://hytale-api.com/docs/` returned the same `net::ERR_TOO_MANY_REDIRECTS` result with the same error-page text.
- Manual CDP browser inspection of `https://hytale-api.com/api/` also returned the same `net::ERR_TOO_MANY_REDIRECTS` result with the same error-page text.
- None of the inspected official-host entry points exposed a route inventory, method list, parameter definitions, auth instructions, pagination rules, rate limits, error schema, or example responses for a current Hytale API contract.

## Confirmed browser results
| Method | URL | Result | Notes |
|---|---|---|---|
| GET | `https://hytale-api.com/` | official host unusable in this pass | Navigation returned `net::ERR_TOO_MANY_REDIRECTS`; visible error page said `This page isn’t working` and `hytale-api.com redirected you too many times.` |
| GET | `https://hytale-api.com/docs/` | docs path unusable in this pass | Navigation returned `net::ERR_TOO_MANY_REDIRECTS`; no route documentation became available. |
| GET | `https://hytale-api.com/api/` | API path unusable in this pass | Navigation returned `net::ERR_TOO_MANY_REDIRECTS`; no route documentation became available. |

## Gaps that could not be verified
- Canonical production API base URL
- Supported endpoint paths
- HTTP methods
- Path parameters
- Query parameters
- Request-body requirements
- Authentication model
- Numeric rate limits or quotas
- Pagination behavior
- Error schema for intended API operations
- Successful response schemas or payload examples
- Important provider usage notes

## Explicit blocker for fireROUTE
- The indexed official host is currently stuck in a redirect loop.
- The inspected same-host docs and API paths are also stuck in redirect loops.
- No reachable official docs page, route index, or live official API response was available during this manual browser pass.
- Without a reachable provider-controlled docs page or official API surface, fireROUTE cannot safely confirm routes, methods, parameters, auth, pagination, errors, format notes, or a route count above zero.

## Integration notes for fireROUTE
- Keep this provider in `manual_blocked` state until `hytale-api.com` again exposes a reachable provider-controlled docs or API surface for Hytale itself.
- Do not reconstruct the contract from mirrors, cached examples, or community summaries while the official host remains non-verifiable.

## Sources inspected
- `https://hytale-api.com/`
- `https://hytale-api.com/docs/`
- `https://hytale-api.com/api/`
