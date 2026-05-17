# ddownload

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `ddownload`
- Docs used manually:
  - `https://ddownload.com/api`
- Confirmed API base URL: `https://api-v2.ddownload.com/api`
- Primary media type: JSON for documented API responses; `multipart/form-data` for file upload submission
- Authentication model surfaced in docs: API key passed as query parameter `key`
- Manually confirmed routes in this pass: `16`

## Authentication
From the official DDownload API page:
- the documented REST routes use a required query parameter named `key`
- the docs say the API key is obtained from `Affiliate -> Settings -> API`
- the reviewed page does not document bearer tokens, OAuth, or header-based API-key auth

## Common request/response conventions
- Base URL: `https://api-v2.ddownload.com/api`
- The documented fixed REST surface uses `GET` endpoints for account, file, and folder management.
- File upload itself is a separate `POST` multipart submission to a per-upload server URL returned by `GET /upload/server`.
- The official examples return JSON with a shared envelope including:
  - `msg`
  - `server_time`
  - `status`
  - `result`
- The reviewed docs publish a per-key rate limit of `3-4 requests / second`.
- The docs page uses query-string parameters rather than JSON request bodies for the fixed REST endpoints.

## Manually confirmed endpoint set

### Account
1) Account info
- Method: `GET`
- Path: `/account/info`
- Full URL pattern: `https://api-v2.ddownload.com/api/account/info?key=key`
- Query parameters:
  - `key`

2) Account stats
- Method: `GET`
- Path: `/account/stats`
- Full URL pattern: `https://api-v2.ddownload.com/api/account/stats?key=key&last=last`
- Query parameters:
  - `key`
  - `last`
- Parameter note: the docs say `last` defaults to `7`

### Upload workflow
3) Get upload server
- Method: `GET`
- Path: `/upload/server`
- Full URL pattern: `https://api-v2.ddownload.com/api/upload/server?key=key`
- Query parameters:
  - `key`
- Important note: the response includes both an upload server URL and `sess_id`

Upload submission note
- The official docs also show a multipart `POST` form upload using fields `sess_id` and `file`, but the action target is the dynamic `UPLOAD_SERVER_URL` returned by the API rather than a single fixed canonical path, so it is documented here as workflow context and not counted as a separate fixed route.

### Files
4) Get file info
- Method: `GET`
- Path: `/file/info`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/info?key=key&file_code=file_code`
- Query parameters:
  - `key`
  - `file_code`
- Parameter note: `file_code` may be a comma-separated list

5) Get files list
- Method: `GET`
- Path: `/file/list`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/list?key=key&page=page&per_page=per_page&fld_id=fld_id&public=public&created=created&name=name`
- Query parameters confirmed on the docs page:
  - `key`
  - `page`
  - `per_page`
  - `fld_id`
  - `public`
  - `created`
  - `name`

6) Check files in batch
- Method: `GET`
- Path: `/file/check`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/check?key=key&file_code=file_code`
- Query parameters:
  - `key`
  - `file_code`
- Important note: the docs say the batch accepts up to `500` file codes

7) Check whether a file already exists
- Method: `GET`
- Path: `/file/exists`
- Full URL patterns documented:
  - `https://api-v2.ddownload.com/api/file/exists?key=key&md5=md5`
  - `https://api-v2.ddownload.com/api/file/exists?key=key&name=name`
  - `https://api-v2.ddownload.com/api/file/exists?key=key&name=name&size=size`
- Query parameters:
  - `key`
  - `md5`
  - `name`
  - `size`
- Important note: the docs say callers must provide either `md5` or `name`

8) Rename file
- Method: `GET`
- Path: `/file/rename`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/rename?key=key&file_code=file_code&name=name`
- Query parameters:
  - `key`
  - `file_code`
  - `name`

9) Set file folder
- Method: `GET`
- Path: `/file/set_folder`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/set_folder?key=key&file_code=file_code&fld_id=fld_id`
- Query parameters:
  - `key`
  - `file_code`
  - `fld_id`

10) Set file property
- Method: `GET`
- Path: `/file/set_property`
- Full URL pattern: `https://api-v2.ddownload.com/api/file/set_property?key=key&file_code=file_code&public=public&premium_only=premium_only`
- Query parameters:
  - `key`
  - `file_code`
  - `public`
  - `premium_only`
- Important note: the docs say at least one of `public` or `premium_only` must be supplied

11) Get deleted files
- Method: `GET`
- Path: `/files/deleted`
- Full URL pattern: `https://api-v2.ddownload.com/api/files/deleted?key=key&last=last`
- Query parameters:
  - `key`
  - `last`

### Folders
12) Get folder/file list
- Method: `GET`
- Path: `/folder/list`
- Full URL pattern: `https://api-v2.ddownload.com/api/folder/list?key=key&fld_id=fld_id`
- Query parameters:
  - `key`
  - `fld_id`

13) Create folder
- Method: `GET`
- Path: `/folder/create`
- Full URL pattern: `https://api-v2.ddownload.com/api/folder/create?key=key&parent_id=parent_id&name=name`
- Query parameters:
  - `key`
  - `parent_id`
  - `name`

14) Rename folder
- Method: `GET`
- Path: `/folder/rename`
- Full URL pattern: `https://api-v2.ddownload.com/api/folder/rename?key=key&fld_id=fld_id&name=name`
- Query parameters:
  - `key`
  - `fld_id`
  - `name`

15) Delete folder
- Method: `GET`
- Path: `/folder/delete`
- Full URL pattern: `https://api-v2.ddownload.com/api/folder/delete?key=key&fld_id=fld_id`
- Query parameters:
  - `key`
  - `fld_id`
  - `force`
- Important note: the docs say `force=1` moves files to root and subfolders to the parent before deletion

16) Move folder
- Method: `GET`
- Path: `/folder/move`
- Full URL pattern: `https://api-v2.ddownload.com/api/folder/move?key=key&fld_id=fld_id&parent_id=parent_id`
- Query parameters:
  - `key`
  - `fld_id`
  - `parent_id`
- Important note: the docs say `parent_id=0` moves the folder to root

## Pagination
- `GET /file/list` exposes page-based pagination via `page` and `per_page`
- The docs also expose filtering on that route with `fld_id`, `public`, `created`, and `name`
- No general pagination model is published for the rest of the API surface

## Rate limits
- the reviewed official docs publish `3-4 requests / second` as the maximum request rate per API key

## Error and response notes
- shared response envelope fields in examples include `msg`, `server_time`, `status`, and `result`
- the reviewed examples show status values including:
  - `200` for success
  - `400` for invalid folder-delete conditions
  - `404` for file-not-found cases in list/info responses
  - `451` for DMCA or legally blocked file states
- the batch file-check route explicitly documents these per-file status semantics:
  - `200` file exists
  - `404` not found
  - `451` removed due to DMCA

## Important usage notes
- uploads are two-step: first request `GET /upload/server`, then submit a multipart `POST` to the returned upload URL with the returned `sess_id`
- the docs explicitly warn not to cache or reuse `sess_id`
- the docs say the `sess_id` ties the uploaded file to the caller account and uploads may fail with `session expired, please request a new upload URL` when invalid or expired
- the `file/exists` route can be used to avoid duplicate uploads by checking MD5 or filename before sending a file
- the docs describe circular-reference protection on folder moves

## Verification notes
This file was manually rebuilt from the official DDownload API page using browser inspection only. The `16` fixed routes above were directly visible on the reviewed first-party documentation page.