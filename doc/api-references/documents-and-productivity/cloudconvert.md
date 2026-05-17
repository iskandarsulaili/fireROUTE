# CloudConvert

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `cloudconvert`
- Docs used manually:
  - `https://cloudconvert.com/docs/getting-started/introduction`
  - `https://cloudconvert.com/docs/api-reference/jobs`
- Confirmed REST API base URLs:
  - `https://api.cloudconvert.com/v2`
  - `https://eu-central.api.cloudconvert.com/v2`
  - `https://us-east.api.cloudconvert.com/v2`
  - `https://sandbox.api.cloudconvert.com/v2`
- Confirmed synchronous jobs base used on the official Jobs page:
  - `https://sync.api.cloudconvert.com/v2`
- Primary media type: JSON
- Authentication models surfaced in the official docs: Bearer API key and OAuth 2.0 access token
- Manually confirmed routes in this pass: `6`

## Authentication
From the official introduction page:
- requests are authenticated with `Authorization: Bearer YOUR_API_KEY`
- API keys can be created with specific scopes
- scopes explicitly listed on the reviewed page:
  - `user.read`
  - `user.write`
  - `task.read`
  - `task.write`
  - `webhook.read`
  - `webhook.write`
- CloudConvert also supports OAuth 2.0:
  - authorize URL: `https://cloudconvert.com/oauth/authorize`
  - token URL: `https://cloudconvert.com/oauth/token`
  - reviewed page says authorization code grant and implicit grant are supported

## Common request/response conventions
- default live API base: `https://api.cloudconvert.com/v2`
- region-specific live API bases:
  - `https://eu-central.api.cloudconvert.com/v2`
  - `https://us-east.api.cloudconvert.com/v2`
- sandbox base: `https://sandbox.api.cloudconvert.com/v2`
- job-processing is modeled around jobs containing one or more tasks
- JSON responses commonly use a top-level `data` envelope, plus `links` and `meta` for list responses
- the docs describe import tasks, conversion tasks, and export tasks as the normal composition of a job

## Manually confirmed endpoint set

### 1) Create a job asynchronously
- Method: `POST`
- Path: `/jobs`
- Full URL: `https://api.cloudconvert.com/v2/jobs`
- Purpose: create a job with one or more tasks and return immediately
- Authentication requirement from the official page:
  - Bearer token with `task.write` scope
- Request body fields explicitly documented:
  - `tasks` - required object containing named tasks; task names may use alphanumerics, `-`, and `_`
  - `tag` - optional arbitrary identifier for correlating the job with your application
  - `webhook_url` - optional job-specific webhook URL that receives `job.finished` or `job.failed`
- Example task-body properties shown in the official example:
  - `operation`
  - `input`
  - `input_format`
  - `output_format`
  - `pages`
  - `optimize_print`
- Response behavior explicitly documented:
  - returns the created job immediately in status `processing`
- Important usage note from the official page:
  - CloudConvert recommends account-wide webhooks over per-job webhook URLs for most integrations

### 2) Create a job synchronously and wait for completion
- Method: `POST`
- Path: `/jobs`
- Full URL: `https://sync.api.cloudconvert.com/v2/jobs`
- Purpose: create a job and block until it finishes or fails
- Authentication requirement from the official page:
  - Bearer token with `task.write` scope
- Request body fields explicitly documented:
  - `tasks` - required object
  - `tag` - optional
  - `redirect` - optional boolean; when `true`, the response redirects to the export URL of the job and requires an `export/url` task
- Response behavior explicitly documented:
  - returns the completed job in `finished` or `error` status
  - if `redirect=true`, returns an HTTP `302` redirect to the output file URL
- Important usage note from the official page:
  - CloudConvert explicitly does not recommend the sync variant for long-running jobs because client/network timeouts are likely

### 3) Show a job asynchronously
- Method: `GET`
- Path: `/jobs/{ID}`
- Full URL pattern: `https://api.cloudconvert.com/v2/jobs/{ID}`
- Purpose: retrieve current job status, even while the job is still running
- Authentication requirement from the official page:
  - Bearer token with `task.read` scope
- Path parameters:
  - `ID` - job identifier
- Query parameters confirmed on the official page:
  - `redirect` - boolean; if `true`, redirects to the export URL and requires an `export/url` task
- Response fields explicitly documented:
  - `data.id`
  - `data.tag`
  - `data.status` - one of `waiting`, `processing`, `finished`, or `error`
  - `data.created_at`
  - `data.started_at`
  - `data.ended_at`
  - `data.tasks[]`
  - `data.links.self`
- Task fields explicitly shown inside the example response:
  - `id`
  - `operation`
  - `status`
  - `credits`
  - `message`
  - `code`
  - `created_at`
  - `started_at`
  - `ended_at`
  - `result.files[]`
  - `links.self`
- Response behavior explicitly documented:
  - with `redirect=true`, returns HTTP `302` to the output file URL instead of JSON

### 4) Wait for a job synchronously
- Method: `GET`
- Path: `/jobs/{ID}`
- Full URL pattern: `https://sync.api.cloudconvert.com/v2/jobs/{ID}`
- Purpose: block until the job finishes or fails, then return the final job state
- Authentication requirement from the official page:
  - Bearer token with `task.read` scope
- Path parameters:
  - `ID` - job identifier
- Query parameters confirmed on the official page:
  - `redirect` - boolean; if `true`, redirects to the export URL of the job and requires an `export/url` task
- Response behavior explicitly documented:
  - returns the finished or failed job, including tasks
  - with `redirect=true`, can return HTTP `302 Found` with `Location` set to the output file URL
- Important usage note from the official page:
  - the reviewed docs again warn against using sync waiting for long-running workloads such as video encodings

### 5) List jobs
- Method: `GET`
- Path: `/jobs`
- Full URL: `https://api.cloudconvert.com/v2/jobs`
- Purpose: list jobs belonging to the authenticated account
- Authentication requirement from the official page:
  - Bearer token with `task.read` scope
- Query parameters confirmed on the official page:
  - `filter[status]` - filter to `processing`, `finished`, or `error`
  - `filter[tag]` - filter by tag
  - `include` - include related tasks in the result
  - `per_page` - number of jobs per page; defaults to `100`
  - `page` - page number to show
- Response structure explicitly documented:
  - `data` - array of jobs
  - `links.first`
  - `links.last`
  - `links.prev`
  - `links.next`
  - `meta.current_page`
  - `meta.from`
  - `meta.path`
  - `meta.per_page`
  - `meta.to`
- Important doc quirk to preserve:
  - the parameter description says `per_page` is the number of tasks per page, but the endpoint itself is a jobs list; this appears to be wording copied from another page

### 6) Delete a job
- Method: `DELETE`
- Path: `/jobs/{ID}`
- Full URL pattern: `https://api.cloudconvert.com/v2/jobs/{ID}`
- Purpose: delete a job together with all tasks and associated data
- Authentication requirement from the official page:
  - Bearer token with `task.write` scope
- Path parameters:
  - `ID` - job identifier
- Response behavior explicitly documented:
  - empty response with HTTP `204`
- Important usage note from the official page:
  - jobs are automatically deleted `24` hours after they have ended

## Pagination
From the reviewed list-jobs page:
- pagination is page-based
- query parameters:
  - `page`
  - `per_page` (default `100`)
- list responses include standard pagination metadata under `links` and `meta`

## Rate limits
From the official introduction page:
- some endpoints use dynamic rate limiting rather than one universal fixed limit
- the docs explicitly say the currently rate-limited endpoints include:
  - creating tasks
  - creating jobs
- rate-limited responses expose:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `Retry-After`
- official example `429` response headers shown on the page:
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 0`
  - `Retry-After: 60`

## Error and response notes
From the official overview page:
- the API uses standard HTTP status codes including:
  - `422` for invalid data
  - `429` for too many requests
  - `500` for internal server errors
  - `503` for temporary unavailability
- official `422` example body includes:
  - `message`
  - `code` (`INVALID_DATA` in the example)
  - `errors` object with field-level validation messages
- jobs/tasks that fail move to status `error`
- failed task objects can expose `message` and `code` describing the failure, such as `OPEN_FAILED`
- the docs explicitly say clients should not automatically retry tasks because CloudConvert already retries retryable internal failures

## Important usage notes
- CloudConvert automatically chooses the nearest processing region by default unless the account or endpoint selection overrides it
- the sandbox API is intended for development and testing, provides unlimited jobs/tasks for whitelisted files, and does not consume credits
- synchronous job endpoints are convenience endpoints, but the docs repeatedly recommend an asynchronous integration pattern with webhooks for robustness
- a typical job combines import, conversion, and export tasks, but a job can also branch into multiple conversions and exports

## Verification notes
This file was manually rebuilt from CloudConvert's official API overview and Jobs reference pages using browser inspection.