# Bing Maps

## Provider metadata
- Category: `Geocoding`
- Provider slug: `bing-maps`
- Official docs used manually:
  - `https://www.microsoft.com/maps/`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-address`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-query`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-point`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/location-recognition`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/local-search`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types`
  - `https://learn.microsoft.com/en-us/bingmaps/rest-services/status-codes-and-error-handling`
- Public API base URL documented by provider: `https://dev.virtualearth.net/REST/v1` (the route pages say templates support both HTTP and HTTPS)
- Transport: `HTTPS` preferred; official route pages say both `HTTP` and `HTTPS` are supported
- Auth model: Bing Maps key sent as query parameter `key={BingMapsKey}`
- Response formats documented: `JSON` and `XML`

## Product and access notes
- The current official Microsoft Learn Bing Maps pages are still live and expose route-level REST templates for the Locations family.
- The Learn pages also state that Bing Maps for Enterprise is deprecated, Basic/free accounts are already retired, and Enterprise customers can continue using Bing Maps for Enterprise services until `2028-06-30`.
- The current `microsoft.com/maps` landing surface is not the route reference; the concrete geocoding templates are published on Microsoft Learn under the Bing Maps REST Services section.
- The common-parameters docs say the REST services share culture, output, and user-context parameters.
- The response-format notes on the route pages say JSON is the default unless XML is requested with output parameter `o=xml`.

## Confirmed API surface
The inspected official pages confirm these `15` geocoding-related route templates:
1. `GET /REST/v1/Locations?countryRegion={countryRegion}&adminDistrict={adminDistrict}&locality={locality}&postalCode={postalCode}&addressLine={addressLine}...`
2. `GET /REST/v1/Locations/CA/{adminDistrict}/{postalCode}/{locality}/{addressLine}`
3. `GET /REST/v1/Locations/FR/{postalCode}/{locality}/{addressLine}`
4. `GET /REST/v1/Locations/DE/{postalCode}/{locality}/{addressLine}`
5. `GET /REST/v1/Locations/UK/{postalCode}`
6. `GET /REST/v1/Locations/US/{adminDistrict}/{postalCode}/{locality}/{addressLine}`
7. `GET /REST/v1/Locations/US/{adminDistrict}/{locality}/{addressLine}`
8. `GET /REST/v1/Locations/{locationQuery}`
9. `GET /REST/v1/Locations?query={locationQuery}`
10. `GET /REST/v1/Locations/{point}`
11. `GET /REST/v1/LocationRecog/{point}`
12. `GET /REST/v1/LocalSearch/?query={query}&userLocation={point}`
13. `GET /REST/v1/LocalSearch/?query={query}&userMapView={lat,lon,lat,lon}`
14. `GET /REST/v1/LocalSearch/?query={query}&userCircularMapView={lat,lon,radius}`
15. `GET /REST/v1/LocalSearch/?type={type_string_id_list}&userLocation={point}`

## Shared request rules
- All inspected geocoding routes are `GET` requests under `dev.virtualearth.net/REST/v1`.
- The official route pages say a Bing Maps key is required.
- Shared/common parameter families referenced by the route pages include:
  - output parameters such as `o`
  - culture parameters
  - user-context parameters such as `userLocation`, `userIp`, and map-view context fields
- The inspected official pages do not describe cursor or page-token pagination.
- Where a route returns multiple matches, result-window sizing is handled with request parameters such as `maxResults` rather than a documented pagination scheme.

## Address geocoding routes

### 1) Unstructured address fields in query parameters
- Method: `GET`
- Full URL family shown by docs: `https://dev.virtualearth.net/REST/v1/Locations?...&key={BingMapsKey}`
- Purpose: geocode from structured address fields provided as query parameters.

Shared parameters documented on the page:
- `countryRegion`
- `adminDistrict`
- `locality`
- `postalCode`
- `addressLine`
- `userLocation`
- `userIp`
- `usermapView`
- `includeNeighborhood` / alias `inclnb`
- `include` / alias `incl`
- `maxResults` / alias `maxRes`
- `strictMatch` / alias `sm`

Important official notes:
- Parameter values are not case-sensitive.
- The page says URI encoding is a best practice.

### 2) Canada structured path template
- Method: `GET`
- Path: `/REST/v1/Locations/CA/{adminDistrict}/{postalCode}/{locality}/{addressLine}`
- Notes: country-specific structured template for Canada.

### 3) France structured path template
- Method: `GET`
- Path: `/REST/v1/Locations/FR/{postalCode}/{locality}/{addressLine}`
- Notes: country-specific structured template for France.

### 4) Germany structured path template
- Method: `GET`
- Path: `/REST/v1/Locations/DE/{postalCode}/{locality}/{addressLine}`
- Notes: country-specific structured template for Germany.

### 5) United Kingdom structured path template
- Method: `GET`
- Path: `/REST/v1/Locations/UK/{postalCode}`
- Notes: country-specific structured template for the UK postal-code form.

### 6) United States structured path template with postal code
- Method: `GET`
- Path: `/REST/v1/Locations/US/{adminDistrict}/{postalCode}/{locality}/{addressLine}`
- Notes: US-specific structured template including postal code.

### 7) United States structured path template without postal code
- Method: `GET`
- Path: `/REST/v1/Locations/US/{adminDistrict}/{locality}/{addressLine}`
- Notes: US-specific structured template without postal code.

Address-route usage notes from the official page:
- A hyphen (`-`) can be used as a placeholder when a structured path segment has no value.
- The page warns not to use special characters such as `.`, `,`, `:`, or `+` inside structured path values; for those cases Microsoft recommends the unstructured query form or the query endpoint.
- JSON and XML are both supported.

## Query geocoding routes

### 8) Query in the URL path
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/Locations/{locationQuery}?includeNeighborhood={includeNeighborhood}&maxResults={maxResults}&include={includeValue}&key={BingMapsKey}`
- Purpose: geocode a free-form location query embedded in the path.

### 9) Query parameter form
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/Locations?query={locationQuery}&includeNeighborhood={includeNeighborhood}&include={includeValue}&maxResults={maxResults}&key={BingMapsKey}`
- Purpose: geocode a free-form location query sent as query parameter `query` or alias `q`.

Documented query-route parameters:
- `query` / alias `q` - required
- `includeNeighborhood` / alias `inclnb`
- `include` / alias `incl` with documented values such as `queryParse` and `ciso2`
- `maxResults` / alias `maxRes` with integer range `1` to `20` and default `5`
- user-context parameters are also recommended for better accuracy

Important official notes:
- The page says the route can geocode locations from any country/region.
- JSON and XML are both supported.

## Reverse geocoding by point

### 10) Find a Location by Point
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/Locations/{point}?includeEntityTypes={entityTypes}&includeNeighborhood={includeNeighborhood}&include={includeValue}&key={BingMapsKey}`
- Purpose: reverse geocode a latitude/longitude point to location information.

Documented parameters:
- `point` - required
- `includeEntityTypes`
- `includeNeighborhood` / alias `inclnb`
- `include` / alias `incl` with documented value `ciso2`
- `verboseplacenames` / alias `vbpn`

Important official notes:
- Supported entity filters listed on the page include `Address`, `Neighborhood`, `PopulatedPlace`, `Postcode1`, `AdminDivision1`, `AdminDivision2`, and `CountryRegion`.
- The page says only the most specific matching entity is usually returned, with a documented exception for `PopulatedPlace` plus `Neighborhood`.
- JSON and XML are both supported.

## Location recognition

### 11) Location Recognition
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/LocationRecog/{point}?radius={search_radius}&top={number_of_results}&datetime={visit_date_time}&distanceunit={dist_unit}&verboseplacenames={true_or_false}&includeEntityTypes={list_of_entity_types}&key={BingMapsKey}`
- Purpose: return nearby businesses/POIs, natural POIs, and reverse-geocoded address data for a point.

Documented parameters:
- `point` - required
- `radius` / alias `r` - default `0.25 KM`, maximum `2 KM`
- `top` - default `10`, maximum `20`
- `dateTime`
- `distanceUnit` with `kilometer|km|mile|mi`
- `verboseplacenames`
- `includeEntityTypes` with `businessAndPOI`, `naturalPOI`, `address`
- `type`
- `output` / alias `o`

Important official notes:
- The page says search by query is not supported.
- The page says supported coverage is currently `Canada`, `Germany`, `Italy`, `Spain`, and `USA`.
- JSON and XML are both supported.

## Local Search routes

### 12) Search by query around a user location
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/LocalSearch/?query={query}&userLocation={point}&key={BingMapsKey}`

### 13) Search by query within a bounding box
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/LocalSearch/?query={query}&userMapView={lat,lon,lat,lon}&key={BingMapsKey}`

### 14) Search by query within a circular region
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/LocalSearch/?query={query}&userCircularMapView={lat,lon,radius}&key={BingMapsKey}`

### 15) Search by entity type
- Method: `GET`
- Full URL pattern: `https://dev.virtualearth.net/REST/v1/LocalSearch/?type={type_string_id_list}&userLocation={point}&key={BingMapsKey}`

Documented local-search parameters:
- `query` / alias `q` - required when searching by query
- `type` - required when searching by type
- `maxResults` / alias `maxRes` - integer `1` to `25`, default `5`
- `userCircularMapView` / alias `ucmv`
- `userLocation` / alias `ul`
- `userMapView` / alias `umv`

Important official notes:
- The page says Local Search currently supports business entities only in the `US`.
- JSON and XML are both supported.
- The page also states that `userMapView` and `userCircularMapView` can be used for category/type searches.

## Errors, rate limits, pagination, and format notes
- The inspected official pages do not publish a cursor, next-token, or page-number pagination model for these routes.
- The `Status Codes and Error Handling` page explicitly lists these common HTTP responses:
  - `200` OK
  - `201` Created
  - `202` Accepted
  - `400` Bad Request
  - `401` Unauthorized
  - `403` Forbidden
  - `404` Not Found
  - `429` Too Many Requests
  - `500` Internal Server Error
  - `503` Service Unavailable
- The same page says that when a normally valid query returns an empty result because servers are overloaded, callers should check header `X-MS-BM-WS-INFO`; if it equals `1`, Microsoft recommends waiting a few seconds and retrying.
- The reviewed pages do not publish numeric request-per-second or monthly quota values.
- Response formatting is documented as JSON by default, with XML available when requested.

## Canonical fireROUTE notes
- Keep this provider as `Bing Maps`, not Azure Maps: Microsoft still publishes Bing Maps route templates on Learn even though the service is deprecated and migration to Azure Maps is encouraged.
- Preserve the enterprise-only availability note. The docs make clear that Basic/free accounts are retired and only Enterprise customers continue through June 30, 2028.
- Keep the country-specific structured address templates as distinct route patterns because Microsoft documents each separately.
- Preserve Microsoft's special-character warning for structured address paths and fall back to the query forms when addresses contain punctuation.

## Verification notes
- This file was manually rebuilt from live official Microsoft Learn Bing Maps pages using browser tools only.
