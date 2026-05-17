# Spotify

## Overview
- Provider: Spotify Web API
- Category: Music
- Official docs: `https://developer.spotify.com/documentation/web-api`
- API base URL: `https://api.spotify.com/v1`
- Auth base URL: `https://accounts.spotify.com`
- Auth: OAuth 2.0; all Web API requests require authorization; user-private endpoints require user-granted scopes
- HTTPS: yes
- Response format: JSON for most routes; some mutation routes can return status-only responses such as `204 No Content`
- Pagination:
  - offset pagination is common on catalog/library routes via `limit` and `offset`
  - cursor-style pagination is used on some user/player routes via `before` / `after`
  - paging objects expose fields such as `href`, `limit`, `next`, `offset`, `previous`, and `total`
- Rate limits: Spotify enforces an app-wide rolling 30-second limit; exact ceiling varies by quota mode, with possible endpoint-specific exceptions
- Confirmed route count: 98 total route patterns (96 current method/path combinations in the official Web API reference navigation, plus 2 OAuth helper endpoints on the Spotify Accounts service)

## Confirmed endpoints

### OAuth helper endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `https://accounts.spotify.com/authorize` | Authorization Code / PKCE authorization endpoint. Official code-flow docs show query params `client_id`, `response_type=code`, `redirect_uri`, optional `state`, optional `scope`, and optional `show_dialog`. |
| POST | `https://accounts.spotify.com/api/token` | Token exchange / refresh endpoint. Official tutorials document `authorization_code`, `refresh_token`, and client-credentials usage on this path. |

### Albums
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/albums/{id}` | Get a single album. |
| GET | `/v1/albums` | Get several albums by `ids`. |
| GET | `/v1/albums/{id}/tracks` | Album tracks. |
| GET | `/v1/me/albums` | Current user's saved albums. |
| PUT | `/v1/me/albums` | Save albums for current user. |
| DELETE | `/v1/me/albums` | Remove saved albums. |
| GET | `/v1/me/albums/contains` | Check whether albums are saved. |
| GET | `/v1/browse/new-releases` | New releases browse feed. |

### Artists
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/artists/{id}` | Single artist lookup. |
| GET | `/v1/artists` | Multi-artist lookup by `ids`. |
| GET | `/v1/artists/{id}/albums` | Artist albums. |
| GET | `/v1/artists/{id}/top-tracks` | Artist top tracks. |
| GET | `/v1/artists/{id}/related-artists` | Related artists. |

### Audiobooks
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/audiobooks/{id}` | Single audiobook lookup. |
| GET | `/v1/audiobooks` | Multi-audiobook lookup by `ids`. |
| GET | `/v1/audiobooks/{id}/chapters` | Audiobook chapters. |
| GET | `/v1/me/audiobooks` | Current user's saved audiobooks. |
| PUT | `/v1/me/audiobooks` | Save audiobooks for current user. |
| DELETE | `/v1/me/audiobooks` | Remove saved audiobooks. |
| GET | `/v1/me/audiobooks/contains` | Check whether audiobooks are saved. |

### Chapters, episodes, and shows
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/chapters/{id}` | Single chapter lookup. |
| GET | `/v1/chapters` | Multi-chapter lookup by `ids`. |
| GET | `/v1/episodes/{id}` | Single episode lookup. |
| GET | `/v1/episodes` | Multi-episode lookup by `ids`. |
| GET | `/v1/me/episodes` | Current user's saved episodes. |
| PUT | `/v1/me/episodes` | Save episodes. |
| DELETE | `/v1/me/episodes` | Remove saved episodes. |
| GET | `/v1/me/episodes/contains` | Check whether episodes are saved. |
| GET | `/v1/shows/{id}` | Single show lookup. |
| GET | `/v1/shows` | Multi-show lookup by `ids`. |
| GET | `/v1/shows/{id}/episodes` | Show episodes. |
| GET | `/v1/me/shows` | Current user's saved shows. |
| PUT | `/v1/me/shows` | Save shows. |
| DELETE | `/v1/me/shows` | Remove saved shows. |
| GET | `/v1/me/shows/contains` | Check whether shows are saved. |

### Browse, search, markets, and genres
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/search` | Multi-type search route. |
| GET | `/v1/browse/categories` | Browse categories list. |
| GET | `/v1/browse/categories/{category_id}` | Single browse category. |
| GET | `/v1/browse/categories/{category_id}/playlists` | Category playlists. |
| GET | `/v1/browse/featured-playlists` | Featured playlists feed. |
| GET | `/v1/markets` | Available markets. |
| GET | `/v1/recommendations/available-genre-seeds` | Available recommendation genre seeds. |

### Generic library endpoints
| Method | Path | Notes |
|---|---|---|
| PUT | `/v1/me/library` | Save generic library items. |
| DELETE | `/v1/me/library` | Remove generic library items. |
| GET | `/v1/me/library/contains` | Check whether generic items are saved. |

### Playlists
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/playlists/{playlist_id}` | Playlist detail. |
| PUT | `/v1/playlists/{playlist_id}` | Change playlist details. |
| GET | `/v1/playlists/{playlist_id}/tracks` | Deprecated playlist-items read route still present in official docs. |
| PUT | `/v1/playlists/{playlist_id}/tracks` | Deprecated playlist-items update route. |
| POST | `/v1/playlists/{playlist_id}/tracks` | Deprecated playlist-items add route. |
| DELETE | `/v1/playlists/{playlist_id}/tracks` | Deprecated playlist-items remove route. |
| GET | `/v1/playlists/{playlist_id}/items` | Current playlist-items read route. |
| PUT | `/v1/playlists/{playlist_id}/items` | Current playlist-items update route. |
| POST | `/v1/playlists/{playlist_id}/items` | Current playlist-items add route. |
| DELETE | `/v1/playlists/{playlist_id}/items` | Current playlist-items remove route. |
| GET | `/v1/me/playlists` | Current user's playlists. |
| POST | `/v1/me/playlists` | Create playlist for current user. |
| GET | `/v1/users/{user_id}/playlists` | Public user's playlists. |
| POST | `/v1/users/{user_id}/playlists` | Create playlist for a user. |
| GET | `/v1/playlists/{playlist_id}/images` | Playlist cover image. |
| PUT | `/v1/playlists/{playlist_id}/images` | Upload custom playlist cover image. |
| PUT | `/v1/playlists/{playlist_id}/followers` | Follow playlist. |
| DELETE | `/v1/playlists/{playlist_id}/followers` | Unfollow playlist. |
| GET | `/v1/playlists/{playlist_id}/followers/contains` | Check if current user follows playlist. |

### Player
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/me/player` | Playback state. |
| PUT | `/v1/me/player` | Transfer playback. |
| GET | `/v1/me/player/devices` | Available devices. |
| GET | `/v1/me/player/currently-playing` | Currently playing item. |
| PUT | `/v1/me/player/play` | Start or resume playback. |
| PUT | `/v1/me/player/pause` | Pause playback. |
| POST | `/v1/me/player/next` | Skip to next track. |
| POST | `/v1/me/player/previous` | Skip to previous track. |
| PUT | `/v1/me/player/seek` | Seek to position. |
| PUT | `/v1/me/player/repeat` | Set repeat mode. |
| PUT | `/v1/me/player/volume` | Set playback volume. |
| PUT | `/v1/me/player/shuffle` | Toggle shuffle. |
| GET | `/v1/me/player/recently-played` | Recently played items. |
| GET | `/v1/me/player/queue` | Current queue. |
| POST | `/v1/me/player/queue` | Add item to playback queue. |

### Tracks, audio analysis, recommendations, and saved tracks
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/tracks/{id}` | Single track lookup. |
| GET | `/v1/tracks` | Multi-track lookup by `ids`. |
| GET | `/v1/me/tracks` | Current user's saved tracks. |
| PUT | `/v1/me/tracks` | Save tracks. |
| DELETE | `/v1/me/tracks` | Remove saved tracks. |
| GET | `/v1/me/tracks/contains` | Check whether tracks are saved. |
| GET | `/v1/audio-features` | Several tracks' audio features. |
| GET | `/v1/audio-features/{id}` | Single track's audio features. |
| GET | `/v1/audio-analysis/{id}` | Detailed audio analysis. |
| GET | `/v1/recommendations` | Recommendations. |

### Users, profile, top items, and follows
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/me` | Current user's profile. |
| GET | `/v1/me/top/{type}` | Current user's top artists or tracks. |
| GET | `/v1/users/{user_id}` | Public user profile. |
| GET | `/v1/me/following` | Get followed artists. |
| PUT | `/v1/me/following` | Follow artists or users. |
| DELETE | `/v1/me/following` | Unfollow artists or users. |
| GET | `/v1/me/following/contains` | Check whether current user follows artists or users. |

## Authentication and authorization notes
- The authorization concept page says Spotify implements OAuth 2.0 and supports these documented flows:
  - Authorization Code
  - Authorization Code with PKCE
  - Client Credentials
- The authorization summary table says:
  - Authorization Code: user resources yes, secret required yes, refresh yes
  - Authorization Code with PKCE: user resources yes, secret required no, refresh yes
  - Client Credentials: user resources no, secret required yes, refresh no
- The code-flow guide documents these authorization-request query parameters on `GET /authorize`:
  - required: `client_id`, `response_type=code`, `redirect_uri`
  - optional but strongly recommended: `state`
  - optional: `scope`, `show_dialog`
- The code-flow guide documents these form fields on `POST /api/token` for code exchange:
  - `grant_type=authorization_code`
  - `code`
  - `redirect_uri`
- The same guide requires these token-exchange headers:
  - `Authorization: Basic <base64 client_id:client_secret>`
  - `Content-Type: application/x-www-form-urlencoded`
- The refreshing-tokens guide documents these refresh fields on the same token route:
  - `grant_type=refresh_token`
  - `refresh_token`
  - `client_id` for PKCE-based refreshes
- The refresh guide says the `Authorization` header is only required for Authorization Code refreshes, while PKCE refreshes rely on `client_id` instead of a client secret.
- The official examples show `token_type: Bearer`, `expires_in: 3600`, and optionally a new `refresh_token`.
- Reference pages mark endpoint-specific access with OAuth 2.0 badges and require scopes for many user/player/library mutations.

## Common parameters and payload notes
- Common catalog lookup parameters include `id`, `ids`, `market`, and typed resource selectors like `type`.
- Search uses `q`, `type`, and commonly `limit`, `offset`, `market`, and `include_external` depending on resource type.
- Playlist and library mutations use request bodies or query arguments depending on route; playlist items endpoints accept item URIs and position/range controls.
- Player routes commonly use `device_id`, `position_ms`, `state`, `volume_percent`, and item/URI body payloads.
- Offset pagination example from the official saved-albums reference:
  - `limit` default `20`, min `1`, max `50`
  - `offset` default `0`
- Cursor pagination examples from official references:
  - `GET /v1/me/player/recently-played` uses `before` / `after` Unix timestamps in milliseconds plus `limit`
  - `GET /v1/me/following` uses required `type=artist`, optional `after`, and `limit`
- The album reference page also shows common market behavior: when both a user token and a `market` parameter are present, the user's account country takes precedence.

## Rate limits
- The official rate-limits page says Spotify calculates rate limits over a rolling 30-second window.
- Exceeding the limit returns HTTP `429 Too Many Requests`.
- The same page says the exact limit varies by quota mode:
  - development mode apps have a lower cap
  - extended quota mode apps have a much higher cap
- Spotify also warns that some endpoints have custom limits outside the global app-wide limit; the playlist-cover upload route is given as an example.
- The docs say `429` responses normally include a `Retry-After` header in seconds.
- Official guidance recommends:
  - applying for extended quota mode when needed
  - backoff/retry using `Retry-After`
  - using batch APIs such as multi-get routes
  - using playlist `snapshot_id`
  - studying request patterns in the dashboard
  - lazy-loading features

## Quota-mode and access notes
- The getting-started page currently states: `You need a Spotify Premium account to use the Web API.`
- The quota-modes page says new apps start in development mode.
- In development mode, up to 5 authenticated Spotify users can use the app, and each must be allowlisted.
- The quota page says users who are not allowlisted may still log in, but API requests with their tokens can return `403`.
- The same page says extended quota mode removes the development allowlist and supports unlimited users.
- The current quota page also says that as of May 15 2025, Spotify only accepts quota-extension applications from organizations, not individuals.

## Errors, status codes, and response notes
- The API-calls concept page says requests use standard UTF-8 HTTP methods: `GET`, `POST`, `PUT`, and `DELETE`.
- The same page says Spotify Web API normally returns JSON in the response body.
- Officially documented status codes: `200`, `201`, `202`, `204`, `304`, `400`, `401`, `403`, `404`, `429`, `500`, `502`, `503`.
- The API-calls page documents two error-object formats:
  - authentication errors with `error` and `error_description`
  - regular API errors with `error.status` and `error.message`
- The docs show auth/token failures following RFC 6749 semantics.
- The docs also describe conditional requests and caching behavior on many responses.

## Important usage notes for fireROUTE
- Treat Spotify as two connected surfaces: OAuth endpoints on `accounts.spotify.com` and resource routes on `api.spotify.com/v1`.
- Preserve the distinction between public catalog access that can use app auth and user/private playback-library routes that require user-granted scopes.
- Keep both deprecated playlist `/tracks` routes and current `/items` routes available if fireROUTE exposes low-level passthrough access; the official docs still publish both.
- Favor batched multi-get routes (`/albums`, `/artists`, `/tracks`, `/episodes`, `/shows`, `/audiobooks`, `/chapters`) when possible because Spotify explicitly recommends batch APIs for rate-limit efficiency.
- Surface `Retry-After` from `429` responses and keep endpoint-specific throttles configurable.

## Sources inspected
- `https://developer.spotify.com/documentation/web-api`
- `https://developer.spotify.com/documentation/web-api/reference/get-an-album`
- `https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums`
- `https://developer.spotify.com/documentation/web-api/reference/get-recently-played`
- `https://developer.spotify.com/documentation/web-api/reference/get-followed`
- `https://developer.spotify.com/documentation/web-api/concepts/api-calls`
- `https://developer.spotify.com/documentation/web-api/concepts/authorization`
- `https://developer.spotify.com/documentation/web-api/tutorials/code-flow`
- `https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens`
- `https://developer.spotify.com/documentation/web-api/concepts/rate-limits`
- `https://developer.spotify.com/documentation/web-api/concepts/quota-modes`
