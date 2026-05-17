# Geocodify.com

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geocodify-com`
- Official docs used manually:
  - `https://geocodify.com/`
  - `https://geocodify.com/api-documentation`
- Public base URL documented by provider: `https://api.geocodify.com/v2`
- Transport: `HTTPS`
- Auth model: API key in query parameter `api_key`
- Response formats documented: `JSON`; the docs also mention client-side CORS support and example JSON handling

## Product / plan notes
- The official homepage describes Geocodify as a geocoding, geoparsing, autocomplete, and location-intelligence platform.
- The homepage pricing grid advertises these public request ceilings:
  - free plan: `30,000 calls/month`, `1 request/second`
  - starter plan: `300,000 calls/month`, `10 requests/second`
  - business plan: `700,000 calls/month`, `100 requests/second`
  - enterprise plan: `20,000,000 calls/month`, `unlimited req/second`
- The dedicated API documentation page separately summarizes rate limits as `1 request per second` on the free trial and `10-25+ requests per second` on paid plans.

## Confirmed API surface
The official documentation page exposes 7 GET endpoints:
- `GET /geocode`
- `GET /reverse`
- `GET /geoparse`
- `GET /autocomplete`
- `GET /parse`
- `GET /elevation`
- `GET /status`

## Shared request notes
- The docs say an `api_key` is required for every request.
- The docs describe the API as RESTful and HTTPS-only.
- The docs say JSON is the default response format and note that callers can explicitly request JSON with `Accept: application/json`.
- The docs say CORS is enabled by default for browser-side requests.

## 1) Forward geocoding
- Method: `GET`
- Path: `/geocode`
- Full URL pattern: `https://api.geocodify.com/v2/geocode?api_key=<key>&q=<query>`
- Purpose: convert an address, place name, or location string into coordinates and place details

Required query parameters:
- `api_key`
- `q` - free-form query string to search

## 2) Reverse geocoding
- Method: `GET`
- Path: `/reverse`
- Full URL pattern: `https://api.geocodify.com/v2/reverse?api_key=<key>&lat=<latitude>&lng=<longitude>`
- Purpose: convert coordinates into nearby addresses, points of interest, and location details

Required query parameters:
- `api_key`
- `lat`
- `lng`

Optional query parameters:
- `limit` - result count; docs say default is `10`

## 3) Geoparsing
- Method: `GET`
- Path: `/geoparse`
- Full URL pattern: `https://api.geocodify.com/v2/geoparse?api_key=<key>&text=<free-text>`
- Purpose: extract and disambiguate geographic entities from free text

Required query parameters:
- `api_key`
- `text`

Official note:
- the docs say this endpoint uses a TensorFlow backend to resolve place mentions into geographic identifiers.

## 4) Autocomplete
- Method: `GET`
- Path: `/autocomplete`
- Full URL pattern: `https://api.geocodify.com/v2/autocomplete?api_key=<key>&q=<partial-text>`
- Purpose: return real-time address and location suggestions while a user types

Required query parameters:
- `api_key`
- `q`

## 5) Address parsing
- Method: `GET`
- Path: `/parse`
- Full URL pattern: `https://api.geocodify.com/v2/parse?api_key=<key>&address=<unstructured-address>`
- Purpose: parse and normalize an international street address into structured components

Required query parameters:
- `api_key`
- `address`

Official note:
- the docs explicitly say `address` is the correct parameter name and note that earlier documentation had referred to `q`.

## 6) Elevation lookup
- Method: `GET`
- Path: `/elevation`
- Full URL pattern: `https://api.geocodify.com/v2/elevation?api_key=<key>&lat=<latitude>&lng=<longitude>`
- Purpose: return elevation in meters for a coordinate pair

Required query parameters:
- `api_key`
- `lat`
- `lng`

## 7) Service status
- Method: `GET`
- Path: `/status`
- Full URL pattern: https://api.geocodify.com/v2/status?api_key=***
- Purpose: return current API service status

Required query parameters:
- `api_key`

## Errors, rate limits, and pagination
- No cursor, page-number, or offset pagination model is documented on the inspected endpoint page.
- The official docs list these HTTP response codes:
  - `200` - success
  - `401` - unauthorized / missing or incorrect API key
  - `422` - malformed parameters or validation errors
  - `429` - too many requests / rate limit exceeded
  - `500` - internal server error
  - `503` - temporary maintenance / service unavailable
- The same docs also list provider-specific JSON error codes:
  - `600` - maintenance
  - `601` - unauthorized
  - `602` - invalid query parameters
  - `603` - higher subscription level required
- Important official caveat: the docs warn that some failures, including usage-limit or missing-parameter situations, may still come back as HTTP `200` with details in the JSON `meta` field.

## Canonical fireROUTE notes
- Keep `/parse` distinct from `/geocode`; it normalizes address strings rather than returning a normal geocode search result.
- `/geoparse` is also distinct from `/geocode`; it consumes larger free text via `text`, not a simple address query via `q`.
- `/status` is documented as a live service-health route and should not be inferred from homepage prose alone.
- Because the docs explicitly advertise browser CORS support, client-side integrations are first-class for this provider.

## Verification notes
- This file was manually rebuilt from the live official Geocodify homepage and API documentation page using browser tools.
