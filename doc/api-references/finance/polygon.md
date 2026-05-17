# Polygon / Massive

Official docs manually reviewed:
- https://polygon.io/
- https://massive.com/docs/rest/quickstart
- https://massive.com/docs/rest/stocks/overview

## Overview
The original Polygon site currently redirects to Massive, which is the live official developer/docs brand. The reviewed official docs describe a REST API, WebSocket API, and flat files. For this finance-provider file, the manually reviewed route surface below focuses on the official **Stocks REST API**.

## Confirmed base URL
From the official Massive REST quickstart:
- `https://api.massive.com`

## Confirmed authentication model
The quickstart currently documents two supported API-key patterns:
- query auth via the `apiKey` query parameter
- bearer auth via the standard `Authorization` header

The quickstart also directs users to obtain their key from the Massive dashboard.

## Confirmed response format
The official REST quickstart states that Massive REST endpoints return structured JSON and commonly include these root fields:
- `status`
- `count`
- `results`
- `request_id`

The quickstart shows a JSON dividend example using exactly that root structure.

## Confirmed route-count note
The official REST quickstart currently advertises **46 endpoints** for the Stocks category. The Stocks overview page then enumerates the concrete paths in that category.

Manual route count confirmed from the reviewed official pages for the Stocks REST category: **46** routes.

## Manually confirmed stock endpoints from the reviewed overview page
| Method | Path | Purpose |
|---|---|---|
| GET | `/v3/reference/tickers` | List supported tickers |
| GET | `/v3/reference/tickers/{ticker}` | Retrieve one ticker overview |
| GET | `/v3/reference/tickers/types` | List ticker types |
| GET | `/v1/related-companies/{ticker}` | Find related tickers/companies |
| GET | `/v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}` | Custom OHLC aggregate bars |
| GET | `/v2/aggs/grouped/locale/us/market/stocks/{date}` | Daily grouped U.S. stock market summary |
| GET | `/v1/open-close/{stocksTicker}/{date}` | Daily open/close summary for one ticker |
| GET | `/v2/aggs/ticker/{stocksTicker}/prev` | Previous-day OHLC bar |
| GET | `/v2/snapshot/locale/us/markets/stocks/tickers/{stocksTicker}` | Single-ticker market snapshot |
| GET | `/v2/snapshot/locale/us/markets/stocks/tickers` | Full-market stock snapshot |
| GET | `/v3/snapshot` | Unified multi-asset snapshot |

## Confirmed parameters and usage notes
From the reviewed official quickstart/overview pages:
- auth query parameter name: `apiKey`
- confirmed path parameters include `ticker`, `stocksTicker`, `multiplier`, `timespan`, `from`, `to`, and `date`
- the aggregate-bars route is documented in Eastern Time (ET)
- grouped/snapshot routes are plan-sensitive; the overview repeatedly labels endpoint availability by plan

## Pagination
The reviewed quickstart and stocks-overview pages did not surface a single shared pagination contract for all stock endpoints. Pagination/filtering appears to be endpoint-specific and should be read from the dedicated endpoint page before implementation.

## Rate limits and plan notes
The reviewed official pages clearly expose plan-based access and endpoint inclusion, but they did **not** publish a single numeric universal rate limit in the pages reviewed during this pass.

## Important usage notes
- The provider has been rebranded from Polygon to Massive; the live official docs are on `massive.com`.
- The reviewed quickstart makes it explicit that REST, WebSocket, and Flat Files are separate transport surfaces.
- This file documents the currently official Stocks REST surface only, which matches the finance categorization of the provider entry.
