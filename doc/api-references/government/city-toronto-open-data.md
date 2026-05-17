# City, Toronto Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `city-toronto-open-data`
- Official docs/pages used:
  - `https://open.toronto.ca/`
  - `https://open.toronto.ca/dataset/central-intake-calls/`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=help_show`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=package_list`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=package_search`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=package_show`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=group_list`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/help_show?name=organization_list`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/status_show`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_list?limit=1`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_search?rows=0`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=10-year-cycling-network-plan-on-street-2016`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/group_list?limit=1`
  - `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/organization_list?limit=1`
- Assigned docs URL: `https://open.toronto.ca/`
- Current documented API base URL: `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action`
- API version root: `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3`
- Authentication model: no auth requirement was enforced on the reviewed public read actions
- Response format: successful action calls return JSON CKAN envelopes with top-level `help`, `success`, and `result`
- Rate limits: no official Toronto rate-limit policy or rate-limit headers were exposed on the reviewed read endpoints
- Pagination: `package_list`, `group_list`, and `organization_list` use `limit` and `offset`; `package_search` uses `rows` and `start`
- Error format: mixed; the CKAN help text documents `ckan.logic.NotFound`, but invalid action or missing-dataset probes returned Toronto-branded HTML `403/404 Error` pages in this run
- Manually confirmed canonical route count: `7`

## Official usage notes
- The official homepage loaded as `Homepage - City of Toronto Open Data Portal`.
- The official dataset page `Central Intake calls` loaded successfully and its rendered HTML included CKAN-hosted resource/download URLs on `ckan0.cf.opendata.inter.prod-toronto.ca` plus a `docs.ckan.org` reference, tying the CKAN infrastructure back to the Toronto portal.
- The official API version root returned `{"version": 3}`, confirming a live CKAN v3 API.
- `status_show` returned:
  - `site_url: https://ckan0.cf.opendata.inter.prod-toronto.ca`
  - `locale_default: en`
  - `ckan_version: 2.11.3`
  - extensions including `datastore`, `stats`, `text_view`, `image_view`, `geojson_view`, `datatables_view`, `scheming_datasets`, `updateschema`, `extendedapi`, `solr-sqs`, `extendedtheme`, and `iotrans`
- `package_list?limit=1` returned the live dataset slug `10-year-cycling-network-plan-on-street-2016`.
- `package_search?rows=0` returned `count: 538`.
- `organization_list?limit=1` returned `city-of-toronto`.
- `group_list?limit=1` returned an empty array in this run.
- `package_show?id=10-year-cycling-network-plan-on-street-2016` returned live metadata including `author`, `author_email`, `civic_issues`, `dataset_category`, `formats`, `information_url`, `metadata_created`, and `metadata_modified`.

## Canonical endpoints/actions confirmed from the official site
1. `GET /api/3/action/help_show`
   - Purpose: return the help string for a named CKAN action
   - Query parameters:
     - `name` - required action function name such as `package_search`
   - Error notes:
     - the official help text explicitly documents `ckan.logic.NotFound` when the named action does not exist

2. `GET /api/3/action/status_show`
   - Purpose: return site configuration and capability metadata
   - Live confirmation:
     - returned `site_url`, `locale_default`, `extensions`, and `ckan_version`

3. `GET /api/3/action/package_list`
   - Purpose: list dataset/package names
   - Official parameters:
     - `limit` - optional page size
     - `offset` - optional starting offset when `limit` is used
   - Live confirmation:
     - `package_list?limit=1` returned `10-year-cycling-network-plan-on-street-2016`

4. `GET /api/3/action/package_search`
   - Purpose: search datasets in the catalogue
   - Official parameters called out in the reviewed help text:
     - `q`
     - `fq`
     - `fq_list`
     - `sort`
     - `rows` - default `10`, upper limit `1000` unless site configuration overrides it
     - `start`
     - `facet`
     - `facet.mincount`
     - `facet.limit`
     - `facet.field`
     - `include_drafts`
     - `include_deleted`
     - `include_private`
     - `use_default_schema`
     - advanced Solr tuning parameters mentioned in the help text
   - Live confirmation:
     - `package_search?rows=0` returned `count: 538`

5. `GET /api/3/action/package_show`
   - Purpose: return one dataset/package and its resources/metadata
   - Official parameters:
     - `id` - required dataset id or name
     - `use_default_schema` - optional boolean
     - `include_plugin_data` - optional sysadmin-only boolean
   - Live confirmation:
     - the reviewed `10-year-cycling-network-plan-on-street-2016` call returned metadata fields including `author`, `dataset_category`, `formats`, `information_url`, and timestamps

6. `GET /api/3/action/group_list`
   - Purpose: list groups
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
     - `group_list?limit=1` returned an empty array in this run

7. `GET /api/3/action/organization_list`
   - Purpose: list organizations
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
     - `organization_list?limit=1` returned `city-of-toronto`

## Pagination, auth, and error notes
- All reviewed read actions worked anonymously in this run.
- No API key or bearer-token requirement was surfaced on the reviewed read actions.
- `package_list`, `group_list`, and `organization_list` use `limit` and `offset` pagination.
- `package_search` uses `rows` and `start` pagination and can also return facet structures.
- Successful action responses use CKAN JSON envelopes with top-level `help`, `success`, and `result`.
- Invalid action and missing-dataset probes returned Toronto-branded HTML `403/404 Error` pages rather than CKAN JSON error envelopes in this run, so fireROUTE should not assume JSON error bodies for all failures.
- No Toronto-specific rate-limit ceiling was documented on the reviewed pages, and no `X-RateLimit-*` headers appeared on the reviewed live responses.

## fireROUTE normalization notes
- Normalize this provider as a CKAN action API with canonical base `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action`.
- Use the official Toronto portal pages to establish provider ownership, then treat the CKAN host as the actual API surface.
- `package_search` is the primary discovery route for dataset search.
- Keep error handling flexible because success responses are CKAN JSON but 404-style failures were themed HTML in this run.
