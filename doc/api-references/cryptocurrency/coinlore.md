# Coinlore

Official pages manually reviewed:
- https://www.coinlore.com/cryptocurrency-data-api

## Overview
CoinLore publishes a straightforward public crypto market-data page with the endpoint list, parameter notes, and usage guidance directly on one official page. The service is public, keyless, and built around the `api.coinlore.net` host.

Confirmed from the reviewed official docs:
- Base URL/domain: `https://api.coinlore.net`
- Auth model: no API key required
- Recommended usage guidance: about **1 request per second** for fair/stable usage
- Manual route count confirmed in this pass: **11**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/global/` | global crypto stats |
| GET | `/api/assets/` | lightweight asset list |
| GET | `/api/tickers/` | market-cap-sorted ticker list |
| GET | `/api/movers/` | winners/losers feed |
| GET | `/api/ticker/?id={ID}` | one-coin ticker |
| GET | `/api/coin/info/?id={ID}` | static metadata for a coin |
| GET | `/api/coin/ohlcv/?coin={ID}` | 365-day daily OHLCV history |
| GET | `/api/coin/markets/?id={ID}` | top 50 exchanges/markets for a coin |
| GET | `/api/exchanges/` | list exchanges |
| GET | `/api/exchange/?id={ID}` | one exchange plus top 100 pairs |
| GET | `/api/coin/social_stats/?id={ID}` | Twitter/Reddit stats for a coin |

## Parameters and request notes
- Coin-specific routes use numeric/internal CoinLore IDs rather than slugs
- `GET /api/ticker/`, `GET /api/coin/info/`, `GET /api/coin/markets/`, `GET /api/exchange/`, and `GET /api/coin/social_stats/` all require an `id` query parameter
- `GET /api/coin/ohlcv/` uses a `coin` query parameter
- The docs describe `/api/assets/` as the lightweight lookup-table endpoint and `/api/tickers/` as the heavier paginated market-data list

## Authentication
- The official page explicitly says the API is open and requires no registration or API key
- No bearer-token, cookie, or signed-request model was documented on the reviewed page

## Rate limits and errors
- The docs say there is **no strict rate limit**
- CoinLore nonetheless recommends roughly **one request per second** for stable and fair usage
- No formal error-schema table was visible on the reviewed page

## Response format notes
- Responses are JSON
- The official page includes live examples, field descriptions, and playground support on the same page

## Important usage notes
- This is a clean public-data provider rather than a trading/execution API
- The endpoint catalog is explicit enough that CoinLore is easy to integrate without guessing hidden routes
- fireROUTE should preserve CoinLore’s simple query-parameter style rather than forcing more complex provider-specific abstractions
