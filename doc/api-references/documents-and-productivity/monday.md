# Monday

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `monday`
- Official docs/pages reviewed manually:
  - `https://developer.monday.com/api-reference/docs/basics`
  - `https://developer.monday.com/api-reference/docs/getting-started`
  - `https://developer.monday.com/api-reference/docs/authentication`
  - `https://developer.monday.com/api-reference/docs/api-versioning`
  - `https://developer.monday.com/api-reference/docs/rate-limits`
  - `https://developer.monday.com/api-reference/docs/error-handling`
  - `https://developer.monday.com/api-reference/docs/files`
- Confirmed API style: GraphQL over HTTP plus a separate multipart file-upload endpoint
- Confirmed API base URL: `https://api.monday.com/v2`
- Confirmed upload endpoint: `https://api.monday.com/v2/file`
- Manually confirmed route count: `2`
- Route-method breakdown:
  - `2` `POST`

## What the official docs confirm
- monday.com's platform API is primarily a GraphQL API exposed through a single HTTP endpoint.
- Request bodies for the main API use a JSON envelope with `query` and optional `variables`.
- File uploads use a separate `multipart/form-data` endpoint.
- The reviewed docs treat GraphQL operations such as `boards`, `items`, `assets`, and mutations like `add_file_to_update` as schema-level operations executed through the same HTTP entrypoints rather than as separate REST paths.

## Authentication
From the reviewed official docs:
- monday.com documents personal V2 API tokens for authenticating platform API calls.
- Requests send the token in the `Authorization` header.
- The docs also note that app tokens exist and are additionally constrained by permission scopes, while personal tokens inherit the caller's monday.com UI permissions.
- Reviewed request examples also send `Content-Type: application/json` for GraphQL requests and `API-Version` for version-pinned calls.

## Versioning
From the reviewed official versioning page:
- Version selection is done with the `API-Version` header.
- monday.com guarantees at least three API versions in parallel and releases a new version every quarter.
- The reviewed page listed these current versions:
  - `2026-01` - maintenance
  - `2026-04` - current
  - `2026-07` - release candidate
- The docs state that release-candidate versions are unstable previews, while current and maintenance versions are production-stable.
- If a nonexistent version is requested, monday.com falls back to the current version; deprecated requests fall back to the maintenance version.

## Rate limits
From the reviewed official rate-limit page:
- monday.com publishes multiple limit families, not one flat request cap:
  - complexity limit
  - daily call limit
  - minute limit
  - concurrency limit
  - IP limit
  - resource protection limit
- Complexity limits:
  - individual query: `5,000,000` complexity points
  - app tokens: `5M` read and `5M` write complexity points per minute
  - API playground: `5M` read and `5M` write complexity points per minute, or `1M` for trial/free accounts
  - personal API tokens: combined `10M` points per minute, or `1M` for trial, NGO, and free accounts
- Daily call limits reset at midnight UTC:
  - Free / Standard / Basic: `1,000`
  - Pro: `10,000` soft limit
  - Enterprise: `25,000` soft limit
- Minute request limits:
  - Enterprise: `5,000` queries/minute
  - Pro: `2,500` queries/minute
  - Other: `1,000` queries/minute
- Concurrency limits:
  - Enterprise: `250`
  - Pro: `100`
  - Other: `40`
- IP limit:
  - `5,000` requests per `10` seconds per individual IP
- The docs explicitly say rate-limit responses return retry guidance, including `Retry-After`, and rate-limit errors include `retry_in_seconds`.

## Error handling and format notes
From the reviewed official error-handling page:
- Application-level errors can still return HTTP `200 OK`.
- Error responses use a GraphQL-style JSON body with an `errors` array and may also include partial `data`.
- The sample error format includes:
  - `message`
  - `locations`
  - `path`
  - `extensions.code`
  - `extensions.error_data`
  - `extensions.status_code`
- The docs also say each API response includes a `request_id` in the `extensions` object for troubleshooting.
- Transport-level failures can use non-200 statuses such as `400`, `429`, and `500`.

## Confirmed route inventory
### Core GraphQL endpoint
- `POST /v2`
  - purpose: execute GraphQL queries and mutations
  - confirmed headers/parameters from official examples:
    - `Authorization`
    - `Content-Type: application/json`
    - optional `API-Version`
  - confirmed JSON body shape:
    - `query`
    - optional `variables`

### File upload endpoint
- `POST /v2/file`
  - purpose: multipart upload endpoint used for file-related mutations such as attaching files to updates or file columns
  - confirmed transport: `multipart/form-data`
  - confirmed related GraphQL mutation use cases from the official files page:
    - `add_file_to_update`
    - `add_file_to_column`

## Important usage notes
- monday.com's huge object surface is GraphQL schema depth, not a large REST path inventory; this manual doc intentionally counts only the concrete HTTP routes that the official docs expose.
- The files page is the key official confirmation that uploads do not go through the same JSON GraphQL endpoint as ordinary queries.
- The current docs explicitly recommend passing an `API-Version` header so integrations do not silently drift when quarterly releases change the current version.
- The official rate-limit model is unusually multi-dimensional; callers need to account for complexity budgets and concurrency, not just request counts.

## Verification note
This file was manually rebuilt from monday.com's current official developer docs using browser inspection only.