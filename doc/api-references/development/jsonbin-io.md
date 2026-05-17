# JSONbin.io

## Provider metadata
- Category: `Development`
- Provider slug: `jsonbin-io`
- Docs used manually:
  - `https://jsonbin.io/api-reference`
  - `https://jsonbin.io/api-reference/bins/create`
  - `https://jsonbin.io/api-reference/bins/read`
  - `https://jsonbin.io/api-reference/bins/update`
  - `https://jsonbin.io/api-reference/bins/delete`
  - `https://jsonbin.io/api-reference/collections/create`
  - `https://jsonbin.io/api-reference/collections/bins`
- Confirmed base URL: `https://api.jsonbin.io/v3`
- Primary response/content types confirmed from the docs: JSON responses for records, metadata, collections, and error payloads
- Authentication model confirmed from the docs used in this pass: master-key auth through `X-Master-Key`, plus scoped access-key auth through `X-Access-Key` on several routes
- Manually confirmed routes in this pass: `9`

## Authentication
JSONbin's official docs consistently center requests on header-based authentication.

Confirmed auth details from the reviewed docs:
- `X-Master-Key` is the core API key and is described as required on all reviewed routes
- the docs also say multiple bin routes can be used with `X-Access-Key` if the key has the relevant permission (create/read/update)
- the reviewed header tables sometimes mark both `X-Master-Key` and `X-Access-Key` as required while the prose says access keys can be used instead; this is an official wording inconsistency, so both are documented here exactly as presented
- CORS is explicitly enabled for all endpoints on the main API reference page

## Common request/response conventions
- Base URL: `https://api.jsonbin.io/v3`
- Data/record routes are under `/b`
- Collection routes are under `/c`
- Successful responses usually include a `record` payload and/or `metadata`
- Error responses on the reviewed routes use a simple JSON shape: `{ "message": "<Error Message>" }`
- Confirmed content types:
  - `application/json` required for bin create/update requests
  - JSON responses for create/read/update/delete/collection routes

## Manually confirmed endpoint set

### 1) Create a bin
- Method: `POST`
- Path: `/b`
- Full URL: `https://api.jsonbin.io/v3/b`
- Purpose: create a JSON record/bin
- Confirmed required headers:
  - `Content-Type: application/json`
  - `X-Master-Key` or an appropriately permissioned `X-Access-Key` per the prose/docs inconsistency noted above
- Confirmed optional headers:
  - `X-Bin-Private` - `true` or `false`; defaults to private behavior according to the prose
  - `X-Bin-Name` - human-readable bin name, 1-128 characters
  - `X-Collection-Id` - add the new bin to a specific collection
- Request body: arbitrary JSON document
- Confirmed response shape:
  - `record`
  - `metadata.id`
  - `metadata.createdAt`
  - `metadata.private`
- Important notes:
  - public bins can be read and updated by anyone who has the bin ID according to the create-page prose
  - schema validation can apply when a target collection has an attached schema doc

### 2) Read a bin
- Method: `GET`
- Path: `/b/{binId}`
- Full URL pattern: `https://api.jsonbin.io/v3/b/{binId}`
- Purpose: retrieve a specific bin
- Confirmed headers:
  - `X-Master-Key`
  - `X-Access-Key`
  - `X-Bin-Meta` - optional `true` / `false`
  - `X-JSON-Path` - optional JSON accessor such as `users[0].firstName`
- Confirmed query parameters:
  - `meta` - optional `true` / `false` fallback for disabling metadata when custom headers are hard to set
- Confirmed response behavior:
  - with metadata enabled: response contains `record` and `metadata`
  - with metadata disabled: response body is just the stored JSON document
  - with `X-JSON-Path`: the docs say matching data is returned in a `records` array

### 3) Read a specific bin version
- Method: `GET`
- Path: `/b/{binId}/{binVersion}`
- Full URL pattern: `https://api.jsonbin.io/v3/b/{binId}/{binVersion}`
- Purpose: retrieve a specific stored version of a bin
- Confirmed parameters/headers:
  - same auth and optional read headers as `GET /b/{binId}`
- Important notes:
  - invalid version values produce a documented `Bin version is invalid` error

### 4) Read the latest version shortcut
- Method: `GET`
- Path: `/b/{binId}/latest`
- Full URL pattern: `https://api.jsonbin.io/v3/b/{binId}/latest`
- Purpose: retrieve the most recent saved version without specifying a numeric version ID
- Important notes:
  - the docs explicitly say `/latest` always returns the latest version of the bin

### 5) Update a bin
- Method: `PUT`
- Path: `/b/{binId}`
- Full URL pattern: `https://api.jsonbin.io/v3/b/{binId}`
- Purpose: replace/update a JSON record
- Confirmed required headers:
  - `Content-Type: application/json`
  - `X-Master-Key` or an access key with update permission per the official prose
- Confirmed optional headers:
  - `X-Bin-Versioning` - `true` / `false`, default `false`
- Request body: replacement JSON document
- Confirmed response shape:
  - `record`
  - `metadata.parentId`
  - `metadata.private`
- Important notes:
  - bin name and privacy are not changed through this route
  - up to `1000` versions can be saved for a bin
  - version control cannot be disabled on public bins except for the owner scenario described in the docs when `X-Master-Key` is used

### 6) Delete a bin
- Method: `DELETE`
- Path: `/b/{binId}`
- Full URL pattern: `https://api.jsonbin.io/v3/b/{binId}`
- Purpose: delete a bin and its associated versions
- Confirmed headers:
  - `X-Master-Key`
  - `X-Access-Key`
- Confirmed response shape:
  - `metadata.id`
  - `metadata.versionsDeleted`
  - `message` = `Bin deleted successfully`
- Important notes:
  - the official delete page says all associated versions are deleted from the servers completely

### 7) Create a collection
- Method: `POST`
- Path: `/c`
- Full URL: `https://api.jsonbin.io/v3/c`
- Purpose: create a collection for organizing bins
- Confirmed required headers:
  - `X-Master-Key`
  - `X-Collection-Name`
- Header constraints:
  - collection name may not exceed `32` characters
- Confirmed response shape:
  - `record`
  - `metadata.createdAt`
  - `metadata.name`
- Important notes:
  - collections can later be used with schema validation and grouped bin listing

### 8) List bins in a collection
- Method: `GET`
- Path: `/c/{collectionId}/bins`
- Full URL pattern: `https://api.jsonbin.io/v3/c/{collectionId}/bins`
- Purpose: fetch the first page of bin metadata for a collection
- Confirmed headers:
  - `X-Master-Key`
  - `X-Sort-Order` - optional `ascending` or `descending`; default is descending
- Confirmed response shape:
  - JSON array of metadata objects such as `snippetMeta`, `private`, `record`, and `createdAt`
- Important notes:
  - this route returns bin metadata only, not full bin contents
  - the first fetch returns the first `10` bins according to the route description

### 9) Continue listing bins in a collection from the last seen bin
- Method: `GET`
- Path: `/c/{collectionId}/bins/{lastBinId}`
- Full URL pattern: `https://api.jsonbin.io/v3/c/{collectionId}/bins/{lastBinId}`
- Purpose: continue collection listing using the last retrieved bin ID as a cursor-like path segment
- Confirmed headers:
  - same as `GET /c/{collectionId}/bins`
- Important notes:
  - the docs instruct callers to pass the last bin ID from the previous fetch to retrieve the rest of the bins

## Pagination
- Bin-read routes are not paginated.
- Collection listing uses a path-based continuation pattern rather than offset/limit query parameters:
  - first page: `/c/{collectionId}/bins`
  - next page(s): `/c/{collectionId}/bins/{lastBinId}`
- the docs say the first collection call fetches the first `10` bins.

## Error handling
Across the reviewed pages:
- errors return JSON with a `message` field
- common status codes shown in the docs are `400`, `401`, `403`, and sometimes `404`
- confirmed example errors include:
  - `You need to pass Content-Type set to application/json`
  - `Bin cannot be blank`
  - `Invalid Bin Id provided`
  - `Bin version is invalid`
  - `Invalid X-JSON-Path expression passed`
  - `Schema Doc Validation Mismatch: key:val`
  - `Invalid Collection Id provided`

## Rate limits
- The reviewed JSONbin API reference pages used in this pass do not publish a numeric rate-limit table.
- The docs do distinguish between master keys and scoped access keys, but they do not provide a confirmed requests-per-minute quota on the reviewed pages.

## Response format notes
- Create/update/read/delete operations return JSON objects
- collection listing returns a JSON array of bin metadata records
- read requests can suppress metadata to return only the stored JSON document
- `X-JSON-Path` materially changes the response shape by returning matches in a `records` array

## Important usage notes
- use `X-Bin-Meta: false` or `?meta=false` when you need the stored JSON document without wrapper metadata
- public/private behavior is controlled at creation time; privacy changes are handled by a separate change-privacy route not documented in this pass
- collection fetch returns metadata only; full record retrieval still requires the bin-read routes
- the official docs contain a real wording inconsistency around whether `X-Master-Key` and `X-Access-Key` are simultaneously required or whether the access key can substitute for the master key when scoped permissions are granted; implementers should test the intended auth mode before hard-coding assumptions

## Verification notes
This file was manually rebuilt from JSONbin.io's official API reference and route-specific docs with browser inspection, replacing the earlier generated placeholder.
