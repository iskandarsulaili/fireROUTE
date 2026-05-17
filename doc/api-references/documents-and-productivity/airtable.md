# Airtable

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `airtable`
- Docs used manually:
  - `https://airtable.com/developers/web/api/introduction`
  - `https://airtable.com/developers/web/api/authentication`
  - `https://airtable.com/developers/web/api/errors`
  - `https://airtable.com/developers/web/api/rate-limits`
  - `https://airtable.com/developers/web/api/list-records`
  - `https://airtable.com/developers/web/api/get-record`
  - `https://airtable.com/developers/web/api/create-records`
  - `https://airtable.com/developers/web/api/update-multiple-records`
  - `https://airtable.com/developers/web/api/delete-multiple-records`
  - `https://airtable.com/developers/web/api/upload-attachment`
- Confirmed base URLs:
  - `https://api.airtable.com/v0`
  - `https://content.airtable.com/v0`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: bearer token auth using personal access tokens or OAuth access tokens
- Manually confirmed routes in this pass: `7`

## Authentication
- Airtable's official auth guide says the Web API uses token-based authentication via the HTTP `Authorization: Bearer {token}` header.
- Supported token types confirmed by the docs:
  - personal access tokens
  - OAuth access tokens
- The docs explicitly say legacy `api_key` URL-parameter auth is no longer supported.
- All API requests must be authenticated and sent over HTTPS.
- Token access is constrained by both:
  - scopes
  - resource access to specific bases/workspaces
- The docs note that as of February 1, 2024, old Airtable API keys are fully deprecated.

## Common request/response conventions
- Standard record API base URL: `https://api.airtable.com/v0`
- Attachment-upload base URL: `https://content.airtable.com/v0`
- Airtable uses REST-style JSON resources and standard HTTP status semantics.
- Records normally return:
  - `id`
  - `createdTime`
  - `fields`
- Empty field values such as `""`, `[]`, or `false` are omitted from returned record payloads.
- Table names and table IDs are accepted interchangeably in the path, but the docs recommend table IDs so renaming a table does not break callers.

## Manually confirmed endpoint set

### 1) List records in a table
- Method: `GET`
- Path: `/{baseId}/{tableIdOrName}`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}`
- Purpose: list records in a table
- Required auth/scope/role from the docs:
  - bearer token
  - `data.records:read`
  - base read-only or better
- Path parameters:
  - `baseId`
  - `tableIdOrName`
- Confirmed query parameters:
  - `timeZone` - required when `cellFormat=string`
  - `userLocale` - required when `cellFormat=string`
  - `pageSize` - optional, default `100`, max `100`
  - `maxRecords` - optional max total rows to return
  - `offset` - optional cursor for next page
  - `view` - optional view name or ID
  - `sort` - optional array of `{ field, direction }`
  - `filterByFormula` - optional formula string
  - `cellFormat` - `json` or `string`, default `json`
  - `fields` - optional list of field names or IDs to include
  - `returnFieldsByFieldId` - optional boolean
- Important notes from the docs:
  - URLs must stay under `16,000` characters
  - formulas may need URL encoding
  - fields hidden in a view are still returned unless you explicitly use `fields`

### 2) List records using POST body parameters
- Method: `POST`
- Path: `/{baseId}/{tableIdOrName}/listRecords`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}/listRecords`
- Purpose: perform a record listing when query-string length would be too large, especially for long encoded formulas
- Auth/scope/role: same as `GET` list records
- Important note from the official `List records` page:
  - this POST alternative exists specifically to avoid the `16,000`-character URL limit while moving list/filter parameters into the request body

### 3) Get a single record
- Method: `GET`
- Path: `/{baseId}/{tableIdOrName}/{recordId}`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}`
- Purpose: retrieve one record by ID
- Required auth/scope/role:
  - bearer token
  - `data.records:read`
  - base read-only or better
- Path parameters:
  - `baseId`
  - `tableIdOrName`
  - `recordId`
- Confirmed query parameters:
  - `cellFormat` - `json` or `string`
  - `returnFieldsByFieldId` - optional boolean
  - `includeDateDependencyMetadata` - optional boolean for linked-record/date-dependency metadata
- Important note from the docs:
  - if Airtable cannot locate the record in the named table, it falls back to a base-wide search and may still return the record if the ID is valid elsewhere in the same base

### 4) Create records
- Method: `POST`
- Path: `/{baseId}/{tableIdOrName}`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}`
- Purpose: create one or more records in a table
- Required auth/scope/role:
  - bearer token
  - `data.records:write`
  - base editor or better
- Path parameters:
  - `baseId`
  - `tableIdOrName`
- Confirmed request body fields:
  - `fields` - optional top-level single-record object
  - `records` - optional array of record objects
  - `returnFieldsByFieldId` - optional boolean
  - `typecast` - optional boolean for best-effort string conversion
- Confirmed response behavior:
  - returns created record objects with `id`, `createdTime`, and `fields`
  - docs also show `partialSuccess` details/reasons for some attachment-related partial outcomes

### 5) Update multiple records or upsert records
- Methods confirmed: `PATCH`, `PUT`
- Path: `/{baseId}/{tableIdOrName}`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}`
- Purpose:
  - `PATCH` partial update of multiple records
  - `PUT` destructive replacement update of multiple records
  - optional upsert behavior via `performUpsert`
- Required auth/scope/role:
  - bearer token
  - `data.records:write`
  - base editor or better
- Confirmed request body fields:
  - `performUpsert.fieldsToMergeOn` - 1 to 3 field names/IDs used as an external-ID match key
  - `returnFieldsByFieldId`
  - `typecast`
  - `records[]`
    - `id` - required unless `performUpsert` is used
    - `fields`
- Confirmed upsert behavior from the docs:
  - zero matches -> create a new record
  - one match -> update that record
  - multiple matches -> request fails
- Confirmed response additions for upserts:
  - `createdRecords`
  - `updatedRecords`
- Important note from the docs:
  - Airtable reserves the right to throttle upsert requests differently from the standard rate limit policy

### 6) Delete multiple records
- Method: `DELETE`
- Path: `/{baseId}/{tableIdOrName}`
- Full URL: `https://api.airtable.com/v0/{baseId}/{tableIdOrName}`
- Purpose: delete records by ID
- Required auth/scope/role:
  - bearer token
  - `data.records:write`
  - base editor or better
- Path parameters:
  - `baseId`
  - `tableIdOrName`
- Confirmed query parameter:
  - `records[]` - array of record IDs to delete
- Confirmed response shape:
  - `records[]` array containing `id` and `deleted: true`

### 7) Upload an attachment directly to a record
- Method: `POST`
- Path: `/{baseId}/{recordId}/{attachmentFieldIdOrName}/uploadAttachment`
- Full URL: `https://content.airtable.com/v0/{baseId}/{recordId}/{attachmentFieldIdOrName}/uploadAttachment`
- Purpose: upload attachment bytes directly into an attachment field
- Required auth/scope/role:
  - bearer token
  - `data.records:write`
  - base editor or better
- Path parameters:
  - `baseId`
  - `recordId`
  - `attachmentFieldIdOrName`
- Confirmed request body fields:
  - `contentType` - MIME type such as `image/jpeg`
  - `file` - base64-encoded file content
  - `filename`
- Important usage notes from the docs:
  - direct upload limit is `5 MB`
  - for larger publicly accessible files, Airtable recommends adding them by URL through normal attachment-field writes
- Confirmed response:
  - updated record object with attachment metadata including `id`, `filename`, `size`, `type`, and `url`

## Pagination
- Airtable paginates record listings using an `offset` cursor.
- Confirmed list-record behavior from the docs:
  - each page contains up to `pageSize` records
  - `pageSize` defaults to `100`
  - if more records exist, the response contains `offset`
  - send that `offset` in the next request to continue
  - pagination stops when the table ends or `maxRecords` is reached

## Rate limits
From Airtable's official `Rate Limits` page:
- `5 requests per second per base`
- `50 requests per second` total for all traffic using personal access tokens from a given user or service account
- exceeding the limit returns HTTP `429`
- after exceeding the limit, you must wait `30 seconds` before subsequent requests succeed
- Airtable notes that additional or plan-tiered limits may be enforced at its discretion
- the official JavaScript client has built-in backoff/retry logic

## Error handling
From Airtable's official `Errors` guide:
- error responses are JSON and contain `error` and `message` information
- confirmed status codes in the guide:
  - `400 Bad Request` - invalid request encoding / invalid JSON
  - `401 Unauthorized` - missing or invalid credentials
  - `403 Forbidden` - token or user lacks access
  - `404 Not Found` - route or resource missing
  - `413 Request Entity Too Large`
  - `422 Invalid Request` - validation failures
  - `429 Too Many Requests`
  - `500 Internal Server Error`
  - `502 Bad Gateway`
  - `503 Service Unavailable`
- the guide explicitly says `429` returns message `Rate limit exceeded. Please try again later` and recommends backoff/retry

## Response format notes
- Record payloads are keyed by field name by default.
- If `returnFieldsByFieldId=true`, Airtable keys field objects by field ID instead.
- When `cellFormat=string`, `timeZone` and `userLocale` become required.
- Attachment upload responses key the returned `fields` object by field ID.

## Important usage notes
- use table IDs instead of table names when possible
- the Web API omits empty field values from returned records
- long formula filters may need the POST `/listRecords` alternative because of the `16,000`-character URL limit
- `PUT` on the multi-record update route is destructive for unincluded fields, while `PATCH` is partial
- upserts can be throttled differently from normal writes

## Verification notes
This file was manually rebuilt from Airtable's current official Web API docs, replacing the earlier placeholder that failed to extract any routes from the JS-rendered reference.