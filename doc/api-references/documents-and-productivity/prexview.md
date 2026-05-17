# PrexView

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `prexview`
- Docs/pages reviewed manually:
  - `https://prexview.com/`
  - `https://prexview.com/docs`
  - `https://prexview.com/docs/api`
- Confirmed API base URL: `https://api.prexview.com/v1`
- Primary exchange format: multipart form submission with XML or JSON input and binary document/image output
- Manually confirmed routes in this pass: `1`
- Route-method breakdown confirmed from the current official docs:
  - `1` `POST`

## What the official docs confirm
- PrexView currently documents a single transform endpoint under `https://api.prexview.com/v1/transform`.
- The reviewed docs position the product as a data-to-document transformation service that takes XML or JSON plus a template name and returns HTML, PDF, PNG, or JPG output.
- The official docs are concise and centered on this one multipart transform call rather than on a broader REST surface.

## Authentication
From the current official REST API page:
- Authentication uses the account `API_KEY`
- The example request places the key in the `Authorization` header
- Example shown by the docs:
  - `curl -H "Authorization: API_KEY" https://api.prexview.com/v1/transform ...`

## Request, format, and parameter conventions
From the current official docs:
- Main route accepts multipart form fields
- Required input field:
  - either `xml` or `json`
- Required output-selection field:
  - `output` -> must be one of `html`, `pdf`, `png`, or `jpg`
- Required template-selection field:
  - `template`
- Optional fields:
  - `templateBackup`
  - `note`
- The docs explicitly say the `template` and `note` fields can use dynamic values pulled from the input payload

## Response headers and rate-limit notes
The current official docs explicitly publish these response headers:
- `Content-Type`
- `Content-Length`
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `x-transaction-id`

### Official content-type notes
The reviewed docs map output formats to response content types such as:
- HTML -> `text/html; charset=utf-8`
- PDF -> `application/pdf`
- PNG -> `image/png`
- JPG -> `image/jpeg`

## Error notes
From the current official HTTP Responses table:
- `200` -> successful transformation
- `400` -> bad request / malformed request / size too large
- `404` -> requested resource not found
- `429` -> too many requests
- `500` -> internal server error

### Error body example shown in the docs
```json
{
  "error": {
    "message": "Error message...",
    "statusCode": 400
  }
}
```

## Important usage notes
- The docs emphasize that `template` can contain dynamic placeholders such as `invoice-customer-{{Data.customer}}`.
- The service can accept either a file upload or inline XML/JSON string content.
- The rate-limit-reset guidance is tied to response headers instead of a separate quota page.

## Exact route inventory confirmed from the current official docs
- `POST /transform`

## Integration notes for fireROUTE
- Treat PrexView as a single-operation transform API.
- Preserve raw multipart passthrough because the provider-specific `xml/json`, `template`, `output`, `templateBackup`, and `note` fields are the core contract.
- Expect binary document/image responses for most successful calls.