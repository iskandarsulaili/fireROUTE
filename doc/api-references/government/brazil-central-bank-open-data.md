# Brazil Central Bank Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `brazil-central-bank-open-data`
- Official docs/pages used:
  - `https://dadosabertos.bcb.gov.br/`
  - `https://dadosabertos.bcb.gov.br/dataset/estatisticas-selic-operacoes`
  - `https://dadosabertos.bcb.gov.br/dataset/estatisticas-selic-operacoes/resource/032b4a66-7b7f-4d33-935b-e8838039fed3`
  - live CKAN action/help checks:
    - `https://dadosabertos.bcb.gov.br/api/3/action/status_show`
    - `https://dadosabertos.bcb.gov.br/api/3/action/help_show?name=package_search`
    - `https://dadosabertos.bcb.gov.br/api/3/action/package_list`
    - `https://dadosabertos.bcb.gov.br/api/3/action/package_search?rows=1`
    - `https://dadosabertos.bcb.gov.br/api/3/action/package_show?id=estatisticas-selic-operacoes`
    - `https://dadosabertos.bcb.gov.br/api/3/action/resource_show?id=1b08f2e3-6579-472c-8819-cebb91dd3652`
    - `https://dadosabertos.bcb.gov.br/api/3/action/group_list`
    - `https://dadosabertos.bcb.gov.br/api/3/action/organization_list`
    - `https://dadosabertos.bcb.gov.br/api/3/action/datastore_search?resource_id=_table_metadata&limit=1`
- Current documented API host: `https://dadosabertos.bcb.gov.br`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or portal-specific auth flow is documented for public catalogue access
- Response format: JSON for the confirmed action API routes
- Manually confirmed canonical route count: `9`

## Official usage notes
- Live `status_show` confirmed the portal is CKAN-based and currently reports `ckan_version` `2.10.4`.
- The same live `status_show` response confirmed the `datastore` extension is enabled on the portal.
- Dataset pages expose resource-level `API`, `OData`, and `JSON` links for specific Banco Central services, including external `olinda.bcb.gov.br` Swagger and OData surfaces.
- Those service-specific Olinda routes are not counted here because they vary by dataset/service and are linked out from individual resource pages rather than published as one portal-wide route inventory.
- No public rate-limit policy was published on the reviewed portal pages or in the reviewed CKAN help responses.
- A live request to `datastore_search_sql` returned `400` with `Action name not known: datastore_search_sql`, so SQL search is not part of the current public portal route inventory.

## Canonical endpoints confirmed from the official portal and official CKAN help pages
1. `GET /api/3/action/status_show`
   - Purpose: return portal configuration and enabled extensions
   - Parameters: none observed on the live route
   - Live confirmation:
     - returned `site_title`, `site_url`, `locale_default`, `extensions`, and `ckan_version`

2. `GET /api/3/action/help_show`
   - Purpose: return help text for a CKAN action
   - Query parameters:
     - `name` - required action name, for example `package_search`, `package_show`, `resource_show`, or `datastore_search`
   - Live confirmation:
     - `help_show?name=package_search` returned the official parameter/help text
   - Error note:
     - calling `help_show` without `name` returned an invalid-request HTML page during this run

3. `GET /api/3/action/package_list`
   - Purpose: list dataset names available in the portal
   - Parameters: none observed on the live route
   - Live confirmation:
     - returned a JSON array of dataset names/slugs

4. `GET /api/3/action/package_search`
   - Purpose: search datasets in the portal catalogue
   - Official parameters from the reviewed `help_show?name=package_search` response:
     - `q` - Solr query string, optional, default `*:*`
     - `fq` - filter query string, optional
     - `fq_list` - additional filter queries, optional
     - `sort` - sort expression, optional
     - `rows` - maximum datasets to return, optional, default `10`, upper limit `1000` unless reconfigured
     - `start` - result offset, optional
     - `facet` - enable faceted results, optional
     - `facet.mincount` - minimum facet count, optional
     - `facet.limit` - maximum facet values, optional
     - `facet.field` - facet fields, optional
     - `include_drafts` - optional
     - `include_private` - optional
     - `use_default_schema` - optional
   - Live confirmation:
     - `package_search?rows=1` returned a JSON envelope with `count`, `facets`, and `results`
     - `package_search?fq=organization:demab&rows=1` successfully filtered by organization during this run

5. `GET /api/3/action/package_show`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters from `help_show?name=package_show`:
     - `id` - required dataset id or dataset name
     - `use_default_schema` - optional boolean
     - `include_tracking` - optional boolean
     - `include_plugin_data` - optional boolean, sysadmin-only
   - Live confirmation:
     - `package_show?id=estatisticas-selic-operacoes` returned the reviewed dataset record and resource list

6. `GET /api/3/action/resource_show`
   - Purpose: return metadata for one resource
   - Official parameters from `help_show?name=resource_show`:
     - `id` - required resource id
     - `include_tracking` - optional boolean
   - Live confirmation:
     - `resource_show?id=1b08f2e3-6579-472c-8819-cebb91dd3652` returned metadata for the reviewed OData resource

7. `GET /api/3/action/group_list`
   - Purpose: list portal groups
   - Parameters: none observed on the live route
   - Live confirmation:
     - returned group slugs such as `economia-e-financas` and `sistema-de-pagamentos-brasileiro`

8. `GET /api/3/action/organization_list`
   - Purpose: list portal organizations
   - Parameters: none observed on the live route
   - Live confirmation:
     - returned organization slugs including `demab`, `depec`, `desig`, and many others

9. `GET /api/3/action/datastore_search`
   - Purpose: query rows from a DataStore resource
   - Official parameters from `help_show?name=datastore_search`:
     - `resource_id` - required resource id or alias
     - `filters` - optional dictionary of field/value filters
     - `q` - optional string or field dictionary query
     - `full_text` - optional full-text query string
     - `distinct` - optional boolean
     - `plain` - optional boolean
     - `language` - optional full-text language
     - `limit` - optional maximum rows, default `100`, upper limit `32000` unless reconfigured
     - `offset` - optional row offset
     - `fields` - optional field list
     - `sort` - optional comma-separated sort expression
     - `include_total` - optional boolean
     - `total_estimation_threshold` - optional integer or null
   - Live confirmation:
     - `datastore_search?resource_id=_table_metadata&limit=1` returned a JSON envelope with `records`, `fields`, `_links`, and `include_total`

## Pagination, filtering, and format notes
- Confirmed action routes return CKAN-style JSON envelopes with top-level `help`, `success`, and `result` fields.
- `package_search` uses Solr-style filtering and paging; the reviewed help text says the default page size is `10` and the default upper limit is `1000` unless site configuration changes it.
- A live `package_search?rows=1` response reported a total catalogue count of `4125` datasets during this run.
- `datastore_search` uses offset-based paging. The reviewed help text says the default page size is `100` and the default upper limit is `32000` unless site configuration changes it.
- The live `datastore_search` response exposed `_links.start` and `_links.next`, which are the practical pagination links provided by the portal.
- Dataset pages may also expose direct JSON resources, Swagger UIs, and OData roots for individual Banco Central services outside the portal action API itself.

## Error and access notes
- The portal pages reviewed here do not publish a portal-wide API key requirement for public catalogue access.
- The reviewed `datastore_search` help text states that private CKAN resources require appropriate authorization, but the public catalogue routes documented here were readable without credentials.
- The reviewed help text and live responses indicate that clients should inspect both the HTTP status code and the CKAN JSON `success` field.
- Live examples from this run:
  - `help_show` without `name` returned an invalid-request HTML page
  - `datastore_search_sql` returned HTTP `400` with `Action name not known: datastore_search_sql`
- No official retry/backoff guidance or rate-limit header documentation was published on the reviewed pages.

## fireROUTE integration notes
- Treat `https://dadosabertos.bcb.gov.br/api/3/action` as the canonical portal API surface for this provider.
- Preserve the distinction between portal metadata routes (`status_show`, `package_*`, `resource_show`, `group_list`, `organization_list`) and row-query routes (`datastore_search`).
- Do not assume `datastore_search_sql` exists just because `datastore` is enabled; the live portal rejected that action during this run.
- Keep linked `olinda.bcb.gov.br` Swagger/OData services as dataset-specific downstream APIs rather than merging them into the portal-wide route count.
- For adapters, prioritize `package_search` plus `package_show`/`resource_show` for discovery, then hand off to dataset-specific resource URLs when a user needs the underlying Banco Central service data.