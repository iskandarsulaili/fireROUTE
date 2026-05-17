# Open Government, Finland

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-finland`
- Official docs/pages used:
  - `https://www.avoindata.fi/en`
  - `https://avoindata.suomi.fi/data/en_GB/dataset`
  - `https://avoindata.suomi.fi/data/en_GB/apiset`
  - `https://avoindata.suomi.fi/data/en_GB/api/3`
  - `https://www.avoindata.fi/data/en_GB/sparql`
- Current documented API host: `https://avoindata.suomi.fi`
- Current documented route families:
  - `/data/en_GB/dataset`
  - `/data/en_GB/apiset`
  - `/data/en_GB/api/3`
  - `/data/en_GB/sparql`
- Auth model: no API key or login requirement was published for the reviewed Suomi.fi Open Data catalogue, CKAN API, or SPARQL routes
- Response formats confirmed in this run: HTML, JSON, SPARQL-results JSON-style payloads
- Manually confirmed route count: `7`

## Official usage notes
- The reviewed homepage explicitly separates `Datasets`, `APIs`, and `SPARQL search`, which makes it possible to document both the HTML catalogue routes and the provider-owned metadata APIs without confusing them with third-party APIs listed inside the portal.
- The dataset listing page links directly to the provider-owned CKAN API root at `https://avoindata.suomi.fi/data/en_GB/api/3` and to upstream `API Documentation` on `docs.ckan.org/en/2.11/api/`.
- The SPARQL page states that datasets on Suomi.fi Open Data are published as RDF triples following DCAT-AP and configures the live endpoint through `data-module-endpoint="/data/en_GB/sparql/query"`.
- The portal currently reports `2516` datasets and `75` APIs on the reviewed English pages.

## Canonical endpoints confirmed from the official site
1. `GET /data/en_GB/dataset`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: render the public dataset catalogue and filter UI
   - Query parameters confirmed from live links on the reviewed page:
     - `page` - page number
     - `vocab_geographical_coverage` - geographic coverage facet
     - `collection_type` - collection type such as `Open Data`
     - `vocab_keywords_en` - keyword facet
     - `organization` - publisher facet
     - `res_format` - resource format facet such as `csv`, `json`, `wms`, or `ogc api`
     - `license_id` - license facet
     - `groups` - category facet
     - `producer_type` - regional coverage / publisher-type facet
     - `vocab_highvalue_category` - high-value-dataset category facet
     - `_vocab_geographical_coverage_limit`, `_vocab_keywords_en_limit`, `_organization_limit`, `_res_format_limit`, `_license_id_limit`, `_groups_limit` - official `Show more` facet-expansion parameters
   - Live confirmation:
     - the reviewed page returned HTML titled `Avoindata.fi`
     - the page reported `2,516 datasets found`
     - pagination links used URLs such as `?page=2`

2. `GET /data/en_GB/apiset`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: render the portal's API catalogue listing
   - Query parameters confirmed from live links on the reviewed page:
     - `page` - page number
     - `vocab_keywords_en` - keyword facet
     - `organization` - publisher facet
     - `res_format` - resource format facet such as `wms`, `wfs`, `json`, or `xml`
     - `license_id` - license facet
     - `producer_type` - regional coverage / publisher-type facet
     - `_organization_limit` - publisher facet expansion
   - Live confirmation:
     - the reviewed page reported `75 APIs found`
     - pagination links used URLs such as `?page=2`
     - the route lists API records but does not collapse the underlying third-party service endpoints into one provider-owned runtime tree

3. `GET /data/en_GB/api/3`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: return the CKAN API version descriptor
   - Query parameters: none
   - Live confirmation:
     - returned HTTP `200`
     - body was exactly `{"version": 3}`

4. `GET /data/en_GB/api/3/action/help_show`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: return documentation for a named CKAN action
   - Query parameters:
     - `name` - required action name
   - Live confirmation:
     - the `help` field from live `package_search` and `package_show` responses pointed to `help_show`
     - `help_show?name=package_search` and `help_show?name=package_show` were reachable on the provider host in this run
     - this deployment returned a terse `partial(func, *args, **keywords)` help string rather than full per-action docs, so parameter details had to be confirmed from live calls and the provider-linked CKAN docs page

5. `GET /data/en_GB/api/3/action/package_search`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: search CKAN packages/datasets on the provider host
   - Query parameters confirmed in live requests:
     - `q` - full-text query string
     - `rows` - result limit
     - `start` - result offset
   - Live confirmation:
     - `package_search?rows=1` returned HTTP `200` JSON with `success: true`, `count: 2516`, and `1` result
     - `package_search?q=traffic&rows=2&start=1` returned HTTP `200` JSON with `count: 109` and `2` results starting from the requested offset
     - `package_search?rows=0` returned HTTP `200` JSON with the total count and `0` returned results, confirming the route accepts zero-row summary queries

6. `GET /data/en_GB/api/3/action/package_show`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: fetch CKAN package metadata for a dataset by id or name
   - Query parameters:
     - `id` - required dataset id or slug
   - Live confirmation:
     - `package_show?id=pohjois-savon-hyvinvointialueen-ostolaskudata-2025` returned HTTP `200` JSON
     - the reviewed `result` object included fields such as `id`, `name`, `license_id`, `keywords`, `metadata_created`, `metadata_modified`, `resources`, and publisher/contact metadata
     - `package_show?id=does-not-exist` returned HTTP `404` JSON with `error.__type = "Not Found Error"` and `error.message = "Not found"`

7. `GET` or `POST /data/en_GB/sparql/query`
   - Base URL: `https://avoindata.suomi.fi`
   - Purpose: execute SPARQL queries over the portal's DCAT-AP RDF graph
   - Query/body parameters:
     - `query` - SPARQL query text
   - Methods confirmed in this run:
     - `GET` with `query=` in the query string
     - `POST` with `application/x-www-form-urlencoded` body containing `query=`
   - Live confirmation:
     - both GET and POST returned HTTP `200` for `SELECT * WHERE { ?s ?p ?o } LIMIT 1`
     - both methods returned a SPARQL-results JSON-style body containing `head.vars` and `results.bindings`
     - the route responded with `content-type: text/html; charset=utf-8` even when returning JSON-shaped data
     - a malformed query returned HTTP `200` with a body beginning `QueryBadFormed: A bad request has been sent to the endpoint`

## Pagination, filtering, and format notes
- Both HTML catalogue routes are page-based and expose `page=` directly in official navigation links.
- The CKAN `package_search` route is offset-based through `rows` and `start`.
- The SPARQL endpoint accepts query text through either GET or POST but currently returns results with an HTML content type despite JSON-shaped response bodies.
- The reviewed portal pages explicitly separate provider-owned catalogue/metadata surfaces from the many third-party API endpoints listed as records inside the portal.

## Error, auth, and access notes
- No public rate-limit or quota policy was published on the reviewed Suomi.fi Open Data pages.
- No API key, OAuth flow, or registration gate was required for the documented routes exercised in this run.
- `package_show` returned a structured HTTP `404` JSON error for a missing dataset id.
- The SPARQL endpoint did not use HTTP `400` for malformed queries in this run; instead it returned HTTP `200` with an error string in the response body.

## fireROUTE normalization notes
- Treat `https://avoindata.suomi.fi/data/en_GB/api/3/action` as the canonical CKAN action-API base.
- Keep the HTML catalogue routes `dataset` and `apiset` separate from the provider-owned metadata API and from the third-party APIs catalogued by the portal.
- Preserve the SPARQL endpoint exactly as `/data/en_GB/sparql/query` and model it as a query endpoint that accepts either GET or form-encoded POST.
- Do not expand individual third-party APIs listed in `apiset` into `open-government-finland` route count; only the portal-owned catalogue and metadata routes above are included here.