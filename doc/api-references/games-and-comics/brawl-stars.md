# Brawl Stars

## Overview
- Provider: `Brawl Stars`
- Category: `Games & Comics`
- Official docs URL: `https://developer.brawlstars.com/#/getting-started`
- Official pages inspected manually in this execution:
  - `https://developer.brawlstars.com/#/getting-started`
  - `https://developer.brawlstars.com/#/documentation`
  - `https://developer.brawlstars.com/api/`
  - `https://developer.brawlstars.com/api-docs/index.html`
- Manual status: `manual_blocked`
- Confirmed route count: `0`

## What the official site showed
- The public getting-started page remained readable and confirmed the high-level access model: developer account required, API key creation, IP allowlisting, JWT bearer-style token requirement, JSON UTF-8 responses, JSON error bodies, and enforced rate limits.
- `https://developer.brawlstars.com/#/documentation` redirected to `https://developer.brawlstars.com/#/login` and showed the login form instead of a public route catalog.
- `https://developer.brawlstars.com/api/` returned JSON `{"error":"session-not-found","description":"Session not found"}` in this execution.
- `https://developer.brawlstars.com/api-docs/index.html` loaded a Swagger UI shell, but it only showed `Failed to load API definition.` with `Fetch error response status is 404 undefined`.
- The Swagger UI source still referenced `game-api-token` and `game-api-url` cookies and injected a bearer `Authorization` header, confirming the route-level spec is session-gated and not publicly exposed in this worker context.

## Confirmed integration details
- Stable official API base URL: not publicly confirmable from a current unauthenticated first-party route reference.
- Endpoint paths manually tested:
  - `/#/getting-started`
  - `/#/documentation`
  - `/api/`
  - `/api-docs/index.html`
- Methods confirmed in this execution:
  - anonymous browser `GET` requests to the listed public URLs
- Parameters: the public getting-started page did not expose operation-level parameter tables.
- Authentication:
  - developer account required
  - API key required
  - key usage is restricted to configured source IP addresses
  - requests require a JSON Web Token / bearer token
- Rate limits:
  - the official getting-started page states the API enforces rate limitations
  - numeric limits were not publicly exposed on the readable pages inspected in this execution
- Pagination: not publicly confirmable from the readable first-party pages inspected in this execution.
- Errors confirmed manually:
  - `/api/` -> JSON `session-not-found`
  - Swagger UI -> API definition fetch failure because the session-gated spec URL was not available
- Format notes:
  - public getting-started content is HTML documentation
  - observed unauthenticated API failure response was JSON
  - route-level API schema was not publicly readable without the gated session context
- Important usage notes:
  - first-party high-level auth and response-format notes remain public
  - first-party route-level endpoint inventory is still gated behind login/session state, so fireROUTE cannot safely count or document operations from the public surface alone

## Why this remains blocked for fireROUTE
- fireROUTE needs a publicly verifiable first-party route inventory with operation-level paths, methods, and parameters.
- The public documentation page redirected to login, and the public Swagger shell could not load its API definition without session cookies.
- Without a readable official route catalog, fireROUTE cannot safely confirm route count, operation details, pagination rules, or endpoint-specific schemas.

## fireROUTE integration note
- Keep this provider in `manual_blocked` state until Supercell exposes a readable first-party route catalog or public OpenAPI document without login-gated session state.
- Keep the confirmed route count at `0` until the operation inventory is publicly visible and verifiable from official sources.

## Sources inspected
- `https://developer.brawlstars.com/#/getting-started`
- `https://developer.brawlstars.com/#/documentation`
- `https://developer.brawlstars.com/api/`
- `https://developer.brawlstars.com/api-docs/index.html`
