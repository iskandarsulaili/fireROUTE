# Open Government, Spain

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-spain`
- Official docs/pages used:
  - `https://datos.gob.es/en`
  - `https://datos.gob.es/en/apidata`
  - `https://datos.gob.es/en/accessible-apidata`
  - `https://datos.gob.es/en/sparql`
  - `https://datos.gob.es/en/ejemplos-sparql`
  - official Swagger spec: `https://datos.gob.es/swagger/api.json`
  - live official API endpoints under `https://datos.gob.es/apidata/...`
- Current documented API base URL: `https://datos.gob.es/apidata`
- Auth model: no auth requirement was published on the reviewed official Spain pages for the REST catalog routes or the SPARQL endpoint documented here
- Response formats: linked-data API responses in JSON/XML/RDF/Turtle/CSV for the REST API; SPARQL results in HTML, spreadsheet, TSV, XML, JSON, JavaScript, Turtle, RDF/XML, N-Triples, or CSV depending on the `format` parameter
- Manually confirmed canonical route count: `22`

## Official usage notes
- The official `API` page says the API exposes the datos.gob.es semantic database and covers the Data catalogue plus the NTI taxonomies for public-sector sectors and geographic coverage.
- The official accessible API page documents format selection by either `Accept` header or filename extension.
- The official Swagger spec sets `host` to `datos.gob.es` and `basePath` to `/apidata`.
- The official SPARQL pages document a separate query endpoint at `https://datos.gob.es/virtuoso/sparql` over the same semantic data.
- The official data-catalogue page also exposes `API` and `SPARQL Endpoint` links directly in the catalog UI.

## Authentication, parameters, and request notes
- No API key, bearer token, OAuth flow, cookie gate, or user-login requirement was published for the reviewed REST and SPARQL read routes.
- Common REST query parameters from the official docs/spec:
  - `_sort`: sort by one or more response fields; prefix with `-` for descending order
  - `_pageSize`: page size parameter; the accessible page says the maximum is `50`, while the official Swagger spec says the maximum is `200`
  - `_page`: zero-based page number
- Response-format selection for REST routes:
  - `Accept: application/json|application/xml|application/rdf+xml|application/x-turtle|text/csv`
  - or path extensions `.json`, `.xml`, `.rdf`, `.turtle`, `.csv`
- SPARQL request parameters from the official examples page:
  - `query`: URL-encoded SPARQL query string
  - `format`: optional result MIME type such as `application/sparql-results+json` or `text/csv`
- Path parameters published by the official docs/spec include:
  - dataset id, title fragment, publisher id, theme id, format, keyword, `spatialWord1`, `spatialWord2`, `beginDate`, `endDate`
  - NTI ids for province, autonomous region, country, and public-sector sector

## Pagination, errors, and format notes
- REST responses follow the linked-data API structure with top-level `format`, `version`, and `result` objects plus paging fields such as `items`, `itemsPerPage`, `page`, `next`, and `first`.
- REST pagination is page-based through `_pageSize` + `_page`.
- Verified live error behavior:
  - `GET https://datos.gob.es/virtuoso/sparql` without `query` returned `404` and the official site’s not-found page
  - `GET /apidata/catalog/dataset/not-a-real-id.json` returned `200` with an empty `items` list instead of a hard `404`
- The official Swagger spec advertises possible `400`, `403`, `404`, and `500` responses on the REST routes.
- No public rate-limit policy, quota table, or retry-header contract was published on the reviewed official Spain pages.

## Canonical endpoint inventory manually confirmed from the official site
1. `GET /apidata/nti/territory/Province`
2. `GET /apidata/nti/territory/Province/{id}`
3. `GET /apidata/nti/territory/Autonomous-region`
4. `GET /apidata/nti/territory/Autonomous-region/{id}`
5. `GET /apidata/nti/territory/Country/{id}`
6. `GET /apidata/nti/public-sector`
7. `GET /apidata/nti/public-sector/sector/{id}`
8. `GET /apidata/catalog/dataset`
9. `GET /apidata/catalog/dataset/{id}`
10. `GET /apidata/catalog/dataset/title/{title}`
11. `GET /apidata/catalog/dataset/publisher/{id}`
12. `GET /apidata/catalog/dataset/theme/{id}`
13. `GET /apidata/catalog/dataset/format/{format}`
14. `GET /apidata/catalog/dataset/keyword/{keyword}`
15. `GET /apidata/catalog/dataset/spatial/{spatialWord1}/{spatialWord2}`
16. `GET /apidata/catalog/dataset/modified/begin/{beginDate}/end/{endDate}`
17. `GET /apidata/catalog/distribution`
18. `GET /apidata/catalog/distribution/dataset/{id}`
19. `GET /apidata/catalog/distribution/format/{format}`
20. `GET /apidata/catalog/theme`
21. `GET /apidata/catalog/publisher`
22. `GET /apidata/catalog/spatial`

## Separate official query surface
- `GET https://datos.gob.es/virtuoso/sparql?query=...`
  - documented on the official SPARQL pages
  - not counted in the `22` REST-route inventory above

## Example live behaviors confirmed during manual review
- `GET /apidata/catalog/dataset.json?_pageSize=1` returned a linked-data API page with one dataset item, paging links, and `itemsPerPage` `1`.
- The first live dataset page returned `https://datos.gob.es/catalogo/e05068001-mapas-estrategicos-de-ruido` with identifier `b0da07b8-6856-4af2-91f7-20a7531d6b6f`.
- `GET /apidata/catalog/dataset/e05068001-mapas-estrategicos-de-ruido.json` returned the full dataset item for that slug.
- `GET /apidata/catalog/dataset/title/ruido.json?_pageSize=1` returned the same dataset via title-fragment matching.
- `GET /apidata/catalog/dataset/publisher/E05068001.json?_pageSize=1` returned a dataset published by `Ministerio para la Transición Ecológica y el Reto Demográfico`.
- `GET /apidata/catalog/distribution/dataset/e05068001-mapas-estrategicos-de-ruido.json?_pageSize=1` returned a linked distribution record.
- `GET /apidata/catalog/theme.json?_pageSize=3` returned theme URIs such as `.../SOCI`, `.../EDUC`, and `.../ENER`.
- `GET /apidata/nti/public-sector.json?_pageSize=1` returned SKOS concept items from the NTI public-sector taxonomy.
- `GET /apidata/nti/public-sector/sector/salud.json` returned the live sector-detail route published in Swagger.
- `GET /apidata/nti/territory/Province/Madrid.json`, `GET /apidata/nti/territory/Autonomous-region/Comunidad-Madrid.json`, and `GET /apidata/nti/territory/Country/Espa%C3%B1a.json` all returned live geographic-taxonomy records.
- `GET https://datos.gob.es/virtuoso/sparql?query=SELECT DISTINCT ?tipo WHERE { ?x a ?tipo. } LIMIT 3&format=application/sparql-results+json` returned JSON SPARQL bindings including `http://spdx.org/rdf/terms#Checksum`, `http://www.w3.org/ns/dcat#Distribution`, and `http://xmlns.com/foaf/0.1/Document`.

## fireROUTE integration notes
- Treat the Spain provider as a semantic catalog API, not a CKAN action API.
- The official REST surface is best suited for catalog discovery and metadata harvesting; it returns linked-data pages rather than simplified flat records.
- Keep path-extension and `Accept`-header format negotiation configurable because the official docs support both.
- The official accessible page and Swagger spec disagree on the maximum `_pageSize` (`50` vs `200`), so adapters should use conservative page sizes unless higher limits are explicitly revalidated.
- Keep SPARQL support separate from the REST route mapping because it is a much more flexible but less normalized query surface.
