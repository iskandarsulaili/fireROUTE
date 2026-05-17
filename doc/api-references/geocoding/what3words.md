# What3Words

## Provider metadata
- Category: `Geocoding`
- Provider slug: `what3words`
- Official docs used manually:
  - `https://developer.what3words.com/public-api/docs`
  - `https://developer.what3words.com/public-api/docs#api-error-rates-and-plans`
- Documented API base URL: `https://api.what3words.com/v3`
- Transport: HTTPS GET only
- Auth model: API key required, supplied either as `key` query parameter or `X-Api-Key` header
- Response formats documented: JSON and GeoJSON for selected endpoints
- CORS note from provider: responses include `Access-Control-Allow-Origin: *`

## Confirmed API surface
The official public API docs describe these core REST endpoints:
- `GET /convert-to-3wa`
- `GET /convert-to-coordinates`
- `GET /autosuggest`
- `GET /grid-section`
- `GET /available-languages`

## Common provider notes
- all coordinates are WGS84 latitude,longitude pairs
- all latitudes must be in `-90` to `90`
- parameters should always be URL-encoded
- the API supports locale variants such as `oo_cy`, `oo_la`, `kk_cy`, `kk_la`, `mn_cy`, `mn_la`, `zh_tr`, `zh_si`

## 1) Convert coordinates to 3 word address
- Method: `GET`
- Path: `/convert-to-3wa`
- Full URL pattern: `https://api.what3words.com/v3/convert-to-3wa`
- Purpose: convert latitude/longitude to a three-word address

Documented parameters:
- `key` - required unless `X-Api-Key` header is used
- `coordinates` - required comma-separated latitude/longitude pair
- `language` - optional ISO 639-1 two-letter 3-word-address language code; defaults to `en`
- `format` - optional; `json` (default) or `geojson`
- `locale` - optional language-variant selector

Documented response description:
- returns the 3-word address, country, square bounds, nearby place, and a link to the what3words map site

## 2) Convert 3 word address to coordinates
- Method: `GET`
- Path: `/convert-to-coordinates`
- Full URL pattern: `https://api.what3words.com/v3/convert-to-coordinates`
- Purpose: convert a valid 3-word address into coordinates

Documented parameters:
- `key` - required unless header auth is used
- `words` - required 3-word address string
- `format` - optional; `json` (default) or `geojson`

Provider input rules documented for `words`:
- words must be separated by one of the supported dot-like characters
- the address may optionally be prefixed by `///`
- Vietnamese addresses have special spacing rules and styles must not be mixed

Documented response description:
- returns coordinates, country, square bounds, nearest place, and a map link

## 3) AutoSuggest
- Method: `GET`
- Path: `/autosuggest`
- Full URL pattern: `https://api.what3words.com/v3/autosuggest`
- Purpose: suggest/correct valid 3-word addresses from partial or noisy input

Documented parameters:
- `key` - required unless header auth is used
- `input` - required; at minimum the first two complete words plus at least one character from the third word
- `focus` - optional latitude/longitude used to weight nearby suggestions
- `clip-to-country` - optional comma-separated ISO 3166-1 alpha-2 country codes
- `clip-to-bounding-box` - optional `south_lat,west_lng,north_lat,east_lng`
- `clip-to-circle` - optional `lat,lng,kilometres`
- `clip-to-polygon` - optional closed polygon of comma-separated lat/lng pairs; provider limits this to `25` pairs
- `input-type` - optional; `text` (default), `vocon-hybrid`, `nmdp-asr`, or `generic-voice`
- `language` - optional for text, required for voice input
- `prefer-land` - optional boolean; default behavior prefers land
- `locale` - optional locale variant

Docs say AutoSuggest corrects:
- typing errors
- spelling errors
- misremembered words
- words in the wrong order

## 4) Grid section
- Method: `GET`
- Path: `/grid-section`
- Full URL pattern: `https://api.what3words.com/v3/grid-section`
- Purpose: fetch a 3m x 3m grid section for a bounding box

Documented parameters:
- `key` - required unless header auth is used
- `bounding-box` - required `lat,lng,lat,lng` as south,west,north,east
- `format` - optional; `json` (default) or `geojson`

Important provider note:
- requested bounding box must not exceed `4km` corner-to-corner or `BadBoundingBoxTooBig` is returned

## 5) Available languages
- Method: `GET`
- Path: `/available-languages`
- Full URL pattern: `https://api.what3words.com/v3/available-languages`
- Purpose: list supported 3-word-address languages and locale variants

Documented parameters:
- `key` - required unless header auth is used

Documented response description:
- returns language code, English name, and native name
- Bosnian-Croatian-Montenegrin-Serbian uses language code `oo` with locale variants `oo_cy` and `oo_la`

## Error / response notes
Documented HTTP status codes:
- `200` - success
- `400` - bad request, including invalid, missing, or duplicate parameters
- `401` - missing or invalid API key
- `402` - feature not available on current plan or convert-to-coordinates quota exceeded
- `404` - URL not found
- `405` - method not allowed; docs say you must use GET
- `50x` - internal server error

Provider error notes mention codes such as:
- `BadWords`
- `BadCoordinates`
- `BadLanguage`
- `BadFormat`
- `BadClipToPolygon`
- `MissingWords`
- `MissingInput`
- `MissingBoundingBox`
- `DuplicateParameter`

## Rate limits and plans
Official rate-limit table shows requests per second:

| Plan | AutoSuggest | Convert to coordinates | Convert to 3 word address | Grid | Available Languages |
|---|---:|---:|---:|---:|---:|
| Free | 10 | N/A | N/A | N/A | 200 |
| Basic | 200 | 200 | 200 | 200 | 200 |
| Standard | 200 | 200 | 200 | 200 | 200 |
| Plus | 200 | 200 | 200 | 200 | 200 |
| Premium | 200 | 200 | 200 | 200 | 200 |

Additional note from provider:
- if the rate limit is exceeded, the API returns HTTP `429 Too Many Requests`

## Canonical fireROUTE notes
- Auth can be normalized to either query-key or header-key mode.
- `convert-to-3wa` and `convert-to-coordinates` are direct inverses but expose different required parameters.
- `autosuggest` is the provider’s main fuzzy-input surface and includes strong geo-clipping controls.
- The free plan does not expose all endpoint families; plan-aware fallbacks matter.
- GeoJSON is opt-in with `format=geojson` rather than default content negotiation.

## Verification notes
This file was manually rebuilt from the live official what3words developer docs using browser tools.