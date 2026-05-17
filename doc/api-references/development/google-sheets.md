# Google Sheets

## Provider metadata
- Category: `Development`
- Provider slug: `google-sheets`
- Docs used manually:
  - `https://developers.google.com/workspace/sheets/api/reference/rest`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/get`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/create`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update`
  - `https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append`
  - `https://developers.google.com/workspace/sheets/api/scopes`
  - `https://developers.google.com/workspace/sheets/api/limits`
- Confirmed REST API base URL: `https://sheets.googleapis.com`
- Discovery document listed by the docs: `https://sheets.googleapis.com/$discovery/rest?version=v4`
- Primary media type: JSON
- Versioning note: the reviewed REST surface is `v4`
- Manually confirmed routes in this pass: `5`

## Authentication
The official Sheets docs point to Google OAuth 2.0 authorization and publish Sheets-specific scopes.

Confirmed auth details from the official docs:
- send OAuth 2.0 Bearer tokens in `Authorization: Bearer <token>`
- the API is scope-driven rather than API-key-driven for the reviewed spreadsheet operations
- reviewed Sheets-specific scope page lists:
  - `https://www.googleapis.com/auth/spreadsheets` - sensitive
  - `https://www.googleapis.com/auth/spreadsheets.readonly` - sensitive
  - `https://www.googleapis.com/auth/drive.file` - recommended, non-sensitive, per-file access
  - `https://www.googleapis.com/auth/drive` - restricted
  - `https://www.googleapis.com/auth/drive.readonly` - restricted
- route pages list the exact acceptable scopes per method

## Common request/response conventions
- Base URL: `https://sheets.googleapis.com`
- Paths are relative to the base and use Google-style gRPC transcoding syntax
- Request and response bodies are JSON
- many write endpoints accept typed resource bodies such as `Spreadsheet`, `ValueRange`, `Request[]`, and return typed resources such as `Spreadsheet` or `UpdateValuesResponse`
- Google field masks can affect returned payloads on some read methods

## Manually confirmed endpoint set

### 1) Get a spreadsheet
- Method: `GET`
- Path: `/v4/spreadsheets/{spreadsheetId}`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}`
- Purpose: retrieve spreadsheet metadata and optionally grid data
- Path parameters:
  - `spreadsheetId` - required spreadsheet ID
- Query parameters confirmed on the route page:
  - `ranges[]` - optional A1 ranges to limit the returned subset
  - `includeGridData` - optional boolean; ignored if a field mask is set
  - `excludeTablesInBandedRanges` - optional boolean
- Important usage notes from the route page:
  - by default, grid data is not returned
  - use `fields` or `ranges[]` to keep large responses small
  - ranges can target other sheets via A1 notation like `Sheet2!A1:C4`
- Response body: `Spreadsheet`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.readonly`
  - `drive.file`
  - `spreadsheets`
  - `spreadsheets.readonly`

### 2) Create a spreadsheet
- Method: `POST`
- Path: `/v4/spreadsheets`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets`
- Purpose: create a new spreadsheet
- Request body: `Spreadsheet`
- Response body: newly created `Spreadsheet`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `spreadsheets`

### 3) Batch update spreadsheet structure/content
- Method: `POST`
- Path: `/v4/spreadsheets/{spreadsheetId}:batchUpdate`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}:batchUpdate`
- Purpose: apply one or more structural or formatting updates atomically
- Path parameters:
  - `spreadsheetId` - required spreadsheet ID
- Request body fields confirmed on the route page:
  - `requests[]` - ordered list of `Request` operations
  - `includeSpreadsheetInResponse` - optional boolean
  - `responseRanges[]` - optional returned-range limiter when including spreadsheet in response
  - `responseIncludeGridData` - optional boolean; ignored if a field mask is set
- Response body fields confirmed on the route page:
  - `spreadsheetId`
  - `replies[]`
  - `updatedSpreadsheet`
- Important usage notes from the route page:
  - every subrequest is validated before any update is applied
  - if any subrequest is invalid, the entire batch fails and nothing is applied
  - replies mirror request order, with empty reply slots for request types that do not return data
  - updates are applied atomically, though concurrent collaborators may still alter the final visible sheet state afterward
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.file`
  - `spreadsheets`

### 4) Read values from a range
- Method: `GET`
- Path: `/v4/spreadsheets/{spreadsheetId}/values/{range}`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`
- Purpose: retrieve tabular values from one range
- Path parameters:
  - `spreadsheetId` - required
  - `range` - required A1 or R1C1 notation
- Query parameters confirmed on the route page:
  - `majorDimension` - `ROWS` or `COLUMNS`
  - `valueRenderOption`
  - `dateTimeRenderOption`
- Response body: `ValueRange`
- Accepted scopes listed on the route page:
  - `drive`
  - `drive.readonly`
  - `drive.file`
  - `spreadsheets`
  - `spreadsheets.readonly`

### 5) Write or append values
Two closely related value-write routes were manually checked.

#### 5a) Update a range in place
- Method: `PUT`
- Path: `/v4/spreadsheets/{spreadsheetId}/values/{range}`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`
- Required path parameters:
  - `spreadsheetId`
  - `range`
- Query parameters confirmed on the route page:
  - `valueInputOption` - required semantic mode for interpreting input
  - `includeValuesInResponse`
  - `responseValueRenderOption`
  - `responseDateTimeRenderOption`
- Request body: `ValueRange`
- Response body: `UpdateValuesResponse`

#### 5b) Append values after a logical table
- Method: `POST`
- Path: `/v4/spreadsheets/{spreadsheetId}/values/{range}:append`
- Full URL: `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append`
- Required path parameters:
  - `spreadsheetId`
  - `range` - A1 range used to find the logical table
- Query parameters confirmed on the route page:
  - `valueInputOption` - required
  - `insertDataOption`
  - `includeValuesInResponse`
  - `responseValueRenderOption`
  - `responseDateTimeRenderOption`
- Request body: `ValueRange`
- Response body fields confirmed on the route page:
  - `spreadsheetId`
  - `tableRange`
  - `updates`
- Important usage note from the route page:
  - `valueInputOption` changes how input is interpreted, not where writing begins
- Accepted scopes for both value-write routes:
  - `drive`
  - `drive.file`
  - `spreadsheets`

## Pagination
- none of the five reviewed Sheets routes document response pagination
- the broader API can return subsets by `ranges[]` or field masks, but not cursor/page pagination for these methods

## Rate limits
From the official Sheets usage limits page:
- quotas are per-minute and refill every minute
- recommended maximum payload size: about `2 MB`
- read requests:
  - `300` per minute per project
  - `60` per minute per user per project
- write requests:
  - `300` per minute per project
  - `60` per minute per user per project
- exceeding quota can return `429 Too many requests`
- the docs recommend exponential backoff after quota errors

## Error and response notes
- the reviewed Sheets route pages focus on success schemas and scope requirements rather than publishing per-route error body schemas
- official usage-limit docs explicitly confirm `429 Too many requests`
- the official docs also note that oversized or invalid update batches can fail atomically at validation time
- responses for the reviewed endpoints are standard Google JSON resources such as `Spreadsheet`, `ValueRange`, and `UpdateValuesResponse`

## Important usage notes
- `includeGridData` is ignored when a field mask is set on `spreadsheets.get`
- large spreadsheets should be queried with `ranges[]` and/or field masks rather than fetching the full document
- `spreadsheets.batchUpdate` is all-or-nothing for the submitted request array
- appending values uses logical-table detection and may return the pre-append `tableRange`
- the scope page explicitly recommends `drive.file` where possible to minimize granted access

## Verification notes
This file was manually rebuilt from the official Google Sheets REST reference, Sheets scope guide, and Sheets usage-limits page with browser inspection.