# Apiip

## Provider metadata
- Category: `Geocoding`
- Provider slug: `apiip`
- Official docs used manually:
  - `https://apiip.net/`
  - `https://apiip.net/documentation`
- Public base URL documented by provider: `https://apiip.net/api`
- Transport: HTTPS is explicitly documented; the docs also mention HTTP with HTTPS available by appending `s`
- Auth model: API key in query parameter `accessKey`
- Response formats documented: `json`, `xml`; JSONP is supported with `callback`

## Product and access notes
- The official homepage positions Apiip as an IP geolocation and IP intelligence API for IPv4 and IPv6 addresses.
- The documentation says responses can include more than 40 data points across location, timezone, currency, languages, connection, user-agent, and security sections.
- The docs say the access key is a 36-character value issued after account creation.

## Confirmed API surface
The official documentation explicitly lists `3` API endpoint patterns:
1. `GET /check` with `ip=<single-ip-or-domain>` for standard lookup
2. `GET /check` with `ip=<comma-separated-list>` for bulk lookup
3. `GET /check` without `ip` for origin/requester-IP lookup

## Common query parameters
Documented shared parameters:
- `accessKey` - required API access key
- `fields` - optional response field filter; accepts a single field or comma-separated list
- `language` - optional response language code
- `callback` - optional JSONP callback function name
- `output` - optional output selector; `json` or `xml`

Important shared behavior from the docs:
- requests are HTTP `GET`
- JSON is the default response format unless `output=xml` is specified
- JSONP is supported when `callback` is provided

## 1) Standard IP lookup
- Method: `GET`
- Path: `/check`
- Full URL pattern: `https://apiip.net/api/check?ip={ip_or_domain}&accessKey={access_key}`
- Purpose: look up a single IPv4 address, IPv6 address, or domain

Required parameters:
- `ip` - single IPv4/IPv6 address or domain to resolve and inspect
- `accessKey` - API key

Documented optional parameters:
- `fields`
- `language`
- `callback`
- `output`

Representative response sections shown in the official docs:
- top-level geographic fields such as `continentCode`, `countryCode`, `regionName`, `city`, `postalCode`, `latitude`, `longitude`
- `languages`
- `currency`
- `timeZone`
- `userAgent`
- `connection`
- `security`

## 2) Bulk IP lookup
- Method: `GET`
- Path: `/check`
- Full URL pattern: `https://apiip.net/api/check?ip={ip1},{ip2},...&accessKey={access_key}`
- Purpose: look up multiple IPv4 or IPv6 addresses in one request

Required parameters:
- `ip` - comma-separated list of addresses
- `accessKey` - API key

Documented bulk constraints:
- bulk mode supports up to `50` IP values in one request
- the docs say the response is an array of result objects

Optional parameters:
- `fields`
- `language`
- `callback`
- `output`

## 3) Origin IP lookup
- Method: `GET`
- Path: `/check`
- Full URL pattern: `https://apiip.net/api/check?accessKey={access_key}`
- Purpose: inspect the IP address the current API request is coming from

Required parameters:
- `accessKey` - API key

Optional parameters:
- `fields`
- `language`
- `callback`
- `output`

Official note:
- the docs explicitly describe this mode as omitting the `ip` parameter and letting the service detect the caller IP automatically

## Field-selection and localization notes
The official docs describe these output controls:
- `fields=continentCode` returns one field
- `fields=languages` returns a full nested object
- `fields=currency.name` returns a nested subfield
- `fields=latitude,longitude,currency.name` returns a mixed subset of fields
- `language` supports translated response objects; docs list `en`, `de`, `es`, `fr`, `ja`, `pt-BR`, `ru`, and `zh-CN`

## Error handling and rate limits
The official documentation publishes these common API errors:
- `404` / `404_not_found` - requested resource does not exist
- `404` / `ip_not_found` - provider has no info for the requested IP
- `400` / `ip_not_valid` - IP address is invalid
- `401` / `missing_access_key` - API access key is required
- `403` / `invalid_access_key` - API access key is invalid
- `403` / `user_blocked` - user is blocked
- `403` / `usage_limit_reached` - monthly API usage limit reached
- `429` / `too_many_requests` - too many requests per second
- `403` / `https_access_restricted` - HTTPS not available on the current plan
- `400` / `language_not_valid` - unsupported language value
- `403` / `bulk_not_supported` - plan does not include bulk lookup
- `403` / `too_many_ips` - too many IPs in one bulk request

Official error schema example:
- `success: false`
- `message.code`
- `message.type`
- `message.info`

Rate-limit notes from the docs:
- the docs do not publish a numeric general per-second limit table
- they do explicitly say `429 too_many_requests` is returned when the allowed requests-per-second threshold is exceeded
- monthly usage caps are plan-based and enforced with `usage_limit_reached`

## Pagination
- No page-number, cursor, offset, or token-based pagination model is documented.
- Bulk lookup is handled by comma-separated `ip` values rather than paginated collection traversal.

## Response-format notes
- Default format: JSON
- Optional XML: `output=xml`
- Optional JSONP: `callback=<function_name>`
- The docs note the JSONP wrapper includes a leading `/**/` mitigation and a `typeof FUNCTION_NAME === 'function'` check

## Important usage notes
- Apiip uses a single route with behavior determined by whether `ip` is omitted, singular, or comma-separated.
- Domains are accepted in standard lookup mode and resolved to the underlying IP.
- Bulk support is plan-gated and also limited to 50 IPs per request.
- HTTPS availability may be plan-dependent according to the published `https_access_restricted` error.

## Canonical fireROUTE notes
- Canonical base URL: `https://apiip.net/api`
- Canonical route family: `GET /check`
- Distinguish fireROUTE operations by lookup mode:
  - single-IP/domain lookup
  - bulk comma-separated lookup
  - caller/origin IP lookup
- Preserve `fields`, `language`, and `output` as first-class adapter options because they materially change payload shape and localization.

## Verification notes
- This file was manually rebuilt from the live official Apiip homepage and official documentation using browser tools.