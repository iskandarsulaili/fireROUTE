# WakaTime

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `wakatime`
- Docs used manually:
  - `https://wakatime.com/developers`
- Confirmed base URLs:
  - `https://api.wakatime.com/api/v1/`
  - OAuth endpoints are hosted on `https://wakatime.com/oauth/...`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: OAuth 2 bearer tokens plus documented token/api-key style URL args for authenticated requests
- Manually confirmed routes in this pass: `8`

## Authentication
- The official docs expose OAuth 2.0 provider endpoints:
  - `https://wakatime.com/oauth/authorize`
  - `https://wakatime.com/oauth/token`
  - `https://wakatime.com/oauth/revoke`
- Confirmed OAuth authorize parameters from the official docs/code samples:
  - `client_id`
  - `response_type`
  - `code`
  - `token`
  - `redirect_uri`
  - `scope`
  - `state`
  - `force_approve`
- Confirmed token exchange inputs from the official docs:
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `grant_type`
  - `authorization_code`
  - `code`
- The docs show authenticated API requests using `Authorization: Bearer waka_tok_12345`.
- The docs also explicitly say requests can alternatively authenticate with URL args named:
  - `access_token`
  - `token`
  - `app_secret`
  - `client_secret`
  - `secret`
- The docs warn not to use a secret key on a public website and recommend embeddable charts/JSON for public sharing.

## Common request/response conventions
- All API resources have the prefix `https://api.wakatime.com/api/v1/`.
- The intro says all API requests must be done over HTTPS.
- The docs say responses are JSON objects.
- Confirmed response-envelope keys from the intro:
  - successful resource payloads under `data`
  - errors under `errors` or `error`
- Confirmed general HTTP statuses from the intro:
  - `200`
  - `201`
  - `202`
  - `302`
  - `400`
  - `401`
  - `403`
  - `404`
  - `429`
  - `500`
- The `302` note is unusual and explicitly documented: WakaTime says it sometimes returns `302` instead of `429`, resulting in timeouts when callers burst too hard.

## Manually confirmed endpoint set

### 1) Get all-time coding totals since today
- Method: `GET`
- Paths:
  - `/api/v1/users/:user/all_time_since_today`
  - `/api/v1/users/current/all_time_since_today`
- Purpose: return a user's all-time totals as of today
- Path parameter:
  - `user` or the literal `current`
- Important note:
  - the docs consistently show both a generic `:user` form and a concrete `current` form

### 2) Get summaries for a time range
- Method: `GET`
- Paths:
  - `/api/v1/users/:user/summaries`
  - `/api/v1/users/current/summaries`
- Purpose: return coding activity summarized by day for a time range
- Confirmed URL parameters from the official docs:
  - `start` - required start date
  - `end` - required end date
  - `project` - optional project filter
  - `branches` - optional comma-separated branch list
  - `timeout` - optional keystroke-timeout override
  - `writes_only` - optional writes-only preference override
  - `timezone` - optional timezone for `start` and `end`
  - `range` - optional alternative way to supply a time range
- Confirmed scope requirement:
  - `read_summaries`
- Official description note:
  - summaries are derived from heartbeats/durations joined when they are within 15 minutes of each other

### 3) Get stats for a range
- Method: `GET`
- Paths:
  - `/api/v1/users/:user/stats`
  - `/api/v1/users/current/stats`
  - `/api/v1/users/:user/stats/:range`
  - `/api/v1/users/current/stats/:range`
  - `/api/v1/stats/:range`
- Purpose: retrieve coding stats for a user or public stats for a range
- Path parameter:
  - `range` - may be `YYYY`, `YYYY-MM`, `last_7_days`, `last_30_days`, `last_6_months`, `last_year`, or `all_time`
- Confirmed URL parameters:
  - `timeout`
  - `writes_only`
- Confirmed scope requirement:
  - `read_stats`
- Important note from the docs:
  - on free accounts, ranges of one year or more may initially return stale results and callers should check `is_up_to_date` before trusting the response

### 4) List projects
- Method: `GET`
- Paths:
  - `/api/v1/users/:user/projects`
  - `/api/v1/users/current/projects`
- Purpose: list a user's projects
- Confirmed response-field examples from the official docs/code excerpts:
  - `name`
  - `url`
  - `urlencoded_name`
  - `created_at`

### 5) Get commit activity for a project
- Method: `GET`
- Paths:
  - `/api/v1/users/:user/projects/:project/commits`
  - `/api/v1/users/current/projects/:project/commits`
  - `/api/v1/users/:user/projects/:project/commits/:hash`
  - `/api/v1/users/current/projects/:project/commits/:hash`
- Purpose: list commits for a project or retrieve one commit by hash
- Path parameters:
  - `project`
  - `hash` on single-commit lookups

### 6) Read or send heartbeats
- Methods confirmed: `GET`, `POST`, plus bulk `POST`/`DELETE`
- Paths:
  - `/api/v1/users/:user/heartbeats`
  - `/api/v1/users/current/heartbeats`
  - `/api/v1/users/:user/heartbeats.bulk`
  - `/api/v1/users/current/heartbeats.bulk`
- Purpose:
  - retrieve heartbeats for a day
  - submit heartbeats from plugins or tools
  - bulk-submit / bulk-delete heartbeat batches
- Confirmed read parameter:
  - `date` - required requested day
- Confirmed scope requirement for reading:
  - `read_heartbeats`
- Confirmed heartbeat body fields from the official docs excerpt include:
  - `entity`
  - `type`
  - `category`
  - `time`
  - `project`
  - `project_root_count`
  - `branch`
  - `language`
  - `dependencies`
  - `lines`
  - `ai_line_changes`
  - `human_line_changes`
  - `ai_session`
  - `ai_input_tokens`
  - `ai_output_tokens`
  - `ai_prompt_length`
  - `ai_subscription_plan`
  - `lineno`
  - `cursorpos`
  - `is_write`

### 7) Read or submit external durations
- Methods confirmed: `GET`, `POST`, plus bulk `POST`/`DELETE`
- Paths:
  - `/api/v1/users/:user/external_durations`
  - `/api/v1/users/current/external_durations`
  - `/api/v1/users/:user/external_durations.bulk`
  - `/api/v1/users/current/external_durations.bulk`
- Purpose:
  - read external durations for a day
  - create durations from external integrations/apps
  - perform bulk external-duration operations
- Confirmed URL parameters for reads:
  - `date` - required
  - `project` - optional
  - `branches` - optional comma-separated list
  - `timezone` - optional
- Confirmed scope requirement:
  - `read_heartbeats`
- Confirmed response-field examples include:
  - `id`
  - `external_id`
  - `entity`
  - `type`
  - `provider`
  - `category`

### 8) Get API metadata
- Method: `GET`
- Path: `/api/v1/meta`
- Full URL: `https://api.wakatime.com/api/v1/meta`
- Purpose: retrieve API metadata / service information
- Important note:
  - this route is explicitly listed in the official resource index and in the current WakaTime docs page structure

## Pagination
- The docs do not describe one universal pagination contract across all resources.
- Some reviewed route examples expose collection metadata such as `total` and `total_pages`.
- fireROUTE should therefore treat pagination as route-specific for WakaTime rather than assuming one cursor scheme.

## Rate limits
- The official intro says clients should make fewer than `10 requests per second on average over any 5 minute period`.
- Exceeding the limit may produce `429 Too Many Requests`.
- The docs also explicitly warn that WakaTime may sometimes return `302` instead of `429`, which can manifest as request timeouts.

## Error handling
- Confirmed general statuses from the official docs:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `429 Too Many Requests`
  - `500 Server Error`
- Error payloads are documented under `errors` or `error`.
- The `202 Accepted` status is specifically called out for the stats resource when processing is not yet complete.

## Response format notes
- JSON is used throughout the reviewed documentation.
- Successful responses are wrapped in `data`.
- Resource payloads can be nested and analytics-heavy, especially for stats/summaries/heartbeats.

## Important usage notes
- Prefer bearer-token auth over placing secrets in URLs when possible.
- The docs consistently allow `current` in place of an explicit user identifier.
- Summaries and stats are derived artifacts built from heartbeats and durations, not raw events.
- Public embedding use cases should prefer WakaTime's embeddable chart/JSON flows instead of exposing secret credentials.

## Verification notes
This file was manually rebuilt from WakaTime's current official developer documentation, replacing the earlier generated placeholder.