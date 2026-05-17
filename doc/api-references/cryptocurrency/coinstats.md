# CoinStats

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinstats`
- Official docs/pages manually reviewed:
  - `https://documenter.getpostman.com/view/5734027/RzZ6Hzr3?version=latest`
  - `https://coinstats.app/`
  - `https://coinstats.app/api-docs/openapi.yaml`
- API product described by the reviewed docs: `Public API`
- Base URL manually confirmed from the reviewed request examples: `https://api.coinstats.app/public/v1`
- Manually confirmed route count: `9`
- Response format shown on the reviewed route pages: `JSON`

## Overview
CoinStats still exposes a first-party public REST API on Postman Documenter. The reviewed documentation is organized around four public data groups—coins, exchange tickers, fiat currencies, and news—and every manually confirmed operation on the reviewed page is a `GET` endpoint under the `/public/v1` base.

The Postman page itself says to visit `https://coinstats.app/api-docs` for the latest API, but in this browser run the newer first-party docs host was not usable: navigating directly to `https://coinstats.app/api-docs` timed out, and the obvious official alternative export path `https://coinstats.app/api-docs/openapi.yaml` returned a Cloudflare `Worker threw exception` page. The older official Postman reference was still readable enough to manually confirm the public route surface below.

## Manually confirmed endpoints
| Method | Path | What the reviewed docs show |
|---|---|---|
| GET | `/coins` | Coin list with global average prices, ordered by market cap |
| GET | `/coins/{coinId}` | Single coin with global average prices |
| GET | `/charts` | Historical global average price chart |
| GET | `/exchanges` | Supported exchanges list |
| GET | `/markets` | Market prices across exchanges for a specified coin |
| GET | `/tickers` | Exchange/pair ticker data |
| GET | `/fiats` | Supported fiat currencies list |
| GET | `/news` | News feed with date-range and pagination filters |
| GET | `/news/handpicked` | Filtered / handpicked news feed |

## Parameters and request notes
### `GET /coins`
Confirmed from the reviewed docs/examples:
- `skip` — pagination offset
- `limit` — page size
- `currency` — fiat quote currency for returned prices

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=EUR`

### `GET /coins/{coinId}`
Confirmed from the reviewed docs/examples:
- Path parameter: `coinId`
- Query parameter: `currency`

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/coins/bitcoin?currency=AMD`

### `GET /charts`
Confirmed from the reviewed docs/examples:
- `period` — chart window selector
- `coinId` — target asset

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/charts?period=1m&coinId=ethereum`

### `GET /exchanges`
Confirmed from the reviewed docs/examples:
- No query parameters were shown on the reviewed page

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/exchanges`

### `GET /markets`
Confirmed from the reviewed docs/examples:
- `coinId` — target asset whose exchange markets should be returned

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/markets?coinId=bitcoin`

### `GET /tickers`
Confirmed from the reviewed docs/examples:
- `exchange` — exchange identifier/name
- `pair` — market pair string

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/tickers?exchange=yobit&pair=BTC-USD`

### `GET /fiats`
Confirmed from the reviewed docs/examples:
- No query parameters were shown on the reviewed page

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/fiats`

### `GET /news`
Confirmed from the reviewed docs/examples:
- `skip` — pagination offset
- `limit` — page size
- `fromDate` — lower date/time bound in the visible example
- `toDate` — upper date/time bound in the visible example

Example requests shown in the docs:
- `https://api.coinstats.app/public/v1/news?skip=0&limit=20&toDate=1555508420000&fromDate=1555508420000`
- `https://api.coinstats.app/public/v1/news?skip=0&limit=10`

### `GET /news/handpicked`
Confirmed from the reviewed docs/examples:
- `skip` — pagination offset
- `limit` — page size

Example request shown in the docs:
- `https://api.coinstats.app/public/v1/news/handpicked?skip=0&limit=20`

## Authentication
- The reviewed public Postman documentation did **not** present an API-key header, bearer-token flow, or other auth requirement for the confirmed `/public/v1` routes.
- All reviewed examples were plain unauthenticated `GET` requests against the public base URL.
- Because the newer `coinstats.app/api-docs` host was not usable in this browser run, this statement is limited to the manually reviewed public Postman surface.

## Pagination, errors, and format notes
- JSON response bodies are shown throughout the reviewed Postman documentation.
- Pagination is explicitly visible via `skip` and `limit` parameters on `/coins`, `/news`, and `/news/handpicked`.
- The reviewed public page did **not** expose a shared rate-limit statement.
- The reviewed public page did **not** expose a single centralized error-schema section that could be manually confirmed in this run.
- Example success responses include coin metadata, exchange lists, market/ticker rows, fiat lists, and article/news objects.

## Important usage notes
- This is a public market-data/content API surface, not a trading or account-management API.
- The official Postman page itself says newer API information lives at `https://coinstats.app/api-docs`, so the public Postman reference should be treated as the currently reachable first-party fallback rather than the sole canonical source forever.
- Because the newer official docs host was unstable in this environment, future maintenance should re-check `coinstats.app/api-docs` before assuming the public route set is unchanged.
- fireROUTE adapters should normalize these routes as read-only `GET` endpoints under `https://api.coinstats.app/public/v1`.
