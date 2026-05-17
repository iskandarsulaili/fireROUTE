# Bhagavad Gita

Official pages manually reviewed:
- https://bhagavadgita.io/api
- https://bhagavadgita.com/api
- https://rapidapi.com/bhagavad-gita-bhagavad-gita-default/api/bhagavad-gita3
- https://rapidapi.com/bhagavad-gita-bhagavad-gita-default/api/bhagavad-gita3/pricing
- https://rapidapi.com/bhagavad-gita-bhagavad-gita-default/api/bhagavad-gita3/playground/apiendpoint_01f756ff-a6ee-421e-bf25-1882974c4857
- https://rapidapi.com/bhagavad-gita-bhagavad-gita-default/api/bhagavad-gita3/playground/apiendpoint_3fa7b31c-4650-4ce9-b7a0-40144721b423

## Overview
- Base URL shown in the reviewed playground cURL snippets: `https://bhagavad-gita3.p.rapidapi.com`
- All confirmed endpoints are documented as `GET`
- Response/request format signal from the reviewed playground snippets: `application/json`
- Authentication model visible on the reviewed official pages: RapidAPI-managed access for the Bhagavad Gita API published by `Bhagavad Gita`
- Header explicitly shown in the reviewed playground snippets: `x-rapidapi-host: bhagavad-gita3.p.rapidapi.com`
- Product website linked from the reviewed official RapidAPI overview page: `https://bhagavadgita.io/`
- Signed-out visibility note: the anonymous reviewed playground pages did not reveal a usable account key value, so the credential-bearing `x-rapidapi-key` remains account-managed rather than publicly printed in the docs snapshot

Manual route count confirmed from the reviewed official site plus the linked official RapidAPI overview/playground pages: **4**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v2/chapters/` | Get information about all Bhagavad Gita chapters |
| GET | `/v2/chapters/{chapter_number}/` | Get information about one chapter |
| GET | `/v2/chapters/{chapter_number}/verses/` | Get all verses, translations, and commentaries for a chapter |
| GET | `/v2/chapters/{chapter_number}/verses/{verse_number}/` | Get one verse plus translations/commentaries |

## Confirmed parameters

### `GET /v2/chapters/`
- Query parameters shown in the reviewed playground cURL example:
  - `skip`: offset; reviewed example uses `0`
  - `limit`: page size; reviewed example uses `18`

### `GET /v2/chapters/{chapter_number}/`
- Path parameter implied by the reviewed route template and playground example:
  - `chapter_number`: chapter identifier; reviewed example uses `1`

### `GET /v2/chapters/{chapter_number}/verses/`
- Path parameter confirmed from the reviewed official RapidAPI overview page's embedded endpoint metadata:
  - `chapter_number`: chapter identifier
- Direct navigation to this endpoint's dedicated playground page was unstable in this run, but the official overview page still exposed the route template, method, and description.

### `GET /v2/chapters/{chapter_number}/verses/{verse_number}/`
- Path parameters confirmed from the reviewed official RapidAPI overview page's embedded endpoint metadata:
  - `chapter_number`: chapter identifier
  - `verse_number`: verse identifier within the chapter
- Direct navigation to this endpoint's dedicated playground page was unstable in this run, but the official overview page still exposed the route template, method, and description.

## Auth, rate limits, and billing notes
- The reviewed official pricing page currently shows one public `Basic` plan at `$0.00/mo`.
- The reviewed pricing page publishes a `500,000 / Month` hard request limit.
- The reviewed pricing page publishes a `1000 requests per hour` rate limit.
- The reviewed pricing page also lists `10240MB / Month` bandwidth plus `+ $0.001 per 1MB` platform overage billing.
- The reviewed public pages expose the RapidAPI host header but not a usable account key value in a signed-out session.
- Operationally, fireROUTE should treat this provider as RapidAPI-subscription-gated and require caller-supplied RapidAPI credentials/config.

## Pagination, errors, and response notes
- The reviewed cURL snippets use `application/json`.
- Pagination-style controls are visibly documented only on `GET /v2/chapters/` through `skip` and `limit`.
- The reviewed public pages did not expose a formal provider-specific HTTP error table or custom error-schema section in the signed-out browser session.
- All confirmed operations are `GET` routes and no reviewed page exposed a request body schema.

## Important usage notes
- The indexed official site URL `https://bhagavadgita.io/api` no longer serves route docs directly; it now redirects to the public reading site under `https://bhagavadgita.com/api`.
- That public site still exposes an official `API` link pointing to the reviewed RapidAPI listing, which is the current route-reference source for this provider.
- The reviewed official RapidAPI overview page describes the API as an open-source REST API for using Srimad Bhagavad Gita text in web or mobile applications.
- Some dedicated playground subpages were unstable in this run, but the official overview page still exposed the complete four-route endpoint inventory in embedded page data, so the route surface is still manually confirmable from official sources.

## fireROUTE notes
- Default the provider base URL to `https://bhagavad-gita3.p.rapidapi.com`, but keep it configurable because marketplace hosts can change.
- Model all confirmed routes as `GET` operations.
- Expose `skip` and `limit` for the chapter-list route as first-class pagination passthrough parameters.
- Treat the RapidAPI key/header requirement as external configuration rather than hard-coded documentation data.