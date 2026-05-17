# Open Government, Estonia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-estonia`
- Official docs/pages used:
  - `https://avaandmed.eesti.ee/instructions/opendata-dataset-api` -> redirected during this run to `https://andmed.eesti.ee/instructions/opendata-dataset-api`
  - `https://andmed.eesti.ee/`
  - `https://abi.ria.ee/teabevarav/`
  - `https://abi.ria.ee/teabevarav/atv-mirroring-jobs-api-v2`
  - `https://andmed.eesti.ee/api/dataset-docs#/`
  - `https://andmed.eesti.ee/api/dataset-docs/json`
- Current documented API host: `https://andmed.eesti.ee`
- Current documented API path prefix: `/api`
- Auth model:
  - public catalogue/core read routes work anonymously
  - write and organization-scoped routes require bearer auth obtained from `POST /api/auth/key-login`
  - the official help page says `X-API-KEY` must be `base64(apiKeyId:apiKey)` and that generated API keys expire after one year
- Response format: JSON for the reviewed REST routes; file-upload routes use `multipart/form-data`
- Manually confirmed canonical route count: `45`

## Official usage notes
- The originally assigned page no longer exposes a route-level document by itself; during this run it resolved to the current `andmed.eesti.ee` portal and the official RIA help center plus Swagger UI provided the usable API reference.
- The Swagger UI identifies the surface as `Data Dataset API` version `1.0.1`.
- The official English intro says the API is meant for creating, updating, and discarding datasets and for automating metadata and file handling.
- The same official docs distinguish between public catalogue/core routes and authenticated organization/mirroring routes.
- Although the OpenAPI spec marks some public dataset routes with bearer security, live checks during this run showed the reviewed public read routes worked without credentials.

## Canonical endpoints confirmed from the official Swagger document

### Generic datasets v2
1. `GET /api/v2/datasets/search`
2. `GET /api/v2/datasets/{dataset_identifier}`
3. `GET /api/v2/datasets/{dataset_identifier}/files/{fileId}`
4. `GET /api/v2/datasets/{dataset_identifier}/distribution/{distributionId}/file/preview`
5. `GET /api/v2/datasets/{dataset_identifier}/distribution/{distributionId}/file/download-url`
6. `GET /api/v2/datasets/{dataset_identifier}/distribution/{distributionId}/file`
7. `POST /api/v2/datasets/{dataset_identifier}/distribution/{distributionId}/file`
- Official purpose:
  - search/read published datasets
  - inspect processed file contents
  - preview or download distribution files
- Key documented path parameters across this family:
  - `dataset_identifier` - UUID
  - `distributionId` - UUID
  - `fileId` - UUID

### Generic datasets v3
8. `GET /api/v3/datasets/search`
9. `GET /api/v3/datasets/{dataset_identifier}`
- Key query parameters on `/v3/datasets/search` from the OpenAPI spec:
  - `lang` - `et` or `en`, default `et`
  - `page` - default `1`
  - `limit` - default `20`, max `75`
  - `search`
  - `odd`
  - `hvd`
  - `itsnap`
  - `informationHolderSlug`
  - `type`
  - `mimetypes`
  - `emsCategoryIds`
  - `keywordIds`
  - `regionIds`
  - `year`
  - `applicableLegislation`
  - `dataLabels`
  - `dataLabelIds`
  - `sortBy`
  - `sortOrder` - `ASC` or `DESC`
- Live confirmation:
  - `GET https://andmed.eesti.ee/api/v3/datasets/search?page=1&limit=1` returned HTTP `200` JSON without auth during this run

### Organization's datasets v3
10. `GET /api/v3/organizations/my-organizations/{id}/datasets`
11. `GET /api/v3/organizations/my-organizations/{id}/datasets/{dataset_identifier}`
- Official notes:
  - both routes are organization-scoped and documented behind bearer auth
  - `id` is an organization UUID

### Organization's datasets v2
12. `GET /api/v2/organizations/my-organizations/{id}/datasets`
13. `GET /api/v2/organizations/my-organizations/{id}/datasets/basic`
14. `GET /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}`
15. `POST /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}/upload`
16. `POST /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}/file-upload`
17. `GET /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}/files`
18. `PUT /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}/distribution/{distributionId}/file`
19. `DELETE /api/v2/organizations/my-organizations/{id}/datasets/{dataset_identifier}/files/{fileId}`
- Official usage notes from the Swagger intro:
  - `POST /upload` uploads a file directly to the Data Portal server and returns a file id
  - uploaded files can then be used for later file operations, and a distribution is generated automatically
  - the `PUT .../distribution/{distributionId}/file` route replaces an attached distribution file
- Key documented request formats:
  - `/upload` and `/file-upload` use `multipart/form-data`

### Data vocabularies v2
20. `GET /api/v2/data-vocabularies`
21. `GET /api/v2/data-vocabularies/{dataVocabularyId}`

### Business glossaries v2
22. `GET /api/v2/business-glossaries`
23. `GET /api/v2/business-glossaries/{businessGlossaryId}`

### Images v2
24. `GET /api/v2/images/{imageId}`

### Organizations v2
25. `GET /api/v2/organizations/my-organizations/{id}/distributions`
26. `GET /api/v2/organizations/my-organizations/{id}/distributions/{distributionId}`
27. `GET /api/v2/organizations/my-organizations/{id}/data-services`
28. `GET /api/v2/organizations/my-organizations/{id}/data-service/{dataServiceId}`
29. `GET /api/v2/organizations/my-organizations/{id}/series`
30. `GET /api/v2/organizations/my-organizations/{id}/series/{seriesId}`
31. `GET /api/v2/organizations/my-organizations/{id}/business-glossaries`
32. `GET /api/v2/organizations/my-organizations/{id}/business-glossary/{businessGlossaryId}`
33. `GET /api/v2/organizations/my-organizations/{id}/data-vocabularies`
34. `GET /api/v2/organizations/my-organizations/{id}/data-vocabulary/{dataVocabularyId}`
35. `GET /api/v2/organizations/my-organizations/{id}/dataset-fields/{dataset_identifier}`
- Official purpose:
  - browse an authenticated organization's distributions, data services, series, glossaries, vocabularies, and dataset field/data-element descriptions

### Core v2
36. `GET /api/v2/core/categories`
37. `GET /api/v2/core/ems-categories`
38. `GET /api/v2/core/keywords`
39. `GET /api/v2/core/internal-lists`
40. `GET /api/v2/core/ems-themes`
41. `GET /api/v2/core/classifiers/{classifier}`
- Official purpose:
  - retrieve classifier values, themes, categories, keywords, and internal lists used when creating/updating records
- Key documented parameters:
  - `/v2/core/classifiers/{classifier}` takes path parameter `classifier` plus optional `lang=et|en`
- Live confirmation:
  - `GET https://andmed.eesti.ee/api/v2/core/internal-lists` returned HTTP `200` JSON without auth during this run

### Authentication
42. `POST /api/auth/key-login`
- Official purpose:
  - exchange an API key for an access token
- Official parameters:
  - required header `X-API-KEY`
- Official auth notes from the help page:
  - the header must be a base64-encoded `apiKeyId:apiKey` pair
  - returned token lifetime is about `10-15` minutes
  - API key lifetime is one year

### Mirroring Jobs
43. `POST /api/organizations/my-organizations/{id}/mirroring-jobs`
44. `GET /api/organizations/my-organizations/{id}/mirroring-jobs`
45. `GET /api/organizations/my-organizations/{id}/mirroring-jobs/{jobId}`
- Official purpose from the help-center document:
  - create asynchronous mirroring jobs that create, update, or delete datasets, distributions, series, data services, data dictionaries, business dictionaries, and data elements
- Official parameters/body notes:
  - path parameter `id` is the organization UUID
  - `POST` body is `MirroringJobDto` JSON
  - action values are `create`, `update`, or `delete`
  - the document says job statuses are `PENDING` and `COMPLETED`; operation statuses are `PENDING`, `COMPLETED`, and `FAILED`

## Pagination, filtering, and format notes
- `/api/v3/datasets/search` uses page-based pagination with `page` and `limit`; the official spec sets default `page=1`, default `limit=20`, and maximum `limit=75`.
- The v3 search route also documents extensive filtering and sorting controls including HVD/ITSNAP flags, theme/category/keyword filters, mime-type filters, year filtering, legislation filtering, and `sortOrder`.
- The authenticated organization routes are largely identifier-based collection/detail endpoints rather than free-form search surfaces.
- File upload routes use `multipart/form-data`.
- Core/classifier endpoints provide lookup lists intended to supply valid ids/codes for write workflows.
- The reviewed routes return JSON payloads; image/file endpoints are explicitly file-oriented.

## Error, auth, and access notes
- The official Swagger document consistently advertises combinations of `200`/`201`, `400`, `401`, `404`, and `500` across the reviewed operations.
- The official help-center page says only authorized users may use the locked routes.
- A live unauthenticated request to `GET https://andmed.eesti.ee/api/v2/organizations/my-organizations/00000000-0000-0000-0000-000000000000/datasets` returned HTTP `401` with JSON `{"message":"Unauthorized","statusCode":401}`.
- The same run confirmed public core and dataset-search reads worked without credentials.
- The official docs did not publish any rate-limit or quota policy.
- The official introduction includes a legal notice that re-users must comply with GDPR conditions when open data contains personal data.

## Live behavior confirmed in this run
- `GET /api/v3/datasets/search?page=1&limit=1` -> `200` JSON without auth
- `GET /api/v2/core/internal-lists` -> `200` JSON without auth
- `GET /api/v2/organizations/my-organizations/{id}/datasets` without auth -> `401 Unauthorized`

## fireROUTE integration notes
- Treat `https://andmed.eesti.ee/api` as the canonical base URL.
- Preserve the split between anonymous public discovery routes and authenticated organization-management routes.
- Implement auth as a two-step flow:
  - send `X-API-KEY: base64(apiKeyId:apiKey)` to `POST /api/auth/key-login`
  - then send `Authorization: Bearer <token>` to locked endpoints
- Use the Core endpoints to resolve valid classifier/category/theme/keyword ids before constructing mirroring payloads.
- For public read integrations, prefer the v3 dataset routes first because the official intro calls them out as the primary published-dataset listing surface.