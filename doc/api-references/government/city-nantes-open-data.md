# City, Nantes Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `city-nantes-open-data`
- Official docs/pages used:
  - `https://data.nantesmetropole.fr/pages/home/`
  - `https://data.nantesmetropole.fr/api/`
  - `https://data.nantesmetropole.fr/api-console/explore/v2.1/`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets?limit=1`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/swagger.json`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/exports`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/facets`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parkings-publics-nantes-statistiques-occupation-2023-2025`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parkings-publics-nantes-statistiques-occupation-2023-2025/records?limit=1`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parkings-publics-nantes-statistiques-occupation-2023-2025/facets`
  - `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parkings-publics-nantes-statistiques-occupation-2023-2025/records/1`
- Assigned docs URL: `https://data.nantesmetropole.fr/pages/home/`
- Current documented API base URL: `https://data.nantesmetropole.fr/api/explore/v2.1`
- Official API console URL: `https://data.nantesmetropole.fr/api-console/explore/v2.1/`
- Authentication model: the official Swagger document defines an `apikey` query parameter security scheme, but the reviewed public GET calls succeeded anonymously in this run
- Response format: JSON
- Rate limits: live responses exposed `X-RateLimit-Limit: 10000`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; the expose-headers list also mentions dataset-specific rate-limit headers
- Pagination: `limit` and `offset` on list/records queries, with `total_count` in live responses
- Error format: JSON; a live missing-record probe returned `{ "error_code": "NotFoundResource", "message": "The requested record 1 does not exist." }`
- Manually confirmed canonical route count: `16`

## Official usage notes
- The official homepage loaded as `Accueil — Open Data Nantes Métropole`.
- The official `/api/` entry point redirected to the provider's own API console at `https://data.nantesmetropole.fr/api-console/explore/v2.1/`.
- The official API root `https://data.nantesmetropole.fr/api/explore/v2.1/` returned a JSON links object with top-level rels `catalog`, `monitoring`, `opendatasoft`, and `shared`.
- The official Explore API Swagger document on the Nantes host identifies the API as `Explore API`, version `v2.1`, with server URL `https://data.nantesmetropole.fr/api/explore/v2.1`.
- The reviewed `catalog/datasets?limit=1` response returned `total_count: 583` and a live dataset id `244400404_parkings-publics-nantes-statistiques-occupation-2023-2025`.
- The reviewed `records?limit=1` response for that dataset returned `total_count: 2076821` and one live parking occupancy record.

## Auth, pagination, and error notes
- The Swagger document defines security scheme `apikey` in query parameter `apikey` with description `API key to make authenticated requests.`
- Despite that schema-level auth definition, the reviewed catalogue and records endpoints returned `200` without an API key in this run.
- The list and records endpoints use `limit` and `offset` pagination and expose `total_count` in JSON bodies.
- Common query parameters documented in the official Swagger file include:
  - `select`
  - `where`
  - `order_by`
  - `limit`
  - `offset`
  - `refine`
  - `exclude`
  - `lang`
  - `timezone`
  - `group_by`
  - `include_links`
  - `include_app_metas`
- The dataset-record read route additionally requires path parameters `dataset_id` and `record_id`.
- The reviewed Swagger responses document `400`, `401`, `429`, and `500` on the main read routes.
- Live responses exposed these rate-limit headers:
  - `X-RateLimit-Limit: 10000`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Canonical endpoints confirmed from the official Swagger document
All reviewed Explore API paths are `GET` routes.

1. `/catalog/datasets`
2. `/catalog/exports`
3. `/catalog/exports/{format}`
4. `/catalog/exports/csv`
5. `/catalog/exports/dcat{dcat_ap_format}`
6. `/catalog/facets`
7. `/catalog/datasets/{dataset_id}/records`
8. `/catalog/datasets/{dataset_id}/exports`
9. `/catalog/datasets/{dataset_id}/exports/{format}`
10. `/catalog/datasets/{dataset_id}/exports/csv`
11. `/catalog/datasets/{dataset_id}/exports/parquet`
12. `/catalog/datasets/{dataset_id}/exports/gpx`
13. `/catalog/datasets/{dataset_id}`
14. `/catalog/datasets/{dataset_id}/facets`
15. `/catalog/datasets/{dataset_id}/attachments`
16. `/catalog/datasets/{dataset_id}/records/{record_id}`

## Live route notes
- `GET /catalog/datasets`
  - Purpose: list datasets in the Nantes catalogue.
  - Live confirmation: `?limit=1` returned `total_count: 583` plus one full dataset object.
- `GET /catalog/datasets/{dataset_id}`
  - Purpose: fetch dataset metadata, field definitions, features, and metas.
  - Live confirmation: the reviewed parking dataset returned `features: ["timeserie", "analyze"]` and typed field definitions.
- `GET /catalog/datasets/{dataset_id}/records`
  - Purpose: query dataset rows.
  - Live confirmation: `?limit=1` returned one live parking occupancy record plus `total_count`.
- `GET /catalog/datasets/{dataset_id}/facets`
  - Purpose: enumerate dataset facet values and counts.
  - Live confirmation: the reviewed parking dataset returned facet values for `code_parking`.
- `GET /catalog/facets`
  - Purpose: enumerate catalogue-wide facet values and counts.
  - Live confirmation: the reviewed response returned facets including `custom.diffuseur` and `theme`.
- `GET /catalog/exports`
  - Purpose: list supported export formats.
  - Live confirmation: the official response linked `csv`, `json`, `data.json`, `rdf`, `ttl`, `dcat`, `rss`, `sitemap`, and `xlsx`.
- `GET /catalog/datasets/{dataset_id}/records/{record_id}`
  - Purpose: read one record by record identifier.
  - Live confirmation: a probe with nonexistent record id `1` returned a JSON `NotFoundResource` error.

## fireROUTE normalization notes
- Normalize this provider against `https://data.nantesmetropole.fr/api/explore/v2.1`.
- Treat this provider as an Opendatasoft Explore API v2.1 catalogue.
- Use `limit` and `offset` for pagination and expect `total_count` in list responses.
- Keep auth optional for read-only fireROUTE access unless a future official Nantes page states that an API key is mandatory for this tenant.
- Preserve JSON error handling for read failures and `429` support because the official Swagger file documents rate limiting and live responses expose rate-limit headers.
