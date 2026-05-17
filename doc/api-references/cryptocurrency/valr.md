# VALR

Official pages manually reviewed:
- https://docs.valr.com/

## Overview
VALR’s official docs are currently detailed and reachable. The reviewed pages clearly expose public and authenticated route groups, signed-request headers, request-shape rules, global and route-specific rate limits, and a large sidebar-organized API surface for market data, orders, wallets, margin, futures, earn, bundles, and WebSocket flows.

What was confirmed from the reviewed docs:
- Current docs express REST endpoints as relative `/v1/...` and `/v2/...` paths
- The reviewed pages clearly document authenticated-request headers `X-VALR-API-KEY`, `X-VALR-SIGNATURE`, `X-VALR-TIMESTAMP`, and optional `X-VALR-SUB-ACCOUNT-ID`
- Signature algorithm: `SHA512 HMAC`
- API keys require account `2FA` to be enabled
- General REST rate limits: `2000` requests/minute per API key and `1200` requests/minute per IP address
- Manual exact route count confirmed from route strings visible in the reviewed docs: **11**

## Confirmed endpoints
The following exact relative routes were visible in the reviewed docs:

| Method | Path |
|---|---|
| GET | `/v1/public/*` |
| GET | `/v1/public/time` |
| GET | `/v1/public/status` |
| GET | `/v1/public/*/buckets` |
| POST | `/v1/batch/orders` |
| DELETE | `/v1/orders` |
| POST | `/v1/orders` |
| POST / PUT / DELETE | `/v1/loans/*` |
| POST | `/v1/account/subaccount` |
| POST | `/v1/account/subaccount/transfer` |
| GET | `/v1/account/balances` |

Additional route strings visible elsewhere on the reviewed pages include:
- `/v1/withdraw`
- `/v1/orders/market`
- `/ws/account`

## Authentication
The reviewed docs explicitly require signed headers for authenticated calls:
- `X-VALR-API-KEY`
- `X-VALR-SIGNATURE`
- `X-VALR-TIMESTAMP`
- `X-VALR-SUB-ACCOUNT-ID` (optional, when impersonating a subaccount)

The reviewed auth guide states that the signature is created with your API secret from:
- `timestamp`
- HTTP verb
- API path
- request body
- `subaccountId` when impersonating a subaccount

The reviewed docs also state:
- Requests to the authenticated API without an API key are rejected with HTTP `403`
- Any `POST`, `PUT`, or `PATCH` without `content-type: application/json` is rejected with HTTP `403`

## Rate limits
### General REST limits
The reviewed docs explicitly publish:
- `2000` requests/minute per API key
- `1200` requests/minute per IP address
- Limits reset at the start of each minute
- REST and WebSocket limits are governed differently
- Exceeding the limit returns HTTP `429 Too Many Requests`

### Route-specific limits visible in the reviewed docs
- `/v1/public/*` → `GET` → `30/m`
- `/v1/public/time` → `GET` → `20/s`
- `/v1/public/status` → `GET` → `20/s`
- `/v1/public/*/buckets` → `GET` → `20/s`
- `/v1/batch/orders` → `POST` → `400/s`
- `/v1/orders` → `DELETE` → `450/s`
- `/v1/orders` → `POST` → `400/s`
- `/v2/orders/modify` → `PUT` → `400/s`
- `/v1/loans/*` → `POST`, `PUT`, `DELETE` → `1/s`
- `/v1/account/subaccount` → `POST` → `1/s`

For WebSockets, the reviewed docs say:
- limits are enforced per IP address only
- API key limits do not apply
- if exceeded, the server sends `{ "type": "RATE_LIMIT_EXCEEDED" }`

## Response and behavior notes
- The reviewed docs say successful REST responses normally use HTTP `200-299` unless there is a server or infrastructure error.
- API results are wrapped in a JSON result object.
- The docs explicitly warn that receiving an ID does not necessarily mean an order has been placed; when the response status is `202 Accepted`, clients should check order status via REST or WebSocket.

## Important usage notes
- Keep `content-type: application/json` on all mutating authenticated requests.
- The docs separate public, account, wallets, market data, simple buy/sell, exchange buy/sell, brokerage instructions, earn, margin, futures, borrows, bundles, and WebSocket APIs.
- The reviewed docs clearly support subaccount impersonation via `X-VALR-SUB-ACCOUNT-ID`; if used, include the subaccount ID in the signature calculation too.
- The reviewed pages expose relative routes rather than a fully qualified host in the captured sections, so adapter code should preserve route-relative mapping from the official docs and pair it with the currently active VALR API host at integration time.