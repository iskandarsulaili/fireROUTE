# HERE Maps

## Provider metadata
- Category: `Geocoding`
- Provider slug: `here-maps`
- Official pages reviewed manually:
  - `https://docs.here.com/geocoding-and-search/docs/introduction-to-here-geocoding-search-api-v7`
  - `https://docs.here.com/geocoding-and-search/docs/request-constructing`
  - `https://docs.here.com/geocoding-and-search/docs/get-credentials-ols`
  - `https://docs.here.com/geocoding-and-search/reference`
  - operation pages under `https://docs.here.com/geocoding-and-search/reference/`
- Product documented: `HERE Geocoding and Search API v7`
- Official host pattern confirmed in the request-construction guide: service-specific `https://{service}.search.hereapi.com/v1`
- Explicit host examples shown in the reviewed docs:
  - `https://discover.search.hereapi.com/v1/discover`
  - `https://multi-revgeocode.search.hereapi.com/v1/multi-revgeocode`
- Transport: `HTTPS`
- Auth model confirmed in reviewed docs: `API key` support is exposed in the docs UI and the credentials guide also documents OAuth-token access via an Authorization bearer token.
- Response format shown in the reviewed reference pages: `application/json`

## Product and access notes
- The reviewed guide says most HERE Geocoding and Search endpoints are called with `GET`.
- The request-construction guide says endpoints are named after their related service, with the service host following the same name pattern.
- The credentials guide says HERE offers two authentication options for the global Geocoding and Search product when you sign up for a plan.
- The same credentials guide includes a live example that first obtains a token from `https://account.api.here.com/oauth2/token` and then calls `https://discover.search.hereapi.com/v1/discover?...` with a bearer token.
- Several POST operations in the API reference are explicitly marked `BETA` and/or `RESTRICTED`.

## Confirmed API surface
The reviewed API reference confirms these `12` geocoding/search operations:
1. `GET /v1/autocomplete`
2. `GET /v1/autosuggest`
3. `POST /v1/autosuggest`
4. `GET /v1/browse`
5. `POST /v1/browse`
6. `GET /v1/discover`
7. `POST /v1/discover`
8. `GET /v1/geocode`
9. `GET /v1/lookup`
10. `POST /v1/multi-revgeocode`
11. `GET /v1/revgeocode`
12. `POST /v1/signals`

## Shared request and behavior notes
- Base URL family: `https://{service}.search.hereapi.com/v1`
- The request-construction guide says repeating the same parameter key results in a `400` error.
- Search-context filters repeatedly use either `at={lat},{lng}` or an `in=` spatial filter; the reviewed pages repeatedly state that mutually exclusive spatial filters cannot be combined.
- The reviewed reference pages use `accept: application/json` and show JSON responses.
- The reviewed pages do not expose a cursor or page-number pagination flow; result shaping is done per request through filters such as `limit`, `types`, `lang`, `show`, and spatial constraints.

## 1) Autocomplete
- Method: `GET`
- Full route pattern: `https://autocomplete.search.hereapi.com/v1/autocomplete`
- Purpose: complete partial address or administrative-area input while the user is still typing

Documented required parameter:
- `q` - free-text partial query

Documented notable optional parameters visible on the reviewed page:
- `at` - search center as `{latitude},{longitude}`
- `in` - hard spatial filter by country, circle, or bbox
- `postalCodeMode` - multi-district/postal-code handling
- `types` - restrict result types
- `lang`
- `limit`
- `show`

Important official notes:
- The page says `at`, `in=circle`, and `in=bbox` are mutually exclusive.
- The page says whitespace-only input, URLs, email addresses, and other out-of-scope queries yield no results.

## 2) Autosuggest
- Methods: `GET`, `POST`
- Full route patterns:
  - `https://autosuggest.search.hereapi.com/v1/autosuggest`
  - `https://autosuggest.search.hereapi.com/v1/autosuggest` (POST variant)
- Purpose: return mixed suggestion results for incomplete place/address/category queries

Documented required/important parameters visible on the reviewed pages:
- `q` - free-text partial query
- one of `at`, `in=circle`, or `in=bbox` is required
- `fuelStation[...]` - beta fuel-station attribute filters
- `types`
- `termsLimit`
- `limit`
- `lang`
- `show`

Important official notes:
- The reviewed GET and POST reference pages expose the same core query-parameter surface.
- The POST variant adds `413` and `415` error cases, indicating request-body and content-type enforcement.

## 3) Browse
- Methods: `GET`, `POST`
- Full route patterns:
  - `https://browse.search.hereapi.com/v1/browse`
  - `https://browse.search.hereapi.com/v1/browse` (POST variant)
- Purpose: find places near a point without a free-text query, primarily by category/chain filters

Documented required/important parameters visible on the reviewed pages:
- `at` - required center point
- `categories` - comma-separated HERE category IDs
- `chains` - comma-separated chain IDs
- `foodTypes`
- `limit`
- `lang`
- `show`

Important official notes:
- Category and chain filters accept exclusion by prefixing an ID with `!`.
- The POST variant is listed separately and adds `413` and `415` error responses.

## 4) Discover
- Methods: `GET`, `POST`
- Full route patterns:
  - `https://discover.search.hereapi.com/v1/discover`
  - `https://discover.search.hereapi.com/v1/discover` (POST variant)
- Purpose: free-text place/address discovery ordered by relevance

Documented required/important parameters visible on the reviewed pages:
- `q` - required free-text query
- one of `at`, `in=circle`, or `in=bbox` is required
- `fuelStation[...]` - beta fuel-station filters
- `types`
- `limit`
- `lang`
- `show`

Important official notes:
- The request-construction guide uses `https://discover.search.hereapi.com/v1/discover?at=52.5228,13.4124&q=petrol+station&limit=5` as its worked example.
- The reviewed POST page is marked `BETA, RESTRICTED`.
- The POST variant adds `413` and `415` error responses.

## 5) Geocode
- Method: `GET`
- Full route pattern: `https://geocode.search.hereapi.com/v1/geocode`
- Purpose: resolve structured or free-form address input into address/place results

Documented required/important parameters visible on the reviewed page:
- `q` - free-text query
- `qq` - qualified semicolon-separated structured query such as `city=...;country=...;street=...;houseNumber=...`
- either `q` or `qq` is required; both may be supplied together
- `types`
- `at`
- `in`
- `limit`
- `lang`
- `addressNamesMode`
- `addressNamesVariant`
- `postalCodeMode`
- `show`

Important official notes:
- The reviewed page says `qq` currently supports sub-parameters including `country`, `state`, `county`, `city`, `district`, `street`, `houseNumber`, and `postalCode`.
- The reviewed page distinguishes normalized versus matched address naming through `addressNamesMode`.

## 6) Lookup By ID
- Method: `GET`
- Full route pattern: `https://lookup.search.hereapi.com/v1/lookup`
- Purpose: fetch a single place/address record by HERE location ID

Documented required/important parameters visible on the reviewed page:
- `id` - required result item ID from an earlier HERE response
- `addressNamesVariant`
- `lang`
- `politicalView`
- `show`

Important official notes:
- This is the only reviewed operation that explicitly lists `404` for an unknown requested ID.

## 7) Reverse Geocode
- Method: `GET`
- Full route pattern: `https://revgeocode.search.hereapi.com/v1/revgeocode`
- Purpose: turn coordinates into nearby address/place results

Documented required/important parameters visible on the reviewed page:
- either `at` or `in=circle` is required
- `bearing` - street-match direction hint; if present, only `types=street` is accepted
- `types`
- `limit`
- `lang`
- `with`
- `addressNamesVariant`
- `show`

Important official notes:
- The reviewed page says `at` and `in=circle` are mutually exclusive.
- The reviewed page says providing `bearing` forces street-oriented matching behavior.

## 8) Multi-Reverse Geocode
- Method: `POST`
- Full route pattern: `https://multi-revgeocode.search.hereapi.com/v1/multi-revgeocode`
- Purpose: reverse-geocode a list of geo-coordinates in one request

Documented important parameters visible on the reviewed page:
- request body carries the list of geo-coordinates
- `types`
- `with`
- `lang`
- `limit`
- `politicalView`
- `addressNamesVariant`
- `show`

Important official notes:
- The first paragraph of the reviewed page says this endpoint returns addresses/places for a list of geo-coordinates specified in the request.
- The POST reference page adds `413` and `415` error responses.

## 9) Signals
- Method: `POST`
- Full route pattern: `https://signals.search.hereapi.com/v1/signals`
- Purpose: send user-interaction feedback tied to previous HERE search results

Documented request contract visible on the reviewed page:
- request body is a newline-separated list of events following URL query-parameter syntax
- each line includes fields such as `version`, `action`, `correlationId`, and `resourceId`

Important official notes:
- The reviewed page is marked `RESTRICTED`.
- `version` must be set to `1`.
- The page says unsupported `action` values cause `400` errors.
- Successful responses are `204 No Content`.

## Response, error, rate-limit, and format notes
- The reviewed reference pages show `application/json` responses for search/geocoding operations.
- Common errors shown across GET operations: `400` validation failure, `405` unsupported HTTP method, `429` rate-limit exceeded, `503` temporary server error.
- Reviewed POST operations additionally show `413` request body too large and `415` unsupported content type.
- `GET /lookup` additionally documents `404` when the requested ID cannot be found.
- `POST /signals` returns `204` on success rather than a JSON result body.
- The reviewed pages clearly document `429` for rate-limit exceedance, but no numeric per-minute quota was published in the pages reviewed during this pass.

## Canonical fireROUTE notes
- Treat HERE as a multi-host API family rather than a single fixed origin; the host name follows the service being called.
- Preserve the distinction between free-text discovery (`discover`), structured/free-form geocoding (`geocode`), coordinate lookup (`revgeocode` / `multi-revgeocode`), result lookup (`lookup`), and feedback submission (`signals`).
- Preserve the `BETA` / `RESTRICTED` markings for the POST autosuggest, POST browse, POST discover, and signals surfaces instead of presenting them as stable general-availability routes.
- Preserve both authentication options in adapters if supported by the deployment environment: API key flows and bearer-token flows are both surfaced in the reviewed official docs.

## Verification notes
- This file was manually rebuilt from live official HERE docs pages using browser tools only.
- It replaces the old autogenerated placeholder that failed to resolve route details from the generic HERE landing page.
