# adresse.data.gouv.fr

## Provider metadata
- Category: `Geocoding`
- Provider slug: `adresse-data-gouv-fr`
- Official docs used manually:
  - `https://adresse.data.gouv.fr/outils/api-doc/adresse`
  - `https://cartes.gouv.fr/aide/fr/guides-utilisateur/utiliser-les-services-de-la-geoplateforme/geocodage/`
  - `https://data.geopf.fr/geocodage/openapi`
  - `https://data.geopf.fr/geocodage/openapi.yaml`
- Public API base URL currently documented by the provider: `https://data.geopf.fr/geocodage`
- Legacy product note from the official adresse.data.gouv.fr page: `api-adresse.data.gouv.fr` is deprecated and integrated into the Géoplateforme geocoding service; the old URL is scheduled for decommissioning at the end of January 2026
- Transport: `HTTPS`
- Auth model:
  - `GET /getCapabilities`, `GET /search`, `GET /reverse`, `POST /search/csv`, and `POST /reverse/csv` are documented without authentication requirements
  - `POST /async/projects` may be anonymous or authenticated with bearer-token authorization
  - authenticated async-project creation can also use header `X-Community`
  - the remaining async project-management operations require a project token in the `Authorization` header (`ProjectAuth` in the OpenAPI file)
  - async file-download routes use path token parameters in the URL
- Response formats documented in the inspected materials: `JSON`, `CSV`, and binary file download payloads

## Product and access notes
- The official migration notice on adresse.data.gouv.fr says the old BAN API has been folded into the Géoplateforme geocoding service.
- The official guide says the service supports direct geocoding, reverse geocoding, synchronous CSV batch geocoding, and expert-oriented asynchronous project processing.
- Data sources called out by the official guide:
  - BAN for addresses, updated weekly
  - BD TOPO points of interest, updated quarterly
  - Parcellaire Express parcels, updated quarterly
- Official usage limit from both the migration page and the Géoplateforme guide: `50 requests per second per IP`
- The migration page says rate-limit violations return `429 Too Many Requests` with a `Retry-After` header and a temporary block of `5` seconds.
- The guide says synchronous batch files must be UTF-8 and under `50 MB` or `200000` lines.
- The guide says expert asynchronous workflows can handle larger files up to `1 GB`; the OpenAPI file notes that default async projects use `50 MB` files unless community quotas are applied.

## Confirmed API surface
The inspected official docs confirm these `15` operations:
1. `GET /getCapabilities`
2. `GET /search`
3. `POST /search/csv`
4. `GET /reverse`
5. `POST /reverse/csv`
6. `POST /async/projects`
7. `GET /async/projects/{projectId}`
8. `DELETE /async/projects/{projectId}`
9. `PUT /async/projects/{projectId}/pipeline`
10. `PUT /async/projects/{projectId}/input-file`
11. `POST /async/projects/{projectId}/start`
12. `POST /async/projects/{projectId}/abort`
13. `POST /async/projects/{projectId}/reset`
14. `GET /async/projects/{projectId}/input-file/{token}`
15. `GET /async/projects/{projectId}/output-file/{token}`

## Shared geocoding parameters and filters
Across the documented geocoding endpoints, the official OpenAPI file repeatedly exposes these concepts:
- `index` / `indexes` values: `address`, `parcel`, `poi`
- address / POI filters:
  - `postcode`
  - `citycode`
  - `depcode` on `GET /search`
  - `city`
  - `category` for POI
  - `type` for address (`housenumber`, `street`, `locality`, `municipality`)
- parcel filters:
  - `departmentcode`
  - `municipalitycode`
  - `oldmunicipalitycode`
  - `districtcode`
  - `section`
  - `number`
  - `sheet`
- result-shaping options:
  - `limit` with documented max `50`; if `returntruegeometry=true`, the docs say the effective max drops to `20`
  - `returntruegeometry`

## 1) Service capabilities
- Method: `GET`
- Path: `/getCapabilities`
- Full URL: `https://data.geopf.fr/geocodage/getCapabilities`
- Purpose: discover available operations, resources, and options
- Parameters: none documented
- Response format: `application/json`
- Response notes: the schema includes service info, API version, operations, and index/field metadata

## 2) Direct geocoding search
- Method: `GET`
- Path: `/search`
- Full URL: `https://data.geopf.fr/geocodage/search`
- Purpose: search by address, POI, administrative name, or cadastral parcel

Key documented query parameters:
- `q` - free-text query; may be blank for structured parcel searches
- `autocomplete` - `1` or `0`, default `1`
- `index` - one or more of `address`, `parcel`, `poi`
- `limit`
- `lat`, `lon` - proximity biasing for closer candidates
- `returntruegeometry`
- filters: `postcode`, `citycode`, `depcode`, `type`, `city`, `category`, `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `number`, `sheet`

Important official notes:
- the docs provide examples for address, POI, and parcel searches
- the OpenAPI text explicitly allows empty `q` for structured parcel searches when parcel filter fields are supplied
- successful responses are GeoJSON-like feature collections with `features`
- documented error: `400 Parse query failed`

## 3) Direct CSV batch geocoding
- Method: `POST`
- Path: `/search/csv`
- Purpose: synchronous bulk direct geocoding from a CSV upload
- Request content type: `multipart/form-data`
- Required form field:
  - `data` - CSV file to geocode

Documented optional form fields:
- `columns` - columns concatenated into the text query
- `indexes`
- column-name selectors for filters / coordinates:
  - `type`, `citycode`, `postcode`, `category`, `lon`, `lat`
  - `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `sheet`, `number`
- `result_columns` - output columns to keep

Official limits / notes:
- OpenAPI says max file size is `50 MB`
- guide says UTF-8 and under `200000` lines
- response on success is `text/csv`
- documented error response `400` includes JSON body with `code` and `message`

## 4) Reverse geocoding search
- Method: `GET`
- Path: `/reverse`
- Full URL: `https://data.geopf.fr/geocodage/reverse`
- Purpose: return the nearest address, POI, parcel, or administrative entity for coordinates or a search geometry

Key documented query parameters:
- `searchgeom` - geometry string for intersection search
- `lon`, `lat` - search point or ordering point
- `index`
- `limit`
- `returntruegeometry`
- filters: `postcode`, `citycode`, `type`, `city`, `category`, `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `number`, `sheet`

Important official notes:
- if `searchgeom` is used alone, intersecting objects are returned without score ordering
- adding `lon` and `lat` with `searchgeom` provides ordering by distance / score
- when `searchgeom` is omitted, `lon` and `lat` define the search point and ordering point
- allowed geometry types include `Point`, `LineString`, `Polygon`, and `Circle`
- for `address`, only `Polygon` and `Circle` are allowed in `searchgeom`
- the largest side of the geometry bounding rectangle must not exceed `1000` meters
- successful responses are feature collections; documented error is `400 Parse query failed`

## 5) Reverse CSV batch geocoding
- Method: `POST`
- Path: `/reverse/csv`
- Purpose: synchronous bulk reverse geocoding from a CSV upload
- Request content type: `multipart/form-data`
- Required form field:
  - `data` - CSV file containing coordinates / inputs to geocode

Documented optional form fields:
- `indexes`
- filter / coordinate column names: `type`, `citycode`, `postcode`, `category`, `lon`, `lat`, `departmentcode`, `municipalitycode`, `oldmunicipalitycode`, `districtcode`, `section`, `sheet`, `number`
- `result_columns`

Response notes:
- success returns `text/csv`
- documented `400` error returns JSON with `code` and `message`

## 6) Create async project
- Method: `POST`
- Path: `/async/projects`
- Purpose: create a geocoding project for asynchronous processing
- Optional header: `X-Community`
- Auth: anonymous allowed, or `Authorization` bearer token

Important official notes:
- authenticated creation plus `X-Community` allows community quotas to apply
- default project limits described in the OpenAPI file are `50 MB` max file size and no parallelization (`concurrency = 1`) unless community quotas apply
- authenticated users receive email notifications on success/failure
- success returns a project object including the token needed for subsequent steps
- documented errors: `401` invalid token, `403` user not a member of the supplied community

## 7) Get async project metadata
- Method: `GET`
- Path: `/async/projects/{projectId}`
- Purpose: retrieve project metadata, progress, and input/output file references
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Documented responses: `200`, `401`, `404`

## 8) Delete async project
- Method: `DELETE`
- Path: `/async/projects/{projectId}`
- Purpose: delete an idle, completed, or failed project
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Documented responses: `204`, `401`, `403`, `404`
- Important note: deletion is forbidden while processing is active

## 9) Configure async pipeline
- Method: `PUT`
- Path: `/async/projects/{projectId}/pipeline`
- Purpose: define geocoding and output parameters for the async job
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Request body: `application/json` using the `Pipeline` schema
- Important notes:
  - output can be `CSV` or `GeoJSON`
  - input-file settings are preserved except output encoding, which is always UTF-8
  - file / pipeline compatibility is only checked when geocoding starts
- Documented responses: `200`, `400`, `401`, `403`, `404`

## 10) Upload async input file
- Method: `PUT`
- Path: `/async/projects/{projectId}/input-file`
- Purpose: upload the source file for an async project
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Request content type: `application/octet-stream`
- Optional headers:
  - `Content-Length`
  - `Content-Disposition` - to carry the original filename; default is `input.csv`
- Documented responses: `200`, `400`, `401`, `403`, `404`

## 11) Start async geocoding
- Method: `POST`
- Path: `/async/projects/{projectId}/start`
- Purpose: queue the project for asynchronous processing
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Important note: source file and pipeline must already be present
- Documented responses: `200`, `401`, `403`, `404`

## 12) Abort async geocoding
- Method: `POST`
- Path: `/async/projects/{projectId}/abort`
- Purpose: cancel a waiting or processing project and return it to idle state
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Documented responses: `200`, `401`, `403`, `404`

## 13) Reset async geocoding
- Method: `POST`
- Path: `/async/projects/{projectId}/reset`
- Purpose: reset a completed or failed project back to idle state
- Path parameter: `projectId`
- Auth: project token via `Authorization` header
- Documented responses: `200`, `401`, `403`, `404`

## 14) Download async input file
- Method: `GET`
- Path: `/async/projects/{projectId}/input-file/{token}`
- Purpose: download the original uploaded source file
- Path parameters:
  - `projectId`
  - `token` - file access token from project metadata (`inputFile.token`)
- Response content types documented: `text/csv` and binary `application/json`/file payload variants depending on stored file type

## 15) Download async output file
- Method: `GET`
- Path: `/async/projects/{projectId}/output-file/{token}`
- Purpose: download the processed result file
- Path parameters:
  - `projectId`
  - `token` - file access token from project metadata (`outputFile.token`)
- Response content type documented: `application/octet-stream`

## Errors, limits, pagination, and format notes
- No pagination scheme is documented.
- Direct and reverse lookup limits:
  - `limit` max `50`
  - effective `20` max when `returntruegeometry=true`
- Official usage throttling:
  - `50` requests per second per IP
  - `429` response on overage
  - temporary `5` second block with `Retry-After` header according to the migration page
- Synchronous CSV upload constraints from the official docs:
  - UTF-8
  - under `50 MB`
  - under `200000` lines
- Common error statuses visibly documented in the OpenAPI file include `400`, `401`, `403`, and `404` depending on operation.

## Canonical fireROUTE notes
- Treat this provider as the current Géoplateforme geocoding service rather than the deprecated `api-adresse.data.gouv.fr` hostname.
- Preserve the official deprecation note in adapter metadata because the legacy BAN hostname is being retired.
- Keep synchronous batch and asynchronous project workflows distinct; they are different operational surfaces with different auth behavior and file-size expectations.

## Verification notes
- This file was manually rebuilt from the live official adresse.data.gouv.fr migration page, the cartes.gouv.fr Géoplateforme geocoding guide, and the linked official OpenAPI docs using browser tools.
