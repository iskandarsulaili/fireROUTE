# Socrata

## Provider metadata
- Category: `Open Data`
- Provider slug: `socrata`
- Description: `Open-data platform and SODA API used by government, nonprofit, and NGO portals`
- Official docs/pages used:
  - `https://dev.socrata.com/` (official developer portal homepage)
  - `https://dev.socrata.com/docs/endpoints` (official endpoint overview)
  - `https://dev.socrata.com/docs/authentication` (official auth guide)
  - `https://dev.socrata.com/docs/app-tokens.html` (official application-token and throttling guide)
  - `https://dev.socrata.com/docs/queries/` (official SODA3 query/export request-shape guide)
  - `https://dev.socrata.com/docs/formats/` (official output-format table)
  - `https://dev.socrata.com/docs/other/` (official list of other API families)
  - `https://dev.socrata.com/docs/response-codes` (linked official response-code page; this page returned `Service Unavailable - DNS failure` during this review)
- Current public API host model: portal-relative rather than one global host; reviewed official examples use dataset hosts such as `https://data.cityofchicago.org` and `https://soda.demo.socrata.com`
- Current canonical base patterns confirmed from the reviewed docs:
  - `https://{portal-host}/api/v3/views/{identifier}` for dataset query/export operations
  - `https://{portal-host}/oauth/access_token` for OAuth token exchange
- Auth model confirmed from the reviewed docs:
  - application tokens are strongly recommended for higher request limits
  - HTTP Basic authentication is supported for non-interactive applications over HTTPS only
  - OAuth 2.0 is the documented workflow for interactive applications
- Response formats confirmed from the reviewed docs: `JSON`, `CSV`, `GeoJSON`, `XML`, and `RDF-XML` with version-specific availability
- Rate-limit notes confirmed from the reviewed docs:
  - requests without an application token are throttled from an IP-based shared pool
  - requests using an application token are currently not throttled unless judged abusive or malicious
  - throttled clients receive `429`
- Manually confirmed route count: `5`

## API shape and base URL notes
- Socrata is not a single-host API; callers work against the specific portal host that owns the dataset.
- The endpoint overview states that all resources are accessed through a common pattern built around the dataset identifier.
- The official examples show dataset identifiers as eight-character alphanumeric IDs split into two four-character groups with a dash, for example `ydr8-5enu`.
- The current docs distinguish two main SODA3 data operations:
  - `/query` for structured querying
  - `/export` for full-dataset export flows
- The official `Other APIs` page also lists additional families such as `Approvals`, `Curated Region Jobs`, `Curated Regions`, `Metadata`, `Publishing`, `Discovery`, `Team Search`, `User Search`, `OData V2`, `ODN`, `API Keys`, and `Permissions`, but that overview page does not expose exact path templates for those families, so they are not counted in the confirmed route total below.

## Canonical endpoints
1. `GET /api/v3/views/{identifier}/query`
   - Generic query endpoint pattern stated on the official endpoint overview page.
   - Used for dataset-specific query requests on the target portal host.
2. `GET /api/v3/views/{identifier}/query.{format}`
   - Official examples explicitly show `query.json`.
   - Output-format docs confirm extension-based content negotiation for formats such as `json`, `csv`, `geojson`, `xml`, and `rdf` where supported by version.
3. `POST /api/v3/views/{identifier}/query.{format}`
   - Official authentication and application-token examples show `POST` requests against `.../query.json`.
   - The query guide says developers should now use HTTP `POST` for queries because it supports longer queries and clearer request options.
4. `GET /api/v3/views/{identifier}/export.{format}`
   - The official query guide shows `https://data.cityofchicago.org/api/v3/views/ydr8-5enu/export.csv` as the export pattern.
   - Export is described as the route family focused on delivering the full dataset for human or spreadsheet-style consumption.
5. `POST /oauth/access_token`
   - The official authentication guide shows token exchange requests against `https://soda.demo.socrata.com/oauth/access_token`.
   - Used to exchange an authorization code for an OAuth access token.

## Confirmed parameters and request options
### Path parameters
- `portal-host` - the Socrata portal hostname that owns the target dataset, for example `data.cityofchicago.org`
- `identifier` - dataset identifier in the documented `xxxx-xxxx` style
- `format` - output extension such as `json`, `csv`, `geojson`, `xml`, or `rdf` depending on endpoint/version support

### OAuth token-exchange body fields
- `client_id`
- `client_secret`
- `grant_type` - official example uses `authorization_code`
- `redirect_uri`
- `code`

### Query/export request options from the official SODA3 query guide
- `query` - the SoQL query to run; available on both `/query` and `/export`
- `page` - available on `/query`; the docs show `{ pageNumber: 1, pageSize: 1000 }`
- `parameters` - available on both `/query` and `/export` for views that require user-provided parameters
- `timeout` - available on both; default `600` seconds
- `includeSystem` - `/query` only; default `true`
- `includeSynthetic` - `/query` only; default `true`
- `orderingSpecifier` - available on both; default `total`, and the docs note `discard` can improve performance when order does not matter
- `serializationOptions` - `/export` only; used for format-specific customization

### Application-token transport options
- `X-App-Token` header for `3.0` and `2.x` requests; the docs call this the preferred method
- `$$app_token` request parameter for `2.1` and `2.0`
- `app_token` request parameter for `1.0`

## Response and format notes
- The official formats page says response types can be requested by URL extension or by HTTP `Accept` header.
- The reviewed formats table confirms:
  - `csv` -> `text/csv; charset=utf-8` on `2.0`, `2.1`, and `3.0`
  - `geojson` -> `application/vnd.geo+json;charset=utf-8` on `2.1` and `3.0`
  - `json` -> `application/json;charset=utf-8` on `2.0`, `2.1`, and `3.0`
  - `rdf` -> `application/rdf+xml; charset=utf-8` on `2.0`
  - `xml` -> `text/xml; charset=utf-8` on `2.0` and `3.0`
- The query guide distinguishes `/query` from `/export` semantically:
  - `/query` is for fine-grained SoQL-driven retrieval
  - `/export` is for whole-dataset export behavior

## Authentication and rate-limit notes
- Non-interactive applications are directed to HTTP Basic authentication.
- Interactive applications are directed to OAuth 2.0.
- HTTP-basic-authenticated requests must use HTTPS; the docs say insecure authenticated requests will be denied.
- Users can authenticate via username/password or API key/secret when using Basic auth.
- The official OAuth usage guide says access tokens are sent as `Authorization: OAuth YOUR_ACCESS_TOKEN`.
- The application-token guide says untokened traffic is throttled from a shared IP pool, while tokened traffic currently receives a much higher effective limit and is only throttled when abusive or malicious.
- The application-token guide explicitly says throttled clients receive `429`.

## Error and reliability notes
- The reviewed application-token guide explicitly references `429` for throttling.
- The linked official `Response Codes & Headers` page itself returned `Service Unavailable - DNS failure` during this review, so a fuller official status-code table could not be extracted from that page in this pass.
- The query guide documents a default request timeout of `600` seconds for both `/query` and `/export` requests.

## Usage notes
- Preserve the portal-relative host model in fireROUTE integrations; do not hard-code a single Socrata API hostname.
- Prefer `POST` for SODA3 query execution because the official docs now recommend it for longer or more structured queries.
- Prefer `X-App-Token` over query-string token parameters on current integrations.
- Keep `/query` and `/export` separate in adapter design because the official docs describe them as different operational surfaces.
- Treat the `Other APIs` families as real first-party surfaces, but do not normalize them into concrete fireROUTE routes until their exact path templates are confirmed from an official route-level reference.

## fireROUTE normalization notes
- Use `https://{portal-host}/api/v3/views/{identifier}` as the canonical dataset-level base pattern.
- Model the currently confirmed surface as five route families:
  - `GET /query`
  - `GET /query.{format}`
  - `POST /query.{format}`
  - `GET /export.{format}`
  - `POST /oauth/access_token`
- Preserve the official `identifier` placeholder exactly as the dataset ID shown in the portal UI and docs.
- Keep format negotiation explicit because Socrata supports both suffix-based and `Accept`-header-based output selection.
