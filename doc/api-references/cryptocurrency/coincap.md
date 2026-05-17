# CoinCap

Official docs manually reviewed:
- https://pro.coincap.io/api-docs

## Overview
CoinCap’s current official docs expose an authenticated V3 REST API plus paid WebSocket access for cryptocurrency prices, assets, exchanges, markets, rates, technical indicators, and AI-oriented helper endpoints.

Confirmed from the reviewed official docs:
- Base REST URL: `https://rest.coincap.io/v3`
- OpenAPI document advertised by the docs: `https://rest.coincap.io/api-docs.json`
- Auth: bearer token required for all API calls, supplied in the header or URL
- Response format: JSON
- Pagination: list endpoints return **100** rows by default and support up to **2,000** rows per request
- Manual route count confirmed from the reviewed Swagger page: **36** GET routes currently visible

## Confirmed endpoint families
The reviewed docs currently expose these route families:
- `Price`
- `Assets`
- `Exchanges`
- `Markets`
- `Rates`
- `Technical Analysis`
- `Account`
- `Prepaid`
- `Agent Friendly`

## Concrete endpoints confirmed from the reviewed docs
| Method | Path | Notes |
|---|---|---|
| GET | `/price/bysymbol/{symbol}` | USD price by one or more comma-separated symbols |
| GET | `/price/byaddress` | USD price by token contract address and network |
| GET | `/assets` | list assets |
| GET | `/assets/{slug}` | single asset by slug |
| GET | `/assets/{slug}/markets` | markets for a specific asset |
| GET | `/assets/{slug}/history` | historical asset data |
| GET | `/assets/totals/total-marketcap-history` | total market-cap history |
| GET | `/assets/{slug}/marketcap-history` | market-cap history for one asset |
| GET | `/exchanges` | list exchanges |
| GET | `/exchanges/{exchange}` | exchange details |
| GET | `/markets` | list markets |
| GET | `/rates` | conversion rates |
| GET | `/rates/{slug}` | one conversion rate by slug |
| GET | `/ta/{slug}/sma` | full SMA series |
| GET | `/ta/{slug}/sma/latest` | latest SMA point |
| GET | `/ta/{slug}/ema` | full EMA series |
| GET | `/ta/{slug}/ema/latest` | latest EMA point |
| GET | `/ta/{slug}/macd` | full MACD series |
| GET | `/ta/{slug}/macd/latest` | latest MACD point |
| GET | `/ta/{slug}/vwap/latest` | latest 24h VWAP |
| GET | `/ta/{slug}/candlesticks` | candlestick data |
| GET | `/ta/{slug}/rsi` | full RSI series |
| GET | `/ta/{slug}/rsi/latest` | latest RSI point |
| GET | `/ta/{slug}/allLatest` | latest values for all indicators |
| GET | `/account` | account information for current key |
| GET | `/prepaid/info` | prepaid-key balance |
| GET | `/agentFriendly/history/{slug}` | AI-oriented price history |
| GET | `/agentFriendly/full_assets_by_slug` | AI-oriented full asset data |
| GET | `/agentFriendly/assets_search` | AI-oriented asset discovery |
| GET | `/agentFriendly/news_top` | latest crypto news |
| GET | `/agentFriendly/ta/{slug}/sma` | AI-oriented SMA |
| GET | `/agentFriendly/ta/{slug}/ema` | AI-oriented EMA |
| GET | `/agentFriendly/ta/{slug}/rsi` | AI-oriented RSI |
| GET | `/agentFriendly/ta/{slug}/macd` | AI-oriented MACD |
| GET | `/agentFriendly/asset_mcap_history/{slug}` | AI-oriented asset market-cap history |
| GET | `/agentFriendly/total_market_cap_history` | AI-oriented total market-cap history |

## Authentication
Confirmed from the reviewed docs:
- all API calls require authentication
- bearer token auth is accepted in the header or in the URL
- the docs’ interactive Swagger console also requires authorization before testing calls

## Parameters and request notes
Confirmed from the reviewed docs:
- `/price/bysymbol/{symbol}` supports up to **100 comma-separated symbols**
- list endpoints use page-size style pagination with **100 default** items and up to **2,000** per request
- the docs explicitly position `/price/byaddress` for token address + network lookups
- TA routes use `{slug}` path parameters and separate `latest` vs full-series paths
- the docs distinguish AI-oriented `agentFriendly` routes from the normal REST surfaces

## Rate limits and quotas
Confirmed from the reviewed docs:
- all plans are limited to **600 API calls per minute**
- usage is tracked in **API credits**
- each API call costs **1 base credit**, plus **1 additional credit per 2,500 bytes** of additional data
- the WebSocket costs **1 credit per minute of use**
- free tier includes **4,000 credits per month** and **no WebSocket access**
- higher tiers increase monthly credits and unlock WebSocket access

## Important usage notes
- CoinCap’s docs treat the REST and WebSocket products as paid-plan features with tier-specific availability.
- The AI-oriented `agentFriendly` paths are first-party and visible in the official docs, so fireROUTE can expose them as a provider-specific extension rather than treating them as undocumented internals.
- The reviewed docs emphasize that market and asset prices are volume-weighted and exchange-derived; users should not assume a single-source quote model.