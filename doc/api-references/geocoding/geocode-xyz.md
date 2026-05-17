# Geocode.xyz

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geocode-xyz`
- Official docs used manually:
  - `https://geocode.xyz/api`
- Public base URL documented by provider: `https://geocode.xyz`
- Transport: provider docs explicitly say both HTTP and HTTPS requests are supported
- Auth model: optional `auth` API key for higher-rate access; unauthenticated access is available but throttled
- Response formats documented: `html` default, `xml`, `json`, `jsonp`, `geojson`, `csv`

## Rate limits and access notes
From the official API page:
- unauthenticated traffic is throttled to no more than `1 request per second` for all unauthenticated users combined
- authenticated/API-key traffic allows up to `10 requests per second` per API key
- the provider says unauthenticated usage limits may change without notice

## Confirmed API surface
The official docs page exposes these distinct request patterns:
- `GET /{locate}`
- `GET /` with `locate=...`
- `POST /` with `locate=...`
- `GET /` with `scantext=...`
- `POST /` with `scantext=...`
- `GET /` with `streetname=...` and `region=...` for autocomplete suggestions

## Common request parameters
Required by lookup mode:
- `locate` - required for single geocoding/reverse-geocoding/IP-geolocation requests when not using the path form
- `scantext` - required for geoparsing requests

Documented output controls:
- `geoit` - output type selector; docs list `XML`, `JSON`, `JSONp`, `GeoJSON`, `CSV`
- `json=1` - JSON output shortcut
- `geojson=1` - GeoJSON output shortcut
- `callback` - JSONP callback name

Documented optional controls:
- `auth` - API key/authentication token
- `id` - caller-supplied transaction ID, returned in the response; max `15` bytes
- `strictmode` - reverse-geocoding shortcut to return core address components only
- `nostrict` - promiscuous mode to return lower-confidence matches too
- `sentiment` - sentiment analysis in geoparsing mode
- `moreinfo` - include more information such as timezone and elevation
- `region` - country/region bias/restriction for `locate` and `scantext`; supports ISO country codes, comma-separated lists, and some broader region names
- `citybias` - optional city-bias parameter documented for geocoding/geoparsing disambiguation
- `streetname` - autocomplete input for partial street or postcode text

## 1) Direct-path geocoding / reverse geocoding
- Method: `GET`
- Path pattern: `/{locate}`
- Full URL pattern: `https://geocode.xyz/{locate}?<format/options>`
- Purpose: forward geocode an address/place, reverse geocode `lat,lon`, or geolocate an IP address using a direct path segment

Official examples on the page include:
- reverse geocoding with the direct path form and `geoit=xml`, plus an `auth` query parameter when using a key
- forward geocoding with the direct path form and `json=1`, plus an `auth` query parameter when using a key

Usage notes:
- a `lat,lon` input is interpreted as reverse geocoding
- free-text place/address input is interpreted as forward geocoding
- docs also show IP-address geolocation as a valid `locate` input type

## 2) Parameterized single lookup
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://geocode.xyz/?locate={location}&<format/options>`
- Purpose: same single-location lookup as the direct-path form, but safer for long query strings

Official note:
- the provider recommends the parameterized `locate` form for long input strings to avoid `File name too long` errors

## 3) POST single lookup
- Method: `POST`
- Path: `/`
- Form/body parameters:
  - `locate` - required lookup target
  - output controls such as `geoit`
  - optional `auth`
- Purpose: forward geocoding, reverse geocoding, or IP lookup via POSTed form data

Official examples shown:
- forward geocoding with `locate="415 C'WEALTH AVE WEST Singapore"`
- reverse geocoding with `locate="55.6802779000,12.5900501000"`
- IP lookup with `locate="175.136.140.8"`

## 4) Geoparsing
- Methods: `GET`, `POST`
- Path: `/`
- Full GET pattern: `https://geocode.xyz/?scantext={text}&<format/options>`
- Purpose: detect and geocode location names inside free text

Required parameter:
- `scantext` - free-form text containing locations

Important notes from the docs:
- geocoding returns one highest-probability location
- geoparsing returns all matched locations ordered by confidence score
- adding `sentiment=analysis` enables sentiment analysis in geoparsing mode

## 5) Autocomplete / suggestions
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://geocode.xyz/?region={code}&streetname={partial}&geoit={format}`
- Purpose: return suggestions for partial street names, city names, and postal codes

Documented parameters:
- `streetname` - partial street name or postal code input
- `region` - country/region scope such as `DE`
- standard output parameters such as `geoit`

Official notes:
- docs say this mode can return autocomplete results for the most likely street/city names and zip/postal codes
- suggestion-style responses may include `matches`, `error.code`, `error.description`, and a `suggestion` object

## Error and suggestion notes
The official API page lists these documented error codes:
- `002` - auth has run out of credits
- `003` - authentication token not found
- `005` - postal code is not in proper format
- `006` - request throttled
- `007` - supply a valid query
- `008` - request produced no results

Additional official behavior notes:
- when no coordinates are produced, `latt` and `longt` will be empty
- failed/ambiguous lookups can include one or more `suggestion` values to retry
- the docs show suggestion responses for autocomplete/postcode lookups with `error.code` `008`

## Response-format notes
The provider documents these output modes:
- `html` when no explicit output parameter is supplied
- `xml`
- `json`
- `jsonp` via `json=1` plus `callback`
- `geojson`
- `csv`

The docs also state that geocoding/geoparsing use Web Mercator / WGS 84 Pseudo-Mercator as the CRS.

## Pagination
- No page-number, cursor, or offset pagination model was documented on the inspected API page.
- Forward geocoding returns a single best match, while geoparsing and autocomplete can return multiple matches/suggestions in one response.

## Operational / usage notes
- Use `region` whenever possible to reduce ambiguity for duplicated postal codes or addresses across countries.
- The docs explicitly say Geocode.xyz does **not** only work for street addresses; `locate` can also accept postal codes, landmarks, city names, IP addresses, or coordinates.
- For long request strings, prefer `?locate=` or POST rather than stuffing the full query into the path.
- `strictmode` and `nostrict` materially change matching behavior and should be exposed as advanced adapter options rather than hard-coded defaults.

## Canonical fireROUTE notes
- This provider is a parameter-driven API centered on a single root host rather than many resource paths.
- `scantext` geoparsing and `streetname` autocomplete should be preserved as distinct fireROUTE operations even though they share `/`.
- Treat API-key auth as optional-but-important because it changes throughput from the shared unauthenticated pool to per-key quotas.

## Verification notes
This file was manually rebuilt from the live official Geocode.xyz API page using browser tools.