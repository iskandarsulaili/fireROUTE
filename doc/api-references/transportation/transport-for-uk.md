# Transport for UK

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-uk`
- Official docs used manually:
  - `https://developer.transportapi.com/docs`
  - `https://docs.transportapi.com/openapi/transportapi.yaml`
- Base URL: `https://transportapi.com`
- Authentication:
  - query parameters `app_id` + `app_key`
  - headers `X-App-Id` + `X-App-Key`
  - HTTP Basic auth with `app_id` as username and `app_key` as password
- Primary response formats seen in official docs:
  - JSON for all documented `/v3/uk/...` routes
  - XML request and XML response for `POST /nextbuses`
- Transport scope: UK public journey planning, bus service metadata, bus timetables and disruptions, bus fares and performance analytics, rail timetables and historical performance, and place lookup/geocoding

## Important official usage notes
- The docs say the `places` endpoint is the canonical way to discover bus stops, train stations, postcodes, POIs, towns, and other journey-planning locations before calling other routes.
- The docs distinguish operator and place reference systems: UK bus operators use NOC-style operator codes, while rail operators and stations use TOC / CRS / TIPLOC-style references.
- Journey-planning locations use `scheme:value` references such as `lonlat:-0.13182,51.52788`, `postcode:EC2A+4JE`, `crs:SOT`, and `atcocode:490000077E`.
- The docs describe temporal parameters with ISO 8601 semantics, including full datetimes and offset windows via `from_offset` / `to_offset`.
- Several bus-performance endpoints explicitly note a tariff of `1 hit per API request`, but the inspected public docs do not publish a provider-wide numeric quota table.

## Rate limits, pagination, and errors
- No provider-wide numeric rate limit was published in the inspected public docs.
- The official OpenAPI responses do document `403` cases where a valid 3scale application plan has exceeded its usage limits.
- Pagination is route-specific rather than provider-wide. Collection routes such as bus services, bus situations, historical journeys, and places expose `page` and/or `limit` query parameters.
- Common error codes across the spec include:
  - `400` bad request
  - `401` missing or invalid credentials
  - `403` plan or permission failure, including usage-limit exhaustion
  - `404` resource not found on many singular routes
  - `422` semantic / validation problems
  - `502` and `503` on some upstream-backed journey and rail routes
- `POST /nextbuses` is the outlier: it documents XML responses rather than JSON.

## Confirmed API surface
The official docs currently expose 25 routes:
1. `GET /v3/uk/public_journey.json`
2. `GET /v3/uk/car/journey/from/{from}/to/{to}.json`
3. `GET /v3/uk/cycle/journey/from/{from}/to/{to}.json`
4. `GET /v3/uk/bus/services/{id}.json`
5. `GET /v3/uk/bus/services.json`
6. `POST /v3/uk/bus/services.json`
7. `GET /v3/uk/bus/route/{operator}/{line}/{direction}/{stop_of_interest}/{date}/{time}/timetable.json`
8. `GET /v3/uk/bus/service_timetables.json`
9. `GET /v3/uk/bus/stops.json`
10. `GET /v3/uk/bus/stop_timetables/{id}.json`
11. `GET /v3/uk/bus/edges/{id}.json`
12. `GET /v3/uk/bus/edges.json`
13. `GET /v3/uk/bus/situations/{id}.json`
14. `GET /v3/uk/bus/situations.json`
15. `POST /nextbuses`
16. `GET /v3/uk/bus/fares.json`
17. `GET /v3/uk/bus/actual_journeys/{id}.json`
18. `GET /v3/uk/bus/actual_journeys.json`
19. `GET /v3/uk/bus/corridor/{id}.json`
20. `GET /v3/uk/train/station_timetables/{id}.json`
21. `GET /v3/uk/train/service_timetables/{service}.json`
22. `GET /v3/uk/train/station_actual_journeys/{station}.json`
23. `GET /v3/uk/train/actual_journeys/{rid}.json`
24. `GET /v3/uk/train/actual_journeys.json`
25. `GET /v3/uk/places.json`

## Route-by-route notes

### Journey planning

#### 1) Public transport journey planner
- Method: `GET`
- Path: `/v3/uk/public_journey.json`
- Purpose: multimodal public-transport journey planning between two discovered places
- Required params: `from`, `to`
- Notable optional params: `date`, `time`, `journey_time_type`, `service`, `modes`, `not_modes`, `situations`
- Response / errors: `200` JSON, plus `400`, `401`, `403`, `422`, `502`

#### 2) Car journey planner
- Method: `GET`
- Path: `/v3/uk/car/journey/from/{from}/to/{to}.json`
- Purpose: road journey planning between two locations
- Required path params: `from`, `to`
- Notable optional params: `distance_desc_system`, `taxicode`
- Response / errors: `200` JSON, plus `400`, `401`, `403`, `404`, `422`

#### 3) Cycle journey planner
- Method: `GET`
- Path: `/v3/uk/cycle/journey/from/{from}/to/{to}.json`
- Purpose: cycling journey planning between two locations
- Required path params: `from`, `to`
- Notable optional params: `distance_desc_system`, `cycle_speed`
- Response / errors: `200` JSON, plus `400`, `401`, `403`, `404`, `422`

### Bus information and realtime

#### 4) Bus service by ID
- Method: `GET`
- Path: `/v3/uk/bus/services/{id}.json`
- Purpose: retrieve one bus service overview
- Required path params: `id` (`operator:line`-style service identifier per docs)
- Notable optional params: `edges`, `stops`, `journey_patterns`, `situations`
- Response / errors: `200`, `400`, `401`, `403`, `404`

#### 5) Bus services collection
- Method: `GET`
- Path: `/v3/uk/bus/services.json`
- Purpose: search and filter bus services
- Notable filters: `operator`, `line_name`, `edges`, `stops`, `journey_patterns`, `min_lat`, `min_lon`, `max_lat`, `max_lon`, `lat`, `lon`, `page`, `limit`, `situations`
- Response / errors: `200`, `400`, `401`, `403`

#### 6) Bus services collection by JSON body
- Method: `POST`
- Path: `/v3/uk/bus/services.json`
- Purpose: body-based variant of the bus-services collection query
- Request body: `application/json`
- Response / errors: `200`, `400`, `401`, `403`

#### 7) Specific bus departure timetable by full route context
- Method: `GET`
- Path: `/v3/uk/bus/route/{operator}/{line}/{direction}/{stop_of_interest}/{date}/{time}/timetable.json`
- Purpose: retrieve one concrete scheduled bus run across its route
- Required path params: `operator`, `line`
- Additional path params used by the canonical route: `direction`, `stop_of_interest`, `date`, `time`
- Notable optional params: `stops`, `edges`, `situations`
- Special behavior: the docs explicitly mention `302` redirects to the endpoint in fully discovered form
- Response / errors: `200`, `302`, `400`, `401`, `403`, `404`, `422`

#### 8) Bus service timetables collection
- Method: `GET`
- Path: `/v3/uk/bus/service_timetables.json`
- Purpose: retrieve scheduled and optionally live bus journeys
- Notable filters: `operator`, `service`, `direction`, `edges`, `source_config`, `live`, `active`, `stops`, `stop_of_interest`, `calling_at`, `date`, `time`, `situations`
- Response / errors: `200`, `400`, `401`, `403`, `501`

#### 9) Bus stops collection / performance analytics
- Method: `GET`
- Path: `/v3/uk/bus/stops.json`
- Purpose: return stop-centric performance / occupancy / dwell metrics
- Notable filters: `ids`, `aggregate_dwell_times`, `aggregate_occupancy`, `aggregate_punctuality`, `operators`, `services`, `directions`, `weekdays`, `daily_start_time`, `daily_end_time`, `start_datetime`, `end_datetime`, `percentiles`, `min_lat`, `min_lon`, `max_lat`, `max_lon`
- Response / errors: `200`, `400`, `401`, `403`

#### 10) Stop timetable by ATCO code
- Method: `GET`
- Path: `/v3/uk/bus/stop_timetables/{id}.json`
- Purpose: departures at one stop, optionally augmented with realtime data
- Required path params: `id` (ATCO code)
- Notable optional params: `datetime`, `from_offset`, `to_offset`, `limit`, `live`, `source_config`, `situations`
- Response / errors: `200`, `400`, `401`, `403`, `404`

#### 11) Bus edge by ID
- Method: `GET`
- Path: `/v3/uk/bus/edges/{id}.json`
- Purpose: return one network edge and its geometry between origin and destination stops
- Required path params: `id`
- Response / errors: `200`, `400`, `401`, `403`, `404`

#### 12) Bus edges collection
- Method: `GET`
- Path: `/v3/uk/bus/edges.json`
- Purpose: search bus edges and optionally include aggregate traversal / occupancy / punctuality metrics
- Notable filters: `stop`, `origin`, `destination`, `location`, `ids`, bounding box params, `aggregate_traversal_times`, `aggregate_occupancy`, `aggregate_punctuality`, `percentiles`, `weekdays`, `daily_start_time`, `daily_end_time`, `start_datetime`, `end_datetime`, `operators`, `services`, `directions`
- Response / errors: `200`, `400`, `401`, `403`, `422`

#### 13) Bus disruption situation by ID
- Method: `GET`
- Path: `/v3/uk/bus/situations/{id}.json`
- Purpose: retrieve one disruption situation
- Required path params: `id`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`

#### 14) Bus disruption situations collection
- Method: `GET`
- Path: `/v3/uk/bus/situations.json`
- Purpose: search disruption situations across dates, participants, stops, operators, and services
- Notable filters: `date`, `participant_ref`, `atcocodes`, `operators`, `services`, `limit`, `page`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`

#### 15) SIRI Stop Monitoring / NextBuses
- Method: `POST`
- Path: `/nextbuses`
- Purpose: submit a SIRI-SM stop-monitoring request for realtime arrivals / departures
- Request body: `application/xml`
- Response format: `application/xml`
- Response / errors: `200`, `400`, `401`, `403`

#### 16) Bus fares
- Method: `GET`
- Path: `/v3/uk/bus/fares.json`
- Purpose: fare lookup between two stops
- Required params: `from`, `to`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`

### Bus performance / historical analytics

#### 17) Historical bus journey by ID
- Method: `GET`
- Path: `/v3/uk/bus/actual_journeys/{id}.json`
- Purpose: retrieve one observed historical bus journey
- Required path params: `id`
- Response / errors: `200`, `400`, `401`, `403`, `404`

#### 18) Historical bus journeys collection
- Method: `GET`
- Path: `/v3/uk/bus/actual_journeys.json`
- Purpose: query historical bus journeys over a time window
- Notable filters: `operator`, `service`, `direction`, `weekdays`, `daily_start_time`, `daily_end_time`, `start_datetime`, `end_datetime`, `page`, `limit`
- Response / errors: `200`, `400`, `401`, `403`

#### 19) Bus corridor by ID
- Method: `GET`
- Path: `/v3/uk/bus/corridor/{id}.json`
- Purpose: corridor-level performance and geometry across multiple stops and edges
- Required path params: `id`
- Notable optional params: `aggregate_traversal_times`, `percentiles`, `operators`, `services`, `directions`, `weekdays`, `daily_start_time`, `daily_end_time`, `start_datetime`, `end_datetime`, `edges`, `stops`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`

### Rail information and performance

#### 20) Train station timetable
- Method: `GET`
- Path: `/v3/uk/train/station_timetables/{id}.json`
- Purpose: departures / arrivals / pass events for one station, optionally live-augmented
- Required path params: `id` (CRS or TIPLOC)
- Notable optional params: `datetime`, `from_offset`, `to_offset`, `limit`, `live`, `source_config`, `train_status`, `station_detail`, `type`, `origin`, `destination`, `called_at`, `calling_at`, `operator`, `service`, `source_detail`
- Response / errors: `200`, `400`, `401`, `403`, `422`, `502`, `503`

#### 21) Train service timetable
- Method: `GET`
- Path: `/v3/uk/train/service_timetables/{service}.json`
- Purpose: full timetable for one train service
- Required path params: `service`
- Notable optional params: `source_config`, `live`, `type`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`, `502`, `503`

#### 22) Station historical journeys
- Method: `GET`
- Path: `/v3/uk/train/station_actual_journeys/{station}.json`
- Purpose: historical train journeys observed at one station
- Required path params: `station`
- Required query params: `datetime`
- Notable optional params: `from_offset`, `to_offset`, `type`, `origin`, `destination`, `called_at`, `operator`, `expected`, `limit`, `page`
- Response / errors: `200`, `400`, `401`, `403`, `422`

#### 23) Historical train journey by RID
- Method: `GET`
- Path: `/v3/uk/train/actual_journeys/{rid}.json`
- Purpose: return one historical train service with route-wide timing details
- Required path params: `rid`
- Notable optional params: `datetime`, `expected`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`

#### 24) Historical train journeys collection
- Method: `GET`
- Path: `/v3/uk/train/actual_journeys.json`
- Purpose: query multiple historical train journeys by time window or identifiers
- Notable filters: `datetime`, `from_offset`, `to_offset`, `operator`, `expected`, `date`, `train_uid`, `headcode`, `retail_service_identifier`, `limit`, `page`
- Response / errors: `200`, `400`, `401`, `403`, `422`

### Places / lookup

#### 25) Place lookup
- Method: `GET`
- Path: `/v3/uk/places.json`
- Purpose: text search, geocoding, reverse-ish lookup, and transport-place discovery
- Notable filters: `query`, `type`, `lat`, `lon`, bounding box params, `bus_service`, `page`, `limit`
- Response / errors: `200`, `400`, `401`, `403`, `404`, `422`, `502`, `503`

## Sources inspected
- `https://developer.transportapi.com/docs`
- `https://docs.transportapi.com/openapi/transportapi.yaml`
