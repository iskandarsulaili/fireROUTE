# Musixmatch

## Overview
- Provider: Musixmatch Pro API
- Category: Music
- Official docs home reviewed: `https://docs.musixmatch.com/overview`
- Official docs index reviewed: `https://docs.musixmatch.com/llms.txt`
- Official API methods reference reviewed: `https://docs.musixmatch.com/api-methods.md`
- Official OpenAPI document reviewed: `https://docs.musixmatch.com/openapi.json`
- Official developer portal reviewed: `https://developer.musixmatch.com/login`
- API base URL: `https://api.musixmatch.com`
- Shared path prefix: `/ws/1.1/`
- Auth: required `apikey` query parameter on essentially every API call
- Response formats: JSON-focused docs/OpenAPI; the official API-methods page also documents legacy `json` / `xml` output support for some routes, and subtitle-specific format selection via `subtitle_format`
- Pagination: supported on search/list/chart routes with `page` and `page_size`
- Rate limits: no numeric public quota published in the reviewed docs; official status code `402` is documented for usage-limit exhaustion or insufficient balance
- Confirmed route count: `27` method/path combinations

## Transport model
Musixmatch is not a single-parameter RPC endpoint like Last.fm. The current official OpenAPI file publishes distinct HTTP paths under the shared `/ws/1.1/` namespace on `https://api.musixmatch.com`.

## Confirmed endpoints

### Matcher
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/ws/1.1/matcher.track.get` | Match a song against the Musixmatch catalog. | `q_track`, `q_artist`, optional `track_isrc` |
| GET | `/ws/1.1/matcher.lyrics.get` | Get lyrics for a track by title/artist match. | `q_track`, `q_artist`, optional `track_isrc` |
| GET | `/ws/1.1/matcher.subtitle.get` | Get synced subtitles for a matched track. | `q_track`, `q_artist`, optional `track_isrc`, `f_subtitle_length`, `f_subtitle_length_max_deviation` |

### Track and lyrics catalog
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/ws/1.1/track.get` | Track metadata lookup. | one of `commontrack_id`, `track_isrc`, `track_spotify_id`, `track_itunes_id` |
| GET | `/ws/1.1/track.lyrics.get` | Full lyrics lookup for a track. | one of `commontrack_id`, `track_isrc`, `track_spotify_id`, `track_itunes_id` |
| GET | `/ws/1.1/track.subtitle.get` | Time-synced subtitle lookup. | `commontrack_id` or `track_id` or store IDs; optional `subtitle_format`, `f_subtitle_length`, `f_subtitle_length_max_deviation` |
| GET | `/ws/1.1/track.richsync.get` | Rich sync lookup with character-position offsets. | `commontrack_id` or `track_id` or store IDs; optional `f_richsync_length`, `f_richsync_length_max_deviation` |
| GET | `/ws/1.1/track.search` | Search tracks in the Musixmatch database. | query fields such as `q_track`, `q_artist`, `q_lyrics`, `q_track_artist`, `q_writer`, `q`; filters/sorts/pagination supported |
| GET | `/ws/1.1/track.snippet.get` | Retrieve a lyrics snippet. | one of `commontrack_id`, `track_id`, `track_isrc`, `track_spotify_id`, `track_itunes_id` |
| GET | `/ws/1.1/track.lyrics.translation.get` | Get translated lyrics for a track. | track identifier plus required `selected_language`; optional `min_completed` |
| GET | `/ws/1.1/track.subtitle.translation.get` | Get translated synced subtitles. | track identifier plus required `selected_language`; optional `min_completed`, subtitle-length filters |
| GET | `/ws/1.1/track.lyrics.analysis.get` | Retrieve lyrics-analysis data for a specific track. | `track_id` or `track_isrc` or `commontrack_id` |
| GET | `/ws/1.1/track.lyricslens.get` | Retrieve Lyrics Lens analysis data for a specific track. | `track_id` or `track_isrc` or `commontrack_id` |

### Artist and album catalog
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/ws/1.1/artist.get` | Artist metadata lookup. | required `artist_id` |
| GET | `/ws/1.1/artist.albums.get` | Albums for an artist. | required `artist_id`; optional `g_album_name`, `s_release_date`, `page`, `page_size` |
| GET | `/ws/1.1/artist.search` | Search artists. | optional `q_artist`, `f_artist_id`, `format`, `page`, `page_size` |
| GET | `/ws/1.1/album.get` | Album metadata lookup. | required `album_id` |
| GET | `/ws/1.1/album.tracks.get` | Tracks in an album. | required `album_id`; optional `f_has_lyrics`, `page`, `page_size` |

### Charts and taxonomy
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/ws/1.1/chart.tracks.get` | Top songs for a country/chart. | optional `country`, `chart_name`, `f_has_lyrics`, `page`, `page_size` |
| GET | `/ws/1.1/chart.artists.get` | Top artists for a country. | optional `country`, `page`, `page_size`, `format` |
| GET | `/ws/1.1/music.genres.get` | List supported music genres. | no route-specific parameters in the OpenAPI file |

### Enterprise and ingestion
| Method | Path | Purpose | Key parameters / body notes |
|---|---|---|---|
| POST | `/ws/1.1/track.lyrics.fingerprint.post` | Detect likely copyrighted lyrics in arbitrary text and return ranked matches. | query `size` and `limit`; JSON body contains `data.text` |
| POST | `/ws/1.1/work.post` | Submit a musical work and optional ownership/lyrics data. | JSON body under `data`; required `identifier` and `title`; optional `alternate_titles`, `iswc`, `isrc`, `performers`, `owners`, `collection`, `lyrics` |
| POST | `/ws/1.1/work.validity.post` | Submit/update deal validity dates for a work. | JSON body under `data`; required `identifier`, optional `validity_end` |
| GET | `/ws/1.1/languages.get` | List languages supported for lyrics, with optional romanization metadata. | optional `has_romanization` |
| GET | `/ws/1.1/tracks.dump.get` | Retrieve the latest catalog-feed dump list. | no route-specific parameters in the OpenAPI file |
| GET | `/ws/1.1/track.dump.get` | Retrieve track-related metadata for a single track in JSON form. | optional `track_isrc` |

## Authentication and request rules
- The official getting-started guide says you receive an API key after registration and must include it in requests as query parameter `apikey`.
- The official OpenAPI `securitySchemes` section confirms `apiKey` auth with:
  - `type: apiKey`
  - `in: query`
  - `name: apikey`
- The getting-started guide gives `GET /ws/1.1/track.get?apikey=YOUR_API_KEY` as the canonical example.
- The same guide says requests without a valid API key receive `401`.
- The API-methods page says all methods require authentication.
- The docs repeatedly instruct clients to encode arguments as `UTF-8`.

## Common parameters and identifiers
- Shared object identifiers used across many routes:
  - `track_id`
  - `artist_id`
  - `album_id`
  - `commontrack_id`
  - `track_isrc`
  - `track_spotify_id`
  - `track_itunes_id`
- Shared search/query fields documented in the API-methods page:
  - `q_track`, `q_artist`, `q_lyrics`, `q`
- Common filters/sorts documented across search/list routes:
  - `f_has_lyrics`
  - `f_music_genre_id`
  - `f_subtitle_length`
  - `f_subtitle_length_max_deviation`
  - `f_lyrics_language`
  - `f_artist_id`
  - `s_track_rating`
  - `s_artist_rating`
- `track.search` additionally exposes catalog-specific filters such as `q_track_artist`, `q_writer`, release-date range filters, and `f_music_genre_id`.
- `track.lyrics.translation.get` and `track.subtitle.translation.get` require `selected_language` and optionally accept `min_completed` to filter for partially or fully translated content.
- `chart.tracks.get` documents `chart_name` values `top`, `hot`, `mxmweekly`, and `mxmweekly_new`.
- `subtitle_format` is documented for subtitle retrieval; the OpenAPI notes `lrc` default and support for `mxm`, while the API-methods page documents `LRC / DFXP` output formats.

## Pagination, rate limits, and errors
- The API-methods page documents shared pagination parameters:
  - `page` default `1`
  - `page_size` default `10`, allowed range `1` to `100`
- Pagination is visible in the OpenAPI spec on `track.search`, `artist.albums.get`, `artist.search`, `album.tracks.get`, `chart.tracks.get`, and `chart.artists.get`.
- No numeric rate limit is publicly stated in the reviewed docs.
- The official checklist tells integrators to check their API-call limits before launch.
- The official status-code table publishes these response codes:
  - `200` success
  - `400` bad syntax / impossible request
  - `401` invalid or missing API key
  - `402` usage limit reached or insufficient balance
  - `403` unauthorized operation
  - `404` resource not found
  - `405` method not found
  - `500` server-side failure
  - `503` temporary system busy condition

## Response-format and content notes
- The API-methods page says every response includes a `status_code`.
- Official example payloads on the content-restrictions page use a nested envelope shaped like:
  - `message.header.status_code`
  - `message.header.execute_time`
  - `message.body...`
- The same examples show content restriction behavior through fields like `restricted` and omission/redaction of restricted lyric bodies.
- The current OpenAPI file is route-focused and does not publish detailed JSON response schemas for every operation, so payload structure still needs to be inferred from endpoint examples and content-policy pages.

## Important implementation notes from the official docs
- Musixmatch distinguishes between searching and matching:
  - use `track.search` / `artist.search` for discovery
  - use `matcher.track.get` and related matcher routes when mapping an existing catalog to Musixmatch data
- The implementation guide recommends matching by `ISRC` first when available.
- The official getting-started guide says many integrations only need `track.search` plus `track.lyrics.get`.
- The checklist and implementation pages require attribution/compliance steps when displaying lyrics:
  - show `lyrics_copyright`
  - honor country/content restrictions
  - add the lyrics-view tracking script
  - add the official “Lyrics powered by” image and link users to the returned `backlink_url`
- The docs warn not to rely on undocumented fields that appear in responses but are not documented in the examples.
- The enterprise section adds ingestion and feed workflows beyond the public read/search catalog.
- Commercial use is handled through Musixmatch pricing/contact flows; the getting-started page and terms pages separate non-commercial and business usage.

## fireROUTE integration notes
- Use `https://api.musixmatch.com` as the base host and preserve the published `/ws/1.1/` paths exactly.
- Always supply `apikey` as a query parameter.
- Treat route selection as real path selection, not as a single endpoint with a required `method` parameter.
- Expose pagination only on the routes that officially document `page` and `page_size`.
- Preserve enterprise POST request bodies for `track.lyrics.fingerprint.post`, `work.post`, and `work.validity.post`.
- Surface restriction/compliance metadata to downstream users because the official docs make display restrictions and tracking mandatory parts of implementation.

## Sources inspected
- `https://docs.musixmatch.com/overview`
- `https://docs.musixmatch.com/llms.txt`
- `https://docs.musixmatch.com/api-methods.md`
- `https://docs.musixmatch.com/openapi.json`
- `https://docs.musixmatch.com/getting-started.md`
- `https://docs.musixmatch.com/implementation-guidelines.md`
- `https://docs.musixmatch.com/checklist.md`
- `https://docs.musixmatch.com/content-restrictions.md`
- `https://developer.musixmatch.com/login`
