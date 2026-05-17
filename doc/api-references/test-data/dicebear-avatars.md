# DiceBear Avatars

## Provider metadata
- Category: `Test Data`
- Provider slug: `dicebear-avatars`
- Docs used manually:
  - `https://www.dicebear.com/`
  - `https://www.dicebear.com/how-to-use/http-api/`
- Confirmed API base URL: `https://api.dicebear.com`
- Primary media types: SVG, PNG, JPG, WebP, AVIF, and JSON metadata
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
- the official HTTP API page explicitly says no authentication is required

## Common request/response conventions
- Base URL: `https://api.dicebear.com`
- reviewed path template: `/{version}/{styleName}/{format}`
- official usage template shown on the docs page:
  - `https://api.dicebear.com/9.x/<styleName>/svg`
- the docs say every official avatar style is supported via the `styleName` path segment in camelCase
- most customization is done with query parameters rather than additional paths

## Manually confirmed endpoint set

### 1) Generate an avatar via the HTTP API
- Method: `GET`
- Path template: `/{version}/{styleName}/{format}`
- Canonical current example from the official page: `https://api.dicebear.com/9.x/{styleName}/svg`
- Purpose: generate deterministic avatars or return avatar metadata
- Path parameters confirmed on the official page:
  - `version` - version selector such as `9.x`
  - `styleName` - official avatar style name in camelCase
  - `format` - output format
- Query parameters explicitly called out on the official page:
  - `seed`
  - `flip`
  - `rotate`
  - `scale`
  - `radius`
  - `backgroundColor`
  - style-specific options as documented on each avatar style page
- Array-parameter note:
  - array values are comma-separated, e.g. `hair=short01,short02,short03`
- Boolean-parameter note:
  - boolean values use strings like `true` and `false`
- Output formats confirmed on the official page:
  - `svg`
  - `png`
  - `jpg`
  - `webp`
  - `avif`
  - `json`
- Response notes:
  - image formats return image content
  - `json` returns avatar metadata and no image output

## File-format and size notes
From the official HTTP API page:
- `svg` is the recommended format
- `svg` has no size limit and a higher rate limit
- `png`, `jpg`, `webp`, and `avif` are limited to `256 x 256` pixels and have a lower rate limit

## Versioning
- the official docs say you can replace `9.x` in the URL with a supported version
- reviewed version table from the official page:
  - `9.x` - Active
  - `8.x` - Deprecated, end of life `April 30, 2028`
  - `7.x` - Deprecated, end of life `April 30, 2028`
  - `6.x` - Deprecated, end of life `April 30, 2028`
  - `5.x` - Deprecated, end of life `April 30, 2028`
- the docs explicitly warn that versions `5.x` through `8.x` will be shut down after that end-of-life date

## Pagination
- none documented

## Rate limits
From the official `Fair Use & Rate Limits` section:
- free non-commercial use is allowed under a fair-use model
- current per-second limits are:
  - `50` requests/second for SVG
  - `10` requests/second for PNG, JPG, WebP, and AVIF
- exceeding the limit returns HTTP `429 Too Many Requests`
- the docs reserve the right to change the limits without notice

## Error and response notes
- the only explicit error behavior surfaced on the reviewed page is HTTP `429 Too Many Requests` when the published rate limits are exceeded
- the docs also warn that the service may change over time and availability is not guaranteed
- for stable commercial or private use, the docs recommend self-hosting

## Important usage notes
- the same seed produces the same avatar consistently
- style-specific option names differ by avatar style
- `json` is a metadata output mode rather than an image format
- if you need stronger availability guarantees or higher limits, the official docs recommend using a self-hosted instance

## Verification notes
This file was manually rebuilt from DiceBear's official site and HTTP API documentation using browser inspection.