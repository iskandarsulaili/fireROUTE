# City, Gdańsk

## Provider metadata
- Category: `Government`
- Provider slug: `city-gda-sk`
- Official docs/pages used:
  - `https://ckan.multimediagdansk.pl/en`
  - `https://ckan.multimediagdansk.pl/en/about`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=help_show`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=package_list`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=package_search`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=package_show`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=group_list`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=organization_list`
  - `https://ckan.multimediagdansk.pl/api/3/action/help_show?name=datastore_search`
  - `https://ckan.multimediagdansk.pl/api/3/action/status_show`
  - `https://ckan.multimediagdansk.pl/api/3/action/package_list?limit=1`
  - `https://ckan.multimediagdansk.pl/api/3/action/package_search?rows=1`
  - `https://ckan.multimediagdansk.pl/api/3/action/package_show?id=baza-noclegowa-w-gdansku`
  - `https://ckan.multimediagdansk.pl/api/3/action/group_list`
  - `https://ckan.multimediagdansk.pl/api/3/action/organization_list`
  - `https://ckan.multimediagdansk.pl/api/3/action/datastore_search?resource_id=9355d0cb-3ac8-4c71-ab51-f93cd12b7ca1&limit=1`
  - `https://ckan.multimediagdansk.pl/api/3/action/datastore_search_sql?sql=SELECT%20_id%20FROM%20%229355d0cb-3ac8-4c71-ab51-f93cd12b7ca1%22%20LIMIT%201`
- Current documented API host: `https://ckan.multimediagdansk.pl`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or portal-specific auth flow was published on the reviewed public portal pages; reviewed read routes worked anonymously
- Response format: JSON on the confirmed action routes
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `8`

## Official usage notes
- The official homepage explicitly identifies the portal as CKAN-backed and links to CKAN API guidance from the site footer.
- A live `status_show` response returned `site_title: Otwarty Gdańsk`, `site_url: https://ckan.multimediagdansk.pl`, `ckan_version: 2.10.4`, and enabled extensions including `datastore` and `datapusher`.
- Public metadata and DataStore reads succeeded without authentication in this run.
- `datastore_search_sql` is not enabled on this portal: the reviewed live request returned `Action name not known: datastore_search_sql`, so it is excluded from the canonical route count.

## Canonical endpoints confirmed from the official site
1. `GET /api/3/action/help_show`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: return the help string for a named API action
   - Query parameters:
     - `name` - action function name, required
   - Official notes:
     - returns the action help string for a known function
     - returns a not-found error for unknown action names

2. `GET /api/3/action/status_show`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: return site configuration and capability metadata
   - Query parameters: none shown in the reviewed help output
   - Live confirmation:
     - returned `site_title`, `site_url`, `locale_default`, `extensions`, and `ckan_version`
     - confirmed the live host is `https://ckan.multimediagdansk.pl`

3. `GET /api/3/action/package_list`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: list dataset names on the portal
   - Official parameters:
     - `limit` - page size, optional
     - `offset` - starting offset when `limit` is used, optional
   - Live confirmation:
     - `package_list?limit=1` returned dataset name `baza-noclegowa-w-gdansku`

4. `GET /api/3/action/package_search`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: search datasets in the catalogue
   - Official parameters called out in the reviewed `help_show` text:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - filter query string, optional
     - `fq_list` - additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum rows to return, optional, default `10`, upper limit `1000` unless changed in site config
     - `start` - result offset, optional
     - `facet` - enable faceted results, optional
     - `facet.mincount` - minimum count for facet values, optional
     - `facet.limit` - maximum facet values, optional
     - `facet.field` - facet fields, optional
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, and `facets`
     - the reviewed response returned total dataset count `59`

5. `GET /api/3/action/package_show`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - dataset id or name, required
     - `use_default_schema` - boolean, optional
     - `include_tracking` - boolean, optional
     - `include_plugin_data` - sysadmin-only boolean, optional
   - Live confirmation:
     - `package_show?id=baza-noclegowa-w-gdansku` returned metadata for dataset `Baza noclegowa w Gdańsku`
     - the reviewed response included resource id `f809f4cb-4ce3-44d5-8b32-31798aabb8b4`

6. `GET /api/3/action/group_list`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: list portal groups
   - Official parameters from the reviewed `help_show` response:
     - `type` - group type, optional, default `group`
     - `order_by` - deprecated sort field, optional
     - `sort` - sort expression, optional
     - `limit` - maximum groups to return, optional
     - `offset` - starting offset, optional
     - `groups` - list of specific group names to return, optional
     - `all_fields` - return full group dictionaries instead of names, optional
     - `include_dataset_count` - include package counts when `all_fields=true`, optional
   - Live confirmation:
     - returned group names including `bezpieczenstwo`, `demografia`, and `transport`

7. `GET /api/3/action/organization_list`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: list portal organizations
   - Official parameters from the reviewed `help_show` response:
     - `type` - organization type, optional, default `organization`
     - `order_by` - deprecated sort field, optional
     - `sort` - sort expression, optional
     - `limit` - maximum organizations to return, optional
     - `offset` - starting offset, optional
     - `organizations` - list of organization names to return, optional
     - `all_fields` - return full organization dictionaries instead of names, optional
     - `include_dataset_count` - include package counts when `all_fields=true`, optional
   - Live confirmation:
     - returned organization names including `gdanskie-centrum-informatyczne`, `gzdiz`, and `um-gdansk`

8. `GET /api/3/action/datastore_search`
   - Base URL: `https://ckan.multimediagdansk.pl`
   - Purpose: search rows in a DataStore-backed resource
   - Official parameters called out in the reviewed `help_show` response:
     - `resource_id` - resource id or alias, required
     - `filters` - matching conditions object, optional
     - `q` - free-text or per-field query, optional
     - `full_text` - full-text search string, optional
     - `distinct` - boolean, optional
     - `plain` - boolean, optional
     - `language` - query language, optional
     - `limit` - maximum rows to return, optional, default `100`
     - `offset` - row offset, optional
   - Live confirmation:
     - `package_search?rows=20` exposed public DataStore resource id `9355d0cb-3ac8-4c71-ab51-f93cd12b7ca1`
     - `datastore_search?resource_id=9355d0cb-3ac8-4c71-ab51-f93cd12b7ca1&limit=1` succeeded and returned `records`, `fields`, `total`, and `_links`
     - the reviewed response returned one CSV-backed record from dataset `gdanskie-centrum-kontaktu`

## Pagination, filtering, and format notes
- The reviewed action endpoints return CKAN JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_list` paginates with `limit` and `offset`.
- `package_search` uses Solr-style filtering and paging via `rows` and `start`.
- `datastore_search` uses row-level paging via `limit` and `offset`, and the live response also exposed `_links` pagination helpers.

## Error, auth, and access notes
- No portal-specific API key flow or published rate-limit ceiling was visible on the reviewed official pages.
- Public reads succeeded anonymously in this run.
- Unknown actions return CKAN JSON errors; `help_show?name=datastore_search_sql` returned a `Not Found Error` and the live action call returned `400 Bad request - Action name not known: datastore_search_sql`.
- A `datastore_active: true` flag on some resources did not guarantee immediate success for every sampled resource id, so implementations should handle 404 resource errors gracefully and prefer resource ids verified from current dataset responses.

## fireROUTE normalization notes
- Treat `https://ckan.multimediagdansk.pl` as the canonical API host for this provider.
- Preserve the `/api/3/action` prefix exactly.
- Separate catalogue metadata routes (`help_show`, `status_show`, `package_list`, `package_search`, `package_show`, `group_list`, `organization_list`) from row-level DataStore access (`datastore_search`).
- Do not assume `datastore_search_sql` exists on this portal.