# Shodan

## Provider metadata
- Category: `Security`
- Provider slug: `shodan`
- Docs used manually:
  - `https://developer.shodan.io/`
  - `https://developer.shodan.io/api`
- Confirmed REST API base URL: `https://api.shodan.io`
- Primary media type: JSON
- Auth model from the official docs: API key passed as the `key` query parameter on documented requests
- Manually confirmed routes in this pass: `5`

## Authentication
The official Shodan reference pages show the API key directly in example request URLs as a query parameter named `key`.

Confirmed auth details from the docs:
- authenticated REST requests use `?key={YOUR_API_KEY}`
- the API exposes an `/api-info` endpoint to inspect plan information and remaining credits
- the public reference does not present bearer-token or OAuth auth for the sampled endpoints in this file

## Common request/response conventions
- Base URL: `https://api.shodan.io`
- Response format: JSON
- A non-`200` status code indicates an error according to the official Error Handling section
- Error bodies include a JSON object with an `error` field

## Manually confirmed endpoint set

### 1) Get host information
- Method: `GET`
- Path: `/shodan/host/{ip}`
- Full URL: `https://api.shodan.io/shodan/host/{ip}`
- Purpose: return all services found on a host IP
- Query parameters:
  - `key` - required API key
  - `history` - optional boolean, return historical banners when `true`
  - `minify` - optional boolean, return only general host information and ports when `true`
- Path parameters:
  - `ip` - required host IP address
- Response fields shown in the example include:
  - top-level `ip`, `country_code`, `country_name`, `hostnames`, `org`, `last_update`, `latitude`, `longitude`, `data`
  - per-service banner fields such as `_shodan`, `port`, `transport`, `timestamp`, `domains`, `location`, `isp`, `org`

### 2) Search Shodan
- Method: `GET`
- Path: `/shodan/host/search`
- Full URL: `https://api.shodan.io/shodan/host/search`
- Purpose: search banners using the same query syntax as the Shodan website
- Confirmed query parameters:
  - `key` - required API key
  - `query` - required search string, including `filter:value` syntax
  - `facets` - optional comma-separated facet list, optionally in `property:count` form
  - `page` - optional page number, `100` results at a time, default `1`
  - `minify` - optional boolean
  - `fields` - optional comma-separated list of result fields to return
- Credit-consumption notes explicitly documented:
  - one query credit is deducted when the search query contains a filter
  - one query credit is deducted for every `100` results past the first page
- Response fields shown in the example include:
  - `matches`
  - `facets`
  - match-level banner data such as `product`, `hash`, `ip`, `org`, `isp`, `transport`, `cpe`, `data`

### 3) Count search results without returning matches
- Method: `GET`
- Path: `/shodan/host/count`
- Full URL: `https://api.shodan.io/shodan/host/count`
- Purpose: return only total counts and facets for a query
- Confirmed query parameters:
  - `key` - required API key
  - `query` - required search string
  - `facets` - optional comma-separated facet list
- Important usage note from the docs:
  - this endpoint behaves like `/shodan/host/search` but does not consume query credits because it omits host results
- Response fields shown in the example include:
  - `matches` as an empty array
  - `facets`
  - `total`

### 4) List crawled ports
- Method: `GET`
- Path: `/shodan/ports`
- Full URL: `https://api.shodan.io/shodan/ports`
- Purpose: list port numbers Shodan is crawling on the Internet
- Query parameters:
  - `key` - required API key
- Response shape:
  - JSON array of port numbers

### 5) Get API plan information
- Method: `GET`
- Path: `/api-info`
- Full URL: `https://api.shodan.io/api-info`
- Purpose: inspect API plan capabilities and remaining credits for the supplied key
- Query parameters:
  - `key` - required API key
- Response fields shown in the docs include:
  - `scan_credits`
  - `usage_limits.scan_credits`
  - `usage_limits.query_credits`
  - `usage_limits.monitored_ips`
  - `plan`
  - `https`
  - `unlocked`
  - `query_credits`
  - `monitored_ips`
  - `unlocked_left`
  - `telnet`

## Pagination
The official Shodan search docs use page-based pagination for search results:
- `/shodan/host/search` uses `page`
- results are returned `100` at a time
- the docs used in this pass do not describe cursor-based pagination for the sampled endpoints

## Rate limits and usage controls
Shodan's public reference pages emphasize credit-based limits rather than a single global request-per-minute quota.

Confirmed usage-limit notes from the docs:
- `/api-info` returns remaining `query_credits` and `scan_credits`
- `/shodan/host/search` may consume query credits when filters are used
- `/shodan/host/search` also consumes credits when paging beyond the first page
- `/shodan/host/count` is explicitly documented as not consuming query credits
- No fixed numeric per-minute or per-day HTTP request limit was published on the reference pages used in this pass

## Error format
From Shodan's official Error Handling section:
- any non-`200` HTTP status indicates an error
- the body includes a reason message
- sample error format:
  - `{ "error": "Invalid IP" }`

## Important usage notes
- Search queries use the same syntax as the Shodan website, including `filter:value` expressions
- `facets` can request summary counts such as `country:100`
- the host endpoint can be significantly reduced with `minify=true`
- the count endpoint is preferable when only totals or facet summaries are required

## Verification notes
This file was manually rebuilt from Shodan's official developer site and route reference pages, replacing the earlier low-fidelity autogenerated summary.
