# Open Government, Portugal

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-portugal`
- Official docs/pages used:
  - `https://dados.gov.pt/en/docapi/`
  - `https://dados.gov.pt/en/pages/api-tutorial/`
  - `https://dados.gov.pt/api/1/swagger.json`
- Current documented API base URL: `https://dados.gov.pt/api/1`
- Auth model: read access is public; write operations require an API key in the `X-API-KEY` header
- Response format: JSON is used throughout the reviewed examples and Swagger reference; file-upload routes are separately exposed by dedicated upload endpoints
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `152`
- Additional inventory note: the current official Swagger document contains `219` documented HTTP operations across those `152` path templates

## Official usage notes
- The official API documentation page describes the service as the website's free and open RESTful API.
- The official tutorial says write operations require authentication and the same permissions as the web interface.
- The tutorial shows the root API base as `https://dados.gov.pt/api/1/` and demonstrates direct exploration of organization list and detail routes.
- The tutorial explicitly shows paginated list responses returning `data`, `page`, `page_size`, `total`, `next_page`, and `previous_page`.
- The reviewed live portal footer identifies the current platform engine as `udata (10.4.3)` with theme extension `udata-front (6.2.4)`.

## Auth, pagination, format, and error notes
- Writing requires the header `X-API-KEY`.
- The tutorial says API permissions mirror web-interface permissions, so organization membership governs many write operations.
- The tutorial examples show paginated collection routes such as `GET /organizations/` using `page` and `page_size`.
- The official examples and Swagger responses are JSON.
- The tutorial explicitly shows these status/error behaviors:
  - `401 Unauthorized` when modifying without credentials
  - `401 Unauthorized` with `Invalid API Key` when the key is wrong
  - `403 Forbidden` when the caller lacks permission to modify an object
  - `204 No Content` after a successful delete
  - `410 Gone` when requesting a deleted organization afterward
- No public rate-limit or throttling guidance was exposed on the reviewed official pages.

## Route-family inventory from the official Swagger document
- `datasets`: `40` operations
- `organizations`: `32` operations
- `site`: `19` operations
- `reuses`: `19` operations
- `harvest`: `15` operations
- `dataservices`: `13` operations
- `me`: `13` operations
- `users`: `12` operations
- `discussions`: `10` operations
- `posts`: `10` operations
- `spatial`: `7` operations
- `workers`: `7` operations
- `contacts`: `5` operations
- `topics`: `5` operations
- `reports`: `4` operations
- `transfer`: `4` operations
- `avatars`: `1` operation
- `notifications`: `1` operation
- `spam`: `1` operation
- `tags`: `1` operation

## Canonical endpoint paths confirmed from official docs

### avatars
- `GET /avatars/{identifier}/{size}`

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
- `GET /dataservices/{dataservice}/rdf`
- `GET /dataservices/{dataservice}/rdf.{format}`
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
- `GET /datasets/{dataset}/rdf.{format}`
- `POST /datasets/{dataset}/resources/`
- `PUT /datasets/{dataset}/resources/`
- `DELETE /datasets/{dataset}/resources/{rid}/`
- `GET /datasets/{dataset}/resources/{rid}/`
- `PUT /datasets/{dataset}/resources/{rid}/`
- `GET /datasets/{dataset}/resources/{rid}/check/`
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
- `DELETE /discussions/{id}/comments/{cidx}`
- `PUT /discussions/{id}/comments/{cidx}`
- `DELETE /discussions/{id}/comments/{cidx}/spam`
- `DELETE /discussions/{id}/spam/`

### harvest
- `GET /harvest/backends`
- `GET /harvest/job/{ident}/`
- `GET /harvest/job_status`
- `POST /harvest/source/preview`
- `DELETE /harvest/source/{ident}`
- `GET /harvest/source/{ident}`
- `PUT /harvest/source/{ident}`
- `GET /harvest/source/{ident}/jobs/`
- `GET /harvest/source/{ident}/preview`
- `POST /harvest/source/{ident}/run`
- `DELETE /harvest/source/{ident}/schedule`
- `POST /harvest/source/{ident}/schedule`
- `POST /harvest/source/{ident}/validate`
- `GET /harvest/sources/`
- `POST /harvest/sources/`

### me
- `DELETE /me/`
- `GET /me/`
- `PUT /me/`
- `DELETE /me/apikey`
- `POST /me/apikey`
- `POST /me/avatar/`
- `GET /me/datasets/`
- `GET /me/metrics/`
- `GET /me/org_community_resources/`
- `GET /me/org_datasets/`
- `GET /me/org_discussions/`
- `GET /me/org_reuses/`
- `GET /me/reuses/`

### notifications
- `GET /notifications/`

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
- `POST /organizations/{org}/badges/`
- `DELETE /organizations/{org}/badges/{badge_kind}/`
- `GET /organizations/{org}/catalog`
- `GET /organizations/{org}/catalog.{format}`
- `GET /organizations/{org}/contacts/`
- `GET /organizations/{org}/dataservices.csv`
- `GET /organizations/{org}/datasets-resources.csv`
- `GET /organizations/{org}/datasets.csv`
- `GET /organizations/{org}/datasets/`
- `GET /organizations/{org}/discussions.csv`
- `GET /organizations/{org}/discussions/`
- `POST /organizations/{org}/logo/`
- `PUT /organizations/{org}/logo/`
- `DELETE /organizations/{org}/member/{user}`
- `POST /organizations/{org}/member/{user}`
- `PUT /organizations/{org}/member/{user}`
- `GET /organizations/{org}/membership/`
- `POST /organizations/{org}/membership/`
- `POST /organizations/{org}/membership/{id}/accept/`
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
- `DELETE /posts/{post}/publish`
- `POST /posts/{post}/publish`

### reports
- `GET /reports/`
- `POST /reports/`
- `GET /reports/reasons/`
- `GET /reports/{report}/`

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
- `POST /reuses/{reuse}/datasets/`
- `DELETE /reuses/{reuse}/featured/`
- `POST /reuses/{reuse}/featured/`
- `POST /reuses/{reuse}/image/`

### site
- `GET /activity/`
- `GET /oembed`
- `GET /oembeds/`
- `GET /site/`
- `GET /site/catalog`
- `GET /site/catalog.{format}`
- `GET /site/context.jsonld`
- `GET /site/data.{format}`
- `GET /site/dataservices.csv`
- `GET /site/datasets.csv`
- `GET /site/harvests.csv`
- `GET /site/home/datasets/`
- `PUT /site/home/datasets/`
- `GET /site/home/reuses/`
- `PUT /site/home/reuses/`
- `GET /site/organizations.csv`
- `GET /site/resources.csv`
- `GET /site/reuses.csv`
- `GET /territory/suggest/`

### spam
- `GET /spam/`

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
- `GET /topics/`
- `POST /topics/`
- `DELETE /topics/{topic}/`
- `GET /topics/{topic}/`
- `PUT /topics/{topic}/`

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

### workers
- `GET /workers/jobs/`
- `POST /workers/jobs/`
- `GET /workers/jobs/schedulables`
- `DELETE /workers/jobs/{id}`
- `GET /workers/jobs/{id}`
- `PUT /workers/jobs/{id}`
- `GET /workers/tasks/{id}`

## Important parameter patterns confirmed in the official docs
- Common pagination query fields: `page`, `page_size`
- Common path identifiers: `{dataset}`, `{org}`, `{reuse}`, `{dataservice}`, `{id}`, `{rid}`, `{user}`, `{contact_point}`, `{topic}`, `{post}`, `{report}`, `{ident}`, `{community}`
- Format placeholders: `{format}` for RDF/data exports
- The tutorial explicitly demonstrates list exploration and direct-resource traversal through returned `uri` values
- Follow/unfollow routes consistently use resource IDs plus the `/followers/` suffix

## fireROUTE normalization notes
- This provider exposes a large production uData API rather than a single catalog-search endpoint.
- Read routes are broadly public, but write routes are gated by both API-key authentication and the same object-level permissions used by the portal UI.
- Export routes span RDF, Atom, CSV, and JSON-oriented resource/detail flows and should remain distinct in fireROUTE mappings.
- Because the official Swagger is linked from the live docs page and reflects the current production API, it should be treated as the canonical source for future diffs.