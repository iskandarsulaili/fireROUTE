# Filestack

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `filestack`
- Official docs/pages reviewed manually:
  - `https://www.filestack.com/docs/api/file/`
  - `https://www.filestack.com/docs/security/policies/`
  - `https://www.filestack.com/docs/uploads/storage/`
- Confirmed API style: REST file-management API plus CDN delivery guidance
- Confirmed File API base URL: `https://www.filestackapi.com/api/file`
- Confirmed store path family: `https://www.filestackapi.com/api/store/...`
- Manually confirmed route count: `5`
- Route-method breakdown:
  - `2` `GET`
  - `2` `POST`
  - `1` `DELETE`

## What the official docs confirm
- Filestack's File API is a compact file-management surface, not a large resource catalog.
- The docs explicitly tell users to serve/download files through the Filestack CDN rather than repeatedly pulling file bytes through the API.
- The File API docs cover download, store, overwrite, delete, and metadata operations.

## Authentication and security
From the reviewed official docs:
- Basic storage uploads require the `key` query parameter with the Filestack API key.
- Security can also be supplied via query parameters:
  - `policy`
  - `signature`
- For secured operations the docs also allow HTTP Basic auth:
  - username: `app`
  - password: application secret key
- The docs explicitly say security is required for destructive operations such as overwrite and delete, and may also be required if account-level security has been enabled.

## Request/response and parameter notes
- File download returns the file body.
- Store, overwrite, delete, and metadata calls return JSON.
- Store accepts either:
  - multipart/binary file upload
  - a public URL passed as `url` in the request body
- Confirmed important query/body parameters from the reviewed page:
  - `key`
  - `policy`
  - `signature`
  - `filename`
  - `mimetype`
  - `path`
  - `container`
  - `url`
  - `base64decode`
  - `skip_storage`
  - metadata flags such as `size`, `mimetype`, `filename`, `uploaded`, `writeable`, `cloud`, `source_url`, `exif`, `upload_status`, `md5`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `location`, `path`, and `container`

## Rate limits, pagination, and errors
- The reviewed File API docs did not publish a shared numeric rate-limit table.
- No pagination model is needed for the confirmed File API routes.
- The reviewed File API page focused on request parameters and example responses rather than a single shared error-envelope table.

## Confirmed route inventory
### Download
- `GET /file/{HANDLE}`
  - purpose: retrieve a file by Filestack handle
  - confirmed query parameters:
    - `dl`
    - `cache`

### Store
- `POST /store/{PROVIDER}/{HANDLE}`
  - purpose: upload/store a file into a configured backend and return JSON metadata
  - confirmed docs note: the route table shows `/{HANDLE}` in the path, while the page's worked example omits that trailing handle segment and uses `.../api/store/S3?key=...`; this docs inconsistency should be runtime-verified before adapter hardening

### Overwrite
- `POST /file/{HANDLE}`
  - purpose: overwrite an existing handle with a new request body
  - confirmed query parameter:
    - `base64decode`
  - official note: this action requires security

### Delete
- `DELETE /file/{HANDLE}`
  - purpose: delete a file by handle
  - confirmed query parameter:
    - `skip_storage`
  - official note: this action requires security

### Metadata
- `GET /file/{HANDLE}/metadata`
  - purpose: return generated JSON metadata for a file handle
  - official note: `exif=true` requires security

## Important usage notes
- The docs explicitly recommend using the Filestack CDN for delivery instead of using the File API as a download pipeline.
- The store route documentation is internally inconsistent about whether the path must include `{HANDLE}`; the route table includes it, while the example request does not.
- Metadata is generated on the fly and is not stored as a persistent Filestack database record.
- Image dimensions are not part of the File API metadata contract; the docs direct users to the Processing API's `imagesize` task instead.

## Verification note
This file was manually rebuilt from Filestack's current official File API and related official security/storage docs using browser inspection only.