# Gorest

## Provider metadata
- Category: `Development`
- Provider slug: `gorest`
- Docs used manually:
  - `https://gorest.co.in/docs`
  - `https://gorest.co.in/docs/curl`
  - `https://gorest.co.in/docs/rate-limiting`
  - `https://gorest.co.in/docs/http-status-codes`
  - `https://gorest.co.in/recipes/paginated-user-list-react`
  - `https://gorest.co.in/rest-console`
- Confirmed REST API base URL: `https://gorest.co.in/public/v2`
- Primary media types: JSON, XML
- Authentication: Bearer access token in `Authorization`
- Manually confirmed routes in this pass: `10`

## Authentication
From the official Go REST docs:
- authenticated requests use `Authorization: Bearer {access-token}`
- the cURL guide sets `export API=https://gorest.co.in/public/v2`
- the status-code guide documents `401` responses for missing, malformed, invalid, or expired tokens
- token limits are configured per token in `/my-account/access-tokens`

## Common request/response conventions
- Base URL: `https://gorest.co.in/public/v2`
- content negotiation is driven by the `Accept` header:
  - JSON is the default response format
  - XML is also supported on read endpoints
- write requests shown in the official docs send `Content-Type: application/json`
- the status-code guide says unsupported body types return `415` unless the body is `application/json` or `application/xml`
- list endpoints return plain arrays directly; the cURL guide explicitly says there is no top-level `data` wrapper
- list filtering uses query parameters that match resource fields; the cURL guide describes substring matching on strings and exact matching on enums
- the official docs expose test-only simulation query parameters:
  - `delay` - pause the response by N milliseconds, up to `5000`
  - `force_status` - force a specific HTTP status for testing
- simulated responses advertise `X-Simulated-Delay-Ms` and `X-Simulated-Status`

## Manually confirmed endpoint set

### 1) List users
- Method: `GET`
- Path: `/users`
- Full URL: `https://gorest.co.in/public/v2/users`
- Purpose: list user resources
- Query parameters explicitly confirmed from official docs/examples:
  - `page` - page number
  - `per_page` - page size override; recipe docs say default `10`, max `100`
  - `status` - exact-match enum filter such as `active`
  - `email` - string filter shown in the cURL guide
  - `delay`
  - `force_status`
- Response notes:
  - returns a JSON or XML collection depending on `Accept`
  - JSON list responses are arrays, not wrapped objects
  - pagination metadata is returned in headers, not in the body
- Important usage notes from the official docs:
  - pagination headers include `X-Pagination-Total`, `X-Pagination-Pages`, `X-Pagination-Page`, and `X-Pagination-Limit`
  - the pagination recipe recommends reading `X-Pagination-Pages` rather than guessing when pagination is finished

### 2) Get one user
- Method: `GET`
- Path: `/users/{id}`
- Full URL: `https://gorest.co.in/public/v2/users/{id}`
- Purpose: fetch a single user by numeric id
- Path parameters:
  - `id` - user id
- Response fields shown in the official examples:
  - `id`
  - `name`
  - `email`
  - `gender`
  - `status`
- Important usage notes from the official docs:
  - a missing user id returns `404`
  - the same route can return XML if requested via `Accept`

### 3) Create a user
- Method: `POST`
- Path: `/users`
- Full URL: `https://gorest.co.in/public/v2/users`
- Purpose: create a new user record
- Required request headers shown in the official docs:
  - `Authorization: Bearer {access-token}`
  - `Content-Type: application/json`
- Request body fields explicitly shown in the official example:
  - `name`
  - `email`
  - `gender`
  - `status`
- Response notes:
  - returns `201 Created`
  - response body contains the created resource, including its server-assigned `id`
  - `Location` header points to the new row
- Validation/error notes:
  - invalid request bodies produce `422` with an array of `{ "field": "...", "message": "..." }` objects

### 4) Replace a user
- Method: `PUT`
- Path: `/users/{id}`
- Full URL: `https://gorest.co.in/public/v2/users/{id}`
- Purpose: full replacement update for an existing user
- Path parameters:
  - `id` - user id
- Request notes confirmed from official docs:
  - the cURL guide and REST console distinguish `PUT` from `PATCH`
  - the status-code guide notes some successful `PUT` operations may return `204 No Content`
- Body format:
  - official write examples use JSON bodies with the same user fields as create (`name`, `email`, `gender`, `status`)

### 5) Partially update a user
- Method: `PATCH`
- Path: `/users/{id}`
- Full URL: `https://gorest.co.in/public/v2/users/{id}`
- Purpose: partial update of selected fields on an existing user
- Path parameters:
  - `id` - user id
- Request body fields explicitly shown in the official example:
  - `status`
- Response notes:
  - the status-code guide says partial updates return `200 OK`

### 6) Delete a user
- Method: `DELETE`
- Path: `/users/{id}`
- Full URL: `https://gorest.co.in/public/v2/users/{id}`
- Purpose: remove a user resource
- Path parameters:
  - `id` - user id
- Response notes:
  - official docs say successful deletes return `204 No Content`
  - clients should not try to parse JSON from a `204` response body

### 7) List posts
- Method: `GET`
- Path: `/posts`
- Full URL: `https://gorest.co.in/public/v2/posts`
- Purpose: list posts
- Query parameters explicitly shown in official examples:
  - `page`
  - `per_page`
  - `delay`
  - `force_status`
- Response notes:
  - the cURL guide groups `/posts` with the same array-returning read endpoints as `/users`, `/comments`, and `/todos`

### 8) List comments
- Method: `GET`
- Path: `/comments`
- Full URL: `https://gorest.co.in/public/v2/comments`
- Purpose: list comments
- Query conventions confirmed from official docs:
  - list endpoints accept field-matching filters plus normal pagination controls
  - comments belong to the same four read-endpoint family described in the cURL guide

### 9) List todos
- Method: `GET`
- Path: `/todos`
- Full URL: `https://gorest.co.in/public/v2/todos`
- Purpose: list todo items
- Query parameters explicitly shown in official examples:
  - `status`
  - `page`
  - `per_page`
  - `delay`
  - `force_status`
- Response notes:
  - the cURL guide shows `status=completed` filtering on this endpoint

### 10) Create a comment under a post
- Method: `POST`
- Path: `/posts/{post_id}/comments`
- Full URL: `https://gorest.co.in/public/v2/posts/{post_id}/comments`
- Purpose: create a comment nested under a post
- Path parameters:
  - `post_id` - target post id
- Confirmation source:
  - the status-code guide explicitly contrasts this route with the invalid `POST /comments` example when explaining `405 Method Not Allowed`
- Important usage notes from the official docs:
  - `POST /comments` is the wrong shape and triggers `405`
  - the nested route is the valid write pattern for post comments

## Pagination
From the official pagination recipe and cURL guide:
- list pagination is header-driven rather than body-driven
- headers confirmed on list responses:
  - `X-Pagination-Total`
  - `X-Pagination-Pages`
  - `X-Pagination-Page`
  - `X-Pagination-Limit`
- default page size is `10`
- `per_page` can raise the page size up to `100`
- `page` selects the current page

## Rate limits
From the official rate-limiting guide:
- default budget: `90 requests per minute` per access token
- the window is a sliding 60-second window, not a fixed clock minute
- token-level limits can be adjusted in `/my-account/access-tokens`
- allowed configurable range: `1` to `300` requests per minute
- every response includes:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- when the budget is exceeded, the API returns `429 Too Many Requests` with body:
  - `{ "message": "Too many requests" }`
- the official retry guidance is to wait the number of seconds in `X-RateLimit-Reset`

## Error and response notes
From the official status-code guide:
- `200 OK` is used for reads and `PATCH`
- `201 Created` is used for successful `POST` operations and includes the created object plus a `Location` header
- `204 No Content` is used for successful `DELETE` and some bodyless `PUT` operations
- `400 Bad Request` is used for malformed JSON, invalid query values, or unreadable headers
- `401 Unauthorized` returns JSON such as `{ "message": "Invalid token" }` or `Token expired`
- `403 Forbidden` usually means the authenticated token does not own or cannot modify the resource
- `404 Not Found` is used for bad URLs or nonexistent ids
- `405 Method Not Allowed` returns a body like `{ "message": "Method Not Allowed" }` plus an `Allow` header
- `415 Unsupported Media Type` covers unsupported write body types
- `422 Unprocessable Entity` returns a validation-error array of `{ field, message }` entries
- `500 Internal Server Error` is documented as a server-side fault; the official page tells clients to quote `X-Request-Id` when reporting it

## Important usage notes
- the docs are intentionally test-friendly: `delay` and `force_status` exist so client code can exercise loading and failure paths without changing endpoints
- raising concurrency on the same token does not raise throughput; the official rate-limit guide says the budget is per token, not per connection
- the official docs explicitly recommend larger `per_page` values and field filters like `?email=` / `?status=` before trying harder retries
- nested write shapes matter: the status guide uses comments to show that collection-level and nested collection routes are not interchangeable

## Verification notes
This file was manually rebuilt from Go REST's official docs, concepts pages, recipe pages, and live REST console.