# SoundCloud

## Overview
- Provider: SoundCloud API
- Category: Music
- Official docs: `https://developers.soundcloud.com/docs/api/guide`
- API base URL: `https://api.soundcloud.com`
- Auth base URL: `https://secure.soundcloud.com`
- Auth: OAuth 2.1; PKCE required for authorization-code flow; `Authorization: OAuth ACCESS_TOKEN` header for API requests
- HTTPS: yes
- Response format: JSON
- Pagination: modern collection endpoints support `limit` plus `linked_partitioning`; some older endpoints still expose deprecated `offset`
- Rate limits: documented play-stream quota plus token-issuance quotas; details below
- Confirmed route count: 63 total route patterns (61 method/path combinations in the official OpenAPI document, plus 2 OAuth helper endpoints documented in the guide)

## Confirmed endpoints

### OAuth and session helpers
| Method | Path | Notes |
|---|---|---|
| GET | `https://secure.soundcloud.com/authorize` | OAuth 2.1 authorization endpoint; requires `client_id`, `redirect_uri`, `response_type=code`, PKCE challenge, optional `state`. |
| POST | `https://secure.soundcloud.com/oauth/token` | Token exchange for `authorization_code`, `client_credentials`, and `refresh_token` grants. |
| POST | `/sign-out` | Official guide posts to `https://secure.soundcloud.com/sign-out`; the OpenAPI document also exposes `/sign-out`. |

### Me endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/me` | Authenticated user profile. |
| GET | `/me/activities` | Deprecated feed endpoint. |
| GET | `/me/activities/all/own` | Deprecated feed endpoint. |
| GET | `/me/activities/tracks` | Deprecated recent-track feed endpoint. |
| GET | `/me/feed` | Current authenticated feed endpoint. |
| GET | `/me/feed/tracks` | Current recent-track feed endpoint. |
| GET | `/me/likes/tracks` | Authenticated user liked tracks. |
| GET | `/me/likes/playlists` | Authenticated user liked playlists. |
| GET | `/me/followings` | Users followed by the authenticated user. |
| GET | `/me/followings/tracks` | Recent tracks from followed users. |
| GET | `/me/followings/{user_urn}` | Fetch followed user entry; deprecated in favor of `/users/{user_urn}`. |
| PUT | `/me/followings/{user_urn}` | Follow a user. |
| DELETE | `/me/followings/{user_urn}` | Unfollow a user. |
| GET | `/me/followers` | Followers of the authenticated user. |
| GET | `/me/followers/{follower_urn}` | Specific follower lookup; deprecated in favor of `/users/{user_urn}`. |
| GET | `/me/playlists` | Authenticated user playlists. |
| GET | `/me/tracks` | Authenticated user tracks. |
| GET | `/me/reposts/tracks` | Authenticated user track reposts. |
| GET | `/me/reposts/playlists` | Authenticated user playlist reposts. |

### Search and collection creation
| Method | Path | Notes |
|---|---|---|
| GET | `/tracks` | Track search. |
| POST | `/tracks` | Upload a new track. |
| GET | `/playlists` | Playlist search. |
| POST | `/playlists` | Create a playlist. |
| GET | `/users` | User search. |

### Playlist endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/playlists/{playlist_urn}` | Playlist detail. |
| PUT | `/playlists/{playlist_urn}` | Update playlist. |
| DELETE | `/playlists/{playlist_urn}` | Delete playlist. |
| GET | `/playlists/{playlist_urn}/tracks` | Playlist tracks. |
| GET | `/playlists/{playlist_urn}/reposters` | Playlist reposters. |

### Track endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/tracks/{track_urn}` | Track detail. |
| PUT | `/tracks/{track_urn}` | Update track metadata. |
| DELETE | `/tracks/{track_urn}` | Delete track. |
| GET | `/tracks/{track_urn}/preview` | Start preview playback. |
| GET | `/tracks/{track_urn}/streams` | Stream URL collection; must continue using auth. |
| GET | `/tracks/{track_urn}/comments` | List track comments. |
| POST | `/tracks/{track_urn}/comments` | Create a comment on a track. |
| GET | `/tracks/{track_urn}/favoriters` | Users who liked the track. |
| GET | `/tracks/{track_urn}/reposters` | Users who reposted the track. |
| GET | `/tracks/{track_urn}/related` | Related tracks. |

### Resolve and public user endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/resolve` | Resolve SoundCloud URLs to API resources. |
| GET | `/users/{user_urn}` | User detail. |
| GET | `/users/{user_urn}/favorites` | Deprecated liked-tracks endpoint; use `/users/{user_urn}/likes/tracks`. |
| GET | `/users/{user_urn}/followers` | User followers. |
| GET | `/users/{user_urn}/followings` | User followings. |
| GET | `/users/{user_urn}/followings/{following_urn}` | Deprecated single-following lookup. |
| GET | `/users/{user_urn}/playlists` | User playlists. |
| GET | `/users/{user_urn}/tracks` | User tracks. |
| GET | `/users/{user_urn}/web-profiles` | User external profile links. |
| GET | `/users/{user_urn}/likes/tracks` | User liked tracks. |
| GET | `/users/{user_urn}/likes/playlists` | User liked playlists. |
| GET | `/users/{user_urn}/reposts/tracks` | User track reposts. |
| GET | `/users/{user_urn}/reposts/playlists` | User playlist reposts. |

### Like and repost mutation endpoints
| Method | Path | Notes |
|---|---|---|
| POST | `/likes/tracks/{track_urn}` | Like a track. |
| DELETE | `/likes/tracks/{track_urn}` | Unlike a track. |
| POST | `/likes/playlists/{playlist_urn}` | Like a playlist. |
| DELETE | `/likes/playlists/{playlist_urn}` | Unlike a playlist. |
| POST | `/reposts/tracks/{track_urn}` | Repost a track. |
| DELETE | `/reposts/tracks/{track_urn}` | Remove a track repost; marked deprecated in the spec. |
| POST | `/reposts/playlists/{playlist_urn}` | Repost a playlist. |
| DELETE | `/reposts/playlists/{playlist_urn}` | Remove a playlist repost. |

## Authentication and auth-helper notes
- The guide states OAuth 2.1 is required and PKCE is required for the authorization-code flow.
- Authorization URL parameters: `client_id`, `redirect_uri`, `response_type=code`, `code_challenge`, `code_challenge_method=S256`, and optional `state`.
- Token exchange endpoint: `POST https://secure.soundcloud.com/oauth/token`.
- Supported grants documented by the guide/OpenAPI pair: `authorization_code`, `client_credentials`, and `refresh_token`.
- Client-credentials requests must send `client_id` and `client_secret` through HTTP Basic auth; the guide explicitly says sending them in the request body is not supported for that flow.
- Access tokens expire in about 1 hour.
- Refresh tokens are single-use.
- The required API header is `Authorization: OAuth ACCESS_TOKEN`.

## Common parameters and payload notes
- Common pagination parameters: `limit` (1-200, default 50), deprecated `offset`, and recommended `linked_partitioning=true`.
- Search endpoints commonly use `q`, `urns`, `genres`, `tags`, `bpm[from|to]`, `duration[from|to]`, `created_at[from|to]`, and `access`.
- Playlist reads may use `show_tracks` and `secret_token`.
- Resolve requires `url`.
- Track/playlist privacy access filters use `access` values from `playable`, `preview`, and `blocked`.
- Track upload requires multipart or form-style `track[title]` and `track[asset_data]`; many additional `track[...]` metadata fields are documented.
- Playlist creation/update supports JSON or multipart forms with `playlist[title]`, `playlist[tracks][][urn]`, artwork, sharing, genre, tag list, and other metadata.
- Comment creation requires a JSON body under `comment.body` and optionally `comment.timestamp`.

## Rate limits
- Official rate-limit page: limits are per `client_id`.
- Exceeding a limit returns HTTP `429 Too Many Requests`.
- Play-stream requests are limited to 15,000 per 24-hour window.
- The rate-limit page says this applies to `/tracks/:id/stream`; the current OpenAPI surface documents playback via `/tracks/{track_urn}/preview` and `/tracks/{track_urn}/streams`, so playback-heavy integrations should still treat streaming access as quota-sensitive.
- The same official page says no global aggregate request limit is currently enforced.
- Client-credentials token issuance is limited to 50 tokens per 12 hours per app and 30 per hour per IP; the guide recommends reusing tokens and refreshing instead of repeatedly minting new ones.

## Pagination, errors, and response notes
- Modern collection responses return wrapper objects with `collection` and `next_href`.
- Deprecated endpoints may still return older array-style payloads (`TracksList`, `PlaylistsArray`, etc.).
- Common error responses use JSON objects with fields such as `code`, `message`, and `link`.
- The OpenAPI responses explicitly document `400`, `401`, `404`, `422`, and `429` for many routes.
- The sign-out guide section documents `400 bad_request` when the body is missing an access token and `401 unauthorized` when the session is already invalid.

## Important usage notes for fireROUTE
- Preserve the distinction between user-scoped routes (`/me`, mutations, uploads) and public-resource routes supported by client-credentials/search flows.
- Prefer `linked_partitioning` over deprecated `offset` pagination wherever the provider offers both.
- Carry through path variables as URNs, not plain numeric IDs; the current spec examples use values like `soundcloud:tracks:...` and `soundcloud:users:...`.
- Keep deprecated endpoints marked as such instead of treating them as primary routes.

## Sources inspected
- `https://developers.soundcloud.com/docs/api/guide`
- `https://developers.soundcloud.com/docs/api/explorer/open-api`
- `https://developers.soundcloud.com/docs/api/explorer/swagger-ui-init.js`
- `https://developers.soundcloud.com/docs/api/explorer/api.json`
- `https://developers.soundcloud.com/docs/api/rate-limits`
