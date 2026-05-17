# ExtendsClass JSON Storage

## Provider metadata
- Category: `Development`
- Provider slug: `extendsclass-json-storage`
- Docs used manually:
  - `https://extendsclass.com/json-storage.html`
  - `https://extendsclass.com/json-storage.openapi.json`
- Confirmed public endpoint host shown on the human docs page: `https://json.extendsclass.com`
- Additional official server value exposed by the downloadable OpenAPI document: `https://extendsclass.com/api/json-storage`
- Primary media type: JSON
- Authentication: account API key plus optional/conditional bin security key
- Manually confirmed routes in this pass: `6`

## Authentication
From the official ExtendsClass JSON storage page:
- you can create and share bins without an account through the web UI, but the HTTP API requires a free account API key
- the docs say: `You must create an account to use the API (free). Find your API key in page "My Account".`
- the API key is passed in the `Api-key` header on account-scoped operations such as creating bins and listing all bin ids
- `Security-key` is a separate bin-level protection key:
  - optional for public-bin reads
  - required to read private bins
  - required to update or delete a bin that was protected with a security key
- the docs also note that the old pre-account API is still available for former users; no current public route contract for that legacy mode was reviewed in this pass

## Common request/response conventions
- Human docs examples use the endpoint host `https://json.extendsclass.com`
- The downloadable OpenAPI document instead advertises `https://extendsclass.com/api/json-storage` as its server URL
- Because the reviewed route examples, code snippets, and visible endpoint cards all use `https://json.extendsclass.com`, this file treats that as the primary reviewed public surface and explicitly notes the server-value mismatch
- Request and response payloads are JSON
- Success responses use a simple status envelope with `status: 0`
- Error responses use a simple status envelope with:
  - `status: 1`
  - `message`
- The docs explicitly state that the HTTP API supports CORS from any origin

## Manually confirmed endpoint set

### 1) Request one JSON bin
- Method: `GET`
- Path: `/bin/{id}`
- Full URL example: `https://json.extendsclass.com/bin/:id`
- Purpose: return a stored JSON bin
- Path parameter:
  - `id` - bin id
- Confirmed request headers:
  - `Security-key` - optional generally, required for private bins
- Confirmed success response:
  - `200` with the stored JSON document itself
- Confirmed error responses:
  - `404` - `Bin not found`
  - `422` - `Id must be specified`
  - `429` - `you have exceeded the call limit`

### 2) Create a JSON bin
- Method: `POST`
- Path: `/bin`
- Full URL: `https://json.extendsclass.com/bin`
- Purpose: create a new JSON bin
- Confirmed request headers on the official docs page:
  - `Api-key` - required account API key
  - `Security-key` - optional; max `256` characters per the docs prose
  - `Private` - optional boolean; if true, the docs say a security key is required
- Request body:
  - arbitrary JSON payload to store as the bin body
- Confirmed success response:
  - `200` with JSON containing:
    - `status: 0`
    - `uri`
    - `id`
- Confirmed error responses:
  - `401` - `Wrong API key`
  - `413` - `JSON data too large` or `Security key is too large`
  - `422` - `Id can not be specified` and `Security key is required for private bin`
  - `429` - `you have exceeded the call limit`
- Important usage notes from the official docs:
  - bin size is limited to `100 KB`
  - account quota is `10 MB`

### 3) Replace a JSON bin
- Method: `PUT`
- Path: `/bin/{id}`
- Full URL example: `https://json.extendsclass.com/bin/:id`
- Purpose: replace an existing bin with a new JSON document
- Path parameter:
  - `id`
- Confirmed request headers:
  - `Security-key` - optional generally, required if the bin is security-key protected
- Request body:
  - the replacement JSON document
- Confirmed success response:
  - `200` with JSON containing:
    - `status: 0`
    - `data` - updated JSON content
- Confirmed error responses:
  - `401` - `Wrong security key`
  - `404` - `Bin not found`
  - `413` - `JSON data too large`
  - `422` - `Id must be specified`
  - `429` - `you have exceeded the call limit`

### 4) Partially update a JSON bin
- Method: `PATCH`
- Path: `/bin/{id}`
- Full URL example: `https://json.extendsclass.com/bin/:id`
- Purpose: partially update a bin using JSON Merge Patch by default, or JSON Patch when requested explicitly
- Path parameter:
  - `id`
- Confirmed request headers:
  - `Security-key` - optional generally, required if the bin is protected
  - `Content-type` - optional; set to `application/json-patch+json` for JSON Patch mode
- Request body modes confirmed from the official docs:
  - JSON Merge Patch body by default
  - JSON Patch operation array when `Content-type: application/json-patch+json`
- Confirmed success response:
  - `200` with JSON containing:
    - `status: 0`
    - `data` - updated JSON content
- Confirmed error responses:
  - `400` - JSON Patch example shows path-level patch errors such as `Path '/arr2/1' not found`
  - `401` - `Wrong security key`
  - `404` - `Bin not found`
  - `413` - `JSON data too large`
  - `422` - `Id must be specified`
  - `429` - `you have exceeded the call limit`
- Important usage notes from the official docs:
  - the page explicitly references JSON Merge Patch as the default patch mode
  - the comments section links RFC 7386 for the merge-patch interpretation

### 5) Delete a JSON bin
- Method: `DELETE`
- Path: `/bin/{id}`
- Full URL example: `https://json.extendsclass.com/bin/:id`
- Purpose: delete a stored bin
- Path parameter:
  - `id`
- Confirmed request headers:
  - `Security-key` - optional generally, required if the bin is protected
- Confirmed success response:
  - `200` with `{ "status": 0 }`
- Confirmed error responses:
  - `401` - `Wrong security key`
  - `404` - `Bin not found`
  - `422` - `Id must be specified`
  - `429` - `you have exceeded the call limit`

### 6) Request all bin ids for the account
- Method: `GET`
- Path: `/bins`
- Full URL: `https://json.extendsclass.com/bins`
- Purpose: list all bin ids associated with the authenticated account
- Confirmed request headers:
  - `Api-key` - required
- Confirmed success response:
  - `200` with a JSON array of bin ids
- Confirmed error responses:
  - `401` - `Wrong API key`
  - `429` - `you have exceeded the call limit`

## Pagination
- none documented on the reviewed official page or in the reviewed OpenAPI document
- `GET /bins` is documented as returning a JSON array, with no page, cursor, or offset parameters shown

## Rate limits
From the official docs page:
- `10000 requests per month`
- `Bin is limited to 100 KB`
- `Quota for an account: 10 MB`
- exceeded-call examples return `429` with message `you have exceeded the call limit`

## Error and response notes
- success envelopes are intentionally small and use `status: 0`
- error envelopes use `status: 1` plus a human-readable `message`
- create responses expose `uri` and `id`
- update and patch responses expose `data`
- delete responses expose only the status flag
- the official page explicitly says CORS requests are accepted from any origin

## Important usage notes
- the human docs and the downloadable OpenAPI file disagree on the server base URL; the concrete reviewed endpoint examples all use `https://json.extendsclass.com`
- private bins require a security key even for reads
- protected bins also require the security key for update and delete operations
- the docs describe this API as suitable for tutorials, code examples, and development/qualification environments rather than durable high-volume production storage

## Verification notes
This file was manually rebuilt from ExtendsClass's official JSON storage docs page and its linked official OpenAPI document using browser inspection.