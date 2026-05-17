# College Scorecard

## Provider metadata
- Category: `Open Data`
- Provider slug: `collegescorecard-ed-gov`
- Official docs/pages used:
  - `https://collegescorecard.ed.gov/data/` (official data portal)
  - `https://collegescorecard.ed.gov/data/` → `API Documentation` tab (official API docs)
- Current public API base URL shown in the docs: `https://api.data.gov/ed/collegescorecard/v1/schools`
- Auth model: API key required via `api_key`
- Methods confirmed from the official docs: `GET`
- Response format officially documented: JSON
- Rate-limit notes: the API docs say the default rate limit is `1,000` requests per IP address per hour; exceeding that produces `429 Too Many Requests`
- Manually confirmed route count: `1`

## Canonical endpoint
1. `GET /ed/collegescorecard/v1/schools`
   - Search and retrieve institution-level College Scorecard records.
   - The reviewed official API page does **not** publish a second public path for the field-of-study dataset, even though the page says the overall College Scorecard data includes both institution-level and field-of-study data.

## Core query parameters
### Auth / selection
- `api_key` - required API key.
- `fields` - select returned fields such as `id`, `school.name`, or `latest.student.size`.

### Common filters shown in the official docs
- `school.name`
- `school.state`
- `school.city`

### Pagination and sorting
- `page` - page number; the docs say the default is `0`.
- `per_page` - results per page; default `20`, maximum `100`.
- `sort` - sort by a field such as `latest.student.size`.

### Data-versioning note
- The docs say the API defaults to the `latest` object for variables.
- Specific-year field access is documented by replacing `latest` with a year, for example `2018.earnings`.

## Response notes
- The docs say the API returns JSON.
- The example response shape includes top-level `metadata` and `results` objects.
- The `latest` object automatically refreshes as new data releases occur.
- Institution-level and field-of-study data are described as related datasets, but the reviewed API page only exposes the `schools` route directly.

## Error notes
The reviewed API docs explicitly mention these HTTP responses:
- `400 Bad Request` - invalid request / bad parameters.
- `401 Unauthorized` - missing or invalid authentication.
- `403 Forbidden` - access denied.
- `404 Not Found` - resource not found.
- `429 Too Many Requests` - hourly rate limit exceeded.
- `500 Internal Server Error` - server-side failure.

## Usage notes
- This is a query-driven read-only API rather than a deep REST resource tree.
- Prefer the `fields` parameter to keep responses narrow.
- Use `page` and `per_page` for large result sets.
- Use year-qualified field prefixes when reproducibility matters more than always-current `latest` values.

## fireROUTE normalization notes
- Normalize this provider as a single read-only `GET` search/list route on `/ed/collegescorecard/v1/schools`.
- Preserve `api_key` auth as required query auth.
- Preserve field-style filters exactly as documented (`school.name`, `school.state`, etc.) rather than attempting to flatten them.
- Default to JSON and expose pagination + sorting controls directly.
