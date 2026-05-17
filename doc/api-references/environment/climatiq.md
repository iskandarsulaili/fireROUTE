# Climatiq

## Provider metadata
- Category: `Environment`
- Provider slug: `climatiq`
- Official docs inspected manually:
  - `https://www.climatiq.io/docs`
  - `https://www.climatiq.io/docs/api-reference`
  - `https://www.climatiq.io/docs/api-reference/search`
- Confirmed API base URL: `https://api.climatiq.io`
- Response format confirmed from docs: JSON
- Authentication model: bearer token in `Authorization: Bearer <API_KEY>`
- Manually confirmed routes in this pass: `6`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/data/v1/search` | Search emission factors | optional `query`, `category`, `source`, `region`, `year`, `calculation_method`, `source_lca_activity`, `id`, `page` |
| GET | `/data/v1/unit-types` | List supported unit types | bearer token required |
| POST | `/data/v1/estimate` | Calculate emissions for one activity payload | bearer token required; body depends on selected factor/activity |
| POST | `/data/v1/estimate/batch` | Batch estimate endpoint | documented batch size limit of `100` operations |
| GET | `/data/v1/data-versions` | List available data versions | bearer token required |
| GET | `/data/v1/regions` | List supported region metadata | bearer token required |

## Usage notes
- The official getting-started page explicitly publishes `https://api.climatiq.io` as the base URL.
- The API is REST-oriented, requires HTTPS, accepts JSON request bodies, and returns JSON responses.
- The docs state that batch endpoints preserve request/response order and support up to `100` operations per request.
- The search endpoint is paginated and returns `current_page` and `last_page`.

## Errors, compression, and rate limits
- The docs have dedicated pages for authentication, errors, compression, and rate limiting.
- Compression is documented via `Accept-Encoding` headers.
- The visible overview confirms rate limiting exists, but the inspected overview page did not display one simple universal numeric quota table.

## Important fireROUTE notes
- Climatiq has a much larger surface than the core endpoints summarized here; specialized families such as freight, procurement, travel, energy, CBAM, and PCF are documented in separate versioned sections.
- The routes above are the core endpoints directly confirmed during this manual pass.

## Verification notes
This file was manually rebuilt from Climatiq's official documentation and API reference pages.