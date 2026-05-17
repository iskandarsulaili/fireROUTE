# Blockchain.com

Official pages manually reviewed:
- https://www.blockchain.com/api
- https://www.blockchain.com/explorer/api/blockchain_api
- https://www.blockchain.com/explorer/api/q
- https://www.blockchain.com/explorer/api/api_websocket
- https://www.blockchain.com/explorer/api/exchange_rates_api
- https://www.blockchain.com/explorer/api/charts_api

## Overview
Blockchain.com’s official developer landing page currently groups several public API surfaces under the Explorer product: Blockchain Data API, Simple Query API, WebSockets, Exchange Rates, and Charts/Statistics. The reviewed docs are public and oriented around the legacy `blockchain.info` endpoint family, which Blockchain.com still documents directly from its official Explorer pages.

Confirmed from the reviewed official docs:
- Official developer landing page: `https://www.blockchain.com/explorer/api`
- Documented endpoint host family on reviewed pages: `https://blockchain.info`
- Public/no-auth style documentation for the reviewed Explorer APIs
- Manual route count confirmed in this pass: **11** concrete routes/patterns

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/rawblock/{block_hash}` | single block lookup; optional `?format=hex` |
| GET | `/rawtx/{tx_hash}` | single transaction lookup; optional `?format=hex` |
| GET | `/block-height/{block_height}` | blocks at a given height; requires `?format=json` in examples |
| GET | `/rawaddr/{bitcoin_address}` | address summary and transactions |
| GET | `/multiaddr?active={addr\|addr}` | multi-address summary |
| GET | `/unspent?active={addr}` | unspent outputs; multiple addresses separated by `|` |
| GET | `/balance?active={addr\|addr}` | balance summary by address |
| GET | `/latestblock` | latest block summary |
| GET | `/unconfirmed-transactions?format=json` | mempool transaction list |
| GET | `/blocks/{time_in_milliseconds}?format=json` | blocks for one day |
| GET | `/blocks/{pool_name}?format=json` | blocks filtered to a mining pool |

## Parameters and request notes
Confirmed from the reviewed Blockchain Data API page:
- `rawaddr` supports `limit` (default `50`, max `50`) and `offset`
- `multiaddr` supports multiple addresses separated by `|`, plus `n`/limit-style pagination and `offset`
- `unspent` supports `limit` (default `250`, max `1000`) and `confirmations`
- Several examples note that adding `&cors=true` enables CORS headers on GET requests
- Address parameters may be base58, hash160, or xpub depending on the endpoint

## Authentication
- No API key or bearer-token requirement was visible on the reviewed Explorer API pages
- The reviewed surfaces are documented as free/public blockchain data endpoints
- Blockchain.com also advertises a separate Pay Partner API, but that was not the surface represented by this provider file

## Rate limits and errors
- No concrete numeric rate limit was published on the reviewed Explorer API pages
- Because the endpoints are public and legacy-style, fireROUTE should expect occasional provider-side throttling or availability differences without relying on an explicit quota contract from the reviewed pages

## Response format notes
- JSON is the primary documented response format
- Some endpoints also support hex/binary-style output variants via `?format=hex`
- The docs show object-style JSON for blocks, transactions, addresses, balances, and unspent outputs

## Important usage notes
- Blockchain.com’s current official docs still document many Explorer endpoints on the legacy `blockchain.info` host family
- The developer landing page clearly separates this public blockchain-data surface from the distinct Pay Partner API product
- The reviewed docs also advertise separate official pages for Simple Query API, WebSockets, Exchange Rates, and Charts/Statistics; those should be treated as adjacent Blockchain.com surfaces rather than inferred from the Blockchain Data API alone
