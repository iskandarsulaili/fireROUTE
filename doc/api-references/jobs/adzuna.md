# Adzuna

## Provider metadata
- Category: `Jobs`
- Provider slug: `adzuna`
- Official docs pages used:
  - `https://developer.adzuna.com/overview`
  - `https://developer.adzuna.com/activedocs`
  - `https://developer.adzuna.com/swagger/spec/test2.json`
- Current public API base URL: `https://api.adzuna.com/v1/api`
- Auth model: required query parameters `app_id` and `app_key`
- Response format: JSON according to the live OpenAPI spec; overview page also states JSONP, XML, HTML, and XLSX encodings are available from the platform
- HTTPS: supported and documented
- Manually confirmed route count: `7`

## Authentication and request model
- Every documented endpoint requires `app_id` and `app_key` query parameters.
- Search/statistics endpoints also require a supported `{country}` path segment.
- Supported country codes listed in the live spec: `gb`, `us`, `at`, `au`, `be`, `br`, `ca`, `ch`, `de`, `es`, `fr`, `in`, `it`, `mx`, `nl`, `nz`, `pl`, `sg`, `za`.

## Error handling
The live OpenAPI spec documents these response codes across the API:
- `200` successful response
- `400` incorrect parameters
- `404` resource not found
- `410` authorization failed
- `500` internal server error

Documented error schema:

```json
{
  "exception": "ExceptionClass",
  "display": "Human readable message",
  "doc": "https://..."
}
```

## Pagination and response notes
- `GET /jobs/{country}/search/{page}` paginates through the path parameter `page`.
- `results_per_page` controls page size.
- Search responses return a `JobSearchResults` object with fields such as `count`, `mean`, and `results`.
- Job descriptions in the returned search result objects are truncated snippets rather than full source listings.
- The `redirect_url` field should be used when sending users to the original job ad, per Adzuna's terms notes in the spec.

## Canonical endpoints

### 1) Search jobs
- Method: `GET`
- Path: `/jobs/{country}/search/{page}`
- Full URL pattern: `https://api.adzuna.com/v1/api/jobs/{country}/search/{page}`
- Purpose: search the Adzuna job database

Path parameters:
- `country` - required ISO country code from Adzuna's supported list
- `page` - required integer page number, minimum `1`

Required query parameters:
- `app_id`
- `app_key`

Common optional query parameters documented in the live spec:
- `results_per_page` - page size
- `what`, `what_and`, `what_phrase`, `what_or`, `what_exclude` - keyword controls
- `title_only` - title-only keyword matching
- `where` - search center text
- `distance` - distance from `where`, in kilometers
- `location0` through `location7` - structured location hierarchy filters
- `max_days_old` - oldest ad age in days
- `category` - category tag
- `sort_dir` - `up` or `down`
- `sort_by` - `default`, `hybrid`, `date`, `salary`, `relevance`
- `salary_min`, `salary_max`
- `salary_include_unknown=1`
- `full_time=1`, `part_time=1`, `contract=1`, `permanent=1`
- `company` - canonical company name

### 2) List categories
- Method: `GET`
- Path: `/jobs/{country}/categories`
- Purpose: list available Adzuna job categories for the selected country

Parameters:
- Path: `country`
- Query: `app_id`, `app_key`

Response notes:
- Returns a `Categories` object whose `results` array contains category `tag` and `label` pairs.

### 3) Salary histogram
- Method: `GET`
- Path: `/jobs/{country}/histogram`
- Purpose: salary distribution/histogram data

Parameters:
- Path: `country`
- Required query: `app_id`, `app_key`
- Optional filters: `what`, `location0`-`location7`, `category`

Response notes:
- Returns `histogram` as an object keyed by salary threshold with counts of jobs at or above each threshold.

### 4) Top companies
- Method: `GET`
- Path: `/jobs/{country}/top_companies`
- Purpose: leaderboard of employers for the supplied query context

Parameters:
- Path: `country`
- Required query: `app_id`, `app_key`
- Optional filters: `what`, `location0`-`location7`, `category`

Response notes:
- Returns a `leaderboard` array of company objects with counts/average salary fields when available.

### 5) Regional salary data
- Method: `GET`
- Path: `/jobs/{country}/geodata`
- Purpose: salary/job count data for locations inside a broader area

Parameters:
- Path: `country`
- Required query: `app_id`, `app_key`
- Optional filters: `location0`-`location7`, `category`

Response notes:
- Returns `locations`, each with a location object and job count.

### 6) Historical salary data
- Method: `GET`
- Path: `/jobs/{country}/history`
- Purpose: average salary history by month

Parameters:
- Path: `country`
- Required query: `app_id`, `app_key`
- Optional filters: `location0`-`location7`, `category`, `months`
- `months` - integer from `1` to `12`

Response notes:
- Returns a `month` object keyed by ISO `YYYY-MM` values with average salary values.

### 7) API version
- Method: `GET`
- Path: `/version`
- Full URL: `https://api.adzuna.com/v1/api/version`
- Purpose: return current API/software version metadata

Required query parameters:
- `app_id`
- `app_key`

## Response schema highlights
### Job objects may include
- `id`
- `title`
- `description`
- `created`
- `redirect_url`
- `location`
- `category`
- `company`
- `salary_min`
- `salary_max`
- `salary_is_predicted`
- `contract_time`
- `contract_type`
- `adref`

### Category objects include
- `tag`
- `label`

## fireROUTE normalization notes
- Auth is query-string based, not header based.
- Pagination is path-based (`/{page}`) plus `results_per_page`.
- Country is a required path dimension across all job/stat endpoints.
- Search and salary/stat endpoints share a reusable filter vocabulary (`what`, location hierarchy, category).
