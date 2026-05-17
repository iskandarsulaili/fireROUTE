# Meetup.com

## Provider metadata
- Category: `Social`
- Provider slug: `meetup-com`
- Official docs pages used:
  - `https://www.meetup.com/graphql/guide/`
  - `https://www.meetup.com/graphql/authentication/`
- Main API base URL: `https://api.meetup.com`
- OAuth base URL: `https://secure.meetup.com`
- Auth model: OAuth 2 bearer tokens for GraphQL requests
- Supported request methods confirmed: `GET`, `POST`
- Response format: JSON for GraphQL and token responses
- Manually confirmed route count: `3`

## Authentication
- Meetup GraphQL requests require a bearer-token Authorization header.
- The docs say the API supports OAuth 2 over HTTPS.
- The official authentication page documents a browser authorization endpoint and a token endpoint.

## Canonical endpoints

### 1) GraphQL API
- Method: `POST`
- Path: `/gql-ext`
- Base URL: `https://api.meetup.com`
- Purpose: execute GraphQL queries and mutations

Headers:
- `Authorization` with a bearer token
- `Content-Type: application/json`

Request body notes:
- `query` - GraphQL query or mutation string
- `variables` - optional JSON variables payload

Pagination notes:
- The guide explicitly recommends cursor-based pagination.
- `pageInfo.endCursor` is used as the cursor for subsequent requests.
- The example says the default page size is `20` unless a `first` argument is provided.

Error/response notes:
- Success responses are JSON GraphQL payloads under `data`.
- Rate-limit failures are returned in `errors[]` with `extensions.code = RATE_LIMITED`, plus `consumedPoints` and `resetAt`.

### 2) OAuth authorization endpoint
- Method: `GET`
- Path: `/oauth2/authorize`
- Base URL: `https://secure.meetup.com`
- Purpose: send the user to Meetup for OAuth authorization

Query parameters confirmed in the official docs:
- `client_id` - OAuth client key
- `response_type` - `code` for server flow or `token` for implicit flow
- `redirect_uri` - registered callback URI
- `state` - optional opaque anti-forgery state value

Success/failure notes:
- Server flow success returns `code` and optional `state`.
- Failed authorization can return `error` values such as `invalid_request`, `unauthorized_client`, `access_denied`, and `unsupported_response_type`.
- The implicit flow returns access-token response data in the URL fragment.

### 3) OAuth token endpoint
- Method: `POST`
- Path: `/oauth2/access`
- Base URL: `https://secure.meetup.com`
- Purpose: exchange authorization credentials for tokens or refresh an existing session

Transport:
- `application/x-www-form-urlencoded`

Grant variants documented on the official page:
- `grant_type=authorization_code`
  - parameters: `client_id`, `client_secret`, `redirect_uri`, `code`
- `grant_type=refresh_token`
  - parameters: `client_id`, `client_secret`, `refresh_token`
- `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer`
  - parameters: `assertion`

Documented success fields:
- `access_token`
- `token_type` (`bearer`)
- `expires_in`
- `refresh_token`

Documented error values:
- `invalid_request`
- `invalid_client`
- `unauthorized_client`
- `invalid_grant`
- `unsupported_grant_type`

## Rate limits
- The guide says clients get `500` points every `60` seconds.
- If the limit is exceeded, Meetup returns a GraphQL error response with `RATE_LIMITED` metadata and a `resetAt` timestamp.

## Transport and usage notes
- The docs require HTTPS for OAuth 2.
- Redirect URI host and port must exactly match the registered callback URL.
- Redirect URI paths must reference the registered callback path or a subdirectory of it.

## fireROUTE normalization notes
- Treat `POST /gql-ext` as the primary application route; schema field selection happens inside the GraphQL payload, not the URL path.
- Keep the OAuth authorization and token flows distinct from GraphQL execution even though they serve the same provider.
- Cursor-based pagination should be preserved as provider-native rather than coerced into page-number semantics.
