# Rebrandly

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `rebrandly`
- Docs used manually:
  - `https://developers.rebrandly.com/docs/get-started`
  - `https://developers.rebrandly.com/docs/authentication-overview`
  - `https://developers.rebrandly.com/docs/api-key-authentication`
  - `https://developers.rebrandly.com/docs/oauth-flow`
  - `https://developers.rebrandly.com/docs/getting-account-details`
  - `https://developers.rebrandly.com/docs/listing-your-domains-collection`
  - `https://developers.rebrandly.com/docs/counting-your-domains`
  - `https://developers.rebrandly.com/docs/create-a-new-link`
  - `https://developers.rebrandly.com/docs/update-a-link`
  - `https://developers.rebrandly.com/docs/get-link-details`
  - `https://developers.rebrandly.com/docs/list-links`
  - `https://developers.rebrandly.com/docs/delete-a-link`
  - `https://developers.rebrandly.com/docs/api-limits`
- Confirmed REST API base URL: `https://api.rebrandly.com/v1`
- Primary media type: JSON
- Authentication models surfaced in the official docs: API key and OAuth 2.0 access token
- Manually confirmed routes in this pass: `9`

## Authentication
From the official authentication pages:
- all requests to the Rebrandly API must be authenticated
- supported authentication methods:
  - API key
  - OAuth token
- API key placement options explicitly documented:
  - HTTP header `apikey: YOUR_API_KEY`
  - query parameter `apikey`
  - body parameter `apikey`
- the docs' examples primarily use the `apikey` request header
- for workspace-scoped operations, the docs say you can pass the workspace context as:
  - HTTP header `workspace: YOUR_WORKSPACE_ID`
  - query parameter `workspace[id]=YOUR_WORKSPACE_ID`
  - body property `workspace` containing a resource reference
- if no workspace is specified, the default workspace is used

### OAuth details explicitly documented
- authorization URL: `https://oauth.rebrandly.com/connect/authorize`
- the reviewed Rebrandly OAuth page documents the authorization URL explicitly, but in this browser pass it did not expose a separate token-endpoint URL string as clearly as the authorize URL; I therefore only documented the authorize endpoint and parameter contract directly visible on the official page
- supported flow described on the page: OAuth 2.0 code flow, with token mode also noted as supported
- documented authorization request parameters:
  - `client_id`
  - `redirect_uri`
  - `response_type=code`
  - `scope=rbapi offline_access` (URL-encoded as `rbapi%20offline_access`)

## Common request/response conventions
- Base URL: `https://api.rebrandly.com/v1`
- reviewed operations return JSON objects or arrays
- link-creation is exposed in both JSON-body `POST` form and query-parameter `GET` form
- many list endpoints use cursor-style collection parameters such as `last` rather than page numbers
- the docs recommend calling the account-details endpoint early in an integration so you can inspect current subscription features and limits

## Manually confirmed endpoint set

### 1) Get account details
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.rebrandly.com/v1/account`
- Purpose: retrieve the authenticated account profile and subscription limits
- Authentication confirmed in the official example:
  - `apikey` header
- Response fields explicitly shown in the official example:
  - `id`
  - `fullName`
  - `username`
  - `email`
  - `avatarUrl`
  - `createdAt`
  - `subscription.createdAt`
  - `subscription.limits.links.used`
  - `subscription.limits.links.max`
  - `subscription.limits.domains.used`
  - `subscription.limits.domains.max`
  - `subscription.limits.teammates.*`
  - `subscription.limits.tags.*`
  - `subscription.limits.scripts.*`
- Important usage note from the docs:
  - Rebrandly explicitly recommends using this endpoint first so clients can detect available features and limits for the API key or OAuth token

### 2) List branded domains
- Method: `GET`
- Path: `/domains`
- Full URL: `https://api.rebrandly.com/v1/domains`
- Purpose: list branded domains owned by or available to the account
- Query parameters confirmed on the official page:
  - `orderBy` - `createdAt`, `updatedAt`, or `fullName`
  - `orderDir` - `desc` or `asc`
  - `last` - cursor/id of the last fetched domain
  - `limit` - number of domains to load
  - `active` - filter by whether domains are active/usable
  - `type` - `user` or `service`
- Authentication confirmed in the official example:
  - `apikey` header
- Response fields explicitly shown in the official example:
  - `id`
  - `fullName`
  - `topLevelDomain`
  - `createdAt`
  - `updatedAt`
  - `type`
  - `active`
- Error note from the official page:
  - HTTP `403` / `403 - Invalid format` for invalid query parameter formats
- Important doc ambiguity to preserve:
  - the parameter table says `limit` has a maximum of `25`, but the official example request still uses `limit=100`

### 3) Count branded domains
- Method: `GET`
- Path: `/domains/count`
- Full URL: `https://api.rebrandly.com/v1/domains/count`
- Purpose: return the number of domains matching the provided filters
- Query parameters confirmed on the official page:
  - `active`
  - `type` - `user` or `service`
- Authentication confirmed in the official example:
  - `apikey` header
- Response format explicitly shown in the official example:
  - JSON object with `count`
- Error note from the official page:
  - HTTP `403` / `403 - Invalid format` for invalid query parameter formats

### 4) Create a new branded link with JSON body
- Method: `POST`
- Path: `/links`
- Full URL: `https://api.rebrandly.com/v1/links`
- Purpose: create a new branded short link
- Authentication confirmed in the official example:
  - `apikey` header
  - `Content-Type: application/json`
- Request body properties confirmed on the official page:
  - `destination` - required, valid URL, max `2048` chars
  - `slashtag` - optional, allowed chars `A-Z a-z 0-9 _ -`, length `1` to `40`
  - `title` - optional, UTF-8, length `3` to `255`
  - `domain` - optional domain reference object
  - `description` - optional note, only when the plan includes link notes
- Response fields explicitly shown in the official example:
  - `id`
  - `title`
  - `slashtag`
  - `destination`
  - `createdAt`
  - `updatedAt`
  - `shortUrl`
  - `domain.id`
  - `domain.ref`
- Important usage notes from the official page:
  - if `slashtag` is omitted, Rebrandly auto-generates one
  - the docs say generated slashtags are at least `3` characters and generally no longer than `8`
  - profanity-like slashtags are automatically excluded from the auto-generation pool
  - `description` should only be sent when the current plan supports link notes

### 5) Create a new branded link with query parameters
- Method: `GET`
- Path: `/links/new`
- Full URL: `https://api.rebrandly.com/v1/links/new`
- Purpose: alternate query-parameter-based link creation flow
- Query parameters confirmed in the official example:
  - `apikey`
  - `destination`
  - `slashtag`
  - `domain[id]`
- Important usage note from the official page:
  - the docs describe this as an alternative to the JSON `POST /links` flow for the same creation operation

### 6) Update a branded link
- Method: `POST`
- Path: `/links/{id}`
- Full URL pattern: `https://api.rebrandly.com/v1/links/{id}`
- Purpose: update an existing branded short link
- Path parameters:
  - `id` - unique identifier of the link to update
- Authentication confirmed in the official example:
  - `apikey` header
  - optional `workspace` header for non-default workspaces
- Request body properties confirmed on the official page:
  - `destination` - required, valid URL, max `2048` chars
  - `title` - required, UTF-8, min `2`, max `300`
  - `favourite` - required boolean
  - `description` - optional, plan-dependent link note
- Response fields explicitly shown in the official example:
  - `id`
  - `title`
  - `slashtag`
  - `destination`
  - `createdAt`
  - `updatedAt`
  - `shortUrl`
  - `domain.id`
  - `domain.ref`
  - `domain.fullName`
- Error notes explicitly documented on the page:
  - `403 - Already exists` when the pair of domain and slashtag already exists
  - `403 - Invalid format` for invalid link-object data; details are in the `message` field
  - `404 - Not found` when the given `id` does not correspond to a link

### 7) Get branded link details
- Method: `GET`
- Path: `/links/{id}`
- Full URL pattern: `https://api.rebrandly.com/v1/links/{id}`
- Purpose: retrieve a single branded short link
- Path parameters:
  - `id` - unique identifier of the link
- Authentication confirmed in the official example:
  - `apikey` header
  - optional `workspace` header for non-default workspaces
- Response fields explicitly shown in the official example:
  - `id`
  - `title`
  - `slashtag`
  - `destination`
  - `createdAt`
  - `updatedAt`
  - `shortUrl`
  - `domain.id`
  - `domain.ref`
  - `domain.fullName`
  - `status`
- Important usage notes from the official page:
  - if you do not know a link ID, the docs recommend using the link-listing endpoint filtered by both `domain.fullName` (or `domain.id`) and `slashtag`
  - the docs explicitly say filtering by `slashtag` alone is not allowed; it only works when combined with `domain.id` or `domain.fullName`
- Error notes explicitly documented on the page:
  - `404 - Not found` when the given `id` does not correspond to an existing link

### 8) List branded links
- Method: `GET`
- Path: `/links`
- Full URL: `https://api.rebrandly.com/v1/links`
- Purpose: list links, optionally filtered and sorted
- Query parameters confirmed on the official page:
  - `orderBy`
  - `orderDir`
  - `last`
  - `limit`
  - `favourite`
  - `domain.id`
  - `domain.fullName`
  - `creator.id`
  - `slashtag` - only valid together with `domain.id` or `domain.fullName`
  - `dateFrom` - `YYYY-MM-DD`
  - `dateTo` - `YYYY-MM-DD`
- Authentication confirmed in the official example:
  - `apikey` header
- Response shape explicitly shown in the official example:
  - JSON array of link objects
- Response fields explicitly shown in sample items:
  - `id`
  - `title`
  - `slashtag`
  - `destination`
  - `createdAt`
  - `updatedAt`
  - `shortUrl`
  - `favourite`
  - `domain.id`
  - `domain.ref`
  - `domain.fullName`
- Important usage note from the official page:
  - the docs explicitly send readers to separate pagination and sorting documentation for deeper behavior
- Important doc ambiguity to preserve:
  - the parameter table says `limit` is capped at `25`, but the official example request still shows `limit=100`

### 9) Delete a branded link
- Method: `DELETE`
- Path: `/links/{id}`
- Full URL pattern: `https://api.rebrandly.com/v1/links/{id}`
- Purpose: permanently delete a branded link so it stops redirecting
- Path parameters:
  - `id` - unique identifier of the link to delete
- Authentication confirmed in the official example:
  - `apikey` header
- Response behavior explicitly documented on the page:
  - when deletion succeeds, the last representation of the deleted link is returned
- Response fields shown in the example:
  - `id`
  - `title`
  - `slashtag`
  - `destination`
  - `createdAt`
  - `updatedAt`
  - `shortUrl`
  - `domain.id`
  - `domain.ref`
  - `favourite`
- Additional usage note from the official page:
  - the page mentions a separate bulk-delete `DELETE /v1/links` operation in API Explorer for deleting up to `25` links at once, but this reviewed page does not document that bulk route in detail
- Error notes explicitly documented on the page:
  - `404 - Not found` when the given `id` does not correspond to an existing link

## Pagination
From the reviewed collection pages:
- reviewed list endpoints use collection-style query controls such as `last`, `limit`, `orderBy`, and `orderDir`
- no page-number parameter was documented on the reviewed `/domains` and `/links` pages
- the docs repeatedly point to separate pagination/sorting guide pages for full collection behavior
- the route pages themselves inconsistently document the maximum allowed `limit`: tables say `25`, while some example requests still use `100`

## Rate limits / usage limits
From the official `API limits` page:
- plan determines both request/rate allowances and how many records/resources you can create
- the docs do not publish a single numeric global rate limit on the reviewed page
- subscription details and current usage can be checked in the dashboard or programmatically through the account-info endpoint
- resource counters are documented as updating in real time
- deleted domains, tags, and scripts do not count against limits
- pending teammates do count toward teammate limits

## Error and response notes
Across the reviewed official pages:
- `403 - Invalid format` is used for invalid query/body formats on multiple routes
- `403 - Already exists` is used for conflicting link/domain/slashtag combinations during update/create-style flows
- `404 - Not found` is used when a requested link ID does not exist
- list responses can be plain JSON arrays (for `/links`) while count endpoints return small JSON objects such as `{ "count": 42 }`
- deleted-link responses return the final link representation rather than an empty body

## Important usage notes
- workspace context matters: if you interact with non-default workspaces, include the `workspace` header or equivalent query/body form
- Rebrandly's docs explicitly recommend API keys for scripts that act on your own account, and OAuth for apps acting on behalf of other Rebrandly users
- link-note support (`description`) is plan-dependent and should be feature-checked before use
- when resolving a link without its ID, combine `slashtag` with `domain.id` or `domain.fullName`; the docs explicitly reject `slashtag`-only filtering

## Verification notes
This file was manually rebuilt from Rebrandly's official developer documentation using browser inspection.