# Public Holidays

## Provider metadata
- Category: `Calendar`
- Provider slug: `public-holidays`
- Official pages reviewed manually:
  - `https://www.abstractapi.com/api/holidays-api`
  - `https://docs.abstractapi.com/api/holidays`
- Confirmed API base URL: `https://holidays.abstractapi.com/v1/`
- Manually confirmed route count: `1`

## API surface confirmed from official docs
The current first-party Abstract API documentation exposes one public-holidays lookup endpoint:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/` | Return holidays for a country, optionally narrowed by year, month, and day |

## Authentication
- Authentication uses query parameter `api_key`.
- The docs state each Abstract API product has its own unique key.
- The docs say the API key must be appended to the request URL.

## Request parameters
### `GET /v1/`
Required:
- `api_key` — your Public Holidays API key
- `country` — two-letter ISO 3166-1 alpha-2 country code

Optional:
- `year` — holiday year
- `month` — month number
- `day` — day number

Official usage notes:
- on free plans, `year`, `month`, and `day` are described as required for the narrower lookups documented on the page
- if `day` is provided, `month` and `year` must also be provided
- if `month` is provided, `year` must also be provided
- if a valid query matches no holidays, the API returns HTTP `200` with an empty array

## Response format
- The docs describe the API as a RESTful JSON API.
- Responses are returned as JSON arrays of holiday objects.
- Documented response fields include:
  - `name`
  - `name_local`
  - `language`
  - `description`
  - `country`
  - `location`
  - `type`
  - `date`
  - `date_year`
  - `date_month`
  - `date_day`
  - `week_day`

## Rate limits
- The reviewed docs publish a free-plan throttle of `1 request per second`.
- The docs also note `422` can be returned when API credits are insufficient on free plans.

## Pagination
- No pagination model is documented.
- The reviewed endpoint returns the matching holidays directly as one JSON array.

## Errors
Officially documented response/error codes:
- `200` — OK
- `400` — Bad request
- `401` — Unauthorized; API key missing or incorrect
- `422` — Quota reached / insufficient API credits on free plans
- `429` — Too many requests
- `500` — Internal server error
- `503` — Service unavailable

## Important usage notes
- The docs require TLS `1.2` or greater.
- The reviewed docs say the API is currently on version `1`.
- The marketing page and docs page now align and both clearly point to the same current Public Holidays product.

## Verification note
This file was manually rebuilt from the current official Abstract API Public Holidays product page and the live first-party documentation page using browser-based review only.
