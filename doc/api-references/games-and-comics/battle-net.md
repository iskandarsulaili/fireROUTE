# Battle.net

## Overview
- Provider: Battle.net OAuth APIs
- Category: Games & Comics
- Official docs: `https://develop.battle.net/documentation/guides/getting-started`
- Additional official pages reviewed:
  - `https://community.developer.battle.net/documentation/battle-net`
  - `https://community.developer.battle.net/documentation/battle-net/oauth-apis`
  - `https://community.developer.battle.net/documentation/guides/using-oauth`
  - `https://community.developer.battle.net/documentation/guides/using-oauth/client-credentials-flow`
  - `https://community.developer.battle.net/documentation/guides/using-oauth/authorization-code-flow`
- Base URLs:
  - `https://oauth.battle.net` for US / EU / APAC
  - `https://oauth.battlenet.com.cn` for CN
- Related API-host pattern for non-OAuth game/community requests: `{region}.api.blizzard.com/{API path}` and `gateway.battlenet.com.cn/{API path}` for China
- Auth: OAuth 2.0 with Battle.net developer `client_id` and `client_secret`; bearer access tokens for protected resources
- HTTPS: yes
- Response formats: JSON token payloads plus browser redirects / HTML OAuth error pages during interactive auth failures
- Confirmed routes: `4`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/authorize` | query `response_type=code`, `client_id`, `redirect_uri`, `state`, `scope` | Authorization endpoint used in the authorization-code flow. Official example uses `https://oauth.battle.net/authorize?...`. |
| POST | `/token` | basic auth `client_id:client_secret`; form body `grant_type=client_credentials` or `grant_type=authorization_code`; auth-code exchange also needs `redirect_uri`, `code` | Token endpoint for both client-credentials and authorization-code exchanges. |
| GET | `/userinfo` | bearer token in the `Authorization` header | Official auth-code page explicitly lists `GET /userinfo`; docs note this route uses host `oauth.battle.net`. |
| method not stated on reviewed guide; live `GET` returned `405` | `/check_token?token={token}` | query `token` | Official `Using OAuth` page says this endpoint is available in all regions to verify a token was generated for a given client. The reviewed guide does not state the HTTP method; a live browser `GET` returned `405`, so fireROUTE should not assume GET support. |

## Authentication
- Battle.net uses OAuth 2.0 for its APIs.
- Before using the APIs, the official getting-started page says developers must:
  - log in or create a Battle.net account
  - attach a Battle.net Authenticator; two-factor authentication is required for API usage
  - accept the Blizzard Developer API Terms of Use
  - create a client in the API Access tool and generate a secret
- Client credentials flow:
  - used for most API requests
  - `POST` to `/token` with `grant_type=client_credentials`
  - pass HTTP Basic auth with `client_id` as username and `client_secret` as password
- Authorization code flow:
  - used for user-authorized routes such as `GET /userinfo`
  - browser redirect goes to `/authorize`
  - application later exchanges the one-time `code` at `/token`
- Redirect URI rules from the reviewed auth-code docs:
  - should be `https://localhost` for testing or a redirect URI configured in the API Access tool
  - the same `redirect_uri` must be used again during token exchange

## Route-specific parameters and usage notes
- `/authorize`
  - `client_id`: the developer client ID
  - `scope`: space-separated scope values requested from the player
  - `state`: semi-random blob returned to the client after auth completes
  - `redirect_uri`: HTTPS callback URL or `https://localhost` for testing
  - `response_type`: must be `code` for the authorization-code flow
- `/token`
  - client-credentials flow requires form field `grant_type=client_credentials`
  - authorization-code flow requires `grant_type=authorization_code`, `redirect_uri`, and `code`
  - official sample response fields: `access_token`, `token_type`, `expires_in`, `scope`
- `/userinfo`
  - only available through the authorization-code flow according to the reviewed auth-code page
  - uses `oauth.battle.net` as the host per the official note on that page
- `/check_token`
  - official guide documents only the path shape `/check_token?token={token}` and the purpose of the endpoint
  - because the reviewed guide does not specify the method and a live browser `GET` returned `405`, this route should stay in passthrough mode until method semantics are validated with a proper token-bearing request

## Protected-resource scope notes from the official auth-code page
- The authorization-code flow page says user-authorized tokens currently cover:
  - `GET /userinfo`
  - `GET /profile/user/wow`
  - `GET /profile/user/wow/protected-character/{realm-id}-{character-id}`
  - `GET /profile/user/wow/collections`
  - `GET /profile/user/wow/collections/pets`
  - `GET /profile/user/wow/collections/mounts`
- Those World of Warcraft profile routes belong to the WoW provider surface, not the Battle.net OAuth provider itself, but they are important for choosing the correct auth flow.

## Rate limits, pagination, and errors
- Official throttle limits from the getting-started guide:
  - `36,000` requests per hour
  - `100` requests per second
- Official behavior note:
  - exceeding the hourly quota results in slower service until traffic decreases
  - exceeding the per-second limit results in `429` for the remainder of the second until quota refreshes
- Pagination:
  - none documented for the reviewed OAuth routes
- Live unauthenticated / malformed-request checks performed in this pass:
  - `https://oauth.battle.net/token` opened directly in the browser returned `403 Forbidden`
  - `https://oauth.battle.net/userinfo` without a bearer token returned an OAuth error page with `403`
  - live browser `GET` to `/check_token` with a sample `token` query returned an OAuth error page with `405`

## Response-format notes
- Client-credentials sample JSON from the official docs:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `scope`
- `/authorize` is an interactive browser route, so successful usage is redirect-based rather than a normal API JSON response.
- Error handling seen in live browser checks is not a shared JSON schema; unauthenticated OAuth routes can return plain HTTP status pages or Battle.net OAuth HTML error pages.

## Important usage notes
- The reviewed getting-started guide says Battle.net API URIs for game/community data follow `{region}.api.blizzard.com/{API path}`; OAuth is separate and hosted on `oauth.battle.net` or `oauth.battlenet.com.cn`.
- APAC replaces the older `kr` and `tw` region naming in the reviewed OAuth guide.
- The official auth-code guide warns that the scopes returned after authorization may be fewer than the scopes originally requested, because users can selectively approve them.
- The reviewed docs strongly recommend using stable OAuth libraries instead of implementing the flow from scratch.
- The Battle.net provider page itself currently exposes only the OAuth API family; product-specific game/community endpoints are documented under Diablo III, Hearthstone, StarCraft II, and World of Warcraft pages.

## Integration notes for fireROUTE
- Treat Battle.net as an OAuth/auth-helper provider first, not as the full Blizzard game-data surface.
- Keep OAuth routes and token-verification behavior separate from downstream Blizzard game/community endpoints.
- Preserve both global and China OAuth hosts.
- Do not model `/check_token` as a normal GET route in generated adapters unless method requirements are validated with authenticated testing; the public guide names the endpoint but does not state the method and live browser `GET` returns `405`.

## Sources inspected
- `https://community.developer.battle.net/documentation/guides/getting-started`
- `https://community.developer.battle.net/documentation/battle-net`
- `https://community.developer.battle.net/documentation/battle-net/oauth-apis`
- `https://community.developer.battle.net/documentation/guides/using-oauth`
- `https://community.developer.battle.net/documentation/guides/using-oauth/client-credentials-flow`
- `https://community.developer.battle.net/documentation/guides/using-oauth/authorization-code-flow`
- live checks:
  - `https://oauth.battle.net/token`
  - `https://oauth.battle.net/userinfo`
  - `https://oauth.battle.net/check_token` with a sample `token` query
