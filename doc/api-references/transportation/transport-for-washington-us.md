# Transport for Washington, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-washington-us`
- Provider actually documented: Washington Metropolitan Area Transit Authority (`WMATA`)
- Official docs used manually:
  - `https://developer.wmata.com/`
  - `https://developer.wmata.com/apis`
  - `https://developer.wmata.com/api-details#api=54763629281d83086473f231`
  - `https://developer.wmata.com/api-details#api=5476364f031f590f38092507`
  - the official WMATA developer-portal metadata endpoints under `https://developer.wmata.com/developer/apis/...`
- Base URL: `https://api.wmata.com`
- Authentication: subscription key required across the inspected APIs; the official portal metadata exposes the key name as `api_key` and says it can be supplied as either a header or query parameter
- Primary response formats seen in official docs:
  - JSON on `/json/...` legacy service routes
  - XML on parallel legacy service routes
  - GTFS static ZIP downloads
  - GTFS-realtime / Metro Alert protobuf feeds with `.pb` suffix
  - Metro Alert JSON feeds with `.json` suffix
- Transport scope: bus routes/stops, schedules, bus positions, rail lines/stations, incidents, next bus/next train predictions, train positions, and GTFS / GTFS-realtime feeds

## Important official usage notes
- The WMATA home page says use of the APIs and other data is free of charge.
- The same page says a valid API key is required to make a default of `1,000 requests per minute`, control the version, and stream requests.
- The old generated index entry claiming OAuth is not what the current official portal shows; the inspected live portal exposes subscription-key auth using `api_key` instead.
- Bus-position docs explicitly say `RouteID` accepts only the base route name, not a variant suffix such as `10Av1` or `10Av2`.
- Bus positions are documented as refreshing approximately every `7 to 10 seconds`.
- Live train positions are also documented as refreshing every `7 to 10 seconds`.
- The GTFS page on the WMATA developer portal includes production and QA feed variants for some bus datasets.

## Rate limits, pagination, and errors
- Rate limit explicitly stated on the home page: default `1,000 requests per minute` with a valid API key.
- No cursor or page-number pagination is documented for the inspected WMATA legacy bus/rail/incident/prediction APIs.
- GTFS and GTFS-realtime style endpoints are feed downloads, so the inspected docs do not describe pagination there either.
- The portal mostly documents success responses (`200`) and example payloads rather than a full shared error schema.
- `GET /NextBusService.svc/json/jPredictions` and `GET /NextBusService.svc/Predictions` explicitly document both `200` and `400` responses.
- `GET /Misc/Validate` exists specifically to validate an API key when troubleshooting access issues.

## Confirmed API surface
The official WMATA developer portal currently exposes 60 routes across 9 API groups.

### 1) Bus Route and Stop Methods (`/Bus.svc`) - 12 routes
1. `GET /Bus.svc/json/jBusPositions`
2. `GET /Bus.svc/json/jRouteDetails?RouteID={RouteID}`
3. `GET /Bus.svc/json/jRoutes`
4. `GET /Bus.svc/json/jRouteSchedule?RouteID={RouteID}`
5. `GET /Bus.svc/json/jStopSchedule?StopID={StopID}`
6. `GET /Bus.svc/json/jStops`
7. `GET /Bus.svc/BusPositions`
8. `GET /Bus.svc/RouteDetails?RouteID={RouteID}`
9. `GET /Bus.svc/Routes`
10. `GET /Bus.svc/RouteSchedule?RouteID={RouteID}`
11. `GET /Bus.svc/StopSchedule?StopID={StopID}`
12. `GET /Bus.svc/Stops`

Shared parameter notes from the official operation pages:
- Bus positions (`/json/jBusPositions`, `/BusPositions`): optional `RouteID`, optional geospatial filters `Lat`, `Lon`, and `Radius`.
- Path details (`/json/jRouteDetails`, `/RouteDetails`): required `RouteID`; optional `Date` in `YYYY-MM-DD` format.
- Route schedule (`/json/jRouteSchedule`, `/RouteSchedule`): required `RouteID`; optional `Date`; optional `IncludingVariations` boolean.
- Stop schedule (`/json/jStopSchedule`, `/StopSchedule`): required `StopID` (7-digit regional stop ID); optional `Date`.
- Stop search (`/json/jStops`, `/Stops`): optional `Lat`, `Lon`, and `Radius`.
- Official response-format split: `/json/...` routes return JSON; non-`/json/...` variants return XML.

Important response/usage notes confirmed in the docs:
- Bus-position responses include fields such as `DateTime`, `Deviation`, `DirectionText`, `Lat`, `Lon`, `RouteID`, `TripHeadsign`, `TripID`, and `VehicleID`.
- Path-detail responses include route shapes plus served stops.
- Schedule responses include trip and stop-time data.
- Stop-search routes can return all stops when the location filters are omitted.

### 2) GTFS (`/gtfs`) - 12 routes
1. `GET /gtfs/bus-gtfs-static.zip`
2. `GET /gtfs/bus-gtfs-static-bbnr-qa.zip`
3. `GET /gtfs/bus-gtfsrt-alerts.pb`
4. `GET /gtfs/bus-gtfsrt-tripupdates.pb`
5. `GET /gtfs/bus-gtfsrt-tripupdates-qa.pb`
6. `GET /gtfs/bus-gtfsrt-vehiclepositions.pb`
7. `GET /gtfs/bus-gtfsrt-vehiclepositions-qa.pb`
8. `GET /gtfs/rail-bus-gtfs-static.zip`
9. `GET /gtfs/rail-gtfs-static.zip`
10. `GET /gtfs/rail-gtfsrt-alerts.pb`
11. `GET /gtfs/rail-gtfsrt-tripupdates.pb`
12. `GET /gtfs/rail-gtfsrt-vehiclepositions.pb`

Official notes from the portal:
- These are direct feed-download endpoints.
- Static feeds use `.zip`.
- Realtime feeds use protobuf `.pb` payloads.
- The portal includes QA variants for selected bus GTFS static, trip-update, and vehicle-position feeds.

### 3) GTFS Metro Alert (`/gtfs-metro-alert`) - 6 routes
1. `GET /gtfs-metro-alert/bus-gtfs-metro-alerts.json`
2. `GET /gtfs-metro-alert/rail-bus-gtfs-metro-alert.json`
3. `GET /gtfs-metro-alert/rail-gtfs-metro-alerts.json`
4. `GET /gtfs-metro-alert/bus-gtfs-metro-alert.pb`
5. `GET /gtfs-metro-alert/rail-bus-gtfs-metro-alert.pb`
6. `GET /gtfs-metro-alert/rail-gtfs-metro-alerts.pb`

Official notes from the portal:
- Metro Alert feeds are published in both JSON and protobuf forms.
- The feed set is split into bus-only, rail-only, and combined rail+bus variants.

### 4) Incidents (`/Incidents.svc`) - 6 routes
1. `GET /Incidents.svc/json/BusIncidents`
2. `GET /Incidents.svc/json/ElevatorIncidents`
3. `GET /Incidents.svc/json/Incidents`
4. `GET /Incidents.svc/BusIncidents`
5. `GET /Incidents.svc/ElevatorIncidents`
6. `GET /Incidents.svc/Incidents`

Shared parameter notes:
- Bus incidents: optional `Route` filter; the docs say to use the base route code rather than a variant.
- Elevator/escalator outages: optional `StationCode` filter.
- Rail incidents: no documented parameters on the inspected operation pages.
- JSON and XML variants are parallel mirrors.

### 5) Misc Methods (`/Misc`) - 1 route
1. `GET /Misc/Validate`

Official note:
- The operation description says this endpoint simply validates an existing API key and should mostly be used to troubleshoot whether an issue is caused by key access.

### 6) Rail Station Information (`/Rail.svc`) - 16 routes
1. `GET /Rail.svc/json/jLines`
2. `GET /Rail.svc/json/jStationParking`
3. `GET /Rail.svc/json/jPath`
4. `GET /Rail.svc/json/jStationEntrances`
5. `GET /Rail.svc/json/jStationInfo`
6. `GET /Rail.svc/json/jStations`
7. `GET /Rail.svc/json/jStationTimes`
8. `GET /Rail.svc/json/jSrcStationToDstStationInfo`
9. `GET /Rail.svc/Lines`
10. `GET /Rail.svc/StationParking`
11. `GET /Rail.svc/Path`
12. `GET /Rail.svc/StationEntrances`
13. `GET /Rail.svc/StationInfo`
14. `GET /Rail.svc/Stations`
15. `GET /Rail.svc/StationTimes`
16. `GET /Rail.svc/SrcStationToDstStationInfo`

Shared parameter notes from the inspected docs:
- Lines: no documented parameters.
- Parking information: optional `StationCode`.
- Path between stations: required `FromStationCode` and `ToStationCode`.
- Station entrances: optional `Lat`, `Lon`, and `Radius` geospatial filters.
- Station information: required `StationCode`.
- Station list: optional `LineCode`; the docs enumerate `RD`, `YL`, `GR`, `BL`, `OR`, and `SV`.
- Station timings: optional `StationCode`.
- Station-to-station information: optional `FromStationCode` and `ToStationCode`.
- `/json/...` routes return JSON; the parallel non-JSON routes return XML.

### 7) Real-Time Bus Predictions (`/NextBusService.svc`) - 2 routes
1. `GET /NextBusService.svc/json/jPredictions`
2. `GET /NextBusService.svc/Predictions`

Shared parameter notes:
- Required query parameter: `StopID` (7-digit regional stop ID).
- JSON route returns JSON; XML route returns XML.
- The official docs list both `200` and `400` responses.

Important response notes from the official description:
- Prediction payloads include `StopName` and an array of predictions.
- Prediction entries include `DirectionText`, `Minutes`, `RouteID`, `TripID`, and `VehicleID`.

### 8) Real-Time Rail Predictions (`/StationPrediction.svc`) - 2 routes
1. `GET /StationPrediction.svc/json/GetPrediction/{StationCodes}`
2. `GET /StationPrediction.svc/GetPrediction/{StationCodes}`

Shared parameter notes:
- Required path parameter: `StationCodes`.
- The docs describe it as a comma-separated list of station codes.
- To request all predictions, the docs say to use `All`.
- JSON and XML variants are both documented.

### 9) Train Positions (`/TrainPositions`) - 3 routes
1. `GET /TrainPositions/TrainPositions?contentType={contentType}`
2. `GET /TrainPositions/StandardRoutes?contentType={contentType}`
3. `GET /TrainPositions/TrackCircuits?contentType={contentType}`

Shared parameter notes:
- All three train-position endpoints require the template parameter `contentType`.
- The docs say the supported formats currently include `json` and `xml`.

Important response/usage notes confirmed in the docs:
- Live train positions return uniquely identifiable trains in service and the track circuits they occupy.
- The docs say the live-train endpoint may return an empty set when no positions are available.
- The description explicitly states the data is refreshed once every `7-10 seconds`.

## Common request and response notes
- The inspected portal metadata says every API group requires a subscription and uses the `api_key` credential name.
- The official metadata advertises both header and query parameter names as `api_key`.
- The portal largely documents GET-only operations for the public transport APIs inspected here.
- JSON/XML legacy routes are usually published in pairs with the same semantics and parameter set.
- GTFS and GTFS-realtime feeds are download-style endpoints without request bodies.
- No POST, PUT, PATCH, or DELETE routes were exposed in the inspected public portal for this provider.

## Sources inspected
- `https://developer.wmata.com/`
- `https://developer.wmata.com/apis`
- `https://developer.wmata.com/api-details#api=54763629281d83086473f231`
- `https://developer.wmata.com/api-details#api=5476364f031f590f38092507`
- `https://developer.wmata.com/developer/apis?$top=50&$skip=0&skipWorkspaces=true&api-version=2022-04-01-preview`
- operation and hostname metadata under `https://developer.wmata.com/developer/apis/{apiId}/...`
