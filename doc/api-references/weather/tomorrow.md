# Tomorrow

## Provider metadata
- Category: `Weather`
- Provider slug: `tomorrow`
- Official docs pages used:
  - `https://docs.tomorrow.io/reference`
  - `https://docs.tomorrow.io/reference/api-authentication`
  - `https://docs.tomorrow.io/reference/rate-limiting`
  - `https://docs.tomorrow.io/reference/api-formats`
  - `https://docs.tomorrow.io/reference/api-pagination`
  - `https://docs.tomorrow.io/reference/api-errors`
  - Endpoint reference pages under `https://docs.tomorrow.io/reference/*`
- Confirmed API base URL: `https://api.tomorrow.io/v4`
- Primary response format: JSON
- Special format note: map endpoints return tile formats via a path suffix such as `.png`
- Manually confirmed routes in this pass: `38`

## Authentication
Tomorrow's official docs state that every REST Weather API request requires a valid access key.

The docs explicitly document two auth styles:
- Query parameter: `apikey=API_KEY`
- Request header: `apikey: API_KEY`

Important auth notes from the official docs:
- Missing or invalid authentication returns `403` on the auth page and `401001 Invalid Key` in the error-handling reference.
- A default private token is available in the Dashboard.
- Multiple API keys can be created for different environments or use cases.

## Core request conventions from the official docs
### Location formats
Tomorrow documents three supported location forms:
- `geometry` - GeoJSON geometry (`Point`, `Polygon`, or `LineString`) following RFC 7946
- `latlong` - latitude/longitude pair
- `locationId` - a saved location from the Locations API

Important coordinate-order rule from the formats page:
- GeoJSON uses `[lon, lat]`
- Query-parameter lat/long uses `[lat, lon]`

### Dates and times
The formats page states:
- timestamps are represented in ISO 8601
- returned timestamps are always UTC unless transformed for display by a requested timezone
- supported relative values include `now`, `nowPlusXm/h/d`, and `nowMinusXm/h/d`

### Units and timezone
- Version 4 supports `metric` and `imperial`
- Timezone names follow the IANA timezone database format
- Some endpoints support `timezone=auto` to align output with the request location

## Manually confirmed endpoint families

### 1) Weather forecast, realtime, timelines, routes, maps, and history
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/weather/forecast` | Forecast weather | required `location`; optional `timesteps` (`1h`, `1d`), `units` |
| GET | `/weather/realtime` | Current/realtime weather | required `location`; optional `units` |
| POST | `/timelines` | Timeline-based weather retrieval | body includes required `location`, required `fields`, optional `units`, `timesteps` (`1m`, `5m`, `15m`, `30m`, `1h`, `1d`, `current`), `startTime`, `endTime`, `timezone`, `dailyStartHour` |
| POST | `/route` | Weather along a route | body includes required `legs`, required `fields`, optional `startTime`, `timestep` (`1m`, `5m`, `10m`, `15m`, `30m`, `60m`), `units`, `timezone` |
| GET | `/map/tile/{zoom}/{x}/{y}/{field}/{time}.{format}` | Weather map tile | path params `zoom`, `x`, `y`, `field`, `time`, `format`; optional query `gradient` |
| GET | `/map/aggregate/tile/{aggregationType}/{timeFrom}/{timeTo}/{zoom}/{x}/{y}/{field}.{format}` | Aggregated weather map tile | path params `aggregationType`, `timeFrom`, `timeTo`, `zoom`, `x`, `y`, `field`, `format` |
| GET | `/weather/history/recent` | Recent history | required `location`; optional `timesteps` (`1h`, `1d`), `units` |
| POST | `/historical` | Historical weather timelines | body includes required `location`, required `fields`, required single `timesteps` (`1h` or `1d`), required `startTime`, `endTime`, optional `units`, `timezone` |
| POST | `/historical/normals` | Climate normals | body includes required `location`, required `fields`, required `timesteps=[1d]`, required `startDate` and `endDate` in `MM-DD`, optional `units` |

### 2) Locations API
| Method | Path | Purpose |
|---|---|---|
| GET | `/locations` | List saved locations |
| POST | `/locations` | Create a location |
| GET | `/locations/{locationId}` | Retrieve one location |
| PUT | `/locations/{locationId}` | Update one location |
| DELETE | `/locations/{locationId}` | Delete one location |
| POST | `/locations/tags/add` | Add tags to locations |
| POST | `/locations/tags/remove` | Remove tags from locations |

Confirmed details from the location pages:
- Create Location documents body fields for `name`, `geometry`, and `tags`.
- Resource-specific operations use the path parameter `locationId`.
- List responses include `data.locations` and `links`.

### 3) Insights API
| Method | Path | Purpose |
|---|---|---|
| GET | `/insights` | List insights |
| POST | `/insights` | Create an insight |
| GET | `/insights/{insightId}` | Retrieve one insight |
| PUT | `/insights/{insightId}` | Update one insight |
| DELETE | `/insights/{insightId}` | Delete one insight |
| POST | `/insights/tags/add` | Add tags to insights |
| POST | `/insights/tags/remove` | Remove tags from insights |

Confirmed path parameter:
- `insightId`

### 4) Alerts API
| Method | Path | Purpose |
|---|---|---|
| GET | `/alerts` | List alerts |
| POST | `/alerts` | Create an alert |
| GET | `/alerts/{alertId}` | Retrieve one alert |
| PUT | `/alerts/{alertId}` | Update one alert |
| DELETE | `/alerts/{alertId}` | Delete one alert |
| POST | `/alerts/{alertId}/activate` | Activate an alert |
| POST | `/alerts/{alertId}/deactivate` | Deactivate an alert |
| POST | `/alerts/{alertId}/locations/link` | Link locations to an alert |
| POST | `/alerts/{alertId}/locations/unlink` | Unlink locations from an alert |
| GET | `/alerts/{alertId}/locations` | List linked locations |

Confirmed path parameter:
- `alertId`

Confirmed response note from the List Alerts page:
- list responses return `data.alerts` plus `links`

### 5) Events and notifications
| Method | Path | Purpose |
|---|---|---|
| GET | `/events` | Retrieve events (basic) |
| POST | `/events-custom/{feedName}.{format}` | Custom vector events |
| POST | `/events-timeline` | On-demand events |
| POST | `/events-timeline/routes` | On-demand route events |
| GET | `/notifications` | List notifications |

Confirmed path parameters:
- `feedName`
- `format`

## High-value endpoint notes from the official reference
### Weather Forecast
- Full path: `GET https://api.tomorrow.io/v4/weather/forecast`
- Docs describe minute-by-minute forecasts for premium users, hourly forecasts for the next 120 hours, and daily forecasts for the next 5 days.
- Supported query-location examples in docs: coordinates, city name, US ZIP, UK postcode.
- Response shape is timeline-oriented and includes forecast buckets like `minutely`, `hourly`, and `daily`.

### Realtime Weather
- Full path: `GET https://api.tomorrow.io/v4/weather/realtime`
- Query params shown in docs: required `location`, optional `units`
- Response body is `data.time` plus `data.values`

### Timelines
- Full path: `POST https://api.tomorrow.io/v4/timelines`
- This is the main flexible weather-data endpoint.
- Docs show support for `location`, `fields`, `timesteps`, `startTime`, `endTime`, `timezone`, and `dailyStartHour`.
- The response is `data.timelines[]`, where each timeline has `timestep`, `startTime`, `endTime`, and `intervals[]`.

### Route weather
- Full path: `POST https://api.tomorrow.io/v4/route`
- Required body field `legs` is documented as a collection of route segments, each with a location object and duration in minutes.
- This endpoint is route-aware rather than point-in-time point-location weather.

### Weather Maps
- Full path: `GET https://api.tomorrow.io/v4/map/tile/{zoom}/{x}/{y}/{field}/{time}.{format}`
- Docs explicitly document path params for map tiling plus an optional custom `gradient` query parameter.
- Default format shown in docs is `png`.

### Historical weather
- Full path: `POST https://api.tomorrow.io/v4/historical`
- Docs require exactly one timestep per call: `1h` or `1d`.
- Historical requests use body parameters rather than query parameters.

### Climate normals
- Full path: `POST https://api.tomorrow.io/v4/historical/normals`
- Docs say climate normals currently support only `1d` timesteps.
- `startDate` and `endDate` must be `MM-DD` and are limited to a 365-day range.
- The climate normals page states the aggregation is based on data from 2000 to 2020.

## Pagination
From the official pagination page:
- list-style top-level resources use paged bulk-fetch GET methods
- the docs describe the scheme as cursor-based, but the examples use `offset` and `limit`
- paginated responses return resource arrays under `data` and navigation URLs under `links`
- example links include `self`, `prev`, and `next`

The pagination page specifically calls out list resources for:
- Locations
- Insights
- Alerts
- Linked Locations

## Rate limiting and token accounting
From the official rate-limiting page:
- rate limits depend on plan and apply per hour and per day, with a per-second ceiling also documented for headers
- exceeding a rate limit returns `429`
- Enterprise accounts can inspect these headers:
  - `X-RateLimit-Limit-second`
  - `X-RateLimit-Limit-hour`
  - `X-RateLimit-Limit-day`
  - `X-RateLimit-Remaining-second`
  - `X-RateLimit-Remaining-hour`
  - `X-RateLimit-Remaining-day`
- token-oriented products expose headers such as:
  - `X-Tokens-Cost-{product}`
  - `X-Tokens-Remaining-{product}`
- the rate-limiting docs explicitly say token tracking applies to at least:
  - `Historical`
  - `On demand events`
- each API key has its own rate-limit and token balance

## Error handling
From the official error-handling page:
- 2xx = success
- 4xx = client/input/access problems
- 5xx = server-side errors
- error bodies are JSON and include stable numeric codes

Representative documented error codes:
- `400001` Invalid Body Parameters
- `400002` Invalid Query Parameters
- `400003` Missing Required Body Parameters
- `400004` Missing Required Query Parameters
- `400006` Missing Required Header Parameters
- `400007` Invalid Path Parameters
- `401001` Invalid Key
- `402001` Insufficient Tokens
- `403001` Access Denied
- `403002` Account Limit
- `403003` Forbidden Action
- `404001` Not Found
- `500001` Unknown
- `503001` Unavailable (`Retry-After` supported)

The docs also state:
- responses may include soft errors/warnings in otherwise successful replies
- every request has an `X-Correlation-ID` response header for support/debugging

## Response-format notes
- Most endpoints return JSON.
- Weather forecast endpoints return timeline-oriented weather payloads.
- Realtime returns `data.time` plus `data.values`.
- List resources return arrays under `data.<resource>` and usually include `links`.
- Map endpoints are format-suffixed tile endpoints rather than plain JSON data endpoints.

## Important fireROUTE usage notes
- Use `apikey` header auth for server-side integrations when possible; query auth is officially supported but easier to leak into logs.
- Preserve Tomorrow's location-format distinctions carefully: GeoJSON is `[lon, lat]`, but query-string lat/long is `[lat, lon]`.
- Treat `/timelines` as the canonical flexible data API and the single-point forecast/realtime endpoints as convenience endpoints.
- Respect per-product token accounting for Historical and On-Demand Events if fireROUTE does cost-aware routing.
- Preserve `X-Correlation-ID` in logs when debugging provider failures.

## Verification notes
This file was manually rebuilt from Tomorrow.io's official ReadMe-hosted reference, replacing the earlier autogenerated summary.
