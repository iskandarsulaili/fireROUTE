# CraftMyPDF

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `craftmypdf`
- Docs/pages reviewed manually:
  - `https://craftmypdf.com/`
  - `https://craftmypdf.com/docs/index.html`
  - `https://craftmypdf.s3.ap-southeast-1.amazonaws.com/craftmypdf_api/craftmypdf_api.yaml`
- Confirmed API base URL family:
  - `https://api.craftmypdf.com/v1`
  - `https://api-de.craftmypdf.com/v1`
  - `https://api-us.craftmypdf.com/v1`
  - `https://api-au.craftmypdf.com/v1`
  - `https://api-alt.craftmypdf.com/v1`
  - `https://api-alt-de.craftmypdf.com/v1`
  - `https://api-alt-us.craftmypdf.com/v1`
- Primary exchange format: `application/json`
- Manually confirmed routes in this pass: `23`
- Route-method breakdown confirmed from the current official reference:
  - `8` `GET`
  - `15` `POST`

## What the official docs confirm
- CraftMyPDF publishes a JSON-over-HTTP API for PDF generation, image generation, template management, account inspection, and PDF manipulation.
- The current official docs expose `23` concrete method+path operations across five route families.
- The reference is hosted as a Redoc page and also links a first-party downloadable OpenAPI YAML file.
- The main default API host is Singapore, with region-specific and alternative-region hosts documented for Europe, US East, and Australia.

## Authentication
From the current official Authentication section:
- API key header: `X-API-KEY`
- API keys are generated from the CraftMyPDF web console under `API Integration`
- The docs consistently show `Content-Type: application/json` together with `X-API-KEY`

## Regional endpoint notes
From the current official Regional API endpoints table:
- Default Singapore: `https://api.craftmypdf.com/` (`100` second max timeout, `4 MB` max payload)
- Europe Frankfurt: `https://api-de.craftmypdf.com/` (`100` second max timeout, `4 MB` max payload)
- US East N. Virginia: `https://api-us.craftmypdf.com/` (`100` second max timeout, `4 MB` max payload)
- Australia Sydney: `https://api-au.craftmypdf.com/` (`30` second max timeout, `6 MB` max payload)
- Alternative Singapore: `https://api-alt.craftmypdf.com/` (`30` second max timeout, `6 MB` max payload)
- Alternative Frankfurt: `https://api-alt-de.craftmypdf.com/` (`30` second max timeout, `6 MB` max payload)
- Alternative US East: `https://api-alt-us.craftmypdf.com/` (`30` second max timeout, `6 MB` max payload)

### Official payload-size notes
- The payload-size ceiling applies to both request and response.
- If `export_type` is `json`, outputs stored on AWS S3 do not carry the same returned-binary limitation.
- If `export_type` is `file`, the generated binary file size is limited by region-specific return limits.

## Rate limits
From the current official Rate limiting section:
- `100 requests per 10 seconds per IP address`
- `100 concurrent synchronous PDF-generation requests per user account`
- Exceeding limits returns HTTP `429`
- The docs explicitly recommend `POST /v1/create-async` for high-volume generation because requests are queued and completed via webhook callback

## Request, format, and parameter conventions
From the current official docs:
- Request `Content-Type` for `POST` and `GET` requests is documented as `application/json`
- CORS is explicitly supported
- Generated files can be returned in two main ways:
  - `export_type=json` -> JSON response with hosted file URL(s)
  - `export_type=file` -> binary file returned directly without CraftMyPDF storing the output
- BYOS storage is supported through post-action S3 fields
- Frequently recurring request fields include:
  - `template_id`
  - `version`
  - `data`
  - `expiration`
  - `output_file`
  - `export_type`
  - `cloud_storage`
  - `postaction_s3_filekey`
  - `postaction_s3_bucket`
- Common list endpoints expose offset-style pagination with:
  - `limit`
  - `offset`

## IP whitelisting notes
The current official IP whitelist table publishes outbound CraftMyPDF service IPs by region:
- Singapore: `54.169.31.181/32`
- Australia: `3.105.245.173/32`
- Europe: `35.159.181.52/32`
- US East: `52.21.225.83/32`

## Error notes
- The reviewed route pages primarily show `200`/`default` success samples.
- The global rate-limit section explicitly documents HTTP `429` for request-rate violations.
- The docs do not publish one separate shared error-envelope chapter for all endpoints.

## Important usage notes
- `POST /v1/create-async` is the officially recommended path for queued/high-volume generation.
- The editor-session endpoints allow temporary delegated editing access with feature-level flags such as `canSave`, `canPreview`, `canEditJSON`, `canShowLayers`, and `backURL`.
- Template-usage analytics are queryable through date-window filters.
- PDF-manipulation endpoints operate on file URLs rather than on inline uploaded binaries.

## Confirmed route surface summary
The current official docs expose `23` operations across these route families:
- `PDF Generation API` -> `4`
- `Image Generation API` -> `1`
- `Template Management API` -> `11`
- `Account Management API` -> `2`
- `PDF Manipulation API` -> `5`

## Exact route inventory confirmed from the current official docs
All routes below are documented under the current `v1` API base.

### PDF Generation API (`4` routes)
- `POST /create`
- `POST /create-async`
- `POST /create-merge`
- `POST /create-parallel`

### Image Generation API (`1` route)
- `POST /create-image`

### Template Management API (`11` routes)
- `GET /list-templates`
- `GET /list-template-versions`
- `POST /retain-template-versions`
- `POST /new-template-from`
- `POST /transfer-template-to`
- `POST /update-template`
- `GET /get-template`
- `GET /delete-template`
- `GET /query-template-usage`
- `POST /create-editor-session`
- `POST /deactivate-editor-session`

### Account Management API (`2` routes)
- `GET /list-transactions`
- `GET /get-account-info`

### PDF Manipulation API (`5` routes)
- `POST /merge-pdfs`
- `POST /add-text-to-pdf`
- `POST /update-pdf-fields`
- `GET /get-pdf-info`
- `POST /add-watermark`

## Route-specific parameter notes from the reviewed reference
Representative officially documented parameters include:
- `GET /list-templates`
  - query: `limit`, `offset`
- `GET /list-template-versions`
  - query: `template_id`
- `POST /retain-template-versions`
  - body: `template_id`, `versions`, `keep`
- `POST /create`
  - body: `template_id`, `data`, `load_data_from`, `version`, `export_type`, `expiration`, `output_file`, `image_resample_res`, `direct_download`, `cloud_storage`, `password_protected`, `password`, `postaction_s3_filekey`, `postaction_s3_bucket`, `resize_images`, `resize_max_width`, `resize_max_height`, `resize_format`, `paging`, `pdf_version`
- `POST /create-async`
  - body: `data`, `template_id`, `version`, `expiration`, `webhook_url`, storage and resize fields
- `POST /create-parallel`
  - body: `requests`, `merge`, `merge_expiration`
- `GET /query-template-usage`
  - query: `template_ids`, `start_date`, `end_date`
- `POST /create-editor-session`
  - body: `template_id`, `expiration`, `canSave`, `canCreatePDF`, `canViewSettings`, `canPreview`, `canEditJSON`, `canShowHeader`, `canShowLayers`, `canShowPropertyPanel`, `canShowHelp`, `canShowData`, `canShowExpressionDoc`, `canShowPropertyBinding`, `canShowBackURL`, `jsonMode`, `backURL`
- `POST /merge-pdfs`
  - body: `urls`, `expiration`, `output_file`, `cloud_storage`, `postaction_s3_filekey`, `postaction_s3_bucket`
- `POST /add-text-to-pdf`
  - body: `url`, `textSettings`, `expiration`, `output_file`, `cloud_storage`
- `POST /update-pdf-fields`
  - body: `url`, `fields`, `expiration`, `output_file`, `cloud_storage`
- `GET /get-pdf-info`
  - query: `url`
- `POST /add-watermark`
  - body: `url`, `text`, `font_size`, `opacity`, `rotation`, `hex_color`, `font_family`, `expiration`, `output_file`, `cloud_storage`, `postaction_s3_filekey`, `postaction_s3_bucket`

## Integration notes for fireROUTE
- Use region-specific base hosts when data residency matters.
- Prefer async creation for high-throughput workloads.
- Preserve CraftMyPDF-specific output/storage fields because they control whether files are returned inline, stored on CraftMyPDF CDN, or pushed to customer S3.
- Treat editor-session routes as a distinct embedded-designer capability, not a document-generation route.