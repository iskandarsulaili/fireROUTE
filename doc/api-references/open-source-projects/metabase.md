# Metabase

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `metabase`
- Official docs/pages reviewed manually:
  - `https://www.metabase.com/docs/latest/api`
  - `https://www.metabase.com/docs/latest/api.json`
- Confirmed API base URL pattern: deployment-relative Metabase host with routes under `/api/...`
- Official example server published in the OpenAPI document: `http://localhost:3000`
- Official live-doc location for a user's own instance: `https://{your-metabase-url}/api/docs`
- Manually confirmed route count: `600`
- Route-method breakdown confirmed from the official OpenAPI document:
  - `300` `GET`
  - `189` `POST`
  - `65` `PUT`
  - `45` `DELETE`
  - `1` `PATCH`
- Route-surface split confirmed from the official path inventory:
  - `485` core routes outside `/api/ee/...`
  - `115` enterprise-prefixed routes under `/api/ee/...`

## What the official docs confirm
- Metabase publishes a large deployment-relative API rather than a single fixed SaaS hostname.
- The official docs explicitly say the API is **subject to change** and **isn't versioned**.
- The official docs direct users to inspect the live OpenAPI docs for their own deployment at `/api/docs`.
- The downloadable official OpenAPI document currently exposes `600` concrete method+path operations across content management, dashboards, databases, datasets, permissions, embedding, public sharing, notifications, sessions, users, uploads, transforms, and enterprise-only admin surfaces.

## Authentication

### Primary auth model
- The official OpenAPI document defines a top-level security scheme named `ApiKeyAuth`.
- Confirmed auth header:
  - `X-API-Key`
- Confirmed security-scheme type:
  - `apiKey`
- Confirmed header location:
  - `in: header`

### Session/login routes
The official route inventory also exposes session-oriented auth flows under `/api/session`, including:
- `POST /api/session`
- `DELETE /api/session`
- `POST /api/session/forgot_password`
- `POST /api/session/google_auth`
- `POST /api/session/password-check`
- `GET /api/session/password_reset_token_valid`
- `GET /api/session/properties`
- `POST /api/session/reset_password`

For `POST /api/session`, the official request-body schema confirms JSON fields:
- `username`
- `password`

### Public/share routes without the global API-key requirement
The official spec also publishes unauthenticated or separately tokenized public/share surfaces, including route families such as:
- `/api/public/...`
- `/api/embed...`
- `/api/preview_embed...`

Sample officially documented public routes include:
- `GET /api/public/action/{uuid}`
- `POST /api/public/action/{uuid}/execute`
- `GET /api/public/card/{uuid}`
- `GET /api/public/card/{uuid}/query`
- `GET /api/public/card/{uuid}/query/{export-format}`
- `GET /api/public/dashboard/{uuid}`
- `GET /api/public/dashboard/{uuid}/dashcard/{dashcard-id}/card/{card-id}`

## Base URL and route shape
- Base host pattern: `https://{your-metabase-url}`
- API route prefix: `/api`
- Official example server in the OpenAPI document: `http://localhost:3000`
- Official docs for a running Metabase instance: `/api/docs`
- fireROUTE normalization note: treat Metabase as self-hosted / deployment-relative, not as a single public host.

## Request and response conventions
- Confirmed primary response media type in the official OpenAPI document: `application/json`
- Confirmed request-body media types used in the official OpenAPI document:
  - `application/json`
  - `multipart/form-data`
- The multipart form routes visible in the official spec are:
  - `POST /api/ee/content-translation/upload-dictionary`
  - `POST /api/ee/serialization/import`
  - `POST /api/table/{id}/append-csv`
  - `POST /api/table/{id}/replace-csv`
  - `POST /api/upload/csv`

## Confirmed parameter and body notes from sampled official routes

### `GET /api/card`
- Query parameters confirmed in the official schema:
  - `f` — required query parameter
  - `model_id` — optional query parameter
- Response classes shown in the official schema:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/card`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `visualization_settings`
  - `dashboard_tab_id`
  - `entity_id`
  - `dataset_query`
  - `parameter_mappings`
  - `name`
  - `collection_position`
  - `result_metadata`
  - `collection_id`
  - `cache_ttl`
  - `type`
  - `display`
  - `parameters`
  - `description`
  - `dashboard_id`
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `GET /api/collection`
- Query parameters confirmed in the official schema:
  - `archived` — required
  - `exclude-other-user-collections` — required
  - `namespace` — optional
  - `personal-only` — required
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/collection`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `authority_level`
  - `description`
  - `name`
  - `namespace`
  - `parent_id`

### `GET /api/dashboard`
- Query parameters confirmed in the official schema:
  - `f` — optional
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/dashboard`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `cache_ttl`
  - `collection_id`
  - `collection_position`
  - `description`
  - `name`
  - `parameters`

### `GET /api/database`
- Query parameters confirmed in the official schema:
  - `include`
  - `include_analytics`
  - `saved`
  - `include_editable_data_model`
  - `exclude_uneditable_details`
  - `include_only_uploadable`
  - `router_database_id`
  - `can-query`
  - `can-write-metadata`
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/database`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `provider_name`
  - `name`
  - `is_on_demand`
  - `cache_ttl`
  - `engine`
  - `details`
  - `is_full_sync`
  - `connection_source`
  - `auto_run_queries`
  - `schedules`

### `POST /api/dataset`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `database`
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `GET /api/permissions/group`
- Query parameter confirmed in the official schema:
  - `tenancy`
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/permissions/group`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `is_tenant_group`
  - `name`

### `GET /api/user`
- Query parameters confirmed in the official schema:
  - `status`
  - `query`
  - `group_id`
  - `include_deactivated`
  - `is_data_analyst`
  - `can_access_data_studio`
  - `tenancy`
  - `tenant_id`
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

### `POST /api/user`
- Request content type: `application/json`
- Confirmed request-body fields visible in the official schema include:
  - `email`
  - `first_name`
  - `last_name`
  - `login_attributes`
  - `source`
  - `tenant_id`
  - `user_group_memberships`

### `GET /api/public/card/{uuid}/query/{export-format}`
- Confirmed path parameters:
  - `uuid`
  - `export-format`
- Confirmed query parameters:
  - `format_rows` — required
  - `pivot_results` — required
  - `parameters` — optional
- Response classes:
  - `2XX`
  - `4XX`
  - `5XX`

## Pagination
- No single global pagination contract is documented in the reviewed official materials.
- Sample list routes in the official schema expose route-specific query parameters and filters rather than one universal `page`/`limit` standard.
- fireROUTE should treat pagination as endpoint-specific for Metabase.

## Rate limits
- No numeric public rate-limit policy was published in the reviewed official Metabase docs or OpenAPI document.

## Error handling
- Sampled official routes consistently expose coarse response classes:
  - `2XX`
  - `4XX`
  - `5XX`
- The reviewed official materials do not publish one global cross-API error-envelope schema.

## Important usage notes
- The API is explicitly described by Metabase as **not versioned**.
- The API is explicitly described by Metabase as **subject to change**.
- Consumers should prefer the deployment's own `/api/docs` over assuming the public docs site exactly matches every installed version.
- The published route surface includes both core and enterprise-only features; adapters should not assume `/api/ee/...` routes exist on every deployment.
- Public and embedded routes are a significant part of the documented surface, so auth requirements vary by route family.
- The docs themselves state they can be generated with `clojure -M:ee:doc api-documentation`, which reinforces that the reference is OpenAPI-backed and build-generated from the product.

## Manually confirmed route-family inventory

### Core route families (`485` operations)
| Route family | Operations |
|---|---:|
| `/api/action` | 10 |
| `/api/activity` | 5 |
| `/api/agent` | 9 |
| `/api/ai-entity-analysis` | 1 |
| `/api/alert` | 3 |
| `/api/analytics` | 2 |
| `/api/api-key` | 6 |
| `/api/automagic-dashboards` | 11 |
| `/api/bookmark` | 4 |
| `/api/bug-reporting` | 2 |
| `/api/cache` | 4 |
| `/api/card` | 20 |
| `/api/cards` | 2 |
| `/api/channel` | 5 |
| `/api/cloud-migration` | 3 |
| `/api/collection` | 16 |
| `/api/comment` | 6 |
| `/api/dashboard` | 25 |
| `/api/data-studio/table` | 5 |
| `/api/database` | 31 |
| `/api/dataset` | 8 |
| `/api/document` | 10 |
| `/api/eid-translation` | 1 |
| `/api/email` | 3 |
| `/api/embed` | 16 |
| `/api/embed-theme` | 7 |
| `/api/field` | 12 |
| `/api/frontend-errors` | 1 |
| `/api/geojson` | 2 |
| `/api/glossary` | 4 |
| `/api/google` | 1 |
| `/api/ldap` | 1 |
| `/api/llm` | 3 |
| `/api/logger` | 4 |
| `/api/login-history` | 1 |
| `/api/measure` | 7 |
| `/api/metabot` | 4 |
| `/api/metabot/document` | 1 |
| `/api/metabot/metabot` | 7 |
| `/api/metabot/permissions` | 1 |
| `/api/metabot/slack` | 3 |
| `/api/metric` | 7 |
| `/api/model-index` | 4 |
| `/api/moderation-review` | 1 |
| `/api/mt/gtap` | 6 |
| `/api/mt/user` | 2 |
| `/api/native-query-snippet` | 4 |
| `/api/notification` | 7 |
| `/api/notification/unsubscribe` | 2 |
| `/api/notify` | 3 |
| `/api/permissions` | 14 |
| `/api/persist` | 11 |
| `/api/premium-features` | 2 |
| `/api/preview_embed` | 13 |
| `/api/product-feedback` | 1 |
| `/api/public` | 24 |
| `/api/pulse` | 7 |
| `/api/pulse/unsubscribe` | 2 |
| `/api/revision` | 3 |
| `/api/search` | 5 |
| `/api/segment` | 6 |
| `/api/session` | 8 |
| `/api/setting` | 4 |
| `/api/setup` | 1 |
| `/api/slack` | 4 |
| `/api/table` | 16 |
| `/api/task` | 7 |
| `/api/tiles` | 3 |
| `/api/timeline` | 7 |
| `/api/timeline-event` | 4 |
| `/api/transform` | 12 |
| `/api/transform-job` | 7 |
| `/api/transform-tag` | 4 |
| `/api/upload` | 1 |
| `/api/user` | 11 |
| `/api/user-key-value` | 4 |
| `/api/util` | 1 |

### Enterprise-prefixed route families (`115` operations)
| Route family | Operations |
|---|---:|
| `/api/ee/action-v2` | 3 |
| `/api/ee/advanced-permissions/application` | 2 |
| `/api/ee/advanced-permissions/impersonation` | 2 |
| `/api/ee/ai-controls/permissions` | 2 |
| `/api/ee/ai-controls/usage` | 8 |
| `/api/ee/audit-app/analytics-dev` | 1 |
| `/api/ee/audit-app/user` | 2 |
| `/api/ee/billing` | 1 |
| `/api/ee/cloud-add-ons` | 4 |
| `/api/ee/cloud-proxy` | 1 |
| `/api/ee/content-translation` | 4 |
| `/api/ee/data-complexity-score` | 1 |
| `/api/ee/data-studio/table` | 2 |
| `/api/ee/database-replication` | 3 |
| `/api/ee/database-routing` | 2 |
| `/api/ee/dependencies` | 9 |
| `/api/ee/email` | 2 |
| `/api/ee/embedding-hub` | 1 |
| `/api/ee/gsheets` | 5 |
| `/api/ee/library` | 3 |
| `/api/ee/logs` | 1 |
| `/api/ee/metabot` | 1 |
| `/api/ee/permission_debug` | 1 |
| `/api/ee/remote-sync` | 11 |
| `/api/ee/replacement` | 6 |
| `/api/ee/scim` | 2 |
| `/api/ee/scim/v2` | 10 |
| `/api/ee/security-center` | 5 |
| `/api/ee/semantic-search` | 1 |
| `/api/ee/serialization` | 2 |
| `/api/ee/stale` | 1 |
| `/api/ee/support-access-grant` | 4 |
| `/api/ee/tenant` | 4 |
| `/api/ee/transforms` | 3 |
| `/api/ee/transforms-python` | 3 |
| `/api/ee/upload-management` | 2 |

## Verification notes
This file was manually rebuilt from Metabase's official API docs page and official downloadable OpenAPI document, replacing the earlier thin `5`-route summary with the full currently published official surface.