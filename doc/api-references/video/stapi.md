# STAPI

## Provider metadata
- Category: `Video`
- Provider slug: `stapi`
- Official pages manually reviewed:
  - `https://stapi.co/`
  - `https://stapi.co/api-overview`
  - `https://stapi.co/api-documentation`
  - `https://stapi.co/api/v1/rest/common/download/stapi.yaml`
  - `https://editor.swagger.io/?url=https://stapi.co/api/v1/rest/common/download/stapi.yaml`
- Main API base URL: `https://stapi.co/api`
- Alternate published server: `http://stapi.co/api`
- Auth model: no authentication; the official overview says legacy API keys were dropped and are ignored
- Supported methods: `GET`, `POST`
- Search request body format: `application/x-www-form-urlencoded`
- Response format: `application/json`
- OpenAPI version: `3.0.3`
- Published spec version: `0.1.4`
- Manually confirmed route count: `169`

## Authentication
- The official API overview says STAPI is publicly available via REST.
- The same page says API keys were supported in the past, but support for them was dropped.
- If an old client still expects an API key, the docs say to send `null` or an empty string because all API keys are ignored.

## API-wide behavior
- STAPI describes itself as a read-only Star Trek API.
- The official overview says REST is the best choice for quick integrations.
- The documentation page publishes a single downloadable OpenAPI specification at `/api/v1/rest/common/download/stapi.yaml`.
- The official overview says every entity version exposes:
  - one REST endpoint for retrieving a full entity by UID
  - one search endpoint that supports listing and filtered searching
- The docs say filtered searches should be sent as `POST` requests with `application/x-www-form-urlencoded` bodies.
- STAPI supports a `pretty` query flag that pretty-prints JSON responses.
- The overview warns that UIDs can change over time because they are generated from upstream Memory Alpha / Memory Beta page IDs.

## Rate limits
- The official API overview says there are currently no enforced limits on STAPI usage.
- The same note asks users to be reasonable because the service is a pet project and not backed by major infrastructure.

## Route inventory overview
- The official OpenAPI file contains `169` operations across `114` paths.
- Confirmed path-version spread from the official spec:
  - `v1` paths: `81`
  - `v2` paths: `32`
  - `v3` paths: `1`
- The reviewed spec covers `40` entity families.
- Highest-volume tags in the official spec include:
  - `SpacecraftClass` - `7` operations
  - `AstronomicalObject` - `6`
  - `Book` - `6`
  - `Company` - `6`
  - `Element` - `6`
  - `Location` - `6`
  - `Occupation` - `6`
  - `Performer` - `6`
  - `Spacecraft` - `6`
  - `Species` - `6`
  - `Staff` - `6`
  - `Technology` - `6`
  - `Title` - `6`
  - `VideoRelease` - `6`
  - `Weapon` - `6`

## Canonical REST patterns

### 1) Retrieve a single entity by UID
- Method: `GET`
- Path pattern: `/v{version}/rest/{entity}`
- Required query parameter: `uid`
- Purpose: fetch one full entity record plus its related entities

Official examples and confirmed paths:
- `GET /v1/rest/season?uid=SAMA0000001633`
- `GET /v1/rest/character?uid={uid}`
- `GET /v1/rest/book?uid={uid}`
- `GET /v2/rest/book?uid={uid}`
- `GET /v1/rest/spacecraftClass?uid={uid}`
- `GET /v2/rest/spacecraftClass?uid={uid}`
- `GET /v3/rest/spacecraftClass?uid={uid}`

### 2) List entities with pagination
- Method: `GET`
- Path pattern: `/v{version}/rest/{entity}/search`
- Purpose: page through a resource collection without supplying search criteria

Confirmed shared query parameters from the official spec:
- `pageNumber` - optional zero-based page number
- `pageSize` - optional page size

Official example from the overview:
- `GET /api/v1/rest/season/search`

Additional confirmed paths from the spec:
- `GET /v1/rest/animal/search`
- `GET /v1/rest/character/search`
- `GET /v1/rest/episode/search`
- `GET /v1/rest/movie/search`
- `GET /v1/rest/videoGame/search`
- `GET /v2/rest/astronomicalObject/search`
- `GET /v2/rest/title/search`

### 3) Run a filtered search
- Method: `POST`
- Path pattern: `/v{version}/rest/{entity}/search`
- Query parameters:
  - `pageNumber` - optional zero-based page number
  - `pageSize` - optional page size
  - `sort` - optional sort expression; the spec describes the serialized form as `fieldName,ASC;anotherFieldName,DESC`
- Body format: `application/x-www-form-urlencoded`
- Purpose: search an entity family using entity-specific form fields

Confirmed examples from the official spec:
- `POST /v1/rest/animal/search`
- `POST /v1/rest/character/search`
- `POST /v1/rest/season/search`
- `POST /v1/rest/tradingCard/search`
- `POST /v2/rest/book/search`
- `POST /v2/rest/videoRelease/search`
- `POST /v3/rest/spacecraftClass/search`

## Representative entity families confirmed in the official spec
- `animal` - `v1` detail + search
- `astronomicalObject` - `v1`, `v2`
- `book` - `v1`, `v2`
- `character` - `v1`
- `comicCollection` - `v1`, `v2`
- `company` - `v1`, `v2`
- `conflict` - `v1`, `v2`
- `episode` - `v1`
- `location` - `v1`, `v2`
- `movie` - `v1`
- `occupation` - `v1`, `v2`
- `performer` - `v1`, `v2`
- `season` - `v1`
- `series` - `v1`
- `spacecraft` - `v1`, `v2`
- `spacecraftClass` - `v1`, `v2`, `v3`
- `species` - `v1`, `v2`
- `staff` - `v1`, `v2`
- `technology` - `v1`, `v2`
- `title` - `v1`, `v2`
- `tradingCard`, `tradingCardDeck`, `tradingCardSet` - `v1`
- `videoGame` - `v1`
- `videoRelease` - `v1`, `v2`
- `weapon` - `v1`, `v2`

## Parameters, pagination, and sorting
- Single-entity routes require `uid` as a query parameter.
- Search/list routes use `pageNumber` and `pageSize` for pagination.
- POST search routes also accept `sort`.
- The official schemas define request sort clauses with:
  - `name` - field name
  - `direction` - `ASC` or `DESC`
  - `clauseOrder` - order in which the sort clause is applied
- Search form fields vary by entity family. Examples confirmed in the spec include:
  - `Animal` search: `name`, `earthAnimal`, `earthInsect`, `avian`, plus pagination/sort controls
  - `Food` search: `name`, `earthlyOrigin`, `dessert`, `fruit`, `herbOrSpice`, `sauce`, plus pagination/sort controls
  - `Season` search: entity-specific form criteria plus the shared pagination/sort controls defined above

## Response and error notes
- Successful responses return JSON objects whose schemas vary by entity family.
- Search/list responses use the shared `ResponsePage` model with these fields:
  - `pageNumber`
  - `pageSize`
  - `numberOfElements`
  - `totalElements`
  - `totalPages`
  - `firstPage`
  - `lastPage`
- The shared response sort model includes ordered sort clauses and `ASC`/`DESC` directions.
- Default error responses use the shared `Error` schema with:
  - `code`
  - `message`

## Important usage notes
- The official docs recommend using the published OpenAPI contracts or an existing STAPI client if you are integrating into a larger codebase.
- The overview explicitly says REST is the quickest option when you just want to start consuming the API.
- Because UIDs can change when upstream wiki pages move, stored identifiers should not be treated as permanently immutable.
- If you need a machine-readable contract, use the official downloadable OpenAPI YAML rather than scraping the site UI.
