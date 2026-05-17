# Hunter

## Provider metadata
- Category: `Development`
- Provider slug: `hunter`
- Docs used manually:
  - `https://hunter.io/api-documentation/v2`
- Confirmed base URL: `https://api.hunter.io/v2`
- Primary response format: JSON
- Authentication model confirmed from the official docs: API key required on all calls, accepted as the `api_key` query parameter, the `X-API-KEY` header, or a Bearer token in the `Authorization` header
- Manually confirmed routes in this pass: `9`

## Authentication
Hunter's official v2 docs state that every request requires an API key.

Confirmed auth details from the official docs:
- `api_key` query parameter is supported
- `X-API-KEY` header is supported
- Bearer-token auth in the `Authorization` header is supported
- missing or invalid keys return `401 Unauthorized`
- a special `test-api-key` can be used on the three main endpoints `domain-search`, `email-finder`, and `email-verifier`; it validates parameters but always returns the same dummy response

## Common request and response conventions
- Base URL: `https://api.hunter.io/v2`
- Successful responses use a top-level `data` object and a `meta` object
- Error responses use a top-level `errors` array
- Common error/status behavior documented by Hunter:
  - `200` OK
  - `201` Created
  - `204` No content
  - `400` Bad request
  - `401` Unauthorized
  - `403` Forbidden / rate limit reached
  - `404` Not found
  - `422` Unprocessable entity
  - `429` Too many requests / usage limit reached
  - `451` Unavailable for legal reasons
  - `5XX` Server error
- Official error example includes per-error fields like `id`, `code`, and `details`

## Manually confirmed endpoint set

### 1) Discover companies
- Method: `GET`
- Path: `/discover`
- Full URL: `https://api.hunter.io/v2/discover`
- Purpose: return companies matching filter criteria or a natural-language search
- Confirmed request parameters from the official docs:
  - `query` - natural-language query; required unless at least one filter is set
  - `organization` - object containing company `domain` and/or `name`
  - `similar_to` - find companies similar to a domain or company name; premium-only
  - `headquarters_location` - include/exclude location filters using continent, business region, country, US state, and/or city
  - `industry`
  - `headcount`
  - `company_type`
  - `year_founded` - premium-only
  - `keywords`
  - `technology` - premium-only
  - `funding` - premium-only
  - `limit` - premium-only, up to `100`
  - `offset` - premium-only, max `10,000`
- Pagination notes:
  - each response returns a maximum of `100` companies
  - premium users can paginate with `offset` and `limit`
- Important notes:
  - this endpoint is explicitly marked free in the official docs
  - caller must provide either `query` or at least one filter parameter

### 2) Domain Search
- Method: `GET`
- Path: `/domain-search`
- Full URL: `https://api.hunter.io/v2/domain-search`
- Purpose: return email addresses found for a domain or company
- Confirmed request parameters:
  - `domain` - required unless `company`
  - `company` - required unless `domain`; ignored when both are provided
  - `limit` - default `10`
  - `offset` - default `0`
  - `type` - `personal` or `generic`
  - `seniority` - comma-delimited values such as `junior`, `senior`, `executive`
  - `department` - comma-delimited values such as `executive`, `it`, `finance`, `sales`, `hr`, `marketing`, and others listed by Hunter
  - `required_field` - comma-delimited values including `full_name`, `position`, `phone_number`
  - `verification_status` - comma-delimited values `valid`, `accept_all`, `unknown`
  - `location` - include/exclude object; requires `POST` when used according to the official note
  - `job_titles` - comma-delimited job-title filter
- Response notes:
  - each response returns up to `100` emails
  - a new query is counted only for calls returning at least one result
  - source lists are capped at `20` per email
- Rate limit explicitly documented:
  - `15` requests per second
  - `500` requests per minute

### 3) Email Finder
- Method: `GET`
- Path: `/email-finder`
- Full URL: `https://api.hunter.io/v2/email-finder`
- Purpose: find the most likely email address for a person at a company
- Confirmed request parameters:
  - `domain` - required unless `company` or `linkedin_handle`
  - `company` - required unless `domain` or `linkedin_handle`
  - `linkedin_handle` - required unless `domain` or `company`
  - `first_name` - required unless `full_name` or `linkedin_handle`
  - `last_name` - required unless `full_name` or `linkedin_handle`
  - `full_name` - required unless first and last name or `linkedin_handle` are provided
  - `max_duration` - integer from `3` to `20`, default `10`
- Response notes:
  - Hunter automatically verifies each found email
  - no credit is charged if no email can be found
  - `verification.status` values documented: `valid`, `accept_all`, `unknown`
  - sources are capped at `20`
- Rate limit explicitly documented:
  - `15` requests per second
  - `500` requests per minute

### 4) Email Verifier
- Method: `GET`
- Path: `/email-verifier`
- Full URL: `https://api.hunter.io/v2/email-verifier`
- Purpose: verify deliverability and Hunter knowledge of an email address
- Confirmed request parameters:
  - `email` - required
- Important async behavior from the official docs:
  - the request runs for up to `20` seconds
  - if a result is not ready in time, Hunter returns HTTP `202`
  - caller can then poll the same endpoint for the result, and Hunter counts that verification only once
- Confirmed response/status fields from the docs:
  - `status` values: `valid`, `invalid`, `accept_all`, `webmail`, `disposable`, `unknown`
  - deprecated `result` values: `deliverable`, `undeliverable`, `risky`
  - booleans including `regexp`, `gibberish`, `disposable`, `webmail`, `mx_records`, `smtp_server`, `smtp_check`, `accept_all`, `block`
  - `score`
  - `sources` with a maximum of `20`
- Rate limit explicitly documented:
  - `10` requests per second
  - `300` requests per minute

### 5) Email Enrichment
- Method: `GET`
- Path: `/people/find`
- Full URL: `https://api.hunter.io/v2/people/find`
- Purpose: return information associated with an email address or LinkedIn handle
- Confirmed request parameters:
  - `email` - required unless `linkedin_handle`
  - `linkedin_handle` - required unless `email`; takes precedence when both are sent
  - `clearbit_format` - any provided value switches output formatting to Hunter's Clearbit-compatible schema
- Response notes:
  - `200` when Hunter finds a person
  - `404` when Hunter has no associated information
- Rate limit explicitly documented:
  - `15` requests per second
  - `500` requests per minute

### 6) Company Enrichment
- Method: `GET`
- Path: `/companies/find`
- Full URL: `https://api.hunter.io/v2/companies/find`
- Purpose: return company information for a domain
- Confirmed request parameters:
  - `domain` - required
  - `clearbit_format` - optional output-shape compatibility flag
- Response notes:
  - `200` when company information is available
  - `404` when no associated information exists
- Rate limit explicitly documented:
  - `15` requests per second
  - `500` requests per minute

### 7) Combined Enrichment
- Method: `GET`
- Path: `/combined/find`
- Full URL: `https://api.hunter.io/v2/combined/find`
- Purpose: return information associated with an email address plus its company/domain
- Confirmed request parameters:
  - `email` - required
  - `clearbit_format` - optional output-shape compatibility flag
- Response notes:
  - `200` when information is found
  - `404` when no associated information exists
- Rate limit explicitly documented:
  - `15` requests per second
  - `500` requests per minute

### 8) Email Count
- Method: `GET`
- Path: `/email-count`
- Full URL: `https://api.hunter.io/v2/email-count`
- Purpose: return how many email addresses Hunter has for a domain or company
- Confirmed request parameters:
  - `domain` - required unless `company`
  - `company` - required unless `domain`; must be at least 3 characters when used
  - `type` - `personal` or `generic`
- Rate limit explicitly documented:
  - `15` requests per second
- Important notes:
  - if both `domain` and `company` are supplied, `domain` takes precedence

### 9) Account Information
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.hunter.io/v2/account`
- Purpose: retrieve API/account usage information
- Confirmed request parameters:
  - API key only
- Important notes:
  - official docs mark this call as free
  - deprecated `calls` field is still documented, but Hunter says to use `requests` for detailed usage by request type

## Pagination
Hunter's official docs do not describe one universal pagination format, but the reviewed endpoints document these route-specific behaviors:
- `GET /discover` uses `offset` and `limit` for premium users; max `100` companies per page
- `GET /domain-search` uses `offset` and `limit`; each response returns up to `100` emails
- the enrichment, verifier, count, and account routes reviewed here are not documented as paginated

## Rate limits
The official docs used in this pass publish route-level rate limits rather than a single global table:
- Domain Search: `15 req/s`, `500 req/min`
- Email Finder: `15 req/s`, `500 req/min`
- Email Verifier: `10 req/s`, `300 req/min`
- Email Enrichment / Company Enrichment / Combined Enrichment: `15 req/s`, `500 req/min`
- Email Count: `15 req/s`
- Discover does not publish a separate numeric limit on the sampled section, but general error docs state `403` can mean rate limit reached and `429` can mean usage limit reached

## Error handling
Confirmed from the official Hunter docs:
- `400` for invalid or missing parameters
- `401` for missing or invalid API key
- `403` when the rate limit is reached
- `404` for missing resources or no enrichment result on relevant routes
- `422` for valid requests whose resource creation fails
- `429` when the usage limit is reached
- `451` when Hunter has been asked not to process personal identifiable information tied to that person
- `202` is used specifically by the email verifier when the asynchronous verification result is not yet ready

## Response format notes
- successful responses use `data` and `meta`
- failed responses use an `errors` array
- many search/enrichment responses embed route-specific nested objects such as verification summaries, sources, company/person attributes, or usage metadata

## Important usage notes
- Hunter supports three auth placements; fireROUTE should prefer header-based auth over query-string auth for production use
- the `test-api-key` is only for parameter validation and dummy responses on selected endpoints; it is not a normal sandbox with real data
- `location` filtering on Domain Search is explicitly documented as requiring `POST`, even though the section is centered on the standard endpoint route; preserve that caveat in generated integrations
- several enrichment endpoints support `clearbit_format`, which materially changes response shape
- `Email Verifier` is partially asynchronous and requires polling when it returns `202`

## Verification notes
This file was manually rebuilt from Hunter's official v2 API documentation with browser inspection and replaces the earlier low-fidelity generated summary.
