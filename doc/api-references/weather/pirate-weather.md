# Pirate Weather

## Provider metadata
- Category: `Weather`
- Provider slug: `pirate-weather`
- Official docs used: `https://pirateweather.net/en/latest/API/`
- Forecast base host: `https://api.pirateweather.net`
- Time-machine base host: `https://timemachine.pirateweather.net`
- Response format: JSON
- Auth model: API key embedded in the path
- Provider style: Dark Sky-compatible forecast API with Pirate Weather extensions

## Core request model
Provider docs state all request attributes are contained within the URL.
- Request headers are not parsed by the API.
- Returned headers are primarily debugging information.
- Main data is in the JSON payload.

The minimum forecast request documented is:
- `https://api.pirateweather.net/forecast/[apikey]/[latitude],[longitude]`

Full documented URL option pattern:
- `https://api.pirateweather.net/forecast/[apikey]/[latitude],[longitude],[time]?exclude=[excluded]&units=[unit]&extend=[hourly]&version=[2]&lang=[lang]&extraVars=[stationPressure]&include=[day_night_forecast]`

## 1) Forecast request
- Method: `GET`
- Path pattern: `/forecast/{apikey}/{latitude},{longitude}`
- Optional time variant: `/forecast/{apikey}/{latitude},{longitude},{time}`
- Full base URL: `https://api.pirateweather.net`
- Purpose: current conditions, hourly forecast, daily forecast, alerts-compatible Dark Sky style response

Path parameters:
- `apikey` - required API key; provider says it must be requested from Pirate Weather and subscribed before use
- `latitude` - required coordinate
- `longitude` - required coordinate
- `time` - optional for forecast requests, mandatory for historic-style requests on the forecast path variant

Documented query parameters:
- `exclude` - optional list of excluded sections
- `units` - optional unit selector
- `extend` - optional; docs specifically mention `extend=hourly`
- `version` - optional; docs mention `version=2`
- `lang` - optional language
- `extraVars` - optional; docs example mentions `stationPressure`
- `include` - optional; docs say currently only `day_night_forecast` is allowed

Important usage notes from provider docs:
- If `time` is omitted, the current time is used.
- If `time` is present, the request is treated as if it were requested at that time.
- Results are returned in UTC using UNIX timestamps.
- `extend=hourly` expands hourly data from the default 48 hours to 168 hours.
- `include=day_night_forecast` adds an extra day/night forecast block not available in the original Dark Sky API.

Documented example:
- `GET https://api.pirateweather.net/forecast/1234567890abcdefghijklmnopqrstuvwxyz/45.42,-74.30?&units=ca`

## 2) Time Machine request
- Method: `GET`
- Path pattern: `/forecast/{apikey}/{latitude},{longitude},{time}`
- Base URL: `https://timemachine.pirateweather.net`
- Full documented pattern: `https://timemachine.pirateweather.net/forecast/[apikey]/[latitude],[longitude],[time]?exclude=[excluded]&units=[unit]`
- Purpose: archived / historic weather retrieval

Path parameters:
- `apikey` - required
- `latitude` - required
- `longitude` - required
- `time` - required historical timestamp

Documented query parameters:
- `exclude` - optional excluded sections
- `units` - optional unit selector
- `tmextra` - optional; docs say this controls which variables are returned for PW archive requests

Provider notes:
- Uses archived 1-hour model results for the last 10 days or Google ERA5 data updated weekly and about 10 days behind realtime.
- Response format is the same as forecast except for data-source differences.
- If `tmextra` is included for PW archive requests, forecast-style variables are returned except alerts.
- Without `tmextra`, a narrower ERA5-style parameter set is returned.

Documented example:
- `GET https://timemachine.pirateweather.net/forecast/1234567890abcdefghijklmnopqrstuvwxyz/45.42,-74.30,1654056000?&units=ca`

## Response blocks documented by provider
The docs explicitly describe these response blocks / structures:
- `currently`
- `hourly`
- `daily`
- `day_night_forecast` when requested via `include=day_night_forecast`

Documented forecast horizon notes:
- `hourly` normally covers next 48 hours
- `hourly` covers next 168 hours when `extend=hourly` is used
- `daily` contains day-by-day forecasted conditions for the next 7 days
- `day_night_forecast` is a 16-item alternating day/night list for the next 7 days starting from the current day

## Documented field / behavior notes
The docs page explicitly mentions these field families and behaviors:
- `precipAccumulation`
- `liquidAccumulation`
- `snowAccumulation`
- `iceAccumulation`
- `precipIntensity`
- day icon behavior in version 2.7+
- model metadata describing which models generated the forecast
- grid-cell metadata for model coordinates
- units metadata
- Pirate Weather version metadata
- ingest version metadata
- response header `X-Forecast-API-Calls`

## Auth and subscription notes
Provider docs say:
- API keys are requested from `https://pirateweather.net/`
- after signup, the forecast API must be subscribed to
- after subscribing, propagation may take up to 20 minutes
- the key is secret and should not be hard-coded or committed

## fireROUTE normalization notes
- This provider uses path-based API keys rather than header or query-string auth.
- Forecast and time-machine traffic use different upstream hosts.
- Time is part of the path, not the query string.
- Dark Sky-style response compatibility makes this a useful fallback candidate for legacy forecast consumers.
- `extend`, `include`, `extraVars`, and `tmextra` should be preserved as passthrough provider extensions.

## Verification notes
This file was manually rebuilt from the official Pirate Weather API docs page using browser tools, replacing the earlier autogenerated summary.
