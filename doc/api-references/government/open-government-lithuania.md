# Open Government, Lithuania

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-lithuania`
- Official docs pages used:
  - index URL from the government catalog: `https://data.gov.lt/public/api/1`
  - official alternative API reference linked from that page: `https://data.gov.lt/partner/api/1/`
  - downloadable official OpenAPI document: `https://data.gov.lt/partner/api/1/?format=openapi`
- Current documented API base URLs:
  - `https://data.gov.lt/partner/api/1`
  - `https://data.gov.lt/uapi/datasets/gov/vssa/ror/dcat`
- Auth model: the official partner API reference says requests use `Authorization: ApiKey MYKEY` and that API keys are obtained by contacting IVPK/VSSA support
- Request/response format: the downloadable official Swagger document advertises `application/json` for both `consumes` and `produces`
- Multipart/form-data note: two dataset-structure creation endpoints explicitly require `file` and `title` form-data fields
- Manually confirmed canonical route count: `51` operations across the official partner API and UAPI paths exposed by the official downloadable OpenAPI document

## Official usage notes
- The public API landing page at `/public/api/1/` is a real official page but does not expose a usable route inventory in the visible page content.
- That same official site links to `/partner/api/1/`, which provides the route inventory in Redoc and exposes an official downloadable OpenAPI document.
- The official description says the API is used to query the semantic database behind data.gov.lt.
- The official description says the API currently covers catalog lists, category lists, licence lists, dataset lists, single-dataset metadata, and dataset distributions.
- The official docs show this auth example: `curl -H "Authorization: ApiKey MYKEY" https://data.gov.lt/partner/api/1/ENDPOINT`.

## Authentication, parameters, and request notes
Most common documented parameters in the official Swagger document:
- Header `Authorization`
  - documented on `29` operations
  - example/default shown by the docs: `ApiKey MY_KEY`
- Body `data`
  - documented on `17` write operations for dataset, distribution, and task creation/update payloads
- Path identifiers
  - `internalId`
  - `datasetId`
  - `distributionId`
  - `structureId`
  - `objectId`
  - UAPI-specific IDs such as `agreement_id`, `agreement_file_uuid`, and generic `id`
- Multipart/form-data upload parameters
  - `file` - required for structure upload endpoints
  - `title` - required for structure upload endpoints

The official docs do not publish a formal `securitySchemes` object in the Swagger file, but the textual documentation clearly states the API key requirement and header name.

## Pagination, errors, and format notes
- No pagination section or page-size contract is described in the partner API reference used here.
- The official Swagger document advertises JSON requests and JSON responses.
- Response codes found across the official operations:
  - `200` on `37` operations
  - `201` on `7` operations
  - `204` on `7` operations
- No explicit rate-limit policy, throttling headers, or retry/backoff guidance were published on the official public API page, partner API page, or downloadable OpenAPI document reviewed here.

## Canonical endpoint inventory from the official OpenAPI document

### Catalogs - 1 route
1. `GET /partner/api/1/catalogs`

### Categories - 1 route
2. `GET /partner/api/1/categories`

### Licences - 1 route
3. `GET /partner/api/1/licences`

### Dataset retrieval - 9 routes
4. `GET /partner/api/1/datasets`
5. `GET /partner/api/1/datasets/id/{internalId}`
6. `GET /partner/api/1/datasets/id/{internalId}/distributions`
7. `GET /partner/api/1/datasets/id/{internalId}/distributions/{distributionId}`
8. `GET /partner/api/1/datasets/id/{internalId}/structure`
9. `GET /partner/api/1/datasets/{datasetId}`
10. `GET /partner/api/1/datasets/{datasetId}/distributions`
11. `GET /partner/api/1/datasets/{datasetId}/distributions/{distributionId}`
12. `GET /partner/api/1/datasets/{datasetId}/structure`

### Dataset creation / add flows - 7 routes
13. `POST /partner/api/1/datasets`
14. `POST /partner/api/1/datasets/id/{internalId}/distributions`
15. `PUT /partner/api/1/datasets/id/{internalId}/distributions`
16. `POST /partner/api/1/datasets/id/{internalId}/structure`
17. `POST /partner/api/1/datasets/{datasetId}/distributions`
18. `PUT /partner/api/1/datasets/{datasetId}/distributions`
19. `POST /partner/api/1/datasets/{datasetId}/structure`

### Dataset update flows - 4 routes
20. `PATCH /partner/api/1/datasets/id/{internalId}`
21. `PATCH /partner/api/1/datasets/id/{internalId}/distributions/{distributionId}`
22. `PATCH /partner/api/1/datasets/{datasetId}`
23. `PATCH /partner/api/1/datasets/{datasetId}/distributions/{distributionId}`

### Dataset delete flows - 6 routes
24. `DELETE /partner/api/1/datasets/id/{internalId}`
25. `DELETE /partner/api/1/datasets/id/{internalId}/distributions/{distributionId}`
26. `DELETE /partner/api/1/datasets/id/{internalId}/structure/{structureId}`
27. `DELETE /partner/api/1/datasets/{datasetId}`
28. `DELETE /partner/api/1/datasets/{datasetId}/distributions/{distributionId}`
29. `DELETE /partner/api/1/datasets/{datasetId}/structure/{structureId}`

### Distribution helpers, uploadable distributions, and tasks - 9 routes
30. `POST /partner/api/1/distribution/id/{distributionId}/create-distribution/`
31. `GET /partner/api/1/distribution/id/{distributionId}/tabular-data/`
32. `GET /partner/api/1/distributions/`
33. `POST /partner/api/1/distributions/`
34. `POST /partner/api/1/downloads`
35. `GET /partner/api/1/tasks/{objectId}/`
36. `POST /partner/api/1/tasks/{objectId}/`
37. `PATCH /partner/api/1/tasks/{objectId}/`
38. `DELETE /partner/api/1/tasks/{objectId}/`

### UAPI surface exposed in the same official OpenAPI document - 13 routes
39. `GET /uapi/datasets/gov/vssa/ror/dcat/Agent/`
40. `GET /uapi/datasets/gov/vssa/ror/dcat/Agreement/`
41. `PUT /uapi/datasets/gov/vssa/ror/dcat/Agreement/{agreement_id}/sync-done/`
42. `GET /uapi/datasets/gov/vssa/ror/dcat/AgreementFile/{agreement_file_uuid}/file/`
43. `POST /uapi/datasets/gov/vssa/ror/dcat/Connection/check`
44. `GET /uapi/datasets/gov/vssa/ror/dcat/Dataset/`
45. `POST /uapi/datasets/gov/vssa/ror/dcat/Dataset/`
46. `GET /uapi/datasets/gov/vssa/ror/dcat/Dataset/{id}/dsa/`
47. `POST /uapi/datasets/gov/vssa/ror/dcat/Dataset/{id}/dsa/`
48. `PUT /uapi/datasets/gov/vssa/ror/dcat/Dataset/{id}/dsa/`
49. `GET /uapi/datasets/gov/vssa/ror/dcat/Distribution/`
50. `POST /uapi/datasets/gov/vssa/ror/dcat/Distribution/`
51. `GET /uapi/datasets/gov/vssa/ror/dcat/Version/`

## Important caveats from the official docs
- The downloadable Swagger file mixes the partner API and a UAPI surface in one official document.
- The public landing page used in the provider index still points at `/public/api/1/`, but the actual usable route inventory comes from the official linked `/partner/api/1/` reference.
- The official docs document authentication textually rather than through a structured Swagger security block, so adapters should preserve the exact header format shown in the docs.

## fireROUTE integration notes
- This provider is not purely public despite the original index metadata; the official docs require an API key for much of the partner API surface.
- For write-capable operations, preserve the official request bodies as raw upstream payloads because the docs center on provider-native metadata objects rather than a stable cross-provider schema.
- Keep `/partner/api/1/...` and `/uapi/...` as separate route families in fireROUTE because they represent distinct official surfaces with different path conventions.
