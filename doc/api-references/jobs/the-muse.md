# The Muse

## Provider metadata
- Category: `Jobs`
- Provider slug: `the-muse`
- Official docs page used: `https://www.themuse.com/developers/api/v2`
- Current public API base URL: `https://www.themuse.com/api/public`
- Legacy base URL still mentioned by provider: `https://api-v2.themuse.com` -> redirects to the new base URL
- Auth model: optional `api_key` query parameter for higher rate limits
- Response format: JSON
- Status codes documented: `200`, `400`, `403`, `404`
- Notes source: manually extracted from the live provider docs page with browser tools

## Rate limits
- Without registering an app / without `api_key`: `500 requests per hour`
- With registered app and `api_key` query parameter: `3600 requests per hour`
- Rate limit headers documented by provider:
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Limit`
  - `X-RateLimit-Reset`

## Shared response / pagination format
Paginated list endpoints return JSON in this general shape:

```json
{
  "page_count": 5,
  "page": 0,
  "results": [ ... ]
}
```

Notes:
- `page` is a required integer query parameter on list endpoints.
- A full page contains `20 results`.
- The last page can contain fewer than 20 results.
- Out-of-range `page` values return `0 results`.

## Error response format
Provider docs show an error body shaped like:

```json
{
  "code": 400,
  "error": "An error message"
}
```

## Canonical endpoints

### 1) List jobs
- Method: `GET`
- Path: `/jobs`
- Full URL: `https://www.themuse.com/api/public/jobs`
- Purpose: get a paginated list of jobs

Query parameters documented by provider:
- `page` - required integer page number
- `descending` - optional boolean, allowed values `true` or `false`, default `false`
- `company` - optional filter; only get jobs for these companies
- `category` - optional filter; job category
- `level` - optional filter; required experience level
- `location` - optional filter; job location, can include flexible/remote jobs
- `api_key` - optional query parameter for higher rate limits

### 2) Get individual job
- Method: `GET`
- Path: `/jobs/:id`
- Canonical normalized path: `/jobs/{id}`
- Full URL pattern: `https://www.themuse.com/api/public/jobs/:id`
- Purpose: get a single job record

Path parameters:
- `id` - required job identifier

Query parameters:
- `api_key` - optional

### 3) List companies
- Method: `GET`
- Path: `/companies`
- Full URL: `https://www.themuse.com/api/public/companies`
- Purpose: get a paginated list of companies

Query parameters documented by provider:
- `page` - required integer page number
- `descending` - optional boolean, allowed values `true` or `false`
- `industry` - optional company industry filter
- `size` - optional company size filter
- `location` - optional office location filter, can include flexible/remote offices
- `api_key` - optional query parameter for higher rate limits

### 4) Get individual company
- Method: `GET`
- Path: `/companies/:id`
- Canonical normalized path: `/companies/{id}`
- Full URL pattern: `https://www.themuse.com/api/public/companies/:id`
- Purpose: get a single company record

Path parameters:
- `id` - required company identifier

Query parameters:
- `api_key` - optional

### 5) List coaches
- Method: `GET`
- Path: `/coaches`
- Full URL: `https://www.themuse.com/api/public/coaches`
- Purpose: get a paginated list of coaches

Query parameters documented by provider:
- `page` - required integer page number
- `descending` - optional boolean, allowed values `true` or `false`
- `offering` - optional filter for coaching offering
- `level` - optional filter for coaching level
- `specialization` - optional filter for coaching specialization
- `api_key` - optional query parameter for higher rate limits

### 6) Get individual coach
- Method: `GET`
- Path: `/coaches/:id`
- Canonical normalized path: `/coaches/{id}`
- Full URL pattern: `https://www.themuse.com/api/public/coaches/:id`
- Purpose: get a single coach record

Path parameters:
- `id` - required coach identifier

Query parameters:
- `api_key` - optional

## fireROUTE normalization notes
- Provider uses query-string auth, not header auth, for the documented rate-limit upgrade path.
- List endpoints share the same pagination contract: `page`, `page_count`, `results`.
- `descending` is reused across list endpoints and should be normalized as a boolean sort-direction control.
- Single-resource endpoints follow the same `/:id` pattern across jobs, companies, and coaches.
- A fireROUTE adapter should normalize provider paths from `:id` to `{id}` internally.
- For fallbacks, this provider is read-only from the documented surface captured here.

## Verification notes
This file was manually rebuilt from the live docs page, not from the prior bulk extractor output. If needed, the next step is to fetch example responses from each endpoint and document the exact response schema field-by-field.
