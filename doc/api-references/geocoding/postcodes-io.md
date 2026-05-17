# Postcodes.io

## Provider metadata
- Category: `Geocoding`
- Provider slug: `postcodes-io`
- Official docs used manually:
  - `https://postcodes.io/docs/api/`
  - `https://postcodes.io/docs/api/api-reference-postcodes-io`
  - `https://postcodes.io/docs/api/lookup-postcode`
  - `https://postcodes.io/docs/api/postcode-lookup`
  - `https://postcodes.io/docs/api/nearest-postcode`
  - `https://postcodes.io/docs/api/random-postcode`
  - `https://postcodes.io/docs/api/lookup-terminated-postcode`
  - `https://postcodes.io/docs/api/scottish-postcodes/` and the linked `Lookup Scottish Postcode` page
  - `https://postcodes.io/docs/api/outward-codes/` and the linked `Find an Outward Code` page
  - `https://postcodes.io/docs/api/place-query`
  - `https://postcodes.io/docs/api/find-place`
  - `https://postcodes.io/docs/api/random-place`
  - `https://postcodes.io/docs/api/bulk-postcode-lookup`
- Public API base URL: `https://api.postcodes.io`
- Transport: HTTPS
- Auth model: none
- Response format: JSON
- Current API version shown in docs: `3.5.1`

## Service notes
- The official docs describe Postcodes.io as a free UK postcode lookup API and geocoder.
- The service is open source and the site footer links to GitHub; the docs also link to self-hosting and licence pages.
- The home page says data is updated when new Ordnance Survey and Office for National Statistics releases become available.
- The API accepts `GET` and `POST` requests; the introduction page explicitly says POST methods use `application/json`.
- Most responses follow a top-level wrapper with `status` and `result`.

## Rate limits / usage notes
- No explicit per-key or per-IP rate limit was documented on the official introduction page during manual review.
- The docs do explicitly document result caps on some search-style routes:
  - postcode autocomplete/search returns up to `100` postcode entities
  - bulk postcode lookup accepts up to `100` postcodes
  - bulk reverse geocoding accepts up to `100` geolocations
- Because no formal rate-limit section is present in the visible docs, treat throughput limits as undocumented.

## Authentication
- `No authentication required.`
- The introduction page explicitly says Postcodes.io does not require authentication.

## HTTP / error model
The introduction page explicitly documents these HTTP statuses across the API:
- `200` - success
- `400` - bad request
- `404` - not found
- `500` - server error

The same page also says:
- the HTTP status is repeated in the JSON response body
- JSONP requests are the exception to normal HTTP status behavior

Endpoint-specific error notes explicitly visible in the docs:
- `GET /terminated_postcodes/:postcode` returns `404` when the postcode is invalid or absent from the terminated-postcode dataset
- `GET /scotland/postcodes/:postcode` returns `404` when the postcode is invalid, missing from SPD, or exists in ONSPD but not in SPD

## Pagination / batching
- No paginated collection model is documented.
- Search/list endpoints cap results instead of exposing page cursors.
- Bulk operations are handled via a POST body rather than paginated job resources.

## Confirmed API surface
The official docs currently expose `11` public routes / route patterns:
1. `GET /postcodes/:postcode`
2. `GET /postcodes`
3. `GET /postcodes/:postcode/nearest`
4. `GET /random/postcodes`
5. `GET /terminated_postcodes/:postcode`
6. `GET /scotland/postcodes/:postcode`
7. `GET /outcodes/:outcode`
8. `GET /places`
9. `GET /places/:code`
10. `GET /random/places`
11. `POST /postcodes`

## 1) Lookup postcode
- Method: `GET`
- Path pattern: `/postcodes/:postcode`
- Full URL pattern: `https://api.postcodes.io/postcodes/{postcode}`
- Purpose: return full postcode data from the Ordnance Survey Postcode Directory dataset

Path parameter:
- `postcode` - required postcode to retrieve

Response notes:
- returns the standard wrapper with `status=200` and a `result` object on success
- docs describe this as the main postcode-data lookup route

## 2) Search / reverse-search postcodes
- Method: `GET`
- Path: `/postcodes`
- Full URL: `https://api.postcodes.io/postcodes`
- Purpose: either search postcodes by prefix text or return postcodes nearest to a supplied geolocation

Documented operation modes:
- postcode search mode is triggered when `query=` is supplied
- geolocation mode is triggered when `lat=` and `lon=` are supplied

Visible query parameters on the official page:
- `query` - postcode text/prefix search input
- `limit` - limits returned matches; docs say default `10` and must be less than `100`
- `lat` / `lon` - prose on the page explicitly names these as the geolocation trigger parameters
- `radius` - limits search radius; docs say default `100m` and must be less than `2,000m`
- `widesearch` - optional widening behavior flag
- `filter` - optional response filtering control

Important usage notes:
- postcode search is case-insensitive
- the docs say the search is space-sensitive
- the page explicitly says the result can be empty or populated with up to `100` postcode entities and still return `200`
- the visible parameter table renders `longitude` / `latitude` labels, but the route description text uses the request keys `lat` and `lon`

## 3) Find nearest postcodes to a postcode
- Method: `GET`
- Path pattern: `/postcodes/:postcode/nearest`
- Full URL pattern: `https://api.postcodes.io/postcodes/{postcode}/nearest`
- Purpose: return postcodes geographically nearest to the supplied postcode, ordered closest first

Path parameter:
- `postcode` - required UK postcode used as the geographic center point

Usage notes:
- the official page explicitly says results are ordered by proximity
- during manual review, the accessible page text clearly exposed the path parameter but did not expose additional optional query parameters in the visible request table

## 4) Random postcode
- Method: `GET`
- Path: `/random/postcodes`
- Full URL: `https://api.postcodes.io/random/postcodes`
- Purpose: return a random postcode with associated geographic, administrative, and statistical data

Usage notes:
- no path or query parameters were visible on the docs page for this route
- useful for test fixtures and sample payloads

## 5) Lookup terminated postcode
- Method: `GET`
- Path pattern: `/terminated_postcodes/:postcode`
- Full URL pattern: `https://api.postcodes.io/terminated_postcodes/{postcode}`
- Purpose: return termination date and last known geospatial coordinates for a terminated postcode

Path parameter:
- `postcode` - required postcode to query

Official notes:
- source dataset is the Ordnance Survey Postcode Directory
- returns `404` if the postcode is invalid or not present in the terminated-postcode database

## 6) Lookup Scottish postcode
- Method: `GET`
- Path pattern: `/scotland/postcodes/:postcode`
- Full URL pattern: `https://api.postcodes.io/scotland/postcodes/{postcode}`
- Purpose: return Scottish Postcode Directory data for a postcode

Path parameter:
- `postcode` - required postcode to query

Official notes:
- the docs say the returned SPD data is currently just Scottish Parliamentary Constituency information
- returns `404` if the postcode is not in SPD or is invalid
- the docs also call out a special `404` case: "Postcode exists in ONSPD but not in SPD."
- source dataset is the Scottish Postcode Directory

## 7) Find an outward code
- Method: `GET`
- Path pattern: `/outcodes/:outcode`
- Full URL pattern: `https://api.postcodes.io/outcodes/{outcode}`
- Purpose: return aggregated information for postcodes sharing the same outward code

Path parameter:
- `outcode` - required outward code to query; docs example: `SW1A`

Official notes:
- the page explains that an outward code is the first half of a postcode

## 8) Find a place
- Method: `GET`
- Path: `/places`
- Full URL: `https://api.postcodes.io/places`
- Purpose: search places and return matching place records with associated data

Official notes:
- the route is part of the Ordnance Survey Open Names-backed place dataset
- the page describes it as returning a complete list of place matches and associated data
- during manual review, the currently rendered official docs page did not expose the request parameter table in accessible text, so exact searchable query keys were not surfaced there even though the route itself is clearly documented

## 9) Find a place by ID
- Method: `GET`
- Path pattern: `/places/:code`
- Full URL pattern: `https://api.postcodes.io/places/{code}`
- Purpose: return a specific place record by code

Path parameter:
- `code` - required place identifier; the request form labels it as "Specifies the place you wish to query"

Official notes:
- the page says this API uses the Ordnance Survey Open Names dataset
- the page explicitly says places are not available for Northern Ireland

## 10) Random place
- Method: `GET`
- Path: `/random/places`
- Full URL: `https://api.postcodes.io/random/places`
- Purpose: return a random place record with geographic and administrative data

Usage notes:
- the docs present this as a testing / sample-data route
- no path or query parameters were visible on the page

## 11) Bulk postcode lookup / bulk reverse geocoding
- Method: `POST`
- Path: `/postcodes`
- Full URL: `https://api.postcodes.io/postcodes`
- Content-Type: `application/json`
- Purpose: bulk postcode lookup and bulk reverse geocoding on a shared POST route

Documented request-body pattern for postcode lookup mode:
```json
{
  "postcodes": ["PR3 0SG", "M45 6GN", "EX16 5BL"]
}
```

Officially documented limits and notes:
- accepts up to `100` postcodes in lookup mode
- also supports bulk reverse geocoding with up to `100` geolocations
- the currently rendered official page explicitly mentions the geolocation mode but did not expose the exact geolocation object schema in accessible page text during this manual review

## Response schema notes
Across the rendered endpoint pages, the docs consistently show:
- top-level `status`
- top-level `result`

`result` shape varies by route:
- single lookup routes usually return an object
- search/list routes return arrays or arrays wrapped under `result`

## Canonical fireROUTE notes
- This is an unauthenticated UK postcode and place API with a single canonical base URL: `https://api.postcodes.io`.
- `GET /postcodes` is the main multi-mode search endpoint: text lookup with `query`, or geospatial lookup with `lat` and `lon`.
- `POST /postcodes` is also multi-mode: bulk postcode lookup plus bulk reverse geocoding.
- The place-search page was reachable and clearly documented as a route, but its query parameter table was not surfaced in accessible text during manual inspection; the route path and purpose were still manually confirmed from the official docs.

## Verification notes
This file was manually rebuilt from the official Postcodes.io documentation site using browser tools only.