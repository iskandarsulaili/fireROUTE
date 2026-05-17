# Nominatim

## Provider metadata
- Category: `Geocoding`
- Provider slug: `nominatim`
- Official docs used manually:
  - `https://nominatim.org/release-docs/latest/api/Overview/`
  - `https://nominatim.org/release-docs/latest/api/Search/`
  - `https://nominatim.org/release-docs/latest/api/Reverse/`
  - `https://nominatim.org/release-docs/latest/api/Lookup/`
  - `https://nominatim.org/release-docs/latest/api/Details/`
  - `https://nominatim.org/release-docs/latest/api/Status/`
  - `https://operations.osmfoundation.org/policies/nominatim/`
- Public base URL documented by provider: `https://nominatim.openstreetmap.org`
- Transport: HTTPS
- Auth model: no API key; public usage is controlled by policy and identification requirements
- Response formats documented: `xml`, `json`, `jsonv2`, `geojson`, `geocodejson`, plus `text`/`json` for `/status`

## Public usage policy notes
Official policy for `nominatim.openstreetmap.org` states:
- absolute maximum: `1 request per second`
- clients must send a valid identifying `Referer` or `User-Agent`
- results should be cached client-side
- bulk geocoding is discouraged
- scripts running longer than a day or regularly repeated are restricted to `4 requests per minute`
- client-side autocomplete using the public API is explicitly forbidden
- the `/details` endpoint on the public host must not be used in scripts or bots

## Confirmed API surface
The official API overview lists these public endpoints:
- `GET /search`
- `GET /reverse`
- `GET /lookup`
- `GET /status`
- `GET /details`

Deprecated `.php` variants are still mentioned in the docs (`/search.php`, `/reverse.php`, `/lookup.php`, `/status.php`, `/details.php`) but are marked for future removal.

## 1) Search
- Method: `GET`
- Path: `/search`
- Full URL pattern: `https://nominatim.openstreetmap.org/search?<params>`
- Purpose: search OSM places by free-form text or structured address fields

### Search request forms
Free-form query:
- `q` - required free-form query string

Structured query fields:
- `amenity` - POI name/type
- `street` - house number and street name
- `city`
- `county`
- `state`
- `country`
- `postalcode`

### Search query parameters
Output format and pagination:
- `format` - one of `xml`, `json`, `jsonv2`, `geojson`, `geocodejson`; default `jsonv2`
- `json_callback` - JSONP callback name
- `limit` - number of results; default `10`

Output detail flags:
- `addressdetails` - `0`/`1`, default `0`
- `extratags` - `0`/`1`, default `0`
- `namedetails` - `0`/`1`, default `0`
- `entrances` - `0`/`1`, default `0`

Language / filtering:
- `accept-language` - defaults to `Accept-Language` header
- `countrycodes` - comma-separated country codes
- `layer` - comma-separated `address, poi, railway, natural, manmade`
- `featureType` - one of `country`, `state`, `city`, `settlement`
- `exclude_place_ids` - comma-separated place IDs / OSM IDs
- `viewbox` - `<x1>,<y1>,<x2>,<y2>`
- `bounded` - `0`/`1`, default `0`

Polygon / misc:
- `polygon_geojson`, `polygon_kml`, `polygon_svg`, `polygon_text` - each `0`/`1`
- `polygon_threshold` - floating-point simplification threshold, default `0.0`
- `email` - contact email
- `dedupe` - `0`/`1`, default `1`
- `debug` - `0`/`1`, default `0`

## 2) Reverse
- Method: `GET`
- Path: `/reverse`
- Full URL pattern: `https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>&<params>`
- Purpose: reverse geocode a WGS84 latitude/longitude pair into one best matching address/object

Required parameters:
- `lat`
- `lon`

Optional parameters:
- `format` - one of `xml`, `json`, `jsonv2`, `geojson`, `geocodejson`; default `xml`
- `json_callback` - JSONP callback name
- `addressdetails` - `0`/`1`, default `1`
- `extratags` - `0`/`1`, default `0`
- `namedetails` - `0`/`1`, default `0`
- `entrances` - `0`/`1`, default `0`
- `accept-language` - output language selection
- `zoom` - `0-18`, default `18`
- `layer` - comma-separated `address, poi, railway, natural, manmade`; default `address,poi`
- `polygon_geojson`, `polygon_kml`, `polygon_svg`, `polygon_text` - polygon geometry flags
- `polygon_threshold` - floating-point simplification threshold
- `email`
- `debug`

Zoom/address granularity table documented by provider includes examples such as:
- `3` country
- `5` state
- `8` county
- `10` city
- `18` building

Important note from docs:
- reverse geocoding returns the closest suitable indexed OSM object, not a mathematically exact address for the supplied point

## 3) Lookup
- Method: `GET`
- Path: `/lookup`
- Full URL pattern: `https://nominatim.openstreetmap.org/lookup?osm_ids=[N|W|R]<value>,...&<params>`
- Purpose: retrieve address/details for one or more known OSM objects

Required parameter:
- `osm_ids` - comma-separated list of node/way/relation IDs, each prefixed with `N`, `W`, or `R`

Lookup-specific notes:
- docs say up to `50` IDs can be queried at once

Optional parameters:
- `format` - one of `xml`, `json`, `jsonv2`, `geojson`, `geocodejson`; default `jsonv2`
- `json_callback`
- `addressdetails` - default `1`
- `extratags` - default `0`
- `namedetails` - default `0`
- `entrances` - default `0`
- `accept-language`
- `polygon_geojson`, `polygon_kml`, `polygon_svg`, `polygon_text`
- `polygon_threshold`
- `email`
- `debug`

Provider recommendation:
- use `geocodejson` if you need a more stable address-category structure than raw OSM tagging provides

## 4) Status
- Method: `GET`
- Path: `/status`
- Full URL pattern: `https://nominatim.openstreetmap.org/status`
- Purpose: health/status of service and update timestamp

Optional parameter:
- `format` - `text` or `json`; default `text`

Documented output behavior:
- successful text response: HTTP `200`
- text-mode errors: HTTP `500` with error message such as `ERROR: Database connection failed`
- JSON success example contains:
  - `status`
  - `message`
  - `data_updated`
  - `software_version`
  - `database_version`
- JSON error example contains `status` and `message`

## 5) Details
- Method: `GET`
- Path: `/details`
- Full URL patterns:
  - `https://nominatim.openstreetmap.org/details?osmtype=[N|W|R]&osmid=<value>&class=<value>`
  - `https://nominatim.openstreetmap.org/details?place_id=<value>`
- Purpose: detailed inspection of a stored place record

Identifier options:
- `osmtype` + `osmid` - required together for OSM-object lookup
- `class` - optional discriminator when one OSM object has multiple main tags
- `place_id` - alternative lookup identifier

Optional parameters documented:
- `json_callback`
- `addressdetails` - default `0`
- `keywords` - default `0`
- `linkedplaces` - default `1`
- `hierarchy` - default `0`
- `group_hierarchy` - default `0`
- `polygon_geojson` - default `0`
- `entrances` - default `0`
- `accept-language`

Important restriction:
- official docs explicitly say the public `/details` endpoint is for visual inspection/debugging and must not be used in scripts or bots on `nominatim.openstreetmap.org`

## Response / error notes
- Search and lookup can return multiple result objects.
- Reverse returns a single best result or an error if no OSM coverage exists.
- Place/object payloads commonly include IDs, name/display fields, location coordinates, and optional address breakdowns, extra tags, name details, and polygon geometries depending on flags.
- `/status` is the only endpoint with a text-mode response documented alongside JSON.

## Canonical fireROUTE notes
- This provider is not API-key authenticated but is tightly policy-restricted; treat policy compliance as mandatory.
- `accept-language` may come from either query string or request header behavior.
- Search supports both free-form `q` and structured field lookups; they should be normalized separately.
- Reverse `zoom` controls semantic granularity rather than map zoom only.
- `/details` should generally be excluded from automated production routing against the public host.

## Verification notes
This file was manually rebuilt from the live official Nominatim manual and official OpenStreetMap Foundation usage policy using browser tools.