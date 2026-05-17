# Screenshot

## Provider metadata
- Category: `Development`
- Provider slug: `screenshot`
- Docs used manually:
  - `https://www.abstractapi.com/api/website-screenshot-api`
  - `https://docs.abstractapi.com/api/screenshot`
- Confirmed REST API base URL: `https://screenshot.abstractapi.com/v1/`
- Primary media types: binary image response (`image/jpeg` by default, `image/png` when requested)
- Authentication model surfaced in docs: required API key via `api_key` query parameter
- Manually confirmed routes in this pass: `1`

## Authentication
From the official docs reviewed here:
- every request must include the provider-specific Screenshot API key as the `api_key` query parameter
- Abstract states each API product has its own separate key, so keys from other Abstract APIs are not interchangeable
- the docs position the key in the request URL rather than in an Authorization header

## Common request/response conventions
- Base URL: `https://screenshot.abstractapi.com/v1/`
- Confirmed REST path: `/v1/`
- Method used in the reviewed docs: `GET`
- Required query parameters:
  - `api_key` - Screenshot API key
  - `url` - full target URL to capture, including `http://` or `https://`
- Optional query parameters confirmed in the official docs:
  - `capture_full_page` - boolean; capture the full page height and width; defaults to `true`
  - `width` - viewport width in pixels
  - `height` - viewport height in pixels
  - `delay` - seconds to wait before capturing
  - `css_injection` - CSS string injected before capture
  - `user_agent` - custom user agent for the capture request
  - `export_format` - image format, `jpeg` or `png`; defaults to `jpeg`
- Transport/security notes from docs:
  - the API requires TLS 1.2 or greater
  - the product is currently documented as version `v1`

## Manually confirmed endpoint set

### 1) Render website screenshot
- Method: `GET`
- Path: `/v1/`
- Full URL: `https://screenshot.abstractapi.com/v1/`
- Purpose: capture a screenshot of the supplied website URL with optional rendering and output customization
- Required query parameters:
  - `api_key`
  - `url`
- Optional query parameters confirmed in docs:
  - `capture_full_page`
  - `width`
  - `height`
  - `delay`
  - `css_injection`
  - `user_agent`
  - `export_format`
- Response behavior confirmed in docs:
  - successful calls return the screenshot image itself
  - default output format is `jpeg`
  - callers can request `png` with `export_format=png`

## Pagination
- the reviewed official docs do not describe pagination
- this is a single-image render endpoint rather than a list/search API

## Rate limits and quotas
- the reviewed public docs do not publish a numeric requests-per-minute or concurrency ceiling
- pricing and plan limits exist on the product site, but the official API reference page reviewed here does not expose a route-level rate-limit table

## Error and response notes
- the reviewed docs clearly describe success behavior but do not publish a detailed status-code table on the Screenshot API reference page
- callers should expect binary image responses for successful captures rather than JSON payloads
- because the returned body is an image, downstream fireROUTE integrations should not assume JSON decoding on success

## Important usage notes
- the endpoint is route-light: nearly all functionality is controlled through query parameters on a single `GET /v1/` request
- the `url` parameter must include the full protocol according to the official docs
- `capture_full_page=true` is documented as the default behavior
- Abstract explicitly separates API keys by product, so a key from another Abstract API should not be reused here

## Verification notes
This file was manually rebuilt from the official Abstract marketing page and the official Abstract Screenshot API documentation using browser inspection.