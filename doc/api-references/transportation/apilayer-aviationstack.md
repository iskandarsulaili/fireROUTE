# apilayer aviationstack

## Provider metadata
- Category: `Transportation`
- Provider slug: `apilayer-aviationstack`
- Official docs used manually:
  - `https://docs.apilayer.com/aviationstack/docs/api-documentation`
  - `https://docs.apilayer.com/aviationstack/docs/quickstart-guide`
- Base URL: `https://api.aviationstack.com/v1`
- Authentication: API access key via required `access_key` query parameter on requests shown in the official docs
- Primary response format: JSON
- Transport scope: aviation data for flights, schedules, routes, airports, airlines, airplanes, aircraft types, cities, countries, and aviation taxes

## Important official usage notes
- The official APILayer docs describe Aviationstack as a RESTful JSON-based service using straightforward HTTP GET URLs.
- The official quickstart says all registered users receive an `API Access Key` in the dashboard and that this key is required to authenticate all API requests.
- The inspected docs expose 11 distinct path-level endpoints under `/v1`; historical flight lookups are documented as the `flights` endpoint with the `flight_date` query parameter.
- The docs state data is updated within `30–60 seconds from the source`.
- Plan gating shown in the official endpoint summary:
  - `All Plans`: `flights`, `airports`, `airlines`, `airplanes`, `aircraft_types`, `cities`, `countries`, `taxes`
  - `Basic and above`: historical `flights?flight_date=`, `flight_schedules`, `flightsFuture`, `routes`
- The public catalog metadata for this provider said `OAuth`, but the official Aviationstack docs currently show API-key query authentication instead.

## Rate limits, pagination, and errors
- No numeric rate-limit or per-minute quota was documented on the inspected official pages.
- The official examples consistently show offset-style pagination parameters:
  - `limit`
  - `offset`
- The official examples also show an optional `callback` parameter, indicating JSONP-style callback support in example requests.
- The inspected pages did not publish a structured error-schema section or endpoint-specific HTTP-status table.
- The official docs do note plan restrictions (`All Plans` vs `Basic and above`) for endpoint access.

## Confirmed API surface
The inspected official docs currently expose 11 GET routes:
1. `GET /v1/flights`
2. `GET /v1/flight_schedules`
3. `GET /v1/flightsFuture`
4. `GET /v1/routes`
5. `GET /v1/airports`
6. `GET /v1/airlines`
7. `GET /v1/airplanes`
8. `GET /v1/aircraft_types`
9. `GET /v1/cities`
10. `GET /v1/countries`
11. `GET /v1/taxes`

## Common request and response notes
- All confirmed routes are documented as HTTP GET endpoints.
- The only universally confirmed required parameter from the inspected official docs is `access_key`.
- Confirmed common optional parameters from the official examples:
  - `limit`
  - `offset`
  - `callback`
- Confirmed endpoint-specific example parameter:
  - `flight_date` on `GET /v1/flights` for historical-flight queries.
- The docs say more parameters are available per endpoint, but the inspected public pages did not expose a full parameter table for every operation.

## 1) Flights
- Method: `GET`
- Path: `/flights`
- Full URL: `https://api.aviationstack.com/v1/flights`
- Purpose: real-time flight status lookups, with historical-flight usage documented via `flight_date`.

Confirmed query parameters from official examples:
- `access_key` - required API key.
- `limit` - optional pagination size in examples.
- `offset` - optional pagination offset in examples.
- `callback` - optional callback parameter in examples.
- `flight_date` - optional/conditional historical-flight date filter; the endpoint summary calls out `/v1/flights?flight_date=` for historical data.

## 2) Flight schedules
- Method: `GET`
- Path: `/flight_schedules`
- Full URL: `https://api.aviationstack.com/v1/flight_schedules`
- Purpose: scheduled and future flight lookups.

Confirmed request notes:
- Available on `Basic and above` plans according to the official endpoint summary.
- The inspected pages did not expose a full public parameter table beyond the shared API-key pattern.

## 3) Future flight schedules
- Method: `GET`
- Path: `/flightsFuture`
- Full URL: `https://api.aviationstack.com/v1/flightsFuture`
- Purpose: upcoming/future flight schedule lookup.

Confirmed request notes:
- Available on `Basic and above` plans according to the official endpoint summary.

## 4) Routes
- Method: `GET`
- Path: `/routes`
- Full URL: `https://api.aviationstack.com/v1/routes`
- Purpose: airline route metadata.

Confirmed query parameters from official examples:
- `access_key` - required API key.
- `limit` - optional pagination size in examples.
- `offset` - optional pagination offset in examples.
- `callback` - optional callback parameter in examples.

## 5) Airports
- Method: `GET`
- Path: `/airports`
- Full URL: `https://api.aviationstack.com/v1/airports`
- Purpose: global airport lookup.

Confirmed query parameters from official examples:
- `access_key` - required API key.
- `limit` - optional pagination size in examples.
- `offset` - optional pagination offset in examples.
- `callback` - optional callback parameter in examples.

## 6) Airlines
- Method: `GET`
- Path: `/airlines`
- Full URL: `https://api.aviationstack.com/v1/airlines`
- Purpose: global airline lookup.

Confirmed query parameters from official examples:
- `access_key` - required API key.
- `limit` - optional pagination size in examples.
- `offset` - optional pagination offset in examples.
- `callback` - optional callback parameter in examples.

## 7) Airplanes
- Method: `GET`
- Path: `/airplanes`
- Full URL: `https://api.aviationstack.com/v1/airplanes`
- Purpose: airplane/aircraft lookup.

Confirmed request notes:
- Included in the official endpoint list and quickstart endpoint inventory.
- The inspected pages did not expose additional public parameter details beyond the shared API-key pattern.

## 8) Aircraft types
- Method: `GET`
- Path: `/aircraft_types`
- Full URL: `https://api.aviationstack.com/v1/aircraft_types`
- Purpose: aircraft category/type lookup.

Confirmed request notes:
- Included in the official endpoint list and quickstart endpoint inventory.

## 9) Cities
- Method: `GET`
- Path: `/cities`
- Full URL: `https://api.aviationstack.com/v1/cities`
- Purpose: global city lookup for aviation-related data joins.

Confirmed request notes:
- Included in the official endpoint list and quickstart endpoint inventory.

## 10) Countries
- Method: `GET`
- Path: `/countries`
- Full URL: `https://api.aviationstack.com/v1/countries`
- Purpose: country reference lookup.

Confirmed request notes:
- Included in the official endpoint list and quickstart endpoint inventory.

## 11) Taxes
- Method: `GET`
- Path: `/taxes`
- Full URL: `https://api.aviationstack.com/v1/taxes`
- Purpose: aviation tax data lookup.

Confirmed request notes:
- Included in the official endpoint list and quickstart endpoint inventory as `Aviation Taxes`.

## Sources inspected
- `https://docs.apilayer.com/aviationstack/docs/api-documentation`
- `https://docs.apilayer.com/aviationstack/docs/quickstart-guide`
