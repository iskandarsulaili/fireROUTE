# GraphHopper

## Provider metadata
- Category: `Transportation`
- Provider slug: `graphhopper`
- Official docs used manually:
  - `https://docs.graphhopper.com/openapi`
  - `https://docs.graphhopper.com/openapi.md`
  - `https://docs.graphhopper.com/openapi/routing.md`
  - `https://docs.graphhopper.com/openapi/route-optimization.md`
  - `https://docs.graphhopper.com/openapi/matrices.md`
  - `https://docs.graphhopper.com/openapi/geocoding.md`
  - `https://docs.graphhopper.com/openapi/isochrones.md`
  - `https://docs.graphhopper.com/openapi/map-matching.md`
  - `https://docs.graphhopper.com/openapi/clustering.md`
  - `https://docs.graphhopper.com/openapi/custom-profiles.md`
  - operation pages under those sections, including `postroute.md`, `getroute.md`, `solvevrp.md`, `asyncvrp.md`, `getsolution.md`, `getmatrix.md`, `calculatematrix.md`, `getmatrixsolution.md`, `getgeocode.md`, `getisochrone.md`, `postgpx.md`, clustering operation pages, and custom-profile operation pages
- Base URL: `https://graphhopper.com/api/1`
- Primary response format: JSON
- Additional response formats noted in docs:
  - GeoJSON polygons for isochrones
  - optional `geojson`/`json` clustering response type
- Request-body formats noted in docs:
  - JSON for routing, matrix, VRP, clustering, and custom-profile creation
  - GPX file upload for map matching
- Auth model: API key passed as query parameter `key`
- Transport scope: routing, route optimization, matrix, geocoding, isochrones, map matching, clustering, and reusable custom routing profiles

## Rate limits and credit model
The main docs page documents plan-based credit limits and rate controls:

| Plan | Daily credits | Credits/min | Requests/sec | Max optimization vehicles | Max routing locations |
|---|---:|---:|---:|---:|---:|
| Free (non-commercial) | 500 | limited | limited | 1 | 5 |
| Basic | 5,000 | 100 | 1 | 2 | 30 |
| Standard | 15,000 | 400 | 2 | 10 | 80 |
| Premium | 50,000 | 1,000 | 10 | 20 | 200 |
| Custom | custom | custom | custom | up to 200 | up to 10,000 |

Additional official notes:
- Rate limiting is credit-based.
- Responses include `X-RateLimit-Remaining` and `X-RateLimit-Reset`.
- `429` means the rate/credit limit has been exhausted.
- Credit costs vary by endpoint family; examples are documented for Routing, Route Optimization, Matrix, Geocoding, Map Matching, Isochrone, and Cluster requests.

## Confirmed API surface
The official docs currently expose these 20 routes:
- `POST /vrp`
- `POST /vrp/optimize`
- `GET /vrp/solution/{jobId}`
- `POST /route`
- `GET /route`
- `POST /matrix`
- `GET /matrix`
- `POST /matrix/calculate`
- `GET /matrix/solution/{jobId}`
- `GET /geocode`
- `GET /isochrone`
- `POST /match`
- `POST /cluster`
- `POST /cluster/calculate`
- `GET /cluster/solution/{jobId}`
- `POST /profiles`
- `GET /profiles`
- `POST /profiles/calculate`
- `GET /profiles/solution/{jobId}`
- `DELETE /profiles/{profileId}`

## Common request and behavior notes
- Authentication is documented as query-parameter API-key auth on every route.
- The docs use `https://graphhopper.com/api/1/...` for all concrete examples.
- There is no classic page-number or cursor pagination documented for these APIs.
- Instead, long-running operations use async job submission plus polling:
  - `POST /vrp/optimize` -> `GET /vrp/solution/{jobId}`
  - `POST /matrix/calculate` -> `GET /matrix/solution/{jobId}`
  - `POST /cluster/calculate` -> `GET /cluster/solution/{jobId}`
  - `POST /profiles/calculate` -> `GET /profiles/solution/{jobId}`
- The route-optimization and clustering async docs recommend polling about every `500ms` until `status=finished`.
- Common response/error codes visible across the operation pages include `400`, `401`, `429`, and `500`; some polling endpoints also document `404` for invalid job IDs.
- Provider documentation repeatedly notes attribution/copyright fields in responses.

## 1) Route Optimization API

### 1.1 Solve a route optimization problem
- Method: `POST`
- Path: `/vrp`
- Full URL: `https://graphhopper.com/api/1/vrp`
- Purpose: solve a vehicle routing / traveling-salesman style optimization problem synchronously
- Best for: smaller optimization problems; the docs say jobs taking longer than about 10 seconds should use batch mode instead

Key documented request-body fields:
- `vehicles` - available vehicles
- `vehicles.vehicle_id` - unique vehicle ID
- `vehicles.type_id` - optional link to a declared vehicle type
- `vehicles.shifts` - shift array per vehicle
- `vehicles.shifts.start_address` / `end_address` - depot/start/end locations with `lon`, `lat`, optional `street_hint`, optional `curbside`
- `vehicles.shifts.earliest_start`, `latest_end` - timing constraints
- `vehicles.shifts.return_to_depot` - whether to return to depot/end location
- `vehicles.skills` - driver/vehicle skill tags
- `vehicles.max_distance`, `max_driving_time`, `max_jobs`, `min_jobs`, `max_activities`
- `vehicle_types` - reusable vehicle type definitions
- `vehicle_types.profile` - routing profile used by that type
- `vehicle_types.capacity` - multidimensional capacity array
- `vehicle_types.speed_factor`, `service_time_factor`
- `vehicle_types.cost_per_meter`, `cost_per_second`, `cost_per_activation`
- `vehicle_types.consider_traffic`
- `vehicle_types.network_data_provider` - `openstreetmap` or `tomtom`
- `services` - one-location jobs/stops
- `shipments` - pickup/delivery shipments
- `relations` - ordering / grouping constraints
- `objectives` - optimization objectives
- `configuration` - solver/routing settings

Key response notes:
- Returns the optimization solution directly in JSON.
- Solution payload includes totals such as distance, transport time, completion time, vehicles used, unassigned jobs, and per-route activities.

### 1.2 Submit a route optimization job
- Method: `POST`
- Path: `/vrp/optimize`
- Full URL: `https://graphhopper.com/api/1/vrp/optimize`
- Purpose: submit a long-running VRP job asynchronously
- Request body: same VRP problem schema documented for `POST /vrp`
- Response: JSON containing `job_id`
- Official usage note: prefer synchronous `POST /vrp` when possible; use batch mode for longer-running problems only

### 1.3 Retrieve solution of a route optimization job
- Method: `GET`
- Path: `/vrp/solution/{jobId}`
- Full URL pattern: `https://graphhopper.com/api/1/vrp/solution/{jobId}`
- Purpose: poll async VRP job status and fetch the finished solution

Path parameters:
- `jobId` - required job identifier returned by `POST /vrp/optimize`

Documented response status values:
- `waiting_in_queue`
- `processing`
- `finished`

Documented response fields include:
- `copyrights`
- `waiting_time_in_queue`
- `processing_time`
- `solution.distance`
- `solution.transport_time`
- `solution.max_operation_time`
- `solution.waiting_time`
- `solution.service_duration`
- `solution.completion_time`
- `solution.no_vehicles`
- `solution.no_unassigned`
- `solution.routes[]`
- `solution.routes.activities[]` with activity types such as `start`, `end`, `service`, `pickupShipment`, `deliverShipment`, `pickup`, `delivery`, and `break`

## 2) Routing API

### 2.1 Calculate a route with JSON body
- Method: `POST`
- Path: `/route`
- Full URL: `https://graphhopper.com/api/1/route`
- Purpose: compute a route with the richest customization options
- Official note: this is the recommended routing endpoint

Key documented request-body fields:
- `profile` - routing profile
- `points` - required coordinate list in `[lon, lat]` pairs; start and destination required, via points optional
- `point_hints` - street-name hints for snapping
- `snap_preventions` - avoid snapping to `motorway`, `trunk`, `bridge`, `ford`, `tunnel`, `ferry`
- `curbsides` - `any`, `right`, `left`
- `locale`
- `elevation`
- `details` - requested path-detail arrays such as `street_name`, `street_ref`, `toll`, `road_class`, `surface`, `bike_network`, etc.
- `optimize` - allows point reordering for >2 points
- `instructions`
- `calc_points`
- `debug`
- `points_encoded`
- `ch.disable` - required to use flexible mode / custom model and related options
- `custom_model` - speed/priority/distance_influence/areas customization
- `headings`, `heading_penalty`, `pass_through`
- `algorithm` - `round_trip` or `alternative_route`
- `round_trip.distance`, `round_trip.seed`
- `alternative_route.max_paths`, `alternative_route.max_weight_factor`, `alternative_route.max_share_factor`

Key response fields:
- `paths.distance`
- `paths.time`
- `paths.ascend`, `paths.descend`
- `paths.points`
- `paths.snapped_waypoints`
- `paths.points_encoded`
- `paths.bbox`
- `paths.instructions[]`
- `paths.details`
- `paths.points_order` when optimization reordered the inputs
- `info.copyrights`
- `info.took`

### 2.2 Calculate a route with query parameters
- Method: `GET`
- Path: `/route`
- Full URL: `https://graphhopper.com/api/1/route`
- Purpose: browser-friendly route calculation via query parameters

Key documented query parameters:
- `profile`
- repeated `point` - required; format `latitude,longitude`
- repeated `point_hint`
- repeated `snap_prevention`
- repeated `curbside`
- `locale`
- `elevation`
- repeated `details`
- `optimize`
- `instructions`
- `calc_points`
- `debug`
- `points_encoded`
- `ch.disable`
- repeated `heading`
- `heading_penalty`
- `pass_through`
- `algorithm`
- `round_trip.distance`
- `round_trip.seed`
- `alternative_route.max_paths`
- `alternative_route.max_weight_factor`
- `alternative_route.max_share_factor`

Important official limitation:
- The GET form is easier to test in a browser, but the docs warn about URL-length limits and state that `custom_model` cannot be used there.

## 3) Matrix API

### 3.1 Compute a matrix with JSON body
- Method: `POST`
- Path: `/matrix`
- Full URL: `https://graphhopper.com/api/1/matrix`
- Purpose: compute travel-time / distance / weight matrices between many origins and destinations

Official family notes:
- Supports full `N x N` and asymmetric matrices.
- Used for one-to-many, many-to-one, or many-to-many ETA/distance scenarios.
- The POST request is the JSON-body form of the matrix operation.

Core documented request concepts from the matrix docs:
- `profile`
- coordinate arrays equivalent to `point`, `from_point`, and `to_point`
- optional point hints / curbside controls
- `out_array` choosing `weights`, `times`, `distances`
- `fail_fast` to either fail immediately or return partial matrices with `null` values and hint metadata

Key response fields:
- `distances`
- `times`
- `weights`
- `info.copyrights`
- `info.took`
- `hints.message`
- `hints.details`
- `hints.invalid_from_points`
- `hints.invalid_to_points`
- `hints.point_pairs`

### 3.2 Compute a matrix with query parameters
- Method: `GET`
- Path: `/matrix`
- Full URL: `https://graphhopper.com/api/1/matrix`
- Purpose: compute a matrix through URL query parameters

Documented query parameters:
- `profile`
- repeated `point` - use for same origin/destination set; docs say specify at least three points and do not combine with `from_point`/`to_point`
- repeated `from_point`
- repeated `to_point`
- repeated `point_hint`
- repeated `from_point_hint`
- repeated `to_point_hint`
- repeated `snap_prevention`
- repeated `curbside`
- repeated `from_curbside`
- repeated `to_curbside`
- repeated `out_array` - `weights`, `times`, `distances`
- `fail_fast`

### 3.3 Submit a matrix computation job
- Method: `POST`
- Path: `/matrix/calculate`
- Full URL: `https://graphhopper.com/api/1/matrix/calculate`
- Purpose: async matrix job for large requests that would otherwise time out
- Request format: same matrix request format as the regular matrix endpoint
- Response: JSON with `job_id`
- Official note: prefer the regular matrix endpoints in most cases

### 3.4 Retrieve result of a matrix computation job
- Method: `GET`
- Path: `/matrix/solution/{jobId}`
- Full URL pattern: `https://graphhopper.com/api/1/matrix/solution/{jobId}`
- Purpose: poll async matrix job status and receive the matrix under `solution`

Path parameters:
- `jobId` - required job ID returned by `POST /matrix/calculate`

Documented response notes:
- `status` values documented: `processing`, `finished`
- response includes `solution.distances`, `solution.times`, `solution.weights`, `solution.info`, and `solution.hints`
- the async examples in the docs also show a waiting state before completion

## 4) Geocoding API

### 4.1 Geocoding / reverse geocoding
- Method: `GET`
- Path: `/geocode`
- Full URL: `https://graphhopper.com/api/1/geocode`
- Purpose: forward geocoding, reverse geocoding, and provider-selectable address lookup

Documented query parameters:
- `q` - textual address query for forward geocoding
- `locale`
- `limit`
- `reverse` - must be `true` for reverse geocoding
- `debug`
- `point` - bias point for forward search or target point for reverse lookup
- `provider` - provider selection / routing through GraphHopper geocoding backends

Provider-specific notes documented on the official page:
- `provider=default` supports prefix-search/autocomplete behavior and extra parameters like `osm_tag`, `location_bias_scale`, `zoom`, `bbox`, and reverse-search `radius`
- `provider=nominatim` is positioned for less-interactive or batch use and supports `countrycode` and `bounds`
- `provider=gisgraphy` supports `autocomplete`, `radius`, and `country`, but the docs say locale is not supported there
- GraphHopper notes that provider capabilities and supported fields can vary
- The docs explicitly warn that credit cost can differ by provider

## 5) Isochrone API

### 5.1 Compute an isochrone
- Method: `GET`
- Path: `/isochrone`
- Full URL: `https://graphhopper.com/api/1/isochrone`
- Purpose: compute travel-time or travel-distance reachable areas from a point

Documented query parameters:
- `point` - required start coordinate
- `time_limit` - seconds
- `distance_limit` - meters
- `profile`
- `buckets` - number of nested buckets/contours
- `reverse_flow` - flips reachability direction semantics

Response notes:
- Returns `polygons` in GeoJSON format.
- Each polygon includes a `properties.bucket` value.

## 6) Map Matching API

### 6.1 Map-match a GPX file
- Method: `POST`
- Path: `/match`
- Full URL: `https://graphhopper.com/api/1/match`
- Purpose: snap measured GPS/GPX tracks to the road network and enrich them with route data

Request format:
- GPX file in the HTTP request body

Documented query parameters:
- `gps_accuracy`
- `profile`
- `locale`
- `elevation`
- repeated `details`
- `instructions`
- `calc_points`
- `points_encoded`

Important official usage notes:
- Request cost depends on the number of GPS locations.
- Per-request location limits depend on the customer package.

## 7) Clustering API

### 7.1 Solve a clustering problem
- Method: `POST`
- Path: `/cluster`
- Full URL: `https://graphhopper.com/api/1/cluster`
- Purpose: solve a capacity clustering problem synchronously
- Official note: if a job takes longer than about 10 seconds and returns a bad-request timeout-style failure, use the async batch endpoint instead

Key documented request-body fields:
- `configuration.response_type` - `json` or `geojson`
- `configuration.routing.profile`
- `configuration.routing.cost_per_second`
- `configuration.routing.cost_per_meter`
- `configuration.clustering.num_clusters`
- `configuration.clustering.max_quantity`
- `configuration.clustering.min_quantity`
- `clusters[]` - optional explicit cluster definitions with center coordinates and quantity bounds
- `customers[]` - customer IDs, addresses, and `quantity`

Key response notes:
- JSON includes `status`, queue/processing times, and `clusters[]` with assigned customer IDs and cluster quantities.

### 7.2 Submit a clustering job
- Method: `POST`
- Path: `/cluster/calculate`
- Full URL: `https://graphhopper.com/api/1/cluster/calculate`
- Purpose: async clustering for longer-running jobs
- Request body: same schema as `POST /cluster`
- Response: JSON with `job_id`
- Official note: use the synchronous endpoint first and reserve this one for long-running jobs

### 7.3 Retrieve solution of a clustering job
- Method: `GET`
- Path: `/cluster/solution/{jobId}`
- Full URL pattern: `https://graphhopper.com/api/1/cluster/solution/{jobId}`
- Purpose: poll async clustering job status and retrieve cluster assignments

Path parameters:
- `jobId` - required async clustering job identifier

Documented response notes:
- status values: `waiting_in_queue`, `processing`, `finished`
- includes `clusters.quantity` and `clusters.ids`
- docs also show `404` for invalid `job_id`

## 8) Custom Profiles API

### 8.1 Create a custom routing profile
- Method: `POST`
- Path: `/profiles`
- Full URL: `https://graphhopper.com/api/1/profiles`
- Purpose: create a reusable custom routing profile for later use in routing, matrix, and optimization APIs

Documented request-body fields:
- `profile` - base built-in profile; docs list `foot`, `bike`, `ecargobike`, `car`, `small_truck`, `truck`, `scooter`
- `bounds` - bounding box limiting where the custom profile works
- `custom_model` - speed / priority / distance-influence / area rules

Response notes:
- returns the created profile definition and generated custom profile `id`
- docs say created IDs start with `cp_`

### 8.2 List your custom routing profiles
- Method: `GET`
- Path: `/profiles`
- Full URL: `https://graphhopper.com/api/1/profiles`
- Purpose: list existing custom profiles associated with the API key/account

Response fields include:
- `profile`
- `bounds.bbox`
- `custom_model`
- `id`

### 8.3 Submit a profile creation job
- Method: `POST`
- Path: `/profiles/calculate`
- Full URL: `https://graphhopper.com/api/1/profiles/calculate`
- Purpose: async custom-profile creation for large boundaries that would time out synchronously
- Request body: same as `POST /profiles`
- Response: JSON with `job_id`

### 8.4 Retrieve result of a profile creation job
- Method: `GET`
- Path: `/profiles/solution/{jobId}`
- Full URL pattern: `https://graphhopper.com/api/1/profiles/solution/{jobId}`
- Purpose: poll async custom-profile creation and retrieve the created profile under `solution`

Path parameters:
- `jobId` - required async profile job ID

Documented response notes:
- includes `solution.profile`, `solution.bounds`, `solution.custom_model`, `solution.id`
- documented `status` values: `processing`, `finished`

### 8.5 Delete a custom routing profile
- Method: `DELETE`
- Path: `/profiles/{profileId}`
- Full URL pattern: `https://graphhopper.com/api/1/profiles/{profileId}`
- Purpose: delete an existing custom profile

Path parameters:
- `profileId` - required custom profile ID, e.g. `cp_...`

Response notes:
- returns `status=success`

## Error and format notes
- The operation pages repeatedly document JSON error envelopes with fields like `message` and optional `hints`.
- Async endpoints use status-driven polling rather than paginated result sets.
- Matrix endpoints can return partial results when `fail_fast=false`, with `null` cells and hint metadata describing invalid points or disconnected point pairs.
- Clustering and route-optimization async polling endpoints expose queue/processing timing fields.
- Map-matching input is GPX, but output still follows the usual GraphHopper route-style JSON shape.

## Important usage notes from the official docs
- Prefer `POST /route` over `GET /route` for production usage because GET can hit URL-length limits and cannot use `custom_model`.
- Long-running synchronous requests should be moved to the relevant async job endpoints.
- Geocoding provider behavior and returned fields differ by provider; GraphHopper explicitly warns not every provider supports every field/parameter.
- Custom Profiles are documented as a premium-feature capability, and each profile is geographically limited to its configured bounds.
- The docs recommend reusing TLS sessions, enabling HTTP/2, and using gzip/compressed POST requests for large matrix/optimization submissions.
- Attribution/copyright handling is explicitly surfaced in many responses and should be preserved downstream.

## Canonical fireROUTE notes
- `key` query authentication should be treated as mandatory across the entire provider surface.
- The provider is broader than a simple directions API; it spans routing, ETA matrices, optimization, geocoding, and job-style async workloads.
- There is no generic pagination abstraction to map here; async job polling is the primary long-running access pattern.
- Custom profiles introduce account-scoped reusable profile IDs that can affect multiple other endpoints.
- `provider` selection on `/geocode` materially changes backend behavior and supported fields.

## Verification notes
This file was manually rebuilt from the live official GraphHopper documentation and per-operation markdown pages using browser tools, then rewritten from scratch for fireROUTE.