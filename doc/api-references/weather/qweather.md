# QWeather

## Provider metadata
- Category: `Weather`
- Provider slug: `qweather`
- Official docs used manually:
  - `https://dev.qweather.com/en/docs/api/weather/`
  - `https://dev.qweather.com/en/docs/api/weather/weather-now/`
  - `https://dev.qweather.com/en/docs/api/weather/weather-daily-forecast/`
  - `https://dev.qweather.com/en/docs/api/weather/weather-hourly-forecast/`
  - `https://dev.qweather.com/en/docs/api/weather/grid-weather-now/`
  - `https://dev.qweather.com/en/docs/api/weather/grid-weather-daily-forecast/`
  - `https://dev.qweather.com/en/docs/api/weather/grid-weather-hourly-forecast/`
  - `https://dev.qweather.com/en/docs/configuration/api-host/`
  - `https://dev.qweather.com/en/docs/configuration/authentication/`
  - `https://dev.qweather.com/en/docs/resource/error-code/`
  - `https://dev.qweather.com/en/docs/finance/pricing/`
- Confirmed API host model: dedicated per-account API host, used as `https://{your_api_host}`
- Example official host pattern: `abc1234xyz.def.qweatherapi.com`
- Confirmed API version family for the reviewed routes: `v7`
- Primary route family reviewed in detail in this pass: `Weather`
- Response format confirmed from endpoint pages: JSON, gzip-compressed
- Authentication confirmed from official configuration docs: JWT bearer token preferred; API key also supported
- Manually confirmed routes in this pass: `6`

## Authentication and host model
- QWeather no longer documents a single shared fixed weather hostname as the preferred entry point.
- Each developer account has its own dedicated API host and the docs say this host is part of the authentication process.
- Official examples use URLs like `https://your_api_host/v7/...`.
- The API Host page warns that legacy shared domains such as `api.qweather.com`, `devapi.qweather.com`, and `geoapi.qweather.com` will be gradually discontinued starting in `2026`.
- The authentication page says QWeather supports both `JWT` and `API KEY` authentication, and explicitly recommends `JWT` as the preferred method.
- JWT requests use `Authorization: Bearer {token}`.
- API key requests can use either:
  - `X-QW-Api-Key: {key}` request header
  - `key={key}` query parameter
- The compatibility table says `API v7` supports JWT and API key auth. `API KEY signature` is listed only for credentials created before `2024-11-01`, and the page also states API key signature authentication is no longer supported.

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/v7/weather/now` | Real-time city weather | required `location`; optional `lang`, `unit` |
| GET | `/v7/weather/{days}` | Daily city forecast | path `days`; required `location`; optional `lang`, `unit` |
| GET | `/v7/weather/{hours}` | Hourly city forecast | path `hours`; required `location`; optional `lang`, `unit` |
| GET | `/v7/grid-weather/now` | Real-time gridded weather for coordinates | required `location`; optional `lang`, `unit` |
| GET | `/v7/grid-weather/{days}` | Daily gridded forecast for coordinates | path `days`; required `location`; optional `lang`, `unit` |
| GET | `/v7/grid-weather/{hours}` | Hourly gridded forecast for coordinates | path `hours`; required `location`; optional `lang`, `unit` |

## Route-level notes from the official endpoint pages
### 1) `GET /v7/weather/now`
- Purpose: current observed weather for a city or point.
- Required query parameter: `location`
- Optional query parameters: `lang`, `unit`
- `location` accepts either a `LocationID` or comma-separated longitude/latitude.
- Official note: real-time data are near-real-time and can lag physical conditions by roughly `5-20 minutes`; the docs tell clients to use `obsTime` for the precise observation timestamp.

### 2) `GET /v7/weather/{days}`
- Purpose: daily city forecast.
- Path parameter: `days`
- The docs say this route supports forecasts up to `30` days.
- The reviewed page lists `3d`, `7d`, `10d`, and `15d`, then repeats `15d` for the `30 days forecast` line; this appears to be an official docs typo, so the route should be treated as a templated daily-forecast endpoint with variant values documented on the page.
- Query parameters: required `location`; optional `lang`, `unit`

### 3) `GET /v7/weather/{hours}`
- Purpose: hourly city forecast.
- Path parameter: `hours`
- Officially listed values: `24h`, `72h`, `168h`
- Query parameters: required `location`; optional `lang`, `unit`

### 4) `GET /v7/grid-weather/now`
- Purpose: current grid-model weather at a coordinate.
- Required query parameter: `location`
- Optional query parameters: `lang`, `unit`
- Grid-weather `location` must be comma-separated longitude/latitude; the page does not document `LocationID` support for the grid endpoints.

### 5) `GET /v7/grid-weather/{days}`
- Purpose: daily grid-model forecast at a coordinate.
- Path parameter: `days`
- Officially listed values: `3d`, `7d`
- Query parameters: required `location`; optional `lang`, `unit`

### 6) `GET /v7/grid-weather/{hours}`
- Purpose: hourly grid-model forecast at a coordinate.
- Path parameter: `hours`
- Officially listed values: `24h`, `72h`
- Query parameters: required `location`; optional `lang`, `unit`

## Parameter, response, and format notes
- City-weather routes and grid-weather routes share the same optional localization/unit controls:
  - `lang` for response language
  - `unit=m` for metric default
  - `unit=i` for imperial
- Endpoint pages repeatedly state responses are `JSON` and `Gzip` compressed.
- Endpoint examples use `curl -X GET --compressed` and bearer-token auth against the dedicated host.
- Reviewed examples show common top-level fields such as:
  - `code`
  - `updateTime`
  - `fxLink`
  - a data payload object or array such as `now`, `daily`, or `hourly`
  - `refer.sources`
  - `refer.license`
- Real-time and forecast payloads expose weather fields such as temperature, wind, humidity, precipitation, pressure, cloud cover, and condition text/icon values.

## Rate limits, pagination, pricing, and errors
- The reviewed weather endpoint pages do not document pagination; these endpoints return single weather payloads rather than paged collections.
- The reviewed endpoint pages also do not publish a simple fixed per-endpoint numeric rate-limit table.
- The pricing page says QWeather Developer services use a `pay-as-you-go` billing model with per-request billing and monthly tiered pricing.
- The pricing page groups `Weather`, `Minutely Forecast`, `Warning`, `Weather Indices`, `Air Quality`, `Time Machine`, `GeoAPI`, `Astronomy`, and `Console API` into the same `Weather and Essential Services` pricing family.
- The pricing page says average daily request volume over `1,000,000` should be discussed with sales for a custom plan.
- The error-code page says QWeather currently has both `v1` and `v2` error-code systems in circulation during a migration period.
- Confirmed v2 error examples from the official error reference:
  - `INVALID PARAMETER` → HTTP `400`
  - `MISSING PARAMETER` → HTTP `400`
  - `NO SUCH LOCATION` → HTTP `400`
  - `DATA NOT AVAILABLE` → HTTP `400`
- The error-code page explicitly tells clients to temporarily stop requests when errors occur and warns that continuously sending erroneous requests can look like a DDoS attack and may trigger account suspension.

## Important fireROUTE notes
- QWeather should not be normalized as a single public fixed-host API; the base URL is account-specific.
- JWT bearer auth is the preferred modern integration path.
- API key auth still works for API v7, but API key signature is deprecated/legacy-only.
- The official docs tree covers additional QWeather product families beyond the six weather-family routes documented above, including Minutely Forecast, Warning, Weather Indices, Air Quality, Time Machine, Tropical Cyclone, Ocean, Solar Radiation, Astronomy, and Console API.
- This rewritten file replaces the earlier weak 2-route summary with a route-level manual reference for the full official `Weather` section that was reviewed in detail in this pass.

## Verification notes
This file was manually rebuilt from the live official QWeather weather, configuration, pricing, and error-reference pages using browser tools only.