# Zippopotam.us

## Provider metadata
- Category: `Geocoding`
- Provider slug: `zippopotam-us`
- Official pages checked manually:
  - `http://zippopotam.us/`
  - `https://zippopotam.us/`
  - live example API URLs linked from the official homepage
- Public API base URL shown on the official homepage: `https://api.zippopotam.us`
- Transport observed: homepage examples still show `http://api.zippopotam.us/...`, but the live API also responds over HTTPS
- Auth model: none documented or required
- Response format advertised on the homepage: JSON

## Service overview
- The official homepage brands the service as a free API for postal-code and zip-code lookup.
- The page says it supports over `60` countries.
- The homepage explicitly documents two API structures:
  - `api.zippopotam.us/country/postal-code`
  - `api.zippopotam.us/country/state/city`
- The site also notes the project is under new management and links to a GitHub repository for details.

## Rate limits / access notes
- No formal rate-limit section was visible on the official homepage during manual review.
- No account, API key, or signup flow is documented for the public lookup endpoints.

## Authentication
- `No authentication required.`
- The official page presents the API as a free public JSON API.

## Pagination
- None documented.
- Postal-code and city lookups return single JSON payloads rather than paginated collections.

## Confirmed API surface
The official homepage exposes `2` public route patterns:
1. `GET /{country}/{postal-code}`
2. `GET /{country}/{state}/{city}`

## 1) Postal-code lookup
- Method: `GET`
- Path pattern: `/{country}/{postal-code}`
- Full URL pattern: `https://api.zippopotam.us/{country}/{postal-code}`
- Purpose: return place data for a postal code in a supported country

Path parameters:
- `country` - required country code; the homepage examples use values such as `US`, `DE`, `ES`, `FR`
- `postal-code` - required postal code or zip code

Documented / observed response fields:
- `post code`
- `country`
- `country abbreviation`
- `places` array containing objects with fields such as:
  - `place name`
  - `longitude`
  - `latitude`
  - `state`
  - `state abbreviation`

Observed live behavior from the provider's own API host:
- valid lookup returned HTTP `200` with `application/json`
- invalid lookup returned HTTP `404` with JSON body `{}`

## 2) City-to-postal-code lookup
- Method: `GET`
- Path pattern: `/{country}/{state}/{city}`
- Full URL pattern: `https://api.zippopotam.us/{country}/{state}/{city}`
- Purpose: return postal codes for a city within a country/state subdivision

Path parameters:
- `country` - required country code
- `state` - required state / region code segment
- `city` - required city name segment

Official notes:
- the homepage labels this route `NEW! City->Zip`
- the example shown is `api.zippopotam.us/us/ma/belmont`

Observed response-shape notes from a live documented example:
- top-level fields include `country`, `country abbreviation`, `state`, `state abbreviation`, and `place name`
- matching postal codes are returned in a `places` array, where each item includes `post code`, `latitude`, and `longitude`

## Error notes
- The homepage does not publish a dedicated error section.
- Manual verification showed the postal-code route returns HTTP `404` with an empty JSON object for a nonexistent postal code.
- No structured rate-limit, validation-code, or retry documentation was visible on the homepage.

## Response-format notes
- The official homepage says `Free API with JSON Response Format`.
- No XML, CSV, or JSONP mode is documented on the inspected official page.
- JSON field names intentionally include spaces, so downstream mapping should not normalize them implicitly.

## Data / licence notes
- The homepage says the data is adapted from `geonames.org`.
- The licence section says the API is available under the Open Database License and Database Contents License:
  - `http://opendatacommons.org/licenses/odbl/1.0/`
  - `http://opendatacommons.org/licenses/dbcl/1.0/`

## Important usage notes
- The provider is country-agnostic across a large supported-country list, not US-only.
- The city route is materially different from the postal-code route and should remain a separate fireROUTE operation.
- Because JSON keys contain spaces and lowercase words, adapters should preserve provider field names when exposing raw responses.

## Canonical fireROUTE notes
- Canonical base: `https://api.zippopotam.us`
- Route family 1: postal code to place details
- Route family 2: city/state to postal codes

## Verification notes
- This file was manually rebuilt from the live official Zippopotam.us homepage and its own linked example API URLs.
- Live example requests were checked to confirm JSON output and the `404` empty-object behavior for nonexistent postal codes.