# FileUp

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `fileup`
- Docs used manually:
  - `https://github.com/RealSinaSnp/FileUp`
- Confirmed public upload base URL: `https://upload.sinasnp.com`
- Primary request media type surfaced in the reviewed example: `multipart/form-data` style file upload
- Authentication model surfaced in docs/repo: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the reviewed official repository page and extracted route example:
- no API key, bearer token, OAuth flow, or account-login requirement was documented for the public upload route
- the route is presented as a public upload endpoint under `/api/public/...`

## Common request/response conventions
- Confirmed base URL: `https://upload.sinasnp.com`
- the reviewed API surface only exposed one concrete HTTP route
- the repository description presents FileUp as a file hosting service with temporary uploads, expiration controls, and view limits
- the exact response schema was not published on the reviewed repository page
- the reviewed materials did not publish a shared error-envelope format

## Manually confirmed endpoint set

### 1) Upload a file
- Method: `POST`
- Path: `/api/public/upload`
- Full URL: `https://upload.sinasnp.com/api/public/upload`
- Purpose: upload a file to the public FileUp hosting service
- Authentication: none documented on the reviewed official materials
- Request-format note:
  - the route is an upload endpoint and should be treated as a file-upload request rather than a plain JSON body
- Parameters:
  - the reviewed repository surfaces the upload URL but does not publish a stable field-by-field parameter table on the pages reviewed in this pass
- Important usage notes from the reviewed repository description:
  - FileUp is described as temporary file hosting
  - the service description mentions expiration times
  - the service description mentions view limits

## Pagination
- none documented for the reviewed upload route

## Rate limits
- no published rate limits or quota windows were surfaced on the reviewed official repository page

## Error and response notes
- the reviewed official materials did not publish a status-code matrix or reusable error schema
- the reviewed official materials also did not publish a detailed success-response example on the pages inspected in this pass

## Important usage notes
- the currently confirmed surface is minimal and centered on one public upload route
- the route inventory should be treated conservatively until the upstream repository exposes fuller route-level documentation
- consumers should verify the exact multipart field names at integration time because the reviewed pages did not provide a formal request-body table

## Verification notes
This file was manually rebuilt from the official FileUp repository using browser inspection. Only the public upload endpoint was concretely exposed on the reviewed first-party materials.