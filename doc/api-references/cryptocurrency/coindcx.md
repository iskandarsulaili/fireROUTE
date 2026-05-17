# CoinDCX

Official pages manually reviewed:
- https://docs.coindcx.com/

## Overview
CoinDCX’s current first-party docs are a single long official reference covering spot public endpoints, signed private endpoints, socket feeds, and futures endpoints. The reviewed body text explicitly confirms both `https://api.coindcx.com` and `https://public.coindcx.com` as live bases, plus `wss://stream.coindcx.com` for sockets.

Confirmed from the reviewed official docs:
- Primary authenticated base: `https://api.coindcx.com`
- Public market-data base used on reviewed pages: `https://public.coindcx.com`
- WebSocket endpoint shown in official examples: `wss://stream.coindcx.com`
- Manual route count confirmed from visible official route examples and sidebar sections: **20**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/exchange/ticker` |
| GET | `/exchange/v1/markets` |
| GET | `/exchange/v1/markets_details` |
| GET | `/market_data/trade_history` |
| GET | `/market_data/orderbook` |
| GET | `/market_data/candles` |
| POST | `/exchange/v1/users/balances` |
| POST | `/exchange/v1/users/info` |
| POST | `/exchange/v1/wallets/sub_account_transfer` |
| POST | `/exchange/v1/wallets/transfer` |
| POST | `/exchange/v1/orders/create` |
| POST | `/exchange/v1/orders/create_multiple` |
| POST | `/exchange/v1/orders/status` |
| POST | `/exchange/v1/orders/active_orders` |
| POST | `/exchange/v1/orders/trade_history` |
| POST | `/exchange/v1/orders/cancel_all` |
| POST | `/exchange/v1/orders/cancel` |
| POST | `/exchange/v1/funding/lend` |
| POST | `/exchange/v1/margin/create` |
| POST | `/exchange/v1/derivatives/futures/orders/create` |

## Authentication
Confirmed from the reviewed Authentication section and repeated official examples:
- Private REST requests use `X-AUTH-APIKEY` and `X-AUTH-SIGNATURE` headers.
- The signature is the hex digest of an `HMAC-SHA256` hash where the message is the payload and the key is the API secret.
- Official signed-socket examples also use the same API key plus signature model when joining authenticated channels.

## Parameters and request notes
- Public trade history and order book examples use `pair` query parameters such as `B-BTC_USDT`.
- Candlestick endpoints use interval/resolution-style parameters.
- Futures docs expose `margin_currency_short_name`, `pair`, and related derivatives-specific query arguments.
- The docs also include pagination, FAQ, errors, and high-frequency-trading sections.

## Rate limits
- CoinDCX publishes a dedicated `SPOT API Rate Limits` section in the first-party docs.
- In this manual pass, the exact numeric limit table was not successfully isolated from the long single-page document, so this file records that rate limits are officially documented without restating specific numbers.

## Response and error notes
- The docs show JSON request/response examples for both public and private routes.
- Socket examples use `wss://stream.coindcx.com` with channel joins.
- The long-form reference includes a dedicated Errors section for provider-specific failures.

## Important usage notes
- CoinDCX’s official docs now cover spot, lending, margin, and futures in one place; fireROUTE adapters should keep those trading domains distinct.
- The docs explicitly state that `public.coindcx.com` is only used where the documentation calls it out, so callers should not assume that host for every endpoint.
