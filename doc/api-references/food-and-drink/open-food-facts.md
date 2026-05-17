# Open Food Facts

Official pages manually reviewed:
- https://world.openfoodfacts.org/data
- https://openfoodfacts.github.io/openfoodfacts-server/api/
- https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/
- https://openfoodfacts.github.io/openfoodfacts-server/api/ref-cheatsheet/
- https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/
- https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v3/

## Overview
- Production base URL: `https://world.openfoodfacts.org`
- Staging base URL documented by Open Food Facts: `https://world.openfoodfacts.net`
- Primary response format: JSON
- Authentication: public read routes are available without auth; product edits require Open Food Facts account credentials
- Official docs status observed during review: the index URL from the category README (`/data`) was serving an unscheduled downtime page, but the official GitHub-hosted API docs and official OpenAPI references were available

Manual route count confirmed from the reviewed official docs: **7**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v2/product/{code}` | Fetch one product by barcode |
| POST | `/cgi/product_jqm2.pl` | Add or edit a product |
| GET | `/api/v2/search` | Filter/search products with structured query parameters |
| GET | `/cgi/suggest.pl` | Get taxonomy-backed suggestions for a field |
| GET | `/api/v2/taxonomy` | Fetch selected taxonomy entries |
| GET | `/api/v3/taxonomy_suggestions` | Get richer taxonomy suggestions in API v3 |
| GET | `/cgi/nutrients.pl` | Get the nutrient list used for nutrition tables/forms |

## Confirmed parameters

### `GET /api/v2/product/{code}`
- Path parameter: `code` (barcode)
- Officially documented optional parameters across the reviewed tutorial/spec pages:
  - `fields`: limit the product fields returned
  - `blame=1`: include field-level last-modifier information
  - `cc`: country context
  - `lc`: language context
  - knowledge-panel-related parameters from the v2 spec
- The tutorial examples use product field requests such as `fields=product_name,nutriscore_data,nutriments,nutrition_grades`.

### `POST /cgi/product_jqm2.pl`
- Multipart form request body
- Tutorial states these fields are required when adding or editing a product:
  - `code`
  - `user_id`
  - `password`
- Additional product data is sent as form fields, with examples including:
  - `categories`
  - `nutriment_sodium`
  - `nutriment_sodium_unit`
  - `no_nutrition_data`
  - `nutrition_data_per`
  - `serving_size`
  - `add_categories`, `add_labels`, `add_brands`
  - prepared nutriment fields such as `nutriment_energy-kj_prepared`

### `GET /api/v2/search`
- The reviewed v2 spec documents this as structured search/filtering, not full-text search
- Parameters and behaviors explicitly documented in the reviewed spec/tutorial pages:
  - `fields`: limit returned object size
  - `page` and `page_size`: pagination
  - repeated or compound filter parameters, including `_tags` filters
  - comma-separated values act as AND filters
  - pipe-separated values act as OR filters
  - `-` prefix excludes a term
- The tutorial uses this endpoint for nutrition-grade/category filtering.

### `GET /cgi/suggest.pl`
- `tagtype`: target field/taxonomy
- `term`: typed fragment to match

### `GET /api/v2/taxonomy`
Documented on the reviewed cheat sheet with:
- `tagtype`
- `tags`
- `fields`
- `include_children=1`
- `include_parents=1`
- `include_root_entries=1`
- `lc`
- `cc`

### `GET /api/v3/taxonomy_suggestions`
Documented on the reviewed v3 spec and cheat sheet with:
- `tagtype`
- `cc`
- `lc`
- `string` (preferred filter term)
- `term` (alias for backward compatibility)
- `categories`
- `shape`
- `limit` (default `25`, max `400`)
- `get_synonyms=1`

### `GET /cgi/nutrients.pl`
- `cc`
- `lc`

## Auth and rate limits
- Public product reads and search routes are documented without auth requirements.
- The reviewed tutorial says write operations require a valid Open Food Facts `user_id` and `password`.
- The reviewed introduction documents these rate limits:
  - `15 req/min/IP` for read product queries (`GET /api/v*/product` requests or product page)
  - `10 req/min/IP` for search queries (`GET /api/v*/search` or `GET /cgi/search.pl`)
- The same page says global rate limits can also trigger `503 Service Not Available` responses.

## Pagination and response notes
- `GET /api/v2/search` uses `page` and `page_size`.
- The reviewed v2 spec warns that `page_count` is the number of products returned in the current page, not the total number of pages.
- Product responses shown in the reviewed tutorial include `code`, `product`, `status`, and `status_verbose`.
- The v2 product OpenAPI spec documents `302` redirect behavior to the correct server for the requested product type and `404` when the product is not found.

## Important usage notes
- The reviewed docs explicitly recommend using `fields` to reduce payload size and server load.
- The reviewed docs say v2 search does not support full-text search; Open Food Facts points users to v1 search or the newer Search-a-licious project for that use case.
- The reviewed introduction asks bulk users to download exports instead of hammering product endpoints.
- The category README's original docs URL (`https://world.openfoodfacts.org/data`) was temporarily down during review, so the official GitHub-hosted docs were necessary to complete the provider manually.

## fireROUTE notes
- Keep production and staging bases configurable because official examples use both.
- Treat `/api/v2/product/{code}` and `/api/v2/search` as the primary read routes.
- Preserve raw structured filter passthrough for `/api/v2/search` because OFF supports many field-specific filters.
- Keep the write route separate and gated because it requires contributor credentials.
