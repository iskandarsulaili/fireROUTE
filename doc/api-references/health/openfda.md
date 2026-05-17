# openFDA

## Provider metadata
- Category: `Health`
- Provider slug: `openfda`
- Official docs/pages used:
  - `https://open.fda.gov/apis/`
  - `https://open.fda.gov/apis/authentication/`
  - `https://open.fda.gov/apis/query-parameters/`
  - `https://open.fda.gov/apis/paging/`
  - `https://open.fda.gov/apis/drug/label/how-to-use-the-endpoint/`
- Current public API base URL: `https://api.fda.gov`
- Auth model: API key recommended/required by docs via `api_key` query parameter; docs also allow the API key to be sent as the Basic-auth username over HTTPS
- Response format: JSON
- Transport requirement: official docs require `https://api.fda.gov`
- Standard rate limits from official docs:
  - without API key: `240 requests/minute` and `1,000 requests/day` per IP
  - with API key: `240 requests/minute` and `120,000 requests/day` per key
- Query model: Elasticsearch-style read-only search API
- Manually confirmed route count: `28`

## Authentication
The official authentication page says an API key is required to make calls to openFDA.

Documented auth methods:
- query parameter: `api_key`
- alternatively, the API key may be provided as the Basic-auth username

Official example pattern:
- `https://api.fda.gov/drug/event.json?api_key=YOUR_API_KEY&search=...`

## Common query parameters
The official `Query parameters` page says openFDA supports five core query parameters across endpoints:
- `search` - filter records by field/value criteria; if no field is supplied, the API searches across fields
- `sort` - sort results using `:asc` or `:desc`
- `count` - aggregate unique values for a field; docs say the API returns the `1000` most frequent values by default
- `limit` - number of returned records; official maximum is `1000`
- `skip` - offset into matching records; official maximum is `25000`

Additional pagination guidance from the official paging page:
- `skip` + `limit` can page through up to `26,000` hits in the standard model
- for larger result sets, the docs recommend dataset downloads or the documented `search_after` flow exposed through the `Link` header

## Response and error notes
The API basics page says responses have two top-level sections:
- `meta` - metadata about the query, disclaimer, license link, last-updated date, total matching records when applicable
- `results` - array of matching records

The docs also publish:
- JSON responses by default
- HTTP error status codes in the `400`-`500` range on failure
- JSON error bodies for endpoint-level errors

## Canonical endpoint families
All endpoint families reviewed from the official openFDA API index are read-only `GET` JSON endpoints.

### Animal & Veterinary
1. `GET /animalandveterinary/event.json`

### Cosmetic
2. `GET /cosmetic/event.json`

### Device
3. `GET /device/510k.json`
4. `GET /device/classification.json`
5. `GET /device/covid19serology.json`
6. `GET /device/enforcement.json`
7. `GET /device/event.json`
8. `GET /device/pma.json`
9. `GET /device/recall.json`
10. `GET /device/registrationlisting.json`
11. `GET /device/udi.json`

### Drug
12. `GET /drug/drugsfda.json`
13. `GET /drug/drugshortages.json`
14. `GET /drug/enforcement.json`
15. `GET /drug/event.json`
16. `GET /drug/label.json`
17. `GET /drug/ndc.json`

### Food
18. `GET /food/enforcement.json`
19. `GET /food/event.json`

### Other
20. `GET /other/historicaldocument.json`
21. `GET /other/nsde.json`
22. `GET /other/substance.json`
23. `GET /other/unii.json`

### Tobacco
24. `GET /tobacco/problem.json`
25. `GET /tobacco/researchdigitalads.json`
26. `GET /tobacco/researchpreventionads.json`
27. `GET /tobacco/researchsmokefree.json`

### Transparency
28. `GET /transparency/completeresponseletters.json`

## Endpoint usage pattern
The official `How to use the API` page for product labeling shows the generic pattern used across openFDA:
- base endpoint plus a dataset route such as `/drug/label.json`
- optional query parameters such as `search`, `limit`, and `api_key`

Example published by the docs:
- `https://api.fda.gov/drug/label.json?search=drug_interactions:caffeine&limit=5`

## Parameter notes for fireROUTE
- openFDA does not publish one global OpenAPI file on the reviewed pages; instead it documents dataset-specific JSON endpoints plus shared query semantics.
- The most important normalization fields are the shared query parameters (`search`, `sort`, `count`, `limit`, `skip`) and the dataset route itself.
- Dataset schemas differ substantially by route family, so downstream adapters should preserve the selected dataset path as an explicit dimension.
- The docs explicitly warn that openFDA data are not validated for clinical or production medical decision-making.

## Pagination and large-result notes
- Standard offset paging is documented with `skip` and `limit`
- `limit <= 1000`
- `skip <= 25000`
- Standard paging can traverse up to `26,000` hits
- For larger sets, official docs point users to downloads or `search_after`

## fireROUTE normalization notes
- Treat openFDA as a family of read-only dataset endpoints under one host rather than one monolithic schema.
- Preserve the dataset family in routing, for example `drug/label` vs `device/event` vs `food/enforcement`.
- Preserve raw search syntax because official queries are field-expression based and dataset-specific.
- Map auth to query-string `api_key` by default, with optional alternate Basic-auth username support if needed.