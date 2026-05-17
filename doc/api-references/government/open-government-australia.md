# Open Government, Australia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-australia`
- Official docs/pages used:
  - `https://www.data.gov.au/`
  - `https://www.data.gov.au/user-guide`
  - `https://docs.ckan.org/en/2.11/api/index.html`
  - `https://docs.ckan.org/en/2.11/maintaining/datastore.html`
  - `https://www.data.gov.au/data/api/3`
  - `https://www.data.gov.au/data/api/3/action/status_show`
  - `https://www.data.gov.au/data/api/3/action/package_search?rows=1`
  - `https://www.data.gov.au/data/api/3/action/package_show?id=native-title-determination-applications-register`
  - `https://www.data.gov.au/data/api/3/action/datastore_search?resource_id=_table_metadata&limit=1`
  - `https://www.data.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22db892d66-8a19-4b1f-ae14-3c389ab24eb5%22%20LIMIT%201`
- Current documented API host: `https://www.data.gov.au`
- Current documented API path prefix: `/data/api/3/action`
- Auth model: no API key or portal-specific auth flow was documented for public catalogue access; CKAN docs note private CKAN/DataStore resources require appropriate authorization
- Response format: JSON
- Manually confirmed route count: `5`

## Official usage notes
- The official data.gov.au site links developers to CKAN documentation rather than publishing a separate portal-specific API manual.
- Live provider checks confirmed the working action-API prefix is `/data/api/3/action`; the shorter root path `/api/3` returned a site 404 during this run.
- A live `status_show` response confirmed the site is CKAN-backed and currently has extensions enabled including `datastore`, `harvest`, `dcat`, `resource_proxy`, `stats`, and `drupal_api`.
- The public catalogue is readable without an API key on the reviewed pages.

## Canonical endpoints confirmed from the official site and linked official CKAN docs
1. `GET /data/api/3/action/status_show`
   - Base URL: `https://www.data.gov.au`
   - Purpose: return site configuration and extension information
   - Query parameters: none shown on the reviewed docs/pages
   - Live confirmation:
     - returns JSON with `site_title`, `site_description`, `site_url`, `locale_default`, and `extensions`

2. `GET /data/api/3/action/package_show`
   - Base URL: `https://www.data.gov.au`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or dataset name, required
     - `use_default_schema` - boolean, optional
     - `include_plugin_data` - boolean, sysadmin-only, optional
   - Live confirmation:
     - `package_show?id=native-title-determination-applications-register` returned a full dataset record during this run

3. `GET /data/api/3/action/package_search`
   - Base URL: `https://www.data.gov.au`
   - Purpose: search datasets in the catalogue
   - Official parameters called out in the reviewed CKAN docs:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - filter query string, optional
     - `fq_list` - list of additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum number of datasets to return, optional
     - `start` - result offset, optional
     - `facet` - enable facets, optional
     - `facet.mincount` - minimum count for facet values, optional
     - `facet.limit` - max facet values, optional
     - `facet.field` - facet fields, optional
     - `include_drafts` - boolean, optional
     - `include_deleted` - boolean, optional
     - `include_private` - boolean, optional
     - `use_default_schema` - boolean, optional
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, and `search_facets` on the provider host during this run

4. `GET /data/api/3/action/datastore_search`
   - Base URL: `https://www.data.gov.au`
   - Purpose: search rows in a DataStore resource
   - Official parameters from the reviewed DataStore docs:
     - `resource_id` - resource id or alias, required
     - `filters` - dictionary of field/value filters, optional
     - `q` - string or dictionary query, optional
     - `full_text` - full-text query string, optional
     - `distinct` - boolean, optional
     - `plain` - boolean, optional
     - `language` - query language, optional
     - `limit` - maximum rows to return, optional
     - `offset` - row offset, optional
     - `fields` - list or comma-separated field list, optional
     - `sort` - comma-separated sort expression, optional
     - `include_total` - boolean, optional
     - `total_estimation_threshold` - integer or null, optional
   - Live confirmation:
     - `datastore_search?resource_id=_table_metadata&limit=1` returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`

5. `GET /data/api/3/action/datastore_search_sql`
   - Base URL: `https://www.data.gov.au`
   - Purpose: execute SQL `SELECT` queries against public DataStore tables
   - Official parameters:
     - `sql` - single SQL `SELECT` statement, required
   - Official notes:
     - CKAN docs say this route is only available when `ckan.datastore.sqlsearch.enabled` is enabled
     - CKAN docs say result rows are capped at `32000` unless the site configuration raises the limit
   - Live confirmation:
     - `SELECT * from "db892d66-8a19-4b1f-ae14-3c389ab24eb5" LIMIT 1` succeeded on the provider host during this run

## Pagination, filtering, and format notes
- The reviewed official CKAN docs describe the Action API as JSON-based.
- `package_search` uses Solr-style query parameters and defaults to `10` rows per request; the reviewed CKAN docs say the default upper limit is `1000` unless the site configuration changes it.
- The live `package_search?rows=1` response on data.gov.au returned a total catalogue count of `130990` during this run.
- `datastore_search` defaults to `100` rows and the reviewed CKAN docs say the default upper limit is `32000` unless the site configuration changes it.
- `datastore_search` responses can include `_links.start`, `_links.next`, `total`, and `total_was_estimated`, which is the practical pagination shape exposed by the provider.
- `datastore_search_sql` supports SQL over DataStore tables, including joins according to the reviewed CKAN docs, but remains bounded by the site row limit.

## Error, auth, and access notes
- The reviewed CKAN docs say API responses commonly use a JSON envelope with `success`, `result`, and `help`.
- The reviewed CKAN docs also say CKAN often returns HTTP `200` even for application-level failures, so clients should inspect `success` and `error` fields in the JSON body.
- The same docs note that malformed requests can still surface HTTP `409`, `400`, or `500` responses.
- A live request to `datastore_search_sql` against `_table_metadata` returned a JSON `Authorization Error` with message `Access denied: Not authorized to access system tables`, confirming provider-side access controls on some SQL targets.
- No portal-specific rate-limit policy was published on the reviewed data.gov.au pages.

## fireROUTE normalization notes
- Treat `https://www.data.gov.au` as the canonical host and preserve the `/data/api/3/action` prefix exactly.
- Preserve the distinction between catalogue metadata routes (`status_show`, `package_show`, `package_search`) and DataStore row-query routes (`datastore_search`, `datastore_search_sql`).
- Do not assume the root-level CKAN path `/api/3/action` works on this portal; the reviewed live site only confirmed the `/data/api/3/action` prefix.