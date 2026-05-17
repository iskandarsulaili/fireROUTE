# Nasdaq Data Link

## Provider metadata
- Category: `Open Data`
- Provider slug: `nasdaq-data-link`
- Description: `Stock market data`
- Official docs/pages used:
  - `https://docs.data.nasdaq.com/docs/getting-started`
  - `https://docs.data.nasdaq.com/docs/data-organization`
  - `https://docs.data.nasdaq.com/docs/api-for-real-time-or-delayed-data`
  - `https://docs.data.nasdaq.com/docs/rate-limits-for-real-timedelayed-rest-api`
  - `https://docs.data.nasdaq.com/docs/api-and-analysis-tools-for-tables-data`
  - `https://docs.data.nasdaq.com/docs/quick-start-examples-9`
  - `https://docs.data.nasdaq.com/docs/parameters-1`
  - `https://docs.data.nasdaq.com/docs/in-depth-usage-1`
  - `https://docs.data.nasdaq.com/docs/large-table-download`
  - `https://docs.data.nasdaq.com/docs/rate-limits-1`
  - `https://docs.data.nasdaq.com/docs/error-codes`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/README.md` (official Nasdaq GitHub repo linked from the docs page)
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/authenticate.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/lastsale.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/lasttrade.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/lastquote.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/snapshot.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/trends.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/bars.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/bars-all.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/indexvalue.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/indexsnapshot.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/etpvalue.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/etpsnapshot.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/chain.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/prices.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/greeksandvols.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/greeksandvolsbasic.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/news.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/symbols.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/symbol.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/indexes.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/index.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/indexparticipants.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/etps.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/etp.md`
  - `https://raw.githubusercontent.com/Nasdaq/NasdaqCloudDataService-REST-API/main/restapi/contracts.md`
- Confirmed public API base URLs:
  - Tables API: `https://data.nasdaq.com/api/v3`
  - Bulk-download API: `https://data.nasdaq.com/api/v1`
  - Real-time or delayed API: customer-specific `https://<base_url>/v1` plus one documented `v2` bars route; the official docs say the concrete host is supplied in the onboarding email after sales approval
- Auth model:
  - Tables API: `api_key` query parameter
  - Bulk-download API: `X-Api-Token: <your api key>` request header
  - Real-time/delayed API: OAuth 2.0-style client credential exchange via `POST /v1/auth/token` using `client_id` and `client_secret`
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages:
  - Tables API: `JSON`, `XML`, `CSV`
  - Bulk download: JSON job/file metadata plus downloadable files such as `.parquet`
  - Real-time/delayed API: JSON examples in the official Markdown reference
- Rate limits officially documented on the reviewed pages:
  - Real-time/delayed REST API: `100 requests/second` across endpoints, with per-endpoint symbol caps
  - Tables API anonymous users: `20 calls / 10 minutes`, `50 calls / day`
  - Tables API authenticated non-premium users: `300 calls / 10 seconds`, `2,000 calls / 10 minutes`, `50,000 calls / day`, concurrency limit `1`
  - Tables API premium subscribers: `5,000 calls / 10 minutes`, `720,000 calls / day`
  - Tables `qopts.export=true` full-table exports: `60 times / hour`
  - Bulk-download API: subscribers should reuse successful responses; ongoing daily limit `30 requests per table`, with an initial `25`-request allowance for new subscribers
- Manually confirmed route count: `29`

## API shape and behavior
- Nasdaq Data Link exposes three distinct API surfaces on the reviewed official docs:
  - Real-time or delayed REST endpoints for subscriber-specific market data products.
  - Tables REST endpoints for queryable datasets on `data.nasdaq.com`.
  - Bulk-download endpoints for large table retrieval jobs and follow-up file downloads.
- The docs explicitly warn that not every product supports every route; each product page indicates which API family applies.
- The real-time/delayed REST API uses a customer-specific hostname supplied after onboarding rather than one universal public host.
- The tables API supports dataset-specific filters plus shared `qopts.*` parameters for projection, exports, and cursor-based paging.
- The bulk-download API is a two-step flow: request files for a filtered slice of a datatable, then download the returned files by filename.

## Canonical endpoints

### Real-time or delayed REST API
1. `POST /v1/auth/token`
   - Exchange `client_id` and `client_secret` for a bearer token.
2. `GET /v1/{source}/{offset}/equities/lastsale/{symbols}`
   - Latest last-sale-eligible transaction for one or more equity symbols.
3. `GET /v1/{source}/{offset}/equities/lasttrade/{symbols}`
   - Latest trade regardless of last-sale condition rules.
4. `GET /v1/{source}/{offset}/equities/lastquote/{symbols}`
   - Latest quote for one or more symbols.
5. `GET /v1/{source}/{offset}/equities/snapshot/{symbols}`
   - Snapshot statistics for one or more symbols.
6. `GET /v1/{source}/{offset}/equities/trends`
   - Gainers/decliners style trends feed.
7. `GET /v1/{source}/{offset}/equities/bars/{symbol}/{precision}/{start-date-and-time}/{end-date-and-time}`
   - Time-bounded equity bars for Texas/PSX-style bars route.
8. `GET /v2/{source}/{offset}/equities/bars/{symbol}/{precision}/{adjusted}/{date-range}`
   - Alternate bars route documented for Nasdaq/CQT/OTCBB with `v2` pathing.
9. `GET /v1/{source}/{offset}/indexes/value/{instruments}`
   - Latest index value feed.
10. `GET /v1/{source}/{offset}/indexes/snapshot/{instruments}`
   - Latest index snapshot feed.
11. `GET /v1/{source}/{offset}/etps/value/{etpIpvSymbols}`
   - Latest ETP/IPV values.
12. `GET /v1/{source}/{offset}/etps/snapshot/{etpIpvSymbols}`
   - ETP snapshot feed.
13. `GET /v1/nasdaq/{offset}/options/chain/{symbol}`
   - Options chain for a symbol.
14. `GET /v1/nasdaq/{offset}/options/prices/{identifier}`
   - Options prices for a contract identifier.
15. `GET /v1/{source}/{offset}/greeksandvolsus/{identifier}`
   - Nasdaq Options Greeks and Implied Volatility.
16. `GET /v1/nasdaq/{offset}/greeksandvolsusbasic/{identifier}`
   - Greeks/implied volatility powered by Nasdaq Basic.
17. `GET /v1/{source}/{offset}/news/{symbols}/{start-date-and-time}/{categories}`
   - News feed for symbols/categories starting at a given time.
18. `GET /v1/reference/symbols`
   - Reference list of symbols.
19. `GET /v1/reference/symbol/{symbol}`
   - Reference details for one symbol.
20. `GET /v1/reference/indexes`
   - Reference list of indexes.
21. `GET /v1/reference/index/{instrument}`
   - Reference details for one index.
22. `GET /v1/reference/indexparticipants/{instrument}`
   - Constituents/participants for a reference index.
23. `GET /v1/reference/etps`
   - Reference list of ETPs.
24. `GET /v1/reference/etp/{symbol}`
   - Reference details for one ETP.
25. `GET /v1/reference/contracts/{symbol}`
   - Reference option contracts for a symbol.

### Tables API
26. `GET /api/v3/datatables/{datatable_code}.{format}`
   - Query a datatable using table-specific filters and shared `qopts.*` controls.
27. `GET /api/v3/datatables/{datatable_code}/metadata.{format}`
   - Retrieve datatable schema/metadata including filterable columns and primary keys.

### Bulk-download API
28. `GET /api/v1/bulkdownloads/{datatable_code}`
   - Request a filtered or full-history bulk download job for a datatable.
29. `GET /api/v1/bulkdownloads/file/{filename}.{ext}`
   - Download a generated bulk file returned by the prior bulk-download request.

## Core parameters and path conventions

### Shared real-time/delayed path variables
- `source` - exchange/data source such as `Nasdaq`, `BX`, `PSX`, `CQT`; exact accepted values vary by route.
- `offset` - whether the customer is entitled to `realtime` or `delayed` data.
- `symbols`, `symbol`, `instruments`, `instrument`, `identifier`, `etpIpvSymbols` - symbol or contract identifiers; some routes accept comma-separated lists.
- `precision`, `start-date-and-time`, `end-date-and-time`, `adjusted`, `date-range`, `categories` - route-specific path variables used by bars/news endpoints.

### Shared tables query controls from the official docs
- `api_key` - required for authenticated tables requests.
- `qopts.columns` - request specific columns only.
- `qopts.export` - package results into a downloadable zip/export workflow.
- `qopts.per_page` - page size for table results, up to `10,000` rows.
- `qopts.cursor_id` - cursor for pagination; a `null` cursor means the current page is the last page.
- Filter operators documented for tables filters: `.gt`, `.lt`, `.gte`, `.lte` in addition to exact-match usage.
- The docs state only columns marked as filterable in a table's documentation/metadata may be used as row filters.

### Bulk-download request controls from the official docs
- Header auth: `X-Api-Token`.
- Predicate suffixes documented for schema columns: `.eq`, `.lt`, `.lte`, `.gt`, `.gte`, `.uppereq`, `.neq`, `.upperneq`, `.in[]`, `.upperin`, `.nin`, `.uppernin`.
- The docs present bulk filters as schema-driven; column names in the selected datatable become the query parameter keys.

## Response and pagination notes
- The tables API examples return a `datatable` object plus `meta.next_cursor_id` for pagination.
- The bulk-download request returns a `bulk_download` object including `code`, `filters`, `status`, `total_size`, `files`, `errors`, and `rate_limited_until`.
- Real-time/delayed endpoint examples in the official Markdown pages return JSON arrays or objects specific to each resource family.
- The official docs note that bulk callers should download the files returned by a successful request instead of repeating the same request immediately.

## Error notes
- Real-time/delayed API HTTP response codes documented in the official Nasdaq GitHub reference: `200`, `400`, `401`, `404`, `500`, `503`.
- Tables API docs say all table requests must use HTTPS; plain HTTP requests fail.
- Tables API docs explicitly map standard HTTP classes (`2XX`, `4XX`, `5XX`) and publish provider-specific codes including:
  - quota/rate-limit errors such as `QELx01` through `QELx08`
  - auth/entitlement errors such as `QEAx01`, `QEAx03`, `QEPx01`, `QEPx05`
  - query/parameter errors such as `QESx02` through `QESx09`
  - route/resource errors such as `QECx01` through `QECx06`
  - server/internal errors such as `QEMx01`
- The bulk-download docs say callers receive `rate_limited_until` when they should try again.

## Usage notes
- The reviewed official docs make clear that real-time/delayed access is sales-gated and the concrete hostname is not public until onboarding.
- Tables datasets are not real-time; the reviewed overview says most update once a day with a one-day lag.
- The product page for each dataset indicates which API family is valid for that dataset.
- For tables work, a metadata call is the official way to discover a table's primary keys and filterable columns.
- For large tables, prefer `qopts.export=true` or the dedicated bulk-download API instead of paging huge result sets interactively.

## fireROUTE normalization notes
- Treat the provider as a multi-surface API rather than one uniform host.
- Preserve customer-specific `https://<base_url>` placeholders for the real-time/delayed market-data routes.
- Preserve `v1` versus `v2` path differences exactly as documented.
- Preserve tables formats (`json`, `xml`, `csv`) and shared `qopts.*` semantics instead of flattening them into separate synthetic providers.
- Preserve the distinction between tables query endpoints and bulk-download endpoints; they have different auth/header and quota behavior.
