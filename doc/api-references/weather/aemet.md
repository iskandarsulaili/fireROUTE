# AEMET

## Provider metadata
- Category: `Weather`
- Provider slug: `aemet`
- Official docs/site used manually:
  - `https://opendata.aemet.es/centrodedescargas/inicio`
  - `https://opendata.aemet.es/dist/index.html`
  - OpenAPI spec link exposed by Swagger UI: `https://opendata.aemet.es/AEMET_OpenData_specification.json`
- Confirmed API base URL: `https://opendata.aemet.es/opendata`
- Authentication model: API key in header `api_key` (`apiKey` security scheme in the official OpenAPI document)
- Methods confirmed in the official spec: `GET` only
- Query parameters confirmed in the official spec: none
- Request bodies confirmed in the official spec: none
- Manually confirmed routes in this pass: `62`

## Auth and request model
- AEMET OpenData requires registering for an API key from the official OpenData portal.
- The Swagger UI explicitly instructs users to authorize with `api_key` before using `Try it out`.
- Every documented operation in the inspected OpenAPI spec is a `GET` request under the `/api/...` path tree on `https://opendata.aemet.es/opendata`.
- Parameters are carried through path segments, not query strings.

## Response model confirmed from the official schemas
Successful responses use the same JSON envelope schema:

```json
{
  "descripcion": "Éxito",
  "estado": 200,
  "datos": "https://...",
  "metadatos": "https://..."
}
```

Manual notes from the official schemas and Swagger UI:
- `datos` is a URL pointing to the actual dataset/document payload.
- `metadatos` is a metadata URL for the requested resource.
- The initial API response is therefore often a locator/envelope rather than the full data payload inline.
- Error schemas are also documented:
  - `401` -> `{ "descripcion": "Unauthorized", "estado": ... }`
  - `404` -> `{ "descripcion": "Not Found", "estado": ... }`
  - `429` -> `{ "descripcion": "Too Many Requests", "estado": ... }`

## Rate limits, pagination, and transport notes
- The inspected official spec documents `429 Too Many Requests`, confirming that service-side request limits exist.
- No numeric quota/rate-limit figure was exposed in the inspected Swagger UI or schema pages.
- No pagination parameters or pagination schema were documented in the official OpenAPI spec.
- The API is documented as JSON-first at the envelope layer, but many endpoints ultimately hand back file/document URLs through `datos`.

## Route families confirmed from the official OpenAPI reference
| Family tag | Routes | Representative official paths |
|---|---:|---|
| `predicciones-especificas` | 7 | `/api/prediccion/especifica/municipio/diaria/{municipio}`, `/api/prediccion/especifica/municipio/horaria/{municipio}`, `/api/prediccion/especifica/playa/{playa}`, `/api/prediccion/especifica/uvi/{dia}` |
| `observacion-convencional` | 3 | `/api/observacion/convencional/todas`, `/api/observacion/convencional/datos/estacion/{idema}`, `/api/observacion/convencional/mensajes/tipomensaje/{tipomensaje}` |
| `valores-climatologicos` | 7 | `/api/valores/climatologicos/diarios/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{idema}`, `/api/valores/climatologicos/inventarioestaciones/todasestaciones`, `/api/valores/climatologicos/normales/estacion/{idema}` |
| `informacion-satelite` | 2 | `/api/satelites/producto/nvdi`, `/api/satelites/producto/sst` |
| `mapas-y-graficos` | 2 | `/api/mapasygraficos/analisis`, `/api/mapasygraficos/mapassignificativos/fecha/{fecha}/{ambito}/{dia}` |
| `maestro` | 2 | `/api/maestro/municipio/{municipio}`, `/api/maestro/municipios` |
| `productos-climatologicos` | 3 | `/api/productos/climatologicos/balancehidrico/{anio}/{decena}`, `/api/productos/climatologicos/resumenclimatologico/nacional/{anio}/{mes}`, `/api/productos/climatologicos/capasshape/{tipoestacion}` |
| `prediccion-maritima` | 2 | `/api/prediccion/maritima/altamar/area/{area}`, `/api/prediccion/maritima/costera/costa/{costa}` |
| `redes-especiales` | 4 | `/api/red/especial/contaminacionfondo/estacion/{nombre_estacion}`, `/api/red/especial/ozono`, `/api/red/especial/perfilozono/estacion/{estacion}`, `/api/red/especial/radiacion` |
| `red-rayos` | 1 | `/api/red/rayos/mapa` |
| `indices-incendios` | 2 | `/api/incendios/mapasriesgo/estimado/area/{area}`, `/api/incendios/mapasriesgo/previsto/dia/{dia}/area/{area}` |
| `predicciones-normalizadas-texto` | 22 | `/api/prediccion/ccaa/hoy/{ccaa}`, `/api/prediccion/ccaa/manana/{ccaa}`, `/api/prediccion/nacional/tendencia`, `/api/prediccion/provincia/hoy/{provincia}` |
| `red-radares` | 2 | `/api/red/radar/nacional`, `/api/red/radar/regional/{radar}` |
| `avisos_cap` | 2 | `/api/avisos_cap/ultimoelaborado/area/{area}`, `/api/avisos_cap/archivo/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}` |
| `antartida` | 1 | `/api/antartida/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{identificacion}` |

## Detailed route notes by family
### 1) Specific forecasts (`predicciones-especificas`)
Confirmed routes:
- `GET /api/prediccion/especifica/montaña/pasada/area/{area}`
- `GET /api/prediccion/especifica/montaña/pasada/area/{area}/dia/{dia}`
- `GET /api/prediccion/especifica/nivologica/{area}`
- `GET /api/prediccion/especifica/municipio/diaria/{municipio}`
- `GET /api/prediccion/especifica/municipio/horaria/{municipio}`
- `GET /api/prediccion/especifica/playa/{playa}`
- `GET /api/prediccion/especifica/uvi/{dia}`

Notable parameter behavior confirmed in the spec:
- `municipio` is a municipality code; the Swagger description links to an INE code table.
- `dia` is reused in several resources as a coded day selector.
- `area` is used for mountain, snow, warning, and maritime/area-scoped resources.

### 2) Conventional observations (`observacion-convencional`)
Confirmed routes:
- `GET /api/observacion/convencional/todas`
- `GET /api/observacion/convencional/datos/estacion/{idema}`
- `GET /api/observacion/convencional/mensajes/tipomensaje/{tipomensaje}`

### 3) Climatology values (`valores-climatologicos`)
Confirmed routes:
- `GET /api/valores/climatologicos/diarios/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{idema}`
- `GET /api/valores/climatologicos/diarios/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/todasestaciones`
- `GET /api/valores/climatologicos/inventarioestaciones/estaciones/{estaciones}`
- `GET /api/valores/climatologicos/inventarioestaciones/todasestaciones`
- `GET /api/valores/climatologicos/mensualesanuales/datos/anioini/{anioIniStr}/aniofin/{anioFinStr}/estacion/{idema}`
- `GET /api/valores/climatologicos/normales/estacion/{idema}`
- `GET /api/valores/climatologicos/valoresextremos/parametro/{parametro}/estacion/{idema}`

Official parameter descriptions seen in Swagger UI include:
- `fechaIniStr` / `fechaFinStr` format: `AAAA-MM-DDTHH:MM:SSUTC`
- `idema`: climatological station indicator; some operations allow comma-separated station codes
- `anioIniStr` / `anioFinStr`: year bounds for annual/monthly climatology queries

### 4) Normalized text forecasts (`predicciones-normalizadas-texto`)
This is the largest family in the official spec with `22` confirmed routes, covering:
- autonomous-community forecasts: `hoy`, `manana`, `pasadomanana`, `medioplazo`
- national forecasts: `hoy`, `manana`, `pasadomanana`, `medioplazo`, `tendencia`
- province/island forecasts: `hoy`, `manana`
- current and archived variants using `/elaboracion/{fecha}`

Representative confirmed paths:
- `GET /api/prediccion/ccaa/hoy/{ccaa}`
- `GET /api/prediccion/ccaa/medioplazo/{ccaa}/elaboracion/{fecha}`
- `GET /api/prediccion/nacional/tendencia`
- `GET /api/prediccion/nacional/manana/elaboracion/{fecha}`
- `GET /api/prediccion/provincia/hoy/{provincia}`
- `GET /api/prediccion/provincia/manana/{provincia}/elaboracion/{fecha}`

Swagger parameter descriptions provide code tables for values such as:
- `ccaa` -> autonomous community code (`and`, `arn`, `ast`, `bal`, `cat`, `mad`, etc.)
- `ambito` -> spatial scope code (`esp` for Spain plus regional codes)
- `fecha` -> elaboration date in `AAAA-MM-DD`

### 5) Maps, satellite, radar, lightning, and fire risk
Confirmed operational/media-style routes include:
- `GET /api/mapasygraficos/analisis`
- `GET /api/mapasygraficos/mapassignificativos/fecha/{fecha}/{ambito}/{dia}`
- `GET /api/satelites/producto/nvdi`
- `GET /api/satelites/producto/sst`
- `GET /api/red/radar/nacional`
- `GET /api/red/radar/regional/{radar}`
- `GET /api/red/rayos/mapa`
- `GET /api/incendios/mapasriesgo/estimado/area/{area}`
- `GET /api/incendios/mapasriesgo/previsto/dia/{dia}/area/{area}`

These endpoints are especially important for fireROUTE because the documented envelope may point to rendered products, images, or derived files rather than ordinary tabular JSON payloads.

### 6) Maritime, alerts, special networks, Antarctica, and catalog data
Additional confirmed families:
- maritime forecast: `/api/prediccion/maritima/altamar/area/{area}`, `/api/prediccion/maritima/costera/costa/{costa}`
- CAP alerts: `/api/avisos_cap/ultimoelaborado/area/{area}`, `/api/avisos_cap/archivo/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}`
- special networks: ozone, ozone profile, radiation, background pollution
- Antarctica observations: `/api/antartida/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{identificacion}`
- catalog/master data: `/api/maestro/municipio/{municipio}`, `/api/maestro/municipios`
- climatology products/documents: water balance, monthly climate summary, SHAPE layers

## Common path parameters confirmed in the official spec
The OpenAPI document uses many coded path parameters instead of free-form location queries. Confirmed parameter names include:
- `municipio`
- `provincia`
- `ccaa`
- `area`
- `costa`
- `playa`
- `idema`
- `estaciones`
- `estacion`
- `identificacion`
- `tipomensaje`
- `parametro`
- `radar`
- `tipoestacion`
- `fecha`, `fechaIniStr`, `fechaFinStr`
- `anio`, `anioIniStr`, `anioFinStr`, `mes`, `decena`
- `ambito`, `dia`

## Important fireROUTE notes
- The official docs are live and usable through Swagger UI; this provider is no longer blocker-only.
- Do not model AEMET as a simple single-shot JSON weather API. The documented success schema often returns a `datos` URL that must be fetched separately.
- Because the official spec contains only path parameters and no query parameters, route construction should be code-driven and validated carefully.
- The documentation text and many parameter descriptions are in Spanish, including embedded code tables for regions and other identifiers.
- For forecast normalization, `municipio`, `provincia`, `ccaa`, and `area` are coded identifiers, not arbitrary names.

## Verification notes
This file was manually rebuilt from AEMET's official OpenData landing page and live Swagger/OpenAPI reference after confirming that the previously blocked route inventory is now accessible in the browser environment.