# ODWeather

## Provider metadata
- Category: `Weather`
- Provider slug: `odweather`
- Official docs used manually:
  - `https://api.oceandrivers.com/static/docs.html`
  - `https://api.oceandrivers.com/static/resources.json`
  - `https://api.oceandrivers.com/api/ODWeather`
- Confirmed API base URL: `https://api.oceandrivers.com`
- Response formats confirmed from the official Swagger resource: `application/json`, `text/html`
- Authentication model: no API key documented in the inspected Swagger description
- Manually confirmed routes in this pass: `6`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/v1.0/getAemetStation/{stationName}/{period}/` | Data from AEMET stations | path `stationName`, path `period` (`lastdata` or `lastday`) |
| GET | `/v1.0/getSocibWeatherStation/{stationName}/{period}/` | Data from SOCIB Bahia de Palma buoy/weather stations | path `stationName`, path `period` (`lastdata`, `lasthour`, `lastday`) |
| GET | `/v1.0/getWeatherDisplay/{stationName}/` | Weather Display software station data | path `stationName`, query `period` (`latestdata`, `latesthour`, `latestday`, `dailylog`) |
| GET | `/v1.0/getEasyWind/{easywindId}/` | EasyWind station data | path `easywindId`, query `period` (`latestdata`, `latesthour`, `latestday`) |
| GET | `/v1.0/getEventStations/{eventId}/` | Stations for an event | path `eventId` |
| GET | `/v1.0/getForecastPoints/{yatchclubid}/language/{language}` | Forecast points for a yacht club | path `yatchclubid`, path `language` |

## Documentation notes from the official Swagger resource
- The Swagger resource describes the service as `OD-Weather API`.
- The API explorer loads from `https://api.oceandrivers.com/static/resources.json`.
- The detail resource at `/api/ODWeather` publishes `basePath: https://api.oceandrivers.com`.
- The inspected operation definitions use lowercase `get` methods and path/query parameters in classic Swagger 1.2 format.

## Rate limits, pagination, and errors
- No authentication or quota section was visible in the inspected Swagger resources.
- No pagination scheme was documented for the confirmed endpoints.
- No formal error model was visible in the inspected snippets.

## Important fireROUTE notes
- This is a path-heavy API with provider-specific station ids and event ids rather than a generic global location query format.
- Several endpoints encode time range as a provider-specific `period` value rather than explicit start/end timestamps.
- The upstream still uses an older Swagger 1.2 style description.

## Verification notes
This file was manually rebuilt from OceanDrivers' live Swagger explorer and JSON resource descriptors.