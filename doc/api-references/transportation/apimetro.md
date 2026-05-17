# Apimetro

## Provider metadata
- Category: `Transportation`
- Provider slug: `apimetro`
- Official docs used manually:
  - `https://apimetro.dev/`
  - `https://apimetro.dev/docs`
  - `https://apimetro.dev/swagger/index.html`
  - `https://apimetro.dev/swagger/doc.json`
- Base URL: `https://apimetro.dev/movilidad`
- Authentication:
  - The published Swagger document defines a `BasicAuth` security scheme.
  - No global or per-operation security requirement is declared in the inspected OpenAPI document.
  - A live anonymous browser fetch to `GET /movilidad/TODOS/linea` returned `200 application/json`, so read access is publicly reachable for at least the inspected GET route.
  - No official page in this pass documented a concrete credential-issuance flow for write operations.
- Primary response formats:
  - JSON for tabular/descriptive endpoints
  - GeoJSON `FeatureCollection` for `/mapas/*` endpoints
- Transportation scope: public-transport mobility data for Mexico City and the surrounding metropolitan area across Metro, Metrobús, Cablebús, RTP, Trolebús, Tren Ligero, Mexibús, Mexicable, Interurbano, Cable Car, and CETRAM-related geography

## Important official usage notes
- The official homepage describes Apimetro as a CDMX mobility API with `22,878` stations, `317` lines, `10` systems, and `2` output formats.
- The official docs page publishes two server targets:
  - cloud: `https://apimetro.dev/movilidad`
  - local: `http://localhost:8080/movilidad`
- The official docs page says all tabular data endpoints use a route variable `{sistema}` and normalize it to uppercase.
- Officially documented `{sistema}` values are `METRO`, `MB`, `CBB`, `RTP`, `TROLE`, `TL`, `MEXIBUS`, `MEXICABLE`, `INTERURBANO`, `CC`, and `TODOS`.
- The official docs page notes data-quality caveats:
  - `MB`, `MEXIBUS`, and `MEXICABLE` use non-official OSMAN MAPS data and may not reflect current operations exactly.
  - `TROLE` line 13 is marked as incomplete because the source GTFS lacks `stop_times` for that loop route.
  - The rest of the systems are described as sourced from SEMOVI GTFS data.

## Rate limits, pagination, and errors
- No numeric rate limit was published on the inspected homepage, docs page, or Swagger document.
- No pagination model is documented for the inspected endpoints; responses appear to return full result sets for the applied filters.
- The Swagger document repeatedly uses `400`, `404`, and `500` response codes for validation failures, not-found conditions, and server errors.
- No provider-wide structured error schema is documented beyond generic `object` responses for error cases.

## Confirmed API surface
The official docs currently expose 19 routes:
1. `GET /mapas/geojsonEstacion`
2. `GET /mapas/geojsonLinea`
3. `GET /mapas/geojsonPoligono`
4. `GET /{sistema}/descripcion-estacion`
5. `POST /{sistema}/descripcion-estacion`
6. `PUT /{sistema}/descripcion-estacion/{id}`
7. `DELETE /{sistema}/descripcion-estacion/{id}`
8. `GET /{sistema}/descripcion-linea`
9. `POST /{sistema}/descripcion-linea`
10. `PUT /{sistema}/descripcion-linea/{id}`
11. `DELETE /{sistema}/descripcion-linea/{id}`
12. `GET /{sistema}/estacion`
13. `POST /{sistema}/estacion`
14. `DELETE /{sistema}/estacion`
15. `PATCH /{sistema}/estacion`
16. `GET /{sistema}/linea`
17. `POST /{sistema}/linea`
18. `DELETE /{sistema}/linea`
19. `PATCH /{sistema}/linea`

## Common request and response notes
- `/mapas/*` routes return GeoJSON. The published `FeatureCollection` schema contains `type` plus a `features` array.
- Tabular endpoints return JSON arrays or generic JSON objects depending on the operation.
- The docs page presents the write routes as JSON-body CRUD operations.
- The published body models are:
  - `models.DescripcionEstacion`
  - `models.DescripcionLinea`
  - `models.Estacion`
  - `models.Linea`
- Key documented body fields include:
  - `models.DescripcionEstacion`: `estacion_id`, `nombre`, `tipo`, `alcaldia_municipio`, `anio`, `cve_est`, `longitud`
  - `models.DescripcionLinea`: `linea_base`, `terminal_original`, `inicio_original`, `tipo_linea`, `direccion`, `descripcion`
  - `models.Estacion`: `nombre`, `tipo`, `alcaldia_municipio`, `estado_ciudad`, `linea_id`, `sistema`, `existe`, `es_cetram`, `nombre_cetram`, coordinates
  - `models.Linea`: `nombre`, `num_comercial`, `sistema`, `tam_km`, `clasificacion`, `existe`, `geom`, `color_esp`, `color_en`, `derecho_de_via`, `jerarquia_transporte`

## 1) Station GeoJSON
- Method: `GET`
- Path: `/mapas/geojsonEstacion`
- Full URL: `https://apimetro.dev/movilidad/mapas/geojsonEstacion`
- Purpose: return station points as GeoJSON `FeatureCollection`

Documented query parameters:
- `sistema` - optional string transport system filter; Swagger says empty means all, docs page also shows comma-separated multi-system examples such as `METRO,MB`
- `num_comercial` - optional string line code filter
- `alcaldia_municipio` - optional string borough/municipality filter
- `nombre_ramal` - optional string branch name filter
- `jerarquia_transporte` - optional string hierarchy filter
- `derecho_de_via` - optional string right-of-way filter
- `es_cetram` - optional string/bool CETRAM filter
- `nombre_cetram` - optional string CETRAM name filter
- `cetram_real` - optional string spatial filter around a CETRAM

Documented responses:
- `200` - GeoJSON `FeatureCollection`
- `404` - no stations found for the supplied filters
- `500` - spatial-query server error

## 2) Line GeoJSON
- Method: `GET`
- Path: `/mapas/geojsonLinea`
- Full URL: `https://apimetro.dev/movilidad/mapas/geojsonLinea`
- Purpose: return transport-line geometries as GeoJSON `FeatureCollection`

Documented query parameters:
- `sistema` - optional system filter; docs page shows comma-separated multi-system usage
- `num_comercial` - optional line code
- `nombre_ramal` - optional branch/variant name
- `jerarquia_transporte` - optional hierarchy filter
- `derecho_de_via` - optional infrastructure/right-of-way filter
- `es_cetram` - optional CETRAM-related filter in Swagger
- `sentido` - optional direction filter
- `existe` - optional active/discontinued filter

Documented responses:
- `200` - GeoJSON `FeatureCollection`
- `404` - no line traces found
- `500` - spatial-query server error

## 3) Administrative polygon GeoJSON
- Method: `GET`
- Path: `/mapas/geojsonPoligono`
- Full URL: `https://apimetro.dev/movilidad/mapas/geojsonPoligono`
- Purpose: return administrative boundary polygons as GeoJSON

Documented query parameters:
- `entidad` - optional state/entity filter
- `nivel` - optional administrative level filter
- `nombre` - optional polygon name filter

Documented responses:
- `200` - GeoJSON `FeatureCollection`
- `500` - server error while executing the spatial query

## 4) List station descriptions
- Method: `GET`
- Path: `/{sistema}/descripcion-estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-estacion`
- Purpose: return descriptive or historical station-description records

Documented path/query parameters:
- `sistema` - required path string; Swagger lists `METRO`, `MB`, `CBB`, `RTP`, `TROLE`, `TL`, `MEXIBUS`, `MEXICABLE`, `INTERURBANO`, `CC`, `TODOS`
- `id` - optional query integer description-record ID
- `nombre` - optional query string station-name search
- `alcaldia_municipio` - optional query string borough/municipality filter
- `num_comercial` - optional query string line-code filter

Documented responses:
- `200` - array of station-description records
- `400` - invalid parameters
- `404` - no records found
- `500` - server error

## 5) Create station description
- Method: `POST`
- Path: `/{sistema}/descripcion-estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-estacion`
- Purpose: create a new station-description record tied to an existing station

Documented parameters/body:
- `sistema` - required path string
- request body - required `models.DescripcionEstacion`

Documented responses:
- `201` - record created
- `400` - invalid JSON or missing required fields

## 6) Replace station description
- Method: `PUT`
- Path: `/{sistema}/descripcion-estacion/{id}`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-estacion/10`
- Purpose: replace an existing station-description record

Documented parameters/body:
- `sistema` - required path string
- `id` - required path integer description-record ID
- request body - required `models.DescripcionEstacion`

Documented responses:
- `200` - record updated
- `400` - invalid ID or malformed JSON

## 7) Delete station description
- Method: `DELETE`
- Path: `/{sistema}/descripcion-estacion/{id}`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-estacion/10`
- Purpose: delete a station-description record by ID

Documented parameters:
- `sistema` - required path string
- `id` - required path integer description-record ID

Documented responses:
- `200` - record deleted
- `400` - invalid ID

## 8) List line descriptions
- Method: `GET`
- Path: `/{sistema}/descripcion-linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-linea`
- Purpose: return descriptive or historical line-description records

Documented path/query parameters:
- `sistema` - required path string; `TODOS` is also allowed
- `id` - optional query integer description-record ID
- `terminal_original` - optional query string terminal filter
- `linea_base` - optional query string/integer line-base filter
- `num_comercial` - optional query string visible line code

Documented responses:
- `200` - array of line-description records
- `400` - invalid parameters
- `404` - no records found
- `500` - server error

## 9) Create line description
- Method: `POST`
- Path: `/{sistema}/descripcion-linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-linea`
- Purpose: create a new line-description record

Documented parameters/body:
- `sistema` - required path string
- request body - required `models.DescripcionLinea`

Documented responses:
- `201` - record created
- `400` - invalid JSON or missing fields

## 10) Replace line description
- Method: `PUT`
- Path: `/{sistema}/descripcion-linea/{id}`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-linea/5`
- Purpose: replace a line-description record by ID

Documented parameters/body:
- `sistema` - required path string
- `id` - required path integer description-record ID
- request body - required `models.DescripcionLinea`

Documented responses:
- `200` - record updated
- `400` - invalid ID or malformed JSON

## 11) Delete line description
- Method: `DELETE`
- Path: `/{sistema}/descripcion-linea/{id}`
- Full URL example: `https://apimetro.dev/movilidad/METRO/descripcion-linea/5`
- Purpose: delete a line-description record

Documented parameters:
- `sistema` - required path string
- `id` - required path integer description-record ID

Documented responses:
- `200` - record deleted
- `400` - invalid ID

## 12) List stations
- Method: `GET`
- Path: `/{sistema}/estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/estacion`
- Purpose: list stations for one system or all systems as descriptive JSON

Documented path/query parameters:
- `sistema` - required path string; `TODOS` is also allowed
- `id` - optional query integer station ID
- `nombre` - optional query string station-name search
- `linea_id` - optional query integer parent line ID
- `alcaldia_municipio` - optional query string borough/municipality filter
- `num_comercial` - optional query string line code
- `color_esp` - optional query string line color in Spanish
- `color_en` - optional query string line color in English
- `anio` - optional query integer opening year
- `es_cetram` - optional query boolean CETRAM flag

Documented responses:
- `200` - array of stations
- `400` - invalid parameters
- `404` - no stations found
- `500` - server error

## 13) Create station
- Method: `POST`
- Path: `/{sistema}/estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/estacion`
- Purpose: create a station record

Documented parameters/body:
- `sistema` - required path string
- request body - required `models.Estacion`

Documented responses:
- `201` - station created
- `400` - invalid JSON or missing fields

## 14) Delete station
- Method: `DELETE`
- Path: `/{sistema}/estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/estacion?id=11974`
- Purpose: delete a station by internal ID

Documented parameters:
- `sistema` - required path string
- `id` - required query integer station ID

Documented responses:
- `200` - station deleted
- `400` - invalid or missing ID

## 15) Patch station
- Method: `PATCH`
- Path: `/{sistema}/estacion`
- Full URL example: `https://apimetro.dev/movilidad/METRO/estacion?id=11974`
- Purpose: update station fields by ID

Documented parameters/body:
- `sistema` - required path string
- `id` - required query integer station ID
- request body - required `models.Estacion`

Documented responses:
- `200` - station updated
- `400` - invalid ID or malformed JSON

## 16) List lines
- Method: `GET`
- Path: `/{sistema}/linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/linea`
- Purpose: list transport lines as descriptive JSON

Documented path/query parameters:
- `sistema` - required path string; `TODOS` is also allowed
- `id` - optional query integer line ID
- `nombre` - optional query string line-name search
- `num_comercial` - optional query string visible line code
- `nombre_ramal` - optional query string branch name
- `clasificacion` - optional query string such as `existente`, `eliminada`, or `futura` in Swagger, while the docs page examples also use `proyecto`
- `tam_km` - optional query string/number line length
- `existe` - optional query boolean active/discontinued filter
- `es_cetram` - optional query string CETRAM-related filter
- `sentido` - optional query string direction filter

Documented responses:
- `200` - array of lines
- `400` - invalid parameters
- `404` - no lines found
- `500` - server error

## 17) Create line
- Method: `POST`
- Path: `/{sistema}/linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/linea`
- Purpose: create a transport-line record

Documented parameters/body:
- `sistema` - required path string
- request body - required `models.Linea`

Documented responses:
- `201` - line created; Swagger returns a `models.Linea` schema for success
- `400` - invalid JSON or missing fields
- `500` - database/server error

## 18) Delete line
- Method: `DELETE`
- Path: `/{sistema}/linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/linea?id=301`
- Purpose: delete a line by ID; docs say the delete cascades to dependent branch and line-description records

Documented parameters:
- `sistema` - required path string
- `id` - required query integer line ID

Documented responses:
- `200` - line deleted
- `400` - invalid or missing ID
- `500` - database/server error

## 19) Patch line
- Method: `PATCH`
- Path: `/{sistema}/linea`
- Full URL example: `https://apimetro.dev/movilidad/METRO/linea?id=301`
- Purpose: partially update a line by ID

Documented parameters/body:
- `sistema` - required path string
- `id` - required query integer line ID
- request body - required object / line fields to update

Documented responses:
- `200` - line updated
- `400` - invalid ID or malformed JSON
- `500` - database/server error

## Sources inspected
- `https://apimetro.dev/`
- `https://apimetro.dev/docs`
- `https://apimetro.dev/swagger/index.html`
- `https://apimetro.dev/swagger/doc.json`
- live browser fetch of `https://apimetro.dev/movilidad/TODOS/linea`
