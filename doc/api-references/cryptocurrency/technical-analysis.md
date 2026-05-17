# Technical Analysis

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `technical-analysis`
- Official docs/pages manually reviewed:
  - `https://technical-analysis-api.com/`
  - `https://technical-analysis-api.com/documentation`
  - `https://technical-analysis-api.com/swagger.json`
- API product described by the reviewed docs: `Technical analysis API`
- Base URL manually confirmed from the reviewed homepage and OpenAPI document: `https://technical-analysis-api.com`
- Primary path prefix manually confirmed from the reviewed routes: `/api/v1`
- Manually confirmed route count: `5`
- Response format shown on the reviewed docs: `JSON`

## Overview
Technical Analysis API publishes a small read-only REST surface for cryptocurrency recommendation, strategy, sentiment, and coin-metadata lookups. The reviewed homepage, ReDoc reference, and first-party Swagger document all agree on a single HTTPS host and a compact `/api/v1` route family.

The current first-party reference is useful but slightly inconsistent: the route paths clearly include `:coin_symbol` and `:strategy` placeholders, while the Swagger parameter objects explicitly document only the `apiKey` query parameter on three endpoints and omit formal path-parameter definitions. The homepage also says an API key can be appended to queries as `?apiKey=xxx`, so the safest interpretation is a query-string API-key model with some gaps in the machine-readable spec.

## Manually confirmed endpoints
| Method | Path | What the reviewed docs show |
|---|---|---|
| GET | `/api/v1/analysis/:coin_symbol` | Combined recommendation endpoint that aggregates the other analysis inputs for one coin |
| GET | `/api/v1/strategy/:strategy/:coin_symbol` | Detailed result for a selected strategy and coin |
| GET | `/api/v1/sentiment/:coin_symbol` | Sentiment score and article-level sentiment data for a coin |
| GET | `/api/v1/detail/overview` | List of supported coins with social/search metadata |
| GET | `/api/v1/detail/:coin_symbol` | Metadata record for one supported coin |

## Parameters and request notes
### Shared auth/query pattern
Confirmed from the reviewed docs intro and examples:
- `apiKey` — query-string API key shown as `?apiKey=xxx`
- The docs introduction says to provide the API key at the end of each query
- The Swagger file explicitly models `apiKey` on `analysis`, `strategy`, and `sentiment`, but not on the two `/detail/...` routes

Example auth pattern shown in the docs:
- `https://technical-analysis-api.com/api/v1/analysis/BTC?apiKey=YOUR_API_KEY`

### `GET /api/v1/analysis/:coin_symbol`
Confirmed from the reviewed docs/examples:
- Path placeholder: `:coin_symbol`
- Produces a combined recommendation summary for one asset
- Sample response fields include `success`, `symbol`, `exchange`, `name`, `date`, `price_btc`, `recommendation`, `description`, `confidence`, `sentiment`, `strategies`, and `patterns`

### `GET /api/v1/strategy/:strategy/:coin_symbol`
Confirmed from the reviewed docs/examples:
- Path placeholders: `:strategy`, `:coin_symbol`
- Returns a strategy-specific result object
- Sample response fields include `strategy`, `result`, and `details`
- The homepage markets `6` technical indicators, but the reviewed route docs did not expose a normalized enum of accepted `:strategy` values in the visible parameter section

### `GET /api/v1/sentiment/:coin_symbol`
Confirmed from the reviewed docs/examples:
- Path placeholder: `:coin_symbol`
- Returns a percentage-style sentiment score for the coin
- Sample response fields include `sentiment` and `articles`
- The reviewed docs describe the score as `100` meaning everyone is positive and `0` meaning people are negative

### `GET /api/v1/detail/overview`
Confirmed from the reviewed docs/examples:
- No query parameters were explicitly documented on the reviewed route page
- Returns the list of supported coins known to the system
- Sample response fields include `symbol`, `name`, `reddit_topic`, and `google_trends`

### `GET /api/v1/detail/:coin_symbol`
Confirmed from the reviewed docs/examples:
- Path placeholder: `:coin_symbol`
- Returns the metadata entry for a single supported coin
- Sample response fields include `symbol`, `name`, `reddit_topic`, and `google_trends`

## Authentication
- The reviewed docs describe authentication as a query-string API key: `?apiKey=xxx`.
- The homepage says users obtain the key after logging in.
- No bearer-token flow, header-based key contract, or OAuth flow was surfaced in the reviewed public docs.
- Because the Swagger file does not model auth consistently on every route, fireROUTE should treat query-string `apiKey` as the documented first-party auth pattern and re-check the live docs before assuming unauthenticated access to `/detail/...` endpoints.

## Rate limits, pagination, errors, and format notes
- JSON is the documented response format across the reviewed examples and Swagger definitions.
- The reviewed API surface is entirely `GET`-only.
- No pagination parameters were documented on the five confirmed routes.
- The reviewed public docs did **not** expose a centralized error-schema section.
- The pricing page does expose plan-level call quotas:
  - Free: `10 API calls / day`
  - Startup: `1000 API calls / day`
  - Professional: `10k API calls / day`
- The reviewed pages did not expose response-header rate-limit telemetry or a separate error-code table.

## Important usage notes
- This API is positioned as an opinionated analytics/recommendation feed, not as an exchange trading API.
- The docs describe recommendation output as informational only and explicitly say the results are **not trading advice**.
- The `/detail/overview` response doubles as the reviewed source of supported-coin discovery for downstream `:coin_symbol` lookups.
- The OpenAPI/Swagger document is useful for route inventory, but it has small documentation-quality issues such as placeholder-style path segments and incomplete parameter modeling; consumers should validate live behavior before relying on strict generated clients.
