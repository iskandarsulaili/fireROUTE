# Open Government, Norway

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-norway`
- Official docs/pages used:
  - `https://data.norge.no/dataservices`
  - `https://data.norge.no/nb/technical/api`
  - `https://data.norge.no/nb/technical/api/search`
  - `https://data.norge.no/nb/technical/api/ai-search`
  - `https://data.norge.no/nb/technical/api/sparql`
  - `https://data.norge.no/nb/technical/api/resource-service`
  - `https://data.norge.no/nb/technical/api/catalog-view`
  - `https://raw.githubusercontent.com/Informasjonsforvaltning/catalog-view-api/main/openapi.yaml`
- Current documented API hosts:
  - `https://search.api.fellesdatakatalog.digdir.no`
  - `https://aisearch.api.fellesdatakatalog.digdir.no`
  - `https://sparql.fellesdatakatalog.digdir.no`
  - `https://resource.api.fellesdatakatalog.digdir.no`
  - `https://catalog-view.api.fellesdatakatalog.digdir.no`
- Current documented API path families:
  - `/search...`
  - `/llm`
  - `/v1/...`
  - `/catalogs/{catalogId}/concepts...`
- Auth model: public read access without auth for Search, AI Search, SPARQL, and Resource Service; `Catalog View` is protected with Maskinporten
- Response formats: JSON for Search and AI Search; SPARQL JSON/XML or RDF depending on query type; JSON and RDF for Resource Service; JSON for Catalog View
- Manually confirmed route count: `16`

## Official usage notes
- The reviewed technical documentation says Data.norge.no exposes several separate APIs rather than one single uniform catalogue endpoint.
- The official Search and AI Search pages both warn that those APIs are used internally by Data.norge.no and may change over time.
- The official Search API page publishes a rate limit of `10 requests per minute` with a burst limit of `20`.
- The official AI Search page publishes the same rate limit: `10 requests per minute` with a burst limit of `20`.
- The official Resource Service page publishes a rate limit of `5 requests per second` with a burst limit of `10`.
- The official SPARQL page says the endpoint is open for lookups, does not allow writes, and can return HTTP `429` when limits are exceeded, but it does not publish a numeric threshold.
- The official Catalog View page says only concept-catalog export is currently exposed and that access requires Maskinporten.

## Canonical endpoints confirmed from the official technical documentation
1. `POST /search`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: full-text search across all supported Data.norge.no resource types
   - Documented request body fields:
     - `query` - search string
     - `fields` - optional object controlling `title`, `description`, and `keyword`
     - `pagination.size` and `pagination.page`
     - `filters` - optional filter object
   - Official rate limit: `10 requests/minute`, burst `20`

2. `POST /search/datasets`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: dataset-only search
   - Request-body behavior follows the same search schema described for `/search`

3. `POST /search/data-services`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: data-service-only search
   - Request-body behavior follows the same search schema described for `/search`

4. `POST /search/concepts`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: concept-only search
   - Request-body behavior follows the same search schema described for `/search`

5. `POST /search/information-models`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: information-model-only search
   - Request-body behavior follows the same search schema described for `/search`

6. `POST /search/services`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: service-only search
   - Request-body behavior follows the same search schema described for `/search`

7. `POST /search/events`
   - Base URL: `https://search.api.fellesdatakatalog.digdir.no`
   - Purpose: event-only search
   - Request-body behavior follows the same search schema described for `/search`

8. `POST /llm`
   - Base URL: `https://aisearch.api.fellesdatakatalog.digdir.no`
   - Purpose: natural-language AI search over dataset metadata
   - Documented request body fields:
     - `query` - natural-language question
   - Official notes:
     - currently supports dataset resources only
     - public, no auth
     - rate limit `10 requests/minute`, burst `20`

9. `GET /?query={SPARQLQuery}`
   - Base URL: `https://sparql.fellesdatakatalog.digdir.no`
   - Purpose: execute URL-encoded SPARQL queries by query parameter
   - Query parameters:
     - `query` - required SPARQL query string
   - Official response notes:
     - `SELECT` and `ASK` return JSON or XML
     - `CONSTRUCT` and `DESCRIBE` return RDF

10. `POST /`
    - Base URL: `https://sparql.fellesdatakatalog.digdir.no`
    - Purpose: execute SPARQL queries in the request body to avoid URL-length limits
    - Official notes:
      - open for public lookups
      - no writes
      - HTTP `429` may be returned if limits are exceeded

11. `GET /v1/{resourceType}/{id}`
    - Base URL: `https://resource.api.fellesdatakatalog.digdir.no`
    - Purpose: fetch one catalog resource by internal FDK id
    - Supported `resourceType` values explicitly listed on the docs page:
      - `datasets`
      - `data-services`
      - `concepts`
      - `information-models`
      - `services`
      - `events`
    - Path parameters:
      - `id` - internal FDK resource id

12. `GET /v1/{resourceType}/by-uri`
    - Base URL: `https://resource.api.fellesdatakatalog.digdir.no`
    - Purpose: fetch one resource by RDF URI instead of internal id
    - Query parameters:
      - `uri` - required RDF subject URI
    - Supported `resourceType` values match the list above

13. `GET /v1/{resourceType}/{id}/graph`
    - Base URL: `https://resource.api.fellesdatakatalog.digdir.no`
    - Purpose: fetch one resource as an RDF graph by internal id
    - Path parameters:
      - `id` - internal FDK resource id
    - Supported RDF formats explicitly listed on the docs page:
      - `application/ld+json`
      - `text/turtle`
      - `application/rdf+xml`
      - `application/n-triples`
      - `application/n-quads`

14. `GET /v1/{resourceType}/by-uri/graph`
    - Base URL: `https://resource.api.fellesdatakatalog.digdir.no`
    - Purpose: fetch one resource as an RDF graph by RDF URI
    - Query parameters:
      - `uri` - required RDF subject URI
    - Supported `resourceType` values match the list above

15. `GET /catalogs/{catalogId}/concepts`
    - Base URL: `https://catalog-view.api.fellesdatakatalog.digdir.no`
    - Purpose: return all concepts in one organization's concept catalog
    - Auth: Maskinporten required
    - Path parameters:
      - `catalogId` - catalog id, usually the publishing organization id
    - Query parameters from the official OpenAPI file:
      - `changedAfter` - optional datetime filter
      - `domainCodes` - optional domain-code filter

16. `GET /catalogs/{catalogId}/concepts/{id}`
    - Base URL: `https://catalog-view.api.fellesdatakatalog.digdir.no`
    - Purpose: return one concept from a protected organizational catalog
    - Auth: Maskinporten required
    - Path parameters:
      - `catalogId` - catalog id, usually the publishing organization id
      - `id` - concept id

## Pagination, filtering, and format notes
- Search requests use JSON request bodies rather than query-string pagination.
- The Search API docs explicitly describe `pagination.size` and `pagination.page` as the pagination inputs.
- The Search API docs also describe field-selection controls (`title`, `description`, `keyword`) plus filter objects and aggregation output.
- SPARQL supports both GET query-string submission and POST request-body submission.
- The Resource Service defaults to JSON-LD when no `Accept` header is supplied on `/graph` routes.
- The Resource Service documentation distinguishes plain JSON resource fetches from RDF graph fetches.
- Catalog View returns JSON arrays or JSON concept documents according to the reviewed OpenAPI file.

## Error, rate-limit, and auth notes
- Search and AI Search both document HTTP `429` when rate limits are exceeded.
- Resource Service also documents HTTP `429` when the published rate limit is exceeded.
- SPARQL documents possible HTTP `429` responses but does not publish a numeric threshold on the reviewed page.
- The reviewed public docs did not publish a detailed cross-service HTTP error catalogue beyond the explicit `429` notes.
- Search, AI Search, SPARQL, and Resource Service are documented as public and unauthenticated.
- Catalog View is explicitly documented as Maskinporten-protected and intended for organizations retrieving their own registered descriptions.

## fireROUTE normalization notes
- Model this provider as a multi-surface platform rather than one monolithic API.
- Keep Search, AI Search, SPARQL, Resource Service, and Catalog View as separate integrations because they use different hosts, auth requirements, and request shapes.
- For Resource Service, preserve the `resourceType` vocabulary exactly as documented: `datasets`, `data-services`, `concepts`, `information-models`, `services`, and `events`.
- Treat Search and AI Search as public but unstable-by-provider-warning surfaces; avoid promising long-term path stability beyond the reviewed docs.