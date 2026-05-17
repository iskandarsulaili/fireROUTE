# apilayer pdflayer

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `apilayer-pdflayer`
- Docs used manually:
  - `https://pdflayer.com/`
  - `https://pdflayer.com/documentation`
  - the official API Endpoints page inside the documentation UI
- Confirmed API base URL: `https://api.pdflayer.com/api`
- Authentication model: API key via the `access_key` query parameter
- Primary success response type: binary PDF (`application/pdf`)
- Manually confirmed routes in this pass: `2`

## Authentication
- The official API Endpoints page defines a single `API Key` security scheme.
- The docs explicitly instruct callers to attach the access key as:
  - `?access_key=YOUR_KEY`
- The same docs also document an optional `secret_key` parameter used to protect publicly exposed URLs.

## Common request/response conventions
- Base URL: `https://api.pdflayer.com/api`
- The official docs expose a single conversion path with both `GET` and `POST` methods.
- Successful conversions return binary PDF content.
- The route pages explicitly list these response codes:
  - `200`
  - `400`
  - `401`
  - `403`
  - `404` (GET route)
  - `406`
  - `429`
  - `500`
- The landing page says pdflayer supports URL-to-PDF and HTML-to-PDF conversion, as well as many layout/customization options.

## Manually confirmed endpoint set

### 1) Convert a public URL to PDF
- Method: `GET`
- Path: `/convert`
- Full URL: `https://api.pdflayer.com/api/convert`
- Purpose: convert a publicly accessible URL to a PDF document.
- Required query parameters confirmed in the official docs:
  - `access_key` - pdflayer API access key
- Core query parameters confirmed in the official route page:
  - `document_url` - public URL to convert; must include `http://` or `https://`
  - `secret_key` - optional MD5-protection key for public URLs
  - `document_name` - output filename
  - `delay` - render delay in milliseconds for JS-heavy pages
  - `dpi` - output DPI (`10..192`)
  - `page_size` - page size such as `A4`, `A3`, `A5`, `Letter`, `Legal`
  - `page_width`, `page_height` - custom page dimensions
  - `custom_unit` - unit selection (`px`, `pt`, `in`, `mm`)
  - `orientation` - `portrait` or `landscape`
  - `margin_top`, `margin_right`, `margin_bottom`, `margin_left`
  - `header_text`, `header_url`, `header_align`, `header_spacing`
  - `footer_text`, `footer_url`, `footer_align`, `footer_spacing`
  - `css_url` - inject custom CSS from a URL
  - `viewport` - render viewport such as `1440x900`
  - `zoom`
  - `use_print_media`
  - `inline` - `1` for inline display; otherwise download attachment behavior
  - `force` - force a fresh conversion rather than serving cached output
  - `ttl` - cache TTL in seconds
  - `accept_lang` - Accept-Language used when fetching the source document
  - `user_agent` - custom User-Agent used when fetching the source document
  - `auth_user`, `auth_pass` - HTTP Basic auth credentials for protected source URLs
  - `title`, `author`, `subject`, `creator` - PDF metadata
  - `encryption` - supported values `40`, `128`, or `256`
  - `owner_password`, `user_password`
  - `no_print`, `no_copy`, `no_modify`
  - `no_backgrounds`, `no_images`, `no_hyperlinks`, `no_javascript`
  - `grayscale`, `low_quality`
  - `watermark_url`, `watermark_opacity`, `watermark_offset_x`, `watermark_offset_y`, `watermark_in_background`
  - `page_numbering_offset`
- Success response notes confirmed in the docs:
  - `200` returns `application/pdf`
  - `Content-Disposition` is controlled by the `inline` parameter
- Important notes:
  - official docs say either `document_url` or, for POST, `document_html` must be supplied
  - homepage says GET and POST are both supported, but GET is the URL-conversion form

### 2) Convert posted HTML or URL payload to PDF
- Method: `POST`
- Path: `/convert`
- Full URL: `https://api.pdflayer.com/api/convert`
- Purpose: preferred conversion method when sending raw HTML or complex header/footer HTML.
- Query parameters confirmed in the official docs:
  - `access_key` - required API access key
  - `secret_key` - optional MD5-protection key
- Supported request content types confirmed in the docs:
  - `application/json`
  - `application/x-www-form-urlencoded`
- Body fields explicitly confirmed on the official POST route page:
  - `document_url` - public source URL
  - `document_html` - raw HTML string; POST-only
  - `document_name` - output filename
- POST-specific usage notes confirmed in the docs:
  - official description says POST is the preferred method for raw HTML and for complex `header_html` / `footer_html` workflows
  - the body can carry many of the same conversion/layout parameters documented on the GET route
- Success response notes:
  - `200` returns binary PDF content (`application/pdf`)

## Pagination
- None. The reviewed official docs do not publish any paginated route family.

## Rate limits and quotas
- The reviewed route docs list HTTP `429` as a possible response.
- The landing page says the free tier allows `100` monthly PDFs.
- The landing page also says usage statistics and alerts are available, but the reviewed public docs did not publish a broader per-minute or per-second throttle table.

## Error handling
- The official GET route lists: `400`, `401`, `403`, `404`, `406`, `429`, and `500`.
- The official POST route lists: `400`, `401`, `403`, `406`, `429`, and `500`.
- The documentation UI also includes an `ApiError` schema section, confirming that non-success responses are formally modeled.
- The reviewed public route pages did not expose a richer human-readable status matrix beyond those codes in the browser session.

## Response format notes
- Successful conversions return binary PDF data.
- The official GET page explicitly documents `application/pdf` for `200` responses.
- The response's `Content-Disposition` header varies with the `inline` parameter.
- Errors are represented through the documented non-`200` responses and the `ApiError` schema family in the docs UI.

## Important usage notes
- The homepage and docs both stress that the service supports both HTML-to-PDF and URL-to-PDF workflows.
- The docs split configuration across general guide pages and the route reference; the route page itself already exposes a large number of conversion/layout/security parameters.
- `document_html` is POST-only.
- Source-URL authentication is handled with `auth_user` and `auth_pass` when pdflayer must fetch a protected page.
- Caching behavior is first-class in the API via `force` and `ttl`.

## Verification notes
This file was manually rebuilt from pdflayer's official homepage and official documentation UI, including the current API Endpoints route pages for GET and POST `/convert`.