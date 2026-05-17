# LocalGov.jp

## Provider metadata
- Category: `Government`
- Provider slug: `localgov-jp`
- Official docs/pages used:
  - `https://localgov.jp/`
  - `https://localgov.jp/api/openapi.json`
  - live API checks during this run:
    - `https://localgov.jp/v1/health`
    - `https://localgov.jp/api/grants/search?limit=1`
    - `https://localgov.jp/api/grants/194255_tokubetsu-jidou-fuyou-teate`
    - `https://localgov.jp/api/furusato/search?limit=1`
    - `https://localgov.jp/api/furusato/152170_rkt-150-000-3-000575`
    - `https://localgov.jp/api/grants/match`
    - `https://localgov.jp/api/furusato/limit`
    - `https://localgov.jp/api/furusato/recommend?limit=1`
    - `https://localgov.jp/api/export/grants`
- Current documented API host: `https://localgov.jp`
- Current documented API path prefix: `/`
- Auth model: no global auth scheme is declared in the reviewed OpenAPI document; the reviewed live endpoints responded without API keys or bearer tokens
- Response format: JSON by default; two detail endpoints also document optional `text/markdown`
- Manually confirmed route count: `23`

## Official usage notes
- The official homepage describes LocalGov.jp as a cross-search service for grants/subsidies from central ministries plus `1,627` municipalities, with daily automated updates.
- The official OpenAPI document is published directly at `https://localgov.jp/api/openapi.json` and declares OpenAPI `3.1.0`.
- The reviewed spec uses one production server only: `https://localgov.jp`.
- The reviewed spec does not publish a global `securitySchemes` section or global `security` requirement.
- The reviewed spec marks several routes as paid or x402-style, but live checks during this run showed public `200 OK` responses for reviewed sample calls to `/api/export/grants` and `/api/furusato/recommend` without extra auth headers.
- The official OpenAPI `info.license` entry says: `Data: original government bodies; structuring layer: CC0`.

## Canonical endpoints confirmed from the official homepage and official OpenAPI document
1. `GET /api/grants/search`
   - Purpose: search grants/subsidies
   - Key query parameters:
     - `keyword` - free-text search
     - `prefecture` - prefecture name
     - `municipality_code` - 6-digit JIS X 0402 municipality code
     - `open_only` - boolean filter for open grants only
     - `min_amount` - minimum maximum-award amount in JPY
     - `sort` - `relevance`, `deadline_asc`, `amount_desc`, `newest`
     - `limit` - default `20`, max `500`
     - `offset` - pagination offset
   - Live confirmation:
     - `limit=1` returned `_canonical`, `query`, `total`, `items`, and `pagination`

2. `GET /api/grants/{id}`
   - Purpose: return one grant record
   - Path parameters:
     - `id` - grant identifier
   - Header parameters:
     - `Accept` - `application/json` or `text/markdown`
   - Live confirmation:
     - the reviewed sample id returned `200 OK`
     - `Accept: text/markdown` returned Markdown content with grant metadata and citation/source notes

3. `POST /api/grants/match`
   - Purpose: suggest grants from a business-profile prompt
   - Request body: `application/json`
   - Body fields:
     - `query` - required free-text business profile
     - `prefecture` - optional prefecture filter
     - `municipality_code` - optional municipality code filter
     - `limit` - optional max `50`, default `10`
   - Live confirmation:
     - a reviewed JSON request returned `200 OK` with `_canonical`, `query`, `matched`, and `items`

4. `GET /api/local/{code}/grants`
   - Purpose: list grants for one municipality
   - Path parameters:
     - `code` - required 6-digit municipality code

5. `POST /api/export/grants`
   - Purpose: bulk export of the grants corpus
   - Official notes:
     - the reviewed spec describes this as `x402`-billed bulk export
     - official description: `$0.10 USDC on Base via x402 micropayment`
   - Responses:
     - `200` bulk JSON
     - `402` payment-required case documented in the spec
   - Live confirmation:
     - the reviewed sample call returned `200 OK` with `request_id`, `filters`, `total`, and `generated_at`

6. `GET /v1/health`
   - Purpose: free health check
   - Live confirmation:
     - returned `ok`, `name`, `env`, `network`, and `timestamp`

7. `GET /v1/health/status`
   - Purpose: free aggregate status summary

8. `GET /api/furusato/search`
   - Purpose: cross-search furusato-nozei gift listings
   - Key query parameters:
     - `keyword`
     - `prefecture`
     - `muni_code` - 6-digit municipality code
     - `category` - `food`, `craft`, `travel`, `event`, `other`
     - `subcategory`
     - `min_amount`, `max_amount`
     - `min_return_rate`
     - `sort` - `relevance`, `amount_asc`, `amount_desc`, `return_rate_desc`, `newest`
     - `limit` - default `20`, max `200`
     - `offset`
   - Live confirmation:
     - `limit=1` returned `_canonical`, `query`, `total`, `items`, and `pagination`

9. `GET /api/furusato/{gift_id}`
   - Purpose: return one furusato gift record
   - Path parameters:
     - `gift_id` - required gift identifier
   - Header parameters:
     - `Accept` - `application/json` or `text/markdown`
   - Live confirmation:
     - the reviewed sample id returned `200 OK` with gift metadata including `gift_name`, `donation_amount_jpy`, `source_url`, and attribution/license fields

10. `GET /api/furusato/municipalities/{muni_code}/gifts`
   - Purpose: list active gifts for one municipality
   - Path parameters:
     - `muni_code` - required 6-digit municipality code
   - Query parameters:
     - `limit` - default `50`, max `200`

11. `GET /api/furusato/stats/{muni_code}`
   - Purpose: municipality-level furusato statistics
   - Path parameters:
     - `muni_code` - required 6-digit municipality code
   - Official notes:
     - summary says the response includes incoming amount, case counts, outflow amount, official contact information, and schema.org data

12. `GET /api/furusato/limit`
   - Purpose: estimate donation deduction cap from query-string inputs
   - Required query parameters:
     - `annual_income_jpy`
   - Optional query parameters:
     - `marital_status` - `single` or `married`
     - `partner_income_jpy`
     - `dependents_adult`, `dependents_elderly`, `dependents_university`, `dependents_minor` - each max `20`
     - `social_insurance_jpy`
     - `other_deductions_jpy`
     - `income_type` - `salary` or `self_employed`

13. `POST /api/furusato/limit`
   - Purpose: estimate donation deduction cap from JSON input
   - Request body: `application/json`
   - Required body fields:
     - `annual_income_jpy`
   - Optional body fields:
     - the same simulation fields documented for the GET variant
   - Live confirmation:
     - a reviewed JSON request returned `200 OK` with `input`, `result.estimated_limit_jpy`, `net_burden_jpy`, `breakdown`, and a disclaimer sourced to the Ministry of Internal Affairs and Communications page

14. `GET /api/furusato/portal_options/{gift_id}`
   - Purpose: list donation/portal options for one gift
   - Path parameters:
     - `gift_id` - required gift identifier
   - Official notes:
     - the reviewed description says ordering is not based on affiliate-fee ranking and must include a direct municipality option

15. `GET /api/furusato/cite/{gift_id}`
   - Purpose: citation helper for one gift
   - Path parameters:
     - `gift_id` - required gift identifier
   - Official notes:
     - the reviewed summary describes this as citation-grade source URL plus Markdown/HTML strings

16. `GET /api/furusato/semantic_search`
   - Purpose: semantic search over furusato gifts
   - Required query parameters:
     - `q`
   - Optional query parameters:
     - `prefecture`
     - `category`
     - `muni_code`
     - `limit` - default `10`, max `50`
   - Official notes:
     - the reviewed summary says Workers AI `bge-m3` plus Vectorize is used when available, with FTS fallback otherwise

17. `GET /api/furusato/coverage`
   - Purpose: return coverage counts and transparency notes for the furusato corpus

18. `GET /api/furusato/recommend`
   - Purpose: recommendation/rerank endpoint for gifts
   - Query parameters:
     - `prefecture`
     - `category`
     - `subcategory`
     - `budget_min_jpy`, `budget_max_jpy`
     - `notes`
     - `limit` - default `10`, max `30`
   - Official notes:
     - the reviewed summary labels this as a paid AI rerank endpoint with deterministic fallback when the external AI key is unavailable
   - Responses:
     - `200`
     - `402` documented in the reviewed spec
   - Live confirmation:
     - a reviewed sample call returned `200 OK` JSON during this run

19. `GET /api/furusato/change_detect`
   - Purpose: diff/change feed for furusato events
   - Query parameters:
     - `since_iso`
     - `muni_code`
     - `gift_id`
     - `limit` - default `100`, max `500`
   - Responses:
     - `200`
     - `402` documented in the reviewed spec

20. `GET /api/furusato/use_history/{muni_code}`
   - Purpose: return municipality donation-use history
   - Path parameters:
     - `muni_code` - required 6-digit municipality code
   - Responses:
     - `200`
     - `402` documented in the reviewed spec

21. `GET /api/furusato/top_movers`
   - Purpose: list gifts with the most recent event movement
   - Query parameters:
     - `window` - `24h`, `7d`, or `30d`; default `24h`
     - `limit` - default `10`, max `50`
     - `prefecture`
     - `category`
     - `muni_code`
   - Responses:
     - `200`
     - `402` documented in the reviewed spec

22. `POST /api/furusato/webhooks/subscribe`
   - Purpose: create a furusato push-event subscription
   - Request body: `application/json`
   - Required body fields:
     - `callback_url` - URI
     - `hmac_secret` - string, min `16`, max `256`
     - `filter` - object
   - Optional body fields:
     - `filter.muni_code` - 6-digit municipality code
     - `filter.category`
     - `filter.subcategory`
     - `filter.gift_id`
     - `filter.event_types` - string array
     - `ttl_days` - default `30`, min `1`, max `90`
   - Responses:
     - `200`
     - `402` documented in the reviewed spec

23. `GET /api/furusato/{gift_id}/price_history`
   - Purpose: return time-series price/return-rate history for one gift
   - Path parameters:
     - `gift_id` - required gift identifier
   - Query parameters:
     - `days` - default `90`, max `365`
   - Responses:
     - `200`
     - `402` documented in the reviewed spec

## Pagination, filtering, and format notes
- The reviewed search/list endpoints use offset-style pagination rather than page-number pagination.
- `GET /api/grants/search` supports `limit` plus `offset` and returned a `pagination` object in the live response.
- `GET /api/furusato/search` also uses `limit` plus `offset` and returned a `pagination` object in the live response.
- The official OpenAPI document constrains several list limits: grants search max `500`, furusato search max `200`, semantic search max `50`, top movers max `50`, and change-detect max `500`.
- Two detail endpoints explicitly support alternate output negotiation with `Accept: text/markdown`: `/api/grants/{id}` and `/api/furusato/{gift_id}`.
- All reviewed live calls returned JSON except the deliberate Markdown test on `/api/grants/{id}`.

## Error, auth, and access notes
- The reviewed OpenAPI document does not define API keys, bearer auth, OAuth, or any other global authentication scheme.
- The reviewed spec documents `404` for the two detail endpoints (`/api/grants/{id}` and `/api/furusato/{gift_id}`).
- The reviewed spec documents `402` responses for bulk export and several paid/premium furusato routes.
- The reviewed sample health/search/detail/limit/export/recommend requests all succeeded anonymously during this run.
- No official rate-limit policy, quota window, or retry/backoff guidance was published in the reviewed homepage or OpenAPI document.

## fireROUTE normalization notes
- Treat `https://localgov.jp` as the canonical host.
- Keep the service split between grants/subsidies endpoints (`/api/grants...`, `/api/local/...`) and furusato-nozei endpoints (`/api/furusato...`).
- Preserve output-format negotiation for `/api/grants/{id}` and `/api/furusato/{gift_id}` because Markdown output is officially documented.
- Preserve the distinction between free health/status routes, standard public JSON routes, and operations whose official descriptions mention x402/payment semantics.
- For municipality-scoped routes, keep 6-digit municipality/JIS codes as strings rather than numeric types to avoid stripping leading zeroes.