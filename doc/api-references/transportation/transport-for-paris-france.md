# Transport for Paris, France

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-paris-france`
- Official docs used manually:
  - `https://data.ratp.fr/api-console/explore/v2.1/`
  - `https://data.ratp.fr/api/explore/v2.1/swagger.json`
  - `https://data.ratp.fr/page/temps-reel/`
- Base URL confirmed from the official OpenAPI document:
  - `https://data.ratp.fr/api/explore/v2.1`
- Authentication:
  - the official OpenAPI document defines an `apikey` query security scheme for authenticated requests
  - however, a live unauthenticated request to `GET /catalog/datasets?limit=1` returned HTTP `200`, dataset data, and rate-limit headers, so public catalog reads are currently available without adding a key
- Primary response / payload formats:
  - JSON for API responses
  - file downloads for export routes, including CSV and other export formats exposed by the platform
- Transport scope documented here: the official Opendatasoft Explore API used on the RATP open-data portal

## Important official usage notes
- The official docs state that this Explore API is REST-based and supports only the HTTP `GET` method.
- The official docs state that all API endpoints return JSON, while export routes return files in the requested format.
- The official docs state that all endpoints use the Opendatasoft Query Language (`ODSQL`), so parameters such as `select`, `where`, `order_by`, `group_by`, `refine`, and `exclude` are reused across many routes.
- The official docs state that `records` queries are limited, while `exports` are the route family to use when more complete extraction is needed.
- The official `Temps réel` page now says static and dynamic passenger-information datasets subject to the LOM law are available free of charge only from the regional `PRIM` platform, and that RATP can no longer accept new data consumers on this platform.
- For new transport integrations, the public RATP site therefore signals that the open-data portal remains useful for the datasets still published there, but new realtime-consumer onboarding should not be expected on the legacy RATP platform.

## Rate limits, pagination, and errors
- A live unauthenticated request to `GET https://data.ratp.fr/api/explore/v2.1/catalog/datasets?limit=1` returned these rate-limit headers:
  - `X-RateLimit-Limit: 5000`
  - `X-RateLimit-Remaining: 4999`
  - `X-RateLimit-Reset: 2026-05-17 00:00:00+00:00`
- Pagination is documented through `limit` and `offset`.
- For queries without `group_by`, the official docs set `limit` max to `100` and require `offset + limit < 10000`.
- For queries with `group_by`, the official docs set `limit` max to `20000` and require `offset + limit < 20000`.
- Export routes use `limit=-1` by default to retrieve all records and are the official workaround when the records endpoint limit is too small.
- The OpenAPI document publishes these error patterns:
  - `400` bad request with JSON fields `message` and `error_code`
  - `401` unauthorized
  - `429` quota error with JSON fields such as `errorcode`, `reset_time`, `limit_time_unit`, `call_limit`, and `error`
  - `500` internal server error

## Common path variables and query parameters
Path variables exposed by the official docs:
- `dataset_id` - dataset identifier
- `format` - export format selector on generic export routes
- `dcat_ap_format` - DCAT profile suffix for the DCAT catalog export route
- `record_id` - single-record identifier

Common query parameters reused across multiple routes:
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

Export-specific query parameters exposed by the official docs:
- `use_labels`
- `compressed`
- `epsg`
- `delimiter`
- `list_separator`
- `quote_all`
- `with_bom`
- `parquet_compression`
- `name_field`
- `description_field_list`
- `use_extension`
- `include_exports`

## Confirmed API surface
The official OpenAPI document exposes 16 GET routes:
1. `GET /catalog/datasets`
2. `GET /catalog/exports`
3. `GET /catalog/exports/{format}`
4. `GET /catalog/exports/csv`
5. `GET /catalog/exports/dcat{dcat_ap_format}`
6. `GET /catalog/facets`
7. `GET /catalog/datasets/{dataset_id}/records`
8. `GET /catalog/datasets/{dataset_id}/exports`
9. `GET /catalog/datasets/{dataset_id}/exports/{format}`
10. `GET /catalog/datasets/{dataset_id}/exports/csv`
11. `GET /catalog/datasets/{dataset_id}/exports/parquet`
12. `GET /catalog/datasets/{dataset_id}/exports/gpx`
13. `GET /catalog/datasets/{dataset_id}`
14. `GET /catalog/datasets/{dataset_id}/facets`
15. `GET /catalog/datasets/{dataset_id}/attachments`
16. `GET /catalog/datasets/{dataset_id}/records/{record_id}`

## Route-by-route notes
### Catalog routes
1. `GET /catalog/datasets`
- Purpose: query datasets published in the RATP portal catalog
- Important parameters: `select`, `where`, `order_by`, `limit`, `offset`, `refine`, `exclude`, `lang`, `timezone`, `group_by`, `include_links`, `include_app_metas`

2. `GET /catalog/exports`
- Purpose: list available catalog export formats
- Important parameters: none documented beyond the route itself

3. `GET /catalog/exports/{format}`
- Purpose: export the catalog in a chosen format
- Important parameters: `format`, plus `select`, `where`, `order_by`, `group_by`, `limit`, `offset`, `refine`, `exclude`, `lang`, `timezone`

4. `GET /catalog/exports/csv`
- Purpose: export the catalog specifically as CSV
- Important parameters: `delimiter`, `list_separator`, `quote_all`, `with_bom`

5. `GET /catalog/exports/dcat{dcat_ap_format}`
- Purpose: export the catalog as a DCAT RDF/XML file
- Important parameters: `dcat_ap_format`, `include_exports`, `use_labels_in_exports`

6. `GET /catalog/facets`
- Purpose: enumerate catalog facet values for guided browsing / filtering
- Important parameters: `facet`, `refine`, `exclude`, `where`, `timezone`

### Dataset routes
7. `GET /catalog/datasets/{dataset_id}/records`
- Purpose: query records inside one dataset
- Important parameters: `dataset_id`, `select`, `where`, `group_by`, `order_by`, `limit`, `offset`, `refine`, `exclude`, `lang`, `timezone`, `include_links`, `include_app_metas`

8. `GET /catalog/datasets/{dataset_id}/exports`
- Purpose: list export formats available for one dataset
- Important parameters: `dataset_id`

9. `GET /catalog/datasets/{dataset_id}/exports/{format}`
- Purpose: export one dataset in a chosen format
- Important parameters: `dataset_id`, `format`, `select`, `where`, `order_by`, `group_by`, `limit`, `refine`, `exclude`, `lang`, `timezone`, `use_labels`, `compressed`, `epsg`

10. `GET /catalog/datasets/{dataset_id}/exports/csv`
- Purpose: export one dataset as CSV
- Important parameters: `dataset_id`, `delimiter`, `list_separator`, `quote_all`, `with_bom`

11. `GET /catalog/datasets/{dataset_id}/exports/parquet`
- Purpose: export one dataset as Parquet
- Important parameters: `dataset_id`, `parquet_compression`

12. `GET /catalog/datasets/{dataset_id}/exports/gpx`
- Purpose: export one dataset as GPX
- Important parameters: `dataset_id`, `name_field`, `description_field_list`, `use_extension`

13. `GET /catalog/datasets/{dataset_id}`
- Purpose: retrieve dataset metadata plus links to related endpoints
- Important parameters: `dataset_id`, `select`, `lang`, `timezone`, `include_links`, `include_app_metas`

14. `GET /catalog/datasets/{dataset_id}/facets`
- Purpose: enumerate facet values within a dataset
- Important parameters: `dataset_id`, `where`, `refine`, `exclude`, `facet`, `lang`, `timezone`

15. `GET /catalog/datasets/{dataset_id}/attachments`
- Purpose: list files / attachments attached to a dataset
- Important parameters: `dataset_id`

16. `GET /catalog/datasets/{dataset_id}/records/{record_id}`
- Purpose: read one dataset record by identifier
- Important parameters: `dataset_id`, `record_id`, `select`, `lang`, `timezone`

## Sources inspected
- `https://data.ratp.fr/api-console/explore/v2.1/`
- `https://data.ratp.fr/api/explore/v2.1/swagger.json`
- `https://data.ratp.fr/page/temps-reel/`
- `https://data.ratp.fr/api/explore/v2.1/catalog/datasets?limit=1`
