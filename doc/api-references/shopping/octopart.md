# Octopart

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://octopart.com/api/v4/reference`
  - `https://octopart.com/api/v4/getting-started`
  - `https://octopart.com/business/api/v4/api-transition`
- Manual review outcome: `manually_documented`
- Confirmed route count: `1`

## API overview
- Primary endpoint surfaced in the reviewed docs: `https://octopart.com/api/v4/endpoint`
- Product positioning in the reviewed docs:
  - the old Octopart API is now part of the Nexar API
  - the latest `v4` / `Nexar Legacy API` is organized around GraphQL
  - a REST wrapper exists, but the getting-started guide recommends GraphQL and calls the REST wrapper a temporary transition aid from API v3
- Authentication:
  - the reviewed docs say to visit the API Dashboard / Nexar portal to get a token
  - one official example shows the token as a query parameter: `https://octopart.com/api/v4/endpoint?token=MY_TOKEN`
- Formats:
  - GraphQL request/response model
  - JSON responses implied throughout the reviewed docs

## Confirmed endpoint
| Method | Path | Notes |
|---|---|---|
| POST | `/api/v4/endpoint` | Main GraphQL endpoint used by the reviewed v4 examples; the same path is also shown with `?token=MY_TOKEN` in the getting-started material. |

## Confirmed query families and parameters
### Example query shown in the getting-started guide
- `categories` query returning fields such as `name`, `path`, and nested `ancestors`

### Root query families surfaced in the reference UI
- `attributes`
- `manufacturers`
- `sellers`
- `categories`
- `parts`
- `part_offers`
- `suggest`
- `search`
- `search_mpn`
- `spelling_correction`
- `multi_match`

### Arguments explicitly visible in the reviewed reference page
- manufacturer/seller/category lookups: `ids`, `slugs`, `paths`, `min_number_of_active_parts`
- part and offer retrieval: `ids`, `references`, `country`, `currency`, `distributorapi`, `distributorapi_timeout`, `custom_pricing_credentials`
- suggestion/search helpers: `q`, `category_id`, `part_numbers_only`, `start`, `limit`, `sort`, `sort_dir`, `in_stock_only`, `filters`, `queries`, `options`

## Pagination, limits, and errors
- The search-style query families document pagination through `start` and `limit` arguments.
- The getting-started guide says monthly limits are based on returned part objects rather than raw HTTP request count.
- The same page says default searches return `10` parts per request.
- It also says `multi_match` returns `3` parts per query by default.
- No formal HTTP error table was visible on the reviewed pages.

## Important usage notes
- The transition page says new and existing Octopart API users should move to Nexar.
- The getting-started guide says API v3 was discontinued and recommends moving to GraphQL rather than staying on the REST wrapper.
- The reviewed docs point support questions to `support@nexar.com`.
- Because the reviewed UI is GraphQL-first, fireROUTE should treat this provider primarily as a GraphQL passthrough rather than assume a broad REST path inventory.

## Sources inspected
- `https://octopart.com/api/v4/reference`
- `https://octopart.com/api/v4/getting-started`
- `https://octopart.com/business/api/v4/api-transition`
