# LinkPreview

## Provider metadata
- Category: `Open Data`
- Provider slug: `linkpreview`
- Description: `Get JSON formatted summary with title, description and preview image for any requested URL`
- Official docs/pages used:
  - `https://www.linkpreview.net/` (official homepage, pricing, FAQ, and quick-start example)
  - `https://docs.linkpreview.net/` (official documentation navigation and endpoint/parameter reference reached via browser)
- Current public API base URL: `https://api.linkpreview.net`
- Auth model:
  - Preferred: `X-Linkpreview-Api-Key: <YOUR_API_KEY>` header
  - Deprecated fallback documented by the provider: `key=<YOUR_API_KEY>` query parameter
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON success payloads with `title`, `description`, `image`, and `url`; JSON error payloads also include an `error` field
- Rate limits officially documented on the reviewed pages:
  - Free plan: `60` requests per hour
  - Basic plan: `200` requests per hour
  - Pro plan: `1000` requests per hour
  - Enterprise plan: `100` requests per minute
  - Additional per-domain protection note: max `1` request per second per unique domain may apply
- Manually confirmed route count: `2`

## API shape and behavior
- The official docs describe one API host, `https://api.linkpreview.net`, with the same request shape available over either `GET` or `POST`.
- Both methods take a target URL plus optional feature parameters and return a link-preview payload rather than resource-specific objects.
- The provider positions screenshots, locale data, image dimensions, and other enriched fields as optional additions on the same endpoint rather than as separate path families.

## Canonical endpoints
1. `GET /`
   - Fetch a preview for a target URL using query-string parameters.
   - Official quick-start example: `https://api.linkpreview.net/?q=https://google.com`
2. `POST /`
   - Fetch the same preview data by sending the same parameters in the request body.
   - Official quick-start example uses `application/x-www-form-urlencoded` style form data with `curl --data "q=https://google.com&fields=image_x,image_y,locale" https://api.linkpreview.net`

## Core parameters and request conventions
### Shared parameters
- `q` - required target URL to inspect.
- `fields` - optional comma-separated list of extra fields to return.
- `block_content` - optional boolean-like flag; when `true`, the service makes additional checks to detect and block potential malware/adult content.
- `key` - deprecated API key query parameter retained by the docs for backward compatibility; the provider says to use `X-Linkpreview-Api-Key` instead.

### Additional-field examples explicitly shown in the official docs
- `image_x`
- `image_y`
- `icon_type`
- `locale`

### Encoding and transport notes
- The official docs say `q` should be percent-encoded because it can contain reserved URL characters.
- `GET` sends parameters in the query string.
- `POST` sends the same parameters in the body.

## Response notes
- The official default success example returns:
  - `title`
  - `description`
  - `image`
  - `url`
- The docs position extra response fields as plan-dependent and requested through the `fields` parameter.
- A live unauthenticated request returned JSON with the same preview keys plus `error: 403`, showing that even failures reuse the provider's compact preview envelope:
  - `{"title":"","description":"Invalid or blank API access key","image":"","url":"","error":403}`
- No pagination model is documented on the reviewed official pages.

## Error notes
- The homepage FAQ explicitly mentions `423 "Forbidden by robots.txt"` for sites that disallow third-party crawling.
- The reviewed docs/homepage also refer to generic `4xx` API errors.
- A live request without a valid API key returned HTTP `403` with message `Invalid or blank API access key`.
- The reviewed official pages did not publish a larger machine-readable error-code table in the materials captured during this pass.

## Usage notes
- Prefer header-based auth with `X-Linkpreview-Api-Key`; the provider labels query-string `key` auth as deprecated.
- The same path supports both `GET` and `POST`, so fireROUTE should preserve method selection when proxying.
- Rate limits differ by plan, and the homepage warns that per-domain throttling can be stricter than account-level hourly quotas.
- The homepage pricing text says the Free and Basic plans are for personal use, while Pro and Enterprise are for commercial use.

## fireROUTE normalization notes
- Treat LinkPreview as one endpoint family exposed through two documented methods on the same root path.
- Preserve the target URL as the `q` parameter rather than converting it into a path segment.
- Preserve arbitrary `fields` passthrough because the provider exposes enrichment features by parameter rather than by route branching.
- Keep `block_content` and deprecated `key` available as passthrough options for compatibility.