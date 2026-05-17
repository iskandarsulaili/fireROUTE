# Todoist

## Provider metadata
- Category: `Documents and Productivity`
- Provider slug: `todoist`
- Docs used manually:
  - `https://developer.todoist.com/api/v1/`
  - official in-page sections reviewed manually: Authorization, Projects, Tasks, Comments, Pagination, and Request limits
- Confirmed API base URLs from the official docs reviewed in this pass:
  - `https://api.todoist.com/api/v1`
  - OAuth endpoints under `https://api.todoist.com/oauth/`
  - authorization page under `https://app.todoist.com/oauth/authorize`
- Primary response format: JSON
- Authentication model confirmed from the official docs: Bearer token in the `Authorization` header, with OAuth2 available for third-party user authorization
- Manually confirmed routes in this pass: `6`

## Authentication
Todoist's official docs show Bearer-token authentication.

Confirmed auth details from the official docs:
- authenticated requests use a Bearer token in the `Authorization` header
- personal API tokens can be retrieved from the account's integration settings for first-party/personal use
- third-party apps should use OAuth2 to obtain user-authorized tokens
- confirmed OAuth endpoints from the official docs:
  - authorization endpoint: `https://app.todoist.com/oauth/authorize`
  - token endpoint: `https://api.todoist.com/oauth/access_token`
  - dynamic registration endpoint: `https://api.todoist.com/oauth/register`
- the docs' example `401 Unauthorized` response includes `WWW-Authenticate: Bearer ...` and a JSON body with fields such as `error_tag`, `error_code`, `error`, `http_code`, and `error_extra.retry_after`

## Common request and response conventions
- Base REST base URL confirmed from route pages: `https://api.todoist.com/api/v1`
- Todoist also documents a separate Sync endpoint family under `/sync`; reviewed examples use `https://api.todoist.com/api/v1/sync`
- paginated REST endpoints return:
  - `results` - array of objects
  - `next_cursor` - opaque token for the next page, or `null`
- the docs explicitly say cursors are opaque, user-specific, and parameter-dependent

## Manually confirmed endpoint set

### 1) Get Projects
- Method: `GET`
- Path: `/api/v1/projects`
- Full URL: `https://api.todoist.com/api/v1/projects`
- Purpose: return active user projects, optionally filtered by folder or workspace
- Confirmed query parameters:
  - `folder_id` - optional; if provided, `workspace_id` is ignored
  - `workspace_id` - optional
  - `cursor` - optional cursor token
  - `limit` - optional, default `50`, max `200`
- Pagination notes:
  - the route is explicitly marked paginated in the official docs
  - response sample contains `results` and `next_cursor`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`

### 2) Get Tasks
- Method: `GET`
- Path: `/api/v1/tasks`
- Full URL: `https://api.todoist.com/api/v1/tasks`
- Purpose: return active tasks for the user
- Confirmed query parameters:
  - `project_id`
  - `section_id`
  - `parent_id`
  - `label` - filter by label name
  - `ids` - comma-separated task IDs
  - `goal_id` - UUID goal filter
  - `cursor`
  - `limit` - default `50`, max `200`
- Pagination notes:
  - the route is explicitly marked paginated in the official docs
  - response sample contains `results` and `next_cursor`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`

### 3) Get Tasks by Filter
- Method: `GET`
- Path: `/api/v1/tasks/filter`
- Full URL: `https://api.todoist.com/api/v1/tasks/filter`
- Purpose: return tasks matching a Todoist filter query
- Confirmed query parameters:
  - `query` - required, 1 to 1024 characters
  - `lang` - optional IETF language tag if filter language is not the default English
  - `cursor`
  - `limit` - default `50`, max `200`
- Important notes from the official docs:
  - multiple filters with the comma operator are not supported on this route
  - the route is paginated and uses the same `results` / `next_cursor` pattern
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`

### 4) Create Task
- Method: `POST`
- Path: `/api/v1/tasks`
- Full URL: `https://api.todoist.com/api/v1/tasks`
- Purpose: create a new task
- Confirmed JSON body fields from the official docs:
  - `content` - required, non-empty
  - `description`
  - `project_id` - omitted/null sends task to Inbox
  - `section_id`
  - `parent_id`
  - `order`
  - `labels` - array of label names
  - `priority` - integer `1-4`, where `1` is highest
  - `assignee_id`
  - `due_string`
  - `due_date`
  - `due_datetime`
  - `due_lang`
  - `duration`
  - `duration_unit`
  - `deadline_date` - `YYYY-MM-DD`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`
- Important notes:
  - the official docs describe several due-date input forms; callers should avoid sending mutually inconsistent due fields

### 5) Get Comment
- Method: `GET`
- Path: `/api/v1/comments/{comment_id}`
- Full URL: `https://api.todoist.com/api/v1/comments/{comment_id}`
- Purpose: return a single comment by ID
- Confirmed path parameter:
  - `comment_id` - required string ID
- Confirmed response fields from the sample:
  - `id`
  - `posted_uid`
  - `content`
  - `file_attachment`
  - `uids_to_notify`
  - `is_deleted`
  - `posted_at`
  - `reactions`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`

### 6) Delete Comment
- Method: `DELETE`
- Path: `/api/v1/comments/{comment_id}`
- Full URL: `https://api.todoist.com/api/v1/comments/{comment_id}`
- Purpose: delete a comment by ID
- Confirmed path parameter:
  - `comment_id` - required string ID
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`
- Response sample note:
  - success sample is `null`

## Pagination
From Todoist's official Pagination section:
- Todoist uses cursor-based pagination
- the first request omits `cursor`
- subsequent requests send the prior response's `next_cursor` value as `cursor`
- `next_cursor=null` means there are no more pages
- callers must keep the same filtering and other parameters when advancing a cursor
- default `limit` is `50`
- maximum `limit` is `200`
- if a larger limit is sent, the docs say the API returns a validation error

## Request limits and size limits
From Todoist's official Request limits section reviewed in this pass:
- POST request body limit: `1 MiB`
- total HTTP header size limit: `65 KiB`
- processing timeouts documented:
  - uploads: `5 minutes`
  - standard request: `15 seconds`
- Sync API rate limits documented in the same section:
  - maximum `1000` partial sync requests per user within a `15 minute` period
  - maximum `100` full sync requests per user within a `15 minute` period
  - up to `100` sync commands may be batched into one request and still count as a single request
- maximum sync commands per request: `100`

## Error handling
Confirmed from the official docs reviewed in this pass:
- `401 Unauthorized` responses include standard Bearer-auth metadata plus a JSON error body
- the JSON error body can include:
  - `error_tag`
  - `error_code`
  - `error`
  - `http_code`
  - `error_extra`
- `error_extra.retry_after` may be returned for rate-limited requests and other API errors, not just `429`
- route pages reviewed here consistently document `400`, `401`, `403`, and `404` alongside success `200`

## Response format notes
- paginated REST endpoints return `{ "results": [...], "next_cursor": ... }`
- single-resource endpoints return JSON objects
- some mutation endpoints can return `null` on success
- Sync API responses, as described in the general docs, can also include fields like `temp_id_mapping` and `sync_status`

## Important usage notes
- Todoist currently documents both REST-style endpoints and the separate `/sync` surface; some functionality is only available through `/sync`
- temporary optimistic-update IDs prefixed with `tmp-` are client placeholders and are not valid server-side resource IDs
- cursors must be treated as opaque tokens and passed through unchanged
- for third-party integrations, OAuth2 is the intended token acquisition method rather than asking users for personal tokens

## Verification notes
This file was manually rebuilt from Todoist's current official API documentation and replaces the earlier low-fidelity generated summary.
