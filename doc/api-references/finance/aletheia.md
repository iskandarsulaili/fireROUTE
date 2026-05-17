# Aletheia

Official docs manually reviewed:
- https://aletheiaapi.com/
- https://aletheiaapi.com/docs/

## Overview
Aletheia’s current public docs expose a small REST API for security snapshots, crypto quotes, account usage, and service-version lookup.

Confirmed from the reviewed official docs:
- Base API host: `https://api.aletheiaapi.com`
- Authentication: API key sent in the request header named `key`
- Versioning: some endpoints are versioned via the `Accept-Version` header rather than distinct URL paths
- Default data format shown in the docs: JSON

## Authentication
The docs explicitly state that every API call requires a valid API key.

Confirmed request-header pattern from the reviewed docs:
- `key: YOUR_API_KEY`

Confirmed versioning header:
- `Accept-Version: 2`

The docs specifically describe `Accept-Version` for the `StockData` endpoint family.

## Confirmed endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/StockData` | Retrieve stock/security summary or statistical data |
| GET | `/Crypto` | Retrieve a real-time cryptocurrency quote in USD |
| GET | `/v2/consumption` | Return current-month API-usage totals by service |
| GET | `/version` | Return the currently deployed Aletheia API version |

Manual route count confirmed from the official docs: **4** concrete routes.

## Endpoint details

### `GET /StockData`
The reviewed docs show two documented behaviors on the same path:
- deprecated v1 behavior selected with `Accept-Version: 1`
- current v2 behavior selected with `Accept-Version: 2`

Confirmed required query parameter:
- `symbol` — security symbol to look up

Confirmed v1 optional query parameters:
- `summary` — `true` or `false`
- `statistics` — `true` or `false`

Confirmed v2 optional query parameter:
- `fields` — comma-separated list of fields to return

Confirmed example requests shown in the docs:
- `GET https://api.aletheiaapi.com/StockData?symbol=msft&summary=true`
- `GET https://api.aletheiaapi.com/StockData?symbol=msft&summary=true&statistics=true`
- `GET https://api.aletheiaapi.com/StockData?symbol=msft&fields=Price,MarketCap,DayHigh,DayLow`

Confirmed response-format notes from the reviewed example:
- JSON object with market/fundamental fields such as `Symbol`, `Price`, `MarketCap`, `Currency`, `Volume`, `YearHigh`, `YearLow`, and dividend/statistics fields

### `GET /Crypto`
Official description on the docs page: access pricing and trading-activity data for cryptocurrencies, with quotes in U.S. dollars.

Confirmed required query parameter:
- `symbol` — cryptocurrency symbol such as `BTC`, `DOGE`, or `XRP`

Confirmed example requests:
- `GET https://api.aletheiaapi.com/Crypto?symbol=BTC`
- `GET https://api.aletheiaapi.com/Crypto?symbol=DOGE`
- `GET https://api.aletheiaapi.com/Crypto?symbol=XRP`

Confirmed response-format note:
- JSON response with quote/trading fields for the requested cryptocurrency

### `GET /v2/consumption`
Official description: return the number of API calls made during the current month, grouped by service.

Confirmed response notes from the docs:
- root-level `calls` total for the month
- per-service entries including:
  - `id`
  - `name`
  - `calls`

### `GET /version`
Official description: return the actively deployed Aletheia API version.

The docs present this as a simple service-information endpoint on the same authenticated API host.

## Parameters and request model
Confirmed from the reviewed docs:
- requests are simple HTTP GET calls
- authentication is header-based, not query-string based
- `StockData` uses query parameters for symbol selection and field filtering
- API version selection can be header-based via `Accept-Version`

## Response format
The reviewed docs consistently show JSON responses for data endpoints.

Observed/confirmed response characteristics:
- object-style JSON payloads for quote/data routes
- structured counters for the usage endpoint
- field selection on `StockData` v2 can reduce payload size

## Errors
The reviewed public docs pages used in this pass do **not** publish a consolidated HTTP error table or a canonical JSON error schema.

What is still confirmed:
- all endpoints require a valid API key
- version-sensitive endpoints may behave differently depending on `Accept-Version`
- integrations should preserve upstream HTTP status codes and any returned provider error payloads

## Pagination
No pagination model was documented on the reviewed public pages.

The currently documented Aletheia routes are single-resource or summary endpoints rather than paginated collections.

## Rate limits
No numeric public rate-limit table was visible on the reviewed official pages.

The docs and marketing pages talk about API usage and plan consumption, but they do not publish a concrete per-second or per-minute throttle on the pages reviewed in this pass.

## Important usage notes
- `StockData` v1 is explicitly marked deprecated; the docs recommend using version 2.
- Aletheia versions some functionality with `Accept-Version` instead of changing the path.
- `fields` on `StockData` v2 is the main payload-shaping control and is useful for bandwidth-sensitive adapters.
- The docs describe `Crypto` quotes as USD-denominated.

## fireROUTE notes
- Model Aletheia primarily as a quote/snapshot provider, not a broad historical market-data platform.
- Preserve the provider-specific `key` header name.
- Expose `Accept-Version` on routes where versioned behavior matters, especially `StockData`.
- Prefer the v2 `StockData` behavior in new integrations unless strict backward compatibility is required.
