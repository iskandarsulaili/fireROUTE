# Cloudbet

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `cloudbet`
- Official docs/pages used:
  - `https://www.cloudbet.com/api/`
  - `https://github.com/cloudbet/docs`
- Public API definitions visibly exposed on the reviewed docs page: `Feed`, `Trading (deprecated)`, `Trading - New`, `Trading B2B`, `Account`
- Current public Feed API base URL confirmed from official cURL samples: `https://sports-api.cloudbet.com/pub/v2`
- Auth model: API key in a custom request header
- Required auth header from the reviewed docs: `X-API-Key`
- Response formats explicitly documented on the reviewed page: JSON, binary protobuf
- Public rate-limit note: no numeric rate limit was published on the reviewed public pages
- Manually confirmed route count: `2`

## Authentication and access
- The Feed API docs say Cloudbet uses a long-lived `API Key` that follows the JWT authentication standard.
- The reviewed docs require sending the key in the `X-API-Key` header.
- The page distinguishes Trading API keys from Affiliate API keys:
  - Trading API keys come from a logged-in player account under `My account -> API`.
  - Affiliate API keys come from the affiliate-side `Affiliate API Token` page.
- The docs warn that Affiliate API responses may be cached and up to 1 minute behind, while Trading API keys provide real-time updates.

## Canonical endpoints
1. `GET /sports` - example Feed API endpoint called out directly by the Swagger UI instructions
2. `GET /odds/competitions/{competition}` - fetch odds for one competition; official cURL samples show repeated `markets` filters for leagues such as `soccer-england-premier-league` and `baseball-usa-mlb`

## Parameters and request notes
### Headers
- `X-API-Key` - required API key header for Feed API requests
- The reviewed page says to send `Content-Type: application/json` for JSON responses or `Content-Type: application/x-protobuf` for binary protobuf responses

### Path parameters
- `competition` - competition slug in the odds-by-competition route, for example `soccer-england-premier-league` or `baseball-usa-mlb`

### Query parameters
- `markets` - repeatable query parameter used in the official cURL samples to request specific market groups such as `soccer.matchOdds`, `soccer.asianHandicap`, `soccer.totalGoals`, `baseball.moneyline`, `baseball.totals`, and `baseball.runLine`

## Response, pagination, and error notes
- The reviewed docs explicitly say Feed API responses are available as JSON or binary protobuf.
- The reviewed public pages do not publish a numeric rate limit.
- I did not find public pagination guidance on the reviewed Feed API landing page.
- I did not find a shared public error-code table in the reviewed public text.

## Usage notes from the official docs
- The docs page is a Swagger UI/OpenAPI landing page for Cloudbet's API families, but the stable public text rendered in this environment was the Feed API definition.
- The page instructs users to authorize inside the Swagger UI with `X-API-Key`, then use `Try it out` and `Execute` on endpoints such as `/sports`.
- The official docs repo describes Cloudbet as exposing Feed, Trading, and Account APIs, but the route-level details I could manually confirm in stable public text during this pass were limited to the Feed examples above.

## fireROUTE normalization notes
- Normalize the manually confirmed public surface as a header-authenticated sports odds feed rooted at `https://sports-api.cloudbet.com/pub/v2`.
- Preserve `X-API-Key` as a first-class auth header.
- Preserve repeatable `markets` query parameters on competition-odds requests.
- Treat protobuf as an optional transport/format variant rather than assuming JSON-only behavior.