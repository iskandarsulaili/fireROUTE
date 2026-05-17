# scrapestack

## Provider metadata
- Category: `Development`
- Provider slug: `scrapestack`
- Docs used manually:
  - `https://scrapestack.com/`
  - `https://docs.apilayer.com/docs/product-guides/scrapestack/quickstart-guide`
  - `https://docs.apilayer.com/docs/product-guides/scrapestack/api-endpoints`
- Confirmed base URL: `https://api.scrapestack.com`
- Primary format: raw target payloads (`text/html` or other target content types) plus JSON error objects
- Manually confirmed routes in this pass: `3`

## Authentication
From the official quickstart guide and endpoint docs:
- Auth type: API key via query string.
- Required query parameter on all scraping calls: `access_key`.
- The docs describe `access_key` as the unique API key tied to your subscription plan.

## Common request/response conventions
- All reviewed routes use the same scrape endpoint path: `/scrape`.
- The HTTP method you use on `/scrape` determines the method forwarded to the target (`GET`, `POST`, or `PUT` in the reviewed docs).
- Required query parameters across the reviewed operations:
  - `access_key`
  - `url`
- Shared optional query parameters across the reviewed operations:
  - `render_js` - `0`/`1`; enable headless-Chrome JavaScript rendering
  - `proxy_location` - 2-letter country code
  - `premium_proxy` - `0`/`1`; premium residential proxy mode
  - `keep_headers` - `0`/`1`; forward custom headers and return forwarded target headers
- The docs explicitly say `content-encoding` and `content-length` are unsupported header names when `keep_headers=1` is used.

## Manually confirmed endpoint set

### 1) Basic scrape
- Method: `GET`
- Path: `/scrape`
- Full URL: `https://api.scrapestack.com/scrape`
- Required query parameters:
  - `access_key` - API key
  - `url` - target URL to fetch
- Optional query parameters:
  - `render_js`
  - `proxy_location`
  - `premium_proxy`
  - `keep_headers`
- Response/status notes confirmed from the official endpoint page:
  - documented statuses: `200`, `400`, `401`, `403`, `404`, `429`, `500`
  - successful response usually returns the raw target response body, commonly `text/html`
  - when `keep_headers=1`, forwarded target headers are also returned with the API response

### 2) Basic scrape — forward POST body to target
- Method: `POST`
- Path: `/scrape`
- Full URL: `https://api.scrapestack.com/scrape`
- Required query parameters:
  - `access_key`
  - `url`
- Optional query parameters:
  - `render_js`
  - `proxy_location`
  - `premium_proxy`
  - `keep_headers`
- Supported request-body media types explicitly listed on the docs page:
  - `application/json`
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`
- Purpose: proxy a POST request body through scrapestack to the target URL.
- Response/status notes:
  - documented statuses: `200`, `400`, `401`, `403`, `404`, `429`, `500`
  - endpoint returns the raw target response or a JSON error object when scraping fails

### 3) Basic scrape — forward PUT body to target
- Method: `PUT`
- Path: `/scrape`
- Full URL: `https://api.scrapestack.com/scrape`
- Required query parameters:
  - `access_key`
  - `url`
- Optional query parameters:
  - `render_js`
  - `proxy_location`
  - `premium_proxy`
  - `keep_headers`
- Request-body notes from the official page:
  - documented as forwarding the caller's PUT body and headers to the target
  - reviewed docs page explicitly showed JSON-body examples
- Response/status notes:
  - documented statuses: `200`, `400`, `401`, `403`, `404`, `429`, `500`
  - successful response returns the target response body; failures can return JSON error data

## Error model
The official `ApiError` schema documents a standard JSON error envelope:
- `success` - boolean, `false` on errors
- `error.code` - numeric error code
- `error.type` - machine-readable error type
- `error.info` - optional human-readable detail

Reviewed example:
```json
{
  "success": false,
  "error": {
    "code": 105,
    "type": "scrape_request_failed",
    "info": "Target responded with 403 Forbidden"
  }
}
```

## Rate limits / usage notes
- The reviewed docs did **not** publish a numeric requests-per-second or requests-per-minute rate-limit table.
- The docs do publish plan-sensitive usage behavior:
  - `premium_proxy=1` is plan-restricted
  - each premium-proxy request counts as `25` API requests for billing/usage
- The quickstart guide also states that feature availability depends on the subscription plan.

## Important usage notes
- `url` must be URL-encoded when it contains special characters.
- `render_js=1` is available only on Basic plan and higher according to the reviewed endpoint docs.
- `proxy_location` support differs between standard datacenter proxies and premium residential proxies.
- The service is effectively one heavily parameterized scrape endpoint rather than a large resource-oriented REST surface.

## Verification notes
This file was manually rebuilt from scrapestack's official homepage plus the official APILayer docs pages for quickstart and API endpoints, replacing the earlier autogenerated summary.