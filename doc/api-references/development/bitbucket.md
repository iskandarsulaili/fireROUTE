# Bitbucket

## Provider metadata
- Category: `Development`
- Provider slug: `bitbucket`
- Docs used manually:
  - `https://developer.atlassian.com/cloud/bitbucket/rest/intro/`
  - `https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/`
  - `https://support.atlassian.com/bitbucket-cloud/docs/api-request-limits/`
  - `https://support.atlassian.com/bitbucket-cloud/kb/bitbucket-cloud-rate-limit-troubleshooting/`
- Confirmed REST API base URL: `https://api.bitbucket.org/2.0`
- Primary media type: JSON
- Manually confirmed routes in this pass: `5`

## Authentication
Bitbucket Cloud's official REST auth guide documents several supported authentication models:
- OAuth 2.0 bearer tokens sent as `Authorization: Bearer {access_token}`
- repository, project, and workspace access tokens
- API tokens authenticated with HTTP Basic auth using the Atlassian account email as the username and the API token as the password
- app passwords are still described by Atlassian, but API tokens are presented as the long-term replacement

Important auth notes from the official docs:
- access tokens are scoped to a single repository, project, or workspace rather than a user account
- OAuth 2.0 tokens are obtained from `https://bitbucket.org/site/oauth2/access_token`
- the docs explicitly show `client_credentials` flow support for OAuth consumers
- cloning over HTTPS with an access token uses the literal username `x-token-auth`

## Common request/response conventions
- Base URL: `https://api.bitbucket.org/2.0`
- Standard response format is JSON
- Many collection endpoints support filtering (`q`) and sorting (`sort`)
- Official examples send `Accept: application/json`
- Object collections are returned in a pagination wrapper with fields such as:
  - `size`
  - `page`
  - `pagelen`
  - `next`
  - `previous`
  - `values`

## Manually confirmed endpoint set

### 1) List repositories in a workspace
- Method: `GET`
- Path: `/repositories/{workspace}`
- Full URL: `https://api.bitbucket.org/2.0/repositories/{workspace}`
- Purpose: return a paginated list of repositories owned by a workspace
- Path parameters:
  - `workspace` - required workspace ID or UUID
- Confirmed query parameters:
  - `role` - narrows results based on the authenticated user's role
  - `q` - filter expression
  - `sort` - sort expression
- Required scopes from the docs:
  - OAuth 2.0 / Connect: `repository`
  - Forge app and API token: `read:repository:bitbucket`
- Confirmed response codes:
  - `200 OK`
  - `404 Not Found`
  - `410 Gone`
- Response notes:
  - returns a paginated repositories object under `values`
  - sample repository fields include `uuid`, `full_name`, `is_private`, `scm`, `name`, `description`, `language`, `project`, and `mainbranch`

### 2) Get a repository
- Method: `GET`
- Path: `/repositories/{workspace}/{repo_slug}`
- Full URL: `https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}`
- Purpose: return a single repository object
- Path parameters:
  - `workspace` - required
  - `repo_slug` - required repository slug
- Required scopes from the docs:
  - OAuth 2.0 / Connect: `repository`
  - Forge app and API token: `read:repository:bitbucket`
- Confirmed response codes:
  - `200 OK`
  - `403 Forbidden`
  - `404 Not Found`
- Response notes:
  - sample payload includes `links.self`, `links.html`, `links.clone`, `links.pullrequests`, `links.commits`, `links.forks`, `links.watchers`, and `links.hooks`

### 3) Create a repository
- Method: `POST`
- Path: `/repositories/{workspace}/{repo_slug}`
- Full URL: `https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}`
- Purpose: create a new repository in a workspace
- Path parameters:
  - `workspace` - required
  - `repo_slug` - required target slug for the new repository
- Important request body fields confirmed by the docs/examples:
  - `scm` - examples use `git`
  - `project.key` - may be a project key or project UUID
  - optional repository object fields shown by the schema include `is_private`, `name`, `description`, `fork_policy`, `has_issues`, `has_wiki`, `project`, and `mainbranch`
- Required scopes from the docs:
  - OAuth 2.0 / Connect: `repository:admin`
  - Forge app and API token: `admin:repository:bitbucket`
- Confirmed response codes:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
- Important usage notes:
  - if `project` is omitted, Bitbucket assigns the repository to the oldest project in the workspace
  - the docs explicitly note that workspace IDs and repository names can be replaced by UUIDs

### 4) List repository forks
- Method: `GET`
- Path: `/repositories/{workspace}/{repo_slug}/forks`
- Full URL: `https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}/forks`
- Purpose: return a paginated list of a repository's forks
- Path parameters:
  - `workspace` - required
  - `repo_slug` - required
- Required scopes from the docs:
  - OAuth 2.0 / Connect: `repository`
  - Forge app and API token: `read:repository:bitbucket`
- Confirmed response codes:
  - `200 OK`
  - `403 Forbidden`
  - `404 Not Found`
- Response notes:
  - response type is the same paginated repository collection used by repository-listing endpoints

### 5) List webhooks for a repository
- Method: `GET`
- Path: `/repositories/{workspace}/{repo_slug}/hooks`
- Full URL: `https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}/hooks`
- Purpose: return a paginated list of webhooks configured on a repository
- Path parameters:
  - `workspace` - required
  - `repo_slug` - required
- Required scopes from the docs:
  - OAuth 2.0 / Connect: `webhook`
  - API token: `read:webhook:bitbucket`
- Confirmed response codes:
  - `200 OK`
  - `403 Forbidden`
  - `404 Not Found`
- Response notes:
  - the route returns webhook definitions for the repository and uses Bitbucket pagination conventions

## Pagination
From Bitbucket's official pagination guide:
- paginated responses are wrapped in an object instead of returning a bare array
- common wrapper fields are `size`, `page`, `pagelen`, `next`, `previous`, and `values`
- `pagelen` is the current page size; globally documented min/max are `10` and `100`
- clients should follow the opaque `next` URL returned by the API rather than constructing pagination URLs manually
- some collections omit `size`, `page`, or `previous`
- lack of a `next` link means the end of the collection has been reached

## Rate limits
From Atlassian's official Bitbucket Cloud rate-limit docs:
- anonymous API requests: `60 requests/hour`
- authenticated access to repository data under `/2.0/repositories/*`: `1,000 - 10,000 requests/hour` depending on scaled limits
- webhook data operations: `1,000 requests/hour`
- raw file requests: `5,000 requests/hour`
- archive downloads: `1,500 files/hour`
- invitations: `100 requests/minute`
- rate limits are measured in a rolling one-hour window

Official troubleshooting notes also confirm:
- unauthenticated requests are measured against IP address
- authenticated requests are measured against the user ID or token identity
- responses can include `X-RateLimit-Limit`
- `X-RateLimit-NearLimit: true` can appear when remaining allowance drops below 20%
- rate-limit violations return `429 Too Many Requests`

## Error format and troubleshooting notes
Bitbucket's schemas/serialization docs show JSON error bodies such as:
- top-level `type: "error"`
- nested `error.message`
- optional `error.fields` for validation problems
- optional `error.detail`, `error.id`, and endpoint-specific `error.data`

The official support article also notes that API throttling failures can return:
- `429` with messages such as `Rate limit for this resource has been exceeded.`

## Important usage notes
- Bitbucket's REST docs consistently separate OAuth/Connect scopes from Forge/API-token scopes; clients should not assume the same scope names across auth modes
- Repository, project, and workspace access tokens each carry independent rate-limit budgets according to Atlassian support guidance
- The docs recommend using pagination with larger `pagelen` values where supported to reduce request volume
- For HTTPS git cloning with an access token, the username must literally be `x-token-auth`

## Verification notes
This file was manually rebuilt from official Atlassian Bitbucket Cloud docs and support pages, replacing the empty autogenerated stub.
