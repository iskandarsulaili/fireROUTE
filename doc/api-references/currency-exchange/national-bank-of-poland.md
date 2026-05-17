# National Bank of Poland

Official docs manually reviewed:
- https://api.nbp.pl/en.html

## Overview
The National Bank of Poland (NBP) publishes a public HTTPS API for currency exchange tables, individual currency rates, and gold prices. The official documentation presents the API as a set of parameterized `HTTP GET` requests under a single base URL.

- Base URL: `https://api.nbp.pl/api/`
- Auth: none
- Methods confirmed: `GET`
- Response formats: JSON by default, or XML via `?format=xml` or `Accept: application/xml`
- Historical coverage stated by the docs:
  - exchange rates since `2002-01-02`
  - gold prices since `2013-01-02`
- Time-range limit: a single request cannot cover more than **93 days**

## Authentication
The reviewed official docs describe this as a public API. No API key, OAuth flow, or account-based header is documented.

## Confirmed base URL and format controls
All documented requests start from:

```text
https://api.nbp.pl/api/
```

The reviewed page confirms two response-format controls:
- query parameter: `?format=json` or `?format=xml`
- HTTP header: `Accept: application/json` or `Accept: application/xml`

If no format is specified, the docs state that **JSON is returned by default**.

## Confirmed endpoints

### Exchange-rate tables
| Method | Path | Purpose | Parameters confirmed |
|---|---|---|---|
| GET | `/exchangerates/tables/{table}/` | Current exchange-rate table for table `A`, `B`, or `C` | `table`; optional `format` / `Accept` |
| GET | `/exchangerates/tables/{table}/last/{topCount}/` | Latest `N` tables for a table type | `table`, `topCount`; optional `format` / `Accept` |
| GET | `/exchangerates/tables/{table}/today/` | Table published today, if available | `table`; optional `format` / `Accept` |
| GET | `/exchangerates/tables/{table}/{date}/` | Table for a specific publication date | `table`, `date`; optional `format` / `Accept` |
| GET | `/exchangerates/tables/{table}/{startDate}/{endDate}/` | Table series over a date range | `table`, `startDate`, `endDate`; optional `format` / `Accept` |

### Particular-currency rates
| Method | Path | Purpose | Parameters confirmed |
|---|---|---|---|
| GET | `/exchangerates/rates/{table}/{code}/` | Current rate for one currency in table `A`, `B`, or `C` | `table`, `code`; optional `format` / `Accept` |
| GET | `/exchangerates/rates/{table}/{code}/last/{topCount}/` | Latest `N` quotations for a currency | `table`, `code`, `topCount`; optional `format` / `Accept` |
| GET | `/exchangerates/rates/{table}/{code}/today/` | Currency rate published today, if available | `table`, `code`; optional `format` / `Accept` |
| GET | `/exchangerates/rates/{table}/{code}/{date}/` | Currency rate for a specific date | `table`, `code`, `date`; optional `format` / `Accept` |
| GET | `/exchangerates/rates/{table}/{code}/{startDate}/{endDate}/` | Currency-rate series over a date range | `table`, `code`, `startDate`, `endDate`; optional `format` / `Accept` |

### Gold prices
| Method | Path | Purpose | Parameters confirmed |
|---|---|---|---|
| GET | `/cenyzlota/` | Current gold price | optional `format` / `Accept` |
| GET | `/cenyzlota/last/{topCount}/` | Latest `N` gold quotations | `topCount`; optional `format` / `Accept` |
| GET | `/cenyzlota/today/` | Gold price published today, if available | optional `format` / `Accept` |
| GET | `/cenyzlota/{date}/` | Gold price for a specific date | `date`; optional `format` / `Accept` |
| GET | `/cenyzlota/{startDate}/{endDate}/` | Gold-price series over a date range | `startDate`, `endDate`; optional `format` / `Accept` |

Manual route count confirmed from the reviewed official documentation: **15** GET routes.

## Parameters and path variables confirmed
The official docs explicitly define these placeholders:

- `{table}` — exchange-rate table type: `A`, `B`, or `C`
- `{code}` — three-letter currency code, ISO 4217
- `{topCount}` — maximum size of the returned series
- `{date}` — a single date in `YYYY-MM-DD`
- `{startDate}`, `{endDate}` — range boundaries in `YYYY-MM-DD`
- `format` — `json` or `xml`

Provider-wide behavior confirmed by the docs:
- a request can target current data, today’s data, the last `N` quotations, a specific date, or a bounded date range
- a single request cannot span more than 93 days

## Response structure notes
The official page documents these response fields for exchange-rate responses:
- `table`
- `no`
- `tradingDate` (table `C` only)
- `effectiveDate`
- `rates`
- `country`
- `currency`
- `code`
- `mid` (tables `A` and `B`)
- `bid` and `ask` (table `C`)

For gold-price responses, the page documents:
- `date`
- `code` — despite the label, the docs use this field to describe the gold-price value for 1g of 1000-millesimal gold

The docs' examples and terminology indicate that JSON and XML payload shapes differ in naming/casing, so fireROUTE should preserve upstream response bodies rather than assuming a single normalized schema.

## Error handling
The official documentation explicitly lists these API behaviors:
- `404 Not Found` when there is no data for a correctly determined interval or for a `today` request before publication
- `400 Bad Request` for incorrectly formulated requests
- `400 Bad Request - Limit exceeded` when the request exceeds the allowed returned-data size limit

No provider-wide machine-readable error schema is published on the reviewed page.

## Rate limits and quotas
The reviewed official documentation does **not** publish an API key quota, per-second rate limit, or monthly request allowance.

## Pagination
There is no page-number or cursor pagination model.

Instead, series size is controlled by:
- `last/{topCount}` for recent data
- `startDate` / `endDate` for ranged retrieval
- the documented 93-day maximum span

## Important usage notes
- NBP announced an HTTPS-only transition effective **2025-08-01**; the docs explicitly say HTTP is no longer supported.
- Table `A` and `B` are middle rates; table `C` is buy/sell rates.
- The docs page contains one apparent typo in the human-readable example for the single-date currency path, but the surrounding route pattern clearly indicates the intended path form is `/exchangerates/rates/{table}/{code}/{date}/`.
- The provider groups gold prices into the same API family; although this file lives in `currency-exchange`, the official docs expose both exchange-rate and gold-price routes on the same base host.

## fireROUTE notes
- Treat this as a public read-only `GET` API under `https://api.nbp.pl/api/`.
- Preserve upstream path semantics because table type (`A/B/C`) materially changes the response fields.
- For normalized exchange-rate adapters, expose the five table routes and five single-currency routes directly; gold-price routes can be mapped separately as commodity-like data if needed.
