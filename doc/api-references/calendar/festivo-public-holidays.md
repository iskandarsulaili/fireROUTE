# Festivo Public Holidays

## Provider metadata
- Category: `Calendar`
- Provider slug: `festivo-public-holidays`
- Official docs used manually:
  - `https://getfestivo.com/docs`
  - `https://getfestivo.com/docs/api-reference`
- Confirmed API base URL: `https://api.getfestivo.com/v3`
- Primary response formats: `application/json` by default, optional `xml` on eligible plans
- Authentication:
  - recommended header: `X-API-Key: {api_key}`
  - legacy compatibility: `api_key` query parameter
- Manually confirmed routes in this pass: `1`

## Authentication and common behavior
From the reviewed official docs:
- every request must include an API key
- Festivo now recommends the `X-API-Key` header over query-string auth
- `api_key` in the query string is still documented for legacy compatibility
- all requests must use TLS 1.2+
- the currently documented API version is `v3`
- the docs say V2 was retired on `2026-03-15`

## Confirmed API surface
The current public-holidays product docs reviewed in this pass expose one documented REST endpoint:

| Method | Path | Purpose | Key parameters / official notes |
|---|---|---|---|
| `GET` | `/public-holidays/list` | list holidays and observances for a country, optionally narrowed to regions/cities and date filters | requires `country`, `year`, and auth; optional month/day/type/language/timezone/format filters depend on plan |

## Route details

### 1) GET /public-holidays/list
- Full URL: `https://api.getfestivo.com/v3/public-holidays/list`
- Purpose: retrieve public holidays, local holidays, religious holidays, and observances.

Required parameters in the reviewed docs:
- `api_key` when using query auth
- `country` - ISO 3166-1 alpha-2 country code such as `GB`, `IT`, `US`
- `year` - target year, e.g. `2026`

Optional parameters documented as available to all plans:
- `month` - `1` to `12`
- `day` - `1` to `31`

Optional Builder-plan-and-above filters:
- `regions` - comma-separated ISO 3166-2 region codes or city codes
- `after` - lower date bound in `YYYY-MM-DD`
- `before` - upper date bound in `YYYY-MM-DD`
- `type` - holiday type filter
- `public_only` - boolean

Optional Growth-plan-and-above filters:
- `language` - ISO 639-1 language code for localized holiday names
- `timezone` - timezone conversion target such as `America/New_York`
- `format` - `json` or `xml`

Important official plan notes:
- city-level queries use `regions` with values like `IT-MILAN` and require `Pro` or above
- ISO subdivision filtering such as `GB-SCT` is documented from `Builder` upward
- requests that use unavailable plan features return an error

Reviewed response fields include:
- top-level `holidays`
- top-level `total`
- top-level `query`
- top-level `requestId`
- top-level `status`
- holiday object fields such as:
  - `country`
  - `date`
  - `end`
  - `id`
  - `localLanguage`
  - `name`
  - `name_local`
  - `observed`
  - `public`
  - `start`
  - `subdivisions`
  - `regions`
  - `substitute`
  - `type`
  - `weekday`
  - `dataVersion`
  - `deprecated`

## Holiday classification and geography notes
The reviewed docs explicitly define these holiday-type values:
- `public`
- `observance`
- `regional`
- `religious`
- `governmental`
- `bank`

Geography notes from the official docs:
- `subdivisions: []` means nationwide coverage
- subdivision codes follow ISO 3166-2 patterns such as `GB-SCT`, `US-CA`, `US-NY`
- the newer structured `regions` array returns objects like `{ code, type }`
- `type` inside `regions` distinguishes `city` from `region`

## Rate limits, errors, and format notes
Reviewed response/status information:
- `200` - success
- `400` - invalid parameters
- `401` - invalid or missing API key
- `403` - API key lacks access to the endpoint or requested feature
- `404` - resource does not exist
- `429` - rate limit exceeded
- `500` - internal server error

Published daily limits by plan on the reviewed page:
- Explorer: `100` requests/day
- Builder: `10,000` requests/day
- Growth: `50,000` requests/day
- Pro: `200,000` requests/day
- Titan: unlimited with custom limits

Reviewed rate-limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

Format notes from the reviewed docs:
- JSON is the default response format
- XML output is documented behind eligible paid plans
- the docs do not describe cursor/page-number pagination for this endpoint

## Important usage notes
- Festivo’s current public docs show a single route with many query controls rather than a broad multi-endpoint calendar surface.
- The `regions` parameter is overloaded intentionally: it accepts ISO subdivisions and, on higher plans, city codes.
- The `deprecated` and `dataVersion` response fields are operationally important because the docs position them as forward-compatibility signals.
- Timestamps such as `start` and `end` are documented in UTC ISO 8601 format unless a timezone conversion feature is used.

## Verification notes
This file was manually rebuilt from the live official Festivo documentation using browser-based review only.