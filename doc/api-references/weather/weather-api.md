# weather-api

## Provider metadata
- Category: `Weather`
- Provider slug: `weather-api`
- Official docs used manually:
  - `https://raw.githubusercontent.com/robertoduessmann/weather-api/master/README.md`
- Confirmed public host documented by the project: `http://goweather.xyz`
- Response format confirmed from the official README: JSON
- Authentication model: none documented
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/weather/{city}` | Current weather plus short forecast for a city | path parameter `city` |

## Response notes
The official README example shows a JSON response containing:
- `temperature`
- `wind`
- `description`
- `forecast[]` with `day`, `temperature`, and `wind`

## Usage notes
- The project README describes the service as a REST API to check the current weather.
- Local development examples use `http://localhost:3000/weather/{city}`.
- The public hosted example in the README uses `http://goweather.xyz/weather/Berlin`.
- No auth, pagination, or formal rate-limit policy is documented in the official README.

## Important fireROUTE notes
- This is a very small single-route service.
- The documented public example uses plain HTTP rather than HTTPS.
- The upstream appears project-maintained rather than a commercial weather platform with rich quota/error docs.

## Verification notes
This file was manually rebuilt from the project's official README.