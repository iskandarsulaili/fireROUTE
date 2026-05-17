# City, Lviv

## Provider metadata
- Category: `Government`
- Provider slug: `city-lviv`
- Official docs/pages used:
  - `https://opendata.city-adm.lviv.ua/api/3`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=help_show`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=status_show`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=package_search`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=organization_list`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=package_show`
  - `https://opendata.city-adm.lviv.ua/api/3/action/help_show?name=group_list`
- Current documented API base URL: `https://opendata.city-adm.lviv.ua/api/3/action`
- API version root: `https://opendata.city-adm.lviv.ua/api/3`
- Auth model: no auth requirement was documented or enforced on the reviewed public read endpoints
- Response format: JSON
- Manually confirmed route count: `6`

## Official usage notes
- The official `/api/3` endpoint returns `{"version": 3}`, confirming a CKAN v3 API surface.
- The reviewed API behaves as a CKAN action API: routes are invoked under `/api/3/action/...`.
- The `help_show` action returns API documentation strings inside a JSON envelope with top-level fields such as `help`, `success`, and `result`.
- Only actions explicitly confirmed from the live official Lviv portal are counted below.

## Canonical endpoints/actions confirmed from the official site
1. `GET /api/3/action/help_show`
   - Query parameter: `name` (action function name, for example `package_search`)
   - Returns the help string for the named action
   - Official docs note it can raise `ckan.logic.NotFound` when the action does not exist

2. `GET /api/3/action/status_show`
   - Returns a dictionary with information about the site's configuration

3. `GET /api/3/action/package_search`
   - Primary dataset search route
   - Documented parameters:
     - `q`
     - `fq`
     - `fq_list`
     - `sort`
     - `rows` (default `10`, upper limit `1000` unless site config overrides it)
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
   - Official examples include `q=flood`, `fq=tags:economy`, and facet queries such as `facet.field=["tags"] facet.limit=10 rows=0`
   - Result keys documented by the official help text: `count`, `results`, deprecated `facets`, and `search_facets`

4. `GET /api/3/action/organization_list`
   - Returns organization names or organization dictionaries
   - Documented parameters:
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
   - Official defaults note `limit` is normally `1000` when `all_fields=false`, or `25` when `all_fields=true`, unless site config overrides it

5. `GET /api/3/action/package_show`
   - Returns metadata for a single dataset and its resources
   - Documented parameters:
     - `id` (dataset id or name)
     - `use_default_schema`
     - `include_tracking`
     - `include_plugin_data`

6. `GET /api/3/action/group_list`
   - Returns group names or group dictionaries
   - Documented parameters:
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
   - Official defaults note `limit` is normally `1000` when `all_fields=false`, or `25` when `all_fields=true`, unless site config overrides it

## Pagination, filtering, and format notes
- `package_search` uses Solr-style pagination via `rows` and `start`.
- `organization_list` and `group_list` use `limit` plus `offset` pagination.
- The API returns JSON for the reviewed endpoints.
- The official search help text documents both free-text searching (`q`) and structured filtering (`fq`, `fq_list`, facet fields, and sort controls).

## Error and rate-limit notes
- `help_show` explicitly documents a `NotFound` error when the named action does not exist.
- No portal-specific public rate-limit policy was published on the reviewed Lviv API pages.
- No shared HTTP error schema beyond the standard CKAN-style JSON envelope was documented on the reviewed pages.

## fireROUTE normalization notes
- This provider exposes a CKAN action API rather than a conventional REST resource tree.
- `package_search` is the main route for catalog search and discovery.
- Because the official Lviv portal exposes action help pages rather than a single curated endpoint index, only the actions explicitly rechecked in this run are counted here.
