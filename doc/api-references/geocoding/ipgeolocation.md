# ipgeolocation

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipgeolocation`
- Official docs used manually:
  - `https://ipgeolocation.io/documentation.html`
  - `https://ipgeolocation.io/documentation/ip-location-api.html`
  - `https://ipgeolocation.io/documentation/api-authentication.html`
  - `https://ipgeolocation.io/documentation/api-response-formats.html`
- Public API base URL documented by provider for the IP geolocation surface: `https://api.ipgeolocation.io/v3`
- Transport: `HTTPS`
- Auth model: API key in query parameter `apiKey`; paid plans may also use Request Origin (`CORS`) auth for browser calls
- Response formats documented: `JSON` by default, `XML` via `output=xml` or `Accept: application/xml|text/xml`

## Product and access notes
- The inspected docs describe the IP Geolocation API as returning location, ASN, company, network, timezone, abuse, and optional security or user-agent enrichment for IPv4, IPv6, and domain inputs.
- The provider overview states that most endpoints require authentication and that `/v3/getip` is the no-auth exception; this file counts only the documented geolocation lookup routes, not the auxiliary caller-IP utility endpoint.
- The docs say all API endpoints are served over secure HTTPS.
- The docs say the Free plan has a hard limit of `1000 requests per day`.
- The docs also say paid plans do not have hourly, daily, monthly, or requests-per-minute throttles documented on the inspected pages; usage instead depends on plan credits and billed modules.

## Confirmed API surface
The inspected official docs confirm these `2` geolocation request patterns:
1. `GET /v3/ipgeo`
2. `POST /v3/ipgeo-bulk`

## Shared request rules
- Base route family: `https://api.ipgeolocation.io/v3`
- Authentication:
  - `apiKey` query parameter is the recommended auth method
  - Request Origin (`CORS`) auth is available on paid plans for browser requests
  - bulk lookups cannot use Request Origin auth; the docs explicitly require `apiKey` for bulk
- Output:
  - default response is `JSON`
  - use `output=xml` or an XML `Accept` header for XML responses
- Language:
  - default is English
  - docs list these language codes for localized geolocation output: `en`, `de`, `ru`, `ja`, `fr`, `cn`, `es`, `cs`, `it`, `ko`, `fa`, `pt`
  - the docs say non-English `lang` values require a paid plan and free/developer keys receive `401` if a non-English language is requested
- Field shaping:
  - `fields` returns only requested fields
  - `excludes` removes fields/modules from the response
  - `include` adds optional modules such as `geo_accuracy`, `dma_code`, `user_agent`, `security`, `abuse`, `hostname`, `liveHostname`, and `hostnameFallbackLive`

## 1) Single IP geolocation lookup
- Method: `GET`
- Path: `/ipgeo`
- Full URL pattern: `https://api.ipgeolocation.io/v3/ipgeo?apiKey=API_KEY&ip={ip_or_domain}`
- Purpose: geolocate one IPv4, IPv6, or domain input; if `ip` is omitted, the docs say the API geolocates the caller IP

Documented required/primary parameters:
- `apiKey` - API key unless using paid-plan Request Origin auth
- `ip` - IPv4, IPv6, or domain name; optional when using caller-IP mode

Documented optional parameters visible on the inspected page:
- `lang`
- `include`
- `fields`
- `excludes`
- `output`

Important official notes:
- One successful `200` response consumes `1` API credit before any paid add-on modules.
- The docs say the `X-Credits-Charged` response header reports the charged credits.
- The docs show extensive response sections including `location`, `country_metadata`, `currency`, `asn`, and `time_zone`, with optional `security`, `abuse`, `user_agent`, hostname, and geo-accuracy modules.

## 2) Bulk IP geolocation lookup
- Method: `POST`
- Path: `/ipgeo-bulk`
- Full URL pattern: https://api.ipgeolocation.io/v3/ipgeo-bulk?apiKey=API_KEY
- Purpose: geolocate multiple IPv4, IPv6, or domain inputs in one request

Documented request requirements:
- Authentication must use `apiKey`; the docs explicitly say bulk lookup cannot use Request Origin auth
- `Content-Type` must be `application/json`
- request body must include an `ips` JSON array

Documented body shape:
- `{"ips": ["91.128.103.196", "91.128.103.198", "example.com"]}`

Documented limits and options:
- up to `50,000` IP addresses or domains in one bulk request
- supports the same query parameters as single lookup: `include`, `excludes`, `fields`, `lang`, and `output`
- credits are calculated per valid submitted record, and the provider says bogon, private, and malformed IPs are not counted
- the docs say `X-Credits-Charged` returns the exact charge and `X-Successful-Record` appears when some submitted records are invalid

## Pagination, errors, rate limits, and format notes
- No pagination model is documented; this is a direct lookup API, not a list endpoint.
- Documented error/status behavior from the inspected error table:
  - `200` - successful request
  - `400` - invalid IP/domain, malformed bulk body, unsupported `lang`, or too many bulk records
  - `401` - missing/invalid key, disabled/expired subscription, free-plan access to paid-only modules or languages, or bulk called without proper auth
  - `404` - IP not found, wrong endpoint, or passing IP as a path segment instead of `ip=`
  - `405` - wrong HTTP method; docs say `GET` for `ipgeo` and `POST` for `ipgeo-bulk`
  - `413` - payload too large
  - `415` - bulk request without `Content-Type: application/json`
  - `423` - bogon/private-network IP
  - `429` - plan/quota exhausted
  - `499` - client closed request
  - `5xx` - provider-side server error
- Free-plan rate limit published in overview: `1000 requests per day`.
- The docs say paid plans do not have a published requests-per-minute cap on the inspected pages.

## Canonical fireROUTE notes
- Count only `/v3/ipgeo` and `/v3/ipgeo-bulk` as the confirmed geolocation surface here.
- The provider also documents `/v3/getip` as a no-auth utility endpoint, but it is a caller-IP helper rather than a geolocation response route and is therefore not counted in this geocoding file's route total.
- Preserve the free-vs-paid behavior around `lang`, `include`, and bulk access because these materially change authorization outcomes.
- Preserve field-selection controls (`fields`, `excludes`, `include`) rather than flattening to one fixed response schema.

## Verification notes
- This file was manually rebuilt from live official IPGeolocation documentation pages using browser tools only.
