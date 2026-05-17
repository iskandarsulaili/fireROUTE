# QR code (goQR / QR Server)

## Provider metadata
- Category: `Development`
- Provider slug: `qr-code-2`
- Docs used manually:
  - `https://goqr.me/api/`
  - `https://goqr.me/api/doc/`
  - `https://goqr.me/api/doc/create-qr-code/`
  - `https://goqr.me/api/doc/read-qr-code/`
- Confirmed API base URL: `https://api.qrserver.com/v1`
- Authentication: none
- Primary response formats: binary image output for generation; JSON or XML for decoding
- Manually confirmed routes in this pass: `4`

## Authentication
- The official QR Server docs do not require an API key, OAuth flow, cookie, or account.
- The reviewed pages present the API as a public QR-code generation and decoding service.

## Common request/response conventions
- Base URL: `https://api.qrserver.com/v1`
- Official docs say all create-route parameters may be supplied by `GET` or `POST`.
- Official docs say all read-route parameters may be supplied by `GET` or `POST`, except `file`, which is POST-only.
- If the same parameter is sent in both GET and POST, the docs explicitly say the GET value wins and the POST value is ignored.
- Official terms note there is no fixed request limit, but the operator reserves the right to reject abusive requests and asks users to contact them if they expect more than `10000` requests/day.

## Manually confirmed endpoint set

### 1) Generate a QR code via GET
- Method: `GET`
- Path: `/create-qr-code/`
- Full URL pattern: `https://api.qrserver.com/v1/create-qr-code/`
- Purpose: generate a QR code image.
- Confirmed query parameters from the official docs:
  - `data` — required text/content to encode
  - `size` — image size in `[width]x[height]` form
  - `charset-source`
  - `charset-target`
  - `ecc`
  - `color`
  - `bgcolor`
  - `margin`
  - `qzone`
  - `format`
- Confirmed format/size notes:
  - minimum size: `10x10`
  - maximum raster size: `1000x1000` for `png|gif|jpeg|jpg`
  - maximum vector size: `1000000x1000000` for `svg|eps`
  - the docs say `data` can often work up to roughly `900` characters, depending on ECC and other QR factors
- Confirmed response notes:
  - default output is an image, with PNG used in the quick-start examples
  - vector output is documented for `svg` and `eps`

### 2) Generate a QR code via POST
- Method: `POST`
- Path: `/create-qr-code/`
- Full URL pattern: `https://api.qrserver.com/v1/create-qr-code/`
- Purpose: same generation operation as the GET form, but with parameters submitted by POST.
- Confirmed request-body notes:
  - official docs state all create-route parameters can be submitted by HTTP POST
  - the same parameter names documented for GET apply here

### 3) Decode a QR code via GET
- Method: `GET`
- Path: `/read-qr-code/`
- Full URL pattern: `https://api.qrserver.com/v1/read-qr-code/`
- Purpose: decode a remotely hosted QR-code image.
- Confirmed query parameters:
  - `fileurl` — URL-encoded URL of an Internet-reachable image containing the QR code
  - `outputformat` — output format for decoded content or error messages
- Confirmed request constraints:
  - `fileurl` images must be PNG, GIF, JPG, or JPEG
  - the image must be smaller than `1 MiB`
  - the docs recommend using HTTP instead of HTTPS for the `fileurl` target when appropriate, to reduce certificate-related download failures
- Confirmed response-format notes:
  - `outputformat` supports `json` and `xml`
  - default output format is `json`
  - the docs explicitly say only the first QR code found in an image is scanned, even if multiple are present or use Structured Append

### 4) Decode a QR code via POST upload
- Method: `POST`
- Path: `/read-qr-code/`
- Full URL pattern: `https://api.qrserver.com/v1/read-qr-code/`
- Purpose: decode an uploaded image file containing a QR code.
- Confirmed body parameters:
  - `file` — multipart upload; POST-only
  - optional `outputformat`
- Confirmed upload constraints:
  - content type is `multipart/form-data`
  - uploaded file must be PNG, GIF, JPG, or JPEG
  - maximum documented file size is `1 MiB`
- Confirmed precedence note:
  - if both `fileurl` and `file` are supplied, the docs say `fileurl` wins and `file` is ignored

## Pagination
- None documented.

## Rate limits
From the official terms on both create and read pages:
- there is no fixed request limit
- abusive or inappropriate traffic may be rejected
- users are asked to contact the operator if their service will regularly exceed `10000` requests per day or if they believe they were blocked incorrectly

## Error handling
- The reviewed docs do not publish a full HTTP status matrix.
- For decode operations, the official docs say the `outputformat` also controls how error messages are returned.
- The decode examples explicitly show structured JSON/XML output prepared for both successful data extraction and error reporting.

## Response format notes
- Generation routes return image content rather than JSON metadata.
- Decode routes return `json` or `xml`.
- The decode docs say JSON/XML are already structured for a future multi-QR-code scenario, even though the current implementation only processes the first QR code found.

## Important usage notes
- The service is public and intentionally lightweight.
- For long encoded payloads, the official docs recommend keeping `data` short where possible and using URL shorteners for very long URLs.
- The docs explicitly note that many older mobile devices struggle with larger QR versions, so shorter content produces more compatible codes.
- Both route families are parameter-driven rather than resource-oriented REST collections.

## Verification notes
This file was manually rebuilt from goQR / QR Server's official homepage and route-level documentation pages, replacing the autogenerated stub.