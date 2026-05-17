# Ghost

## Provider metadata
- Category: `Development`
- Provider slug: `ghost`
- Docs used manually:
  - `https://docs.ghost.org/content-api`
  - `https://docs.ghost.org/content-api/parameters`
  - `https://docs.ghost.org/content-api/pagination`
  - `https://docs.ghost.org/content-api/errors`
  - `https://docs.ghost.org/admin-api`
- Confirmed REST API base URLs:
  - `https://{admin_domain}/ghost/api/content/`
  - `https://{admin_domain}/ghost/api/admin/`
- Primary media type: `application/json`
- Authentication models:
  - Content API: public content key in query parameter `key`
  - Admin API: JWT in `Authorization: Ghost {token}` or session cookie after login flow
- Manually confirmed routes in this pass: `29`

## Authentication
### Content API
From the official Content API overview:
- requests are made against `https://{admin_domain}/ghost/api/content/`
- the content key is passed as query parameter `?key={key}`
- the docs explicitly say these keys are safe for browser-side use because they only expose public data
- clients should also send `Accept-Version: v{major}.{minor}`

### Admin API token authentication
From the official Admin API overview:
- admin requests are made against `https://{admin_domain}/ghost/api/admin/`
- integrations and staff users receive an admin API key in `id:secret` format
- clients generate a short-lived JWT signed with `HS256`
- required JWT header/payload values explicitly documented:
  - header: `alg=HS256`, `kid={id}`, `typ=JWT`
  - payload: `aud=/admin/`, `iat={now}`, `exp={now+<=300s}`
- authenticated requests send `Authorization: Ghost {token}`
- the docs say token auth is for secure server-side environments only

### Admin API session authentication
Also from the official Admin API overview:
- user-authenticated browser/app flows can create a cookie session with username/password
- session-based requests must include `Origin` or `Referer` for CSRF protection
- 2FA / device verification can require a follow-up verification token step

## Common request and response conventions
- Both API families use versioned request negotiation through `Accept-Version: v{major}.{minor}`
- Ghost documents a consistent JSON envelope:
  ```json
  {
    "resource_type": [{ "...": "..." }],
    "meta": {}
  }
  ```
- For browse/list requests, `meta.pagination` carries paging metadata
- Content and Admin browse endpoints default to `15` records per page
- Common documented query controls:
  - `include`
  - `fields`
  - browse-only: `filter`, `limit`, `page`, `order`
  - posts/pages only: `formats`
- Query parameter values must be URL encoded when used directly

## Manually confirmed endpoint set

### Content API routes
All paths below are relative to `https://{admin_domain}/ghost/api/content/` and require `?key={key}`.

#### 1) Browse posts
- Method: `GET`
- Path: `/posts/`
- Query parameters documented for content browse endpoints:
  - `include`
  - `fields`
  - `filter`
  - `limit`
  - `page`
  - `order`
  - `formats` (posts/pages only)
- Notes:
  - `include=authors,tags` is explicitly documented
  - `formats=html,plaintext` is explicitly documented

#### 2) Read post by ID
- Method: `GET`
- Path: `/posts/{id}/`

#### 3) Read post by slug
- Method: `GET`
- Path: `/posts/slug/{slug}/`

#### 4) Browse authors
- Method: `GET`
- Path: `/authors/`
- Supported include documented: `count.posts`

#### 5) Read author by ID
- Method: `GET`
- Path: `/authors/{id}/`

#### 6) Read author by slug
- Method: `GET`
- Path: `/authors/slug/{slug}/`

#### 7) Browse tags
- Method: `GET`
- Path: `/tags/`
- Supported include documented: `count.posts`

#### 8) Read tag by ID
- Method: `GET`
- Path: `/tags/{id}/`

#### 9) Read tag by slug
- Method: `GET`
- Path: `/tags/slug/{slug}/`

#### 10) Browse pages
- Method: `GET`
- Path: `/pages/`
- Supports the same documented content browse controls as posts, including `formats`

#### 11) Read page by ID
- Method: `GET`
- Path: `/pages/{id}/`

#### 12) Read page by slug
- Method: `GET`
- Path: `/pages/slug/{slug}/`

#### 13) Browse tiers
- Method: `GET`
- Path: `/tiers/`
- Supported include documented: `monthly_price,yearly_price,benefits`

#### 14) Read settings
- Method: `GET`
- Path: `/settings/`
- Notes:
  - the docs call out `/settings/` as one of the envelope exceptions that is not wrapped like normal array resources

### Admin API authentication/session routes
All paths below are relative to `https://{admin_domain}/ghost/api/admin/`.

#### 15) Create authenticated session
- Method: `POST`
- Path: `/session/`
- Request body fields documented:
  - `username`
  - `password`
- Headers/notes:
  - `Origin` header required for CSRF protection
  - success returns `201 Created` with empty body and `set-cookie`
  - may instead return `403 Needs2FAError` when verification is required

#### 16) Verify session with auth code
- Method: `PUT`
- Path: `/session/verify/`
- Request body fields documented:
  - `token`

#### 17) Resend verification token
- Method: `POST`
- Path: `/session/verify/`
- Request body documented: empty object `{}`

### Admin API stable integration resource families
These are the stable integration-accessible Admin API endpoint families explicitly listed on the official overview page.

#### 18) Posts resource family
- Path: `/posts/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`, `Copy`, `Delete`

#### 19) Pages resource family
- Path: `/pages/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`, `Copy`, `Delete`

#### 20) Tags resource family
- Path: `/tags/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`, `Delete`

#### 21) Tiers resource family
- Path: `/tiers/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`

#### 22) Newsletters resource family
- Path: `/newsletters/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`

#### 23) Offers resource family
- Path: `/offers/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`

#### 24) Members resource family
- Path: `/members/`
- Methods/actions documented: `Browse`, `Read`, `Edit`, `Add`

#### 25) Users resource family
- Path: `/users/`
- Methods/actions documented: `Browse`, `Read`

#### 26) Images upload family
- Path: `/images/`
- Methods/actions documented: `Upload`

#### 27) Themes management family
- Path: `/themes/`
- Methods/actions documented: `Upload`, `Activate`

#### 28) Site read family
- Path: `/site/`
- Methods/actions documented: `Read`

#### 29) Webhooks family
- Path: `/webhooks/`
- Methods/actions documented: `Edit`, `Add`, `Delete`

## Pagination
From the official pagination docs:
- all browse endpoints are paginated
- default page size: `15`
- documented paging parameters:
  - `page`
  - `limit`
- documented maximum `limit`: `100`
- documented response metadata structure includes:
  - `meta.pagination.page`
  - `meta.pagination.limit`
  - `meta.pagination.pages`
  - `meta.pagination.total`
  - `meta.pagination.next`
  - `meta.pagination.prev`

## Filtering and field selection
From the official parameters page:
- `include` values documented:
  - posts/pages: `authors`, `tags`
  - authors/tags: `count.posts`
  - tiers: `monthly_price,yearly_price,benefits`
- `fields` returns only selected properties
- `formats` is available for posts/pages and can include `html` and `plaintext`
- example filters explicitly shown by Ghost:
  - `featured:true`
  - `tag:getting-started`
  - `visibility:public`
- documented default sort orders:
  - posts: `published_at DESC`
  - pages: `title ASC`
  - tags: `name ASC`
  - authors: `name ASC`
  - tiers: `monthly_price ASC`

## Errors and response notes
From the official Content API errors page, which the Admin API overview explicitly references for filtering and errors:
- `400` - badly formed queries, such as incorrectly encoded filters
- `401` - authentication failures, such as unknown API keys
- `403` - permission errors / under-privileged users
- `404` - unknown or non-public resources
- `500` - server-side errors
- error payloads use JSON with an `errors` array
- official sample error object fields:
  - `message`
  - `errorType`

## Important usage notes
- Ghost separates public read access (Content API) from write/admin access (Admin API)
- Content API keys are intended for public distribution; Admin API keys are not
- the Content API is explicitly described as fully cacheable and fetchable without limitation
- integration tokens only cover the stable endpoint families listed on the Admin API overview page; broader user-role access exists but is not fully enumerated on that page
- the Admin API JavaScript client only supports token-based flows documented by Ghost, while browser-session login flows rely on cookies and CSRF headers
- the docs repeatedly emphasize using the correct admin domain rather than the public site domain, especially for CORS-sensitive browser use

## Verification notes
This file was manually rebuilt from Ghost’s official developer documentation using browser inspection only.