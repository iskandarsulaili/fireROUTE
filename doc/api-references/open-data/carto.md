# CARTO

## Provider metadata
- Category: `Open Data`
- Provider slug: `carto`
- Official docs/pages used:
  - `https://carto.com/`
  - `https://docs.carto.com/`
  - `https://api-docs.carto.com/`
  - the official CARTO Postman collection and metadata loaded from the provider’s own `api-docs.carto.com` documenter endpoints
- Canonical API base patterns confirmed from the reviewed docs:
  - primary regional API base pattern: `https://{region}.api.carto.com`
  - reviewed example environment value: `https://gcp-us-east1.api.carto.com`
  - OAuth token host: `https://auth.carto.com/oauth/token`
  - Activity Data host: `https://accounts.app.carto.com`
- Auth model:
  - `API Access Token` for Maps API, SQL API, Imports API, and LDS API
  - `OAuth Access Token` for all APIs, and required for Tokens, Named Sources, Resources, and Activity Data
  - reviewed OAuth token request uses `grant_type=client_credentials`, `client_id`, `client_secret`, and `audience=carto-cloud-native-api`
- Response format notes:
  - primary response format is `JSON`
  - Maps routes can return URLs for `tilejson`, `json`, `geojson`, `ndjson`, and `binary` outputs depending on route/data size
- Public rate-limit notes: no global numeric rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `50`

## Canonical endpoints
### Maps API (`3`)
1. `GET /v3/maps/{connection}/query`
2. `GET /v3/maps/{connection}/table`
3. `GET /v3/maps/{connection}/tileset`

### SQL API (`6`)
4. `GET /v3/sql/{connection}/query`
5. `POST /v3/sql/{connection}/query`
6. `POST /v3/sql/{connectionName}/job`
7. `GET /v3/sql/{connectionName}/job/{jobId}`
8. `DELETE /v3/sql/{connection}/job/{jobId}`
9. `GET /v3/sql/jobs`

### Tokens API (`5`)
10. `POST /v3/tokens`
11. `PATCH /v3/tokens/{token}`
12. `GET /v3/tokens/{token}`
13. `DELETE /v3/tokens/{token}`
14. `GET /v3/tokens`

### Imports API (`4`)
15. `POST /v3/imports`
16. `POST /v3/imports/preview`
17. `GET /v3/imports/{jobId}`
18. `GET /v3/imports`

### Location Data Services / LDS (`6`)
19. `GET /v3/lds/geocoding/geocode`
20. `GET /v3/lds/geocoding/reverse`
21. `POST /v3/lds/geocoding/batch`
22. `GET /v3/lds/isolines`
23. `GET /v3/lds/routing`
24. `GET /v3/lds/stats`

### Activity Data (`3`)
25. `POST https://accounts.app.carto.com/activity-data-jobs`
26. `GET https://accounts.app.carto.com/activity-data-jobs/{jobId}`
27. `DELETE https://accounts.app.carto.com/activity-data-jobs/{jobId}/cancel`

### Named Sources (`5`)
28. `POST /v3/named-sources`
29. `GET /v3/named-sources/{name}`
30. `GET /v3/named-sources`
31. `PATCH /v3/named-sources/{name}`
32. `DELETE /v3/named-sources/{name}`

### Resources: maps/workflows (`4`)
33. `GET /v3/organization-maps`
34. `DELETE /v3/organization-maps/{mapId}`
35. `GET /v3/organization-workflows`
36. `DELETE /v3/organization-workflows/{workflowId}`

### Resources: connections (`9`)
37. `GET /v3/connections`
38. `GET /v3/connections/{connectionId}`
39. `POST /v3/connections` (Snowflake)
40. `POST /v3/connections` (Redshift)
41. `POST /v3/connections` (BigQuery)
42. `POST /v3/connections` (PostgreSQL)
43. `POST /v3/connections` (Databricks)
44. `PATCH /v3/connections/{connectionId}`
45. `DELETE /v3/connections/{connectionId}`

### Resources: superadmin (`5`)
46. `GET /v3/accounts/resources?resourceType=map`
47. `GET /v3/accounts/resources?resourceType=workflow`
48. `GET /v3/accounts/resources?resourceType=connection`
49. `POST /v3/accounts/resources/delete-batch`
50. `POST /v3/accounts/resources/transfer`

## Confirmed parameter and request-shape notes
### Shared/path variables
- `{connection}` / `{connectionName}` - CARTO connection identifier used across Maps and SQL routes
- `{jobId}` - asynchronous SQL/import/activity job identifier
- `{token}` - token string managed by the Tokens API
- `{name}` - named-source identifier
- `{mapId}`, `{workflowId}`, `{connectionId}` - organization resource identifiers

### Maps and SQL parameters
- `q` - SQL query string for map/sql query routes
- `queryParameters` - parameter values for SQL placeholders
  - BigQuery uses named parameters
  - Snowflake uses positional parameters like `:1`, `:2`
  - Redshift/PostgreSQL use positional parameters like `$1`, `$2`
- Maps `table` route uses `name` for fully qualified table names
- Maps/SQL reviewed docs repeatedly mention optional `Cache-control: max-age=...` overrides

### Imports parameters
- `connection`, `url`, `destination`, `overwrite`, `autoguessing`, and warehouse-specific schema/type options are documented on import routes
- reviewed docs say a single import job supports CSV, GeoJSON, GeoPackage, KML, KMZ, TAB, GeoParquet, and zipped Shapefiles

### LDS parameters
- Geocoding uses parameters such as `address`, `country`, `limit`, and provider-specific `options`
- Reverse geocoding uses `lat`, `lon`, and `language`
- Isolines uses `origin`, `mode`, `range`, `range_type`, and provider-specific `options`
- Routing uses `origin`, `destination`, `mode`, `waypoints`, and provider-specific `options`

### Pagination and listing parameters
- Named Sources list route documents `pageSize`, `page`, and `search`
- Organization maps/workflows use `page_size`, `page`, `order_by`, `order_direction`, `search`, `privacy`, and `tags`
- Superadmin resource listings use `pageSize`, `page`, `orderBy`, `orderDirection`, `q`, and `resourceType`

## Auth and error notes
- Reviewed live unauthenticated call to `GET https://gcp-us-east1.api.carto.com/v3/sql/jobs` returned:
```json
{"error":"Token not defined","status":401}
```
- Tokens API uses bearer auth and creates scoped API-access tokens with grants such as `connection_name`, `source`, `referers`, `allowed_apis`, and optional `expiration_date`
- Activity Data job docs enumerate statuses including `Pending`, `Running`, `Success`, `Failure`, and `Cancelled`
- Activity Data cancel docs explicitly say canceling an already finished job returns HTTP `400`

## Timeout, caching, and size-limit notes
- Maps API reviewed routes document a timeout limit of `1 minute`
- SQL API reviewed routes also document a timeout limit of `1 minute`
- `POST /v3/sql/{connection}/query` is specifically documented as not CDN-cached
- Maps caching differs by route and warehouse provider; reviewed docs publish cache lifetimes such as 5 minutes, 30 minutes, or 1 year depending on endpoint/provider
- Import jobs have a documented single-job size limit of `1GB`

## Important usage notes
- CARTO’s public reference is not one fixed host for every tenant; the docs explicitly use an environment variable and show region-specific API bases such as `https://gcp-us-east1.api.carto.com`.
- The category entry calls this `Open Data`, but the reviewed API is actually an authenticated platform API for geospatial analysis, connections, tokens, imports, and organizational resources.
- Maps and SQL routes are tightly coupled to existing CARTO connections and underlying data warehouses.
- Activity Data is hosted on `accounts.app.carto.com`, not the regional `/v3` API host.
- The reviewed official pages do not publish one platform-wide numeric request-per-minute quota.

## fireROUTE normalization notes
- Keep CARTO as a multi-surface provider with distinct Maps, SQL, Imports, LDS, Tokens, Named Sources, Resource, and Activity Data groups.
- Preserve the region-specific base-host pattern instead of hard-coding one host.
- Treat bearer-token auth as mandatory for practical integration work.
- Preserve provider-native parameter names such as `q`, `queryParameters`, `pageSize`, `page_size`, `order_by`, `orderBy`, and `resourceType` because the official API mixes naming conventions by surface.