# NewsData

## Overview
- Provider: NewsData.io
- Category: News
- Official docs: `https://newsdata.io/documentation`
- Base URL: `https://newsdata.io/api/1`
- Auth: API key required as query parameter `apikey`
- HTTPS: yes
- Response format: JSON
- Pagination: cursor/page-token style is documented through `nextPage` on listing responses; the docs also include a dedicated Pagination section
- Rate limits / credits: the docs page shows plan-based API-credit quotas, including `200/day` on the free plan; credit consumption varies by endpoint/plan

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/latest` | required `apikey`; optional filters such as `q`, `qInTitle`, `country`, `category`, `language`, `domain`, `domainurl`, `from_date`, `to_date`, `size`, `page` | Main latest-news endpoint. |
| GET | `/archive` | required `apikey`; historical filters similar to `/latest` | Historical/archive news retrieval. |
| GET | `/crypto` | required `apikey`; crypto-news filters | Crypto-focused news feed. |
| GET | `/market` | required `apikey`; market/business-news filters | Market-focused news feed. |
| GET | `/sources` | required `apikey`; optional source filters | Source metadata listing. |
| GET | `/count` | required `apikey`; latest-news filter set | Count endpoint for latest/news queries. |
| GET | `/crypto/count` | required `apikey`; crypto filter set | Count endpoint for crypto news queries. |
| GET | `/market/count` | required `apikey`; market filter set | Count endpoint for market news queries. |

## Parameter and format notes
- The documentation includes dedicated sections for Authentication, Response Object, Security, Pagination, advanced `q`/`qInTitle` search, rate limits, credit usage, and HTTP response codes.
- The docs present plan-based quotas rather than one universal request-per-second limit.
- Listing endpoints document pagination via `nextPage`, which should be preserved by any adapter rather than normalized away.

## Usage notes
- NewsData.io is positioned as a global news and historical-news API with multiple specialized collections (`latest`, `archive`, `crypto`, `market`).
- The docs page advertises source/language/country/category filtering and a large global source catalog.
- Because count endpoints are separate routes, fireROUTE adapters should not infer counts by fetching pages unnecessarily.

## Route-count note
- The official documentation page currently exposes `8` confirmed endpoint paths under `/api/1`.

## Sources inspected
- `https://newsdata.io/docs`
- `https://newsdata.io/documentation`
