# UUID Generator

## Provider metadata
- Category: `Test Data`
- Provider slug: `uuid-generator`
- Official docs used manually:
  - `https://www.uuidtools.com/docs`
  - live official endpoints sampled from the docs page:
    - `https://www.uuidtools.com/api/generate/v1`
    - `https://www.uuidtools.com/api/generate/v1/count/3`
    - `https://www.uuidtools.com/api/generate/v3/namespace/ns:url/name/https://www.google.com/`
    - `https://www.uuidtools.com/api/decode/b01eb720-171a-11ea-b949-73c91bba743d`
- Confirmed API base URL: `https://www.uuidtools.com`
- Primary response formats: JSON arrays for generator endpoints, JSON object for decode responses
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `11`

## Authentication
From the reviewed official docs:
- no API key, OAuth flow, cookie requirement, or account setup is documented
- the API is presented as a free public UUID/GUID generator API

## Common request/response conventions
- Base URL: `https://www.uuidtools.com`
- all reviewed endpoints use `GET`
- generator endpoints return JSON arrays of UUID strings
- the decode endpoint returns a JSON object with `encode` and `decode` sections
- endpoints with `/count/{count}` are documented to allow up to `100` UUIDs per request
- the official docs say all endpoints are limited to `60` requests per minute per IP address
- the docs explicitly state the API supports CORS

## Manually confirmed endpoint set

### 1) Generate one version-1 UUID
- Method: `GET`
- Path: `/api/generate/v1`
- Full URL: `https://www.uuidtools.com/api/generate/v1`
- Purpose: generate one time-and-node-based UUID
- Live response behavior reviewed in this pass:
  - returns a JSON array containing one UUID string

### 2) Generate multiple version-1 UUIDs
- Method: `GET`
- Path: `/api/generate/v1/count/{count}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v1/count/{count}`
- Purpose: generate multiple version-1 UUIDs in one call
- Path parameters:
  - `count` - number of UUIDs to generate; the official docs cap this at `100`
- Live error behavior reviewed in this pass:
  - requesting `count=101` returned HTTP `400` with `{"errors":{"count":["The count must be between 1 and 100."]}}`

### 3) Generate a version-3 UUID from a namespace and raw name
- Method: `GET`
- Path: `/api/generate/v3/namespace/{namespace}/name/{name}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v3/namespace/{namespace}/name/{name}`
- Purpose: deterministically generate a version-3 UUID using an MD5 hash of the provided namespace and name
- Path parameters confirmed in the official docs:
  - `namespace` - one of `ns:url`, `ns:dns`, `ns:OID`, `ns:X500`, or a properly formatted UUID
  - `name` - a string of any length

### 4) Generate a version-3 UUID from a namespace and base64-encoded name
- Method: `GET`
- Path: `/api/generate/v3/namespace/{namespace}/name/base64:{base64_name}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v3/namespace/{namespace}/name/base64:{base64_name}`
- Purpose: version-3 generation using a base64-encoded name to avoid URL-encoding issues
- Path parameters:
  - `namespace`
  - `base64_name` - base64-encoded input string

### 5) Generate one version-4 UUID
- Method: `GET`
- Path: `/api/generate/v4`
- Full URL: `https://www.uuidtools.com/api/generate/v4`
- Purpose: generate one random version-4 UUID

### 6) Generate multiple version-4 UUIDs
- Method: `GET`
- Path: `/api/generate/v4/count/{count}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v4/count/{count}`
- Purpose: generate multiple version-4 UUIDs in one call
- Path parameters:
  - `count` - number of UUIDs to generate, up to `100`

### 7) Generate a version-5 UUID from a namespace and raw name
- Method: `GET`
- Path: `/api/generate/v5/namespace/{namespace}/name/{name}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v5/namespace/{namespace}/name/{name}`
- Purpose: deterministically generate a version-5 UUID using SHA-1 over the namespace and name
- Path parameters confirmed in the official docs:
  - `namespace` - one of `ns:url`, `ns:dns`, `ns:OID`, `ns:X500`, or a properly formatted UUID
  - `name` - a string of any length

### 8) Generate a version-5 UUID from a namespace and base64-encoded name
- Method: `GET`
- Path: `/api/generate/v5/namespace/{namespace}/name/base64:{base64_name}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/v5/namespace/{namespace}/name/base64:{base64_name}`
- Purpose: version-5 generation using a base64-encoded name variant documented by the site
- Path parameters:
  - `namespace`
  - `base64_name`

### 9) Generate one timestamp-first UUID
- Method: `GET`
- Path: `/api/generate/timestamp-first`
- Full URL: `https://www.uuidtools.com/api/generate/timestamp-first`
- Purpose: generate one ordered/timestamp-first UUID intended to sort by creation time more naturally in indexed databases

### 10) Generate multiple timestamp-first UUIDs
- Method: `GET`
- Path: `/api/generate/timestamp-first/count/{count}`
- Full URL pattern: `https://www.uuidtools.com/api/generate/timestamp-first/count/{count}`
- Purpose: generate multiple timestamp-first UUIDs in one call
- Path parameters:
  - `count` - number of UUIDs to generate, up to `100`

### 11) Decode one UUID
- Method: `GET`
- Path: `/api/decode/{uuid}`
- Full URL pattern: `https://www.uuidtools.com/api/decode/{uuid}`
- Purpose: inspect a UUID and return its encoded/decoded details
- Path parameters:
  - `uuid` - the UUID to decode
- Response fields reviewed live in this pass:
  - `encode.STR`
  - `encode.SIV`
  - `decode.variant`
  - `decode.version`
  - `decode.contents.time`
  - `decode.contents.clock`
  - `decode.contents.node`

## Pagination
- none documented

## Rate limits
- the official docs publish `60` requests per minute per IP address for all endpoints
- `/count/{count}` routes are additionally limited to `100` generated UUIDs per request

## Errors and format notes
- the official docs do not publish a broad standalone error-code table
- sampled live validation failure for an excessive count returned HTTP `400` with a JSON `errors` object
- generator routes return JSON arrays, even for single-UUID examples
- the decode route returns a JSON object rather than an array

## Important usage notes
- the docs explicitly state that version-2 UUID generation is not provided
- version-3 and version-5 routes are deterministic; repeated requests with the same namespace and name return the same UUID
- the site recommends the base64 name variants when ordinary URL encoding is inconvenient
- the official CORS note asks users who embed the API on websites to link back to UUIDTools

## Verification notes
This file was manually rebuilt from the official UUIDTools API documentation and sampled live official endpoints using browser-based review only.