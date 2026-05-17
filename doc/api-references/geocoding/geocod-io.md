# Geocod.io

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geocod-io`
- Official docs used manually:
  - `https://www.geocod.io/`
  - `https://www.geocod.io/docs/`
- Public API base URL documented by provider: `https://api.geocod.io/v1.12/`
- Transport: `HTTPS`
- Auth models documented by provider:
  - query parameter `api_key`
  - Authorization header with `Bearer YOUR_API_KEY`
- Response formats documented: `JSON` only for HTTP responses, including errors

## Product and access notes
- The current Geocodio docs describe the API as supporting forward and reverse geocoding plus data enrichment for the US, Canada, and Mexico.
- The docs explicitly say the version prefix is required in all requests.
- Supported countries published on the inspected docs page:
  - United States
  - Canada
  - Mexico
- The same docs page also covers spreadsheet/list geocoding, field appends, stable address keys, and distance endpoints; only the geocoding-category surface is counted here.

## Confirmed API surface
The current official docs confirm these `9` geocoding-related route families under `https://api.geocod.io/v1.12/`:
1. `GET /geocode` - single forward geocode lookup
2. `POST /geocode` - batch forward geocode lookup
3. `GET /reverse` - single reverse geocode lookup
4. `POST /reverse` - batch reverse geocode lookup
5. `POST /lists` - create a geocoding list job from uploaded CSV content
6. `GET /lists/{LIST_ID}` - inspect one list job/status
7. `GET /lists` - list existing geocoding list jobs
8. `GET /lists/{LIST_ID}/download` - download completed geocoding list output
9. `DELETE /lists/{LIST_ID}` - delete a list job

## Route details

### 1) Single forward geocoding
- Method: `GET`
- Path: `/geocode`
- Required auth: API key via query parameter or bearer header
- Main input modes documented:
  - `q` free-form address
  - individual structured components such as `street`, `city`, `state`
- Notable optional behavior documented on the page:
  - `country` to force `USA`, `Canada`, or `Mexico`
  - `fields` for enrichment appends
  - `format` parameter section is documented for response shaping
  - optional distance calculation can be requested with `destinations[]` and `distance_mode`

### 2) Batch forward geocoding
- Method: `POST`
- Path: `/geocode`
- Body formats documented:
  - JSON array of addresses
  - JSON object forms described by the docs under batch geocoding
- Notes:
  - the docs explain lookup counting for batches separately from single requests
  - this is still the same `/geocode` route family, distinguished by method and JSON body

### 3) Single reverse geocoding
- Method: `GET`
- Path: `/reverse`
- Primary input shown by docs: `q=lat,lng`
- Auth: same API-key options as other routes
- Optional features:
  - `fields` enrichment appends also apply here
  - the docs include a `format` parameter subsection here as well

### 4) Batch reverse geocoding
- Method: `POST`
- Path: `/reverse`
- Request body documented as a JSON array of coordinate strings such as `"35.9746000,-77.9658000"`
- Purpose: multi-coordinate reverse geocoding in one request

### 5) Create geocoding list
- Method: `POST`
- Path: `/lists`
- Request format: multipart form upload
- Important documented form fields:
  - `file`
  - `direction`
  - `format`
  - `callback`
  - optional inline `filename` when posting CSV content directly
- Purpose: asynchronous CSV/list geocoding workflow

### 6) Inspect one list
- Method: `GET`
- Path: `/lists/{LIST_ID}`
- Purpose: fetch job metadata, processing status, and the provider-issued `download_url`
- Example response fields shown by docs include `id`, `file`, `status`, `download_url`, and `expires_at`

### 7) List all geocoding lists
- Method: `GET`
- Path: `/lists`
- Purpose: enumerate list jobs already created on the account
- Pagination signals shown in the docs example include `current_page`, `next_page_url`, `per_page`, `from`, and `to`

### 8) Download one completed list
- Method: `GET`
- Path: `/lists/{LIST_ID}/download`
- Purpose: download the generated list output after processing completes
- The docs use `curl -L`, indicating the download flow may redirect

### 9) Delete one list
- Method: `DELETE`
- Path: `/lists/{LIST_ID}`
- Purpose: remove a stored list job

## Parameters, pagination, errors, and format notes
- All inspected HTTP responses, including errors, are documented as JSON.
- Pagination is clearly documented for `GET /lists` via page-style metadata such as `current_page` and `next_page_url`.
- The docs page does not publish classic page-token pagination for `/geocode` or `/reverse`; those are request/response lookups rather than cursor feeds.
- Error handling published on the inspected docs page:
  - `403 Forbidden` for invalid API key, permission issues, or exceeding the free-tier daily maximum without billing configured
  - `422 Unprocessable Entity` for semantic client input problems such as insufficient address information
  - `429 Too Many Requests` when pay-as-you-go rate limits are exceeded; the docs tell clients to inspect `X-RateLimit-Remaining`, `X-RateLimit-Limit`, and `X-RateLimit-Period`
  - `500 Server Error` for provider-side failures
- The docs also explicitly say that `200 OK` can still be returned when no geocoding results are available, so callers should inspect the response body rather than relying on transport status alone.

## Permissions and key-scope notes
- The docs state that a default API key can access the single and batch geocoding endpoints but that list/data-retrieval permissions can be restricted.
- The authentication section explicitly says accounts may hold multiple API keys and usage can be tracked per key in the Geocodio dashboard.

## Canonical fireROUTE notes
- Preserve the mandatory `/v1.12/` version prefix; the official docs say it is required for all requests.
- Treat `/lists` as a separate asynchronous CSV workflow rather than as pagination over `/geocode`.
- Geocodio combines geocoding and data enrichment on the same lookup routes through `fields`, so fireROUTE should preserve provider-specific append options in passthrough mode.

## Verification notes
- This file was manually rebuilt from the live official Geocodio homepage and API docs page using browser tools only.
