# US Weather

## Provider metadata
- Category: `Weather`
- Provider slug: `us-weather`
- Provider: US National Weather Service / weather.gov API
- Docs used manually:
  - `https://www.weather.gov/documentation/services-web-api`
  - `https://api.weather.gov/openapi.json`
- OpenAPI version manually inspected: `3.8.1`
- Base URL: `https://api.weather.gov`
- Total paths manually confirmed from the official OpenAPI document: `65`
- HTTP methods manually confirmed from the official OpenAPI document: all listed paths are `GET`

## Auth, formats, and platform-wide behavior
- Pricing: official docs say the API is open data and free to use for any purpose
- Auth today: no API key required, but the official docs say a `User-Agent` header is required to identify the application
- Official `User-Agent` example: `User-Agent: (myweatherapp.com, contact@myweatherapp.com)`
- Future auth note from docs: the docs state the `User-Agent` requirement will be replaced with an API key in the future
- Rate limits: the docs say there are reasonable limits but they are not public; if exceeded, requests return an error and may usually be retried after about 5 seconds
- Default response style: GeoJSON for many endpoints
- Additional content types explicitly documented on the overview page and/or OpenAPI:
  - `application/geo+json`
  - `application/ld+json`
  - `application/vnd.noaa.dwml+xml`
  - `application/vnd.noaa.obs+xml`
  - `application/cap+xml`
  - `application/atom+xml`
- Error format from the OpenAPI document: `application/problem+json` using an RFC 7807-style problem object
- Debugging headers documented in responses: `X-Correlation-Id`, `X-Request-Id`, `X-Server-Id`

## Important usage notes from official docs
- The official docs recommend using `GET /points/{latitude},{longitude}` first to discover metadata and downstream forecast/grid endpoints for a location.
- The overview page documents header-based content negotiation.
- The gridpoint forecast endpoints accept an optional `Feature-Flags` header with values such as `forecast_temperature_qv` and `forecast_wind_speed_qv`.
- Paged collections use a `limit` query parameter and `cursor` query parameter; the OpenAPI schemas also document a `pagination.next` link in paged responses.

## Manually confirmed route inventory
The official OpenAPI document lists the following 65 route paths.

### Alerts (8 routes)
- `GET /alerts`
- `GET /alerts/active`
- `GET /alerts/active/count`
- `GET /alerts/active/zone/{zoneId}`
- `GET /alerts/active/area/{area}`
- `GET /alerts/active/region/{region}`
- `GET /alerts/types`
- `GET /alerts/{id}`

Common documented alert query parameters:
- `active` - deprecated boolean filter on `/alerts`
- `start`, `end` - ISO date-time filters
- `status` - array of `actual`, `exercise`, `system`, `test`, `draft`
- `message_type` - array of `alert`, `update`, `cancel`
- `event` - event name
- `code` - event code
- `area` - state/territory or marine area code
- `point` - `latitude,longitude`
- `region` - marine region code
- `region_type` - `land` or `marine`
- `zone` - forecast or county zone ID
- `urgency`, `severity`, `certainty`
- `limit` - integer 1 to 500, default 500
- `cursor` - pagination cursor

Provider notes from the parameter descriptions:
- `area`, `point`, `region`, `region_type`, and `zone` are mutually incompatible in several combinations as documented by the OpenAPI descriptions.
- Alert collections can be returned as GeoJSON, JSON-LD, or Atom feed depending on negotiation.

### Aviation (7 routes)
- `GET /aviation/cwsus/{cwsuId}`
- `GET /aviation/cwsus/{cwsuId}/cwas`
- `GET /aviation/cwsus/{cwsuId}/cwas/{date}/{sequence}`
- `GET /aviation/sigmets`
- `GET /aviation/sigmets/{atsu}`
- `GET /aviation/sigmets/{atsu}/{date}`
- `GET /aviation/sigmets/{atsu}/{date}/{time}`

### Glossary (1 route)
- `GET /glossary`

### Gridpoints and forecasts (4 routes)
- `GET /gridpoints/{wfo}/{x},{y}`
- `GET /gridpoints/{wfo}/{x},{y}/forecast`
- `GET /gridpoints/{wfo}/{x},{y}/forecast/hourly`
- `GET /gridpoints/{wfo}/{x},{y}/stations`

Documented path and query/header parameters:
- `wfo` - forecast office ID
- `x` - grid X coordinate
- `y` - grid Y coordinate
- `units` - text forecast units (`us` or `si` per schema family)
- `Feature-Flags` header - optional experimental features such as `forecast_temperature_qv` and `forecast_wind_speed_qv`

### Icons and imagery (4 routes)
- `GET /icons/{set}/{timeOfDay}/{first}`
- `GET /icons/{set}/{timeOfDay}/{first}/{second}`
- `GET /icons`
- `GET /thumbnails/satellite/{area}`

### Observation stations and TAFs (7 routes)
- `GET /stations`
- `GET /stations/{stationId}`
- `GET /stations/{stationId}/observations`
- `GET /stations/{stationId}/observations/latest`
- `GET /stations/{stationId}/observations/{time}`
- `GET /stations/{stationId}/tafs`
- `GET /stations/{stationId}/tafs/{date}/{time}`

Common documented parameters:
- `stationId` - observation station ID
- `/stations` query parameters include `id`, `state`, `limit`, `cursor`
- `/stations/{stationId}/observations` query parameters include `start`, `end`, `limit`, `cursor`

### Offices, briefings, headlines, and stories (8 routes)
- `GET /offices/{officeId}`
- `GET /offices/{officeId}/briefing`
- `GET /offices/{officeId}/briefing/download/latest`
- `GET /offices/{officeId}/briefing/download/{briefingId}`
- `GET /offices/{officeId}/headlines`
- `GET /offices/{officeId}/headlines/{headlineId}`
- `GET /offices/{officeId}/weatherstories`
- `GET /offices/{officeId}/weatherstories/download/{imageId}`

Key documented path parameter:
- `officeId` - NWS office ID

### Point lookup (3 routes)
- `GET /points/{latitude},{longitude}`
- `GET /points/{latitude},{longitude}/radio`
- `GET /points/{latitude},{longitude}/stations`

Documented path parameters:
- `latitude` - numeric latitude, range `-90` to `90`, multiple-of `0.0001`
- `longitude` - numeric longitude, range `-180` to `180`, multiple-of `0.0001`

Important note:
- the point lookup endpoint is the canonical discovery step for mapping a location into forecast office, grid, zone, and station resources

### Radar infrastructure (7 routes)
- `GET /radar/servers`
- `GET /radar/servers/{id}`
- `GET /radar/stations`
- `GET /radar/stations/{stationId}`
- `GET /radar/stations/{stationId}/alarms`
- `GET /radar/queues/{host}`
- `GET /radar/profilers/{stationId}`

### NOAA Weather Radio (1 route)
- `GET /radio/{callSign}/broadcast`

### Text products (9 routes)
- `GET /products`
- `GET /products/locations`
- `GET /products/types`
- `GET /products/{productId}`
- `GET /products/types/{typeId}`
- `GET /products/types/{typeId}/locations`
- `GET /products/locations/{locationId}/types`
- `GET /products/types/{typeId}/locations/{locationId}`
- `GET /products/types/{typeId}/locations/{locationId}/latest`

Documented `/products` query parameters:
- `location` - location ID
- `start`, `end` - date-time window
- `office` - issuing office
- `wmoid` - WMO ID code
- `type` - product code
- `limit` - page size

### Zones (6 routes)
- `GET /zones`
- `GET /zones/{type}`
- `GET /zones/{type}/{zoneId}`
- `GET /zones/{type}/{zoneId}/forecast`
- `GET /zones/forecast/{zoneId}/observations`
- `GET /zones/forecast/{zoneId}/stations`

Documented zone parameters:
- `type` - zone type path selector
- `zoneId` - NWS public zone/county identifier
- collection filters include `id`, `area`, `region`, `type`, `point`, `include_geometry`, `effective`, `limit`

## Pagination and error details
- `limit` is documented across multiple collection endpoints with maximum `500`.
- `cursor` is documented as the pagination cursor on paged endpoints.
- Paged schemas in the OpenAPI document include a `pagination.next` URI.
- Error responses use a problem-detail object with required fields `type`, `title`, `status`, `detail`, `instance`, and `correlationId`.
- Error responses and many success responses include the NWS diagnostic headers `X-Correlation-Id`, `X-Request-Id`, and `X-Server-Id`.

## Canonical fireROUTE mapping notes
- Use `/points/{latitude},{longitude}` as the first step whenever the caller starts with a lat/lon location.
- Treat weather.gov as a broad platform, not a single forecast-only endpoint: alerts, forecasts, stations, radar, offices, products, and zones all live under the same base URL.
- Preserve content negotiation controls because some consumers need CAP, Atom, DWML, or observation XML rather than GeoJSON.
- Implement rate-limit backoff conservatively because the service explicitly rate-limits but does not publish exact thresholds.
- Preserve `User-Agent` customization in any upstream adapter because the official docs explicitly require it.

## Verification notes
This file was manually rebuilt from the live weather.gov API overview page and the official `openapi.json` specification using browser tools, replacing the earlier autogenerated summary.
