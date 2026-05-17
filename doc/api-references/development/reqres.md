# ReqRes

## Provider metadata
- Category: `Development`
- Provider slug: `reqres`
- Docs used manually:
  - `https://reqres.in/docs`
  - `https://reqres.in/openapi.json`
- Confirmed base URL: `https://reqres.in`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass:
  - all `/api/*` endpoints require `x-api-key`
  - `/app/*` endpoints require `Authorization: Bearer {session_token}`
- Manually confirmed routes in this pass: `10`

## Authentication
The current official ReqRes docs no longer describe a completely anonymous demo API.

Confirmed auth details from the official docs and OpenAPI spec:
- every `/api/*` request requires header `x-api-key`
- the docs' quickstart examples also send `X-Reqres-Env: prod` to target a specific environment
- per-user app sessions use `Authorization: Bearer {session_token}` on `/app/*` endpoints
- the docs say you create a project and keys on `app.reqres.in`
- `POST /api/app-users/login` creates or logs in an app user and sends a magic-link token
- the OpenAPI description says `/agent/v1/*` is open in v1 and uses IP-based rate limiting, but this file focuses on the normal `/api/*` and `/app/*` surfaces documented in the assigned provider entry

## Common request/response conventions
- Base URL: `https://reqres.in`
- Confirmed production server in the OpenAPI document: `https://reqres.in`
- Confirmed development server in the OpenAPI document: `http://localhost:8000`
- Primary response format: JSON
- Current docs mix two product surfaces:
  - legacy demo/user endpoints under `/api/users`, `/api/login`, `/api/register`
  - project-backed persistent collection endpoints under `/api/collections/*`
- Collection APIs optionally accept environment header `X-Reqres-Env` (examples use `prod`)
- Standard error schema in the OpenAPI spec contains at least:
  - `error`
  - optional `message`

## Manually confirmed endpoint set

### 1) List legacy demo users
- Method: `GET`
- Path: `/api/users`
- Full URL: `https://reqres.in/api/users`
- Purpose: retrieve a paginated list of demo users
- Required auth:
  - `x-api-key`
- Confirmed query parameters:
  - `page` - optional integer, default `1`
  - `per_page` - optional integer, min `1`, max `100`
- Confirmed success response:
  - `200` JSON list response
- Confirmed error response:
  - `400`

### 2) Create a legacy demo user
- Method: `POST`
- Path: `/api/users`
- Full URL: `https://reqres.in/api/users`
- Purpose: create a demo user and echo the payload with generated metadata
- Required auth:
  - `x-api-key`
- Confirmed request body:
  - JSON `LegacyMutationRequest`
- Confirmed success response:
  - `201` with generated `id` and `createdAt`
- Confirmed error response:
  - `400`

### 3) Get a legacy demo user by ID
- Method: `GET`
- Path: `/api/users/{id}`
- Full URL: `https://reqres.in/api/users/{id}`
- Purpose: retrieve a single demo user record
- Path parameters:
  - `id` - required integer user ID
- Required auth:
  - `x-api-key`
- Confirmed success response:
  - `200`
- Confirmed error response:
  - `404`

### 4) Update a legacy demo user
- Methods confirmed: `PUT`, `PATCH`
- Path: `/api/users/{id}`
- Full URL: `https://reqres.in/api/users/{id}`
- Purpose: update or partially update a demo user
- Path parameters:
  - `id` - required integer user ID
- Required auth:
  - `x-api-key`
- Confirmed request body:
  - JSON `LegacyMutationRequest`
- Confirmed success response:
  - `200` with echoed fields and `updatedAt`
- Confirmed error response:
  - `400`

### 5) Delete a legacy demo user
- Method: `DELETE`
- Path: `/api/users/{id}`
- Full URL: `https://reqres.in/api/users/{id}`
- Purpose: delete a demo user
- Path parameters:
  - `id` - required integer user ID
- Required auth:
  - `x-api-key`
- Confirmed success response:
  - `204 No Content`

### 6) Log in a legacy demo user
- Method: `POST`
- Path: `/api/login`
- Full URL: `https://reqres.in/api/login`
- Purpose: authenticate a demo user and return a token
- Required auth:
  - `x-api-key`
- Confirmed request body:
  - JSON `AuthRequest`
- Confirmed success response:
  - `200` with `token`
- Confirmed error response:
  - `400`

### 7) Register a legacy demo user
- Method: `POST`
- Path: `/api/register`
- Full URL: `https://reqres.in/api/register`
- Purpose: register a demo account
- Required auth:
  - `x-api-key`
- Confirmed request body:
  - JSON `AuthRequest`
- Confirmed success response:
  - `200` with `token` and optional `id`
- Confirmed error response:
  - `400`

### 8) Start an app-user login flow
- Method: `POST`
- Path: `/api/app-users/login`
- Full URL: `https://reqres.in/api/app-users/login`
- Purpose: create or log in an app user and send a magic-link token
- Required auth:
  - `x-api-key`
- Confirmed request body fields:
  - `email` - required, email format
  - `metadata` - optional object
  - `project_id` - optional string or integer
- Confirmed success response:
  - `200` with top-level `data`
- Confirmed error responses:
  - `400`
  - `401`

### 9) List or create records in a project collection
- Methods confirmed: `GET`, `POST`
- Path: `/api/collections/{slug}/records`
- Full URL: `https://reqres.in/api/collections/{slug}/records`
- Purpose:
  - `GET` lists records with filtering/pagination
  - `POST` creates a new record in the collection
- Required auth:
  - `x-api-key`
- Optional header:
  - `X-Reqres-Env` - environment key such as `prod` or `dev`
- Path parameters:
  - `slug` - collection slug
- Confirmed `GET` query parameters:
  - `page` - optional page number, minimum `1`
  - `limit` - optional page size, min `1`, max `100`
  - `search` - optional case-insensitive text search
  - `created_before` - optional date-time
  - `created_after` - optional date-time
  - `data_contains` - optional JSON-string containment filter
  - `order` - optional `asc` or `desc`
  - `include_deleted` - optional boolean
- Confirmed `POST` request body:
  - JSON `CollectionRecordCreateRequest`
- Confirmed response format:
  - list responses contain `data` plus `meta.page`, `meta.pages`, `meta.limit`, `meta.total`
  - single create responses contain top-level `data`
- Confirmed error responses:
  - `400`
  - `404`

### 10) Work with a specific collection record
- Methods confirmed: `GET`, `PUT`, `DELETE`
- Path: `/api/collections/{slug}/records/{recordId}`
- Full URL: `https://reqres.in/api/collections/{slug}/records/{recordId}`
- Purpose:
  - `GET` fetch a record by ID
  - `PUT` update a record by ID
  - `DELETE` delete a record by ID
- Required auth:
  - `x-api-key`
- Optional header:
  - `X-Reqres-Env`
- Path parameters:
  - `slug` - collection slug
  - `recordId` - record identifier
- Confirmed request body for `PUT`:
  - JSON `CollectionRecordUpdateRequest`
- Confirmed success responses:
  - `200` for read/update
  - `204` for delete
- Confirmed error responses:
  - `400` on update
  - `404` on read/update/delete

## Additional app-user route family confirmed
The OpenAPI spec also documents app-user collection routes under `/app/collections/{slug}/records` and `/app/collections/{slug}/records/{recordId}` authenticated by `Authorization: Bearer`. This file focuses on the ten routes above, but those additional `/app/*` collection variants are officially present and use the same collection concepts with session-token auth.

## Pagination
- Legacy user listing uses page-based pagination via `page` and `per_page`.
- Collection record listing uses page-based pagination via `page` and `limit`.
- Confirmed list response metadata fields for collections:
  - `page`
  - `pages`
  - `limit`
  - `total`

## Error handling
- ReqRes' OpenAPI schema defines JSON error objects with at least `error` and optional `message`.
- Route-specific error statuses confirmed in this pass:
  - `400` invalid request data
  - `401` invalid or missing auth for selected app-user flows
  - `404` missing user or record
  - `204` successful delete with no body
- The docs' common-issues section additionally warns that:
  - missing `x-api-key` causes auth failures on `/api/*`
  - using the wrong `Authorization: Bearer` versus `x-api-key` model causes failures
  - environment header issues can occur if `X-Reqres-Env` is not set as expected

## Rate limits
- The current public docs warn about `rate limits in CI` and WAF-related failures, but the pages reviewed in this pass do not publish a numeric requests-per-minute policy for normal `/api/*` or `/app/*` traffic.
- The OpenAPI description only makes one explicit numeric-style statement: `/agent/v1/*` is `IP-based rate limiting`.
- Because no concrete number for the main `/api/*` surface was exposed on the official pages reviewed here, this file does not invent one.

## Response format notes
- Legacy login returns `{ "token": string }`
- Legacy registration returns `{ "token": string, "id": integer? }`
- Collection record responses use top-level `data`
- Collection list responses use top-level `data` and `meta`
- App-user login returns a top-level `data` object

## Important usage notes
- the current ReqRes product is no longer just a static fake REST demo; it now includes project-backed persistent collections and app-user flows
- use `x-api-key` for project/admin style API access under `/api/*`
- use `Authorization: Bearer {session_token}` for end-user scoped `/app/*` requests
- the docs explicitly recommend creating a project and keys on `app.reqres.in`
- sample collection examples use a starter `products` collection

## Verification notes
This file was manually rebuilt from ReqRes' official docs landing page and official OpenAPI document, replacing the earlier placeholder that still reflected the older unauthenticated-demo mental model.