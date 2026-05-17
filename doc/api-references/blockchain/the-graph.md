# The Graph

Official docs manually reviewed:
- https://thegraph.com/docs/en/subgraphs/querying/introduction/
- https://thegraph.com/docs/en/subgraphs/querying/managing-api-keys/
- https://thegraph.com/docs/en/subgraphs/querying/graphql-api/

## Overview
The Graph exposes subgraph querying through GraphQL rather than a large REST path surface. Each published subgraph has its own query URL, but the reviewed docs confirm a common hosted gateway template.

Confirmed hosted gateway template:
- `https://gateway.thegraph.com/api/<YOUR_API_KEY>/subgraphs/id/<SUBGRAPH_ID>`

Confirmed alternate auth model:
- bearer token via the `Authorization` header

Confirmed request method from the reviewed docs:
- `POST`

Confirmed body format:
- JSON payload containing GraphQL request fields such as `query`, `operationName`, and `variables`

## Confirmed route
| Method | Path | Purpose | Confirmed parameters/body |
|---|---|---|---|
| POST | `/api/{api_key}/subgraphs/id/{subgraph_id}` on `gateway.thegraph.com` | Execute GraphQL queries against a specific published subgraph | path params `api_key`, `subgraph_id`; JSON body fields `query`, optional `operationName`, optional `variables` |

Manual route count confirmed from the reviewed official docs: **1** route.

## Authentication
The reviewed API key guide explicitly says query URLs require a valid API key and shows two supported approaches:

### API key in URL
```text
https://gateway.thegraph.com/api/<YOUR_API_KEY>/subgraphs/id/<SUBGRAPH_ID>
```

### Bearer token in header
The same page says the API key can also be supplied in the `Authorization` header as a bearer token.

The same page includes an official curl example that sends a JSON GraphQL body and bearer token to a hosted subgraph query endpoint.

## Query model
The reviewed GraphQL API page confirms that The Graph uses read-only GraphQL queries over indexed entities generated from the subgraph schema.

Confirmed GraphQL request/body concepts from the docs:
- entity queries such as single-entity lookups by `id`
- collection queries
- `orderBy`
- `orderDirection`
- `first`
- `skip`
- `where`
- `and` / `or`
- block/time-travel querying via block selectors
- variables in GraphQL operations

## Pagination and filtering notes
The reviewed docs explicitly state:
- `first` paginates from the beginning of a collection
- `skip` can be used but generally performs poorly for large offsets
- cursor-style pagination using an attribute such as `id_gt` is preferred for large result sets

## Error and request notes
The introductory querying guide explicitly notes:
- if you encounter `405` errors with a GET request to a Graph Explorer URL, switch to a `POST` request

The docs are primarily GraphQL-schema driven and do not publish one universal REST error envelope because response shapes depend on GraphQL execution.

## Rate limits and billing
The reviewed docs confirm:
- API keys are used to authenticate, authorize, enforce rate limits, and track usage
- Subgraph Studio users start on a Free Plan with `100,000 queries per month`
- additional usage is available on the Growth Plan
- optional spending limits can be configured per API key

## Important usage notes
- There is not one global schema for all subgraphs; each subgraph's entities and fields are determined by its own schema.
- The hosted gateway route is stable, but the effective data model comes from the specific subgraph identified by `subgraph_id`.
- fireROUTE should treat The Graph as a GraphQL passthrough provider with provider-managed query text rather than a conventional REST adapter.
