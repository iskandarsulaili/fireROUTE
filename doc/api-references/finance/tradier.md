# Tradier

Official docs manually reviewed:
- https://developer.tradier.com/
- https://docs.tradier.com/docs/endpoints
- https://docs.tradier.com/reference
- https://docs.tradier.com/reference/brokerage-api-user-get-profile
- https://docs.tradier.com/docs/response-format
- https://docs.tradier.com/docs/error-responses
- https://docs.tradier.com/docs/rate-limiting
- https://docs.tradier.com/docs/authentication

## Overview
Tradier provides a brokerage + market-data API with separate live, sandbox, and streaming hosts.

From the reviewed official docs:
- Live REST base: `https://api.tradier.com/v1/`
- Live streaming base: `https://stream.tradier.com/v1/`
- Sandbox REST base: `https://sandbox.tradier.com/v1/`
- Protocol: HTTPS with TLS 1.2 and SNI support
- Default/primary response format in current examples: JSON via `Accept: application/json`

The current API reference navigation exposes **44 operations** across user, accounts, trading, market data, streaming, and watchlists.

## Authentication
The reviewed docs describe two related access models.

### Personal / app token usage
The OAuth guide explicitly states that individual developers can call the API using their API Token or Sandbox Token from API Settings.

The reviewed reference page for `GET /v1/user/profile` shows the credential style as:

```http
Authorization: Bearer <ACCESS_TOKEN>
Accept: application/json
```

### OAuth 2.0 partner flow
The reviewed OAuth page documents Authorization Code flow for partner/public applications.

Confirmed OAuth details:
- authorization endpoint: `https://api.tradier.com/v1/oauth/authorize`
- access-token exchange endpoint: `POST https://api.tradier.com/v1/oauth/accesstoken`
- refresh endpoint: `POST https://api.tradier.com/v1/oauth/refreshtoken`
- token exchange auth: HTTP Basic authentication using `clientID:clientSecret` (Base64-encoded)
- authorization code lifetime: **10 minutes**
- bearer access-token lifetime: **24 hours**
- refresh tokens: non-expiring, partner-only access

Confirmed scopes from the reviewed page:
- `read`
- `write`
- `market`
- `trade`
- `stream`

## Confirmed endpoints
The following current routes were manually confirmed from the official reference.

| Method | Path | Purpose |
|---|---|---|
| GET | `/user/profile` | Retrieve the current user's profile and linked accounts |
| GET | `/accounts/{account_id}/balances` | Account balance details |
| GET | `/accounts/{account_id}/positions` | Open positions for an account |
| GET | `/accounts/{account_id}/history` | Historical account activity |
| GET | `/accounts/{account_id}/orders` | List account orders |
| POST | `/accounts/{account_id}/orders` | Place an order |
| PUT | `/accounts/{account_id}/orders/{id}` | Change an order |
| DELETE | `/accounts/{account_id}/orders/{id}` | Cancel an order |
| GET | `/markets/quotes` | Quote lookup |
| POST | `/markets/events/session` | Create a market-streaming session |
| POST | `/watchlists` | Create watchlist |

Manual route count confirmed from the current official reference sidebar: **44** operations.

## Confirmed parameter and response details

### `GET /user/profile`
Confirmed from the reviewed reference page.

Reviewed characteristics:
- full URL on page: `https://api.tradier.com/v1/user/profile`
- required header: `Accept: application/json`
- bearer token auth shown by the page's credential widget

Confirmed response shape highlights:
- root `profile` object
- `profile.id`
- `profile.name`
- `profile.account[]`
- account item fields shown on page include `account_number`, `classification`, `date_created`, `day_trader`, `option_level`, `status`, `type`, `last_update_date`

Confirmed statuses shown on the page:
- `200`
- `401`

### Accounts/trading route families
The reviewed reference navigation confirms these path families exist under the live base:
- `/accounts/{account_id}/balances`
- `/accounts/{account_id}/positions`
- `/accounts/{account_id}/history`
- `/accounts/{account_id}/gainloss`
- `/accounts/{account_id}/orders`
- `/accounts/{account_id}/orders/{id}`
- `/accounts/{account_id}/position_groups`

The reviewed reference also confirms advanced trading variants including equity, option, multileg, combo, OCO, OTO, and OTOCO order creation pages.

### Market-data route families
The reviewed reference navigation confirms current market-data endpoints for:
- `/markets/quotes` via GET and POST forms
- options chains
- options strikes
- options expirations
- option symbol lookup
- historical pricing
- time & sales
- ETB securities
- market clock
- market calendar
- market search
- market lookup

### Streaming route families
The reviewed reference navigation confirms:
- HTTP streaming docs
- WebSocket market-data streaming docs
- WebSocket account-data streaming docs
- market session creation endpoint
- account session creation endpoint

## Rate limits
The reviewed official rate-limiting guide explicitly states the following per-access-token, per-minute limits.

| Scope family | Production | Sandbox |
|---|---:|---:|
| Standard (`/accounts`, `/watchlists`, `/users`, `/orders`, excluding placing orders) | 120 req/min | 60 req/min |
| Market data (`/markets`) | 120 req/min | 60 req/min |
| Trading (`trade` scope resources) | 60 req/min | 60 req/min |

Additional reviewed notes:
- rate limits are enforced over 1-minute intervals
- headers returned include `X-Ratelimit-Allowed`, `X-Ratelimit-Used`, `X-Ratelimit-Available`, and `X-Ratelimit-Expiry`
- the docs recommend streaming instead of quote polling where possible

## Pagination
The reviewed excerpts did not expose one universal pagination contract. Collection routes such as orders, positions, history, and watchlists are confirmed, but pagination/query semantics should be treated as endpoint-specific during fireROUTE adapter implementation.

## Errors
The reviewed error page confirms:
- `400` responses include a response body with an error message
- `401` indicates authentication or entitlement issues
- `500` indicates Tradier-side failures

The reviewed docs also note “order related errors” as a separate concern in the error guide.

## Response format
The reviewed response-format guide confirms:
- default response format is XML if `Accept` is omitted
- JSON is requested with `Accept: application/json`
- XML is requested with `Accept: application/xml`
- XML support is planned for removal in future versions
- JSON is produced via XML-to-JSON translation today, and arrays may sometimes vary between object-vs-array presentation depending on returned data
- gzip compression is supported with `Accept-Encoding: gzip`

## Important usage notes
- Tradier separates live trading, sandbox trading, and streaming onto different hosts.
- Personal API token use and OAuth partner flows coexist; do not assume every integration needs the full OAuth authorization-code loop.
- JSON is recommended by Tradier, even though XML remains the historical default.
- Array/object shape drift in JSON is an official caveat and should be normalized carefully by fireROUTE adapters.
- Rate limits differ materially between standard, market-data, and trading scopes.

## fireROUTE notes
- Treat Tradier as a brokerage + market-data provider with distinct live/sandbox/stream hosts.
- Good default normalized routes are `GET /user/profile`, `GET /accounts/{account_id}/balances`, `GET /accounts/{account_id}/positions`, `GET /markets/quotes`, and `POST /accounts/{account_id}/orders`.
- Preserve response-format negotiation and bearer-auth metadata at the provider layer.
- Prefer streaming for quote-heavy workloads to avoid consuming market-data quota.
