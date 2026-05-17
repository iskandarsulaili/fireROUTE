# City, Helsinki

## Provider metadata
- Category: `Government`
- Provider slug: `city-helsinki`
- Official docs/pages used:
  - `https://hri.fi/data/en_GB/collection/rajapinnat`
  - `https://hri.fi/data/api/3`
  - `https://hri.fi/data/api/3/action/help_show?name=help_show`
  - `https://hri.fi/data/api/3/action/help_show?name=package_list`
  - `https://hri.fi/data/api/3/action/help_show?name=package_search`
  - `https://hri.fi/data/api/3/action/help_show?name=package_show`
  - `https://hri.fi/data/api/3/action/help_show?name=group_list`
  - `https://hri.fi/data/api/3/action/help_show?name=organization_list`
  - `https://hri.fi/data/api/3/action/status_show`
  - `https://hri.fi/data/api/3/action/package_list?limit=1`
  - `https://hri.fi/data/api/3/action/package_search?rows=0`
  - `https://hri.fi/data/api/3/action/package_show?id=3d-model-of-helsinki`
  - `https://hri.fi/data/api/3/action/group_list?limit=1`
  - `https://hri.fi/data/api/3/action/organization_list?limit=1`
- Current documented API base URL: `https://hri.fi/data/api/3/action`
- API version root: `https://hri.fi/data/api/3`
- Auth model: no auth requirement was documented or enforced on the reviewed public read endpoints
- Response format: JSON
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Pagination: `package_list`, `group_list`, and `organization_list` use `limit`/`offset`; `package_search` uses `rows`/`start`
- Error format: CKAN-style JSON envelope with top-level `help`, `success`, and `result`; `help_show` documents `ckan.logic.NotFound` for unknown actions
- Manually confirmed route count: `7`

## Official usage notes
- The official collection page is titled `Open APIs - Helsinki Region Infoshare` and the live API version root returns `{"version": 3}`, confirming a CKAN v3 action API.
- `status_show` returned `site_title: Helsinki Region Infoshare`, `site_url: https://hri.fi`, `ckan_version: 2.11.5`, and an enabled-extension list that includes `datastore`.
- All reviewed read actions worked anonymously in this run.
- Only the actions explicitly rechecked from the live official portal are counted below.

## Canonical endpoints/actions confirmed from the official site
1. `GET /api/3/action/help_show`
   - Base URL: `https://hri.fi/data`
   - Purpose: return the help string for a named CKAN action
   - Query parameters:
     - `name` - required action function name such as `package_search`
   - Error notes:
     - the official help text explicitly documents `ckan.logic.NotFound` when the action function does not exist

2. `GET /api/3/action/status_show`
   - Base URL: `https://hri.fi/data`
   - Purpose: return site configuration and capability metadata
   - Live confirmation:
     - returned `site_title`, `site_description`, `site_url`, `locale_default`, `extensions`, and `ckan_version`
     - confirmed the live portal host as `https://hri.fi`

3. `GET /api/3/action/package_list`
   - Base URL: `https://hri.fi/data`
   - Purpose: list dataset/package names on the portal
   - Official parameters:
     - `limit` - optional page size
     - `offset` - optional starting offset when `limit` is used
   - Live confirmation:
     - `package_list?limit=1` returned `3d-model-of-helsinki`

4. `GET /api/3/action/package_search`
   - Base URL: `https://hri.fi/data`
   - Purpose: search datasets in the catalogue
   - Official parameters called out in the reviewed help text:
     - `q`
     - `fq`
     - `fq_list`
     - `sort`
     - `rows` - default `10`, upper limit `1000` unless site config overrides it
     - `start`
     - `facet`
     - `facet.mincount`
     - `facet.limit`
     - `facet.field`
     - `include_drafts`
     - `include_deleted`
     - `include_private`
     - `use_default_schema`
     - advanced Solr params `qf`, `wt`, `bf`, `boost`, `tie`, `defType`, `mm`
   - Live confirmation:
     - `package_search?rows=0` returned `count: 549`, empty `results`, and `search_facets`

5. `GET /api/3/action/package_show`
   - Base URL: `https://hri.fi/data`
   - Purpose: return metadata for one dataset/package and its resources
   - Official parameters:
     - `id` - required dataset id or name
     - `use_default_schema` - optional boolean
     - `include_plugin_data` - optional sysadmin-only boolean
   - Live confirmation:
     - `package_show?id=3d-model-of-helsinki` returned metadata for package `3D model of Helsinki`
     - the reviewed response included keys such as `id`, `name`, `title`, `resources`, `groups`, and translated metadata fields

6. `GET /api/3/action/group_list`
   - Base URL: `https://hri.fi/data`
   - Purpose: list portal groups
   - Official parameters from the reviewed help text:
     - `type`
     - `order_by`
     - `sort`
     - `limit`
     - `offset`
     - `groups`
     - `all_fields`
     - `include_dataset_count`
     - `include_extras`
     - `include_tags`
     - `include_groups`
     - `include_users`
   - Live confirmation:
     - `group_list?limit=1` returned `asuminen`

7. `GET /api/3/action/organization_list`
   - Base URL: `https://hri.fi/data`
   - Purpose: list portal organizations
   - Official parameters from the reviewed help text:
     - `type`
     - `order_by`
     - `sort`
     - `limit`
     - `offset`
     - `organizations`
     - `all_fields`
     - `include_dataset_count`
     - `include_extras`
     - `include_tags`
     - `include_groups`
     - `include_users`
   - Live confirmation:
     - `organization_list?limit=1` returned `espoo`

## Pagination, filtering, and format notes
- The reviewed routes return CKAN JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_list` paginates with `limit` and `offset`.
- `package_search` uses Solr-style search/filtering and paginates with `rows` and `start`.
- `group_list` and `organization_list` paginate with `limit` and `offset`.
- The official help text for `package_search` explicitly documents faceting and advanced Solr tuning parameters.

## Error, auth, and access notes
- No official API key or bearer-token requirement was published for the reviewed read routes.
- The reviewed public calls succeeded anonymously.
- `help_show` explicitly documents a `NotFound` error when the action name does not exist.
- No portal-specific public rate-limit ceiling or shared HTTP error schema was published on the reviewed official pages.

## fireROUTE normalization notes
- Treat `https://hri.fi/data/api/3/action` as the canonical API base URL and `https://hri.fi/data/api/3` as the version root.
- Model this provider as a CKAN action API, not a conventional REST resource tree.
- `package_search` is the primary catalogue discovery route.
- Although `status_show` confirms the `datastore` extension is enabled, this shard did not complete a separate live resource-specific `datastore_search` verification, so it is intentionally excluded from the canonical route count.
