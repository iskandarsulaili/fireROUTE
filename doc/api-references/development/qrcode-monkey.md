# Qrcode Monkey

## Provider metadata
- Category: `Development`
- Provider slug: `qrcode-monkey`
- Docs used manually:
  - `https://www.qrcode-monkey.com/qr-code-api-with-logo/`
  - the in-page official script value `GLOBAL_API_ENDPOINT = 'https://api.qrcode-monkey.com/'`
- Confirmed REST API base URL: `https://api.qrcode-monkey.com`
- Primary media types: binary image files for QR render routes; JSON error bodies; JSON success body for uploads
- Authentication model surfaced in docs: none documented on the official page; the reviewed public render endpoint accepted anonymous requests during this pass
- Manually confirmed routes in this pass: `3`

## Authentication
- The official QRCode Monkey API page does not document API keys, Bearer tokens, or signed query parameters.
- The page says the API is also accessible through RapidAPI, but the same official page exposes the direct base endpoint `https://api.qrcode-monkey.com/`.
- During this pass, a live `GET` request to `https://api.qrcode-monkey.com/qr/custom?...` returned `200 image/png` without any auth headers.
- A live `POST` request to `/qr/uploadImage` without a file returned a validation error rather than an auth challenge, which further suggests the direct endpoint is publicly callable.

## Common request/response conventions
- Base URL: `https://api.qrcode-monkey.com`
- Confirmed routes use `GET`, `POST`, and `OPTIONS` on the render endpoints plus `POST` on image upload.
- QR-generation routes return binary files in one of the documented output formats:
  - `png`
  - `svg`
  - `pdf`
  - `eps`
- The docs state `pdf` and `eps` do not support color gradients.
- `GET` requests pass route parameters in the query string.
- `POST` requests send a JSON request body for QR-generation routes.
- Upload requests use `multipart/form-data` with form field name `file`.

## Manually confirmed endpoint set

### 1) Create a custom QR code
- Methods: `GET`, `POST`, `OPTIONS`
- Path: `/qr/custom`
- Full URL: `https://api.qrcode-monkey.com/qr/custom`
- Purpose: generate a styled QR code with colors, gradients, logo, eye/body styles, and multiple output formats
- Documented parameters:
  - `data` - required QR payload content; examples use URLs
  - `size` - minimum pixel size; default `300`
  - `config` - JSON object controlling the QR appearance; URL-encode it for `GET`
  - `file` - output format; default `png`; docs list `png`, `svg`, `pdf`, `eps`
  - `download` - boolean; default `false`; force direct browser download
- Important `config` fields explicitly listed on the official page include:
  - `body`, `eye`, `eyeBall`
  - `erf1`, `erf2`, `erf3`
  - `brf1`, `brf2`, `brf3`
  - `bodyColor`, `bgColor`
  - `eye1Color`, `eye2Color`, `eye3Color`
  - `eyeBall1Color`, `eyeBall2Color`, `eyeBall3Color`
  - `gradientColor1`, `gradientColor2`, `gradientType`, `gradientOnEyes`
  - `logo`, `logoMode`
- Response notes:
  - success returns an image/document file rather than a JSON wrapper
  - live validation in this pass: missing `data` returned HTTP `400` with JSON body `{"errorCode":1,"errorMessage":"Data is not set"}`

### 2) Create a transparent QR code
- Methods: `GET`, `POST`, `OPTIONS`
- Path: `/qr/transparent`
- Full URL: `https://api.qrcode-monkey.com/qr/transparent`
- Purpose: generate a transparent QR code, optionally composited on top of a provided background image
- Documented parameters:
  - `data` - required QR payload content
  - `image` - optional uploaded filename or image URL used as the background canvas
  - `size` - width/height of the QR code drawn on the image; default `300`
  - `x` - x position in the image canvas; default `0`
  - `y` - y position in the image canvas; default `0`
  - `crop` - boolean; default `false`; return only the QR code area
  - `file` - output format; default `png`
  - `download` - boolean; default `false`
- Response notes:
  - success returns a binary output file (`png`, `svg`, `pdf`, or `eps` per the docs)
  - the reviewed official documentation says `image` is optional, but live requests to this route returned server-side `500` errors during this pass, so fireROUTE should treat this operation as documented but operationally unstable

### 3) Upload an image for use as a logo
- Method: `POST`
- Path: `/qr/uploadImage`
- Full URL: `https://api.qrcode-monkey.com/qr/uploadImage`
- Content type: `multipart/form-data`
- Required form field:
  - `file` - uploaded PNG, JPG, or SVG image
- Purpose: upload a logo image and receive a filename token that can be referenced later via `config.logo`
- Response notes:
  - official example response shape: `{"file":"235saf73as782as29ss.png"}`
  - live validation in this pass: omitting the `file` field returned HTTP `400` with JSON body `{"errorCode":9,"errorMessage":"Form fieldname 'file' is not existing"}`

## Pagination
- The reviewed official QRCode Monkey API page does not document pagination for any route.

## Rate limits
- The reviewed official QRCode Monkey API page does not publish numeric rate limits, quotas, burst ceilings, or retry windows.
- The page does mention RapidAPI availability, but no direct-endpoint quota guidance is shown on the official landing page reviewed in this pass.

## Error handling
- Official docs provide limited formal error documentation.
- Live validation during this pass confirmed JSON error bodies on at least these cases:
  - `400` `{"errorCode":1,"errorMessage":"Data is not set"}` when `/qr/custom` is called without `data`
  - `400` `{"errorCode":9,"errorMessage":"Form fieldname 'file' is not existing"}` when `/qr/uploadImage` is called without the upload field
- `/qr/transparent` returned a server-side `500` HTML error page during live checks in this pass.

## Response format notes
- Render routes return raw files rather than JSON envelopes.
- Upload success returns JSON containing the generated uploaded filename.
- Error responses observed in this pass were JSON on `/qr/custom` and `/qr/uploadImage`, but HTML on the failing `/qr/transparent` server error.

## Important usage notes
- The official docs are route-light: almost all customization is parameter-driven rather than split across many endpoints.
- `config.logo` can take either an external image URL or the uploaded filename returned by `/qr/uploadImage`.
- `GET` callers must URL-encode both `data` and the serialized `config` object.
- The transparent route is officially documented but behaved inconsistently in live testing, so fireROUTE should be careful about assuming it is production-stable.

## Verification notes
This file was manually rebuilt from the official QRCode Monkey API page and live endpoint behavior inspected through the browser during this pass.
