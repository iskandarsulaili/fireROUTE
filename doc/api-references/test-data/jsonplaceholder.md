# JSONPlaceholder

## Provider metadata
- Category: `Test Data`
- Provider slug: `jsonplaceholder`
- Docs used manually:
  - `https://jsonplaceholder.typicode.com/`
  - `https://jsonplaceholder.typicode.com/guide/`
- Confirmed base URLs:
  - `https://jsonplaceholder.typicode.com`
  - the homepage also explicitly says `http` is accepted, but the official examples use HTTPS
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `8`

## Authentication
- The official homepage and guide present JSONPlaceholder as a free fake REST API with no API key, OAuth flow, or custom auth header.
- All examples on the reviewed official pages are unauthenticated.

## Common request/response conventions
- The homepage says all HTTP methods are supported.
- The reviewed guide shows `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` examples.
- JSON request bodies are sent with `Content-type: application/json; charset=UTF-8` in the official examples.
- JSONPlaceholder is explicitly a fake API for testing and prototyping.
- The guide repeatedly notes that write operations are not really persisted: the resource is `faked as if` it were created, updated, or deleted.
- The homepage documents 6 top-level resource families:
  - `/posts`
  - `/comments`
  - `/albums`
  - `/photos`
  - `/todos`
  - `/users`
- The guide also documents one-level nested resources.

## Manually confirmed endpoint set

### 1) List posts
- Method: `GET`
- Path: `/posts`
- Full URL: `https://jsonplaceholder.typicode.com/posts`
- Purpose: list post records
- Confirmed response behavior from the homepage and guide:
  - returns a JSON array
  - the guide example shows post objects with fields like `id`, `title`, `body`, and `userId`

### 2) Get a single post
- Method: `GET`
- Path: `/posts/{id}`
- Full URL: `https://jsonplaceholder.typicode.com/posts/1`
- Purpose: retrieve one post
- Path parameter:
  - `id`
- Confirmed response example fields:
  - `id`
  - `title`
  - `body`
  - `userId`

### 3) List comments filtered by post
- Method: `GET`
- Path: `/comments`
- Full URL example: `https://jsonplaceholder.typicode.com/comments?postId=1`
- Purpose: retrieve comments, optionally filtered by query string
- Confirmed query parameter:
  - `postId`
- Important note:
  - the guide says basic filtering is supported through query parameters

### 4) List nested comments for a post
- Method: `GET`
- Path: `/posts/{id}/comments`
- Full URL: `https://jsonplaceholder.typicode.com/posts/1/comments`
- Purpose: retrieve comments related to a post
- Path parameter:
  - `id`

### 5) Create a post
- Method: `POST`
- Path: `/posts`
- Full URL: `https://jsonplaceholder.typicode.com/posts`
- Purpose: fake-create a post for testing
- Confirmed request body fields from the official example:
  - `title`
  - `body`
  - `userId`
- Confirmed required header in the example:
  - `Content-type: application/json; charset=UTF-8`
- Confirmed response behavior:
  - returns a JSON object including `id: 101`
- Important note:
  - the guide explicitly says the resource is not really created on the server

### 6) Replace a post
- Method: `PUT`
- Path: `/posts/{id}`
- Full URL: `https://jsonplaceholder.typicode.com/posts/1`
- Purpose: fake-replace a post
- Path parameter:
  - `id`
- Confirmed request body fields from the official example:
  - `id`
  - `title`
  - `body`
  - `userId`
- Important note:
  - the guide explicitly says the resource is not really updated on the server

### 7) Partially update a post
- Method: `PATCH`
- Path: `/posts/{id}`
- Full URL: `https://jsonplaceholder.typicode.com/posts/1`
- Purpose: fake-partial update of a post
- Path parameter:
  - `id`
- Confirmed request body field from the official example:
  - `title`
- Important note:
  - like `PUT`, this operation is documented as a fake update only

### 8) Delete a post
- Method: `DELETE`
- Path: `/posts/{id}`
- Full URL: `https://jsonplaceholder.typicode.com/posts/1`
- Purpose: fake-delete a post
- Path parameter:
  - `id`
- Important note:
  - the guide explicitly says the resource is not really deleted on the server

## Nested-resource notes
The official guide explicitly lists these additional nested routes:
- `/posts/1/comments`
- `/albums/1/photos`
- `/users/1/albums`
- `/users/1/todos`
- `/users/1/posts`

## Pagination
- The reviewed official homepage and guide do not publish a dedicated pagination contract.
- No page, limit, cursor, or offset documentation was confirmed on the reviewed official pages.

## Rate limits
- The reviewed official pages do not publish numeric rate limits, quota headers, or retry guidance.

## Error handling
- The reviewed official pages do not publish a formal error table.
- Because the service is a fake API, the main behavioral caveat documented by the guide is not error-specific but persistence-specific: write operations are simulated rather than actually saved.

## Response format notes
- Responses are JSON.
- List endpoints return arrays.
- Single-resource endpoints return JSON objects.
- The guide's example envelope is direct resource JSON rather than a wrapped object with pagination metadata.

## Important usage notes
- JSONPlaceholder is designed for testing and prototyping, not durable storage.
- Do not treat `POST`, `PUT`, `PATCH`, or `DELETE` as persistent writes.
- Only one level of nested routes is documented in the official guide.

## Verification notes
This file was manually rebuilt from JSONPlaceholder's official homepage and guide, replacing the earlier generated placeholder.