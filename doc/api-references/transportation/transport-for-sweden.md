# Transport for Sweden

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-sweden`
- Official docs used manually:
  - `https://www.trafiklab.se/api`
  - `https://www.trafiklab.se/api/our-apis/trafiklab-realtime-apis/`
  - `https://www.trafiklab.se/api/our-apis/trafiklab-realtime-apis/openapi-specification/`
- Base URL: `https://realtime-api.trafiklab.se/v1`
- Authentication: API key passed as the required `key` query parameter on every confirmed route
- Primary response format: JSON
- Transport scope documented here: Trafiklab realtime APIs for stop lookup, departure boards, arrival boards, and trip details across Sweden

## Important official usage notes
- The official Trafiklab overview page describes Trafiklab realtime APIs as a collection of APIs for public transport in all of Sweden.
- Trafiklab says these APIs are developed internally on top of its GTFS Sweden 3 data and are intended for direct consumption in apps, widgets, signage, and similar products.
- The provider explicitly positions these APIs as a replacement for ResRobot 2.1 timetables and stop lookup, with more detailed data including platforms and realtime information.
- The docs say route planning should use the separate ResRobot APIs rather than these realtime endpoints.
- The API is licensed under `CC-BY 4.0`; Trafiklab says consumers should include attribution such as `data from Trafiklab.se` on public displays or website widgets.
- The official OpenAPI page exposes 7 authenticated GET routes under one server URL.

## Rate limits, pagination, and errors
The official Trafiklab realtime API page publishes these key tiers:

| Level | Maximum calls per minute | Maximum calls per month | Example usage |
|---|---:|---:|---|
| Bronze | 25 | 100,000 | Departure boards for 2 stops |
| Bronze+ | 25 | 500,000 | Departure boards for 10 stops |
| Silver | 150 | 5,000,000 | Departure boards for 100 stops, mobile apps |
| Gold | 1,200 | 50,000,000 | Departure boards for 2,000 stops updated every other minute, mobile apps |
| Platinum | 3,000 | 125,000,000 | Departure boards for 5,000 stops updated every other minute, mobile apps |

Additional official notes:
- One Trafiklab API key is used for all features in Trafiklab realtime APIs.
- No page-number, cursor, `limit`, or `offset` pagination is documented for the confirmed routes.
- The inspected OpenAPI document only publishes `200` success responses for the confirmed routes.
- No structured non-200 error schema or numeric backoff guidance is published on the inspected realtime-API pages.

## Confirmed API surface
The official OpenAPI document currently exposes 7 routes:
1. `GET /stops/name/{searchValue}`
2. `GET /stops/list`
3. `GET /departures/{stopId}`
4. `GET /departures/{stopId}/{dateTime}`
5. `GET /arrivals/{stopId}`
6. `GET /arrivals/{stopId}/{dateTime}`
7. `GET /trips/{tripId}/{startDate}`

## Common request and response notes
- All confirmed routes are secured with the `key` query parameter.
- All confirmed responses are documented as `application/json`.
- The top-level response models all include a `timestamp` field and `queryDetails` object.
- Departure and arrival responses include `stops` plus `departures` or `arrivals` arrays.
- Timetable entries can include scheduled and realtime timestamps, delay values in seconds, cancellation flags, route/trip/agency/stop objects, scheduled and realtime platform details, alerts, and an `is_realtime` flag.
- Stop lookup responses return `stopGroups`, with group IDs, names, group type, transport modes, and underlying stop members.
- Trip-detail responses return agency, route, trip, and ordered `calls` covering all departures and arrivals for the trip.

## 1) Search stop groups by name
- Method: `GET`
- Path: `/stops/name/{searchValue}`
- Full URL: `https://realtime-api.trafiklab.se/v1/stops/name/{searchValue}`
- Purpose: return stop groups whose names match the supplied search text, sorted by most frequent daily departures

Documented parameters:
- `searchValue` - required path string; stop-group name search term; minimum length `3`
- `key` - required query string API key

Documented response notes:
- Returns `NationalStopGroupResponse`
- The response includes `timestamp`, `queryDetails`, and `stopGroups`

## 2) List all stop groups
- Method: `GET`
- Path: `/stops/list`
- Full URL: `https://realtime-api.trafiklab.se/v1/stops/list`
- Purpose: return all stop groups in Sweden, sorted by most frequent daily departures

Documented parameters:
- `key` - required query string API key

Documented response notes:
- Returns `NationalStopGroupResponse`
- Each stop group includes `id`, `name`, `group_type`, `transport_modes`, and `stops`

## 3) Get current departures for a stop
- Method: `GET`
- Path: `/departures/{stopId}`
- Full URL: `https://realtime-api.trafiklab.se/v1/departures/{stopId}`
- Purpose: retrieve current departure information for a specific stop

Documented parameters:
- `stopId` - required path string stop identifier, example: `740020101`
- `key` - required query string API key

Documented response notes:
- Returns `DeparturesResponse`
- Includes `stops` plus a `departures` array of `TimetableEntry` objects

## 4) Get departures for a stop at a specific time
- Method: `GET`
- Path: `/departures/{stopId}/{dateTime}`
- Full URL: `https://realtime-api.trafiklab.se/v1/departures/{stopId}/{dateTime}`
- Purpose: retrieve departure information for a specific stop and time

Documented parameters:
- `stopId` - required path string stop identifier
- `dateTime` - required path string in ISO 8601 date-time format, example: `2025-03-31T16:30`
- `key` - required query string API key

Documented response notes:
- Returns `DeparturesResponse`
- The OpenAPI description says this route queries a specific stop and time rather than the current moment

## 5) Get current arrivals for a stop
- Method: `GET`
- Path: `/arrivals/{stopId}`
- Full URL: `https://realtime-api.trafiklab.se/v1/arrivals/{stopId}`
- Purpose: retrieve current arrival information for a specific stop

Documented parameters:
- `stopId` - required path string stop identifier
- `key` - required query string API key

Documented response notes:
- Returns `ArrivalsResponse`
- Includes `stops` plus an `arrivals` array of `TimetableEntry` objects

## 6) Get arrivals for a stop at a specific time
- Method: `GET`
- Path: `/arrivals/{stopId}/{dateTime}`
- Full URL: `https://realtime-api.trafiklab.se/v1/arrivals/{stopId}/{dateTime}`
- Purpose: retrieve arrival information for a specific stop and time

Documented parameters:
- `stopId` - required path string stop identifier
- `dateTime` - required path string in ISO 8601 date-time format, example: `2025-03-31T16:30`
- `key` - required query string API key

Documented response notes:
- Returns `ArrivalsResponse`
- The response mirrors the departure board structure, but the primary array is `arrivals`

## 7) Get trip details
- Method: `GET`
- Path: `/trips/{tripId}/{startDate}`
- Full URL: `https://realtime-api.trafiklab.se/v1/trips/{tripId}/{startDate}`
- Purpose: retrieve the full ordered call list for a specific trip

Documented parameters:
- `tripId` - required path string trip identifier; the docs say it can be obtained from departures/arrivals responses or from GTFS Sweden 3 static or realtime data
- `startDate` - required path string in `yyyy-MM-dd` or `yyyyMMdd` format, examples: `2025-03-31` or `20250331`
- `key` - required query string API key

Documented response notes:
- Returns `TripDetailsResponse`
- Includes `agency`, `route`, `trip`, and an ordered `calls` array with scheduled/realtime departures and arrivals, delays, cancellation flags, platform information, and alerts

## Sources inspected
- `https://www.trafiklab.se/api`
- `https://www.trafiklab.se/api/our-apis/trafiklab-realtime-apis/`
- `https://www.trafiklab.se/api/our-apis/trafiklab-realtime-apis/openapi-specification/`
