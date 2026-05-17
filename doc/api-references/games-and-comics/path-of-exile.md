# Path of Exile

## Overview
- Provider: Path of Exile Developer API
- Category: Games & Comics
- Official docs: `https://www.pathofexile.com/developer/docs`
- API reference: `https://www.pathofexile.com/developer/docs/reference`
- Authorization docs: `https://www.pathofexile.com/developer/docs/authorization`
- Preferred base URL: `https://api.pathofexile.com`
- Auth: OAuth 2.1 bearer tokens are required for almost all routes; client registration is handled manually by Grinding Gear Games via `oauth@grindinggear.com`
- HTTPS: yes
- Response format: JSON
- Confirmed route count: `22` route patterns

## Confirmed endpoints

| Method | Path | Required scope | Key parameters / notes |
|---|---|---|---|
| GET | `/profile` | `account:profile` | Returns basic account profile data including `uuid`, `name`, optional `locale`, and optional linked Twitch info. |
| GET | `/item-filter` | `account:item_filter` | Lists online item filters for the authenticated account. |
| GET | `/item-filter/<id>` | `account:item_filter` | `id` is an item-filter id. Returns a single filter. |
| POST | `/item-filter` | `account:item_filter` | Requires `Content-Type: application/json`; optional `validate=true`; body includes `filter_name`, `realm`, optional `description`, optional `version`, optional `type`, optional `public`, and `filter`. |
| POST | `/item-filter/<id>` | `account:item_filter` | Partial update; same JSON body family as create; optional `validate=true`; public filters cannot be made private again; may return `202 Accepted` with an `error` object while extra processing completes. |
| GET | `/league` | `service:leagues` | Optional `realm`, `type`, `season`, `limit`, `offset`; `limit` max `50`. |
| GET | `/league/<league>` | `service:leagues` | `league` is the league name; optional `realm`; returns `null` when not found. |
| GET | `/league/<league>/ladder` | `service:leagues:ladder` | Optional `realm`, `sort`, `class`, `limit`, `offset`; default `20`, max `500`; top `15000` entries only. |
| GET | `/league/<league>/event-ladder` | `service:leagues:ladder` | Optional `realm`, `limit`, `offset`; default `20`, max `500`; top `15000` entries only. |
| GET | `/pvp-match` | `service:pvp_matches` | Optional `realm`, `type`, `season`, `league`; lists upcoming or filtered matches. |
| GET | `/pvp-match/<match>` | `service:pvp_matches` | `match` is the PvP match name; optional `realm`. |
| GET | `/pvp-match/<match>/ladder` | `service:pvp_matches:ladder` | Optional `realm`, `limit`, `offset`; default `20`, max `200`; top `15000` entries only. |
| GET | `/account/leagues[/<realm>]` | `account:leagues` | Optional realm path segment; supports omitted PC default plus `xbox` and `sony`. Includes private leagues available to the account. |
| GET | `/character[/<realm>]` | `account:characters` | Optional realm path segment; supports PC default plus `xbox`, `sony`, and `poe2`. Lists account characters. |
| GET | `/character[/<realm>]/<name>` | `account:characters` | `name` is a character name; returns equipment, inventory, and passive-skill information. |
| GET | `/stash[/<realm>]/<league>` | `account:stashes` | PoE1-only; lists account stash tabs for the specified league. |
| GET | `/stash[/<realm>]/<league>/<stash_id>[/<substash_id>]` | `account:stashes` | PoE1-only; fetches one stash or one sub-stash wrapped with parent-tab info. |
| GET | `/league-account[/<realm>]/<league>` | `account:league_accounts` | PoE1-only; returns league-specific account information. |
| GET | `/guild[/<realm>]/stash/<league>` | `account:guild:stashes` | PoE1-only; docs say this scope is granted only on special request. Lists guild stash tabs the account can access. |
| GET | `/guild[/<realm>]/stash/<league>/<stash_id>[/<substash_id>]` | `account:guild:stashes` | PoE1-only; fetches a guild stash or guild sub-stash. |
| GET | `/public-stash-tabs[/<realm>]` | `service:psapi` | PoE1-only; optional `id` query for stream pagination; docs note a current `5` minute delay on results. |
| GET | `/currency-exchange[/<realm>][/<id>]` | `service:cxapi` | Optional trailing hourly unix-timestamp `id`; returns historical hourly market digests only, not the current hour. |

## Authentication and OAuth
- The docs say almost all developer APIs require authorization tied to an existing Path of Exile account.
- The platform uses OAuth 2.1.
- OAuth server endpoints documented in the official authorization page:
  - `https://www.pathofexile.com/oauth/authorize`
  - `https://www.pathofexile.com/oauth/token`
  - `https://www.pathofexile.com/oauth/token/revoke`
  - `https://www.pathofexile.com/oauth/token/introspect`
- Confidential clients:
  - may use any available grant types
  - require secure HTTPS redirect URIs on a registered domain
  - access tokens last `28` days
  - refresh tokens last `90` days
  - usually get individual rate limits per client
- Public clients:
  - may only use authorization-code + PKCE
  - may not use any `service:*` scopes
  - access tokens last `10` hours
  - refresh tokens last `7` days
  - share rate limits with other public clients
- Registration is not self-serve: the docs say to email `oauth@grindinggear.com` with account name, app details, requested client type, grant types, scopes, and rationale.

## Scope map from the official docs
- `account:profile` — basic profile information
- `account:leagues` — account-specific league availability, including private leagues
- `account:stashes` — stash tabs and items
- `account:characters` — characters and inventories
- `account:league_accounts` — league-specific account data / allocated atlas passives
- `account:item_filter` — item-filter management
- `service:leagues` — league directory endpoints
- `service:leagues:ladder` — league ladder endpoints
- `service:pvp_matches` — PvP match endpoints
- `service:pvp_matches:ladder` — PvP ladder endpoints
- `service:psapi` — public stash stream
- `service:cxapi` — currency exchange history
- `account:guild:stashes` — guild stash access, marked by the docs as special-request only

## Parameters, pagination, and format notes
- `realm` is reused across many endpoints and can vary by route:
  - broadest set: `pc`, `xbox`, `sony`, `poe2`
  - PoE1-only ladders and PvP routes omit `poe2`
  - account-path variants often treat omitted realm as PoE1 PC by default
- Item-filter routes use JSON request bodies and optional `validate=true` query validation.
- League listing uses `limit` and `offset`; docs cap `limit` at `50`.
- League ladder routes use `limit` and `offset`; docs default to `20`, cap at `500`, and limit total addressable ladder entries to `15000`.
- PvP ladder uses `limit` and `offset`; docs default to `20`, cap at `200`, and also limit the ladder to `15000` entries.
- Public stash streaming uses `id=<next_change_id>` for cursor-style polling. If `stashes` is empty, callers should keep polling the same `next_change_id` until new results appear.
- Currency exchange uses `next_change_id` as an hourly unix timestamp. If the returned `next_change_id` matches the requested hour, callers have reached the current end of available history and should wait until the next hourly boundary.
- Responses are documented as JSON throughout the API reference.

## Error handling and rate limits
Official docs state:
- Common HTTP statuses:
  - `200 OK`
  - `202 Accepted`
  - `400 Bad Request`
  - `404 Not Found`
  - `429 Too many requests`
  - `500 Internal Server Error`
- Standard JSON error envelope:
  ```json
  {
    "error": {
      "code": 2,
      "message": "Invalid query"
    }
  }
  ```
- Documented internal error codes:
  - `0` Accepted
  - `1` Resource not found
  - `2` Invalid query
  - `3` Rate limit exceeded
  - `4` Internal error
  - `5` Unexpected content type
  - `6` Forbidden
  - `7` Temporarily Unavailable
  - `8` Unauthorized
  - `9` Method not allowed
  - `10` Unprocessable Entity
- Invalid-request threshold: too many HTTP `4xx` responses in a short period can cause temporary restriction.
- Rate limits are dynamic and communicated by headers rather than one fixed public quota. The docs explicitly describe:
  - `X-Rate-Limit-Policy`
  - `X-Rate-Limit-Rules`
  - `X-Rate-Limit-{$rule}`
  - `X-Rate-Limit-{$rule}-State`
  - `Retry-After`
- The docs warn that repeated limit violations can get application access revoked.

## Live checks observed in this pass
- `GET https://api.pathofexile.com/profile` without a bearer token returned `401` with JSON body `{"error":{"code":8,"message":"Unauthorized"}}`.
- `GET https://api.pathofexile.com/league?limit=1` without a bearer token also returned `401` with the same JSON error shape.
- These live checks match the docs' general requirement that almost all API usage is authorized.

## Usage notes
- The docs explicitly say there are currently only limited APIs returning PoE2 game information.
- The public-stash docs explicitly note a current five-minute delay in the exposed stream.
- Currency-exchange responses are hourly digests only; there is no documented route for the current hour's in-progress market state.
- Executables that interact with the game or game files are explicitly forbidden by the developer-policy section.
- Grinding Gear Games warns that route details and availability may change without notice.

## Integration notes for fireROUTE
- Treat this provider as an OAuth-gated JSON API with `22` confirmed route patterns, not as a public no-auth feed.
- Preserve PoE1-only labeling because several routes are absent from the current PoE2 surface.
- Do not flatten the scope model: `account:*` and `service:*` scopes have materially different registration requirements, especially for public clients.
- Model `public-stash-tabs` and `currency-exchange` as cursor/stream style feeds rather than ordinary page-number lists.
- Handle `202 Accepted` distinctly on item-filter updates because the docs say an additional `error` object may accompany delayed processing.

## Sources inspected
- `https://www.pathofexile.com/developer/docs`
- `https://www.pathofexile.com/developer/docs/reference`
- `https://www.pathofexile.com/developer/docs/authorization`
- live fetch check: `https://api.pathofexile.com/profile`
- live fetch check: `https://api.pathofexile.com/league?limit=1`
