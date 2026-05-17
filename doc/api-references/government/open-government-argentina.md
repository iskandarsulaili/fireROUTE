# Open Government, Argentina

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-argentina`
- Official docs/pages used:
  - `https://datos.gob.ar/`
  - `https://datos.gob.ar/apis`
  - `https://datos.gob.ar/acerca/ckan`
  - `https://datos.gob.ar/series/api`
  - `https://datos.gob.ar/dataset/jgm_3/resource/jgm_3.13`
  - `https://datosgobar.github.io/series-tiempo-ar-api/`
  - `https://datosgobar.github.io/series-tiempo-ar-api/reference/api-reference/`
  - `https://datosgobar.github.io/series-tiempo-ar-api/reference/search-reference/`
  - `https://datosgobar.github.io/series-tiempo-ar-api/dumps/`
  - `https://datosgobar.github.io/series-tiempo-ar-api/reference/validate/`
  - `https://datosgobar.github.io/series-tiempo-ar-api/terms/`
- Current documented API hosts:
  - `https://apis.datos.gob.ar`
  - `https://datos.gob.ar`
- Current documented API path prefixes:
  - `https://apis.datos.gob.ar/series/api`
  - `https://datos.gob.ar/api/3/action`
- Auth model:
  - `Series API`: no auth documented or required for the reviewed read/validate routes
  - `CKAN Action API`: no auth documented for the reviewed public read routes
- Response/data formats:
  - `Series API`: JSON by default, optional CSV on `/series/`, downloadable CSV/XLSX/DTA/SQLite dump files on `/dump/...`
  - `CKAN Action API`: JSON
- Manually confirmed canonical route count: `15`

## Official usage notes
- The public portal homepage exposes two provider-owned machine surfaces that are still live in this run: the time-series API under `apis.datos.gob.ar/series/api` and the CKAN Action API under `datos.gob.ar/api/3/action`.
- The `Series de Tiempo` documentation link on the portal currently redirects to the official GitHub Pages documentation for the API.
- The portal's CKAN info page still documents `datastore_search`, but a live provider check returned `Solicitud incorrecta - Nombre de la acción desconocida: datastore_search`, so that route is excluded from the canonical count.
- The live CKAN `status_show` response reported `ckan_version: 2.7.6` and enabled extensions including `dcat`, `structured_data`, `gobar_theme`, and `seriestiempoarexplorer`.
- The time-series explorer page embeds `seriesApiUri: "https://apis.datos.gob.ar/series/api"` in its client configuration.

## Canonical endpoints confirmed from the official site and linked official docs

### Series API
1. `GET /series/api/series/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: return one or more time series with optional transformations and metadata
   - Key query parameters from the official reference:
     - `ids` - required comma-separated series ids, optionally suffixed with transformations like `:change` or `:sum`
     - `representation_mode` - `value`, `change`, `percent_change`, `percent_change_a_year_ago`, and additional documented modes
     - `collapse` - `day`, `week`, `month`, `quarter`, `semester`, `year`
     - `collapse_aggregation` - `avg`, `sum`, `end_of_period`, `min`, `max`
     - `limit` - positive integer, max `1000`, default `100`
     - `start` - zero-based offset, default `0`
     - `start_date`, `end_date` - ISO 8601 date/date-time filters
     - `format` - `json` or `csv`
     - `header` - `titles`, `ids`, `descriptions` for CSV headers
     - `sort` - `asc` or `desc`
     - `metadata` - `none`, `simple`, `full`, `only`
     - `decimal`, `sep`, `flatten`, `last`
   - Live confirmation:
     - `GET https://apis.datos.gob.ar/series/api/series/?ids=168.1_T_CAMBIOR_D_0_0_26&start_date=2018-07&limit=2` returned JSON with `data`, `count`, `meta`, and `params`

2. `GET /series/api/search/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: full-text and faceted search across available time series
   - Key query parameters from the official reference:
     - `q`
     - `dataset_theme`
     - `units`
     - `dataset_publisher_name`
     - `dataset_source`
     - `catalog_id`
     - `limit` - positive integer, max `1000`, default `10`
     - `start` - result offset, default `0`
     - `aggregations` - include facet counts in the response
     - `sort_by` - `relevance`, `hits_90_days`, `frequency`
     - `sort` - `asc` or `desc`
   - Live confirmation:
     - `GET https://apis.datos.gob.ar/series/api/search/?q=ipc&limit=2&aggregations` returned `data`, `count`, `limit`, `start`, and `aggregations`

3. `GET /series/api/search/dataset_theme/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: list valid `dataset_theme` filter values for `/search/`
   - Notes:
     - official search docs point to this auxiliary endpoint as the source of accepted filter values

4. `GET /series/api/search/field_units/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: list valid `units` filter values for `/search/`

5. `GET /series/api/search/dataset_publisher_name/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: list valid `dataset_publisher_name` filter values for `/search/`

6. `GET /series/api/search/dataset_source/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: list valid `dataset_source` filter values for `/search/`

7. `GET /series/api/search/catalog_id/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: list valid `catalog_id` filter values for `/search/`
   - Live confirmation:
     - `GET https://apis.datos.gob.ar/series/api/search/catalog_id/` returned a JSON `data` array including values such as `sspm`, `snic`, `obras`, `turismo`, `bcra`, and `energia`

8. `GET /series/api/dump/{dump}`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: download whole-database dump files
   - Path parameter:
     - `dump` - one of the documented filenames such as `series-tiempo-csv.zip`, `series-tiempo-valores-csv.zip`, `series-tiempo-metadatos.csv`, `series-tiempo-fuentes.csv`, `series-tiempo.xlsx`, `series-tiempo-valores.xlsx`, `series-tiempo-metadatos.xlsx`, `series-tiempo-fuentes.xlsx`, `series-tiempo-sqlite.zip`, `series-tiempo-valores-dta.zip`, `series-tiempo-metadatos.dta`, `series-tiempo-fuentes.dta`
   - Official notes:
     - the official dump docs say these files expose the full series database in CSV, XLSX, SQLite, and DTA variants

9. `GET /series/api/dump/{catalog}/{dump}`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: download dump files scoped to one source catalog
   - Path parameters:
     - `catalog` - catalog id such as `sspm`
     - `dump` - one of the documented dump filenames
   - Official notes:
     - the dump docs explicitly document catalog-scoped downloads and point users to `/series/api/search/catalog_id/` for valid catalog ids

10. `POST /series/api/validate/`
   - Base URL: `https://apis.datos.gob.ar`
   - Purpose: validate whether a source distribution is ready to be loaded by the time-series service
   - Request body parameters from the official docs:
     - `catalog_url` - required
     - `distribution_id` - required
     - `catalog_format` - optional, `json` or `xlsx`
   - Live confirmation:
     - a live `POST` with `{"catalog_url":"http://infra.datos.gob.ar/catalog/sspm/data.json","distribution_id":"192.1"}` returned `200` JSON with `found_issues: 0`

### CKAN Action API
11. `GET /api/3/action/status_show`
   - Base URL: `https://datos.gob.ar`
   - Purpose: return CKAN site configuration and enabled extensions
   - Live confirmation:
     - returned `ckan_version`, `site_url`, `locale_default`, and `extensions`

12. `GET /api/3/action/package_list`
   - Base URL: `https://datos.gob.ar`
   - Purpose: list dataset names
   - Official parameters from live `help_show`:
     - `limit` - optional page size
     - `offset` - optional offset when `limit` is used
   - Live confirmation:
     - `package_list?limit=2` returned dataset names including `aaip-reclamos-sobre-solicitudes-acceso-informacion-publica`

13. `GET /api/3/action/package_search`
   - Base URL: `https://datos.gob.ar`
   - Purpose: search datasets in the portal catalogue
   - Official parameters from live `help_show`:
     - `q`, `fq`, `sort`, `rows`, `start`
     - `facet`, `facet.mincount`, `facet.limit`, `facet.field`
     - `include_drafts`, `include_private`, `use_default_schema`
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, and dataset/resource metadata

14. `GET /api/3/action/package_show`
   - Base URL: `https://datos.gob.ar`
   - Purpose: return one dataset and its resource metadata
   - Official parameters from live `help_show`:
     - `id` - required dataset id or name
     - `use_default_schema`
     - `include_tracking`
     - `include_plugin_data`
   - Live confirmation:
     - `package_show?id=aaip-reclamos-sobre-solicitudes-acceso-informacion-publica` returned a full dataset record

15. `GET /api/3/action/help_show`
   - Base URL: `https://datos.gob.ar`
   - Purpose: return embedded help text for individual CKAN action methods
   - Query parameters:
     - `name` - required action name such as `package_search`, `package_show`, or `status_show`
   - Live confirmation:
     - `help_show?name=package_show` returned the official inline parameter documentation used above

## Pagination, filtering, and format notes
- For the Series API, `/series/` and `/search/` are offset-based via `limit` and `start`.
- The Series API docs cap `limit` at `1000` on both `/series/` and `/search/`.
- `/search/` can return aggregation buckets when the `aggregations` flag is present.
- `/series/` defaults to JSON and can emit CSV with `format=csv`; metadata inclusion is controlled separately through `metadata`.
- The dump docs document whole-catalog and per-catalog file downloads rather than paginated API payloads.
- For CKAN, `package_list` uses `limit` and `offset`, while `package_search` uses `rows` and `start` plus Solr-style filtering and faceting.
- CKAN responses use the usual JSON envelope with `help`, `success`, and `result`.

## Error, auth, and access notes
- The official Series API terms page publishes explicit per-IP usage quotas:
  - `60` requests per second
  - `2000` requests per minute
  - `40000` requests per hour
  - `200000` requests per day
- A live `GET https://apis.datos.gob.ar/series/api/series/?limit=1` returned HTTP `400` with `{"errors":[{"error":"No se especificó una serie de tiempo."}]}`, confirming the missing-`ids` error shape.
- The official `/validate` docs say missing or invalid parameters return HTTP `400`.
- A live `POST` to `/series/api/validate` without the trailing slash returned HTTP `405`; the reviewed working path in this run was `/series/api/validate/`.
- The Series API terms page says licensing follows the source publisher metadata and can be inspected in full metadata responses.
- No auth requirement was published or observed for the reviewed Series API routes.
- The CKAN info page still advertises `datastore_search`, but a live request returned HTTP `400` with `Nombre de la acción desconocida`, so clients should not assume DataStore is enabled on this portal.
- No portal-specific CKAN rate-limit policy was published on the reviewed `datos.gob.ar` pages.

## fireROUTE integration notes
- Treat `https://apis.datos.gob.ar/series/api` as the canonical base for Argentina's time-series service and `https://datos.gob.ar/api/3/action` as the canonical base for the public catalogue metadata service.
- Keep the Series API and CKAN Action API as separate upstream surfaces in any adapter design.
- Preserve the trailing slash behavior on `POST /series/api/validate/`; omitting it produced `405` in this run.
- Do not map `datastore_search` for this provider unless the portal re-enables it and the live route is revalidated.
- Respect the published Series API per-IP quotas when building retries or batch jobs.