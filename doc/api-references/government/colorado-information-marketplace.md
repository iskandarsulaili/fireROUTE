# Colorado Information Marketplace

## Provider metadata
- Category: `Government`
- Provider slug: `colorado-information-marketplace`
- Official docs/pages used:
  - `https://data.colorado.gov/`
  - `https://data.colorado.gov/Business/Business-Entities-in-Colorado/4ykn-tg5h/about_data`
  - `https://data.colorado.gov/api/views/4ykn-tg5h`
  - `https://data.colorado.gov/resource/4ykn-tg5h.json?$limit=1`
  - `https://data.colorado.gov/resource/4ykn-tg5h.json?$limit=1&$offset=1`
  - `https://data.colorado.gov/resource/4ykn-tg5h.xml?$limit=1`
  - `https://data.colorado.gov/api/odata/v4/4ykn-tg5h?$top=1`
  - `https://data.colorado.gov/api/v3/views/4ykn-tg5h/query.json?$limit=1`
  - `https://dev.socrata.com/docs/endpoints`
  - `https://dev.socrata.com/docs/app-tokens`
  - `https://dev.socrata.com/docs/authentication`
  - `https://dev.socrata.com/docs/response-codes`
  - `https://dev.socrata.com/docs/queries/`
  - `https://support.socrata.com/hc/en-us/articles/115005364207`
- Assigned docs URL: `https://data.colorado.gov/`
- Current documented API host: `https://data.colorado.gov`
- Current documented API path prefixes: `/api/views`, `/resource`, `/api/odata/v4`, and `/api/v3/views`
- Auth model: anonymous reads were confirmed on the reviewed `/resource` and `/api/odata/v4` routes; the reviewed SODA3 query route returned an official JSON error saying the request must be authenticated or include an application token; Socrata's official auth docs describe `X-App-Token` plus HTTP Basic or OAuth 2.0 for authenticated access
- Response formats: JSON confirmed on `/api/v3/.../query.json` error responses and `/resource/...json`; XML confirmed on `/resource/...xml`; Atom/XML confirmed on `/api/odata/v4/...`
- Rate limits: the official application-token docs say requests without an application token may be throttled from a shared IP pool, while requests using an application token currently are not throttled unless abusive or malicious
- Manually confirmed route count: `5`

## Official usage notes
- The official homepage identifies the service as the `Colorado Open Data Portal` / `Colorado Information Marketplace` and exposes state-hosted dataset pages on `data.colorado.gov`.
- The reviewed dataset page for `Business Entities in Colorado` exposed the portal's `Actions` and `Export` controls and linked official Socrata OData documentation, confirming the portal is using the Socrata / Tyler Data & Insights API surfaces on the Colorado-owned domain.
- The reviewed dataset page reported this sample dataset id as `4ykn-tg5h`, with dataset updates on the official host and a large public row count, making it suitable for route verification.
- The official SODA docs now distinguish older anonymous `/resource` style access from SODA3 `/api/v3/views/{identifier}/query` and `/export` patterns. In this Colorado review, the public `/resource` and OData routes worked anonymously, while the SODA3 query route responded with an official auth-required JSON body.

## Canonical endpoints confirmed from the official site
1. `GET /api/views/{dataset_identifier}`
   - Base URL: `https://data.colorado.gov`
   - Purpose: return metadata for a specific dataset/view
   - Path parameters:
     - `dataset_identifier` - Socrata dataset id such as `4ykn-tg5h`
   - Live confirmation:
     - `GET https://data.colorado.gov/api/views/4ykn-tg5h` returned a live official response on the Colorado host for the reviewed dataset id

2. `GET /resource/{dataset_identifier}.json`
   - Base URL: `https://data.colorado.gov`
   - Purpose: return dataset rows as JSON
   - Path parameters:
     - `dataset_identifier` - dataset id such as `4ykn-tg5h`
   - Query parameters confirmed from the reviewed live requests and official Socrata docs:
     - `$limit` - maximum rows to return
     - `$offset` - row offset for paging
     - other SoQL-style filters such as `$select`, `$where`, `$order`, and `$q` are documented in the official Socrata query docs
   - Live confirmation:
     - `resource/4ykn-tg5h.json?$limit=1` returned a live official response
     - `resource/4ykn-tg5h.json?$limit=1&$offset=1` also returned a live official response, confirming offset-style pagination is supported on the Colorado host

3. `GET /resource/{dataset_identifier}.xml`
   - Base URL: `https://data.colorado.gov`
   - Purpose: return dataset rows as XML
   - Path parameters:
     - `dataset_identifier` - dataset id such as `4ykn-tg5h`
   - Query parameters:
     - supports the same row limiting and SoQL-style query options used on the JSON route
   - Live confirmation:
     - `resource/4ykn-tg5h.xml?$limit=1` returned an official XML payload beginning with `<response><rows>...`

4. `GET /api/odata/v4/{dataset_identifier}`
   - Base URL: `https://data.colorado.gov`
   - Purpose: expose a dataset as an OData v4 feed
   - Path parameters:
     - `dataset_identifier` - dataset id such as `4ykn-tg5h`
   - Query parameters confirmed from the reviewed live request and official OData article:
     - `$top` - limit the number of rows returned
     - the official OData docs also document standard OData options such as `$skip`, `$filter`, `$select`, and `$orderby`
   - Live confirmation:
     - `api/odata/v4/4ykn-tg5h?$top=1` returned an Atom/XML feed whose `m:context` referenced `https://data.colorado.gov/api/odata/v4/$metadata#4ykn-tg5h`

5. `POST /api/v3/views/{dataset_identifier}/query.json`
   - Base URL: `https://data.colorado.gov`
   - Purpose: run SODA3 queries against a dataset
   - Path parameters:
     - `dataset_identifier` - dataset id such as `4ykn-tg5h`
   - Authentication:
     - the official SODA3 docs say requests must be authenticated by a user or marked with a valid application token
   - Request body / parameters documented on the official query docs:
     - `query` - query expression payload
     - `page` - object like `{ pageNumber, pageSize }`
     - `parameters` - parameter values for parameterized views
     - `timeout` - default `600`
     - `includeSystem` - include system columns
     - `includeSynthetic` - include synthetic / implicit columns
     - `orderingSpecifier` - ordering behavior, with docs noting `discard` may improve performance when order does not matter
   - Live confirmation:
     - `GET https://data.colorado.gov/api/v3/views/4ykn-tg5h/query.json?$limit=1` returned an official JSON error body: `{ "code": "authentication_required", "error": true, "message": "This request must be authenticated or have an application token" }`
     - although that probe used `GET`, the official SODA3 docs say developers should now use `POST` for query requests

## Pagination, filtering, and format notes
- The public `/resource/{dataset_identifier}.{format}` routes support extension-based format selection on the Colorado host; JSON and XML were rechecked directly in this run.
- The reviewed JSON route accepted `$limit` and `$offset`, confirming offset-based pagination.
- The official SoQL docs document additional filter/projection options such as `$select`, `$where`, `$order`, and `$q` for Socrata-backed endpoints.
- The official OData article documents OData v4 endpoints as `https://$domain/api/odata/v4/$dataset_identifier` and older OData v2 endpoints as `https://$domain/OData.svc/$dataset_identifier`.
- The official SODA3 query docs document a page-object style query model for `/api/v3/views/{identifier}/query` and note that `/export` routes are intended for full-dataset style exports.

## Error, auth, and access notes
- The reviewed Colorado SODA3 query probe returned a structured JSON error with `code`, `error`, and `message`, specifically `authentication_required`.
- The official response-code docs list standard statuses including `200`, `202`, `400`, `401`, `403`, `404`, `429`, and `500`.
- The same official docs list useful SODA 2.1 response headers including `X-Socrata-RequestId`, `Access-Control-Allow-Origin`, `X-SODA2-Fields`, `X-SODA2-Types`, `Last-Modified`, and `ETag`.
- The official auth docs say non-interactive authenticated requests use HTTP Basic over HTTPS, while interactive applications should use OAuth 2.0.
- The official application-token docs say SODA 3.0 and 2.x requests should send the application token in the `X-App-Token` header.

## fireROUTE normalization notes
- Treat `https://data.colorado.gov` as the canonical provider host.
- Normalize the provider around the live route families verified on the official Colorado host: dataset metadata under `/api/views/{dataset_identifier}`, public tabular reads under `/resource/{dataset_identifier}.{format}`, OData feeds under `/api/odata/v4/{dataset_identifier}`, and authenticated SODA3 queries under `/api/v3/views/{dataset_identifier}/query.json`.
- Keep Socrata / SoQL query arguments (`$limit`, `$offset`, `$select`, `$where`, `$order`, `$q`) as passthrough parameters rather than remapping them into a narrower custom schema.
- Preserve the auth distinction between anonymous public dataset reads and SODA3 query calls that now require authentication or an application token on the reviewed Colorado host.
- The reviewed official portal is broad and dataset-driven, but the Colorado-owned host clearly exposes a reusable API surface, so this provider should no longer remain blocked.