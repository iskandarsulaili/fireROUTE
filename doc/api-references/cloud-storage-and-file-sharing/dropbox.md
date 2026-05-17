# Dropbox

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `dropbox`
- Docs used manually:
  - `https://www.dropbox.com/developers/documentation/http/documentation`
  - `https://developers.dropbox.com/oauth-guide`
- Confirmed RPC API base URL: `https://api.dropboxapi.com/2`
- Confirmed content-upload base URL: `https://content.dropboxapi.com/2`
- Confirmed OAuth authorize URL: `https://www.dropbox.com/oauth2/authorize`
- Confirmed OAuth token URL: `https://api.dropboxapi.com/oauth2/token`
- Primary media types: JSON, raw file bytes
- Authentication: OAuth 2.0 Bearer tokens, with user/app/admin auth variants depending on route
- Manually confirmed routes in this pass: `10`

## Authentication
From the official Dropbox OAuth guide and HTTP reference:
- Dropbox API requests are authorized with OAuth 2.0
- the authorization page is `GET https://www.dropbox.com/oauth2/authorize`
- the token exchange endpoint is `POST https://api.dropboxapi.com/oauth2/token`
- supported authorization flows explicitly documented:
  - authorization-code flow for server-side apps
  - PKCE code flow for public clients such as mobile, desktop, or browser apps
  - legacy implicit/token flow, still documented but no longer recommended
  - client-credentials flow for app-auth tokens on routes that support App Authentication
- token requests can authenticate the app either by:
  - `client_id` and `client_secret` form fields, or
  - HTTP Basic auth using app key as username and app secret as password
- the docs state that only the authorization-page step uses `www.dropbox.com`; API calls otherwise use `api.dropboxapi.com`, `content.dropboxapi.com`, or `notify.dropboxapi.com`
- each route lists a required OAuth scope, for example `files.metadata.read`, `files.content.write`, `files.content.read`, `sharing.read`, or `sharing.write`

## Common request/response conventions
From the official HTTP documentation overview:
- Dropbox commonly uses HTTP `POST` requests
- standard RPC endpoints:
  - send JSON arguments in the request body
  - return JSON in the response body
  - live on `api.dropboxapi.com`
- content-upload endpoints:
  - send file bytes in the request body
  - send route arguments as JSON in the `Dropbox-API-Arg` header or `arg` URL parameter
  - live on `content.dropboxapi.com`
- content-download endpoints:
  - return file bytes in the response body
  - return structured result metadata in the `Dropbox-API-Result` response header
  - accept arguments in `Dropbox-API-Arg` or `arg`
  - support HTTP `GET`, `If-None-Match`, and byte-range requests
- the `.tag` field identifies the selected subtype/member in many Dropbox union objects
- path arguments on reviewed routes can often be supplied as a normal path, `id:...`, `rev:...`, or `ns:...` form depending on the route

## Manually confirmed endpoint set

### 1) Start OAuth authorization
- Method: `GET`
- Path: `/oauth2/authorize`
- Full URL: `https://www.dropbox.com/oauth2/authorize`
- Purpose: send the user to Dropbox's OAuth consent page
- Query parameters explicitly documented:
  - `response_type` - `code` or legacy `token`
  - `client_id`
  - `redirect_uri`
  - `scope`
  - `token_access_type` - for example `offline` in the official examples
  - `code_challenge`
  - `code_challenge_method`
- Important usage notes from the official docs:
  - PKCE is recommended for public clients
  - the page should open in the system browser, not a web-view
  - all redirect URIs must be HTTPS except localhost URIs

### 2) Exchange OAuth code or refresh token
- Method: `POST`
- Path: `/oauth2/token`
- Full URL: `https://api.dropboxapi.com/oauth2/token`
- Purpose: exchange an authorization code, refresh token, or client credentials for access-token material
- Request format:
  - `application/x-www-form-urlencoded`
- Form parameters explicitly documented:
  - `code`
  - `grant_type` - `authorization_code`, `refresh_token`, or `client_credentials`
  - `refresh_token`
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `code_verifier`
  - `scope`
  - `refresh_token_expiration_seconds`
- Important usage notes from the official docs:
  - `client_credentials` tokens are only valid for routes that support App Authentication
  - `scope` on refresh requests can request a subset of the original scopes

### 3) Get file or folder metadata
- Method: `POST`
- Path: `/files/get_metadata`
- Full URL: `https://api.dropboxapi.com/2/files/get_metadata`
- Endpoint format: RPC
- Purpose: retrieve metadata for a file or folder
- Required scope: `files.metadata.read`
- Request body parameters explicitly documented:
  - `path`
  - `include_media_info`
  - `include_deleted`
  - `include_has_explicit_shared_members`
  - `include_property_groups`
- Response notes:
  - returns file, folder, or deleted-metadata objects distinguished by `.tag`
- Important usage notes from the official docs:
  - metadata for the root folder is unsupported
  - `include_deleted=true` changes not-found behavior for deleted items

### 4) Start listing a folder
- Method: `POST`
- Path: `/files/list_folder`
- Full URL: `https://api.dropboxapi.com/2/files/list_folder`
- Endpoint format: RPC
- Purpose: begin listing folder contents and obtain a cursor for further pages/updates
- Supported auth modes documented on the route:
  - User Authentication
  - App Authentication
  - `Dropbox-API-Select-Admin` for whole-team access
- Required scope: `files.metadata.read`
- Request body parameters explicitly documented:
  - `path`
  - `recursive`
  - `include_media_info` - deprecated/no longer effective per route notes
  - `include_deleted`
  - `include_has_explicit_shared_members`
  - `include_mounted_folders`
  - `limit` - optional, `1..2000`
  - `shared_link`
  - `include_non_downloadable_files`
- Response notes:
  - the route returns `entries[]`, `cursor`, and `has_more`
- Important usage notes from the official docs:
  - when `has_more` is true, clients must call `/files/list_folder/continue`
  - the route documentation warns that concurrent identical `list_folder` / `list_folder/continue` calls can trigger `auth.RateLimitError`
  - recursive traversal can create performance issues on very large trees

### 5) Continue folder listing
- Method: `POST`
- Path: `/files/list_folder/continue`
- Full URL: `https://api.dropboxapi.com/2/files/list_folder/continue`
- Endpoint format: RPC
- Purpose: continue paginating a previous `list_folder` operation
- Required scope: `files.metadata.read`
- Request body parameters explicitly documented:
  - `cursor`
- Response notes:
  - returns another page of `entries[]` plus updated `cursor` and `has_more`
- Important usage notes from the official docs:
  - the `cursor` must come from `list_folder` or a prior `list_folder/continue` response

### 6) Download a file
- Method: `POST` (the docs also say content-download endpoints support `GET`)
- Path: `/files/download`
- Full URL: `https://content.dropboxapi.com/2/files/download`
- Endpoint format: Content-download
- Purpose: download file bytes and receive metadata about the downloaded file
- Required scope: `files.content.read`
- Request arguments explicitly documented in `Dropbox-API-Arg`:
  - `path`
  - deprecated `rev`
- Response notes:
  - file bytes are returned in the response body
  - structured metadata is returned in the `Dropbox-API-Result` header
- Important usage notes from the official docs:
  - the `path` can be a normal path, `id:...`, `rev:...`, or namespace form
  - `rev` is deprecated; Dropbox instructs clients to specify revisions through `path` instead

### 7) Upload a file in one request
- Method: `POST`
- Path: `/files/upload`
- Full URL: `https://content.dropboxapi.com/2/files/upload`
- Endpoint format: Content-upload
- Purpose: create a new file from request-body bytes
- Required scope: `files.content.write`
- Request headers/arguments documented on the route:
  - `Content-Type: application/octet-stream`
  - `Dropbox-API-Arg` with:
    - `path`
    - `mode`
    - `autorename`
    - `client_modified`
    - `mute`
    - `property_groups`
    - `strict_conflict`
    - `content_hash`
- Response notes:
  - returns uploaded file metadata as JSON
- Important usage notes from the official docs:
  - do not use this route for files larger than `150 MiB`
  - larger uploads should use upload sessions instead
  - the route counts as a data-transport call for Business teams that have such limits enabled

### 8) Start an upload session
- Method: `POST`
- Path: `/files/upload_session/start`
- Full URL: `https://content.dropboxapi.com/2/files/upload_session/start`
- Endpoint format: Content-upload
- Purpose: start a resumable upload session for large files
- Required scope: `files.content.write`
- Important request/body notes from the official docs:
  - one request should not upload more than `150 MiB`
  - upload sessions support files up to `2^41 - 2^22` bytes (`2,199,019,061,248` bytes)
  - sessions can be used for up to `7 days`
  - concurrent sessions are available through `session_type=concurrent` with chunk-size caveats documented on the route page
- Follow-on routes explicitly named by the official docs:
  - `/files/upload_session/append_v2` or append-batch variants to add data
  - `/files/upload_session/finish` or finish-batch variants to commit the file

### 9) Create a shared link with settings
- Method: `POST`
- Path: `/sharing/create_shared_link_with_settings`
- Full URL: `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`
- Endpoint format: RPC
- Purpose: create a shared link for a file/folder, optionally with custom link settings
- Required scope: `sharing.write`
- Request body parameters explicitly documented:
  - `path`
  - `settings`
- Important usage notes from the official docs:
  - if no settings are supplied, the default requested visibility is public
  - resolved visibility still depends on team/shared-folder policy

### 10) List shared links
- Method: `POST`
- Path: `/sharing/list_shared_links`
- Full URL: `https://api.dropboxapi.com/2/sharing/list_shared_links`
- Endpoint format: RPC
- Purpose: list the caller's shared links, or links relevant to a specific path
- Required scope: `sharing.read`
- Request body parameters explicitly documented:
  - `path`
  - `cursor`
  - `direct_only`
- Response notes:
  - returns `links[]`, `cursor`, and `has_more`
- Important usage notes from the official docs:
  - omitting `path` returns all shared links for the current user
  - when `path` is set, parent-folder links may also be returned unless `direct_only=true`

## Pagination
From the reviewed official route pages:
- Dropbox uses cursor-based pagination on the reviewed list routes
- `/files/list_folder` -> returns `cursor` and `has_more`
- `/files/list_folder/continue` consumes the cursor from the previous page
- `/sharing/list_shared_links` also returns `cursor` and `has_more` and accepts an optional `cursor` request field

## Rate limits
From the official status-code/error documentation and `list_folder` notes:
- the reviewed docs do not publish a single global numeric requests-per-minute quota
- `429` means the app is being rate limited for the given user or team
- the docs instruct clients to wait for the number of seconds in the `Retry-After` response header before retrying
- documented `RateLimitError` reasons include:
  - `too_many_requests`
  - `too_many_write_operations`
- `retry_after` is documented with default `1` second when present in the structured JSON form
- the `list_folder` route specifically warns against issuing simultaneous identical list requests for the same user/app combination

## Error and response notes
From the official error sections:
- errors use standard HTTP status codes; bodies may be JSON or plaintext depending on status
- `400` - bad input parameter; plaintext body with more information
- `401` - bad or expired token; JSON `AuthError` values include tags such as `invalid_access_token`, `expired_access_token`, `missing_scope`, `invalid_select_user`, and `invalid_select_admin`
- `403` - account or team lacks access to the endpoint/feature
- `409` - route-specific endpoint errors are modeled per endpoint in the docs
- `429` - rate limiting; obey `Retry-After`
- `5xx` - Dropbox server-side failure
- many endpoint-specific error payloads use the pattern:
  - `error_summary`
  - `error` with a `.tag` discriminator

## Important usage notes
- choose the endpoint family based on data shape:
  - RPC for JSON in / JSON out
  - content-upload for bytes in / JSON metadata out
  - content-download for JSON args in headers / bytes out
- Dropbox repeatedly distinguishes user auth, app auth, and team-admin impersonation headers; reviewed routes do not all support the same auth mode
- large uploads should move to upload sessions immediately rather than stretching `/files/upload`
- the OAuth guide explicitly says authorization should occur in the system browser, not a web-view

## Verification notes
This file was manually rebuilt from Dropbox's official HTTP documentation and OAuth guide using browser inspection.