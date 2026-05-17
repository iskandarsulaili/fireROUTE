# CoinGecko

Official docs manually reviewed:
- https://docs.coingecko.com/reference/authentication
- https://docs.coingecko.com/reference/authentication-demo
- https://docs.coingecko.com/reference/coins-markets
- https://docs.coingecko.com/reference/coins-id

## Overview
CoinGecko’s current official docs expose two closely related REST surfaces: the paid Pro API and the public Demo API. The same docs site also documents onchain DEX data under the CoinGecko/GeckoTerminal umbrella.

Confirmed from the reviewed official docs:
- Pro base URL: `https://pro-api.coingecko.com/api/v3/`
- Demo base URL: `https://api.coingecko.com/api/v3/`
- Onchain DEX routes are accessed by inserting `/onchain` under the same API root
- Response format: JSON
- Auth:
  - Pro: `x-cg-pro-api-key` header or `x_cg_pro_api_key` query parameter
  - Demo: `x-cg-demo-api-key` header or `x_cg_demo_api_key` query parameter
- Manual route count confirmed from the reviewed pages and examples: **20** concrete routes/examples
  - `Simple`: **3** visible operations
  - `Coins`: **15** visible operations
  - `Ping`: **1** visible operation
  - `Onchain auth example`: **1** concrete onchain route example
- The reviewed sidebar also visibly exposes additional route families for `Search`, `Contract`, `Asset Platforms`, `Categories`, `Exchanges`, `Derivatives`, `Public Treasury`, `NFTs (Beta)`, `Exchange Rates`, `Trending`, `News`, `Global`, and `Onchain DEX API`

## Confirmed endpoint families
### CoinGecko Pro / Demo API
- `Ping`
- `Key`
- `Simple`
- `Search`
- `Coins`
- `Contract`
- `Asset Platforms`
- `Categories`
- `Exchanges`
- `Derivatives`
- `Public Treasury`
- `NFTs (Beta)`
- `Exchange Rates`
- `Trending`
- `News`
- `Global`

### Onchain DEX API
- `Simple`
- `Search`
- `Networks`
- `Dexes`
- `Pools`
- `Tokens`
- `OHLCV`
- `Trades`
- `Categories`

## Concrete endpoints confirmed from the reviewed docs
| Method | Path | Notes |
|---|---|---|
| GET | `/ping` | server status / ping |
| GET | `/simple/price` | coin price by IDs, symbols, or names |
| GET | `/simple/token_price/{id}` | token price by contract address on a platform |
| GET | `/simple/supported_vs_currencies` | supported quote currencies |
| GET | `/coins/list` | coin ID map |
| GET | `/coins/top_gainers_losers` | top gainers and losers |
| GET | `/coins/list/new` | recently added coins |
| GET | `/coins/markets` | market-data list |
| GET | `/coins/{id}` | coin data by ID |
| GET | `/coins/{id}/tickers` | coin tickers by ID |
| GET | `/coins/{id}/history` | historical coin snapshot |
| GET | `/coins/{id}/market_chart` | historical chart data |
| GET | `/coins/{id}/market_chart/range` | chart data within a time range |
| GET | `/coins/{id}/ohlc` | OHLC chart |
| GET | `/coins/{id}/ohlc/range` | OHLC chart within a time range |
| GET | `/coins/{id}/circulating_supply_chart` | circulating supply chart |
| GET | `/coins/{id}/circulating_supply_chart/range` | circulating supply chart within a time range |
| GET | `/coins/{id}/total_supply_chart` | total supply chart |
| GET | `/coins/{id}/total_supply_chart/range` | total supply chart within a time range |
| GET | `/onchain/simple/networks/{network}/token_price/{address}` | onchain token price example explicitly shown in auth docs |

## Authentication
Confirmed from the reviewed Pro and Demo authentication pages:
- Pro API root must be `https://pro-api.coingecko.com/api/v3/`
- Demo API root must be `https://api.coingecko.com/api/v3/`
- header auth is recommended over query-string auth
- Pro auth options:
  - header: `x-cg-pro-api-key`
  - query: `x_cg_pro_api_key`
- Demo auth options:
  - header: `x-cg-demo-api-key`
  - query: `x_cg_demo_api_key`
- onchain DEX endpoints use the same auth model as the other CoinGecko API endpoints

## Parameters and request notes
Confirmed from the reviewed docs and examples:
- `/simple/price` uses query parameters such as `vs_currencies`, `ids`, `names`, and `symbols`
- `/coins/{id}` uses the coin’s API ID in the path; reviewed example used `bitcoin`
- CoinGecko explicitly recommends obtaining IDs through `/coins/list` or the coin page’s API ID field
- onchain example paths include a `{network}` segment and a token contract `{address}` segment
- the reviewed docs separate Pro-only features with badges like `💼` and higher-tier features with `👑`

## Rate limits and credits
Confirmed from the reviewed auth pages:
- each request counts as **1 call / 1 credit**
- for Pro, each successful **200** response deducts **1** monthly credit
- unsuccessful requests (`4xx`, `5xx`, etc.) do **not** deduct monthly credits
- regardless of HTTP status, requests still count toward the **minute rate limit**
- monthly credits and minute rate limits are plan-dependent

## Important usage notes
- CoinGecko’s current docs clearly distinguish the public Demo API from the paid Pro API; fireROUTE should preserve the base URL and auth-header difference.
- The docs explicitly support query-string API keys, but recommend header auth for security; fireROUTE should default to header injection.
- Onchain DEX data is first-party in the current docs and lives under `/onchain`, so it should be treated as part of the live CoinGecko route surface rather than a separate unofficial provider.
- The docs site also exposes WebSocket and Webhook sections, but this provider file is limited to the manually reviewed REST/onchain routes above.