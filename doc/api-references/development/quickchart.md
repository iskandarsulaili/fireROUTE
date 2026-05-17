# QuickChart

## Provider metadata
- Category: `Development`
- Provider slug: `quickchart`
- Docs used manually:
  - `https://quickchart.io/documentation/`
  - `https://quickchart.io/documentation/usage/parameters/`
  - `https://quickchart.io/documentation/usage/post-endpoint/`
  - `https://quickchart.io/documentation/usage/short-urls-and-templates/`
  - `https://quickchart.io/documentation/usage/error-handling/`
  - `https://quickchart.io/documentation/qr-codes/qr-code-api/`
  - `https://quickchart.io/documentation/qr-codes/qr-batch-api/`
- Confirmed base URL: `https://quickchart.io`
- Primary response/content types confirmed from the docs: image responses (`png`, `webp`, `jpg`, `svg`, `pdf`), JSON for short-link creation, ZIP archives for QR batch generation, and optional base64 output formats
- Authentication model confirmed from the docs used in this pass: public unauthenticated endpoints are available; some request shapes also expose an optional `key` field for paid/API-key-backed usage
- Manually confirmed routes in this pass: `6`

## Authentication
QuickChart's public docs present the core chart and QR endpoints as directly callable without mandatory authentication.

Confirmed auth notes from the official docs:
- `GET /chart` is documented as a public URL-based rendering endpoint
- `POST /chart` accepts an optional `key` field in the JSON payload
- `POST /chart/create` reuses the same JSON schema as the `/chart` POST endpoint, including optional `key`
- the QR code docs do not require an auth header for the single QR endpoint or the QR batch endpoint

## Common request/response conventions
- Base URL: `https://quickchart.io`
- The chart endpoint family is centered on `/chart`
- The primary chart definition parameter is `chart` or the short alias `c`
- For `GET /chart`, docs recommend URL-encoding the chart configuration unless `encoding=base64` is used
- Common chart-rendering parameters documented for `/chart`:
  - `chart` or `c` - required Chart.js configuration in JSON or JavaScript form
  - `width` or `w` - default `500`
  - `height` or `h` - default `300`
  - `devicePixelRatio` - accepted values `1` or `2`, default `2`
  - `backgroundColor` or `bkg`
  - `version` or `v` - accepted values `2`, `3`, `4`, or another valid Chart.js version string
  - `format` or `f` - accepted values `png`, `webp`, `jpg`, `svg`, `pdf`, `base64`
  - `encoding` - accepted values `url` or `base64`, default `url`
- If JavaScript functions are embedded in a chart configuration sent to the POST API, the docs say the `chart` field must be sent as a string rather than a JSON object

## Manually confirmed endpoint set

### 1) Render a chart via query parameters
- Method: `GET`
- Path: `/chart`
- Full URL pattern: `https://quickchart.io/chart`
- Purpose: render a Chart.js configuration directly to an image or encoded output
- Confirmed query parameters from the docs:
  - `chart` or `c` - required
  - `width` or `w`
  - `height` or `h`
  - `devicePixelRatio`
  - `backgroundColor` or `bkg`
  - `version` or `v`
  - `format` or `f`
  - `encoding`
- Important notes:
  - docs recommend URL-encoding the chart configuration for normal GET usage
  - `encoding=base64` is supported for the chart parameter
  - output format defaults to `png`

### 2) Render a chart via JSON POST
- Method: `POST`
- Path: `/chart`
- Full URL: `https://quickchart.io/chart`
- Content type: `application/json`
- Purpose: render larger or more complex chart definitions without URL length limits
- Confirmed JSON body fields from the official POST spec:
  - `width`
  - `height`
  - `devicePixelRatio`
  - `format`
  - `backgroundColor`
  - `version`
  - `key` - optional
  - `chart` - `string | ChartConfiguration`
- Important notes:
  - use POST when the request would be too large for a browser/server URL limit
  - the docs explicitly say JavaScript-containing chart configs must be sent as a string

### 3) Create a short chart URL
- Method: `POST`
- Path: `/chart/create`
- Full URL: `https://quickchart.io/chart/create`
- Content type: `application/json`
- Purpose: create a reusable short URL for a chart template or saved render
- Request body:
  - same JSON structure as `POST /chart`
- Confirmed response format:
  - JSON with `success`
  - JSON with `url`, e.g. `https://quickchart.io/chart/render/{id}`
- Important notes from the docs:
  - generated short URLs can take a couple of seconds to become active globally
  - saved charts expire after `3 days` for free users and `6 months` for paid users
  - inputs are not validated until the generated render URL is actually visited

### 4) Render a saved chart from a short URL
- Method: `GET`
- Path pattern: `/chart/render/{id}`
- Full URL pattern: `https://quickchart.io/chart/render/{id}`
- Purpose: render the saved chart referenced by a short-link identifier
- Path parameter:
  - `id` - UUID-like identifier returned by `POST /chart/create`
- Usage note:
  - the short-URL documentation shows this route as the response target returned by the create endpoint

### 5) Generate a single QR code
- Method: `GET`
- Path: `/qr`
- Full URL pattern: `https://quickchart.io/qr`
- Purpose: render a QR code image from text or a URL
- Confirmed query parameters from the QR docs:
  - `text` - required content string
  - `format` - `png`, `svg`, or `base64`
  - `margin` - default `4`
  - `size` - default `150`
  - `dark`
  - `light`
  - `finderColor`
  - `dotStyle`
  - `finderStyle`
  - `finderDotStyle`
- Important notes:
  - QR output is publicly retrievable and designed for on-screen and print usage
  - the docs position this route as suitable for spreadsheet/image use cases as well as direct HTTP integration

### 6) Generate QR codes in bulk
- Method: `POST`
- Path: `/qr/batch`
- Full URL: `https://quickchart.io/qr/batch`
- Content type: `application/json`
- Response content type: `application/zip`
- Purpose: generate many QR images in a single request and receive a ZIP archive
- Confirmed request shapes:
  - raw JSON array of QR config objects
  - object wrapper with `qrCodes` array and optional `zipFilename`
- Confirmed per-entry fields from the docs:
  - `text` - required
  - `filename`
  - `format` - `png`, `svg`, or `jpg`
  - `size`
  - `margin`
  - QR styling fields shared with the single QR endpoint
- Important notes:
  - each batch entry uses the same options as the single QR endpoint
  - file names inside the ZIP default to `qr-N.<ext>` when not provided

## Pagination
- None of the QuickChart docs used in this pass document paginated list endpoints for the confirmed routes.

## Error handling
From the official error-handling page:
- chart-rendering failures usually return HTTP `400 Bad Request`
- when an error is rendered as an image, the same error text is also included in the `X-quickchart-error` response header
- a common failure cause is an unencoded or syntactically invalid chart configuration
- very large URL requests can fail with header/cookie-too-large style errors, and the docs recommend switching to the POST API in that case

## Rate limits
- The official QuickChart pages reviewed in this pass do not publish a numeric public rate-limit table for these endpoints.
- The docs do expose an optional API `key` field on POST-based chart endpoints and distinguish between free and paid retention windows for short URLs, which indicates plan-sensitive behavior, but the reviewed pages do not provide a concrete requests-per-minute or requests-per-second limit.

## Response format notes
- `GET /chart` and `POST /chart` primarily return rendered image/encoded payloads, depending on requested format
- `POST /chart/create` returns JSON
- `GET /chart/render/{id}` returns the rendered chart output
- `GET /qr` returns an image or base64 payload depending on `format`
- `POST /qr/batch` returns a ZIP archive

## Important usage notes
- use `POST /chart` whenever the chart configuration is large enough to risk URL-length failures
- if chart configs contain JavaScript functions, send `chart` as a string rather than a JSON object
- short URLs are not permanent on the free tier; plan for expiration if they are used as stored references
- QR batch generation is materially different from the single QR endpoint because it returns `application/zip`, not a single rendered image

## Verification notes
This file was manually rebuilt from QuickChart's official documentation pages with browser inspection, replacing the earlier low-fidelity generated summary.
