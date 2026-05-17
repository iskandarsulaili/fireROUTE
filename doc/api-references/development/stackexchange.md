# StackExchange

## Provider metadata
- Category: `Development`
- Provider slug: `stackexchange`
- Docs used manually:
  - `https://api.stackexchange.com/docs`
  - `https://api.stackexchange.com/docs/authentication`
  - `https://api.stackexchange.com/docs/throttle`
  - `https://api.stackexchange.com/docs/paging`
  - `https://api.stackexchange.com/docs/wrapper`
  - `https://api.stackexchange.com/docs/error-handling`
  - `https://api.stackexchange.com/docs/info`
  - `https://api.stackexchange.com/docs/questions`
  - `https://api.stackexchange.com/docs/questions-by-ids`
  - `https://api.stackexchange.com/docs/users-by-ids`
  - `https://api.stackexchange.com/docs/advanced-search`
  - `https://api.stackexchange.com/docs/errors`
- Confirmed REST API base URL pattern: `https://api.stackexchange.com/2.3`
- Primary media types called out in the docs: `JSON`, optional `JSONP`
- Manually confirmed routes in this pass: `6`

## Authentication
Stack Exchange documents two auth concepts:
- an application `key` used to identify the app and raise quota
- OAuth 2.0 access tokens for user-scoped methods

Confirmed auth notes from the official docs:
- applications must be registered on Stack Apps to obtain a request key and enable OAuth
- the authentication page says requests can pass the application's API key or access token in `Authorization: Bearer API_KEY_OR_ACCESS_TOKEN`
- the rest of the documentation and error/throttle pages still explicitly reference `key` and `access_token` semantics
- write and private-data methods require user authentication and appropriate scopes
- `/me` routes are authenticated aliases of the corresponding `/users/{ids}` methods

Important auth-related errors explicitly documented:
- `access_token_required` (`401`)
- `invalid_access_token` (`402`)
- `access_denied` (`403`)
- `key_required` (`405`)
- `access_token_compromised` (`406`)

## Common request/response conventions
- Per-site routes require a `site` parameter
- `site` may be a full domain such as `stackoverflow.com` or the site's `api_site_parameter`
- Dates use Unix epoch time
- Unless otherwise noted:
  - maximum `pagesize` is `100`
  - `{ids}` collections are capped at `100` items
  - page indexes start at `1`
- Anonymous access is capped at page `25`
- Responses are wrapped in a common wrapper object
- The docs say all API responses are compressed
- JSONP is supported via the `callback` query parameter

## Common wrapper and response format
The wrapper docs confirm these common fields:
- `items`
- `has_more`
- `quota_max`
- `quota_remaining`
- `page`
- `page_size`
- `type`
- optional `backoff`
- optional `total`
- optional error fields: `error_id`, `error_name`, `error_message`

Important wrapper notes from the docs:
- `backoff` means clients must wait that many seconds before calling the same method again
- `/me` routes are throttled the same way as their `/users/{ids}` equivalents
- `total` is available but not returned by default; clients must request it via a custom filter

## Manually confirmed endpoint set

### 1) Get site info
- Method: `GET`
- Path: `/info`
- Full URL pattern: `https://api.stackexchange.com/2.3/info?site={site}`
- Purpose: return site-level statistics and metadata
- Required query parameter:
  - `site`
- Usage notes from the docs:
  - returns an `info` object
  - data is cached very aggressively
  - clients should query sparingly, ideally no more than once an hour

### 2) List questions on a site
- Method: `GET`
- Path: `/questions`
- Full URL pattern: `https://api.stackexchange.com/2.3/questions`
- Required query parameter:
  - `site`
- Confirmed query parameters shown in the docs:
  - `page`
  - `pagesize`
  - `fromdate`
  - `todate`
  - `order` = `desc|asc`
  - `min`
  - `max`
  - `sort` = `activity|votes|creation|hot|week|month`
  - `tagged` - semicolon-delimited tags
- Important method notes:
  - `activity` is the default sort
  - `tagged` is an AND constraint
  - passing more than 5 tags always returns zero results
  - `hot`, `week`, and `month` do not accept `min` or `max`
- Response type: list of `questions`

### 3) Get questions by id
- Method: `GET`
- Path: `/questions/{ids}`
- Full URL pattern: `https://api.stackexchange.com/2.3/questions/{ids}`
- Path parameter:
  - `ids` - one or more question ids, capped at 100 ids total by the global docs
- Required query parameter:
  - `site`
- Confirmed query parameters shown in the docs:
  - `page`
  - `pagesize`
  - `fromdate`
  - `todate`
  - `order` = `desc|asc`
  - `min`
  - `max`
  - `sort` = `activity|votes|creation`
- Notes:
  - returns `question` objects
  - docs call out the common complex-query pattern using `sort`, `min`, `max`, `fromdate`, and `todate`

### 4) Get users by id
- Method: `GET`
- Path: `/users/{ids}`
- Full URL pattern: `https://api.stackexchange.com/2.3/users/{ids}`
- Path parameter:
  - `ids` - one or more user ids
- Required query parameter:
  - `site`
- Confirmed query parameters shown in the docs:
  - `page`
  - `pagesize`
  - `fromdate`
  - `todate`
  - `order` = `desc|asc`
  - `min`
  - `max`
  - `sort` = `reputation|creation|name|modified`
- Notes from the route page:
  - returns `user` objects and may contain `shallow_user` references
  - docs compare this route to `/questions` to explain the richer user shape
  - `/me` is the authenticated alias for the same route family

### 5) Advanced search
- Method: `GET`
- Path: `/search/advanced`
- Full URL pattern: `https://api.stackexchange.com/2.3/search/advanced`
- Required query parameter:
  - `site`
- Confirmed search/filter parameters:
  - `page`
  - `pagesize`
  - `fromdate`
  - `todate`
  - `order`
  - `min`
  - `max`
  - `sort` = `activity|votes|creation|relevance`
  - `q`
  - `accepted`
  - `answers`
  - `body`
  - `closed`
  - `migrated`
  - `notice`
  - `nottagged`
  - `tagged`
  - `title`
  - `user`
  - `url`
  - `views`
  - `wiki`
- Important method notes:
  - `nottagged` requires at least one additional parameter for performance reasons
  - `relevance` does not accept `min` or `max`
  - returns a list of `questions`

### 6) Enumerate API errors
- Method: `GET`
- Path: `/errors`
- Full URL pattern: `https://api.stackexchange.com/2.3/errors`
- Confirmed query parameters shown on the docs page:
  - `page`
  - `pagesize`
- Purpose: return the list of possible API errors
- Related route from the error-handling page:
  - `/errors/{id}` simulates a specific error for testing

## Pagination
From the official paging guide:
- nearly all methods accept `page` and `pagesize`
- `page` defaults to `1`
- `pagesize` defaults to `30`
- `pagesize` may be between `0` and `100`
- `has_more` tells the client whether another page is available
- `total` is optional and can be expensive to compute
- docs recommend using `has_more` instead of paying for `total` when fetching all results

## Rate limits and throttling
From the official throttling page:
- per-IP concurrent throttle: if a single IP exceeds `30 requests/second`, requests may be dropped and the ban can last roughly `30 seconds` to a few minutes
- daily quota without an access token is IP-based and keyed by app `key`; default daily limit is `10,000`
- with an access token, quota is per user/app pair; default size is `10,000`
- a user can have up to `5` distinct quotas at one time
- methods may return `backoff`; clients must wait that many seconds before calling the same method again
- semantically identical requests more than once per minute are considered abusive because the API is heavily cached

## Error handling
The official error guide says:
- method-call errors are conveyed in wrapper fields `error_id`, `error_name`, and `error_message`
- HTTP status is normally `400 Bad Request` for API errors unless the call was made via JSONP, in which case the transport may still be `200`
- documented error names and ids include:
  - `bad_parameter` (`400`)
  - `access_token_required` (`401`)
  - `invalid_access_token` (`402`)
  - `access_denied` (`403`)
  - `no_method` (`404`)
  - `key_required` (`405`)
  - `access_token_compromised` (`406`)
  - `write_failed` (`407`)
  - `duplicate_request` (`409`)
  - `internal_error` (`500`)
  - `throttle_violation` (`502`)
  - `temporarily_unavailable` (`503`)

## Important usage notes
- `site` is fundamental for per-site routes; do not omit it on normal content queries
- anonymous clients can only page through the first 25 pages
- filters are essential when clients need non-default fields like `total` or richer object properties
- rate-limit `backoff` is method-specific and can appear even on seemingly trivial requests
- the docs expose both category and type indexes; fireROUTE integrations should treat endpoint coverage as broad rather than limited to the six routes documented here

## Verification notes
This file was manually rebuilt from official Stack Exchange documentation pages with browser inspection, replacing the earlier low-fidelity generated summary.
