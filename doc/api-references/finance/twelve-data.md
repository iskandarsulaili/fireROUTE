# Twelve Data

Official docs manually reviewed:
- https://twelvedata.com/docs/introduction/overview
- https://twelvedata.com/docs/introduction/errors
- https://twelvedata.com/

## Overview
Twelve Data exposes market-data APIs over HTTPS plus a separate WebSocket gateway. In the current official intro docs, the provider positions the API as a broad financial-data platform covering stocks, forex, ETFs, mutual funds, commodities, and cryptocurrencies.

## Confirmed base URLs
- REST: `https://api.twelvedata.com`
- WebSocket: `wss://ws.twelvedata.com`

## Confirmed authentication model
The official intro page currently documents two supported API-key patterns:
- query parameter auth: `apikey=...`
- header auth: `Authorization: apikey <your_api_key>`

The same intro page also notes:
- a demo API key exists for demo requests
- a personal API key is required for full access
- premium endpoints/data are plan-dependent

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/price` | Fetch the latest price for a symbol | `symbol`, `apikey` when using query auth |

Manual route count confirmed directly from the reviewed official pages: **1** route.

## Confirmed request and response format notes
From the reviewed introduction page:
- responses default to JSON
- parameter names are case-insensitive
- multiple values are comma-separated where supported
- null values can appear in response payloads
- WebSocket is documented separately from REST under the dedicated `wss://ws.twelvedata.com` endpoint

The official quickstart cURL example is:

```text
GET https://api.twelvedata.com/price?symbol=AAPL&apikey=your_api_key
```

## Pagination
No universal pagination contract was surfaced on the reviewed intro pages. Pagination/limit behavior appears to be endpoint-specific and should be checked on the individual endpoint reference pages before implementation.

## Errors
The official docs have a dedicated Errors section, but during this pass the intro pages were the pages that clearly exposed the live base URLs, auth methods, and first concrete HTTP example. No single canonical error JSON example was clearly surfaced in the reviewed snapshot, so fireROUTE should treat the error contract as endpoint-specific until a later pass captures the dedicated error examples directly.

## Rate limits and plan notes
The reviewed official intro pages did not publish a single universal numeric rate limit. They did explicitly state:
- API usage is API-key based
- premium endpoints/data are plan-dependent
- demo-key usage is limited to demo requests

## Important usage notes
- The docs currently present Twelve Data as a multi-product platform rather than a small fixed endpoint set.
- The intro quickstart demonstrates `/price` explicitly and SDK examples additionally reference a `time_series` workflow, but this rewrite only counts the concrete HTTP route directly confirmed in the reviewed docs page.
- Because the provider separates REST and WebSocket transports, fireROUTE integrations should keep those transports configurable independently.
