# Open Government, ACT

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-act`
- Official docs/pages used:
  - `https://www.data.act.gov.au/`
  - `https://www.data.act.gov.au/Transport/Mobile-Speed-Camera-Visits-and-Stays/d56a-2nhi/about_data`
  - `https://www.data.act.gov.au/api/views/d56a-2nhi`
  - `https://www.data.act.gov.au/resource/d56a-2nhi.json?$limit=1`
  - `https://www.data.act.gov.au/resource/d56a-2nhi.json?$limit=1&$offset=1`
  - `https://www.data.act.gov.au/resource/d56a-2nhi.csv?$limit=1`
  - `https://www.data.act.gov.au/resource/d56a-2nhi.xml?$limit=1`
  - `https://www.data.act.gov.au/resource/d56a-2nhi.rdf`
  - `https://dev.socrata.com/docs/endpoints`
  - `https://dev.socrata.com/docs/authentication`
  - `https://dev.socrata.com/docs/app-tokens`
  - `https://dev.socrata.com/docs/response-codes`
  - `https://dev.socrata.com/docs/queries/`
- Current documented API host: `https://www.data.act.gov.au`
- Current documented API path prefixes: `/api/views` and `/resource`
- Auth model: public dataset reads worked anonymously; the official developer docs say application tokens can be sent with `X-App-Token` and authenticated operations use HTTP Basic or OAuth 2.0
- Response formats: JSON, CSV, XML, and RDF-XML confirmed live on the reviewed dataset endpoint
- Rate limits: the official app-token docs say unauthenticated requests can be throttled from a shared IP pool and that app-token requests currently are not throttled unless abusive or malicious
- Manually confirmed route count: `5`

## Official usage notes
- The ACT data portal is a Socrata-hosted open-data portal. The homepage links directly to the official Socrata developer documentation, and the reviewed dataset page links official Socrata OData/API help.
- The reviewed ACT dataset page exposed the API field names and data types for dataset `d56a-2nhi`, confirming the portal is serving structured machine-readable data from the public catalogue.
- In this run, the working public dataset routes on the ACT host were the legacy SODA 2.1-style `/resource/{dataset_identifier}.{format}` and `/api/views/{dataset_identifier}` endpoints.
- The generic official Socrata docs now emphasize newer SODA3 `/api/v3/views/{identifier}/query` and `/export` patterns, but those were not the route families linked or required to read the reviewed ACT dataset during this run.

## Canonical endpoints confirmed from the official site
1. `GET /api/views/{dataset_identifier}`
   - Base URL: `https://www.data.act.gov.au`
   - Purpose: return dataset metadata for one dataset identifier
   - Path parameters:
     - `dataset_identifier` - eight-character Socrata dataset id such as `d56a-2nhi`
   - Live confirmation:
     - `GET /api/views/d56a-2nhi` returned dataset metadata including `id`, `name`, `assetType`, `category`, `description`, and update timestamps

2. `GET /resource/{dataset_identifier}.json`
   - Base URL: `https://www.data.act.gov.au`
   - Purpose: return dataset rows as JSON
   - Path parameters:
     - `dataset_identifier` - dataset id such as `d56a-2nhi`
   - Query parameters confirmed from the reviewed live request and official Socrata docs:
     - `$limit` - maximum rows to return, optional
     - `$offset` - row offset for paging, optional
     - other SoQL query arguments such as `$select`, `$where`, `$order`, and `$q` are documented in the official Socrata query guide
   - Live confirmation:
     - `resource/d56a-2nhi.json?$limit=1` returned one row as JSON
     - `resource/d56a-2nhi.json?$limit=1&$offset=1` returned the next row, confirming offset-based paging

3. `GET /resource/{dataset_identifier}.csv`
   - Base URL: `https://www.data.act.gov.au`
   - Purpose: return dataset rows as CSV
   - Path parameters:
     - `dataset_identifier` - dataset id such as `d56a-2nhi`
   - Query parameters:
     - supports the same row-limiting/query arguments used on the JSON route
   - Live confirmation:
     - `resource/d56a-2nhi.csv?$limit=1` returned CSV with header row and one record

4. `GET /resource/{dataset_identifier}.xml`
   - Base URL: `https://www.data.act.gov.au`
   - Purpose: return dataset rows as XML
   - Path parameters:
     - `dataset_identifier` - dataset id such as `d56a-2nhi`
   - Query parameters:
     - supports the same row-limiting/query arguments used on the JSON route
   - Live confirmation:
     - `resource/d56a-2nhi.xml?$limit=1` returned a `<response><rows><row ...>` XML payload

5. `GET /resource/{dataset_identifier}.rdf`
   - Base URL: `https://www.data.act.gov.au`
   - Purpose: return dataset metadata/data in RDF-XML form
   - Path parameters:
     - `dataset_identifier` - dataset id such as `d56a-2nhi`
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - `resource/d56a-2nhi.rdf` returned RDF/XML with `rdf`, `dcat`, `dcterm`, and Socrata namespaces

## Pagination, filtering, and format notes
- The reviewed ACT host supports format selection by file extension on `/resource/{dataset_identifier}`.
- Live paging on JSON reads worked with `$limit` and `$offset`.
- The official Socrata query guide says SoQL-style filtering and projection parameters are supported, including options such as `$select`, `$where`, `$order`, and `$q`.
- The official endpoint docs describe each dataset identifier as an eight-character alphanumeric id split into two four-character groups by a dash.

## Error, auth, and access notes
- The official Socrata response-code docs list standard HTTP statuses including `200`, `202`, `400`, `401`, `403`, `404`, `429`, and `500`.
- The same official docs note SODA 2.1 response headers such as `X-Socrata-RequestId`, `Access-Control-Allow-Origin`, `X-SODA2-Fields`, `X-SODA2-Types`, and `Last-Modified`.
- Public ACT dataset reads succeeded anonymously in this run.
- The official Socrata app-token docs say requests without an application token can be throttled by shared IP usage, while requests with an app token currently are not throttled unless deemed abusive or malicious.
- For authenticated writes or private-dataset access, the official Socrata authentication docs require HTTPS and describe HTTP Basic for non-interactive scripts plus OAuth 2.0 for interactive applications.

## fireROUTE normalization notes
- Treat `https://www.data.act.gov.au` as the canonical host for this provider.
- Normalize the ACT provider against the live public SODA 2.1 route families confirmed on the portal: `/api/views/{dataset_identifier}` and `/resource/{dataset_identifier}.{format}`.
- Keep SoQL-style query arguments as passthrough request parameters rather than attempting to remap them into a narrower custom filter schema.
- Do not assume the generic Socrata SODA3 `/api/v3/views/{identifier}/query` route is the best primary adapter surface for this provider unless the ACT portal later exposes dataset-level docs for it.