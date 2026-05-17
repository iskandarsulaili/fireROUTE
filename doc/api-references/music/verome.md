# Verome

## Overview
- Provider: Verome API
- Category: Music
- Official docs/source: `https://github.com/Kirazul/Verome-API`
- Live API/docs site: `https://verome-api.deno.dev/`
- Base URL: `https://verome-api.deno.dev`
- Auth: none documented; the live service responds with permissive CORS headers (`Access-Control-Allow-Origin: *`)
- HTTPS: yes
- Response format: JSON for API endpoints; the root path serves an HTML docs/tester UI
- Pagination: none documented on the official README or live docs UI
- Rate limits: none documented
- Confirmed route count: 21 current GET route patterns

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/search` | required `q`; optional `filter` | Search YouTube Music for songs, albums, or artists. |
| GET | `/api/search/suggestions` | required `q` | Autocomplete suggestions. |
| GET | `/api/yt_search` | required `q`; optional `filter` | Separate YouTube search route. |
| GET | `/api/songs/{videoId}` | path `videoId` | Song detail with linked artist/album data. |
| GET | `/api/albums/{browseId}` | path `browseId` | Album with tracks and artist context. |
| GET | `/api/artists/{browseId}` | path `browseId` | Artist detail plus discography. |
| GET | `/api/playlists/{playlistId}` | path `playlistId` | Playlist track listing. |
| GET | `/api/chain/{videoId}` | path `videoId` | Song → artist → albums chain lookup. |
| GET | `/api/related/{videoId}` | path `videoId` | Related songs. |
| GET | `/api/radio` | required `videoId` | Generates a radio mix from a seed song. |
| GET | `/api/similar` | required `title`, `artist` | Similar-track lookup. |
| GET | `/api/charts` | optional `country` | Country-based chart listing. |
| GET | `/api/trending` | optional `country` | Country-based trending listing. |
| GET | `/api/moods` | none documented | Mood categories. |
| GET | `/api/stream` | required `id` | Returns audio stream URLs. |
| GET | `/api/proxy` | required `url` | Audio proxy endpoint for CORS-safe playback. |
| GET | `/api/lyrics` | required `title`, `artist` | Synced lyrics in LRC-oriented flow. |
| GET | `/api/artist/info` | required `artist` | Artist info via Last.fm. |
| GET | `/api/track/info` | required `title`, `artist` | Track info via Last.fm. |
| GET | `/api/top/artists` | optional `country` | Top artists listing. |
| GET | `/api/top/tracks` | optional `country` | Top tracks listing. |

## Parameter and format notes
- Search routes use `q` as the main query string and `filter` to narrow results.
- Entity lookups use path IDs from upstream YouTube Music-style identifiers: `videoId`, `browseId`, and `playlistId`.
- Discovery endpoints use `country` where applicable.
- Streaming/proxy routes use `id` and `url` respectively.
- Lyrics and info endpoints use title/artist name pairs rather than opaque IDs.
- The official README describes JSON/error helpers and CORS handling in `src/helpers/response.ts`, but it does not publish a formal error schema.

## Upstream/data-source notes from official docs
- Search/content/discovery routes are built around YouTube Music plus YouTube fallback IDs.
- Synced lyrics are sourced via LRCLib.
- Artist and track info are sourced from Last.fm.
- Audio streaming is handled through Piped/Invidious proxy flows.
- The live UI markets the service as a music API for YouTube Music, lyrics, and streaming and exposes the same endpoint list as the README.

## Auth, rate-limit, pagination, and error notes
- No API key, OAuth flow, or bearer-token requirement is documented.
- No pagination controls are documented on the official README or live docs page.
- No numeric rate limits are published.
- No formal error object is documented, though the repository structure explicitly mentions JSON/error helper code.
- The live deployment advertises CORS support and allows `GET, POST, OPTIONS` at the HTTP header level, but the documented public API routes in the docs UI are all GET routes.

## Important usage notes for fireROUTE
- Treat Verome as an unofficial aggregation layer over multiple upstream music sources, not a single-provider canonical catalog.
- Preserve the mixed identifier styles (`videoId`, `browseId`, `playlistId`, `title`+`artist`) because they map to different upstream lookups.
- The proxy and stream routes should be treated as playback helpers, not normalized metadata endpoints.
- The live site title currently says `Virome API`, while the repository branding and slug are `Verome API`.

## Sources inspected
- `https://github.com/Kirazul/Verome-API`
- `https://raw.githubusercontent.com/Kirazul/Verome-API/master/README.md`
- `https://verome-api.deno.dev/`
