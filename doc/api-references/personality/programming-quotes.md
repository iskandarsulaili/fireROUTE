# Programming Quotes

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://github.com/mudroljub/programming-quotes-api`
  - `https://programming-quotes-api.azurewebsites.net/api/quotes/random`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The official GitHub repository still documents a public Programming Quotes API and names `programming-quotes-api.azurewebsites.net` as the live host.
- In this review, the obvious public route `https://programming-quotes-api.azurewebsites.net/api/quotes/random` failed DNS resolution with `net::ERR_NAME_NOT_RESOLVED`.
- Because the provider's documented host is no longer reachable, no current live route contract can be confirmed for fireROUTE even though the repository README preserves historical route docs.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://github.com/mudroljub/programming-quotes-api`
- Result: loaded successfully with title `GitHub - mudroljub/programming-quotes-api: Programming Quotes API for open source projects. · GitHub`
- The README documents these historical routes:
  - `GET /api/quotes/random`
  - `GET /api/quotes`
  - `GET /api/quotes/{id}`
  - `POST /api/quotes/favorite/{id}`
  - `POST /api/quotes/vote/{id}`
  - `POST /api/quotes`
  - `PUT /api/quotes/{id}`
  - `DELETE /api/quotes/{id}`
  - `POST /api/auth/token`
- The README also documents bearer-token auth for protected routes and query parameters `page`, `quotesPerPage`, and `author` for quote listing.

### Official page attempt 2
- URL: `https://programming-quotes-api.azurewebsites.net/api/quotes/random`
- Result: navigation failed with `net::ERR_NAME_NOT_RESOLVED`
- Because the named production host could not be resolved, the historical route list from the README cannot be treated as a currently live contract.

## fireROUTE note
- Treat Programming Quotes as an official-host continuity blocker.
- Keep the README-derived route list as historical context only until a working first-party host is restored.

## Sources inspected
- `https://github.com/mudroljub/programming-quotes-api`
- `https://programming-quotes-api.azurewebsites.net/api/quotes/random`
