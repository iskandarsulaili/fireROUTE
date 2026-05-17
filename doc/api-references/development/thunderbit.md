# Thunderbit

## Provider metadata
- Category: `Development`
- Provider slug: `thunderbit`
- Docs used manually:
  - `https://thunderbit.com/docs/introduction`
  - `https://thunderbit.com/docs/api-reference/overview`
  - `https://thunderbit.com/docs/guides/rate-limits`
  - `https://thunderbit.com/docs/api-reference/endpoints/distill`
  - `https://thunderbit.com/docs/api-reference/endpoints/batch-distill`
  - `https://thunderbit.com/docs/api-reference/endpoints/batch-distill-status`
  - `https://thunderbit.com/docs/api-reference/endpoints/cancel-batch-distill`
  - `https://thunderbit.com/docs/api-reference/endpoints/extract`
  - `https://thunderbit.com/docs/api-reference/endpoints/batch-extract`
  - `https://thunderbit.com/docs/api-reference/endpoints/batch-extract-status`
  - `https://thunderbit.com/docs/api-reference/endpoints/cancel-batch-extract`
- Confirmed REST API base URL: `https://openapi.thunderbit.com/openapi/v1`
- Primary media type: JSON
- Authentication: Bearer API key in `Authorization`
- Manually confirmed routes in this pass: `8`

## Authentication
From the official API overview:
- all endpoints use HTTP Bearer authentication
- required header format: `Authorization: Bearer YOUR_API_KEY`
- the docs say keys are retrieved from the Thunderbit Dashboard
- the documented key format is `tb_` followed by `32` hexadecimal characters
- the docs explicitly say keys are revocable and environment-specific

## Common request/response conventions
- Base URL: `https://openapi.thunderbit.com/openapi/v1`
- Requests are JSON
- Responses are JSON
- The API overview documents a shared legacy error envelope:
  - `success: false`
  - `error.code`
  - `error.status`
  - `error.message`
  - `error.details`
- The docs explicitly deprecate an older alternate `GOOGLE_RPC` error envelope where `code` and `status` swapped types
- The introduction page positions the API around three product surfaces:
  - Markdown distillation
  - structured extraction from JSON Schema
  - asynchronous batch jobs with status polling and optional webhooks

## Manually confirmed endpoint set

### 1) Distill a single page into Markdown
- Method: `POST`
- Path: `/distill`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/distill`
- Purpose: convert one web page into cleaned, LLM-ready Markdown
- Confirmed request body fields on the official route page:
  - `url` - required target URL
  - `timeout` - milliseconds; route page shows default `30000`, range `5000` to `60000`
  - `waitFor` - post-load render wait in milliseconds; default `0`, range `0` to `10000`
  - `includeTags` - string array of tags/selectors to include
  - `excludeTags` - string array of tags/selectors to exclude
  - `headers` - custom request headers object
  - `countryCode` - 2-letter ISO code; default `US`
  - `renderMode` - `none | basic | full`
- Confirmed success response notes:
  - returns `200` JSON
  - route page describes Markdown-oriented output optimized for LLM consumption
- Important usage notes from the official docs:
  - `renderMode: none` is the documented default and fastest mode
  - `countryCode` selects geo-routed proxy execution

### 2) Submit a batch distill job
- Method: `POST`
- Path: `/batch/distill`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/distill`
- Purpose: distill multiple URLs asynchronously
- Confirmed request body fields on the official route page:
  - `urls` - required array; route page says maximum `100`
  - `timeout` - milliseconds; default `30000`, range `5000` to `60000`
  - `countryCode` - default `US`
  - `renderMode` - `none | basic | full`
  - `includeHtml` - boolean, default `false`
  - `extractLinks` - boolean, default `false`
  - `include` - array, shown on the page as an optional body field for response shaping
  - `webhook` - object containing `url`, `secret`, and `headers`
- Confirmed success response notes:
  - returns a job object for asynchronous tracking
- Important usage notes from the official docs:
  - the webhook object is the documented callback mechanism for batch completion
  - the rate-limit overview separately documents global account RPM limits and concurrency caps

### 3) Check batch distill job status
- Method: `GET`
- Path: `/batch/distill/{id}`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/distill/{id}`
- Purpose: retrieve status and currently available results for a batch distill job
- Path parameter:
  - `id` - batch task id
- Confirmed query parameters:
  - `page` - integer, default `0`
  - `pageSize` - integer, default `20`, range `1` to `100`
- Confirmed status semantics from the official page:
  - `pending` - job is currently running
  - `completed` - all URLs have been processed
  - `failed` - job encountered a fatal error
- Important usage notes from the official docs:
  - completed results may be retrieved while processing is still ongoing
  - the page includes a dedicated pagination section for incremental result retrieval

### 4) Cancel a batch distill job
- Method: `DELETE`
- Path: `/batch/distill/{id}`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/distill/{id}`
- Purpose: cancel a running distill batch job
- Path parameter:
  - `id` - batch task id
- Confirmed success response note:
  - official page says successful cancellation returns `200 { success: true }`
- Important usage notes from the official docs:
  - already-completed page results remain queryable through the status endpoint after cancellation of a running job

### 5) Extract structured data from one page
- Method: `POST`
- Path: `/extract`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/extract`
- Purpose: use AI to extract structured data matching a supplied JSON Schema
- Confirmed request body fields on the official route page:
  - `url` - required target URL
  - `schema` - required JSON Schema object defining the desired output structure
  - `timeout` - default `60000`, documented range `5000` to `120000`
  - `waitFor` - default `0`, range `0` to `10000`
  - `renderMode` - `none | basic | full`
- Confirmed success response notes from the route page example:
  - `success: true`
  - `data.url`
  - `data.data` - extracted objects array
  - `metadata.title`
  - `metadata.description`
  - `metadata.language`
  - `metadata.author`
  - `metadata.publishedDate`
  - `metadata.image`
  - `metadata.sourceURL`
  - `metadata.statusCode`
  - `metadata.contentLength`
- Important usage notes from the official docs:
  - the route page emphasizes detailed `description` fields in the JSON Schema to improve extraction quality
  - the API overview separately documents `SCHEMA_OR_PROMPT_REQUIRED` and `SCHEMA_AND_PROMPT_EXCLUSIVE` error codes

### 6) Submit a batch extract job
- Method: `POST`
- Path: `/batch/extract`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/extract`
- Purpose: asynchronously extract structured data from multiple URLs
- Confirmed request body fields on the official route page:
  - `urls` - required array; route page says maximum `50`
  - `schema` - required JSON Schema object
  - `timeout` - milliseconds; default shown as `60000`
  - `webhook` - object with `url`, `secret`, and custom `headers`
  - `renderMode` - string
- Important usage notes from the official docs:
  - the route page links the Webhooks guide for callback payload and HMAC-SHA256 signature verification
  - batch extraction is explicitly asynchronous and uses status/cancel companion endpoints

### 7) Check batch extract job status
- Method: `GET`
- Path: `/batch/extract/{id}`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/extract/{id}`
- Purpose: retrieve status and extracted results for a batch extraction job
- Path parameter:
  - `id` - batch task id
- Confirmed query parameters:
  - `page` - integer, default `0`
  - `pageSize` - integer, default `20`, range `1` to `100`
- Confirmed status semantics from the official page:
  - `pending` - extraction in progress
  - `completed` - all extractions finished
  - `failed` - job failed
- Important usage notes from the official docs:
  - the page states each URL result entry carries per-item extraction output and status details
  - the route is paginated for large result sets

### 8) Cancel a batch extract job
- Method: `DELETE`
- Path: `/batch/extract/{id}`
- Full URL: `https://openapi.thunderbit.com/openapi/v1/batch/extract/{id}`
- Purpose: cancel a running batch extraction job
- Path parameter:
  - `id` - batch task id
- Confirmed success response note:
  - official page says successful cancellation returns `200 { success: true }`
- Important usage notes from the official docs:
  - completed results remain queryable through the status endpoint even after cancellation of a running job

## Pagination
From the official batch-status route pages:
- both status endpoints support query-based pagination
- confirmed parameters:
  - `page` - 0-based page number, default `0`
  - `pageSize` - result count per page, default `20`, max `100`
- the docs explicitly frame pagination as a way to retrieve finished results while large jobs are still running

## Rate limits
From the official `Rate Limits` guide:
- Free: `10 requests/min`, `2` concurrent
- Pro: `100 requests/min`, `10` concurrent
- Enterprise: `1000 requests/min`, `50` concurrent
- every response includes:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- `X-RateLimit-Reset` is documented as a Unix epoch timestamp
- official `429` guidance: wait until `X-RateLimit-Reset` instead of retrying blindly

## Error and response notes
From the official API overview:
- confirmed canonical error codes include:
  - `INVALID_URL`
  - `INVALID_SCHEMA`
  - `INVALID_PARAMETER`
  - `SCHEMA_OR_PROMPT_REQUIRED`
  - `SCHEMA_AND_PROMPT_EXCLUSIVE`
  - `BATCH_SIZE_EXCEEDED`
  - `MALFORMED_REQUEST_BODY`
  - `API_KEY_MISSING`
  - `API_KEY_INVALID_FORMAT`
  - `API_KEY_NOT_FOUND`
  - `API_KEY_REVOKED`
  - `API_KEY_DISABLED`
  - `API_KEY_EXPIRED`
  - `INSUFFICIENT_CREDITS`
  - `JOB_NOT_FOUND`
  - `REQUEST_TIMEOUT`
  - `SCRAPE_TIMEOUT`
  - `SCRAPE_SSL_ERROR`
  - `SCRAPE_DNS_RESOLUTION_ERROR`
  - `SCRAPE_SITE_ERROR`
  - `SCRAPE_EMPTY_CONTENT`
  - `SCRAPE_CONTENT_TOO_LARGE`
  - `SCRAPE_TARGET_FORBIDDEN`
  - `SCRAPE_TARGET_NOT_FOUND`
  - `SCRAPE_UNSUPPORTED_FILE`
  - `RATE_LIMIT_EXCEEDED`
  - `SCRAPE_TARGET_RATE_LIMITED`
  - `INTERNAL_ERROR`
  - `DISTILL_FAILED`
  - `EXTRACT_FAILED`
  - `PIPELINE_ERROR`
  - `AI_EXTRACTION_FAILED`
  - `MARKDOWN_CONVERSION_FAILED`
  - `SCRAPE_SERVICE_FAILED`
  - `UPSTREAM_BAD_GATEWAY`
  - `SCRAPE_SERVICE_UNAVAILABLE`
  - `AI_SERVICE_UNAVAILABLE`
  - `DOWNSTREAM_SERVICE_UNAVAILABLE`
  - `UPSTREAM_TIMEOUT`
  - `AI_TIMEOUT`
- the official retry guidance says:
  - do not retry malformed 4xx input problems until the request is fixed
  - do not blindly retry `401` or `402`
  - retry `408`, `429`, `5xx`, and some target-site failures with bounded exponential backoff

## Important usage notes
- Thunderbit's docs distinguish `Distill` from `Extract`: distill produces cleaned Markdown, while extract uses JSON Schema to shape structured output
- batch-size limits differ by product surface in the reviewed docs: distill batch documents up to `100` URLs, batch extract documents up to `50`
- geo-routing and JavaScript rendering are body-level options rather than separate regional endpoints
- the API overview notes that a target-site rate limit (`SCRAPE_TARGET_RATE_LIMITED`) is distinct from Thunderbit's own account rate limit (`RATE_LIMIT_EXCEEDED`)

## Verification notes
This file was manually rebuilt from Thunderbit's official intro, API overview, rate-limit guide, and route reference pages using browser inspection.