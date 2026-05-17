# Songlink / Odesli

## Overview
- Provider: Songlink API (Odesli)
- Category: Music
- Official docs: `https://www.notion.so/API-d0ebe08a5e304a55928405eb682f6741`
- Canonical docs host observed during review: `https://linktree.notion.site/API-d0ebe08a5e304a55928405eb682f6741`
- Version documented: `v1-alpha.1`
- Base URL: `https://api.song.link/v1-alpha.1`
- Auth: optional API key via `key` query parameter; requests are allowed without a key
- HTTPS: yes
- Response format: JSON
- Rate limits: `10 requests/minute` without an API key; docs say keyed usage receives higher limits
- Stability note: the provider labels this release as alpha and warns that request/response structures may change between versions

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/links` | either `url` or the trio `platform`, `type`, `id`; optional `userCountry`, `songIfSingle`, `key` | Resolve cross-platform links and metadata for a song or album. |

## Query parameter details
- `url` — URL of a supported song or album; docs recommend encoding it.
- `userCountry` — two-letter country code used for catalog matching; optional, defaults to `US`.
- `songIfSingle` — boolean, defaults to `false`; when `true`, single-song albums may be resolved as songs for better matching.
- `platform` — source platform name; required with `type` and `id` when `url` is not supplied.
- `type` — `song` or `album`; required with `platform` and `id` when `url` is not supplied.
- `id` — provider-native entity identifier; required with `platform` and `type` when `url` is not supplied.
- `key` — optional API key query parameter for higher limits/support.

## Supported platform notes
The reviewed docs explicitly list support for platform/entity matching across services including:
- `spotify`
- `itunes`
- `appleMusic`
- `youtube`
- `youtubeMusic`
- `google`
- `googleStore`
- `pandora`
- `deezer`
- `tidal`
- `amazonStore`
- `amazonMusic`
- `soundcloud`
- `napster`
- `yandex`
- `spinrilla`
- `audius`
- `anghami`
- `boomplay`
- `audiomack`
- `isrc`
- `upc`
- `bandcamp`

## Response structure notes
- The docs define these top-level response fields:
  - `entityUniqueId`
  - `userCountry`
  - `pageUrl`
  - `linksByPlatform`
  - `entitiesByUniqueId`
- `linksByPlatform` entries contain link metadata such as:
  - `entityUniqueId`
  - `url`
  - `nativeAppUriMobile`
  - `nativeAppUriDesktop`
- `entitiesByUniqueId` entries contain resolved entity metadata such as:
  - `id`
  - `type` (`song` or `album`)
  - `title`
  - `artistName`
  - `thumbnailUrl`
  - `thumbnailWidth`
  - `thumbnailHeight`
  - `apiProvider`
  - `platforms`

## Usage notes
- The docs say this is currently the only public endpoint.
- Versioning is part of the URL path; clients are expected to request a specific version.
- The docs request visible attribution that the integration is powered by Songlink.

## Error handling
- The reviewed Notion page does not publish a structured error schema or status-code matrix.
- Because the API is versioned and marked alpha, consumers should expect changes and handle unexpected response/error shapes defensively.

## Integration notes for fireROUTE
- Treat this as a metadata/link-resolution API rather than a streaming or catalog browsing API.
- Preserve the version segment in the upstream path because the docs require explicit version selection.
- The single-route surface makes this provider a good candidate for a thin passthrough adapter.

## Sources inspected
- `https://www.notion.so/API-d0ebe08a5e304a55928405eb682f6741`
- `https://linktree.notion.site/API-d0ebe08a5e304a55928405eb682f6741`
