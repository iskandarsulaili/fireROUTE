# Google Maps

## Provider metadata
- Category: `Geocoding`
- Provider slug: `google-maps`
- Official docs used manually:
  - `https://developers.google.com/maps/documentation/geocoding/guides-v3/requests-geocoding`
  - `https://developers.google.com/maps/documentation/geocoding/guides-v3/requests-reverse-geocoding`
  - `https://developers.google.com/maps/documentation/geocoding/guides-v3/requests-places-geocoding`
- Public API base URL documented by provider: `https://maps.googleapis.com/maps/api/geocode`
- Transport: `HTTPS`
- Auth model: Google Maps Platform API key passed as query parameter `key`; the docs repeatedly note that the key is used for quota management
- Response formats documented: `JSON` and `XML` via the `outputFormat` path segment (`json` recommended by Google)

## Product and access notes
- The inspected pages are the still-published Geocoding API v3 web-service guides.
- Each inspected v3 page also states that Geocoding API v4 is generally available and links to migration guidance.
- For fireROUTE adapter work, the v3 guides remain useful because they publish concrete request URLs and parameter behavior for the web-service endpoints.
- The docs note that request URLs must be properly URL-encoded and are limited to `16384` characters for Google web services.

## Confirmed API surface
The inspected official docs confirm these `6` published request patterns on the same `geocode` service family:
1. `GET /json?address=...&key=...`
2. `GET /xml?address=...&key=...`
3. `GET /json?latlng=...&key=...`
4. `GET /xml?latlng=...&key=...`
5. `GET /json?place_id=...&key=...`
6. `GET /xml?place_id=...&key=...`

## Shared request rules
- Base route family: `https://maps.googleapis.com/maps/api/geocode/{outputFormat}`
- `outputFormat` may be `json` or `xml`; Google explicitly recommends `json`.
- `key` is required on all inspected request modes.
- No pagination scheme is documented on the inspected geocoding pages.
- Responses include a top-level `status`; JSON responses also include `results`, and may include `error_message` when status is not `OK`.

## 1) Forward geocoding with free-form address input (JSON)
- Method: `GET`
- Path pattern: `/json`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/json?address={address}&key=***
- Purpose: convert a postal address or Plus Code into coordinates and normalized address data

Documented required parameters:
- `address` or `components` or both; the page says callers must specify either `address`, `components`, or both
- `key`

Documented optional parameters on the inspected page:
- `bounds` - viewport biasing only; does not fully restrict results
- `language`
- `region` - ccTLD-style two-character region bias
- `components` - fully restrictive component filter if supplied
- `extra_computations` - inspected examples show `ADDRESS_DESCRIPTORS` and `BUILDING_AND_ENTRANCES`

Important official notes:
- Address queries should follow the national postal format when possible.
- The page says unsupported query styles can produce errors or unspecified behavior, including raw latitude/longitude strings, over-constrained mixed-place strings, vanity names, and non-geospatial questions.
- Plus codes are accepted in `address` when properly URL-encoded.

## 2) Forward geocoding with free-form address input (XML)
- Method: `GET`
- Path pattern: `/xml`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/xml?address={address}&key=***
- Purpose: same lookup behavior as the JSON route, but with XML output
- Important format note: Google says XML indicates output in XML while JSON is recommended.

## 3) Reverse geocoding by coordinates (JSON)
- Method: `GET`
- Path pattern: `/json`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key=***
- Purpose: convert coordinates into the closest human-readable address hierarchy

Documented required parameters:
- `latlng`
- `key`

Documented optional parameters:
- `language`
- `region`
- `result_type` - post-search filter for one or more address types separated by `|`
- `location_type` is also documented on the reverse-geocoding page as a filter in the full guide, alongside `result_type`

Important official notes:
- The reverse-geocoding page says `result_type` is applied as a post-search filter rather than a hard pre-search restriction.
- The page documents the same language/region behavior style as forward geocoding.

## 4) Reverse geocoding by coordinates (XML)
- Method: `GET`
- Path pattern: `/xml`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/xml?latlng={lat},{lng}&key=***
- Purpose: same reverse-geocoding behavior as the JSON route, but with XML output

## 5) Place geocoding by place ID (JSON)
- Method: `GET`
- Path pattern: `/json`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key=***
- Purpose: retrieve the human-readable address and geometry for a known Google place ID

Documented required parameters:
- `place_id`
- `key`

Documented optional parameters:
- The inspected place-geocoding page says the optional parameters are the same as reverse geocoding.

Important official note:
- The docs position this as a way to turn a place ID returned by other Google APIs into a geocoded address record.

## 6) Place geocoding by place ID (XML)
- Method: `GET`
- Path pattern: `/xml`
- Full URL pattern: https://maps.googleapis.com/maps/api/geocode/xml?place_id={place_id}&key=***
- Purpose: same place-ID lookup behavior as the JSON route, but with XML output

## Response, errors, and format notes
- The inspected forward-geocoding page says JSON responses have two root elements: `status` and `results`.
- The same page notes that XML responses contain `<GeocodeResponse>` with zero or more `<result>` elements.
- Common documented `status` values on the inspected guides:
  - `OK`
  - `ZERO_RESULTS`
  - `OVER_DAILY_LIMIT`
  - `OVER_QUERY_LIMIT`
  - `REQUEST_DENIED`
  - `INVALID_REQUEST`
  - `UNKNOWN_ERROR`
- The docs say `error_message` may appear when status is not `OK`, but it is not guaranteed to always be present.
- Typical result fields shown in the official examples include `formatted_address`, `address_components`, `geometry.location`, `geometry.location_type`, `geometry.viewport`, `place_id`, `types`, and `plus_code`.

## Rate limits, billing, and storage notes
- The inspected pages do not publish a single hard request-per-minute number.
- Instead, Google ties usage to API-key quota/billing management and documents `OVER_QUERY_LIMIT` / `OVER_DAILY_LIMIT` status outcomes.
- The reverse-geocoding and forward-geocoding pages both include EEA terms notices effective `8 July 2025` for developers whose billing address is in the EEA.

## Canonical fireROUTE notes
- Treat Google Maps Geocoding as one service family with two output-format paths and multiple query modes distinguished by `address`, `latlng`, and `place_id`.
- Preserve Google-specific status codes because the API uses application-level status strings even when transport succeeds.
- Keep XML support as optional passthrough behavior, but prefer JSON for canonical fireROUTE normalization because Google explicitly recommends it.
- The inspected pages repeatedly note that v4 is available; future cleanup may want a separate manual pass focused on the v4 route set.

## Verification notes
- This file was manually rebuilt from the live official Google Maps Geocoding API pages listed above using browser tools only.
