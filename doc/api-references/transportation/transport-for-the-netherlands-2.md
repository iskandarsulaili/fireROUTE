# Transport for The Netherlands

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-the-netherlands-2`
- Official docs used manually:
  - `https://github.com/skywave/KV78Turbo-OVAPI/wiki`
  - `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/TimingPointCode`
  - `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/StopAreaCode`
  - `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Line`
  - `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Journey`
  - `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Passtime`
- Base URL: `http://v0.ovapi.nl`
- Authentication: none documented
- Primary response format: JSON
- Transport scope documented here: OVAPI / KV78Turbo realtime Dutch public-transport passtimes, stop areas, lines, and journeys

## Important official usage notes
- The wiki home page says the REST API is offered on `http://v0.ovapi.nl/`.
- The docs describe KV78Turbo as being built on passtimes: expected times at which a timing point is passed.
- The official etiquette section says requests for multiple objects should use comma-separated lists in one request instead of many separate calls.
- The official docs recommend gzip compression and an explicit `User-Agent` header.
- The wiki warns consumers not to request too much data and says heavy users should request an OpenOV KV78Turbo license and run the code themselves.
- For most operators, the GOVI license conditions apply: data must not be stored for more than 30 minutes and is not suitable for operator-performance analysis. The docs say this specific restriction does not apply to `GVB`, `HTM`, and `Veolia Haaglanden`.
- The Passtime page documents field-level semantics such as `TripStopStatus`, `JourneyStopType`, accessibility flags, disruption fields, and realtime/scheduled timestamps used throughout the endpoint responses.

## Rate limits, pagination, and errors
- No numeric rate-limit or quota table is published in the inspected official wiki pages.
- No pagination parameters are documented for any confirmed route.
- `TimingPointCode` and `StopAreaCode` pages explicitly say HTTP `404` means the server does not recognize the requested code.
- The docs do not publish a shared structured error schema beyond those route-specific `404` notes.
- The etiquette guidance functions as the main usage control: batch related lookups, gzip responses, and avoid high-frequency polling.

## Confirmed API surface
The official wiki currently documents 14 GET routes/patterns:
1. `GET /tpc/`
2. `GET /tpc/{timingpointcode}`
3. `GET /tpc/{timingpointcode}/departures`
4. `GET /tpc/{timingpointcode1},{timingpointcode2},...`
5. `GET /stopareacode/`
6. `GET /stopareacode/{stopareacode}`
7. `GET /stopareacode/{stopareacode}/departures`
8. `GET /stopareacode/{stopareacode1},{stopareacode2},...`
9. `GET /line/`
10. `GET /line/{DataOwnerCode}_{LinePlanningNumber}_{LineDirection}`
11. `GET /line/{linekey1},{linekey2},...`
12. `GET /journey/`
13. `GET /journey/{DataOwnerCode}_{LocalServiceLevelCode}_{LinePlanningNumber}_{JourneyNumber}_{FortifyOrderNumber}`
14. `GET /journey/{journeykey1},{journeykey2},...`

## Common request and response notes
- All confirmed routes are documented as read-only `GET` requests.
- All confirmed examples return JSON objects keyed by domain identifiers rather than arrays.
- Timing point, stop-area, line, and journey collection routes return only objects processed within the current API uptime.
- Batch routes use comma-separated composite keys directly in the path rather than repeated query parameters.
- The docs repeatedly note that several fields are optional because they depend on static timetable data from Koppelvlak 7.
- Common passtime-related fields documented in the Passtime page include `TransportType`, `DestinationName50`, `LinePlanningNumber`, `ExpectedDepartureTime`, `ExpectedArrivalTime`, `TargetDepartureTime`, `TargetArrivalTime`, `TripStopStatus`, `JourneyStopType`, `StopAreaCode`, `NumberOfCoaches`, disruption fields, and accessibility flags.
- `TransportType` is documented as an enum with values such as `BUS`, `TRAIN`, `METRO`, `TRAM`, and `BOAT`.

## 1) List known timing point codes
- Method: `GET`
- Path: `/tpc/`
- Full URL: `http://v0.ovapi.nl/tpc/`
- Purpose: return timing points processed during the current API uptime, with the value per key representing the number of stored passes

Documented parameters:
- None

Documented response notes:
- Returns a JSON object keyed by timing-point code
- Values are integer pass counts

## 2) Get timing point details and passes
- Method: `GET`
- Path: `/tpc/{timingpointcode}`
- Full URL: `http://v0.ovapi.nl/tpc/{timingpointcode}`
- Purpose: return passes, general passenger messages, and optional stop metadata for one timing point

Documented parameters:
- `timingpointcode` - required path string; unique identifier for a single bus stop sign or virtual timing point; docs say it is a string of 10 characters and may begin with zeroes

Documented response notes:
- Returns an object keyed by timing-point code
- Each object can include `Passes`, `GeneralMessages`, and optional `Stop`
- `Stop` can include latitude, longitude, timing-point name, town, and `StopAreaCode`
- HTTP `404` means the server does not recognize the timing-point code

## 3) Get timing point departures only
- Method: `GET`
- Path: `/tpc/{timingpointcode}/departures`
- Full URL: `http://v0.ovapi.nl/tpc/{timingpointcode}/departures`
- Purpose: return departures, messages, and stop metadata for one timing point without the broader all-passes view

Documented parameters:
- `timingpointcode` - required path string timing-point identifier

Documented response notes:
- Response structure mirrors the timing-point detail route but the docs describe the payload as departures-focused
- HTTP `404` means the timing point is unknown

## 4) Batch timing point lookup
- Method: `GET`
- Path: `/tpc/{timingpointcode1},{timingpointcode2},...`
- Full URL: `http://v0.ovapi.nl/tpc/{timingpointcode1},{timingpointcode2},...`
- Purpose: request multiple timing points in one call using a comma-separated list

Documented parameters:
- `timingpointcode1},{timingpointcode2},...` - required comma-separated list of timing-point codes in the path

Documented response notes:
- Returns one top-level object entry per requested timing point
- The docs explicitly call this the preferred way to reduce server workload

## 5) List known stop-area codes
- Method: `GET`
- Path: `/stopareacode/`
- Full URL: `http://v0.ovapi.nl/stopareacode/`
- Purpose: return stop areas processed during the current API uptime

Documented parameters:
- None

Documented response notes:
- Returns a JSON object keyed by stop-area code
- Each value includes stop-area metadata such as latitude, longitude, name, town, and `StopAreaCode`

## 6) Get stop-area timing points and passes
- Method: `GET`
- Path: `/stopareacode/{stopareacode}`
- Full URL: `http://v0.ovapi.nl/stopareacode/{stopareacode}`
- Purpose: return all timing points and passes within a stop area

Documented parameters:
- `stopareacode` - required path string; docs describe it as a string with a maximum of 10 characters

Documented response notes:
- Returns a JSON object keyed first by stop-area code and then by timing-point code
- Timing-point entries contain pass collections
- HTTP `404` means the stop-area code is unknown

## 7) Get stop-area departures only
- Method: `GET`
- Path: `/stopareacode/{stopareacode}/departures`
- Full URL: `http://v0.ovapi.nl/stopareacode/{stopareacode}/departures`
- Purpose: return all timing points and departures within a stop area

Documented parameters:
- `stopareacode` - required path string stop-area identifier

Documented response notes:
- Response structure is stop-area keyed like the non-departures variant
- The docs describe this route as departures-focused rather than all passes

## 8) Batch stop-area lookup
- Method: `GET`
- Path: `/stopareacode/{stopareacode1},{stopareacode2},...`
- Full URL: `http://v0.ovapi.nl/stopareacode/{stopareacode1},{stopareacode2},...`
- Purpose: request multiple stop areas in one call using a comma-separated list

Documented parameters:
- `stopareacode1},{stopareacode2},...` - required comma-separated list of stop-area codes in the path

Documented response notes:
- Returns one top-level object entry per requested stop area
- The docs explicitly say this batching pattern is preferred to keep server workload low

## 9) List known lines
- Method: `GET`
- Path: `/line/`
- Full URL: `http://v0.ovapi.nl/line/`
- Purpose: list lines processed during the current API uptime

Documented parameters:
- None

Documented response notes:
- Returns a JSON object keyed by composite line key such as `VTN_1_1`
- Line values can include `TransportType`, `LineName`, `LinePublicNumber`, `DataOwnerCode`, `DestinationName50`, `LinePlanningNumber`, and `LineDirection`

## 10) Get line details, actuals, and network stops
- Method: `GET`
- Path: `/line/{DataOwnerCode}_{LinePlanningNumber}_{LineDirection}`
- Full URL: `http://v0.ovapi.nl/line/{DataOwnerCode}_{LinePlanningNumber}_{LineDirection}`
- Purpose: return realtime actuals, the timing points along the line, and line metadata

Documented parameters:
- `DataOwnerCode` - required path component; supplier / data owner code
- `LinePlanningNumber` - required path component; line identifier; docs say line public number and line planning number are both strings
- `LineDirection` - required path component; direction discriminator for the line

Documented response notes:
- Response includes `Actuals`, `Network`, and `Line`
- `Actuals` are the passes closest to vehicles currently driving the route
- `TripStopStatus` can indicate `PLANNED`, `DRIVING`, `PASSED`, or `ARRIVED`
- Network stops can include `IsTimingStop`, `UserStopOrderNumber`, coordinates, stop-area code, town, name, and timing-point code

## 11) Batch line lookup
- Method: `GET`
- Path: `/line/{linekey1},{linekey2},...`
- Full URL: `http://v0.ovapi.nl/line/{linekey1},{linekey2},...`
- Purpose: request multiple lines in one call using comma-separated composite line keys

Documented parameters:
- `linekey1},{linekey2},...` - required comma-separated list of line keys in the form `DataOwnerCode_LinePlanningNumber_LineDirection`

Documented response notes:
- Returns one top-level object entry per requested line
- Each line entry mirrors the single-line response with `Actuals`, `Network`, and `Line`

## 12) List known journeys
- Method: `GET`
- Path: `/journey/`
- Full URL: `http://v0.ovapi.nl/journey/`
- Purpose: return currently planned or currently driving journeys and the number of stops in each

Documented parameters:
- None

Documented response notes:
- Returns a JSON object keyed by journey key such as `CXX_92440_E080_4048_0`
- Values are integer counts of stops in the journey

## 13) Get journey stop collection
- Method: `GET`
- Path: `/journey/{DataOwnerCode}_{LocalServiceLevelCode}_{LinePlanningNumber}_{JourneyNumber}_{FortifyOrderNumber}`
- Full URL: `http://v0.ovapi.nl/journey/{DataOwnerCode}_{LocalServiceLevelCode}_{LinePlanningNumber}_{JourneyNumber}_{FortifyOrderNumber}`
- Purpose: return the remaining stops and, when applicable, the two last passed stops for a vehicle journey

Documented parameters:
- `DataOwnerCode` - required path component supplier code
- `LocalServiceLevelCode` - required path component validity vector used internally to define whether a passtime is valid on the operation date
- `LinePlanningNumber` - required path component line identifier
- `JourneyNumber` - required path component trip number for the nth journey on the line
- `FortifyOrderNumber` - required path component; extra-capacity journey discriminator; `0` when not a fortification journey

Documented response notes:
- The wiki prose contains a `%JourneyNumber` typo, but the examples and returned keys consistently use underscore-separated composite journey keys
- Returns a top-level object keyed by journey key containing a `Stops` object
- `TripStopStatus` can include `CANCEL`, and the docs note that cancellations can later revert to `DRIVING`

## 14) Batch journey lookup
- Method: `GET`
- Path: `/journey/{journeykey1},{journeykey2},...`
- Full URL: `http://v0.ovapi.nl/journey/{journeykey1},{journeykey2},...`
- Purpose: request multiple journeys in one call using comma-separated journey keys

Documented parameters:
- `journeykey1},{journeykey2},...` - required comma-separated list of composite journey keys

Documented response notes:
- Returns one top-level object entry per requested journey
- The docs explicitly recommend batching related journey requests to reduce server load

## Sources inspected
- `https://github.com/skywave/KV78Turbo-OVAPI/wiki`
- `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/TimingPointCode`
- `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/StopAreaCode`
- `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Line`
- `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Journey`
- `https://github.com/koch-t/KV78Turbo-OVAPI/wiki/Passtime`
