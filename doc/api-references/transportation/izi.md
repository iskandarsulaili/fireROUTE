# Izi

## Provider metadata
- Category: `Transportation`
- Provider slug: `izi`
- Official docs used manually:
  - `https://api-docs.izi.travel/`
- Base API URL: `https://api.izi.travel`
- Media host used by the official docs: `https://media.izi.travel`
- Authentication:
  - all API requests require an API key
  - preferred auth header: `X-IZI-API-KEY: <your_api_key>`
  - official docs also allow `api_key` as a query parameter for debugging purposes
  - limited-content access can additionally use `X-IZI-API-PASSWORD: <passcode>` or `password=<passcode>`
- Versioning:
  - requests should include a version
  - accepted via query parameter `version`
  - or via `Accept: application/izi-api-v[VERSION]+json`
  - if neither is provided, the docs say the earliest supported version is used, currently `1.2`
- Primary response format: UTF-8 JSON objects / arrays

## Important official usage notes
- The official docs expose 28 confirmed HTTP operations: 27 GET routes and 1 POST route.
- `languages` is mandatory on most content routes and acts as the content-localization filter.
- The docs explicitly recommend using the `includes` / `except` mechanism to reduce payload size.
- Optional `password` / `X-IZI-API-PASSWORD` is only needed to access limited content; otherwise the API returns publicly available published content.
- The docs support object forms such as `compact`, `short`, and `full`, but `full` is deprecated on search because it can take a long time to process.
- Content-caching guidance is built around object `hash` fields; clients are expected to use hashes to detect changed content and refresh only what changed.
- The docs recommend enabling gzip compression with `Accept-Encoding: gzip`.

## Rate limits, pagination, and errors
- No numeric public rate limit is published on the inspected official docs pages.
- The docs do publish a generic `429 Too Many Requests` error code, so throttling exists even though no quota number is given.
- Pagination is route-specific and uses `limit` / `offset` on the routes that page collections.
- Notable documented limits:
  - search defaults: `limit=50`, `offset=0`
  - city / country / publisher child listings commonly default to `limit=20`, `offset=0`
  - reviews: default `limit=25`, minimum `0`, maximum `100`
  - MTGObject parents: default `limit=20`, minimum `1`, maximum `100`
- Generic documented error codes:
  - `400` bad request / missing or invalid parameter
  - `403` forbidden / API key missing or invalid
  - `404` not found
  - `408` request timeout
  - `410` gone, usually invalid or outdated API version
  - `413` payload too large
  - `414` URI too long
  - `422` unprocessable entity, usually invalid UUID format
  - `429` too many requests
  - `499` client closed connection / did not read in time
  - `500` internal server error
  - `503` service unavailable
- The docs note that individual endpoints can declare additional endpoint-specific error codes.

## Confirmed API surface
The official docs currently expose 28 routes:
1. `GET /mtg/objects/search`
2. `GET /mtgobjects/{uuid}`
3. `GET /mtgobjects/batch/{uuid},{uuid},{uuid}`
4. `GET /mtgobjects/{uuid}/children/count`
5. `GET /mtgobjects/{uuid}/children`
6. `GET /mtgobjects/ip`
7. `GET /mtgobjects/{uuid}/parents`
8. `GET /cities`
9. `GET /cities/{uuid}`
10. `GET /cities/{uuid}/children`
11. `GET /cities/{uuid}/children/count`
12. `GET /cities/{uuid}/country`
13. `GET /countries`
14. `GET /countries/{uuid}`
15. `GET /countries/{uuid}/children`
16. `GET /countries/{uuid}/cities`
17. `GET /mtg/publishers/{uuid}`
18. `GET /mtg/publishers/{uuid}/children`
19. `GET /mtg/publishers/{uuid}/children/count`
20. `GET /mtg/publishers/{uuid}/children/languages`
21. `GET /featured`
22. `GET /featured/mobile`
23. `GET /mtgobjects/{uuid}/reviews`
24. `POST /mtgobjects/{uuid}/reviews`
25. `GET /languages/used`
26. `GET /languages/supported`
27. `GET /mtg/objects/{uuid}/presence`
28. `GET /mtgobjects/{uuid}/media_for_recognition`

## Common request and response notes
- Standard base URL for API routes is `https://api.izi.travel`.
- Most content routes require `languages` and accept versioning plus optional include/exclude controls.
- Common reusable query parameters across many routes:
  - `languages` - requested localization fallback chain
  - `version` - API version when not using the `Accept` header
  - `includes` / `except` - include or exclude response sections
  - `form` - compact / short / full object forms where supported
  - `limit` / `offset` - collection pagination on list-style endpoints
  - `password` - limited-content passcode when needed
- Error bodies remain JSON and contain `code` and `error` according to the docs.
- Media files are retrieved from `https://media.izi.travel/...` URL patterns documented separately from the API routes.

## Route groups and endpoint details

### MTGObject discovery and traversal

#### 1) Search MTGObjects, Cities, and Countries
- Method: `GET`
- Path: `/mtg/objects/search`
- Purpose: full-text and geo search across MTGObjects plus city / country entities
- Notable parameters:
  - required: authenticated request plus `languages`
  - optional filters: `type`, `publishers`, `cost`, `query`, `region`, `lat_lon`, `radius`, `ex_lat_lon`, `ex_radius`, `bbox`, `ex_bbox`, `geo_search_type`, `sort_by`, `filters`, `tours_categories`, `fwm`, `rating_min`, `rating_max`
  - payload controls: `includes`, `except`, `form`, `children_count_in_full_form`, `limit`, `offset`
- Notes:
  - defaults to object types `tour` and `museum` if `type` is omitted
  - docs say `limit` defaults to `50` and `offset` defaults to `0`
  - `form=short` is available from API version `1.6`

#### 2) Get MTGObject
- Method: `GET`
- Path: `/mtgobjects/{uuid}`
- Purpose: fetch one MTGObject by UUID
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`, `children_count_in_full_form`, `audio_duration`, `password`
- Notes:
  - default form is `full`

#### 3) Get multiple MTGObjects
- Method: `GET`
- Path: `/mtgobjects/batch/{uuid},{uuid},{uuid}`
- Purpose: fetch multiple MTGObjects in one call
- Notable parameters:
  - required: path UUID list, `languages`
  - optional: `includes`, `except`, `form`, `children_count_in_full_form`, `audio_duration`, `password`
- Notes:
  - default form is `compact`

#### 4) Get number of MTGObject children
- Method: `GET`
- Path: `/mtgobjects/{uuid}/children/count`
- Purpose: count children of a museum / tour / collection object
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `type`, `password`

#### 5) Get MTGObject children
- Method: `GET`
- Path: `/mtgobjects/{uuid}/children`
- Purpose: list child objects of an MTGObject
- Notable parameters:
  - required: `languages`
  - optional: `includes`, `except`, `form`, `children_count_in_full_form`, `audio_duration`, `limit`, `offset`, `type`, `show_hidden`, `password`
- Notes:
  - docs say `limit` defaults to `50` and `offset` defaults to `0`

#### 6) Get museum MTGObject by external IP address
- Method: `GET`
- Path: `/mtgobjects/ip`
- Purpose: resolve a museum object by external IP address
- Notable parameters:
  - required: `languages`
  - optional: `includes`, `except`, `form`, `children_count_in_full_form`, `audio_duration`, `password`

#### 7) Get MTGObject parents
- Method: `GET`
- Path: `/mtgobjects/{uuid}/parents`
- Purpose: list parent objects for a given MTGObject
- Notable parameters:
  - required: `languages`
  - optional: `includes`, `except`, `form`, `children_count_in_full_form`, `audio_duration`, `limit`, `offset`, `password`
- Notes:
  - defaults: `limit=20`, `offset=0`
  - documented maximum `limit` is `100`

### City endpoints

#### 8) Get list of cities
- Method: `GET`
- Path: `/cities`
- Purpose: list cities in the directory
- Notable parameters:
  - required: `languages`, `visible`
  - optional: `limit`, `offset`, `includes`, `except`, `form`
- Notes:
  - defaults: `limit=20`, `offset=0`
  - city include/exclude values are `city_images`

#### 9) Get city
- Method: `GET`
- Path: `/cities/{uuid}`
- Purpose: fetch one city by UUID
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`
- Notes:
  - supported city include/exclude values: `city_images`, `translations`

#### 10) Get city children
- Method: `GET`
- Path: `/cities/{uuid}/children`
- Purpose: list museums / tours inside a city
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `limit`, `offset`, `includes`, `except`, `form`, `children_count_in_full_form`, `type`
- Notes:
  - defaults: `limit=20`, `offset=0`
  - returned MTGObjects omit embedded city / country sections according to the docs

#### 11) Get number of city children
- Method: `GET`
- Path: `/cities/{uuid}/children/count`
- Purpose: count city children
- Notable parameters:
  - required: path `uuid`, `languages`

#### 12) Get city country
- Method: `GET`
- Path: `/cities/{uuid}/country`
- Purpose: fetch the country object for a city
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`

### Country endpoints

#### 13) Get list of countries
- Method: `GET`
- Path: `/countries`
- Purpose: list countries
- Notable parameters:
  - required: `languages`
  - optional: `limit`, `offset`, `includes`, `except`, `form`
- Notes:
  - defaults: `limit=20`, `offset=0`

#### 14) Get country
- Method: `GET`
- Path: `/countries/{uuid}`
- Purpose: fetch one country by UUID
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`

#### 15) Get country children
- Method: `GET`
- Path: `/countries/{uuid}/children`
- Purpose: list country-level MTGObject children
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `limit`, `offset`, `includes`, `except`, `form`, `children_count_in_full_form`, `type`
- Notes:
  - defaults: `limit=20`, `offset=0`

#### 16) Get country cities
- Method: `GET`
- Path: `/countries/{uuid}/cities`
- Purpose: list cities belonging to a country
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`

### Publisher endpoints

#### 17) Get publisher data
- Method: `GET`
- Path: `/mtg/publishers/{uuid}`
- Purpose: fetch one publisher and optionally embedded children
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `form`, `sort_by`
- Notes:
  - docs describe sorting by `popularity` or `title`

#### 18) Get publisher children
- Method: `GET`
- Path: `/mtg/publishers/{uuid}/children`
- Purpose: list a publisher's museums / tours
- Notable parameters:
  - required: path `uuid`, `languages`
  - optional: `includes`, `except`, `limit`, `offset`, `form`, `children_count_in_full_form`, `sort_by`
- Notes:
  - defaults: `limit=20`, `offset=0`

#### 19) Get number of publisher children
- Method: `GET`
- Path: `/mtg/publishers/{uuid}/children/count`
- Purpose: count publisher children
- Notable parameters:
  - required: path `uuid`, `languages`

#### 20) Get languages of publisher children
- Method: `GET`
- Path: `/mtg/publishers/{uuid}/children/languages`
- Purpose: discover language availability for a publisher's children
- Notable parameters:
  - required: path `uuid`, `languages`

### Featured content and reviews

#### 21) Website featured content
- Method: `GET`
- Path: `/featured`
- Purpose: retrieve website featured content
- Notable parameters:
  - required: `languages`

#### 22) Apps featured content
- Method: `GET`
- Path: `/featured/mobile`
- Purpose: retrieve mobile-app featured content
- Notable parameters:
  - required: `languages`
  - optional: `lat_lon`
- Notes:
  - when `lat_lon` is provided, content is sorted by ascending distance from the supplied coordinates

#### 23) Get reviews
- Method: `GET`
- Path: `/mtgobjects/{uuid}/reviews`
- Purpose: list ratings / reviews for an object
- Notable parameters:
  - required: path `uuid`
  - optional: `lang`, `offset`, `limit`
- Notes:
  - documented defaults / limits: default `limit=25`, min `0`, max `100`

#### 24) Post review
- Method: `POST`
- Path: `/mtgobjects/{uuid}/reviews`
- Purpose: create a rating / review for an object
- Notable parameters:
  - official section title: `POST REVIEWS`
  - path `uuid` is part of the route
- Notes:
  - the docs publish this as the only non-GET route in the public API surface
  - the public docs explain separate success vs error response sections, but the inspected summary view did not expose a concise single-line field table suitable for safe condensation beyond the route itself

### Language and utility endpoints

#### 25) Get used languages
- Method: `GET`
- Path: `/languages/used`
- Purpose: return languages currently used in the directory
- Notable parameters:
  - required: authenticated request
  - recommended: `version`

#### 26) Get supported languages
- Method: `GET`
- Path: `/languages/supported`
- Purpose: return the supported-language list
- Notable parameters:
  - required: authenticated request
  - recommended: `version`

#### 27) Detect object presence by UUID
- Method: `GET`
- Path: `/mtg/objects/{uuid}/presence`
- Purpose: detect whether some UUID exists in izi.DIRECTORY
- Notable parameters:
  - required: path `uuid`

#### 28) Media for recognition
- Method: `GET`
- Path: `/mtgobjects/{uuid}/media_for_recognition`
- Purpose: fetch recognition media for an MTGObject
- Notable parameters:
  - required: path `uuid`
  - optional: `languages`, `password`

## Sources inspected
- `https://api-docs.izi.travel/`
