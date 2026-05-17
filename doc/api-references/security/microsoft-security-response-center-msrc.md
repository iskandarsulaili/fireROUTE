# Microsoft Security Response Center (MSRC)

## Provider metadata
- Category: `Security`
- Provider slug: `microsoft-security-response-center-msrc`
- Docs used manually:
  - `https://api.msrc.microsoft.com/cvrf/v3.0/swagger/v3/swagger.json`
  - `https://api.msrc.microsoft.com/cvrf/v3.0/`
- Confirmed API base URL: `https://api.msrc.microsoft.com/cvrf/v3.0`
- Authentication model: none documented in the official OpenAPI document
- Primary response format observed during review: JSON
- Manually confirmed routes in this pass: `14`

## Authentication
- The official OpenAPI document does not define any `security` requirement.
- The reviewed spec also does not define any `securitySchemes` block.
- The category index already marked this provider as `No` auth, and the reviewed machine-readable docs do not contradict that.

## Service and format notes
- The reviewed OpenAPI document identifies this service as `MSRC CVRF API`, version `v3`.
- A live request to the service root returned a JSON OData service-document style payload:
  - `{"@odata.context":"https://api.msrc.microsoft.com/$metadata","value":[{"name":"Updates","kind":"EntitySet","url":"Updates"}]}`
- The OpenAPI paths expose three main resource shapes:
  - service-document and metadata endpoints
  - update-summary OData endpoints
  - document retrieval endpoints for `CVRF` and `CSAF`

## Pagination and query options
- The update-summary endpoints expose an `options` query parameter whose schema is `UpdateODataQueryOptions`.
- The referenced raw OData option schema exposes these query-option names:
  - `filter`
  - `apply`
  - `compute`
  - `search`
  - `orderBy`
  - `top`
  - `skip`
  - `select`
  - `expand`
  - `count`
  - `format`
  - `skipToken`
  - `deltaToken`
- The presence of `top`, `skip`, `count`, and `skipToken` confirms OData-style pagination and collection shaping for update-summary queries.

## Error handling
- The reviewed OpenAPI operations only document `200` responses.
- The official spec does not publish a fuller error table for these routes.
- A live request to `https://api.msrc.microsoft.com/` during review returned this JSON error payload:
  - `{ "statusCode": 404, "message": "Resource not found" }`
- That confirms the service returns structured JSON error bodies at least for missing resources, even though the route docs do not enumerate them.

## Rate limits
- No public rate-limit or quota table was present in the reviewed official OpenAPI document or service root.
- The reviewed official sources therefore confirm the route surface, but not a numeric throttle policy.

## Confirmed routes

### Service document and metadata

#### 1) Service root
- Method: `GET`
- Path: `/`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/`
- Purpose: OData-style service root for the MSRC CVRF API.
- Notes:
  - the live root response lists the `Updates` entity set.

#### 2) Alternate service root
- Method: `GET`
- Path: `/.`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/.`
- Purpose: alternate service-document route exposed in the OpenAPI document.

#### 3) Metadata document
- Method: `GET`
- Path: `/$metadata`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/$metadata`
- Purpose: return OData service metadata.

#### 4) Alternate metadata document
- Method: `GET`
- Path: `/./$metadata`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/./$metadata`
- Purpose: alternate metadata route exposed in the OpenAPI document.

### Update summaries

#### 5) List update summaries
- Method: `GET`
- Path: `/updates`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/updates`
- Purpose: get all security update summaries.
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 6) List update summaries, capitalized form
- Method: `GET`
- Path: `/Updates`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/Updates`
- Purpose: same documented summary collection exposed with capitalized OData-style path.
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 7) Count update summaries
- Method: `GET`
- Path: `/Updates/$count`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/Updates/$count`
- Purpose: count update-summary results.
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 8) Get update summaries by key, parenthesized lowercase form
- Method: `GET`
- Path: `/updates({key})`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/updates({key})`
- Purpose: get security update summaries by key.
- Confirmed parameter:
  - `key` - update ID (`yyyy-mmm`), vulnerability ID (`CVE` number), or year (`yyyy`)
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 9) Get update summaries by key, lowercase slash form
- Method: `GET`
- Path: `/updates/{key}`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/updates/{key}`
- Purpose: get security update summaries by key.
- Confirmed parameter:
  - `key` - update ID (`yyyy-mmm`), vulnerability ID (`CVE` number), or year (`yyyy`)
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 10) Get update summaries by key, parenthesized capitalized form
- Method: `GET`
- Path: `/Updates({key})`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/Updates({key})`
- Purpose: get security update summaries by key.
- Confirmed parameter:
  - `key` - update ID (`yyyy-mmm`), vulnerability ID (`CVE` number), or year (`yyyy`)
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

#### 11) Get update summaries by key, capitalized slash form
- Method: `GET`
- Path: `/Updates/{key}`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/Updates/{key}`
- Purpose: get security update summaries by key.
- Confirmed parameter:
  - `key` - update ID (`yyyy-mmm`), vulnerability ID (`CVE` number), or year (`yyyy`)
- Confirmed query input:
  - `options` - `UpdateODataQueryOptions`

### Detailed advisory documents

#### 12) Get CSAF document
- Method: `GET`
- Path: `/csaf/{id}`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/csaf/{id}`
- Purpose: retrieve a CSAF document by ID.
- Confirmed parameter:
  - `id` - string document identifier

#### 13) Get CVRF document
- Method: `GET`
- Path: `/cvrf/{id}`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/{id}`
- Purpose: get security update details in CVRF format.
- Confirmed parameter:
  - `id` - CVRF document ID in `yyyy-mmm` format

#### 14) Get CVRF document, parenthesized form
- Method: `GET`
- Path: `/cvrf({id})`
- Full URL: `https://api.msrc.microsoft.com/cvrf/v3.0/cvrf({id})`
- Purpose: get security update details in CVRF format.
- Confirmed parameter:
  - `id` - CVRF document ID in `yyyy-mmm` format

## Important usage notes
- The official route surface is heavily OData-shaped; the spec explicitly exposes both lowercase and capitalized collection paths as well as slash and parenthesized key forms.
- All reviewed routes are `GET` operations.
- The service root advertises `Updates` as the public entity set exposed by the service document.
- The update-summary routes are the only reviewed routes that explicitly expose OData query controls for filtering, ordering, shaping, pagination, and counts.
- The reviewed OpenAPI document is more authoritative for route enumeration than the catalog landing page because it exposes the full live path list directly.

## Verification notes
This file was manually rebuilt from Microsoft's official MSRC OpenAPI document and the live MSRC service root response.