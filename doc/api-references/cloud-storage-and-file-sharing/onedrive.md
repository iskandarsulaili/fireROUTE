# OneDrive

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `onedrive`
- Official docs used manually:
  - `https://developer.microsoft.com/en-us/onedrive`
  - `https://learn.microsoft.com/en-us/graph/api/drive-get?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/auth/auth-concepts`
  - `https://learn.microsoft.com/en-us/graph/paging`
  - `https://learn.microsoft.com/en-us/graph/throttling`
  - `https://learn.microsoft.com/en-us/graph/errors`
- Confirmed API base URL: `https://graph.microsoft.com/v1.0`
- Primary response formats: JSON metadata and file-content redirects/download streams
- Authentication: Microsoft identity platform OAuth 2.0 access tokens sent as `Authorization: Bearer <access-token>`
- Manually confirmed routes in this pass: `11`

## Authentication and access model
From the reviewed Microsoft Graph auth and route pages:
- OneDrive's HTTP API surface is exposed through Microsoft Graph, not a standalone OneDrive-only host.
- Apps must be registered with the Microsoft identity platform before calling the API.
- Access is token-based OAuth 2.0 using Bearer tokens.
- Permissions vary by route and by delegated vs application access.
- On the reviewed pages:
  - read routes such as drive lookup, list-children, and download use `Files.Read` as the least-privileged delegated permission
  - create-upload-session uses `Files.ReadWrite` as the least-privileged delegated permission
  - `GET /me/drive` does not support application permissions on the reviewed page

## Confirmed API surface

### 1) Get the signed-in user's drive
- Method: `GET`
- Path: `/me/drive`
- Purpose: retrieve the current user's OneDrive metadata
- Documented notes:
  - automatically provisions the user's drive when delegated auth is used and the user has a OneDrive license but no drive yet
  - supports `$select`

### 2) Get a user's drive by user identifier
- Method: `GET`
- Path: `/users/{idOrUserPrincipalName}/drive`
- Required path parameter:
  - `idOrUserPrincipalName` - required user identifier for the drive owner
- Purpose: retrieve a specific user's OneDrive or OneDrive for Business drive

### 3) Get the default document library for a group
- Method: `GET`
- Path: `/groups/{groupId}/drive`
- Required path parameter:
  - `groupId` - required group identifier
- Purpose: retrieve the drive/document library associated with a Microsoft 365 group

### 4) Get the default document library for a site
- Method: `GET`
- Path: `/sites/{siteId}/drive`
- Required path parameter:
  - `siteId` - required site identifier
- Purpose: retrieve the site's default document library

### 5) Get a drive directly by drive ID
- Method: `GET`
- Path: `/drives/{driveId}`
- Required path parameter:
  - `driveId` - required drive identifier
- Purpose: retrieve a drive when its unique ID is already known

### 6) List children of a known drive item
- Method: `GET`
- Path: `/drives/{drive-id}/items/{item-id}/children`
- Required path parameters:
  - `drive-id`
  - `item-id`
- Purpose: list child `driveItem` resources under a folder-like item
- Supported query parameters explicitly documented on the route page:
  - `$expand`
  - `$select`
  - `$skipToken`
  - `$top`
  - `$orderby`
- Important header note:
  - `If-None-Match` can return `304 Not Modified` when the current eTag/cTag matches

### 7) List children in the current user's drive root
- Method: `GET`
- Path: `/me/drive/root/children`
- Purpose: list the contents of the signed-in user's drive root folder
- Important note:
  - documented as the root-specific convenience form of the children relationship

### 8) List children by path relative to the drive root
- Method: `GET`
- Path: `/drives/{drive-id}/root:/{path-relative-to-root}:/children`
- Required path parameters:
  - `drive-id`
  - `path-relative-to-root`
- Purpose: list children without needing the item's ID first

### 9) Download file content
- Method: `GET`
- Path: `/me/drive/items/{item-id}/content`
- Required path parameter:
  - `item-id`
- Purpose: download the primary stream of a file-backed `driveItem`
- Important usage notes from the reviewed page:
  - only `driveItem` resources with the `file` facet can be downloaded
  - the API returns `302 Found` to a preauthenticated download URL
  - clients should follow the `Location` header to fetch the actual bytes
  - `If-None-Match` can return `304 Not Modified`

### 10) Create an upload session for a new file
- Method: `POST`
- Path: `/me/drive/items/{parentItemId}:/{fileName}:/createUploadSession`
- Required path parameters:
  - `parentItemId`
  - `fileName`
- Purpose: start a resumable upload for creating a new file under a parent item
- Request-body notes explicitly documented:
  - no body is required, but the request may include an `item` object
  - reviewed page explicitly documents `@microsoft.graph.conflictBehavior` with values `fail`, `replace`, or `rename`
  - reviewed page also documents an optional `description` field
- Header notes:
  - `If-Match` and `If-None-Match` can enforce preconditions and trigger `412 Precondition Failed`

### 11) Create an upload session for an existing file
- Method: `POST`
- Path: `/me/drive/items/{itemId}/createUploadSession`
- Required path parameter:
  - `itemId`
- Purpose: start a resumable upload session that updates an existing file
- Important usage notes from the reviewed page:
  - upload sessions are designed for sequential byte-range uploads
  - the upload can resume if the connection drops
  - the follow-up byte upload is sent to the opaque `uploadUrl` returned by this route, not back to the normal Graph REST path

## Pagination
From the reviewed list-children and Graph paging documentation:
- Microsoft Graph uses both server-side and client-side paging depending on the API
- when another page is available, Graph returns an `@odata.nextLink` URL in the response
- the reviewed children route explicitly supports `$skipToken` and `$top`
- clients should keep following `@odata.nextLink` until it is no longer present

## Rate limits and throttling
From the reviewed Microsoft Graph throttling guidance:
- Microsoft Graph does not publish one fixed universal numeric quota for these routes
- throttling varies by scenario and request type
- when throttled, Graph returns `429 Too Many Requests`
- Graph returns a suggested wait time in the response headers
- write-heavy workloads are more likely to be throttled than read-heavy workloads

## Error and format notes
From the reviewed Microsoft Graph error guidance and route pages:
- Microsoft Graph returns standard HTTP status codes with a JSON error object for API failures
- explicitly documented common statuses include `400`, `401`, `403`, `404`, `405`, `409`, `410`, `411`, `412`, `413`, `415`, and `429`
- `409 Conflict` can occur when the requested state conflicts with the current resource state
- `412 Precondition Failed` is especially relevant for `If-Match` / `If-None-Match` guarded calls
- list and metadata routes return JSON
- download uses a redirect to file bytes rather than returning the full file inline as JSON

## fireROUTE notes
- Treat OneDrive as a Microsoft Graph provider surface rooted at `https://graph.microsoft.com/v1.0`.
- Route authorization is permission-sensitive; adapters should preserve delegated/application distinctions instead of assuming one token type works everywhere.
- File download and resumable upload are special cases:
  - download pivots to a preauthenticated URL after the initial Graph request
  - resumable upload pivots to the returned `uploadUrl`
- The reviewed route pages expose multiple equivalent resource-scope variants (`/drives`, `/users`, `/groups`, `/sites`, `/me`). fireROUTE should normalize those carefully rather than treating them as unrelated APIs.

## Verification notes
This file was manually rebuilt after reviewing the live official Microsoft OneDrive and Microsoft Graph documentation in the browser.