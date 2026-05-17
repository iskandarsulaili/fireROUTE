# Istanbul (İBB) Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `istanbul-i-bb-open-data`
- Official docs/pages used:
  - `https://data.ibb.gov.tr`
  - `https://data.ibb.gov.tr/en/`
  - `https://data.ibb.gov.tr/license`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=help_show`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=status_show`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=package_list`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=package_search`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=package_show`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=group_list`
  - `https://data.ibb.gov.tr/api/3/action/help_show?name=datastore_search`
  - `https://data.ibb.gov.tr/api/3/action/status_show`
  - `https://data.ibb.gov.tr/api/3/action/package_list`
  - `https://data.ibb.gov.tr/api/3/action/package_search?rows=1`
  - `https://data.ibb.gov.tr/api/3/action/package_show?id=ortalama-varis-suresi`
  - `https://data.ibb.gov.tr/api/3/action/group_list`
  - `https://data.ibb.gov.tr/api/3/action/organization_list`
  - `https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=df310e9e-9ce1-4564-99b8-6e027a74f226`
  - `https://data.ibb.gov.tr/api/3/action/datastore_search_sql?sql=SELECT%20*%20FROM%20%22df310e9e-9ce1-4564-99b8-6e027a74f226%22%20LIMIT%201`
  - `https://data.ibb.gov.tr/api/3/action/package_show?id=does-not-exist-xyz`
  - `https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=does-not-exist-xyz`
- Current documented API host: `https://data.ibb.gov.tr`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key, token, or portal-specific auth flow was published on the reviewed public pages; the reviewed catalogue and DataStore read routes worked anonymously
- Response format: JSON envelopes with CKAN-style top-level `help`, `success`, and `result` fields on the reviewed action routes
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `9`

## Official usage notes
- The official Istanbul Metropolitan Municipality open-data portal is live at `https://data.ibb.gov.tr`, and the reviewed `status_show` response identified the host as CKAN `2.9.11` with extensions including `multilang`, `datastore`, `xloader`, and `geo_view`.
- The English portal frontend at `https://data.ibb.gov.tr/en/` is also live, confirming an official bilingual web surface alongside the API actions.
- The reviewed `package_search?rows=1` response reported `542` datasets at review time and exposed a live dataset `ortalama-varis-suresi` with DataStore-backed resources.
- The reviewed `package_show?id=ortalama-varis-suresi` response exposed live resource ids including `df310e9e-9ce1-4564-99b8-6e027a74f226` and showed `license_title: Istanbul Metropolitan Municipality Open Data License`.
- The official license page at `https://data.ibb.gov.tr/license` is live on the portal and should be consulted separately for legal reuse terms.

## Canonical endpoints confirmed from the official site
1. `GET /api/3/action/help_show`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: return the help text for a named CKAN action
   - Query parameters:
     - `name` - action name, required
   - Live confirmation:
     - reviewed successfully for `status_show`, `package_list`, `package_search`, `package_show`, `group_list`, and `datastore_search`

2. `GET /api/3/action/status_show`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: return site configuration and capability metadata
   - Query parameters: none shown in the reviewed help output
   - Live confirmation:
     - returned `site_title: IMM`, `site_description: Open Data Portal`, `site_url: https://data.ibb.gov.tr`, `locale_default: tr`, `ckan_version: 2.9.11`, and enabled extensions

3. `GET /api/3/action/package_list`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: list dataset names on the portal
   - Official parameters:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is used, optional
   - Live confirmation:
     - the route responded successfully on the reviewed host
     - the official `help_show` page documents offset-based paging for this action

4. `GET /api/3/action/package_search`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: search datasets in the public catalogue
   - Official parameters called out in the reviewed help text:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - filter-query string, optional
     - `fq_list` - additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum rows to return, optional, default `10`, upper limit `1000` unless changed in site config
     - `start` - result offset, optional
     - `facet` - enable faceted results, optional
     - `facet.mincount` - minimum count for facet values, optional
     - `facet.limit` - maximum facet values, optional
     - `facet.field` - facet fields, optional
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, `facets`, and `search_facets`
     - the reviewed response reported total dataset count `542`

5. `GET /api/3/action/package_show`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or name, required
     - `use_default_schema` - boolean, optional
     - `include_tracking` - boolean, optional
   - Live confirmation:
     - `package_show?id=ortalama-varis-suresi` returned full dataset metadata and three resource objects
     - the reviewed response exposed DataStore-backed resource id `df310e9e-9ce1-4564-99b8-6e027a74f226`

6. `GET /api/3/action/group_list`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: list portal groups
   - Official parameters from the reviewed help output:
     - `order_by` - deprecated sort field, optional
     - `sort` - sort expression, optional
     - `groups` - list of group names to return, optional
     - `all_fields` - return full group dictionaries instead of names, optional
     - `include_extras` - include group extras when `all_fields=true`, optional
     - `include_tags` - include group tags when `all_fields=true`, optional
     - `include_groups` - include parent groups when `all_fields=true`, optional
   - Live confirmation:
     - returned group names including `bilgi-hizmetleri`, `guvenlik`, `ulasim-hizmetleri`, and `yonetisim`

7. `GET /api/3/action/organization_list`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: list portal organizations / publishers
   - Official parameters: the live `organization_list` route succeeded, but a dedicated reviewed `help_show?name=organization_list` page was not captured in this run; CKAN-style list actions on this host still expose organization-name listings publicly
   - Live confirmation:
     - returned organization names including `iett-genel-mudurlugu`, `metro-istanbul-a-s`, `istanbul-istatistik-ofisi`, `tuik`, and many other publishers

8. `GET /api/3/action/datastore_search`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: search rows in a DataStore-backed resource
   - Official parameters called out in the reviewed help text:
     - `resource_id` - resource id or alias, required
     - `filters` - matching-conditions object, optional
     - `q` - free-text or per-field query, optional
     - `distinct` - boolean, optional
     - `plain` - boolean, optional
     - `language` - query language, optional
     - `limit` - maximum rows to return, optional, default `100`, upper limit `32000` unless changed in site config
     - `offset` - row offset, optional
     - `fields` - list of fields to return, optional
     - `sort` - sort expression, optional
     - `include_total` - whether to return the total match count, optional
     - `total_estimation_threshold` - optional total-count estimation threshold
     - `records_format` - `objects`, `lists`, `csv`, or `tsv`
   - Live confirmation:
     - `datastore_search?resource_id=df310e9e-9ce1-4564-99b8-6e027a74f226` returned `records`, `fields`, `_links`, `total`, and `total_was_estimated`
     - the reviewed response returned five annual records and exposed `_links.next` paging metadata

9. `GET /api/3/action/datastore_search_sql`
   - Base URL: `https://data.ibb.gov.tr`
   - Purpose: query a DataStore-backed resource with SQL
   - Query parameters confirmed live:
     - `sql` - SQL statement, required
   - Live confirmation:
     - `datastore_search_sql?sql=SELECT * FROM "df310e9e-9ce1-4564-99b8-6e027a74f226" LIMIT 1` returned `sql`, `records`, and `fields`
     - the reviewed response returned one record with columns `_id`, `Yil`, `Yanginlar`, `Diger Itfai olaylar`, and `Ambulans`

## Pagination, filtering, and format notes
- The reviewed action routes use CKAN JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_list` paginates with `limit` and `offset`.
- `package_search` uses Solr-style search with paging via `rows` and `start`.
- `datastore_search` uses row-level paging via `limit` and `offset`; the live response also exposed `_links.start` and `_links.next` helper URLs.
- `datastore_search` officially supports multiple record formats via `records_format`, including `objects`, `lists`, `csv`, and `tsv`.
- `package_show` responses expose resource download URLs directly, so catalogue metadata and raw file-download URLs can coexist for the same dataset.

## Error, auth, and access notes
- Public read routes succeeded anonymously in this run; no portal-specific key or token requirement was visible on the reviewed official pages.
- Invalid dataset lookup on `package_show?id=does-not-exist-xyz` returned a CKAN JSON error envelope with `success: false` and `error.__type: Not Found Error`.
- Invalid resource lookup on `datastore_search?resource_id=does-not-exist-xyz` returned `success: false` and the message `Bulunamadı: Resource was not found.`
- No official rate-limit policy was published on the reviewed portal pages or action help pages.

## fireROUTE normalization notes
- Treat `https://data.ibb.gov.tr` as the canonical API host for this provider.
- Preserve the CKAN action prefix `/api/3/action` exactly.
- Separate catalogue metadata routes (`help_show`, `status_show`, `package_list`, `package_search`, `package_show`, `group_list`, `organization_list`) from row-level DataStore routes (`datastore_search`, `datastore_search_sql`).
- Prefer resource ids verified from current `package_show` responses before issuing DataStore calls.