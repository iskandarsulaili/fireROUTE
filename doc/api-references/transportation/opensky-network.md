# OpenSky Network

## Provider metadata
- Category: `Transportation`
- Provider slug: `opensky-network`
- Official docs used manually:
  - `https://opensky-network.org/apidoc/index.html`
  - `https://opensky-network.org/data/api`
  - `https://openskynetwork.github.io/opensky-api/`
  - `https://openskynetwork.github.io/opensky-api/rest.html`
- Base URL: `https://opensky-network.org/api`
- Primary response format: JSON
- Auth model: the inspected REST reference documents public GET endpoints without explicit auth parameters; the provider positions the API as a live research/non-commercial API and distinguishes public state-vector calls from "own state vectors"
- Transport scope: live aircraft state vectors, flight lookups, airport arrivals/departures, and aircraft tracks

## Important official usage notes
- The official docs describe this as the live OpenSky API for research and non-commercial use.
- The docs explicitly say the API does not provide commercial schedule/delay data beyond what can be derived from ADS-B contents.
- The REST reference notes that calls for state vectors outside your own sensor scope are rate limited.
- The docs also warn that the service may block cloud providers or heavily abused networks.

## Rate limits and errors
- Exact numeric rate limits were not visible in the inspected capture, but the REST page explicitly states that `GET /states/all` is rate limited.
- The REST documentation presents JSON responses for the documented endpoints.
- Error-handling is described in prose on the official docs site, but no OpenAPI-style error schema was published on the inspected REST page.

## Confirmed API surface
The official REST reference currently exposes these 7 routes:
- `GET /states/all`
- `GET /states/own`
- `GET /flights/all`
- `GET /flights/aircraft`
- `GET /flights/arrival`
- `GET /flights/departure`
- `GET /tracks`

## Common request/response notes
- All confirmed routes in the inspected REST reference are `GET` endpoints.
- The root API URL shown by the official docs is `https://opensky-network.org/api`.
- Responses are JSON objects or JSON arrays, depending on the endpoint family.
- No page-number pagination or cursor tokens were documented on the inspected REST reference page.
- Time values in request parameters are documented as Unix timestamps in seconds.

## 1) All state vectors
- Method: `GET`
- Path: `/states/all`
- Full URL: `https://opensky-network.org/api/states/all`
- Purpose: retrieve state vectors across the OpenSky network

Documented query parameters seen in the official REST page:
- `time` - optional Unix timestamp in seconds; current time is used if omitted
- `icao24` - optional aircraft transponder hex string; repeat the parameter to filter multiple aircraft
- `lamin` - optional lower latitude bound
- `lomin` - optional lower longitude bound
- `lamax` - optional upper latitude bound
- `lomax` - optional upper longitude bound
- `extended` - optional integer; set to `1` to request aircraft category data

Documented response notes:
- Returns a JSON object with top-level `time` and `states` fields.
- The docs describe state vectors as summaries of position, velocity, identity, and related tracking fields.

## 2) Own state vectors
- Method: `GET`
- Path: `/states/own`
- Full URL: `https://opensky-network.org/api/states/own`
- Purpose: retrieve state vectors scoped to your own sensor data

Documented behavior notes:
- The REST page presents this route as the non-rate-limited counterpart to `GET /states/all` for your own data scope.
- It belongs to the same state-vector family and returns JSON state-vector data.

## 3) Flights in a time interval
- Method: `GET`
- Path: `/flights/all`
- Full URL: `https://opensky-network.org/api/flights/all`
- Purpose: list flights for a time interval

Documented query concepts from the official REST page:
- begin/end time-window parameters are required for the interval query
- the endpoint returns flight records observed in that window

## 4) Flights by aircraft
- Method: `GET`
- Path: `/flights/aircraft`
- Full URL: `https://opensky-network.org/api/flights/aircraft`
- Purpose: list flights associated with one aircraft

Documented query concepts from the official REST page:
- aircraft identifier (`icao24`) is used to scope the lookup
- begin/end time-window filters are used for the requested period

## 5) Arrivals by airport
- Method: `GET`
- Path: `/flights/arrival`
- Full URL: `https://opensky-network.org/api/flights/arrival`
- Purpose: list flights arriving at an airport in a time interval

Documented query concepts from the official REST page:
- airport identifier parameter for the destination airport
- begin/end time-window filters for the arrival interval

## 6) Departures by airport
- Method: `GET`
- Path: `/flights/departure`
- Full URL: `https://opensky-network.org/api/flights/departure`
- Purpose: list flights departing from an airport in a time interval

Documented query concepts from the official REST page:
- airport identifier parameter for the origin airport
- begin/end time-window filters for the departure interval

## 7) Track by aircraft
- Method: `GET`
- Path: `/tracks`
- Full URL: `https://opensky-network.org/api/tracks`
- Purpose: retrieve the track history for a specific aircraft at a point in time

Documented query concepts from the official REST page:
- `icao24` aircraft identifier
- `time` Unix timestamp in seconds

## Sources inspected
- `https://opensky-network.org/apidoc/index.html`
- `https://opensky-network.org/data/api`
- `https://openskynetwork.github.io/opensky-api/`
- `https://openskynetwork.github.io/opensky-api/rest.html`
