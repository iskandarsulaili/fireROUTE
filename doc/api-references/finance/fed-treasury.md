# Fed Treasury

Official docs manually reviewed:
- https://fiscaldata.treasury.gov/api-documentation/

## Overview
The U.S. Treasury Fiscal Data API publishes federal finance datasets as REST-style read-only endpoints under a shared Fiscal Service base URL. The reviewed documentation page explicitly describes the URL structure, parameter model, response objects, pagination behavior, aggregation behavior, and a visible set of concrete endpoint examples in the official endpoint list.

- Base URL: `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/`
- Transport: HTTPS
- Primary response format: JSON
- Also supported: `csv`, `xml`
- HTTP method documented: `GET` only
- Auth requirement: no public API key requirement documented for normal access
- Compression: `utf-8` responses with `gzip` support documented

## Authentication and access
The reviewed `License and Authorization` section says the data is offered free and without restriction for commercial or non-commercial use.

The reviewed docs do **not** require an API key for the public examples and describe the API as openly accessible. However, the official response-code table still includes:
- `403 Forbidden - API Key is not valid`

For fireROUTE, treat Fed Treasury as a public unauthenticated API, but preserve upstream `403` handling in case Treasury adds or changes gateway controls.

## Confirmed endpoint URL structure
The reviewed docs explicitly show this request model:

```text
Base URL + Endpoint + Parameters/Filters
```

Official example from the docs:

```text
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate,record_date&filter=record_date:gte:2015-01-01
```

## Confirmed endpoints
The following concrete dataset paths were visibly listed or exemplified in the reviewed official docs page.

| Method | Path |
|---|---|
| GET | `/v1/accounting/od/rates_of_exchange` |
| GET | `/v1/accounting/mts/mts_table_9` |
| GET | `/v1/accounting/mts/mts_table_1` |
| GET | `/v2/accounting/od/avg_interest_rates` |
| GET | `/v2/debt/tror/data_act_compliance` |
| GET | `/v2/accounting/od/redemption_tables` |
| GET | `/v2/accounting/od/title_xii` |
| GET | `/v1/accounting/dts/operating_cash_balance` |
| GET | `/v1/accounting/dts/deposits_withdrawals_operating_cash` |
| GET | `/v1/accounting/dts/public_debt_transactions` |
| GET | `/v1/accounting/dts/adjustment_public_debt_transactions_cash_basis` |
| GET | `/v1/accounting/dts/debt_subject_to_limit` |
| GET | `/v1/accounting/dts/inter_agency_tax_transfers` |
| GET | `/v2/debt/tror` |
| GET | `/v2/accounting/od/debt_to_penny` |
| GET | `/v1/debt/top/top_state` |

Manual route count confirmed from the reviewed official docs page: **16**.

## Parameters
The reviewed parameter documentation exposes a shared query model across Fiscal Data endpoints.

### `fields=`
Use `fields=` to request a subset of columns.

Example pattern:

```text
?fields=country_currency_desc,exchange_rate,record_date
```

### `filter=`
The docs describe filters as:

```text
field:operator:value
```

Supported operators explicitly listed:
- `lt`
- `lte`
- `gt`
- `gte`
- `eq`
- `in`

Examples confirmed in the official docs:
- `?filter=reporting_fiscal_year:in:(2007,2008,2009,2010)`
- `?filter=funding_type_id:eq:202`
- `?filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso),record_date:gte:2020-01-01`

### `sort=`
Sorting accepts a comma-separated field list.
- Ascending: `sort=funding_type_id`
- Descending: `sort=-record_date`
- Nested sort: `sort=-record_calendar_year,-record_calendar_month`

### `format=`
Supported formats explicitly documented:
- `json`
- `xml`
- `csv`

Default when omitted: `json`

### Pagination parameters
The reviewed docs explicitly document:
- `page[number]`
- `page[size]`

Defaults when omitted:
- page number `1`
- page size `100`

Confirmed example:

```text
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/debt/top/top_state?page[number]=10&page[size]=50
```

## Pagination
The provider uses page-number pagination.

Documented controls:
- `page[number]`
- `page[size]`

The reviewed docs also document an HTTP `Link` pagination header with:
- `rel="first"`
- `rel="prev"`
- `rel="next"`
- `rel="last"`

The JSON `links` object also exposes pagination URLs such as:
- `self`
- `first`
- `prev`
- `next`
- `last`

## Responses
The reviewed documentation says:
- default response format is JSON
- `csv` and `xml` are also available through `format=`
- responses are UTF-8 encoded
- gzip is supported

### JSON response envelope
The official docs describe these top-level structures:

#### `meta`
The reviewed docs explicitly list:
- `count`
- `labels`
- `dataTypes`
- `dataFormats`
- `total-count`
- `total-pages`

#### `links`
The reviewed docs explicitly list:
- `self`
- `first`
- `prev`
- `next`
- `last`

#### `data`
`data` contains the requested dataset rows.

#### `error`
The reviewed docs show an error object with:
- `error`
- `message`

Example shape documented by Treasury:

```json
{
  "error": "Invalid Query Param",
  "message": "Invalid query parameter 'sorts' with value '[-record_date]'. For more information please see the documentation."
}
```

## Response codes
The official docs explicitly list these response codes:
- `200 OK`
- `304 Not modified`
- `400 Bad Request`
- `403 Forbidden`
- `404 Not Found`
- `405 Method Not Allowed`
- `429 Too Many Requests`
- `500 Internal Server Error`

No numeric rate-limit quota is published on the reviewed page, but Treasury explicitly documents `429` for rate limiting.

## Aggregation and sums
The official `Aggregation and Sums` section says some field selections automatically aggregate non-unique rows and sum numeric values.

Treasury’s documented example:

```text
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/deposits_withdrawals_operating_cash?fields=record_date,transaction_today_amt
```

This behavior matters for fireROUTE because a narrowed `fields` set can materially change row cardinality.

## Important usage notes
- Endpoint paths are lowercase and use underscores as word separators.
- Treasury documents endpoint names in singular case.
- All official examples use `GET`; mutation methods are not part of this API.
- The docs are dataset-oriented: each endpoint maps to a single database table.
- Preserve Treasury pagination metadata and links when possible.
- Treat aggregation side effects carefully when `fields=` removes distinguishing columns.

## fireROUTE notes
- Fed Treasury is a strong fit for a raw dataset adapter rather than an aggressively normalized finance abstraction.
- Keep the shared query model (`fields`, `filter`, `sort`, `format`, `page[number]`, `page[size]`) first-class in routing.
- Preserve the provider `meta`, `links`, and `data` envelope because Treasury documents them explicitly and they are useful to downstream clients.
