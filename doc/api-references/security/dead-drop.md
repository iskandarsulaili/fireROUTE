# dead-drop

## Provider metadata
- Category: `Security`
- Provider slug: `dead-drop`
- Docs used manually:
  - `https://api.dead-drop.xyz/api/v1/docs`
  - `https://api.dead-drop.xyz/api/v1/docs/openapi.json`
- Confirmed API base URLs from the reviewed official docs:
  - `https://api.dead-drop.xyz/api/v1`
  - relative server entry `/api/v1`
- Primary response format: JSON
- Authentication model confirmed from the reviewed official docs:
  - no global API key or bearer-token scheme is declared in the OpenAPI document
  - mutating drop operations use request-body credentials or hashes instead
- Manually confirmed routes in this pass: `9`

## Authentication
- The official OpenAPI document does not define any global `securitySchemes` or top-level security requirement.
- Read operations for drop content/history publicly require a query confirmation flag on the routes that expose content:
  - `I_agree_with_terms_and_conditions=true`
- Write/delete authentication is route-specific and is documented inside request bodies:
  - public-drop update/delete uses `adminPassword`
  - private-drop update/delete uses `contentHash` and, for updates, `newContentHash`
  - create for public drops uses `adminHash`
- The official docs repeatedly point these agreement fields back to `https://dead-drop.xyz/terms`.

## Common request/response conventions
- The docs describe dead-drop as a `Privacy-focused, ephemeral data-sharing API v1`.
- Identifiers are SHA-256 hashes represented as lowercase hex strings.
- Private drops use encrypted payload conventions documented in the schema:
  - `payload` is hex-encoded AES-GCM ciphertext
  - `salt` is hex-encoded
  - `iv` is hex-encoded
  - `encryptionAlgo` currently documents `pbkdf2-aes256-gcm-v1`
- Public drops use raw content strings interpreted by `mimeType`.
- Responses are JSON for all functional API routes documented in the OpenAPI spec.

## Manually confirmed endpoint inventory
1. `GET /health` - health check
2. `GET /drops/generate-name` - generate a random unused drop name
3. `GET /drops/check/{id}` - check whether a drop name/hash is available
4. `GET /drops/{id}` - retrieve the current version of a drop
5. `PUT /drops/{id}` - update an existing drop
6. `DELETE /drops/{id}` - delete a drop permanently
7. `POST /drops` - create a new drop
8. `GET /drops/{id}/history` - list a drop's version history
9. `GET /drops/{id}/history/{version}` - retrieve one specific historical version

Manual route count confirmed: **9**.

## Parameters and request-body notes
- Confirmed path parameters:
  - `{id}` - SHA-256 hash of the normalized drop name
  - `{version}` - positive integer version number for history lookup
- Confirmed query parameters:
  - `I_agree_with_terms_and_conditions` - required boolean on read/history routes that expose stored content/history
- Confirmed create-body fields exposed in the official schema include:
  - `id`
  - `nameLength`
  - `tier` with enum `free | deep`
  - `visibility` with enum `private | public`
  - `payload`
  - `salt`
  - `iv`
  - `encryptionAlgo`
  - `encryptionParams`
  - `mimeType` with enum `text/plain`
  - `hashAlgo` with enum `sha-256`
  - `contentHash`
  - `adminHash`
  - `I_agree_with_terms_and_conditions`
- Confirmed update-body fields exposed in the official schema include:
  - `payload`
  - `iv`
  - `mimeType`
  - `contentHash`
  - `newContentHash`
  - `adminPassword`
  - `I_agree_with_terms_and_conditions`
- Confirmed delete-body fields exposed in the official schema include:
  - `contentHash`
  - `adminPassword`
  - `I_agree_with_terms_and_conditions`

## Pagination
- No pagination parameters or cursor model are documented anywhere in the official OpenAPI document.
- History responses return a full JSON object containing `versions`, `current`, and `maxVersions`, not a paged collection contract.

## Rate limits
- No rate-limit section, quota table, or retry guidance was present in the reviewed Swagger UI or OpenAPI document.
- The file therefore records no undocumented throttling assumptions.

## Error and response notes
- The OpenAPI spec documents a consistent JSON error envelope with top-level `error.code` and `error.message` fields for error responses.
- Confirmed published error statuses include:
  - `400` invalid request
  - `401` invalid credentials / invalid upgrade token depending on route
  - `402` payload exceeds tier limit
  - `403` terms not agreed or maximum versions reached depending on route
  - `404` not found / expired
  - `409` drop name already taken on create
  - `500` failed unique-name generation on `GET /drops/generate-name`
- Successful responses are also well structured in the spec, for example:
  - `GET /health` returns `status` and `timestamp`
  - `POST /drops` returns `success`, `version`, and `tier`
  - `PUT /drops/{id}` returns `success` and the new `version`

## Response format notes
- All functional endpoints are documented as `application/json`.
- Timestamps are ISO 8601 date-time strings.
- IDs, salts, IVs, hashes, and encrypted payloads are documented as lowercase hex strings with fixed-length patterns where applicable.
- The tier descriptions in the schema explicitly document current retention/size semantics:
  - `free`: 10 KB, 7 days
  - `deep`: 4 MB, 90 days

## Important usage notes
- The docs distinguish private encrypted drops from public plaintext drops; clients must choose the correct credential/hash fields for each visibility mode.
- The API requires terms acceptance not only at create/update/delete time but also for routes that retrieve drop content and history.
- The Swagger UI exposes two documentation routes (`/docs` and `/docs/openapi.json`), but this file's route count only includes the nine functional API routes above.
- The generated-name route returns a four-word Diceware-style name and its SHA-256 hash, which is useful for client-side name provisioning before create.

## Verification notes
This file was manually rebuilt from the live dead-drop Swagger UI and its linked official OpenAPI document, replacing the earlier autogenerated placeholder.