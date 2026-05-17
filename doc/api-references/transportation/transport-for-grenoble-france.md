# Transport for Grenoble, France

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-grenoble-france`
- Official docs used manually:
  - `https://www.mobilites-m.fr/pages/opendata/OpenDataApi.html`
- Base URL confirmed from the official docs page:
  - `http://data.mobilites-m.fr/api`
- Authentication:
  - no API key, OAuth flow, login wall, or cookie-gated auth requirement was documented on the inspected official API page
- Primary response / payload formats:
  - `json` responses, with the page stating that geographic datasets use `geojson`
  - `csv` and `xls` exports for point datasets
  - encoded polyline responses on the `poly` routes
- Transport scope documented here:
  - Grenoble mobility reference data, line geometry, road-segment status, timetable lookups, stop-time lookups, and dynamic data routes documented on the official `M` OpenData page

## Important official usage notes
- The docs say the API powers a large part of the official `M` transport site for Grenoble Métropole.
- The docs say all geographic coordinates are GPS coordinates in `WGS 84`.
- The docs say point datasets are available as `json`, `csv`, or `xls` from the `bbox` route family.
- For the geometry-heavy routes, the page says:
  - when the URL ends with `json`, the `geometry` field is populated
  - otherwise the `shape` field contains encoded polylines compatible with Google's polyline algorithm
- The `Horaires OTP` section links generic external OpenTripPlanner docs for theoretical timetable access, but the Grenoble page itself only exposes the provider-specific route patterns listed below; those external generic OTP operations are not counted here as confirmed Grenoble-specific fireROUTE routes.

## Rate limits, pagination, and errors
- No public numeric rate limit or quota section was exposed on the inspected official page.
- No pagination parameters or cursor mechanics were documented on the inspected routes.
- No structured provider-specific error schema was documented on the inspected page.

## Confirmed API surface
The official page exposes 12 route patterns:
1. `GET /bbox/{format}`
2. `GET /findType/json`
3. `GET /lines/json`
4. `GET /lines/poly`
5. `GET /linesNear/json`
6. `GET /troncons/json`
7. `GET /troncons/poly`
8. `GET /ficheHoraires/json`
9. `GET /routers/default/index/routes`
10. `GET /routers/default/index/clusters/{network}:{cluster}/stoptimes`
11. `GET /routers/default/index/stops/{network}:{stop_id}/stoptimes`
12. `GET /dyn/{type}/json`

## 1) Query point datasets in a bounding box or by type
- Method: `GET`
- Path: `/bbox/{format}`
- Full URL pattern: `http://data.mobilites-m.fr/api/bbox/{json|xls|csv}`
- Purpose: return point-based reference objects such as stops, places, parking, or bike facilities

Documented parameters:
- `format` - one of `json`, `xls`, or `csv`
- `types` - object type or comma-separated list of object types
- `xmin` - minimum longitude for rectangle filtering
- `xmax` - maximum longitude for rectangle filtering
- `ymin` - minimum latitude for rectangle filtering
- `ymax` - maximum latitude for rectangle filtering

Documented response notes:
- The docs say point datasets are available in JSON, CSV, and XLS forms
- Geographic coordinates are documented as `WGS 84`

## 2) Search reference objects by type and free text
- Method: `GET`
- Path: `/findType/json`
- Full URL: `http://data.mobilites-m.fr/api/findType/json`
- Purpose: search for typed reference objects such as stops matching a query string

Documented parameters:
- `types` - target object type
- `query` - text to search

Documented response notes:
- JSON response is documented

## 3) Get line geometry as JSON
- Method: `GET`
- Path: `/lines/json`
- Full URL: `http://data.mobilites-m.fr/api/lines/json`
- Purpose: return transport-line descriptions and geometry

Documented parameters:
- `types` - documented example uses `ligne`
- `codes` - line code filter such as `SEM_C1`

Documented response notes:
- The docs say the `geometry` field is populated when the route ends in `json`

## 4) Get line geometry as encoded polyline data
- Method: `GET`
- Path: `/lines/poly`
- Full URL: `http://data.mobilites-m.fr/api/lines/poly`
- Purpose: return line geometry in encoded-polyline form

Documented parameters:
- `types` - documented example uses `ligne`
- `codes` - line code filter such as `SEM_C1`

Documented response notes:
- The docs say non-JSON geometry responses use a `shape` field containing encoded polylines

## 5) Find lines near a point
- Method: `GET`
- Path: `/linesNear/json`
- Full URL: `http://data.mobilites-m.fr/api/linesNear/json`
- Purpose: list transport lines near a geographic point within a given radius

Documented parameters:
- `x` - longitude
- `y` - latitude
- `dist` - radius distance
- `details` - boolean detail flag

Documented response notes:
- JSON response is documented
- The official example uses a `400m` search radius

## 6) Get road-segment descriptions and service levels as JSON
- Method: `GET`
- Path: `/troncons/json`
- Full URL: `http://data.mobilites-m.fr/api/troncons/json`
- Purpose: return road-segment geometry and traffic service-level data

Documented parameters:
- `niveau` - zoom/service-level grouping value

Documented response notes:
- The page says road-segment service levels are updated in real time for the `traficolor` feature
- The docs say the `geometry` field is populated on the JSON route

## 7) Get road-segment geometry as encoded polylines
- Method: `GET`
- Path: `/troncons/poly`
- Full URL: `http://data.mobilites-m.fr/api/troncons/poly`
- Purpose: return road-segment geometry in encoded-polyline form

Documented parameters:
- `niveau` - zoom/service-level grouping value

Documented response notes:
- The docs say non-JSON geometry responses use a `shape` field containing encoded polylines

## 8) Get a timetable sheet for a route and time
- Method: `GET`
- Path: `/ficheHoraires/json`
- Full URL: `http://data.mobilites-m.fr/api/ficheHoraires/json`
- Purpose: return a route timetable sheet for a given route and timestamp

Documented parameters:
- `route` - route identifier; the docs show network prefixes such as `SEM`, `C38`, and `SNC`
- `time` - timestamp value

Documented response notes:
- JSON response is documented
- The official example warns that the sample timetable may not remain available later

## 9) List routes in the OTP-backed index
- Method: `GET`
- Path: `/routers/default/index/routes`
- Full URL: `http://data.mobilites-m.fr/api/routers/default/index/routes`
- Purpose: list transport routes known to the default router index

Documented parameters:
- `codes` - optional route code filter such as `SEM:12`

Documented response notes:
- JSON response is documented by example on the official page

## 10) Get stop-times for a cluster / stop area
- Method: `GET`
- Path: `/routers/default/index/clusters/{network}:{cluster}/stoptimes`
- Full URL pattern: `http://data.mobilites-m.fr/api/routers/default/index/clusters/{network}:{cluster}/stoptimes`
- Purpose: return stop-times for a stop cluster / zone d'arrêt

Documented parameters:
- `network` - documented examples include `SEM` and `C38`
- `cluster` - cluster identifier such as `GENCONDORCE`

Documented response notes:
- The official example describes this as returning TAG and Transisère timetable data for the cluster `Condorcet`

## 11) Get stop-times for an individual stop
- Method: `GET`
- Path: `/routers/default/index/stops/{network}:{stop_id}/stoptimes`
- Full URL pattern: `http://data.mobilites-m.fr/api/routers/default/index/stops/{network}:{stop_id}/stoptimes`
- Purpose: return stop-times for a specific stop

Documented parameters:
- `network` - documented examples include `SEM` and `C38`
- `stop_id` - stop identifier such as `3207`

Documented response notes:
- The official example describes this as returning timetable data for the `Condorcet` stop

## 12) Get dynamic data for an object family
- Method: `GET`
- Path: `/dyn/{type}/json`
- Full URL pattern: `http://data.mobilites-m.fr/api/dyn/{type}/json`
- Purpose: return dynamic / realtime data for a documented object family

Documented parameters:
- `type` - dynamic object family identifier; the official example uses `trr` for road traffic segments

Documented response notes:
- The official example `GET /dyn/trr/json` is described as returning realtime service levels for road segments

## Sources inspected
- `https://www.mobilites-m.fr/pages/opendata/OpenDataApi.html`
