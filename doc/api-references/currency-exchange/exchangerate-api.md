# ExchangeRate-API

Official docs manually reviewed:
- https://www.exchangerate-api.com/docs/overview
- https://www.exchangerate-api.com/docs/standard-requests
- https://www.exchangerate-api.com/docs/pair-conversion-requests
- https://www.exchangerate-api.com/docs/enriched-data-requests
- https://www.exchangerate-api.com/docs/historical-data-requests
- https://www.exchangerate-api.com/docs/supported-codes-endpoint
- https://www.exchangerate-api.com/docs/request-quota-endpoint
- https://www.exchangerate-api.com/docs/free

## Overview
ExchangeRate-API exposes versioned REST endpoints for current rates, pair conversion, enriched metadata, historical data, supported codes, account quota, and a separate no-key open endpoint.

Primary authenticated base:
- `https://v6.exchangerate-api.com/v6`

Open/no-key base:
- `https://open.er-api.com/v6`

Auth model:
- authenticated routes place the API key in the path as `/v6/{api_key}/...`
- the separate open endpoint requires no API key but requires attribution and is rate limited

Response format:
- JSON in all reviewed examples

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/v6/{api_key}/latest/{base_code}` | Standard latest rates for all supported currencies from one base | `api_key`, `base_code` |
| GET | `/v6/{api_key}/pair/{base_code}/{target_code}` | Pair conversion rate only | `api_key`, `base_code`, `target_code` |
| GET | `/v6/{api_key}/pair/{base_code}/{target_code}/{amount}` | Pair conversion plus converted amount | `api_key`, `base_code`, `target_code`, `amount` |
| GET | `/v6/{api_key}/enriched/{base_code}/{target_code}` | Pair conversion plus localization and currency metadata | `api_key`, `base_code`, `target_code` |
| GET | `/v6/{api_key}/history/{base_code}/{year}/{month}/{day}` | Historical daily conversion table | `api_key`, `base_code`, `year`, `month`, `day` |
| GET | `/v6/{api_key}/history/{base_code}/{year}/{month}/{day}/{amount}` | Historical daily conversion table with supplied amount converted to all currencies | `api_key`, `base_code`, `year`, `month`, `day`, `amount` |
| GET | `/v6/{api_key}/codes` | List supported currencies and display names | `api_key` |
| GET | `/v6/{api_key}/quota` | Show account quota status | `api_key` |
| GET | `/v6/latest/{base_code}` on `open.er-api.com` | Open-access latest rates endpoint without an API key | `base_code` |

Manual route count confirmed from the reviewed official docs: **9** routes.

## Authentication and plans
Authenticated examples use the API key in the path, for example:

```text
GET https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
```

The reviewed docs also confirm plan gating:
- `latest`, `pair`, `codes`, and `quota` are available on lower plans
- `enriched` requires Business or Volume
- `history` requires Pro, Business, or Volume

## Response patterns
Common success fields shown repeatedly across current/latest/pair responses include:
- `result`
- `documentation`
- `terms_of_use`
- time fields such as `time_last_update_unix`, `time_last_update_utc`, `time_next_update_unix`, `time_next_update_utc`
- route-specific payload fields such as `conversion_rates`, `conversion_rate`, `conversion_result`, `target_data`, `supported_codes`, or quota fields

Common error body shape shown in the reviewed docs:

```json
{
  "result": "error",
  "error-type": "unknown-code"
}
```

Reviewed pages list error types such as:
- `unsupported-code`
- `malformed-request`
- `invalid-key`
- `inactive-account`
- `quota-reached`
- `plan-upgrade-required`
- `no-data-available` (historical endpoint)

## Endpoint notes

### `GET /v6/{api_key}/latest/{base_code}`
Returns latest conversion rates from the requested base to all supported currencies.

Primary response payload field:
- `conversion_rates`

### `GET /v6/{api_key}/pair/{base_code}/{target_code}`
Returns a minimal pair response.

Primary route-specific fields:
- `base_code`
- `target_code`
- `conversion_rate`

### `GET /v6/{api_key}/pair/{base_code}/{target_code}/{amount}`
Adds:
- `conversion_result`

### `GET /v6/{api_key}/enriched/{base_code}/{target_code}`
Adds `target_data`, with officially documented fields including:
- `locale`
- `two_letter_code`
- `currency_name`
- `currency_name_short`
- `display_symbol`
- `flag_url`

### `GET /v6/{api_key}/history/{base_code}/{year}/{month}/{day}`
Historical daily snapshot for all available currencies.

Primary payload field:
- `conversion_rates`

### `GET /v6/{api_key}/history/{base_code}/{year}/{month}/{day}/{amount}`
Historical conversion results for a supplied amount.

Primary route-specific fields:
- `requested_amount`
- `conversion_amounts`

### `GET /v6/{api_key}/codes`
Returns `supported_codes`, an array of `[code, name]` pairs.

### `GET /v6/{api_key}/quota`
Returns quota information including:
- `plan_quota`
- `requests_remaining`
- `refresh_day_of_month`

### `GET https://open.er-api.com/v6/latest/{base_code}`
Open access endpoint with no API key.

Important official notes:
- attribution is required
- data refreshes once per day
- responses include `time_eol_unix` to warn about endpoint deprecation if needed
- the provider explicitly allows caching

## Rate limits
Reviewed official limits/notes:
- Open endpoint: rate limited; docs recommend caching and say HTTP `429` is returned when rate limited, with allowance restored after 20 minutes
- Free API: `1.5k requests p/m`
- Pro API: `30k requests p/m`
- Update cadence: open/free once per day; Pro every 60 minutes

## Historical-data caveats
The historical docs explicitly note:
- full supported-currency coverage is available from `2021-01-01` onward
- a smaller currency set is available from `1990-01-01` through `2020-12-31`
- rates are indicative daily mid-rates and not suited for settlement or day-trading backtests

## Pagination
No pagination model is documented for the confirmed endpoints.

## Important usage notes
- Currency codes are ISO 4217 three-letter codes.
- Path segments `year`, `month`, and `day` are numeric; the docs say month/day should be provided without leading zeroes.
- For the open endpoint, attribution and reasonable caching are part of the official usage guidance.
