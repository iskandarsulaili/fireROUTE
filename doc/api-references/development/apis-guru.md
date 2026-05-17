# APIs.guru

## Provider metadata
- Category: `Development`
- Provider slug: `apis-guru`
- Docs used manually:
  - `https://apis.guru/api-doc`
- Confirmed base URL:
  - `https://api.apis.guru/v2`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `7`

## Authentication
- The reviewed official API reference does not document any API key, OAuth flow, session cookie, or custom auth header.
- All seven reviewed operations are presented as unauthenticated `GET` endpoints.

## Common request/response conventions
- All manually confirmed operations are `GET` routes.
- The rendered official docs show JSON responses for every reviewed operation.
- The docs page itself is a Redoc reference, and its download link points to the official OpenAPI document at `https://api.apis.guru/v2/openapi.yaml`, which confirms the `/v2` API base.
- The directory/list routes return lightweight metadata so clients can browse APIs without fetching every individual spec first.
- The docs explicitly note that the all-APIs listing marks a preferred version when multiple versions exist.

## Manually confirmed endpoint set

### 1) List all providers
- Method: `GET`
- Path: `/providers.json`
- Purpose: return the providers currently present in the APIs.guru directory
- Confirmed parameters: none shown on the reviewed page
- Confirmed response notes:
  - JSON response
  - the visible sample is an object containing a `data` array of provider-name strings

### 2) List all APIs for a particular provider
- Method: `GET`
- Path: `/{provider}.json`
- Purpose: return all APIs in the directory for one provider
- Confirmed path parameters:
  - `provider` - required string, 1 to 255 characters; official example: `apis.guru`
- Confirmed response notes:
  - JSON response
  - the visible sample shows provider entries keyed by API name, with fields such as `added`, `preferred`, and `versions`

### 3) List all service names for a particular provider
- Method: `GET`
- Path: `/{provider}/services.json`
- Purpose: list all service names for one provider
- Confirmed path parameters:
  - `provider` - required string, 1 to 255 characters; official example: `apis.guru`
- Confirmed response notes:
  - JSON response
  - the visible sample is a `data` array of strings

### 4) Retrieve one version of a particular API without a service name
- Method: `GET`
- Path: `/specs/{provider}/{api}.json`
- Purpose: return one specific API version where no `service` segment is used
- Confirmed path parameters:
  - `provider` - required string, 1 to 255 characters; official example: `apis.guru`
  - `api` - required string, 1 to 255 characters; official example: `2.1.0`
- Confirmed response notes:
  - JSON response
  - the route is documented as retrieving one specific API version

### 5) Retrieve one version of a particular API with a service name
- Method: `GET`
- Path: `/specs/{provider}/{service}/{api}.json`
- Purpose: return one specific API version for providers that organize APIs under a service name
- Confirmed path parameters:
  - `provider` - required string, 1 to 255 characters; official example: `apis.guru`
  - `service` - required string, 1 to 255 characters; official example: `graph`
  - `api` - required string, 1 to 255 characters; official example: `2.1.0`
- Confirmed response notes:
  - JSON response
  - the route is documented as retrieving one specific API version with a service name

### 6) List all APIs across the directory
- Method: `GET`
- Path: `/list.json`
- Purpose: return the complete directory listing with cached summary information for each API
- Confirmed parameters: none shown on the reviewed page
- Confirmed response notes:
  - JSON response
  - the docs explicitly say this route returns links to the OpenAPI definitions for each API
  - the docs explicitly say preferred versions are marked when multiple versions exist
  - the visible sample shows objects containing fields like `added`, `preferred`, and `versions`

### 7) Get directory-wide metrics
- Method: `GET`
- Path: `/metrics.json`
- Purpose: return aggregate statistics about the APIs.guru directory
- Confirmed parameters: none shown on the reviewed page
- Confirmed response notes:
  - JSON response
  - the visible sample includes fields such as `numAPIs`, `numEndpoints`, `numSpecs`, `unreachable`, `invalid`, `unofficial`, `fixes`, `fixedPct`, `datasets`, `stars`, `issues`, `thisWeek`, `numDrivers`, and `numProviders`

## Pagination
- No pagination parameters were documented on the reviewed official reference page for any of the seven confirmed routes.

## Error handling
- The reviewed docs sections only exposed `200 OK` response blocks in the rendered page portion inspected during this pass.
- I did not find a published error-schema section, rate-limit error table, or retry guidance on the reviewed official page.

## Rate limits
- No rate-limit policy, quota header, or throttle guidance was published on the reviewed official docs page.

## Response format notes
- The reference documents JSON responses throughout.
- List-style responses use either a `data` array or keyed objects containing cached directory metadata.
- The metrics endpoint returns a plain JSON object of counters and summary fields.

## Important usage notes
- Use `/providers.json` for the provider catalog, then narrow into `/{provider}.json` or `/{provider}/services.json` before fetching specific versioned records.
- Use `/list.json` when you want directory-wide browsing metadata without individually resolving every provider first.
- Use the `/specs/...` routes when you need a specific versioned API record rather than a directory listing.

## Blockers / limitations
- The reviewed Redoc page clearly exposed the route list, path parameters, and several response samples, but not every deeper response body was fully expanded in the browser session. I documented only the fields and semantics that were directly visible from the official page.

## Verification notes
This file was manually rebuilt from the official APIs.guru documentation page with browser inspection, replacing the earlier generated placeholder.
