# Heroku

## Provider metadata
- Category: `Development`
- Provider slug: `heroku`
- Docs used manually:
  - `https://devcenter.heroku.com/articles/platform-api-reference`
- Confirmed API base URL: `https://api.heroku.com`
- Required versioned media-type header from the docs: `Accept: application/vnd.heroku+json; version=3`
- Transport: HTTPS only
- Primary format: JSON
- Manually confirmed routes in this pass: `6`

## Authentication
Heroku's Platform API reference says:
- OAuth should be used to authorize and revoke access for yourself and third parties.
- Personal scripts may use HTTP Bearer authentication with an API token.
- Bearer auth is sent in the Authorization header using the Bearer scheme.
- The docs' cURL examples also use `~/.netrc` convenience auth for local tooling.

## Common request/response conventions
- Requests go to `https://api.heroku.com`.
- Clients must send `Accept: application/vnd.heroku+json; version=3`.
- The docs recommend sending a `User-Agent` header.
- All responses include an `ETag`; clients can use `If-None-Match` to get `304 Not Modified`.
- Optimistic concurrency is supported with `If-Match`, which yields `412 Precondition Failed` if the resource changed.
- Error responses are JSON objects with fields such as `id`, `message`, and sometimes `url`.
- The reviewed docs explicitly say the API supports CORS.

## Manually confirmed endpoint set

### 1) Account info
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.heroku.com/account`
- Purpose: return information about the current account.
- Example response fields shown in the docs include:
  - `email`, `id`, `name`, `last_login`, `verified`, `two_factor_authentication`, `default_organization`, `default_team`
- Response headers shown in the docs include:
  - `ETag`
  - `Last-Modified`
  - `RateLimit-Remaining`

### 2) Account update
- Method: `PATCH`
- Path: `/account`
- Full URL: `https://api.heroku.com/account`
- Purpose: update account settings.
- Optional body parameters confirmed in the docs:
  - `allow_tracking` - boolean
  - `beta` - boolean
  - `name` - nullable string
- Request body format: JSON
- Example response status: `200 OK`

### 3) App list
- Method: `GET`
- Path: `/apps`
- Full URL: `https://api.heroku.com/apps`
- Purpose: list existing apps.
- Range/pagination notes explicitly shown on the route page:
  - acceptable `Range` order values are `id`, `name`, or `updated_at`
  - response headers include `Accept-Ranges` and `Content-Range`
  - example response shows `RateLimit-Remaining`
- Example response fields include:
  - `id`, `name`, `git_url`, `web_url`, `region`, `stack`, `maintenance`, `repo_size`, `slug_size`

### 4) App create
- Method: `POST`
- Path: `/apps`
- Full URL: `https://api.heroku.com/apps`
- Purpose: create a new app.
- Optional body parameters confirmed in the docs:
  - `feature_flags` - array of unique app feature names
  - `name` - string matching `^[a-z][a-z0-9-]{1,28}[a-z0-9]$`
  - `region` - region UUID or name
  - `stack` - stack UUID or name
- Request body format: JSON
- Example response status: `201 Created`

### 5) App info
- Method: `GET`
- Path: `/apps/{app_id_or_name}`
- Full URL: `https://api.heroku.com/apps/{app_id_or_name}`
- Purpose: fetch an existing app by UUID or name.
- Path parameter:
  - `app_id_or_name` - app identifier or human-friendly app name
- Important provider-wide note from the docs:
  - Heroku allows both IDs and more human-friendly names for many resources, but the docs recommend preferring IDs to avoid ambiguity.

### 6) App delete
- Method: `DELETE`
- Path: `/apps/{app_id_or_name}`
- Full URL: `https://api.heroku.com/apps/{app_id_or_name}`
- Purpose: delete an existing app.
- Request body: none shown in the docs
- Example response status: `200 OK`
- Response body shown in the docs returns the deleted app representation.

## Pagination and ordering
- The Platform API reference uses HTTP range-style pagination in many collection routes rather than embedding cursor objects in response bodies.
- The docs explicitly show `Accept-Ranges` and `Content-Range` on list endpoints like `GET /apps`.
- Range ordering is resource-specific; for `GET /apps`, accepted values are `id`, `name`, and `updated_at`.

## Rate limits
From the official Platform API reference:
- Each account has a token pool of up to `4500` requests.
- Each API call consumes one token.
- Tokens refill at roughly `75` per minute (`4500` per hour), up to the `4500` maximum.
- When exhausted, the API returns `429 Too Many Requests` until tokens replenish.
- The `RateLimit-Remaining` response header exposes the remaining token count.
- The docs also say there is a rate-limit endpoint whose requests do not count toward the limit.

## Error format and status notes
- Example error response uses `429 Too Many Requests` with JSON fields:
  - `id`
  - `message`
  - `url`
- The status overview in the reviewed page lists common success statuses such as `200`, `201`, `202`, and `206`.
- `304 Not Modified` and `412 Precondition Failed` can appear when using conditional request headers.

## Important usage notes
- Heroku's API surface is broad; this file documents the core account/app routes manually inspected in this pass, not the entire route catalog on the reference page.
- The JSON schema for the platform API is itself available at `/schema` and can be fetched with the same versioned `Accept` header.
- Resource names often work interchangeably with IDs, but the docs explicitly recommend IDs for integrity and ambiguity avoidance.

## Verification notes
This file was manually rebuilt from the official Heroku Platform API reference with browser inspection, replacing the earlier autogenerated summary.
