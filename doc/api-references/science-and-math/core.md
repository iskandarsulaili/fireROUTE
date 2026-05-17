# CORE

## Provider metadata
- Category: `Science & Math`
- Provider slug: `core`
- Description: `Access the world's Open Access research papers`
- Official docs/pages used:
  - `https://core.ac.uk/services/api` (official product/API overview and rate-limit notes)
  - `https://api.core.ac.uk/docs/v3` (official Redoc API reference)
  - `https://api.core.ac.uk/swagger/v3.json` (official OpenAPI document loaded by the Redoc page)
- Current public API base URL: `https://api.core.ac.uk`
- Auth model: API key accepted either as query parameter `api_key` or via an `Authorization` header carrying the API key as a bearer token; the service page also advertises free access without registration subject to CORE terms, with better performance for registered users
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON for core API responses; dedicated download routes also expose raw record and file-download responses, including TEI and PDF-related download flows documented in the official API reference
- Rate limits: the official service page says free access includes `one batch request or five single requests per 10 seconds`; higher rates require contacting CORE
- Manually confirmed route count: `22`

## Canonical endpoints
### Data providers
1. `GET /v3/data-providers/{identifier}`
   - Get a single data provider.
2. `GET /v3/data-providers/{identifier}/stats`
   - Get statistics about a data provider.
3. `POST /v3/data-providers/{identifier}/stats`
   - Statistics with options / history-style request body support documented in the spec.
4. `GET /v3/data-providers/{identifier}/outputs`
   - Search outputs attached to a specific data provider.

### Discovery and recommendation
5. `POST /v3/discover`
   - Discover full-text links.
6. `POST /v3/labs/expert-finder`
   - Experimental expert-finder lab endpoint.
7. `POST /v3/recommend`
   - Recommendation endpoint.

### Journals
8. `GET /v3/journals/{identifier}`
   - Get one journal.
9. `GET /v3/journals/{identifier}/stats`
   - Get journal statistics.

### Outputs
10. `GET /v3/outputs/{identifier}`
    - Get one output.
11. `GET /v3/outputs/{identifier}/stats`
    - Get output statistics.
12. `GET /v3/outputs/{identifier}/download`
    - Download the output file.
13. `GET /v3/outputs/{identifier}/raw`
    - Download the raw XML record for an output.
14. `GET /v3/outputs/{identifier}/history`
    - Retrieve historical data for an output.

### Cross-entity search
15. `GET /v3/search/{entityType}/`
    - Query CORE entities with GET search syntax.
16. `POST /v3/search/{entityType}`
    - Query CORE entities with a JSON request body.
17. `POST /v3/search/{entityType}/aggregate`
    - Aggregate entity results.

### Works
18. `GET /v3/works/{identifier}`
    - Get one work.
19. `GET /v3/works/{identifier}/outputs`
    - Get outputs related to a work.
20. `GET /v3/works/{identifier}/stats`
    - Get work statistics.
21. `GET /v3/works/tei/{identifier}`
    - Download the parsed work as TEI.
22. `GET /v3/works/{identifier}/download`
    - Download the work file.

## Core parameters and payload notes
### Auth parameters
- `api_key` - official query-string authentication scheme
- `Authorization` header bearer-token form - official header authentication scheme

### Search parameters confirmed in the OpenAPI document
For `GET /v3/search/{entityType}/`:
- `entityType` - required path enum: `works`, `outputs`, `data-providers`, `journals`
- `q` - required query string for the search language
- `scroll` - enables scroll pagination for result sets larger than 10,000 items
- `offset` - pagination offset
- `limit` - max number of results to return
- `stats` - include statistics in the response

### Entity-scoped search parameters confirmed in the OpenAPI document
For `GET /v3/data-providers/{identifier}/outputs`:
- `identifier` - provider identifier or documented alternate identifier form where applicable
- `q` - search query
- `offset` - pagination offset
- `sort` - sort field/order
- `limit` - result limit

### POST body usage
- `POST /v3/search/{entityType}` accepts JSON request bodies for search operations.
- `POST /v3/search/{entityType}/aggregate` accepts JSON request bodies with aggregation directives.
- `POST /v3/discover`, `POST /v3/recommend`, and `POST /v3/labs/expert-finder` are request-body-driven operations.
- `POST /v3/data-providers/{identifier}/stats` also uses a JSON request body.

## Response notes
- The Redoc/OpenAPI pages document JSON responses as the default API payload format.
- Identifier lookups frequently expose `200` and `404` response families.
- Download-oriented endpoints are distinct from metadata endpoints and should not be normalized as plain JSON-only calls.
- The service page highlights large-result workflows and points users to scroll-search patterns for bulk extraction.

## Error notes
Documented response codes in the reviewed official reference include:
- `200` - success
- `404` - not found on many identifier-based routes and on some recommendation/lab operations
The OpenAPI document is sparse on broader error taxonomy beyond those explicitly listed route-by-route.

## Usage notes
- Treat `search`, `works`, `outputs`, `journals`, and `data-providers` as separate route families.
- Preserve the entity type enum exactly as documented: `works`, `outputs`, `data-providers`, `journals`.
- Use scroll search rather than offset-only pagination for very large harvests.
- Expect API-key usage even though the service page also markets a free unregistered tier.

## fireROUTE normalization notes
- Preserve the `/v3` prefix in all normalized routes.
- Keep GET-search and POST-search as distinct operations; they are not interchangeable wire contracts.
- Keep download/raw/TEI endpoints separate from metadata lookups.
- Preserve `q`, `scroll`, `offset`, `limit`, and `stats` as first-class query parameters.
- Preserve API-key delivery mode choice (query vs bearer header) in adapter configuration.