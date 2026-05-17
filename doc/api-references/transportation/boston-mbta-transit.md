# Boston MBTA Transit

## Provider metadata
- Category: `Transportation`
- Provider slug: `boston-mbta-transit`
- Official docs used manually:
  - `https://www.mbta.com/developers/v3-api`
  - `https://api-v3.mbta.com/docs/swagger/index.html`
  - `https://api-v3.mbta.com/docs/swagger/swagger.json`
- Base URL: `https://api-v3.mbta.com`
- Authentication: optional but strongly encouraged API key via `x-api-key` header or `api_key` query parameter; the official docs say requests without a key are tracked by IP address and get a stricter rate limit
- Primary response format: JSON:API over `application/json`
- Transport scope: MBTA GTFS, GTFS Realtime, and MBTA-specific service data for alerts, facilities, lines, predictions, routes, route patterns, schedules, services, shapes, stops, stop events, trips, vehicles, and live facility status

## Important official usage notes
- The MBTA V3 API page says a valid API key is required to make the default `1,000 requests per minute`, and the same key controls version and stream requests.
- The official V3 page states that the API uses the `JSON:API` format.
- The official Swagger UI currently exposes 26 GET routes.
- Most collection routes support JSON:API-style sparse fieldsets (`fields[...]`), relationship expansion (`include`), pagination (`page[offset]`, `page[limit]`), sorting (`sort`), and comma-separated filter values.
- The Swagger UI marks both `GET /stop_events` and `GET /stop_events/{id}` as `experimental`.
- The Swagger descriptions repeatedly note that many `filter[...]` values must be comma-separated lists.

## Rate limits, pagination, and errors
- Official rate-limit guidance from the MBTA V3 docs: a valid key is required for the default `1,000 requests per minute`.
- The Swagger security descriptions say responses expose rate-limit headers: `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`.
- Without an API key, requests are tracked by IP address and have a stricter rate limit.
- Collection routes commonly use `page[offset]` and `page[limit]` for pagination.
- The Swagger definitions publish JSON:API error documents for `400 BadRequest`, `403 Forbidden`, `404 NotFound`, `406 NotAcceptable`, and `429 TooManyRequests`.
- The official `NotAcceptable` example specifically mentions invalid `Accept` headers such as unsupported `text/event-stream` usage on non-stream requests.

## Confirmed API surface
The official Swagger spec currently exposes 26 routes:
1. `GET /alerts`
2. `GET /alerts/{id}`
3. `GET /facilities`
4. `GET /facilities/{id}`
5. `GET /lines`
6. `GET /lines/{id}`
7. `GET /live_facilities`
8. `GET /live_facilities/{id}`
9. `GET /predictions`
10. `GET /route_patterns`
11. `GET /route_patterns/{id}`
12. `GET /routes`
13. `GET /routes/{id}`
14. `GET /schedules`
15. `GET /services`
16. `GET /services/{id}`
17. `GET /shapes`
18. `GET /shapes/{id}`
19. `GET /stop_events`
20. `GET /stop_events/{id}`
21. `GET /stops`
22. `GET /stops/{id}`
23. `GET /trips`
24. `GET /trips/{id}`
25. `GET /vehicles`
26. `GET /vehicles/{id}`

## Common request and response notes
- All confirmed operations are `GET` routes.
- Single-resource routes use an `id` path parameter for resource lookup; MBTA uses resource IDs such as alert IDs, route IDs, stop IDs, trip IDs, facility IDs, and vehicle IDs.
- Collection routes commonly allow `sort`, `page[offset]`, `page[limit]`, sparse fieldsets, and `include` expansions.
- Most relationship-expansion parameters are resource-specific and documented directly in the Swagger spec.
- Responses are modeled as JSON:API resources/documents, while error responses are also documented as JSON:API error documents.

## Route details

### 1) Alerts collection
- Method: `GET`
- Path: `/alerts`
- Full URL: `https://api-v3.mbta.com/alerts`
- Purpose: list rider-facing alert records
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[alert]`, `include`
- Key filters: `filter[activity]`, `filter[route_type]`, `filter[direction_id]`, `filter[route]`, `filter[stop]`, `filter[trip]`, `filter[facility]`, `filter[id]`, `filter[banner]`, `filter[datetime]`, `filter[lifecycle]`, `filter[severity]`
- Responses documented: `200`, `400`, `403`, `429`

### 2) Alert by ID
- Method: `GET`
- Path: `/alerts/{id}`
- Full URL: `https://api-v3.mbta.com/alerts/{id}`
- Purpose: fetch one alert resource
- Parameters: required path `id`, optional `fields[alert]`, optional `include`
- Responses documented: `200`, `400`, `403`, `404`, `406`, `429`

### 3) Facilities collection
- Method: `GET`
- Path: `/facilities`
- Full URL: `https://api-v3.mbta.com/facilities`
- Purpose: list station/stop facilities such as elevators, escalators, bike racks, or parking-related amenities
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[facility]`, `include`
- Key filters: `filter[stop]`, `filter[type]`
- Responses documented: `200`, `400`, `403`, `429`

### 4) Facility by ID
- Method: `GET`
- Path: `/facilities/{id}`
- Full URL: `https://api-v3.mbta.com/facilities/{id}`
- Purpose: fetch one facility resource
- Parameters: required path `id`, optional `fields[facility]`, optional `include`
- Responses documented: `200`, `403`, `404`, `406`, `429`

### 5) Lines collection
- Method: `GET`
- Path: `/lines`
- Full URL: `https://api-v3.mbta.com/lines`
- Purpose: list MBTA lines
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[line]`, `include`
- Key filters: `filter[id]`
- Responses documented: `200`, `400`, `403`, `429`

### 6) Line by ID
- Method: `GET`
- Path: `/lines/{id}`
- Full URL: `https://api-v3.mbta.com/lines/{id}`
- Purpose: fetch one line resource
- Parameters: required path `id`, optional `fields[line]`, optional `include`
- Responses documented: `200`, `400`, `403`, `404`, `406`, `429`

### 7) Live facilities collection
- Method: `GET`
- Path: `/live_facilities`
- Full URL: `https://api-v3.mbta.com/live_facilities`
- Purpose: list live operational status records for facilities
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `include`
- Key filters: `filter[id]`
- Responses documented: `200`, `400`, `403`, `429`

### 8) Live facility by ID
- Method: `GET`
- Path: `/live_facilities/{id}`
- Full URL: `https://api-v3.mbta.com/live_facilities/{id}`
- Purpose: fetch one live facility status resource
- Parameters: required path `id`, optional `include`
- Responses documented: `200`, `403`, `404`, `406`, `429`

### 9) Predictions collection
- Method: `GET`
- Path: `/predictions`
- Full URL: `https://api-v3.mbta.com/predictions`
- Purpose: list predicted arrival/departure events
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[prediction]`, `include`
- Key filters: `filter[latitude]`, `filter[longitude]`, `filter[radius]`, `filter[direction_id]`, `filter[route_type]`, `filter[stop]`, `filter[route]`, `filter[trip]`, `filter[revenue]`, `filter[route_pattern]`
- Responses documented: `200`, `400`, `403`, `429`

### 10) Route patterns collection
- Method: `GET`
- Path: `/route_patterns`
- Full URL: `https://api-v3.mbta.com/route_patterns`
- Purpose: list possible route patterns for routes
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[route_pattern]`, `include`
- Key filters: `filter[id]`, `filter[route]`, `filter[direction_id]`, `filter[stop]`, `filter[canonical]`, `filter[date]`
- Responses documented: `200`, `400`, `403`, `429`

### 11) Route pattern by ID
- Method: `GET`
- Path: `/route_patterns/{id}`
- Full URL: `https://api-v3.mbta.com/route_patterns/{id}`
- Purpose: fetch one route pattern resource
- Parameters: required path `id`, optional `fields[route_pattern]`, optional `include`
- Responses documented: `200`, `403`, `404`, `406`, `429`

### 12) Routes collection
- Method: `GET`
- Path: `/routes`
- Full URL: `https://api-v3.mbta.com/routes`
- Purpose: list routes
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[route]`, `include`
- Key filters: `filter[stop]`, `filter[type]`, `filter[direction_id]`, `filter[date]`, `filter[id]`, `filter[listed_route]`
- Responses documented: `200`, `400`, `403`, `429`

### 13) Route by ID
- Method: `GET`
- Path: `/routes/{id}`
- Full URL: `https://api-v3.mbta.com/routes/{id}`
- Purpose: fetch one route resource
- Parameters: required path `id`, optional `fields[route]`, optional `include`
- Responses documented: `200`, `400`, `403`, `404`, `406`, `429`

### 14) Schedules collection
- Method: `GET`
- Path: `/schedules`
- Full URL: `https://api-v3.mbta.com/schedules`
- Purpose: list scheduled stop-time data
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[schedule]`, `include`
- Key filters: `filter[date]`, `filter[direction_id]`, `filter[route_type]`, `filter[min_time]`, `filter[max_time]`, `filter[route]`, `filter[stop]`, `filter[trip]`, `filter[stop_sequence]`
- Responses documented: `200`, `400`, `403`, `429`

### 15) Services collection
- Method: `GET`
- Path: `/services`
- Full URL: `https://api-v3.mbta.com/services`
- Purpose: list service calendars/dates
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[service]`
- Key filters: `filter[id]`, `filter[route]`
- Responses documented: `200`, `400`, `403`, `429`

### 16) Service by ID
- Method: `GET`
- Path: `/services/{id}`
- Full URL: `https://api-v3.mbta.com/services/{id}`
- Purpose: fetch one service resource
- Parameters: required path `id`, optional `fields[service]`
- Responses documented: `200`, `403`, `404`, `406`, `429`

### 17) Shapes collection
- Method: `GET`
- Path: `/shapes`
- Full URL: `https://api-v3.mbta.com/shapes`
- Purpose: list route shapes/polylines
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[shape]`
- Key filters: required `filter[route]`
- Responses documented: `200`, `400`, `403`, `429`

### 18) Shape by ID
- Method: `GET`
- Path: `/shapes/{id}`
- Full URL: `https://api-v3.mbta.com/shapes/{id}`
- Purpose: fetch one shape resource
- Parameters: required path `id`, optional `fields[shape]`
- Responses documented: `200`, `400`, `403`, `404`, `406`, `429`

### 19) Stop events collection
- Method: `GET`
- Path: `/stop_events`
- Full URL: `https://api-v3.mbta.com/stop_events`
- Purpose: list stop-event records
- Stability note: the Swagger UI marks this route as `experimental`
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[stop_event]`, `include`
- Key filters: `filter[trip]`, `filter[stop]`, `filter[route]`, `filter[vehicle]`, `filter[direction_id]`
- Responses documented: `200`, `400`, `403`, `429`

### 20) Stop event by ID
- Method: `GET`
- Path: `/stop_events/{id}`
- Full URL: `https://api-v3.mbta.com/stop_events/{id}`
- Purpose: fetch one stop-event resource
- Stability note: the Swagger UI marks this route as `experimental`
- Parameters: required path `id`, optional `include`
- Responses documented: `200`, `403`, `404`, `429`

### 21) Stops collection
- Method: `GET`
- Path: `/stops`
- Full URL: `https://api-v3.mbta.com/stops`
- Purpose: list stops and station navigation points
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[stop]`, `include`
- Key filters: `filter[date]`, `filter[direction_id]`, `filter[latitude]`, `filter[longitude]`, `filter[radius]`, `filter[id]`, `filter[route_type]`, `filter[route]`, `filter[service]`, `filter[location_type]`
- Responses documented: `200`, `400`, `403`, `429`

### 22) Stop by ID
- Method: `GET`
- Path: `/stops/{id}`
- Full URL: `https://api-v3.mbta.com/stops/{id}`
- Purpose: fetch one stop resource
- Parameters: required path `id`, optional `fields[stop]`, optional `include`
- Responses documented: `200`, `400`, `403`, `404`, `406`, `429`

### 23) Trips collection
- Method: `GET`
- Path: `/trips`
- Full URL: `https://api-v3.mbta.com/trips`
- Purpose: list trips
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[trip]`, `include`
- Key filters: `filter[date]`, `filter[direction_id]`, `filter[route]`, `filter[revenue]`, `filter[route_pattern]`, `filter[id]`, `filter[name]`
- Responses documented: `200`, `400`, `403`, `429`

### 24) Trip by ID
- Method: `GET`
- Path: `/trips/{id}`
- Full URL: `https://api-v3.mbta.com/trips/{id}`
- Purpose: fetch one trip resource
- Parameters: required path `id`, optional `fields[trip]`, optional `include`
- Responses documented: `200`, `403`, `404`, `406`, `429`

### 25) Vehicles collection
- Method: `GET`
- Path: `/vehicles`
- Full URL: `https://api-v3.mbta.com/vehicles`
- Purpose: list vehicle-position resources
- Common parameters: `page[offset]`, `page[limit]`, `sort`, `fields[vehicle]`, `include`
- Key filters: `filter[id]`, `filter[trip]`, `filter[label]`, `filter[route]`, `filter[direction_id]`, `filter[route_type]`, `filter[revenue]`
- Responses documented: `200`, `400`, `403`, `429`

### 26) Vehicle by ID
- Method: `GET`
- Path: `/vehicles/{id}`
- Full URL: `https://api-v3.mbta.com/vehicles/{id}`
- Purpose: fetch one vehicle resource
- Parameters: required path `id`, optional `fields[vehicle]`, optional `include`
- Responses documented: `200`, `403`, `404`, `406`, `429`

## Sources inspected
- `https://www.mbta.com/developers/v3-api`
- `https://api-v3.mbta.com/docs/swagger/index.html`
- `https://api-v3.mbta.com/docs/swagger/swagger.json`
