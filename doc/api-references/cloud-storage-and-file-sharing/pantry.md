# Pantry

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `pantry`
- Official docs/pages reviewed manually:
  - `https://getpantry.cloud/`
  - `https://documenter.getpostman.com/view/3281832/SzmZeMLC`
  - official Postman Documenter collection resource loaded by that page: `https://documenter.gw.postman.com/api/collections/3281832/SzmZeMLC?environment=3281832-8c4361fa-83c6-4b70-9715-c00a64727d10&segregateAuth=true&versionTag=latest`
- Confirmed API base URL in this pass: `https://getpantry.cloud/apiv1`
- Primary response format: JSON, with one plain-text public-id response
- Manually confirmed routes in this pass: `8`

## Authentication
- The reviewed homepage and Postman Documenter collection do not show an API-key header, bearer token, OAuth flow, or signed-request scheme.
- The private routes are scoped by path parameters on the URL itself:
  - `pantryId`
  - `basketName`
- The public-sharing route uses a generated `publicBasketId` instead of exposing the pantry ID or basket name.
- The request header shown throughout the official examples is:
  - `Content-Type: application/json`

## Common request / storage conventions
- Base URL: `https://getpantry.cloud/apiv1`
- The homepage describes Pantry as perishable cloud JSON storage for small projects and hackathons.
- Official homepage limits/behaviors confirmed in this pass:
  - up to `100` baskets per pantry
  - each basket can store up to `1.44mb`
  - optional JSON Schema validation per basket
  - public read-only URLs can be generated for sharing
  - data is deleted after a period of inactivity
- The official `Get Details` description says basket TTL is a lifespan in seconds and is refreshed by reading or writing (`GET`/`POST`/`PUT`) a basket.
- Response headers in the official examples show `Access-Control-Allow-Origin: *`, so the service exposes CORS on reviewed routes.

## Manually confirmed endpoint set

### 1) Get pantry details
- Method: `GET`
- Path: `/pantry/{pantryId}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}`
- Purpose: return pantry metadata and the list of stored baskets
- Path parameters:
  - `pantryId` — pantry identifier
- Request headers shown:
  - `Content-Type: application/json`
- Response notes confirmed in the official example:
  - returns `name`, `description`, `errors`, `notifications`, `percentFull`, and `baskets`
  - each basket entry includes `name` and `ttl`

### 2) Update pantry details
- Method: `PUT`
- Path: `/pantry/{pantryId}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}`
- Purpose: update pantry name and/or description
- Path parameters:
  - `pantryId`
- Request headers shown:
  - `Content-Type: application/json`
- Request body fields shown in the official example:
  - `name`
  - `description`
- Response notes:
  - returns the updated pantry object with the same pantry-level fields as `GET /pantry/{pantryId}`

### 3) Create or replace basket contents
- Method: `POST`
- Path: `/pantry/{pantryId}/basket/{basketName}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}/basket/{basketName}`
- Purpose: create a new basket or fully replace an existing basket's contents
- Path parameters:
  - `pantryId`
  - `basketName`
- Request headers shown:
  - `Content-Type: application/json`
- Request body example fields shown:
  - `derp`
  - `testPayload`
  - `keysLength`
- Response notes:
  - returns stored JSON plus generated `_metadata.createdAt`
  - `_metadata.updatedAt` is `null` on the create/replace example

### 4) Update basket contents
- Method: `PUT`
- Path: `/pantry/{pantryId}/basket/{basketName}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}/basket/{basketName}`
- Purpose: deep-merge new values into an existing basket
- Path parameters:
  - `pantryId`
  - `basketName`
- Request headers shown:
  - `Content-Type: application/json`
- Request body example field shown:
  - `newKey`
- Important usage note from the official description:
  - overwrites existing keys and appends values to nested objects or arrays during the merge
- Response notes:
  - returns merged basket JSON with both `_metadata.createdAt` and `_metadata.updatedAt`

### 5) Get basket contents
- Method: `GET`
- Path: `/pantry/{pantryId}/basket/{basketName}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}/basket/{basketName}`
- Purpose: return the full contents of the specified basket
- Path parameters:
  - `pantryId`
  - `basketName`
- Request headers shown:
  - `Content-Type: application/json`
- Response notes:
  - returns stored basket JSON including `_metadata`
  - official example response headers include `Cache-Control: s-maxage=10`

### 6) Delete basket
- Method: `DELETE`
- Path: `/pantry/{pantryId}/basket/{basketName}`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}/basket/{basketName}`
- Purpose: delete the basket permanently
- Path parameters:
  - `pantryId`
  - `basketName`
- Request headers shown:
  - `Content-Type: application/json`
- Response notes:
  - official example status is `204`
  - official description warns this action cannot be undone

### 7) Generate public basket ID
- Method: `GET`
- Path: `/pantry/{pantryId}/basket/{basketName}/public`
- Full URL pattern: `https://getpantry.cloud/apiv1/pantry/{pantryId}/basket/{basketName}/public`
- Purpose: generate a unique public ID for a basket
- Path parameters:
  - `pantryId`
  - `basketName`
- Request headers shown:
  - `Content-Type: application/json`
- Response notes:
  - official example returns a plain public ID string such as `4gdf9843ubin354u908gefrhiuew498`
  - this public ID can be used without exposing the pantry ID or basket name

### 8) Get contents of a public basket
- Method: `GET`
- Path: `/public/{publicBasketId}`
- Full URL pattern: `https://getpantry.cloud/apiv1/public/{publicBasketId}`
- Purpose: retrieve shared basket contents through the generated public basket ID
- Path parameters:
  - `publicBasketId`
- Request headers shown:
  - `Content-Type: application/json`
- Response notes from the official description/example:
  - returns basket contents without metadata
  - if the original basket no longer exists, the route returns an empty object
  - official example response headers include `Cache-Control: s-maxage=10`

## Pagination
- No pagination parameters are documented on the reviewed routes.
- The confirmed surface is CRUD-style single pantry / single basket access rather than list pagination.

## Rate limits
- The reviewed homepage and official Postman docs do not publish a numeric request-rate limit.
- I did not infer a rate policy that the official materials do not explicitly state.

## Error handling and response-format notes
- Most reviewed routes return JSON responses.
- `GET /pantry/{pantryId}/basket/{basketName}/public` returns a plain text public ID in the official example rather than a JSON object.
- `DELETE /pantry/{pantryId}/basket/{basketName}` is documented with a `204` success example.
- The private basket responses include `_metadata`; the public basket response explicitly excludes metadata.
- The pantry-level response shape includes an `errors` array, but the reviewed docs did not publish a broader named error-schema table.

## Important usage notes
- Pantry is intentionally small-scale storage, not a general large-object store.
- The official homepage frames the product around quick prototypes, smaller projects, and hackathon-style usage.
- Because basket TTL refreshes on reads and writes, integrations can keep data alive by normal access patterns.
- Public sharing should prefer the generated public-basket route rather than exposing pantry and basket identifiers directly.
- Basket `PUT` is not a full replace; the official description says it performs a deep merge.

## Verification note
This file was manually rebuilt from Pantry's official homepage, the official Postman Documenter page, and the official collection JSON fetched by that page using browser-based review and file edits only.