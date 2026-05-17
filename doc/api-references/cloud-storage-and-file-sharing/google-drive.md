# Google Drive

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `google-drive`
- Docs used manually:
  - `https://developers.google.com/workspace/drive/api/reference/rest`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/create`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/delete`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/export`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/download`
  - `https://developers.google.com/workspace/drive/api/reference/rest/v3/files/watch`
  - `https://developers.google.com/workspace/drive/api/guides/api-specific-auth`
  - `https://developers.google.com/workspace/drive/api/guides/limits`
- Confirmed REST API base URL: `https://www.googleapis.com/drive/v3`
- Confirmed upload base URL: `https://www.googleapis.com/upload/drive/v3`
- Primary media type: JSON
- Authentication: OAuth 2.0 Bearer tokens with per-method Drive scopes
- Manually confirmed routes in this pass: `7`

## Authentication
From the official Google Drive auth guide and route pages:
- Google Drive API access is authorized with OAuth 2.0
- scopes must be configured in the Google Cloud OAuth consent screen and then explicitly requested by the application at runtime
- each method page lists acceptable scopes; the least-privilege pattern is emphasized by the auth guide
- the reviewed methods use Drive scopes such as:
  - `https://www.googleapis.com/auth/drive`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.readonly`
  - `https://www.googleapis.com/auth/drive.metadata.readonly`
  - `https://www.googleapis.com/auth/drive.appdata`
- the auth guide distinguishes non-sensitive, sensitive, and restricted scopes and notes that some restricted scopes require a security assessment

## Common request/response conventions
- Core REST base: `https://www.googleapis.com/drive/v3`
- Upload base: `https://www.googleapis.com/upload/drive/v3`
- the official reference says the URLs use gRPC transcoding syntax
- standard metadata methods return Google Drive `File`, `FileList`, `Channel`, or `Operation` resources as JSON
- upload-capable methods (`files.create`, `files.update`) expose separate `/upload` URIs
- upload methods support `uploadType` values:
  - `media`
  - `multipart`
  - `resumable`
- binary/export routes return bytes or an `Operation` resource instead of a normal metadata object
- several methods accept `supportsAllDrives=true` to indicate shared-drive compatibility

## Manually confirmed endpoint set

### 1) Create a file
- Method: `POST`
- Metadata path: `/files`
- Metadata URL: `https://www.googleapis.com/drive/v3/files`
- Upload path: `/files`
- Upload URL: `https://www.googleapis.com/upload/drive/v3/files`
- Purpose: create a Drive file with metadata only or with uploaded content
- Query parameters confirmed on the official page:
  - `enforceSingleParent` - deprecated
  - `ignoreDefaultVisibility`
  - `keepRevisionForever`
  - `ocrLanguage`
  - `supportsAllDrives`
  - `supportsTeamDrives` - deprecated
  - `uploadType` - required on `/upload` requests; `media`, `multipart`, or `resumable`
  - `useContentAsIndexableText`
  - `includePermissionsForView`
  - `includeLabels`
- Request body:
  - metadata body is a `File` resource
- Response:
  - returns a `File` resource
- Important usage notes from the official page:
  - maximum upload size is `5,120 GB`
  - accepted media MIME types are `*/*` in the sense that any valid MIME type may be uploaded
  - shortcut creation must use MIME type `application/vnd.google-apps.shortcut`
  - Google recommends including a file extension in `name` when inserting binary files

### 2) Get file metadata or file content
- Method: `GET`
- Path: `/files/{fileId}`
- Full URL: `https://www.googleapis.com/drive/v3/files/{fileId}`
- Purpose: fetch metadata by default, or blob content when `alt=media` is used
- Path parameters:
  - `fileId` - file identifier
- Query parameters confirmed on the official page:
  - `acknowledgeAbuse`
  - `supportsAllDrives`
  - `supportsTeamDrives` - deprecated
  - `includePermissionsForView`
  - `includeLabels`
- Response:
  - returns a `File` resource when retrieving metadata
- Important usage notes from the official page:
  - `alt=media` returns file bytes in the response body for files stored directly in Drive
  - Google Workspace documents should be downloaded with `files.export`, not `files.get?alt=media`
  - `acknowledgeAbuse` only applies to abusive-malware downloads under the conditions described on the method page

### 3) List files
- Method: `GET`
- Path: `/files`
- Full URL: `https://www.googleapis.com/drive/v3/files`
- Purpose: list files visible to the caller
- Query parameters confirmed on the official page:
  - `corpora`
  - `corpus` - deprecated
  - `driveId`
  - `includeItemsFromAllDrives`
  - `includeTeamDriveItems` - deprecated
  - `orderBy`
  - `pageSize`
  - `pageToken`
  - `q`
  - `spaces`
  - `supportsAllDrives`
  - `supportsTeamDrives` - deprecated
  - `teamDriveId` - deprecated
  - `includePermissionsForView`
  - `includeLabels`
- Response fields explicitly documented:
  - `files[]`
  - `nextPageToken`
  - `kind` - fixed string `drive#fileList`
  - `incompleteSearch`
- Important usage notes from the official page:
  - trashed files are included by default; use `trashed=false` in `q` if you do not want them
  - default page sizing differs between shared-drive and non-shared-drive scenarios
  - `pageSize` max is `100`; higher values are coerced down to `100`
  - Google prefers `user` or `drive` corpora over `allDrives` for efficiency

### 4) Update file metadata, media, or both
- Method: `PATCH`
- Metadata path: `/files/{fileId}`
- Metadata URL: `https://www.googleapis.com/drive/v3/files/{fileId}`
- Upload URL: `https://www.googleapis.com/upload/drive/v3/files/{fileId}`
- Purpose: patch file metadata, file content, or both
- Path parameters:
  - `fileId` - file identifier
- Query parameters confirmed on the official page:
  - `addParents`
  - `enforceSingleParent` - deprecated
  - `keepRevisionForever`
  - `ocrLanguage`
  - `removeParents`
  - `supportsAllDrives`
  - `supportsTeamDrives` - deprecated
  - `uploadType`
  - `useContentAsIndexableText`
  - `includePermissionsForView`
  - `includeLabels`
- Request body:
  - partial metadata body is a `File` resource
- Response:
  - returns a `File` resource
- Important usage notes from the official page:
  - this method uses patch semantics; only send fields you want to modify
  - file uploads follow the same `media` / `multipart` / `resumable` choices as create
  - the same `5,120 GB` upload limit applies

### 5) Permanently delete a file
- Method: `DELETE`
- Path: `/files/{fileId}`
- Full URL: `https://www.googleapis.com/drive/v3/files/{fileId}`
- Purpose: permanently delete a user-owned file instead of moving it to trash
- Path parameters:
  - `fileId` - file identifier
- Query parameters confirmed on the official page:
  - `supportsAllDrives`
  - `supportsTeamDrives` - deprecated
  - `enforceSingleParent` - deprecated
- Response:
  - successful responses return an empty JSON object
- Important usage notes from the official page:
  - for shared-drive items, the caller must be an organizer on the parent folder
  - deleting a folder also deletes descendants owned by the user

### 6) Export a Google Workspace document
- Method: `GET`
- Path: `/files/{fileId}/export`
- Full URL: `https://www.googleapis.com/drive/v3/files/{fileId}/export`
- Purpose: export Docs/Sheets/Slides-style Google Workspace content to another MIME type
- Path parameters:
  - `fileId` - source Google Workspace file id
- Query parameters confirmed on the official page:
  - `mimeType` - required export target MIME type
- Response:
  - returns file bytes in the requested export format
- Important usage notes from the official page:
  - exported content is limited to `10 MB`
  - supported output formats are defined in the separate official Export MIME Types page

### 7) Start a download operation
- Method: `POST`
- Path: `/files/{fileId}/download`
- Full URL: `https://www.googleapis.com/drive/v3/files/{fileId}/download`
- Purpose: begin a file-download operation
- Path parameters:
  - `fileId` - required file id
- Query parameters confirmed on the official page:
  - `mimeType` - optional target MIME type for Google Workspace docs; default MIME type may change in the future
  - `revisionId` - optional revision id for blob files, Google Docs, and Google Sheets when supported
- Response:
  - returns an `Operation` resource
- Important usage notes from the official page:
  - operations created by this route remain valid for `24 hours` from creation time
  - `revisionId` returns `INVALID_ARGUMENT` if revision-specific download is unsupported for the target file

## Pagination
From the official `files.list` page:
- pagination is token-based
- request parameter:
  - `pageToken` - continue from the previous page
- response field:
  - `nextPageToken` - absent when the end of the listing is reached
- Google notes that `nextPageToken` is typically valid for several hours
- if a page token is rejected, clients should discard it and restart pagination from the first page

## Rate limits
From the official Google Drive usage-limits page:
- quotas are measured in quota units
- enforced limits reviewed on the official page:
  - per minute per project: `1,000,000 quota units`
  - per minute per user per project: `325,000 quota units`
  - per day per project egress limit before charges apply: `1 TB`
- the same page also documents a daily billing threshold of `400,000,000 quota units` per project
- quota overages may produce:
  - `403 User rate limit exceeded`
  - backend `429 Rate limit exceeded`
- the official guidance is to use exponential backoff and retry later
- the page notes a quota-model update effective `2026-05-01`; older projects may temporarily retain previous settings

## Error and response notes
From the reviewed official pages:
- the usage-limits page explicitly documents `403` and `429` for quota/rate-limit failures
- `files.download` documents `INVALID_ARGUMENT` when `revisionId` is used on unsupported file types or scenarios
- the reviewed method pages focus more on route-specific parameters and scopes than on a single Drive-wide error-schema table
- response bodies vary by route:
  - `File` for metadata-centric methods
  - `FileList` for list operations
  - raw bytes for export
  - `Operation` for the reviewed download-operation route
  - empty JSON object for delete

## Important usage notes
- use `files.get?alt=media` only for content actually stored in Drive; use `files.export` for Google Workspace-native documents
- `files.list` returns trashed files unless the query explicitly excludes them
- several shared-drive flags and team-drive flags are in transition; the reviewed pages repeatedly mark `supportsTeamDrives`, `teamDriveId`, and similar fields as deprecated in favor of `supportsAllDrives` or newer alternatives
- Google's auth guide recommends choosing the smallest scope set that satisfies the task, especially because some Drive scopes are restricted
- upload methods support resumable upload flows and are the correct choice for large media transfers

## Verification notes
This file was manually rebuilt from the official Google Drive REST reference, auth guide, and usage-limits page using browser inspection.