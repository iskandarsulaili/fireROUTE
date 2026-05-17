# Image-Charts

## Provider metadata
- Category: `Development`
- Provider slug: `image-charts`
- Docs used manually:
  - `https://documentation.image-charts.com/`
  - `https://documentation.image-charts.com/reference/`
  - `https://documentation.image-charts.com/reference/post-requests/`
  - `https://documentation.image-charts.com/reference/output-format/`
  - `https://documentation.image-charts.com/errors`
  - `https://documentation.image-charts.com/limits-and-quotas/`
  - `https://documentation.image-charts.com/enterprise/`
- Confirmed API base URL: `https://image-charts.com`
- Primary response/content types confirmed from the docs: PNG image by default, GIF for animated charts, other image formats for some chart families via `chof`
- Authentication model confirmed from the docs used in this pass: unauthenticated free usage is supported; paid enterprise usage adds signed-request authentication using `icac` and `ichm`
- Manually confirmed routes in this pass: `2`

## Authentication
- The official docs present Image-Charts as usable without authentication for the free tier.
- The quota page explicitly distinguishes unauthenticated calls as requests without `ichm` and `icac`.
- The enterprise page states that paid enterprise users receive:
  - an `account id`
  - a `secret key`
- Enterprise requests are signed server-side with HMAC-SHA256:
  - `icac` - account ID query parameter
  - `ichm` - generated HMAC-SHA256 signature query parameter
- The enterprise docs say signing must be done server-side because exposing the secret key client-side would allow reuse.

## Common request/response conventions
- Core API host: `https://image-charts.com`
- Core path used throughout the official docs: `/chart`
- The docs describe two transport styles for the same chart-generation surface:
  - `GET` with chart parameters in the query string
  - `POST` with chart parameters in the form body
- The getting-started docs state every chart request requires at minimum:
  - `cht` - chart type
  - `chd` - chart data
  - `chs` - chart size
- The official docs repeatedly show additional commonly used parameters including:
  - `chtt` - chart title
  - `chxt` - axis selection
  - `chxl` - axis labels
  - `chdl` - legend text
  - `chf` - fills/backgrounds
  - `chxs` - axis style
  - `chof` - output file-extension hint / output format selector
  - `chan` - animation toggle for animated charts
- The POST Requests page states:
  - GET chart URLs are limited to roughly `2K` characters
  - POST chart requests are supported up to `300 Kilobytes`
- The Output Format page says:
  - most non-animated standard charts return PNG
  - animated charts using `chan` return GIF regardless of `chof`
  - some clients still require explicitly appending `&chof=.gif` or another image extension so they recognize the URL as an image

## Manually confirmed endpoint set

### 1) Generate a chart with query-string parameters
- Method: `GET`
- Path: `/chart`
- Full URL: `https://image-charts.com/chart`
- Purpose: generate a chart, graph, QR code, or other supported image output from URL parameters
- Required parameters confirmed from the getting-started docs:
  - `cht` - chart type
  - `chd` - chart data
  - `chs` - chart size
- Additional parameters directly confirmed on the reviewed official pages:
  - `chtt`
  - `chxt`
  - `chxl`
  - `chdl`
  - `chf`
  - `chxs`
  - `chof`
  - `chan`
  - `icac` - enterprise account ID when using signed requests
  - `ichm` - enterprise request signature when using signed requests
- Response behavior confirmed from the docs:
  - success returns an image
  - standard charts normally return PNG
  - animated charts return GIF
  - some chart families support output changes via `chof`
- Important usage notes from the official docs:
  - unauthenticated free requests are supported but have much tighter quotas
  - signed enterprise requests remove the watermark and raise limits
  - the enterprise docs say Image-Charts verifies signatures against both encoded and decoded query-string forms to reduce encoding-related signing issues

### 2) Generate a chart with form-encoded POST data
- Method: `POST`
- Path: `/chart`
- Full URL: `https://image-charts.com/chart`
- Purpose: generate the same chart output as the GET route, but submit larger chart definitions in the request body
- Request body fields confirmed from the POST Requests page:
  - `cht`
  - `chtt`
  - `chs`
  - `chxt`
  - `chd`
  - plus the same family of chart parameters documented for GET requests
- Body format confirmed from the official examples:
  - HTML form POST fields
  - URL-encoded form data in server-side examples
- Response behavior confirmed from the official page:
  - a valid POST request returns a PNG chart in the basic documented examples
  - more generally, POST uses the same rendering/output rules as GET
- Important usage notes from the official docs:
  - POST is the official workaround for the roughly `2K` URL-length limit on GET requests
  - the documented POST size limit is `300 Kilobytes`

## Pagination
- None. The reviewed Image-Charts docs describe single-request chart rendering rather than list resources.

## Rate limits and quotas
From the official `Limits and Quotas on API Requests` page:
- general limit: `90 queries per 10 seconds per IP address` (effectively `9 QPS`)
- free unauthenticated usage limit: `10 queries per 1 minute per IP address`
- when quota is exceeded, the API returns HTTP `429`
- when the threshold is met, the client is blocked for `1 minute`
- the docs say limits are subject to change and users with special needs should contact support

## Error handling
From the official `Errors` page:
- broad response classes:
  - `2xx` - success, chart generated
  - `4xx` - client/request/parameter/auth issue
  - `5xx` - server-side issue
- specifically documented HTTP statuses:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `429 Too Many Requests`
  - `500 Server Errors`
  - `502 Bad Gateway`
- The docs also document response headers for machine-readable error details:
  - `x-ic-error-code`
  - `x-ic-error-validation`
- Officially listed error-code examples include:
  - `IC_INVALID_SIGNATURE`
  - `IC_ACCOUNT_ID_NOT_FOUND`
  - `IC_MISSING_ENT_PARAMETER`
  - `IC_RETINA_ERROR`
  - `IC_LOCALE_ERROR`
  - `IC_GRAPHVIZ_INVALID_SYNTAX`
  - `IC_GRAPHVIZ_ERROR`
  - `IC_GRAPHVIZ_MAX_EDGES_REACHED`
  - `IC_GRAPHVIZ_MAX_NODES_REACHED`
  - `IC_QRCODE_TOO_MUCH_DATA`
  - `IC_BAD_JSON_ERROR`

## Response format notes
- Success responses are image payloads rather than JSON API envelopes.
- The Output Format page says `chof` should be explicitly set when clients need a URL ending in a valid image extension.
- Standard non-animated charts are documented as PNG outputs.
- Animated charts using `chan` are documented as GIF outputs regardless of `chof`.

## Important usage notes
- This provider is parameter-heavy rather than route-heavy; most capability is controlled by chart query/body fields on the single `/chart` path.
- The enterprise documentation makes clear that signing is optional for free use but required for paid watermark-free enterprise behavior.
- The same `/chart` path is used for many chart families including standard charts, QR codes, and GraphViz-based renders.
- The reviewed public docs emphasize request composition and output formatting far more than a resource-oriented REST model.

## Verification notes
This file was manually rebuilt from the official Image-Charts documentation pages using browser inspection, replacing the earlier generated placeholder.
