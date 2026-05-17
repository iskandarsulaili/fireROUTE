# CMS.gov

## Provider metadata
- Category: `Health`
- Provider slug: `cms-gov`
- Official docs/pages used:
  - `https://data.cms.gov/provider-data/`
  - `https://data.cms.gov/provider-data/docs`
  - `https://data.cms.gov/provider-data/api/1?authentication=false`
  - `https://data.cms.gov/provider-data/api/1`
- Current public API base URL: `https://data.cms.gov/provider-data/api/1`
- Public API style: DKAN metastore + datastore catalog/query API
- Auth model:
  - reviewed public read-only provider-data operations are exposed on the official OpenAPI document with `authentication=false`
  - the auth-enabled variant of the same official OpenAPI document adds `basic_auth` for write/admin operations that are not exposed on the public Provider Data Catalog docs page
- Response formats: JSON and CSV
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed Provider Data Catalog pages or public OpenAPI document
- Manually confirmed public route count: `18`

## Authentication and access
- The Provider Data Catalog homepage prominently advertises `Get API Key`, but the official public API docs page links to an unauthenticated OpenAPI variant at `?authentication=false`.
- The public read surface documented on the Provider Data Catalog docs page is therefore usable as a read-only API reference without attaching auth requirements to every route.
- The auth-enabled OpenAPI document at `https://data.cms.gov/provider-data/api/1` adds a `basic_auth` security scheme and additional write/admin operations such as metadata revisions and harvest-plan management, which do not appear on the public Provider Data Catalog docs page.
- For fireROUTE, the safest normalization is to treat the reviewed surface as the public read API and keep the authenticated management surface out of scope unless CMS explicitly documents it for public integrators.

## Canonical public endpoints
### Metastore
1. `GET /provider-data/api/1/metastore/schemas` - list all metastore schemas
2. `GET /provider-data/api/1/metastore/schemas/{schema_id}` - fetch one schema definition
3. `GET /provider-data/api/1/metastore/schemas/{schema_id}/items` - list all items for one schema
4. `GET /provider-data/api/1/metastore/schemas/dataset/items/{identifier}` - fetch one dataset record

### Datastore import/status
5. `GET /provider-data/api/1/datastore/imports/{identifier}` - datastore statistics for one import/resource identifier

### Datastore queries across one or more resources
6. `POST /provider-data/api/1/datastore/query` - query one or more datastore resources with a JSON request body
7. `GET /provider-data/api/1/datastore/query` - query one or more datastore resources with query parameters
8. `POST /provider-data/api/1/datastore/query/download` - query one or more datastore resources and return a downloadable file
9. `GET /provider-data/api/1/datastore/query/download` - GET download variant for multi-resource queries

### Datastore queries against one resource
10. `POST /provider-data/api/1/datastore/query/{distributionId}` - query one datastore resource by distribution ID
11. `GET /provider-data/api/1/datastore/query/{distributionId}` - GET variant for one distribution ID
12. `POST /provider-data/api/1/datastore/query/{datasetId}/{index}` - query one datastore resource by dataset ID plus index
13. `GET /provider-data/api/1/datastore/query/{datasetId}/{index}` - GET variant for dataset ID plus index
14. `GET /provider-data/api/1/datastore/query/{distributionId}/download` - download one resource by distribution ID
15. `GET /provider-data/api/1/datastore/query/{datasetId}/{index}/download` - download one resource by dataset ID plus index
16. `GET /provider-data/api/1/datastore/sql` - run a SQL query against datastore resources

### Catalog search
17. `GET /provider-data/api/1/search` - search the DKAN catalog
18. `GET /provider-data/api/1/search/facets` - retrieve facet metadata for search filters

## Parameters and request notes
### Shared datastore-query controls
The official OpenAPI schema documents these common datastore query controls across the GET and POST query routes:
- `limit` - maximum number of returned rows; minimum `1`
- `offset` - number of rows to skip before returning results; default `0`
- `count` - whether to return total row count
- `results` - whether to return result rows
- `schema` - whether to return schema metadata
- `keys` - whether JSON results use keyed objects instead of arrays
- `format` - output format; documented values are `json` or `csv`
- `rowIds` - include the `result_number` column in output

### POST datastore-query body model
The official schema for POST datastore queries documents these top-level request-body fields:
- `resources` - list of resources to query; supports aliases
- `properties` - selected properties or aliased expressions
- `conditions` - filters or condition groups
- `joins` - join definitions across resources
- `groupings` - grouping fields
- `sorts` - result-sort directives
- plus the shared controls above: `limit`, `offset`, `count`, `results`, `schema`, `keys`, `format`, `rowIds`

### Path parameters
- `identifier` - import/resource identifier or dataset identifier, depending on route
- `schema_id` - schema name such as `dataset`
- `distributionId` - datastore distribution identifier
- `datasetId` - dataset identifier
- `index` - datastore resource index within a dataset

### Search parameters
The official `GET /search` operation documents:
- `fulltext` - free-text search string
- `page` - page number
- `page-size` - page size
- `sort` - sort fields
- `sort-order` - sort directions
- `facets` - requested facets
- `theme` - topic filter
- `keyword` - keyword filter

### Route-specific parameters
- `show-reference-ids` - optional boolean on metastore item-list and dataset-item routes
- `query` - required SQL string on `GET /datastore/sql`
- `show_db_columns` - optional boolean on `GET /datastore/sql`
- `format` - optional download/query format selector on the single-resource download routes

## Response, pagination, and error notes
- The public datastore-query routes can return either JSON or CSV depending on the route and `format` selection.
- The reviewed OpenAPI document describes the JSON datastore-query envelope with top-level keys including `results`, `count`, `schema`, and `query`.
- Catalog search paginates with `page` and `page-size`.
- Datastore queries paginate with `limit` and `offset`.
- The reviewed public operations document `400` validation/request errors and `404` not-found errors on identifier-based routes.
- The auth-enabled variant of the official OpenAPI document also defines `409` conflict responses for metadata-write operations, reinforcing that CMS uses the same API surface for private management tasks as well as public reads.
- I did not find a public numeric quota, shared retry header, or explicit CORS statement on the reviewed Provider Data Catalog pages.

## Usage notes from the official docs
- The Provider Data Catalog homepage positions the service as a catalog for exploring and downloading Medicare provider data.
- The official docs page exposes the API through DKAN-style `Metastore`, `Datastore`, `Datastore: SQL Query`, and `Search` sections.
- The official homepage links users to Medicare.gov for provider comparison while the Provider Data Catalog API focuses on raw catalog/distribution access.
- The official docs page's `View API specification` link is the authoritative route-level reference used here.

## fireROUTE normalization notes
- Normalize CMS.gov as a read-heavy DKAN catalog/query API rooted at `https://data.cms.gov/provider-data/api/1`.
- Preserve the distinction between metastore metadata routes and datastore record-query routes.
- Treat `distributionId` and `datasetId/index` addressing as alternate ways to reach datastore resources.
- Preserve JSON-vs-CSV behavior on query/download routes rather than assuming JSON-only responses.
- Keep the authenticated management surface separate from the public Provider Data Catalog adapter unless CMS explicitly requires it for the intended integration.