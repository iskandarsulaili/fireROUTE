# keycdn IP Location Finder

## Provider metadata
- Category: `Geocoding`
- Provider slug: `keycdn-ip-location-finder`
- Official docs used manually: `https://tools.keycdn.com/geo`
- Public API base URL documented by provider: `https://tools.keycdn.com/geo.json`
- Transport: HTTPS
- Auth / identification model: no API key is documented on the official page; instead the provider requires a valid attribution link and a specific `User-Agent` header format
- Response format documented: JSON

## Usage restrictions and rate limiting
The official page explicitly states:
- requests are rate limited to `3r/s`
- use of the service requires a link back to `https://tools.keycdn.com/geo`
- clients must send a `User-Agent` request header in the format `keycdn-tools:https?://.*`
- the `User-Agent` value must include the website using the API
- missing attribution or invalid `User-Agent` values will be blocked

## Confirmed API surface
The official page documents one REST endpoint:
- `GET /geo.json`

## 1) IP location lookup
- Method: `GET`
- Path: `/geo.json`
- Full URL pattern: `https://tools.keycdn.com/geo.json?host={host}`
- Purpose: look up IP geolocation details for an IP address or hostname

Documented query parameter:
- `host` - required hostname or IP address to look up

Documented request-header requirement:
- `User-Agent` - must match the provider-required pattern `keycdn-tools:https?://.*`

Official example request:
- `curl -H "User-Agent: keycdn-tools:https://www.example.com" "https://tools.keycdn.com/geo.json?host=www.example.com"`

Documented response parameters:
- `host`
- `ip`
- `asn`
- `country_name`
- `country_code`
- `region_name`
- `region_code`
- `city`
- `postal_code`
- `contitent_code` (spelled this way on the docs page)
- `latitude`
- `longitude`
- `metro_code`
- `timezone`
- `datetime`

## Response / behavior notes
- The page says all responses are JSON encoded.
- The same public tool page supports IPv4 and IPv6 lookups.
- The surrounding page describes the result set as detailed IP geolocation data including city, region, postal code, coordinates, provider/ASN, and local time information.

## Canonical fireROUTE notes
- The earlier automated metadata claiming API-key auth is not supported by the official page inspected here; the live docs instead require attribution plus a provider-specific `User-Agent`.
- This is a single-route provider with policy restrictions, not a multi-endpoint API family.
- The docs page exposes the endpoint on the same host as the interactive tool.

## Verification notes
This file was manually rebuilt from the live official KeyCDN IP Location Finder documentation page using browser tools.