# Longdo Map

## Provider metadata
- Category: `Geocoding`
- Provider slug: `longdo-map`
- Official docs used manually:
  - `https://map.longdo.com/docs/`
  - `https://map.longdo.com/docs/rest`
  - `https://map.longdo.com/docs/restapi.json?version=2.2.0`
  - `https://map.longdo.com/products/pricing`
- Public API hosts confirmed from the official REST spec: `https://search.longdo.com` and `https://api.longdo.com`
- Transport: `HTTPS`
- Auth model: API key in the query parameter named `key`
- Response formats confirmed from the official REST spec: JSON responses on all inspected routes; several GET endpoints also expose JSONP via `callback`

## Product and access notes
- The live official docs shell now links to a working REST reference instead of only a navigation stub.
- The official REST reference identifies itself as `Longdo Map REST API documentation` version `2.2.0` and exposes an OpenAPI `3.1.0` document.
- The official pricing page says the free plan includes `< 100,000 /เดือน` service transactions, `Limit 60 Requests/นาที`, and `Limit 5,000 Requests/วัน`.
- The shared `locale` parameter documented in the REST spec supports `th` (default) and `en`.

## Confirmed API surface
The inspected official docs confirm these `9` geocoding-relevant GET routes:
1. `GET https://search.longdo.com/mapsearch/json/suggest`
2. `GET https://search.longdo.com/mapsearch/json/search`
3. `GET https://search.longdo.com/smartsearch/json/search`
4. `GET https://api.longdo.com/POIService/json/search`
5. `GET https://search.longdo.com/smartsearch/json/extract_address/v2`
6. `GET https://search.longdo.com/addresslookup/api/addr/geocoding`
7. `GET https://api.longdo.com/map/services/address`
8. `GET https://api.longdo.com/map/services/addresses`
9. `GET https://api.longdo.com/POIService/json/address`

## Shared request, auth, and format notes
- The official OpenAPI document uses a single query-parameter security scheme named `key`.
- Search and address-intelligence routes are split across two official hosts:
  - `https://search.longdo.com` for suggest/search/smart-search/address-extraction/geocoding
  - `https://api.longdo.com` for POI search, reverse geocoding, batch reverse geocoding, and geocode/postcode lookup
- Pagination-style controls are documented only on list-style place endpoints via `offset` and `limit`.
- `callback`-based JSONP is documented on `suggest`, `search`, `nearby POI`, `reverse geocoding`, `batch reverse geocoding`, and `geocode / postcode`.
- The inspected OpenAPI file lists `200` response schemas for the confirmed routes but does not publish a separate shared HTTP error table or explicit rate-limit response headers.

## 1) Suggest
- Method: `GET`
- Path: `/mapsearch/json/suggest`
- Host: `https://search.longdo.com`
- Purpose: keyword suggestion / autocomplete before a full place search

Required parameter:
- `keyword` - suggestion keyword

Documented optional parameters:
- `area` - geocode of the suggestion area
- `sdx` - Soundex matching toggle; `1` enables phonetic fuzzy matching, `0` disables it
- `offset`
- `limit` - default `10`
- `dataset` - uses the `suggestDataset` list from the official spec
- `callback`

Response notes:
- JSON object with `meta` and `data`
- `data` items include short fields such as `w` (suggest text), `d` (highlighted display text), and `s` (dataset)

## 2) Search
- Method: `GET`
- Path: `/mapsearch/json/search`
- Host: `https://search.longdo.com`
- Purpose: general place search

Documented request parameters:
- `keyword`
- `area` - geocode of the search area
- `lon`, `lat` - center point for results
- `span` - range in `deg`, `m`, or `km`
- `tag`
- `offset`
- `limit` - default `20`
- `dataset` - uses the `searchDataset` list from the official spec
- `locale`
- `callback`

Response notes:
- JSON object with `meta` and `data`
- `meta` includes fields such as `hasmore`, `start`, `end`, `keyword`, and the centered coordinates when supplied

## 3) SmartSearch
- Method: `GET`
- Path: `/smartsearch/json/search`
- Host: `https://search.longdo.com`
- Purpose: expanded search flow that can escalate from raw search into SmartSearch / extended-search behavior

Documented base search parameters:
- `keyword`
- `area`
- `lon`, `lat`
- `span`
- `tag`
- `offset`
- `limit`
- `dataset`
- `locale`
- `callback`

Additional advanced controls visible in the official spec:
- `forcesmartsearch`
- `forcelimit`
- `extendedsearch` - docs note extra fee might apply
- `extendedlimit`
- `extendedkey`
- `extendedtype`
- `exceedtime`
- `cache`
- `extractaddress`

Important note:
- The official parameter descriptions explicitly warn that forcing SmartSearch or extended search can increase transactions.

## 4) Nearby POI
- Method: `GET`
- Path: `/POIService/json/search`
- Host: `https://api.longdo.com`
- Purpose: nearby place / POI search around a coordinate or area

Documented request parameters:
- `area`
- `lon`, `lat`
- `span`
- `tag`
- `zoom` - POI importantness level
- `offset`
- `limit` - default `20`
- `dataset` - uses the `poiDataset` list from the official spec
- `locale`
- `callback`

Response notes:
- JSON object with `meta` and `data`
- `meta` again includes `hasmore`, `start`, and `end`, signaling paged list-style responses

## 5) Extract address
- Method: `GET`
- Path: `/smartsearch/json/extract_address/v2`
- Host: `https://search.longdo.com`
- Purpose: parse free-form text into structured address components

Required parameter:
- `text` - address text to extract from

Documented optional parameters:
- `correction` - defaults to `1`
- `censor` - defaults to `0`; when `1`, phone numbers and email are removed from the `remark`
- `locale`

Response notes:
- Official schema returns a JSON object
- Response includes `meta` and a structured `data` array with address-part fields such as house number, floor, room, building, village, district hierarchy, and related parsed components

## 6) Geocoding
- Method: `GET`
- Path: `/addresslookup/api/addr/geocoding`
- Host: `https://search.longdo.com`
- Purpose: forward geocode an address string into structured location candidates

Required parameter:
- `text` - address text for location search

Documented optional parameter:
- `dataset` - additional dataset selector

Response notes:
- JSON array of result objects
- Each result exposes `confidence`, `location` address components, and `point` candidate coordinates
- The official schema shows nested address pieces including `houseno`, `road`, `village`, `moo`, `subdistrict`, `district`, `province`, and `zipcode`

## 7) Reverse geocoding
- Method: `GET`
- Path: `/map/services/address`
- Host: `https://api.longdo.com`
- Purpose: convert a Longdo ID or coordinate pair into address details

Documented request parameters:
- `id` - Longdo Map ID lookup
- `lon`, `lat` - used when `id` is not provided
- `locale`
- `noadmin`
- `nopostcode`
- `noelevation`
- `noroad`
- `noaoi`
- `nowater`
- `callback`

Response notes:
- JSON object matching the `ReverseGeocodingResult` schema
- Official examples show both `id`-based and coordinate-based lookup flows

## 8) Batch reverse geocoding
- Method: `GET`
- Path: `/map/services/addresses`
- Host: `https://api.longdo.com`
- Purpose: reverse geocode multiple coordinates in one request

Documented request parameters:
- `lon[]` - array of longitudes, up to `100` coordinates
- `lat[]` - array of latitudes, up to `100` coordinates
- `wkt` - optional Well-Known Text input when lon/lat arrays are not provided
- `locale`
- `noadmin`
- `nopostcode`
- `noelevation`
- `noroad`
- `noaoi`
- `nowater`
- `callback`

Response notes:
- JSON array of `ReverseGeocodingResult` objects
- Official description says `wkt` mode returns admin-only output

## 9) Geocode / Postcode
- Method: `GET`
- Path: `/POIService/json/address`
- Host: `https://api.longdo.com`
- Purpose: resolve a geocode or postcode into province/district/subdistrict and centroid coordinates

Documented request parameters:
- `geocode`
- `postcode` - used when `geocode` is not provided
- `locale`
- `callback`

Response notes:
- JSON object
- Official schema lists `geocode`, `province`, `district`, `subdistrict`, `lat`, and `lon`

## Rate limits, pagination, and errors
- Rate limits confirmed from the official pricing page for the free plan: `60 Requests/นาที` and `5,000 Requests/วัน`
- Usage volume confirmed from the official pricing page for the free plan: `< 100,000 /เดือน` service transactions
- Pagination controls confirmed only on list-style place endpoints via `offset` and `limit`
- The inspected official REST spec did not publish dedicated non-`200` response schemas for the confirmed routes

## Important usage notes
- Longdo's dataset parameter values differ by route family (`suggestDataset`, `searchDataset`, and `poiDataset`) and should not be treated as interchangeable.
- `locale` is not global UI metadata; it directly affects returned language on endpoints that expose the parameter.
- Batch reverse geocoding has an explicit `100`-coordinate cap in the official spec.
- The official examples use a visible test key string (`fortestonlydonotuseinproduction!`); that example credential should not be treated as a production credential.

## Verification notes
- This file was manually rebuilt from the live official Longdo docs, official OpenAPI document, and official pricing page using browser tools only.
