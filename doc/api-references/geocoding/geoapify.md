# Geoapify

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geoapify`
- Official docs used manually:
  - `https://www.geoapify.com/maps-api/`
  - `https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/`
  - `https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/`
  - `https://apidocs.geoapify.com/docs/geocoding/address-autocomplete/`
  - Official Geoapify OpenAPI specs linked from those docs:
    - `https://apidocs.geoapify.com/assets/openapi/specs/forward_geocoding.yaml`
    - `https://apidocs.geoapify.com/assets/openapi/specs/reverse_geocoding.yaml`
    - `https://apidocs.geoapify.com/assets/openapi/specs/address_autocomplete.yaml`
    - `https://apidocs.geoapify.com/assets/openapi/specs/batch_geocoding.yaml`
    - `https://apidocs.geoapify.com/assets/openapi/specs/ip_geolocation.yaml`
- Public API base URL documented by provider: `https://api.geoapify.com/v1`
- Transport: `HTTPS`
- Auth model: query parameter `apiKey`
- Response formats documented: `JSON`, `GeoJSON`, `XML`; batch result retrieval also supports `CSV`

## Product and access notes
- Geoapify’s current Maps API landing page groups its location products under one platform and links directly to the geocoding/reference pages used here.
- The forward-geocoding docs state the free plan includes up to `3000` requests per day.
- The forward-geocoding docs also note that API keys can be restricted by allowed IP addresses, HTTP referrers, origins, and CORS settings.
- The inspected route set spans forward geocoding, reverse geocoding, address autocomplete, batch geocoding, and IP-based location lookup.

## Confirmed API surface
The current official docs and linked OpenAPI specs confirm these `8` route/method combinations under `https://api.geoapify.com/v1`:
1. `GET /geocode/search` - forward geocoding by free-form `text` or structured address fields
2. `GET /geocode/reverse` - reverse geocoding by `lat` and `lon`
3. `GET /geocode/autocomplete` - partial-address autocomplete by `text`
4. `POST /batch/geocode/search` - create a forward batch-geocoding job from a JSON array of address strings
5. `GET /batch/geocode/search` - fetch forward batch-geocoding results by job `id`
6. `POST /batch/geocode/reverse` - create a reverse batch-geocoding job from JSON coordinate input
7. `GET /batch/geocode/reverse` - fetch reverse batch-geocoding results by job `id`
8. `GET /ipinfo` - IP geolocation lookup, with optional explicit `ip` query parameter

## Route details

### 1) Forward geocoding
- Method: `GET`
- Path: `/geocode/search`
- Required auth parameter: `apiKey`
- Input modes documented:
  - free-form `text`
  - structured address parameters such as `name`, `housenumber`, `street`, `postcode`, `city`, `state`, `country`
- Important optional parameters surfaced by the docs/spec:
  - `type`
  - `filter`
  - `bias`
  - `format`
  - `lang`
  - `limit`
- Important notes:
  - the docs explicitly allow country, rectangle, radius, and place filters
  - the docs also distinguish strict `filter=` from softer ranking `bias=`

### 2) Reverse geocoding
- Method: `GET`
- Path: `/geocode/reverse`
- Required parameters: `lat`, `lon`, `apiKey`
- Notable optional parameters: `format`, `limit`, `type`, `lang`
- The response examples show address/component objects returned for the coordinates supplied.

### 3) Address autocomplete
- Method: `GET`
- Path: `/geocode/autocomplete`
- Required parameters: `text`, `apiKey`
- Notable optional parameters: `format`, `type`, `limit`, `lang`, `filter`, `bias`
- The docs position this endpoint specifically for suggestion UIs rather than final normalized geocoding.

### 4) Batch forward geocoding job creation
- Method: `POST`
- Path: `/batch/geocode/search`
- Required auth parameter: `apiKey`
- Request body: JSON array of address strings
- Notable optional query parameters: `type`, `lang`, `filter`, `bias`
- Success response: `202 Accepted` with a job object containing `id`, `status`, and a result `url`

### 5) Batch forward geocoding result retrieval
- Method: `GET`
- Path: `/batch/geocode/search`
- Required parameters: `apiKey`, `id`
- Optional parameter: `format` (`json` or `csv`)
- Purpose: retrieve completed forward-batch results after job submission

### 6) Batch reverse geocoding job creation
- Method: `POST`
- Path: `/batch/geocode/reverse`
- Required auth parameter: `apiKey`
- Request body formats documented:
  - array of `[longitude, latitude]`
  - array of objects containing `lon` and `lat`
- Optional query parameters: `type`, `lang`
- Success response: `202 Accepted` with job metadata and a result URL

### 7) Batch reverse geocoding result retrieval
- Method: `GET`
- Path: `/batch/geocode/reverse`
- Required parameters: `apiKey`, `id`
- Optional parameter: `format` (`json` or `csv`)
- Purpose: retrieve completed reverse-batch results after job submission

### 8) IP geolocation
- Method: `GET`
- Path: `/ipinfo`
- Required auth parameter: `apiKey`
- Optional parameter: `ip`
- Important note: the spec says that if `ip` is omitted, Geoapify resolves the caller’s own IP address automatically.

## Parameters, pagination, errors, and format notes
- The docs do not publish page-token pagination for the inspected geocoding endpoints.
- Instead, single-request result volume is controlled with route-specific parameters such as `limit`, while batch workflows are handled through asynchronous job creation plus later result retrieval by `id`.
- Error/status codes published in the inspected OpenAPI specs:
  - single-call geocoding/IP routes: `200`, `400`, `401`, `429`, `500`
  - batch creation routes: `202`, `400`, `401`, `429`, `500`
  - batch result retrieval routes: `200`, `400`, `401`, `429`, `500`
- Output-format notes:
  - forward, reverse, and autocomplete routes support `json`, `geojson`, and `xml`
  - batch result retrieval supports `json` and `csv`
  - the route set is query-parameter driven rather than path-version-fragmented beyond the shared `/v1` prefix

## Canonical fireROUTE notes
- Geoapify differentiates between hard geographic filtering (`filter`) and ranking preference (`bias`); fireROUTE should preserve that distinction.
- Batch geocoding is not simple pagination over the single-call routes; it is a separate asynchronous job workflow with `POST` create and `GET` fetch steps on the same path family.
- The IP geolocation route is part of the same provider platform and is documented off the same official API hub, so it is included in the confirmed route count for this provider file.

## Verification notes
- This file was manually rebuilt from the live official Geoapify docs pages and the official linked OpenAPI YAML specs using browser tools only.
