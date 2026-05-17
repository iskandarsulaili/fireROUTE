# WebScraping.AI

## Provider metadata
- Category: `Development`
- Provider slug: `webscraping-ai`
- Docs used manually:
  - `https://webscraping.ai/docs`
  - `https://webscraping.ai/docs/openapi`
  - `https://webscraping.ai/openapi-with-examples.yml`
- Confirmed REST API base URL: `https://api.webscraping.ai`
- Additional official access mode surfaced in docs: HTTP/HTTPS proxy mode via `proxy.webscraping.ai:8888`
- Primary media types: plain text / HTML for page-fetch and answer routes; JSON for structured extraction, account data, many errors, and optional text output; XML optionally supported on `/text`
- Authentication model surfaced in docs: required API key via `api_key` query parameter on REST routes; proxy mode uses the API key as the proxy username
- Manually confirmed routes in this pass: `8`

## Authentication
From the official docs reviewed in this pass:
- every documented REST endpoint requires `api_key` as a query parameter
- the public docs do not present Bearer-token auth for the REST API
- proxy mode uses:
  - host `proxy.webscraping.ai`
  - port `8888`
  - username = your API key
  - password = a parameter string such as `js=true&proxy=residential`
- the proxy mode docs explicitly warn that the proxy uses a self-signed SSL certificate, so clients may need insecure-cert allowances

## Common request/response conventions
- Base URL: `https://api.webscraping.ai`
- Confirmed route families use `GET`, plus one separately documented `POST /html` workflow for forwarding POST bodies to the target URL
- Shared query parameters repeatedly documented across the official docs and OpenAPI spec:
  - `url` - target page URL
  - `api_key` - required API key
  - `headers` - JSON object of headers to send to the target page; docs explicitly show cookie injection through this field
  - `timeout` - total load timeout; openapi/docs say default `10000` ms and max `30000` ms
  - `js` - enable JavaScript rendering; docs say default is `true`
  - `js_timeout` - JavaScript wait time; docs/openapi say default `2000` ms and max `20000` ms
  - `wait_for` - CSS selector to wait for before returning content; docs say this overrides `js_timeout`
  - `proxy` - proxy mode selector; reviewed docs explicitly describe `datacenter` as default and `residential` as the documented alternative
  - `country` - geo-target the proxy
  - `custom_proxy` - provider-specific upstream proxy override
  - `device` - emulate a target device profile
  - `error_on_404` - treat target-side 404s as API errors
  - `error_on_redirect` - treat redirects as errors
  - `js_script` - run custom JavaScript in the target page context
- Additional endpoint-specific parameters confirmed in the docs:
  - `question` on `/ai/question`
  - `fields[...]` deep-object parameters on `/ai/fields`
  - `return_script_result` and `format` on `/html`
  - `text_format` and `return_links` on `/text`
  - `selector` on `/selected`
  - `selectors[]` on `/selected-multiple`
- Documented response headers include:
  - `X-Credits-Used`
  - `X-Credits-Remaining`
  - `X-Target-Status`

## Manually confirmed endpoint set

### 1) Ask a question about a page
- Method: `GET`
- Path: `/ai/question`
- Full URL: `https://api.webscraping.ai/ai/question`
- Purpose: fetch a target page through WebScraping.AI, process it with the provider's AI layer, and return an answer string
- Required query parameters confirmed in docs:
  - `url`
  - `question`
  - `api_key`
- Additional parameters confirmed in docs/openapi:
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
  - `format`
- Response notes:
  - the docs show a plain-text answer body rather than a JSON envelope
  - the route is priced as an AI endpoint in the pricing section

### 2) Extract structured fields from a page
- Method: `GET`
- Path: `/ai/fields`
- Full URL: `https://api.webscraping.ai/ai/fields`
- Purpose: extract named data points from a target page as structured JSON using the AI layer
- Required query parameters confirmed in docs:
  - `url`
  - `api_key`
  - `fields[...]` - deep-object style field descriptions such as `fields[title]`, `fields[price]`, `fields[rating]`
- Additional parameters confirmed in docs/openapi:
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
- Response notes:
  - success returns JSON with keys matching the requested field names
  - the docs explicitly position this route for product, article, and profile extraction use cases

### 3) Get page HTML
- Method: `GET`
- Path: `/html`
- Full URL: `https://api.webscraping.ai/html`
- Purpose: return the full fetched HTML of the target page
- Required query parameters confirmed in docs:
  - `url`
  - `api_key`
- Additional query parameters confirmed in docs/openapi:
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
  - `return_script_result`
  - `format`
- Response notes:
  - success returns HTML/text content
  - the docs explicitly show cookie forwarding through the `headers` JSON parameter

### 4) Submit a POST request to the target through the HTML route
- Method: `POST`
- Path: `/html`
- Full URL: `https://api.webscraping.ai/html`
- Purpose: send a POST body to the target URL while still using WebScraping.AI's rendering/proxy layer
- Content type shown in official example: `application/x-www-form-urlencoded`
- Confirmed form fields in the reviewed docs example:
  - `api_key`
  - `url`
  - `body` - request body to send to the target page
- Usage notes from docs:
  - intended for login flows, form submissions, and target APIs/pages that require a POST request
  - the public docs reviewed in this pass only gave a compact POST example, so the richer GET-style option matrix above is the best-documented parameter set

### 5) Get page text
- Method: `GET`
- Path: `/text`
- Full URL: `https://api.webscraping.ai/text`
- Purpose: return visible page text for LLM or text-processing workflows
- Required query parameters confirmed in docs:
  - `url`
  - `api_key`
- Additional query parameters confirmed in docs/openapi:
  - `text_format` - reviewed docs say `plain` default, with `json` and `xml` supported
  - `return_links` - include links in JSON output
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
- Response notes:
  - supports plain text, JSON, or XML output according to the reviewed docs/openapi examples

### 6) Get selected HTML from one page area
- Method: `GET`
- Path: `/selected`
- Full URL: `https://api.webscraping.ai/selected`
- Purpose: return HTML from a single selected part of the page
- Required / primary query parameters confirmed in docs:
  - `url`
  - `api_key`
  - `selector` - CSS selector such as `h1`, `.price`, or `#main`
- Additional parameters confirmed in docs/openapi:
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
  - `format`
- Response notes:
  - the docs page presents `selector` as the standard extraction input
  - the OpenAPI description additionally notes that omitting `selector` can return whole-page HTML

### 7) Get selected HTML from multiple page areas
- Method: `GET`
- Path: `/selected-multiple`
- Full URL: `https://api.webscraping.ai/selected-multiple`
- Purpose: extract multiple selected areas in one call instead of making repeated `/selected` requests
- Required / primary query parameters confirmed in docs/openapi:
  - `url`
  - `api_key`
  - `selectors[]` - array of CSS selectors
- Additional parameters confirmed in openapi:
  - `headers`
  - `timeout`
  - `js`
  - `js_timeout`
  - `wait_for`
  - `proxy`
  - `country`
  - `custom_proxy`
  - `device`
  - `error_on_404`
  - `error_on_redirect`
  - `js_script`
- Response notes:
  - success returns JSON containing multiple extracted HTML fragments
  - the main docs page mentions this route as the multi-selector companion to `/selected`

### 8) Get account information
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.webscraping.ai/account`
- Purpose: inspect account status and remaining credits
- Required query parameter confirmed in docs:
  - `api_key`
- Response fields shown in docs/openapi examples include:
  - `remaining_api_calls` / remaining credits
  - `resets_at`
  - `remaining_concurrency`

## Pagination
- The reviewed public WebScraping.AI docs do not document provider-side pagination helpers for the REST API itself.
- When callers need pagination, it is treated as a target-site concern: follow target URLs, page parameters, selectors, or interaction logic rather than a WebScraping.AI pagination protocol.

## Rate limits, credits, and quotas
From the official docs reviewed in this pass:
- failed requests are free
- basic requests cost `1` credit
- JS rendering costs `2` credits in the reviewed pricing summary
- residential proxy without JS costs `5` credits
- residential proxy plus JS costs `10` credits
- stealth proxy pricing is listed as `50` credits
- AI endpoints (`/ai/question`, `/ai/fields`) cost `5` credits per request, plus applicable proxy costs
- the docs do not publish a simple requests-per-minute ceiling, but `429 Too Many Requests` is explicitly documented in the API reference
- the public signup copy on the docs page advertises `2,000` starter credits

## Error handling
The reviewed docs/openapi explicitly document these API-level response families:
- `400 Bad Request`
- `402 Payment Required`
- `403 Forbidden`
- `429 Too Many Requests`
- `500 Internal Server Error`
- `504 Gateway Timeout`

Additional error/operational notes confirmed in docs:
- the docs recommend retrying temporary failures
- the docs specifically recommend increasing `timeout` or `js_timeout` for slow targets
- the docs recommend switching to `proxy=residential` when datacenter proxies are blocked
- `X-Target-Status` response headers can expose the target site's status code separately from the WebScraping.AI API response

## Response format notes
- `/ai/question` returns plain text in the reviewed examples
- `/ai/fields` returns JSON
- `/html` returns HTML/text
- `/text` can return plain text, JSON, or XML
- `/selected` returns HTML/text
- `/selected-multiple` returns JSON
- `/account` returns JSON

## Important usage notes
- this provider is route-light; most capability is exposed through query parameters rather than many path families
- JavaScript rendering is enabled by default in the reviewed docs, so callers should deliberately disable it only for static pages when speed/cost matters more than browser execution
- `wait_for` is the main documented way to coordinate with slow dynamic pages, and the docs explicitly say it overrides `js_timeout`
- the official docs include a proxy mode in addition to the REST API; that can be useful when fireROUTE wants to keep an existing scraper stack and only swap transport
- the docs repeatedly recommend starting with datacenter proxies and moving to residential only when the target blocks or geo-restrictions require it

## Verification notes
This file was manually rebuilt from the official WebScraping.AI docs, the official OpenAPI reference page, and the official downloadable OpenAPI YAML using browser inspection during this pass.
