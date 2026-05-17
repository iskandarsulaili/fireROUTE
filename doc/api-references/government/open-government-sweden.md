# Open Government, Sweden

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-sweden`
- Official docs/pages used:
  - assigned docs URL from the index: `https://www.dataportal.se/en/dataservice/91_29789/api-for-the-statistical-database`
  - official Swedish Dataportal documentation hub linked from the current portal: `https://docs.dataportal.se/`
  - official registry API page: `https://docs.dataportal.se/registry/api/`
  - live official dataset-search example: `https://admin.dataportal.se/store/search?type=solr&query=rdfType:http%5C%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset+AND+public:true&limit=1&offset=0&sort=modified+desc`
  - live official entry lookup example confirmed from the returned search payload: `https://admin.dataportal.se/store/83/entry/5652?recursive=dcat`
  - live official Turtle-format variant: `https://admin.dataportal.se/store/83/entry/5652?recursive=dcat&format=text/turtle`
  - live official chart/status endpoint: `https://admin.dataportal.se/charts/orgData.json`
- Current documented API host for interactive queries: `https://admin.dataportal.se`
- Additional officially documented dump URL: `http://admin.dataportal.se/all.rdf`
- Auth model: no API key or OAuth flow was published on the reviewed official pages for public reads
- Primary response formats confirmed from the official docs and live endpoint checks:
  - JSON search responses with RDF/JSON metadata in `metadata`
  - RDF/XML for entry lookups by default
  - Turtle when `format=text/turtle` is requested on entry lookups
  - JSON for chart/status output
  - RDF/XML for the nightly full dump according to the official docs page
- Rate limits: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `4` unique path templates

## Official usage notes
- The assigned dataportal.se dataservice URL currently resolves to a portal `404` page, but that same official portal now links to `docs.dataportal.se`, which contains the current API documentation for Sweden's dataportal services.
- The official registry API page says all dataset information visible on dataportal.se is available via the API on `admin.dataportal.se`.
- The official registry API page says admin.dataportal.se uses EntryScape Registry and EntryStore under the hood and links to the generic upstream API/search documentation, but it also publishes Sweden-specific simplified guidance and concrete example calls.
- The official registry API page says metadata is refreshed nightly, so the portal data may be up to `24` hours old when harvesting succeeds normally.
- The official docs stress that dataset identifiers are URIs assigned by the publishing organizations and should be preserved.

## Canonical endpoints confirmed from the official docs
1. `GET /store/search`
   - Base URL: `https://admin.dataportal.se`
   - Purpose: Solr-backed search across datasets and other managed entities
   - Officially documented/common parameters:
     - `type=solr` - selects the documented search backend used in all official examples
     - `query` - Solr query expression; official examples include `rdfType:...Dataset AND public:true`, `title.sv:bidrag`, catalog-statistics lookups, and latest-harvest filters
     - `limit` - page size; the official docs say this can be increased up to `100`
     - `offset` - pagination offset
     - `sort` - sort expression such as `modified desc`
   - Official output notes:
     - the official docs show a JSON object with `offset`, `limit`, `results`, and `resource.children`
     - the official docs say the dataset metadata payloads are expressed in `rdf/json`
   - Live confirmation:
     - the reviewed official search example returned JSON successfully during this run

2. `GET /store/{contextId}/entry/{entryId}`
   - Base URL: `https://admin.dataportal.se`
   - Purpose: fetch one managed entity, including datasets and other managed entries discovered via search results
   - Officially documented/common parameters:
     - `contextId` - context identifier returned by search results
     - `entryId` - entry identifier returned by search results
     - `recursive=dcat` - include related entities such as distributions and publishers
     - `format=text/turtle` - explicit output-format override documented on the official page
   - Official format notes:
     - the official docs say content negotiation is supported
     - the official docs say the default response format is `application/rdf+xml`
   - Live confirmation:
     - fetching `.../store/83/entry/5652?recursive=dcat` returned `application/rdf+xml`
     - fetching the same route with `&format=text/turtle` returned `text/turtle`

3. `GET /charts/orgData.json`
   - Base URL: `https://admin.dataportal.se`
   - Purpose: return per-organization dataset counts used for harvesting/status reporting
   - Official usage note:
     - the official docs present this as the way to see how many datasets exist per organization
   - Live confirmation:
     - the reviewed endpoint returned JSON with organization labels during this run

4. `GET /all.rdf`
   - Base URL: `http://admin.dataportal.se`
   - Purpose: nightly full dump of harvested portal metadata
   - Official usage note:
     - the official docs say a nightly dump is produced after metadata refresh and that it is published as RDF/XML according to the Swedish DCAT-AP-SE profile
   - Official format note:
     - the docs explicitly describe this dump as `RDF/XML`

## Pagination, filtering, and format notes
- The official docs explicitly document offset-based pagination on `/store/search`.
- The official docs say `limit` can be raised to a maximum of `100` on `/store/search`.
- The official docs show `sort=modified desc` in the canonical dataset-search example.
- The official docs provide search examples for:
  - all public datasets via `rdfType:...Dataset AND public:true`
  - Swedish-title matching via `title.sv:...`
  - URI lookups for a known resource
  - catalog statistics via the `CatalogStatistics` RDF type
  - latest harvest reports via `tag.literal:latest`
  - public-sector-only harvest reports by adding `tag.literal:psi`
- The official docs say search results come back in JSON and the embedded metadata is expressed as RDF/JSON.
- The official docs say entry lookups support content negotiation and can also be forced to Turtle with `format=text/turtle`.

## Error, auth, and access notes
- No authentication requirement was documented for the public read routes reviewed here.
- No official error-code table was published on the reviewed Sweden-specific registry API page.
- No official rate-limit, throttle-header, or retry/backoff policy was published on the reviewed official pages.
- Because the current documentation centers on query examples rather than a full OpenAPI schema, client integrations should preserve raw response bodies and be conservative about assumptions beyond the documented fields and examples.

## fireROUTE normalization notes
- Treat `https://admin.dataportal.se` as the canonical interactive API host for Sweden's dataportal search, entry, and chart routes.
- Preserve `/store/search` as one route template even when different Solr `query` recipes are used for datasets, URI lookups, catalog statistics, and harvest reports.
- Preserve `/store/{contextId}/entry/{entryId}` separately from `/store/search`; the official docs describe the search result's `contextId` and `entryId` pair as the lookup key for full entity retrieval.
- Keep the nightly dump `http://admin.dataportal.se/all.rdf` distinct from the interactive JSON/Turtle/RDF lookup routes because the official docs present it as a bulk RDF/XML export produced nightly rather than an ad hoc query endpoint.
