# mod.io

## Overview
- Provider: mod.io REST API
- Category: Games & Comics
- Official docs: `https://docs.mod.io/restapi/introduction`
- Official docs root from category index: `https://docs.mod.io`
- Base URL pattern (games): `https://g-{your-game-id}.modapi.io/v1`
- Base URL pattern (users): `https://u-{your-user-id}.modapi.io/v1`
- Auth:
  - read-only `GET` access can use query `api_key=...`
  - read/write access uses `Authorization: Bearer {oauth-access-token}`
- HTTPS: required on all requests
- Response format: JSON
- Confirmed routes: `134`
- Path placeholder style in the official docs uses colon-prefixed variables such as `:game-id` and `:mod-id`

## Confirmed endpoint inventory

### Global / root endpoints (`4`)

| Method | Path |
|---|---|
| GET | `/authenticate/terms` |
| GET | `/games` |
| GET | `/ping` |
| POST | `/report` |

### Agreement endpoints (`2`)

| Method | Path |
|---|---|
| GET | `/agreements/types/:agreement-type-id/current` |
| GET | `/agreements/versions/:agreement-version-id` |

### OAuth endpoints (`3`)

| Method | Path |
|---|---|
| POST | `/oauth/emailrequest` |
| POST | `/oauth/emailexchange` |
| POST | `/oauth/logout` |

### External authentication endpoints (`12`)

| Method | Path |
|---|---|
| POST | `/external/appleauth` |
| POST | `/external/discordauth` |
| POST | `/external/epicgamesauth` |
| POST | `/external/galaxyauth` |
| POST | `/external/googleauth` |
| POST | `/external/oculusauth` |
| POST | `/external/openidauth` |
| POST | `/external/psnauth` |
| POST | `/external/steamauth` |
| POST | `/external/switchauth` |
| POST | `/external/udtauth` |
| POST | `/external/xboxauth` |

### Game endpoints (`5`)

| Method | Path |
|---|---|
| GET | `/games/:game-id` |
| GET | `/games/:game-id/monetization/token-packs` |
| GET | `/games/:game-id/stats` |
| GET | `/games/:game-id/tags` |
| POST | `/games/:game-id/media` |

### Collection endpoints (`18`)

| Method | Path |
|---|---|
| GET | `/games/:game-id/collections` |
| POST | `/games/:game-id/collections` |
| GET | `/games/:game-id/collections/:collection-id` |
| POST | `/games/:game-id/collections/:collection-id` |
| DELETE | `/games/:game-id/collections/:collection-id` |
| GET | `/games/:game-id/collections/:collection-id/comments` |
| POST | `/games/:game-id/collections/:collection-id/comments` |
| GET | `/games/:game-id/collections/:collection-id/comments/:comment-id` |
| PUT | `/games/:game-id/collections/:collection-id/comments/:comment-id` |
| DELETE | `/games/:game-id/collections/:collection-id/comments/:comment-id` |
| POST | `/games/:game-id/collections/:collection-id/comments/:comment-id/karma` |
| POST | `/games/:game-id/collections/:collection-id/compatibility` |
| POST | `/games/:game-id/collections/:collection-id/followers` |
| DELETE | `/games/:game-id/collections/:collection-id/followers` |
| GET | `/games/:game-id/collections/:collection-id/mods` |
| DELETE | `/games/:game-id/collections/:collection-id/mods` |
| POST | `/games/:game-id/collections/:collection-id/subscriptions` |
| DELETE | `/games/:game-id/collections/:collection-id/subscriptions` |

### Guide endpoints (`12`)

| Method | Path |
|---|---|
| GET | `/games/:game-id/guides` |
| POST | `/games/:game-id/guides` |
| GET | `/games/:game-id/guides/:guide-id` |
| POST | `/games/:game-id/guides/:guide-id` |
| DELETE | `/games/:game-id/guides/:guide-id` |
| GET | `/games/:game-id/guides/:guide-id/comments` |
| POST | `/games/:game-id/guides/:guide-id/comments` |
| GET | `/games/:game-id/guides/:guide-id/comments/:comment-id` |
| PUT | `/games/:game-id/guides/:guide-id/comments/:comment-id` |
| DELETE | `/games/:game-id/guides/:guide-id/comments/:comment-id` |
| POST | `/games/:game-id/guides/:guide-id/comments/:comment-id/karma` |
| GET | `/games/:game-id/guides/tags` |

### Mod endpoints (`50`)

| Method | Path |
|---|---|
| GET | `/games/:game-id/mods` |
| POST | `/games/:game-id/mods` |
| GET | `/games/:game-id/mods/:mod-id` |
| POST | `/games/:game-id/mods/:mod-id` |
| DELETE | `/games/:game-id/mods/:mod-id` |
| GET | `/games/:game-id/mods/:mod-id/comments` |
| POST | `/games/:game-id/mods/:mod-id/comments` |
| GET | `/games/:game-id/mods/:mod-id/comments/:comment-id` |
| PUT | `/games/:game-id/mods/:mod-id/comments/:comment-id` |
| DELETE | `/games/:game-id/mods/:mod-id/comments/:comment-id` |
| POST | `/games/:game-id/mods/:mod-id/comments/:comment-id/karma` |
| GET | `/games/:game-id/mods/:mod-id/cooks` |
| GET | `/games/:game-id/mods/:mod-id/dependants` |
| GET | `/games/:game-id/mods/:mod-id/dependencies` |
| POST | `/games/:game-id/mods/:mod-id/dependencies` |
| DELETE | `/games/:game-id/mods/:mod-id/dependencies` |
| GET | `/games/:game-id/mods/:mod-id/events` |
| GET | `/games/:game-id/mods/:mod-id/files` |
| POST | `/games/:game-id/mods/:mod-id/files` |
| GET | `/games/:game-id/mods/:mod-id/files/:file-id` |
| PUT | `/games/:game-id/mods/:mod-id/files/:file-id` |
| DELETE | `/games/:game-id/mods/:mod-id/files/:file-id` |
| POST | `/games/:game-id/mods/:mod-id/files/:file-id/platforms` |
| GET | `/games/:game-id/mods/:mod-id/files/multipart` |
| POST | `/games/:game-id/mods/:mod-id/files/multipart` |
| PUT | `/games/:game-id/mods/:mod-id/files/multipart` |
| DELETE | `/games/:game-id/mods/:mod-id/files/multipart` |
| POST | `/games/:game-id/mods/:mod-id/files/multipart/complete` |
| GET | `/games/:game-id/mods/:mod-id/files/multipart/sessions` |
| POST | `/games/:game-id/mods/:mod-id/media` |
| DELETE | `/games/:game-id/mods/:mod-id/media` |
| PUT | `/games/:game-id/mods/:mod-id/media/reorder` |
| GET | `/games/:game-id/mods/:mod-id/metadatakvp` |
| POST | `/games/:game-id/mods/:mod-id/metadatakvp` |
| DELETE | `/games/:game-id/mods/:mod-id/metadatakvp` |
| GET | `/games/:game-id/mods/:mod-id/monetization/team` |
| POST | `/games/:game-id/mods/:mod-id/monetization/team` |
| POST | `/games/:game-id/mods/:mod-id/checkout` |
| POST | `/games/:game-id/mods/:mod-id/ratings` |
| GET | `/games/:game-id/mods/:mod-id/sources` |
| POST | `/games/:game-id/mods/:mod-id/sources` |
| GET | `/games/:game-id/mods/:mod-id/stats` |
| POST | `/games/:game-id/mods/:mod-id/subscribe` |
| DELETE | `/games/:game-id/mods/:mod-id/subscribe` |
| GET | `/games/:game-id/mods/:mod-id/tags` |
| POST | `/games/:game-id/mods/:mod-id/tags` |
| DELETE | `/games/:game-id/mods/:mod-id/tags` |
| GET | `/games/:game-id/mods/:mod-id/team` |
| GET | `/games/:game-id/mods/events` |
| GET | `/games/:game-id/mods/stats` |

### Cloud Cooking endpoints (`1`)

| Method | Path |
|---|---|
| POST | `/games/:game-id/cloud-cooking/finalization` |

### Authenticated-user (`/me`) endpoints (`14`)

| Method | Path |
|---|---|
| GET | `/me` |
| GET | `/me/collections` |
| GET | `/me/events` |
| GET | `/me/files` |
| GET | `/me/followers` |
| GET | `/me/following/collections` |
| GET | `/me/games` |
| POST | `/me/entitlements` |
| GET | `/me/mods` |
| GET | `/me/purchased` |
| GET | `/me/ratings` |
| GET | `/me/subscribed` |
| GET | `/me/users/muted` |
| GET | `/me/wallets` |

### User/social endpoints (`7`)

| Method | Path |
|---|---|
| GET | `/users/:user-id/collections` |
| GET | `/users/:user-id/followers` |
| GET | `/users/:user-id/following` |
| POST | `/users/:user-id/following` |
| DELETE | `/users/:user-id/following/:target-user-id` |
| POST | `/users/:user-id/mute` |
| DELETE | `/users/:user-id/mute` |

### Service-to-service endpoints (`6`)

| Method | Path |
|---|---|
| DELETE | `/s2s/connections/:portal-id` |
| GET | `/s2s/monetization-teams/:monetization-team-id/transactions` |
| GET | `/s2s/monetization-teams/:monetization-team-id/transactions/:transaction-id` |
| POST | `/s2s/transactions/clawback` |
| POST | `/s2s/transactions/commit` |
| POST | `/s2s/transactions/intent` |

## Parameters, headers, and request-body rules

### Common path parameters
- `:game-id`
- `:mod-id`
- `:file-id`
- `:collection-id`
- `:guide-id`
- `:comment-id`
- `:user-id`
- `:target-user-id`
- `:agreement-type-id`
- `:agreement-version-id`
- `:portal-id`
- `:monetization-team-id`
- `:transaction-id`

### Common query parameters
- Pagination:
  - `_limit` to cap result count; defaults to `100` unless an endpoint overrides it
  - `_offset` to skip rows before returning the next slice
- Sorting:
  - `_sort=field` for ascending
  - `_sort=-field` for descending
  - official docs note some endpoints expose special sort columns such as `popular`, `downloads`, `rating`, and `subscribers`
- Filtering/search:
  - `_q` full-text search on endpoints that expose a `name` field
  - `field=value`
  - `field-not=value`
  - `field-lk=value`, `field-lk=value*`, `field-lk=*value*`
  - `field-not-lk=value`
  - `field-in=a,b,c`
  - `field-not-in=a,b,c`
  - `field-min=value`
  - `field-max=value`
  - `field-bitwise-and=value`
  - `or_fields[]=field1,field2`
- API-key auth on read-only requests:
  - `api_key=...`
- Portal targeting:
  - docs also show `?portal=PORTAL` on some web/portal-specific flows

### Important headers
- `Authorization: Bearer {access-token}` for OAuth access-token requests
- `Content-Type: multipart/form-data` for binary upload requests
- `Content-Type: application/x-www-form-urlencoded` for non-binary `POST`, `PUT`, and `DELETE` requests
- `X-Modio-Platform: <platform>` to target the caller platform and receive only approved platform content
- `X-Modio-Portal: <portal>` for portal-specific behavior/auth flows such as `steam`, `xboxlive`, `psn`, etc.
- `Accept-Language: <iso-639-code>` for localized responses
- `Content-Language: <iso-639-code>` when submitting localized content

### Request-body conventions
- The docs say any non-binary payload can be supplied in the `input_json` field.
- Upload routes such as game media, mod media, mod logo/file/source upload, and multipart upload parts rely on multipart form bodies.
- Auth endpoints use route-specific body fields for security codes, identity-provider tokens, or delegation-token material.
- Purchase and monetization routes require provider-specific form fields based on `X-Modio-Portal`, checkout type, and monetization context.

## Authentication and access model
- The intro page defines two main auth modes:
  - API key in query string for read-only `GET` access
  - OAuth 2 access token in `Authorization` header for `GET`, `POST`, `PUT`, and `DELETE`
- If both an API key and an access token are supplied in the same request, the access token takes precedence and the API key is ignored.
- The docs present five ways to authenticate users:
  - API key for read-only public access
  - email authentication flow (`/oauth/emailrequest` + `/oauth/emailexchange`)
  - platform authentication flow (`/external/*auth`)
  - OpenID authentication flow (`/external/openidauth`)
  - manually created OAuth 2 access token
- The `/external/*auth` family covers Apple, Discord, Epic Games, GOG Galaxy, Google, Meta Quest/Oculus, OpenID, PSN, Steam, Switch, UDT, and Xbox Live.
- The `/authenticate/terms` endpoint is the official pre-auth consent/terms helper for in-game login UX.

## Pagination, rate limits, and errors

### Pagination
- List endpoints append pagination metadata in the JSON body:
  - `result_count`
  - `result_limit`
  - `result_offset`
  - `result_total`
- The official pagination guide examples use:
  - `?_limit=5`
  - `?_offset=30`
  - `?_offset=30&_limit=5`
- Docs note that if `result_count` equals `result_limit`, there are probably more results to fetch.

### Rate limits
- Official defaults from the rate-limiting page:
  - game-linked API keys: unlimited requests
  - user-linked API keys: `60 requests per minute`
  - user OAuth tokens: `120 requests per minute`
  - user-token writes: `60 requests per minute`
  - IPs: `1000 requests per minute`
  - IP writes: `60 requests per minute`
- `429 Too Many Requests` responses include a `retry-after` header in seconds.
- The docs distinguish:
  - global rate-limit block: `error_ref 11008`
  - per-endpoint rate-limit block: `error_ref 11009`
- The docs explicitly warn that continuing to send requests after `429` responses can lead to revoked credentials.

### Error format
- The shared error shape is:
  - `error.code`
  - `error.error_ref`
  - `error.message`
- Validation failures may also include `error.errors` with field-level issues.
- The docs say `error.errors` is only returned on `422 Unprocessable Entity` responses.
- Example documented statuses across the reviewed pages include `200`, `201`, `204`, `400`, `401`, `403`, `415`, `422`, `429`, and `500+` server-side failures.

### Live anonymous checks performed in this pass
- `GET https://g-1.modapi.io/v1/ping`
  - returned `401`
  - content type `application/json`
  - body: `{"error":{"code":401,"error_ref":11000,"message":"We cannot complete your request due to a malformed/missing api_key in your request. Refer to documentation at https://docs.mod.io"}}`
- `GET https://g-1.modapi.io/v1/games`
  - returned the same `401` / `11000` malformed-or-missing-`api_key` error
- `GET https://u-1.modapi.io/v1/me`
  - returned `401`
  - content type `application/json`
  - body: `{"error":{"code":401,"error_ref":11005,"message":"The supplied access token has either been revoked, has expired or is malformed. Please generate a new one."}}`

## Response-format notes
- The docs say all API responses are always JSON.
- List responses use body-level pagination metadata rather than Link headers.
- Error responses use the shared `error` object, with optional nested `errors` on `422` validation failures.
- Localization is available through `Accept-Language` for reads and `Content-Language` for writes, but the localization page warns that localization is still a work in progress and not all responses may be translated.

## Important usage notes
- mod.io explicitly recommends using its engine plugins or C++ SDK unless a custom REST integration is actually required.
- `X-Modio-Platform` is strongly recommended on every request so mod.io can return only platform-approved mods/files/tags and track platform-specific metrics correctly.
- `X-Modio-Portal` affects authentication and storefront/purchase behavior; the docs use values such as `steam`, `xboxlive`, and `psn`.
- `GET /me/events` is officially deprecated for in-game use and, according to the docs, new games created after `2024-03-31` should use `GET /me/subscribed` instead.
- `DELETE /games/:game-id/mods/:mod-id` closes a mod profile but does not permanently erase it; permanent deletion must be done from the mod.io website.
- `POST /games/:game-id/mods/:mod-id/files/:file-id/platforms` only manages approval/denial state; it does not set a file live for approved platforms.
- Multipart upload parts must be exactly `50 MiB` except for the final part, which may be smaller.
- The purchase endpoint documents portal-specific request requirements; for example, some flows require extra fields such as an Xbox token depending on portal and checkout type.
- The `GET /me` endpoint is also documented for certain S2S use cases with an OAuth S2S token and optional user-delegation token.

## Integration notes for fireROUTE
- Treat mod.io as a large authenticated UGC/content-management API rather than a single public catalog endpoint.
- Preserve the official colon-style path-variable names internally when mapping because the docs consistently publish routes that way.
- Build shared request helpers for `_limit`, `_offset`, `_sort`, `_q`, comparison filters, `X-Modio-Platform`, `X-Modio-Portal`, `Accept-Language`, and `Content-Language`; they recur across most resource families.
- Model upload flows separately from standard form posts because mod.io mixes classic form-urlencoded writes, multipart binary uploads, and `input_json` payload wrapping.
- Keep S2S monetization endpoints isolated from end-user OAuth flows; they are a distinct auth/use-case family.

## Sources inspected
- `https://docs.mod.io/`
- `https://docs.mod.io/sitemap.xml`
- `https://docs.mod.io/restapi/introduction`
- `https://docs.mod.io/restapi/filtering`
- `https://docs.mod.io/restapi/sorting`
- `https://docs.mod.io/restapi/platforms`
- `https://docs.mod.io/restapi/pagination`
- `https://docs.mod.io/restapi/localization`
- `https://docs.mod.io/restapi/rate-limiting`
- `https://docs.mod.io/restapi/errors`
- official operation pages enumerated under `https://docs.mod.io/restapi/docs/*` from the official sitemap to confirm method/path inventory
- live checks:
  - `https://g-1.modapi.io/v1/ping`
  - `https://g-1.modapi.io/v1/games`
  - `https://u-1.modapi.io/v1/me`
