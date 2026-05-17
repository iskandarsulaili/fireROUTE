# MarketAux

## Overview
- Provider: MarketAux
- Category: News
- Official docs: `https://www.marketaux.com/documentation`
- Base URL: `https://api.marketaux.com/v1`
- Auth: API token required as query parameter `api_token`
- HTTPS: yes
- Response format: JSON
- Pagination: page-based; examples and sample responses show `meta.found`, `meta.returned`, `meta.limit`, and `meta.page`
- Rate limits: no single public numeric request-per-minute limit was found on the inspected docs page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/news/all` | required `api_token`; optional filters including `symbols`, `entity_types`, `industries`, `countries`, `search`, `language`, `published_after`, `published_before`, `sentiment_gte`, `sentiment_lte`, `must_have_entities`, `group_similar`, `page`, `limit` | Main finance and market news feed. |
| GET | `/news/similar/{uuid}` | path article UUID; required `api_token`; optional language/date filters | Finds similar news for one article UUID. |
| GET | `/news/uuid/{uuid}` | path article UUID; required `api_token` | Returns one article by UUID. |
| GET | `/entity/stats/intraday` | required `api_token`; optional entity/date/grouping/sort filters | Time-series market/news entity stats endpoint. |
| GET | `/entity/stats/aggregation` | required `api_token`; optional entity/date filters | Aggregated market/news entity stats. |
| GET | `/entity/trending/aggregation` | required `api_token`; optional `countries`, `min_doc_count`, date, language, sort filters | Trending-entity aggregation endpoint. |
| GET | `/entity/search` | required `api_token`; optional `search`, `countries` | Entity lookup/search. |
| GET | `/entity/type/list` | required `api_token` | Returns entity-type metadata. |
| GET | `/entity/industry/list` | required `api_token` | Returns entity-industry metadata. |
| GET | `/news/sources` | required `api_token`; optional `language` | Returns source metadata. |

## Response format notes
- Sample responses on the official site show a top-level `meta` object with paging counters and a `data` array.
- Article objects can include entity-analysis blocks such as `symbol`, `name`, `country`, `type`, `industry`, `match_score`, `sentiment_score`, and `highlights`.
- The docs note that all text data is UTF-8 and all dates are UTC/GMT.

## Usage notes
- The docs explicitly say request GET parameters should be URL-encoded.
- MarketAux focuses on financial / stock-market news and entity analytics rather than general-news coverage.
- Authentication is sent in the query string, not a bearer header, so adapters should preserve the provider's native auth style.

## Route-count note
- The official documentation page currently exposes `10` confirmed GET endpoints.

## Sources inspected
- `https://www.marketaux.com/`
- `https://www.marketaux.com/documentation`
