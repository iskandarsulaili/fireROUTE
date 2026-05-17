# File.io

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `file-io`
- Docs used manually:
  - `https://www.file.io/`
  - `https://www.file.io/developers`
- Confirmed API base URL: `https://file.io`
- Primary response formats: JSON for management/metadata responses, raw file bytes for downloads
- Manually confirmed routes in this pass: `7`

## Authentication
- The marketing homepage demonstrates unauthenticated upload and download flows for the public core service.
- The developer reference also exposes account-scoped routes such as `GET /me` and shows an `Authorize` control in the Swagger UI.
- In this anonymous browser session, the official docs did **not** surface the exact auth header or token name for the authorized/account-scoped routes.
- Based on the official examples that were directly visible:
  - core upload and link-download behavior is public
  - account/list/update/delete/plan routes are documented in the developer UI, with at least some of them clearly intended for authorized use

## Common request/response conventions
- Base URL: `https://file.io`
- The homepage positions the service as one-time or expiring file sharing.
- Successful JSON metadata responses share a common envelope that includes fields such as:
  - `success`
  - `status`
  - file metadata like `id`, `key`, `name`, `link`, `expires`, `expiry`, `downloads`, `maxDownloads`, `autoDelete`, `size`, `mimeType`, `created`, `modified`
- The developer docs also expose a `TimePeriod` pattern: `^[1-9]\d*[y|Q|M|w|d|h|m|s]$`
- The homepage examples explicitly show that once a one-time file is downloaded or expired, later retrieval returns JSON like:
  - `{"success":false,"error":404,"message":"Not Found"}`

## Manually confirmed endpoint set

### 1) Upload a file / create file details
- Method: `POST`
- Path: `/`
- Full URL: `https://file.io/`
- Purpose: upload a file and create a downloadable share link.
- Request body fields confirmed in the official developer docs:
  - `file` - binary file payload
  - `expires` - expiration period
  - `maxDownloads` - integer maximum download count
  - `autoDelete` - boolean auto-delete behavior
- Response notes confirmed in the official docs/UI:
  - returns a JSON file-details object
  - sample object includes `key`, `link`, `expires`, `expiry`, `downloads`, and storage metadata
- Important usage notes confirmed on the homepage:
  - homepage examples show anonymous `curl -F "file=@test.txt" https://file.io`
  - examples also show `expires=1w` and explain that the suffixes can represent weeks (`w`), months (`M`), and years (`y`), with day-based expiry as the default behavior

### 2) List files
- Method: `GET`
- Path: `/`
- Full URL: `https://file.io/`
- Purpose: list files in the current scope/account.
- Query parameters confirmed in the developer docs:
  - `search` - string search term
  - `sort` - string sort field/order token
  - `offset` - integer offset
  - `limit` - integer page size
- Response notes:
  - returns JSON with `count` plus a `files` array of file-details objects
- Authentication note:
  - the reviewed docs expose this route in the authenticated developer UI, but the exact scheme name was not visible in this session

### 3) Download a file by key
- Method: `GET`
- Path: `/{key}`
- Full URL: `https://file.io/{key}`
- Purpose: fetch file content using the share key.
- Path parameters:
  - `key` - required file/share key
- Response notes confirmed in the developer docs:
  - `200` returns file data (`*/*` media type in the UI)
  - `302` redirects to `https://www.file.io/download/{key}`
- Homepage behavior note:
  - homepage examples show the first retrieval returning the raw file/text content and later retrieval returning a JSON `404 Not Found` payload after the link has been consumed

### 4) Replace a file / full update
- Method: `PUT`
- Path: `/{key}`
- Full URL: `https://file.io/{key}`
- Purpose: update the file identified by `key`, resetting unspecified fields to defaults.
- Path parameters:
  - `key` - required file/share key
- Request body fields confirmed in the developer docs:
  - `file` - binary replacement content
  - `expires`
  - `maxDownloads`
  - `autoDelete`
- Response notes:
  - returns a JSON file-details object
- Important usage note:
  - the docs explicitly say parameters not provided are reset to defaults

### 5) Partially update a file
- Method: `PATCH`
- Path: `/{key}`
- Full URL: `https://file.io/{key}`
- Purpose: update file settings/content while retaining unspecified values.
- Path parameters:
  - `key` - required file/share key
- Request body fields confirmed in the developer docs:
  - `file`
  - `expires`
  - `maxDownloads`
  - `autoDelete`
- Response notes:
  - returns a JSON file-details object
- Important usage note:
  - the docs explicitly distinguish `PATCH` from `PUT`: missing fields keep their existing values rather than resetting to defaults

### 6) Delete a file
- Method: `DELETE`
- Path: `/{key}`
- Full URL: `https://file.io/{key}`
- Purpose: delete the file identified by `key`.
- Path parameters:
  - `key` - required file/share key
- Response notes:
  - returns a minimal JSON response with `success` and `status`

### 7) Get current plan/account details
- Method: `GET`
- Path: `/me`
- Full URL: `https://file.io/me`
- Purpose: return plan/account limits for the authenticated user.
- Confirmed parameters: none
- Response fields shown in the official schema example:
  - `success`
  - `status`
  - `planId`
  - `maxUploadBytes`
  - `maxStorageBytes`
  - `usedStorageBytes`
  - `rateLimit`
- Authentication note:
  - the route description explicitly says it is for the authenticated user

## Pagination
- The official developer docs expose offset-style pagination on `GET /` via:
  - `offset`
  - `limit`
- The list response schema includes a top-level `count` field.

## Rate limits
- The official homepage and reviewed developer UI did not publish a numeric global public rate-limit table for the public endpoints.
- The `GET /me` response schema includes a `rateLimit` field for the current account/plan.
- I did not infer a numeric limit that the reviewed official docs did not explicitly state.

## Error handling
- The homepage examples explicitly show JSON errors containing:
  - `success`
  - `error`
  - `message`
- A consumed or expired link example returns `404 Not Found` in that JSON structure.
- The download route in the developer UI also documents a `302` redirect as part of the normal delivery flow.
- The reviewed anonymous developer UI did not expose a full status-code matrix for every operation.

## Response format notes
- Upload/create, list, update, delete, and account routes return JSON metadata/envelopes.
- Download routes return file bytes and may redirect to a `/download/{key}` URL.
- The homepage also documents direct text uploads via `--data "text=..."`, with subsequent retrieval returning the raw text body.

## Important usage notes
- The homepage repeatedly describes file.io as anonymous, encrypted, and auto-deleting after download or expiration.
- Files can be uploaded without creating an account for the basic flow shown on the homepage.
- The `expires` parameter is central to the product design and is documented both in the homepage examples and the Swagger schema.
- PUT-versus-PATCH semantics are explicitly differentiated in the official developer reference.
- The official site advertises uploads up to `4 GB` on the public product page.

## Verification notes
This file was manually rebuilt from file.io's official homepage and official `/developers` Swagger UI using browser inspection.