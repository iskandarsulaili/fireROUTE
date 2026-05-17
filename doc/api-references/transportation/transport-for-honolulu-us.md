# Transport for Honolulu, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-honolulu-us`
- Official docs used manually:
  - `http://hea.thebus.org/api_info.asp`
  - `https://api.thebus.org/`
  - `https://hea.thebus.org/api/documentation/Web%20Services%20API.pdf`
  - `https://hea.thebus.org/api/documentation/arrivalsJSON.pdf`
  - `https://hea.thebus.org/api/documentation/vehicleJSON.pdf`
  - `https://hea.thebus.org/api/documentation/routeJSON.pdf`
- Base URL: `http://api.thebus.org`
- Authentication: required AppID passed as the `key` query parameter
- Primary response formats: XML and JSON
- Transport scope documented here: Oahu Transit Services / TheBus realtime arrivals, vehicle lookups, and route-shape lookups

## Important official usage notes
- The API landing page describes the service as read-only, using HTTP GET for all calls.
- The main PDF says all web-service calls require a registered AppID and that the provider retains email addresses to notify developers of upcoming API changes.
- The official registration notes say usage is tracked by AppID and client IP address.
- The published base URLs in the PDFs use `http://api.thebus.org/...`; the documentation pages themselves are served over HTTPS.
- The provider says system data comes from Transitmaster polling every minute and bus position reports every minute, so data can be up to two minutes late and may be later if a bus does not radio in.
- The Terms of Use require the legend `Route and arrival data provided by permission of Oahu Transit Services, Inc` when displaying the data unless OTS agrees otherwise in writing.

## Rate limits, pagination, and errors
- The official PDF says each AppID is limited to `250,000 requests a day` by default.
- The provider says AppIDs are deleted after `6 months` of inactivity.
- No pagination parameters are documented for any confirmed route.
- The docs do not publish route-specific HTTP status-code tables.
- XML responses can include `errorMessage` under the top-level container (`stopTimes`, `vehicles`, or `routes`).
- JSON responses also include `errorMessage` fields when applicable.
- The docs mention that usage thresholds can be adjusted by contacting `api@thebus.org`.

## Confirmed API surface
The official site and linked PDFs currently document 6 GET routes:
1. `GET /arrivals/`
2. `GET /vehicle/`
3. `GET /route/`
4. `GET /arrivalsJSON/`
5. `GET /vehicleJSON/`
6. `GET /routeJSON/`

## Common request and response notes
- Every confirmed route requires the `key` query parameter carrying the registered AppID.
- All routes are GET-only and read-only.
- XML endpoints return XML documents whose top-level elements are `stopTimes`, `vehicles`, or `routes`.
- JSON endpoints return JSON objects with equivalent fields.
- Route and routeJSON support two documented lookup modes on the same path: `route=<route_num>` or `headsign=<string>`.
- The docs repeatedly describe `trip` IDs and `shape`/`shapeID` values as references into the GTFS feed.

## 1) Get arrivals as XML
- Method: `GET`
- Path: `/arrivals/`
- Full URL: `http://api.thebus.org/arrivals/?key={API_key}&stop={stop_ID}`
- Purpose: return bus arrival predictions for a stop in XML format

Documented parameters:
- `key` - required query string AppID / API registration number
- `stop` - required query string stop number

Documented response notes:
- Top-level XML element: `stopTimes`
- Response fields include `stop`, `timestamp`, optional `errorMessage`, and one or more `arrival` records
- Arrival fields include `id`, `trip`, `route`, `headsign`, `vehicle`, `direction`, `stopTime`, `date`, `estimated`, `longitude`, `latitude`, `shape`, and `canceled`
- `estimated` is documented as `1` for estimated and `0` for scheduled / no GPS
- `canceled` is documented as `0` active, `1` canceled, and `-1` was canceled but is no longer canceled

## 2) Get a vehicle lookup as XML
- Method: `GET`
- Path: `/vehicle/`
- Full URL: `http://api.thebus.org/vehicle/?key={API_key}&num={vehicle_num}`
- Purpose: return one or more matching vehicle records in XML format

Documented parameters:
- `key` - required query string AppID / API registration number
- `num` - required query string vehicle number

Documented response notes:
- Top-level XML element: `vehicles`
- Response fields include `timestamp`, optional `errorMessage`, and one or more `vehicle` records
- Vehicle fields include `number`, `trip`, `driver`, `latitude`, `longitude`, `adherence`, `last_message`, `route_short_name`, and `headsign`
- `adherence` is documented as positive when the bus is early and negative when the bus is late

## 3) Get route or headsign matches as XML
- Method: `GET`
- Path: `/route/`
- Full URL: `http://api.thebus.org/route/?key={API_key}&route={route_num}`
- Alternate full URL: `http://api.thebus.org/route/?key={API_key}&headsign={string}`
- Purpose: return route-shape matches either by route number or by headsign text in XML format

Documented parameters:
- `key` - required query string AppID / API registration number
- `route` - optional query string route number lookup mode
- `headsign` - optional query string text search against the headsign field

Documented response notes:
- Top-level XML element: `routes`
- Response fields include `routeName`, `routeID`, optional `errorMessage`, and one or more `route` records
- Route records include `routeNum`, `shapeID`, `firstStop`, and `headsign`
- The docs describe `routeID` as the internal route used in the Google feed

## 4) Get arrivals as JSON
- Method: `GET`
- Path: `/arrivalsJSON/`
- Full URL: `http://api.thebus.org/arrivalsJSON/?key={API_key}&stop={stop_ID}`
- Purpose: return bus arrival predictions for a stop in JSON format

Documented parameters:
- `key` - required query string AppID / API registration number
- `stop` - required query string stop number

Documented response notes:
- Returns top-level fields `errorMessage`, `stop`, `timestamp`, and `arrivals`
- Each arrivals entry includes `id`, `trip`, `route`, `headsign`, `direction`, `vehicle`, `estimated`, `stopTime`, `date`, `longitude`, `latitude`, `shape`, and `canceled`
- The official example shows scheduled arrivals can report `vehicle` as `???` and coordinate values as `0`

## 5) Get a vehicle lookup as JSON
- Method: `GET`
- Path: `/vehicleJSON/`
- Full URL: `http://api.thebus.org/vehicleJSON/?key={API_key}&num={vehicle_num}`
- Purpose: return vehicle information in JSON format

Documented parameters:
- `key` - required query string AppID / API registration number
- `num` - required query string vehicle number

Documented response notes:
- Returns top-level fields `errorMessage`, `timestamp`, and `vehicle`
- Each vehicle object includes `number`, `trip`, `driver`, `latitude`, `longitude`, `adherence`, `last_message`, `route_short_name`, and `headsign`

## 6) Get route or headsign matches as JSON
- Method: `GET`
- Path: `/routeJSON/`
- Full URL: `http://api.thebus.org/routeJSON/?key={API_key}&route={route_num}`
- Alternate full URL: `http://api.thebus.org/routeJSON/?key={API_key}&headsign={string}`
- Purpose: return route-shape matches by route number or headsign text in JSON format

Documented parameters:
- `key` - required query string AppID / API registration number
- `route` - optional query string route number lookup mode
- `headsign` - optional query string text-search mode

Documented response notes:
- Returns top-level fields `errorMessage`, `routeName`, `routeID`, and `route`
- Each route object includes `routeNum`, `shapeID`, `firstStop`, and `headsign`
- The JSON example shows `firstStop` values containing both text and a stop number such as `KALIHI TRANSIT CENTER (Stop: 4523)`

## Sources inspected
- `http://hea.thebus.org/api_info.asp`
- `https://api.thebus.org/`
- `https://hea.thebus.org/api/documentation/Web%20Services%20API.pdf`
- `https://hea.thebus.org/api/documentation/arrivalsJSON.pdf`
- `https://hea.thebus.org/api/documentation/vehicleJSON.pdf`
- `https://hea.thebus.org/api/documentation/routeJSON.pdf`
