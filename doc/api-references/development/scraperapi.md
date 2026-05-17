# ScraperApi

## Provider metadata
- Category: `Development`
- Provider slug: `scraperapi`
- Docs used manually:
  - `https://docs.scraperapi.com/`
  - `https://docs.scraperapi.com/synchronous-apis/using-the-api-endpoint`
  - `https://docs.scraperapi.com/synchronous-apis/proxy-port-method`
  - `https://docs.scraperapi.com/asynchronous-api/overview`
  - `https://docs.scraperapi.com/asynchronous-api/job-handling`
  - `https://docs.scraperapi.com/asynchronous-api/batch-requests`
  - `https://docs.scraperapi.com/asynchronous-api/callbacks-and-api-params`
  - `https://docs.scraperapi.com/responses-and-formats/api-status-codes`
- Confirmed REST API base URLs:
  - `https://api.scraperapi.com`
  - `https://async.scraperapi.com`
- Additional non-REST proxy endpoint documented officially: `proxy-server.scraperapi.com:8001`
- Primary media types: target-page HTML by default for sync requests; JSON for async job submission/status payloads; optional text/markdown output formats documented for async `apiParams`
- Authentication model surfaced in docs:
  - sync API key in query parameter `api_key`
  - async API key in JSON body field `apiKey`
  - proxy mode uses username `scraperapi` and password = API key
- Manually confirmed routes in this pass: `5`

## Authentication
From the official docs reviewed here:
- synchronous requests use `api_key` in the query string
- asynchronous requests use `apiKey` in the JSON request body
- proxy mode uses proxy credentials rather than a REST auth header:
  - username: `scraperapi`
  - password: your API key
- in proxy mode, extra ScraperAPI parameters can be appended to the username as dot-separated modifiers such as `scraperapi.render=true.country_code=us`

## Common request/response conventions
- Sync API base URL: `https://api.scraperapi.com`
- Async API base URL: `https://async.scraperapi.com`
- Proxy mode host: `proxy-server.scraperapi.com:8001`
- Common sync query parameters confirmed in the official docs:
  - `api_key` - required API key
  - `url` - required target URL
  - `render` - enable JavaScript rendering
  - `country_code` - geo-target the request
  - `premium` - use residential proxies
  - `session_number` - sticky IP/session; docs say sessions expire 15 minutes after last use
- Common async JSON fields confirmed in the official docs:
  - `apiKey` - required API key
  - `url` - required target URL for single-job submission
  - `urls` - required array for batch submissions
  - `method` - upstream HTTP method when the target request itself should be POST/PUT/etc.
  - `headers` - upstream request headers for the target request
  - `body` - upstream request body for the target request
  - `callback` - webhook callback object with `type` and `url`
  - `expectUnsuccessReport` - include failed-job callbacks/results
  - `timeoutSec` - async-only timeout override
  - `meta` - user-defined metadata echoed back in responses/callbacks
  - `apiParams` - nested object for standard ScraperAPI options
- `apiParams` options explicitly shown on the official callbacks page include:
  - `autoparse`
  - `country_code`
  - `keep_headers`
  - `device_type`
  - `follow_redirect`
  - `premium`
  - `ultra_premium`
  - `render`
  - `wait_for_selector`
  - `screenshot`
  - `retry_404`
  - `output_format` with documented values `text` or `markdown` and HTML as the default output

## Manually confirmed endpoint set

### 1) Synchronous scrape request
- Method: `GET`
- Path: `/`
- Full URL: `https://api.scraperapi.com`
- Purpose: fetch a target URL through ScraperAPI's synchronous scraping layer
- Required query parameters:
  - `api_key`
  - `url`
- Important optional parameters explicitly documented on the reviewed page:
  - `render`
  - `country_code`
  - `premium`
  - `session_number`
- Notes:
  - the docs instruct callers to place ScraperAPI parameters before the `url` parameter
  - sync requests retry failed upstream fetches for up to 70 seconds before returning a failure

### 2) Create asynchronous scrape job
- Method: `POST`
- Path: `/jobs`
- Full URL: `https://async.scraperapi.com/jobs`
- Purpose: submit one background scraping job and receive a job ID plus status URL
- Required JSON fields confirmed in docs:
  - `apiKey`
  - `url`
- Additional JSON fields confirmed in docs:
  - `method`
  - `headers`
  - `body`
  - `callback`
  - `apiParams`
  - `expectUnsuccessReport`
  - `timeoutSec`
  - `meta`
- Response fields shown in docs include:
  - `id`
  - `status`
  - `statusUrl`
  - `url`

### 3) Get asynchronous job status/result
- Method: `GET`
- Path: `/jobs/{job_id}`
- Full URL pattern: `https://async.scraperapi.com/jobs/{job_id}`
- Purpose: poll the status of a submitted async job and retrieve the result once complete
- Path parameter:
  - `{job_id}` - job identifier returned from job creation
- Behavior confirmed in docs:
  - while running, the endpoint reports job status
  - when finished, the same endpoint returns the scrape result payload
  - results are stored for up to 72 hours, with 24 hours guaranteed

### 4) Cancel asynchronous job
- Method: `DELETE`
- Path: `/jobs/{job_id}`
- Full URL pattern: `https://async.scraperapi.com/jobs/{job_id}`
- Purpose: cancel a running async job
- Path parameter:
  - `{job_id}` - job identifier to cancel
- Evidence:
  - the official job-handling page explicitly instructs callers to send a `DELETE` request to the job endpoint using the job ID

### 5) Submit asynchronous batch job
- Method: `POST`
- Path: `/batchjobs`
- Full URL: `https://async.scraperapi.com/batchjobs`
- Purpose: submit a batch of scrape jobs in one request
- Required JSON fields confirmed in docs:
  - `apiKey`
  - `urls` - array of target URLs
- Response behavior confirmed in docs:
  - returns one job entry per URL
  - each entry includes `id`, `attempts`, `status`, `statusUrl`, and `url`
- Batch-size note from docs:
  - a single batch job can include up to `50,000` URLs

## Pagination
- the reviewed official docs do not describe a provider-level pagination protocol for the API itself
- batch processing is handled via job submission and polling rather than paginated list endpoints
- any pagination that appears in fetched content belongs to the target site being scraped, not to ScraperAPI's own route design

## Rate limits and quotas
- the reviewed docs do not publish a simple global requests-per-minute figure
- the docs do publish several operational limits and billing behaviors:
  - sync requests retry failed jobs for up to `70` seconds
  - async jobs keep retrying until success or for up to `24` hours
  - async results are stored for up to `72` hours, with `24` hours guaranteed
  - batch jobs can include up to `50,000` URLs
  - webhook delivery is attempted `3` times
- the status-codes page says failed sync requests that end in provider-side `500` after retries are not charged
- the same page says successful billing applies to `200` and `404` responses

## Error and response notes
From the official API status-codes page reviewed here, ScraperAPI explicitly lists these status families:
- `200`
- `400`
- `401`
- `403`
- `404`
- `429`
- `500`

Additional documented behavior:
- sync requests may retry internally for up to 70 seconds before ultimately returning `500`
- the docs recommend setting client timeout to at least 70 seconds so the sync retry window can complete
- `403` can also be triggered by async `max_cost` protection when the configured cost ceiling is exceeded
- webhook callback payloads can report failed jobs with fields such as `failReason`

## Important usage notes
- proxy mode is officially documented as feature-equivalent to the API endpoint, but it is not a REST path; it uses `proxy-server.scraperapi.com:8001`
- the proxy docs say SSL verification must be disabled unless callers manually trust ScraperAPI's proxy CA certificate
- the async API is the provider's preferred route when success rate matters more than latency
- `statusUrl` polling is optional when using webhook callbacks
- by default, webhook callbacks are sent only for successful requests unless `expectUnsuccessReport=true` is supplied
- the provider exposes many scraping features through parameters rather than a large REST path catalog

## Verification notes
This file was manually rebuilt from the official ScraperAPI documentation using browser inspection.