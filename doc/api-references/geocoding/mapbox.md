# Mapbox

## Provider metadata
- Category: `Geocoding`
- Provider slug: `mapbox`
- Official docs used manually:
  - `https://docs.mapbox.com/api/search/geocoding/`
- Public API base URL documented by provider: `https://api.mapbox.com/search/geocode/v6`
- Transport: `HTTPS`
- Auth model: Mapbox access token passed as query parameter `access_token`
- Response formats documented: `geojson` by default; the docs also mention a backwards-compatibility `v5` format option on forward geocoding

## Product and access notes
- The inspected page is the Mapbox Geocoding API v6 reference.
- The page explicitly says permanent and temporary geocoding are no longer separate endpoints; storage intent is now controlled through the optional `permanent` parameter.
- The page also says Geocoding v6 no longer provides POI data and recommends the Search Box API for POI search.
- The docs note that temporary results may not be cached, while permanent results may be stored indefinitely.
- The docs say permanent storage requires a valid credit card on file or an active enterprise contract.

## Confirmed API surface
The inspected official docs confirm these `4` geocoding request patterns:
1. `GET /forward?q={search_text}&access_token=...`
2. `GET /forward?address_number=...&street=...&...&access_token=...`
3. `GET /reverse?longitude={longitude}&latitude={latitude}&access_token=...`
4. `POST /batch?access_token=...`

## Shared request rules
- Base route family: `https://api.mapbox.com/search/geocode/v6`
- Authentication uses `access_token` in the query string on the inspected examples.
- The docs describe permanent/temporary storage behavior through `permanent=true|false` instead of separate endpoints.
- No cursor or page-number pagination scheme is documented; result sizing is handled with per-request limits.
- The page presents GeoJSON-style responses with top-level `type: FeatureCollection`, `features`, and `attribution`.

## 1) Forward geocoding with free-form search text
- Method: `GET`
- Path pattern: `/forward`
- Full URL pattern: https://api.mapbox.com/search/geocode/v6/forward?q={search_text}&access_token=***
- Purpose: look up a location from a free-form text query and return normalized address/context/coordinates

Documented required parameters:
- `q` - URL-encoded search text; the page says decoded input must be at most `20` tokens and `256` characters, and must not contain the semicolon character
- `access_token`

Documented optional parameters visible on the inspected page:
- `permanent`
- `autocomplete` - defaults to `true`
- `bbox`
- `country` - comma-separated ISO 3166 alpha-2 country codes
- `format`
- `language`
- `limit` - default `5`, maximum `10`
- `proximity` - `longitude,latitude` or `ip`
- `types` - comma-separated subset of `country`, `region`, `postcode`, `district`, `place`, `locality`, `neighborhood`, `street`, `address`
- `worldview` - docs list `ar`, `cn`, `in`, `jp`, `ma`, `rs`, `ru`, `tr`, `us`
- `entrances` - public preview

Important official notes:
- Autocomplete-enabled usage counts each keystroke as a request.
- `bbox` cannot cross the 180th meridian.
- If `worldview` is omitted, the docs say `us` worldview boundaries are returned by default.

## 2) Forward geocoding with structured input
- Method: `GET`
- Path pattern: `/forward`
- Full URL pattern: https://api.mapbox.com/search/geocode/v6/forward?address_number={address_number}&street={street}&...&access_token=***
- Purpose: geocode an address from separately supplied components instead of one free-form `q` string

Documented structured fields visible in the inspected examples and parameter table:
- `address_number`
- `street`
- `block`
- `place`
- `region`
- `postcode`
- `locality`
- `neighborhood`
- `country`

Important official note:
- The docs treat this as a separate forward-geocoding request mode on the same `/forward` endpoint.

## 3) Reverse geocoding
- Method: `GET`
- Path pattern: `/reverse`
- Full URL pattern: https://api.mapbox.com/search/geocode/v6/reverse?longitude={longitude}&latitude={latitude}&access_token=***
- Purpose: convert coordinates to place/address features

Documented required parameters:
- `longitude`
- `latitude`
- `access_token`

Documented notable optional parameters visible on the inspected page:
- `permanent`
- `language`
- `limit`
- `types`
- `worldview`

Important official note:
- The error table says reverse geocoding requests that use `limit` must also use a single `type` parameter.

## 4) Batch geocoding
- Method: `POST`
- Path pattern: `/batch`
- Full URL pattern: https://api.mapbox.com/search/geocode/v6/batch?access_token=***
- Purpose: submit multiple forward, structured-forward, and reverse geocoding queries in one request

Documented request-body model:
- JSON array body
- each element can carry fields that would otherwise be query parameters on the single-request endpoints
- multi-value filters such as `types`, `country`, `bbox`, and `proximity` may be provided either as comma-separated strings or JSON arrays

Important official notes:
- The docs say a single batch may combine different query types.
- The page text says the batch endpoint allows up to `1000` queries in one request.
- The same page's error table also says `Batch queries must include 50 queries or less` and returns `422` otherwise.
- Each individual search within a batch is billed as one request.

## Response, errors, rate limits, and format notes
- The inspected examples show GeoJSON-like `FeatureCollection` responses.
- Example feature properties on the page include `mapbox_id`, `feature_type`, `name`, `coordinates`, `place_formatted`, `match_code`, and nested `context` objects.
- The response examples include an `attribution` string that states the response data may not be retained unless the storage terms allow it.
- Common documented HTTP/application errors visible on the page include:
  - `404` for not-found endpoint or no search text / structured input supplied
  - `422` for malformed `bbox`, unsupported `type`, unsupported `language`, overly long queries, invalid `proximity`, too many batch queries, and other validation failures
  - `429` for rate-limit exceeded
- The page says the default Geocoding API rate limit is `1000 requests per minute`, adjustable on a per-account basis.
- The page says HTTP `429` is returned when the rate limit is reached.

## Canonical fireROUTE notes
- Keep Mapbox's structured-input mode distinct from free-form forward geocoding even though both use `/forward`, because the input contract differs materially.
- Preserve the temporary-versus-permanent storage distinction through the `permanent` parameter rather than by inventing separate routes.
- Preserve the batch-limit discrepancy exactly as documented: the page body says up to `1000` queries, while the error table still mentions a `50`-query cap.
- Expect GeoJSON normalization rather than generic REST-object normalization.

## Verification notes
- This file was manually rebuilt from the live official Mapbox Geocoding API page using browser tools only.
