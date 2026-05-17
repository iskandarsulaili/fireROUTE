# BitMEX

Official pages manually reviewed:
- https://www.bitmex.com/app/apiOverview
- https://www.bitmex.com/app/restAPI
- https://www.bitmex.com/app/restAPIMessages
- https://www.bitmex.com/app/apiKeysUsage
- https://www.bitmex.com/app/wsAPI
- https://docs.bitmex.com/api-explorer/bitmex-api
- Explorer family pages reviewed manually: `order-v2`, `order-v1`, `order`, `position-and-margin`, `trading`, `order-book`, `market`, `chat`, `announcement`, `porl`, `schema`, `global-notification`, `user`, `funds`, `api-key`, `address`, `address-config`, `user-price-alert`, `user-event`, `user-affiliates`, `leaderboard`, `league-of-trader`, `guild`, `referral-code`, `trading-bots`, `broker`
- Sampled operation pages reviewed directly: `new-order-1`, `amend-order-1`, `cancel-order-1`, `get-execution`, `get-funding`, `get-user-wallet`, `trading-bots-create-instance`

## Overview
BitMEX’s current first-party documentation is split between the long-form `bitmex.com/app/...` guides and the newer `docs.bitmex.com/api-explorer` reference. The current explorer is substantially broader than the older fireROUTE note: it now exposes trading, account, community, proof-of-reserves, trading-bots, and broker families rather than just a small order-book/order sample.

What was directly confirmed from the reviewed official docs:
- Primary REST bases: `https://www.bitmex.com/api/v1` and `https://www.bitmex.com/api/v2`
- Current explorer version shown on the intro page: `1.2.0`
- Current WebSocket bases: `wss://ws.bitmex.com/realtime` for trading/account topics and `wss://ws.bitmex.com/realtimePlatform` for platform topics
- Table-style REST routes commonly share BitMEX’s `count` / `start` / `reverse` / `filter` conventions
- Manually reviewed explorer inventory: **146 current HTTP operations** across **26** browsable route families

## Route inventory confirmed from current official family pages

### Trading — 30 operations
- `Order V2` (**6**): create, amend, cancel, cancel-all, contingent-order, and `cancelAllAfter` routes under the current unified `/api/v2/order` family
- `Order V1` (**6**): legacy create/amend/cancel/get/cancel-all/cancelAllAfter routes
- `Order` (**1**): legacy close-position route marked deprecated in favor of `POST /order` with `execInst: Close`
- `Position and Margin` (**10**): positions, isolated-vs-cross toggles, risk limit, transfer margin, isolated leverage, cross leverage, margining mode set/get, margins, position mode
- `Trading` (**6**): executions, trade history, execution history, quote-to-fill ratio, trading volume, trading volume ranking
- `OrderBook` (**1**): current order-book snapshot

### Market Data — 30 operations
- `Market` (**18**): funding, instruments, active instruments, price indices, active price indices, active contract-series/interval pairs, index constituents, exchange-stats summaries, insurance-fund history, liquidations, quotes, bucketed quotes, settlements, exchange stats, historical exchange stats, exchange stats in USD, trades, bucketed previous trades
- `Chat` (**5**): pinned message, message list, send message, channels, connected users
- `Announcement` (**2**): site announcements and urgent/banner announcements
- `Porl` / proof of reserves-liabilities (**2**): nonce/data route and historical snapshots
- `Schema` (**2**): model schemata and WebSocket help/subject list
- `GlobalNotification` (**1**): current notifications route; the reviewed page explicitly says the feature is upcoming and currently returns no data

### Account — 45 operations
- `User` (**20**): deposit/withdrawal helpers, affiliate/referral validation, quote-value-ratio stats, subaccount operations, transfers-between-accounts listing, logout, preferences, profile, commission, communication token, trading settings
- `Funds` (**12**): wallet, wallet history, wallet summary, staking/unstaking, staking instruments, internal transfers, CSA/assets/networks config, conversion haircuts, wallet currencies
- `APIKey` (**2**): list your API keys and inspect the current key used by the request
- `Address` (**3**): create/list/update saved withdrawal addresses
- `AddressConfig` (**1**): address-book settings
- `UserPriceAlert` (**5**): list/create/bulk-delete/update/delete price alerts
- `UserEvent` (**1**): user audit-event feed
- `UserAffiliates` (**1**): affiliate-tree lookup

### Community — 18 operations
- `Leaderboard` (**2**): public leaderboard plus current-user alias
- `LeagueOfTrader` (**1**): authenticated leaderboard rankings for leader accounts
- `Guild` (**8**): create/edit/list/share-trades/leave/kick/join/archive guild flows
- `ReferralCode` (**7**): create/list/validate/update/delete/get-by-id/get-by-code

### Automation — 23 operations
- `TradingBots` (**12**): strategies, bot instances, previews, pause/resume/stop, and marketplace routes
- `Broker` (**11**): account-range, brokerage-account, fee-tier, and fee-discount routes; the reviewed pages consistently note these are only available to clients with bespoke arrangements

## Exact sampled methods and paths confirmed from reviewed operation pages
| Method | Path | Notes |
|---|---|---|
| POST | `/api/v2/order` | Current unified order-placement route; reviewed `Create a New Order` page. |
| PUT | `/api/v2/order` | Amend open orders by `orderID` or `origClOrdID`; reviewed `Amend The Quantity or Price of an Open Order`. |
| DELETE | `/api/v2/order` | Cancel by `orderID[]` or `clOrdID[]`; reviewed `Cancel order(s)`. |
| GET | `/api/v1/execution` | Raw execution/event feed for the authenticated account. |
| GET | `/api/v1/funding` | Funding-history query with shared table-style pagination/filter parameters. |
| GET | `/api/v1/user/wallet` | Current wallet details; reviewed as an authenticated funds route. |
| POST | `/api/v1/trading-bots/instances` | Create and start a new bot instance; reviewed from the current Trading Bots family. |

## Authentication
Confirmed from the reviewed auth guide, REST explorer auth tabs, and WebSocket guide:
- Private REST routes use permanent API keys.
- Required signing headers are:
  - `api-expires`
  - `api-key`
  - `api-signature`
- Official signature formula: `hex(HMAC_SHA256(apiSecret, verb + path + expires + data))`
- `api-expires` is a Unix timestamp in seconds used to prevent replay.
- The older nonce-style scheme described in historic docs is explicitly marked unsupported and should not be used for new applications.
- API keys are permission-scoped. The reviewed permissions page explicitly documents default read-only behavior plus `order` and `orderCancel`; it also describes withdrawal-capable keys with extra saved-address/email-confirmation restrictions.
- API keys cannot create other API keys or modify core user settings/KYC/security data.
- WebSocket private auth can be done either by signing the initial upgrade request with `api-*` headers or by passing the same `api-*` fields in the query string. The reviewed guide says to sign it as if it were `GET /realtime`.

## Parameters and request-body details confirmed from sampled pages

### Shared table-query conventions
The explorer intro and sampled `GET /api/v1/execution` / `GET /api/v1/funding` pages consistently show BitMEX’s common table-query shape:
- `count`: default `100`, max `500`
- `start`: default `0`
- `reverse`: default `false`; set `true` to get newest-first results
- `filter`: JSON object serialized as a string, e.g. `{"key":"value"}`
- `columns`: optional column subset
- time filters such as `startTime` and `endTime`

The long-form REST guide also confirms richer timestamp filtering via JSON `filter` keys such as `startTime`, `endTime`, `timestamp`, and more granular date parts.

### `POST /api/v2/order`
Reviewed order-placement notes confirm:
- `symbol` is always required.
- `ordType` values shown on-page include `Limit`, `Market`, `Stop`, `StopLimit`, `MarketIfTouched`, `LimitIfTouched`, and `Pegged`.
- Common order fields visible on the reviewed page include `orderQty`, `price`, `stopPx`, `pegPriceType`, `pegOffsetValue`, and `execInst`.
- `Limit` orders require `orderQty` + `price`.
- `Stop` orders use `orderQty` + `stopPx`.
- `StopLimit` uses `orderQty` + `stopPx` + `price`.
- Pegged orders require `pegPriceType` + `pegOffsetValue`, and the page says they must use `execInst=Fixed`.
- Reviewed `execInst` notes include `ParticipateDoNotInitiate` (post-only behavior), trigger-price selectors such as `MarkPrice` / `LastPrice` / `IndexPrice`, plus order controls such as `Close`, `ReduceOnly`, and `Fixed`.

### `PUT /api/v2/order`
Reviewed amend-order notes confirm:
- You must identify the order with `orderID` or `origClOrdID`.
- Visible amend fields include `orderQty`, `leavesQty`, `price`, `stopPx`, `pegOffsetValue`, `symbol`, `targetAccountId`, and `text`.
- The page explicitly says `leavesQty` can be used to amend partially filled orders, and that a filled order can be made live again if the amend is received within 60 seconds of the fill.

### `DELETE /api/v2/order`
Reviewed cancel-order notes confirm:
- Request body accepts `clOrdID[]` and/or `orderID[]`.
- `targetAccountId` is available for linked-account cancellation.
- `text` can be supplied as optional order annotation.

### `GET /api/v1/execution`
The reviewed execution page confirms query parameters including:
- `symbol`
- `filter`
- `columns`
- `count`, `start`, `reverse`
- `startTime`, `endTime`
- `targetAccountId`, `targetAccountIds[]`, and `targetAccountIds`

The page also notes this raw feed is noisy because it includes order openings/cancellations and status changes, and recommends `/execution/tradeHistory` for more focused trade-only history.

### `GET /api/v1/funding`
The reviewed funding page confirms the same table-style parameter family (`symbol`, `filter`, `columns`, `count`, `start`, `reverse`) for public market-data history queries.

### `GET /api/v1/user/wallet`
The reviewed wallet page confirms:
- required query parameter: `account`
- optional `currency`; the page says `all` can be used for all currencies

### `POST /api/v1/trading-bots/instances`
The reviewed trading-bot create page confirms:
- optional query parameter `targetAccountId`
- request body is required
- the page exposes both `application/json` and `application/x-www-form-urlencoded` request-body tabs

## Rate limits
Confirmed from the official REST guide:
- BitMEX uses layered token-bucket rate limiting.
- First-layer REST limit: **120 requests/minute** when authenticated, reduced to **30 requests/minute** when unauthenticated.
- Second-layer limit: **10 requests/second** shared across:
  - `POST /api/v1/order`
  - `PUT /api/v1/order`
  - `DELETE /api/v1/order`
  - `DELETE /api/v1/order/all`
  - `POST /api/v1/position/isolate`
  - `POST /api/v1/position/leverage`
  - `POST /api/v1/position/transferMargin`
- Returned first-layer headers are `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`.
- Second-layer-limited routes also return `x-ratelimit-remaining-1s`.
- Rate-limit violations return `429` plus `retry-after`.
- The docs explicitly warn that too many `4xx`/`5xx` responses in a short period can cause an hour-long IP ban, with repeated bans extending to a week.
- BitMEX also says bulk-cancel requests count as a single request and recommends WebSocket use instead of aggressive polling.

## Response format, pagination, and errors
- The reviewed REST message-format guide states that responses are `application/json` by default.
- The explorer intro also says table routes can return alternate formats via `?_format=csv` or `?_format=xml`.
- BitMEX generally returns either a plain object or an array of objects matching the endpoint/table.
- The reviewed error-envelope shape is:

```json
{"error": {"message": "...", "name": "HTTPError"}}
```

- The same section notes other documented `name` values such as `ValidationError`, `WebsocketError`, and generic `Error`.
- Sampled explorer pages expose standard `200` / `400` / `401` / `403` / `404` response tabs, while the REST guide documents `429` handling via `retry-after`.
- The explorer intro and sampled table pages confirm offset-style pagination via `count` + `start`, plus reverse-order traversal with `reverse=true`.
- The main API overview recommends using the historical dumps on `public.bitmex.com` instead of deep REST pagination for large backfills.

## WebSocket notes
Confirmed from the reviewed WebSocket guide:
- Primary trading/account WebSocket base: `wss://ws.bitmex.com/realtime`
- Platform-topics WebSocket base: `wss://ws.bitmex.com/realtimePlatform`
- Basic command envelope: `{"op":"<command>","args":[...]}`
- Subscription methods include `subscribe` and `unsubscribe`.
- The guide explicitly says WebSocket market-data access is **not rate-limited once connected**.
- Visible unauthenticated primary topics: **18** (`funding`, `instrument`, `insurance`, `liquidation`, `orderBookL2_25`, `orderBookL2`, `orderBook10`, `quote`, `quoteBin1m`, `quoteBin5m`, `quoteBin1h`, `quoteBin1d`, `settlement`, `trade`, `tradeBin1m`, `tradeBin5m`, `tradeBin1h`, `tradeBin1d`)
- Visible authenticated primary topics: **7** (`affiliate`, `execution`, `order`, `margin`, `position`, `transact`, `wallet`)
- Visible `realtimePlatform` topics: **5** (`announcement`, `chat`, `connected`, `publicNotifications`, `privateNotifications`), with `privateNotifications` marked as auth-required
- The docs explicitly say placing and canceling orders is **not** supported over WebSocket; use REST for order management.
- For connection health, the guide documents raw ping/pong support and `cancelAllAfter` as the order-cancel-on-timeout heartbeat mechanism.

## Important usage notes
- The older fireROUTE file materially undercounted BitMEX. The current official explorer exposes **146** browsable HTTP operations, including much newer `TradingBots` and `Broker` families.
- Some reviewed routes are not broadly available even though they are documented. In particular, `Create Contingent Orders` and many `Broker` pages explicitly say they are only available to clients with bespoke arrangements.
- BitMEX’s REST guide says numeric units are not always human-friendly display units: BTC quantities are returned in satoshis (`XBt`), Tether in micro-units (`USDt`), and ETH in gwei. The docs point users to the Asset API `scale` field for conversions.
- The REST guide also documents open-order caps of **200 open orders per symbol per account** and **10 stop orders per symbol per account**.
- For live market data, BitMEX strongly recommends WebSocket instead of polling. For deep historical pulls, it recommends the separate public data dumps rather than paginating the REST API.