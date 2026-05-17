# Open Government, Germany

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-germany`
- Official docs/pages used:
  - `https://www.govdata.de/`
  - `https://www.govdata.de/sparql-assistent`
  - `https://www.govdata.de/suche/daten/govdata-metadatenkatalog`
  - `https://www.govdata.de/informationen/datenbereitstellung-govdata`
  - `https://docs.ckan.org/en/2.10/api/index.html` (officially linked from the GovData SPARQL/Interfaces page)
- Current documented API hosts:
  - `https://www.govdata.de`
  - `https://ckan.govdata.de` appears in live CKAN help links returned by the public proxy routes
- Current documented API path prefixes:
  - `/ckan/api/3/action`
  - `/ckan/catalog`
  - `/sparql`
- Auth model: no authentication was documented or required for the reviewed catalogue/SPARQL read routes
- Response/data formats:
  - CKAN Action API: JSON envelope
  - DCAT catalog exports: RDF, Turtle, JSON-LD
  - SPARQL endpoint: JSON, XML, CSV according to the official assistant page
- Manually confirmed canonical route count: `11`

## Official usage notes
- GovData's official SPARQL assistant page explicitly says the published metadata catalogue can be accessed machine-to-machine through two interfaces:
  - SPARQL endpoint: `https://www.govdata.de/sparql`
  - CKAN API endpoint: `https://www.govdata.de/ckan/api`
- The official metadata-catalog dataset page says metadata are managed in CKAN and can be read without login.
- The same page gives a concrete CKAN example for DCAT search: `https://ckan.govdata.de/api/3/action/dcat_catalog_search?q=kindergarten&format=rdf`.
- The official data-provisioning page says provider harvesting runs every second day after productive onboarding, but that note is about metadata ingestion cadence rather than API throttling.

## Canonical endpoints confirmed from the official GovData pages and linked official CKAN docs
1. `GET /ckan/api/3/action/status_show`
   - Base URL: `https://www.govdata.de`
   - Purpose: return CKAN site configuration and enabled extensions
   - Live confirmation:
     - returned JSON showing `site_title: GovData`, `site_url: https://ckan.govdata.de`, locale `de`, and enabled extensions including `harvest`, `dcat`, and `dcatde`

2. `GET /ckan/api/3/action/help_show`
   - Base URL: `https://www.govdata.de`
   - Purpose: return inline help text for CKAN action methods
   - Query parameters:
     - `name` - required action name such as `package_search`, `package_show`, or `status_show`
   - Live confirmation:
     - `help_show?name=package_search` returned the official CKAN parameter documentation used below

3. `GET /ckan/api/3/action/package_list`
   - Base URL: `https://www.govdata.de`
   - Purpose: list dataset names in the GovData catalogue
   - Official parameters from live `help_show`:
     - `limit` - optional page size
     - `offset` - optional offset when `limit` is used
   - Live confirmation:
     - `package_list?limit=2` returned a JSON list of package names

4. `GET /ckan/api/3/action/package_search`
   - Base URL: `https://www.govdata.de`
   - Purpose: search datasets in the catalogue
   - Official parameters from live `help_show`:
     - `q` - Solr query, default `*:*`
     - `fq`, `fq_list`
     - `sort`
     - `rows` - default `10`, upper limit `1000` unless site config changes it
     - `start`
     - `facet`, `facet.mincount`, `facet.limit`, `facet.field`
     - `include_drafts`, `include_private`, `use_default_schema`
     - advanced Solr params noted in the help text: `qf`, `wt`, `bf`, `boost`, `tie`, `defType`, `mm`
   - Live confirmation:
     - `package_search?rows=1` returned `count`, `results`, and search metadata from GovData

5. `GET /ckan/api/3/action/package_show`
   - Base URL: `https://www.govdata.de`
   - Purpose: return one dataset's metadata and resources
   - Official parameters from live `help_show`:
     - `id` - required dataset id or name
     - `use_default_schema`
     - `include_tracking`
     - `include_plugin_data`
   - Live confirmation:
     - `package_show?id=govdata-metadatenkatalog` returned the GovData metadata-catalog dataset record

6. `GET /ckan/api/3/action/dcat_catalog_search`
   - Base URL: `https://www.govdata.de`
   - Purpose: search the catalogue and serialize the result set in DCAT-oriented linked-data formats
   - Official parameters/signals from the GovData metadata-catalog page:
     - `q` - search term, shown in the official example
     - `format` - documented/observed values `rdf`, `ttl`, `jsonld`
   - Live confirmation:
     - `dcat_catalog_search?q=kindergarten&format=rdf` returned a JSON CKAN envelope whose `result` field contains RDF/XML text
     - `format=ttl` returned Turtle text in the JSON envelope's `result`
     - `format=jsonld` returned JSON-LD text in the JSON envelope's `result`

7. `GET /ckan/catalog/catalog.rdf`
   - Base URL: `https://www.govdata.de`
   - Purpose: download the full GovData metadata catalog as RDF
   - Official source:
     - linked as `RDF-Ressource` on the `GovData Metadatenkatalog` dataset page

8. `GET /ckan/catalog/catalog.ttl`
   - Base URL: `https://www.govdata.de`
   - Purpose: download the full GovData metadata catalog as Turtle
   - Official source:
     - linked as `TURTLE-Ressource` on the `GovData Metadatenkatalog` dataset page
   - Live confirmation:
     - returned `text/turtle`

9. `GET /ckan/catalog/catalog.jsonld`
   - Base URL: `https://www.govdata.de`
   - Purpose: download the full GovData metadata catalog as JSON-LD
   - Official source:
     - linked as `JSON-LD-Ressource` on the `GovData Metadatenkatalog` dataset page

10. `GET /sparql`
   - Base URL: `https://www.govdata.de`
   - Purpose: execute read queries against the GovData metadata triplestore
   - Official usage notes from the SPARQL assistant:
     - the assistant presents the endpoint as `https://www.govdata.de/sparql`
     - published result formats are `JSON`, `XML`, and `CSV`
     - the UI exposes the query as the key input and says SPARQL queries can be sent with any REST client
   - Live confirmation:
     - a GET request with `query=SELECT * WHERE { ?sub ?pred ?obj . } LIMIT 1` and `Accept: application/sparql-results+json` returned HTTP `200` JSON results

11. `POST /sparql`
   - Base URL: `https://www.govdata.de`
   - Purpose: execute SPARQL queries via POST request body
   - Live confirmation:
     - a POST request with `Content-Type: application/x-www-form-urlencoded`, body `query=SELECT * WHERE { ?sub ?pred ?obj . } LIMIT 1`, and `Accept: application/sparql-results+xml` returned HTTP `200` SPARQL XML results

## Pagination, filtering, and format notes
- `package_list` pages via `limit` and `offset`.
- `package_search` pages via `rows` and `start` and supports Solr-style faceting/filtering.
- `dcat_catalog_search` behaves differently from ordinary CKAN JSON routes: the returned payload is still a CKAN JSON envelope, but the `result` value is serialized RDF/Turtle/JSON-LD text.
- The full-catalog export routes are static linked-data downloads rather than paginated API responses.
- The official SPARQL assistant advertises result formats `JSON`, `XML`, and `CSV`; live checks confirmed JSON and XML through the `Accept` header.

## Error, auth, and access notes
- No authentication requirement was published or observed for the reviewed GovData read routes.
- No official API rate-limit or quota policy was published on the reviewed GovData pages.
- A live invalid SPARQL query returned HTTP `400 Bad Request` as an HTML error page.
- A live `package_show` request for a nonexistent dataset returned HTTP `404` with GovData's HTML error page rather than a CKAN JSON error envelope.
- For successful CKAN action calls, the proxy returned standard JSON envelopes with `help`, `success`, and `result`.

## fireROUTE integration notes
- Treat `https://www.govdata.de` as the canonical public host and preserve the `/ckan/api/3/action`, `/ckan/catalog`, and `/sparql` prefixes exactly.
- Keep the three machine-access surfaces separate in adapters:
  - CKAN JSON action endpoints for catalogue browsing
  - DCAT file exports for full linked-data dumps
  - SPARQL for graph queries and richer metadata joins
- Expect mixed response conventions: CKAN action routes return JSON envelopes, whereas `/sparql` returns raw SPARQL result sets and `/ckan/catalog/*` returns raw linked-data files.
- `dcat_catalog_search` is especially non-standard because its linked-data output is wrapped inside the CKAN JSON response's `result` field.
- The data-provisioning page's `every second day` note is about GovData harvesting cadence, not a client polling recommendation or published API limit.