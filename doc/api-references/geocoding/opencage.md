# OpenCage

## Provider metadata
- Category: `Geocoding`
- Provider slug: `opencage`
- Official docs used manually:
  - `https://opencagedata.com/`
  - `https://opencagedata.com/api`
- Public base URLs documented by provider:
  - `https://api.opencagedata.com/geocode/v1`
  - `https://api.opencagedata.com/ping`
- Transport: both HTTP and HTTPS are supported according to docs, but the provider strongly recommends HTTPS and requires TLS `1.2+` for HTTPS requests
- Auth model: API key required as query parameter `key`; no auth headers required
- Response formats documented: `json`, `geojson`, `xml`, and compatibility format `google-v3-json`

## Rate limits and access notes
From the inspected official homepage and API docs:
- free trial includes `2,500 geocoding API requests/day`
- the API uses rate limits to keep the service available to all users
- the docs include distinct sections for `Free Trial Limits`, `Paid Limits`, and `Hard vs Soft Limits`, confirming that usage enforcement differs by plan
- subscription customers can keep their existing key or create multiple active API keys

## Confirmed API surface
The inspected official docs expose these API operations/patterns:
- `GET /geocode/v1/json`
- `GET /geocode/v1/geojson`
- `GET /geocode/v1/xml`
- `GET /geocode/v1/google-v3-json`
- `GET /ping`

## 1) Core geocoding endpoint family
- Method: `GET`
- Path family: `/geocode/v1/{format}`
- Full URL pattern: `https://api.opencagedata.com/geocode/v1/{format}?q={query}&key={api_key}&...`
- Purpose: forward geocode addresses/placenames and reverse geocode latitude/longitude coordinates

Supported `format` values documented by provider:
- `json`
- `geojson`
- `xml`
- `google-v3-json` - a compatibility response for a subset of the Google v3 Geocoding API; docs say this format is a convenience, is not actively maintained, and may eventually be discontinued

Request rules documented by provider:
- requests must use `GET`
- non-GET requests return HTTP `405`
- invalid version numbers return HTTP `400`
- invalid format values return HTTP `400`

### Required parameters
- `key` - required 32-character API key; missing key returns status `401`
- `q` - required query string; either an address/placename for forward geocoding or a `latitude,longitude` pair for reverse geocoding

`q` notes from the official docs:
- must be URL encoded
- must be at least two characters long
- overly long queries fail with `400`
- impossible reverse-geocoding coordinates fail with `400 invalid coordinates`
- reverse results include `distance_from_q` as the distance in meters from the request coordinates to the result coordinates
- the docs explicitly say they do **not** support fuzzy matching for forward geocoding
- UN/LOCODE lookup is supported by prefixing queries with `LOCODE:`

### Optional parameters manually confirmed from the inspected docs
- `abbrv=1` - abbreviate/shorten formatted strings
- `address_only=1` - exclude POI names from the formatted value where possible
- `add_request=1` - echo request parameters back for debugging, with the key obfuscated
- `bounds=minLon,minLat,maxLon,maxLat` - forward-geocoding bounding box restriction
- `countrycode=xx[,yy]` - restrict forward geocoding to one or more ISO 3166-1 alpha-2 country/territory codes
- `language=<ietf-code|native>` - response language preference; otherwise docs say `Accept-Language` may be used, falling back to English
- `limit=<n>` - forward-geocoding result limit; default `10`, maximum `100`
- `no_annotations=1` - omit annotations unless `roadinfo=1` is also set
- `no_dedupe=1` - disable result deduplication
- `no_record=1` - do not log query contents
- `pretty=1` - pretty-print result documents
- `proximity=lat,lng` - bias forward-geocoding results toward a point
- `roadinfo=1` - attempt nearest-road matching and add road info annotations

## 2) JSON geocoding
- Method: `GET`
- Path: `/geocode/v1/json`
- Purpose: default structured OpenCage JSON response for forward and reverse geocoding

Official quick-start examples:
- reverse: `https://api.opencagedata.com/geocode/v1/json?q=52.5432379%2C+13.4142133&key=YOUR-API-KEY`
- forward: `https://api.opencagedata.com/geocode/v1/json?q=Frauenplan+1%2C+99423+Weimar%2C+Germany&key=YOUR-API-KEY`

## 3) GeoJSON geocoding
- Method: `GET`
- Path: `/geocode/v1/geojson`
- Purpose: GeoJSON response wrapper for the same geocoding query model

## 4) XML geocoding
- Method: `GET`
- Path: `/geocode/v1/xml`
- Purpose: XML response wrapper for the same geocoding query model

## 5) Google-compatibility geocoding
- Method: `GET`
- Path: `/geocode/v1/google-v3-json`
- Purpose: compatibility output modeled on a subset of the Google v3 Geocoding API

Important provider note:
- this compatibility format is not actively maintained and will likely be discontinued eventually

## 6) Operational status / ping
- Method: `GET`
- Path: `/ping`
- Full URL: `https://api.opencagedata.com/ping`
- Purpose: check API operational status

## Response and error notes
The official docs define the following status codes/messages for the geocoding API:
- `200` - OK, zero or more results may be returned
- `400` - invalid request, missing parameter, invalid coordinates, invalid version, or invalid format
- `401` - unable to authenticate because the API key is missing, invalid, or unknown
- `402` - valid request but quota exceeded
- `403` - forbidden, such as disabled API key or rejected IP address
- `404` - invalid API endpoint
- `405` - method not allowed
- `408` - timeout; request may be retried
- `410` - request too long
- `426` - upgrade required because TLS is unsupported/too old
- `429` - too many requests / rate limited
- `503` - internal server error

The docs say the response `status` element contains:
- `code`
- `message`

## Pagination and result-shape notes
- reverse geocoding returns at most one single result according to the docs
- forward geocoding may return multiple results
- forward result count is controlled with `limit`, up to `100`
- the docs include dedicated sections for ranking, confidence, ambiguous results, no-results cases, formatted strings, components, polygons/geometries, permanent IDs, and annotations

## Operational / usage notes
- The provider strongly recommends HTTPS even though HTTP remains technically supported.
- Use `countrycode`, `bounds`, and `proximity` to narrow forward geocoding and reduce ambiguity.
- If privacy matters, set `no_record=1` so the query contents are not logged.
- `google-v3-json` should be treated as a migration aid rather than a stable long-term integration target.
- Because the service reads `Accept-Language` when `language` is omitted, browser-originated requests can vary by client locale unless you pin `language` explicitly.

## Canonical fireROUTE notes
- Preserve OpenCage as one geocoding capability with multiple output-format routes plus a separate `/ping` status endpoint.
- Forward and reverse geocoding share the same endpoint family and are distinguished by the shape of `q`.
- `limit` applies to forward geocoding only; reverse geocoding is single-result.

## Verification notes
This file was manually rebuilt from the live official OpenCage homepage and geocoding API documentation using browser tools.