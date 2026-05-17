# Open Government, Victoria State Government

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-victoria-state-government`
- Official docs/pages used:
  - `https://www.data.vic.gov.au/`
  - `https://discover.data.vic.gov.au/`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=help_show`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=status_show`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=package_list`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=package_search`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=package_show`
  - `https://discover.data.vic.gov.au/api/3/action/help_show?name=datastore_search`
  - `https://discover.data.vic.gov.au/api/3/action/package_list?limit=1`
  - `https://discover.data.vic.gov.au/api/3/action/package_search?rows=1`
  - `https://discover.data.vic.gov.au/api/3/action/package_show?id=fair-jobs-code-registers`
  - `https://discover.data.vic.gov.au/api/3/action/datastore_search?resource_id=0cf2ea00-0fa2-45e3-952f-99c2277c1fe8&limit=1`
  - `https://discover.data.vic.gov.au/api/3/action/status_show`
  - `https://discover.data.vic.gov.au/api/3/action/datastore_search_sql?sql=SELECT%20_id%20FROM%20%220cf2ea00-0fa2-45e3-952f-99c2277c1fe8%22%20LIMIT%201`
- Current documented API host: `https://discover.data.vic.gov.au`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or portal-specific auth flow was published for the reviewed public catalogue reads; the official DataStore help notes private CKAN resources require appropriate authorization
- Response format: JSON for working action endpoints
- Manually confirmed route count: `5`

## Official usage notes
- The official `data.vic.gov.au` homepage links its search experience to `https://discover.data.vic.gov.au/`, which is the working catalogue/API host.
- Public catalogue and public DataStore reads succeeded without an API key during this run.
- The official help endpoint publishes `status_show`, but direct live `GET` and `POST` requests to `/api/3/action/status_show` returned `{"error":{"message":"Invalid request"},"success":false}` during this run, so that route is not counted here.
- `datastore_search_sql` is not available on this portal: the reviewed live request returned `Bad request - Action name not known: datastore_search_sql`.

## Canonical endpoints confirmed from the official site
1. `GET /api/3/action/help_show`
   - Base URL: `https://discover.data.vic.gov.au`
   - Purpose: return the help string for a named action
   - Query parameters:
     - `name` - action function name, required
   - Official notes:
     - returns the action help text or `None` when no docstring exists
     - can raise not-found for unknown action names

2. `GET /api/3/action/package_list`
   - Base URL: `https://discover.data.vic.gov.au`
   - Purpose: list dataset names on the site
   - Official parameters:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is used, optional
   - Live confirmation:
     - `package_list?limit=1` returned `100000-metre-squares`

3. `GET /api/3/action/package_search`
   - Base URL: `https://discover.data.vic.gov.au`
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
     - the reviewed live response returned a total count of `5594`
     - the first returned dataset name was `fair-jobs-code-registers`

4. `GET /api/3/action/package_show`
   - Base URL: `https://discover.data.vic.gov.au`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or dataset name, required
     - `use_default_schema` - boolean, optional
     - `include_plugin_data` - sysadmin-only boolean, optional
   - Live confirmation:
     - `package_show?id=fair-jobs-code-registers` returned dataset metadata for `Fair Jobs Code Registers`
     - the reviewed response included two CSV resources
     - both reviewed resources had `datastore_active: true`

5. `GET /api/3/action/datastore_search`
   - Base URL: `https://discover.data.vic.gov.au`
   - Purpose: search rows in a DataStore resource
   - Official parameters called out in the reviewed live help text:
     - `resource_id` - resource id or alias, required
     - `filters` - field/value filters, optional
     - `q` - full-text or fielded query, optional
     - `full_text` - full-text query across all fields, optional
     - `distinct` - return only distinct rows, optional
     - `plain` - treat query as plain text, optional
     - `language` - full-text language, optional
     - `limit` - maximum rows to return, optional
     - `offset` - row offset, optional
     - `fields` - list of fields to return, optional
     - `sort` - sort expression, optional
     - `include_total` - boolean, optional
     - `total_estimation_threshold` - integer or null, optional
     - `records_format` - output record format, optional
   - Live confirmation:
     - `datastore_search?resource_id=0cf2ea00-0fa2-45e3-952f-99c2277c1fe8&limit=1` succeeded
     - the reviewed response returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`
     - the reviewed response returned `total: 8407` and a `_links.next` pagination pointer

## Pagination, filtering, and format notes
- The reviewed working action endpoints return JSON envelopes using top-level fields such as `help`, `success`, and `result`.
- `package_list` paginates with `limit` and `offset`.
- `package_search` uses Solr-style filtering and paging with `rows` and `start`, and returns `count` plus `search_facets`.
- `datastore_search` defaults to row-based paging and returns `_links.next` for continuation.
- The reviewed `datastore_search` response exposed field names directly in `fields`, including `_id`, `CertificateNumber`, `EntityName`, `TradeName`, `ABN`, `Status`, `IssueDate`, and `ExpiryDate`.

## Error, auth, and access notes
- No portal-specific public rate-limit policy was published on the reviewed Victoria pages.
- Public catalogue and public DataStore reads worked anonymously during this run.
- The reviewed official help text for `datastore_search` states that private CKAN resources require appropriate authorization.
- `status_show` currently returns `Invalid request` on this portal even though the help endpoint still documents it.
- `datastore_search_sql` is not available on this host.

## fireROUTE normalization notes
- Treat `https://discover.data.vic.gov.au` as the canonical API host for this provider.
- Preserve the `/api/3/action` prefix exactly.
- Route public catalogue metadata calls through `help_show`, `package_list`, `package_search`, and `package_show`.
- Route row-level access through `datastore_search` only.
- Do not assume `status_show` or `datastore_search_sql` are usable on this portal.