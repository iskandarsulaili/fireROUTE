# IG

Official docs manually reviewed:
- https://labs.ig.com/gettingstarted
- https://labs.ig.com/rest-trading-api-guide.html
- https://labs.ig.com/rest-trading-api-reference.html
- https://labs.ig.com/faq.html
- https://labs.ig.com/reference/session.html
- https://labs.ig.com/reference/session-encryption-key.html
- https://labs.ig.com/reference/positions-otc.html
- https://labs.ig.com/reference/prices-epic.html

## Overview
IG Labs exposes a REST trading API for account/session management, market discovery, historical pricing, positions, working orders, watchlists, client sentiment, and indicative-cost workflows.

From the reviewed official docs:
- Demo base URL: `https://demo-api.ig.com/gateway/deal`
- Production base URL: `https://api.ig.com/gateway/deal`
- Transport: HTTPS
- Request and response format: JSON
- API key header: `X-IG-API-KEY`
- The reviewed reference exposes **43 unique resource paths** and **68 method/path/version operations**.

## Authentication
The reviewed guide and reference document two auth models.

### Shared request headers
Reviewed required/common headers:
- `X-IG-API-KEY: {key}`
- `Content-Type: application/json`
- `Accept: application/json; charset=UTF-8`
- optional/requested version header: `Version: <n>`; defaults to `1` if omitted per the reviewed guide

### Session v1/v2 token model
The reviewed guide says `POST /session` v1 and v2 return:
- `CST` header — client token
- `X-SECURITY-TOKEN` header — account token

The same guide says those tokens are initially valid for **6 hours** and may be extended up to **72 hours** while in use.

However, the separately reviewed FAQ page says:
- `CST` and `X-SECURITY-TOKEN` remain valid for **12-hour intervals between subsequent API calls**
- each subsequent request resets expiry for another 12 hours
- weekend maintenance can invalidate all tokens

Because the official docs are inconsistent on token TTL wording, integrations should treat token expiry as variable and be ready to re-authenticate on rejection.

### Session v3 OAuth model
The reviewed guide and `/session` v3 reference show bearer-token auth:

```http
Authorization: Bearer {access_token}
IG-ACCOUNT-ID: {account_id}
```

Reviewed v3 login response fields:
- `accountId`
- `clientId`
- `lightstreamerEndpoint`
- `timezoneOffset`
- `oauthToken.access_token`
- `oauthToken.refresh_token`
- `oauthToken.scope`
- `oauthToken.token_type`
- `oauthToken.expires_in`

The reviewed guide notes:
- the access token can be short-lived (example shown: `60` seconds)
- the refresh token can be used to obtain a new access token
- refreshing also returns a new refresh token
- scope shown by the reviewed guide is `profile`

### Password encryption support
The reviewed `/session/encryptionKey` reference confirms:
- `GET /session/encryptionKey`
- response fields: `encryptionKey` (Base64) and `timeStamp` (milliseconds since epoch)

The reviewed `/session` errors also explicitly mention that some Singapore-region logins require encrypted passwords.

## Confirmed endpoints
The reviewed REST reference exposes the following current route surface.

### Account
| Path | Methods / versions | Purpose |
|---|---|---|
| `/accounts` | `GET v1` | List logged-in client accounts |
| `/accounts/preferences` | `GET v1`, `PUT v1` | Read/update account preferences |
| `/history/activity` | `GET v3`, `GET v2` | Account activity history |
| `/history/activity/{fromDate}/{toDate}` | `GET v1` | Activity history for date range |
| `/history/activity/{lastPeriod}` | `GET v1` | Activity history for a relative period |
| `/history/transactions` | `GET v2` | Transaction history |
| `/history/transactions/{transactionType}/{fromDate}/{toDate}` | `GET v1` | Transaction history by type and date range |
| `/history/transactions/{transactionType}/{lastPeriod}` | `GET v1` | Transaction history by type and relative period |

### Dealing
| Path | Methods / versions | Purpose |
|---|---|---|
| `/confirms/{dealReference}` | `GET v1` | Deal confirmation lookup |
| `/positions` | `GET v2`, `GET v1` | Open positions |
| `/positions/{dealId}` | `GET v2`, `GET v1` | Single open position |
| `/positions/otc` | `DELETE v1`, `POST v2`, `POST v1` | Close or create OTC positions |
| `/positions/otc/{dealId}` | `PUT v2`, `PUT v1` | Update OTC position |
| `/working-orders` | `GET v2`, `GET v1` | Open working orders |
| `/working-orders/otc` | `POST v2`, `POST v1` | Create OTC working order |
| `/working-orders/otc/{dealId}` | `DELETE v2`, `DELETE v1`, `PUT v2`, `PUT v1` | Delete/update OTC working order |
| `/repeat-dealing-window` | `GET v1` | Repeat dealing window status |

### Markets
| Path | Methods / versions | Purpose |
|---|---|---|
| `/categories` | `GET v1` | List market-category nodes |
| `/categories/{categoryId}/instruments` | `GET v1` | List instruments within a category |
| `/markets` | `GET v2`, `GET v1` | Market details for supplied ids |
| `/markets/{epic}` | `GET v4`, `GET v3`, `GET v2`, `GET v1` | Single market details |
| `/markets?searchTerm={searchTerm}` | `GET v1` | Search markets |
| `/prices/{epic}` | `GET v3` | Historical prices with paging/query parameters |
| `/prices/{epic}/{resolution}/{numPoints}` | `GET v2`, `GET v1` | Historical prices by resolution and point count |
| `/prices/{epic}/{resolution}/{startDate}/{endDate}` | `GET v2` | Historical prices by explicit path date range |
| `/prices/{epic}/{resolution}?startdate={startdate}&enddate={enddate}` | `GET v1` | Historical prices by query date range |

### Watchlists
| Path | Methods / versions | Purpose |
|---|---|---|
| `/watchlists` | `GET v1`, `POST v1` | List/create watchlists |
| `/watchlists/{watchlistId}` | `DELETE v1`, `GET v1`, `PUT v1` | Delete/get/add market to watchlist |
| `/watchlists/{watchlistId}/{epic}` | `DELETE v1` | Remove market from watchlist |

### Client sentiment
| Path | Methods / versions | Purpose |
|---|---|---|
| `/client-sentiment` | `GET v1` | Client sentiment for instrument market |
| `/client-sentiment/{marketId}` | `GET v1` | Client sentiment for a market id |
| `/client-sentiment/related/{marketId}` | `GET v1` | Related-market sentiment |

### Login
| Path | Methods / versions | Purpose |
|---|---|---|
| `/session` | `DELETE v1`, `GET v1`, `POST v3`, `POST v2`, `POST v1`, `PUT v1` | Login, inspect session, switch account, logout |
| `/session/encryptionKey` | `GET v1` | Fetch encryption material for password-based login |
| `/session/refresh-token` | `POST v1` | Refresh OAuth trading session |

### Indicative costs and charges
| Path | Methods / versions | Purpose |
|---|---|---|
| `/indicativecostsandcharges/close` | `POST v1` | Indicative costs/charges at closing |
| `/indicativecostsandcharges/durablemedium/{indicativeQuoteReference}` | `GET v1` | Download generated quote PDF |
| `/indicativecostsandcharges/edit` | `POST v1` | Indicative costs/charges for order edits |
| `/indicativecostsandcharges/history/from/{from}/to/{to}` | `GET v1` | Quote history for date range |
| `/indicativecostsandcharges/open` | `POST v1` | Indicative costs/charges at opening |

### General
| Path | Methods / versions | Purpose |
|---|---|---|
| `/operations/application` | `GET v1`, `PUT v1` | List/update client-owned applications |
| `/operations/application/disable` | `PUT v1` | Disable current application key |

Manual counts confirmed during this pass:
- **43 unique paths**
- **68 total method/path/version operations**

## Confirmed parameter and request details

### `POST /session` (version 3)
Confirmed from the reviewed `/session` reference.

Required body fields:
- `identifier` — username, pattern `[A-Za-z0-9\-_]{1,30}`
- `password` — password, pattern `.{1,350}`

Confirmed success response fields:
- `accountId`
- `clientId`
- `lightstreamerEndpoint`
- `timezoneOffset`
- `oauthToken.access_token`
- `oauthToken.expires_in`
- `oauthToken.refresh_token`
- `oauthToken.scope`
- `oauthToken.token_type`

Confirmed exceptions shown on the reviewed page include:
- `400 error.security.api-key-missing`
- `401 error.security.invalid-details`
- `401 error.security.oauth-token-invalid`
- `403 error.public-api.exceeded-account-allowance`
- `403 error.public-api.exceeded-account-trading-allowance`
- `403 error.public-api.exceeded-api-key-allowance`
- `403 error.security.api-key-invalid`
- `403 error.security.api-key-disabled`
- `504 error.security.authentication.timeout`

The reviewed page also explicitly documents region/login-policy failures such as KYC required, pending agreements, and stockbroking not supported.

### `GET /session/encryptionKey`
The reviewed reference confirms a JSON response containing:
- `encryptionKey` — Base64 public key material
- `timeStamp` — current timestamp in milliseconds since epoch

### `POST /positions/otc` (version 2)
Confirmed from the reviewed `/positions/otc` page.

Reviewed request-body fields and constraints include:
- `currencyCode` required — 3-letter currency code
- `dealReference` — user-defined reference
- `direction` — `BUY` or `SELL`
- `epic` required — instrument epic
- `expiry` required
- `forceOpen` required
- `guaranteedStop` required
- `level`
- `limitDistance`
- `limitLevel`
- `orderType` — `LIMIT`, `MARKET`, or `QUOTE`
- `quoteId`
- `size`
- stop/trailing fields are confirmed by the reviewed constraints, including `stopDistance`, `stopLevel`, `trailingStop`, and `trailingStopIncrement`

Reviewed request constraints include:
- if `limitDistance` or `limitLevel` is set, `forceOpen` must be true
- if `stopDistance` or `stopLevel` is set, `forceOpen` must be true
- only one of `limitLevel` / `limitDistance`
- only one of `stopLevel` / `stopDistance`
- if `guaranteedStop=true`, set only one of `stopLevel` or `stopDistance`
- if `orderType=LIMIT`, set `level` and do not set `quoteId`
- if `orderType=MARKET`, do not set `level` or `quoteId`
- if `orderType=QUOTE`, set both `level` and `quoteId`
- if `trailingStop=true`, do not set `stopLevel`, must set `stopDistance` and `trailingStopIncrement`, and `guaranteedStop` must be false

### `DELETE /positions/otc` (version 1)
Confirmed close-position request fields include:
- `dealId`
- `direction` — `BUY` or `SELL`
- `epic`
- `expiry`
- `level`
- `orderType` — `LIMIT`, `MARKET`, or `QUOTE`
- `quoteId`
- `size`
- `timeInForce` — `EXECUTE_AND_ELIMINATE` or `FILL_OR_KILL`

Reviewed close-position constraints include:
- set only one of `dealId` or `epic`
- if `epic` is defined, set `expiry`
- if `orderType=LIMIT`, set `level` and do not set `quoteId`
- if `orderType=MARKET`, do not set `level` or `quoteId`
- if `orderType=QUOTE`, set `level` and `quoteId`

Confirmed close-position response field:
- `dealReference`

### `GET /prices/{epic}` (version 3)
Confirmed request parameters from the reviewed page:
- path `epic` — instrument epic
- query `resolution` optional, default `MINUTE`
- query `from` optional — `yyyy-MM-dd'T'HH:mm:ss`
- query `to` optional — `yyyy-MM-dd'T'HH:mm:ss`
- query `max` optional, default `10`; not applicable if a date range is specified
- query `pageSize` optional, default `20`; `0` disables paging
- query `pageNumber` optional, default `1`

Reviewed resolution enum values include:
- `SECOND`
- `MINUTE`, `MINUTE_2`, `MINUTE_3`, `MINUTE_5`, `MINUTE_10`, `MINUTE_15`, `MINUTE_30`
- `HOUR`, `HOUR_2`, `HOUR_3`, `HOUR_4`
- `DAY`, `WEEK`, `MONTH`

Reviewed response notes:
- response is a list of prices
- `instrumentType` is returned
- `metadata` contains paging data
- the guide shows `metadata.paging.next` as the link to the next page

### Activity-history filtering
The reviewed guide explicitly documents FIQL filter support on activity-history endpoints.

Reviewed example filter:
```json
"filter" : "status==ACCEPTED;(channel==PUBLIC_WEB_API,channel==PUBLIC_FIX_API);details.actions.actionType==WORKING_ORDER_DELETED"
```

## Rate limits
The reviewed FAQ page explicitly publishes default limits.

### REST Trading API
- Per-app non-trading requests: **60 per minute**
- Per-account trading requests: **100 per minute**
  - applies to create/amend position or working-order requests
- Per-account non-trading requests: **30 per minute**
- Historical price data points: **10,000 per week**
  - applies to price-history endpoints

### Streaming API
- **40 concurrent subscriptions**

Additional reviewed quota notes:
- the FAQ says limits cannot currently be increased
- using multiple concurrent streaming connections can lead to API-key suspension
- the FAQ says there are no fees while staying within default quotas

## Pagination
Confirmed from the reviewed guide and `/prices/{epic}` page:
- some list endpoints are paginated
- the response includes `metadata.paging.next` when another page is available
- `/prices/{epic}` supports explicit `pageSize` and `pageNumber`
- setting `pageSize=0` disables paging on `/prices/{epic}`

## Errors
The reviewed guide states:
- failures return `4xx` or `5xx`
- error bodies use JSON of the form `{ "errorCode": "the error code" }`
- validation-style suffixes can vary by field, e.g. `invalid.request.forceOpen`
- responses include `X-REQUEST-ID` for request tracing

Endpoint-specific reviewed examples include:
- `error.security.invalid-details`
- `error.security.api-key-missing`
- `error.public-api.exceeded-account-allowance`
- `error.public-api.exceeded-account-historical-data-allowance`
- `error.public-api.exceeded-account-trading-allowance`
- `error.public-api.exceeded-api-key-allowance`
- `endpoint.unavailable.for.api-key`
- `system.error`

## Response format
Confirmed from the reviewed guide/reference:
- requests use JSON bodies for POST/PUT/DELETE flows
- responses are JSON
- `POST /session` v1/v2 uses auth tokens in headers
- `POST /session` v3 returns OAuth tokens in the JSON body
- historical/list responses may include a `metadata` object with paging links

## Important usage notes
- IG publishes separate demo and production hosts; do not mix credentials/environments.
- The reviewed FAQ says equity-price subscriptions are not available.
- The reviewed FAQ says OTC order types available are fill-or-kill / immediate-or-cancel market and limit orders.
- The reviewed FAQ says up to **20 years** of historical data is available, with shorter retention for fine-grained resolutions: `1 Sec` 4 days, `1 Min` 40 days, `>5 Min`/hourly buckets 360 days, and `1 Day` 15 years.
- The reviewed guide recommends using the streaming API for deal confirmations when possible; `/confirms/{dealReference}` is a fallback.
- Stockbroking is explicitly called out as unsupported for public API users in reviewed error descriptions.
- Token invalidation during weekend maintenance is explicitly documented in the FAQ.

## fireROUTE notes
- Default fireROUTE config should model demo vs production hosts as first-class environment options.
- Preserve IG's versioned operations because the same path often exists in multiple API versions with different auth or payload expectations.
- Separate login/session refresh from trading calls in adapters; v1/v2 header tokens and v3 bearer tokens are materially different.
- Historical-price adapters should enforce documented point/rate limits and respect `metadata.paging.next` when walking result sets.
