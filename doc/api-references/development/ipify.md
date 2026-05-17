# IPify

## Provider metadata
- Category: `Development`
- Provider slug: `ipify`
- Docs used manually:
  - `https://www.ipify.org/`
- Confirmed base URLs:
  - `https://api.ipify.org`
  - `https://api6.ipify.org`
  - `https://api64.ipify.org`
- Primary response/content types confirmed from the docs: plain text, JSON, and JSONP
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `3`

## Authentication
- The official ipify site documents the API as unauthenticated.
- No API key, OAuth flow, or custom auth header is shown on the reviewed official page.

## Common request/response conventions
- All confirmed endpoints are `GET`-style retrieval endpoints shown as bare URLs on the official page
- Response format is controlled by the `format` query parameter
- Confirmed response format options:
  - no `format` parameter -> plain text IP address
  - `format=json` -> JSON like `{ "ip": "98.207.254.136" }`
  - `format=jsonp` -> JSONP using default callback name `callback`
  - `format=jsonp&callback=getip` -> JSONP using a custom callback name
- The official site states:
  - no visitor information is logged
  - usage is allowed without limit, including very high request rates

## Manually confirmed endpoint set

### 1) Retrieve the caller's public IPv4 address
- Method: `GET`
- Base URL / host: `https://api.ipify.org`
- Purpose: return the caller's public IPv4 address
- Confirmed query parameters:
  - `format=json`
  - `format=jsonp`
  - `callback` - used with `format=jsonp` to override the default callback name
- Confirmed response behaviors:
  - plain text IPv4 when no `format` is provided
  - JSON when `format=json`
  - JSONP when `format=jsonp`

### 2) Retrieve the caller's public IPv6 address
- Method: `GET`
- Base URL / host: `https://api6.ipify.org`
- Purpose: return the caller's public IPv6 address
- Confirmed query parameters:
  - `format=json`
  - `format=jsonp`
  - `callback`
- Important notes:
  - the official docs explicitly say this endpoint is for IPv6 requests only
  - if the caller does not have an IPv6 address, the request will fail

### 3) Retrieve the caller's public address using a universal IPv4/IPv6 endpoint
- Method: `GET`
- Base URL / host: `https://api64.ipify.org`
- Purpose: return either the caller's public IPv4 or IPv6 address depending on network environment
- Confirmed query parameters:
  - `format=json`
  - `format=jsonp`
  - `callback`
- Confirmed response behavior:
  - plain text by default
  - JSON or JSONP when requested via `format`

## Pagination
- None. The official ipify docs only document single-value IP lookup responses.

## Error handling
- The reviewed ipify page does not publish a structured HTTP error table.
- The one explicit failure case documented on the page is that `https://api6.ipify.org` fails when the caller does not have an IPv6 address.

## Rate limits
- The official ipify page states the API can be used `without limit` and explicitly claims support for `millions of requests per minute`.
- No finer-grained throttling table or quota header documentation was provided on the reviewed page.

## Response format notes
- Plain text responses are raw IP strings
- JSON responses use an `ip` field
- JSONP responses wrap the JSON payload in either the default `callback(...)` wrapper or the custom callback name supplied in the `callback` query parameter

## Important usage notes
- choose `api.ipify.org` when you specifically want IPv4
- choose `api6.ipify.org` only when the caller definitely has IPv6 connectivity
- choose `api64.ipify.org` when you want a universal endpoint that works across IPv4 and IPv6 environments

## Verification notes
This file was manually rebuilt from the official ipify website with browser inspection, replacing the earlier generated placeholder.
