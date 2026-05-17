# Medium

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://github.com/Medium/medium-api-docs`
  - `https://raw.githubusercontent.com/Medium/medium-api-docs/master/README.md`
- Manual review outcome: `manually_documented`
- Confirmed route count: `7`

## API overview
- Base URL: `https://api.medium.com/v1`
- API style: JSON-based OAuth2 API
- Transport: HTTPS only; the official docs explicitly say all requests must use `https`
- Current platform status: the official README warns that the Medium API is no longer supported and that Medium does not recommend using it
- New-integration status: the browser-based OAuth flow is supported for existing integrations only; the docs say Medium does not allow new integrations
- Authentication:
  - recommended path: self-issued integration token from the user’s Medium account settings
  - legacy/existing-integration path: browser OAuth plus token exchange via `POST /v1/tokens`
  - authenticated API calls use `Authorization: Bearer <token>`
- Response format: JSON data envelopes
- Pagination: no pagination parameters or headers were documented on the reviewed endpoints
- Rate limits: no public numeric request-rate quota was published in the reviewed official README

## Confirmed endpoints
|| Method | Path | Notes |
||---|---|---|
|| POST | `/v1/tokens` | Exchanges an authorization code for an access token, and also refreshes an expired access token when called with `grant_type=refresh_token`. |
|| GET | `/v1/me` | Returns the authenticated user profile. |
|| GET | `/v1/users/{userId}/publications` | Lists publications related to the authenticated user. |
|| GET | `/v1/publications/{publicationId}/contributors` | Lists publication contributors and their publication roles. |
|| POST | `/v1/users/{authorId}/posts` | Creates a post on the authenticated user profile. |
|| POST | `/v1/publications/{publicationId}/posts` | Creates a post under a publication the user can publish into. |
|| POST | `/v1/images` | Uploads one image using multipart form data. |

## Confirmed parameters and request fields
### Browser OAuth authorization URL
- Official authorization URL pattern:
  - `https://medium.com/m/oauth/authorize?client_id={{clientId}}&scope=basicProfile,publishPost&state={{state}}&response_type=code&redirect_uri={{redirectUri}}`
- Query parameters documented on that browser flow:
  - `client_id`
  - `scope`
  - `state`
  - `response_type` - must be `code`
  - `redirect_uri`
- Scope values documented in the README:
  - `basicProfile`
  - `listPublications`
  - `publishPost`
  - `uploadImage` - marked as extended scope requiring explicit permission

### `POST /v1/tokens`
- Form-encoded fields for authorization-code exchange:
  - `code`
  - `client_id`
  - `client_secret`
  - `grant_type=authorization_code`
  - `redirect_uri`
- Form-encoded fields for token refresh:
  - `refresh_token`
  - `client_id`
  - `client_secret`
  - `grant_type=refresh_token`

### `GET /v1/me`
- No query parameters are documented
- Requires a bearer token

### `GET /v1/users/{userId}/publications`
- path `userId` - Medium user identifier
- The reviewed docs say the endpoint is effectively for the authenticated user; listing another user’s publications can return `403`

### `GET /v1/publications/{publicationId}/contributors`
- path `publicationId` - Medium publication identifier

### Post-creation routes
- Shared JSON body fields on both post-creation endpoints:
  - `title` - required; titles longer than `100` characters are ignored for SEO/listing purposes
  - `contentFormat` - required; `html` or `markdown`
  - `content` - required
  - `tags` - optional; only first `3` are used, tags longer than `25` characters are ignored
  - `canonicalUrl` - optional
  - `publishStatus` - optional; `public`, `draft`, or `unlisted`
  - `license` - optional; reviewed docs list `all-rights-reserved`, `cc-40-by`, `cc-40-by-sa`, `cc-40-by-nd`, `cc-40-by-nc`, `cc-40-by-nc-nd`, `cc-40-by-nc-sa`, `cc-40-zero`, `public-domain`
  - `notifyFollowers` - optional boolean
- Path parameters:
  - `/v1/users/{authorId}/posts` uses authenticated user `authorId`
  - `/v1/publications/{publicationId}/posts` uses target publication `publicationId`

### `POST /v1/images`
- Uses `multipart/form-data`
- The file field name must be `image`
- Only one image may be sent per request
- Reviewed supported content types:
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/tiff`

## Confirmed response fields
### Token exchange / refresh
- `token_type`
- `access_token`
- `refresh_token`
- `scope`
- `expires_at`

### `GET /v1/me`
- `data.id`
- `data.username`
- `data.name`
- `data.url`
- `data.imageUrl`

### `GET /v1/users/{userId}/publications`
- publication objects include:
  - `id`
  - `name`
  - `description`
  - `url`
  - `imageUrl`

### `GET /v1/publications/{publicationId}/contributors`
- contributor records include:
  - `publicationId`
  - `userId`
  - `role` - reviewed values `editor` or `writer`

### Post-creation routes
- returned post objects include:
  - `id`
  - `title`
  - `authorId`
  - `publicationId` on publication-post creation
  - `tags`
  - `url`
  - `canonicalUrl`
  - `publishStatus`
  - `publishedAt`
  - `license`
  - `licenseUrl`

### `POST /v1/images`
- `data.url`
- `data.md5`

## Response, pagination, and error notes
- Reviewed documented status/error cases include:
  - `201` for successful token exchange, post creation, and image upload
  - `200` for successful read operations
  - `400 Bad Request` for invalid or missing post-creation fields
  - `401 Unauthorized` for invalid/revoked tokens and some scope failures
  - `403 Forbidden` when attempting unsupported user/publication actions
- The docs do not publish a numbered pagination model for the reviewed routes
- Token lifetime notes from the official README:
  - OAuth access tokens are valid for `60` days
  - refresh tokens do not expire, but can be revoked
  - self-issued integration tokens do not expire, but can also be revoked by the user

## Important usage notes
- The official README begins with a deprecation warning: Medium says the API is no longer supported and should not be recommended for new use
- Medium recommends self-issued integration tokens for desktop integrations and similar cases where securely keeping a client secret is difficult
- Browser-based OAuth is effectively legacy support for already-approved integrations only
- Publication posting rules differ by role:
  - editors can create `public`, `unlisted`, or `draft` posts
  - writers can only create `draft` posts pending editor approval
- The images endpoint is optional for many integrations because Medium will side-load images referenced in `<img src="...">` tags when creating posts
- Uploaded image requests must terminate multipart lines with `\r\n`
- The docs recommend treating access tokens, refresh tokens, and integration tokens like passwords

## Sources inspected
- `https://github.com/Medium/medium-api-docs`
- `https://raw.githubusercontent.com/Medium/medium-api-docs/master/README.md`
