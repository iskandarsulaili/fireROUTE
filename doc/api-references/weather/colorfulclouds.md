# ColorfulClouds

## Provider metadata
- Category: `Weather`
- Provider slug: `colorfulclouds`
- Official docs used manually:
  - `https://open.caiyunapp.com/ColorfulClouds_Weather_API`
- Confirmed API base URL pattern: `https://api.caiyunapp.com/v2.5`
- Response format confirmed from docs examples: JSON (`weather.json`)
- Authentication model: token embedded in the URL path
- Manually confirmed routes in this pass: `1`

## Authentication
The official wiki page shows a demo token in examples and says production/development usage should use your own token after signing up. The token is embedded directly in the path.

## Manually confirmed endpoint family
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/v2.5/{token}/{lon},{lat}/weather.json` | General weather API for a coordinate | path token + coordinate pair; optional query parameters include `lang`, `unit`, and `granu` |

## Parameter and usage notes
- Coordinates are encoded directly into the path as `lon,lat`.
- Example language values shown on the page include `en_US`, `ja`, and `zh_CN`.
- Example unit values shown on the page include `metric` and `imperial`.
- The page shows `granu=minutely` for hyperlocal minute-by-minute nowcasting.
- The docs present the same endpoint family for general weather, localization, unit selection, and minute-level granularity.

## Response, rate-limit, and error notes
- The examples all use `weather.json`, indicating JSON responses.
- The docs say the demo token quota is very limited and renewed periodically.
- No pagination model is documented for the endpoint family.
- No formal public error schema was clearly exposed on the inspected page.

## Important fireROUTE notes
- ColorfulClouds is coordinate-first and token-in-path rather than header-auth or query-auth.
- A single endpoint family appears to cover several usage modes via query parameters.

## Verification notes
This file was manually rebuilt from Caiyun's official ColorfulClouds Weather API wiki page.