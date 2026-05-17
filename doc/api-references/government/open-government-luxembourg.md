# Open Government, Luxembourg

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-luxembourg`
- Official docs/pages used:
  - `https://data.public.lu/en`
  - `https://data.public.lu/en/pages/api-tutorial`
  - `https://data.public.lu/en/docapi/`
  - `https://data.public.lu/api/1/swagger.json`
- Current documented API base URL: `https://data.public.lu/api/1`
- Auth model: read access is public; write operations require an API key in the `X-API-KEY` header
- Request format: JSON for standard write calls; some upload routes use multipart form uploads
- Response formats: JSON for the main API, plus RDF exports on selected dataset, dataservice, and organization routes
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `139` unique path templates
- Additional inventory note: the current official Swagger document exposes `204` documented HTTP operations across those `139` path templates

## Official usage notes
- The official tutorial describes this as the free and open API for data.public.lu.
- The official API reference page is a degraded but still usable Swagger UI view that exposes the current route inventory and points to the live Swagger document.
- The official tutorial says write operations require authentication plus an API key from the user profile settings.
- The reviewed documentation exposes both a machine-readable Swagger document and a browsable route reference, making this the current canonical source for Luxembourg portal routes.

## Auth, pagination, format, and error notes
- Writing requires `X-API-KEY`.
- The Swagger document publishes an `apikey` security definition with header name `X-API-KEY`.
- The official tutorial says paginated list responses use a `Page` object and expose `page`, `page_size`, `next_page`, and `previous_page`.
- The most common documented parameters in the Swagger file are:
  - header `X-Fields` for sparse-field selection
  - query `page`
  - query `page_size`
  - query `q`
  - query `sort`
  - query `size`
  - form-data `file` on upload routes
- The Swagger document advertises these response codes across the live route inventory:
  - `200` on `171` operations
  - `201` on `13` operations
  - `204` on `11` operations
  - `400` on `28` operations
  - `403` on `13` operations
  - `404` on `29` operations
  - `409` on `1` operation
  - `410` on `19` operations
  - `415` on `4` operations
- No official rate-limit ceiling, quota window, or retry guidance was published on the reviewed pages.

## Route-family inventory from the official Swagger document
- `datasets`: `28` path templates
- `organizations`: `19` path templates
- `reuses`: `12` path templates
- `site`: `11` path templates
- `harvest`: `11` path templates
- `me`: `10` path templates
- `dataservices`: `7` path templates
- `spatial`: `7` path templates
- `users`: `7` path templates
- `discussions`: `5` path templates
- `posts`: `4` path templates
- `workers`: `4` path templates
- `reports`: `3` path templates
- `contacts`: `2` path templates
- `spam`: `2` path templates
- `topics`: `2` path templates
- `transfer`: `2` path templates
- `avatars`: `1` path template
- `notifications`: `1` path template
- `tags`: `1` path template

## Canonical endpoint paths confirmed from official docs

### site
- `GET /activity`
- `GET /oembed`
- `GET /oembeds/`
- `GET /site/`
- `GET /site/catalog`
- `GET /site/catalog.{format}`
- `GET /site/context.jsonld`
- `GET /site/data.{format}`
- `GET /territory/suggest/`
- `GET/PUT /site/home/datasets/`
- `GET/PUT /site/home/reuses/`

### avatars
- `GET /avatars/{identifier}/{size}`

### contacts
- `DELETE/GET/PUT /contacts/{contact_point}/`
- `POST /contacts/`

### dataservices
- `DELETE /dataservices/{dataservice}/datasets/{dataset}/`
- `DELETE/GET/PATCH /dataservices/{dataservice}/`
- `DELETE/GET/POST /dataservices/{id}/followers/`
- `GET /dataservices/{dataservice}/rdf`
- `GET /dataservices/{dataservice}/rdf.{format}`
- `GET/POST /dataservices/`
- `POST /dataservices/{dataservice}/datasets/`

### datasets
- `DELETE /datasets/{dataset}/badges/{badge_kind}/`
- `DELETE/GET/POST /datasets/{id}/followers/`
- `DELETE/GET/PUT /datasets/community_resources/{community}/`
- `DELETE/GET/PUT /datasets/{dataset}/`
- `DELETE/GET/PUT /datasets/{dataset}/resources/{rid}/`
- `DELETE/POST /datasets/{dataset}/featured/`
- `GET /datasets/badges/`
- `GET /datasets/extensions/`
- `GET /datasets/frequencies/`
- `GET /datasets/licenses/`
- `GET /datasets/original/`
- `GET /datasets/r/{id}`
- `GET /datasets/resource_types/`
- `GET /datasets/schemas/`
- `GET /datasets/suggest/`
- `GET /datasets/suggest/formats/`
- `GET /datasets/suggest/mime/`
- `GET /datasets/{dataset}/rdf`
- `GET /datasets/{dataset}/rdf.{format}`
- `GET /datasets/{dataset}/resources/{rid}/check/`
- `GET/POST /datasets/`
- `GET/POST /datasets/community_resources/`
- `POST /datasets/community_resources/{community}/upload/`
- `POST /datasets/{dataset}/badges/`
- `POST /datasets/{dataset}/resources/{rid}/upload/`
- `POST /datasets/{dataset}/upload/`
- `POST /datasets/{dataset}/upload/community/`
- `POST/PUT /datasets/{dataset}/resources/`

### discussions
- `DELETE /discussions/{id}/comments/{cidx}`
- `DELETE /discussions/{id}/comments/{cidx}/spam`
- `DELETE /discussions/{id}/spam/`
- `DELETE/GET/POST /discussions/{id}/`
- `GET/POST /discussions/`

### harvest
- `DELETE/GET/PUT /harvest/source/{ident}`
- `DELETE/POST /harvest/source/{ident}/schedule`
- `GET /harvest/backends`
- `GET /harvest/job/{ident}/`
- `GET /harvest/job_status`
- `GET /harvest/source/{ident}/jobs/`
- `GET /harvest/source/{ident}/preview`
- `GET/POST /harvest/sources/`
- `POST /harvest/source/preview`
- `POST /harvest/source/{ident}/run`
- `POST /harvest/source/{ident}/validate`

### me
- `DELETE/GET/PUT /me/`
- `DELETE/POST /me/apikey`
- `GET /me/datasets/`
- `GET /me/metrics/`
- `GET /me/org_community_resources/`
- `GET /me/org_datasets/`
- `GET /me/org_discussions/`
- `GET /me/org_reuses/`
- `GET /me/reuses/`
- `POST /me/avatar`

### notifications
- `GET /notifications/`

### organizations
- `DELETE /organizations/{org}/badges/{badge_kind}/`
- `DELETE/GET/POST /organizations/{id}/followers/`
- `DELETE/GET/PUT /organizations/{org}/`
- `DELETE/POST/PUT /organizations/{org}/member/{user}`
- `GET /organizations/badges/`
- `GET /organizations/roles/`
- `GET /organizations/suggest/`
- `GET /organizations/{org}/catalog`
- `GET /organizations/{org}/catalog.{format}`
- `GET /organizations/{org}/contacts/`
- `GET /organizations/{org}/datasets/`
- `GET /organizations/{org}/discussions/`
- `GET /organizations/{org}/reuses/`
- `GET/POST /organizations/`
- `GET/POST /organizations/{org}/membership/`
- `POST /organizations/{org}/badges/`
- `POST /organizations/{org}/membership/{id}/accept/`
- `POST /organizations/{org}/membership/{id}/refuse/`
- `POST/PUT /organizations/{org}/logo`

### posts
- `DELETE/GET/PUT /posts/{post}/`
- `DELETE/POST /posts/{post}/publish`
- `GET/POST /posts/`
- `POST/PUT /posts/{post}/image`

### reports
- `GET /reports/reasons/`
- `GET /reports/{report}/`
- `GET/POST /reports/`

### reuses
- `DELETE /reuses/{reuse}/badges/{badge_kind}/`
- `DELETE/GET/POST /reuses/{id}/followers/`
- `DELETE/GET/PUT /reuses/{reuse}/`
- `DELETE/POST /reuses/{reuse}/featured/`
- `GET /reuses/badges/`
- `GET /reuses/suggest/`
- `GET /reuses/topics/`
- `GET /reuses/types/`
- `GET/POST /reuses/`
- `POST /reuses/{reuse}/badges/`
- `POST /reuses/{reuse}/datasets/`
- `POST /reuses/{reuse}/image`

### spam
- `GET /spam/`
- `POST /spam/check`

### spatial
- `GET /spatial/coverage/{level}/`
- `GET /spatial/granularities/`
- `GET /spatial/levels/`
- `GET /spatial/zone/{id}/`
- `GET /spatial/zone/{id}/datasets/`
- `GET /spatial/zones/suggest/`
- `GET /spatial/zones/{ids}/`

### tags
- `GET /tags/suggest/`

### topics
- `DELETE/GET/PUT /topics/{topic}/`
- `GET/POST /topics/`

### transfer
- `GET/POST /transfer/`
- `GET/POST /transfer/{id}/`

### users
- `DELETE/GET/POST /users/{id}/followers/`
- `DELETE/GET/PUT /users/{user}/`
- `GET /users/roles/`
- `GET /users/suggest/`
- `GET /users/{user}/contacts/`
- `GET/POST /users/`
- `POST /users/{user}/avatar`

### workers
- `DELETE/GET/PUT /workers/jobs/{id}`
- `GET /workers/jobs/schedulables`
- `GET /workers/tasks/{id}`
- `GET/POST /workers/jobs/`

## fireROUTE normalization notes
- Treat `https://data.public.lu/api/1` as the canonical base URL for the Luxembourg portal API.
- Preserve `X-API-KEY` for write operations but do not require it for public catalogue reads.
- Preserve the distinction between JSON application routes and RDF export routes such as `/datasets/{dataset}/rdf`, `/dataservices/{dataservice}/rdf`, and organization/site catalog exports.
- Keep paginated collection routes separate from object routes because the official tutorial documents a shared `Page` envelope for list responses.
- Do not invent unpublished rate limits or extra auth requirements beyond the reviewed official tutorial and Swagger document.
