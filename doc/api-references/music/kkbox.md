# KKBOX

## Overview
- Provider: KKBOX Open API
- Category: Music
- Official docs: `https://developer.kkbox.com/#/`
- Official reference reviewed: `https://docs-en.kkbox.codes/docs`
- Machine-readable spec reviewed: `https://docs-en.kkbox.codes/openapi.yaml`
- Resource API base URL: `https://api.kkbox.com/v1.1`
- OAuth base URL: `https://account.kkbox.com`
- Auth:
  - all resource requests require OAuth 2.0 bearer auth
  - the official docs publish both client-credentials flow and authorization-code flow
  - docs/spec endpoints reviewed: `https://account.kkbox.com/oauth2/token` and `https://account.kkbox.com/oauth2/authorize`
- HTTPS: yes
- Response format: JSON
- Pagination: the published OpenAPI parameters show `offset` plus `limit`; `limit` defaults to `50`, has maximum `50`, and minimum `1`
- Territory handling: `territory` is a required query parameter on almost every content route; the published enum is `HK`, `JP`, `MY`, `SG`, `TW`
- Rate limits: no numeric rate limits were stated on the inspected official pages/spec

## Confirmed route inventory
The official `openapi.yaml` publishes 59 resource routes under `https://api.kkbox.com/v1.1`, and the docs additionally publish 2 OAuth helper endpoints on `account.kkbox.com`.

Confirmed route count: **61** total route patterns.

### OAuth helper endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `https://account.kkbox.com/oauth2/authorize` | Authorization-code flow endpoint from the published `oAuth2AuthCode` security scheme. |
| POST | `https://account.kkbox.com/oauth2/token` | Token endpoint used for client-credentials flow and auth-code token/refresh handling. |

### Resource route families
| Family | Count | Confirmed routes |
|---|---:|---|
| `Tracks` | 2 | `GET /tracks`, `GET /tracks/{track_id}` |
| `Recommendation` | 5 | `GET /tracks/{track_id}/recommended-tracks`, `GET /me/daily-recommended-tracks`, `GET /me/recommended-seed-tracks`, `GET /me/recommended-seed-tracks/{track_id}`, `GET /me/recommendations-from-listened` |
| `Albums` | 2 | `GET /albums/{album_id}`, `GET /albums/{album_id}/tracks` |
| `Artists` | 4 | `GET /artists/{artist_id}`, `GET /artists/{artist_id}/albums`, `GET /artists/{artist_id}/top-tracks`, `GET /artists/{artist_id}/related-artists` |
| `Playlists` | 14 | `GET /shared-playlists/{playlist_id}`, `GET /shared-playlists/{playlist_id}/tracks`, `GET /featured-playlists`, `GET /featured-playlists/{playlist_id}`, `GET /featured-playlists/{playlist_id}/tracks`, `GET /new-hits-playlists`, `GET /new-hits-playlists/{playlist_id}`, `GET /new-hits-playlists/{playlist_id}/tracks`, `GET /session-playlists`, `GET /session-playlists/{playlist_id}`, `GET /session-playlists/{playlist_id}/tracks`, `GET /charts`, `GET /charts/{playlist_id}`, `GET /charts/{playlist_id}/tracks` |
| `Categories` | 12 | `GET /featured-playlist-categories`, `GET /featured-playlist-categories/{category_id}`, `GET /featured-playlist-categories/{category_id}/playlists`, `GET /new-release-categories`, `GET /new-release-categories/{category_id}`, `GET /new-release-categories/{category_id}/albums`, `GET /radio-categories`, `GET /radio-categories/{category_id}`, `GET /radio-categories/{category_id}/tracks`, `GET /children-categories`, `GET /children-categories/{category_id}`, `GET /children-categories/{category_id}/playlists` |
| `Stations` | 4 | `GET /mood-stations`, `GET /mood-stations/{station_id}`, `GET /genre-stations`, `GET /genre-stations/{station_id}` |
| `Search` | 1 | `GET /search` |
| `Users` | 4 | `GET /users/{user_id}`, `GET /users/{user_id}/shared-playlists`, `GET /users/{user_id}/album-collection`, `GET /users/{user_id}/playlist-collection` |
| `Player` | 11 | `GET /me`, `GET /me/shared-playlists`, `GET /me/album-collection`, `GET /me/playlist-collection`, `GET /me/favorite`, `POST /me/favorite`, `GET /me/playlists`, `POST /me/playlists`, `GET /me/playlists/{playlist_id}`, `GET /me/playlists/{playlist_id}/tracks`, `POST /me/playlists/{playlist_id}/tracks` |

## Shared parameters and request notes
### Global/shared parameters from the official spec
- `territory` (query, required on most routes)
  - two-letter ISO-style territory code used to localize names, cover images, and availability
  - published enum: `HK`, `JP`, `MY`, `SG`, `TW`
- `offset` (query)
  - integer, minimum `0`
- `limit` (query on list routes)
  - integer, default `50`, maximum `50`, minimum `1`

### Search route
`GET /search` documents these query parameters:
- `q` — required search text
- `type` — required resource type selector
- `territory` — required
- `offset`
- `limit`
- `availability`

### Multi-track lookup
`GET /tracks` documents:
- `ids` — required comma-separated track ID list, maximum `100` IDs
- `territory` — required

### Auth model by route type
- Catalog/content routes generally allow either:
  - `oAuth2ClientCredentials`, or
  - `oAuth2AuthCode`
- User-specific `/me` routes require user context in practice and are the ones most relevant to the authorization-code flow
- The official getting-started guide explicitly shows client-credentials token acquisition with form-urlencoded POST data:
  - `grant_type=client_credentials`
  - `client_id`
  - `client_secret`

## Response, error, and pagination notes
- Responses are JSON throughout the published reference
- The docs examples show paged responses that include `paging` objects
- The spec exposes a shared paging schema and list controls via `offset` and `limit`
- The inspected examples show error objects shaped like:
  - `error.message`
  - `error.code`
- No global numeric rate-limit headers or quotas were stated on the inspected official docs pages

## Important usage notes
- The docs site is a RapiDoc shell whose `spec-url` points to the live official `openapi.yaml`; this file was used as the authoritative route source for this rewrite
- Resource routes are versioned through the server template `https://api.kkbox.com/v{version}` with default version `1.1`
- The docs' own examples consistently show `Authorization: Bearer ...` and `accept: application/json`
- Because `territory` is required almost everywhere, any fireROUTE adapter should surface it prominently instead of hiding it as an obscure optional parameter
- The provider mixes public-catalog access patterns with user-library/player features; keeping those separated in adapter design will make auth handling clearer

## fireROUTE integration notes
- Model KKBOX as two coordinated surfaces:
  - OAuth on `account.kkbox.com`
  - JSON resources on `api.kkbox.com/v1.1`
- Expose `territory`, `offset`, and `limit` as first-class shared parameters
- Distinguish catalog/search/read routes from `/me` mutation routes because their auth requirements differ operationally even when the OpenAPI security arrays list both schemes
- Expect pagination-style collection responses rather than fire-and-forget single payloads for most list endpoints

## Sources inspected
- `https://developer.kkbox.com/#/`
- `https://docs-en.kkbox.codes/docs`
- `https://docs-en.kkbox.codes/openapi.yaml`
