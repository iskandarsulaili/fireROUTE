# Transport for Budapest, Hungary

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-budapest-hungary`
- Official docs used manually:
  - `https://bkkfutar.docs.apiary.io/`
  - `https://opendata.bkk.hu/data-sources`
  - `https://opendata.bkk.hu/keys`
  - `https://opendata.bkk.hu/docs/futar-openapi.yaml`
- Official provider branding confirmed on the inspected pages:
  - `BKK FUTÁR Utazástervező API`
  - `BKK OpenData`
  - `realCity Query Server API`
- Confirmed base URLs:
  - FUTÁR JSON API: `https://futar.bkk.hu/api/query/v1/ws`
  - GTFS-realtime feeds: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full`
  - Static GTFS download: `https://go.bkk.hu/api/static/v1/public-gtfs`
- Authentication:
  - FUTÁR JSON API requires the `key` query parameter on every request (`ApiKeyQuery` in the official OpenAPI document)
  - GTFS-realtime feeds also require the `key` query parameter according to the official data-sources page
  - the static GTFS ZIP is published as a public download URL on the official data-sources page
- Primary response formats:
  - FUTÁR JSON API responses are documented as `application/json`
  - GTFS-realtime feeds are published as binary Protocol Buffers `.pb` plus troubleshooting `.txt` variants
  - static timetable data is published as a GTFS ZIP archive

## Manual review result
- Status for this pass: `manually_documented`
- Confirmed route count: `30`

## Important official usage notes
- The old Apiary page is no longer the route reference; it explicitly points developers to the BKK OpenData portal.
- The official data-sources page says BKK publishes three data families: `FUTÁR API`, static `GTFS`, and `GTFS-realtime`.
- The official OpenAPI file exposes `26` FUTÁR routes under the `https://futar.bkk.hu/api/query/v1/ws` server URL.
- All FUTÁR routes use the `/{dialect}/api/where/...` pattern and the examples consistently use the `otp` dialect.
- Common FUTÁR request parameters repeated across the OpenAPI surface include:
  - required path parameter `dialect`
  - optional query `version`
  - optional query `appVersion`
  - optional query `includeReferences`
- Several vehicle / trip / ticketing routes also support cache validation through `If-Modified-Since` and/or `ifModifiedSince`.
- The official data-sources page says GTFS-realtime data updates every `10 seconds or more` and recommends not refreshing more often than every `5 seconds`.
- BKK says the endpoints are served from a BKK-hosted server park and reserves the right to limit keys for users with significantly higher-than-normal load.
- The official portal says the published datasets are available under `CC BY 4.0` with attribution text `Data source: BKK Zrt., CC BY 4.0`.

## Rate limits, pagination, and errors
- No public numeric quota table is published on the inspected BKK pages.
- Instead, BKK publishes qualitative usage guidance:
  - GTFS-realtime refreshes should not be made more frequently than every `5 seconds`
  - BKK may limit keys that generate significantly higher load than considered normal
- No classic page-number or cursor pagination scheme is documented in the FUTÁR OpenAPI file.
- Result-window and filtering controls are used instead, for example `limit`, `minResult`, `minutesBefore`, `minutesAfter`, `radius`, `latSpan`, `lonSpan`, `query`, `routeId`, and `stopId` depending on the route.
- Confirmed error / status signals from the OpenAPI file:
  - response bodies commonly include `code`, `currentTime`, `status`, `text`, and `version`
  - `alert-details`, `route-details`, and `schedule-for-stop` document `404` for unknown identifiers
  - `multi-route-details`, `route-details`, `schedule-for-stop`, `trip-details`, and `vehicle-for-trip` document `400` variants for malformed or inconsistent inputs
  - `ticketing-locations`, `trip-details`, `vehicle-for-trip`, `vehicles`, `vehicles-for-location`, `vehicles-for-route`, and `vehicles-for-stop` document `304 Not Modified` behavior when `If-Modified-Since` / `ifModifiedSince` is used
- The inspected OpenAPI file did not publish a provider-wide numeric auth-failure or rate-limit error catalog.

## Confirmed API surface
The official BKK material currently exposes `30` confirmed routes / feed URLs:

### FUTÁR JSON API routes (`26`)
1. `GET /{dialect}/api/where/alert-details`
2. `GET /{dialect}/api/where/alert-search`
3. `GET /{dialect}/api/where/arrivals-and-departures-for-location`
4. `GET /{dialect}/api/where/arrivals-and-departures-for-stop`
5. `GET /{dialect}/api/where/bicycle-rental`
6. `GET /{dialect}/api/where/booking-redirect`
7. `GET /{dialect}/api/where/metadata`
8. `GET /{dialect}/api/where/multi-route-details`
9. `POST /{dialect}/api/where/onboard-depart-search`
10. `GET /{dialect}/api/where/onboarding-button`
11. `GET /{dialect}/api/where/plan-access`
12. `GET /{dialect}/api/where/plan-trip`
13. `GET /{dialect}/api/where/references`
14. `GET /{dialect}/api/where/route-details`
15. `GET /{dialect}/api/where/route-details-for-stop`
16. `GET /{dialect}/api/where/schedule-for-stop`
17. `GET /{dialect}/api/where/search`
18. `GET /{dialect}/api/where/statistics`
19. `GET /{dialect}/api/where/stops-for-location`
20. `GET /{dialect}/api/where/ticketing-locations`
21. `GET /{dialect}/api/where/trip-details`
22. `GET /{dialect}/api/where/vehicle-for-trip`
23. `GET /{dialect}/api/where/vehicles`
24. `GET /{dialect}/api/where/vehicles-for-location`
25. `GET /{dialect}/api/where/vehicles-for-route`
26. `GET /{dialect}/api/where/vehicles-for-stop`

### Static and GTFS-realtime feeds (`4` logical feed URLs)
27. `GET /public-gtfs/budapest_gtfs.zip`
28. `GET /gtfs-rt/full/VehiclePositions.{pb|txt}`
29. `GET /gtfs-rt/full/TripUpdates.{pb|txt}`
30. `GET /gtfs-rt/full/Alerts.{pb|txt}`

## Common request / response notes
- FUTÁR routes are primarily lookup and planning endpoints rather than paginated collections.
- Most FUTÁR routes expose JSON response bodies wrapped with status metadata such as `code`, `currentTime`, `status`, `text`, and `version`.
- `includeReferences` is widely reused to expand or suppress reference objects in the response.
- The `date`, `time`, `routeId`, `stopId`, `query`, and spatial parameters (`lat`, `lon`, `latSpan`, `lonSpan`, `radius`) are the main route-selection controls across the documented surface.
- Cache-aware vehicle and ticketing routes support conditional polling via `If-Modified-Since` / `ifModifiedSince` and may return `304` when nothing changed.

## Route details

### 1) Alert details
- Method: `GET`
- Path: `/{dialect}/api/where/alert-details`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/alert-details`
- Purpose: return full detail for one alert / disruption id
- Key parameters: `alertId` required; optional `date`, `related`, `includeReferences`, `version`, `appVersion`
- Confirmed errors: `404` for unknown alert ids

### 2) Alert search
- Method: `GET`
- Path: `/{dialect}/api/where/alert-search`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/alert-search`
- Purpose: search active alerts over a time interval
- Key parameters: `query`, `start`, `end`, `time`, `filterClosed`, `listView`, `minResult`, `includeReferences`

### 3) Arrivals and departures for location
- Method: `GET`
- Path: `/{dialect}/api/where/arrivals-and-departures-for-location`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/arrivals-and-departures-for-location`
- Purpose: return nearby arrivals / departures using coordinates or selected stops
- Key parameters: `lat`, `lon`, optional `latSpan`, `lonSpan`, `radius`, `stopId`, `limit`, `groupLimit`, `minResult`, `minutesBefore`, `minutesAfter`, `stopTimeType`, `includeRouteId`, `includeRouteTypes`, `excludeRouteTypes`, `includeVehicleFromTrip`, `includeVehicleFromVehicleBlock`, `clientLat`, `clientLon`, `query`

### 4) Arrivals and departures for stop
- Method: `GET`
- Path: `/{dialect}/api/where/arrivals-and-departures-for-stop`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/arrivals-and-departures-for-stop`
- Purpose: return arrivals / departures for one or more stop ids
- Key parameters: `stopId`, optional `limit`, `minResult`, `minutesBefore`, `minutesAfter`, `stopTimeType`, `includeRouteId`, `includeRouteTypes`, `excludeRouteTypes`, `includeVehicleFromTrip`, `includeVehicleFromVehicleBlock`, `lat`, `lon`, `latSpan`, `lonSpan`, `radius`, `query`

### 5) Bicycle rental lookup
- Method: `GET`
- Path: `/{dialect}/api/where/bicycle-rental`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/bicycle-rental`
- Purpose: return bicycle-rental station data
- Key parameters: `stationId`, optional `includeReferences`

### 6) Booking redirect lookup
- Method: `GET`
- Path: `/{dialect}/api/where/booking-redirect`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/booking-redirect`
- Purpose: build / resolve booking redirect information for a trip segment
- Key parameters: `agencyId`, `routeId`, `tripId`, `serviceDate`, `directionId`, `boardStopId`, `alightStopId`

### 7) Metadata
- Method: `GET`
- Path: `/{dialect}/api/where/metadata`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/metadata`
- Purpose: return metadata for the dataset at a selected time
- Key parameters: `time`, optional `includeReferences`

### 8) Multi-route details
- Method: `GET`
- Path: `/{dialect}/api/where/multi-route-details`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/multi-route-details`
- Purpose: return detail for multiple routes
- Key parameters: `routeId`, optional `date`, `related`, `includeReferences`
- Confirmed errors: `400` bad `date`, `404` unknown route ids

### 9) Onboard depart search
- Method: `POST`
- Path: `/{dialect}/api/where/onboard-depart-search`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/onboard-depart-search`
- Purpose: match an onboard passenger trace to candidate vehicles
- Query parameters: `version`, `appVersion`, `includeReferences`
- Request body: JSON array of `OnboardDepartPosition` objects
- Confirmed required body fields inside `OnboardDepartPosition`: `lat`, `lon`, `timestamp`
- Optional body fields: `accuracy`, `speed`

### 10) Onboarding button departures for location
- Method: `GET`
- Path: `/{dialect}/api/where/onboarding-button`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/onboarding-button`
- Purpose: return location-based departures for onboarding UI flows
- Key parameters: same location / stop window controls as the arrivals-by-location route, including `lat`, `lon`, `latSpan`, `lonSpan`, `radius`, `stopId`, `limit`, `groupLimit`, `minutesBefore`, `minutesAfter`, `includeRouteId`, `includeRouteTypes`, `excludeRouteTypes`, `query`, `clientLat`, `clientLon`

### 11) Accessible trip planning
- Method: `GET`
- Path: `/{dialect}/api/where/plan-access`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/plan-access`
- Purpose: plan accessible itineraries between places
- Key parameters: `fromPlace`, `toPlace`, `date`, `time`, `mode`, `arriveBy`, `numItineraries`, `optimize`, `wheelchair`, `walkProfile`, `shouldBuyTickets`, `showIntermediateStops`, `triangleSafetyFactor`, `triangleSlopeFactor`, `triangleTimeFactor`

### 12) Trip planning
- Method: `GET`
- Path: `/{dialect}/api/where/plan-trip`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/plan-trip`
- Purpose: plan standard itineraries between places
- Key parameters: `fromPlace`, `toPlace`, `date`, `time`, `mode`, `arriveBy`, `numItineraries`, `optimize`, `wheelchair`, `walkProfile`, `shouldBuyTickets`, `showIntermediateStops`, `triangleSafetyFactor`, `triangleSlopeFactor`, `triangleTimeFactor`

### 13) Reference lookup
- Method: `GET`
- Path: `/{dialect}/api/where/references`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/references`
- Purpose: resolve reference objects by ids
- Key parameters: `agencyId`, `alertId`, `routeId`, `stopId`, optional `includeReferences`

### 14) Route details
- Method: `GET`
- Path: `/{dialect}/api/where/route-details`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/route-details`
- Purpose: return one route by id
- Key parameters: `routeId`, optional `date`, `related`, `includeReferences`
- Confirmed errors: `400` malformed `date`, `404` route not found

### 15) Route details for stop
- Method: `GET`
- Path: `/{dialect}/api/where/route-details-for-stop`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/route-details-for-stop`
- Purpose: return route detail records associated with a stop
- Key parameters: `stopId`, optional `includeReferences`

### 16) Schedule for stop
- Method: `GET`
- Path: `/{dialect}/api/where/schedule-for-stop`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/schedule-for-stop`
- Purpose: return a stop schedule for a selected service date
- Key parameters: `stopId`, `date`, optional `onlyDepartures`, `includeReferences`
- Confirmed errors: `400` bad date, `404` unknown stop id

### 17) Search
- Method: `GET`
- Path: `/{dialect}/api/where/search`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/search`
- Purpose: free-text search with optional geographic bias
- Key parameters: `query`, optional `lat`, `lon`, `minResult`, `includeReferences`

### 18) Statistics
- Method: `GET`
- Path: `/{dialect}/api/where/statistics`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/statistics`
- Purpose: return service statistics
- Key parameters: only the required `dialect` path selector is documented for this route

### 19) Stops for location
- Method: `GET`
- Path: `/{dialect}/api/where/stops-for-location`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/stops-for-location`
- Purpose: return stops within a coordinate window or radius
- Key parameters: `lat`, `lon`, optional `latSpan`, `lonSpan`, `radius`, `minResult`, `query`, `includeReferences`

### 20) Ticketing locations
- Method: `GET`
- Path: `/{dialect}/api/where/ticketing-locations`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/ticketing-locations`
- Purpose: return ticket sales / ticketing locations and ticket types
- Key parameters: `full`, `If-Modified-Since`, `ifModifiedSince`, optional `includeReferences`
- Confirmed cache behavior: `304 Not Modified` is documented

### 21) Trip details
- Method: `GET`
- Path: `/{dialect}/api/where/trip-details`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/trip-details`
- Purpose: return one trip by trip id + service date or by vehicle id
- Key parameters: `tripId`, `date`, `vehicleId`, `If-Modified-Since`, `ifModifiedSince`, optional `includeReferences`
- Confirmed errors: `304` for unchanged data, `400` bad date, `404` for unknown trip / vehicle or trip not running on the selected day

### 22) Vehicle for trip
- Method: `GET`
- Path: `/{dialect}/api/where/vehicle-for-trip`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/vehicle-for-trip`
- Purpose: return vehicles assigned to trip ids and service dates
- Key parameters: `tripId`, `date`, `If-Modified-Since`, `ifModifiedSince`, optional `includeReferences`
- Confirmed errors: `304` for unchanged data, `400` for inconsistent trip/date array sizes, `404` when a trip id cannot be resolved

### 23) Vehicles
- Method: `GET`
- Path: `/{dialect}/api/where/vehicles`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/vehicles`
- Purpose: return vehicles by id
- Key parameters: `vehicleId`, `If-Modified-Since`, `ifModifiedSince`, optional `includeReferences`
- Confirmed cache behavior: `304 Not Modified` is documented

### 24) Vehicles for location
- Method: `GET`
- Path: `/{dialect}/api/where/vehicles-for-location`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/vehicles-for-location`
- Purpose: return vehicles inside a coordinate window or radius
- Key parameters: `lat`, `lon`, optional `latSpan`, `lonSpan`, `radius`, `query`, `If-Modified-Since`, `ifModifiedSince`, `includeReferences`
- Response note: the OpenAPI description says all vehicles are returned if `lat` or `lon` is null
- Confirmed cache behavior: `304 Not Modified` is documented

### 25) Vehicles for route
- Method: `GET`
- Path: `/{dialect}/api/where/vehicles-for-route`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/vehicles-for-route`
- Purpose: return vehicles assigned to one or more routes
- Key parameters: `routeId`, optional `related`, `If-Modified-Since`, `ifModifiedSince`, `includeReferences`
- Confirmed errors: `304` for unchanged data, `404` unknown route id

### 26) Vehicles for stop
- Method: `GET`
- Path: `/{dialect}/api/where/vehicles-for-stop`
- Full URL: `https://futar.bkk.hu/api/query/v1/ws/{dialect}/api/where/vehicles-for-stop`
- Purpose: return vehicles operating trips that include the selected stop
- Key parameters: `stopId`, optional `If-Modified-Since`, `ifModifiedSince`, `includeReferences`
- Confirmed errors: `304` for unchanged data, `404` unknown stop id

### 27) Static GTFS dataset
- Method: `GET`
- Full URL: `https://go.bkk.hu/api/static/v1/public-gtfs/budapest_gtfs.zip`
- Purpose: download the planned timetable database in GTFS format
- Authentication: none documented on the official data-sources page
- Format notes: ZIP archive containing the static GTFS feed; the portal says it is updated every few days

### 28) GTFS-realtime vehicle positions
- Method: `GET`
- Binary URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/VehiclePositions.pb?key=REQUESTED_KEY`
- Troubleshooting URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/VehiclePositions.txt?key=REQUESTED_KEY`
- Purpose: return live vehicle positions
- Authentication: required `key` query parameter
- Format notes: Protocol Buffers `.pb` for development and `.txt` for troubleshooting

### 29) GTFS-realtime trip updates
- Method: `GET`
- Binary URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/TripUpdates.pb?key=REQUESTED_KEY`
- Troubleshooting URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/TripUpdates.txt?key=REQUESTED_KEY`
- Purpose: return real-time trip updates compared to the static GTFS feed
- Authentication: required `key` query parameter
- Format notes: Protocol Buffers `.pb` for development and `.txt` for troubleshooting

### 30) GTFS-realtime alerts
- Method: `GET`
- Binary URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/Alerts.pb?key=REQUESTED_KEY`
- Troubleshooting URL: `https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/Alerts.txt?key=REQUESTED_KEY`
- Purpose: return real-time alerts / timetable changes
- Authentication: required `key` query parameter
- Format notes: Protocol Buffers `.pb` for development and `.txt` for troubleshooting

## Sources inspected
- `https://bkkfutar.docs.apiary.io/`
- `https://opendata.bkk.hu/data-sources`
- `https://opendata.bkk.hu/keys`
- `https://opendata.bkk.hu/docs/futar-openapi.yaml`
