# GeoJS

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geojs`
- Official docs used manually:
  - `https://www.geojs.io/`
  - `https://www.geojs.io/docs/v1/endpoints/ip/`
  - `https://www.geojs.io/docs/v1/endpoints/country/`
  - `https://www.geojs.io/docs/v1/endpoints/geo/`
  - `https://www.geojs.io/docs/v1/endpoints/ptr/`
- Public API base URL: `https://get.geojs.io`
- Transport: HTTPS only
- Auth model: none
- Response formats documented: plain text, JSON, and JSONP depending on endpoint

## Service notes
The official homepage states that GeoJS provides:
- HTTPS only
- IPv4 and IPv6 support
- CORS support
- geo-routed/highly available service
- `No rate limits (yet)`

The homepage also says GeoJS geolocation data is sourced from MaxMind GeoLite.

## Confirmed API surface
The official endpoint documentation confirms these URI variants:
- `GET /v1/ip`
- `GET /v1/ip.json`
- `GET /v1/ip.js`
- `GET /v1/ip/country{/ip}`
- `GET /v1/ip/country/full{/ip}`
- `GET /v1/ip/country.json`
- `GET /v1/ip/country/{ip}.json`
- `GET /v1/ip/country.js`
- `GET /v1/ip/country/{ip}.js`
- `GET /v1/ip/geo.json`
- `GET /v1/ip/geo/{ip}.json`
- `GET /v1/ip/geo.js`
- `GET /v1/ip/geo/{ip}.js`
- `GET /v1/dns/ptr`
- `GET /v1/dns/ptr/{ip}`
- `GET /v1/dns/ptr.json`
- `GET /v1/dns/ptr/{ip}.json`
- `GET /v1/dns/ptr.js`
- `GET /v1/dns/ptr/{ip}.js`

For fireROUTE route counting, the manually confirmed public surface contains `19` explicit URI patterns as documented above.
If path-parameter variants are collapsed into route families, they reduce to 11 broader operation/format groups.

## 1) Caller IP as plain text
- Method: `GET`
- Path: `/v1/ip`
- Full URL: `https://get.geojs.io/v1/ip`
- Purpose: return the caller IP as plain text

Response notes:
- plain-text response only
- no query parameters are documented for this route

## 2) Caller IP as JSON
- Method: `GET`
- Path: `/v1/ip.json`
- Full URL: `https://get.geojs.io/v1/ip.json`
- Purpose: return the caller IP as JSON

Documented JSON property:
- `ip`

## 3) Caller IP as JSONP
- Method: `GET`
- Path: `/v1/ip.js`
- Full URL: `https://get.geojs.io/v1/ip.js`
- Purpose: return the caller IP wrapped in a JSONP callback

Query parameters:
- `callback` - optional JSONP callback name; default `geoip`

Documented JSONP example shape:
- `geoip({ "ip": "..." })`

## 4) Country lookup as plain text
- Method: `GET`
- Path patterns:
  - `/v1/ip/country`
  - `/v1/ip/country/{ip}`
  - `/v1/ip/country/full`
  - `/v1/ip/country/full/{ip}`
- Full URL patterns:
  - `https://get.geojs.io/v1/ip/country{/ip}`
  - `https://get.geojs.io/v1/ip/country/full{/ip}`
- Purpose: return country information for the caller IP or a specific IP in plain text

Path parameter:
- `ip` - optional path IP address

Behavior notes from docs:
- `/country` returns country code text output
- `/country/full` returns full country name text output
- examples show multi-line plain-text output when multiple IPs are supplied through query parameters

## 5) Country lookup as JSON
- Method: `GET`
- Path patterns:
  - `/v1/ip/country.json`
  - `/v1/ip/country/{ip}.json`
- Full URL patterns:
  - `https://get.geojs.io/v1/ip/country.json`
  - `https://get.geojs.io/v1/ip/country/{ip}.json`
- Purpose: return country details in JSON

Query parameters:
- `ip` - optional; docs say this allows searching multiple IPs at once

Documented response properties:
- `ip`
- `country` - 2-letter country code
- `country_3` - 3-letter country code
- `name` - English country name

Batching note:
- examples show that when multiple IPs are supplied, the response becomes a JSON array of result objects

## 6) Country lookup as JSONP
- Method: `GET`
- Path patterns:
  - `/v1/ip/country.js`
  - `/v1/ip/country/{ip}.js`
- Full URL patterns:
  - `https://get.geojs.io/v1/ip/country.js`
  - `https://get.geojs.io/v1/ip/country/{ip}.js`
- Purpose: return country details wrapped in JSONP

Query parameters:
- `ip` - optional; allows multiple IP lookups
- `callback` - optional JSONP callback name; default `countryip`

## 7) Full geo lookup as JSON
- Method: `GET`
- Path patterns:
  - `/v1/ip/geo.json`
  - `/v1/ip/geo/{ip}.json`
- Full URL patterns:
  - `https://get.geojs.io/v1/ip/geo.json`
  - `https://get.geojs.io/v1/ip/geo/{ip}.json`
- Purpose: return full geolocation metadata for the caller IP or a specific IP

Query parameters:
- `ip` - optional; docs say this allows multiple IP lookups

Documented response properties include:
- `ip`
- `country`
- `country_code`
- `country_code3`
- `continent_code`
- `city`
- `region`
- `latitude`
- `longitude`
- `accuracy`
- `timezone`
- `organization_name`
- `asn`
- `organization` - documented as deprecated

Important type note from docs:
- `latitude` and `longitude` are documented as strings for historical reasons

## 8) Full geo lookup as JSONP
- Method: `GET`
- Path patterns:
  - `/v1/ip/geo.js`
  - `/v1/ip/geo/{ip}.js`
- Full URL patterns:
  - `https://get.geojs.io/v1/ip/geo.js`
  - `https://get.geojs.io/v1/ip/geo/{ip}.js`
- Purpose: return full geolocation metadata wrapped in JSONP

Query parameters:
- `ip` - optional; allows multiple IP lookups
- `callback` - optional JSONP callback name; default `geoip`

## 9) PTR lookup as plain text
- Method: `GET`
- Path patterns:
  - `/v1/dns/ptr`
  - `/v1/dns/ptr/{ip}`
- Full URL patterns:
  - `https://get.geojs.io/v1/dns/ptr`
  - `https://get.geojs.io/v1/dns/ptr/{ip}`
- Purpose: return reverse-DNS PTR information in plain text

Path parameter:
- `ip` - optional IP address

## 10) PTR lookup as JSON
- Method: `GET`
- Path patterns:
  - `/v1/dns/ptr.json`
  - `/v1/dns/ptr/{ip}.json`
- Full URL patterns:
  - `https://get.geojs.io/v1/dns/ptr.json`
  - `https://get.geojs.io/v1/dns/ptr/{ip}.json`
- Purpose: return PTR lookup results as JSON

Query parameters:
- `ip` - optional; docs say this allows searching a specific PTR

Documented JSON field:
- `ptr`

## 11) PTR lookup as JSONP
- Method: `GET`
- Path patterns:
  - `/v1/dns/ptr.js`
  - `/v1/dns/ptr/{ip}.js`
- Full URL patterns:
  - `https://get.geojs.io/v1/dns/ptr.js`
  - `https://get.geojs.io/v1/dns/ptr/{ip}.js`
- Purpose: return PTR lookup results in JSONP

Query parameters:
- `ip` - optional
- `callback` - optional JSONP callback name; default `ptr`

Docs note:
- the PTR page’s query-parameter table appears to contain a small endpoint-label typo (`/v1/ip/geo.js` shown beside the callback row), but the documented PTR URIs and examples clearly use `/v1/dns/ptr.js`

## Response / batching notes
- Country and geo JSON/JSONP endpoints can return either a single object or an array when multiple IPs are supplied.
- IP lookup returns only the caller IP.
- PTR lookup returns PTR data rather than geolocation metadata.
- No pagination model is documented.

## Errors / rate limits
- The inspected docs do not publish a structured error schema.
- The homepage explicitly states `No rate limits (yet)`.
- No authentication or API key flow is documented.

## Canonical fireROUTE notes
- GeoJS is primarily an IP intelligence API rather than a conventional address geocoder.
- Format suffixes (`.json`, `.js`, plain text) are first-class parts of the documented public surface.
- Some endpoint families accept an IP in the path, others also support an `ip` query parameter for batch/multi-lookup usage.
- JSONP callback names differ by route family and should be preserved when supporting browser-script integrations.

## Verification notes
This file was manually rebuilt from the official GeoJS homepage and endpoint reference pages using browser tools.