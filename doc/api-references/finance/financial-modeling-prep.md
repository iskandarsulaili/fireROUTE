# Financial Modeling Prep

Official docs manually reviewed:
- https://site.financialmodelingprep.com/developer/docs
- https://site.financialmodelingprep.com/faqs

## Overview
Financial Modeling Prep (FMP) currently publishes a large REST-style market-data API under the stable base path shown throughout the official docs.

- Base URL: `https://financialmodelingprep.com/stable`
- Transport: HTTPS + JSON
- Auth: API key via `apikey` header or `apikey` query parameter
- Manual route count confirmed from the current official docs page: **258** documented `https://financialmodelingprep.com/stable/...` routes visible in official examples on the page

## Authentication
The official docs explicitly say all requests must be authorized with an API key and show both supported patterns:

```http
apikey: YOUR_API_KEY
```

or append the key to the query string:

```text
&apikey=YOUR_API_KEY
```

The docs note that when a route already has other query parameters you should append the key with `&apikey=`.

## Confirmed endpoints
The official docs page exposes hundreds of concrete example URLs. Representative routes manually confirmed from the live page include:

| Method | Path | Purpose | Confirmed parameters from official example |
|---|---|---|---|
| GET | `/search-symbol` | Search by stock symbol | `query` |
| GET | `/search-name` | Search by company name | `query` |
| GET | `/search-cik` | Search by CIK | `cik` |
| GET | `/search-cusip` | Search by CUSIP | `cusip` |
| GET | `/search-isin` | Search by ISIN | `isin` |
| GET | `/company-screener` | Filter companies by screener criteria | query parameters documented on endpoint page |
| GET | `/search-exchange-variants` | Find symbol variants by exchange | `symbol` |
| GET | `/stock-list` | Full stock directory | none shown in example |
| GET | `/financial-statement-symbol-list` | Symbols with statement coverage | none shown in example |
| GET | `/cik-list` | Paginated CIK directory | `page`, `limit` |
| GET | `/symbol-change` | Symbol-change history | none shown in example |
| GET | `/etf-list` | ETF directory | none shown in example |
| GET | `/actively-trading-list` | Actively trading securities | none shown in example |
| GET | `/earnings-transcript-list` | Transcript inventory | none shown in example |
| GET | `/available-exchanges` | Enumerate exchanges | none shown in example |
| GET | `/available-sectors` | Enumerate sectors | none shown in example |
| GET | `/available-industries` | Enumerate industries | none shown in example |
| GET | `/available-countries` | Enumerate countries | none shown in example |
| GET | `/profile` | Company profile by symbol | `symbol` |
| GET | `/profile-cik` | Company profile by CIK | `cik` |
| GET | `/company-notes` | Company notes | `symbol` |
| GET | `/stock-peers` | Peer-company lookup | `symbol` |
| GET | `/delisted-companies` | Paginated delisted list | `page`, `limit` |
| GET | `/employee-count` | Current employee count | `symbol` |
| GET | `/historical-employee-count` | Historical employee count | `symbol` |
| GET | `/market-capitalization` | Current market cap | `symbol` |
| GET | `/market-capitalization-batch` | Batch market-cap lookup | `symbols` |
| GET | `/historical-market-capitalization` | Historical market cap | `symbol` |
| GET | `/shares-float` | Float metrics for one symbol | `symbol` |
| GET | `/shares-float-all` | Paginated float metrics for all symbols | `page`, `limit` |
| GET | `/mergers-acquisitions-latest` | Latest M&A events | `page`, `limit` |
| GET | `/mergers-acquisitions-search` | Search M&A by name | `name` |
| GET | `/key-executives` | Executive roster | `symbol` |
| GET | `/governance-executive-compensation` | Executive compensation by symbol | `symbol` |
| GET | `/executive-compensation-benchmark` | Compensation benchmark data | none shown in example |
| GET | `/quote` | Full quote | `symbol` |
| GET | `/quote-short` | Short quote | `symbol` |
| GET | `/aftermarket-trade` | Aftermarket trade data | `symbol` |
| GET | `/aftermarket-quote` | Aftermarket quote data | `symbol` |
| GET | `/stock-price-change` | Price-change summary | `symbol` |
| GET | `/batch-quote` | Batch quote lookup | `symbols` |
| GET | `/batch-quote-short` | Batch short quotes | `symbols` |
| GET | `/batch-aftermarket-trade` | Batch aftermarket trades | `symbols` |
| GET | `/batch-aftermarket-quote` | Batch aftermarket quotes | `symbols` |
| GET | `/batch-exchange-quote` | Quotes for one exchange | `exchange` |
| GET | `/batch-mutualfund-quotes` | Batch mutual-fund quotes | none shown in example |
| GET | `/batch-etf-quotes` | Batch ETF quotes | none shown in example |
| GET | `/batch-commodity-quotes` | Batch commodity quotes | none shown in example |
| GET | `/batch-crypto-quotes` | Batch crypto quotes | none shown in example |
| GET | `/batch-forex-quotes` | Batch forex quotes | none shown in example |

## Pagination and parameter patterns
The official examples repeatedly show page-based list pagination with parameters such as:
- `page`
- `limit`

Examples visible on the docs page include:
- `/cik-list?page=0&limit=1000`
- `/delisted-companies?page=0&limit=100`
- `/shares-float-all?page=0&limit=1000`
- `/mergers-acquisitions-latest?page=0&limit=100`

Single-resource lookup routes typically use query parameters such as `symbol`, `symbols`, `query`, `cik`, `cusip`, `isin`, `name`, or `exchange`.

## Response format and errors
The introduction states that:
- requests and responses are JSON
- standard HTTP status codes are used to signal success and failure
- endpoints are CORS-enabled and can be called directly from browsers

The FAQ also references:
- `401 Unauthorized` cases tied to invalid API-key usage
- `429 Too Many Requests` / “Too Many Requests” behavior when usage exceeds allowed limits
- `502 Bad Gateway` cases in bulk-workflow discussions

## Rate limits and usage limits
The current FAQ does not publish one universal public numeric calls-per-minute quota for every plan, but it does explicitly confirm:
- API usage limits exist
- usage is tracked on a **rolling 30-day limit that updates daily**
- exceeding allowed usage can trigger a **Too Many Requests** error
- Enterprise customers can request increased API rate limits for a fee
- bulk endpoints should be called **once / 10 seconds**
- the **Profile Bulk / ETF Bulk** endpoints should be called **once / 60 seconds**

## WebSocket notes
The FAQ confirms several current WebSocket usage rules:
- WebSocket access is entitlement-based
- each account gets **one simultaneous WebSocket connection per cluster**
- symbol subscriptions should be sent in lowercase (example: `aapl`)
- the stock WebSocket currently returns data from **8 AM – 5 PM EST**

The reviewed FAQ did not expose a concrete WebSocket URL on the public page, so only the behavioral details above are documented here.

## Important usage notes
- FMP’s public docs now emphasize the `https://financialmodelingprep.com/stable` base path rather than the older mixed-version route patterns seen in historical examples elsewhere.
- The official docs page is very broad; preserve upstream endpoint names exactly because many related routes differ only slightly (`/quote` vs `/quote-short`, `/profile` vs `/profile-cik`, `/market-capitalization` vs `/historical-market-capitalization`).
- Do not assume a single provider-wide pagination envelope schema from the landing page alone; the docs clearly show repeated `page`/`limit` controls, but response shapes vary by dataset family.
- The public FAQ is more useful than the landing docs page for current operational notes such as rolling usage limits, 429 behavior, bulk pacing, and WebSocket concurrency rules.

## fireROUTE notes
- This provider is broad enough to support normalized search, quote, company-profile, market-cap, transcript, exchange, and directory adapters.
- Keep a raw passthrough mode for less-common datasets because the official docs expose hundreds of routes beyond the representative set above.
- Enforce conservative retry/backoff behavior when FMP returns rate-limit or gateway errors, especially around bulk workflows.
