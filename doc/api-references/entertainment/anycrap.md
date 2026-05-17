# Anycrap

## Manual review status
- Category: Entertainment
- Official docs reviewed:
  - `https://anycrap.shop/developers`
  - `https://anycrap.shop/api/v1/docs`
  - `https://anycrap.shop/openapi.json`
- Manual review outcome: `manually_documented`
- Confirmed route count: `5`

## API overview
- Base URL: `https://anycrap.shop/api/v1`
- Authentication: bearer token in the `Authorization` header on authenticated endpoints
- Unauthenticated route: `POST /keys`
- Response format: JSON
- CORS: the developer page explicitly says all endpoints return JSON with CORS headers
- Rate limit: `60 requests/minute per key`

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/products` | `page`, `per_page`, `category`, `min_score`, `q` | Paginated product listing with filtering. |
| GET | `/products/random` | `count`, `category` | Returns `1` to `10` random products. |
| GET | `/products/{slug}` | `slug` path parameter | Returns one product by slug. |
| GET | `/categories` | none | Returns categories with counts. |
| POST | `/keys` | JSON body `email`, optional `app_name` | Creates a free API key; no auth required. |

## Parameter details from the official OpenAPI spec
### `GET /products`
- `page` — integer, default `1`, minimum `1`
- `per_page` — integer, default `10`, minimum `1`, maximum `50`
- `category` — category slug filter; the spec examples include values such as `gadgets`
- `min_score` — numeric overall Crap-O-Meter threshold from `0` to `10`
- `q` — case-insensitive substring search on product name

### `GET /products/random`
- `count` — integer, default `1`, minimum `1`, maximum `10`
- `category` — optional category slug filter

### `POST /keys`
- Required JSON field: `email`
- Optional JSON field: `app_name` with max length `100`
- Success response is `201 Created`

## Response, pagination, and errors
- `GET /products` returns `data` plus a `meta` object with:
  - `total`
  - `page`
  - `per_page`
  - `pages`
- Product objects in the spec include:
  - `id`
  - `slug`
  - `name`
  - `description`
  - `image`
  - `categories`
  - `created_at`
- Category objects include `slug`, `name`, optional `description`, and `product_count`
- Documented error cases include:
  - `401` missing or invalid API key
  - `404` product not found on `/products/{slug}`
  - `429` rate limit exceeded
  - `400` invalid email on `POST /keys`
- Error schema fields are `error` and `code`

## Important usage notes
- The developer page advertises `35,000+` curated absurdist AI-generated product concepts
- The `POST /keys` response returns the generated key only once; the OpenAPI description says it is not retrievable again
- The developer page also links a hosted interactive docs UI and a HuggingFace dataset page, but the OpenAPI spec is the clearest source for route and parameter confirmation

## Sources inspected
- `https://anycrap.shop/developers`
- `https://anycrap.shop/api/v1/docs`
- `https://anycrap.shop/openapi.json`
