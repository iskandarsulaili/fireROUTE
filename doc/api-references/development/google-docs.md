# Google Docs

## Provider metadata
- Category: `Development`
- Provider slug: `google-docs`
- Docs used manually:
  - `https://developers.google.com/workspace/docs/api/reference/rest`
  - `https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get`
  - `https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/create`
  - `https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate`
  - `https://developers.google.com/workspace/docs/api/auth`
  - `https://developers.google.com/workspace/docs/api/limits`
- Confirmed REST API base URL: `https://docs.googleapis.com`
- Discovery document listed by the docs: `https://docs.googleapis.com/$discovery/rest?version=v1`
- Primary media type: JSON
- Versioning note: the reviewed Docs REST surface is `v1`
- Manually confirmed routes in this pass: `3`

## Authentication
The official Docs API auth guide uses Google OAuth 2.0 and publishes Docs-specific scopes.

Confirmed auth details from the official docs:
- send OAuth 2.0 Bearer tokens in `Authorization: Bearer <token>`
- the docs scope guide lists:
  - `https://www.googleapis.com/auth/documents` - sensitive
  - `https://www.googleapis.com/auth/documents.readonly` - sensitive
  - `https://www.googleapis.com/auth/drive.file` - recommended, non-sensitive
  - `https://www.googleapis.com/auth/drive` - restricted
  - `https://www.googleapis.com/auth/drive.readonly` - restricted
- each reviewed method page lists its accepted scopes explicitly

## Common request/response conventions
- Base URL: `https://docs.googleapis.com`
- Paths use Google gRPC transcoding syntax
- JSON request and response bodies are used throughout the reviewed methods
- document content and metadata are returned as a `Document` resource
- write operations use typed `Request[]` items and can carry `WriteControl`

## Manually confirmed endpoint set

### 1) Retrieve a document
- Method: `GET`
- Path: `/v1/documents/{documentId}`
- Full URL: `https://docs.googleapis.com/v1/documents/{documentId}`
- Purpose: fetch the latest version of a Google Doc
- Path parameters:
  - `documentId` - required document ID
- Query parameters confirmed on the route page:
  - `suggestionsViewMode` - how to render suggestions
  - `includeTabsContent` - whether content is populated in `Document.tabs` instead of top-level content fields
- Response body: `Document`
- Important usage notes from the route page:
  - when `includeTabsContent=true`, content is populated in `Document.tabs`
  - when `includeTabsContent=false`, the first tab's content populates top-level document content fields
- Accepted scopes listed on the route page:
  - `documents`
  - `documents.readonly`
  - `drive`
  - `drive.readonly`
  - `drive.file`

### 2) Create a blank document
- Method: `POST`
- Path: `/v1/documents`
- Full URL: `https://docs.googleapis.com/v1/documents`
- Purpose: create a new Google Doc
- Request body notes from the route page:
  - the route accepts a `Document`-shaped body
  - `title` is meaningful for creation
  - the page explicitly states that other provided fields, including content, are ignored during creation
- Response body: created `Document`
- Important response fields visible on the route page include:
  - `documentId` - output only
  - `title`
  - `tabs[]`
  - `revisionId` - output only when the user has edit access
- Accepted scopes listed on the route page:
  - `documents`
  - `drive`
  - `drive.file`

### 3) Batch update a document
- Method: `POST`
- Path: `/v1/documents/{documentId}:batchUpdate`
- Full URL: `https://docs.googleapis.com/v1/documents/{documentId}:batchUpdate`
- Purpose: apply one or more document mutations atomically
- Path parameters:
  - `documentId` - required document ID
- Request body fields confirmed on the route page:
  - `requests[]` - ordered document update requests
  - `writeControl` - optional concurrency control object
- Response body fields confirmed on the route page:
  - `documentId`
  - `replies[]`
  - `writeControl`
- Important usage notes from the route page:
  - all requests are validated before any write is applied
  - if one request is invalid, the whole batch fails and nothing is applied
  - replies map 1:1 to request order, with empty reply entries for request types that do not emit data
  - updates are applied atomically, but concurrent collaborators may still affect the final visible document state afterward
- `WriteControl` fields confirmed on the route page:
  - `requiredRevisionId`
  - `targetRevisionId`
- Accepted scopes listed on the route page:
  - `documents`
  - `drive`
  - `drive.file`

## Pagination
- none of the three reviewed Docs routes publish cursor- or page-based pagination

## Rate limits
From the official Docs usage-limits page:
- quota overruns generally return `429 Too many requests`
- read requests:
  - `3000` per minute per project
  - `300` per minute per user per project
- write requests:
  - `600` per minute per project
  - `60` per minute per user per project
- the docs recommend truncated exponential backoff for time-based quota errors

## Error and response notes
- the reviewed Docs route pages primarily publish success schemas and scope requirements rather than a full error-body model
- the official usage-limits page explicitly documents `429 Too many requests`
- `documents.batchUpdate` can fail the entire batch at validation time if any included request is invalid
- success bodies are JSON resources such as `Document` or the structured batch-update response with `replies[]`

## Important usage notes
- `documents.create` creates a blank document even if extra content fields are provided in the request body
- `documents.get` can switch between top-level content fields and `Document.tabs` using `includeTabsContent`
- `documents.batchUpdate` is the main high-power mutation route and is atomic across its submitted request list
- the auth guide explicitly recommends narrowly scoped access and highlights `drive.file` as the preferred non-sensitive choice where applicable

## Verification notes
This file was manually rebuilt from the official Google Docs REST reference, Docs auth guide, and Docs usage-limits page with browser inspection.