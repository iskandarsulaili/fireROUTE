# ADS-B Exchange

## Provider metadata
- Category: `Transportation`
- Provider slug: `ads-b-exchange`
- Official docs used manually:
  - `https://www.adsbexchange.com/data/`
  - `https://www.adsbexchange.com/community/developer-hub/`
  - `https://gateway.adsbexchange.com/api/aircraft/v2/docs/index.html?url=/api/aircraft/v2/docs/openapi.json`
- Base URL: `https://gateway.adsbexchange.com/api/aircraft/v2`
- Authentication: API key sent in the `x-api-key` header on all confirmed API routes
- Required headers:
  - `Accept-Encoding: gzip` on all confirmed API routes
- Primary response format: JSON
- Transport scope documented here: live aircraft position lookups, geospatial and geopolitical filtering, airport / aircraft operations history, and trace-file retrieval

## Important official usage notes
- The official v2 API docs describe this as the `ADSB Exchange API (v2)` and present the gateway-hosted route reference under `https://gateway.adsbexchange.com/api/aircraft/v2`.
- The official docs explicitly say every request must send `Accept-Encoding: gzip`.
- The docs also warn that unavailable properties are omitted entirely from response objects.
- ADS-B Exchange says clients must not depend on JSON property order, and should tolerate additive properties because fields may be added in the future even though existing fields will not be removed or renamed.
- The official Data Products page markets live products as updating every `500ms` and daily products as refreshing every `24 hours`.
- The official Community Developer Hub says the community API is intended for non-commercial / side-project use and is sold through RapidAPI, while the route-level reference inspected here is the official gateway-hosted ADS-B Exchange v2 API reference.

## Rate limits, pagination, and errors
- The inspected OpenAPI document does not publish a numeric request-per-minute or request-per-day quota for the gateway-hosted v2 API.
- The route reference does publish `429 Rate Limit Exceeded` across the confirmed route families.
- `402 Payment Required` is also common across the confirmed routes, reflecting plan / entitlement gating.
- `403 Forbidden` and `500 Server Error` are common across the confirmed routes.
- Additional route-family-specific errors documented in the OpenAPI reference:
  - `414` on `GET /hex/{hex}` and `GET /icao/{icao}` for oversized URL-based bulk lookups
  - `422` on `POST /filter` for validation issues
  - `400` on `POST /geospatial/boundary`, `POST /operations/icaos`, and `POST /operations/airports`
  - `404` on both trace-file routes when the requested trace file is not found
- Pagination is only documented on the Operations endpoints through the `page` query parameter; the docs say `GET /operations/icao/{icao}` and `GET /operations/airport/{airport}` default to page `1` when `page` is omitted.
- The Operations routes also support `time_from` and `time_to` query parameters as Unix timestamps in seconds.

## Confirmed API surface
The official OpenAPI document currently exposes 30 routes:

### Live Positional Data (12 routes)
1. `GET /all`
2. `GET /total-aircraft`
3. `POST /filter`
4. `GET /hex/{hex}`
5. `POST /hex`
6. `GET /icao/{icao}`
7. `POST /icao`
8. `GET /mil`
9. `GET /callsign/{callsign}`
10. `GET /registration/{registration}`
11. `POST /registration`
12. `GET /sqk/{squawk}`

### Geospatial Filtering (7 routes)
13. `GET /lat/{lat}/lon/{lon}/dist/{dist}`
14. `POST /proximity/radius`
15. `GET /minimal/lat/{lat}/lon/{lon}/dist/{dist}`
16. `GET /nohex/dist/{dist}/above/{alt}/lat/{lat}/lon/{lon}`
17. `GET /airport/{airport}`
18. `POST /airport`
19. `POST /geospatial/boundary`

### Geopolitical Filtering (5 routes)
20. `GET /geospatial/country/{country}`
21. `GET /geospatial/country/{country}/subdivisions`
22. `GET /geospatial/country/{country}/subdivision/{subdivision}`
23. `GET /geospatial/region/{region}`
24. `GET /geospatial/continent/{continent}`

### Operations (4 routes)
25. `POST /operations/icaos`
26. `GET /operations/icao/{icao}`
27. `POST /operations/airports`
28. `GET /operations/airport/{airport}`

### Traces (2 routes)
29. `GET /traces/{folder}/{jsonFile}`
30. `GET /traces-hist/{year}/{month}/{day}/traces/{folder}/{jsonFile}`

## Common request and response notes
- All confirmed routes use header auth (`x-api-key`) plus the required `Accept-Encoding: gzip` request header.
- The API reference is JSON-first.
- The aircraft-collection examples shown in the official docs use a top-level object with keys such as `ac`, `msg`, `now`, `total`, `ctime`, and `ptime`.
- The GET lookup routes for `hex`, `icao`, `callsign`, `registration`, and `squawk` document comma-separated path values for multi-identifier queries where applicable.
- The POST bulk lookup routes provide JSON-body alternatives to very long path-based requests.
- For traces, the official docs require filename patterns such as `trace_recent_{ICAO}.json`, `trace_full_{ICAO}.json`, and the historical path pattern under `/traces-hist/{year}/{month}/{day}/...`.

## 1) Live Positional Data

### 1.1 Get all aircraft
- Method: `GET`
- Path: `/all`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/all`
- Purpose: return all aircraft currently being tracked
- Notes:
  - The official docs warn this endpoint can be slow or unresponsive inside Swagger UI because of the amount of data returned.
  - Response codes documented: `200`, `402`, `403`, `429`, `500`

### 1.2 Get total aircraft
- Method: `GET`
- Path: `/total-aircraft`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/total-aircraft`
- Purpose: return only the total number of tracked aircraft

### 1.3 Filter aircraft by criteria
- Method: `POST`
- Path: `/filter`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/filter`
- Purpose: perform property-based filtering over live aircraft data
- Documented request-body model: `FilterRequest`
- Key documented body fields:
  - `logical_operator` - logical operator used to combine filters
  - `filters[]` - array of filter definitions
  - `filters[].property` - top-level aircraft property name
  - `filters[].operator` - one of `eq`, `ne`, `gt`, `lt`, `ge`, `le`, `isNull`, `isNotNull`, `contains`, `notContains`, `startsWith`, `notStartsWith`, `endsWith`, `notEndsWith`
  - `filters[].value` - string / number / boolean depending on the target property; omitted for `isNull` and `isNotNull`
- Response codes documented: `200`, `402`, `403`, `422`, `429`, `500`

### 1.4 Get last known position by hex in path
- Method: `GET`
- Path: `/hex/{hex}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/hex/{hex}`
- Purpose: fetch last known position data by aircraft hex code
- Documented path parameter:
  - `hex` - ICAO hex code, or a comma-separated list of ICAO hex codes
- Response codes documented: `200`, `402`, `403`, `414`, `429`, `500`

### 1.5 Get last known position by hex list in body
- Method: `POST`
- Path: `/hex`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/hex`
- Purpose: bulk last-known-position lookup by JSON body
- Documented request-body model: `AircraftRequest`
- Key documented body field:
  - `hex_list[]` - array of aircraft hex identifiers

### 1.6 Get aircraft by ICAO in path
- Method: `GET`
- Path: `/icao/{icao}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/icao/{icao}`
- Purpose: fetch aircraft by ICAO code
- Documented path parameter:
  - `icao` - ICAO code, or a comma-separated list of ICAO codes
- Response codes documented: `200`, `402`, `403`, `414`, `429`, `500`

### 1.7 Get aircraft by ICAO in body
- Method: `POST`
- Path: `/icao`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/icao`
- Purpose: bulk ICAO lookup by JSON body
- Documented request-body model: the published OpenAPI schema reuses `AircraftRequest`

### 1.8 Get military aircraft
- Method: `GET`
- Path: `/mil`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/mil`
- Purpose: return military aircraft currently being tracked

### 1.9 Get aircraft by callsign
- Method: `GET`
- Path: `/callsign/{callsign}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/callsign/{callsign}`
- Purpose: query aircraft by callsign
- Documented path parameter:
  - `callsign` - callsign, or a comma-separated list of callsigns

### 1.10 Get aircraft by registration in path
- Method: `GET`
- Path: `/registration/{registration}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/registration/{registration}`
- Purpose: query aircraft by registration
- Documented path parameter:
  - `registration` - registration number, or a comma-separated list of registrations

### 1.11 Get aircraft by registration in body
- Method: `POST`
- Path: `/registration`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/registration`
- Purpose: bulk registration lookup by JSON body
- Documented request-body model: `RegistrationRequest`
- Key documented body field:
  - `registrations[]` - array of registration numbers

### 1.12 Get aircraft by squawk
- Method: `GET`
- Path: `/sqk/{squawk}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/sqk/{squawk}`
- Purpose: query aircraft by squawk code
- Documented path parameter:
  - `squawk` - squawk, or a comma-separated list of squawk codes

## 2) Geospatial Filtering

### 2.1 Get aircraft in radius via path parameters
- Method: `GET`
- Path: `/lat/{lat}/lon/{lon}/dist/{dist}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/lat/{lat}/lon/{lon}/dist/{dist}`
- Purpose: return aircraft within a radius of a point
- Documented path parameters:
  - `lat` - center latitude
  - `lon` - center longitude
  - `dist` - radius in nautical miles

### 2.2 Get aircraft in radius via JSON body
- Method: `POST`
- Path: `/proximity/radius`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/proximity/radius`
- Purpose: bulk / structured radius queries
- Documented request-body model: `ProximityRequest`
- Key documented body fields:
  - `filters[]`
  - `filters[].latitude`
  - `filters[].longitude`
  - `filters[].radius`
  - optional `filters[].altitude_min`
  - optional `filters[].altitude_max`

### 2.3 Get minimal aircraft payload in radius
- Method: `GET`
- Path: `/minimal/lat/{lat}/lon/{lon}/dist/{dist}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/minimal/lat/{lat}/lon/{lon}/dist/{dist}`
- Purpose: radius lookup with a reduced response schema

### 2.4 Get aircraft in radius above altitude
- Method: `GET`
- Path: `/nohex/dist/{dist}/above/{alt}/lat/{lat}/lon/{lon}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/nohex/dist/{dist}/above/{alt}/lat/{lat}/lon/{lon}`
- Purpose: radius lookup filtered to aircraft above the specified altitude
- Additional documented path parameter:
  - `alt` - altitude in feet above sea level

### 2.5 Get aircraft near one airport
- Method: `GET`
- Path: `/airport/{airport}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/airport/{airport}`
- Purpose: query aircraft in proximity to a specific airport
- Documented path parameter:
  - `airport` - airport ICAO code

### 2.6 Get aircraft near multiple airports
- Method: `POST`
- Path: `/airport`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/airport`
- Purpose: bulk airport-proximity query
- Documented request-body model: `AirportRequest`
- Key documented body field:
  - `airports[]` - array of airport ICAO codes

### 2.7 Get aircraft within a GeoJSON boundary
- Method: `POST`
- Path: `/geospatial/boundary`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/boundary`
- Purpose: return aircraft contained within a supplied boundary
- Documented request-body model: `FeatureCollectionRequest`
- Key documented body fields:
  - `type` - should be `FeatureCollection`
  - `features[]` - GeoJSON features describing the boundary geometry
- Response codes documented: `200`, `400`, `402`, `403`, `429`, `500`

## 3) Geopolitical Filtering

### 3.1 Get aircraft by country
- Method: `GET`
- Path: `/geospatial/country/{country}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/country/{country}`
- Purpose: filter aircraft by country
- Documented path parameter:
  - `country` - ISO 3166-1 alpha-2 country code, case-insensitive

### 3.2 Get subdivisions by country code
- Method: `GET`
- Path: `/geospatial/country/{country}/subdivisions`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/country/{country}/subdivisions`
- Purpose: list available subdivisions for a country

### 3.3 Get aircraft by subdivision
- Method: `GET`
- Path: `/geospatial/country/{country}/subdivision/{subdivision}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/country/{country}/subdivision/{subdivision}`
- Purpose: filter aircraft by state / province
- Documented path parameter:
  - `subdivision` - ISO 3166-2 subdivision code; country prefix may be omitted; case-insensitive

### 3.4 Get aircraft by region
- Method: `GET`
- Path: `/geospatial/region/{region}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/region/{region}`
- Purpose: filter aircraft by named geographical region

### 3.5 Get aircraft by continent
- Method: `GET`
- Path: `/geospatial/continent/{continent}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/geospatial/continent/{continent}`
- Purpose: filter aircraft by continent

## 4) Operations

### 4.1 Get operations by multiple aircraft ICAO codes
- Method: `POST`
- Path: `/operations/icaos`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/operations/icaos`
- Purpose: retrieve takeoff / landing operations for multiple aircraft
- Documented query parameters:
  - `page`
  - `time_from`
  - `time_to`
- Documented request-body model: `OperationsIcaosRequest`
- Key documented body field:
  - `icaos[]` - array of aircraft ICAO codes; minimum `1`, maximum `500`

### 4.2 Get operations by one aircraft
- Method: `GET`
- Path: `/operations/icao/{icao}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/operations/icao/{icao}`
- Purpose: retrieve operations history for one aircraft
- Documented parameters:
  - `icao` - required path ICAO code
  - `page` - optional query page number; defaults to `1`
  - `time_from` - optional Unix timestamp in seconds; defaults to 24 hours ago
  - `time_to` - optional Unix timestamp in seconds; defaults to current time

### 4.3 Get operations by multiple airports
- Method: `POST`
- Path: `/operations/airports`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/operations/airports`
- Purpose: retrieve operations for multiple airports
- Documented query parameters:
  - `page`
  - `time_from`
  - `time_to`
- Documented request-body model: `OperationsAirportRequest`
- Key documented body field:
  - `airports[]` - array of airport ICAO codes; minimum `1`, maximum `500`

### 4.4 Get operations by one airport
- Method: `GET`
- Path: `/operations/airport/{airport}`
- Full URL: `https://gateway.adsbexchange.com/api/aircraft/v2/operations/airport/{airport}`
- Purpose: retrieve operations history for one airport
- Documented parameters:
  - `airport` - required path airport ICAO code
  - `page` - optional query page number; defaults to `1`
  - `time_from` - optional Unix timestamp in seconds; defaults to 24 hours ago
  - `time_to` - optional Unix timestamp in seconds; defaults to current time

## 5) Traces

### 5.1 Get recent trace file
- Method: `GET`
- Path: `/traces/{folder}/{jsonFile}`
- Full URL pattern: `https://gateway.adsbexchange.com/api/aircraft/v2/traces/{folder}/{jsonFile}`
- Purpose: retrieve a recent trace file for an aircraft
- Documented path parameters:
  - `folder` - last 2 characters of the ICAO code
  - `jsonFile` - filename in the format `trace_recent_{ICAO}.json` or `trace_full_{ICAO}.json`
- Response codes documented: `200`, `402`, `403`, `404`, `429`, `500`

### 5.2 Get historical trace file
- Method: `GET`
- Path: `/traces-hist/{year}/{month}/{day}/traces/{folder}/{jsonFile}`
- Full URL pattern: `https://gateway.adsbexchange.com/api/aircraft/v2/traces-hist/{year}/{month}/{day}/traces/{folder}/{jsonFile}`
- Purpose: retrieve a historical trace file for an aircraft
- Documented path parameters:
  - `year`
  - `month`
  - `day`
  - `folder` - last 2 characters of the ICAO code
  - `jsonFile` - filename in the format `trace_full_{ICAO}.json`

## Sources inspected
- `https://www.adsbexchange.com/data/`
- `https://www.adsbexchange.com/community/developer-hub/`
- `https://gateway.adsbexchange.com/api/aircraft/v2/docs/index.html?url=/api/aircraft/v2/docs/openapi.json`
