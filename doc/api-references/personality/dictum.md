# Dictum

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://raw.githubusercontent.com/bitcldr/dictum/master/README.md`
  - `https://www.quoterism.com/developer`
- Manual review outcome: `manually_documented`
- Confirmed route count: `2`

## API overview
- Current provider status:
  - the official Dictum repository README says the API migrated to `https://quoterism.com`
  - the live first-party developer docs are now published at `https://www.quoterism.com/developer`
- Base URL: `https://www.quoterism.com`
- Authentication: `X-API-Key` header required on the documented API calls
- Response format: JSON
- Rate limit: `30 requests / minute`

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/quotes` | `page`, `limit` | Returns a paginated list of quotes with nested author data. |
| GET | `/api/quotes/{id}` | `id` path parameter | Returns a single quote by ID; the docs also allow special values `random` and `quote-of-the-day`. |

## Confirmed parameters and response fields
### `GET /api/quotes`
- `page` — optional number, `0`-indexed, default `0`
- `limit` — optional number, allowed range `1-100`, default `12`
- Example auth shown by the docs: `X-API-Key: YOUR_API_KEY`

### `GET /api/quotes/{id}`
- `id` — required string
- The docs explicitly allow these special path values:
  - `random`
  - `quote-of-the-day`

### Documented response fields
- Quote list responses include:
  - `data` array
  - nested quote fields such as `id`, `text`, `createdAt`
  - nested `author` fields such as `id`, `name`, `slug`, `imageUrl`
  - `pagination.page`
  - `pagination.limit`
  - `pagination.totalCount`
  - `pagination.totalPages`
  - `pagination.hasNextPage`
  - `pagination.hasPreviousPage`
- Single quote responses include:
  - `id`
  - `text`
  - nested `author` object with `id`, `name`, `slug`, `imageUrl`

## Response, pagination, and errors
- `GET /api/quotes` uses explicit page-number pagination with the `pagination` object described above
- The reviewed docs show `404 Not Found` response tabs for both documented operations
- No separate published error schema fields were visible in the reviewed docs

## Important usage notes
- The official Dictum repository is still useful as the migration notice, but the active API surface is Quoterism rather than the historical Dictum host
- The live docs also expose quote retrieval shortcuts through `/api/quotes/random` and `/api/quotes/quote-of-the-day` as special `id` values rather than separate resource families

## Sources inspected
- `https://raw.githubusercontent.com/bitcldr/dictum/master/README.md`
- `https://www.quoterism.com/developer`
