# Advice Slip

## Provider metadata
- Category: `Personality`
- Provider slug: `advice-slip`
- Docs used manually:
  - `https://api.adviceslip.com/`
- Confirmed API base URL: `https://api.adviceslip.com`
- Primary media types: JSON for the core API, RSS for the daily feed
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `4`

## Authentication
From the official Advice Slip API page:
- no API key, OAuth flow, or account setup is documented
- the API is presented as a free public service

## Common request/response conventions
- Base URL: `https://api.adviceslip.com`
- reviewed JSON API operations use `GET`
- responses are returned as JSON objects wrapping either a `slip`, a `search` result set, or a `message`
- JSONP is supported through an optional `callback` query parameter on the three documented JSON endpoints
- one official RSS feed is also exposed for daily advice delivery

## Manually confirmed endpoint set

### 1) Random advice
- Method: `GET`
- Path: `/advice`
- Full URL: `https://api.adviceslip.com/advice`
- Purpose: return one random advice slip
- Query parameters confirmed in the docs:
  - `callback` - optional JSONP callback function name
- Response notes from the official page:
  - returns a `slip object`
  - the `slip object` contains:
    - `slip_id` - unique integer advice ID
    - `advice` - advice text string
- Important usage note:
  - the page explicitly says advice is cached for `2 seconds`, so repeat requests within that window return the same slip

### 2) Advice by ID
- Method: `GET`
- Path: `/advice/{slip_id}`
- Full URL: `https://api.adviceslip.com/advice/{slip_id}`
- Purpose: return a specific advice slip by numeric identifier
- Path parameters:
  - `slip_id` - advice slip identifier
- Query parameters confirmed in the docs:
  - `callback` - optional JSONP callback function name
- Response notes from the official page:
  - if the advice slip exists, the API returns a `slip object`
  - the documented slip fields are `slip_id` and `advice`

### 3) Search advice
- Method: `GET`
- Path: `/advice/search/{query}`
- Full URL: `https://api.adviceslip.com/advice/search/{query}`
- Purpose: search for advice slips whose advice text contains the supplied term
- Path parameters:
  - `query` - search text
- Query parameters confirmed in the docs:
  - `callback` - optional JSONP callback function name
- Response notes from the official page:
  - returns a `search object`
  - documented search-object fields:
    - `total_results` - total matching slips found
    - `query` - echoed search query
    - `slips` - array of `slip object` entries

### 4) Daily RSS feed
- Method: `GET`
- Path: `/daily_adviceslip.rss`
- Full URL: `https://api.adviceslip.com/daily_adviceslip.rss`
- Purpose: provide a daily Advice Slip RSS feed
- Response format:
  - RSS feed rather than JSON
- Important usage note:
  - this route is documented in a separate RSS section on the official page

## Objects and response format notes
From the official object definitions:
- `slip object`
  - `slip_id` - integer
  - `advice` - string
- `search object`
  - `total_results` - integer
  - `query` - the supplied search term
  - `slips` - array of slip objects
- `message object`
  - `type` - can be `notice`, `warning`, or `error`
  - `text` - human-readable message text
- in the event of an error, the docs say a `message object` is returned

## Pagination
- none documented
- search responses expose `total_results`, but the reviewed official page does not document page-number, cursor, or offset parameters

## Rate limits
- no numeric rate limits or quota windows are published on the reviewed official page
- the only explicit caching behavior documented is the `2`-second cache on the random-advice endpoint

## Error handling
- the official page does not publish an HTTP status-code matrix
- it does document a structured `message object` for error/notice/warning responses
- the `type` field can be `notice`, `warning`, or `error`

## Important usage notes
- the three JSON endpoints all support JSONP through the `callback` parameter
- the random endpoint is intentionally cached briefly, so clients should not expect a different result on immediate retries
- the service also exposes RSS separately from the JSON API, which may be useful for low-code or feed-reader integrations

## Verification notes
This file was manually rebuilt from the official Advice Slip API page using browser inspection.