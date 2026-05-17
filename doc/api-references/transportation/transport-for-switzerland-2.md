# Transport for Switzerland

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-switzerland-2`
- Official docs used manually:
  - `https://transport.opendata.ch/`
  - `https://transport.opendata.ch/docs.html`
  - live check: `https://transport.opendata.ch/v1/locations?query=Basel`
- Base URL: `https://transport.opendata.ch/v1`
- Authentication:
  - no API key, OAuth flow, or login requirement is documented on the official Transport API page
- Primary response format: JSON
- Additional format notes:
  - the official docs say the API is REST-style and responds in JSON
  - the docs say CORS is enabled
  - the examples on the docs page still use `http://transport.opendata.ch/v1/...`, but a live review request to `https://transport.opendata.ch/v1/locations?query=Basel` returned `200 OK` with `Content-Type: application/json`

## Important official usage notes
- The docs describe this as the `Swiss public transport API`.
- The accessible public docs currently expose `3` routes: `/locations`, `/connections`, and `/stationboard`.
- The docs note that `/locations` can return a `refine` response, meaning the caller may need to repeat the request with a more specific query.
- The docs expose shared object models for `location`, `coordinates`, `connection`, `prognosis`, `stop`, `section`, and `journey`.
- The page documents a `fields[]` mechanism for trimming responses to selected nested fields.

## Rate limits, pagination, errors, and live behavior
- The docs do not publish a numeric quota.
- The official rate-limit note says request volume is constrained by the rate limit of `timetable.search.ch`.
- CORS is explicitly documented, and a live review request returned `Access-Control-Allow-Origin: *`.
- Pagination is route-specific rather than global:
  - `/connections` supports `limit` from `1` to `16`
  - `/connections` also supports zero-based `page` from `0` to `3`
  - `/stationboard` supports a `limit` parameter, but the docs say it is not a hard cap because all departures at the final included time are returned together
- I did not find a published structured error table or canonical non-200 error schema on the inspected docs page.
- A live request to `/locations` with no query during review returned `200 OK` and an empty JSON object structure (`{"stations":[]}`) rather than a documented validation error.

## Confirmed API surface
The official docs page currently exposes these `3` GET routes:
1. `GET /locations`
2. `GET /connections`
3. `GET /stationboard`

## 1) Search locations
- Method: `GET`
- Path: `/locations`
- Full URL: `https://transport.opendata.ch/v1/locations`
- Purpose: return matching locations by name or coordinates

Documented parameters:
- `query` - optional string location name search term; either `query` or the coordinate pair is required
- `x` - optional latitude
- `y` - optional longitude
- `type` - optional location type filter; documented values are `all` (default), `station`, `poi`, and `address`

Documented response notes:
- Returns a `stations` array of matched locations
- Location objects include `id`, `name`, `score`, `coordinate`, `distance`, and type information
- The docs say this route can return a `refine` response and the request should then be redone with a more precise query

## 2) Get connections between two locations
- Method: `GET`
- Path: `/connections`
- Full URL: `https://transport.opendata.ch/v1/connections`
- Purpose: return the next public-transport connections between an origin and destination

Documented parameters:
- `from` - required departure location name or ID
- `to` - required arrival location name or ID
- `via[]` - optional array of up to five via locations
- `date` - optional date in `YYYY-MM-DD`
- `time` - optional time in `hh:mm`
- `isArrivalTime` - optional flag; defaults to `0`; when set to `1`, the supplied date/time is interpreted as arrival time
- `transportations[]` - optional transport-mode array; documented values include `train`, `tram`, `ship`, `bus`, and `cableway`
- `limit` - optional integer from `1` to `16`
- `page` - optional zero-based page number from `0` to `3`
- `fields[]` - optional field-selection parameter described in the docs' `Limit response` section

Documented response notes:
- Returns a `connections` array
- Connection objects include `from`, `to`, `duration`, `service`, `products`, `capacity1st`, `capacity2nd`, and `sections`
- `prognosis` objects can include predicted platform, arrival, departure, and coach-capacity data
- The docs show both station-name and station-ID requests as equivalent examples

## 3) Get a stationboard
- Method: `GET`
- Path: `/stationboard`
- Full URL: `https://transport.opendata.ch/v1/stationboard`
- Purpose: return the next departures or arrivals for one station

Documented parameters:
- `station` - required station name unless `id` is used
- `id` - optional station ID; the docs say one of `station` or `id` is required, and if both are sent the `id` takes precedence
- `limit` - optional number of departing connections to return; documented as a soft limit rather than a hard cap
- `transportations[]` - optional transport-mode array
- `datetime` - optional date/time in `YYYY-MM-DD hh:mm`
- `type` - optional board type; `departure` (default) or `arrival`

Documented response notes:
- Returns `station` plus `stationboard`
- The `stationboard` array contains journeys and their stop data
- Journey entries can include `name`, `category`, `number`, `operator`, `to`, and nested stop / prognosis information

## Shared response-shaping note
- The docs describe a `fields[]` selector that can reduce payloads to chosen nested fields.
- When a parent field is selected, the API includes everything below that level unless a more specific nested selection is also provided.
- The docs provide `/connections` examples such as:
  - `fields[]=connections/from/departure&fields[]=connections/to/arrival`
  - `fields[]=connections/from&fields[]=connections/to/station`

## Sources inspected
- `https://transport.opendata.ch/`
- `https://transport.opendata.ch/docs.html`
- live requests during review:
  - `https://transport.opendata.ch/v1/locations?query=Basel`
  - `https://transport.opendata.ch/v1/locations`
