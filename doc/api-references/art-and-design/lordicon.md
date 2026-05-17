# Lordicon

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://lordicon.com/api-developers`
  - `https://lordicon.com/docs/api/documentation`
  - `https://lordicon.com/docs/api/guidelines`
- Manual review outcome: `manually_documented`
- Confirmed route count: `4`

## API overview
- Base URL: `https://api.lordicon.com`
- Authentication: bearer token in the `Authorization` header, issued after creating a Lordicon API project
- Response format:
  - JSON metadata responses for the documented API methods
  - temporary `svg`, `json`, and preview-file download URLs returned inside API payloads
- CORS: the category index marks CORS as supported
- Rate limits / quotas:
  - the docs publish header-based limits through `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`
  - exceeding the active limit returns HTTP `429`
  - the reviewed docs do not publish one fixed numeric quota for every plan on the public documentation page

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/variants` | Lists icon families and styles, including free and premium counts per style. |
| GET | `/v1/icons` | Lists icons with filtering, search, and pagination; returns temporary preview/download URLs. |
| POST | `/v1/download/track` | Reports a billable / usage-relevant icon download when an end user actually embeds or reuses an icon in a project. |
| GET | `/v1/download/stats` | Returns per-day free/premium download statistics for the current project. |

## Confirmed parameters and request fields
### Shared request requirements
- Authorization header with a bearer token is required on every documented API call
- The docs use `api.lordicon.com` as the request host in all reviewed request examples

### `GET /v1/icons`
- `search` - full-text search phrase
- `family` - filter by icon family
- `style` - filter by icon style
- `premium` - filter by free vs premium icons
- `index` - filter by icon index
- `page` - result page number
- `per_page` - page size, up to `100`

### `POST /v1/download/track`
- JSON request body fields shown on the official page:
  - `family`
  - `style`
  - `index`

### `GET /v1/download/stats`
- `page` - result page number
- `per_page` - page size, maximum `100`

## Confirmed response fields
### `GET /v1/variants`
- array items include:
  - `family`
  - `style`
  - `free`
  - `premium`

### `GET /v1/icons`
- array items shown in the official example include:
  - `family`
  - `style`
  - `index`
  - `name`
  - `title`
  - `premium`
  - `files.preview`
  - `files.svg`
  - `files.json`

### `GET /v1/download/stats`
- array items shown in the official example include:
  - `date`
  - `free`
  - `premium`

## Response, pagination, and errors
- Pagination headers explicitly documented:
  - `X-Page`
  - `X-Per-Page`
  - `X-Total-Count`
  - `Link`
- Rate-limit headers explicitly documented:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- Explicitly documented error behavior:
  - HTTP `429` when request limits are exceeded
- The reviewed docs do not publish a broader HTTP error-code table beyond the rate-limit note and the `201 Created` example for download tracking

## Important usage notes
- The file links returned from `/v1/icons` are temporary; Lordicon explicitly says integrators should download and host needed resources themselves rather than expose the temporary links directly to end users.
- Access to `svg` and `json` download links depends on the icon and the project's plan; free projects may receive only preview links for premium resources.
- Lordicon requires integrators to call `POST /v1/download/track` whenever an icon is actually embedded, duplicated, or reused in a user project; previewing or abandoned edits do not require reporting.
- Free-plan API users must attribute Lordicon and link back using Lordicon's documented UTM format when displaying icons.
- The guidelines recommend keeping API tokens confidential and using a proxy server for client-side integrations.
- The API-developers page says free icons have no usage limits, while PRO icons are billed pay-per-download and verified projects receive higher request limits.

## Sources inspected
- `https://lordicon.com/api-developers`
- `https://lordicon.com/docs/api/documentation`
- `https://lordicon.com/docs/api/guidelines`