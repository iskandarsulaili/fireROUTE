# FoodData Central

## Provider metadata
- Category: `Health`
- Provider slug: `fooddata-central`
- Official docs/pages used:
  - `https://fdc.nal.usda.gov/api-guide`
  - `https://fdc.nal.usda.gov/api-spec/fdc_api.html`
  - `https://api.nal.usda.gov/fdc/v1/json-spec?api_key=DEMO_KEY`
- Current public API base URL: `https://api.nal.usda.gov/fdc`
- Auth model: `api_key` query parameter (USDA docs say a `data.gov` API key is required)
- Response format: JSON
- License note from official docs: USDA FoodData Central data are in the public domain under `CC0 1.0`
- Default rate limit from official docs: `1,000 requests per hour per IP`; exceeding the limit temporarily blocks the API key for `1 hour`
- Manually confirmed route count: `9`

## Authentication
The API guide states that anyone may access the API, but every request must include a `data.gov` API key.

Documented auth mechanism:
- query parameter: `api_key`

The guide also notes:
- `DEMO_KEY` can be used for initial exploration
- API keys exposed publicly, such as in public repositories, may be deactivated

## Canonical endpoints
The official HTML OpenAPI documentation publishes these operations under the server `https://api.nal.usda.gov/fdc`.

1. `GET /v1/food/{fdcId}` - fetch one food item by FDC ID
2. `GET /v1/foods` - fetch multiple foods by FDC IDs
3. `POST /v1/foods` - fetch multiple foods by FDC IDs using a JSON body
4. `GET /v1/foods/list` - list foods in abridged format
5. `POST /v1/foods/list` - list foods in abridged format using JSON criteria
6. `GET /v1/foods/search` - search foods by query string
7. `POST /v1/foods/search` - search foods using JSON criteria
8. `GET /v1/json-spec` - return the API documentation in JSON format
9. `GET /v1/yaml-spec` - return the API documentation in YAML format

## Path/query/body parameters
### 1) `GET /v1/food/{fdcId}`
Path parameters:
- `fdcId` - required food identifier

Optional query parameters:
- `format` - `abridged` or `full`
- `nutrients` - array of up to `25` nutrient numbers

Documented responses:
- `200`
- `400`
- `404`

### 2) `GET /v1/foods`
Required query parameters:
- `fdcIds` - array of `1..20` food IDs

Optional query parameters:
- `format` - `abridged` or `full`
- `nutrients` - array of `1..25` nutrient numbers

Documented responses:
- `200`
- `400`

### 3) `POST /v1/foods`
Request body content type:
- `application/json`

Official `FoodsCriteria` body fields:
- `fdcIds` - required array of `1..20` IDs
- `format` - optional `abridged` or `full`
- `nutrients` - optional array of up to `25` nutrient numbers

### 4) `GET /v1/foods/list`
Optional query parameters:
- `dataType` - array of one or more of `Branded`, `Foundation`, `Survey (FNDDS)`, `SR Legacy`
- `pageSize` - integer `1..200`
- `pageNumber`
- `sortBy` - one of `dataType.keyword`, `lowercaseDescription.keyword`, `fdcId`, `publishedDate`
- `sortOrder` - `asc` or `desc`

### 5) `POST /v1/foods/list`
Request body content type:
- `application/json`

Official `FoodListCriteria` body fields:
- `dataType`
- `pageSize` - default `50`, max `200`
- `pageNumber`
- `sortBy`
- `sortOrder`

### 6) `GET /v1/foods/search`
Required query parameters:
- `query`

Optional query parameters:
- `dataType`
- `pageSize` - integer `1..200`
- `pageNumber`
- `sortBy`
- `sortOrder`
- `brandOwner`

### 7) `POST /v1/foods/search`
Request body content type:
- `application/json`

Official `FoodSearchCriteria` body fields:
- `query`
- `brandOwner`
- `dataType`
- `pageSize`
- `pageNumber`
- `sortBy`
- `sortOrder`

### 8) `GET /v1/json-spec`
- No documented parameters beyond `api_key`
- Returns the OpenAPI spec in JSON form

### 9) `GET /v1/yaml-spec`
- No documented parameters beyond `api_key`
- Returns the OpenAPI spec in YAML form

## Response notes
The published OpenAPI and guide indicate these broad response shapes:
- `GET /v1/food/{fdcId}` returns one food item; the OpenAPI shows `AbridgedFoodItem`, `BrandedFoodItem`, `FoundationFoodItem`, `SRLegacyFoodItem`, or `SurveyFoodItem`
- `GET /v1/foods/list` returns an array of abridged food items
- search/list operations are paged via `pageNumber` and `pageSize`

The API guide's examples show canonical host/path patterns such as:
- `https://api.nal.usda.gov/fdc/v1/food/{fdcId}?api_key=DEMO_KEY`
- `https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY`
- `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=Cheddar%20Cheese`

## Data and usage notes from official docs
- The API is intended to help developers incorporate nutrient data into their apps and websites.
- The newer FoodData Central API supersedes the older USDA Food Composition Databases API.
- The guide explicitly says the newer API exposes SR Legacy, Branded Foods, Foundation Foods, and FNDDS data.
- Official docs recommend reviewing data-type documentation to understand field definitions before integration.

## fireROUTE normalization notes
- Normalize this as a compact REST API rooted at `/fdc/v1` with a single query-based auth model.
- Preserve both `GET` and `POST` variants for `/foods`, `/foods/list`, and `/foods/search`; the POST variants expose richer JSON criteria and should not be collapsed away.
- Treat `pageNumber`/`pageSize` as the canonical pagination model.
- Preserve `dataType` filtering because it changes which USDA food corpus is being queried.