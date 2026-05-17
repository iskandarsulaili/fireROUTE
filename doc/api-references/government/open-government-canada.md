# Open Government, Canada

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-canada`
- Official docs/pages used:
  - `http://open.canada.ca/en`
  - `https://open.canada.ca/en/working-data-api/api`
  - `https://open.canada.ca/en/working-data-api/connect-api`
  - `https://search.open.canada.ca/opendata/`
  - `https://open.canada.ca/data/en/dataset/c4c5c7f1-bfa6-4ff6-b4a0-c164cb2060f7`
- Current documented hosts:
  - `https://open.canada.ca`
  - `https://search.open.canada.ca`
- Current documented route families:
  - `/data/api/3`
  - `/data/api/3/action`
  - `/opendata`
  - `/data/en/dataset`
- Auth model: no API key or login requirement was published on the reviewed Open Government Canada pages, and all documented routes below were publicly readable in the browser
- Response formats confirmed in this run: JSON, HTML, JSON-LD, RDF/XML
- Manually confirmed route count: `9`

## Official usage notes
- The Open Government guidance pages are high-level, but the live catalogue and dataset pages expose stable provider-owned routes that can be exercised directly.
- The catalogue search UI lives on `search.open.canada.ca`, while the CKAN-style metadata API and dataset semantic serializations live on `open.canada.ca`.
- The official dataset page reviewed in this run links a legacy JSON metadata URL under `/data/api/action/package_show`, but the versioned CKAN v3 route `/data/api/3/action/package_show` is also live and returns the same dataset metadata structure.
- The live `package_show` error payload links back to `help_show`, and `help_show?name=package_search` publishes the parameter contract for the search endpoint including `q`, `fq`, `fq_list`, `sort`, `rows`, `start`, and facet-related fields.

## Canonical endpoints confirmed from the official site
1. `GET /data/api/3`
   - Base URL: `https://open.canada.ca`
   - Purpose: return the CKAN API version descriptor
   - Query parameters: none
   - Live confirmation:
     - returned HTTP `200`
     - returned `application/json;charset=utf-8`
     - body was exactly `{"version": 3}`

2. `GET /data/api/3/action/help_show`
   - Base URL: `https://open.canada.ca`
   - Purpose: return built-in documentation for a named CKAN action
   - Query parameters:
     - `name` - required action name such as `package_show` or `package_search`
   - Live confirmation:
     - `help_show?name=package_show` returned parameter docs for dataset metadata lookup
     - `help_show?name=package_search` returned search parameter docs and result-shape notes
     - the `package_search` help text explicitly documented `q`, `fq`, `fq_list`, `sort`, `rows`, `start`, `facet`, `facet.mincount`, `facet.limit`, and `facet.field`

3. `GET /data/api/3/action/package_search`
   - Base URL: `https://open.canada.ca`
   - Purpose: search catalogue packages/datasets through the versioned CKAN action API
   - Query parameters confirmed from the official help text:
     - `q` - optional Solr query string
     - `fq` - optional filter query string
     - `fq_list` - optional list of additional filter queries
     - `sort` - optional sort expression; default described by the help text as `score desc, metadata_modified desc`
     - `rows` - optional result limit; help text documents default `10` and upper limit `1000`
     - `start` - optional result offset
     - `facet` - optional facet toggle
     - `facet.mincount` - optional minimum facet count
     - `facet.limit` - optional facet limit
     - `facet.field` - optional list of facet fields
   - Live confirmation:
     - `package_search?rows=1` returned HTTP `200` JSON with `success: true`
     - the live response reported `count: 47195` and returned `1` result when `rows=1`
     - the `help` field pointed to `https://open.canada.ca/data/api/3/action/help_show?name=package_search`

4. `GET /data/api/3/action/package_show`
   - Base URL: `https://open.canada.ca`
   - Purpose: fetch dataset/package metadata by id
   - Query parameters:
     - `id` - required dataset UUID or dataset name
     - `use_default_schema` - optional boolean documented by `help_show`
     - `include_tracking` - optional boolean documented by `help_show`
     - `include_plugin_data` - optional boolean documented by `help_show` and marked sysadmin-only
   - Live confirmation:
     - `package_show?id=c4c5c7f1-bfa6-4ff6-b4a0-c164cb2060f7` returned HTTP `200` JSON with top-level keys `help`, `success`, and `result`
     - the reviewed `result` object included fields such as `id`, `collection`, `jurisdiction`, `keywords`, `date_published`, and `resources`
     - `package_show?id=does-not-exist` returned HTTP `404` JSON with `error.__type = "Not Found Error"` and `error.message = "Not found"`

5. `GET /opendata/`
   - Base URL: `https://search.open.canada.ca`
   - Purpose: render the public catalogue search UI for open datasets
   - Query parameters confirmed from live links and inline search JavaScript:
     - `search_text` - free-text search box value
     - `sort` - sort expression used by the UI, e.g. `metadata_modified desc`
     - `page` - results page number
     - `owner_org` - organization facet value
     - `dataset_type` - portal type facet such as `dataset` or `info`
     - `collection` - collection facet such as `api`, `federated`, `geogratis`, `publication`, and others exposed by the UI
     - `jurisdiction` - facet such as `federal`, `municipal`, `provincial`, or `user`
     - `keywords_en` - keyword facet value
   - Live confirmation:
     - the reviewed search page reported `47195 records`
     - page links used URLs such as `?page=2&sort=metadata_modified+desc`
     - organization facet checkboxes called `selectFacet("owner_org", ...)` in the live page JavaScript
     - collection, jurisdiction, keyword, and dataset-type facets were also wired through the same query-string mechanism

6. `POST /opendata/export/`
   - Base URL: `https://search.open.canada.ca`
   - Purpose: submit the current catalogue query for downloadable export
   - Form fields confirmed from the live search page:
     - `export_query` - hidden query payload generated by the page
     - `export_search` - hidden selector; live value was `data`
     - `export_search_path` - hidden path selector; live value was `/opendata/`
     - `csrfmiddlewaretoken` - CSRF token required by the live HTML form
   - Live confirmation:
     - the search page rendered a real HTML form posting to `https://search.open.canada.ca/opendata/export/`
     - the form was labeled `Download Search Results`

7. `GET /opendata/similar/{dataset_id}`
   - Base URL: `https://search.open.canada.ca`
   - Purpose: render the `More like this` recommendation page for a dataset
   - Path parameters:
     - `{dataset_id}` - dataset UUID
   - Query parameters:
     - `html` - optional flag present in the reviewed official links
   - Live confirmation:
     - the reviewed search results page linked `More like this` buttons to `/opendata/similar/{uuid}?html`
     - a direct request to a reviewed dataset UUID returned HTTP `200` HTML

8. `GET /data/en/dataset/{dataset_id}.jsonld`
   - Base URL: `https://open.canada.ca`
   - Purpose: return DCAT metadata for a dataset as JSON-LD
   - Path parameters:
     - `{dataset_id}` - dataset UUID
   - Query parameters: none confirmed on the reviewed official dataset page
   - Live confirmation:
     - the reviewed dataset page labeled this link `DCAT (JSON-LD)`
     - the route returned HTTP `200`
     - the route returned `application/ld+json`

9. `GET /data/en/dataset/{dataset_id}.xml`
   - Base URL: `https://open.canada.ca`
   - Purpose: return DCAT/RDF metadata for a dataset as RDF/XML
   - Path parameters:
     - `{dataset_id}` - dataset UUID
   - Query parameters: none confirmed on the reviewed official dataset page
   - Live confirmation:
     - the reviewed dataset page labeled this link `DCAT (XML)`
     - the route returned HTTP `200`
     - the route returned `application/rdf+xml`

## Pagination, filtering, and format notes
- `GET /data/api/3/action/package_search` uses `rows` plus `start` for offset-based pagination; the official help text documents a default of `10` rows and an upper limit of `1000`.
- `GET /opendata/` uses page-based navigation through the `page` query parameter.
- The search portal is HTML-first, while the CKAN action API is JSON-first and the semantic dataset routes are RDF-oriented.
- The reviewed catalogue dataset page also exposed per-resource download routes, but those belong to individual dataset resources rather than to one provider-wide search API family.

## Error, auth, and access notes
- No public rate-limit or quota policy was published on the reviewed Open Government Canada pages.
- No API key, OAuth flow, or login requirement was published for the documented catalogue and metadata routes.
- The strongest structured error example captured in this run was `package_show` returning HTTP `404` with a JSON error object for an unknown dataset id.
- The search UI routes behaved like ordinary public web routes and did not publish a separate machine-readable error schema.

## fireROUTE normalization notes
- Use `https://open.canada.ca/data/api/3/action` as the canonical action-API base for JSON metadata calls.
- Keep `https://search.open.canada.ca/opendata/` separate as the canonical HTML catalogue-search host.
- Preserve the search facet names exactly as published by the live search page (`owner_org`, `dataset_type`, `collection`, `jurisdiction`, `keywords_en`).
- Treat JSON-LD and RDF/XML dataset serializations as provider-owned semantic metadata routes, not as duplicates of the HTML dataset page.