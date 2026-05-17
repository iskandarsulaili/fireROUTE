# GENESIS

## Provider metadata
- Category: `Open Data`
- Provider slug: `genesis`
- Description: `German Federal Statistical Office GENESIS-Online REST/JSON API for metadata, catalogue discovery, data extraction, exports, and account/profile actions`
- Official docs/pages used:
  - `https://www.destatis.de/EN/Service/OpenData/api-webservice.html`
  - `https://www-genesis.destatis.de/datenbank/online/#modal=web-service-api`
  - `https://www-genesis.destatis.de/genesisWS/swagger-ui/index.html`
  - `https://www-genesis.destatis.de/genesisWS/rest/2020/application.wadl`
  - `https://www-genesis.destatis.de/genesisWS/rest/2020/GOJsonApi.json`
- Current public API base URL: `https://www-genesis.destatis.de/genesisWS/rest/2020/`
- Auth model: the official GENESIS modal page says use of the webservice requires a free GENESIS-Online registration; the WADL documents `username` and `password` request headers on most POST routes, with defaults shown as `GAST`; live browser fetches also confirmed that at least some informational GET routes answer without custom credentials
- Methods officially documented on the reviewed sources: `GET`, `POST`
- Response formats officially documented on the reviewed sources: JSON (`application/json;charset=UTF-8`) for API responses, binary downloads (`application/octet-stream`) for file-export routes, and JSON/YAML for the machine-readable API description routes
- Rate limits: no numeric public quota or throttling rules were published on the reviewed official pages
- Manually confirmed route count: `51`

## Official platform notes
- The Destatis page explicitly says GENESIS-Online can be used free of charge.
- The GENESIS modal page explicitly says the RESTful/JSON interface requires a free registration on GENESIS-Online.
- The same GENESIS modal page currently warns users to migrate existing processes to POST methods and says the SOAP/XML interface and GET methods of the RESTful/JSON interface were shut down on `15.07.2025`.
- In this run, live browser fetches still returned successful responses from at least `GET /helloworld/whoami` and `GET /catalogue/qualitysigns`, so fireROUTE should preserve the officially documented GET operations but treat POST as the preferred integration style.
- The GENESIS modal page also publishes a migration notice saying the database will move to `genesis.destatis.de` from `28. Mai 2026`; the currently documented REST base URL still points to `www-genesis.destatis.de` in the reviewed WADL and Swagger assets.

## Shared request model
### Common auth and localization parameters
- `username` - request header on most POST routes; WADL default `GAST`
- `password` - request header on most POST routes; WADL default `GAST`
- `language` - query parameter used widely across the API; WADL default `de`
- `area` - query parameter used on many metadata/data/profile routes; WADL default `free`

### Catalogue/list parameters
- `selection` - list/search selector used on many catalogue routes
- `searchcriterion` - list search field; documented defaults include `Code`
- `sortcriterion` - result ordering field; documented defaults include `Code` and `Name` depending on the route
- `pagelength` - list page size; documented default `100`
- `type` - variable type filter on `/catalogue/variables`; default `Alle`
- `term` - search term on `/find/find`
- `category` - search category on `/find/find`; default `all`

### Metadata and data extraction parameters
- `name` - object identifier used on metadata and data routes for tables, cubes, results, and time series
- `contents` - selection/content filter on several data-export routes
- `compress` - boolean-style compression toggle on some table/result routes; default `false`
- `transpose` - boolean-style output transpose toggle on `/data/table`; default `false`
- `values` - include values in cube-file export; default `true`
- `metadata` - include metadata in cube-file export; default `false`
- `additionals` - include additionals in cube-file export; default `false`
- `format` - file export format; documented default `datencsv`
- `quality` - output quality toggle on `/data/resultfile`; default `off`
- `job` - asynchronous-job toggle on `/data/table`; default `false`
- `stand` - reference date/timestamp; WADL default `01.01.1970 01:00`
- `startyear`, `endyear`, `timeslices` - time-range and slice filters
- `regionalvariable`, `regionalkey` - regional slicing filters
- `classifyingvariable1`..`classifyingvariable5` - classifying-variable selectors
- `classifyingkey1`..`classifyingkey5` - classifying-value selectors

## Canonical endpoints
### Utility and machine-readable description routes
1. `GET /helloworld/whoami`
   - Echoes request identity information; live response returned the caller `User-Agent` in JSON.
2. `POST /helloworld/logincheck`
   - Validates login / service access with header credentials.
3. `GET /admin/reloadini`
   - Admin utility route documented in the public WADL.
4. `GET /GOJsonApi.{type:json|yaml}`
   - Machine-readable API description route used by the published Swagger UI.
5. `GET /openapi.{type:json|yaml}`
   - Alternate machine-readable OpenAPI export route.

### Metadata routes
6. `POST /metadata/cube`
   - Fetch cube metadata by `name`.
7. `POST /metadata/statistic`
   - Fetch statistic metadata by `name`.
8. `POST /metadata/table`
   - Fetch table metadata by `name`.
9. `POST /metadata/value`
   - Fetch value metadata by `name`.
10. `POST /metadata/variable`
    - Fetch variable metadata by `name`.
11. `POST /metadata/timeseries`
    - Fetch timeseries metadata by `name`.

### Catalogue routes
12. `POST /catalogue/cubes`
13. `POST /catalogue/cubes2statistic`
14. `POST /catalogue/cubes2variable`
15. `POST /catalogue/jobs`
16. `POST /catalogue/modifieddata`
17. `GET /catalogue/qualitysigns`
18. `POST /catalogue/qualitysigns`
19. `POST /catalogue/results`
20. `POST /catalogue/statistics`
21. `POST /catalogue/statistics2variable`
22. `POST /catalogue/tables`
23. `POST /catalogue/tables2statistic`
24. `POST /catalogue/tables2variable`
25. `POST /catalogue/terms`
26. `POST /catalogue/timeseries`
27. `POST /catalogue/timeseries2statistic`
28. `POST /catalogue/timeseries2variable`
29. `POST /catalogue/values`
30. `POST /catalogue/values2variable`
31. `POST /catalogue/variables`
32. `POST /catalogue/variables2statistic`

### Data and export routes
33. `POST /data/cube`
34. `POST /data/table`
35. `POST /data/chart2table`
36. `POST /data/chart2result`
37. `POST /data/chart2timeseries`
38. `POST /data/cubefile`
39. `POST /data/map2result`
40. `POST /data/timeseries`
41. `POST /data/map2table`
42. `POST /data/map2timeseries`
43. `POST /data/result`
44. `POST /data/resultfile`
45. `POST /data/tablefile`
46. `POST /data/timeseriesfile`

### Search and profile routes
47. `POST /find/find`
48. `GET /profile/password`
49. `POST /profile/password`
50. `GET /profile/removeResult`
51. `POST /profile/removeResult`

## Route-family parameter notes
### Login and health-style routes
- `POST /helloworld/logincheck` uses `username` and `password` headers plus optional `language` query parameter.
- `GET /helloworld/whoami` accepts a `user-agent` header and returns JSON.

### Metadata routes
- The reviewed WADL documents these shared metadata-route query parameters:
  - `name`
  - `area` (default `free`)
  - `language` (default `de`)
- All six metadata routes use POST plus `application/x-www-form-urlencoded` request bodies and return JSON.

### Catalogue routes
- `/catalogue/tables` uses `selection`, `area`, `searchcriterion`, `sortcriterion`, `pagelength`, and `language`.
- `/catalogue/statistics` uses `selection`, `searchcriterion`, `sortcriterion`, `pagelength`, and `language`.
- `/catalogue/variables` adds `type` to the normal list/search parameters.
- `/catalogue/qualitysigns` only documents `language`; live use confirmed it returns JSON with `Ident`, `Status`, `Parameter`, and `List` keys.
- The catalogue family exposes discovery/index routes for cubes, tables, statistics, variables, time series, terms, values, results, jobs, and relationship lists such as `tables2statistic` and `values2variable`.

### Data/export routes
- `/data/table` has the broadest documented query model, including `name`, `area`, `compress`, `transpose`, `contents`, `startyear`, `endyear`, `timeslices`, `regionalvariable`, `regionalkey`, `classifyingvariable1`..`classifyingvariable5`, `classifyingkey1`..`classifyingkey5`, `job`, `stand`, and `language`.
- `/data/cubefile` documents `values`, `metadata`, `additionals`, `format`, and the time/classification filters listed above; it returns `application/octet-stream`.
- `/data/resultfile` documents `compress`, `format`, `quality`, and `language`; it returns `application/octet-stream`.
- The `tablefile` and `timeseriesfile` routes are separate file-export operations listed in the official WADL and should be preserved as distinct routes.

### Search/profile routes
- `/find/find` uses `term`, `category`, `pagelength`, and `language`.
- `/profile/password` uses `new` and `repeat` for password changes, with both GET and POST variants documented.
- `/profile/removeResult` uses `name`, `area`, and `language`, with both GET and POST variants documented.

## Response, pagination, and error notes
- The WADL documents JSON responses (`application/json;charset=UTF-8`) for non-file routes.
- The file-export routes return `application/octet-stream`.
- List/discovery pagination is exposed via `pagelength`; no page-number or offset parameter was published in the reviewed simplified WADL.
- Live `GET /catalogue/qualitysigns?language=de` returned a JSON body shaped like:
  - `Ident`
  - `Status`
  - `Parameter`
  - `List`
- Live `GET /catalogue/qualitysigns?language=xx` still returned HTTP `200`, but the JSON `Status` object carried warning code `22` and explained that an invalid parameter had been adjusted.
- A request to a nonexistent route returned HTTP `404` with an HTML error page rather than a JSON error body.

## Important usage notes
- The published Swagger UI computes its spec URL dynamically and points to `/{basePath}/rest/2020/GOJsonApi.json`; on the reviewed live host that resolves to `https://www-genesis.destatis.de/genesisWS/rest/2020/GOJsonApi.json`.
- The official modal page says registration is required even though some WADL defaults and some live informational responses still expose guest-style behavior.
- The official modal page tells integrators to move to POST methods. Prefer POST in fireROUTE even when a GET variant still responds during manual review.
- The official migration notice about the upcoming `genesis.destatis.de` host means this provider should be revisited after the announced cutover.

## fireROUTE normalization notes
- Use `https://www-genesis.destatis.de/genesisWS/rest/2020/` as the canonical base URL for the currently documented live API.
- Preserve `username` and `password` as native request headers rather than converting them into a synthetic bearer-token model.
- Preserve GENESIS query parameter names exactly as documented, especially `selection`, `searchcriterion`, `sortcriterion`, `pagelength`, `contents`, `timeslices`, `regionalvariable`, and the numbered `classifyingvariable*` / `classifyingkey*` pairs.
- Model `GOJsonApi.{type}` and `openapi.{type}` as machine-readable description routes separate from the data/catalogue surface.
- Model the file-export routes as binary-returning operations distinct from the JSON metadata/data routes.
