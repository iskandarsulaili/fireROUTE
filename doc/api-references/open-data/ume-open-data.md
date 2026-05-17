# Umeå Open Data

## Provider metadata
- Category: `Open Data`
- Provider slug: `ume-open-data`
- Description: `Open data of the city Umeå in northern Sweden`
- Official docs/pages used:
  - `https://opendata.umea.se/api-console/explore/v2.1/` (official Explore API console)
  - `https://opendata.umea.se/api/explore/v2.1/swagger.json` (official OpenAPI document linked from the console)
- Current public API base URL: `https://opendata.umea.se/api/explore/v2.1`
- Auth model: public Explore API with optional authenticated requests via query parameter `apikey` per the official OpenAPI document
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON for API responses; export routes additionally support CSV, FlatGeobuf, GeoJSON, GPX, JSON, JSONL, JSON-LD, KML, N3, OV2, Parquet, RDF/XML, SHP, Turtle, and XLSX according to the official schema enum
- Rate limits: no numeric quota was published on the reviewed official pages, but the official OpenAPI document defines `429` responses on all reviewed operations
- Manually confirmed route count: `16`

## API shape and behavior
- The official console states that the Explore API v2 is REST-based and hierarchical.
- The console explicitly says all API endpoints return JSON.
- The console also states that all responses contain navigation links and that the API uses Opendatasoft Query Language (ODSQL) across most endpoints.
- The official description notes that `records` endpoints are limited in returned-record count, while `exports` endpoints are not.

## Canonical endpoints
1. `GET /catalog/datasets`
   - Query catalog datasets.
2. `GET /catalog/exports`
   - List catalog export formats.
3. `GET /catalog/exports/{format}`
   - Export the full catalog in a chosen format.
4. `GET /catalog/exports/csv`
   - Export the full catalog in CSV.
5. `GET /catalog/exports/dcat{dcat_ap_format}`
   - Export the catalog in RDF/XML DCAT form.
6. `GET /catalog/facets`
   - List catalog facet values.
7. `GET /catalog/datasets/{dataset_id}`
   - Show dataset information.
8. `GET /catalog/datasets/{dataset_id}/records`
   - Query records from a dataset.
9. `GET /catalog/datasets/{dataset_id}/exports`
   - List export formats for a dataset.
10. `GET /catalog/datasets/{dataset_id}/exports/{format}`
    - Export a dataset in a chosen format.
11. `GET /catalog/datasets/{dataset_id}/exports/csv`
    - Export a dataset in CSV.
12. `GET /catalog/datasets/{dataset_id}/exports/parquet`
    - Export a dataset in Parquet.
13. `GET /catalog/datasets/{dataset_id}/exports/gpx`
    - Export a dataset in GPX.
14. `GET /catalog/datasets/{dataset_id}/facets`
    - List facets for one dataset.
15. `GET /catalog/datasets/{dataset_id}/attachments`
    - List attachments for one dataset.
16. `GET /catalog/datasets/{dataset_id}/records/{record_id}`
    - Read a single dataset record.

## Core parameters and path conventions
### Path parameters
- `dataset_id` - required on dataset-specific routes; the official schema says it is the dataset identifier shown on the dataset page/in dataset URLs.
- `record_id` - required on single-record routes.
- `format` - required on generic export routes.
- `dcat_ap_format` - required on the DCAT export route.

### Shared ODSQL query parameters confirmed in the official OpenAPI document
- `select` - projection and computed-field expression support
- `where` - filter expression / text search using ODSQL
- `order_by` - sort expression
- `group_by` - grouping expression for aggregations
- `limit` - item count; defaults to `10` on list/records routes and `-1` on export routes
- `offset` - pagination offset; defaults to `0`
- `refine` - facet include filter
- `exclude` - facet exclude filter
- `lang` - response localization override; official enum includes `en`, `fr`, `nl`, `pt`, `it`, `ar`, `de`, `es`, `ca`, `eu`, `sv`
- `timezone` - timezone override for datetime fields; default `UTC`
- `include_links` - include HATEOAS links in responses
- `include_app_metas` - include application metadata in responses

### Export-specific query parameters
- `use_labels` - output field labels instead of internal field names
- `compressed` - gzip-compress supported export outputs
- `epsg` - projection code for geometry-capable export formats; default `4326`

## Response and pagination notes
- All endpoints reviewed are documented as JSON APIs.
- The platform explicitly returns navigational links in responses.
- Pagination is handled with `limit` and `offset`.
- The OpenAPI document names schema families including `dataset`, `datasets`, `record`, `records`, `attachment`, `facet_enumeration`, and `facet_value_enumeration`.

## Error notes
The official OpenAPI document lists these common response families on the reviewed routes:
- `200` - success
- `400` - invalid request / query
- `401` - authentication issue when authenticated access is required
- `429` - too many requests
- `500` - server-side failure

## Usage notes
- Treat this as an Opendatasoft Explore API instance rooted at `/api/explore/v2.1`.
- Prefer `records` for paginated interactive querying and `exports` for full-dataset extraction.
- Keep ODSQL query strings intact in fireROUTE passthrough mode; they are a first-class part of the provider contract.
- Public datasets are browseable from the portal without an obvious sign-in requirement, but the official schema still documents `apikey` query auth for authenticated requests.

## fireROUTE normalization notes
- Preserve the `/api/explore/v2.1` prefix.
- Normalize catalog-level and dataset-level operations as separate families.
- Keep dataset IDs and record IDs as raw path variables.
- Preserve export-format choice as part of the route shape rather than collapsing everything into one generic download endpoint.
- Expose shared ODSQL parameters consistently across list, record, facet, and export routes.