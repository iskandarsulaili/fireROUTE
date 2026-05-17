# CryptAPI

Official pages manually reviewed:
- https://docs.cryptapi.io/
- https://docs.cryptapi.io/get-started
- https://docs.cryptapi.io/get-started/custom-payment-flow

## Overview
CryptAPI’s current first-party docs are live on `docs.cryptapi.io` and document a lightweight crypto-payment gateway flow centered on per-currency endpoints rather than a single monolithic REST namespace. The reviewed custom-flow guide confirms live API calls on `https://api.cryptapi.io/{ticker}/...`.

Confirmed from the reviewed official docs:
- Base pattern: `https://api.cryptapi.io/{ticker}`
- The reviewed docs use `btc` as the example ticker family
- The custom payment flow does not require traditional account setup or API-key provisioning just to generate forwarding/payment addresses
- Manual route count directly confirmed from the reviewed guide: **5**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/{ticker}/create/` |
| GET | `/{ticker}/info/` |
| GET | `/{ticker}/convert/` |
| GET | `/{ticker}/qrcode/` |
| GET | `/{ticker}/logs/` |

## Authentication and setup
- The reviewed docs explicitly say you do **not** need to create an account or go through complex setup for the basic custom payment flow.
- Instead, you provide your destination wallet address plus callback parameters.
- CryptAPI then forwards payments to your wallet address.

## Parameters and request notes
From the reviewed `btc/create` example:
- Common query parameters include `callback`, `address`, `post`, `json`, `pending`, `multi_token`, and `convert`.
- The docs emphasize minimum transaction amounts per cryptocurrency/blockchain and warn that sub-minimum transfers can be lost.
- The `info` endpoint is the first-party way to fetch those minimum-amount details.

## Important usage notes
- The docs are organized around custom payment flow, e-commerce plugins, tickers, and error handling rather than a generic resource CRUD model.
- fireROUTE adapters should preserve per-ticker endpoint selection and callback/webhook semantics instead of flattening CryptAPI into a single canonical payment route.
