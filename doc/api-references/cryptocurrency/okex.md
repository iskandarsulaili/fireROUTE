# OKEx

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `okex`
- Official pages manually reviewed in this pass:
  - `https://www.okex.com/docs/`
  - `https://www.okx.com/docs-v5/en/`
- Current official ownership context confirmed from the reviewed pages: the legacy `OKEx` docs host is retired and the current first-party successor API reference lives under `OKX`
- Manually confirmed current route count for this provider entry: `379` REST method/path operations on `370` unique `/api/v5/...` paths

## Manual review result
I re-reviewed the dead legacy OKEx docs host and the current official OKX v5 reference. In this session, the current first-party docs were fully text-accessible, so this provider no longer needs to remain a blocker.

## What the official pages currently confirm
1. `https://www.okex.com/docs/` now fails with `ERR_NAME_NOT_RESOLVED`, confirming the old standalone OKEx docs host is retired.
2. `https://www.okx.com/docs-v5/en/` is the current official successor reference and exposes the production/demo base URLs, authentication rules, rate-limit guidance, error-code tables, and a large route inventory.
3. The reviewed docs describe one shared REST host pattern plus separate public/private/business WebSocket endpoints.
4. The reviewed docs also explicitly warn that some regions must not use `www.okx.com` for live API calls and instead must use the correct regional domain.

## Confirmed base URLs and environments
### Production
- REST base: `https://www.okx.com`
- REST path family: `/api/v5/...`
- Public WebSocket: `wss://ws.okx.com:8443/ws/v5/public`
- Private WebSocket: `wss://ws.okx.com:8443/ws/v5/private`
- Business WebSocket: `wss://ws.okx.com:8443/ws/v5/business`

### Demo trading
- Demo REST base: `https://www.okx.com`
- Demo REST note: add header `x-simulated-trading: 1`
- Demo public WebSocket: `wss://wspap.okx.com:8443/ws/v5/public`
- Demo private WebSocket: `wss://wspap.okx.com:8443/ws/v5/private`
- Demo business WebSocket: `wss://wspap.okx.com:8443/ws/v5/business`

### Regional-domain note
The official overview explicitly says `www.okx.com` will not work for some registrations:
- US and AU users registered on `app.okx.com` must use `us.okx.com`
- EU users registered on `my.okx.com` must use `eea.okx.com`

## Authentication
### REST private auth
The official docs require these headers on private REST requests:
- `OK-ACCESS-KEY`
- `OK-ACCESS-SIGN`
- `OK-ACCESS-TIMESTAMP`
- `OK-ACCESS-PASSPHRASE`

Confirmed official signing rule:
- signature input = `timestamp + method + requestPath + body`
- algorithm = `HMAC SHA256`
- output encoding = `Base64`
- timestamps use ISO 8601 UTC with millisecond precision
- the docs explicitly recommend synchronizing with `GET /api/v5/public/time`

Example official request-path rule captured from the docs:
- `GET` query parameters are counted as part of `requestPath`, not the request body

### API-key lifecycle and permissions
The reviewed official docs confirm three API-key permission classes:
- `Read`
- `Trade`
- `Withdraw`

Additional official auth/security notes confirmed in this pass:
- each API key can bind up to `20` IP addresses
- API keys with `trade` or `withdraw` permission that are not IP-bound expire after `14` days of inactivity
- for WebSocket, only the login operation counts as API-key usage for that inactivity rule
- demo trading requests require `x-simulated-trading: 1`

### WebSocket private login
The official docs show WebSocket login payload fields:
- `apiKey`
- `passphrase`
- `timestamp` (Unix seconds)
- `sign`

## Request/response format notes
- Private REST request bodies should use `application/json`
- The docs describe JSON request and response bodies throughout the v5 reference
- The official general-info section states that `code` and `msg` represent request result/error reason when a response uses those fields
- The same section states that `sCode` and `sMsg` represent request result/error reason when the response uses sub-result fields instead

Typical reviewed response shape:
- top-level `code`
- top-level `data`
- top-level `msg`

## Rate limits
### Official global rules confirmed in this pass
- public unauthenticated REST rate limits are based on IP address
- private REST rate limits are based on User ID
- WebSocket login/subscription rate limits are based on connection
- WebSocket order-management limits are based on User ID
- trading-related rate limits are shared across REST and WebSocket channels

### Official WebSocket connection rules
- connection creation limit: `3` requests per second per IP
- total `subscribe` / `unsubscribe` / `login` operations per connection: `480` per hour
- the docs say idle connections break if no subscription is established or no data is pushed for more than `30` seconds
- the docs recommend `ping` / `pong` keepalive handling
- private channel connection-count limit: `30` WebSocket connections per listed channel per sub-account for channels such as orders, account, positions, balance-and-positions, position-risk-warning, and account-greeks

### Official sub-account trading rate limits
The reviewed rate-limit section explicitly says:
- baseline sub-account limit: `1000` new/amend order requests per `2` seconds
- applies in parallel with the existing per-instrument limits
- VIP5+ fill-ratio tiers can raise this to `1250`, `1500`, `1750`, `2000`, `2500`, `3000`, or `10000` per `2` seconds depending on the documented ratio bands

### Official error codes tied to throttling
- `50011`: rate limit reached / too many requests
- `50061`: sub-account rate limit exceeded

## Pagination and parameter notes
The reviewed docs do not impose one universal pagination contract for every endpoint, but they repeatedly document cursor/time-window parameters on list/history routes.

Confirmed official pagination patterns seen in the reviewed reference text:
- `after`
- `before`
- `limit`

One captured official example states:
- `after`: return records earlier than the requested `uTime`
- `before`: return records newer than the requested `uTime`
- `limit`: maximum `100`, default `100`

Common documented selector/filter parameters across the reviewed route families include:
- `instId`
- `instType`
- `instFamily`
- `uly`
- `ccy`
- `mgnMode`
- `tdMode`
- `side`
- `posSide`
- `ordType`
- `px`
- `sz`
- `clOrdId`
- `algoId`
- `subAcct`

## Error-format and usage notes
The official error-code section confirms a large REST error table in the `50000`-`59999` range. Confirmed examples from the reviewed docs include:
- `50000` / HTTP `400`: POST body cannot be empty
- `50001` / HTTP `503`: service temporarily unavailable
- `50002` / HTTP `400`: JSON syntax error
- `50004` / HTTP `400`: endpoint request timeout; result must be checked separately
- `50005` / HTTP `410`: endpoint inactive or unavailable
- `50011` / HTTP `200` and also `429`: rate-limit reached / too many requests
- `50035` / HTTP `403`: endpoint requires an IP-bound API key
- `50038`: feature unavailable in demo trading
- `50039`: `before` is not supported for timestamp pagination

## Important usage notes
- The official general-info section says the exchange-level maximum number of pending orders is `4000`
- The same section says the maximum number of pending orders per trading symbol is `500` for the listed standard order types
- Pending spread-order limit: `500` across all spreads
- Pending algo-order limits vary by algo type in the official docs
- The docs explicitly say some demo-trading functions are not supported, including examples like withdraw, deposit, and purchase/redemption
- The docs explicitly warn that using the wrong regional domain for an account registration will not work
- The docs expose both classic REST calls and extensive WebSocket coverage; market data is explicitly recommended over WebSocket for efficient retrieval

## Route-family overview
Confirmed from the current official OKX v5 docs:
- `379` unique REST method/path operations
- method split: `241` `GET` + `138` `POST`
- `370` unique REST paths
- top-level path families visible in the reviewed docs include:
  - `account`
  - `affiliate`
  - `asset`
  - `copytrading`
  - `fiat`
  - `finance`
  - `market`
  - `public`
  - `rfq`
  - `rubik`
  - `sprd`
  - `support`
  - `system`
  - `trade`
  - `tradingBot`
  - `users`

The reviewed docs also expose official WebSocket coverage for:
- account and positions channels
- order and fills channels
- market-data channels such as tickers, candles, trades, order book, option trades, and call-auction details
- spread trading channels
- recurring-buy and lead-trading notification channels
- WebSocket order placement/amend/cancel flows

## Confirmed REST route inventory
The following method/path operations were directly recoverable from the current official OKX v5 reference in this pass.

```text
GET /api/v5/account/account-position-risk
GET /api/v5/account/adjust-leverage-info
GET /api/v5/account/balance
GET /api/v5/account/bills
GET /api/v5/account/bills-archive
GET /api/v5/account/bills-history-archive
GET /api/v5/account/collateral-assets
GET /api/v5/account/config
GET /api/v5/account/greeks
GET /api/v5/account/instruments
GET /api/v5/account/interest-accrued
GET /api/v5/account/interest-limits
GET /api/v5/account/interest-rate
GET /api/v5/account/leverage-info
GET /api/v5/account/max-avail-size
GET /api/v5/account/max-loan
GET /api/v5/account/max-size
GET /api/v5/account/max-withdrawal
GET /api/v5/account/mmp-config
GET /api/v5/account/move-positions-history
GET /api/v5/account/position-tiers
GET /api/v5/account/positions
GET /api/v5/account/positions-history
GET /api/v5/account/precheck-set-delta-neutral
GET /api/v5/account/risk-state
GET /api/v5/account/set-account-switch-precheck
GET /api/v5/account/spot-borrow-repay-history
GET /api/v5/account/subaccount/balances
GET /api/v5/account/subaccount/max-withdrawal
GET /api/v5/account/subtypes
GET /api/v5/account/trade-fee
GET /api/v5/affiliate/co-inviter/list
GET /api/v5/affiliate/invitee/detail
GET /api/v5/affiliate/invitee/list
GET /api/v5/affiliate/link/list
GET /api/v5/affiliate/performance/summary
GET /api/v5/affiliate/sub-affiliate/list
GET /api/v5/asset/asset-valuation
GET /api/v5/asset/balances
GET /api/v5/asset/bills
GET /api/v5/asset/bills-history
GET /api/v5/asset/convert/currencies
GET /api/v5/asset/convert/currency-pair
GET /api/v5/asset/convert/history
GET /api/v5/asset/currencies
GET /api/v5/asset/deposit-address
GET /api/v5/asset/deposit-history
GET /api/v5/asset/deposit-withdraw-status
GET /api/v5/asset/exchange-list
GET /api/v5/asset/monthly-statement
GET /api/v5/asset/non-tradable-assets
GET /api/v5/asset/subaccount/balances
GET /api/v5/asset/subaccount/bills
GET /api/v5/asset/subaccount/managed-subaccount-bills
GET /api/v5/asset/transfer-state
GET /api/v5/asset/withdrawal-history
GET /api/v5/copytrading/config
GET /api/v5/copytrading/copy-settings
GET /api/v5/copytrading/current-lead-traders
GET /api/v5/copytrading/current-subpositions
GET /api/v5/copytrading/instruments
GET /api/v5/copytrading/profit-sharing-details
GET /api/v5/copytrading/public-config
GET /api/v5/copytrading/public-copy-traders
GET /api/v5/copytrading/public-current-subpositions
GET /api/v5/copytrading/public-lead-traders
GET /api/v5/copytrading/public-pnl
GET /api/v5/copytrading/public-preference-currency
GET /api/v5/copytrading/public-stats
GET /api/v5/copytrading/public-subpositions-history
GET /api/v5/copytrading/public-weekly-pnl
GET /api/v5/copytrading/subpositions-history
GET /api/v5/copytrading/total-profit-sharing
GET /api/v5/copytrading/total-unrealized-profit-sharing
GET /api/v5/copytrading/unrealized-profit-sharing-details
GET /api/v5/fiat/buy-sell/currencies
GET /api/v5/fiat/buy-sell/currency-pair
GET /api/v5/fiat/buy-sell/history
GET /api/v5/fiat/deposit
GET /api/v5/fiat/deposit-order-history
GET /api/v5/fiat/deposit-payment-methods
GET /api/v5/fiat/withdrawal
GET /api/v5/fiat/withdrawal-order-history
GET /api/v5/fiat/withdrawal-payment-methods
GET /api/v5/finance/flexible-loan/borrow-currencies
GET /api/v5/finance/flexible-loan/collateral-assets
GET /api/v5/finance/flexible-loan/interest-accrued
GET /api/v5/finance/flexible-loan/loan-history
GET /api/v5/finance/flexible-loan/loan-info
GET /api/v5/finance/flexible-loan/max-collateral-redeem-amount
GET /api/v5/finance/savings/balance
GET /api/v5/finance/savings/lending-history
GET /api/v5/finance/savings/lending-rate-history
GET /api/v5/finance/savings/lending-rate-summary
GET /api/v5/finance/sfp/dcd/currency-pair
GET /api/v5/finance/sfp/dcd/order-history
GET /api/v5/finance/sfp/dcd/order-status
GET /api/v5/finance/sfp/dcd/products
GET /api/v5/finance/stable-rewards/apy-history
GET /api/v5/finance/stable-rewards/balance
GET /api/v5/finance/stable-rewards/product-info
GET /api/v5/finance/stable-rewards/subscribe-redeem-history
GET /api/v5/finance/staking-defi/eth/apy-history
GET /api/v5/finance/staking-defi/eth/balance
GET /api/v5/finance/staking-defi/eth/product-info
GET /api/v5/finance/staking-defi/eth/purchase-redeem-history
GET /api/v5/finance/staking-defi/offers
GET /api/v5/finance/staking-defi/orders-active
GET /api/v5/finance/staking-defi/orders-history
GET /api/v5/finance/staking-defi/sol/apy-history
GET /api/v5/finance/staking-defi/sol/balance
GET /api/v5/finance/staking-defi/sol/product-info
GET /api/v5/finance/staking-defi/sol/purchase-redeem-history
GET /api/v5/market/block-ticker
GET /api/v5/market/block-tickers
GET /api/v5/market/books
GET /api/v5/market/books-full
GET /api/v5/market/books-sbe
GET /api/v5/market/call-auction-details
GET /api/v5/market/candles
GET /api/v5/market/exchange-rate
GET /api/v5/market/history-candles
GET /api/v5/market/history-index-candles
GET /api/v5/market/history-mark-price-candles
GET /api/v5/market/history-trades
GET /api/v5/market/index-candles
GET /api/v5/market/index-components
GET /api/v5/market/index-tickers
GET /api/v5/market/mark-price-candles
GET /api/v5/market/option/instrument-family-trades
GET /api/v5/market/platform-24-volume
GET /api/v5/market/sprd-candles
GET /api/v5/market/sprd-history-candles
GET /api/v5/market/sprd-ticker
GET /api/v5/market/ticker
GET /api/v5/market/tickers
GET /api/v5/market/trades
GET /api/v5/public/block-trades
GET /api/v5/public/convert-contract-coin
GET /api/v5/public/delivery-exercise-history
GET /api/v5/public/discount-rate-interest-free-quota
GET /api/v5/public/economic-calendar
GET /api/v5/public/estimated-price
GET /api/v5/public/estimated-settlement-info
GET /api/v5/public/event-contract/events
GET /api/v5/public/event-contract/markets
GET /api/v5/public/event-contract/series
GET /api/v5/public/funding-rate
GET /api/v5/public/funding-rate-history
GET /api/v5/public/instrument-tick-bands
GET /api/v5/public/instruments
GET /api/v5/public/insurance-fund
GET /api/v5/public/interest-rate-loan-quota
GET /api/v5/public/mark-price
GET /api/v5/public/market-data-history
GET /api/v5/public/open-interest
GET /api/v5/public/opt-summary
GET /api/v5/public/option-trades
GET /api/v5/public/position-tiers
GET /api/v5/public/premium-history
GET /api/v5/public/price-limit
GET /api/v5/public/settlement-history
GET /api/v5/public/time
GET /api/v5/public/underlying
GET /api/v5/rfq/counterparties
GET /api/v5/rfq/maker-instrument-settings
GET /api/v5/rfq/mmp-config
GET /api/v5/rfq/public-trades
GET /api/v5/rfq/quotes
GET /api/v5/rfq/rfqs
GET /api/v5/rfq/trades
GET /api/v5/rubik/stat/contracts/long-short-account-ratio
GET /api/v5/rubik/stat/contracts/long-short-account-ratio-contract
GET /api/v5/rubik/stat/contracts/long-short-account-ratio-contract-top-trader
GET /api/v5/rubik/stat/contracts/long-short-position-ratio-contract-top-trader
GET /api/v5/rubik/stat/contracts/open-interest-history
GET /api/v5/rubik/stat/contracts/open-interest-volume
GET /api/v5/rubik/stat/margin/loan-ratio
GET /api/v5/rubik/stat/option/open-interest-volume
GET /api/v5/rubik/stat/option/open-interest-volume-expiry
GET /api/v5/rubik/stat/option/open-interest-volume-ratio
GET /api/v5/rubik/stat/option/open-interest-volume-strike
GET /api/v5/rubik/stat/option/taker-block-volume
GET /api/v5/rubik/stat/taker-volume
GET /api/v5/rubik/stat/taker-volume-contract
GET /api/v5/rubik/stat/trading-data/support-coin
GET /api/v5/sprd/books
GET /api/v5/sprd/order
GET /api/v5/sprd/orders-history
GET /api/v5/sprd/orders-history-archive
GET /api/v5/sprd/orders-pending
GET /api/v5/sprd/public-trades
GET /api/v5/sprd/spreads
GET /api/v5/sprd/trades
GET /api/v5/support/announcement-types
GET /api/v5/support/announcements
GET /api/v5/system/status
GET /api/v5/trade/account-rate-limit
GET /api/v5/trade/easy-convert-currency-list
GET /api/v5/trade/easy-convert-history
GET /api/v5/trade/fills
GET /api/v5/trade/fills-history
GET /api/v5/trade/one-click-repay-currency-list
GET /api/v5/trade/one-click-repay-currency-list-v2
GET /api/v5/trade/one-click-repay-history
GET /api/v5/trade/one-click-repay-history-v2
GET /api/v5/trade/order
GET /api/v5/trade/order-algo
GET /api/v5/trade/orders-algo-history
GET /api/v5/trade/orders-algo-pending
GET /api/v5/trade/orders-history
GET /api/v5/trade/orders-history-archive
GET /api/v5/trade/orders-pending
GET /api/v5/tradingBot/dca/cycle-list
GET /api/v5/tradingBot/dca/history-list
GET /api/v5/tradingBot/dca/ongoing-list
GET /api/v5/tradingBot/dca/orders
GET /api/v5/tradingBot/dca/position-details
GET /api/v5/tradingBot/grid/ai-param
GET /api/v5/tradingBot/grid/grid-quantity
GET /api/v5/tradingBot/grid/orders-algo-details
GET /api/v5/tradingBot/grid/orders-algo-history
GET /api/v5/tradingBot/grid/orders-algo-pending
GET /api/v5/tradingBot/grid/positions
GET /api/v5/tradingBot/grid/sub-orders
GET /api/v5/tradingBot/public/rsi-back-testing
GET /api/v5/tradingBot/recurring/orders-algo-details
GET /api/v5/tradingBot/recurring/orders-algo-history
GET /api/v5/tradingBot/recurring/orders-algo-pending
GET /api/v5/tradingBot/recurring/sub-orders
GET /api/v5/tradingBot/signal/event-history
GET /api/v5/tradingBot/signal/orders-algo-details
GET /api/v5/tradingBot/signal/orders-algo-history
GET /api/v5/tradingBot/signal/orders-algo-pending
GET /api/v5/tradingBot/signal/positions
GET /api/v5/tradingBot/signal/positions-history
GET /api/v5/tradingBot/signal/signals
GET /api/v5/tradingBot/signal/sub-orders
GET /api/v5/users/entrust-subaccount-list
GET /api/v5/users/subaccount/apikey
GET /api/v5/users/subaccount/list
POST /api/v5/account/account-level-switch-preset
POST /api/v5/account/activate-option
POST /api/v5/account/bills-history-archive
POST /api/v5/account/demo-adjust-balance
POST /api/v5/account/mmp-config
POST /api/v5/account/mmp-reset
POST /api/v5/account/move-positions
POST /api/v5/account/position-builder
POST /api/v5/account/position-builder-graph
POST /api/v5/account/position/margin-balance
POST /api/v5/account/set-account-level
POST /api/v5/account/set-auto-earn
POST /api/v5/account/set-auto-loan
POST /api/v5/account/set-auto-repay
POST /api/v5/account/set-collateral-assets
POST /api/v5/account/set-fee-type
POST /api/v5/account/set-greeks
POST /api/v5/account/set-isolated-mode
POST /api/v5/account/set-leverage
POST /api/v5/account/set-position-mode
POST /api/v5/account/set-riskOffset-amt
POST /api/v5/account/set-settle-currency
POST /api/v5/account/set-trading-config
POST /api/v5/account/spot-manual-borrow-repay
POST /api/v5/asset/cancel-withdrawal
POST /api/v5/asset/convert/estimate-quote
POST /api/v5/asset/convert/trade
POST /api/v5/asset/monthly-statement
POST /api/v5/asset/subaccount/transfer
POST /api/v5/asset/transfer
POST /api/v5/asset/withdrawal
POST /api/v5/copytrading/algo-order
POST /api/v5/copytrading/amend-copy-settings
POST /api/v5/copytrading/amend-profit-sharing-ratio
POST /api/v5/copytrading/close-subposition
POST /api/v5/copytrading/first-copy-settings
POST /api/v5/copytrading/set-instruments
POST /api/v5/copytrading/stop-copy-trading
POST /api/v5/fiat/buy-sell/quote
POST /api/v5/fiat/buy-sell/trade
POST /api/v5/fiat/cancel-withdrawal
POST /api/v5/fiat/create-withdrawal
POST /api/v5/finance/flexible-loan/adjust-collateral
POST /api/v5/finance/flexible-loan/max-loan
POST /api/v5/finance/savings/purchase-redempt
POST /api/v5/finance/savings/set-lending-rate
POST /api/v5/finance/sfp/dcd/quote
POST /api/v5/finance/sfp/dcd/redeem
POST /api/v5/finance/sfp/dcd/redeem-quote
POST /api/v5/finance/sfp/dcd/trade
POST /api/v5/finance/stable-rewards/quote
POST /api/v5/finance/stable-rewards/trade
POST /api/v5/finance/staking-defi/cancel
POST /api/v5/finance/staking-defi/eth/cancel-redeem
POST /api/v5/finance/staking-defi/eth/purchase
POST /api/v5/finance/staking-defi/eth/redeem
POST /api/v5/finance/staking-defi/purchase
POST /api/v5/finance/staking-defi/redeem
POST /api/v5/finance/staking-defi/sol/purchase
POST /api/v5/finance/staking-defi/sol/redeem
POST /api/v5/rfq/cancel-all-after
POST /api/v5/rfq/cancel-all-quotes
POST /api/v5/rfq/cancel-all-rfqs
POST /api/v5/rfq/cancel-batch-quotes
POST /api/v5/rfq/cancel-batch-rfqs
POST /api/v5/rfq/cancel-quote
POST /api/v5/rfq/cancel-rfq
POST /api/v5/rfq/create-quote
POST /api/v5/rfq/create-rfq
POST /api/v5/rfq/execute-quote
POST /api/v5/rfq/maker-instrument-settings
POST /api/v5/rfq/mmp-config
POST /api/v5/rfq/mmp-reset
POST /api/v5/sprd/amend-order
POST /api/v5/sprd/cancel-all-after
POST /api/v5/sprd/cancel-order
POST /api/v5/sprd/mass-cancel
POST /api/v5/sprd/order
POST /api/v5/trade/amend-algos
POST /api/v5/trade/amend-batch-orders
POST /api/v5/trade/amend-order
POST /api/v5/trade/batch-orders
POST /api/v5/trade/cancel-algos
POST /api/v5/trade/cancel-all-after
POST /api/v5/trade/cancel-batch-orders
POST /api/v5/trade/cancel-order
POST /api/v5/trade/close-position
POST /api/v5/trade/easy-convert
POST /api/v5/trade/mass-cancel
POST /api/v5/trade/one-click-repay
POST /api/v5/trade/one-click-repay-v2
POST /api/v5/trade/order
POST /api/v5/trade/order-algo
POST /api/v5/trade/order-precheck
POST /api/v5/tradingBot/dca/amend-order-algo
POST /api/v5/tradingBot/dca/create
POST /api/v5/tradingBot/dca/margin/add
POST /api/v5/tradingBot/dca/margin/reduce
POST /api/v5/tradingBot/dca/orders/manual-buy
POST /api/v5/tradingBot/dca/settings/reinvestment
POST /api/v5/tradingBot/dca/settings/take-profit
POST /api/v5/tradingBot/dca/stop
POST /api/v5/tradingBot/grid/adjust-investment
POST /api/v5/tradingBot/grid/amend-algo-basic-param
POST /api/v5/tradingBot/grid/amend-order-algo
POST /api/v5/tradingBot/grid/cancel-close-order
POST /api/v5/tradingBot/grid/close-position
POST /api/v5/tradingBot/grid/compute-margin-balance
POST /api/v5/tradingBot/grid/copy-order-algo
POST /api/v5/tradingBot/grid/margin-balance
POST /api/v5/tradingBot/grid/min-investment
POST /api/v5/tradingBot/grid/order-algo
POST /api/v5/tradingBot/grid/order-instant-trigger
POST /api/v5/tradingBot/grid/stop-order-algo
POST /api/v5/tradingBot/grid/withdraw-income
POST /api/v5/tradingBot/recurring/add-investment
POST /api/v5/tradingBot/recurring/amend-order-algo
POST /api/v5/tradingBot/recurring/amend-price-range
POST /api/v5/tradingBot/recurring/amend-recurring-amount
POST /api/v5/tradingBot/recurring/amend-recurring-time
POST /api/v5/tradingBot/recurring/order-algo
POST /api/v5/tradingBot/recurring/pause
POST /api/v5/tradingBot/recurring/restart
POST /api/v5/tradingBot/recurring/stop-order-algo
POST /api/v5/tradingBot/signal/amendTPSL
POST /api/v5/tradingBot/signal/cancel-sub-order
POST /api/v5/tradingBot/signal/close-position
POST /api/v5/tradingBot/signal/create-signal
POST /api/v5/tradingBot/signal/margin-balance
POST /api/v5/tradingBot/signal/order-algo
POST /api/v5/tradingBot/signal/set-instruments
POST /api/v5/tradingBot/signal/stop-order-algo
POST /api/v5/tradingBot/signal/sub-order
POST /api/v5/users/subaccount/apikey
POST /api/v5/users/subaccount/create-subaccount
POST /api/v5/users/subaccount/delete-apikey
POST /api/v5/users/subaccount/modify-apikey
POST /api/v5/users/subaccount/set-transfer-out
```

## fireROUTE normalization notes
- Keep the provider under the existing `okex` slug for repository continuity, but document the active first-party API surface under the current official `OKX` successor docs.
- The retired `https://www.okex.com/docs/` host should not be treated as a live documentation source anymore.
- The current docs are rich enough to support a normal manual route inventory, so this provider should no longer remain a `0`-route blocker entry.
- Runtime integrations should verify which regional domain applies to the target account before hard-coding `www.okx.com`.
