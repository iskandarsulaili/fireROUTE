# NBA Data

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `nba-data`
- Official docs/pages used:
  - `https://rapidapi.com/api-sports/api/api-nba/`
  - `https://www.api-sports.io/documentation/nba/v1`
  - `https://www.api-sports.io/`
- Current public API base URL: none confirmed from the reviewed official pages in this environment
- Auth model: unconfirmed during review because no reachable route-level official API reference was available
- Response format: no route-level API response format could be confirmed from the reviewed official pages in this environment
- Public rate-limit note: no official numeric quota could be confirmed from the reviewed pages in this environment
- Manually confirmed route count: `0`

## Why no public routes were confirmed
- The indexed RapidAPI product page no longer exposed a working API reference; during review it resolved to RapidAPI's server-error page stating `API not found.`
- The obvious official alternative documentation page on `api-sports.io` failed DNS resolution in this environment (`net::ERR_NAME_NOT_RESOLVED`).
- The official `api-sports.io` root domain also failed DNS resolution in this environment, preventing route-level verification through the provider's own site.

## Official pages reviewed
### `https://rapidapi.com/api-sports/api/api-nba/`
- The reviewed page resolved to `https://rapidapi.com/server-error?code=NOT_FOUND&message=API%20not%20found.`
- Because the product page returned an API-not-found error, no endpoint list or auth details were available for manual confirmation.

### `https://www.api-sports.io/documentation/nba/v1`
- Browser navigation returned `net::ERR_NAME_NOT_RESOLVED`.

### `https://www.api-sports.io/`
- Browser navigation returned `net::ERR_NAME_NOT_RESOLVED`.

## Response, pagination, and error notes
- No official route list, request schema, pagination contract, or error model could be confirmed from the reviewed official pages in this environment.
- Because the accessible RapidAPI page was already in an error state, even basic host/path verification remained blocked.

## Usage notes from the official pages
- The reviewed RapidAPI product URL appears stale or removed.
- A future re-review may succeed if API-Sports restores its public docs host or RapidAPI republishes the product page with live reference content.

## fireROUTE normalization notes
- Treat this provider as a manual blocker with zero confirmed routes for now.
- Do not infer API-SPORTS NBA paths from other API-SPORTS products without a fresh official-doc review.
- Reattempt only when at least one official docs surface becomes reachable again.
