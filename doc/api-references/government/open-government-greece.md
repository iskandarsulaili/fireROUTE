# Open Government, Greece

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-greece`
- Official docs/pages used:
  - `https://data.gov.gr/`
  - `https://data-gov-gr.gitbook.io/guides/texnika-egxeiridia/data.gov.gr/metadedomena/tekmiriosi-api`
  - `https://data-gov-gr.gitbook.io/guides/texnika-egxeiridia/data.gov.gr/metadedomena/aythentikopoiisi`
  - `https://data-gov-gr.gitbook.io/guides/texnika-egxeiridia/data.gov.gr/diaxeirisi-tokens`
  - `https://data.gov.gr/api/3/action/status_show`
  - `https://data.gov.gr/api/3/action/help_show?name=package_search`
  - `https://data.gov.gr/api/3/action/current_package_list_with_resources?limit=2`
- Current documented API base URL: `https://data.gov.gr/api/3/action`
- Auth model: metadata retrieval/search is public; metadata creation and modification require `Authorization: <your_token>` according to the official auth guide
- Response format: JSON envelopes with `help`, `success`, and either `result` or `error`
- Manually confirmed canonical route count: `10`

## Official usage notes
- The live portal homepage identifies the platform as `CKAN 2.11.3`.
- The official GitBook auth page says dataset and data-service metadata retrieval/search can be performed without authentication.
- The same official auth page says posting or modifying metadata through the API requires a user-generated token and publisher-level organization permissions.
- The token-management page says API tokens are managed from the user profile.
- The live `status_show` response confirmed the production action API was active on the official host during this review.

## Authentication, parameters, and request notes
- Header-based auth for writes:
  - `Authorization: <your_token>`
- `GET /current_package_list_with_resources`
  - official docs expose `limit`, `offset`, and deprecated `page`
  - results are ordered by most recently modified datasets first
- `POST /package_search`
  - official `help_show` documents `q`, `fq`, `fq_list`, `sort`, `rows`, `start`, `facet`, `facet.mincount`, `facet.limit`, `facet.field`, `include_drafts`, `include_deleted`, `include_private`, and `use_default_schema`
  - `rows` defaults to `10` and the official help says the upper limit is `1000` unless site config lowers it
- `POST /package_show`
  - requires dataset `id` or dataset name
- `POST /organization_show`
  - requires organization `id`
- `POST /package_create`
  - official auth docs present it as the metadata creation entry point and require an authorization token
- Method note:
  - some read endpoints respond directly as `GET` on the live host (`package_list`, `current_package_list_with_resources`, `group_list`, `status_show`)
  - others were manually reconfirmed as working through POST/Action-API semantics (`organization_list`, `organization_show`, `package_search`, `package_show`, `tag_list`)

## Pagination, errors, and format notes
- JSON is the working response format across the manually verified routes.
- `current_package_list_with_resources` uses offset pagination via `limit` + `offset`; `page` is still documented but explicitly deprecated.
- `package_search` uses result-window pagination via `rows` + `start`.
- Verified live error behavior:
  - `409 Validation Error` from `package_show` when the dataset id/name is omitted
  - `409 Validation Error` from `organization_show` when `id` is omitted
- No numeric public quota or formal rate-limit policy was published on the reviewed official pages.

## Canonical endpoint inventory manually confirmed from the official site
1. `GET /api/3/action/package_list`
2. `GET /api/3/action/current_package_list_with_resources`
3. `POST /api/3/action/package_search`
4. `POST /api/3/action/package_show`
5. `POST /api/3/action/organization_list`
6. `POST /api/3/action/organization_show`
7. `POST /api/3/action/tag_list`
8. `GET /api/3/action/group_list`
9. `GET /api/3/action/status_show`
10. `POST /api/3/action/package_create`

## Example live behaviors confirmed during manual review
- `status_show` returned site metadata including `site_title`, `site_url`, extension inventory, and `ckan_version: 2.11.3`.
- `current_package_list_with_resources?limit=2` returned full dataset objects with fields such as `id`, `name`, `notes`, `organization`, `metadata_modified`, and resource metadata.
- `help_show?name=package_search` returned the full official parameter documentation for search, filtering, facets, and result paging.

## fireROUTE integration notes
- Treat this provider as a CKAN action API with mixed GET and POST read behavior, not as a static catalogue page.
- Keep unauthenticated metadata-discovery routes separate from token-gated write routes.
- Preserve provider-native JSON payloads for write flows such as `package_create`; the official docs do not define a simplified cross-provider write schema.
- Because the official docs explicitly tie write access to user and organization permissions, fireROUTE should surface auth and permission failures without trying to normalize them away.
