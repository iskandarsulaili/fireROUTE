# Checkiday - National Holiday API

## Provider metadata
- Category: `Calendar`
- Provider slug: `checkiday-national-holiday-api`
- Official docs used manually:
  - `https://marketplace.apilayer.com/checkiday-api`
  - `https://marketplace.apilayer.com/code/widget?api_id=231&method=get&endpoint=/event`
  - `https://marketplace.apilayer.com/code/widget?api_id=231&method=get&endpoint=/events`
  - `https://marketplace.apilayer.com/code/widget?api_id=231&method=get&endpoint=/search`
- Confirmed API base URL: `https://api.apilayer.com/checkiday`
- Primary response format documented: JSON
- Authentication: API key sent in the custom `apikey` HTTP header
- Manually confirmed routes in this pass: `3`

## Authentication and common behavior
- All reviewed examples send the API key in an `apikey` header.
- The docs say all API requests must be made over HTTPS; plain HTTP requests fail.
- The reviewed documentation describes the API as REST/resource-oriented and using standard HTTP methods and status codes.
- Subscription tier affects route and parameter availability:
  - `/event` is documented as Pro and Enterprise only.
  - `/search` is documented as Pro and Enterprise only.
  - `/events` is generally available, but `date` is documented as Pro and Enterprise only and `timezone` is documented as Enterprise only.

## Confirmed API surface

### 1) Get event details
- Method: `GET`
- Path: `/event`
- Full URL: `https://api.apilayer.com/checkiday/event`
- Purpose: return detailed information for a single event
- Query parameters:
  - `id` - required event id
  - `start` - optional start year
  - `end` - optional end year
- Plan note: Pro and Enterprise only

### 2) List events
- Method: `GET`
- Path: `/events`
- Full URL: `https://api.apilayer.com/checkiday/events`
- Purpose: return event listings for the requested context/date
- Query parameters:
  - `adult` - optional adult-events flag
  - `date` - optional target date; docs mark it Pro and Enterprise only
  - `timezone` - optional timezone; docs mark it Enterprise only
- Response sample shows `events` entries with `id`, `name`, and canonical Checkiday `url`

### 3) Search events
- Method: `GET`
- Path: `/search`
- Full URL: `https://api.apilayer.com/checkiday/search`
- Purpose: search for matching events
- Query parameters:
  - `query` - required search term
  - `adult` - optional adult-events flag
- Plan note: Pro and Enterprise only
- Documentation note: the parameter table includes optional `adult`, but the generated code sample only shows `query`; treat the parameter table as the fuller source.

## Pagination
- No pagination scheme was documented on the reviewed official pages.
- None of the reviewed route docs mention `page`, `offset`, `limit`, cursor tokens, or continuation headers.

## Rate limits
- Quotas are plan-dependent.
- The docs say rate limits are enforced both daily and monthly.
- The reviewed docs explicitly list these response headers:
  - `x-ratelimit-limit-month`
  - `x-ratelimit-remaining-month`
  - `x-ratelimit-limit-day`
  - `x-ratelimit-remaining-day`
- When a limit is exceeded, the docs say the API returns HTTP `429` with a JSON `message`.

## Error handling
- The reviewed docs explicitly list:
  - `400` - bad request / missing required parameter
  - `401` - unauthorized / no valid API key
  - `404` - requested resource not found
  - `429` - rate limit exceeded
  - `5xx` - server-side error
- The docs say failed responses include a JSON body with a `message` field.

## Response format notes
- Responses are JSON.
- `/event` returns a nested `event` object; the official sample includes fields such as `adult`, `alternate_names`, `analytics`, and `description`.
- `/events` and `/search` samples return an `events` array with event `id`, `name`, and Checkiday `url` values.
- The docs page itself is HTML with embedded request/response widgets, but the reviewed API payload examples are JSON.

## Important usage notes
- Use the APILayer `apikey` header; the reviewed docs do not show query-string API keys for this provider.
- Route paths are not versioned in the reviewed docs; the live examples use `/checkiday/{route}` directly under `https://api.apilayer.com`.
- Free-plan signup exists, but route/parameter availability changes by subscription tier.
- The docs say API keys are managed in the APILayer account page.

## Verification notes
This file was manually rebuilt from the current APILayer marketplace documentation and its embedded official code widgets for Checkiday.
