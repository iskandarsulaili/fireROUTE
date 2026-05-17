# Open Government, Colombia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-colombia`
- Official docs/pages used:
  - `https://www.dane.gov.co/`
  - `https://www.datos.gov.co/`
  - `https://www.datos.gov.co/browse?limitTo=datasets`
  - `https://www.datos.gov.co/Salud-y-Protecci-n-Social/Casos-positivos-de-COVID-19-en-Colombia-/gt2j-8ykr/about_data`
  - `https://www.datos.gov.co/api/views/gt2j-8ykr`
  - `https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=1`
  - `https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=1&$offset=1`
  - `https://www.datos.gov.co/resource/gt2j-8ykr.csv?$limit=1`
  - `https://www.datos.gov.co/resource/gt2j-8ykr.xml?$limit=1`
  - `https://www.datos.gov.co/resource/gt2j-8ykr.rdf`
  - `https://dev.socrata.com/docs/endpoints`
  - `https://dev.socrata.com/docs/authentication`
  - `https://dev.socrata.com/docs/app-tokens`
  - `https://dev.socrata.com/docs/response-codes`
  - `https://dev.socrata.com/docs/queries/`
  - `https://support.socrata.com/hc/en-us/articles/115005364207`
- Assigned docs URL: `https://www.dane.gov.co/`
- Current documented API host: `https://www.datos.gov.co`
- Current documented API path prefixes: `/api/views` and `/resource`
- Auth model: public dataset reads worked anonymously; the official Socrata docs say application tokens can be sent with `X-App-Token` and authenticated operations use HTTP Basic or OAuth 2.0
- Response formats: JSON, CSV, XML, and RDF-XML confirmed live on the reviewed dataset endpoint
- Rate limits: the official app-token docs say unauthenticated requests can be throttled from a shared IP pool and that app-token requests currently are not throttled unless abusive or malicious
- Manually confirmed route count: `5`

## Official usage notes
- The assigned DANE homepage does not itself publish a route-level API reference, but during this run it linked onward to the official Colombian national open-data portal `https://www.datos.gov.co/`.
- The national portal is Socrata-hosted. The reviewed dataset page linked official Socrata OData and datatype/API help pages, and the live portal exposed the standard public dataset metadata and export routes.
- The reviewed `browse?limitTo=datasets` page showed `8396` dataset results during this run.
- The reviewed dataset page for `gt2j-8ykr` exposed field names and data types and linked official Socrata help, confirming the portal is serving structured machine-readable data from the public catalogue.

## Canonical endpoints confirmed from the official site
1. `GET /api/views/{dataset_identifier}`
   - Base URL: `https://www.datos.gov.co`
   - Purpose: return dataset metadata for one dataset identifier
   - Path parameters:
     - `dataset_identifier` - eight-character Socrata dataset id such as `gt2j-8ykr`
   - Live confirmation:
     - `GET /api/views/gt2j-8ykr` returned dataset metadata including `id`, `name`, `assetType`, attribution, timestamps, and schema information

2. `GET /resource/{dataset_identifier}.json`
   - Base URL: `https://www.datos.gov.co`
   - Purpose: return dataset rows as JSON
   - Path parameters:
     - `dataset_identifier` - dataset id such as `gt2j-8ykr`
   - Query parameters confirmed from the reviewed live request and official Socrata docs:
     - `$limit` - maximum rows to return, optional
     - `$offset` - row offset for paging, optional
     - other SoQL query arguments such as `$select`, `$where`, `$order`, and `$q` are documented in the official Socrata query guide
   - Live confirmation:
     - `resource/gt2j-8ykr.json?$limit=1` returned one row as JSON
     - `resource/gt2j-8ykr.json?$limit=1&$offset=1` returned the next row, confirming offset-based paging

3. `GET /resource/{dataset_identifier}.csv`
   - Base URL: `https://www.datos.gov.co`
   - Purpose: return dataset rows as CSV
   - Path parameters:
     - `dataset_identifier` - dataset id such as `gt2j-8ykr`
   - Query parameters:
     - supports the same row-limiting/query arguments used on the JSON route
   - Live confirmation:
     - `resource/gt2j-8ykr.csv?$limit=1` returned CSV with a header row and one record

4. `GET /resource/{dataset_identifier}.xml`
   - Base URL: `https://www.datos.gov.co`
   - Purpose: return dataset rows as XML
   - Path parameters:
     - `dataset_identifier` - dataset id such as `gt2j-8ykr`
   - Query parameters:
     - supports the same row-limiting/query arguments used on the JSON route
   - Live confirmation:
     - `resource/gt2j-8ykr.xml?$limit=1` returned a `<response><rows><row ...>` XML payload

5. `GET /resource/{dataset_identifier}.rdf`
   - Base URL: `https://www.datos.gov.co`
   - Purpose: return dataset metadata/data in RDF-XML form
   - Path parameters:
     - `dataset_identifier` - dataset id such as `gt2j-8ykr`
   - Query parameters: none were required in the reviewed live request
   - Live confirmation:
     - `resource/gt2j-8ykr.rdf` returned RDF/XML with `rdf`, `dcat`, `dcterms`, `ods`, and Socrata namespaces

## Pagination, filtering, and format notes
- The reviewed Colombian portal supports format selection by file extension on `/resource/{dataset_identifier}`.
- Live paging on JSON reads worked with `$limit` and `$offset`.
- The official Socrata query guide says SoQL-style filtering and projection parameters are supported, including `$select`, `$where`, `$order`, and `$q`.
- The official endpoint docs describe each dataset identifier as an eight-character alphanumeric id split into two four-character groups by a dash.

## Error, auth, and access notes
- The official Socrata response-code docs list standard HTTP statuses including `200`, `202`, `400`, `401`, `403`, `404`, `429`, and `500`.
- The same official docs note SODA 2.1 response headers such as `X-Socrata-RequestId`, `Access-Control-Allow-Origin`, `X-SODA2-Fields`, `X-SODA2-Types`, and `Last-Modified`.
- Public Colombian dataset reads succeeded anonymously in this run.
- The official Socrata app-token docs say requests without an application token can be throttled by shared IP usage, while requests with an app token currently are not throttled unless deemed abusive or malicious.
- For authenticated writes or private-dataset access, the official Socrata authentication docs require HTTPS and describe HTTP Basic for non-interactive scripts plus OAuth 2.0 for interactive applications.

## fireROUTE normalization notes
- Treat `https://www.datos.gov.co` as the canonical host for this provider.
- Normalize the provider against the live public SODA 2.1 route families confirmed on the portal: `/api/views/{dataset_identifier}` and `/resource/{dataset_identifier}.{format}`.
- Keep SoQL-style query arguments as passthrough request parameters rather than remapping them into a narrower custom filter schema.
- Do not assume the DANE homepage itself is the API host; the reviewed official path to usable API routes was DANE -> official national open-data portal -> official Socrata developer/help pages.