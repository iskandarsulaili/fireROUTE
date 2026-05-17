# AniList

## Overview
- Provider: AniList API
- Category: Anime
- Official docs: `https://docs.anilist.co/`
- Primary API endpoint URL: `https://graphql.anilist.co`
- API style: GraphQL over HTTP
- Auth: optional for public read-only data; OAuth 2.0 required for private user data and mutations
- Supported OAuth flows documented by AniList:
  - Authorization Code Grant
  - Implicit Grant
- OAuth implementation notes from the official docs:
  - scopes are not supported
  - access tokens remain valid for `1 year`
  - refresh tokens are not supported
- HTTPS: yes
- Response format: JSON
- Pagination: GraphQL `Page` query with `pageInfo`
- Rate limits documented by AniList:
  - normal limit: `90 requests per minute`
  - current temporary degraded-state limit noted in docs: `30 requests per minute`

## Confirmed API endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| POST | `/` | JSON body with required `query`; optional `variables`; optional `Authorization: Bearer TOKEN` header | The docs explicitly state that all AniList GraphQL requests are sent as `POST` requests to `https://graphql.anilist.co`. |

## Request structure
- Required request body field:
  - `query` — GraphQL query or mutation string
- Optional request body field:
  - `variables` — JSON object supplying GraphQL variables
- Recommended headers shown in the official examples:
  - `Content-Type: application/json`
  - `Accept: application/json`
- For authenticated requests, AniList requires:
  - `Authorization: Bearer TOKEN`

## Authentication model
- Authentication is **not required** for publicly available data such as anime/manga metadata, character search, and public or unlisted user data.
- Authentication **is required** for:
  - modifying user lists
  - reading the current user's private data
  - requesting user-specific fields on other objects, such as `mediaListEntry`
- Official OAuth endpoints documented by AniList:
  - authorization URL: `https://anilist.co/api/v2/oauth/authorize`
  - token URL: `https://anilist.co/api/v2/oauth/token`
- Authorization Code Grant parameters shown in the docs:
  - `client_id`
  - `redirect_uri`
  - `response_type=code`
- Token exchange fields shown in the docs example body:
  - `grant_type=authorization_code`
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `code`
- The docs also document an auth-pin redirect flow at `https://anilist.co/api/v2/oauth/pin` for clients that cannot use normal redirects.

## Pagination notes
- AniList paginates list-style queries through the GraphQL top-level `Page` query.
- The docs say top-level queries like `Media`, `Character`, and `Staff` return a single object; for multiple objects you wrap the query in `Page`.
- `Page` may contain only **one** paginated data field per query, plus optional `pageInfo`.
- The docs explicitly warn that `PageInfo.total` and `PageInfo.lastPage` are currently unreliable because of degradation/performance issues.
- AniList says clients should rely on `pageInfo.hasNextPage` for pagination logic.
- Example `pageInfo` fields shown in the docs include:
  - `currentPage`
  - `hasNextPage`
  - `perPage`

## Response format notes
- Successful GraphQL responses return a top-level `data` object.
- AniList errors are returned in a top-level `errors` array.
- The docs explicitly warn that you may still receive an error payload even when the HTTP status code is `200`.
- Official error examples include fields such as:
  - `message`
  - `status`
  - `locations[].line`
  - `locations[].column`
- Validation failures on mutations may also include a `validation` object keyed by input field name.

## Rate limits and headers
- AniList documents these response headers for successful requests:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
- When rate limited, the docs say responses include:
  - HTTP `429 Too Many Requests`
  - `Retry-After`
  - `X-RateLimit-Reset`
- `Retry-After` is documented as seconds until retry.
- `X-RateLimit-Reset` is documented as the Unix timestamp when requests may resume.
- The docs also mention a separate burst limiter on top of the per-minute limit.

## Error handling
- Officially documented/illustrated situations include:
  - invalid queries
  - missing arguments
  - requesting unavailable fields
  - validation failures on mutations
  - rate limiting (`429`)
- Official rate-limit example error body:
  - `data: null`
  - `errors[0].message: "Too Many Requests."`
  - `errors[0].status: 429`

## Integration notes for fireROUTE
- Treat AniList as a single GraphQL POST surface rather than a REST collection of resource paths.
- Preserve the `query` / `variables` request-body contract exactly.
- Do not require OAuth for public-read adapters unless the selected query needs user-private or mutation capability.
- For paginated adapters, rely on `hasNextPage` instead of `total` / `lastPage`.
- Backoff logic should honor `Retry-After` and `X-RateLimit-Reset`.

## Sources inspected
- `https://docs.anilist.co/`
- `https://docs.anilist.co/guide/graphql/`
- `https://docs.anilist.co/guide/rate-limiting`
- `https://docs.anilist.co/guide/graphql/pagination`
- `https://docs.anilist.co/guide/graphql/errors`
- `https://docs.anilist.co/guide/auth/`
- `https://docs.anilist.co/guide/auth/authorization-code`
- `https://docs.anilist.co/guide/auth/authenticated-requests`
