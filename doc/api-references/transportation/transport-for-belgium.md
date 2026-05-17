# Transport for Belgium

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-belgium`
- Official docs used manually:
  - `https://docs.irail.be/`
  - section anchors on the same official reference page, including `#stations-stations-api-get`, `#liveboard-liveboard-api-get`, `#connections-connections-api-get`, `#vehicle-vehicle-api-get`, `#composition-composition-api-get`, `#disturbances-disturbances-api-get`, `#occupancy-feedback-api-post`, and `#logs-logs-api-get`
- Base URL: `https://api.irail.be`
- Authentication:
  - no API key, OAuth flow, or login wall is documented on the official iRail API page
- Primary response formats:
  - XML by default on the main GET endpoints
  - JSON and JSONP are documented via the `format` parameter
  - the logs endpoint is explicitly documented as JSON
- Transport scope documented here: Belgian rail stations, liveboards, connections, train vehicle details, composition data, disturbances, crowding feedback, and API logs

## Important official usage notes
- The docs say iRail supports digital creativity concerning mobility in Belgium and makes Belgian railway timetables easily available.
- The official API page states that the API is available at `https://api.irail.be`.
- TLS `1.1` or higher is required; the docs say SSL, SSL2, SSL3, and TLS 1.0 are disabled.
- The docs strongly encourage a descriptive `User-Agent` including an application name/version and contact method.
- The page says semantic IDs can change at any time without warning and should be reused from prior API responses rather than composed manually.
- The docs expose 8 routes across 7 GET endpoints and 1 POST endpoint.

## Rate limits, pagination, caching, and errors
- The official iRail docs say clients may make up to `3 requests per second` per source IP address.
- The same page documents `5 burst requests`, meaning short bursts above 3 rps are allowed before refill.
- Exceeding the limit returns HTTP `429`.
- The docs say repeated excessive traffic can lead to developer contact or IP blocking, especially when no `User-Agent` is set.
- The API supports conditional GET and caching:
  - request header: `If-None-Match`
  - response headers: `Etag`, `Cache-Control`
  - the docs say unchanged resources may return `304 Not Modified`
- Example responses on the official page also show `Access-Control-Allow-Origin: *`.
- The official examples include structured error responses such as:
  - JSON `400` / `404` / `500` for connections
  - JSON and XML `404 Route not available` for vehicle lookups

## Confirmed API surface
The official docs page currently exposes 8 routes:
1. `GET /stations/`
2. `GET /liveboard/`
3. `GET /connections/`
4. `GET /vehicle/`
5. `GET /composition/`
6. `GET /disturbances/`
7. `POST /feedback/occupancy`
8. `GET /logs/`

## Common request and response notes
- The main read endpoints share the same format model: XML default, `json` / `jsonp` via `format`.
- The main read endpoints also share the `lang` parameter with documented values `nl`, `fr`, `en`, and `de`.
- Responses commonly include top-level metadata such as `version` and `timestamp`.
- Examples on the official page show resource-style IDs like `http://irail.be/stations/...`, `http://irail.be/vehicle/...`, and connection URIs.

## 1) List stations
- Method: `GET`
- Path: `/stations/`
- Full URL: `https://api.irail.be/stations/`
- Purpose: retrieve the station catalog

Documented parameters:
- `format` - optional response format; choices `xml`, `json`, `jsonp`; default `xml`
- `lang` - optional language; choices `nl`, `fr`, `en`, `de`; default `en`

Documented response notes:
- Station objects include IDs, station URIs, coordinates, `standardname`, and display `name`
- Example responses on the official page show both XML and JSON forms

## 2) Get a liveboard
- Method: `GET`
- Path: `/liveboard/`
- Full URL: `https://api.irail.be/liveboard/`
- Purpose: return departures or arrivals for one station with delays, platforms, train IDs, and occupancy

Documented parameters:
- `station` - required station name when `id` is not used
- `id` - optional station id; the docs say not to send both `id` and `station`
- `arrdep` - optional; `departure` or `arrival`; default `departure`
- `alerts` - optional boolean; include train alerts
- `time` - optional `hhmm`; defaults to the current time in Belgium
- `date` - optional `ddmmyy`; defaults to the current date in Belgium
- `format` - optional `xml`, `json`, or `jsonp`
- `lang` - optional `nl`, `fr`, `en`, or `de`

Documented response notes:
- The response includes station metadata plus a `departures` or `arrivals` block
- Official examples show delay, vehicle, platform, departure-connection URI, and occupancy fields

## 3) Get connections
- Method: `GET`
- Path: `/connections/`
- Full URL: `https://api.irail.be/connections/`
- Purpose: search rail connections between two stations

Documented parameters:
- `from` - required origin station name or id
- `to` - required destination station name or id
- `timesel` - optional; `departure` or `arrival`; default `departure`
- `typeOfTransport` - optional; `automatic`, `trains`, `nointernationaltrains`, or `all`
- `alerts` - optional boolean; deprecated, with the docs noting alerts are now always included
- `results` - optional number; deprecated guideline for desired result count
- `time` - optional `hhmm`
- `date` - optional `ddmmyy`
- `format` - optional `xml`, `json`, or `jsonp`
- `lang` - optional `nl`, `fr`, `en`, or `de`

Documented response notes:
- The response returns an array of connection objects with departure, arrival, duration, alerts, and optional vias
- The official page includes example error payloads for `400`, `404`, and `500`
- The docs mention special handling for walking vias in this route family

## 4) Get vehicle details
- Method: `GET`
- Path: `/vehicle/`
- Full URL: `https://api.irail.be/vehicle/`
- Purpose: retrieve details for one train including stops, occupancy, delays, and current location

Documented parameters:
- `id` - required vehicle id, example `BE.NMBS.IC1832`
- `date` - optional `ddmmyy`
- `alerts` - optional boolean
- `format` - optional `xml`, `json`, or `jsonp`
- `lang` - optional `nl`, `fr`, `en`, or `de`

Documented response notes:
- Responses include `vehicle`, `vehicleinfo`, and ordered `stops`
- The official examples show `404 Route not available` error payloads in both JSON and XML

## 5) Get train composition
- Method: `GET`
- Path: `/composition/`
- Full URL: `https://api.irail.be/composition/`
- Purpose: retrieve the list of units, carriages, and related train-composition metadata

Documented parameters:
- `id` - required train id for the composition lookup
- `format` - optional `xml`, `json`, or `jsonp`
- `lang` - optional `nl`, `fr`, `en`, or `de`
- `data` - optional; default empty; `all` returns raw unfiltered data from NMBS instead of only the curated stable fields

Documented response notes:
- The docs call this endpoint new and hard to test, and explicitly mention an origin/destination issue in the source data
- Example responses include detailed unit properties such as seating, toilets, outlets, bike sections, and accessibility-related fields

## 6) Get current disturbances
- Method: `GET`
- Path: `/disturbances/`
- Full URL: `https://api.irail.be/disturbances/`
- Purpose: retrieve current rail-network works and disturbances

Documented parameters:
- `lineBreakCharacter` - optional; lets clients preserve line breaks in the returned text
- `format` - optional `xml`, `json`, or `jsonp`
- `lang` - optional `nl`, `fr`, `en`, or `de`

Documented response notes:
- The docs say this data is sourced from the NMBS RSS feed and normalised by iRail
- The response can include links and attachments when they are detected in the source feed
- The docs say clients can distinguish scheduled works from unscheduled issues via the `type` field

## 7) Post occupancy feedback
- Method: `POST`
- Path: `/feedback/occupancy`
- Full URL: `https://api.irail.be/feedback/occupancy`
- Purpose: submit train crowding feedback used to compute occupancy from user reports

Documented parameters / POST fields:
- `connection` - required connection id for the feedback target
- `from` - required station id for the feedback context
- `date` - required date in `yyyymmdd` format
- `vehicle` - required connection / vehicle identifier for the report
- `occupancy` - required occupancy term; valid values documented as:
  - `http://api.irail.be/terms/low`
  - `http://api.irail.be/terms/medium`
  - `http://api.irail.be/terms/high`

Documented response notes:
- The docs say feedback is processed instantly
- Occupancy is determined by the average of all received feedback
- The page explicitly warns that some parameter duplication is intentional because connection IDs are unstable identifiers

## 8) Get recent logs
- Method: `GET`
- Path: `/logs/`
- Full URL: `https://api.irail.be/logs/`
- Purpose: retrieve the latest API log entries

Documented parameters:
- None documented on the official page

Documented response notes:
- The docs say this returns the `1000` last log entries
- The page explicitly describes this endpoint as JSON

## Sources inspected
- `https://docs.irail.be/`
- `https://docs.irail.be/#stations-stations-api-get`
- `https://docs.irail.be/#liveboard-liveboard-api-get`
- `https://docs.irail.be/#connections-connections-api-get`
- `https://docs.irail.be/#vehicle-vehicle-api-get`
- `https://docs.irail.be/#composition-composition-api-get`
- `https://docs.irail.be/#disturbances-disturbances-api-get`
- `https://docs.irail.be/#occupancy-feedback-api-post`
- `https://docs.irail.be/#logs-logs-api-get`
