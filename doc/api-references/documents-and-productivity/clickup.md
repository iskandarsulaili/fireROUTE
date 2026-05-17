# ClickUp

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `clickup`
- Docs used manually:
  - `https://developer.clickup.com/`
  - `https://developer.clickup.com/docs/authentication`
  - `https://developer.clickup.com/docs/rate-limits`
  - `https://developer.clickup.com/reference/getaccesstoken`
  - `https://developer.clickup.com/reference/getauthorizeduser`
  - `https://developer.clickup.com/reference/getauthorizedteams`
  - `https://developer.clickup.com/reference/getlist`
  - `https://developer.clickup.com/reference/gettasks`
  - `https://developer.clickup.com/reference/createtask`
- Confirmed REST API base URL: `https://api.clickup.com/api/v2`
- Primary media type: JSON
- Auth model from the official docs: `Authorization` header with either a personal token or an OAuth access token
- Manually confirmed routes in this pass: `5`

## Authentication
ClickUp's official docs say every API request must be authenticated.

Confirmed auth details from the docs:
- personal use: personal API token
- third-party apps/integrations: OAuth 2.0 authorization-code flow
- authenticated requests send the token in the `Authorization` header
- personal tokens begin with `pk_`
- personal tokens never expire according to the docs
- OAuth resources documented:
  - Authorization URL: `https://app.clickup.com/api`
  - Access Token URL: `https://api.clickup.com/api/v2/oauth/token`
  - Grant type: Authorization Code

## Common request/response conventions
- Base URL: `https://api.clickup.com/api/v2`
- Response format: JSON
- Tokens are sent in `Authorization`, not as query parameters
- IDs are commonly numeric path parameters such as `list_id`
- The official reference pages used in this pass show route-level request parameters but relatively little inline shared error-schema detail

## Manually confirmed endpoint set

### 1) Exchange OAuth code for access token
- Method: `POST`
- Path: `/oauth/token`
- Full URL: `https://api.clickup.com/api/v2/oauth/token`
- Purpose: exchange an OAuth authorization code for an access token
- Supported request content types shown in the docs:
  - `application/json`
  - `application/x-www-form-urlencoded`
- Required body fields:
  - `client_id`
  - `client_secret`
  - `code`
- Important usage note from the docs:
  - personal-token integrations do not use this endpoint

### 2) Get the authorized user
- Method: `GET`
- Path: `/user`
- Full URL: `https://api.clickup.com/api/v2/user`
- Purpose: return details of the authenticated user's ClickUp account
- Auth requirement:
  - send personal token or OAuth token in `Authorization`
- Response status shown in docs:
  - `200`

### 3) Get authorized workspaces
- Method: `GET`
- Path: `/team`
- Full URL: `https://api.clickup.com/api/v2/team`
- Purpose: list the workspaces available to the authenticated user
- Auth requirement:
  - send personal token or OAuth token in `Authorization`
- Response status shown in docs:
  - `200`

### 4) Get a list
- Method: `GET`
- Path: `/list/{list_id}`
- Full URL: `https://api.clickup.com/api/v2/list/{list_id}`
- Purpose: retrieve metadata about a List
- Path parameters:
  - `list_id` - required numeric List ID
- Docs note for discovering the ID:
  - copy the List link from the ClickUp sidebar; the trailing string in the URL is the List ID
- Response status shown in docs:
  - `200`

### 5) Create a task
- Method: `POST`
- Path: `/list/{list_id}/task`
- Full URL: `https://api.clickup.com/api/v2/list/{list_id}/task`
- Purpose: create a new task inside a List
- Path parameters:
  - `list_id` - required numeric List ID
- Required body field:
  - `name`
- Optional body fields confirmed in the docs:
  - `description`
  - `assignees`
  - `archived`
  - `group_assignees`
  - `tags`
  - `status`
  - `priority`
  - `due_date`
  - `due_date_time`
  - `time_estimate`
  - `start_date`
  - `start_date_time`
  - `points`
  - `notify_all`
  - `parent`
  - `markdown_content`
  - `links_to`
  - `check_required_custom_fields`
  - `custom_fields`
  - `custom_item_id`
- Important usage notes from the docs:
  - `markdown_content` takes precedence over `description` when both are supplied
  - `parent` creates a subtask and must refer to a task in the same List
  - required custom fields are ignored by default unless `check_required_custom_fields=true`
  - `custom_item_id=0` creates the standard `Task` type

## Pagination
The ClickUp docs used in this pass show page-based pagination on task listing endpoints.

Confirmed from `GET /list/{list_id}/task`:
- responses are limited to `100` tasks per page
- query parameter `page` starts at `0`
- additional filtering/sorting parameters include:
  - `order_by`
  - `reverse`
  - `subtasks`
  - `statuses[]`
  - `include_closed`
  - `include_timl`
  - `assignees[]`
  - `watchers[]`
  - `tags[]`
  - date range filters like `due_date_gt`, `due_date_lt`, `date_created_gt`, `date_updated_lt`, etc.

## Rate limits
The official ClickUp Rate Limits guide publishes per-token limits by Workspace plan:
- `Free Forever`, `Unlimited`, `Business`: `100 requests/minute/token`
- `Business Plus`: `1,000 requests/minute/token`
- `Enterprise`: `10,000 requests/minute/token`

Rate-limit error details from the docs:
- exceeding the limit returns HTTP `429`
- error responses include these headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset` (Unix timestamp)

## Error and usage notes
- the sampled route pages primarily expose `200` success documentation rather than a full shared error schema
- all requests require authentication according to the auth guide
- rate-limit failures return `429`
- API access limits depend on the Workspace plan that hosts the token

## Important usage notes
- ClickUp supports both personal token workflows and user-authorized OAuth workflows
- the `Get Tasks` endpoint only returns tasks whose `list_id` is their home List by default
- to include tasks that exist in multiple lists, the docs require `include_timl=true`
- task time tracking values such as `time_spent` are expressed in milliseconds on task-list responses

## Verification notes
This file was manually rebuilt from ClickUp's official authentication guide, rate-limit guide, and endpoint reference pages, replacing the earlier low-fidelity autogenerated summary.
