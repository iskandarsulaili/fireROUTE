# Urban Observatory

## Provider metadata
- Category: `Open Data`
- Provider slug: `urban-observatory`
- Description: `Urban Observatory Sensor API v2 for public sensor metadata, readings, themes, and variables`
- Official docs/pages used:
  - `https://urbanobservatory.ac.uk/` (official portal; the site navigation links to the API section)
  - `https://urbanobservatory.ac.uk/api` (official API landing page)
  - `https://api.v2.urbanobservatory.ac.uk/docs/api` (official API docs page linked from the production portal bundle)
  - `https://api.v2.urbanobservatory.ac.uk/openapi.json` (official OpenAPI document loaded by the docs page)
- Public API base URL confirmed from the reviewed official pages: `https://api.v2.urbanobservatory.ac.uk`
- Auth model: no auth documented in the reviewed OpenAPI document; no security schemes were declared
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON for metadata and reading endpoints, CSV exports for `csv` routes, and zipped ESRI Shapefile output for `/sensors/shp`
- Rate limits: no numeric quota or rate-limit header contract was published in the reviewed portal or OpenAPI document
- Manually confirmed route count: `10`

## API shape and behavior
- The public portal is a JavaScript application, but its production bundle links directly to the official API docs host at `https://api.v2.urbanobservatory.ac.uk/docs/api`.
- The official docs page loads ReDoc from `/rd`, and that page points to `/openapi.json`.
- The reviewed API surface is a compact read-only sensor catalog and sensor-reading API.
- Pagination is implemented with `limit` and `offset` and returned in a documented `Pagination` object.
- Bounding-box filtering is consistently expressed with four WGS84 query parameters: `bbox_p1_x`, `bbox_p1_y`, `bbox_p2_x`, `bbox_p2_y`.

## Canonical endpoints
1. `GET /sensors/json`
   - Returns sensor locations and metadata as JSON.
2. `GET /sensors/page`
   - Returns pagination metadata for sensor datasets.
3. `GET /sensors/csv`
   - Downloads sensor locations as CSV.
4. `GET /sensors/shp`
   - Downloads sensor locations as an ESRI Shapefile ZIP.
5. `GET /sensors/data/json`
   - Returns sensor readings as JSON across multiple sensors.
6. `GET /sensors/data/csv`
   - Exports sensor readings as CSV across multiple sensors.
7. `GET /sensors/{sensor_name}/data/json`
   - Returns JSON readings for one named sensor.
8. `GET /sensors/{sensor_name}/data/csv`
   - Exports CSV readings for one named sensor.
9. `GET /variables/json/`
   - Lists available measurement variables.
10. `GET /themes/json/`
    - Lists available themes and their variables.

## Confirmed parameters
### Shared sensor-list parameters
These parameters are declared on `/sensors/json`, `/sensors/page`, `/sensors/csv`, and `/sensors/shp`:
- `limit` - optional integer, default `1000`; use `-1` to disable pagination.
- `offset` - optional integer, default `0`.
- `bbox_p1_x` - optional lower-left longitude in WGS84.
- `bbox_p1_y` - optional lower-left latitude in WGS84.
- `bbox_p2_x` - optional upper-right longitude in WGS84.
- `bbox_p2_y` - optional upper-right latitude in WGS84.

### Shared reading-query parameters
These parameters are declared on `/sensors/data/json`, `/sensors/data/csv`, `/sensors/{sensor_name}/data/json`, and `/sensors/{sensor_name}/data/csv`:
- `start` - optional UTC datetime.
- `end` - optional UTC datetime.
- `last_n_hours` - optional positive integer overriding the explicit time range.
- `last_n_days` - optional positive integer overriding the explicit time range.
- `variables` - optional string-array filter for measured variables.
- `limit` - optional integer, default `1000`; use `-1` to disable pagination.
- `offset` - optional integer, default `0`.

### Multi-sensor reading routes only
- `bbox_p1_x`, `bbox_p1_y`, `bbox_p2_x`, `bbox_p2_y` - optional spatial filter for `/sensors/data/json` and `/sensors/data/csv`.

### Path parameters
- `sensor_name` - required on sensor-specific reading routes.

## Response and pagination notes
- The OpenAPI document defines a reusable `PaginationMeta` object with:
  - `Total`
  - `Limit`
  - `Offset`
  - `Next`
  - `Previous`
- `/sensors/json` returns a `PaginatedSensorResponse` with `Sensors` plus `Pagination`.
- Reading routes return a `PaginatedSensorReadingResponse` with:
  - `Readings`
  - `Sensors` (sensor metadata keyed by `Sensor_Name`)
  - `Start`
  - `End`
  - `Pagination`
- `/variables/json/` returns a `VariableListResponse` and `/themes/json/` returns a `ThemeListResponse`.

## Format and schema notes
- The `Sensor` schema includes `Sensor_Name`, `Location_WKT`, centroid longitude/latitude, optional height fields, `Broker_Name`, and `Raw_ID`.
- The `SensorReading` schema includes `Sensor_Name`, `Variable`, `Value`, `Timestamp`, and `Flagged`.
- CSV routes are dedicated path variants rather than format-negotiated JSON routes.
- `/sensors/shp` is a dedicated shapefile-export route instead of a generic format parameter.

## Error notes
Documented response families on the reviewed OpenAPI document include:
- `200` - success
- `422` - validation error for malformed parameters

The shared validation schema is `HTTPValidationError`, containing `detail[]` entries referencing `ValidationError` objects.

## Important usage notes
- The API is currently served from a separate production host (`api.v2.urbanobservatory.ac.uk`) even though discovery begins from the main portal.
- Keep the trailing slash on `/variables/json/` and `/themes/json/` when mirroring official paths.
- The docs describe all datetime inputs/outputs as UTC.
- Because the API is already split into JSON, CSV, and SHP route families, fireROUTE should not collapse those into a single format parameter without preserving the original route shape.

## fireROUTE normalization notes
- Preserve the `api.v2` host and version prefix exactly.
- Keep sensor metadata, reading exports, and taxonomy lists as separate route families.
- Preserve `sensor_name` exactly as the path key for single-sensor routes.
- Preserve `limit=-1` semantics because the provider explicitly documents it as disabling pagination.
- Preserve the bounding-box parameter names verbatim; they are part of the provider contract rather than a generic geo filter abstraction.