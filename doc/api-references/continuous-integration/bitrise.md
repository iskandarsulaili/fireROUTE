# Bitrise

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `bitrise`
- Docs used manually:
  - `https://api-docs.bitrise.io/`
  - `https://api-docs.bitrise.io/docs/swagger.json` (inspected through the official Swagger UI page)
- Confirmed REST API base URL: `https://api.bitrise.io/v0.1`
- Primary media type: JSON
- Auth models confirmed in the official Swagger UI:
  - `Authorization` header for `PersonalAccessToken`
  - `Bitrise-Addon-Auth-Token` header for `AddonAuthToken`
- Manually confirmed routes in this pass: `6`

## Authentication
The official Swagger UI exposes two API-key style authorization schemes:
- `PersonalAccessToken(apiKey)`
  - header name: `Authorization`
  - location: header
- `AddonAuthToken(apiKey)`
  - header name: `Bitrise-Addon-Auth-Token`
  - location: header

Confirmed security usage from the inspected route definitions:
- many account/app/build routes require `PersonalAccessToken`
- several read/build routes explicitly allow either `PersonalAccessToken` or `AddonAuthToken`
- public addon catalog routes do not require the authenticated app/account-scoped token schemes used by app/build operations

## Common request/response conventions
- Base URL: `https://api.bitrise.io/v0.1`
- Response format: JSON
- Path parameters are slug-based, especially `app-slug` and `build-slug`
- Error responses commonly reference the shared `service.StandardErrorRespModel`
- That shared error model contains a `message` string property

## Manually confirmed endpoint set

### 1) List apps
- Method: `GET`
- Path: `/apps`
- Full URL: `https://api.bitrise.io/v0.1/apps`
- Auth requirement from the Swagger spec:
  - `PersonalAccessToken`
- Confirmed query parameters:
  - `sort_by` = `last_build_at|created_at`
  - `next`
  - `limit` - maximum `50`, default `50`
  - `title`
  - `project_type`
- Purpose: list all apps available to the authenticated account, including apps owned by other users or organizations
- Confirmed success/error responses:
  - `200`
  - `400`
  - `401`
  - `404`
  - `500`

### 2) Get a specific app
- Method: `GET`
- Path: `/apps/{app-slug}`
- Full URL pattern: `https://api.bitrise.io/v0.1/apps/{app-slug}`
- Path parameters:
  - `app-slug`
- Auth requirement from the Swagger spec:
  - `PersonalAccessToken` or `AddonAuthToken`
- Usage note from the official description:
  - the app slug can be discovered from `GET /apps` or copied from the app URL on bitrise.io
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `404`
  - `500`

### 3) List builds of an app
- Method: `GET`
- Path: `/apps/{app-slug}/builds`
- Full URL pattern: `https://api.bitrise.io/v0.1/apps/{app-slug}/builds`
- Path parameters:
  - `app-slug`
- Auth requirement:
  - `PersonalAccessToken` or `AddonAuthToken`
- Confirmed query parameters from the official schema:
  - `sort_by` = `running_first|created_at`
  - `branch`
  - `workflow`
  - `commit_message`
  - `trigger_event_type`
  - `pull_request_id`
  - `build_number`
  - `after` - Unix timestamp
  - `before` - Unix timestamp
  - `status` - documented status codes `0..4`
  - `is_pipeline_build`
  - `next`
  - `limit` - maximum `50`, default `50`
- Purpose: list builds for an app with filtering by workflow, branch, trigger type, status, date, and pagination anchors
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `404`
  - `500`

### 4) Trigger a new build or pipeline
- Method: `POST`
- Path: `/apps/{app-slug}/builds`
- Full URL pattern: `https://api.bitrise.io/v0.1/apps/{app-slug}/builds`
- Path parameters:
  - `app-slug`
- Auth requirement:
  - `PersonalAccessToken` or `AddonAuthToken`
- Content type: `application/json`
- Body schema:
  - `build_params`
  - `hook_info`
- Important usage note from the official description:
  - callers must specify at least one of branch, git tag/commit hash, or workflow/pipeline ID in the build-trigger configuration
  - the endpoint also supports pull-request-specific parameters and extra environment variables through the referenced trigger model
- Confirmed responses:
  - `201`
  - `400`
  - `401`
  - `404`
  - `500`

### 5) Get a specific build
- Method: `GET`
- Path: `/apps/{app-slug}/builds/{build-slug}`
- Full URL pattern: `https://api.bitrise.io/v0.1/apps/{app-slug}/builds/{build-slug}`
- Path parameters:
  - `app-slug`
  - `build-slug`
- Auth requirement:
  - `PersonalAccessToken` or `AddonAuthToken`
- Usage note from the official description:
  - build slug values can be discovered from the list-builds endpoint or copied from the build URL on bitrise.io
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `404`
  - `500`

### 6) Abort a build
- Method: `POST`
- Path: `/apps/{app-slug}/builds/{build-slug}/abort`
- Full URL pattern: `https://api.bitrise.io/v0.1/apps/{app-slug}/builds/{build-slug}/abort`
- Auth requirement:
  - `PersonalAccessToken` or `AddonAuthToken`
- Content type: `application/json`
- Path parameters:
  - `app-slug`
  - `build-slug`
- Confirmed body fields from `v0.BuildAbortParams`:
  - `abort_reason`
  - `abort_with_success`
  - `skip_git_status_report`
  - `skip_notifications`
- Important usage note from the route description:
  - `abort_with_success` lets clients stop a build while still counting it as successful
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `404`
  - `429`
  - `500`

## Pagination
The official Swagger definitions confirm cursor-like anchor pagination:
- list endpoints expose a `next` query parameter to request the next page
- list responses include a `paging` object
- the shared paging model contains:
  - `next` - anchor value to pass back to the same endpoint
  - `page_item_limit`
  - `total_item_count`
- docs explicitly say paging should stop when there is no `next` item in the response

## Rate limits
- The inspected Bitrise Swagger UI does not publish a global numeric rate-limit policy.
- A manually confirmed route-level exception exists on `POST /apps/{app-slug}/builds/{build-slug}/abort`, which explicitly documents HTTP `429 Too Many Requests`.
- Other inspected routes do not expose a numeric throttle figure in the official Swagger UI.

## Error handling
- The shared error schema used by inspected routes is `service.StandardErrorRespModel`
- Its confirmed response body contains a `message` field
- Common response codes across inspected routes include `400`, `401`, `404`, and `500`
- the abort-build route additionally documents `429`

## Response format notes
- list routes return top-level `data` arrays plus a `paging` object
- app/build detail routes return route-specific detail models
- trigger-build returns `201 Created`
- abort-build returns a dedicated abort response model

## Important usage notes
- Bitrise relies heavily on slug identifiers instead of numeric IDs for app/build routing
- `next` is not a page number; it is an anchor token that should be echoed back to the same endpoint
- the build trigger endpoint is broader than a simple workflow trigger and can also start pipeline-oriented flows
- addon-token auth is narrower than personal-access-token auth; use the route-level security requirements when deciding which credential type fireROUTE should pass through

## Verification notes
This file was manually rebuilt from Bitrise's official Swagger UI and the route schemas exposed there, replacing the earlier low-fidelity generated summary.
