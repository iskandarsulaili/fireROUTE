# French Address Search

## Provider metadata
- Category: `Open Data`
- Provider slug: `french-address-search`
- Description: `French national address geocoding service now documented as the Géoplateforme geocoding API`
- Official docs/pages used:
  - `https://geo.api.gouv.fr/adresse` (official BAN entry page that now redirects to the migration notice)
  - `https://adresse.data.gouv.fr/outils/api-doc/adresse` (official BAN migration / usage page)
  - `https://cartes.gouv.fr/aide/fr/guides-utilisateur/utiliser-les-services-de-la-geoplateforme/geocodage/` (official Géoplateforme geocoding guide linked from the BAN page)
  - `https://data.geopf.fr/geocodage/openapi` (official Swagger / OpenAPI page linked from the guide)
  - `https://data.geopf.fr/geocodage/openapi.yaml` (official OpenAPI document linked from the Swagger page)
- Current public API base URL: `https://data.geopf.fr/geocodage`
- Auth model: public GET/search and synchronous CSV routes require no auth in the reviewed official docs; asynchronous project creation can be anonymous or authenticated with the `Authorization` header using a Bearer token, while project-management routes use the `Authorization` header in `Token TOKEN_VALUE` form; optional header `X-Community` is supported on authenticated async-project creation
- Methods officially documented on the reviewed pages: `GET`, `POST`, `PUT`, `DELETE`
- Response formats officially documented on the reviewed pages: JSON / GeoJSON-style `FeatureCollection` responses for geocoding, JSON metadata for `getCapabilities` and async project management, `text/csv` for synchronous batch output, and binary download responses for async file retrieval
- Rate limits: the official BAN migration page states a limit of `50 calls/IP/second`; over-limit traffic returns HTML `429 Too Many Requests` responses and a `retry-after` header, with a temporary block duration of `5` seconds
- Manually confirmed route count: `15`

## API shape and migration note
- The historical BAN endpoint page now explicitly says `L'API Adresse BAN est dépréciée et intégrée dans le nouveau Service de géocodage de la Géoplateforme.`
- The BAN page also says `api-adresse.data.gouv.fr` will be decommissioned, so the current official route surface to normalize is the Géoplateforme base `https://data.geopf.fr/geocodage`.
- The official Géoplateforme guide and OpenAPI document expose direct geocoding, reverse geocoding, synchronous CSV batch routes, and an asynchronous project workflow.

## Canonical endpoints
1. `GET /getCapabilities`
   - Discover available operations, resources, and options.
2. `GET /search`
   - Direct geocoding search.
3. `POST /search/csv`
   - Direct geocoding of an uploaded CSV file.
4. `GET /reverse`
   - Reverse geocoding search.
5. `POST /reverse/csv`
   - Reverse geocoding of an uploaded CSV file.
6. `POST /async/projects`
   - Create an asynchronous geocoding project.
7. `GET /async/projects/{projectId}`
   - Fetch project metadata, progress, and file references.
8. `DELETE /async/projects/{projectId}`
   - Delete an idle, completed, or failed project.
9. `PUT /async/projects/{projectId}/pipeline`
   - Define processing parameters and output format.
10. `PUT /async/projects/{projectId}/input-file`
    - Upload the project input file.
11. `POST /async/projects/{projectId}/start`
    - Start a prepared async geocoding job.
12. `POST /async/projects/{projectId}/abort`
    - Cancel a waiting or processing job.
13. `POST /async/projects/{projectId}/reset`
    - Reset a completed or failed job back to idle.
14. `GET /async/projects/{projectId}/input-file/{token}`
    - Download the source file for a project.
15. `GET /async/projects/{projectId}/output-file/{token}`
    - Download the geocoding result file for a project.

## Core parameters and path conventions
### `GET /search`
- `q` - free-text query string for address, place, or parcel lookup; the official examples include street-address, POI, and parcel-id searches
- `autocomplete` - string enum `1` or `0`; defaults to `1`
- `index` - one or more comma-separated indexes: `address`, `parcel`, `poi`
- `limit` - defaults to `10`; max `50`; automatically reduced to `20` when `returntruegeometry=true`
- `lat`, `lon` - coordinate biasing parameters for ranking nearby candidates
- `returntruegeometry` - boolean; include true geometry in responses
- `postcode` - postal-code filter for `address` and `poi`; accepts comma-separated values up to `50`
- `citycode` - INSEE-code filter for `address` and `poi`; accepts comma-separated values up to `200`
- `depcode` - department-code filter for `address` and `poi`; accepts comma-separated values up to `10`
- `type` - address-type filter: `housenumber`, `street`, `locality`, `municipality`
- `city` - commune-name filter for `address` and `poi`
- `category` - POI-category filter; allowed values come from `getCapabilities`; accepts comma-separated values up to `10`
- `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `number`, `sheet` - parcel filters for structured parcel searches
- Important official note: `q` may be empty for structured parcel searches, e.g. `index=parcel` plus parcel filter fields

### `GET /reverse`
- `searchgeom` - geometry-intersection search input; supports `Point`, `LineString`, `Polygon`, and `Circle`
- `lon`, `lat` - ordering point when `searchgeom` is present, or the search point when `searchgeom` is omitted for retro-compatibility
- `index`, `limit`, `returntruegeometry`, `postcode`, `citycode`, `type`, `city`, `category`, `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `number`, `sheet` - same overall filter families as the direct search route
- Important official geometry note: for the `address` index, only `Polygon` and `Circle` geometries are allowed; the largest side of the geometry bounding box must not exceed `1000` meters

### Synchronous CSV batch routes
For both `POST /search/csv` and `POST /reverse/csv`:
- Request body content type: `multipart/form-data`
- Required form field: `data` (binary CSV file)
- Documented optional mapping/filter fields include `columns`, `indexes`, `type`, `citycode`, `postcode`, `category`, `lon`, `lat`, `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `sheet`, `number`, and `result_columns`
- The official docs state submitted files must be UTF-8 and no larger than `50 MB`
- Success response format: `text/csv`

### Async project workflow
- `projectId` - required path parameter on all project routes
- `token` - required path parameter on async file-download routes; the docs say it is obtained from the project metadata (`inputFile.token` / `outputFile.token`)
- `POST /async/projects` accepts optional header `X-Community`; security is explicitly `anonymous` or `BearerAuth`
- Project-management routes use the documented `ProjectAuth` header form `Authorization: Token XXXXXX`
- `PUT /async/projects/{projectId}/input-file` accepts optional headers `Content-Length` and `Content-Disposition`
- `PUT /async/projects/{projectId}/pipeline` accepts JSON matching the official `Pipeline` schema

## Response, pagination, and error notes
- `GET /search` and `GET /reverse` return JSON objects with top-level `type: FeatureCollection` and a `features` array.
- `GET /getCapabilities` returns service metadata including operations, parameters, and index definitions.
- The async routes return JSON project objects, except the file-download routes which return CSV or binary file content.
- No pagination scheme is documented for the reviewed routes.
- The official OpenAPI document exposes these response families across the reviewed endpoints:
  - `200` success
  - `201` async project created
  - `204` async project deleted
  - `400` invalid query / invalid CSV / invalid parameters
  - `401` invalid or missing auth on protected async routes
  - `403` forbidden state transition or community-membership problem
  - `404` project or route not found
- The official BAN migration page independently documents global throttling with HTML `429` responses and `retry-after` headers.

## Usage notes
- Prefer the Géoplateforme base URL; do not normalize new integrations against the legacy `api-adresse.data.gouv.fr` hostname.
- Use `GET /getCapabilities` to discover index and category values before building advanced `poi` or filtered searches.
- For large CSV jobs or files above the synchronous workflow limits, the official guide points users to the asynchronous project routes.
- Anonymous async-project creation is possible, but authenticated creation unlocks optional community quota inheritance through `X-Community`.

## fireROUTE normalization notes
- Normalize this provider under `https://data.geopf.fr/geocodage`, not the legacy BAN hostname.
- Keep direct, reverse, synchronous batch, and async-project workflows as separate route families.
- Preserve parcel-specific structured-search filters as first-class parameters rather than flattening them into free-text search only.
- Preserve the documented auth distinction between anonymous/Bearer project creation and `Token`-based project management.
