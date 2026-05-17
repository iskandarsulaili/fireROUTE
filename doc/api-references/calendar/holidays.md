# Holidays

## Provider metadata
- Category: `Calendar`
- Provider slug: `holidays`
- Official docs used manually:
  - `https://holidayapi.com/docs`
  - `https://holidayapi.com/`
- Confirmed API base URL: `https://holidayapi.com`
- Primary response formats documented: `json`, `csv`, `php`, `tsv`, `yaml`, `xml`
- Authentication: API key passed as request parameter `key`
- Manually confirmed routes in this pass: `5`

## Authentication and common behavior
From the reviewed official docs:
- every documented route requires the `key` request parameter
- Holiday API returns the HTTP status code both as the real HTTP status and as the `status` field in the response body
- the docs expose a `requests` object in responses for current monthly usage information

## Confirmed API surface
The reviewed documentation page explicitly documents these routes:
- `GET /v1/holidays`
- `GET /v1/countries`
- `GET /v1/languages`
- `GET /v1/workday`
- `GET /v1/workdays`

## 1) List holidays
- Method: `GET`
- Path: `/v1/holidays`
- Purpose: retrieve public holidays and observances for countries, states, and provinces

Required parameters:
- `country` - ISO 3166-1 alpha-2 or alpha-3 country code, or ISO 3166-2 subdivision code on supported plans; accepts up to 10 comma-separated values
- `key` - your API key
- `year` - 4-digit ISO 8601 year

Optional parameters:
- `month` - `1` to `12`
- `day` - day of month; must be used with `month`
- `public` - boolean; return only public holidays
- `subdivisions` - boolean; include state/province holidays on supported plans
- `search` - string, minimum 5 characters
- `language` - ISO 639-1 code with documented exceptions
- `previous` - boolean; requires specific date and cannot be used with `upcoming`
- `upcoming` - boolean; requires specific date and cannot be used with `previous`
- `format` - one of the documented output formats
- `pretty` - boolean; pretty-print results

Documented response fields:
- `status`
- `requests`
- `holidays`
- optional `error`
- optional `warning`
- optional `holidays.subdivisions`

## 2) List supported countries
- Method: `GET`
- Path: `/v1/countries`
- Purpose: list countries and available states / provinces

Required parameters:
- `key`

Optional parameters:
- `country` - return only the matching country code
- `search` - search by country code or name, minimum 2 characters
- `public` - return only countries with public holidays
- `format`
- `pretty`

Documented response fields:
- `status`
- `requests`
- `countries`
- optional `error`
- optional `warning`

## 3) List supported languages
- Method: `GET`
- Path: `/v1/languages`
- Purpose: list supported holiday languages

Required parameters:
- `key`

Optional parameters:
- `language` - return only the specified language code
- `search` - search by language code or name, minimum 2 characters
- `format`
- `pretty`

Documented response fields:
- `status`
- `requests`
- `languages`
- optional `error`
- optional `warning`

## 4) Calculate a future or past workday
- Method: `GET`
- Path: `/v1/workday`
- Purpose: calculate the workday that occurs a given number of business days after or before a start date

Required parameters:
- `key`
- `country` - country or subdivision code in the same formats documented for `/v1/holidays`
- `start` - start date in `YYYY-MM-DD`
- `days` - non-zero integer; positive to move forward, negative to move backward

Optional parameters:
- `format`
- `pretty`

Documented response fields:
- `status`
- `requests`
- `date`
- `weekday`
- optional `error`
- optional `warning`

## 5) Count workdays between two dates
- Method: `GET`
- Path: `/v1/workdays`
- Purpose: return the number of business days between two dates

Required parameters:
- `key`
- `country`
- `start` - start date in `YYYY-MM-DD`
- `end` - end date in `YYYY-MM-DD`

Optional parameters:
- `format`
- `pretty`

Documented response fields:
- `status`
- `requests`
- `workdays`
- optional `error`
- optional `warning`

## Status codes and rate limits
The reviewed docs explicitly document these status codes:
- `200` - success
- `400` - request parameter error
- `401` - unauthorized / missing API key
- `402` - upgrade required or delinquent account
- `403` - insecure request; HTTPS only
- `429` - monthly rate limit exceeded
- `500` - server-side failure

Rate-limit notes from the official docs:
- monthly rate limits vary by plan
- current monthly usage can be tracked through the `requests` property in the response body
- the docs do not publish a single numeric quota because it is plan-dependent

## Format and pagination notes
- The official docs explicitly support multiple response formats through the `format` parameter.
- The reviewed route pages do not document a generic pagination mechanism.
- The API uses simple filter/query parameters rather than cursor or page-based pagination on the reviewed routes.

## fireROUTE notes
- Holiday API is broader than the old single-route note suggested; the official docs expose discovery routes for countries and languages plus two business-day calculation routes.
- The `requests` object is important operationally because the provider uses it to expose month-to-date usage.
- `previous` and `upcoming` on `/v1/holidays` are mutually exclusive according to the docs.

## Verification notes
This file was manually rebuilt from the live official Holiday API documentation using browser inspection.