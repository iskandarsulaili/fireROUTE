# CTS

## Provider metadata
- Category: `Transportation`
- Provider slug: `cts`
- Official docs used manually:
  - `https://api.cts-strasbourg.eu/`
  - `https://api.cts-strasbourg.eu/v1/swagger.json`
  - `https://cts-strasbourg.eu/fr/open-data/`
- Base URL: `https://api.cts-strasbourg.eu`
- Authentication:
  - the official Swagger page says to fill the username field of the Basic HTTP Authorization header with your token
  - the token is obtained from the provider's open-data account according to the official page
  - no formal OpenAPI security scheme is embedded in the published `swagger.json`, but the human-readable official docs explicitly require token-based Basic auth
- Primary response formats seen in official docs:
  - `application/json`
  - `text/json`
  - `application/xml`
  - `text/xml`
  - `text/plain`
- Transport scope: Strasbourg CTS realtime SIRI feeds, stop and line discovery, timetable-file links, park-and-ride data, retail outlets, and véloparc availability

## Important official usage notes
- The Swagger landing page explicitly says not to make an excessive number of requests.
- The official page says the stop-monitoring and estimated-timetable APIs include `ValidUntil` and `ShortestPossibleCycle` to help clients decide when a new request is useful.
- The same page says every API response includes the `Cache-Control` header and that requests made before expiry will return the same response.
- The official page warns that abusive traffic not respecting these rules may receive an HTTP error code.
- The docs note `bus`, `tram`, and `undefined` as supported `VehicleMode` values on the realtime SIRI routes.

## Rate limits, pagination, and errors
- No numeric rate-limit quota was published in the inspected official docs.
- Instead, the provider publishes cache-validity guidance via `ValidUntil`, `ShortestPossibleCycle`, and `Cache-Control`.
- No classic page / limit pagination parameters were documented on the inspected routes.
- Common documented errors are:
  - `400` for missing or invalid parameters on many SIRI and retail-outlet routes
  - `500` for technical errors with a retry-later message
- Every inspected route supports multiple response content types rather than a single fixed format.

## Confirmed API surface
The official docs currently expose 11 routes:
1. `GET /v1/siri/2.0/estimated-timetable`
2. `GET /v1/siri/2.0/general-message`
3. `GET /v1/siri/2.0/lines-discovery`
4. `GET /v1/siri/2.0/stop-monitoring`
5. `GET /v1/siri/2.0/stoppoints-discovery`
6. `GET /v1/cts/line-timetable-file`
7. `GET /v1/cts/park-and-ride`
8. `GET /v1/cts/retail-outlet`
9. `GET /v1/cts/retail-outlet/types`
10. `GET /v1/cts/stop-timetable-file`
11. `GET /v1/cts/veloparc`

## Route-by-route notes

### SIRI realtime endpoints

#### 1) Estimated timetable
- Method: `GET`
- Path: `/v1/siri/2.0/estimated-timetable`
- Purpose: current status of all known vehicle journeys, including currently running ones and those starting within the next hour
- Notable query params: `RequestorRef`, `MessageIdentifier`, `VehicleMode`, `PreviewInterval`, `LineRef`, `DirectionRef`, `IncludeGeneralMessage`, `IncludeFLUO67`, `RemoveCheckOut`, `GetStopIdInsteadOfStopCode`
- Responses: `200`, `400`, `500`

#### 2) General messages
- Method: `GET`
- Path: `/v1/siri/2.0/general-message`
- Purpose: traffic information, service changes, and commercial information messages
- Notable query params: `RequestorRef`, `MessageIdentifier`, `InfoChannelRef`, `LineRef`, `ImpactedLineRef`
- Responses: `200`, `400`, `500`

#### 3) Line discovery
- Method: `GET`
- Path: `/v1/siri/2.0/lines-discovery`
- Purpose: list active lines
- Query params: `RequestorRef`, `MessageIdentifier`
- Responses: `200`, `400`, `500`

#### 4) Stop monitoring
- Method: `GET`
- Path: `/v1/siri/2.0/stop-monitoring`
- Purpose: realtime departures at one or more monitored stops
- Required query params: `MonitoringRef`
- Notable optional params: `RequestorRef`, `MessageIdentifier`, `VehicleMode`, `PreviewInterval`, `StartTime`, `LineRef`, `DirectionRef`, `MaximumStopVisits`, `MinimumStopVisitsPerLine`, `IncludeGeneralMessage`, `IncludeFLUO67`
- Responses: `200`, `400`, `500`

#### 5) Stop-points discovery
- Method: `GET`
- Path: `/v1/siri/2.0/stoppoints-discovery`
- Purpose: discover stop points for use with stop-monitoring and other CTS data
- Notable query params: `RequestorRef`, `MessageIdentifier`, `latitude`, `longitude`, `distance`, `includeLinesDestinations`, `stopCode`
- Responses: `200`, `400`, `500`

### CTS auxiliary endpoints

#### 6) Timetable files by line
- Method: `GET`
- Path: `/v1/cts/line-timetable-file`
- Purpose: return timetable-file links for one line
- Required query params: `lineRef`
- Responses: `200`, `500`

#### 7) Park and ride availability
- Method: `GET`
- Path: `/v1/cts/park-and-ride`
- Purpose: list park-and-ride facilities and available spots
- Responses: `200`, `500`

#### 8) Retail outlets
- Method: `GET`
- Path: `/v1/cts/retail-outlet`
- Purpose: list ticket / retail outlets, optionally filtered geographically or by service capabilities
- Notable query params: `TicketSales`, `BadgeoTopUp`, `types`, `latitude`, `longitude`, `distance`
- Responses: `200`, `400`, `500`

#### 9) Retail outlet types
- Method: `GET`
- Path: `/v1/cts/retail-outlet/types`
- Purpose: list retail outlet type values
- Responses: `200`, `500`

#### 10) Timetable files by stop
- Method: `GET`
- Path: `/v1/cts/stop-timetable-file`
- Purpose: return timetable-file links for one logical stop
- Required query params: `logicalStopCode`
- Responses: `200`, `500`

#### 11) Véloparc list
- Method: `GET`
- Path: `/v1/cts/veloparc`
- Purpose: list véloparc facilities
- Responses: `200`, `500`

## Sources inspected
- `https://api.cts-strasbourg.eu/`
- `https://api.cts-strasbourg.eu/v1/swagger.json`
- `https://cts-strasbourg.eu/fr/open-data/`
