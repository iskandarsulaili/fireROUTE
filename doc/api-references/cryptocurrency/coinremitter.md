# Coinremitter

Official pages manually reviewed:
- https://coinremitter.com/docs
- https://api.coinremitter.com/docs

## Overview
Coinremitter’s current first-party docs are reachable on `api.coinremitter.com/docs` and explicitly list wallet, invoice, webhook/IPN, and rate-conversion endpoints. The reviewed docs also publish current auth headers, per-minute rate limits, and downloadable Swagger/Postman exports.

Confirmed from the reviewed official docs:
- Base URL: `https://api.coinremitter.com/v1`
- Required auth headers: `x-api-key` and `x-api-password`
- Optional header: `Accept: application/json`
- All timestamps in responses are documented as UTC
- Manual route count confirmed in this pass: **12**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| POST | `/wallet/address/create` | create new wallet address |
| POST | `/wallet/address/validate` | validate an address |
| POST | `/wallet/withdraw/estimate` | estimate withdrawal cost |
| POST | `/wallet/withdraw` | submit withdrawal |
| POST | `/wallet/transaction` | get transaction detail |
| POST | `/wallet/address/transactions` | get transactions by address |
| POST | `/wallet/balance` | wallet balance |
| POST | `/invoice/create` | create invoice |
| POST | `/invoice/get` | fetch invoice |
| GET | `/rate/fiat-to-crypto` | fiat to crypto conversion |
| GET | `/rate/crypto-to-fiat` | crypto to fiat conversion |
| GET | `/rate/supported-currency` | supported conversion currencies |

## Parameters and request notes
- Wallet APIs require both `x-api-key` and `x-api-password` request headers
- The reviewed `Create New Address` page explicitly documents a `label` request field for address creation
- The docs are organized by wallet, invoice, IPN callback, and rate-conversion sections
- Webhook/IPN pages are documented separately from the core CRUD/payment routes

## Authentication
- All reviewed API calls require wallet credentials
- The docs explicitly say: “All API call require API key and password”
- Required headers shown in the reviewed docs: `x-api-key` and `x-api-password`

## Rate limits and errors
Confirmed from the reviewed docs:
- Free plan: **100 API calls per minute**
- Pro plan: **500 API calls per minute**
- Rate-limit counters are exposed via `x-ratelimit-remaining` and `x-ratelimit-limit` response headers
- Exceeding the limit returns HTTP `429` with a “Too Many Attempts” response
- Rate limits reset every **1 minute**
- The docs publish explicit provider error codes including `1001` validation error, `1002` server error, `1003` invalid credentials, `1004` inactive account/API disabled, `1005` missing resource, and `1006` rate limit exceeded

## Response format notes
- JSON is the documented request/response format
- The docs provide downloadable Swagger JSON and Postman JSON exports
- IPN/webhook surfaces are documented alongside the request/response APIs rather than embedded into the main wallet endpoints

## Important usage notes
- Coinremitter is a payment-gateway API, not a public market-data feed
- The docs are coin-specific in presentation (for example BTC API), but the same route structure is positioned as Coinremitter’s broader crypto payment solution pattern
- fireROUTE adapters should account for UTC timestamp semantics and header-based wallet authentication
