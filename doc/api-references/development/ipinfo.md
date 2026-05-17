# IPinfo

## Provider metadata
- Category: `Development`
- Provider slug: `ipinfo`
- Docs used manually:
  - `https://ipinfo.io/developers`
  - `https://ipinfo.io/developers/core-api`
  - `https://ipinfo.io/developers/batch-enrichment-api`
- Confirmed API base families:
  - `https://api.ipinfo.io`
  - `https://v4.api.ipinfo.io`
  - `https://v6.api.ipinfo.io`
  - legacy batch alias: `https://ipinfo.io/batch`
- Primary media types:
  - `application/json`
  - plaintext for field-filter lookups
- Authentication models:
  - HTTP Basic Auth using the token as username
  - `Authorization: Bearer YOUR_TOKEN`
  - query parameter `?token={token}`
- Manually confirmed routes in this pass: `6`

## Authentication
From the official developer docs:
- the API token can be sent as HTTP Basic Auth username
- the same token can be sent as a Bearer token
- the same token can also be sent as query parameter `token`
- examples are shown for all three auth styles on the official docs pages

## Common request and response conventions
- IPinfo’s updated APIs are served from `api.ipinfo.io`
- explicit transport-family host variants are documented:
  - `v4.api.ipinfo.io`
  - `v6.api.ipinfo.io`
- if no IP is provided, IPinfo supports `me` to resolve the caller/client IP
- field filters can be appended to the path, and scalar field requests return plaintext rather than JSON
- the docs show dual-stack access and explicit IPv4/IPv6 host selection

## Manually confirmed endpoint set

### 1) Lite lookup
- Method: `GET`
- Path pattern: `/lite/{target}`
- Full base example: `https://api.ipinfo.io/lite/me?token=YOUR_TOKEN`
- Purpose: free-tier country/continent/ASN lookup
- Path parameters confirmed:
  - `{target}` = `me`, IPv4 address, or IPv6 address
- Response notes:
  - JSON response for whole-resource lookups
  - official example fields include `ip`, `asn`, `as_name`, `as_domain`, `country_code`, `country`, `continent_code`, `continent`
- Usage notes:
  - the docs say IPinfo Lite has no request-quota restrictions

### 2) Lite filtered field lookup
- Method: `GET`
- Path pattern: `/lite/{target}/{field}`
- Full base example: `https://api.ipinfo.io/lite/8.8.8.8/country_code?token=YOUR_TOKEN`
- Purpose: return one filtered field or object from Lite
- Documented example field filters include:
  - `country`
  - `country_code`
  - `continent`
  - `continent_code`
  - `asn`
  - `as_name`
  - `as_domain`
  - `ip`
- Response notes:
  - field responses are returned as plaintext
  - object filters are returned as JSON

### 3) Core lookup
- Method: `GET`
- Path pattern: `/lookup/{target}`
- Full base example: `https://api.ipinfo.io/lookup/8.8.8.8?token=YOUR_TOKEN`
- Purpose: premium core lookup with geolocation, ASN, and network flags
- Path parameters confirmed:
  - `{target}` = `me`, IPv4 address, or IPv6 address
- Officially shown response fields include:
  - top level: `ip`, `is_anonymous`, `is_anycast`, `is_hosting`, `is_mobile`, `is_satellite`
  - `geo`: `city`, `region`, `region_code`, `country`, `country_code`, `continent`, `continent_code`, `latitude`, `longitude`, `timezone`, `postal_code`
  - `as`: `asn`, `name`, `domain`, `type`
- Transport notes:
  - the same path shape is supported on `v4.api.ipinfo.io` and `v6.api.ipinfo.io`

### 4) Batch enrichment on updated API
- Method: `POST`
- Path: `/batch`
- Full URL: `https://api.ipinfo.io/batch?token=YOUR_TOKEN`
- Purpose: submit up to `1,000` URL patterns/IP lookups in one request
- Request body formats documented:
  - JSON array
  - newline-separated text
  - space-separated text
- Content types/transport notes:
  - examples show raw body posting and `Content-Type: text/plain` for plain-text input
- URL-pattern inputs explicitly documented include:
  - `115.227.65.62`
  - `lookup/71.181.13.80`
  - `lite/157.47.66.225`
  - `lookup/74.75.228.56/anonymous`
  - `lite/23.1.118.150/country_code`
  - `resproxy/164.53.56.110`
  - `domains/1.1.1.1`
  - `ranges/nytimes.com`
  - `AS52188`
- Response notes:
  - returns a JSON object keyed by each input pattern
  - the docs state the batch request itself is not counted, but each URL inside it is counted as a request

### 5) Batch enrichment on Lite
- Method: `POST`
- Path: `/batch/lite`
- Full URL: `https://api.ipinfo.io/batch/lite?token=YOUR_TOKEN`
- Purpose: free-tier / Lite batch lookups
- Notes:
  - explicitly recommended for free-tier users
  - the docs say `/lookup`-based batch is paid and free tokens should use `/batch/lite`

### 6) Legacy batch enrichment
- Method: `POST`
- Path: `/batch/legacy`
- Full URLs documented:
  - `https://api.ipinfo.io/batch/legacy`
  - `https://ipinfo.io/batch`
- Purpose: legacy response schema and Privacy Extended compatibility
- Officially documented legacy path examples inside batch payloads include:
  - `<ip>/geo/city`
  - `<ip>/asn/name`
  - `<ip>/privacy/vpn`
  - `<ip>/company/name`
  - `<ip>/domains/total`
  - `<ip>/abuse/email`

## Pagination
- none documented on the reviewed lookup and batch pages

## Rate limits and quota notes
From the official developer docs:
- IPinfo Lite offers unlimited API access
- paid plans use monthly request limits with configurable alerts
- if usage exceeds the plan limit, the API returns HTTP `429`
- with metered billing enabled, usage can continue beyond the nominal plan limit without interruption
- for batch calls, each inner lookup counts individually toward request volume; the outer `/batch` call itself does not

## Errors and response notes
Documented or directly stated on the reviewed pages:
- `429` when plan request limits are exceeded
- free-tier users calling the paid `/lookup` batch surface are told they will get an error and should use `/batch/lite`
- field-filter lookups can return plaintext instead of JSON
- batch responses are JSON objects keyed by request input strings, and null-valued entries are possible unless `filter=1` is used

## Important usage notes
- IPinfo’s updated schema lives on `api.ipinfo.io`; the legacy `ipinfo.io` host remains relevant for the legacy batch endpoint
- the docs treat `me` as the canonical self-IP path token
- field filtering is path-based, not query-based
- the reviewed docs split the product into multiple paid data surfaces (`lookup`, `resproxy`, `ranges`, `domains`, etc.); this file only documents the routes directly confirmed from the reviewed official pages
- the batch endpoint accepts mixed URL patterns from multiple IPinfo products in a single request, including Lite lookups, general lookups, ranges, hosted domains, and ASN patterns

## Verification notes
This file was manually rebuilt from IPinfo’s official developer documentation using browser inspection only.