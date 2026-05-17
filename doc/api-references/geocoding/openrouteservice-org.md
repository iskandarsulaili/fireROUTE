# openrouteservice.org

## Provider metadata
- Category: `Geocoding`
- Provider slug: `openrouteservice-org`
- Official docs used manually:
  - `https://openrouteservice.org/dev/#/api-docs/geocode`
  - `https://openrouteservice.org/dev/#/api-docs/geocode/search/get`
  - `https://openrouteservice.org/dev/#/api-docs/geocode/autocomplete/get`
  - `https://openrouteservice.org/dev/#/api-docs/geocode/search/structured/get`
  - `https://openrouteservice.org/dev/#/api-docs/geocode/reverse/get`
- Public API base URL documented by provider: `https://api.openrouteservice.org`
- Transport: `HTTPS`
- Auth model: GET requests can use query parameter `api_key`; the same geocode docs also say GET requests may use the `Authorization` header instead
- Response formats documented: `JSON`

## Product and access notes
- The inspected docs identify this API documentation as `ORS Core-Version 9.9.0`.
- The geocoding section is grouped under `Geocode` with the summary `Resolve input coordinates to addresses and vice versa`.
- The geocoding operation pages all label the interactive explorer as `experimental` and point to external Pelias documentation for deeper response details.
- The autocomplete page adds two extra operational warnings straight from the official docs: `Requests should be throttled` and `Responses are asynchronous`.

## Confirmed API surface
The inspected official docs confirm these `4` geocoding endpoints:
1. `GET /geocode/search`
2. `GET /geocode/autocomplete`
3. `GET /geocode/search/structured`
4. `GET /geocode/reverse`

## Shared request rules
- Auth is required on every inspected geocode route.
- All inspected geocode routes are `GET` requests under `https://api.openrouteservice.org`.
- The docs present geocoding output as JSON and describe the result as JSON-formatted objects/lists.
- Boundary parameters can be combined when they overlap.
- `sources` defaults to `osm,oa,gn,wof` on the inspected route pages.
- `size` defaults to `10` where it is shown.

## 1) Forward geocoding
- Method: `GET`
- Path: `/geocode/search`
- Full URL pattern shown by docs: `https://api.openrouteservice.org/geocode/search?api_key=your-api-key&text=Namibian Brewery`
- Purpose: search for places or addresses from free-form text

Documented required query parameters:
- `api_key`
- `text`

Documented optional query parameters shown on the inspected page:
- `focus.point.lon`
- `focus.point.lat`
- `boundary.rect.min_lon`
- `boundary.rect.min_lat`
- `boundary.rect.max_lon`
- `boundary.rect.max_lat`
- `boundary.circle.lon`
- `boundary.circle.lat`
- `boundary.circle.radius` - docs show default `50`
- `boundary.gid`
- `boundary.country`
- `sources` - docs show default `osm,oa,gn,wof`
- `layers`
- `size` - docs show default `10`

Important official notes:
- The page says results are JSON-formatted objects corresponding to the search input.
- The page says overlapping `boundary.*` filters can be combined.
- The route page exposes a `200` response row and points to external Pelias documentation for the response schema.

## 2) Autocomplete
- Method: `GET`
- Path: `/geocode/autocomplete`
- Full URL family shown by docs: `https://api.openrouteservice.org/geocode/autocomplete?...`
- Purpose: return type-ahead geocoding suggestions from partial text

Documented required query parameters:
- `api_key`
- `text`

Documented optional query parameters shown on the inspected page:
- `focus.point.lon`
- `focus.point.lat`
- `boundary.rect.min_lon`
- `boundary.rect.min_lat`
- `boundary.rect.max_lon`
- `boundary.rect.max_lat`
- `boundary.country`
- `sources` - docs show default `osm,oa,gn,wof`
- `layers`

Important official notes:
- The official page explicitly warns that requests to this endpoint `should be throttled`.
- The same page explicitly says `Responses are asynchronous`.
- The page otherwise describes the output as JSON-formatted objects corresponding to the search input.

## 3) Structured forward geocoding
- Method: `GET`
- Path: `/geocode/search/structured`
- Full URL family shown by docs: `https://api.openrouteservice.org/geocode/search/structured?...`
- Purpose: geocode from already separated address fields instead of one free-form search string

Documented query parameters shown on the inspected page:
- `api_key`
- `address`
- `neighbourhood`
- `country`
- `postalcode`
- `region`
- `county`
- `locality` - docs example/default shown as `Tokyo`
- `borough`
- `focus.point.lon`
- `focus.point.lat`
- `boundary.rect.min_lon`
- `boundary.rect.min_lat`
- `boundary.rect.max_lon`
- `boundary.rect.max_lat`
- `boundary.circle.lon`
- `boundary.circle.lat`
- `boundary.circle.radius` - docs show default `50`
- `boundary.country`
- `layers`
- `sources` - docs show default `osm,oa,gn,wof`
- `size` - docs show default `10`

Important official notes:
- The docs label this endpoint `Structured Forward Geocode Service (beta)`.
- The page says the result is a JSON-formatted list corresponding to the structured input.
- The route page exposes a `200` response row and points to external Pelias documentation for deeper response details.

## 4) Reverse geocoding
- Method: `GET`
- Path: `/geocode/reverse`
- Full URL family shown by docs: `https://api.openrouteservice.org/geocode/reverse?...`
- Purpose: resolve coordinates to the enclosing address object

Documented required query parameters:
- `api_key`
- `point.lon`
- `point.lat`

Documented optional query parameters shown on the inspected page:
- `boundary.circle.radius` - docs show default `1`
- `size` - docs show default `10`
- `layers`
- `sources` - docs show default `osm,oa,gn,wof`
- `boundary.country`

Important official notes:
- The page says the endpoint returns the next enclosing object with an address tag around the given coordinate.
- The route page exposes a `200` response row and points to external Pelias documentation for the response schema.

## Pagination, errors, rate limits, and format notes
- The inspected geocode pages did not expose page-number or cursor pagination. Result-window control is parameter-based through `size`.
- The inspected operation pages surfaced `200` response rows but did not expose a standalone ORS geocode error-code table in the page sections reviewed here.
- No numeric geocoding quota or per-minute rate limit was surfaced on the inspected geocode pages in this run.
- The only explicit rate/traffic guidance on the reviewed geocode pages is the autocomplete warning to throttle requests.
- All inspected geocoding routes were presented as JSON-returning endpoints.

## Canonical fireROUTE notes
- Preserve the four geocode routes as distinct operations; autocomplete, structured search, and reverse geocoding each have their own parameter set and usage notes.
- Preserve ORS's documented GET auth flexibility: `api_key` query auth is explicitly documented, but GET also accepts an `Authorization` header according to the authentication section.
- Treat autocomplete as special-purpose interactive UX traffic because the official docs explicitly warn that it should be throttled and that responses are asynchronous.
- Preserve the Pelias-style `boundary.*`, `layers`, and `sources` parameter naming exactly as documented.

## Verification notes
- This file was manually rebuilt from the live official openrouteservice geocoding docs using browser tools only.
