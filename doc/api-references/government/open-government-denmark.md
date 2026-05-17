# Open Government, Denmark

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-denmark`
- Official docs/pages used:
  - `https://www.opendata.dk/`
  - `https://admin.opendata.dk/`
  - `https://admin.opendata.dk/api/3/action/status_show`
  - `https://admin.opendata.dk/api/3/action/package_search?rows=1`
  - `https://admin.opendata.dk/api/3/action/package_show?id=byinventar`
  - `https://admin.opendata.dk/api/3/action/package_list`
  - `https://admin.opendata.dk/api/3/action/organization_list`
  - `https://admin.opendata.dk/api/3/action/group_list`
  - `https://admin.opendata.dk/api/3/action/resource_show?id=247731eb-fe1b-4080-a200-f59e803f125a`
  - `https://admin.opendata.dk/api/3/action/datastore_search?resource_id=247731eb-fe1b-4080-a200-f59e803f125a&limit=1`
  - `https://docs.ckan.org/en/2.11/api/index.html`
- Assigned docs URL: `https://www.opendata.dk/`
- Current documented API host: `https://admin.opendata.dk`
- Current documented API path prefix: `/api/3/action`
- Auth model: public catalogue metadata worked anonymously; the reviewed official pages did not publish a portal-specific API key requirement for these read routes
- Response format: JSON
- Manually confirmed route count: `7`

## Official usage notes
- The public Open Data DK portal is served from `https://www.opendata.dk/`, but the live JSON action API exposed by the official platform during this run was on the official admin subdomain `https://admin.opendata.dk`.
- `status_show` identified the reviewed host as `Open Data DK` and confirmed a CKAN-backed action API.
- `package_search?rows=1` returned a live catalogue count of `631` datasets during this run.
- The reviewed sample dataset `byinventar` exposed a resource with id `247731eb-fe1b-4080-a200-f59e803f125a` and an external GeoJSON/WFS URL rather than an internal CKAN DataStore table.
- A live `datastore_search` request against that sample resource id returned `Not Found`, so the canonical route inventory for this provider stays focused on the confirmed metadata catalogue actions rather than CKAN DataStore row-query routes.

## Canonical endpoints confirmed from the official site and linked official CKAN docs
1. `GET /api/3/action/status_show`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: return site configuration and extension information
   - Query parameters: none shown on the reviewed docs/pages
   - Live confirmation:
     - returned JSON with fields such as `site_title`, `site_url`, `locale_default`, and `extensions`

2. `GET /api/3/action/package_list`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: list datasets in the catalogue
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - returned a JSON array of dataset identifiers on the reviewed host

3. `GET /api/3/action/package_search`
   - Base URL: `https://admin.opendata.dk`
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

4. `GET /api/3/action/package_show`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or dataset name, required
     - `use_default_schema` - boolean, optional
     - `include_plugin_data` - boolean, sysadmin-only, optional
   - Live confirmation:
     - `package_show?id=byinventar` returned a full dataset record with resource metadata and external resource URLs

5. `GET /api/3/action/resource_show`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: return metadata for one resource
   - Parameters confirmed in the reviewed live request:
     - `id` - resource identifier, required for the reviewed request
   - Live confirmation:
     - `resource_show?id=247731eb-fe1b-4080-a200-f59e803f125a` returned resource metadata including `format`, `url`, `created`, and `datastore_active`

6. `GET /api/3/action/organization_list`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: list organizations/publishers on the portal
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - returned organization names such as `city-of-aarhus`, `ballerup-kommune`, and `vejdirektoratet`

7. `GET /api/3/action/group_list`
   - Base URL: `https://admin.opendata.dk`
   - Purpose: list topic groups on the portal
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - returned group names such as `population-and-social-conditions`, `transport`, and `economy-and-finance`

## Pagination, filtering, and format notes
- The reviewed official CKAN docs describe the Action API as JSON-based.
- `package_search` uses Solr-style query parameters and defaults to `10` rows per request; the reviewed CKAN docs say the default upper limit is `1000` unless the site configuration changes it.
- `package_search` returned the provider’s live catalogue count and dataset results during this run.
- The sample resource metadata pointed to an external WFS/GeoJSON URL, so resource payload retrieval may happen on publisher systems rather than through CKAN-hosted DataStore routes.

## Error, auth, and access notes
- The reviewed CKAN docs say API responses commonly use a JSON envelope with `success`, `result`, and `help`.
- The same docs note CKAN can return HTTP `200` even for application-level failures, so clients should inspect the JSON `success` and `error` fields.
- A reviewed live request to `datastore_search` on the sample resource id returned JSON with `success: false` and a `Not Found Error`, confirming that not every Open Data DK resource is backed by a queryable CKAN DataStore table.
- The reviewed official pages did not publish a portal-specific rate-limit policy.
- Public metadata routes succeeded anonymously during this run.

## fireROUTE normalization notes
- Treat `https://admin.opendata.dk` as the canonical API host for this provider, not the public marketing/homepage host.
- Preserve the `/api/3/action` prefix exactly.
- Model Open Data DK primarily as a CKAN metadata catalogue adapter unless a later official review confirms broadly available provider-hosted DataStore routes.
- Keep CKAN search/filter arguments as passthrough parameters rather than attempting to remap them into a narrower custom schema.