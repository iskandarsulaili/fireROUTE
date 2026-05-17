# OpenSanctions

## Provider metadata
- Category: `Open Data`
- Provider slug: `opensanctions`
- Official docs/pages used:
  - `https://www.opensanctions.org/docs/api/` (API getting-started page)
  - `https://www.opensanctions.org/docs/api/authentication/` (authentication reference)
  - `https://www.opensanctions.org/docs/api/matching/` (matching API overview)
  - `https://www.opensanctions.org/docs/api/entities/` (entities API reference)
  - `https://www.opensanctions.org/docs/api/search/` (search API reference)
- Current public API base URL: `https://api.opensanctions.org`
- Auth model: API key required for the hosted API
- Auth header: `Authorization: ApiKey <key>`
- Methods confirmed from the reviewed docs: `GET`, `POST`
- Response format: JSON
- Rate-limit notes: no numeric public rate limit was published on the reviewed docs pages
- Commercial/access notes:
  - the docs say OpenSanctions is free for non-commercial users
  - the docs say businesses must acquire a data license to use the dataset
  - the docs say free API keys are available for journalists, anti-corruption activists, and academic research projects related to sanctions policy
- Manually confirmed route count: `5`

## Canonical endpoints
1. `POST /match/{dataset}`
   - Query-by-example screening endpoint.
   - Official auth example uses `POST /match/default`.
2. `GET /search/{dataset}`
   - Keyword/faceted search endpoint.
   - Official search example uses `GET /search/default?q=Ilham%20Aliyev`.
3. `GET /entities/{id}`
   - Fetches a full nested entity record by canonical entity ID.
4. `GET /entities/{id}/adjacent`
   - Retrieves adjacent entities linked to the target entity.
5. `GET /entities/{id}/adjacent/{property}`
   - Filters adjacent-entity traversal to a specific relationship/property.

## Core parameters and request notes
### Matching API
- Path variable `{dataset}` scopes screening to a collection or dataset; the docs show `default` in the official example.
- Official request examples show JSON bodies shaped like:
  - top-level `queries`
  - query objects containing fields such as `schema` and `properties`
- The matching docs describe the response in terms of parsed `query` objects and ranked `results`.

### Search API
The search docs explicitly surface these query parameters:
- `q` - search query string
- `limit`
- `offset`
- `schema` - entity type filter; docs list examples including `Person`, `Company`, `Vessel`, `LegalEntity`, and `Asset`
- `sort` - docs show `first_seen:desc` as an example

Additional search notes from the docs:
- `{dataset}` may be a single source like `us_ofac_sdn` or a broader collection like `sanctions`, `peps`, or `default`.
- Search responses include facet aggregations for `countries`, `topics`, and `datasets`.
- The docs explicitly warn that `/search` is **not suitable for building a screening process** and recommend `/match` for that use case.

### Entities API
- `{id}` is the canonical entity identifier.
- The docs also show `nested=false` as a supported query switch for a flatter entity response.
- The reviewed entities docs show related retrieval patterns for adjacent entities under `/entities/{id}/adjacent...`.

## Response notes
- Hosted API examples are JSON.
- Entity responses include core fields such as:
  - `id`
  - `schema`
  - `properties`
  - `datasets`
  - `referents`
  - `target`
  - `first_seen`
  - `last_seen`
- Matching responses return ranked candidate matches.
- Search responses include both result lists and faceted aggregations.

## Error and operational notes
- The reviewed documentation pages do not publish a dedicated HTTP error-code table.
- The auth docs stress that API keys must be kept secret.
- The docs mention an OpenAPI JSON spec and an API console for further client generation/testing.

## Usage notes
- Use `/match/{dataset}` for sanctions/PEP screening workflows.
- Use `/search/{dataset}` for interactive search and faceted browsing, not for primary screening logic.
- Use `/entities/{id}` when a screening or search result needs expansion into a full record with sanctions, ownership, IDs, and relationships.
- There is also an on-premise deployment path documented separately for commercial-license customers.

## fireROUTE normalization notes
- Preserve dataset scoping in the route path for both `/match` and `/search`.
- Treat `/match` as POST+JSON and `/search` as GET+query-parameter search.
- Normalize `/entities/{id}` as the entity-detail route, with adjacency routes as relationship-expansion helpers.
- Always model hosted-API auth as `Authorization: ApiKey <key>`.
