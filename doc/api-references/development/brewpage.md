# BrewPage

## Provider metadata
- Category: `Development`
- Provider slug: `brewpage`
- Docs used manually:
  - `https://brewpage.app/api`
  - `https://brewpage.app/help`
  - `https://brewpage.app/v3/api-docs`
- Confirmed API base URL: `https://brewpage.app`
- Confirmed spec version seen in the live OpenAPI document: `1.46.0`
- Primary response/content types confirmed from the reviewed official pages: `application/json`, raw HTML/text, binary files, ZIP-backed site content, XML sitemap, PNG preview images
- Authentication model confirmed from the reviewed official pages:
  - no account/signup auth is required to publish content
  - create routes return an owner token; updates/deletes use `X-Owner-Token`
  - optional access gating uses `X-Password` or query parameter `p`
  - the overview page also documents `X-Admin-Token` for admin-only endpoints, but no public admin routes were present in the live public OpenAPI document reviewed in this pass
- Manually confirmed routes in this pass: `35`

## Authentication and shared request rules
From the official API overview and help pages:
- publish/create routes do not require prior authentication
- every successful publish returns an owner token; the docs tell clients to save it because there is no account recovery flow
- owner-only mutation routes require `X-Owner-Token`
- password-protected resources accept:
  - `X-Password` header
  - query parameter `p` as the documented alternative
- the overview says a `User-Agent` is required on every request and gives the format `app-name/version (+url)`
- the live OpenAPI document marks `User-Agent` as optional on several operations, so there is a docs/spec mismatch; I preserved the stricter overview guidance in this file

## Rate limits, TTL, and retention
From the official overview/help pages:
- write/upload limit: `60 uploads / hour / IP`
- read limit: `300 reads / minute / IP`
- `429` responses include `Retry-After`
- default TTL for all resources: `15 days`
- maximum TTL: `30 days`
- TTL can be set with query parameter `ttl` or a body field where supported
- expired content is permanently deleted by a nightly cleanup job

## Namespaces and privacy
From `https://brewpage.app/help`:
- default namespace is `public`
- only `public` resources without a password are listed/indexable
- any non-`public` namespace is private
- setting a password makes the resource private regardless of namespace
- the namespace pattern in the live OpenAPI spec is `^[a-z0-9-]{1,32}$` on the path-based operations reviewed

## Response and error conventions
- The platform is mostly JSON for API/control responses, but resource fetch routes return the hosted content itself.
- Common mutation success patterns confirmed from the live spec:
  - create routes: `201`
  - update routes: `200`
  - delete routes: `204`
- Common error codes confirmed from the live spec:
  - `400` malformed request
  - `403` wrong password or wrong/missing owner token
  - `404` not found / expired
  - `409` KV key-limit conflict on `PUT /api/kv/{ns}/{id}/{key}`
  - `415` unsupported upload media on file/site upload endpoints
  - `429` rate-limited create/upload operations
- Gallery responses are paginated with `page`, `size`, `total`, and `items`.
- Platform stats return a JSON object with all-time/today counters and a `breakdown` array by content type.

## Resource limits from the reviewed official pages
From the `Resources & limits` table on the API page and the help page:
- HTML: `POST /api/html` up to `5 MB`
- Markdown: `POST /api/html?format=markdown` / help page shorthand `POST /api/markdown`, up to `5 MB`
- File uploads: `POST /api/files`, `5 MB` generally, `20 MB` for video, `5 MB` for audio, `1000` files per namespace
- Multi-file site uploads: `POST /api/sites`, up to `20 MB` total, `5 MB` per file, `100` files
- KV: `POST /api/kv`, `1 MB` per value, `1000` keys per namespace/store
- JSON: `POST /api/json`, `1 MB` per document, `10,000` docs per collection

## Manually confirmed endpoint set
All paths below are relative to `https://brewpage.app`.

### 1) List files
- Method: `GET`
- Path: `/api/files`
- Query parameters:
  - `ns` - namespace filter
- Headers:
  - `X-Owner-Token` optional
- Response: `200` JSON array of file metadata

### 2) Upload file
- Method: `POST`
- Path: `/api/files`
- Query parameters:
  - `ns`
  - `tags`
  - `ttl`
- Headers:
  - `X-Password` optional
  - `X-Owner-Token` optional
- Body/media notes:
  - the live spec currently advertises a JSON body containing binary `file`
  - the human help/docs describe file upload behavior as upload-style publishing
  - I documented the route as official but note the public docs are not perfectly aligned on exact media type encoding
- Responses: `201`, `400`, `415`, `429`

### 3) Download file
- Method: `GET`
- Path: `/api/files/{ns}/{id}`
- Path parameters: `ns`, `id`
- Access parameters/headers:
  - `X-Password` or `p`
  - `dl` to force download attachment behavior
  - `Range` for partial reads
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 4) Delete file
- Method: `DELETE`
- Path: `/api/files/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 5) Browse gallery
- Method: `GET`
- Path: `/api/gallery`
- Query parameters:
  - `q`
  - `page`
  - `size`
  - `sort`
  - `mine`
- Header:
  - `X-Owner-Token` optional; the help page says owner view can reveal all owned publications
- Response envelope fields confirmed from the live spec:
  - `items`
  - `page`
  - `size`
  - `total`

### 6) Create HTML page
- Method: `POST`
- Path: `/api/html`
- Query parameters:
  - `ns`
  - `tags`
  - `ttl`
  - `format` - the API page explicitly documents markdown via `format=markdown`
- Headers:
  - `X-Password` optional
  - `X-Owner-Token` optional
  - `User-Agent`
- Body fields from the live spec:
  - `content` - HTML or markdown content
  - `filename` - optional original filename / title fallback / download basename
  - `showTopBar` - optional per-content UI toggle
- Doc mismatch note:
  - the help page also shows direct `text/html` request bodies via `--data-binary`
  - the live OpenAPI document currently models an `application/json` body
  - both are official surfaces, so I recorded the inconsistency rather than guessing which one supersedes the other
- Responses: `201`, `400`, `429`

### 7) Get HTML page
- Method: `GET`
- Path: `/api/html/{ns}/{id}`
- Path parameters: `ns`, `id`
- Access headers/query:
  - `X-Password` or `p`
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 8) Update HTML page
- Method: `PUT`
- Path: `/api/html/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Optional header: `User-Agent`
- Request body: same content family as HTML creation
- Responses: `200`, `403`, `404`

### 9) Delete HTML page
- Method: `DELETE`
- Path: `/api/html/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 10) List JSON documents
- Method: `GET`
- Path: `/api/json`
- Query parameters:
  - `ns`
- Header:
  - `X-Owner-Token` optional
- Response: `200` JSON array of JSON-document metadata

### 11) Create JSON document
- Method: `POST`
- Path: `/api/json`
- Query parameters:
  - `ns`
  - `tags`
  - `ttl`
- Headers:
  - `X-Password` optional
  - `X-Owner-Token` optional
- Request body:
  - the live spec models `application/json` with a string schema
  - the help page shows JSON-object creation examples
- Responses: `201`, `400`, `429`

### 12) Get JSON document
- Method: `GET`
- Path: `/api/json/{ns}/{id}`
- Path parameters: `ns`, `id`
- Access headers/query:
  - `X-Password` or `p`
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 13) Update JSON document
- Method: `PUT`
- Path: `/api/json/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Request body: JSON document content
- Responses: `200`, `403`, `404`

### 14) Delete JSON document
- Method: `DELETE`
- Path: `/api/json/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 15) List KV stores
- Method: `GET`
- Path: `/api/kv`
- Query parameters:
  - `ns`
- Header:
  - `X-Owner-Token` optional
- Response: `200` JSON array of KV store metadata

### 16) Create KV store
- Method: `POST`
- Path: `/api/kv`
- Query parameters:
  - `ns`
  - `tags`
  - `ttl`
- Headers:
  - `X-Password` optional
  - `X-Owner-Token` optional
- Body fields confirmed from the live spec:
  - `key` - optional initial key name
  - `value` - optional initial value
- Responses: `201`, `400`, `429`

### 17) List keys in a KV store
- Method: `GET`
- Path: `/api/kv/{ns}/{id}`
- Path parameters: `ns`, `id`
- Access headers/query:
  - `X-Password` or `p`
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 18) Delete KV store
- Method: `DELETE`
- Path: `/api/kv/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 19) Get KV value
- Method: `GET`
- Path: `/api/kv/{ns}/{id}/{key}`
- Path parameters: `ns`, `id`, `key`
- Access headers/query:
  - `X-Password` or `p`
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 20) Upsert KV value
- Method: `PUT`
- Path: `/api/kv/{ns}/{id}/{key}`
- Path parameters: `ns`, `id`, `key`
- Required header: `X-Owner-Token`
- Body field:
  - `value`
- Responses: `200`, `403`, `404`, `409`

### 21) Delete KV value
- Method: `DELETE`
- Path: `/api/kv/{ns}/{id}/{key}`
- Path parameters: `ns`, `id`, `key`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 22) Suggest a random namespace
- Method: `GET`
- Path: `/api/namespace/random`
- Responses: `200`, `503`
- Notes:
  - the live spec describes this as a collision-free namespace suggestion endpoint

### 23) Submit abuse report
- Method: `POST`
- Path: `/api/reports`
- Header:
  - `User-Agent`
- Body fields confirmed from the live spec:
  - `category` - one of `cannot_delete`, `spam`, `phishing`, `malware`, `copyright`, `harassment`, `illegal`, `other`
  - `description`
  - `reportedUrl`
  - `reporterEmail`
  - `resourceId`
  - `resourceNamespace`
- Responses: `201`, `400`

### 24) Dynamic XML sitemap
- Method: `GET`
- Path: `/api/sitemap.xml`
- Response: `200`

### 25) Upload site
- Method: `POST`
- Path: `/api/sites`
- Query parameters:
  - `files`
  - `paths`
  - `ns`
  - `tags`
  - `ttl`
  - `entry`
- Headers:
  - `X-Password` optional
  - `X-Owner-Token` optional
  - `User-Agent`
- Body/media notes:
  - the help page shows ZIP upload with multipart form data (`-F "file=@site.zip"`)
  - the live spec currently models a JSON body with binary `archive`
  - the discrepancy is official and documented here as-is
- Responses: `201`, `400`, `415`, `429`

### 26) Get site info
- Method: `GET`
- Path: `/api/sites/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `200`, `403`, `404`

### 27) Delete site
- Method: `DELETE`
- Path: `/api/sites/{ns}/{id}`
- Path parameters: `ns`, `id`
- Required header: `X-Owner-Token`
- Responses: `204`, `403`, `404`

### 28) Serve a file inside a published site
- Method: `GET`
- Path: `/api/sites/{ns}/{id}/files/**`
- Path parameters:
  - `ns`
  - `id`
  - wildcard file path under the site bundle
- Access headers/query:
  - `X-Password` or `p`
  - `X-Owner-Token` optional
  - `User-Agent`
- Responses: `200`, `403`, `404`

### 29) Get platform stats
- Method: `GET`
- Path: `/api/stats`
- Query parameters:
  - `tz`
- Response fields confirmed from the live spec include:
  - `totalCreated`, `totalDeleted`, `totalViews`
  - `createdToday`, `deletedToday`, `viewsToday`
  - public/private splits for those counters
  - `breakdown`
- Response: `200`
- Important note:
  - the overview page also mentions `GET /api/stats/timeseries`, but that path was not present in the current live public OpenAPI document reviewed in this pass

### 30) Owner-token probe
- Method: `GET`
- Path: `/api/{ns}/{id}/owner-check`
- Path parameters: `ns`, `id`
- Header:
  - `X-Owner-Token` optional
- Response: `200`
- Notes:
  - the live spec describes this as a lightweight owner-check that does not return content

### 31) OpenGraph HTML preview stub
- Method: `GET`
- Path: `/preview-html/{ns}/{id}`
- Path parameters: `ns`, `id`
- Response: `200`

### 32) OpenGraph PNG preview image
- Method: `GET`
- Path: `/preview/{ns}/{id}.png`
- Path parameters: `ns`, `id`
- Header:
  - `If-None-Match` optional
- Responses: `200`, `302`, `304`, `429`

### 33) IndexNow verification file
- Method: `GET`
- Path: `/{key}.txt`
- Path parameter: `key`
- Responses: `200`, `404`

### 34) Resolve/render short link root
- Method: `GET`
- Path: `/{ns}/{id}`
- Path parameters: `ns`, `id`
- Access and delivery controls:
  - `X-Password` or `p`
  - `dl`
  - `Range`
  - `X-Resolve`
  - `X-Owner-Token`
  - `User-Agent`
- Response: `200`
- Notes:
  - this is the canonical short-link resolver/resource delivery route
  - the response content varies by resource type

### 35) Resolve/render short-link subpath
- Method: `GET`
- Path: `/{ns}/{id}/{sub}`
- Path parameters: `ns`, `id`, `sub`
- Access and delivery controls:
  - `X-Password` or `p`
  - `dl`
  - `X-Resolve`
  - `X-Owner-Token`
  - `User-Agent`
- Response: `200`
- Notes:
  - used for sub-resources under published multi-file content

## Pagination
- No generic cursor pagination was documented.
- The public gallery is the one reviewed endpoint with explicit paging controls:
  - `page`
  - `size`
  - response fields `page`, `size`, `total`, `items`
- Other list routes reviewed in this pass (`/api/files`, `/api/json`, `/api/kv`) were documented in the live spec as simple arrays rather than paged envelopes.

## Important usage notes
- The public docs are unusually strong but not perfectly internally consistent: the human help pages show raw-body and multipart upload examples, while the live OpenAPI document models some of those uploads as JSON bodies containing binary fields.
- The API overview documents markdown as `POST /api/html?format=markdown`, while the help page shorthand lists `POST /api/markdown`; I preserved the officially visible split rather than inventing a unified undocumented alias.
- The help page makes clear there is no account system for ownership recovery; `ownerToken` from the original create response is the only mutation credential.
- The docs explicitly distinguish public gallery visibility from actual resource reachability: non-public namespaces and passworded resources remain directly reachable if the caller has the link and any required password/owner token.
- The overview mentions admin behavior (`X-Admin-Token`) and a timeseries stats route, but those were not fully exposed in the current live public OpenAPI path inventory reviewed in this pass.

## Verification notes
This file was manually rebuilt from BrewPage's official API overview, help page, and live OpenAPI document using browser inspection, replacing the earlier generated placeholder.
