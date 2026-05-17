# Bitquery

Official docs manually reviewed:
- https://graphql.bitquery.io/ide
- https://ide.bitquery.io/
- https://docs.bitquery.io/docs/intro/
- https://docs.bitquery.io/docs/authorisation/how-to-generate/
- https://docs.bitquery.io/docs/authorisation/how-to-use/

## Overview
Bitquery’s current official documentation centers on a GraphQL data API plus an OAuth-based token flow. The reviewed IDE and docs confirm one HTTP GraphQL endpoint, one WebSocket GraphQL subscription endpoint on the same path family, and one OAuth token endpoint.

- GraphQL data endpoint: `https://streaming.bitquery.io/graphql`
- OAuth token endpoint: `https://oauth2.bitquery.io/oauth2/token`
- Auth model: OAuth access token used as `Bearer` token for HTTP GraphQL requests, or `token` query parameter for WebSocket usage
- Primary request formats: GraphQL over JSON for HTTP; GraphQL subscriptions over WebSocket

## Authentication
The reviewed authorization docs describe two official ways to obtain an access token:
1. create an application in `account.bitquery.io` and generate a token manually
2. generate a token programmatically by calling the OAuth endpoint with `client_credentials`

Confirmed token request pattern from the official docs:

```text
POST https://oauth2.bitquery.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id=YOUR_CLIENT_ID
client_secret=YOUR_CLIENT_SECRET
scope=api
```

Confirmed sample token response fields:
- `access_token`
- `expires_in`
- `scope`
- `token_type` (`bearer`)

The official usage page then confirms these API-auth methods:
- HTTP GraphQL: `Authorization: Bearer <access_token>`
- alternate URL form: `https://streaming.bitquery.io/graphql?token=<access_token>`
- WebSocket: token in the URL is the documented approach

## Confirmed endpoints
| Method / Transport | URL / Path | Purpose | Auth model |
|---|---|---|---|
| POST | `https://oauth2.bitquery.io/oauth2/token` | Generate OAuth access token using client credentials | form-encoded `client_id`, `client_secret`, `grant_type=client_credentials`, `scope=api` |
| POST | `https://streaming.bitquery.io/graphql` | Execute GraphQL queries and real-time requests over HTTP | `Authorization: Bearer <access_token>` or `?token=` |
| WebSocket (`wss`) | `wss://streaming.bitquery.io/graphql` | GraphQL subscriptions / real-time streaming | token in URL query string per official auth docs |

Manual route count confirmed from the reviewed official documentation: **3** routes/transports.

## GraphQL request model
The reviewed docs describe Bitquery as a GraphQL API for historical, real-time, and combined blockchain datasets. Confirmed request characteristics:
- HTTP requests target `/graphql`
- request body contains a GraphQL `query`
- GraphQL examples include datasets such as `EVM(dataset: archive network: bsc)`
- subscription examples use GraphQL with triggers such as `EVM(trigger_on: head)`

The IDE also explicitly shows the live endpoint URL field as:

```text
https://streaming.bitquery.io/graphql
```

## Pagination and result-shaping notes
The reviewed docs do not publish a provider-wide page/cursor contract because Bitquery is GraphQL-first.

Instead, shape/volume is controlled in-query. Confirmed examples and docs language show GraphQL controls such as:
- `limit: {count: 10}`
- dataset selectors like `archive`, `real-time`, or `combined`
- GraphQL field selection determining response size and structure

## Errors and failure notes
The reviewed authorization docs explicitly note:
- if a token is invalid, you get an `Unauthorized` message

The reviewed pages do not publish a single REST-style error-code table for GraphQL operations. In practice, integrations should preserve:
- HTTP status codes from token generation / HTTP GraphQL calls
- GraphQL `errors` arrays if returned
- upstream unauthorized responses when token generation or token use fails

## Rate limits
No public per-second or per-day rate-limit table was visible on the reviewed docs pages used in this pass.

The docs focus on token generation, application lifetimes, and billing/points rather than a universal request-throttling contract.

## Important usage notes
- Bitquery’s current documented data API host is `streaming.bitquery.io`, not the older `graphql.bitquery.io` hostname shown in legacy index metadata.
- WebSocket authentication is not documented as a bearer header flow; the official docs say token-in-URL is the supported method there.
- The IDE can generate code snippets, but the authorization docs explicitly warn that IDE-generated examples may show temporary tokens; for production use, copy the real token from the account/token flow.
- Billing is described as shared across API v1 and v2 via points, but the reviewed pages do not expose a simple route-level quota table.

## fireROUTE notes
- Treat Bitquery primarily as a GraphQL provider, not a REST resource collection.
- Preserve raw GraphQL query bodies and upstream response envelopes.
- If fireROUTE supports subscriptions, model the WebSocket endpoint separately from the HTTP GraphQL endpoint because the auth transport differs.
