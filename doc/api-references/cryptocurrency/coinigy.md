# Coinigy

Official pages manually reviewed:
- https://api.coinigy.com/api/v2/docs/
- https://coinigy.docs.apiary.io/

## Overview
Coinigy now publishes a current `V2` API reference at `https://api.coinigy.com/api/v2/docs/` and the older `V1` Apiary reference remains browsable at `https://coinigy.docs.apiary.io/`.

What was manually confirmed from the reviewed official docs:
- Current API base URL: `https://api.coinigy.com`
- Current documented route families are split between unauthenticated-looking `GET /public/...` endpoints and signed `GET`/`POST`/`PUT`/`DELETE` `.../private/...` endpoints
- Current WebSocket URI: `wss://sc-02.coinigy.com/socketcluster/`
- Current V2 docs explicitly tell developers to use V2 moving forward
- Manual exact route count confirmed from the current V2 Swagger-style docs: **140** operations (`91` `GET`, `21` `POST`, `17` `PUT`, `11` `DELETE`)

### V2 route counts by tag
- `Markets`: 1
- `Public`: 26
- `Exchanges & Markets`: 11
- `Exchange Data`: 13
- `User Account`: 37
- `Exchange Accounts`: 11
- `Balances`: 21
- `Orders`: 14
- `Price Alerts`: 5
- `Blockchain Data`: 1

## Authentication
### V2 private auth
The reviewed V2 docs explicitly document these headers for signed private requests:
- `X-API-KEY`
- `X-API-TIMESTAMP`
- `X-API-SIGN`

The reviewed docs say `X-API-SIGN` is an uppercase SHA256 HMAC signature built from:
- `API Key + Timestamp + Http Method + Endpoint + Body`

Additional auth details confirmed from the reviewed V2 docs:
- the endpoint portion used in the signature is the non-base URI path, and it is case-sensitive
- query strings must be escaped exactly as sent when they are included in the signature
- `GET` and `DELETE` requests sign an empty body
- `POST` and `PUT` requests sign the exact request body
- users generate V2 keys/secrets from their Coinigy account settings

### Legacy V1 auth still visible in official docs
The browsable V1 Apiary docs still show the legacy header pair:
- `X-API-KEY`
- `X-API-SECRET`

## Rate limits, format, pagination, and error notes
What was confirmed from the reviewed official docs:
- the V2 code sample uses `Accept: application/json` and `Content-Type: application/json`
- the V1 docs explicitly say REST requests are capped at `2 requests per second` with a burst of `5` excess requests
- the V1 docs say exhausted REST capacity returns `503`
- both the V1 and V2 reviewed docs say WebSocket connections are limited to `2 connection attempts per 10 seconds`
- the V2 docs do **not** expose a separate shared REST quota table on the reviewed intro page
- no single shared global pagination section was visible in the reviewed V2 Swagger docs
- the reviewed docs do show route-specific filtering/time-window behavior, for example:
  - V2 signing examples include `StartDate` and `EndDate` query parameters on OHLC requests
  - V2 news routes mention `feedId` and `searchTerm` query-string filters
  - V2 user activity docs say only the `10,000` most recent records are retrievable
- the legacy V1 docs explicitly say V1 REST responses contain `data` and `notifications` nodes

## WebSocket notes
The reviewed official V2 docs confirm:
- WebSocket base: `wss://sc-02.coinigy.com/socketcluster/`
- the WebSocket API is pub/sub based
- documented channel format: `METHOD-EXCHANGECODE--PRIMARYCURRENCY--SECONDARYCURRENCY`
- the docs point to the official example client at `https://github.com/coinigy/api/blob/master/ws_example.js`

## Endpoint inventory confirmed from current V2 docs
The following method/path pairs were manually extracted from the visible current V2 docs.

### Markets (1)
- `GET /private/markets/{baseCurrCode}/{quoteCurrCode}/overview`

### Public (26)
- `GET /`
- `GET /public/chains`
- `GET /public/convert/{fromCurrCode}/{toCurrCode}`
- `GET /public/convert/{fromCurrId}/{toCurrId}`
- `GET /public/currencies`
- `GET /public/currencies/{slug}`
- `GET /public/currencies/summaries`
- `GET /public/currencies/tags`
- `GET /public/exchanges`
- `GET /public/exchanges/{exchCode}`
- `GET /public/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/depth`
- `GET /public/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/ohlc/{timeframe}`
- `GET /public/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/trades`
- `GET /public/exchanges/tags`
- `GET /public/markets`
- `GET /public/markets/{baseCurrCode}/{quoteCurrCode}/market-summaries`
- `GET /public/markets/{exchange}/{baseCurrCode}/{quoteCurrCode}/market-summaries`
- `GET /public/markets/favorites`
- `GET /public/markets/market-summaries`
- `GET /public/news`
- `GET /public/rss`
- `GET /public/search`
- `GET /public/stats`
- `GET /public/status`
- `GET /public/time`
- `GET /public/version`

### Exchanges & Markets (11)
- `GET /private/aggregatedMarkets`
- `GET /private/currencies/dead`
- `GET /private/exchanges`
- `GET /private/exchanges/{exchCode}`
- `GET /private/exchanges/{exchCode}/{baseCurrCode}`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/overview/{timePeriod}`
- `GET /private/exchanges/{exchCode}/markets/dead`
- `GET /private/exchanges/{exchCode}/restrictions/{baseCurrency}/{quoteCurrency}`
- `GET /private/markets`
- `GET /private/markets/dead`

### Exchange Data (13)
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/depth`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/last`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/ohlc/{period}`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/range`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/ticker`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/trades`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/trades/history`
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/trades/history/{sinceMarketHistoryId}`
- `GET /private/exchanges/{exchCode}/ticker`
- `GET /private/markets/ticker`
- `GET /private/markets/top`
- `GET /private/news`
- `GET /private/news/{searchTerm}`

### User Account (37)
- `GET /private/user`
- `PUT /private/user`
- `GET /private/user/{baseCurrCode}/{quoteCurrCode}/notes`
- `POST /private/user/{baseCurrCode}/{quoteCurrCode}/notes`
- `GET /private/user/activity`
- `GET /private/user/activity/{notificationId}`
- `POST /private/user/deletion-request`
- `GET /private/user/hash`
- `POST /private/user/hash`
- `PUT /private/user/hash`
- `GET /private/user/invoices`
- `GET /private/user/invoices/{paymentId}`
- `GET /private/user/invoices/{paymentId}/print`
- `GET /private/user/keys`
- `POST /private/user/keys`
- `GET /private/user/keys/{apiKey}`
- `DELETE /private/user/keys/{apiKey}`
- `PUT /private/user/layout`
- `GET /private/user/layout`
- `GET /private/user/notes`
- `GET /private/user/preferences`
- `PUT /private/user/preferences`
- `GET /private/user/referrals`
- `GET /private/user/sessions`
- `GET /private/user/sessions/{sessionId}`
- `DELETE /private/user/sessions/{sessionId}`
- `GET /private/user/settings`
- `POST /private/user/settings`
- `PUT /private/user/settings`
- `POST /private/user/sms-credits`
- `GET /private/user/sms-rate`
- `POST /private/user/start-trial`
- `GET /private/user/subscription`
- `GET /private/user/ticker`
- `POST /private/user/ticker`
- `DELETE /private/user/ticker/{exchMktId}`
- `POST /private/user/username`

### Exchange Accounts (11)
- `GET /private/user/accounts`
- `POST /private/user/accounts`
- `GET /private/user/accounts/{authId}`
- `PUT /private/user/accounts/{authId}`
- `DELETE /private/user/accounts/{authId}`
- `PUT /private/user/accounts/{authId}/activeStatus`
- `GET /private/user/accounts/{authId}/secondary`
- `POST /private/user/accounts/{authId}/secondary`
- `PUT /private/user/accounts/{authId}/tradingStatus`
- `DELETE /private/user/accounts/{masterAuthId}/secondary/{authId}`
- `POST /private/user/wallets`

### Balances (21)
- `GET /private/user/accounts/{authId}/balances`
- `PUT /private/user/accounts/{authId}/balances/{balanceCurrCode}`
- `DELETE /private/user/accounts/{authId}/balances/{balanceCurrCode}`
- `PUT /private/user/accounts/{authId}/balances/{balanceId}`
- `DELETE /private/user/accounts/{authId}/balances/{balanceId}`
- `GET /private/user/accounts/{authId}/balances/{currCode}`
- `POST /private/user/accounts/{authId}/balances/{currCode}`
- `GET /private/user/accounts/{authId}/balances/{currId}`
- `POST /private/user/accounts/{authId}/balances/{currId}`
- `GET /private/user/accounts/{authId}/balances/history`
- `PUT /private/user/accounts/{authId}/balances/history/{balanceCurrCode}`
- `DELETE /private/user/accounts/{authId}/balances/history/{balanceCurrCode}/{balanceDate}`
- `PUT /private/user/accounts/{authId}/balances/history/{balanceHistoryId}`
- `DELETE /private/user/accounts/{authId}/balances/history/{balanceHistoryId}`
- `POST /private/user/accounts/{authId}/balances/history/{currCode}`
- `POST /private/user/accounts/{authId}/balances/history/{currId}`
- `POST /private/user/accounts/{authId}/balances/refresh`
- `GET /private/user/accounts/{authId}/margin`
- `PUT /private/user/accounts/balances`
- `GET /private/user/balances`
- `GET /private/user/balances/history`

### Orders (14)
- `GET /private/orderConditionalOperatorTypes`
- `GET /private/orderPriceTypes`
- `GET /private/orderStatusTypes`
- `GET /private/orderTypes`
- `PUT /private/user/accounts`
- `POST /private/user/accounts/{authId}/orders`
- `DELETE /private/user/accounts/{authId}/orders/{orderId}`
- `PUT /private/user/accounts/{authId}/orders/{orderId}`
- `POST /private/user/accounts/{authId}/orders/history`
- `DELETE /private/user/accounts/{authId}/orders/history/{orderHistoryId}`
- `PUT /private/user/accounts/{authId}/orders/history/{orderId}`
- `GET /private/user/orders`
- `GET /private/user/orders/{orderId}`
- `GET /private/user/orders/history`

### Price Alerts (5)
- `GET /private/user/alerts`
- `POST /private/user/alerts`
- `PUT /private/user/alerts/{alertId}`
- `POST /private/user/alerts/delete-request`
- `GET /private/user/alerts/history`

### Blockchain Data (1)
- `GET /private/chains/trackable`

## Sample parameters confirmed from reviewed official examples
The reviewed docs expose these concrete parameter examples and conventions:
- `GET /private/exchanges/{exchCode}/markets/{baseCurrCode}/{quoteCurrCode}/ohlc/{period}` uses exchange and currency path parameters; the official signing example also shows `StartDate` and `EndDate` query parameters
- `GET /public/news` and `GET /private/news` mention optional `feedId` and/or `searchTerm` query filtering
- `POST /private/user/accounts/{authId}/orders` is documented as order placement
- the legacy V1 `POST /addOrder` example shows body fields `auth_id`, `exch_id`, `mkt_id`, `order_type_id`, `price_type_id`, `limit_price`, and `order_quantity`
- the legacy V1 `POST /markets` example shows `exchange_code`
- the legacy V1 `POST /ticker` example shows `exchange_code` and `exchange_market`

## Important usage notes
- Prefer Coinigy `V2` for new fireROUTE integration work; the current V2 docs explicitly recommend it.
- Treat the `Public` and `Private` route groups differently: the reviewed docs visibly separate them, and only the private routes are documented with signed-header auth.
- Signature generation is sensitive to exact URI casing, query escaping, HTTP method, and body contents.
- The legacy V1 Apiary docs are still useful for historical examples, response-envelope notes, and published REST rate limits, but the current route inventory above comes from the visible V2 docs.
- The visible surface is much larger than the prior repo file captured; Coinigy should no longer be treated as a route-path blocker.