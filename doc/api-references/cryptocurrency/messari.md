# Messari

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `messari`
- Official docs/pages manually reviewed in this pass:
  - `https://messari.io/api`
  - `https://docs.messari.io/introduction`
  - `https://docs.messari.io/api-reference/authentication`
  - `https://docs.messari.io/api-reference/permissions`
  - `https://docs.messari.io/api-reference/responses`
  - `https://docs.messari.io/api-reference/errors`
  - `https://docs.messari.io/api-reference/versioning`
  - `https://docs.messari.io/llms.txt`
  - `https://docs.messari.io/api-reference/endpoints/metrics/v2/assets/get-v2-assets`
  - `https://docs.messari.io/api-reference/endpoints/monitoring/get-v2-developments`
  - `https://docs.messari.io/api-reference/endpoints/ai/post-v2-chat-completions`
  - `https://docs.messari.io/api-reference/endpoints/ai/post-openai-chat-completions`
  - `https://docs.messari.io/api-reference/endpoints/funding/fundraising-rounds/get-v1-rounds`
  - `https://docs.messari.io/api-reference/endpoints/protocols/core/list-protocols`
  - `https://docs.messari.io/api-reference/endpoints/exchanges/list-exchanges`
- Current API host confirmed from the reviewed docs: `https://api.messari.io`
- Auth model confirmed from the reviewed docs: API key in `x-messari-api-key` / `X-Messari-API-Key`
- Response format confirmed from the reviewed docs: JSON envelope with `error`, `data`, and optional `metadata`
- Manually confirmed currently documented HTTP route count: `102` (`91` `GET`, `8` `POST`, `2` `PATCH`, `1` `DELETE`)

## Manual review result
Messari’s current first-party documentation is substantially richer than the old marketing-only `messari.io/api` landing page. The official docs at `docs.messari.io` now expose a broad, route-level API reference covering quantitative market data, exchange and protocol analytics, monitoring/intel, fundraising, research, topics, token-unlock data, user watchlists, and AI/copilot endpoints.

The official docs index (`llms.txt`) currently exposes **102** directly inspectable HTTP endpoint pages across **15** product families. Sampled route pages consistently show live cURL examples against `https://api.messari.io`, explicit auth headers, response codes, JSON schemas, and per-endpoint parameters.

## Base URLs and versioning
The reviewed Versioning page says Messari follows the pattern:
- `https://api.messari.io/<slug>/v1/<endpoint>`

The currently browsed route pages also show active non-legacy variants including:
- `https://api.messari.io/ai/openai/chat/completions`
- `https://api.messari.io/ai/v1/...`
- `https://api.messari.io/ai/v2/...`
- `https://api.messari.io/bulk/v1/...`
- `https://api.messari.io/funding/v1/...`
- `https://api.messari.io/intel/v1/...`
- `https://api.messari.io/metrics/v1/...`
- `https://api.messari.io/metrics/v2/...`
- `https://api.messari.io/monitoring/v1/...`
- `https://api.messari.io/monitoring/v2/...`
- `https://api.messari.io/news/v1/...`
- `https://api.messari.io/token-unlocks/v1/...`
- `https://api.messari.io/topics/v1/...`
- `https://api.messari.io/user-management/v1/...`

## Authentication
Confirmed from the official Authentication page and sampled endpoint pages:
- All Messari API endpoints require an API key.
- The docs name the header as `x-messari-api-key`.
- Sampled cURL blocks render the header as `X-Messari-API-Key: <api-key>`.
- Authentication is header-based rather than query-string based.
- The auth page’s example request uses `https://api.messari.io/ai/v1/chat/completions`.

Official example header block:

```json
{
  "headers": {
    "x-messari-api-key": "YOUR_API_KEY_HERE"
  }
}
```

Tier/access notes confirmed from the official docs:
- default API-key access includes MessariAI chat-completion endpoints
- Assets & Market Data and Exchanges are described as included for Enterprise on the reviewed docs pages
- additional services such as News, Token Unlocks, Fundraising, Intel, and related premium surfaces are tier-gated and may require enterprise access or sales enablement
- sampled endpoint pages also visibly note `x402` support on some routes

## Rate limits
Confirmed from `API Tiers & Limits`:
- global limit for `Unpaid / Lite / Pro`: `200 requests / min`
- global limit for `Enterprise`: `600 requests / min`
- AI chat-completion limit for `Free`: `10 per day`
- AI chat-completion limit for `Enterprise`: `600 per minute`
- the docs explicitly state there are also service-level rate limits documented on individual endpoint pages

## Response format, pagination, and errors
Confirmed from the official Response and Errors pages:
- standard response envelope:

```json
{
  "error": null,
  "data": {},
  "metadata": {}
}
```

- error example:

```json
{
  "error": "Invalid API key",
  "data": null
}
```

- common metadata fields can include pagination details such as:
  - `limit`
  - `page`
  - `totalRows`
  - `totalPages`
- every request exposes a response header `x-request-id`
- standard HTTP status codes documented globally:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `402 Request Failed`
  - `403 Forbidden`
  - `404 Not Found`
  - `429 Too Many Requests`
  - `500 Internal Server Error`
- the Errors page explicitly recommends exponential backoff after `429`

Important pagination nuance from reviewed route pages:
- most sampled list endpoints use `limit` + `page`
- sampled list endpoints such as `GET /metrics/v2/assets`, `GET /metrics/v1/exchanges`, and `GET /monitoring/v2/developments` show `page` starting at `1`
- the sampled `GET /funding/v1/rounds` page currently documents `page` defaulting to `0`
- treat pagination as endpoint-specific rather than perfectly uniform across the product line

## Route inventory confirmed from the current docs index
The official docs index currently exposes these route families and route counts:

| Family | Confirmed routes | Notes |
|---|---:|---|
| Asset & Market Data (`metrics`) | 19 | v1 and v2 asset/market/network/protocol analytics, metric catalogs, ROI/ATH, and timeseries |
| Protocols | 15 | core, DEX, interoperability, lending, and liquid-staking protocol listings + metric/timeseries routes |
| Monitoring | 14 | taxonomy, developments, events, monitoring views, and saved-view expansions |
| AI / Copilot | 8 | chat completions, deep research jobs, cancellation, and trending questions |
| Signals | 8 | asset signal listings, mindshare movers, and timeseries |
| Fundraising | 7 | organizations, projects, rounds, investors, funds, managers, and M&A |
| User Management | 6 | watchlist create/read/update/delete plus asset membership updates |
| Token Unlocks | 5 | assets, allocations, unlock events, unlock intervals, vesting schedules |
| Exchanges | 4 | exchange list/detail/timeseries/metric-catalog routes |
| Intel | 3 | asset list, event detail/history, and event search via POST |
| Research | 3 | report list, report detail, and report tags |
| Stablecoins | 3 | stablecoin list, metric catalog, and timeseries |
| Topics | 3 | topic classes, current topics, and topic timeseries |
| Bulk | 2 | dataset catalog and dataset download |
| News | 2 | news feed and source catalog |

## Representative confirmed endpoints and parameters
The current docs surface is large, so this section records representative route shapes and the key parameters explicitly visible on the reviewed endpoint pages.

### 1) Asset & Market Data
Directly reviewed:
- `GET /metrics/v2/assets`

Confirmed query parameters on the reviewed `List Assets` page:
- `category`
- `sector`
- `search`
- `limit` (default `10`)
- `page` (default `1`)
- `hasDiligence`
- `hasIntel`
- `hasMarketData`
- `hasNews`
- `hasProposals`
- `hasResearch`
- `hasTokenUnlocks`
- `hasFundraising`
- `coveredByMonitoring`
- `sort` (`name`, `symbol`, `slug`, `category`, `sector`, `rank`; default `rank`)
- `order` (`asc`, `desc`; default `asc`)

Other current Asset & Market Data route families confirmed from the docs index:
- asset list/detail/metric-catalog/timeseries
- market list/detail/metric-catalog/timeseries
- network timeseries
- v2 asset `ROI` and `ATH`
- protocol listings and protocol timeseries under the `metrics/v2` family

### 2) Monitoring
Directly reviewed:
- `GET /monitoring/v2/developments`

Confirmed query parameters on the reviewed `List Developments` page:
- `limit` (default `10`, capped at `100`)
- `page` (default `1`)
- `assetIds`
- `eventIds`
- `intelCategories`
- `intelSubcategories`
- `minimumImportance` (`not-important`, `low`, `medium`, `high`)
- `verified`
- `actionable`
- `governance`
- `assetSectors`
- `assetSubsectors`
- `assetPreTge`
- `assetEcosystemNetworkIds`
- `start`
- `end`
- `search`

Important official behavior notes on that page:
- `assetIds` may be UUIDs or slugs
- unresolved `assetIds` and taxonomy tokens are silently dropped rather than erroring
- `eventIds` are validated and can return `400` with the offending token quoted
- results are ordered most recent first
- each development includes a nested `event` reference

Other monitoring routes confirmed from the docs index include:
- `GET /monitoring/v2/categories`
- development detail
- event list/detail
- monitoring-view list/detail
- all-events/all-developments rollups
- view-scoped developments/events
- an additional legacy-style v1 `POST` events-search route, as exposed by the current docs index

### 3) AI / Copilot
Directly reviewed:
- `POST /ai/v2/chat/completions`
- `POST /ai/openai/chat/completions`

Confirmed request-body fields on the reviewed `POST /ai/v2/chat/completions` page:
- `messages` (required)
- `allow_clarification_query` (default `true`)
- `generate_related_questions` (default `2`)
- `inline_citations` (default `true`)
- `response_format` (`markdown` or `plaintext`; default `markdown`)
- `stream` (default `false`)
- `verbosity` (`succinct`, `balanced`, `verbose`; default `balanced`)

Additional AI routes confirmed from the docs index:
- `GET /ai/v1/deep-research`
- `GET /ai/v1/deep-research/{id}`
- `GET /ai/v1/questions/trending`
- `POST /ai/v1/chat/completions`
- `POST /ai/v1/deep-research`
- `POST /ai/v1/deep-research/{id}/cancel`

### 4) Fundraising
Directly reviewed:
- `GET /funding/v1/rounds`

Confirmed query parameters on the reviewed `Rounds` page:
- `limit` (default `10`)
- `page` (default `0` on this page)
- `fundedEntityId`
- `investorId`
- `type` (large official enum covering seed/series/token-sale/IPO/debt/grant/etc.)
- `stage` (`Seed`, `Early Stage`, `Late Stage`, `Public Equity Offering`, `Post Public Equity`, `Miscellaneous`)
- `raisedAmountMax`
- `raisedAmountMin`
- `isTokenFunded` (default `true`)
- `announcedBefore`
- `announcedAfter`

Other fundraising routes confirmed from the docs index:
- organization lookup
- project lookup
- round investors
- funds
- fund managers
- mergers and acquisitions

### 5) Protocols and Exchanges
Directly reviewed:
- `GET /metrics/v2/protocols`
- `GET /metrics/v1/exchanges`

Confirmed query parameters on the reviewed protocol list page:
- `page`
- `limit`
- `sort` (default `tvl_usd`)
- `order` (default `desc`)

The official docs index additionally confirms dedicated protocol route sets for:
- core protocols
- DEX protocols
- interoperability/bridging protocols
- lending protocols
- liquid-staking protocols
- metric catalogs for each subtype
- subtype-specific timeseries metrics

The reviewed exchanges page confirms a paginated exchange surface under `GET /metrics/v1/exchanges`, and the docs index also exposes:
- exchange detail
- exchange timeseries metric
- exchange metrics catalog

### 6) Other current families confirmed by the docs index
Current official docs also expose first-party routes for:
- Bulk dataset discovery and export (`CSV` or `JSONL` downloads)
- Token unlock assets, allocations, events, interval unlocks, and vesting schedules
- Research report list/detail/tags
- News feed and sources
- Topics classes, current topics, and daily topic timeseries
- Signal asset listings, per-asset detail, mindshare gainers/losers, and asset time-series granularity routes
- User watchlists with `GET`, `POST`, `PATCH`, and `DELETE`

## Important usage notes for fireROUTE
- The old `messari.io/api` page is no longer the best source of truth; the current route inventory is on `docs.messari.io`.
- Messari’s docs are product-tier aware. Some route families are explicitly enterprise-gated even though the route pages are publicly browsable.
- Header auth is consistent across the reviewed pages, but access rights are not: a valid key may still receive `403` for premium families.
- Pagination and page numbering are not perfectly standardized across all families; do not assume every list endpoint is 1-indexed.
- The standardized JSON envelope is useful for adapter normalization: check `error` first, then consume `data`, then inspect `metadata` for pagination or trace context.
- Preserve `x-request-id` in logs because the official docs explicitly ask users to include it in support escalations.
- The monitoring family has important token-validation quirks: some bad filter tokens silently drop while other filter types error.
- Some AI and data endpoints visibly advertise `x402` support in the current docs, so payment-aware routing may matter for future integrations.
- The current official docs surface is large enough that the previous three-route repo note was materially incomplete; this provider should be treated as a broad multi-family commercial crypto data platform, not a tiny asset-metrics API.
