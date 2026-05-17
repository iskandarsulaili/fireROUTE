# DropMail

Official docs manually reviewed:
- https://dropmail.me/api/
- https://dropmail.me/api/#live-demo

## Overview
DropMail exposes disposable inbox functionality through a GraphQL API rather than a traditional REST resource tree.

From the reviewed official API page:
- HTTP endpoint: `https://dropmail.me/api/graphql/${AUTH_TOKEN}`
- WebSocket endpoint: `wss://dropmail.me/api/graphql/${AUTH_TOKEN}/websocket`
- Format: GraphQL
- Real-time delivery: WebSocket and long-poll push
- Auth model: token embedded in the path as `${AUTH_TOKEN}`

The reviewed docs also explicitly position DropMail as:
- no-sign-up access with free tokens
- disposable inbox/session creation
- real-time mail reception and reading
- browser-usable GraphQL examples

## Authentication
The official docs currently require a free token with the `af_…` prefix.

Confirmed notes from the reviewed API page:
- token is supplied in the URL path as `${AUTH_TOKEN}`
- no account is required to obtain a free token
- arbitrary legacy string tokens are deprecated
- legacy tokens will be rejected starting **April 2026**
- tokens generated before **2026-04-05** were corrupted by a server-side bug and should be replaced with newly generated tokens

The reviewed token form shows these token durations:
- `1 hour`
- `1 day`
- `7 days (captcha)`
- `30 days (captcha)`
- `90 days (captcha)`

## Confirmed API transports / route surfaces
Because DropMail is GraphQL-first, the official docs expose transport endpoints plus named GraphQL example operations instead of many REST-style routes.

| Transport | Path / URL | Purpose |
|---|---|---|
| HTTP GraphQL | `/api/graphql/${AUTH_TOKEN}` | Queries and mutations over HTTPS |
| WebSocket GraphQL | `/api/graphql/${AUTH_TOKEN}/websocket` | Real-time GraphQL subscriptions |

Manual route count confirmed from the reviewed official docs: **2** transport endpoints.

## Confirmed documented GraphQL workflows / operations
The left-hand example navigation on the official page explicitly exposes these example operations/workflows:
- `List domains`
- `Introduce session`
- `List all sessions`
- `Add one more address to the session`
- `Query a specific session`
- `Subscribe to new session mail`
- `Try your own query`

The workflow section also explicitly documents these higher-level flows:
- `Creating a Session with single random Address`
- `Fetching the incoming mail`
- `Custom addresses`
- `Personal domains`

And the MCP example shown on the same page demonstrates the practical sequence:
- `create_session`
- `wait_for_email`
- `read_email`

## Request / response model
Confirmed from the reviewed page:
- request/response model is GraphQL over JSON
- schema is published on the official page as `schema.graphql`
- the “Try it from your browser” section documents browser-executable GraphQL queries
- realtime inbox updates are handled through subscriptions over the WebSocket endpoint

The currently reviewed page did not expose a compact REST-style parameter table in the visible snapshot, so fireROUTE should treat request fields as GraphQL operation-specific rather than fixed query/body parameters across the whole provider.

## Rate limits
The reviewed page contains explicit token/rate-limit warnings, including:
- legacy arbitrary-string tokens are now much more restricted than `af_…` tokens
- as of the 2026-05-04 news item, legacy anonymous tokens are limited to roughly one address per minute, one mail per minute, and a fixed seven-second delay per API call
- the page advises switching to free `af_…` tokens, which are described as allowing about 1000x more requests than the legacy anonymous tokens

The visible browser-reviewed excerpt did not expose a full numeric rate-limit table for fresh `af_…` tokens, so only the above officially visible limits are recorded here.

## Pagination
No conventional REST pagination model is documented in the reviewed top-level summary. Query/result shaping is GraphQL-driven and operation-specific.

## Errors
The official docs navigation includes dedicated sections for:
- `HTTP 403`
- `GraphQL errors`
- `Rate Limiting`

From the reviewed page, the main explicit blocker/error behavior confirmed is:
- token/auth failures and rate-limit issues are first-class documented concerns
- legacy token behavior is intentionally being restricted and then disabled

The visible browser-reviewed excerpt did not expose the full error payload schema, so fireROUTE should preserve provider error bodies verbatim.

## Important usage notes
- DropMail is not a REST mailbox API; it is a GraphQL service with one HTTP transport endpoint and one WebSocket subscription endpoint.
- The token is part of the URL path, not a bearer header.
- Use fresh `af_…` tokens only; do not rely on arbitrary-string legacy tokens.
- The docs actively warn that tokens created before `2026-04-05` should be regenerated rather than renewed.
- For near-real-time inbox monitoring, prefer the WebSocket endpoint and the documented “Subscribe to new session mail” flow.

## fireROUTE notes
- Model DropMail as a GraphQL email-session provider rather than trying to invent REST resources.
- Canonical adapter behavior should focus on session creation, waiting/subscribing for incoming mail, and reading message contents.
- Preserve raw GraphQL operations or expose a thin normalized abstraction over the documented session/mail workflows.
