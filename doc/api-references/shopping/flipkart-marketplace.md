# Flipkart Marketplace

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://seller.flipkart.com/api-docs/FMSAPI.html#api-integration`
  - `https://seller.flipkart.com/`
  - `https://api.flipkart.net/oauth-service/oauth/authorize`
  - `https://api.flipkart.net/oauth-service/oauth/token`
  - `https://api.flipkart.net/oauth-service/oauth/token/expiry`
- Manual review outcome: `manually_documented`
- Confirmed route count: `3`

## API overview
- Base URL: `https://api.flipkart.net`
- Primary official docs entry reviewed: `https://seller.flipkart.com/api-docs/FMSAPI.html#api-integration`
- Authentication model: OAuth-style seller API flow documented on the official seller docs page and backed by the live `api.flipkart.net` auth routes
- Transport: HTTPS
- Response format: the reviewed docs/examples describe JSON token responses and token-query workflows
- Rate limits: no numeric public quota was surfaced on the reviewed pages in this pass

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/oauth-service/oauth/authorize` | Starts the Flipkart seller authorization/login flow. A live browser request redirected to `https://api.flipkart.net/oauth-service/login.jsp`, confirming the auth entrypoint is active. |
| GET | `/oauth-service/oauth/token` | Token exchange route shown in the official docs examples, including `grant_type=client_credentials` and refresh-token usage. A live browser request with dummy credentials failed with auth-credential validation rather than `404`, confirming the route is active. |
| GET | `/oauth-service/oauth/token/expiry` | Token-inspection route shown in official examples for access and refresh tokens via `token_type` and `token`. A live browser request with dummy values failed with auth-credential validation rather than route-not-found. |

## Confirmed parameters and auth fields
The reviewed official docs/examples surfaced these parameters and auth fields:
- `grant_type`
- `scope`
- `redirect_uri`
- `code`
- `refresh_token`
- `state`
- `token_type`
- `token`

## Authentication notes
- The seller API docs page is framed as Flipkart Marketplace Seller API documentation rather than a simple public anonymous API.
- The live `authorize` route redirects into Flipkart login, which is consistent with an interactive authorization/consent step.
- The live `token` and `token/expiry` routes rejected dummy requests with invalid-auth-credentials behavior, which confirms active credential checks on the auth host.

## Errors, pagination, and format notes
- No pagination model was exposed for the reviewed auth routes.
- No provider-wide numeric rate-limit table was visible on the reviewed pages in this pass.
- Live invalid test requests hit credential-validation failures, so callers should expect authenticated error handling on the auth host.

## Important usage notes
- In this browser session, the official seller docs entrypoint was reachable and identified as `Flipkart Marketplace Seller APIs — Developer API v3.0 documentation`, but the broader seller resource catalog was not stably readable enough for a trustworthy route-by-route rewrite beyond the auth flow.
- For fireROUTE, treat Flipkart Marketplace as an authenticated seller integration whose currently confirmed public surface in this pass is the OAuth/auth bootstrap layer.
- Do not assume additional seller resource routes from historical snippets until they are rechecked from stable first-party docs pages.

## Sources inspected
- `https://seller.flipkart.com/api-docs/FMSAPI.html#api-integration`
- `https://seller.flipkart.com/`
- `https://api.flipkart.net/oauth-service/oauth/authorize`
- `https://api.flipkart.net/oauth-service/oauth/token`
- `https://api.flipkart.net/oauth-service/oauth/token/expiry`
