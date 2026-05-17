# Chainpoint

Official docs manually reviewed:
- https://tierion.com/chainpoint/
- https://github.com/chainpoint/chainpoint-gateway/wiki/Gateway-HTTP-API
- https://raw.githubusercontent.com/chainpoint/chainpoint-gateway/master/chainpoint-gateway-openapi-3.yaml

## Overview
Chainpoint exposes a gateway-oriented HTTP API for anchoring hashes, retrieving proofs, verifying proofs, and reading gateway/calendar metadata.

Important architectural note from the official docs:
- the Tierion page describes Chainpoint as a network and points developers to the **Chainpoint Gateway API**
- the GitHub wiki says **a Chainpoint Gateway exposes a public HTTP API**
- the reviewed OpenAPI file publishes a sample development server, but the API is gateway-specific rather than tied to one permanent vendor host

## Base URLs manually confirmed
From the reviewed OpenAPI file:
- `http://35.231.41.69` — documented as the **development server (produces testnet proofs)**

Practical canonical base pattern:
- `http(s)://{gateway-host}` — the reviewed docs describe the HTTP API as something exposed by a specific Chainpoint Gateway instance

## Canonical routes manually confirmed
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| POST | `/hashes` | Submit one or more hashes for anchoring | JSON body with `hashes` array of hexadecimal strings; official docs say minimum `1`, maximum `1000` hashes |
| GET | `/proofs/{proof_id}` | Retrieve a single proof by UUID | Path: `proof_id` |
| GET | `/proofs` | Retrieve multiple proofs in one request | Header: `proofids` (comma-separated proof UUIDs) |
| POST | `/verify` | Verify one or more submitted proofs | JSON body with proof array |
| GET | `/calendar/{tx_id}/data` | Retrieve data embedded in a calendar transaction | Path: `tx_id` |
| GET | `/config` | Read basic node/gateway configuration info | none |

Manual route count confirmed from the reviewed official wiki + OpenAPI: **6**.

## Request and response notes
### `POST /hashes`
- request body is JSON
- top-level property: `hashes`
- each hash must be a hexadecimal string
- OpenAPI pattern allows 20 to 64 bytes represented in hex
- the wiki shows a response with top-level `meta` plus a `hashes` array containing `proof_id` and `hash`

### `GET /proofs/{proof_id}` and `GET /proofs`
The reviewed OpenAPI and wiki confirm multiple response formats:
- `application/json`
- `application/vnd.chainpoint.ld+json`
- `application/vnd.chainpoint.json+base64`

### `POST /verify`
- request body is JSON
- response is a JSON array of verification results

### Error model
The reviewed OpenAPI repeatedly documents:
- `409` for invalid arguments
- JSON `ErrorResponse` bodies

## Auth model
- No API-key or bearer-token auth requirement was documented on the reviewed gateway API pages.
- Access control, if any, appears to depend on the specific gateway operator rather than a global Tierion-issued key model.

## Pagination / batching
- Hash submission is explicitly batched: `1` to `1000` hashes per request.
- Proof retrieval is also batched through the `proofids` header on `GET /proofs`.
- No generic page-number pagination model was documented.

## Important usage notes
- fireROUTE should treat Chainpoint as a **gateway-hosted** API, not as one globally fixed vendor base URL.
- The published sample development server is clearly labeled as a development/testnet server.
- Response content negotiation matters for proof retrieval because the official API supports JSON-LD and base64-encoded proof formats in addition to normal JSON.
- The docs and examples are maintained in GitHub/wiki/OpenAPI form rather than a polished SaaS console.
