# Open Government, France

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-france`
- Official docs/pages used:
  - `https://www.data.gouv.fr/`
  - `https://guides.data.gouv.fr/api-de-data.gouv.fr/prise-en-main`
  - `https://guides.data.gouv.fr/api-de-data.gouv.fr/reference`
  - `https://guides.data.gouv.fr/api-de-data.gouv.fr/reference/site`
  - `https://www.data.gouv.fr/api/1/swagger.json`
- Current documented API base URL: `https://www.data.gouv.fr/api/1`
- Demo base URL explicitly documented in the getting-started guide: `https://demo.data.gouv.fr/api/1/`
- Auth model: read access is public; write operations require an API key in the `X-API-KEY` header
- Response format: JSON for normal API calls; upload endpoints are documented as multipart file-upload routes and still return JSON
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `161`
- Additional inventory note: the current official Swagger document contains `228` documented HTTP operations across those `161` path templates

## Official usage notes
- The official getting-started guide says the API can perform the same actions available through the web platform, including creating datasets, describing resources, and adding or removing resources.
- The guide explicitly states that API permissions match the web interface permissions.
- The guide says datasets created through the API are public by default unless `private: true` is included in every relevant write call.
- The guide says object URLs can use either the permanent technical identifier or the slug, but the permanent identifier is safer for durable automation because slugs can change.
- The reference pages are auto-generated from the production API and therefore are the best current official source for route inventory.

## Auth, pagination, format, and error notes
- Writing requires `X-API-KEY` on `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- The guide says request bodies are JSON (`application/json`) except for file-upload endpoints, which accept `multipart/form-data`.
- Paginated responses use a common `Page` wrapper with `data`, `page`, `page_size`, `total`, `next_page`, and `previous_page`.
- The guide documents these common HTTP error codes:
  - `400` invalid request
  - `401` authentication required
  - `403` insufficient permissions
  - `423` suspicious activity or repeated spam protection
  - `500` unspecified server error
  - `502` upstream/server not responding
- The guide says some error responses include `X-Sentry-ID`, which should be preserved for support/debugging.
- No official rate-limit ceiling or retry window was published on the reviewed pages.

## Route-family inventory from the official Swagger document
- `datasets`: `39` operations
- `organizations`: `36` operations
- `reuses`: `20` operations
- `me`: `17` operations
- `dataservices`: `15` operations
- `site`: `14` operations
- `harvest`: `14` operations
- `users`: `13` operations
- `posts`: `10` operations
- `discussions`: `8` operations
- `spatial`: `7` operations
- `workers`: `7` operations
- `reports`: `5` operations
- `visualizations`: `5` operations
- `contacts`: `5` operations
- `transfer`: `4` operations
- `proconnect`: `4` operations
- `notifications`: `2` operations
- `access_type`: `1` operation
- `avatars`: `1` operation
- `tags`: `1` operation

## Canonical endpoint paths confirmed from official docs

### access_type
- `GET /access_type/reason_categories/`

### avatars
- `GET /avatars/{identifier}/{size}/`

### contacts
- `POST /contacts/`
- `GET /contacts/roles/`
- `DELETE /contacts/{contact_point}/`
- `GET /contacts/{contact_point}/`
- `PUT /contacts/{contact_point}/`

### dataservices
- `GET /dataservices/`
- `POST /dataservices/`
- `GET /dataservices/recent.atom`
- `DELETE /dataservices/{dataservice}/`
- `GET /dataservices/{dataservice}/`
- `PATCH /dataservices/{dataservice}/`
- `POST /dataservices/{dataservice}/datasets/`
- `DELETE /dataservices/{dataservice}/datasets/{dataset}/`
- `DELETE /dataservices/{dataservice}/featured/`
- `POST /dataservices/{dataservice}/featured/`
- `GET /dataservices/{dataservice}/rdf`
- `GET /dataservices/{dataservice}/rdf.{_format}`
- `DELETE /dataservices/{id}/followers/`
- `GET /dataservices/{id}/followers/`
- `POST /dataservices/{id}/followers/`

### datasets
- `GET /datasets/`
- `POST /datasets/`
- `GET /datasets/badges/`
- `GET /datasets/community_resources/`
- `POST /datasets/community_resources/`
- `DELETE /datasets/community_resources/{community}/`
- `GET /datasets/community_resources/{community}/`
- `PUT /datasets/community_resources/{community}/`
- `POST /datasets/community_resources/{community}/upload/`
- `GET /datasets/extensions/`
- `GET /datasets/frequencies/`
- `GET /datasets/licenses/`
- `GET /datasets/r/{id}`
- `GET /datasets/recent.atom`
- `GET /datasets/resource_types/`
- `GET /datasets/schemas/`
- `GET /datasets/suggest/`
- `GET /datasets/suggest/formats/`
- `GET /datasets/suggest/mime/`
- `DELETE /datasets/{dataset}/`
- `GET /datasets/{dataset}/`
- `PUT /datasets/{dataset}/`
- `POST /datasets/{dataset}/badges/`
- `DELETE /datasets/{dataset}/badges/{badge_kind}/`
- `DELETE /datasets/{dataset}/featured/`
- `POST /datasets/{dataset}/featured/`
- `GET /datasets/{dataset}/rdf`
- `GET /datasets/{dataset}/rdf.{_format}`
- `POST /datasets/{dataset}/resources/`
- `PUT /datasets/{dataset}/resources/`
- `DELETE /datasets/{dataset}/resources/{rid}/`
- `GET /datasets/{dataset}/resources/{rid}/`
- `PUT /datasets/{dataset}/resources/{rid}/`
- `POST /datasets/{dataset}/resources/{rid}/upload/`
- `POST /datasets/{dataset}/upload/`
- `POST /datasets/{dataset}/upload/community/`
- `DELETE /datasets/{id}/followers/`
- `GET /datasets/{id}/followers/`
- `POST /datasets/{id}/followers/`

### discussions
- `GET /discussions/`
- `POST /discussions/`
- `DELETE /discussions/{id}/`
- `GET /discussions/{id}/`
- `POST /discussions/{id}/`
- `PUT /discussions/{id}/`
- `DELETE /discussions/{id}/comments/{cidx}/`
- `PUT /discussions/{id}/comments/{cidx}/`

### harvest
- `GET /harvest/backends/`
- `GET /harvest/job/{ident}/`
- `POST /harvest/source/preview/`
- `DELETE /harvest/source/{source}/`
- `GET /harvest/source/{source}/`
- `PUT /harvest/source/{source}/`
- `GET /harvest/source/{source}/jobs/`
- `GET /harvest/source/{source}/preview/`
- `POST /harvest/source/{source}/run/`
- `DELETE /harvest/source/{source}/schedule/`
- `POST /harvest/source/{source}/schedule/`
- `POST /harvest/source/{source}/validate/`
- `GET /harvest/sources/`
- `POST /harvest/sources/`

### me
- `DELETE /me/`
- `GET /me/`
- `PUT /me/`
- `GET /me/api_tokens/`
- `POST /me/api_tokens/`
- `DELETE /me/api_tokens/{api_token}/`
- `POST /me/avatar/`
- `GET /me/datasets/`
- `GET /me/metrics/`
- `GET /me/org_community_resources/`
- `GET /me/org_datasets/`
- `GET /me/org_discussions/`
- `GET /me/org_invitations/`
- `POST /me/org_invitations/{id}/accept/`
- `POST /me/org_invitations/{id}/refuse/`
- `GET /me/org_reuses/`
- `GET /me/reuses/`

### notifications
- `GET /notifications/`
- `POST /notifications/{notification}/read/`

### organizations
- `GET /organizations/`
- `POST /organizations/`
- `GET /organizations/badges/`
- `GET /organizations/roles/`
- `GET /organizations/suggest/`
- `DELETE /organizations/{id}/followers/`
- `GET /organizations/{id}/followers/`
- `POST /organizations/{id}/followers/`
- `DELETE /organizations/{org}/`
- `GET /organizations/{org}/`
- `PUT /organizations/{org}/`
- `GET /organizations/{org}/assignments/`
- `POST /organizations/{org}/badges/`
- `DELETE /organizations/{org}/badges/{badge_kind}/`
- `GET /organizations/{org}/catalog`
- `GET /organizations/{org}/catalog.{_format}`
- `GET /organizations/{org}/contacts/`
- `GET /organizations/{org}/contacts/suggest/`
- `GET /organizations/{org}/dataservices.csv`
- `GET /organizations/{org}/datasets-resources.csv`
- `GET /organizations/{org}/datasets.csv`
- `GET /organizations/{org}/datasets/`
- `GET /organizations/{org}/discussions.csv`
- `GET /organizations/{org}/discussions/`
- `POST /organizations/{org}/logo/`
- `PUT /organizations/{org}/logo/`
- `POST /organizations/{org}/member/`
- `DELETE /organizations/{org}/member/{user}/`
- `PUT /organizations/{org}/member/{user}/`
- `PUT /organizations/{org}/member/{user}/assignments/`
- `GET /organizations/{org}/membership/`
- `POST /organizations/{org}/membership/`
- `POST /organizations/{org}/membership/{id}/accept/`
- `POST /organizations/{org}/membership/{id}/cancel/`
- `POST /organizations/{org}/membership/{id}/refuse/`
- `GET /organizations/{org}/reuses/`

### posts
- `GET /posts/`
- `POST /posts/`
- `GET /posts/recent.atom`
- `DELETE /posts/{post}/`
- `GET /posts/{post}/`
- `PUT /posts/{post}/`
- `POST /posts/{post}/image/`
- `PUT /posts/{post}/image/`
- `DELETE /posts/{post}/publish/`
- `POST /posts/{post}/publish/`

### proconnect
- `GET /proconnect/auth`
- `GET /proconnect/login/`
- `GET /proconnect/logout`
- `GET /proconnect/logout_oauth`

### reports
- `GET /reports/`
- `POST /reports/`
- `GET /reports/reasons/`
- `GET /reports/{report}/`
- `PATCH /reports/{report}/`

### reuses
- `GET /reuses/`
- `POST /reuses/`
- `GET /reuses/badges/`
- `GET /reuses/recent.atom`
- `GET /reuses/suggest/`
- `GET /reuses/topics/`
- `GET /reuses/types/`
- `DELETE /reuses/{id}/followers/`
- `GET /reuses/{id}/followers/`
- `POST /reuses/{id}/followers/`
- `DELETE /reuses/{reuse}/`
- `GET /reuses/{reuse}/`
- `PUT /reuses/{reuse}/`
- `POST /reuses/{reuse}/badges/`
- `DELETE /reuses/{reuse}/badges/{badge_kind}/`
- `POST /reuses/{reuse}/dataservices/`
- `POST /reuses/{reuse}/datasets/`
- `DELETE /reuses/{reuse}/featured/`
- `POST /reuses/{reuse}/featured/`
- `POST /reuses/{reuse}/image/`

### site
- `GET /activity/`
- `GET /site/`
- `PATCH /site/`
- `GET /site/catalog`
- `GET /site/catalog.{_format}`
- `GET /site/context.jsonld`
- `GET /site/data.{_format}`
- `GET /site/dataservices.csv`
- `GET /site/datasets.csv`
- `GET /site/harvests.csv`
- `GET /site/organizations.csv`
- `GET /site/resources.csv`
- `GET /site/reuses.csv`
- `GET /site/tags.csv`

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

### transfer
- `GET /transfer/`
- `POST /transfer/`
- `GET /transfer/{id}/`
- `POST /transfer/{id}/`

### users
- `GET /users/`
- `POST /users/`
- `GET /users/roles/`
- `GET /users/suggest/`
- `DELETE /users/{id}/followers/`
- `GET /users/{id}/followers/`
- `POST /users/{id}/followers/`
- `DELETE /users/{user}/`
- `GET /users/{user}/`
- `PUT /users/{user}/`
- `POST /users/{user}/avatar/`
- `GET /users/{user}/contacts/`
- `POST /users/{user}/rotate_password/`

### visualizations
- `GET /visualizations/`
- `POST /visualizations/`
- `DELETE /visualizations/{visualization}/`
- `GET /visualizations/{visualization}/`
- `PATCH /visualizations/{visualization}/`

### workers
- `GET /workers/jobs/`
- `POST /workers/jobs/`
- `GET /workers/jobs/schedulables/`
- `DELETE /workers/jobs/{id}/`
- `GET /workers/jobs/{id}/`
- `PUT /workers/jobs/{id}/`
- `GET /workers/tasks/{id}/`

## Important parameter patterns confirmed in the official docs
- Common pagination query fields: `page`, `page_size`
- Common path identifiers: `{dataset}`, `{org}`, `{reuse}`, `{dataservice}`, `{id}`, `{rid}`, `{user}`, `{contact_point}`, `{topic}`, `{post}`, `{report}`, `{visualization}`, `{notification}`, `{source}`, `{ident}`, `{api_token}`
- Format placeholders: `{_format}` for RDF/data exports
- Follow/unfollow routes consistently use resource IDs plus the `/followers/` suffix
- Suggest/autocomplete routes exist for datasets, organizations, tags, users, spatial zones, and related metadata vocabularies

## fireROUTE normalization notes
- This provider exposes a large production uData API rather than a narrow catalog-only interface.
- Many routes are public read endpoints, while modification routes are governed by the same account and organization permissions as the web application.
- Dataset, dataservice, organization, reuse, and site export routes include multiple RDF/CSV serialization endpoints that should be preserved distinctly in fireROUTE mappings.
- Because the official Swagger is production-backed and auto-generated, it should be treated as the canonical source of truth for future diff checks.