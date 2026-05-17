# Telegraph

## Provider metadata
- Category: `Social`
- Provider slug: `telegraph`
- Official docs pages used:
  - `https://telegra.ph/api`
- Main API base URL: `https://api.telegra.ph`
- Auth model: account `access_token` for account/page-management methods
- Supported request methods: `GET`, `POST`
- Response format: JSON envelope with `ok`, `result`, and `error`
- Manually confirmed route count: `9`

## Authentication
- Telegraph does not use OAuth.
- Account-scoped methods require an `access_token` string obtained from `createAccount`.
- Read-only page/view lookups (`getPage`, `getViews`) do not require an access token unless you want edit-capability fields returned.

## Response envelope
- Every response is a JSON object.
- Success: `ok: true` and the payload is in `result`.
- Failure: `ok: false` and the failure code/message is in `error`.
- The docs give `SHORT_NAME_REQUIRED` as an example error string.

## Canonical endpoints

### Account methods
#### 1) Create account
- Method: `GET` or `POST`
- Path: `/createAccount`
- Purpose: create a Telegraph account and return an `Account` object plus `access_token`

Parameters:
- `short_name` - required, string, `1-32` chars
- `author_name` - optional, string, `0-128` chars
- `author_url` - optional, string, `0-512` chars

#### 2) Edit account info
- Method: `GET` or `POST`
- Path: `/editAccountInfo`
- Purpose: update account defaults

Parameters:
- `access_token` - required
- `short_name` - optional replacement name
- `author_name` - optional replacement default author name
- `author_url` - optional replacement default author URL

#### 3) Get account info
- Method: `GET` or `POST`
- Path: `/getAccountInfo`
- Purpose: return selected account fields

Parameters:
- `access_token` - required
- `fields` - optional array of field names; available values: `short_name`, `author_name`, `author_url`, `auth_url`, `page_count`

#### 4) Revoke access token
- Method: `GET` or `POST`
- Path: `/revokeAccessToken`
- Purpose: invalidate the current token and issue a new `access_token` and `auth_url`

Parameters:
- `access_token` - required

### Page methods
#### 5) Create page
- Method: `GET` or `POST`
- Path: `/createPage`
- Purpose: create a Telegraph page

Parameters:
- `access_token` - required
- `title` - required, string, `1-256` chars
- `author_name` - optional, string, `0-128` chars
- `author_url` - optional, string, `0-512` chars
- `content` - required array of `Node`, up to `64 KB`
- `return_content` - optional boolean, default `false`

#### 6) Edit page
- Method: `GET` or `POST`
- Path: `/editPage/{path}`
- Purpose: edit an existing page

Path parameters:
- `path` - page path slug

Parameters:
- `access_token` - required
- `title` - required
- `content` - required array of `Node`, up to `64 KB`
- `author_name` - optional
- `author_url` - optional
- `return_content` - optional boolean, default `false`

#### 7) Get page
- Method: `GET` or `POST`
- Path: `/getPage/{path}`
- Purpose: retrieve a Telegraph page

Path parameters:
- `path` - required page path in the format shown by the docs, e.g. `Title-12-31`

Parameters:
- `return_content` - optional boolean, default `false`

#### 8) Get page list
- Method: `GET` or `POST`
- Path: `/getPageList`
- Purpose: list pages owned by an account, newest first

Parameters:
- `access_token` - required
- `offset` - optional integer, default `0`
- `limit` - optional integer, `0-200`, default `50`

Pagination notes:
- This is the one officially documented paginated route on the page reviewed.
- The response is a `PageList` object with `total_count` and `pages[]`.

#### 9) Get page views
- Method: `GET` or `POST`
- Path: `/getViews/{path}`
- Purpose: retrieve total or time-scoped page views

Path parameters:
- `path` - required page path slug

Parameters:
- `year` - optional integer `2000-2100`, required if `month` is passed
- `month` - optional integer `1-12`, required if `day` is passed
- `day` - optional integer `1-31`, required if `hour` is passed
- `hour` - optional integer `0-24`

## Content format notes
- Telegraph page bodies are DOM-like JSON arrays of `Node` values.
- A `Node` can be plain text or a `NodeElement`.
- Documented `NodeElement.tag` values include `a`, `aside`, `b`, `blockquote`, `br`, `code`, `em`, `figcaption`, `figure`, `h3`, `h4`, `hr`, `i`, `iframe`, `img`, `li`, `ol`, `p`, `pre`, `s`, `strong`, `u`, `ul`, and `video`.
- Documented attributes are `href` and `src`.

## Rate limits and transport
- The docs require HTTPS.
- The docs page reviewed does not publish a numeric rate limit.

## fireROUTE normalization notes
- Preserve the response envelope; downstream adapters should not discard `ok`/`error` semantics.
- `path` is part of the route for `getPage`, `editPage`, and `getViews` even though the docs also discuss a `%path%` placeholder convention.
- The `content` payload is provider-specific structured rich text and should remain raw rather than flattened.
