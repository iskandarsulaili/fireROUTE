# Html2PDF

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `html2pdf`
- Docs used manually:
  - `https://html2pdf.app/`
  - `https://html2pdf.app/documentation/`
- Confirmed REST API base URL: `https://api.html2pdf.app`
- Primary media types: PDF binary on synchronous success; base64-encoded PDF payload posted to callbacks for async mode
- Authentication: API key parameter
- Manually confirmed routes in this pass: `1`

## Authentication
From the official documentation page:
- authentication is performed by passing the `apiKey` parameter with the request
- the docs explicitly say `apiKey` can be sent with either `GET` or `POST`
- the public examples use JSON `POST` requests to the generate endpoint

## Common request/response conventions
- Base URL: `https://api.html2pdf.app`
- documented API path: `/v1/generate`
- the API converts either a public URL or raw HTML into a PDF document
- parameters must be URL-encoded when using `GET`
- async mode is enabled by supplying a callback URL; the callback receives the generated PDF as base64 in a JSON structure
- the reviewed docs did not publish a separate pagination model or route-specific rate-limit table

## Manually confirmed endpoint set

### 1) Generate a PDF from HTML or a URL
- Method: `GET` or `POST`
- Path: `/v1/generate`
- Full URL: `https://api.html2pdf.app/v1/generate`
- Purpose: generate a PDF from a target URL or raw HTML content
- Query/body parameters confirmed on the official docs page:
  - `html` - required; either raw HTML code or the website URL to render
  - `apiKey` - required API key
  - `callBackUrl` - optional async callback destination; generated PDF is sent back as base64 JSON
  - `state` - user-supplied passthrough value returned to the callback
  - `landscape` - boolean page orientation toggle
  - `format` - page size such as `Letter`, `Legal`, `Tabloid`, `Ledger`, `A0`, `A1`, `A2`, `A3`, `A4`, `A5`, `A6`
  - `width` - custom width, used with `height`
  - `height` - custom height, used with `width`
  - `marginTop`, `marginRight`, `marginBottom`, `marginLeft` - page margins in pixels
  - `filename` - returned filename header value
  - `waitFor` - wait `0` to `10` seconds before rendering to allow background JavaScript to finish
  - `media` - `print` or `screen`
  - `scale` - numeric scale from `0.1` to `2`
  - `headerTemplate` - HTML header template
  - `footerTemplate` - HTML footer template
- Response behavior confirmed on the official docs page:
  - synchronous calls return the generated PDF document
  - asynchronous callback mode sends JSON containing a base64-encoded `document`
- Important usage notes from the official docs page:
  - `GET` parameters must be URL-encoded
  - raw HTML input is supported in addition to URL rendering
  - the docs include additional sections for fonts, forced page breaks, header/footer rendering, and encryption, all on the same generation route

## Pagination
- none documented for the reviewed route

## Rate limits
- no public numeric rate-limit table was published on the reviewed homepage or documentation page

## Error and response notes
- the reviewed public documentation focused on request construction and callback behavior rather than a formal status-code table
- async callback payload is documented as JSON containing a base64-encoded `document`
- synchronous usage is presented as returning a generated PDF file directly

## Important usage notes
- callback mode is the official async pattern; the docs do not expose a separate job-status polling endpoint on the reviewed public pages
- the route is heavily parameter-driven rather than split across multiple specialized endpoints
- custom page sizing (`width`/`height`) and header/footer HTML are part of the same generation call rather than standalone sub-resources

## Verification notes
This file was manually rebuilt from the official Html2PDF homepage and official documentation page using browser inspection.