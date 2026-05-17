# TheAudioDB

## Overview
- Provider: TheAudioDB Free Music API
- Category: Music
- Official docs: `https://www.theaudiodb.com/free_music_api`
- Original index URL reviewed: `https://www.theaudiodb.com/api_guide.php` (`404` at review time)
- Base URLs:
  - v1: `https://www.theaudiodb.com/api/v1/json/{api_key}`
  - v2: `https://www.theaudiodb.com/api/v2/json`
- Auth:
  - v1 uses the API key in the URL path; the docs currently expose public test key `123`
  - v2 uses header auth: `X-API-KEY: YOUR_API_KEY`
  - v2 is documented as premium-only
- HTTPS: yes
- Response format: JSON
- Confirmed route count: `28`
  - v1 route patterns: `18`
  - v2 route patterns: `10`

## Confirmed endpoints
### v1 search
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/search.php` | `s` artist name | Search artist by name. Docs describe returning entity data plus an ID for later lookups. |
| GET | `/discography.php` | `s` artist name | Artist discography by artist name. |
| GET | `/discography-mb.php` | `s` MusicBrainz artist ID | Discography by MusicBrainz artist ID. |
| GET | `/searchalbum.php` | `s` artist name; optional `a` album name | Album lookup by artist, optionally narrowed by album title. |
| GET | `/searchtrack.php` | `s` artist name; `t` track name | Track search by artist and track name. |

### v1 lookup
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/artist.php` | `i` artist ID | Artist lookup by TheAudioDB artist ID. |
| GET | `/artist-mb.php` | `i` MusicBrainz artist ID | Artist lookup by MusicBrainz artist ID. |
| GET | `/artist-links.php` | `i` artist ID | Current live example link uses `/artist-links.php` for artist social/link data. |
| GET | `/album.php` | `i` artist ID | Album lookup using an artist ID. |
| GET | `/album.php` | `m` album ID | Album lookup using an album ID. |
| GET | `/album-mb.php` | `i` MusicBrainz release-group ID | Album lookup by MusicBrainz release-group ID. |
| GET | `/track.php` | `m` album ID | Track lookup by album ID. |
| GET | `/track.php` | `h` track ID | Track lookup by TheAudioDB track ID. |
| GET | `/track-mb.php` | `i` MusicBrainz recording ID | Track lookup by MusicBrainz recording ID. |

### v1 list and chart routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/mvid.php` | `i` artist ID | List music videos for an artist. |
| GET | `/mvid-mb.php` | `i` MusicBrainz artist ID | Music videos by MusicBrainz artist ID. |
| GET | `/track-top10.php` | `s` artist name | Top 10 songs for an artist by artist name. |
| GET | `/track-top10-mb.php` | `s` MusicBrainz artist ID | Top 10 songs for an artist by MusicBrainz artist ID. |
| GET | `/mostloved.php` | `format=track` | Loved-tracks chart. |
| GET | `/mostloved.php` | `format=album` | Loved-albums chart. |
| GET | `/trending.php` | `country`, `type`, `format=albums` | Trending albums example uses `country=us&type=itunes&format=albums`. |
| GET | `/trending.php` | `country`, `type`, `format=singles` | Trending singles example uses `country=us&type=itunes&format=singles`. |

### v2 search
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/search/artist/:artist_name` | path artist name | Search artist by text string. Docs show limit `10`. |
| GET | `/search/album/:album_name` | path album name | Search album by text string. Docs show limit `10`. |
| GET | `/search/track/:track_name` | path track name | Search track by text string. Docs show limit `10`. |

### v2 lookup
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/lookup/artist/:idArtist` | path artist ID | Full artist details by TheAudioDB artist ID. Docs show limit `1`. |
| GET | `/lookup/artist_mb/:musicbrainz_artist_id` | path MusicBrainz artist ID | Artist lookup by MusicBrainz ID. |
| GET | `/lookup/album/:idAlbum` | path album ID | Full album details by album ID. |
| GET | `/lookup/album_mb/:musicbrainz_release_group_id` | path MusicBrainz release-group ID | Album lookup by MusicBrainz release-group ID. |
| GET | `/lookup/track/:idTrack` | path track ID | Full track details by track ID. |
| GET | `/lookup/track_mb/:musicbrainz_recording_id` | path MusicBrainz recording ID | Track lookup by MusicBrainz recording ID. |

### v2 list
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/list/discography/:idArtist` | path artist ID | List an artist discography. Docs show limit `500`. |

## Auth, limits, and usage notes
- v1 is the older API and authenticates by embedding the API key in the path.
- The working public test key shown in the docs is `123`.
- v2 is the newer API and requires `X-API-KEY` in the request headers.
- The docs explicitly say v2 is premium-only.
- The v1 page shows per-route free/premium limits instead of a single global rate-limit policy:
  - search artist: free `1`, premium `10`
  - search album: free `1` for artist string, free `100` for album string example
  - search track: free `1`, premium `100`
  - artist/album/track lookups: free `1`, premium `1`
  - music videos: free `1`, premium `50`
  - charts / trending examples: free `1`, premium `10`
- The v2 page shows route-family limits in the docs UI:
  - search routes: `10`
  - lookup routes: `1`
  - list discography: `500`
- No general pagination model is documented on the current official page.

## Response, error, and format notes
- The official docs describe both API versions as JSON APIs.
- v1 is described as basic PHP-generated JSON objects.
- v2 docs say it returns standard HTTP response codes when something goes wrong.
- The current official page does not publish a detailed shared error schema.
- The OpenAPI / Swagger and Postman sections currently say `Coming soon...`, so the route list above is taken from the live endpoint examples on the working docs page.

## Important implementation notes
- The original README-linked URL `https://www.theaudiodb.com/api_guide.php` is currently dead; the working official replacement is `https://www.theaudiodb.com/free_music_api`.
- The v1 artist social-links example is inconsistent on the official page: the body text mentions `artist-social.php`, while the current live example link points to `/artist-links.php`. Treat that endpoint name carefully during implementation.
- The page states that IDs can usually be found from TheAudioDB frontend URLs, and those IDs are the preferred lookup inputs after initial search.
- Artwork/media assets live outside the JSON endpoints and are documented separately under the page’s Images section.

## fireROUTE integration notes
- Model v1 and v2 as separate auth modes even though they share the same product.
- Prefer v2 when premium credentials are available because it uses header auth and cleaner path-based routes.
- Keep v1 support for broad compatibility and the public test key workflow, but treat it as legacy.
- Preserve the MusicBrainz-ID variants because they are the cleanest bridge for external catalog matching.

## Sources inspected
- `https://www.theaudiodb.com/api_guide.php`
- `https://www.theaudiodb.com/`
- `https://www.theaudiodb.com/free_music_api`
