# Radio Browser

## Overview
- Provider: Radio Browser community index
- Category: Music
- Official docs: `https://api.radio-browser.info/`
- Usage model: discover a working server from the Radio Browser network, then query that server directly
- Example server used in docs: `https://de1.api.radio-browser.info`
- Canonical path style: endpoints are available under both `/json/...` and `/xml/...`
- Auth: none
- HTTPS: yes
- Response formats: JSON and XML
- Pagination: list endpoints commonly use row-count variants and search/list filters rather than one uniform page envelope
- Rate limits: no numeric rate limit documented in the reviewed pages

## Network and usage notes
- The official docs explicitly say clients should first resolve `all.api.radio-browser.info` (or the `_api._tcp.radio-browser.info` SRV record), randomize the available servers, and retry on another server if one fails.
- The docs recommend sending a descriptive HTTP user-agent string.
- The docs also recommend sending `/json/url/...` requests whenever a user clicks a station so popularity data remains accurate.
- The docs warn not to rely on legacy numeric `id` fields across the server network; use UUID fields instead.

## Confirmed endpoint patterns

| Method | Path | Notes |
|---|---|---|
| GET | `/json/countries` | List countries. |
| GET | `/json/countrycodes` | List country codes. |
| GET | `/json/codecs` | List codecs. |
| GET | `/json/states` | List states/regions. |
| GET | `/json/languages` | List languages. |
| GET | `/json/tags` | List tags. |
| GET | `/json/stations` | Station listing. |
| GET | `/json/stations/search` | Search stations by multiple criteria. |
| GET | `/json/stations/byuuid` | Lookup stations by UUID. |
| GET | `/json/stations/byurl` | Lookup stations by stream URL. |
| GET | `/json/stations/byname/{name}` | Lookup by station name. |
| GET | `/json/stations/bycountry/{country}` | Lookup by country. |
| GET | `/json/stations/bycountryexact/{country}` | Exact country lookup. |
| GET | `/json/stations/bycountrycodeexact/{code}` | Exact country code lookup. |
| GET | `/json/stations/topclick/{rowcount}` | Top-clicked stations. |
| GET | `/json/stations/topvote/{rowcount}` | Top-voted stations. |
| GET | `/json/stations/lastclick/{rowcount}` | Recently clicked stations. |
| GET | `/json/stations/lastchange/{rowcount}` | Recently changed stations. |
| GET | `/json/stations/changed` | Changed stations feed. |
| GET | `/json/checks` | Station check results. |
| GET | `/json/checks/{stationuuid}` | Checks for one station. |
| GET | `/json/clicks` | Click history. |
| GET | `/json/clicks/{stationuuid}` | Clicks for one station. |
| GET | `/json/checksteps` | Check-step information. |
| GET | `/json/streamingservers` | Streaming-server list. |
| GET | `/json/url/{stationuuid}` | Stream-redirect URL/click tracking endpoint. |

The official server docs also expose parallel XML variants for the same route families under `/xml/...`.

## Response and schema notes
- The server docs publish a detailed `Station` struct including fields such as:
  - `stationuuid`
  - `name`
  - `url`
  - `url_resolved`
  - `homepage`
  - `favicon`
  - `tags`
  - `countrycode`
  - `languagecodes`
  - `votes`
  - `codec`
  - `bitrate`
  - `hls`
  - `lastcheckok`
  - `clickcount`
  - geo fields
- The docs explicitly mark the legacy `country` field as deprecated in favor of `countrycode`.

## Integration notes for fireROUTE
- Do not hard-code a single Radio Browser server; build server discovery/failover into the adapter.
- Prefer UUID-based station identifiers across all internal mappings.
- Use `/json/...` routes for canonical machine-readable integration unless XML is specifically required.

## Sources inspected
- `https://api.radio-browser.info/`
- `https://de1.api.radio-browser.info/`
