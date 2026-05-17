# Google Slides

## Provider metadata
- Category: `Development`
- Provider slug: `google-slides`
- Docs used manually:
  - `https://developers.google.com/workspace/slides/api/reference/rest`
  - `https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/create`
  - `https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/get`
  - `https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/batchUpdate`
  - `https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations.pages/get`
  - `https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations.pages/getThumbnail`
  - `https://developers.google.com/workspace/slides/api/limits`
  - `https://developers.google.com/workspace/guides/auth-overview`
- Confirmed REST API base URL: `https://slides.googleapis.com`
- Discovery document listed by the docs: `https://slides.googleapis.com/$discovery/rest?version=v1`
- Primary media type: JSON
- Versioning note: reviewed REST surface is `v1`
- Manually confirmed routes in this pass: `5`

## Authentication
The reviewed Slides pages publish OAuth scope requirements on each method page, and the Google Workspace auth overview covers Google Workspace API authentication setup.

Confirmed auth details from the official docs:
- use Google OAuth 2.0 / Google Workspace authorization with Bearer tokens
- enable the Slides API in a Google Cloud project and create credentials through the Workspace auth setup flow
- scopes explicitly listed on the reviewed Slides method pages include:
  - `https://www.googleapis.com/auth/presentations`
  - `https://www.googleapis.com/auth/presentations.readonly`
  - `https://www.googleapis.com/auth/drive`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.readonly`
- the reviewed `presentations.batchUpdate` page also explicitly lists spreadsheet scopes:
  - `https://www.googleapis.com/auth/spreadsheets`
  - `https://www.googleapis.com/auth/spreadsheets.readonly`

## Common request/response conventions
- Base URL: `https://slides.googleapis.com`
- Google docs explicitly state these routes use gRPC Transcoding syntax
- request and response bodies are JSON
- the reviewed routes return typed resources such as `Presentation`, `Page`, `ThumbnailProperties`, and batch reply envelopes
- route pages publish OAuth scopes directly on each method page instead of relying on a single route-agnostic scope table

## Manually confirmed endpoint set

### 1) Create a presentation
- Method: `POST`
- Path: `/v1/presentations`
- Full URL: `https://slides.googleapis.com/v1/presentations`
- Purpose: create a blank presentation
- Request body fields confirmed on the route page:
  - `presentationId`
  - `pageSize`
  - `slides[]`
  - `title`
  - `masters[]`
  - `layouts[]`
  - `locale`
  - `revisionId`
  - `notesMaster`
- Response body: created `Presentation`
- Important usage notes from the official page:
  - if `presentationId` is provided, Google uses it as the new presentation ID; otherwise one is generated
  - the page explicitly says other provided fields, including content, are ignored and a blank presentation is created from the title
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `presentations`

### 2) Get a presentation
- Method: `GET`
- Path: `/v1/presentations/{presentationId}`
- Full URL: `https://slides.googleapis.com/v1/presentations/{presentationId}`
- Purpose: retrieve the latest version of a presentation
- Path parameters:
  - `presentationId` - required presentation ID
- Request body: empty
- Response body: `Presentation`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `drive.readonly`
  - `presentations`
  - `presentations.readonly`

### 3) Batch update a presentation
- Method: `POST`
- Path: `/v1/presentations/{presentationId}:batchUpdate`
- Full URL: `https://slides.googleapis.com/v1/presentations/{presentationId}:batchUpdate`
- Purpose: apply one or more updates to a presentation atomically
- Path parameters:
  - `presentationId` - presentation to update
- Request body fields confirmed on the route page:
  - `requests[]` - ordered list of `Request` objects
  - `writeControl` - optional concurrency control
- Response body fields confirmed on the route page:
  - `presentationId`
  - `replies[]`
  - `writeControl`
- `WriteControl` fields confirmed on the route page:
  - `requiredRevisionId`
- Important usage notes from the official page:
  - every request is validated before any are applied
  - if one request is invalid, the whole batch fails and nothing is applied
  - replies map 1:1 with request order, but some replies are empty
  - updates are applied atomically, though collaborator edits can still affect the final visible state
  - if `requiredRevisionId` does not match the current presentation revision, the request is rejected with `400 bad request`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `drive.readonly`
  - `presentations`
  - `spreadsheets`
  - `spreadsheets.readonly`

### 4) Get a page from a presentation
- Method: `GET`
- Path: `/v1/presentations/{presentationId}/pages/{pageObjectId}`
- Full URL: `https://slides.googleapis.com/v1/presentations/{presentationId}/pages/{pageObjectId}`
- Purpose: retrieve the latest version of a specific page / slide object
- Path parameters:
  - `presentationId` - presentation ID
  - `pageObjectId` - object ID of the page to retrieve
- Request body: empty
- Response body: `Page`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `drive.readonly`
  - `presentations`
  - `presentations.readonly`

### 5) Generate a page thumbnail
- Method: `GET`
- Path: `/v1/presentations/{presentationId}/pages/{pageObjectId}/thumbnail`
- Full URL: `https://slides.googleapis.com/v1/presentations/{presentationId}/pages/{pageObjectId}/thumbnail`
- Purpose: generate a thumbnail URL for the latest version of a page
- Path parameters:
  - `presentationId` - presentation ID
  - `pageObjectId` - page object ID
- Query/body shape confirmed on the route page:
  - the request exposes `thumbnailProperties` of type `GetPageThumbnailRequest`
  - nested fields documented for that request object:
    - `mimeType` - optional enum; defaults to `PNG`
    - `thumbnailSize` - optional enum; server chooses a default if omitted
- Enum values explicitly shown on the page:
  - `mimeType`: `PNG`
  - `thumbnailSize`: `THUMBNAIL_SIZE_UNSPECIFIED`, `LARGE`, `MEDIUM`, `SMALL`
- Response body fields confirmed on the route page:
  - `width`
  - `height`
  - `contentUrl`
- Important usage notes from the official page:
  - this request counts as an `expensive read request` for quota purposes
  - `contentUrl` has a default lifetime of 30 minutes
  - the returned URL is tagged with the requester's account and access can be lost if sharing settings change
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `drive.readonly`
  - `presentations`
  - `presentations.readonly`

## Pagination
- none of the five reviewed Slides routes publish page-based pagination

## Rate limits
From the official Slides usage-limits page:
- quota overruns generally return `429 Too many requests`
- there is no daily request cap if you remain within the documented per-minute quotas
- read requests:
  - `3000` per minute per project
  - `600` per minute per user per project
- expensive read requests (explicitly used for `presentations.pages.getThumbnail`):
  - `300` per minute per project
  - `60` per minute per user per project
- write requests:
  - `600` per minute per project
  - `60` per minute per user per project
- Google recommends truncated exponential backoff for time-based quota errors

## Error and response notes
- the reviewed Slides route pages primarily publish success schemas plus selected operational error notes
- explicitly documented error behavior includes:
  - `429 Too many requests` for quota exceedance on the usage-limits page
  - `400 bad request` from `presentations.batchUpdate` when `requiredRevisionId` does not match the current revision
  - `presentations.batchUpdate` fails the entire batch if any included request is invalid
- `getThumbnail` returns a JSON object containing a temporary `contentUrl`, not the image bytes directly
- successful responses are JSON resources such as `Presentation`, `Page`, or the thumbnail metadata object

## Important usage notes
- the Slides create route creates a blank presentation and ignores extra content fields supplied at creation time
- the Slides reference only surfaced five concrete REST methods in the reviewed resource tree: create, get, batchUpdate, page get, and page thumbnail
- batch updates are atomic at the request-list level
- thumbnail generation is quota-expensive compared with ordinary reads
- revision IDs are treated opaquely and are used for optimistic concurrency checks in batch updates

## Verification notes
This file was manually rebuilt from the official Google Slides REST reference, Slides usage-limits page, and Google Workspace auth overview using browser inspection.