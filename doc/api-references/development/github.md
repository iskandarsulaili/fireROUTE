# GitHub

## Provider metadata
- Category: `Development`
- Provider slug: `github`
- Docs used manually:
  - `https://docs.github.com/en/rest/about-the-rest-api/about-the-rest-api?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28`
  - `https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28`
- Confirmed REST API base URL: `https://api.github.com`
- Primary media type: JSON
- Recommended accept header from the docs: `Accept: application/vnd.github+json`
- Versioning note: GitHub's REST API is versioned and docs examples include `X-GitHub-Api-Version`.
- Manually confirmed routes in this pass: `5`

## Authentication
GitHub's authentication docs state that many REST endpoints either require authentication or return additional data when authenticated.

Confirmed auth details from the official docs:
- Send the token in the `Authorization` header using the Bearer scheme
- For most token types, the docs say the `Authorization` header may also use the `token` scheme
- JWTs must use `Authorization: Bearer`
- Supported token families called out by the docs include personal access tokens, GitHub App tokens, OAuth app tokens, and `GITHUB_TOKEN` in GitHub Actions
- Some endpoints still allow unauthenticated access for public data

Important failure notes from the auth and troubleshooting pages:
- Missing or insufficient auth can return `401`, `403`, or a privacy-preserving `404` for private resources
- Repeated invalid credentials can trigger a temporary `403`

## Common request/response conventions
- Root base URL: `https://api.github.com`
- JSON responses are standard
- Many list endpoints use page-based pagination with `page` and `per_page`
- Paginated responses use the HTTP `Link` header with `rel="prev"`, `rel="next"`, `rel="first"`, and `rel="last"`
- Some endpoints can return `204 No Content` instead of an empty array

## Manually confirmed endpoint set

### 1) Get the authenticated user
- Method: `GET`
- Path: `/user`
- Full URL: `https://api.github.com/user`
- Purpose: retrieve the current authenticated user profile
- Headers seen in docs/examples:
  - `Accept: application/vnd.github+json`
  - `Authorization` header using Bearer auth when authenticated
  - `X-GitHub-Api-Version: ...`
- Token note from the endpoint page:
  - classic PATs and OAuth tokens need `user` scope to include private profile fields
  - fine-grained token support is documented and requires no additional permission set for this endpoint
- Confirmed response status codes:
  - `200 OK`
  - `304 Not modified`
  - `401 Requires authentication`
  - `403 Forbidden`
- Response shape shown in docs includes fields such as:
  - `login`, `id`, `avatar_url`, `html_url`, `repos_url`, `type`, `name`, `company`, `blog`, `location`, `email`, `public_repos`, `followers`, `following`, `created_at`, `updated_at`

### 2) Get a repository
- Method: `GET`
- Path: `/repos/{owner}/{repo}`
- Full URL: `https://api.github.com/repos/{owner}/{repo}`
- Purpose: retrieve repository metadata
- Path parameters:
  - `owner` - required account owner name, case-insensitive
  - `repo` - required repository name without `.git`, case-insensitive
- Auth note:
  - public repositories can be fetched without authentication
  - fine-grained docs call for `Metadata` repository permission (`read`) when token-based access is used
- Confirmed response status codes:
  - `200 OK`
  - `301 Moved permanently`
  - `403 Forbidden`
  - `404 Resource not found`
- Usage note from the docs:
  - `security_and_analysis` visibility depends on repo admin or org owner/security-manager privileges

### 3) List repository issues
- Method: `GET`
- Path: `/repos/{owner}/{repo}/issues`
- Full URL: `https://api.github.com/repos/{owner}/{repo}/issues`
- Purpose: list issues in a repository
- Path parameters:
  - `owner` - required
  - `repo` - required
- Important query parameters confirmed in the endpoint docs:
  - `milestone`
  - `state` = `open|closed|all`
  - `assignee`
  - `type`
  - `creator`
  - `mentioned`
  - `labels` - comma-separated labels
  - `sort` = `created|updated|comments`
  - `direction` = `asc|desc`
  - `since` - ISO 8601 timestamp
  - `per_page` - max `100`, default `30`
  - `page` - default `1`
- Media type variants explicitly documented:
  - `application/vnd.github.raw+json`
  - `application/vnd.github.text+json`
  - `application/vnd.github.html+json`
  - `application/vnd.github.full+json`
- Confirmed response status codes:
  - `200 OK`
  - `301 Moved permanently`
  - `404 Resource not found`
  - `422 Validation failed, or the endpoint has been spammed`
- Important usage note:
  - issue endpoints can return pull requests too; the response includes a `pull_request` key when the item is actually a PR

### 4) Create an issue
- Method: `POST`
- Path: `/repos/{owner}/{repo}/issues`
- Full URL: `https://api.github.com/repos/{owner}/{repo}/issues`
- Purpose: create a new issue in a repository
- Required body field:
  - `title`
- Optional body fields confirmed in docs:
  - `body`
  - `assignee`
  - `milestone`
  - `labels`
  - `assignees`
  - `issue_field_values`
  - `type`
- Permission/use notes from the docs:
  - any user with pull access can create an issue
  - if issues are disabled, the API returns `410 Gone`
  - this endpoint triggers notifications and can hit secondary rate limiting if used too aggressively
- Confirmed response status codes:
  - `201 Created`
  - `400 Bad Request`
  - `403 Forbidden`
  - `404 Resource not found`
  - `410 Gone`
  - `422 Validation failed, or the endpoint has been spammed`
  - `503 Service unavailable`

### 5) Search repositories
- Method: `GET`
- Path: `/search/repositories`
- Full URL: `https://api.github.com/search/repositories`
- Purpose: search repositories with GitHub's search syntax
- Confirmed query parameters:
  - `q` - required query string with keywords and qualifiers
  - `sort` = `stars|forks|help-wanted-issues|updated`
  - `order` = `desc|asc`
  - `per_page` - max `100`, default `30`
  - `page` - default `1`
- Endpoint-specific notes from the docs:
  - returns up to `100` results per page
  - overall search is capped at `1,000` returned results per search
  - search scope is limited to up to `4,000` repositories that match filters
  - `incomplete_results` may be `true` when query execution times out
- Confirmed response status codes:
  - `200 OK`
  - `304 Not modified`
  - `422 Validation failed, or the endpoint has been spammed`
  - `503 Service unavailable`

## Pagination
From GitHub's official pagination guide:
- Paginated endpoints use the `Link` header instead of embedding next-page cursors in the JSON body
- `page` changes the current page number
- `per_page` changes page size, typically up to `100`
- Example links shown by the docs include `prev`, `next`, `last`, and `first`

## Rate limits
From GitHub's official rate-limit docs:
- Unauthenticated REST requests: `60 requests/hour`
- Authenticated user requests: `5,000 requests/hour`
- Requests made on behalf of a user by certain Enterprise Cloud-owned apps can reach `15,000 requests/hour`
- Search endpoints have a separate custom limit:
  - authenticated search: up to `30 requests/minute`
  - unauthenticated search: up to `10 requests/minute`
  - code search: `9 requests/minute` and requires authentication
- When rate-limited, GitHub can return `403` or `429`
- Retry guidance from the troubleshooting page:
  - respect `retry-after` if present
  - if `x-ratelimit-remaining: 0`, wait until `x-ratelimit-reset`
  - back off exponentially for secondary rate limits

## Error format and troubleshooting notes
Official troubleshooting guidance confirms:
- `404` may be returned for existing private resources when auth is missing or insufficient
- `422` appears for validation failures and certain search/auth scope problems
- `403`/`429` are used for primary or secondary rate limits
- clients should surface HTTP status and body details to users

## Important usage notes
- GitHub's issue resources overlap with pull requests; consumers must inspect `pull_request`
- Search queries longer than 256 characters (excluding operators/qualifiers) are rejected
- Search queries cannot use more than five `AND`/`OR`/`NOT` operators
- Repository and issue routes reuse the same `owner` and `repo` path variables consistently across the docs

## Verification notes
This file was manually rebuilt from official GitHub docs with browser inspection, replacing the earlier low-fidelity autogenerated summary.
