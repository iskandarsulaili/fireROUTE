# Coinpaprika

Official pages manually reviewed:
- https://api.coinpaprika.com
- https://docs.coinpaprika.com/api-reference/rest-api/introduction
- https://docs.coinpaprika.com/llms.txt

## Overview
Coinpaprika’s current official docs are live and substantially richer than the old bare API-root entrypoint from the public-apis index. The reviewed docs confirm separate free and paid REST bases, optional-vs-required API-key behavior depending on plan/features, and a large read-oriented market-data surface spanning coins, tickers, exchanges, tags, contracts, changelog, search, and streaming.

Confirmed from the reviewed official docs:
- Free REST base: `https://api.coinpaprika.com/v1`
- Paid REST base: `https://api-pro.coinpaprika.com/v1`
- Free-plan auth: most reviewed endpoints usable without an API key
- Paid-plan auth example: `Authorization: YOUR_API_KEY`
- Manual route count confirmed in this pass from the live sidebar: **24**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/key/info` | API key info / plan details |
| GET | `/global` | market overview data |
| GET | `/coins` | list coins |
| GET | `/coins/{coin_id}` | coin detail |
| GET | `/coins/{coin_id}/events` | coin events |
| GET | `/coins/{coin_id}/exchanges` | exchanges by coin |
| GET | `/coins/{coin_id}/markets` | markets by coin |
| GET | `/coins/{coin_id}/ohlcv/latest` | last full-day OHLC |
| GET | `/coins/{coin_id}/ohlcv/historical` | historical OHLC |
| GET | `/coins/{coin_id}/ohlcv/today` | today OHLC |
| GET | `/people/{person_id}` | person detail |
| GET | `/tags` | list tags |
| GET | `/tags/{tag_id}` | tag detail |
| GET | `/tickers` | active-coin tickers |
| GET | `/tickers/{coin_id}` | ticker for one coin |
| GET | `/tickers/{coin_id}/historical` | historical ticks for one coin |
| GET | `/exchanges` | list exchanges |
| GET | `/exchanges/{exchange_id}` | exchange detail |
| GET | `/exchanges/{exchange_id}/markets` | exchange markets |
| GET | `/contracts` | list contract platforms |
| GET | `/contracts/{platform_id}` | contracts for one platform |
| GET | `/search` | search suggestions |
| GET | `/price-converter` | convert between currencies |
| WebSocket | `/ticks` | documented streaming surface |

## Parameters and request notes
- The docs use coin IDs such as `btc-bitcoin`
- The quickstart explicitly demonstrates `GET /tickers/{coin_id}`
- Contract/address and exchange/coin endpoints are organized around provider IDs rather than symbols alone
- The reviewed docs navigation also exposes deprecated legacy ticker endpoints and an ID-changelog endpoint for migration support

## Authentication
- The current docs say most endpoints are available without an API key
- For higher limits and premium features, Coinpaprika documents API-key usage via the `Authorization` header on the paid base URL
- The docs explicitly note that some endpoints may require auth in the future as the service expands

## Rate limits and quotas
Confirmed from the reviewed “Getting started” page:
- Free: `20,000` requests/month
- Starter: `400,000` requests/month
- Pro: `1,000,000` requests/month
- Business: `5,000,000` requests/month
- Ultimate: `10,000,000` requests/month
- Enterprise: custom limits

## Response format notes
- REST responses are JSON
- Coinpaprika also offers a separate streaming/WebSocket surface for high-frequency ticker delivery
- The docs differentiate free vs paid hostnames instead of a single host with plan flags

## Important usage notes
- The old `api.coinpaprika.com` root now redirects to the live docs site, which is the correct first-party source to use for manual documentation
- Coinpaprika publishes a useful `llms.txt` documentation index, which is handy for route discovery when the docs UI is JS-heavy
- The provider keeps deprecated ticker routes in the docs while steering new integrations toward the current `/tickers` and `/tickers/{coin_id}` endpoints
