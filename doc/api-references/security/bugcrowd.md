# Bugcrowd

## Provider metadata
- Category: `Security`
- Provider slug: `bugcrowd`
- Docs used manually:
  - `https://docs.bugcrowd.com/api/getting-started/`
  - `https://docs.bugcrowd.com/api/headers/`
  - `https://docs.bugcrowd.com/api/versioning/`
  - `https://docs.bugcrowd.com/api/1.1.0/`
  - official downloadable OpenAPI link exposed on the reference page: `https://bugcrowd.com/openapi/1.1.0/openapi.yml`
- Confirmed API base URL: `https://api.bugcrowd.com`
- Primary media type confirmed in this pass: vendor JSON / JSON:API-style payloads
- Authentication model confirmed in this pass: token-based `Authorization` header
- Manually confirmed routes in this pass: `5`

## Authentication
From the official getting-started and headers pages:
- access tokens are provisioned on a per-user basis
- authorization is based on the user's role
- multiple access tokens can be provisioned per user
- tokens can be revoked by deleting that token
- the docs show requests using:
  - `Accept: application/vnd.bugcrowd+json`
  - `Authorization: Token <token-id>:<token-secret>`
- the reference UI labels the security scheme as `tokenAuth`

## Common request/response conventions
- Base URL confirmed from the official cURL example: `https://api.bugcrowd.com`
- The official reference says this is Bugcrowd's primary REST API and that it follows the `JSON API specification`.
- The headers page says the `Accept` header is required and should be:
  - `application/vnd.bugcrowd+json`
- The versioning page says request parameters, headers, response schema, and error messages remain consistent within a single API version.
- The versioning docs also say the older `Bugcrowd-Version` header is no longer needed and can be removed.
- The reviewed route pages show vendor response media types such as `application/vnd.bugcrowd.v4+json`.

## Manually confirmed endpoint set

### 1) List programs available to the current user
- Method: `GET`
- Path: `/programs`
- Full URL: `https://api.bugcrowd.com/programs`
- Purpose: return programs belonging to the authenticated user.
- Auth: `tokenAuth`
- Query parameters directly confirmed on the official route page:
  - `fields[organization]`
  - `fields[program]`
  - `fields[submission]`
  - `fields[engagement]`
  - `page[limit]` - integer, default `25`, documented range `0..100`
  - `page[offset]` - integer, default `0`
- Response notes confirmed from the official route page:
  - success response uses vendor JSON media type
  - pagination uses `links` and `meta`

### 2) Fetch one program by UUID
- Method: `GET`
- Path: `/programs/{id}`
- Full URL pattern: `https://api.bugcrowd.com/programs/{id}`
- Purpose: return a single program resource.
- Auth: `tokenAuth`
- Path parameters:
  - `id` - required UUID
- Query parameters directly confirmed on the official route page:
  - `fields[organization]`
  - `fields[program]`
  - `fields[submission]`
  - `fields[engagement]`
  - `include`
- Response notes:
  - returns a JSON:API-style resource document
  - the route page documents standard success and client-error response sections

### 3) List submissions
- Method: `GET`
- Path: `/submissions`
- Full URL: `https://api.bugcrowd.com/submissions`
- Purpose: return a filtered list of submissions based on tokenized search and sort parameters.
- Auth: `tokenAuth`
- Query parameters directly confirmed on the official route page include:
  - field selectors such as `fields[activity]`, `fields[blocker]`, `fields[researcher_request_response]`, `fields[claim_ticket]`, `fields[comment]`, `fields[cvss_vector]`, `fields[engagement]`
  - pagination controls `page[limit]` and `page[offset]`
  - the route page explicitly describes tokenized search and sort behavior even though the visible parameter table is large and cross-resource
- Response notes:
  - JSON:API-style `data`, `included`, `links`, and `meta` sections are used on reviewed collection routes

### 4) Fetch a single submission by UUID
- Method: `GET`
- Path: `/submissions/{id}`
- Full URL pattern: `https://api.bugcrowd.com/submissions/{id}`
- Purpose: return one submission resource.
- Auth: `tokenAuth`
- Path parameters:
  - `id` - required UUID
- Query parameters directly confirmed on the official route page include:
  - cross-resource `fields[...]` selectors
  - `include`
- Response notes:
  - the route page documents a resource document for the submission and related includes

### 5) List comments for a submission
- Method: `GET`
- Path: `/submissions/{id}/comments`
- Full URL pattern: `https://api.bugcrowd.com/submissions/{id}/comments`
- Purpose: return comments associated with a submission.
- Auth: `tokenAuth`
- Path parameters:
  - `id` - required UUID of the parent resource
- Query parameters directly confirmed on the official route page:
  - `include` - enum values shown include `author` and `file_attachments`
  - `fields[submission_comment]`
  - `fields[identity]`
  - `fields[file_attachment]`
  - `page[limit]` - default `25`, documented range `0..100`
  - `page[offset]` - default `0`
  - `filter[visibility_scope]`
- Response notes confirmed on the official page:
  - `200` success response media type: `application/vnd.bugcrowd.v4+json`
  - documented top-level keys include `data`, `included`, `links`, and `meta`
  - documented error sections include `400` for unsupported request parameters and `404` for missing resources

## Pagination
- The reviewed Bugcrowd route pages document offset pagination via:
  - `page[limit]`
  - `page[offset]`
- The default values shown on reviewed collection routes are `25` and `0` respectively.
- The reviewed collection responses include JSON:API-style `links` and `meta` sections.

## Rate limits
- The official getting-started page says: `Bugcrowd limits API requests to 60 requests per minute per IP Address.`
- The versioning page also states that rate limits will remain consistent or improve within a version and will not be reduced for that version.

## Error handling
- The reviewed route pages explicitly document at least these error categories on sampled endpoints:
  - `400` unsupported request parameters
  - `404` missing resource
- The versioning page says error messages remain consistent for a given version.
- The official docs reviewed in this pass are clearer about route-local error sections than about one single global error schema.

## Response format notes
- Bugcrowd explicitly says the API follows the JSON:API specification.
- The route pages reviewed in this pass use vendor media types such as `application/vnd.bugcrowd.v4+json`.
- Resource and collection responses expose JSON:API-style shapes including combinations of:
  - `data`
  - `included`
  - `links`
  - `meta`

## Important usage notes
- The `Accept` header is required even before considering auth.
- Tokens are scoped per user and effectively inherit role-based access to resources.
- Only IPv4 addresses are supported according to the official getting-started page's token-versioning notes.
- Bugcrowd's docs expose a much larger resource inventory than the five routes documented here; this file intentionally records only the routes manually inspected in detail in this pass.

## Verification notes
This file was manually rebuilt from Bugcrowd's official getting-started, headers, versioning, and v1.1.0 reference pages, plus the official downloadable OpenAPI link exposed by the reference UI.