# Gate.io

Official pages manually reviewed:
- https://www.gate.io/api2
- linked first-party references visible on that page for API v4 REST and WebSocket surfaces

## Overview
Gate’s current first-party API landing page is a single official document that still exposes both the legacy API 2.0 spot routes and links to the current API v4 REST/WebSocket references. The reviewed page confirms a legacy market-data host on `https://data.gateapi.io/api2/1` and points users to current v4 docs for spot, margin, and futures trading.

Confirmed from the reviewed official docs:
- Legacy spot-data base on the reviewed page: `https://data.gateapi.io/api2/1`
- Current API families called out by Gate: REST API v4, Futures WebSocket API v4, Spot WebSocket API v4, and legacy API 2.0 spot
- API v4 keys are explicitly documented as separate from API 2.0 keys
- Manual route count confirmed from the legacy API 2.0 page sections: **16**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/pairs` |
| GET | `/marketinfo` |
| GET | `/coininfo` |
| GET | `/marketlist` |
| GET | `/tickers` |
| GET | `/ticker/{currency_pair}` |
| GET | `/orderBook/{currency_pair}` |
| GET | `/tradeHistory/{currency_pair}` |
| GET | `/candlestick2/{currency_pair}` |
| GET | `/p2p/orderBook` |
| POST | `/private/balances` |
| POST | `/private/buy` |
| POST | `/private/sell` |
| POST | `/private/cancelOrder` |
| POST | `/private/openOrders` |
| POST | `/private/tradeHistory` |

## Authentication
Confirmed from the reviewed page:
- Gate distinguishes legacy API 2.0 keys from API v4 keys.
- The legacy page exposes public market-data routes and separate authenticated trade/private API sections.
- For production trading integrations, Gate expects new implementations to use API v4 key management rather than reusing legacy v2 keys.

## Parameters and request notes
- Public market-data endpoints use currency-pair identifiers like `eth_btc` in the path.
- The market-info response includes fee, decimal-place, and minimum-amount metadata for pairs.
- The candlestick endpoint is described as K-line data in the trading market.
- The landing page also exposes dedicated P2P depth, announcements, fees, and demo sections.

## Rate limits
- The reviewed legacy API 2.0 page did not expose a concrete numeric rate-limit table in the visible sections inspected during this pass.
- The page instead steers trading users toward API v4 references for the current production contract.

## Response and error notes
- Public endpoints return simple JSON arrays or objects.
- The legacy page includes a dedicated `Error code` section, confirming provider-specific numeric/string error handling.
- Example payloads on the page show lightweight `result` plus market-specific data structures rather than a universal envelope.

## Important usage notes
- Gate’s current official page makes it clear that API v4 is the modern surface for spot, margin, and futures trading, while API 2.0 remains primarily a legacy spot reference.
- fireROUTE adapters should prefer Gate API v4 for new authenticated exchange integrations and use the legacy `data.gateapi.io` routes only when specifically targeting the old public spot endpoints documented above.
