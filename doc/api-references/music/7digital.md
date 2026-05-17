# 7digital

## Overview
- Provider: 7digital API, now published through the MassiveMusic developer portal
- Category: Music
- Official docs: `https://docs.7digital.com/reference` (redirects to `https://docs.massivemusic.com/reference`)
- Primary API base URL: `https://api.7digital.com`
- Additional documented service hosts:
  - `https://stream.svc.7digital.net` for subscription, catalogue, locker, offline, and media-transfer streaming routes
  - `https://previews.7digital.com` for preview clips
  - `https://7digital-skippi.radio.7digital.net` for interactive radio routes
  - `http://media.geo.7digital.com` for documented purchased-download delivery routes
- Auth:
  - every request must include `oauth_consumer_key`
  - some endpoints also require an OAuth 1.0 signature and/or user ID, as indicated in the official docs
  - API keys are available only under commercial agreement
- HTTPS: yes for the main API and streaming hosts; the purchased-download examples in the docs are still published on `http://media.geo.7digital.com`
- Request format: GET query strings for read routes; POST requests default to `application/json` unless an endpoint says otherwise
- Response format: JSON or XML depending on request; media endpoints return binary media/playlist responses instead of JSON/XML
- Pagination: list routes share `page` and `pageSize`; default page is `1`, default page size is `10`, maximum `50`
- Rate limits: the docs only publish a concrete limit for non-live keys; responses include `X-RateLimit-Limit`, `X-RateLimit-Current`, and `X-RateLimit-Reset`, with the example limit shown as `4000` requests/day per API key

## Confirmed endpoints

### Status
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/1.2/status` | none documented beyond `oauth_consumer_key` | Service status check. |

### Catalogue search
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/track/search` | `q`, `country`, `page`, `pageSize`, `usageTypes` | Track search, weighted by popularity. |
| GET | `/release/search` | `q`, `country`, `page`, `pageSize`, `usageTypes` | Release search. |
| GET | `/artist/search` | `q`, `country`, `page`, `pageSize` | Artist search. |

### Artist catalogue
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/1.2/artist/details` | `artistId`, `country` | Artist details. |
| GET | `/1.2/artist/releases` | `artistId`, `country`, `page`, `pageSize` | Artist releases. |
| GET | `/1.2/artist/browse` | artist-name browse parameters, `page`, `pageSize` | Browse artists by name. |

### Release catalogue
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/1.2/release/details` | `releaseId`, `country` | Release details. |
| GET | `/1.2/release/details/batch` | batch release IDs, `country` | Batch release lookup. |
| GET | `/1.2/release/tracks` | `releaseId`, `country`, `page`, `pageSize` | Release track listing. |

### Track catalogue
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/1.2/track/details-1` | `trackId`, `country` | Track details. |
| GET | `/1.2/track/details/batch` | batch track IDs, `country` | Batch track lookup. |

### Media delivery: HTTP progressive / preview / offline / downloads
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `https://stream.svc.7digital.net/stream/subscription` | subscription auth and entitlement parameters | Subscription streaming via HTTP progressive delivery. |
| GET | `https://stream.svc.7digital.net/offline/subscription` | offline subscription auth/device parameters | Offline subscription streaming via HTTP progressive delivery. |
| GET | `https://stream.svc.7digital.net/stream/catalogue` | catalogue entitlement parameters | Catalogue/radio-use streaming via HTTP progressive delivery. |
| GET | `https://stream.svc.7digital.net/stream/locker` | locker entitlement parameters | ALC locker streaming via HTTP progressive delivery. |
| GET | `https://previews.7digital.com/clip/{trackId}` | path `trackId` | Preview clip streaming. |
| GET | `https://stream.svc.7digital.net/stream/subscription.m3u8` | subscription auth and entitlement parameters | Subscription streaming via HLS. |
| GET | `https://stream.svc.7digital.net/offline/subscription.m3u8` | offline subscription auth/device parameters | Offline subscription streaming via HLS. |
| GET | `https://stream.svc.7digital.net/stream/catalogue.m3u8` | catalogue entitlement parameters | Catalogue/radio-use streaming via HLS. |
| GET | `https://stream.svc.7digital.net/stream/locker.m3u8` | locker entitlement parameters | ALC locker streaming via HLS. |
| POST | `/1.2/user/unlimitedStreaming/offline` | device auth payload, OAuth signature, user context | Authorise device for offline streaming. |
| GET | `/1.2/user/unlimitedStreaming/offline` | OAuth/user/device context | Check offline-streaming device status. |
| GET | `/1.2/user/offlineclients` | OAuth/user context | List devices authorised for offline streaming. |
| GET | `http://media.geo.7digital.com/media/user/downloadtrack` | purchased track identifiers, OAuth/user context | Download a purchased track. |
| GET | `http://media.geo.7digital.com/media/user/download/release` | purchased release identifiers, OAuth/user context | Download a purchased release archive. |
| GET | `http://media.geo.7digital.com/media/user/download/purchase` | purchase ID, OAuth/user context | Download an entire purchase archive. |
| GET | `https://stream.svc.7digital.net/media/transfer` | transfer/auth parameters | Media transfer for content delivery. |

### Logging
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/1.2/user/subscription/log` | `userId`, `country`, stream event payload | Report a subscriber stream. |
| POST | `/1.2/catalogue/log` | catalogue stream payload | Report a catalogue stream. |
| POST | `/1.2/preview/log` | preview-playback payload | Report a preview stream. |

### Playlists
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/1.2/playlists` | playlist creation payload | Create playlist. |
| GET | `/1.2/playlists` | `page`, `pageSize`, OAuth/user context | List playlists. |
| GET | `/1.2/playlists/{playlistId}` | path `playlistId` | Retrieve playlist. |
| POST | `/1.2/playlists/{playlistId}` | path `playlistId`, replacement payload | Replace playlist. |
| DELETE | `/1.2/playlists/{playlistId}` | path `playlistId` | Delete playlist. |
| GET | `/1.2/playlists/{playlistId}/details` | path `playlistId` | Playlist details. |
| POST | `/1.2/playlists/{playlistId}/details` | path `playlistId`, detail-update payload | Update playlist details. |
| GET | `/1.2/playlists/{playlistId}/tracks` | path `playlistId`, `page`, `pageSize` | List playlist tracks. |
| POST | `/1.2/playlists/{playlistId}/tracks` | path `playlistId`, track payload | Add tracks to playlist. |
| DELETE | `/1.2/playlists/{playlistId}/tracks/{playlistTrackId}` | path `playlistId`, `playlistTrackId` | Remove playlist track. |
| POST | `/1.2/playlists/{playlistId}/tracks/{playlistTrackId}/move` | path `playlistId`, `playlistTrackId`, move payload | Move playlist track. |
| GET | `/1.2/user/playlists` | OAuth/user context, `page`, `pageSize` | Retrieve a user's playlists. |
| GET | `/1.2/user/playlists/groups` | OAuth/user context, `page`, `pageSize` | Retrieve a user's playlist groups. |
| POST | `/1.2/user/playlists/groups` | playlist-group payload | Create playlist group. |
| GET | `/1.2/user/playlists/groups/{playlistGroupId}` | path `playlistGroupId` | Retrieve playlist group. |
| POST | `/1.2/user/playlists/groups/{playlistGroupId}` | path `playlistGroupId`, playlist IDs | Add playlists to a playlist group. |
| PUT | `/1.2/user/playlists/groups/{playlistGroupId}` | path `playlistGroupId`, replacement payload | Replace playlist group. |
| DELETE | `/1.2/user/playlists/groups/{playlistGroupId}` | path `playlistGroupId` | Delete playlist group. |
| GET | `/1.2/playlists/tags` | OAuth/user context | Retrieve playlist tags. |
| POST | `/1.2/playlists/tags` | tag payload | Save playlist tags. |
| PUT | `/1.2/playlists/{playlistId}/favourites/{userId}` | path `playlistId`, `userId` | Favourite playlist. |
| DELETE | `/1.2/playlists/{playlistId}/favourites/{userId}` | path `playlistId`, `userId` | Unfavourite playlist. |

### Interactive radio
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `https://7digital-skippi.radio.7digital.net/listeningSession/start` | listening-session seed payload | Create a listening session. |
| DELETE | `https://7digital-skippi.radio.7digital.net/listeningSession/{listeningSessionId}` | path `listeningSessionId` | Delete a listening session. |
| GET | `https://7digital-skippi.radio.7digital.net/listeningSession/{listeningSessionId}/nextTrack` | path `listeningSessionId` | Get next track. |
| POST | `https://7digital-skippi.radio.7digital.net/listeningSession/{listeningSessionId}/{event}` | path `listeningSessionId`, `event` | Send playback events. |

### User management, subscriptions, and purchasing
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/1.2/user/create` | partner user creation parameters | Create a new partner user. |
| POST | `/1.2/user/unlimitedStreaming` | subscription payload | Create subscription. |
| GET | `/1.2/user/unlimitedStreaming` | OAuth/user context | Retrieve subscription status. |
| GET | `/1.2/user/deliveritem` | credit-item parameters, OAuth/user context | Credit purchased item. |
| GET | `/1.2/user/locker` | OAuth/user context, `page`, `pageSize` | Get user's locker. |
| DELETE | `/1.2/user/purchase/{purchaseid}/release/{releaseId}` | path `purchaseid`, `releaseId` | Report release refund. |
| DELETE | `/1.2/user/purchase/{purchaseid}/track/{trackid}` | path `purchaseid`, `trackid` | Report track refund. |

Confirmed route count: **64**.

## Auth and usage notes
- The docs require `oauth_consumer_key` on every request.
- Some routes also require an OAuth 1.0 signature and/or a user ID; the docs mark those requirements in the reference UI.
- When signing OAuth requests, the docs say to include request-body parameters in the signature base string only for single-part `application/x-www-form-urlencoded` bodies; JSON bodies should not be included.
- API access is commercial and not every endpoint is enabled for every partner account.

## Pagination and filtering notes
- Shared paging parameters are `page` and `pageSize`.
- Defaults: `page=1`, `pageSize=10`.
- Maximum `pageSize` is `50`.
- Search methods also document search/filter fields such as `q`, `country`, and `usageTypes`.

## Rate limits
- The docs explicitly describe daily per-key limits for non-live keys such as prototype or test keys.
- Example response headers published by the docs:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Current`
  - `X-RateLimit-Reset`
- The usage-limits page shows an example daily limit of `4000` requests for a rate-limited key.

## Response and error notes
- Standard API responses can be returned as JSON or XML.
- Successful API wrapper format:
  - `status`
  - `version`
  - `response_content`
- Media routes can return audio/media payloads instead of JSON/XML.
- Error responses return `status: error` plus an `error` object with `code` and `message`.
- The docs specifically call out error code `1008` for batch failures, with an `errors` array containing per-item `code`, `message`, and `index` values.
- Published error categories include `1xxx` validation/input failures such as missing parameters, invalid values, out-of-range values, and invalid enum values.

## fireROUTE integration notes
- Treat 7digital as a multi-host provider rather than a single-host REST API: catalogue and account calls use `api.7digital.com`, streaming uses `stream.svc.7digital.net`, preview clips use `previews.7digital.com`, purchased-download delivery uses `media.geo.7digital.com`, and interactive radio uses `7digital-skippi.radio.7digital.net`.
- Preserve method distinctions on shared paths like `/1.2/playlists/{playlistId}`, `/1.2/user/unlimitedStreaming/offline`, and `/1.2/user/unlimitedStreaming`.
- Keep preview/media routes in the provider route map even though they return binary content rather than JSON/XML.
- The current official docs live under MassiveMusic branding, but the service hosts and API routes still use the 7digital domain family.

## Sources inspected
- `https://docs.7digital.com/reference`
- `https://docs.massivemusic.com/reference/authentication`
- `https://docs.massivemusic.com/reference/request-format`
- `https://docs.massivemusic.com/reference/standard-responses`
- `https://docs.massivemusic.com/reference/error-responses`
- `https://docs.massivemusic.com/reference/usage-limits`
- `https://docs.massivemusic.com/reference/lists-paging`
