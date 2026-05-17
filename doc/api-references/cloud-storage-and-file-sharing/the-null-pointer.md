# The Null Pointer

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `the-null-pointer`
- Docs used manually:
  - `https://0x0.st/`
- Confirmed API base URL: `https://0x0.st`
- Primary media types surfaced in docs: plain-text file URLs for successful uploads; form-based HTTP requests for create/manage operations
- Authentication model surfaced in docs: no account auth, but file-management operations require a per-upload management token returned in the `X-Token` response header
- Manually confirmed routes in this pass: `2`

## Authentication
From the official 0x0.st documentation sections:
- uploads do not require an API key or account
- when a new file is uploaded, the HTTP response header includes `X-Token`
- that token is required for later management operations on the uploaded file URL
- the token is described as a `management token`

## Common request/response conventions
- Base URL: `https://0x0.st`
- reviewed operations use `POST`
- uploads are sent as `multipart/form-data`
- successful upload responses return a file URL
- file URLs remain valid for at least `30 days` and up to `1 year`, following the retention curve shown on the official page
- maximum file size documented on the official page: `512.0 MiB`

## Manually confirmed endpoint set

### 1) Upload a file or remote URL
- Method: `POST`
- Path: `/`
- Full URL: `https://0x0.st`
- Purpose: upload binary data directly or instruct the service to fetch a remote file
- Request body fields confirmed in the official `Uploading files` section:
  - `file` - uploaded file data
  - `url` - remote URL to fetch; mutually exclusive with `file`, and the remote site must return a `Content-Length` header
  - `secret` - if present, the service generates a longer, harder-to-guess URL
  - `expires` - maximum lifetime, either as hours or as milliseconds since Unix epoch
- Response/behavior notes confirmed on the official page:
  - new uploads return an `X-Token` response header for later management actions
  - successful uploads return a file URL
  - you can append a custom file name to any returned URL, for example `https://0x0.st/aaa.jpg/image.jpeg`
  - expired files are not removed immediately, but within the next minute

### 2) Manage an uploaded file
- Method: `POST`
- Path: `/{file-id...}` at the uploaded file URL itself
- Full URL pattern: `POST` to the returned file URL
- Purpose: delete a file or change its expiration after upload
- Request body fields confirmed in the official `Managing your files` section:
  - `token` - required management token from the `X-Token` response header
  - `delete` - value ignored; when present, removes the file
  - `expires` - sets maximum file lifetime either in hours or as milliseconds since Unix epoch
- Important usage notes from the official page:
  - management requests are sent to the file URL, not a separate `/manage` endpoint
  - the docs specifically recommend using `curl -i` if you need to inspect the original upload response headers and capture `X-Token`

## Pagination
- none documented

## Retention and size limits
From the official front page:
- minimum retention: `30 days`
- maximum retention: `1 year`
- maximum file size: `512.0 MiB`
- retention depends on file size via the formula shown on the site

## Rate limits
- no numeric rate limits or request-per-minute quotas were published on the reviewed official page

## Error and response notes
- the reviewed docs do not publish a structured JSON error schema or HTTP status-code table
- the service documentation is operationally focused on successful upload and management form fields
- because management is token-based, clients should persist the `X-Token` header immediately after upload if they need later delete/expiry control

## Important usage notes
- `file` and `url` are mutually exclusive on upload
- remote-URL uploads only work when the remote server provides `Content-Length`
- the `secret` field is the documented way to request a harder-to-guess URL for sharing
- 0x0.st explicitly asks client authors to use a unique `User-Agent`, respect user privacy, and obtain user consent before uploading sensitive logs or files

## Verification notes
This file was manually rebuilt from the official 0x0.st front page and its expandable documentation sections using browser inspection.