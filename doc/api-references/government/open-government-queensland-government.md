# Open Government, Queensland Government

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-queensland-government`
- Official docs/pages used:
  - `https://www.data.qld.gov.au/`
  - `https://www.data.qld.gov.au/article/news-and-events/data.qld.gov.au-update-to-ckan-2.11`
  - `https://www.data.qld.gov.au/api/3/action/status_show`
  - `https://www.data.qld.gov.au/api/3/action/package_list?limit=1`
  - `https://www.data.qld.gov.au/api/3/action/package_search?rows=100`
  - `https://www.data.qld.gov.au/api/3/action/package_show?id=coastal-data-system-near-real-time-storm-tide-data`
  - `https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=7afe7233-fae0-4024-bc98-3a72f05675bd&limit=1`
- Current documented API host: `https://www.data.qld.gov.au`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or portal-specific auth requirement was published on the reviewed public catalogue pages; reviewed read requests succeeded anonymously
- Response format: JSON
- Rate limits: no public rate-limit policy was published on the reviewed Open Data Queensland pages
- Manually confirmed route count: `5`

## Official usage notes
- The Open Data Queensland homepage states that the portal exposes more than `188,000` datasets and `17,500` resources.
- The official news article reviewed during this run documents that the portal was updated to CKAN `2.11`.
- The reviewed live `status_show` response returned enabled extensions including `datastore`, `dcat`, and Queensland-specific extensions such as `data_qld`.
- The reviewed live `package_search?rows=100` response returned `count: 188777` datasets.
- The reviewed dataset `coastal-data-system-near-real-time-storm-tide-data` exposed a DataStore-backed resource id `7afe7233-fae0-4024-bc98-3a72f05675bd`, which allowed live confirmation of row-level DataStore access.

## Canonical endpoints confirmed from the official site
1. `GET /api/3/action/status_show`
   - Base URL: `https://www.data.qld.gov.au`
   - Purpose: return site configuration and capability information
   - Query parameters: none shown in the reviewed live response
   - Live confirmation:
     - returned `site_title: Open Data Portal | Queensland Government`
     - returned `site_url: https://www.data.qld.gov.au`
     - returned extensions including `datastore`, `resource_proxy`, `dcat`, and `data_qld`

2. `GET /api/3/action/package_list`
   - Base URL: `https://www.data.qld.gov.au`
   - Purpose: list dataset names in the catalogue
   - Confirmed parameters from the reviewed live response:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is supplied, optional
   - Live confirmation:
     - `package_list?limit=1` returned `10k-contracts-queensland-museum-december-2025`

3. `GET /api/3/action/package_search`
   - Base URL: `https://www.data.qld.gov.au`
   - Purpose: search datasets in the public catalogue
   - Confirmed parameters from the reviewed live response and returned help links:
     - `q` - search query, optional
     - `rows` - maximum datasets to return, optional
     - `start` - result offset, optional
     - `sort` - sort expression, optional
     - `fq` - filter query, optional
   - Live confirmation:
     - `package_search?rows=100` returned `count`, `results`, and `search_facets`
     - the reviewed response returned `count: 188777`
     - one reviewed dataset was `coastal-data-system-near-real-time-storm-tide-data`

4. `GET /api/3/action/package_show`
   - Base URL: `https://www.data.qld.gov.au`
   - Purpose: return metadata for one dataset and its resources
   - Confirmed parameters from the reviewed live response:
     - `id` - dataset id or dataset name, required
   - Live confirmation:
     - `package_show?id=coastal-data-system-near-real-time-storm-tide-data` returned dataset metadata for `Coastal Data System – Near real time storm tide data`
     - the reviewed response included a public DataStore-backed resource id `7afe7233-fae0-4024-bc98-3a72f05675bd`

5. `GET /api/3/action/datastore_search`
   - Base URL: `https://www.data.qld.gov.au`
   - Purpose: read rows from a DataStore-backed resource
   - Confirmed parameters from the reviewed live response:
     - `resource_id` - resource id, required
     - `limit` - maximum rows to return, optional
     - `offset` - row offset, implied by returned pagination links
   - Live confirmation:
     - `datastore_search?resource_id=7afe7233-fae0-4024-bc98-3a72f05675bd&limit=1` succeeded
     - the reviewed response returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`
     - the first returned record included `Site: abellpoint`, `DateTime: 2026-05-09T00:00`, and water-level values

## Pagination, filtering, and format notes
- Reviewed action endpoints return CKAN-style JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_list` uses `limit` and `offset` pagination.
- `package_search` returns total `count`, result arrays, and `search_facets`; it also emits route-specific `help` URLs under `/api/3/action/help_show`.
- `datastore_search` returns `_links.start` and `_links.next` for paging, along with `total` and `total_was_estimated`.

## Error, auth, and access notes
- No portal-specific API key requirement was published on the reviewed public Queensland catalogue pages for these read routes.
- Public catalogue and DataStore reads succeeded anonymously during this run.
- No explicit public rate-limit policy was published on the reviewed official pages.
- The live responses consistently advertised per-route `help` links, which can be used for route-specific drill-down when documenting additional CKAN actions later.

## fireROUTE normalization notes
- Treat `https://www.data.qld.gov.au` as the canonical API host.
- Preserve the `/api/3/action` prefix exactly.
- Separate catalogue metadata routes (`status_show`, `package_list`, `package_search`, `package_show`) from row-level DataStore access (`datastore_search`).
- Do not assume every resource is DataStore-backed; confirm a resource id from dataset metadata before calling `datastore_search`.
