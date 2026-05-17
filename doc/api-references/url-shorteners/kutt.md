# Kutt

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `kutt`
- Docs used manually:
  - `https://kutt.it/`
  - `https://raw.githubusercontent.com/thedevs-network/kutt/main/docs/api/api.js`
- Confirmed API base URL: `https://kutt.it/api/v2`
- Primary media types: JSON for management endpoints; plain-text `OK` for health
- Versioning note: the official raw API document reviewed in this pass is an OpenAPI `3.0.0` definition for `/api/v2`
- Manually confirmed routes in this pass: `8`

## Authentication
From the official raw API definition and the live official Kutt site:
- most management endpoints require API-key authentication
- the official security scheme is:
  - type: `apiKey`
  - header name: `X-API-KEY`
  - location: `header`
- the health endpoint does not require authentication

## Common request/response conventions
- Base URL: `https://kutt.it/api/v2`
- authenticated endpoints return JSON
- the health check returns plain text `OK`
- list pagination on links uses numeric `limit` and `skip`
- object IDs for reviewed link and domain management routes are documented as UUID strings

## Manually confirmed endpoint set

### 1) Health check
- Method: `GET`
- Path: `/health`
- Full URL: `https://kutt.it/api/v2/health`
- Authentication: none documented
- Response notes:
  - `200` returns plain text content
  - official example content: `OK`

### 2) List links
- Method: `GET`
- Path: `/links`
- Full URL: `https://kutt.it/api/v2/links`
- Authentication: `X-API-KEY` required
- Query parameters:
  - `limit` - optional number; example `10`
  - `skip` - optional number; example `0`
  - `all` - optional boolean; admin-only according to the official spec
- Response notes:
  - `200` returns a JSON object with reviewed fields `limit`, `skip`, `total`, and `data`
  - `data` is an array of `Link` objects

### 3) Create short link
- Method: `POST`
- Path: `/links`
- Full URL: `https://kutt.it/api/v2/links`
- Authentication: `X-API-KEY` required
- Request body fields confirmed in the official spec:
  - `target` - required destination URL
  - `description` - optional string
  - `expire_in` - optional string; example `2 minutes/hours/days`
  - `password` - optional string
  - `customurl` - optional string
  - `reuse` - optional boolean, default `false`
  - `domain` - optional string
- Response notes:
  - `200` returns a `Link` JSON object

### 4) Delete link
- Method: `DELETE`
- Path: `/links/{id}`
- Full URL: `https://kutt.it/api/v2/links/{id}`
- Authentication: `X-API-KEY` required
- Path parameters:
  - `id` - required UUID link ID
- Response notes:
  - `200` returns a JSON message object indicating successful deletion

### 5) Update link
- Method: `PATCH`
- Path: `/links/{id}`
- Full URL: `https://kutt.it/api/v2/links/{id}`
- Authentication: `X-API-KEY` required
- Path parameters:
  - `id` - required UUID link ID
- Request body fields confirmed in the official spec:
  - `target` - required string
  - `address` - required string
  - `description` - optional string
  - `expire_in` - optional string; example `2 minutes/hours/days`
- Response notes:
  - `200` returns the updated `Link` object

### 6) Get link stats
- Method: `GET`
- Path: `/links/{id}/stats`
- Full URL: `https://kutt.it/api/v2/links/{id}/stats`
- Authentication: `X-API-KEY` required
- Path parameters:
  - `id` - required UUID link ID
- Response notes:
  - `200` returns a `Stats` object
  - reviewed schema includes period buckets such as `lastDay`, `lastWeek`, `lastMonth`, and `lastYear`, plus aggregated link fields like `target`, `visit_count`, and `updated_at`

### 7) Create domain
- Method: `POST`
- Path: `/domains`
- Full URL: `https://kutt.it/api/v2/domains`
- Authentication: `X-API-KEY` required
- Request body fields:
  - `address` - required string
  - `homepage` - optional string
- Response notes:
  - `200` returns a `Domain` object

### 8) Delete domain
- Method: `DELETE`
- Path: `/domains/{id}`
- Full URL: `https://kutt.it/api/v2/domains/{id}`
- Authentication: `X-API-KEY` required
- Path parameters:
  - `id` - required UUID domain ID
- Response notes:
  - `200` returns a JSON message object indicating successful deletion

### Additional reviewed user route
- Method: `GET`
- Path: `/users`
- Full URL: `https://kutt.it/api/v2/users`
- Authentication: `X-API-KEY` required
- Purpose: get user info
- Response notes:
  - `200` returns a `User` object with reviewed fields including `apikey`, `email`, and `domains`
- Counting note:
  - I documented this route in the body because it is clearly present in the official spec, but kept the route-count headline at `8` by counting the primary path/method operations above; if fireROUTE prefers per-method counting for every reviewed path, this can reasonably be treated as `9`

## Pagination
- the official spec exposes offset-style pagination for `GET /links`
- parameters:
  - `limit`
  - `skip`
- the response schema also includes `total`

## Rate limits
- the reviewed official raw API document did not publish numeric rate limits or reset headers

## Error and response notes
- success responses in the reviewed spec are primarily `200`
- `GET /health` is the only reviewed endpoint returning plain text instead of JSON
- link objects reviewed in the spec include fields such as `id`, `link`, `target`, `address`, `visit_count`, `created_at`, and `updated_at`
- the `User` schema reviewed in the spec exposes the user's API key and associated domains, so responses should be treated as sensitive

## Important usage notes
- the original docs hostname in the category README (`docs.kutt.it`) no longer resolved in this session
- the live official product site `https://kutt.it/` still advertises API support
- the official GitHub repository's raw OpenAPI-like source file under `docs/api/api.js` provided the concrete current route and schema details for this pass
- several route IDs are documented as UUIDs rather than short slugs

## Verification notes
This file was manually rebuilt from the official live Kutt site plus the official raw API definition from the Kutt GitHub repository using browser inspection.