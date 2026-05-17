# Weatherstack

## Provider metadata
- Category: `Weather`
- Provider slug: `weatherstack`
- Official pages manually reviewed in this pass:
  - `https://docs.apilayer.com/weatherstack/docs/api-documentation`
  - `https://docs.apilayer.com/weatherstack/docs/quickstart-guide`
  - `https://weatherstack.com/pricing`
- Documented API base host: `api.weatherstack.com`
- Canonical example base URL shown in quickstart examples: `http://api.weatherstack.com/`
- Transport note: the product/docs pages market secure HTTPS support, but the quickstart examples still use `http://` URLs
- Response format: JSON
- Authentication model: query-string API key via `access_key`
- Manually confirmed routes in this pass: `5`

## Authentication
The official quickstart guide states that each request must include your personal Weatherstack `API Access Key` as the `access_key` query parameter.

Documented example pattern:
- `http://api.weatherstack.com/current?access_key=YOUR_ACCESS_KEY&query=New York`

## Common request conventions
From the official docs pages reviewed:
- Requests are made by combining the base host with an endpoint path such as `/current` or `/forecast`
- Location selection is passed through the `query` parameter
- The docs/product pages describe support for city names, regions, ZIP/postal codes, coordinates, and IP-based lookups depending on endpoint context
- `units` controls output units with documented values `m`, `s`, and `f`
- `language` enables localized weather-description arrays
- `format=1` enables pretty-printed JSON for debugging
- The docs note that each location/date pair in a bulk request counts as one API call

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters | Availability notes |
|---|---|---|---|---|
| GET | `/current` | Real-time weather for one location | required `access_key`, required `query`; optional `units`, `language`, `callback` | docs summary says `Free and above` |
| GET | `/historical` | Historical weather for a specific date or date range | required `access_key`, required `query`; uses `historical_date` or `historical_date_start` + `historical_date_end`; optional `hourly`, `interval`, `units`, `language`, `callback` | docs summary says `Standard and higher` |
| GET | `/forecast` | Multi-day forecast | required `access_key`, required `query`; optional `forecast_days`, `hourly`, `interval`, `units`, `language`, `callback` | docs summary says `Professional and above` |
| GET | `/marine` | Marine weather data by coordinates | official docs summary confirms the route and its marine-weather purpose; no richer public parameter table was exposed on the reviewed docs pages | docs summary says `Standard and above` |
| GET | `/locations` | Location autocomplete / lookup | official docs summary confirms support for cities, regions, IPs, and ZIP codes | docs summary says `Standard and above` |

## Endpoint family notes
### `/current`
Quickstart examples show the current-weather pattern as:
- `http://api.weatherstack.com/current?access_key=YOUR_ACCESS_KEY&query=New York`

Documented optional parameters shown with the current example:
- `units`
- `language`
- `callback`

### `/historical`
The reviewed official pages describe two historical request shapes on the same path:
- single-date historical lookup using `historical_date`
- date-range time-series lookup using `historical_date_start` and `historical_date_end`

Documented optional parameters shown with historical examples:
- `hourly=1`
- `interval=3`
- `units`
- `language`
- `callback`

### `/forecast`
Quickstart examples show:
- `http://api.weatherstack.com/forecast?access_key=YOUR_ACCESS_KEY&query=New York`

Documented optional parameters shown with the forecast example:
- `forecast_days=7`
- `hourly=1`
- `interval=3`
- `units`
- `language`
- `callback`

The API documentation summary says forecast coverage is available for up to 14 days.

### `/marine`
The official API summary explicitly lists `/marine` as the marine-weather endpoint and describes it as coordinate-based.

The reviewed pricing page also lists `Marine API Data` as an included capability on paid plans, reinforcing that marine access is a separate product family rather than just an undocumented example.

### `/locations`
The official API summary describes `/locations` as an autocomplete / lookup route for:
- cities
- regions
- IPs
- ZIP codes

The pricing page likewise markets location lookup/autocomplete as a dedicated feature family.

## Plans, quotas, and rate-limit-related notes
The reviewed pricing page publishes plan request volumes rather than a per-second throttle table:
- Free: `100` calls per month
- Standard: `50,000` calls per month
- Professional: `300,000` calls per month
- Business: `1,000,000` calls per month
- Enterprise: custom volume

Feature gating confirmed from the pricing/docs pages reviewed:
- Free includes real-time weather
- Standard adds location search, historical data, marine data, astronomy data, and hour-by-hour data
- Professional adds forecast data, multilingual support, and bulk queries
- Business raises forecast coverage to 14 days and increases quota further

The public pages reviewed did not expose a simple official numeric requests-per-second limit.

## Pagination, errors, and response-format notes
- Response format is JSON on the reviewed public docs pages
- The reviewed public docs pages did not document a cursor or page-number pagination scheme
- The reviewed pages did not expose a consolidated public error-code table
- `callback` in example requests indicates JSONP-style wrapping is still supported on at least the example flows

## Important fireROUTE usage notes
- Weatherstack uses query-string auth (`access_key`), not Authorization headers in the reviewed public examples
- The docs currently mix transport signals: product/docs copy advertises secure HTTPS support, while quickstart examples still use `http://api.weatherstack.com/`; fireROUTE should prefer TLS where the upstream account/plan supports it
- Historical single-date and historical time-series requests share the same `/historical` path and are distinguished by parameter shape
- Bulk behavior is described as call-counting by location/date pair, but the reviewed public docs pages did not expose a separate public `/bulk` route
- The same provider also appears in the `apilayer-featured` category, so route facts should stay aligned even if this weather-category file is maintained separately

## Verification notes
This file was manually rebuilt from Weatherstack's live official docs and pricing pages in the browser, replacing the earlier lower-detail manual summary.