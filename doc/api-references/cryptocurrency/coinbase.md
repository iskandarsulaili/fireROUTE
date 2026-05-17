# Coinbase

Official pages manually reviewed:
- https://docs.cdp.coinbase.com/coinbase-app/introduction/welcome
- https://docs.cdp.coinbase.com/coinbase-app/introduction/get-started
- https://docs.cdp.coinbase.com/coinbase-app/authentication-authorization/api-key-authentication
- https://docs.cdp.coinbase.com/coinbase-app/authentication-authorization/authorization
- https://docs.cdp.coinbase.com/coinbase-app/authentication-authorization/legacy-keys
- https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/overview
- https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/rest-api
- https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/faq
- https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-overview
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/send-crypto
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/onchain-addresses
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/deposit-fiat
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/withdraw-fiat
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/travel-rule
- https://docs.cdp.coinbase.com/coinbase-app/transfer-apis/vasps
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/accounts
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/transactions
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/currencies
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/exchange-rates
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/prices
- https://docs.cdp.coinbase.com/coinbase-app/track-apis/time
- https://docs.cdp.coinbase.com/coinbase-app/oauth2-integration/reference
- https://docs.cdp.coinbase.com/coinbase-app/oauth2-integration/oauth2-code-samples

## Overview
Coinbase’s current first-party consumer/API documentation is centered on `docs.cdp.coinbase.com` and splits into three major surfaces:
- Coinbase App REST `v2` endpoints on `https://api.coinbase.com/v2`
- Advanced Trade REST `v3` brokerage endpoints on `https://api.coinbase.com/api/v3/brokerage/{resource}`
- Coinbase App OAuth2 endpoints on `https://login.coinbase.com/oauth2`

The reviewed docs also document two Advanced Trade WebSocket production endpoints:
- `wss://advanced-trade-ws.coinbase.com`
- `wss://advanced-trade-ws-user.coinbase.com`

What was directly confirmed from the reviewed official pages:
- Consumer REST base: `https://api.coinbase.com/v2`
- Advanced Trade REST base: `https://api.coinbase.com/api/v3/brokerage`
- OAuth2 base: `https://login.coinbase.com/oauth2`
- Advanced Trade WebSocket bases: `wss://advanced-trade-ws.coinbase.com` and `wss://advanced-trade-ws-user.coinbase.com`
- Directly confirmed HTTP route count from the reviewed official pages: **75** unique endpoints (`53` `GET`, `19` `POST`, `1` `PUT`, `2` `DELETE`)
- Additional documented real-time transport surface: **2** WebSocket endpoints (not counted in the HTTP route total)

## Authentication
### API keys / JWT
From the reviewed Coinbase App authentication pages:
- API key authentication should only be used to access **your own** Coinbase account.
- Coinbase App API keys are created through the Coinbase Developer Platform (CDP).
- Coinbase App requires **ECDSA / ES256** keys; the reviewed page explicitly says **Ed25519 is not supported** for Coinbase App SDK/API use.
- CDP API keys are used to generate a **JWT**, which is then sent as `Authorization: Bearer <JWT>`.
- The reviewed `Authorization` page documents the simple API-key permission set as:
  - `View`
  - `Trade`
  - `Transfer`
  - `Receive`

### OAuth2
From the reviewed OAuth2 reference and code-samples pages:
- OAuth2 is the recommended model for securely accessing the accounts of **other Coinbase users**.
- Confirmed OAuth2 endpoints:
  - `GET https://login.coinbase.com/oauth2/auth`
  - `POST https://login.coinbase.com/oauth2/token`
  - `POST https://login.coinbase.com/oauth2/revoke`
- The reviewed authorization page says OAuth uses a more granular `service-name:resource:action` style scope model.

### Legacy keys
From the reviewed legacy-keys page:
- Coinbase expired all legacy API keys in **February 2025**.
- The page explicitly says legacy keys are no longer supported and directs integrators to create new CDP API keys.

## Parameters and request notes
### OAuth2 authorize parameters
The reviewed OAuth2 reference page explicitly documents these authorize parameters:
- `client_id`
- `response_type` (`code`)
- optional `redirect_uri`
- optional `scope`
- optional `state` (must be at least 8 characters)
- optional PKCE `code_challenge`
- optional `code_challenge_method` (`S256` recommended, or `plain`)
- optional `layout`
- optional `referral`

### OAuth2 token parameters
The reviewed token page explicitly documents:
- new-token exchange: `grant_type=authorization_code`, `code`, `client_id`, `client_secret`, `redirect_uri`, optional `code_verifier`
- refresh flow: `grant_type=refresh_token`, `refresh_token`, `client_id`, `client_secret`
- revoke flow: `token`, `client_id`, `client_secret`

### Coinbase App `v2` request notes
From the reviewed transfer and track pages:
- `:account_id`, `:address_id`, `:deposit_id`, `:withdrawal_id`, and `:transaction_id` are common path identifiers on consumer-account routes.
- `:currency_pair` is used on price routes such as `BTC-USD`.
- `GET /v2/prices/:currency_pair/spot` supports optional historical `date`.
- `GET /v2/exchange-rates` supports optional `currency` to set the base currency.
- `POST /v2/accounts/:account_id/transactions` (`Send Money`) documents these body fields:
  - required `type=send`
  - required `to`
  - required `amount`
  - required `currency`
  - optional `description`
  - optional `skip_notifications`
  - optional idempotency token `idem`
  - optional `destination_tag`
  - optional `network`
  - optional `travel_rule_data`
- The Travel Rule guide documents fields inside `travel_rule_data`, including `beneficiary_wallet_type`, `is_self`, `beneficiary_name`, `beneficiary_address`, `beneficiary_financial_institution`, and `transfer_purpose`.
- The reviewed VASP page provides the official lookup table for valid `beneficiary_financial_institution` values.
- Fiat deposit/withdrawal pages explicitly note that flows can be started with `commit: false` and later finalized with the corresponding commit endpoint.

### Advanced Trade / WebSocket request notes
From the reviewed Advanced Trade pages:
- Advanced Trade WebSocket messages are JSON objects with a top-level `type`.
- Clients must send a `subscribe` message within **5 seconds** of connection or be disconnected.
- Only one channel may be subscribed per subscription message.
- WebSocket subscriptions use `channel`, `product_ids`, and `jwt` fields.
- The reviewed WebSocket overview says JWTs for WebSocket messages expire after **2 minutes** and a different JWT should be generated for each message sent.

## Rate limits
- The reviewed Coinbase App, Advanced Trade, OAuth2, and WebSocket pages in this pass did **not** expose a numeric first-party rate-limit table.
- The reviewed docs therefore confirm authentication and permission models, but not a concrete per-second or per-minute quota.
- fireROUTE adapters should treat current rate limits as **undocumented on the reviewed public pages** and rely on normal `429` / retry-backoff handling.

## Pagination, format, and error notes
- The reviewed Coinbase App `v2` list examples return a top-level `data` payload and a `pagination` object.
- The reviewed transaction example explicitly shows `pagination` fields:
  - `ending_before`
  - `starting_after`
  - `limit`
  - `order`
  - `previous_uri`
  - `next_uri`
- The reviewed OAuth2 token reference shows token responses with:
  - `access_token`
  - `token_type` (`bearer`)
  - `expires_in`
  - `refresh_token`
  - `scope`
- The reviewed OAuth2 revoke page explicitly says it returns `200 OK` for both successful and unsuccessful revoke requests.
- The reviewed pages did not expose a single consolidated Coinbase-wide JSON error schema.

## Important usage notes
- Coinbase App API keys are for **self-account access**; OAuth2 is the officially documented path for acting on behalf of other users.
- The reviewed auth docs explicitly warn that Coinbase App integrations should use **ECDSA / ES256** CDP keys, not Ed25519.
- The reviewed send-money page states that when used with OAuth2 authentication, the endpoint requires **two-factor authentication**.
- The reviewed send-money page also says sends to phone numbers are temporarily disabled; blockchain-address and email sends remain documented.
- The reviewed send-money page describes the send flow as asynchronous and recommends polling transaction status afterward.
- The reviewed public price pages say buy/sell prices include Coinbase’s standard `1%` fee but exclude other fees such as bank/payment-method fees.
- The reviewed Advanced Trade FAQ says Coinbase Pro has been disabled and customers were migrated; new integrations should use Advanced Trade / current Coinbase App docs instead of Pro-era docs.
- The reviewed Advanced Trade overview table sometimes reuses the same resource string for multiple portfolio/perpetual operations; where that happens, the route inventory below preserves the exact resource strings shown on the official table.

## Confirmed endpoints

### OAuth2 endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `https://login.coinbase.com/oauth2/auth` | User authorization endpoint |
| POST | `https://login.coinbase.com/oauth2/token` | Exchange authorization code or refresh token |
| POST | `https://login.coinbase.com/oauth2/revoke` | Revoke active access token |

### Coinbase App REST `v2` endpoints
#### Accounts
| Method | Path | Notes |
|---|---|---|
| GET | `/v2/accounts` | List accounts |
| GET | `/v2/accounts/:account_id` | Show account |

#### Transactions / transfers
| Method | Path | Notes |
|---|---|---|
| POST | `/v2/accounts/:account_id/transactions` | Send money / send crypto |
| GET | `/v2/accounts/:account_id/transactions` | List transactions |
| GET | `/v2/accounts/:account_id/transactions/:transaction_id` | Show transaction |

#### Onchain addresses
| Method | Path | Notes |
|---|---|---|
| POST | `/v2/accounts/:account_id/addresses` | Create address |
| GET | `/v2/accounts/:account_id/addresses` | List addresses |
| GET | `/v2/accounts/:account_id/addresses/:address_id` | Show address |
| GET | `/v2/accounts/:account_id/addresses/:address_id/transactions` | List address transactions |

#### Fiat deposits
| Method | Path | Notes |
|---|---|---|
| POST | `/v2/accounts/:account_id/deposits` | Deposit funds |
| POST | `/v2/accounts/:account_id/deposits/:deposit_id/commit` | Commit deposit |
| GET | `/v2/accounts/:account_id/deposits` | List deposits |
| GET | `/v2/accounts/:account_id/deposits/:deposit_id` | Show deposit |

#### Fiat withdrawals
| Method | Path | Notes |
|---|---|---|
| POST | `/v2/accounts/:account_id/withdrawals` | Withdraw funds |
| POST | `/v2/accounts/:account_id/withdrawals/:withdrawal_id/commit` | Commit withdrawal |
| GET | `/v2/accounts/:account_id/withdrawals` | List withdrawals |
| GET | `/v2/accounts/:account_id/withdrawals/:withdrawal_id` | Show withdrawal |

#### Track/data APIs
| Method | Path | Notes |
|---|---|---|
| GET | `/v2/currencies` | Get fiat currencies |
| GET | `/v2/currencies/crypto` | Get cryptocurrencies |
| GET | `/v2/exchange-rates` | Get exchange rates |
| GET | `/v2/prices/:currency_pair/buy` | Get buy price |
| GET | `/v2/prices/:currency_pair/sell` | Get sell price |
| GET | `/v2/prices/:currency_pair/spot` | Get spot price |
| GET | `/v2/time` | Get current time |

### Advanced Trade REST `v3` endpoints
| Method | Path | Permission / notes |
|---|---|---|
| GET | `/accounts` | `view` |
| GET | `/accounts/:account_id` | `view` |
| POST | `/orders` | `trade` |
| POST | `/orders/batch_cancel` | `trade` |
| GET | `/orders/historical/batch` | `view` |
| GET | `/orders/historical/fills` | `view` |
| GET | `/orders/historical/{order_id}` | `view` |
| POST | `/orders/preview` | `view` |
| GET | `/best_bid_ask` | `view` |
| GET | `/product_book` | `view` |
| GET | `/products` | `view` |
| GET | `/products/{product_id}` | `view` |
| GET | `/products/{product_id}/candles` | `view` |
| GET | `/products/{product_id}/ticker` | `view` |
| GET | `/transaction_summary` | `view` |
| POST | `/convert/quote` | `trade` |
| POST | `/convert/{trade_id}` | `trade` |
| GET | `/convert/{trade_id}` | `view` |
| GET | `/portfolios` | `view` (List Portfolios) |
| POST | `/portfolios` | `view (any portfolio)` (Create Portfolio) |
| POST | `/portfolios` | `transfer (for source portfolio)` (Move Portfolio Funds) |
| GET | `/portfolios` | `view (for that portfolio)` (Get Portfolio Breakdown) |
| DELETE | `/portfolios` | `trade (for that portfolio)` (Delete Portfolio) |
| PUT | `/portfolios` | `trade (for that portfolio)` (Edit Portfolio) |
| GET | `/cfm/balance_summary` | `view` |
| GET | `/cfm.positions` | `view` |
| GET | `/cfm/positions/{product_id}` | `view` |
| POST | `/cfm/sweeps/schedule` | `transfer` |
| GET | `/cfm/sweeps` | `view` |
| DELETE | `/cfm/sweeps` | `transfer` |
| GET | `/cfm/intraday/margin_setting` | `view` |
| POST | `/cfm/intraday/margin_setting` | `trade` |
| GET | `/cfm/intraday/current_margin_window` | `view` |
| GET | `/intx/portfolio` | `view (for intx portfolio)` |
| GET | `/intx/positions` | `view (for intx portfolio)` (List Perpetuals Positions) |
| GET | `/intx/positions` | `view (for intx portfolio)` (Get Perpetuals Position) |
| GET | `/intx/balances` | `view (for intx portfolio)` |
| POST | `/intx/multi_asset_collateral` | `trade (for intx portfolio)` |
| POST | `/intx/allocate` | `transfer (for intx portfolio)` |
| GET | `/payment_methods` | `view` |
| GET | `/payment_methods/{payment_method_id}` | `view` |
| GET | `/key_permissions` | `view` |
| GET | `/time` | public server time |
| GET | `/market/product_book` | public product book |
| GET | `/market/products` | public products |
| GET | `/market/products/{product_id}` | public product detail |
| GET | `/market/products/{product_id}/candles` | public product candles |
| GET | `/market/products/{product_id}/ticker` | public market trades |

## WebSocket endpoints
| Endpoint | Purpose |
|---|---|
| `wss://advanced-trade-ws.coinbase.com` | Market Data feed |
| `wss://advanced-trade-ws-user.coinbase.com` | User Order Data feed |
