# ZenRows

## Provider metadata
- Category: `Development`
- Provider slug: `zenrows`
- Docs used manually:
  - `https://www.zenrows.com/`
  - `https://docs.zenrows.com/universal-scraper-api/api-reference`
  - `https://docs.zenrows.com/universal-scraper-api/first-request`
  - `https://docs.zenrows.com/universal-scraper-api/features/output`
  - `https://docs.zenrows.com/api-error-codes`
- Confirmed REST API base URL: `https://api.zenrows.com`
- Primary media types: HTML/text passthrough by default; JSON when using extraction/output features or when errors are returned
- Authentication model surfaced in docs: required API key via `apikey` query parameter
- Manually confirmed routes in this pass: `1`

## Authentication
From the official docs:
- every reviewed Universal Scraper API example sends the API key as the `apikey` query parameter
- the public docs reviewed here do not document Bearer-token auth for the REST scraping endpoint
- the API key is obtained from the ZenRows dashboard / playground

## Common request/response conventions
- Base URL: `https://api.zenrows.com`
- Confirmed REST path: `/v1/`
- Method used in the reviewed docs: `GET`
- Required query parameters visible in first-request examples:
  - `url` - target page to fetch through ZenRows
  - `apikey` - ZenRows API key
- Additional parameters confirmed across the reviewed docs:
  - `mode` - includes `auto` for Adaptive Stealth Mode
  - `js_render` - enable JavaScript rendering when the target site requires it
  - `premium_proxy` - enable residential / premium proxy routing
  - `proxy_country` - choose the proxy geography
  - `js_instructions` - browser interaction instructions for dynamic pages
  - `custom_headers` - custom request-header injection
  - `css_extractor` - CSS-selector-driven structured extraction payload
  - `outputs` - comma-separated output filters, including `*` for all available output types
- The docs explicitly show `outputs` filters returning structured JSON for types such as:
  - `emails`
  - `phone_numbers`
  - `headings`
  - `images`
  - `audios`
  - `videos`
  - `links`
  - `menus`
  - `hashtags`
  - `metadata`
  - `tables`
  - `favicon`
- The homepage and getting-started docs position `mode=auto` as the preferred default for unknown or mixed targets because ZenRows can escalate to JS rendering and premium proxies automatically

## Manually confirmed endpoint set

### 1) Universal Scraper API request
- Method: `GET`
- Path: `/v1/`
- Full URL: `https://api.zenrows.com/v1/`
- Purpose: fetch a target URL through ZenRows' scraping layer with optional anti-bot bypass, rendering, extraction, and output-format helpers
- Required query parameters confirmed in docs:
  - `url` - target URL to scrape
  - `apikey` - ZenRows API key
- Additional query parameters confirmed in reviewed docs/pages:
  - `mode` - docs show `auto`
  - `js_render`
  - `premium_proxy`
  - `proxy_country`
  - `js_instructions`
  - `custom_headers`
  - `css_extractor`
  - `outputs`
- Output behavior confirmed in docs:
  - default responses return the fetched page content for the target URL
  - `outputs=...` returns structured JSON containing only the requested extracted data families
  - `outputs=*` requests all supported output filters
  - invalid `css_extractor` payloads trigger dedicated validation errors

## Pagination
- the reviewed Universal Scraper API docs did not document a pagination mechanism for the ZenRows API itself
- pagination, scrolling, and next-page traversal are treated as target-site interaction concerns, typically handled via target URLs, rendered interactions, or extraction logic rather than a separate ZenRows pagination protocol

## Rate limits and quotas
- the reviewed public docs did not publish a numeric requests-per-minute or concurrency ceiling
- the docs do make pricing/usage distinctions by enabled features and note that Adaptive Stealth Mode bills for the configuration that succeeds rather than charging failed escalation attempts
- `429 Too Many Requests` is explicitly documented on the official API error-codes page

## Error and response notes
From the official API error-codes page, the reviewed docs explicitly list these status families:
- `400 Bad Request`
- `401 Unauthorized`
- `402 Payment Required`
- `403 Forbidden`
- `404 Not Found`
- `405 Method Not Allowed`
- `407 Proxy Authentication Required`
- `413 Content Too Large`
- `422 Unprocessable Entity`
- `424 Failed Dependency`
- `429 Too Many Requests`
- `500 Internal Server Error`
- `502 Bad Gateway`
- `504 Gateway Timeout`

Named error examples explicitly shown in the docs include:
- `REQS001` - target domain forbidden
- `REQS002` - request requirements unsatisfied; docs say the domain requires `js_render` and/or `premium_proxy`
- `REQS004` - invalid params provided
- `RESP004` - invalid `css_extractor`
- the error guide repeatedly instructs callers to inspect the message body for parameter and feature requirements

## Important usage notes
- the reviewed public ZenRows REST surface is route-light: one documented Universal Scraper API endpoint, with most capability exposed through query parameters rather than separate paths
- ZenRows also documents Scraping Browser and Residential Proxies products, but the reviewed material for this pass confirmed only the Universal Scraper REST route above
- `mode=auto` is the main docs recommendation when the caller wants ZenRows to choose the cheapest viable anti-bot configuration automatically
- output filters are useful when fireROUTE wants structured JSON instead of raw HTML passthrough
- some domains are explicitly forbidden by provider policy, and the official error guide calls that out as a provider-enforced restriction rather than a transient scrape failure

## Verification notes
This file was manually rebuilt from the official ZenRows homepage and official ZenRows documentation using browser inspection.