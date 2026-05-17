# Docker Hub

## Provider metadata
- Category: `Development`
- Provider slug: `docker-hub`
- Docs used manually:
  - `https://docs.docker.com/reference/api/hub/latest/`
  - official OpenAPI document linked from that page: `https://docs.docker.com/reference/api/hub/latest.yaml`
- Confirmed API base URL: `https://hub.docker.com`
- Primary response format: JSON
- Authentication style: short-lived Bearer access tokens for most authenticated endpoints
- Manually confirmed routes in this pass: `9`

## Authentication
The official Docker Hub OpenAPI document exposes two current token flows relevant to the public API surface reviewed here:

1. **Create a short-lived access token**
   - Method: `POST`
   - Path: `/v2/auth/token`
   - Full URL: `https://hub.docker.com/v2/auth/token`
   - Auth on this route: none (`security: []` in the official spec)
   - Request body fields confirmed in the spec:
     - `identifier` - required account identifier
       - username when authenticating with password or personal access token
       - organization name when authenticating with an organization access token
     - `secret` - required credential value
       - password, personal access token, or organization access token depending on the flow
   - Response: JWT access token payload (`200`)
   - Important note from the docs:
     - if the organization has SSO enforced, callers must use a **personal access token** instead of a password

2. **Manage personal access tokens after authenticating**
   - Collection path: `/v2/access-tokens`
   - Item path: `/v2/access-tokens/{uuid}`
   - These routes require `bearerAuth`

Deprecated note from the same official spec:
- `POST /v2/users/login` still exists and returns a bearer token, but the spec marks it `deprecated` and points callers to `POST /v2/auth/token`
- the deprecated login description also repeats the SSO/PAT requirement introduced on `2024-09-16`

## Common request/response conventions
- Root server in the official spec: `https://hub.docker.com`
- Authenticated calls use `Authorization: Bearer {TOKEN}`
- Paginated list endpoints commonly use:
  - `page`
  - `page_size`
- Paginated collection responses shown in the official examples include:
  - `count`
  - `next`
  - `previous`
  - `results`
- Error responses are defined in the spec as JSON schemas such as `Error` or `ValueError`

## Manually confirmed endpoint set

### 1) Create access token
- Method: `POST`
- Path: `/v2/auth/token`
- Purpose: exchange a username/org identifier plus a secret for a short-lived JWT bearer token
- Request body:
  - `identifier` - required string
  - `secret` - required string
- Confirmed responses:
  - `200` token created
  - `401` authentication failed
- Important note:
  - the token should be used as `Authorization: Bearer {access_token}` on later Docker API calls

### 2) List personal access tokens
- Method: `GET`
- Path: `/v2/access-tokens`
- Purpose: return a paginated list of the caller's PATs
- Auth: Bearer token required
- Query parameters confirmed in the spec:
  - `page` - number, default `1`
  - `page_size` - number, default `10`
- Confirmed responses:
  - `200`
  - `400`
  - `401`

### 3) Create personal access token
- Method: `POST`
- Path: `/v2/access-tokens`
- Purpose: create a new Docker Hub PAT
- Auth: Bearer token required
- Request body:
  - official schema is `createAccessTokenRequest`
  - the route returns `createAccessTokensResponse`
- Confirmed responses:
  - `201 Created`
  - `400 Bad Request`
  - `401 Unauthorized`

### 4) Get personal access token
- Method: `GET`
- Path: `/v2/access-tokens/{uuid}`
- Purpose: fetch a PAT by UUID
- Path parameter:
  - `uuid` - required token identifier
- Auth: Bearer token required
- Confirmed responses:
  - `200`
  - `401`
  - `404`
- Response note:
  - the response extends the access-token schema with a `token` field in the example schema shown by the spec

### 5) Update personal access token
- Method: `PATCH`
- Path: `/v2/access-tokens/{uuid}`
- Purpose: partially update a PAT
- Path parameter:
  - `uuid` - required token identifier
- Auth: Bearer token required
- Request body:
  - official schema `patchAccessTokenRequest`
- Important note from the spec:
  - this route is used to rename a token or enable/disable it
- Confirmed responses:
  - `200`
  - `400`
  - `401`

### 6) Delete personal access token
- Method: `DELETE`
- Path: `/v2/access-tokens/{uuid}`
- Purpose: permanently remove a PAT
- Path parameter:
  - `uuid` - required token identifier
- Auth: Bearer token required
- Confirmed responses:
  - `204 No Content`
  - `401`
  - `404`
- Important note:
  - the official description says deletion cannot be undone

### 7) List repositories in a namespace
- Method: `GET`
- Path: `/v2/namespaces/{namespace}/repositories`
- Purpose: list repositories for a user or organization namespace
- Auth:
  - Bearer auth supported
  - anonymous access is also explicitly allowed for public repositories (`- {}` in the official security block)
- Path parameter:
  - `namespace` - required namespace name
- Query parameters confirmed in the official spec:
  - `page` - integer, minimum `1`, default `1`
  - `page_size` - integer, min `1`, max `100`, default `10`
  - `name` - partial-name filter
  - `ordering` - one of:
    - `name`
    - `-name`
    - `last_updated`
    - `-last_updated`
    - `pull_count`
    - `-pull_count`
- Confirmed responses:
  - `200`
- Response shape shown in the official example:
  - `count`
  - `next`
  - `previous`
  - `results[]`
  - each result includes fields like `name`, `namespace`, `repository_type`, `status_description`, `description`, `is_private`, `star_count`, `pull_count`, and `last_updated`

### 8) Get repository in a namespace
- Method: `GET`
- Path: `/v2/namespaces/{namespace}/repositories/{repository}`
- Purpose: retrieve metadata for a single repository
- Auth:
  - Bearer auth supported
  - anonymous access explicitly allowed for public repositories
- Path parameters:
  - `namespace` - required
  - `repository` - required
- Confirmed responses:
  - `200`
  - `401`
  - `403`
  - `404`
  - `500`
- Response fields visible in the official example include:
  - `name`, `namespace`, `repository_type`, `description`, `is_private`, `star_count`, `pull_count`, `last_updated`, `date_registered`, `full_description`, `media_types`, `content_types`, `categories`, `immutable_tags_settings`, `storage_size`, `source`

### 9) List repository tags
- Method: `GET`
- Path: `/v2/namespaces/{namespace}/repositories/{repository}/tags`
- Purpose: list tags for a repository
- Auth: Bearer token required in the reviewed route definition
- Path parameters:
  - `namespace` - required
  - `repository` - required
- Query parameters confirmed:
  - `page` - integer, defaults to `1`
  - `page_size` - integer, defaults to `10`, max `100`
- Confirmed responses:
  - `200`
  - `403`
  - `404`
- Additional route note:
  - the same path also exposes `HEAD /v2/namespaces/{namespace}/repositories/{repository}/tags` to check whether tags exist

## Pagination
From the official Docker Hub spec pages and response examples reviewed here:
- Repository and PAT list routes use classic `page` / `page_size` pagination
- Repository list responses include:
  - `count`
  - `next`
  - `previous`
  - `results`
- Tag-list routes also accept `page` and `page_size`
- Maximum reviewed page size for repository listings is `100`

## Rate limits
The official OpenAPI document includes a dedicated rate-limiting section with these confirmed details:
- Docker Hub API traffic is limited **per minute**
- Successful responses expose:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- When the limit is exceeded, Docker Hub returns:
  - HTTP `429`
  - `Retry-After` header
- The docs explicitly say these API limits are separate from Docker Hub anti-abuse limits and image pull/download rate limits
- The reviewed official docs did **not** publish one universal numeric requests-per-minute value for every route

## Error format and response notes
Confirmed from the official OpenAPI components:
- `BadRequest` responses use a `ValueError` schema on some routes
- `Unauthorized`, `Forbidden`, and `NotFound` responses use an `Error` schema on some route families
- Other route groups also define lowercase variants (`error`, `bad_request`, `unauthorized`, etc.) for a similar JSON error envelope
- SCIM routes use `application/scim+json`, but those endpoints were outside the route families documented in detail for this pass

## Important usage notes
- `POST /v2/users/login` is still present but explicitly deprecated in favor of `POST /v2/auth/token`
- Organizations with SSO enforced must use a PAT rather than a password when creating access tokens
- Public repository metadata can be read anonymously on the repository listing/details routes reviewed above
- PAT management is distinct from the short-lived JWT access-token exchange route
- The official docs include more enterprise and SCIM routes than the subset documented here; this file covers the high-confidence route families manually inspected in this pass

## Verification notes
This file was manually rebuilt from Docker's official Hub API reference page and its linked official OpenAPI document, replacing the earlier low-fidelity generated extraction.
