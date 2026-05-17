# Asana

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `asana`
- Docs used manually:
  - `https://developers.asana.com/docs/overview`
  - `https://developers.asana.com/docs/personal-access-token`
  - `https://developers.asana.com/docs/oauth`
  - `https://developers.asana.com/docs/rate-limits`
  - `https://developers.asana.com/docs/pagination`
  - `https://developers.asana.com/docs/errors`
  - `https://developers.asana.com/reference/getusers`
  - `https://developers.asana.com/reference/getuser`
  - `https://developers.asana.com/reference/getworkspaces`
  - `https://developers.asana.com/reference/gettask`
  - `https://developers.asana.com/reference/createbatchrequest`
- Confirmed REST API base URL: `https://app.asana.com/api/1.0`
- Primary media type: JSON
- Authentication models confirmed from the official docs: personal access tokens in `Authorization: Bearer <token>` and OAuth 2.0 bearer tokens
- Manually confirmed routes in this pass: `5`

## Authentication
From the official PAT and OAuth guides:
- personal access tokens (PATs) are created in the Asana developer console and sent as `Authorization: Bearer <token>`
- OAuth is the recommended option for apps acting on behalf of users
- Asana explicitly documents these OAuth endpoints:
  - authorize: `GET https://app.asana.com/-/oauth_authorize`
  - token exchange: `POST https://app.asana.com/-/oauth_token`
  - revoke token: `POST https://app.asana.com/-/oauth_revoke`
- OAuth uses bearer access tokens in the same `Authorization` header format as PATs
- route pages also publish per-route required scopes such as `users:read`, `workspaces:read`, and `tasks:read`

## Common request/response conventions
- Base URL: `https://app.asana.com/api/1.0`
- request and response bodies are JSON on the reviewed routes
- successful resource responses are wrapped in a top-level `data` field
- paginated list responses include `next_page` when pagination is active
- Asana documents `opt_fields` to opt into extra fields on otherwise compact resources
- the reviewed docs repeatedly expose `opt_pretty` as a debugging-only pretty-print option

## Manually confirmed endpoint set

### 1) Get multiple users
- Method: `GET`
- Path: `/users`
- Full URL: `https://app.asana.com/api/1.0/users`
- Required scope: `users:read`
- Purpose: list users visible to the authenticated caller, optionally filtered by workspace or team
- Confirmed query parameters:
  - `opt_fields` - comma-separated list of additional fields to include
  - `workspace` - filter to a workspace or organization ID
  - `team` - filter to a team ID
  - `opt_pretty` - boolean pretty-print toggle
  - `limit` - integer `1..100`
  - `offset` - pagination token returned by a previous page
- Confirmed response notes:
  - returns user records sorted by user ID
  - response body includes top-level `data`
  - docs show `next_page` when pagination is in use
- Important official note:
  - this route returns compact user objects by default unless `opt_fields` is used

### 2) Get a user
- Method: `GET`
- Path: `/users/{user_gid}`
- Full URL: `https://app.asana.com/api/1.0/users/{user_gid}`
- Required scope: `users:read`
- Purpose: fetch one user record
- Path parameter:
  - `user_gid` - may be the literal string `me`, a user email, or a user gid
- Confirmed query parameters:
  - `opt_fields`
  - `opt_pretty`
  - `workspace` - optional workspace filter
- Confirmed response notes:
  - docs describe this as the full user record for the identified user
  - response body uses top-level `data`

### 3) Get multiple workspaces
- Method: `GET`
- Path: `/workspaces`
- Full URL: `https://app.asana.com/api/1.0/workspaces`
- Required scope: `workspaces:read`
- Purpose: list workspaces visible to the authorized user
- Confirmed query parameters:
  - `opt_fields`
  - `opt_pretty`
  - `limit` - integer `1..100`
  - `offset` - pagination token
- Confirmed response notes:
  - returns compact workspace records by default
  - paginated responses include `next_page`

### 4) Get a task
- Method: `GET`
- Path: `/tasks/{task_gid}`
- Full URL: `https://app.asana.com/api/1.0/tasks/{task_gid}`
- Required scope: `tasks:read`
- Additional field-scope notes explicitly shown on the route page:
  - `memberships` requires `projects:read` and `project_sections:read`
  - `actual_time_minutes` requires `time_tracking_entries:read`
- Purpose: fetch the complete task record for one task
- Path parameter:
  - `task_gid` - task identifier
- Confirmed query parameters:
  - `opt_fields`
  - `opt_pretty`
- Confirmed response notes:
  - returns a full task object in top-level `data`
  - route page explicitly documents fields such as `gid`, `resource_type`, `name`, `resource_subtype`, `created_by`, and `approval_status`

### 5) Submit parallel requests
- Method: `POST`
- Path: `/batch`
- Full URL: `https://app.asana.com/api/1.0/batch`
- Purpose: submit multiple Asana API requests in one batch call
- Confirmed query parameters:
  - `opt_fields`
  - `opt_pretty`
- Confirmed request body notes:
  - body contains `data`
  - the route describes this as a request object for use in a batch request
- Confirmed response fields:
  - `data[]`
  - per-result `status_code`
  - per-result `headers`
  - per-result `body`
- Confirmed documented statuses on the route page:
  - `200`, `400`, `401`, `403`, `404`, `500`

## Pagination
From the official pagination guide and reviewed list endpoints:
- Asana strongly recommends paginated requests for large result sets
- pagination is enabled by providing `limit`
- reviewed list endpoints use:
  - `limit`
  - `offset`
- list responses return an offset-bearing `next_page` object when more data is available
- the docs warn that some older unpaginated endpoints may still work today but can time out and should not be relied on

## Rate limits
From the official rate-limits guide:
- rate limits are allocated per authorization token
- standard minute-window limits currently documented:
  - free domains: `150` requests/minute
  - paid domains: `1500` requests/minute
- search API limit: `60` requests/minute
- duplication / instantiation / export endpoints are limited to `5` concurrent jobs per user
- throttled requests return HTTP `429 Too Many Requests`
- Asana includes `Retry-After` with the number of seconds to wait before retrying

## Error handling
From the official errors guide and reviewed route pages:
- errors are returned as JSON with top-level `errors[]`
- documented examples include:
  - `400 Bad Request` for malformed or missing parameters
  - `401 Unauthorized` when auth credentials are missing or invalid
  - `500 Server Error` with an additional `phrase` value for support/debugging on server failures
- the errors guide also documents common success and creation semantics:
  - `200 Success`
  - `201 Created`, with a `Location` header for the created object

## Response format notes
- most successful responses wrap the resource or collection in `data`
- list responses can also include `next_page`
- batch responses return per-subrequest result objects rather than a single resource schema
- route docs distinguish between compact objects and fuller objects requested through `opt_fields`

## Important usage notes
- PATs are acceptable for direct personal use, but the official docs recommend OAuth for apps that act on behalf of users
- `opt_pretty` increases payload size and latency and is documented as mainly for debugging
- Asana explicitly recommends always paginating large collections
- some task fields require additional scopes beyond the route's primary scope

## Verification notes
This file was manually rebuilt from Asana's official authentication, rate-limit, pagination, errors, and route reference pages in the current docs site.