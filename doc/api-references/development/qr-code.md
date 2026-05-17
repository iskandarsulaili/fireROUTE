# QR code (QRtag)

## Provider metadata
- Category: `Development`
- Provider slug: `qr-code`
- Docs used manually:
  - `https://www.qrtag.net/api/`
- Confirmed API base URL: `https://qrtag.net/api`
- Authentication: none
- Primary response formats: PNG or SVG image output
- Manually confirmed routes in this pass: `1`

## Authentication
- The official QRtag API page does not document any API key, OAuth flow, account requirement, or auth header.
- The examples are direct public image URLs intended to be embedded into webpages.

## Common request/response conventions
- Base URL: `https://qrtag.net/api`
- The official getting-started template is published as:
  - `https://qrtag.net/api/qr(_transparent)(_[size]).[png|svg](?url=[URL])`
- The service is documented as an image-generating endpoint that can be embedded directly in HTML `<img>` tags.
- The reviewed page documents only image-generation behavior; it does not publish JSON responses, pagination, or account-level management endpoints.

## Manually confirmed endpoint set

### 1) Generate a QR code image
- Method: `GET`
- Path family: `/qr(_transparent)(_[size]).{png|svg}`
- Full URL family:
  - `https://qrtag.net/api/qr.png`
  - `https://qrtag.net/api/qr.svg`
  - `https://qrtag.net/api/qr_transparent.png`
  - `https://qrtag.net/api/qr_4.png?url=https://www.qrtag.net`
  - `https://qrtag.net/api/qr_12.svg?url=https://www.qrtag.net`
  - `https://qrtag.net/api/qr_transparent_6.svg?url=https://www.qrtag.net`
- Purpose: generate QR code images with optional transparency, size variant, and target URL content.
- Confirmed path/query controls from the official page:
  - `_transparent` — optional transparent-background variant in the path
  - `_[size]` — optional size token in the path
  - extension `.png` or `.svg` — output image format
  - query `url` — target URL/content to encode in the QR code
- Confirmed usage notes:
  - the page shows both basic no-query examples and advanced `?url=` examples
  - the page does not explain the exact default encoded payload when `url` is omitted, so I did not invent one

## Pagination
- None documented.

## Rate limits
- No numeric rate limit or quota policy was published on the reviewed official API page.

## Error handling
- The reviewed official page does not publish an HTTP status table or structured error schema.
- Because the API is documented as direct image URLs, failures are not described there in JSON-envelope form.

## Response format notes
- Successful responses are image files.
- The two explicitly documented output formats are `png` and `svg`.
- No JSON, XML, or text response format is documented on the reviewed page.

## Important usage notes
- The API documentation page is intentionally short and example-driven.
- QRtag documents this service primarily as a simple embeddable QR generator, not as a broader REST platform.
- The path itself encodes major rendering options, so fireROUTE should treat the provider as a path-template API rather than as a conventional resource collection.

## Verification notes
This file was manually rebuilt from the official QRtag API page, replacing the previous timeout placeholder.