# Jamendo

## Overview
- Provider: Jamendo API v3.0
- Category: Music
- Official docs: `https://developer.jamendo.com/v3.0/docs`
- Base URL: `https://api.jamendo.com/v3.0/`
- Auth:
  - every API call requires `client_id`
  - OAuth 2.0 is required for write operations and any route that requires `access_token`
  - OAuth scope currently documented: `music`
- HTTPS: yes
- Response formats: `json`, `jsonpretty`, `xml`
- Request methods:
  - read methods use `GET`
  - write methods use `POST`
  - OAuth authorize uses `GET`; OAuth token/grant uses SSL `POST`
- Pagination:
  - common read params include `offset` and `limit`
  - default `limit` is `10`
  - max `limit` is `200`, including when `limit=all`
  - `fullcount=true` can expose `results_fullcount`, but the docs warn it is unavailable on some heavy methods and should be used sparingly for performance reasons
- Rate limits:
  - no per-second or per-minute public quota is documented on the inspected pages
  - the docs say applications likely to exceed `500,000` hits should contact `api@jamendo.com`
  - response code `6` means rate limit exceeded

## Confirmed endpoint inventory
The official v3 docs expose 25 read routes, 5 write routes, and 2 OAuth helper routes for a confirmed total of **32 route patterns**.

### OAuth helper routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/oauth/authorize` | `client_id`, optional `redirect_uri`, optional `scope`, optional `response_type=code`, optional `state` | Starts OAuth authorization-code flow. Current documented scope is `music`. |
| POST | `/oauth/grant` | `client_id`, `client_secret`, `grant_type`, plus either `code` or `refresh_token` | SSL-only token endpoint used both for authorization-code exchange and refresh-token renewal. |

### Read routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/albums` | common read params + album filters | Album lookup/list endpoint. |
| GET | `/albums/file` | common read params + album identifiers | Album file-related endpoint in docs navigation. |
| GET | `/albums/tracks` | common read params + album identifiers | Returns tracks aggregated under album entities. |
| GET | `/albums/musicinfo` | common read params + album identifiers | Returns album music metadata/tags. |
| GET | `/artists` | common read params + artist filters | Artist lookup/list endpoint. |
| GET | `/artists/tracks` | common read params + artist identifiers | Returns tracks aggregated under artists. |
| GET | `/artists/albums` | common read params + artist identifiers | Returns albums aggregated under artists. |
| GET | `/artists/locations` | common read params + artist identifiers | Artist location endpoint. |
| GET | `/artists/musicinfo` | common read params + artist identifiers | Artist music metadata/tags endpoint. |
| GET | `/autocomplete` | `client_id`, text/query-style autocomplete input, common format params | Search-suggestion endpoint. |
| GET | `/feeds` | common read params | Feed-style discovery endpoint. |
| GET | `/playlists` | common read params + playlist filters | Playlist lookup/list endpoint. |
| GET | `/playlists/file` | common read params + playlist identifiers | Playlist file-related endpoint in docs navigation. |
| GET | `/playlists/tracks` | common read params + playlist identifiers | Returns tracks aggregated under playlists. |
| GET | `/radios` | common read params + radio filters | Radio discovery endpoint. |
| GET | `/radios/stream` | common read params + radio identifiers | Stream endpoint for a radio selection. |
| GET | `/reviews/albums` | common read params | Album reviews endpoint. |
| GET | `/reviews/tracks` | common read params | Track reviews endpoint; auth docs note some public-read routes may accept but not require `access_token`. |
| GET | `/tracks` | common read params + rich track search filters | Primary track discovery/search endpoint. |
| GET | `/tracks/file` | common read params + track identifiers | Track file-related endpoint in docs navigation. |
| GET | `/tracks/similar` | common read params + track identifiers | Similar-track recommendation endpoint. |
| GET | `/users` | common read params + user filters | User lookup/list endpoint. |
| GET | `/users/artists` | common read params + user identifiers/relations | Returns artists related to users. |
| GET | `/users/albums` | common read params + user identifiers/relations | Returns albums related to users. |
| GET | `/users/tracks` | common read params + user identifiers/relations | Returns tracks related to users. |

### Write routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/setuser/fan` | `client_id`, `access_token`, endpoint-specific target ID | Write endpoint under the `setuser` family; requires OAuth `music` scope. |
| POST | `/setuser/favorite` | `client_id`, `access_token`, `track_id` | Adds a track to the user favorites list. |
| POST | `/setuser/like` | `client_id`, `access_token`, endpoint-specific target ID | Write endpoint under the `setuser` family; requires OAuth `music` scope. |
| POST | `/setuser/dislike` | `client_id`, `access_token`, endpoint-specific target ID | Write endpoint under the `setuser` family; requires OAuth `music` scope. |
| POST | `/setuser/myalbum` | `client_id`, `access_token`, endpoint-specific target ID | Write endpoint under the `setuser` family; requires OAuth `music` scope. |

Confirmed route count: **32**.

## Parameter notes
### Common read parameters
The read-methods overview documents these shared parameters for almost all read routes:
- `client_id` — required on every read route
- `format` — `xml`, `json`, or `jsonpretty`
- `callback` — JSONP wrapper for JSON GET responses
- `offset` — pagination start position
- `limit` — max rows to return; default `10`, max `200`
- `order` — sortable fields vary by route; supports `_asc` and `_desc` suffixes
- `fullcount` — optional expensive total-count calculation where supported

The read-methods page also documents these shared behaviors:
- `/entity/subentity` routes inherit parent-entity parameter declarations unless explicitly overridden
- multi-value parameters accept space or `+` separated values
- aggregated subentity responses are capped at `400` total aggregated subentities
- entity results themselves are capped at `200`

### Notable `GET /tracks` filters from the official route page
The inspected `tracks` page explicitly documents these filters and modifiers:
- `id`, `name`, `namesearch`
- `type` with `single` and `albumtrack`
- `album_id`, `album_name`
- `artist_id`, `artist_name`
- `content_id_free`
- `datebetween`
- `featured`
- `imagesize`
- `audioformat`
- `audiodlformat`
- `tags`, `fuzzytags`
- `acousticelectric`, `vocalinstrumental`, `gender`

The same page also documents useful returned-field behavior:
- `audio` returns stream URLs
- `audiodownload` returns download URLs and is affected by the returned `audiodownload_allowed` boolean
- singles may have empty `album_id`, `album_name`, and `album_image`

### Write endpoint request format
The write-methods page documents these shared rules:
- all write endpoints use `POST`
- `Content-Type` must be `application/x-www-form-urlencoded`
- write access requires a Jamendo application on the `Read & Write` plan
- write endpoints require a logged-in user via OAuth 2.0
- protected methods require `access_token` with `music` scope

### OAuth timing and token parameters
The authentication docs state:
- authorization codes expire after `30` seconds
- access tokens are valid for `7200` seconds (`2` hours)
- refreshing uses the same `/oauth/grant` route with `grant_type=refresh_token`
- refresh responses return a new `access_token` and a new `refresh_token`

## Response, error, and format notes
- Every response document contains headers and results.
- The documented response headers are:
  - `status`
  - `code`
  - `error_message`
  - `warnings`
- Success uses response code `0`.
- Important documented error codes include:
  - `2` — unsupported HTTP method
  - `3` — parameter type/range/format error
  - `4` — missing required parameter
  - `5` — invalid client ID
  - `6` — rate limit exceeded
  - `7` — method not found
  - `9` — unknown output format
  - `11` — suspended application
  - `12` — invalid access token
  - `13` — insufficient scope
  - `21`–`24` — user / duplicate / playlist-related write errors
  - `101` — access code problem
- The docs say warnings do not fail the request.

## Important usage notes
- Jamendo describes the API as REST-like, not strictly RESTful.
- Route shape is `https://api.jamendo.com/<version>/<entity>/<subentity>/`.
- The docs recommend HTTPS everywhere and require SSL for the OAuth grant/token request.
- Search relevance on `/tracks` can be unintentionally overridden if `order` is set to something other than `relevance`; the docs suggest using `boost` instead when you want relevance plus popularity influence.
- Some public read routes such as `/reviews/tracks`, `/playlists`, or `/users` accept an `access_token` but do not require it.
- High-consumption applications are subject to manual review and possible temporary limitations according to the authentication page.

## fireROUTE integration notes
- Treat `client_id` as universal required auth for Jamendo, even on anonymous read routes.
- Model OAuth as a separate helper flow with one authorize route and one token route that supports two grant types.
- Expose shared read pagination/format parameters globally, then allow route-specific filters on top.
- Preserve Jamendo's aggregated subentity behavior on routes like `/playlists/tracks` and `/artists/albums`.
- Mark write routes as form-urlencoded POST operations that require `access_token` with `music` scope.

## Sources inspected
- `https://developer.jamendo.com/v3.0/docs`
- `https://developer.jamendo.com/v3.0/authentication`
- `https://developer.jamendo.com/v3.0/read-methods`
- `https://developer.jamendo.com/v3.0/response-codes`
- `https://developer.jamendo.com/v3.0/tracks`
- `https://developer.jamendo.com/v3.0/setuser/favorite`
