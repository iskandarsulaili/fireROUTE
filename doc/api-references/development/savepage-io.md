# SavePage.io

## Provider metadata
- Category: `Development`
- Provider slug: `savepage-io`
- Docs used manually:
  - `https://savepage.io/`
  - `https://savepage.io/docs`
- Confirmed REST API base URL: `https://api.savepage.io/v1/`
- Primary media type: JSON responses containing screenshot metadata and a CDN image URL
- Authentication model surfaced in docs: Bearer token in the `Authorization` header
- Manually confirmed routes in this pass: `1`

## Authentication
From the official documentation page:
- authenticate with `Authorization: Bearer YOUR_API_KEY`
- the docs advertise free signup with no credit card required
- the documentation says the free plan includes `100 screenshots per month`
- no alternate query-param auth model was documented on the reviewed page

## Common request/response conventions
- Base URL: `https://api.savepage.io/v1/`
- reviewed API surface uses `GET`
- one screenshot-capture endpoint is parameter-driven via query string
- successful responses are JSON objects containing the original URL, a CDN-hosted image URL, capture dimensions, format, file size, and timestamp
- the homepage positions the service as "one GET request" screenshot capture with desktop/mobile/full-page options

## Manually confirmed endpoint set

### 1) Capture a screenshot
- Method: `GET`
- Path: `/v1/`
- Full URL: `https://api.savepage.io/v1/`
- Purpose: capture a screenshot of a target webpage and return screenshot metadata plus a CDN image URL
- Query parameters confirmed on the official docs page:
  - `url` - required target URL; must be a valid HTTP or HTTPS URL
  - `width` - optional viewport width in pixels; default `1440`, range `320-3840`
  - `height` - optional viewport height in pixels; default `900`, range `240-2160`
  - `fullpage` - optional boolean; default `false`; capture the full scrollable page instead of only the viewport
  - `format` - optional output format; default `png`; accepted values `png` and `jpeg`
  - `quality` - optional JPEG quality; default `80`; range `1-100`; ignored for PNG
  - `delay` - optional wait time before capture; default `0`; max `5000` on Free and `30000` on Pro per the docs table
  - `selector` - optional CSS selector to capture a specific element instead of the full page
  - `scale` - optional device scale factor; default `1`; range `0.5-3`
- Response fields confirmed on the official docs page:
  - `status` - success indicator string
  - `url` - echoed target URL
  - `image` - CDN URL for the captured screenshot
  - `width`
  - `height`
  - `format`
  - `size`
  - `fullpage`
  - `captured_at`

## Pagination
- none documented
- each call captures one screenshot and returns one JSON metadata object

## Rate limits
From the official `Rate Limits` section:
- every response includes:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- documented plan limits:
  - Free: `100` monthly, `5` requests/minute, max delay `5,000ms`
  - Pro: `10,000` monthly, `60` requests/minute, max delay `30,000ms`
  - Enterprise: custom monthly and per-minute limits, max delay `60,000ms`

## Error and response notes
From the official documentation page:
- documented error statuses:
  - `400 Bad Request` - missing or invalid parameters
  - `401 Unauthorized` - missing or invalid API key
  - `403 Forbidden` - API key lacks access to the requested feature
  - `429 Too Many Requests` - rate limit exceeded; check `Retry-After`
  - `500 Server Error` - internal error; retry after a few seconds
  - `504 Timeout` - target page took too long to load
- documented error body shape:
  - `status`
  - `code`
  - `message`
- successful responses return JSON metadata rather than raw image bytes; clients fetch the returned CDN URL if they want the image file itself

## Important usage notes
- the service is intentionally route-light: a single GET endpoint with behavior controlled entirely by query params
- `selector` capture is the official way to target one element instead of the full page
- `delay` and allowed request rates are plan-dependent
- returned screenshots live on SavePage's CDN rather than being streamed inline in the reviewed examples

## Verification notes
This file was manually rebuilt from SavePage.io's official homepage and official documentation page using browser inspection.