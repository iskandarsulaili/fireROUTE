# mail.gw

Official docs manually reviewed:
- https://docs.mail.gw/

## Overview
mail.gw is a temporary-email service with a small REST API for creating accounts, issuing bearer tokens, listing available domains, reading messages, and retrieving message source data.

Confirmed from the reviewed official docs:
- Base URL: `https://api.mail.gw`
- API style: JSON-LD / Hydra-style JSON collections
- Authentication: no API key; bearer token authentication is required for most account/message routes
- Publicly documented unauthenticated routes: domain listing and account creation/token issuance
- Rate limit: **8 queries per second per IP address**

## Authentication
The official docs explicitly say that every request except account creation and token acquisition must be authenticated with a bearer token.

Confirmed token flow:
1. `POST /accounts` to create an address/password pair
2. `POST /token` with that address/password pair
3. Send an `Authorization` header using the bearer token returned by `POST /token` on protected requests

Confirmed request body for token issuance:
- `address` — account email address
- `password` — account password

Confirmed example response shape from the docs:

```json
{
  "id": "string",
  "token": "string"
}
```

## Confirmed endpoints
The reviewed official docs expose these routes.

| Method | Path | Purpose |
|---|---|---|
| POST | `/token` | Exchange account credentials for a bearer token |
| GET | `/domains` | List available temporary-email domains |
| GET | `/domains/{id}` | Retrieve one domain by ID |
| POST | `/accounts` | Create an account |
| GET | `/accounts/{id}` | Retrieve one account by ID |
| DELETE | `/accounts/{id}` | Delete an account |
| GET | `/me` | Retrieve the authenticated account |
| GET | `/messages` | List messages for the authenticated account |
| GET | `/messages/{id}` | Retrieve one message with full details |
| DELETE | `/messages/{id}` | Delete a message |
| PATCH | `/messages/{id}` | Mark a message as read |
| GET | `/sources/{id}` | Retrieve raw message source data |

Manual route count confirmed from the official docs: **12**.

## Parameters and request notes
Confirmed from the reviewed docs:
- Collection routes support `page` as the page-number query parameter:
  - `GET /domains?page=...`
  - `GET /messages?page=...`
- Common path parameter:
  - `{id}` — resource ID for domains, accounts, messages, or sources depending on the route
- `POST /accounts` request body fields:
  - `address` — desired temporary email address
  - `password` — account password
- `POST /token` request body fields:
  - `address`
  - `password`
- `PATCH /messages/{id}` returns a minimal JSON body indicating read state, e.g. `{"seen": true}`

## Pagination
The official docs show Hydra pagination for collection endpoints.

Confirmed collection-response fields include:
- `hydra:member`
- `hydra:totalItems`
- `hydra:view`
- `hydra:search`

Additional explicit note from the docs:
- `/domains` returns up to **30 domains per page**

## Response format
Confirmed from the reviewed docs:
- successful responses are JSON
- collection responses use Hydra/JSON-LD-style fields
- entity responses include fields such as `@id`, `@type`, and `@context`

Confirmed example response details include:
- domain objects: `id`, `domain`, `isActive`, `createdAt`, `updatedAt`
- account objects: `address`, `quota`, `used`, `isDisabled`, `isDeleted`, `createdAt`, `updatedAt`
- message objects: sender/recipient arrays, `subject`, `seen`, `hasAttachments`, `downloadUrl`, timestamps
- message-detail responses include `cc`, `bcc`, `text`, `html`, `attachments`, `retentionDate`, and verification-related fields
- source responses include `downloadUrl` and raw `data`

## Errors
The reviewed official docs publish these notable status codes:
- `200`, `201`, `204` — successful requests
- `400` — bad request / missing payload data
- `401` — missing or invalid bearer token
- `404` — requested account/message/resource not found
- `405` — wrong method for the route
- `418` — documented humorous teapot response
- `422` — invalid payload values (for example short username or invalid domain during account creation)
- `429` — too many requests

The docs explicitly tie `429` to the published 8-QPS limit.

## Rate limits
The official docs explicitly state:
- **general quota limit is 8 queries per second (QPS) per IP address**

No additional per-plan or per-token rate tiers were documented on the reviewed page.

## Important usage notes
- The docs explicitly say the API is free to use and does not require API keys.
- Bearer auth is still required for protected account/message routes even though the service itself is keyless.
- `GET /messages/{id}` returns a fuller payload than the list endpoint, including body content and attachment metadata.
- `GET /sources/{id}` is the raw-source retrieval route for advanced email parsing/debugging.
- The official docs also mention compatibility with Mail.tm client libraries, with the main operational difference being the base URL.

## fireROUTE notes
- Treat mail.gw as a temporary-mail workflow provider rather than generic email delivery infrastructure.
- Preserve the account → token → messages flow in adapters.
- Collection responses should be passed through carefully because Hydra pagination fields are part of the provider contract.
- Message source retrieval is a distinct advanced capability worth exposing as passthrough functionality.
