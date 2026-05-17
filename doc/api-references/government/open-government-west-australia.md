# Open Government, West Australia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-west-australia`
- Official docs/pages used:
  - `https://data.wa.gov.au/`
  - `https://catalogue.data.wa.gov.au/dataset`
  - `https://catalogue.data.wa.gov.au/api/3/action/help_show?name=help_show`
  - `https://catalogue.data.wa.gov.au/api/3/action/help_show?name=status_show`
  - `https://catalogue.data.wa.gov.au/api/3/action/help_show?name=package_list`
  - `https://catalogue.data.wa.gov.au/api/3/action/help_show?name=package_search`
  - `https://catalogue.data.wa.gov.au/api/3/action/help_show?name=package_show`
  - `https://catalogue.data.wa.gov.au/api/3/action/status_show`
  - `https://catalogue.data.wa.gov.au/api/3/action/package_list?limit=1`
  - `https://catalogue.data.wa.gov.au/api/3/action/package_search?rows=1`
  - `https://catalogue.data.wa.gov.au/api/3/action/package_show?id=mining-tenements-dmirs-003`
  - `https://catalogue.data.wa.gov.au/api/3/action/package_search?rows=20`
  - `https://catalogue.data.wa.gov.au/api/3/action/datastore_search?resource_id=eb9db2cb-3760-44fa-8fd2-2c7ae782f575&limit=1`
  - `https://catalogue.data.wa.gov.au/api/3/action/datastore_search_sql?sql=SELECT%20_id%20FROM%20%22eb9db2cb-3760-44fa-8fd2-2c7ae782f575%22%20LIMIT%201`
- Current documented API host: `https://catalogue.data.wa.gov.au`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or portal-specific auth flow was published on the reviewed public catalogue pages; reviewed public reads succeeded anonymously
- Response format: JSON for working action endpoints
- Manually confirmed route count: `6`

## Official usage notes
- The official `data.wa.gov.au` homepage links users into the catalogue host `https://catalogue.data.wa.gov.au`, which is the working API host for public catalogue access.
- A live `status_show` request returned `site_title`, `site_url`, `ckan_version`, and enabled extensions including `datastore`, confirming the catalogue is CKAN-backed.
- Live public reads worked without an API key during this run.
- `datastore_search_sql` is not available on this portal: the reviewed live request returned `Bad request - Action name not known: datastore_search_sql`.

## Canonical endpoints confirmed from the official site
1. `GET /api/3/action/help_show`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: return the help string for a named action
   - Query parameters:
     - `name` - action function name, required
   - Official notes:
     - returns the action help text or `None` when no docstring exists
     - can raise not-found for unknown action names

2. `GET /api/3/action/status_show`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: return site configuration information
   - Query parameters: none shown in the reviewed help/doc response
   - Live confirmation:
     - returned `site_title: data.wa.gov.au`
     - returned `site_url: https://catalogue.data.wa.gov.au`
     - returned `extensions` including `datastore`, `dcat`, `resource_proxy`, and `tracking`

3. `GET /api/3/action/package_list`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: list dataset names on the site
   - Official parameters:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is used, optional
   - Live confirmation:
     - `package_list?limit=1` returned `1-10-000-000-large-igneous-provinces-dmirs-081`

4. `GET /api/3/action/package_search`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: search datasets in the catalogue
   - Official parameters called out in the reviewed live help text:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - filter query string, optional
     - `fq_list` - additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum number of datasets to return, optional
     - `start` - result offset, optional
     - `facet` - enable facets, optional
     - `facet.mincount` - minimum count for facet values, optional
     - `facet.limit` - maximum facet values, optional
     - `facet.field` - facet fields, optional
     - `include_drafts` - boolean, optional
     - `include_deleted` - boolean, optional
     - `include_private` - boolean, optional
     - `use_default_schema` - boolean, optional
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, and `search_facets`
     - the reviewed live response returned a total count of `2910`
     - the first returned dataset name was `mining-tenements-dmirs-003`

5. `GET /api/3/action/package_show`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or dataset name, required
     - `use_default_schema` - boolean, optional
     - `include_plugin_data` - sysadmin-only boolean, optional
   - Live confirmation:
     - `package_show?id=mining-tenements-dmirs-003` returned dataset metadata for `Mining Tenements (DMIRS-003)`
     - the reviewed response included `8` resources

6. `GET /api/3/action/datastore_search`
   - Base URL: `https://catalogue.data.wa.gov.au`
   - Purpose: read rows from a public DataStore-backed resource
   - Confirmed parameters from the reviewed live request:
     - `resource_id` - resource id, required
     - `limit` - maximum rows to return, optional
   - Live confirmation:
     - `package_search?rows=20` exposed a public DataStore-backed resource id `eb9db2cb-3760-44fa-8fd2-2c7ae782f575`
     - `datastore_search?resource_id=eb9db2cb-3760-44fa-8fd2-2c7ae782f575&limit=1` succeeded and returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`
     - the reviewed response returned `total: 7` and a `_links.next` pagination pointer

## Pagination, filtering, and format notes
- The reviewed working action endpoints return JSON envelopes using top-level fields such as `help`, `success`, and `result`.
- `package_list` uses `limit` and `offset` pagination according to the reviewed official help text.
- `package_search` uses Solr-style query parameters and returns a total `count` plus `search_facets`.
- `datastore_search` returns `_links.next` for paging through rows and can expose `total` plus `total_was_estimated`.

## Error, auth, and access notes
- No public rate-limit policy was published on the reviewed Data WA pages.
- Public catalogue reads succeeded anonymously in the reviewed requests.
- `datastore_search_sql` was explicitly tested and is not available on this host.
- A request to `datastore_search` against the special `_table_metadata` resource returned a live `500 Internal Server Error` page during this run, so clients should prefer dataset-specific public DataStore resource ids.

## fireROUTE normalization notes
- Treat `https://catalogue.data.wa.gov.au` as the canonical API host for this provider.
- Preserve the `/api/3/action` prefix exactly.
- Separate catalogue metadata routes (`help_show`, `status_show`, `package_list`, `package_search`, `package_show`) from row-level DataStore access (`datastore_search`).
- Do not assume `datastore_search_sql` exists on this portal.