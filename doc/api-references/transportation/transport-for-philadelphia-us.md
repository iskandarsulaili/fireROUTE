# Transport for Philadelphia, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-philadelphia-us`
- Official docs used manually:
  - `https://www3.septa.org/`
  - `https://www3.septa.org/VIRegionalRail.html`
  - `https://www3.septa.org/VIBusAndTrolley.html`
- Base URLs confirmed from the official pages:
  - `https://www3.septa.org/api`
  - `https://www3.septa.org/gtfsrt`
  - `https://www3.septa.org/developer`
- Authentication:
  - no API key, OAuth flow, or login gate is shown on the public SEPTA Swagger page
  - the Swagger UI exposes no `Authorize` control and documents public unauthenticated GET access
- Primary response / payload formats:
  - JSON for the main `/api/...` routes and the human-readable GTFS-RT `print.php` routes
  - plain text / SMS-style text for `/api/sms/index.php`
  - ZIP for the static GTFS download
  - protobuf for the linked raw GTFS-Realtime `.pb` feeds
- Transport scope documented here: SEPTA regional rail, bus, trolley, stop, location, alert, static schedule, GTFS static, and GTFS-Realtime feeds

## Important official usage notes
- The public Swagger page is titled `SEPTA Developers 1.0.2` and shows base URL `[ Base URL: /api ]` with both `https` and `http` schemes; HTTPS should be preferred.
- The Swagger descriptions repeatedly point users to SEPTA's official input reference pages for valid regional-rail station names and valid bus/trolley route inputs:
  - `https://www3.septa.org/VIRegionalRail.html`
  - `https://www3.septa.org/VIBusAndTrolley.html`
- The six GTFS-Realtime `print.php` routes are explicitly described as human-readable previews that show only the top five results.
- For complete GTFS-Realtime datasets, the same official GTFS section links separate raw protobuf feed URLs; those protobuf URLs are included below as confirmed routes.
- The public docs do not publish a numeric rate-limit table, pagination scheme, or provider-specific error object.
- Several older Swagger parameters still use generic names such as `req1`, `req2`, and `req3`; where the docs do not label them more clearly, this file preserves SEPTA's own naming and notes the surrounding description.

## Rate limits, pagination, and errors
- No public numeric rate limit or quota was published on the inspected SEPTA pages.
- No confirmed route documents page-based or cursor-based pagination.
- The Swagger UI only documents successful `200` responses for the inspected routes.
- No separate structured error schema was published on the inspected public SEPTA pages.

## Confirmed API surface
The currently accessible official SEPTA pages expose 27 route / feed URLs:
1. `GET /Arrivals/index.php`
2. `GET /TrainView/index.php`
3. `GET /NextToArrive/index.php`
4. `GET /TransitView/index.php`
5. `GET /TransitViewAll/index.php`
6. `GET /BusDetours/index.php`
7. `GET /Alerts/index.php`
8. `GET /Alerts/get_alert_data.php`
9. `GET /elevator/index.php`
10. `GET /RRSchedules/index.php`
11. `GET /BusSchedules/index.php`
12. `GET /sms/index.php`
13. `GET /Stops/index.php`
14. `GET /locations/get_locations.php`
15. `GET /developer/gtfs_public.zip`
16. `GET /gtfsrt/septa-pa-us/Service/print.php`
17. `GET /gtfsrt/septarail-pa-us/Service/print.php`
18. `GET /gtfsrt/septa-pa-us/Trip/print.php`
19. `GET /gtfsrt/septarail-pa-us/Trip/print.php`
20. `GET /gtfsrt/septa-pa-us/Vehicle/print.php`
21. `GET /gtfsrt/septarail-pa-us/Vehicle/print.php`
22. `GET /gtfsrt/septa-pa-us/Service/rtServiceAlerts.pb`
23. `GET /gtfsrt/septarail-pa-us/Service/rtServiceAlerts.pb`
24. `GET /gtfsrt/septa-pa-us/Trip/rtTripUpdates.pb`
25. `GET /gtfsrt/septarail-pa-us/Trip/rtTripUpdates.pb`
26. `GET /gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb`
27. `GET /gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb`

## Common request and response notes
- Routes `1` through `14` sit under the Swagger-declared base URL `https://www3.septa.org/api`.
- Route `15` is a direct static GTFS ZIP download published under `https://www3.septa.org/developer`.
- Routes `16` through `27` are published under `https://www3.septa.org/gtfsrt`.
- All confirmed routes are `GET` endpoints / feeds.
- The public API documentation emphasizes JSON payloads for most routes, but `/sms/index.php` returns plain text and the raw GTFS-RT feeds return protobuf.
- The GTFS-RT preview `print.php` routes are not full feed replacements; SEPTA explicitly tells developers to use the linked protobuf files for complete datasets.

## 1) Regional Rail station arrivals and departures
- Method: `GET`
- Path: `/Arrivals/index.php`
- Full URL: `https://www3.septa.org/api/Arrivals/index.php`
- Purpose: return upcoming regional-rail arrivals / departures at a station, grouped by northbound and southbound service

Documented parameters:
- `station` - required query parameter; regional-rail station name
- `results` - optional query parameter; number of results to show
- `direction` - optional query parameter; values `N` or `S` for northbound / southbound trains

Documented response notes:
- JSON response
- Swagger example groups data under `Northbound` and `Southbound`
- Official description explains direction naming relative to SEPTA's historic railroad orientation and points to `VIRegionalRail.html` for valid station names

## 2) List all regional-rail trains
- Method: `GET`
- Path: `/TrainView/index.php`
- Full URL: `https://www3.septa.org/api/TrainView/index.php`
- Purpose: list all regional-rail trains currently on the system

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON array response
- Example fields include `lat`, `lon`, `trainno`, `service`, `dest`, `currentstop`, `nextstop`, `line`, `consist`, `heading`, `late`, `SOURCE`, `TRACK`, and `TRACK_CHANGE`

## 3) Regional Rail next-to-arrive lookup
- Method: `GET`
- Path: `/NextToArrive/index.php`
- Full URL: `https://www3.septa.org/api/NextToArrive/index.php`
- Purpose: return departure / arrival combinations between two different regional-rail stations

Documented parameters:
- `req1` - required query parameter; SEPTA leaves the name generic in Swagger; description says the endpoint works between two station inputs
- `req2` - required query parameter; second station input according to the route description
- `req3` - optional query parameter; Swagger exposes it as an integer without a clearer label on the public page

Documented response notes:
- JSON array response
- Example fields include `orig_train`, `orig_line`, `orig_departure_time`, `orig_arrival_time`, `orig_delay`, `term_train`, `term_line`, `term_depart_time`, `term_arrival_time`, `Connection`, `term_delay`, and `isdirect`
- Official description points to `VIRegionalRail.html` for valid station inputs

## 4) Bus / trolley vehicle locations by route
- Method: `GET`
- Path: `/TransitView/index.php`
- Full URL: `https://www3.septa.org/api/TransitView/index.php`
- Purpose: return bus and trolley vehicle locations for a specific route

Documented parameters:
- `route` - required query parameter; bus or trolley route identifier

Documented response notes:
- JSON object response
- Example `bus` entries include `lat`, `lng`, `label`, `trip`, `VehicleID`, `BlockID`, `Direction`, `destination`, `heading`, `late`, `next_stop_id`, `next_stop_name`, `next_stop_sequence`, `estimated_seat_availability`, `Offset`, `Offset_sec`, and `timestamp`
- Official description points to `VIBusAndTrolley.html` for valid route inputs

## 5) All bus / trolley vehicle locations
- Method: `GET`
- Path: `/TransitViewAll/index.php`
- Full URL: `https://www3.septa.org/api/TransitViewAll/index.php`
- Purpose: return all bus and trolley vehicle locations

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON object response
- Example groups output under `routes`, then per-route vehicle arrays with location, direction, seat-availability, and timestamp fields

## 6) Bus / trolley detours by route
- Method: `GET`
- Path: `/BusDetours/index.php`
- Full URL: `https://www3.septa.org/api/BusDetours/index.php`
- Purpose: return bus and trolley detours, optionally filtered by route

Documented parameters:
- `req1` - optional query parameter; Swagger keeps the generic name, while the route description says the endpoint returns detours by route

Documented response notes:
- JSON array response
- Example includes `route_id` and nested `route_info` records with `route_direction`, `reason`, `start_location`, `end_location`, `start_date_time`, `end_date_time`, and `current_message`
- Official description points to `VIBusAndTrolley.html` for valid route inputs

## 7) Route alerts summary
- Method: `GET`
- Path: `/Alerts/index.php`
- Full URL: `https://www3.septa.org/api/Alerts/index.php`
- Purpose: return alert flags for bus and trolley routes

Documented parameters:
- `routes` - optional query parameter; route filter

Documented response notes:
- JSON array response
- Example includes route metadata plus many alert flags such as `isadvisory`, `isdetour`, `isalert`, `issuspended`, `isstrike`, `ismodifiedservice`, `isdelays`, `isdiversion`, and `isSnow`
- The description says route IDs can be obtained from the linked official input references

## 8) Route alerts with message content
- Method: `GET`
- Path: `/Alerts/get_alert_data.php`
- Full URL: `https://www3.septa.org/api/Alerts/get_alert_data.php`
- Purpose: return alert message details for a route

Documented parameters:
- `route_id` - optional query parameter; route identifier filter

Documented response notes:
- JSON array response
- Example fields include `route_id`, `route_name`, `current_message`, `advisory_id`, `advisory_message`, `detour_message`, `detour_start_location`, `detour_start_date_time`, `detour_end_date_time`, `detour_reason`, `last_updated`, and `isSnow`

## 9) Elevator outages
- Method: `GET`
- Path: `/elevator/index.php`
- Full URL: `https://www3.septa.org/api/elevator/index.php`
- Purpose: return current elevator outage information

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON object response
- Example includes top-level `meta` with `elevators_out` and `updated`, plus `results` entries with `line`, `station`, `elevator`, `message`, and `message_html`

## 10) Regional Rail schedules by train number
- Method: `GET`
- Path: `/RRSchedules/index.php`
- Full URL: `https://www3.septa.org/api/RRSchedules/index.php`
- Purpose: return schedule stops for a train number

Documented parameters:
- `req1` - required query parameter; Swagger keeps the generic name, while the description says the value is the train number

Documented response notes:
- JSON array response
- Example fields include `station`, `sched_tm`, `est_tm`, and `act_tm`
- Official description tells users to check SEPTA GTFS data for train numbers

## 11) Bus / trolley schedules by stop
- Method: `GET`
- Path: `/BusSchedules/index.php`
- Full URL: `https://www3.septa.org/api/BusSchedules/index.php`
- Purpose: return scheduled bus / trolley stop times for a stop

Documented parameters:
- `stop_id` - required query parameter; integer stop identifier

Documented response notes:
- JSON object response
- Example schedule entries include `StopName`, `Route`, `date`, `day`, `Direction`, `DateCalender`, and `DirectionDesc`

## 12) SMS-style bus / trolley schedules
- Method: `GET`
- Path: `/sms/index.php`
- Full URL: `https://www3.septa.org/api/sms/index.php`
- Purpose: return bus / trolley stop schedule times in SMS-friendly text format

Documented parameters:
- `req1` - required query parameter; Swagger keeps the generic name
- `req2` - optional query parameter
- `req3` - optional query parameter
- `req4` - optional query parameter
- `req5` - optional query parameter

Documented response notes:
- Plain-text string response
- Official description says the endpoint uses `stop_id`, `route`, and/or `direction`, but the public Swagger page does not map those labels onto the generic `req1`-`req5` parameter names

## 13) Stops by route
- Method: `GET`
- Path: `/Stops/index.php`
- Full URL: `https://www3.septa.org/api/Stops/index.php`
- Purpose: return bus / trolley stop locations for a route

Documented parameters:
- `req1` - required query parameter; Swagger keeps the generic name, while the description says the endpoint returns stop locations by route

Documented response notes:
- JSON array response
- Example fields include `lng`, `lat`, `stopid`, and `stopname`

## 14) Nearby SEPTA system locations
- Method: `GET`
- Path: `/locations/get_locations.php`
- Full URL: `https://www3.septa.org/api/locations/get_locations.php`
- Purpose: return SEPTA locations near a geographic point within a radius measured in miles

Documented parameters:
- `lon` - required query parameter; longitude
- `lat` - required query parameter; latitude
- `type` - optional query parameter; location type filter
- `radius` - optional query parameter; integer radius in miles

Documented response notes:
- JSON array response
- Example includes `location_id`, `location_name`, `location_lat`, `location_lon`, `distance`, `loction_type`, and nested `location_data`

## 15) Download static GTFS schedule bundle
- Method: `GET`
- Path: `/developer/gtfs_public.zip`
- Full URL: `https://www3.septa.org/developer/gtfs_public.zip`
- Purpose: download SEPTA's static GTFS ZIP bundle

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is a ZIP archive
- The Swagger page links this file directly from the `GTFS Data` section

## 16) Human-readable GTFS bus alerts preview
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Service/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Service/print.php`
- Purpose: return a human-readable preview of the bus / trolley GTFS-Realtime alerts feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime alert structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septa-pa-us/Service/rtServiceAlerts.pb`

## 17) Human-readable GTFS regional-rail alerts preview
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Service/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Service/print.php`
- Purpose: return a human-readable preview of the regional-rail GTFS-Realtime alerts feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime alert structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septarail-pa-us/Service/rtServiceAlerts.pb`

## 18) Human-readable GTFS bus trip-updates preview
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Trip/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Trip/print.php`
- Purpose: return a human-readable preview of the bus / trolley GTFS-Realtime trip-updates feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime trip-update structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septa-pa-us/Trip/rtTripUpdates.pb`

## 19) Human-readable GTFS regional-rail trip-updates preview
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Trip/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Trip/print.php`
- Purpose: return a human-readable preview of the regional-rail GTFS-Realtime trip-updates feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime trip-update structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septarail-pa-us/Trip/rtTripUpdates.pb`

## 20) Human-readable GTFS bus vehicle-positions preview
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Vehicle/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Vehicle/print.php`
- Purpose: return a human-readable preview of the bus / trolley GTFS-Realtime vehicle-positions feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime vehicle-position structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb`

## 21) Human-readable GTFS regional-rail vehicle-positions preview
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Vehicle/print.php`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Vehicle/print.php`
- Purpose: return a human-readable preview of the regional-rail GTFS-Realtime vehicle-positions feed

Documented parameters:
- None documented on the public Swagger page

Documented response notes:
- JSON response mirroring GTFS-Realtime vehicle-position structure
- SEPTA says this route shows only the top five results
- The same docs link the full protobuf feed at `https://www3.septa.org/gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb`

## 22) Raw GTFS-Realtime bus alerts protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Service/rtServiceAlerts.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Service/rtServiceAlerts.pb`
- Purpose: download the complete bus / trolley GTFS-Realtime alerts feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `16`

## 23) Raw GTFS-Realtime regional-rail alerts protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Service/rtServiceAlerts.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Service/rtServiceAlerts.pb`
- Purpose: download the complete regional-rail GTFS-Realtime alerts feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `17`

## 24) Raw GTFS-Realtime bus trip-updates protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Trip/rtTripUpdates.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Trip/rtTripUpdates.pb`
- Purpose: download the complete bus / trolley GTFS-Realtime trip-updates feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `18`

## 25) Raw GTFS-Realtime regional-rail trip-updates protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Trip/rtTripUpdates.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Trip/rtTripUpdates.pb`
- Purpose: download the complete regional-rail GTFS-Realtime trip-updates feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `19`

## 26) Raw GTFS-Realtime bus vehicle-positions protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb`
- Purpose: download the complete bus / trolley GTFS-Realtime vehicle-positions feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `20`

## 27) Raw GTFS-Realtime regional-rail vehicle-positions protobuf feed
- Method: `GET`
- Path: `/gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb`
- Full URL: `https://www3.septa.org/gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb`
- Purpose: download the complete regional-rail GTFS-Realtime vehicle-positions feed in protobuf format

Documented parameters:
- None documented on the inspected public pages

Documented response notes:
- Response is protobuf
- The official Swagger description links this file as the complete feed corresponding to route `21`

## Sources inspected
- `https://www3.septa.org/`
- `https://www3.septa.org/VIRegionalRail.html`
- `https://www3.septa.org/VIBusAndTrolley.html`
- `https://www3.septa.org/developer/gtfs_public.zip`
- GTFS-Realtime raw feed links surfaced directly from the official Swagger page:
  - `https://www3.septa.org/gtfsrt/septa-pa-us/Service/rtServiceAlerts.pb`
  - `https://www3.septa.org/gtfsrt/septarail-pa-us/Service/rtServiceAlerts.pb`
  - `https://www3.septa.org/gtfsrt/septa-pa-us/Trip/rtTripUpdates.pb`
  - `https://www3.septa.org/gtfsrt/septarail-pa-us/Trip/rtTripUpdates.pb`
  - `https://www3.septa.org/gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb`
  - `https://www3.septa.org/gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb`
