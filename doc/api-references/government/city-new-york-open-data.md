# City, New York Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `city-new-york-open-data`
- Official docs/pages used:
  - `https://opendata.cityofnewyork.us/how-to/#apidocumentation`
  - `https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9`
  - `https://data.cityofnewyork.us/api/views/erm2-nwe9`
  - `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=1`
  - `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=1&$offset=1`
  - `https://data.cityofnewyork.us/resource/erm2-nwe9.csv?$limit=1`
  - `https://data.cityofnewyork.us/resource/erm2-nwe9.xml?$limit=1`
  - `https://data.cityofnewyork.us/resource/erm2-nwe9.rdf`
  - `https://dev.socrata.com/consumers/getting-started.html`
  - `https://dev.socrata.com/docs/endpoints`
  - `https://dev.socrata.com/docs/authentication`
  - `https://dev.socrata.com/docs/app-tokens`
  - `https://dev.socrata.com/docs/response-codes`
  - `https://dev.socrata.com/docs/queries/`
- Current documented API host: `https://data.cityofnewyork.us`
- Current documented API path prefixes: `/api/views` and `/resource`
- Auth model: public dataset reads worked anonymously during this run; the official Socrata docs say application tokens can be sent with `X-App-Token` and authenticated operations use HTTP Basic or OAuth 2.0
- Response formats: JSON, CSV, XML, and RDF/XML confirmed live on the reviewed NYC dataset endpoint
- Rate limits: the official app-token docs say unauthenticated requests are throttled from a shared IP pool and that requests using an application token currently are not throttled unless abusive or malicious
- Manually confirmed route count: `5`

## Official usage notes
- The NYC Open Data `How To` page links directly to the official Socrata API, query, and endpoint documentation.
- The reviewed official tutorial dataset link resolves to dataset identifier `erm2-nwe9`, and the live metadata route returned dataset metadata including `id`, `name`, `assetType`, `category`, timestamps, and description fields.
- In this run, the working public route families on the NYC host were the legacy SODA 2.1-style `/resource/{dataset_identifier}.{format}` endpoints plus `/api/views/{dataset_identifier}` for metadata.
- The current official Socrata query guide emphasizes newer SODA3 `/api/v3/views/{identifier}/query` and `/export` patterns, but those were not the route families linked from the NYC Open Data portal or required to read the reviewed public dataset during this run.

## Canonical endpoints confirmed from the official site
1. `GET /api/views/{dataset_identifier}`
   - Base URL: `https://data.cityofnewyork.us`
   - Purpose: return dataset metadata for one NYC dataset identifier
   - Path parameters:
     - `dataset_identifier` - dataset id such as `erm2-nwe9`
   - Live confirmation:
     - `GET /api/views/erm2-nwe9` returned dataset metadata including `id`, `name`, `assetType`, `category`, `createdAt`, and `description`

2. `GET /resource/{dataset_identifier}.json`
   - Base URL: `https://data.cityofnewyork.us`
   - Purpose: return dataset rows as JSON
   - Path parameters:
     - `dataset_identifier` - dataset id such as `erm2-nwe9`
   - Query parameters confirmed from the reviewed live requests and official Socrata docs:
     - `$limit` - maximum rows to return, optional
     - `$offset` - row offset for paging, optional
     - other SoQL query arguments such as `$select`, `$where`, `$order`, and `$q` are documented in the official Socrata query guide
   - Live confirmation:
     - `resource/erm2-nwe9.json?$limit=1` returned one 311 row as JSON
     - `resource/erm2-nwe9.json?$limit=1&$offset=1` returned the next row, confirming offset-based paging

3. `GET /resource/{dataset_identifier}.csv`
   - Base URL: `https://data.cityofnewyork.us`
   - Purpose: return dataset rows as CSV
   - Path parameters:
     - `dataset_identifier` - dataset id such as `erm2-nwe9`
   - Query parameters:
     - supports the same row-limiting and SoQL query arguments used on the JSON route
   - Live confirmation:
     - `resource/erm2-nwe9.csv?$limit=1` returned CSV with a header row and one record

4. `GET /resource/{dataset_identifier}.xml`
   - Base URL: `https://data.cityofnewyork.us`
   - Purpose: return dataset rows as XML
   - Path parameters:
     - `dataset_identifier` - dataset id such as `erm2-nwe9`
   - Query parameters:
     - supports the same row-limiting and SoQL query arguments used on the JSON route
   - Live confirmation:
     - `resource/erm2-nwe9.xml?$limit=1` returned an XML payload beginning with `<response><row><row ...>`

5. `GET /resource/{dataset_identifier}.rdf`
   - Base URL: `https://data.cityofnewyork.us`
   - Purpose: return dataset metadata/data in RDF/XML form
   - Path parameters:
     - `dataset_identifier` - dataset id such as `erm2-nwe9`
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - `resource/erm2-nwe9.rdf` returned RDF/XML with `rdf`, `rdfs`, `socrata`, and `dcat` namespaces

## Pagination, filtering, and format notes
- The reviewed NYC host supports format selection by file extension on `/resource/{dataset_identifier}`.
- Live paging on JSON reads worked with `$limit` and `$offset`.
- The official Socrata query guide documents richer filtering and projection parameters, including options such as `$select`, `$where`, `$order`, and `$q`.
- The official query docs now emphasize POST-based SODA3 `/query` and `/export` flows for newer integrations, but the live public NYC dataset access reviewed here still worked through the SODA 2.1 `/resource` routes.

## Error, auth, and access notes
- The official response-code docs list standard HTTP statuses including `200`, `202`, `400`, `401`, `403`, `404`, `429`, and `500`.
- The same official docs say SODA 2.1 responses may include headers such as `X-Socrata-RequestId`, `Access-Control-Allow-Origin`, `X-SODA2-Fields`, `X-SODA2-Types`, `Last-Modified`, and `ETag`.
- Public NYC dataset reads succeeded anonymously in this run.
- The official app-token docs say requests without an application token can be throttled based on shared IP usage, while requests with an application token currently are not throttled unless deemed abusive or malicious.
- For authenticated writes or private-dataset access, the official Socrata authentication docs require HTTPS and describe HTTP Basic for non-interactive scripts plus OAuth 2.0 for interactive applications.

## fireROUTE normalization notes
- Treat `https://data.cityofnewyork.us` as the canonical host for this provider.
- Normalize the provider against the live public SODA 2.1 route families confirmed in this run: `/api/views/{dataset_identifier}` and `/resource/{dataset_identifier}.{format}`.
- Keep SoQL-style query arguments as passthrough request parameters instead of remapping them into a narrower custom filter schema.
- Do not assume the generic Socrata SODA3 `/api/v3/views/{identifier}/query` route should be the primary adapter surface for this provider unless NYC later exposes dataset-level guidance that makes that route family the preferred public interface.
