# Quip

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `quip`
- Docs/pages reviewed manually:
  - `https://quip.com/dev/automation/documentation/current`
  - `https://quip.com/dev/automation/documentation/current/openapi-info`
  - `https://quip.com/dev/automation/documentation/current/openapi-specs`
- Confirmed API base URL: `https://platform.quip.com`
- Confirmed API style: versioned REST API plus a WebSocket bootstrap endpoint
- Primary response format: JSON for API responses, with some export/download routes returning document files
- Manually confirmed route count from the current official Automation OAS: `53`
- Route-method breakdown confirmed from the current official Automation OAS:
  - `28` `GET`
  - `24` `POST`
  - `1` `PUT`

## What the official docs confirm
- The reviewed first-party Automation API is REST-based and versioned under `/1` and `/2` path families on `https://platform.quip.com`.
- The current official OAS exposes `53` live method+path operations across these families:
  - `oauth` -> `4`
  - `threads` -> `28`
  - `blob` -> `2`
  - `messages` -> `2`
  - `folders` -> `8`
  - `users` -> `8`
  - `websockets` -> `1`
- The docs explicitly say responses are JSON and errors use standard HTTP status codes with JSON-formatted error information in relevant response bodies.
- The docs also state that VPC customers replace `quip.com` with either `customername.onquip.com` or `quip-customername.com` in the platform hostnames.

## Authentication
The current official docs no longer describe simple API-key query auth for the Automation API itself. The reviewed official auth model is OAuth 2.

### OAuth 2 bearer-token model
- Security scheme in the official OAS: `OAuth2`
- Bearer header format documented in the OAS:
  - `Authorization: Bearer {access_token}`
- Official OAuth endpoints:
  - `POST /1/oauth/access_token`
  - `GET /1/oauth/login`
  - `POST /1/oauth/revoke`
  - `GET /1/oauth/verify_token`
- Official authorization URL: `https://platform.quip.com/1/oauth/login`
- Official token URL: `https://platform.quip.com/1/oauth/access_token`
- Official refresh URL: `https://platform.quip.com/1/oauth/access_token`

### Scopes confirmed in the current official OAS
- `USER_READ` -> GET/read access
- `USER_WRITE` -> POST/DELETE/PATCH-style edit access as described in the official security-scheme prose
- `USER_MANAGE` -> higher-privilege management actions such as sharing and locking

### Token/access notes from the official docs
- The current docs also mention personal access tokens for testing.
- The reviewed docs say the OAuth-style auth endpoints are the only endpoints that do not require the Authorization header.
- The docs additionally mention domain-authentication support for customer domains.

## Rate limits
From the current official Automation docs:

### Per-user default limits
- `50` requests per minute per user
- `750` requests per hour per user

### Per-company default limit
- `600` requests per minute per company

### Official rate-limit headers
- `X-Ratelimit-Limit`
- `X-Ratelimit-Remaining`
- `X-Ratelimit-Reset`
- `X-Company-RateLimit-Limit`
- `X-Company-RateLimit-Remaining`
- `X-Company-RateLimit-Reset`
- `X-Company-Retry-After`

### Rate-limit usage note
- The docs explicitly call out a separate document-bulk-export rate-limit section tied to the bulk export routes.
- The reviewed spec/docs also include HTTP `429` among documented error outcomes.

## Pagination
The reviewed official OAS and docs do not publish one universal pagination contract, but they do expose reusable pagination/query parameters and cursor-driven list traversal.

Directly confirmed reusable/common query parameters from the current OAS:
- `cursor`
- `limit`
- `expiring`
- `name`

Docs note for `cursor`:
- it is described as a pointer to the next page of data

Examples of paged/list-style surfaces visible in the current docs/spec:
- `GET /2/threads/`
- `GET /1/threads/recent`
- `GET /1/threads/search`
- `GET /1/users/contacts`
- `GET /1/users/current/threads`
- `GET /1/folders/`

## Error model and transport notes
From the current official docs and OAS:
- Responses are JSON for normal API calls.
- The reviewed current OAS includes documented error components for:
  - `400 Bad Request`
  - `401 Authentication`
  - `403 Forbidden`
  - `404 Not Found`
  - `409 Conflict`
  - `413 Payload Too Large`
  - `429 Too Many Requests`
  - `500 Server Error`
- The public docs text explicitly says standard HTTP status codes are used in addition to JSON-formatted error information.

## Important usage notes
- Threads are Quip's core object and can represent chats, documents, or spreadsheets.
- The docs explicitly say thread IDs are permanent 11-character ids, while URL suffixes can expire and should be resolved to permanent IDs before long-term use.
- Documents are returned as HTML in some read flows, and section ids are important for advanced edit operations.
- Quip folders act more like tags than traditional exclusive filesystem folders; a thread can belong to multiple folders.
- The official docs call out license/product requirements before a company can access Quip APIs.
- The current docs also state that some Admin APIs are sold as add-ons and are separate from the Automation surface documented here.

## Confirmed route surface summary
The current official Automation OAS exposes `53` concrete operations.

### OAuth (`4` routes)
- `POST /1/oauth/access_token`
- `GET /1/oauth/login`
- `POST /1/oauth/revoke`
- `GET /1/oauth/verify_token`

### Threads (`28` routes)
Representative routes directly confirmed from the current OAS:
- `POST /1/threads/add-members`
- `POST /1/threads/copy-document`
- `POST /2/threads/{threadIdOrSecretPath}/copy`
- `POST /1/threads/delete`
- `POST /1/threads/edit-document`
- `POST /1/threads/edit-share-link-settings`
- `GET /1/threads/{thread_id}/export/docx`
- `GET /1/threads/export/async`
- `POST /1/threads/export/async`
- `GET /1/threads/{thread_id}/export/pdf`
- `GET /1/threads/{thread_id}/export/pdf/async`
- `POST /1/threads/{thread_id}/export/pdf/async`
- `GET /1/threads/{thread_id}/export/xlsx`
- `GET /2/threads/{threadIdOrSecretPath}/folders`
- `GET /2/threads/{threadIdOrSecretPath}`
- `GET /2/threads/{threadIdOrSecretPath}/html`
- `GET /2/threads/{threadIdOrSecretPath}/invited-members`
- `POST /1/threads/lock-edits`
- `POST /1/threads/lock-section-edits`
- `POST /1/threads/live-paste`
- `POST /1/threads/mark-as-moved-to-external`
- `GET /2/threads/{threadIdOrSecretPath}/members`
- `GET /2/threads/`
- `POST /1/threads/new-chat`
- `POST /1/threads/new-document`
- `GET /1/threads/recent`
- `POST /1/threads/remove-members`
- `GET /1/threads/search`

Common thread/folder parameters and identifiers visible in the reviewed spec/docs:
- `thread_id`
- `threadIdOrSecretPath`
- `folder_id_or_secret_path`
- `member_ids_by_access_level`
- `cursor`
- `limit`
- `expiring`

### Blob/file transfer (`2` routes)
- `GET /1/blob/{thread_id}/{blob_id}`
- `POST /1/blob/{thread_id}`

### Messages (`2` routes)
- `GET /1/messages/{thread_id}`
- `POST /1/messages/new`

### Folders (`8` routes)
- `POST /1/folders/add-members`
- `GET /1/folders/{id}`
- `GET /2/folders/{folderIdOrSecretPath}/link-sharing-settings`
- `PUT /2/folders/{folderIdOrSecretPath}/link-sharing-settings`
- `GET /1/folders/`
- `POST /1/folders/new`
- `POST /1/folders/remove-members`
- `POST /1/folders/update`

### Users (`8` routes)
- `GET /1/users/contacts`
- `GET /1/users/current`
- `GET /1/users/current/threads`
- `GET /1/users/current/threads-modified-after-usec`
- `GET /1/users/{id}`
- `GET /1/users/`
- `GET /1/users/read-only`
- `POST /1/users/update`

### Realtime/WebSocket bootstrap (`1` route)
- `GET /1/websockets/new`

## Verification note
This file was rebuilt manually from Quip's current first-party Automation API docs and current official Automation OAS file, not from the repo's earlier generated route stub.
