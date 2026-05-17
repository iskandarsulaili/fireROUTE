# Open Government, South Australian Government

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-south-australian-government`
- Official docs/pages used:
  - `https://data.sa.gov.au/`
  - `https://data.sa.gov.au/data/dataset`
  - `https://docs.ckan.org/en/latest/api/`
  - `https://data.sa.gov.au/data/api/3/action/status_show`
  - `https://data.sa.gov.au/data/api/3/action/help_show?name=package_search`
  - `https://data.sa.gov.au/data/api/3/action/package_list?limit=1`
  - `https://data.sa.gov.au/data/api/3/action/package_search?rows=20`
  - `https://data.sa.gov.au/data/api/3/action/package_show?id=water-quality`
  - `https://data.sa.gov.au/data/api/3/action/datastore_search?resource_id=71f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b&limit=1`
  - `https://data.sa.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20FROM%20%2271f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b%22%20LIMIT%201`
- Current documented API host: `https://data.sa.gov.au`
- Current documented API path prefix: `/data/api/3/action`
- Auth model: no API key or portal-specific auth requirement was published on the reviewed public catalogue pages; reviewed read requests succeeded anonymously
- Response format: JSON
- Rate limits: no public rate-limit policy was published on the reviewed Data.SA pages
- Manually confirmed route count: `7`

## Official usage notes
- The Data.SA homepage links directly to the official CKAN API guide, and the live `status_show` response confirms the portal is CKAN-backed.
- The reviewed live `status_show` response returned `ckan_version: 2.9.12`, `site_title: data.sa.gov.au`, and enabled extensions including `datastore` and `dcat`.
- A reviewed live `package_search?rows=20` response returned `count: 1918` datasets.
- The reviewed dataset `water-quality` exposed a DataStore-backed resource id `71f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b`, which made both `datastore_search` and `datastore_search_sql` available for live confirmation.

## Canonical endpoints confirmed from the official site
1. `GET /data/api/3/action/help_show`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: return the help text for a named CKAN action
   - Query parameters:
     - `name` - action name, required
   - Official notes:
     - the reviewed `help_show?name=package_search` response returned the package-search documentation text

2. `GET /data/api/3/action/status_show`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: return site configuration and capability information
   - Query parameters: none shown in the reviewed live response
   - Live confirmation:
     - returned `site_url: https://data.sa.gov.au`
     - returned `ckan_version: 2.9.12`
     - returned enabled extensions including `datastore`, `resource_proxy`, `text_view`, and `dcat`

3. `GET /data/api/3/action/package_list`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: list dataset names in the catalogue
   - Official parameters:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is supplied, optional
   - Live confirmation:
     - `package_list?limit=1` returned `19th-century-photographs-by-captain-samuel-sweet`

4. `GET /data/api/3/action/package_search`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: search datasets in the public catalogue
   - Official parameters called out in the reviewed help text:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - Solr filter query string, optional
     - `fq_list` - additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum datasets to return, optional
     - `start` - result offset, optional
     - `facet` - enable facets, optional
     - `facet.mincount` - facet minimum count, optional
     - `facet.limit` - facet result limit, optional
     - `facet.field` - one or more facet fields, optional
     - `include_drafts` - boolean, optional
     - `include_deleted` - boolean, optional
     - `include_private` - boolean, optional
     - `use_default_schema` - boolean, optional
   - Live confirmation:
     - `package_search?rows=20` returned `count`, `results`, and `search_facets`
     - the reviewed response returned `count: 1918`
     - the first reviewed dataset name was `database-update-package-pdf`

5. `GET /data/api/3/action/package_show`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or dataset name, required
     - `use_default_schema` - boolean, optional
     - `include_plugin_data` - sysadmin-only boolean, optional
   - Live confirmation:
     - `package_show?id=water-quality` returned dataset metadata for `Water Quality`
     - the reviewed response included a public DataStore-backed resource id `71f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b`

6. `GET /data/api/3/action/datastore_search`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: read rows from a DataStore-backed resource
   - Confirmed parameters from the reviewed live response:
     - `resource_id` - resource id, required
     - `limit` - maximum rows to return, optional
     - `offset` - row offset, implied by returned pagination links
   - Live confirmation:
     - `datastore_search?resource_id=71f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b&limit=1` succeeded
     - the reviewed response returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`
     - the first returned record contained `Field: Region name` and `Description: Defined South Australian areas`

7. `GET /data/api/3/action/datastore_search_sql`
   - Base URL: `https://data.sa.gov.au`
   - Purpose: query a DataStore resource with SQL
   - Confirmed parameters from the reviewed live response:
     - `sql` - SQL statement, required
   - Live confirmation:
     - `datastore_search_sql?sql=SELECT * FROM "71f9ff52-24e0-4cd7-9b43-5ef9c44b7a1b" LIMIT 1` succeeded
     - the reviewed response returned `records`, `fields`, and the echoed `sql` string
     - the returned fields included `_full_text`, confirming PostgreSQL-backed DataStore SQL access is enabled on this host

## Pagination, filtering, and format notes
- Reviewed action endpoints return CKAN-style JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_list` uses `limit` and `offset` pagination.
- `package_search` uses Solr-style search/filter parameters and returns total `count` plus `search_facets`.
- `datastore_search` returns `_links.start` and `_links.next` for paging and also exposes `total` and `total_was_estimated`.
- `datastore_search_sql` accepts SQL in the query string and returns typed `fields` metadata alongside result rows.

## Error, auth, and access notes
- No portal-specific API key requirement was published on the reviewed public Data.SA pages for these read routes.
- Public catalogue and DataStore reads succeeded anonymously during this run.
- No explicit public rate-limit policy was published on the reviewed official pages.
- CKAN action responses expose per-route help URLs, which are useful for checking route-specific behavior before integrating additional actions.

## fireROUTE normalization notes
- Treat `https://data.sa.gov.au` as the canonical API host.
- Preserve the `/data/api/3/action` prefix exactly.
- Separate catalogue metadata routes (`help_show`, `status_show`, `package_list`, `package_search`, `package_show`) from row-level DataStore access (`datastore_search`, `datastore_search_sql`).
- Do not assume every listed resource is DataStore-backed; confirm `datastore_active` at the dataset level before calling DataStore routes.
