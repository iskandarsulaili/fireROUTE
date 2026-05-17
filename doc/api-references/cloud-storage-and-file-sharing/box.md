# Box

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `box`
- Docs used manually:
  - `https://developer.box.com/reference/post-oauth2-token/`
  - `https://developer.box.com/reference/get-files-id/`
  - `https://developer.box.com/reference/get-files-id-content/`
  - `https://developer.box.com/reference/get-folders-id-items/`
  - `https://developer.box.com/reference/post-files-content/`
  - `https://developer.box.com/reference/get-search/`
  - `https://developer.box.com/guides/authentication/tokens/api-calls/`
  - `https://developer.box.com/guides/api-calls/pagination/offset-based/`
  - `https://developer.box.com/guides/api-calls/pagination/marker-based/`
  - `https://developer.box.com/guides/api-calls/permissions-and-errors/rate-limits/`
  - `https://developer.box.com/guides/api-calls/permissions-and-errors/common-errors/`
- Confirmed API base URLs:
  - `https://api.box.com/2.0`
  - `https://upload.box.com/api/2.0`
  - OAuth token endpoint on `https://api.box.com/oauth2/token`
- Primary response format: JSON for metadata routes, binary for downloads, `multipart/form-data` for uploads, form-encoded for OAuth token exchange
- Authentication model: OAuth 2.0 Bearer access tokens for API calls
- Manually confirmed routes in this pass: `6`

## Authentication
From Box's official token guide and token endpoint reference:
- Every authenticated API call requires an **Access Token** in the header:
  - `Authorization: Bearer <ACCESS_TOKEN>`
- The official token guide says calls without a Bearer token return `401 Unauthorized`
- The OAuth token exchange endpoint is:
  - `POST https://api.box.com/oauth2/token`
- The reviewed official token endpoint documents these `grant_type` values:
  - `authorization_code`
  - `refresh_token`
  - `client_credentials`
  - `urn:ietf:params:oauth:grant-type:jwt-bearer`
  - `urn:ietf:params:oauth:grant-type:token-exchange`
- Token-route body fields confirmed on the official page include:
  - `grant_type`
  - `client_id`
  - `client_secret`
  - plus grant-specific fields such as `code`, `refresh_token`, or other exchange parameters depending on the selected grant

## Common request/response conventions
- Core API base for metadata/content control-plane routes: `https://api.box.com/2.0`
- Upload base for file-upload routes: `https://upload.box.com/api/2.0`
- Standard auth header: `Authorization: Bearer <ACCESS_TOKEN>`
- JSON error responses use a standard envelope on many 4xx/5xx failures:
  - `type`
  - `status`
  - `code`
  - `help_url`
  - `message`
  - `request_id`
- Box frequently supports the `fields` query parameter to request extra attributes
- Important `fields` behavior from the official docs:
  - once `fields=` is specified, Box stops returning the standard full field set automatically and instead returns the mini representation plus the fields explicitly requested

## Manually confirmed endpoint set

### 1) Request access token
- Method: `POST`
- Path: `/oauth2/token`
- Full URL: `https://api.box.com/oauth2/token`
- Content type: `application/x-www-form-urlencoded`
- Purpose: exchange an OAuth authorization code, refresh token, JWT assertion, client credentials, or token exchange request for an access token
- Confirmed body fields on the official page:
  - `grant_type` - required enum
  - `client_id`
  - `client_secret`
  - grant-specific fields such as `code` when using `authorization_code`
- Confirmed responses:
  - `200`
  - `400`
  - default error response
- Successful response fields shown in the official example:
  - `access_token`
  - `expires_in`
  - `token_type`
  - `restricted_to`
  - `refresh_token`
  - `issued_token_type`

### 2) Get file information
- Method: `GET`
- Path: `/files/{file_id}`
- Full URL: `https://api.box.com/2.0/files/{file_id}`
- Purpose: fetch file metadata
- Auth: Bearer token required
- Path parameter:
  - `file_id` - required file identifier
- Query parameter confirmed:
  - `fields` - comma-separated list of extra attributes to include
- Confirmed responses:
  - `200`
  - `401`
  - `404`
  - `405`
  - `415`
- Response fields directly visible on the official page include:
  - `id`, `type`, `etag`, `sequence_id`, `name`, `sha1`, `file_version`, `description`, `size`, `path_collection`, `created_at`, `modified_at`, `created_by`, `modified_by`, `owned_by`, `shared_link`, `parent`, `item_status`, `version_number`, `comment_count`, `permissions`, `tags`, `lock`, `extension`
- Important usage note from the official page:
  - the `etag` can be used in conditional headers like `If-Match` and `If-None-Match`

### 3) Download file content
- Method: `GET`
- Path: `/files/{file_id}/content`
- Full URL: `https://api.box.com/2.0/files/{file_id}/content`
- Purpose: return the raw binary contents of a file
- Auth: Bearer token required
- Path parameter:
  - `file_id` - required
- Header parameters confirmed:
  - `range` - request a byte range with `bytes={start_byte}-{end_byte}`
  - `boxapi` - shared-link access header, formatted as:
    - `shared_link=[link]`
    - or `shared_link=[link]&shared_link_password=[password]`
- Query parameters confirmed:
  - `version` - download a specific file version
  - `access_token` - optional pre-auth token for shareable browser/third-party download use
- Confirmed responses:
  - `200`
  - default binary/error response
- Important note from the docs:
  - this route can be used with shared links through the `boxapi` header even when the caller does not otherwise have the item directly shared with them

### 4) List items in folder
- Method: `GET`
- Path: `/folders/{folder_id}/items`
- Full URL: `https://api.box.com/2.0/folders/{folder_id}/items`
- Purpose: list a folder's contents
- Auth: Bearer token required
- Path parameter:
  - `folder_id` - required folder identifier
  - the root folder is always `0`
- Query parameters confirmed on the official page:
  - `fields`
  - `usemarker`
  - `marker`
  - `offset` - default `0`
  - `limit` - max `1000`
  - `sort` - `id|name|date|size`
  - `direction`
- Confirmed responses:
  - `200`
  - `403`
  - `404`
  - `405`
- Response pagination fields shown in the official example:
  - `limit`
  - `next_marker`
  - `prev_marker`
  - `total_count`
  - `offset`
  - `order`
  - `entries`
- Important usage note from the official route page:
  - high offsets may become unreliable, and the docs recommend marker-based pagination for large datasets

### 5) Upload file
- Method: `POST`
- Path: `/files/content`
- Full URL: `https://upload.box.com/api/2.0/files/content`
- Purpose: upload a new file to Box
- Auth: Bearer token required
- Request content type: `multipart/form-data`
- Body parts confirmed:
  - `attributes` - required JSON object with upload metadata such as `name` and parent folder
  - `file` - required file binary part
- Important ordering rule from the official page:
  - `attributes` must appear **before** the `file` part
  - otherwise Box returns HTTP `400` with `metadata_after_file_contents`
- Confirmed responses:
  - `201`
  - `400`
  - `404`
  - `409`
- Response note:
  - success returns a JSON list with `total_count` and `entries[]` containing the created file object

### 6) Search for content
- Method: `GET`
- Path: `/search`
- Full URL: `https://api.box.com/2.0/search`
- Purpose: search files, folders, and other searchable content
- Auth: Bearer token required
- Query parameters confirmed in the reviewed official page excerpt:
  - `query` - required unless `mdfilters` is supplied
  - `scope` - `user_content|enterprise_content`, default `user_content`
  - `file_extensions`
  - `created_at_range`
  - additional search filters exist beyond the excerpt reviewed here
- Search syntax notes explicitly documented:
  - exact phrase matching with double quotes
  - boolean operators `AND`, `OR`, and `NOT`
  - lowercase or mixed-case boolean operators are not supported
- Confirmed responses:
  - `200`
  - `400`
  - `403`
  - `404`
- Successful response example includes:
  - `type`
  - `total_count`
  - `limit`
  - `offset`
  - `entries`

## Pagination
From Box's official pagination guides:

### Offset-based pagination
- Uses `offset` and `limit`
- First page: omit `offset` or set `offset=0`
- Next page: set the next offset to `previous_offset + previous_limit`
- Box explicitly warns clients to increment by the **returned `limit`**, not by the actual number of entries in the page
- Final page is reached when the next offset exceeds `total_count`

### Marker-based pagination
- Uses `marker` and `limit`
- Some endpoints also require `usemarker=true`
- First page: omit `marker` or set marker to `0`/empty initial state as documented for the endpoint
- Next page: pass the previous response's `next_marker`
- Final page is reached when `next_marker` becomes `null`
- Box explicitly says applications should **not retain `next_marker` long-term** because marker internals may change over time
- Marker-based paging is preferred for changing or very large collections

## Rate limits
From Box's official rate-limit guide:
- General API calls: `1000 API requests per minute, per user`
- Uploads: `240 file upload requests per minute, per user`
- Search endpoint:
  - `6 searches per second, per user`
  - `60 searches per minute, per user`
  - `12 searches per second, per enterprise`
- The guide also describes three rate-limit categories:
  - user based
  - quality of service
  - licensing based
- The reviewed guide explains that selective temporary throttling may be introduced during infrastructure contention or licensing overages

## Error format and troubleshooting notes
From Box's official error guide:
- Many 4xx and some 5xx responses return a standard JSON error object like:
  - `type: "error"`
  - `status`
  - `code`
  - `help_url`
  - `message`
  - `request_id`
- Example shown on the official page:
  - `status: 400`
  - `code: "bad_digest"`
  - message about a mismatched upload checksum
- Box publishes common named error codes such as:
  - `bad_digest`
  - `bad_request`
  - additional route-specific error codes listed deeper on the page

## Important usage notes
- `fields=` is powerful but changes the default response shape; requesters must explicitly ask for every needed field beyond the mini representation
- Folder listing supports both offset-based and marker-based paging; some routes require `usemarker=true` to switch to marker mode
- Search is heavily rate-limited relative to general API traffic
- Uploads go to `upload.box.com`, not the regular `api.box.com/2.0` host
- The download route supports byte ranges and shared-link access patterns through the `boxapi` header
- Box's token endpoint is form-encoded rather than JSON-based

## Verification notes
This file was manually rebuilt from Box's official endpoint reference pages plus the official authentication, pagination, rate-limit, and error guides, replacing the earlier low-fidelity generated extraction.
