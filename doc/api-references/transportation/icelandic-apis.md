# Icelandic APIs

## Provider metadata
- Category: `Transportation`
- Provider slug: `icelandic-apis`
- Official docs used manually:
  - `https://docs.apis.is/`
  - `https://docs.apis.is/#endpoint-bus`
  - `https://docs.apis.is/#endpoint-flight`
  - `https://docs.apis.is/#endpoint-rides`
  - `https://docs.apis.is/#endpoint-petrol`
  - `https://docs.apis.is/#endpoint-ship`
- Base URL confirmed from the official docs:
  - `https://apis.is`
- Authentication:
  - no API key, OAuth flow, login wall, or cookie-gated auth requirement was documented on the inspected public docs page
- Primary response / payload formats:
  - JSON responses are the documented default across the inspected transport endpoints
- Transport scope documented here:
  - the transportation-relevant routes exposed on the broader `apis.is` catalog page

## Important official usage notes
- The docs say all endpoints are currently at version `1`.
- The docs say the `accept-version` header is not required today, but is strongly recommended for production use.
- The docs describe the platform as an open-source service that scrapes various upstream Icelandic data sources.
- The transportation endpoints documented on the public page are sourced from:
  - `bus.is`
  - `The Road Traffic Directorate`
  - `Bicycle Counter`
  - `Keflavik Airport`
  - `samferda.net`
  - `github.com/gasvaktin`
  - `The Icelandic Transport Authority`

## Rate limits, pagination, and errors
- No public rate-limit or quota section was exposed on the inspected official docs page.
- No pagination parameters or cursor mechanics were documented for the inspected transport endpoints.
- No provider-wide structured error schema was documented on the inspected transport sections.

## Confirmed API surface
The official docs page exposes 8 transportation routes:
1. `GET /bus/realtime`
2. `GET /car`
3. `GET /cyclecounter`
4. `GET /flight`
5. `GET /rides/samferda-drivers/`
6. `GET /rides/samferda-passengers/`
7. `GET /petrol`
8. `GET /ship`

## 1) Get real-time bus locations
- Method: `GET`
- Path: `/bus/realtime`
- Full URL: `https://apis.is/bus/realtime`
- Purpose: return real-time bus-location data for active buses

Documented parameters:
- `busses` - comma-separated list of bus numbers; if omitted, the docs say the endpoint returns all available buses

Documented response notes:
- JSON response is documented
- The docs describe this endpoint as returning only active buses

## 2) Search the Icelandic vehicle registry
- Method: `GET`
- Path: `/car`
- Full URL: `https://apis.is/car`
- Purpose: search the Icelandic vehicle registry

Documented parameters:
- `number` - vehicle registry number

Documented response notes:
- JSON response is documented

## 3) Get bicycle-counter status
- Method: `GET`
- Path: `/cyclecounter`
- Full URL: `https://apis.is/cyclecounter`
- Purpose: return current bicycle-counter status data in Reykjavik

Documented parameters:
- None

Documented response notes:
- JSON response is documented
- The docs say the currently covered counter is by `Sudurlandsbraut` in Reykjavik

## 4) Get Keflavik international flight listings
- Method: `GET`
- Path: `/flight`
- Full URL: `https://apis.is/flight`
- Purpose: return today's international arrivals or departures for Keflavik Airport

Documented parameters:
- `language` - `en` or `is`
- `type` - `departures` or `arrivals`

Documented response notes:
- JSON response is documented
- The official description says the endpoint covers flights departing from and arriving at Keflavik Airport today

## 5) List drivers requesting passengers
- Method: `GET`
- Path: `/rides/samferda-drivers/`
- Full URL: `https://apis.is/rides/samferda-drivers/`
- Purpose: list drivers requesting passengers

Documented parameters:
- None

Documented response notes:
- JSON response is documented
- The docs say results are sorted by departure date

## 6) List passengers requesting rides
- Method: `GET`
- Path: `/rides/samferda-passengers/`
- Full URL: `https://apis.is/rides/samferda-passengers/`
- Purpose: list passengers requesting rides

Documented parameters:
- None

Documented response notes:
- JSON response is documented
- The docs say results are sorted by preferred departure date

## 7) Get petrol-station prices and locations
- Method: `GET`
- Path: `/petrol`
- Full URL: `https://apis.is/petrol`
- Purpose: return petrol-station locations and fuel-price data in Iceland

Documented parameters:
- None documented on the inspected page

Documented response notes:
- JSON response is documented

## 8) Search the Icelandic ship registry
- Method: `GET`
- Path: `/ship`
- Full URL: `https://apis.is/ship`
- Purpose: search the Icelandic ship registry

Documented parameters:
- `search` - ship name, regional code such as `RE-100`, or the registry registration number

Documented response notes:
- JSON response is documented

## Sources inspected
- `https://docs.apis.is/`
- `https://docs.apis.is/#endpoint-bus`
- `https://docs.apis.is/#endpoint-flight`
- `https://docs.apis.is/#endpoint-rides`
- `https://docs.apis.is/#endpoint-petrol`
- `https://docs.apis.is/#endpoint-ship`
