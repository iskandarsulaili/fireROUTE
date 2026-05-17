# Kaggle

## Provider metadata
- Category: `Open Data`
- Provider slug: `kaggle`
- Description: `Create and interact with datasets, notebooks, models, competitions, and related Kaggle resources`
- Official docs/pages used:
  - `https://www.kaggle.com/docs/api` (official Public API documentation page reviewed manually in-browser)
  - `https://www.kaggle.com/.well-known/oauth-authorization-server` (official OAuth authorization-server metadata document linked by the docs)
  - `https://www.kaggle.com/.well-known/oauth-protected-resource` (official protected-resource metadata document linked by the docs)
- Public API base URL confirmed from the reviewed official pages: `https://www.kaggle.com`
- Auth model: OAuth 2.0 Authorization Code with PKCE for public clients; organization-client token exchange uses HTTP Basic auth with the organization owner's Kaggle username and API key; downstream Kaggle API calls use `Authorization: Bearer ACCESS_TOKEN`
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON for discovery, token, and introspection responses; redirect query parameters for authorization errors/callbacks
- Rate limits: dynamic rate limiting; the official docs say callers may receive HTTP `429` / `Too many requests`
- Manually confirmed route count: `5`

## API shape and behavior
- The reviewed Kaggle page is not a full CRUD reference for every Kaggle dataset/notebook/model endpoint.
- What it does document clearly is Kaggle's public OAuth provider surface and how access tokens are used against Kaggle APIs.
- The docs explicitly say the provider supports:
  - Authorization Code Grant with PKCE for public clients
  - Refresh Token Grant
  - Token Introspection (RFC 7662)
  - OAuth 2.0 discovery via well-known endpoints
- The official authorization-server metadata also advertises a `registration_endpoint` at `https://www.kaggle.com/api/v1/oauth2/register`, but the reviewed docs page does not publish its request contract, so it is not counted below as a fully documented fireROUTE route.

## Canonical endpoints
1. `GET /.well-known/oauth-authorization-server`
   - Returns OAuth server metadata such as issuer, authorization endpoint, token endpoint, supported grant types, scopes, and response modes.
2. `GET /.well-known/oauth-protected-resource`
   - Returns protected-resource metadata for the Kaggle API / MCP resource, including supported bearer-token transport and linked authorization servers.
3. `GET /api/v1/oauth2/authorize`
   - Starts the Authorization Code flow and redirects the user to Kaggle's consent/login screen.
4. `POST /api/v1/oauth2/token`
   - Exchanges an authorization code for tokens and also refreshes access tokens when `grant_type=refresh_token`.
5. `POST /api/v1/oauth2/introspect`
   - Validates and inspects an access token or refresh token.

## Confirmed parameters
### `GET /api/v1/oauth2/authorize`
Query parameters documented on the official page:
- `client_id` - required - registered client identifier
- `redirect_uri` - required - must match a registered redirect URI
- `scope` - required - space-separated scope list
- `state` - required - random CSRF-protection string (`20-128` chars per the docs)
- `response_type` - required - must be `code`
- `response_mode` - required - must be `query`
- `code_challenge` - required for public clients only - Base64URL SHA-256 hash of the PKCE verifier
- `code_challenge_method` - required for public clients only - must be `S256`

### `POST /api/v1/oauth2/token`
Request-body parameters documented on the official page:
- `grant_type` - required - `authorization_code` or `refresh_token`
- `code` - required for authorization-code exchange
- `code_verifier` - required for public clients during authorization-code exchange; must not be sent by organization clients
- `client_id` - optional
- `redirect_uri` - optional
- `refresh_token` - required when `grant_type=refresh_token`

Body encoding documented by Kaggle:
- `application/x-www-form-urlencoded`
- `application/json`

Authentication rules documented by Kaggle:
- Public clients: no auth header on token exchange; PKCE proves possession
- Organization clients: HTTP Basic auth using the organization owner's Kaggle username and API key
- Refresh-token requests: the docs say client authentication is not required for either client type

### `POST /api/v1/oauth2/introspect`
Request-body parameter documented on the official page:
- `token` - required - access token or refresh token to validate

Body encoding documented by Kaggle:
- `application/x-www-form-urlencoded`
- `application/json`

## Response and error notes
### Official discovery metadata examples
`GET /.well-known/oauth-authorization-server` returned official metadata including:
- `issuer`
- `authorization_endpoint`
- `token_endpoint`
- `grant_types_supported`
- `code_challenge_methods_supported`
- `scopes_supported`
- `registration_endpoint`
- `response_types_supported`
- `response_modes_supported`

`GET /.well-known/oauth-protected-resource` returned official metadata including:
- `resource`
- `authorization_servers`
- `bearer_methods_supported`
- `scopes_supported`
- `resource_name`

### Official token response example
The docs show a JSON token response containing:
- `access_token`
- `refresh_token`
- `token_type`
- `expires_in`
- `username`
- `user_id`
- `scope`

### Official introspection responses
For an active token, the docs show:
- `active: true`
- `username`
- `user_id`
- `scope`
- `exp`

For an invalid token, the docs show:
- `active: false`

### Error handling documented by Kaggle
Authorization redirect errors are returned as query parameters on the redirect URI:
- `invalid_request`
- `invalid_client`
- `invalid_scope`
- `access_denied`

Token-endpoint errors return HTTP `400` JSON responses using codes including:
- `invalid_request`
- `invalid_grant`
- `invalid_client`

## Important usage notes
- Access tokens expire after `3` hours according to the official docs.
- The docs recommend using refresh tokens to obtain new access tokens after expiry.
- The official page says to request only the minimum scopes needed.
- Scopes follow the documented pattern `<permission-or-role>:<resource-id-or-*>`.
- The reviewed page shows example downstream API usage with bearer auth, for example `curl https://www.kaggle.com/api/v1/datasets/list -H "Authorization: Bearer KGAT_..."`, but that page does not provide a complete dataset/notebook/model route catalog, so this file documents only the official OAuth/provider surface confirmed during review.
- The docs say to contact the Kaggle team to register a new OAuth client.

## fireROUTE normalization notes
- Treat Kaggle as a confirmed OAuth provider surface with downstream Kaggle resource APIs behind bearer tokens.
- Preserve the documented well-known discovery endpoints exactly.
- Preserve `GET /api/v1/oauth2/authorize`, `POST /api/v1/oauth2/token`, and `POST /api/v1/oauth2/introspect` exactly as documented.
- Do not invent undocumented Kaggle resource CRUD routes from example snippets alone; document those separately only after reviewing their own official endpoint reference pages.
