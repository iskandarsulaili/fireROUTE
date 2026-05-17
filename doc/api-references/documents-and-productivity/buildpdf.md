# BuildPDF

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `buildpdf`
- Docs used manually:
  - `https://buildpdf.co/api/docs`
- Confirmed REST API base URL: `https://buildpdf.co/api/v1`
- Primary media type: JSON
- Authentication model surfaced in docs: API key via `X-API-Key` header or Bearer token
- Manually confirmed routes in this pass: `4`

## Authentication
From the official API docs:
- all API requests require an API key
- recommended header: `X-API-Key: bpdf_your_key_here`
- documented alternative: `Authorization: Bearer bpdf_your_key_here`
- keys are `bpdf_`-prefixed
- the docs explicitly warn RapidAPI users to use their BuildPDF key, not `X-RapidAPI-Key`

## Common request/response conventions
- Base URL: `https://buildpdf.co/api/v1`
- most reviewed routes are JSON APIs
- conversion and extraction flows send base64 payloads inside JSON bodies and return JSON responses
- generated PDFs are returned as base64 in the `pdf` field rather than as `application/pdf` bytes in the reviewed docs examples
- usage information appears inside conversion responses and on the dedicated usage route

## Manually confirmed endpoint set

### 1) Convert content to PDF
- Method: `POST`
- Path: `/api/v1/convert`
- Full URL: `https://buildpdf.co/api/v1/convert`
- Purpose: convert HTML, plain text, or image input into a PDF
- Request-body fields confirmed on the official docs page:
  - `html` - optional input HTML string; max body size `10 MB`
  - `text` - optional plain text input
  - `file` - optional base64-encoded JPG/PNG image payload
  - `format` - required when sending `file`; accepted reviewed value: `image`
  - `options` - optional PDF layout settings object
- The official docs state you must provide exactly one of `html`, `text`, or `file`
- Confirmed `options` object fields:
  - `pageSize` - default `a4`; accepted values `a4`, `letter`, `a3`, `legal`
  - `orientation` - default `portrait`; accepted values `portrait`, `landscape`
  - `margin` - integer `0-50`, default `10`
  - `quality` - float `0.1-1.0`, default `0.95`; affects image inputs only
- Successful-response fields confirmed on the docs page:
  - `success`
  - `pdf` - base64-encoded PDF bytes
  - `pages`
  - `sizeBytes`
  - `watermark`
  - `usage.used`
  - `usage.limit`
  - `usage.remaining`
  - `powered_by`
- Important official note:
  - the current HTML renderer strips tags and outputs clean plain text; full CSS/layout rendering is described as coming in v2

### 2) Extract content from a PDF
- Method: `POST`
- Path: `/api/v1/extract`
- Full URL: `https://buildpdf.co/api/v1/extract`
- Purpose: extract text or page images from a PDF
- Access note: official docs mark this as requiring `Starter` plan or above
- Request-body fields confirmed on the official docs page:
  - `file` - required base64-encoded PDF file
  - `output` - optional; `text` by default, or `images` for a base64 ZIP of per-page JPG files
- Plan-size notes confirmed in docs:
  - Starter max file size `25 MB`
  - Pro max file size `50 MB`

### 3) Get current usage
- Method: `GET`
- Path: `/api/v1/usage`
- Full URL: `https://buildpdf.co/api/v1/usage`
- Purpose: return current monthly usage, quota limit, and remaining conversions
- Official usage note: this route does **not** count against conversion quota and can be checked as often as needed

### 4) Register a free API key
- Method: `POST`
- Path: `/api/v1/register`
- Full URL: `https://buildpdf.co/api/v1/register`
- Purpose: create a new free API key
- Request-body fields confirmed on the official docs page:
  - `email` - required email address
- Official behavior notes:
  - returns a `bpdf_`-prefixed key tied to the email address
  - each email can hold one active key
  - the key must be saved immediately because it cannot be retrieved later

## Pagination
- none documented
- the reviewed surface is task-oriented rather than collection/list based

## Rate limits
From the official `Pricing` section:
- Free: `100 conversions/mo`, `5 MB` max file, `10 req/min`, watermark enabled
- Starter: `1,000 conversions/mo`, `25 MB` max file, `60 req/min`, no watermark, includes PDF extraction
- Pro: `10,000 conversions/mo`, `50 MB` max file, `300 req/min`, no watermark, adds batch conversion
- Business: `50,000 conversions/mo`, `100 MB` max file, `1,000 req/min`, priority support

## Error and response notes
From the official `Error Codes` table:
- `400 Bad Request` - required field missing or malformed
- `401 Unauthorized` - API key missing or invalid
- `403 Forbidden` - feature unavailable on current tier
- `413 File Too Large` - file exceeds tier size limit
- `429 Rate Limited` - too many requests; wait and retry or upgrade
- `500 Server Error` - server-side issue; retry or contact support
- successful conversion responses return base64 PDF bytes inside JSON rather than direct file streaming in the reviewed examples

## Important usage notes
- BuildPDF currently exposes more than a single convert route; the official docs also publish extraction, usage, and key-registration routes
- the convert API is intentionally minimal: a one-field `{ "html": ... }` body is presented as the fastest path
- HTML conversion is presently structure-first rather than full CSS rendering
- plan tier affects both file-size caps and which routes/features are available

## Verification notes
This file was manually rebuilt from BuildPDF's official API documentation page using browser inspection.