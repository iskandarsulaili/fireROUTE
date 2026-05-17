# SWAPI GraphQL

## Provider metadata
- Category: `Video`
- Provider slug: `swapi-graphql`
- Official docs page used:
  - `https://graphql.org/swapi-graphql/`
- Main confirmed endpoint URL from the reviewed page: `https://graphql.org/swapi-graphql`
- Auth model confirmed on the reviewed page: none
- Request/response format confirmed on the reviewed page: GraphQL over HTTP with JSON-style GraphQL responses
- Manually confirmed route count: `1`

## Authentication
- The reviewed page presents the SWAPI GraphQL endpoint as a public example endpoint.
- No OAuth flow, API key, or custom auth header was documented on the reviewed page.

## Canonical endpoint

#### 1) Execute a GraphQL operation
- Method: `POST`
- URL: `https://graphql.org/swapi-graphql`
- Purpose: submit GraphQL queries against the Star Wars example schema
- Request format notes:
  - GraphQL operations are submitted as GraphQL-over-HTTP requests
  - callers should send a GraphQL query document and may include variables depending on the operation
- Response format notes:
  - successful responses return GraphQL `data`
  - partial or failed executions may include GraphQL `errors`

## Parameters, pagination, and errors
- The reviewed page did not publish fixed REST-style query parameters because this provider is GraphQL-based.
- Pagination behavior is schema-driven and must be determined from the fields exposed by the GraphQL schema rather than a standalone REST paging section.
- The reviewed page did not publish numeric rate-limit information.
- Error handling follows normal HTTP semantics plus GraphQL-level `errors` payloads in the response body.

## Important usage notes
- This provider should be treated as a single GraphQL endpoint, not as a multi-route REST API.
- fireROUTE should preserve raw GraphQL query capability for this provider rather than trying to expand schema fields into synthetic REST paths.
- Because the reviewed official page is an example GraphQL surface, integrations should keep expectations modest and avoid assuming long-term production guarantees that are not documented on the page.