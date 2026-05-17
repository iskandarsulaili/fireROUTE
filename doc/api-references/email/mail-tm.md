# mail.tm

Official docs manually reviewed:
- https://docs.mail.tm/
- https://api.mail.tm/
- https://api.mail.tm/docs.jsonopenapi

## Overview
mail.tm provides temporary mailbox creation and message retrieval over HTTPS. The reviewed homepage explains the basic workflow, and the reviewed OpenAPI document confirms the concrete paths, methods, schemas, pagination controls, and JWT auth model.

- Base URL: `https://api.mail.tm`
- Primary transport: JSON over HTTPS
- API key requirement: none
- Auth for mailbox access: bearer JWT obtained from `POST /token`
- Rate limit: `8 QPS` per IP address

## Authentication
The reviewed homepage explicitly says:
- no API key required
- no signup required beyond creating a temp mailbox
- use `Authorization: Bearer YOUR_TOKEN` when accessing protected mailbox resources

The reviewed OpenAPI document defines one security scheme:

```http
Authorization: Bearer YOUR_TOKEN
```

Workflow confirmed from the homepage:
1. `GET /domains`
2. `POST /accounts`
3. `POST /token`
4. `GET /messages`

## Confirmed endpoints
| Method | Path | Purpose | Key parameters/body |
|---|---|---|---|
| POST | `/accounts` | Create a temporary account | JSON body with `address`, `password` |
| GET | `/accounts/{id}` | Retrieve an account resource by id | Path `id` |
| DELETE | `/accounts/{id}` | Delete an account resource | Path `id` |
| GET | `/me` | Retrieve the current authenticated account | Bearer token |
| GET | `/domains` | List available domains | Optional query `page` |
| GET | `/domains/{id}` | Retrieve one domain | Path `id` |
| GET | `/messages` | List messages for the authenticated mailbox | Optional query `page` |
| GET | `/messages/{id}` | Retrieve one message | Path `id` |
| DELETE | `/messages/{id}` | Delete a message | Path `id` |
| PATCH | `/messages/{id}` | Update message state | Path `id`; merge-patch body `seen` |
| GET | `/messages/{id}/attachment/{attachmentId}` | Download a message attachment | Path `id`, `attachmentId` |
| GET | `/messages/{id}/download` | Download the full message resource | Path `id` |
| GET | `/sources/{id}` | Retrieve source/raw message data | Path `id` |
| POST | `/token` | Exchange mailbox credentials for a JWT | JSON body `address`, `password` |

Manual route count confirmed from the reviewed OpenAPI document and homepage workflow: **14**.

## Endpoint details
### `POST /accounts`
Confirmed request body:

```json
{
  "address": "user@example.com",
  "password": "string"
}
```

Confirmed success response fields include:
- `id`
- `address`
- `quota`
- `used`
- `isDisabled`
- `isDeleted`
- `createdAt`
- `updatedAt`

Confirmed documented non-success responses:
- `400 Invalid input`
- `422 Unprocessable entity`

### `POST /token`
Confirmed request body:

```json
{
  "address": "user@example.com",
  "password": "string"
}
```

Confirmed success response:

```json
{
  "token": "..."
}
```

### `GET /domains` and `GET /domains/{id}`
Confirmed domain fields from the reviewed schema:
- `id`
- `domain`
- `isActive`
- `isPrivate`
- `createdAt`
- `updatedAt`

`GET /domains` supports optional query parameter:
- `page` (integer, default `1`)

### `GET /messages`
Confirmed optional query parameter:
- `page` (integer, default `1`)

### `GET /messages/{id}`
Confirmed message fields from the reviewed schema include:
- `id`
- `accountId`
- `msgid`
- `from`
- `to`
- `cc`
- `bcc`
- `subject`
- `intro`
- `text`
- `html`
- `seen`
- `flagged`
- `hasAttachments`
- `attachments`
- `size`
- `downloadUrl`
- `sourceUrl`
- `createdAt`
- `updatedAt`
- `retention`
- `retentionDate`
- `verifications`
- `isDeleted`

Attachment objects shown in the reviewed schema include fields such as:
- `id`
- `filename`
- `contentType`
- `disposition`
- `transferEncoding`
- `related`
- `size`
- `downloadUrl`

### `PATCH /messages/{id}`
The reviewed write schema confirms a lightweight patch body:

```json
{
  "seen": true
}
```

### `GET /sources/{id}`
Confirmed source/raw-message response fields:
- `id`
- `downloadUrl`
- `data`

## Pagination
The reviewed OpenAPI document confirms provider pagination on at least:
- `GET /domains?page=...`
- `GET /messages?page=...`

The reviewed response schemas show multiple envelope styles depending on content type:
- JSON arrays for `application/json`
- Hydra collections with `hydra:member`, `hydra:totalItems`, and `hydra:view`
- HAL collections with `_embedded`, `_links`, `itemsPerPage`, and `totalItems`

For fireROUTE, treat the simple query control as page-based pagination and preserve provider pagination metadata when present.

## Rate limits
The reviewed homepage explicitly states a general quota limit of **8 queries per second (QPS) per IP address**.

## Errors
The reviewed docs confirm at least these formal error/status signals:
- `400 Invalid input`
- `422 Unprocessable entity`

The docs do not publish a single centralized cross-endpoint error object for every route. Plan for standard auth failures on bearer-protected endpoints and validation errors on account/token creation.

## Important usage notes
- No API key is required.
- A bearer token is still required for authenticated mailbox operations after login.
- The homepage explicitly forbids illegal activity, reselling, and proxying/mirroring the API under another domain, and requires attribution back to mail.tm.
- The homepage mentions real-time listening with SSE in the workflow text, but the reviewed OpenAPI document for the public REST API confirms the route set listed above.
- The spec exposes many content types due API Platform generation, but JSON is the practical primary format for integrations.

## fireROUTE notes
- mail.tm is a strong candidate for a normalized temporary-mail adapter: list domains, create mailbox, obtain token, list messages, fetch message, delete message.
- Preserve upstream message IDs and attachment IDs verbatim.
- Keep `page` pagination and raw provider envelopes available because response content types vary.
