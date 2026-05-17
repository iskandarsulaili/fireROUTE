# Intrinio

Official docs manually reviewed:
- https://docs.intrinio.com/documentation/api_v2/getting_started
- https://docs.intrinio.com/documentation/api_v2/authentication
- https://docs.intrinio.com/documentation/api_v2/response_codes
- https://docs.intrinio.com/documentation/api_v2/paging
- https://docs.intrinio.com/documentation/api_v2/limits
- https://docs.intrinio.com/documentation/web_api/get_all_filings_v2
- https://docs.intrinio.com/documentation/web_api/search_companies_v2
- https://docs.intrinio.com/documentation/web_api/get_security_realtime_price_v2
- https://docs.intrinio.com/documentation/web_api/get_security_stock_prices_v2
- https://docs.intrinio.com/documentation/web_api/get_options_chain_realtime_v2
- https://docs.intrinio.com/documentation/web_api/get_account_current_usage_v2

## Overview
Intrinio’s current docs expose a very large REST API on `api-v2.intrinio.com` covering filings, fundamentals, companies, securities, prices, ETFs, estimates, options, indices, account/usage, and more.

Confirmed base URL from the reviewed docs:
- `https://api-v2.intrinio.com`

Confirmed transport/format from the reviewed overview page:
- RESTful HTTPS API
- JSON responses

Manual route count confirmed from the current API reference navigation: **218** documented Web API operation pages.

## Authentication
The reviewed docs are internally inconsistent, so auth should remain configurable.

### What the docs currently say
1. **Getting Started** says:
   - “Basic Authentication is administered over HTTPS.”
2. **Authentication** page says a valid API key is required on every request and documents three current approaches:
   - query parameter `api_key`
   - header `Authorization: Bearer {api_key}`
   - public browser-safe header `X-Authorization-Public-Key`
3. **Response Codes** still says `401` means the “User/Password API Keys are incorrect.”

### Practical fireROUTE guidance
For current integrations, the **Authentication** page is the most specific and appears to be the authoritative current source. Keep auth pluggable because the broader docs still carry older Basic-auth wording.

Confirmed examples from the Authentication page:

```text
https://api-v2.intrinio.com/securities/AAPL/prices?api_key={api_key}
```

```http
Authorization: Bearer {api_key}
```

```http
X-Authorization-Public-Key: {public_key}
```

Confirmed public-key notes:
- public keys are intended for public/untrusted environments such as client-side JavaScript
- allowed domains must be configured in the account
- localhost is present by default for development
- unauthorized public-key use returns `401`

## Confirmed representative endpoints
The full docs navigation contains 218 operation pages. The following routes were manually verified in detail from representative endpoint pages:

| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/filings` | SEC/company filing feed | `company`, `report_type`, `start_date`, `end_date`, `industry_category`, `industry_group`, `earnings_release`, `page_size`, `next_page` |
| GET | `/companies/search` | Company search | `query` required; optional `active`, `mode`, `page_size` |
| GET | `/securities/{identifier}/prices/realtime` | Realtime stock price for a security | path `identifier`; optional `source` |
| GET | `/securities/{identifier}/prices` | End-of-day stock prices for a security | path `identifier`; optional `start_date`, `end_date`, `frequency`, `page_size`, `next_page` |
| GET | `/options/chain/{symbol}/{expiration}/realtime` | Realtime option chain for an underlying + expiration | path `symbol`, `expiration`; optional `source`, `type`, `strike`, `strike_greater_than`, `strike_less_than`, `volume_greater_than`, `volume_less_than`, `open_interest_greater_than` |
| GET | `/account/current_usage` | Account usage/limit introspection | page title and sample URL show `/account/current_usage`; top endpoint block on the same page inconsistently shows `/account` |

## Endpoint details
### `GET /filings`
Confirmed official endpoint block:

```text
https://api-v2.intrinio.com/filings
```

Confirmed parameters:
- `company` — company identifier such as ticker, CIK, LEI, or Intrinio ID
- `report_type`
- `start_date`
- `end_date`
- `industry_category`
- `industry_group`
- `earnings_release`
- `page_size`
- `next_page`

Confirmed output fields shown on the page include:
- `filings[]`
- `id`
- `filing_date`
- `accepted_date`

### `GET /companies/search`
Confirmed official endpoint block:

```text
https://api-v2.intrinio.com/companies/search
```

Confirmed parameters:
- `query` — required
- `active`
- `mode` — docs list `starts_with`
- `page_size`

Confirmed output fields shown on the page include:
- `companies[]`
- `id`
- `ticker`
- `name`
- `lei`
- `cik`

### `GET /securities/{identifier}/prices/realtime`
Confirmed official endpoint block:

```text
https://api-v2.intrinio.com/securities/{identifier}/prices/realtime
```

Confirmed parameters:
- path `identifier` — ticker, FIGI, ISIN, CUSIP, or Intrinio ID
- `source` — comma-delimited data sources; docs example uses `iex,delayed_sip`

Confirmed output fields shown on the page include:
- `last_price`
- `last_time`
- `last_size`
- `bid_price`
- `bid_size`
- `bid_time`
- `ask_price`
- `ask_size`
- `ask_time`
- `open_price`
- `close_price`
- `high_price`
- `low_price`

### `GET /securities/{identifier}/prices`
Confirmed official endpoint block:

```text
https://api-v2.intrinio.com/securities/{identifier}/prices
```

Confirmed parameters:
- path `identifier`
- `start_date`
- `end_date`
- `frequency` — `daily`, `weekly`, `monthly`, `quarterly`, `yearly`
- `page_size`
- `next_page`

Confirmed output fields shown on the page include:
- `stock_prices[]`
- `date`
- `intraperiod`
- `frequency`
- `open`
- `high`
- `low`
- `close`

### `GET /options/chain/{symbol}/{expiration}/realtime`
Confirmed official endpoint block:

```text
https://api-v2.intrinio.com/options/chain/{symbol}/{expiration}/realtime
```

Confirmed parameters:
- path `symbol` — underlying symbol
- path `expiration` — expiration date
- `source` — `realtime` or `delayed`
- `type` — `call` or `put`
- `strike`
- `strike_greater_than`
- `strike_less_than`
- `volume_greater_than`
- `volume_less_than`
- `open_interest_greater_than`

The page description says this route returns real-time option prices, quotes, Greeks, implied volatility, and premium data for contracts in the chain.

### Account usage route inconsistency
The **Account Current Usage** page has a notable docs inconsistency:
- the main `ENDPOINT:` block shows `https://api-v2.intrinio.com/account`
- the same page’s sample/data section shows `URL:https://api-v2.intrinio.com/account/current_usage`
- the page title itself is “Account Current Usage”

Because those official elements disagree, fireROUTE should treat the account-usage path as a documentation inconsistency requiring runtime verification before hard-coding.

Confirmed output fields listed on the page include:
- `usage[]`
- `access_code`
- `restriction`
- `count`
- `limit`
- `seconds_until_reset`
- `percentage_used`
- `account.email`

## Pagination
The dedicated paging page documents a shared cursor model for paged endpoints.

Confirmed pagination behavior:
- paged responses include `next_page`
- `next_page = null` means the last page has been reached
- request the next page by sending `next_page` as a query parameter on the next request
- default page size is `100` records per request
- `page_size` can be increased up to `10,000`
- requests using `page_size > 100` are subject to special limits

Official example from the paging page:

```text
https://api-v2.intrinio.com/securities/AAPL/prices?next_page=MjAxOC0wNi0xNHw4NTM1MTc5MjQ0
```

## Rate limits and request limits
The dedicated limits page says request ceilings vary by data feed subscription and request type.

Confirmed published limits:
- many subscriptions have daily limits resetting at **midnight Eastern**
- some subscriptions have per-minute limits (common windows mentioned: `10 minutes` and `1 minute`)
- some high-workload requests have per-second limits

Confirmed special limits for oversized paging requests (`page_size > 100`):
- Free: `1 per minute`
- Paid: `1 per second`
- Custom: `Contact Sales`

Confirmed bulk-request limits:
- Free: `1 per minute`
- Paid: `1 per second`
- Custom: `Contact Sales`

Confirmed free-tier throttle statement:
- users with only free data-feed subscriptions are limited to `100 requests per second`

Confirmed timeout rule:
- requests must complete within `25 seconds`
- otherwise they are dropped with `503`

## Errors
The reviewed Response Codes page publishes this shared status model:

| HTTP code | Meaning |
|---:|---|
| `200` | OK – everything worked as expected |
| `401` | Unauthorized – docs say user/password API keys are incorrect |
| `403` | Forbidden – not subscribed to the requested data feed |
| `404` | Not Found – endpoint does not exist |
| `429` | Too Many Requests – request limit hit |
| `500` | Internal Server Error |
| `503` | Service Unavailable – throttle limit hit or high system load |

Important note:
- the `401` wording on the response-codes page reflects older credential terminology and does not fully match the newer auth page.

## Response format notes
The reviewed overview page says responses are delivered in JSON format.

Confirmed list/response patterns from representative pages:
- filings responses expose arrays like `filings[]`
- company search exposes `companies[]`
- historical prices expose `stock_prices[]`
- account usage exposes `usage[]` plus an `account` object

## Important usage notes
- Intrinio’s docs surface a very broad product catalog; this file documents the shared platform behavior plus representative verified routes, not every single operation in prose.
- Because the public docs still contain older auth terminology alongside newer API-key/bearer/public-key instructions, production adapters should not assume a single auth style without account-specific validation.
- The account-current-usage page currently has a conflicting path presentation (`/account` vs `/account/current_usage`).
- Page-based traversal uses cursor-style `next_page`, not numeric page numbers.
