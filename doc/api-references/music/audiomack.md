# Audiomack

## Overview
- Provider: Audiomack Data API
- Category: Music
- Official docs: `https://audiomack.com/data-api/docs`
- Base URL: `https://api.audiomack.com/v1`
- Auth:
  - read endpoints can be called without a user access token, but the docs still assume OAuth 1.0a-signed requests from registered consumers
  - write/account endpoints require a valid OAuth 1.0a user access token
  - user authorization step happens on `https://audiomack.com/oauth/authenticate`
- HTTPS: required
- Response format: JSON for API responses; song-preview endpoint returns binary audio with `audio/mp4` or `audio/mpeg`
- Pagination:
  - many list endpoints support path-style pagination with `/page/{n}`
  - default page size is 20 items
  - many GET endpoints also accept `limit`; `limit=0` returns all results
  - notification feed pagination uses `paging_token`
- Filtering:
  - many GET routes accept `fields` to return only selected fields
  - nested field selection is supported with `field:subfield`
- Rate limits: no numeric public rate limit is published in the official docs

## Confirmed endpoints

### OAuth 1.0a flow
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v1/request_token` | OAuth-signed request; `oauth_callback` required | Creates a request token. Docs say request tokens are valid for 1 hour. |
| GET | `/oauth/authenticate` | `oauth_token` | Browser-based user authorization step on `audiomack.com`, not on `api.audiomack.com`. Request must not be signed beyond `oauth_token`. |
| POST | `/v1/access_token` | OAuth-signed request; `oauth_verifier` required | Exchanges authorized request token for an access token. Docs say access tokens expire after 1 year. |

### Music endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/music/:id` | optional `key` | Song or album lookup by Audiomack music ID. |
| GET | `/v1/music/(song|album)/(artist slug)/(song or album slug)` | optional `key` | Song or album lookup by artist slug + music slug. |
| GET | `/v1/music/preview/:id` | path `id` | Returns audio preview bytes. Docs list 200/403/405/408/422/503 outcomes. |
| GET | `/v1/music/recent` | optional `fields`, `limit`, `/page/{n}` | Most recent music feed. |
| GET | `/v1/music/(genre)/recent` | genre path segment; optional `fields`, `limit`, `/page/{n}` | Genre-specific recent music feed. |
| GET | `/v1/music/trending` | optional `fields`, `limit`, `/page/{n}` | Trending music feed. |
| GET | `/v1/music/(genre)/trending` | genre path segment; optional `fields`, `limit`, `/page/{n}` | Genre-specific trending feed. Docs explicitly mention `rap` and `electronic`. |
| PATCH | `/v1/music/(song|album)/(artist slug)/(song or album slug)` | `status=unplayable` | Flags a track/album as unplayable for moderator follow-up. |
| POST | `/v1/music/:id/play` | optional `session`, `album_id`, `playlist_id`, `hq`, `key` | Returns a short-lived streaming URL. Docs say `session` is required for play-stat tracking. |
| POST | `/v1/music/:id/ads` | `status` required | Tracks ad lifecycle events: `requested`, `loaded`, `started`, `skipped`, `completed`, `error`. |
| PUT | `/v1/music/:id/favorite` | OAuth user token | Favorites a song or album. Successful response is `204 No Content`. |
| DELETE | `/v1/music/:id/favorite` | OAuth user token | Unfavorites a song or album. Successful response is `204 No Content`. |
| PUT | `/v1/music/:id/repost` | OAuth user token | Reposts a song or album. Successful response is `204 No Content`. |
| DELETE | `/v1/music/:id/repost` | OAuth user token | Removes a repost. Successful response is `204 No Content`. |
| GET | `/v1/music/:id/metrics` | path `id` | Returns recent grouped event counters for the music object. |

### Artist endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/artist/(artist slug)` | artist slug | Retrieves artist profile details. |
| GET | `/v1/artist/(artist slug)/uploads` | optional pagination params | Artist uploads feed. |
| GET | `/v1/artist/(artist slug)/favorites` | optional `show`, `fields`, `limit`, `/page/{n}` | Favorites list. `show` can filter to `music`, `song`, `album`, or `playlist`. |
| GET | `/v1/artist/(artist slug)/favorites/search` | `q` required | Searches within artist favorites. |
| GET | `/v1/artist/(artist slug)/playlists` | optional `genre`, pagination | Lists artist playlists. |
| PUT | `/v1/artist/(artist slug)/follow` | OAuth user token | Follows an artist. Returns `204 No Content` on success. |
| DELETE | `/v1/artist/(artist slug)/follow` | OAuth user token | Unfollows an artist. Returns `204 No Content` on success. |
| GET | `/v1/artist/(artist slug)/following` | optional pagination | Artists followed by the target artist. |
| GET | `/v1/artist/(artist slug)/follows` | optional pagination | Followers of the target artist. |
| GET | `/v1/artist/(artist slug)/feed` | optional pagination | Feed of music relevant to the artist, including reposted items. |
| GET | `/v1/artist/:id/metrics` | path `id` | Recent grouped event counters plus `music_top10`. |
| GET | `/v1/artist/{artist_slug}/pinned` | artist slug | Reads an artist’s pinned songs/albums/playlists list. Docs say guests can read this. |
| POST | `/v1/artist/{artist_slug}/pinned` | JSON body array of pinned items | Adds one or more pinned items for the logged-in artist. |
| PUT | `/v1/artist/{artist_slug}/pinned` | JSON body array of pinned items | Replaces the pinned list; empty array clears all pinned items. |
| DELETE | `/v1/artist/{artist_slug}/pinned` | JSON body array of pinned items | Removes selected pinned items. Docs say total pinned count is limited to 4. |

### Charts, search, and stats
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/chart/(songs|albums|playlists)/(chart type)` | chart type `total`, `daily`, `weekly`, `monthly`, `yearly` | Global chart lookup. |
| GET | `/v1/(genre)/chart/(songs|albums|playlists)/(chart type)` | genre + chart type | Genre-specific charts. |
| GET | `/search` | `q` required; optional `show`, `sort`, `page`, `limit`, `genre`, `verified` | Cross-entity search for songs, albums, artists, or all music. |
| GET | `/search_autosuggest` | `q` required | Autosuggest search endpoint. |
| GET | `/v1/music/stats/token` | `device`, `music_id` required | Creates stats token used for later play/pageview reporting. |
| POST | `/v1/music/stats/(music id)` | `token`, `type` required | Records stats. `type` is `pv` or `play`. |

### Playlist endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/playlist/(genre)/trending` | genre path segment | Genre-specific trending playlists. |
| POST | `/v1/playlist` | `title`, `genre`; optional `private`, `music_id`, `image` | Creates playlist for authenticated user. Returns `201 Created` with `Location` header on success. |
| PUT | `/v1/playlist/:id` | `title`, `genre`; optional `music_id`, `private`, `image` | Edits playlist metadata and tracks. |
| DELETE | `/v1/playlist/:id` | playlist ID | Deletes playlist owned by authenticated user. Returns `204 No Content`. |
| POST | `/v1/playlist/(playlist id)/track` | `music_id` required | Adds one or more tracks to playlist. |
| DELETE | `/v1/playlist/(playlist id)/(music id)` | playlist ID + music ID | Removes a track from playlist. Returns `204 No Content`. |
| GET | `/v1/playlist/:id` | optional `fields` | Playlist lookup by playlist ID. Docs use `fields=title,image,track_count` for light info responses. |
| GET | `/v1/playlist/:artistSlug/:playlistSlug` | optional `fields` | Playlist lookup by artist slug + playlist slug. |
| PUT | `/v1/playlist/:id/favorite` | OAuth user token | Favorites a playlist. Returns `204 No Content`. |
| DELETE | `/v1/playlist/:id/favorite` | OAuth user token | Unfavorites a playlist. Returns `204 No Content`. |
| GET | `/v1/playlist/:id/metrics` | playlist ID | Returns recent grouped event counters for the playlist. |

### User/account endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/user` | OAuth user token | Returns authenticated user details. |
| POST | `/v1/user/register` | `email`, `artist_name`, `password`, `password2` | Registers a user and returns an access token plus user slug metadata. |
| POST | `/v1/user/forgot-password` | `email` required | Starts password recovery email flow. |
| GET | `/v1/user/playlists` | OAuth user token | Lists authenticated user playlists, including private playlists. |
| GET | `/v1/user/favorites` | OAuth user token | Lists authenticated user favorites. |
| GET | `/v1/user/feed` | OAuth user token | Lists authenticated user feed items. |
| GET | `/v1/user/uploads` | OAuth user token | Lists authenticated user uploads. |
| GET | `/v1/user/native-notifications` | optional `only_unseen`, `limit`, `paging_token` | Notification/activity feed with stream-style pagination and counters. |
| POST | `/v1/user/native-notifications/seen` | optional JSON body `for_all` | Marks unseen notifications as seen. Docs show `200 OK` empty body. |

Confirmed route count: **59** method/path combinations.

## Parameters and behavior notes
- Filtering:
  - `fields` can limit returned properties on many GET endpoints.
  - nested subfield selection uses `field:subfield` syntax.
- Pagination:
  - many list endpoints accept `/page/{n}` in the path.
  - docs say page numbering starts at 1.
  - `limit=0` requests all results on many list endpoints.
  - notifications use `paging_token` instead of numeric pages.
- Search-specific parameters:
  - `/search` supports `show`, `sort`, `page`, `limit`, `genre`, and `verified`.
- Stats tracking:
  - `GET /v1/music/stats/token` must be called before `POST /v1/music/stats/(music id)`.
  - the same token can be reused for multiple plays of the same item.
- Images:
  - default entity image size is `275x275`.
  - `image_size=original` requests the original image, up to `1600x1600`.

## Auth, rate-limit, and usage notes
- Official docs describe the API as OAuth 1.0a.
- Request tokens are valid for 1 hour.
- Access tokens expire 1 year after creation.
- The docs explicitly recommend using prebuilt OAuth libraries rather than implementing signing by hand.
- The docs do not publish a numeric rate limit.
- Write actions such as favorites, reposts, follows, playlist changes, user endpoints, and pinned-content mutations require a valid user access token.

## Response and error notes
- Standard API errors return JSON with:
  - `errorcode`
  - `message`
  - optional `description`
  - optional `errors`
- Published error-code examples include:
  - `1000` / `422` — music already favorited
  - `1001` / `422` — cannot unfavorite non-favorited music
  - `1002` / `404` — artist not found
  - `1003` / `401` — invalid OAuth signature or token problems
  - `1004` / `401` — endpoint requires valid access token
  - `1005` / `404` — song not found
  - `1006` / `503` — user details could not be retrieved
  - `1007` / `503` — could not create new access token
  - `1008` / `422` — validation failed
  - `1009` / `422` — username/password required for token retrieval
  - `1010` / `503` — artist details could not be retrieved
  - `1011` / `500` — password reset email could not be sent
- Preview endpoint has its own documented response matrix: `200`, `403`, `405`, `408`, `422`, `503`.
- Playlist creation docs additionally show `1017` / `503` for playlist creation failure.

## Important usage notes
- Streaming URLs returned by play/info endpoints are short-lived; the docs say music entity `streaming_url` values are valid for roughly 10 seconds and should be refreshed just before playback.
- The `session` parameter on the play endpoint is the key value for play-stat tracking; the docs suggest using a device identifier for mobile apps.
- Pinned-content APIs are capped at 4 total pinned items per artist.
- Notifications are documented as an activity feed and may add more activity types over time.
- Some docs examples use slug-based and ID-based variants for the same logical lookup; preserve both where they are separately documented.

## fireROUTE integration notes
- Treat Audiomack as an OAuth 1.0a provider with a mix of public reads and user-scoped writes.
- Preserve both ID-based and slug-based content lookups because the docs explicitly document both forms.
- For polling/list adapters, support both `/page/{n}` pagination and the notification-specific `paging_token` flow.
- Do not cache returned stream URLs for long periods; they are intentionally ephemeral.
- Keep the stats-token flow separate from playback itself because the docs require a token before recording stats events.

## Sources inspected
- `https://audiomack.com/data-api/docs`
- `https://audiomack.com/oauth/authenticate` (documented authorization step on the same official docs page)
