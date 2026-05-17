# APITemplate.io

## Overview
- Provider: APITemplate.io API v2
- Category: Photography
- Official docs: `https://apitemplate.io/apiv2/`
- Product site reviewed: `https://apitemplate.io/`
- OpenAPI spec reviewed: `https://apitemplateio.s3.ap-southeast-1.amazonaws.com/redoc_apiv2/apitemplateiov2_api.yaml`
- Base URLs:
  - `https://rest.apitemplate.io`
  - `https://rest-de.apitemplate.io`
  - `https://rest-us.apitemplate.io`
  - `https://rest-au.apitemplate.io`
- Alternative regional endpoints mentioned in the docs:
  - `https://rest-alt.apitemplate.io`
  - `https://rest-alt-de.apitemplate.io`
  - `https://rest-alt-us.apitemplate.io`
- Auth: `X-API-KEY: YOUR_API_KEY`
- HTTPS: yes
- Response format: JSON by default; some generation routes can return binary file output with `export_type=file`
- CORS: yes; docs say responses use wildcard same-origin access
- Confirmed route count: `12`

## Confirmed endpoints
### Generation API
| Method | Path | Key parameters / body | Notes |
|---|---|---|---|
| POST | `/v2/create-pdf` | query `template_id` required; optional `export_type`, `export_in_base64`, `expiration`, `output_html`, `output_format`, `filename`, `direct_download`, `cloud_storage`, `load_data_from`, `extract_link`, `generation_delay`, `image_resample_res`, `resize_images`, `resize_max_width`, `resize_max_height`, `resize_format`, `postaction_s3_filekey`, `postaction_s3_bucket`, `postaction_enabled`, `meta`, `async`, `webhook_url`, `webhook_method`, `webhook_headers`; body is template JSON data | Create a PDF from a saved template. Supports synchronous and asynchronous generation. |
| POST | `/v2/create-image` | query `template_id` required; optional `expiration`, `cloud_storage`, `generation_delay`, image resize params, post-action params, `meta`; body uses `overrides[]` objects | Create image output from a saved template. Docs examples return JPEG and PNG download URLs. |
| POST | `/v2/create-pdf-from-html` | optional query `export_type`, `expiration`, `output_format`, `filename`, `direct_download`, `cloud_storage`, `generation_delay`, image resize params, post-action params, `meta`, `async`, `webhook_url`, `webhook_method`; body includes `body`, optional `css`, optional `data`, optional `settings` | Render HTML/CSS into a PDF or alternative output formats. |
| POST | `/v2/create-pdf-from-url` | same query family as HTML route; body includes `url` and optional `settings` | Render a remote URL into PDF output. |
| POST | `/v2/create-pdf-from-markdown` | same query family as HTML route; body includes `body` (markdown), optional `data`, optional `css`, optional `settings` | Render Markdown into PDF output. |

### Generated-object management
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v2/list-objects` | optional `limit`, `offset`, `template_id`, `transaction_type`, `transaction_ref` | List generated PDFs/images. `transaction_type` example values are `PDF`, `JPEG`, or `MERGE`. |
| GET | `/v2/delete-object` | required `transaction_ref` | Delete a generated PDF/image from the CDN and mark the transaction as deleted. |
| GET | `/v2/account-information` | none | Returns account information/status. |

### Template management
| Method | Path | Key parameters / body | Notes |
|---|---|---|---|
| GET | `/v2/list-templates` | optional `limit`, `offset`, `format`, `template_id`, `group_name`, `with_layer_info` | List templates. `format` filters by `PDF` or `JPEG`. |
| GET | `/v2/get-template` | optional `template_id` | Experimental template-detail API according to the official docs. |
| POST | `/v2/update-template` | JSON body with required `template_id`, plus optional `body`, `css`, `settings` | Experimental template-update API according to the official docs. |

### PDF manipulation
| Method | Path | Key parameters / body | Notes |
|---|---|---|---|
| POST | `/v2/merge-pdfs` | optional query `postaction_s3_filekey`, `postaction_s3_bucket`, `postaction_enabled`, `meta`; JSON body includes `urls[]`, optional `export_type`, optional `expiration` | Merge multiple PDF URLs or data URLs into one PDF. |

## Auth and request notes
- All documented routes require API-key auth with `X-API-KEY`.
- The docs say `Content-Type: application/json` for both POST and GET requests.
- The API is documented as CORS-enabled with wildcard access for browser-based cross-domain requests.
- The service is explicitly REST/HTTP based; the official site links SDKs, but the reference itself is HTTP-first.

## Regional endpoint and payload notes
- Standard endpoints and limits from the official docs:
  - Singapore: `https://rest.apitemplate.io` — max timeout `100s`, max payload `4MB`
  - Frankfurt: `https://rest-de.apitemplate.io` — max timeout `100s`, max payload `4MB`
  - US East: `https://rest-us.apitemplate.io` — max timeout `100s`, max payload `4MB`
  - Sydney: `https://rest-au.apitemplate.io` — max timeout `30s`, max payload `6MB`
- Alternative-region endpoints are also documented with `30s` timeout and `6MB` payload limits.
- The docs note payload size limits apply to both request and response.
- The docs also note that `export_type=json` stores the generated file on their CDN, while `export_type=file` returns binary data directly and has stricter file-size limits.

## Pagination, rate limits, and concurrency
- List endpoints use `limit` and `offset`.
- The official docs publish a global rate-limit policy:
  - `100` requests per `10` seconds per IP address
  - `100` concurrent synchronous PDF-generation requests per user account
- Exceeding the limit is documented to return HTTP `429`.

## Response and error notes
- Success responses are JSON objects with `status: success` for normal JSON mode.
- Generation responses typically include fields such as `download_url`, `transaction_ref`, and, for PDF output, `total_pages`.
- Image generation examples show separate `download_url` and `download_url_png` values.
- Error responses follow the shared `Error` schema in the official OpenAPI file:
  - `status` = `error`
  - `message` = error text
- Several generation routes support webhook callbacks in async mode via `webhook_url` and `webhook_method`.

## Important implementation notes
- The route families are split cleanly across creation, object management, template management, and PDF merging.
- `get-template` and `update-template` are marked experimental in the official docs.
- `merge-pdfs` accepts both normal HTTP(S) PDF URLs and `data:` URLs.
- The docs include post-action storage options for AWS S3, Cloudflare R2, and Azure Storage.
- Outbound-fetch IP whitelisting is documented for protected assets:
  - Singapore: `54.169.31.181/32`
  - US: `52.21.225.83/32`
  - Germany: `35.159.181.52/32`
  - Australia: `3.105.245.173/32`

## fireROUTE integration notes
- Treat APITemplate as a document/image rendering backend rather than a media catalog API.
- Keep template-based routes (`create-pdf`, `create-image`) distinct from direct-render routes (`create-pdf-from-html`, `...-from-url`, `...-from-markdown`).
- Surface `limit`/`offset` for list endpoints and preserve async/webhook options on generation routes.
- Support regional base-URL selection because the provider explicitly documents region-specific processing and limits.

## Sources inspected
- `https://apitemplate.io/`
- `https://apitemplate.io/apiv2/`
- `https://apitemplateio.s3.ap-southeast-1.amazonaws.com/redoc_apiv2/apitemplateiov2_api.yaml`
