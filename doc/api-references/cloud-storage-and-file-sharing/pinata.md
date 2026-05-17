# Pinata

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `pinata`
- Official docs used manually:
  - `https://docs.pinata.cloud/api-reference/introduction`
  - `https://docs.pinata.cloud/api-reference/endpoint/upload-a-file`
  - `https://docs.pinata.cloud/api-reference/endpoint/create-signed-upload-url`
  - `https://docs.pinata.cloud/api-reference/endpoint/list-files`
  - `https://docs.pinata.cloud/api-reference/endpoint/get-file-by-id`
  - `https://docs.pinata.cloud/api-reference/endpoint/get-signed-url`
  - `https://docs.pinata.cloud/api-reference/endpoint/update-file`
  - `https://docs.pinata.cloud/api-reference/endpoint/delete-file-by-id`
  - `https://docs.pinata.cloud/api-reference/endpoint/create-group`
  - `https://docs.pinata.cloud/api-reference/endpoint/get-group`
  - `https://docs.pinata.cloud/api-reference/endpoint/list-groups`
  - `https://docs.pinata.cloud/api-reference/endpoint/add-file-to-group`
  - `https://docs.pinata.cloud/api-reference/endpoint/remove-file-from-group`
  - `https://docs.pinata.cloud/api-reference/endpoint/update-group`
  - `https://docs.pinata.cloud/api-reference/endpoint/delete-group`
- Confirmed API base URLs:
  - `https://uploads.pinata.cloud/v3/files`
  - `https://api.pinata.cloud/v3/files`
  - `https://api.pinata.cloud/v3/groups`
- Primary request/response formats:
  - JSON for metadata/control routes
  - `multipart/form-data` for direct file uploads
- Authentication model:
  - `Authorization: Bearer {token}` on all reviewed routes
  - intro page says key creation reveals `pinata_api_key`, `pinata_api_secret_key`, and a JWT, while the reviewed API examples use Bearer JWT auth
- Manually confirmed routes in this pass: `14`

## Authentication and onboarding
From the reviewed intro and endpoint pages:
- the docs say you must create API keys before using the API
- the key-generation flow shows three values once created:
  - `pinata_api_key`
  - `pinata_api_secret_key`
  - JWT
- the intro explicitly warns that the secret and JWT cannot be viewed again after creation
- every reviewed route uses `Authorization: Bearer {token}`
- the intro’s first connectivity test is:
  - `GET https://api.pinata.cloud/data/testAuthentication`

## Confirmed API surface

| Method | Full URL pattern | Purpose | Key parameters / official notes |
|---|---|---|---|
| `POST` | `https://uploads.pinata.cloud/v3/files` | upload a file | multipart upload; requires `network` and `file`; V3 page says folder uploads are not supported |
| `POST` | `https://uploads.pinata.cloud/v3/files/sign` | create signed upload URL | JSON body includes `date`, `expires`, and optional upload restrictions |
| `GET` | `https://api.pinata.cloud/v3/files/{network}` | list files | supports filters and `pageToken` pagination |
| `GET` | `https://api.pinata.cloud/v3/files/{network}/{id}` | fetch one file by Pinata file id | requires `network` and `id` |
| `POST` | `https://api.pinata.cloud/v3/files/private/download_link` | create private download link | body signs a gateway file URL with expiry/method metadata |
| `PUT` | `https://api.pinata.cloud/v3/files/{network}/{id}` | update file metadata | body supports `name` and `keyvalues` |
| `DELETE` | `https://api.pinata.cloud/v3/files/{network}/{id}` | delete a file by id | requires `network` and `id` |
| `POST` | `https://api.pinata.cloud/v3/groups/{network}` | create group | body requires `name`; optional `is_public` |
| `GET` | `https://api.pinata.cloud/v3/groups/{network}/{id}` | fetch one group | requires `network` and `id` |
| `GET` | `https://api.pinata.cloud/v3/groups/{network}` | list groups | supports `name`, `isPublic`, `limit`, `pageToken` |
| `PUT` | `https://api.pinata.cloud/v3/groups/{network}/{id}/ids/{file_id}` | add a file to a group | requires group id and file id |
| `DELETE` | `https://api.pinata.cloud/v3/groups/{network}/{id}/ids/{file_id}` | remove a file from a group | requires group id and file id |
| `PUT` | `https://api.pinata.cloud/v3/groups/{network}/{id}` | update a group | body supports `name` and `is_public` |
| `DELETE` | `https://api.pinata.cloud/v3/groups/{network}/{id}` | delete a group | requires `network` and `id` |

## Route details

### 1) POST /v3/files
- Host: `uploads.pinata.cloud`
- Purpose: upload a file.
- Content type: `multipart/form-data`
- Reviewed required form fields:
  - `network` - `public` or `private`; defaults to `private`
  - `file`
- Reviewed optional form fields:
  - `name`
  - `group_id`
  - `keyvalues`
  - `car` - raw CAR upload, only supported for public network per docs
- Important official note:
  - the V3 upload endpoint does not support folder uploads; the page tells users to use the legacy `pinFileToIPFS` endpoint for that workflow

### 2) POST /v3/files/sign
- Host: `uploads.pinata.cloud`
- Purpose: create a signed upload URL for delegated/browser uploads.
- Reviewed required body fields:
  - `date` - signing timestamp
  - `expires` - validity duration after `date`
- Reviewed optional body fields:
  - `max_file_size`
  - `allow_mime_types`
  - `group_id`
  - `keyvalues`
  - `filename`
- Reviewed response field:
  - `data` - returned signed URL string

### 3) GET /v3/files/{network}
- Host: `api.pinata.cloud`
- Purpose: list files on one network.
- Reviewed path parameter:
  - `network` - `public` or `private`
- Reviewed query parameters:
  - `name`
  - `group` - can be passed as `null` to show ungrouped files
  - `mimeType`
  - `cid`
  - `cidPending`
  - `metadata`
  - `limit`
  - `order` - `ASC` or `DESC`
  - `pageToken`
- Reviewed response fields:
  - `data.files[]`
  - `data.next_page_token`

### 4) GET /v3/files/{network}/{id}
- Purpose: fetch one file record by Pinata file id.
- Reviewed path parameters:
  - `network`
  - `id`
- Reviewed response fields include:
  - `id`
  - `name`
  - `cid`
  - `size`
  - `number_of_files`
  - `mime_type`
  - `group_id`
  - `keyvalues`
  - `created_at`

### 5) POST /v3/files/private/download_link
- Purpose: create a signed private download URL.
- Reviewed body fields:
  - `url` - full gateway URL in `https://{yourgateway}.mypinata.cloud/files/{cid}` form
  - `date`
  - `expires`
  - `method`
- Reviewed response:
  - `data` - signed URL string

### 6) PUT /v3/files/{network}/{id}
- Purpose: update file metadata.
- Reviewed path parameters:
  - `network`
  - `id`
- Reviewed body fields:
  - `name`
  - `keyvalues`

### 7) DELETE /v3/files/{network}/{id}
- Purpose: delete a file by id.
- Reviewed path parameters:
  - `network`
  - `id`
- Documentation caveat:
  - the reviewed page only exposed a `500 - Internal Server Error` response example with `{"data": null}` rather than a normal success example

### 8) POST /v3/groups/{network}
- Purpose: create a file group.
- Reviewed path parameter:
  - `network`
- Reviewed body fields:
  - `name` - required
  - `is_public` - optional

### 9) GET /v3/groups/{network}/{id}
- Purpose: get one group.
- Reviewed path parameters:
  - `network`
  - `id`
- Reviewed response fields:
  - `id`
  - `name`
  - `is_public`
  - `created_at`

### 10) GET /v3/groups/{network}
- Purpose: list groups on one network.
- Reviewed query parameters:
  - `name`
  - `isPublic`
  - `limit`
  - `pageToken`
- Reviewed response fields:
  - `data.groups[]`
  - `data.next_page_token`

### 11) PUT /v3/groups/{network}/{id}/ids/{file_id}
- Purpose: add a file to a group.
- Reviewed path parameters:
  - `network`
  - `id` - target group id
  - `file_id` - target file id
- Reviewed response:
  - `data: null`

### 12) DELETE /v3/groups/{network}/{id}/ids/{file_id}
- Purpose: remove a file from a group.
- Reviewed path parameters:
  - `network`
  - `id`
  - `file_id`
- Reviewed response:
  - `data: null`

### 13) PUT /v3/groups/{network}/{id}
- Purpose: update a group.
- Reviewed path parameters:
  - `network`
  - `id`
- Reviewed body fields:
  - `name`
  - `is_public`

### 14) DELETE /v3/groups/{network}/{id}
- Purpose: delete a group.
- Reviewed path parameters:
  - `network`
  - `id`
- Reviewed response:
  - `data: null`

## Pagination, format, and error notes
Pagination behavior confirmed from the reviewed docs:
- file listing uses request `pageToken` and response `next_page_token`
- group listing uses request `pageToken` and response `next_page_token`
- the reviewed pages do not document offset/page-number pagination

Format notes:
- control-plane responses are JSON under a top-level `data` key
- uploads use `multipart/form-data`
- signed-upload and metadata-update operations use JSON request bodies

Error/rate-limit notes:
- the reviewed pages do not publish one centralized numeric rate-limit table
- the reviewed pages also do not publish a broad shared error-catalog page in the sampled routes
- the delete-file page unusually exposed only a `500` example, so downstream implementations should be cautious and test the real success semantics before hard-coding assumptions

## Important usage notes
- Most reviewed routes are network-scoped, so adapters must preserve the `public` vs `private` path segment rather than treating network as simple metadata.
- Upload traffic is split onto `uploads.pinata.cloud`, while listing/group/file-metadata routes live on `api.pinata.cloud`.
- Signed download links only appear on the `private` file surface in the reviewed docs.
- The introduction page explicitly points developers to `https://docs.pinata.cloud/llms.txt` as the documentation index, which is useful for discovery but does not replace route-level review.

## Verification notes
This file was manually rebuilt from the live official Pinata docs using browser-based review only.