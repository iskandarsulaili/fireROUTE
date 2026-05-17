# Product Hunt

## Provider metadata
- Category: `Social`
- Provider slug: `product-hunt`
- Official docs pages used:
  - `https://api.producthunt.com/v2/docs`
  - `https://api.producthunt.com/v2/docs/oauth_user_authentication/oauth_authorize_ask_for_access_grant_code_on_behalf_of_the_user`
  - `https://api.producthunt.com/v2/docs/oauth_user_authentication/oauth_token_use_the_access_grant_code_you_received_through_the_redirect_to_request_an_access_token`
  - `https://api.producthunt.com/v2/docs/oauth_user_authentication/unauthorized_oauth_oauth_test_invalid_access_tokens_will_lead_to_error_messages`
  - `https://api.producthunt.com/v2/docs/oauth_client_only_authentication/oauth_token_ask_for_client_level_token`
  - `https://api.producthunt.com/v2/docs/rate_limits/headers`
  - `https://api-v2-docs.producthunt.com/operation/query/`
- API host: `https://api.producthunt.com`
- Main data endpoint: `https://api.producthunt.com/v2/api/graphql`
- Auth model: OAuth 2 bearer token, with either authorization-code user auth or client-credentials app auth
- Response format: JSON
- Manually confirmed route count: `4`

## Authentication
- The welcome page says the API is only accessible with a provided `access_token`.
- The docs describe three scopes:
  - `public` - public Product Hunt information
  - `private` - authenticated-user data access
  - `write` - write actions on behalf of a user; the docs say write access must be approved by Product Hunt
- Requests to the GraphQL endpoint use `Authorization: Bearer {token}`.
- User-context tokens are obtained through the authorization-code flow.
- App-only read access is obtained with the client-credentials flow.

## Canonical endpoints

### 1) Authorize a user
- Method: `GET`
- Path: `/v2/oauth/authorize`
- Base URL: `https://api.producthunt.com`
- Purpose: redirect a Product Hunt user to consent and return an authorization code to your redirect URI

Query parameters:
- `client_id` - required application id
- `redirect_uri` - required callback URL
- `response_type` - required; docs say to use `code`
- `scope` - required; examples include `public+private`, and write-enabled apps should request `public private write`

Response notes:
- The reviewed docs show a `200 OK` HTML response for the authorization page.
- After consent, Product Hunt redirects back to the registered `redirect_uri` with a temporary `code` query parameter.

### 2) Exchange an authorization code for a user token
- Method: `POST`
- Path: `/v2/oauth/token`
- Base URL: `https://api.producthunt.com`
- Purpose: exchange the `code` from the user redirect for a bearer access token

Headers:
- `Accept: application/json`
- `Content-Type: application/json`

JSON body parameters:
- `client_id` - required
- `client_secret` - required
- `redirect_uri` - required and must match the authorize step
- `code` - required authorization code from the callback
- `grant_type` - required; value `authorization_code`

Documented success fields:
- `access_token`
- `token_type`

### 3) Request an app-only token
- Method: `POST`
- Path: `/v2/oauth/token`
- Base URL: `https://api.producthunt.com`
- Purpose: obtain a client-level bearer token for read access without user context

Headers:
- `Accept: application/json`
- `Content-Type: application/json`

JSON body parameters:
- `client_id` - required
- `client_secret` - required
- `grant_type` - required; value `client_credentials`

Documented success fields:
- `access_token`
- `token_type`
- `scope`

Usage note:
- The docs position this flow for situations like showing current posts before a user logs in.

### 4) Execute GraphQL queries and mutations
- Method: `POST`
- Path: `/v2/api/graphql`
- Base URL: `https://api.producthunt.com`
- Purpose: run Product Hunt data queries and supported mutations

Headers:
- `Accept: application/json`
- `Content-Type: application/json`
- `Authorization: Bearer {access_token}`

JSON body:
- `query` - GraphQL query string

Example reviewed:
- `query { posts(first: 1) { edges { node { id, name } } } }`

GraphQL schema notes from the official reference:
- Root query fields listed: `collection`, `collections`, `comment`, `post`, `posts`, `topic`, `topics`, `user`, `viewer`
- Root mutation fields listed: `userFollow`, `userFollowUndo`
- The schema exposes connection/page objects such as `CollectionConnection`, `CommentConnection`, `PostConnection`, `TopicConnection`, `UserConnection`, `VoteConnection`, and `PageInfo`

## Pagination, rate limits, and errors
- The GraphQL schema reviewed uses connection-style object types plus `PageInfo`, so pagination is schema-driven rather than exposed as classic REST query parameters on the overview pages reviewed.
- The official rate-limit page documents two separate limits:
  - GraphQL endpoint `/v2/api/graphql`: `6250` complexity points per `15` minutes
  - Other `/v2/*` endpoints: `450` requests per `15` minutes
- Every API response is documented as returning these rate-limit headers:
  - `X-Rate-Limit-Limit`
  - `X-Rate-Limit-Remaining`
  - `X-Rate-Limit-Reset`
- The same official rate-limit page also shows an example `GET /v2/oauth/token` response header with `X-Rate-Limit-Limit: 900`, so there is a docs inconsistency between the prose and the example header.
- When the rate limit is exceeded, the docs say the API returns `429 Too Many Requests` until the window resets.
- The reviewed unauthorized example for `POST /v2/api/graphql` returns `401 Unauthorized` with:
  - `WWW-Authenticate: Bearer realm="ProductHuntOauth2", error="invalid_token"`
  - JSON body fields `data: null` and `errors[]` containing `error` and `error_description`

## Request and format notes
- OAuth authorize is browser/HTML based.
- OAuth token endpoints use JSON request bodies and return JSON.
- The GraphQL endpoint also uses JSON request bodies and JSON responses.
- The reviewed docs do not publish a separate REST list of content endpoints for API v2; Product Hunt positions GraphQL as the main data interface.

## fireROUTE normalization notes
- Treat Product Hunt as a GraphQL-first provider rather than trying to force it into a large REST surface.
- Preserve scopes exactly as Product Hunt names them: `public`, `private`, `write`.
- Keep GraphQL passthrough available because the official schema surface is broader than a simple normalized subset.
