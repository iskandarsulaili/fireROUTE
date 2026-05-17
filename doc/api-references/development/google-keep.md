# Google Keep

## Provider metadata
- Category: `Development`
- Provider slug: `google-keep`
- Docs used manually:
  - `https://developers.google.com/workspace/keep/api/guides`
  - `https://developers.google.com/workspace/guides/auth-overview`
  - `https://developers.google.com/workspace/keep/api/reference/rest`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes/list`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes/create`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes/get`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes/delete`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes.permissions/batchCreate`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/notes.permissions/batchDelete`
  - `https://developers.google.com/workspace/keep/api/reference/rest/v1/media/download`
- Confirmed REST API base URL: `https://keep.googleapis.com`
- Discovery document listed by the docs: `https://keep.googleapis.com/$discovery/rest?version=v1`
- Primary media type: JSON
- Versioning note: reviewed REST surface is `v1`
- Manually confirmed routes in this pass: `7`

## Authentication
The reviewed Keep docs describe the API as a Google Workspace API and publish OAuth scope requirements on each method page.

Confirmed auth details from the official docs:
- use Google OAuth 2.0 / Google Workspace authorization as described in the Workspace auth overview
- send Bearer tokens to the API
- the Keep overview explicitly says enterprise integrations can use either:
  - domain-wide delegation using a service account
  - an OAuth client ID flow
- scopes explicitly listed on the reviewed Keep method pages:
  - `https://www.googleapis.com/auth/keep`
  - `https://www.googleapis.com/auth/keep.readonly`

## Common request/response conventions
- Base URL: `https://keep.googleapis.com`
- Google docs explicitly say these URLs use gRPC Transcoding syntax
- request and response bodies are JSON for note and permission operations
- pagination, where present, uses `pageSize` plus opaque `nextPageToken` / `pageToken`
- the API is positioned for enterprise Google Workspace note management, including note deletion, permission changes, and attachment retrieval

## Manually confirmed endpoint set

### 1) List notes
- Method: `GET`
- Path: `/v1/notes`
- Full URL: `https://keep.googleapis.com/v1/notes`
- Purpose: list notes visible to the caller
- Query parameters confirmed on the route page:
  - `pageSize` - maximum number of results to return; `0` lets the server choose the upper bound
  - `pageToken` - previous response's `nextPageToken`
  - `filter` - AIP-style filter; valid fields explicitly listed are `createTime`, `updateTime`, `trashTime`, and `trashed`
- Request body: empty
- Response body fields confirmed on the route page:
  - `notes[]` - array of `Note`
  - `nextPageToken` - token for the next page
- Important usage notes from the official page:
  - if no filter is supplied, the `trashed` filter is applied by default
  - results are returned page by page
  - the page explicitly says `notes.list` returns consistent results in the face of concurrent changes, or signals that it cannot with an `ABORTED` error
- Accepted scopes listed on the route page:
  - `keep`
  - `keep.readonly`

### 2) Create a note
- Method: `POST`
- Path: `/v1/notes`
- Full URL: `https://keep.googleapis.com/v1/notes`
- Purpose: create a new note
- Request body: `Note`
- Response body: created `Note`
- Important usage notes:
  - the route page describes this as creating a new note resource
- Accepted scopes listed on the route page:
  - `keep`

### 3) Get a note
- Method: `GET`
- Path: `/v1/{name=notes/*}`
- Full URL: `https://keep.googleapis.com/v1/{name=notes/*}`
- Purpose: fetch a single note
- Path parameters:
  - `name` - required note resource name
- Request body: empty
- Response body: `Note`
- Accepted scopes listed on the route page:
  - `keep`
  - `keep.readonly`

### 4) Delete a note
- Method: `DELETE`
- Path: `/v1/{name=notes/*}`
- Full URL: `https://keep.googleapis.com/v1/{name=notes/*}`
- Purpose: permanently delete a note
- Path parameters:
  - `name` - required note resource name to delete
- Request body: empty
- Response body: empty on success
- Important usage notes from the route page:
  - caller must have the `OWNER` role on the note
  - deletion removes the resource immediately and cannot be undone
  - collaborators lose access immediately
- Accepted scopes listed on the route page:
  - `keep`

### 5) Batch-create note permissions
- Method: `POST`
- Path: `/v1/{parent=notes/*}/permissions:batchCreate`
- Full URL: `https://keep.googleapis.com/v1/{parent=notes/*}/permissions:batchCreate`
- Purpose: create one or more permissions on a note
- Path parameters:
  - `parent` - shared parent note; format `notes/{note}`
- Request body fields confirmed on the route page:
  - `requests[]` - array of `CreatePermissionRequest`
- Nested `CreatePermissionRequest` fields confirmed on the page:
  - `parent` - required parent note; format `notes/{note}`
  - `permission` - required `Permission`
- Important usage notes from the official page:
  - only permissions with the `WRITER` role may be created
  - if any permission creation fails, the whole request fails and no changes are made
  - one of `Permission.email`, `User.email`, or `Group.email` must be supplied in the permission payload
- Response body fields confirmed on the route page:
  - `permissions[]` - permissions created
- Accepted scopes listed on the route page:
  - `keep`

### 6) Batch-delete note permissions
- Method: `POST`
- Path: `/v1/{parent=notes/*}/permissions:batchDelete`
- Full URL: `https://keep.googleapis.com/v1/{parent=notes/*}/permissions:batchDelete`
- Purpose: remove one or more permissions from a note
- Path parameters:
  - `parent` - shared parent note; format `notes/{note}`
- Request body fields confirmed on the route page:
  - `names[]` - required permission resource names; format `notes/{note}/permissions/{permission}`
- Response body: empty on success
- Important usage notes from the official page:
  - specified entities immediately lose access
  - an `OWNER` permission cannot be removed
  - if any permission removal fails, the whole request fails and no changes are made
  - the page explicitly says a non-existent permission produces `400 bad request`
- Accepted scopes listed on the route page:
  - `keep`

### 7) Download an attachment
- Method: `GET`
- Path: `/v1/{name=notes/*/attachments/*}`
- Full URL: `https://keep.googleapis.com/v1/{name=notes/*/attachments/*}`
- Purpose: retrieve an attachment resource / attachment media metadata for a note attachment
- Path parameters:
  - `name` - required attachment resource name
- Query parameters confirmed on the route page:
  - `mimeType` - requested IANA MIME type; must be one listed in `attachment.mime_type` when downloading attachment media
- Request body: empty
- Response body: `Attachment`
- Important usage notes from the official page:
  - REST media download requires `alt=media`
  - the page explicitly says a bad requested MIME type yields `400 bad request`
- Accepted scopes listed on the route page:
  - `keep`
  - `keep.readonly`

## Pagination
- `notes.list` is paginated with `pageSize`, `nextPageToken`, and `pageToken`
- the other six reviewed routes do not publish page-based pagination

## Rate limits
- no numeric per-minute or per-day quota table was surfaced on the reviewed Keep overview or route pages
- the Workspace auth overview and Keep docs point developers to Google Cloud project setup and API management, but the Keep pages reviewed here did not publish a Keep-specific limit table

## Error and response notes
- the reviewed Keep route pages mainly publish success schemas plus a handful of explicit error conditions
- explicitly documented error cases include:
  - `ABORTED` possibility on `notes.list` if the service cannot maintain consistent results across concurrent changes
  - `400 bad request` on `notes.permissions.batchDelete` when a named permission does not exist
  - `400 bad request` on `media.download` when media is unavailable in the requested MIME type
- delete and batch-delete success responses are empty
- list and mutation responses are JSON resources / envelopes such as `ListNotesResponse`, `Note`, `Attachment`, and permission arrays

## Important usage notes
- the Keep API is explicitly described by Google as an enterprise-oriented API for managing Keep content and remediating issues found by cloud security tooling
- the overview page explicitly highlights domain-wide delegation for service-account-based enterprise integrations
- note permission changes are all-or-nothing at the batch level
- note deletion is immediate and irreversible according to the official delete page
- attachment media retrieval over REST requires `alt=media` in addition to the documented route and MIME-type considerations

## Verification notes
This file was manually rebuilt from the official Google Keep overview, Google Workspace auth overview, and Keep REST reference pages using browser inspection.