# IP Geolocation

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip-geolocation`
- Official docs used manually:
  - `https://www.abstractapi.com/api/ip-geolocation-api`
  - `https://docs.abstractapi.com/api/ip-geolocation`
- Public base URL documented by provider: `https://ipgeolocation.abstractapi.com/v1/`
- Transport: HTTPS with TLS `1.2` or greater is required by the docs
- Auth model: required API key in query parameter `api_key`
- Response format: JSON

## Product and access notes
- The official docs describe this as a RESTful JSON API for geolocating IPv4 and IPv6 addresses.
- The docs say that if `ip_address` is omitted, the API geolocates the caller IP automatically.
- The main product page also advertises worldwide coverage, timezone/currency/flag/security enrichment, and daily-updated data.

## Confirmed API surface
The inspected official docs expose `1` geolocation route pattern:
- `GET /v1/`

## 1) IP geolocation lookup
- Method: `GET`
- Path: `/v1/`
- Full URL pattern: `https://ipgeolocation.abstractapi.com/v1/?api_key={api_key}&ip_address={ip_address}`
- Purpose: geolocate a supplied IP address, or the caller IP if `ip_address` is omitted

Documented query parameters:
- `api_key` - required API key
- `ip_address` - optional IPv4 or IPv6 address to geolocate
- `fields` - optional comma-separated list of top-level response keys to return

Representative documented response fields:
- `ip_address`
- `city`, `city_geoname_id`
- `region`, `region_iso_code`, `region_geoname_id`
- `postal_code`
- `country`, `country_code`, `country_geoname_id`, `country_is_eu`
- `continent`, `continent_code`, `continent_geoname_id`
- `longitude`, `latitude`
- `security.is_vpn`
- `timezone.name`, `timezone.abbreviation`, `timezone.gmt_offset`, `timezone.current_time`, `timezone.is_dst`
- `flag.emoji`, `flag.unicode`, `flag.png`, `flag.svg`
- `currency.currency_name`, `currency.currency_code`
- `connection.connection_type`, `connection.autonomous_system_number`, `connection.autonomous_system_organization`, `connection.isp_name`, `connection.organization_name`

Documented field-filter example:
- `fields=country,city` returns only those top-level keys in the JSON body

## Rate limits, errors, and pagination
Official response/error codes published on the docs page:
- `200` - success
- `204` - no location data for the submitted IP
- `400` - bad request
- `401` - unauthorized; typically missing or incorrect API key
- `422` - quota reached / insufficient API credits on free plans
- `429` - too many requests; the docs say free plans are limited to `1` request per second
- `500` - internal server error
- `503` - service unavailable

Pagination notes:
- No page-number, cursor, offset, or token-based pagination model is documented.
- This API is a single-resource lookup endpoint, not a collection-listing API.

## Response-format notes
- The docs explicitly describe the API as a lightweight JSON API.
- No XML, CSV, JSONP, or alternate output format was documented on the inspected pages.

## Important usage notes
- `ip_address` is optional; omitting it changes the route into a caller-IP lookup.
- `fields` only supports top-level response keys according to the docs.
- The service requires HTTPS and current API version `v1`.

## Canonical fireROUTE notes
- Canonical base URL: `https://ipgeolocation.abstractapi.com/v1/`
- Canonical route family: `GET /v1/`
- Treat caller-IP lookup and explicit-IP lookup as the same route with optional `ip_address`.
- Preserve `fields` because it materially changes payload shape and size.

## Verification notes
- This file was manually rebuilt from the live official Abstract product page and official IP Geolocation API docs using browser tools.
