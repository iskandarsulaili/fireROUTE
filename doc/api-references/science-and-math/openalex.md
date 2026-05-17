# OpenAlex

## Provider metadata
- Category: `Science & Math`
- Provider slug: `openalex`
- Official docs/pages used:
  - `https://developers.openalex.org/api-reference/introduction`
  - `https://developers.openalex.org/api-reference/authentication`
  - `https://developers.openalex.org/api-reference/errors`
  - `https://developers.openalex.org/api-reference/rate-limits/check-rate-limit-status`
  - `https://developers.openalex.org/api-reference/openapi.json`
- Current public API base URL: `https://api.openalex.org`
- Auth model: the official docs instruct clients to send a free `api_key` as a query parameter, e.g. `?api_key=YOUR_KEY`
- Response format: JSON
- Manually confirmed route count: `43`

## Shared request model
### Core query parameters
- `api_key` - API key query parameter used across the API
- `filter` - field-based filtering
- `search` - full-text search
- `sort` - sort order
- `per_page` - page size; official docs say default `25`, max `100`
- `page` - basic page number
- `cursor` - deep-pagination cursor
- `sample` - random sample size
- `select` - limit returned fields
- `group_by` - aggregation field

### Common path parameters
- `id` - entity identifier or supported external ID form
- `entity_type` - entity kind for the autocomplete utility route

## Canonical endpoints
### Entity collection/detail routes
1. `GET /works`
2. `GET /works/{id}`
3. `GET /authors`
4. `GET /authors/{id}`
5. `GET /sources`
6. `GET /sources/{id}`
7. `GET /institutions`
8. `GET /institutions/{id}`
9. `GET /topics`
10. `GET /topics/{id}`
11. `GET /keywords`
12. `GET /keywords/{id}`
13. `GET /publishers`
14. `GET /publishers/{id}`
15. `GET /funders`
16. `GET /funders/{id}`
17. `GET /domains`
18. `GET /domains/{id}`
19. `GET /fields`
20. `GET /fields/{id}`
21. `GET /subfields`
22. `GET /subfields/{id}`
23. `GET /sdgs`
24. `GET /sdgs/{id}`
25. `GET /countries`
26. `GET /countries/{id}`
27. `GET /continents`
28. `GET /continents/{id}`
29. `GET /languages`
30. `GET /languages/{id}`
31. `GET /awards`
32. `GET /awards/{id}`
33. `GET /concepts`
34. `GET /concepts/{id}`
35. `GET /work-types`
36. `GET /source-types`
37. `GET /institution-types`
38. `GET /licenses`

### Utility routes
39. `GET /autocomplete/{entity_type}`
40. `GET /text/topics`
41. `GET /rate-limit`
42. `GET /changefiles`
43. `GET /changefiles/{date}`

## Entity and operation notes from the official introduction page
- The API is organized around entity families including works, authors, sources, institutions, topics, keywords, publishers, funders, awards, domains, fields, subfields, SDGs, countries, continents, languages, and several type/enumeration collections.
- The official docs describe a common operation pattern for entity collections:
  - `GET /{entities}` for list
  - `GET /{entities}/{id}` for single-item lookup
  - `GET /{entities}?filter=...` for filtered queries
  - `GET /{entities}?search=...` for keyword search
  - `GET /{entities}?group_by=...` for aggregation

## External-ID lookup notes
The official introduction page explicitly documents identifier-based lookups such as:
- `GET /works/https://doi.org/10.7717/peerj.4375`
- `GET /works/doi:10.7717/peerj.4375`
- `GET /authors/https://orcid.org/0000-0001-6187-6610`
- `GET /institutions/https://ror.org/0161xgx34`
- `GET /works/pmid:29456894`

## Pagination and limits
- Default `per_page`: `25`
- Maximum `per_page`: `100`
- Basic paging limit: `10,000` results
- For result sets larger than `10,000`, the official docs say to use cursor paging
- The auth/pricing page also documents:
  - up to `100` OR values per filter
  - maximum `sample` value `10,000`

## Rate limits and pricing notes
- The official docs describe the API as a freemium service with a free daily allowance of `$1` per API key
- The docs say you will receive `429 Too Many Requests` if you exceed your daily limit or make more than `100` requests per second
- Every response includes these headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Credits-Used`
  - `X-RateLimit-Reset`
- The dedicated rate-limit route is `GET /rate-limit`

## Response format notes
- List endpoints share a common top-level response structure with:
  - `meta`
  - `results`
  - `group_by`
- The docs explicitly describe:
  - `meta.count`
  - `meta.page`
  - `meta.per_page`
- The auth/pricing docs also show `meta.cost_usd` for cost-aware pagination planning

## Error notes
The official error-handling page documents these HTTP statuses:
- `200` success
- `301` moved permanently / merged entity redirect
- `400` bad request
- `403` forbidden / rate-limit condition in the official table
- `404` not found
- `429` too many requests
- `500` server error

Documented error body shape:
```json
{
  "error": "Invalid filter",
  "message": "Unknown filter field: author_name. Did you mean: authorships.author.id?"
}
```

## Important usage notes
- All reviewed routes in the official OpenAPI spec are `GET` routes.
- `GET /rate-limit` requires the API key and returns remaining daily allowance plus per-endpoint cost information.
- `GET /changefiles` and `GET /changefiles/{date}` expose the published changefile inventory separate from the core entity collections.
- `GET /concepts` and `GET /concepts/{id}` remain in the public spec, but the introduction page labels concepts as a legacy taxonomy and marks it deprecated.

## fireROUTE normalization notes
- Use `https://api.openalex.org` as the canonical base URL.
- Preserve OpenAlex query parameter names exactly as documented.
- Model the provider as one family of read-only GET endpoints with consistent collection/detail/filter/search/grouping patterns.
- Keep external-ID lookups on the native `{id}` route rather than splitting DOI/ORCID/ROR/PMID into separate synthetic routes.