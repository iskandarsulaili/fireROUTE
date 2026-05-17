# CurrencyFreaks

Official docs manually reviewed:
- https://currencyfreaks.com/documentation
- https://currencyfreaks.com/

## Overview
CurrencyFreaks documents a REST API for fiat, crypto, and metals exchange data.

Confirmed from the reviewed docs:
- Base URL: `https://api.currencyfreaks.com/v2.0`
- Auth: API key via query parameter `apikey`
- Response formats: JSON by default, XML with `format=xml`
- HTTPS is required
- Quotas: plan-based hard request quotas; the docs say there are no separate hourly/daily throttles beyond plan quota exhaustion

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/supported-currencies` | Public list of supported currencies and metadata; docs say this endpoint does not require an API key |
| GET | `/currency-symbols` | Currency-code/name lookup |
| GET | `/historical-data-limits` | Availability window per currency |
| GET | `/rates/latest` | Latest rates; supports `base` and `symbols` filtering |
| GET | `/convert/latest` | Convert an amount using latest rates |
| GET | `/rates/historical` | Historical rates for one date |
| GET | `/timeseries` | Daily time-series rates over a date range |
| GET | `/fluctuation` | Absolute/percentage change between two dates |
| GET | `/convert/historical` | Historical conversion for one date |
| GET | `/iptocurrency` | Convert from a source currency toward the currency inferred from an IP address |

Manual route count confirmed from the official docs: **10**.

## Parameters and request model
Commonly documented parameters:
- `apikey` — required on all protected routes
- `format` — set to `xml` for XML output
- `base` — override the default base currency
- `symbols` — comma-separated list of target currencies
- `date` — historical lookup date on historical/conversion routes
- `startDate`, `endDate` — date range on `/timeseries` and `/fluctuation`
- `from`, `to`, `amount` — conversion inputs
- `ip` — source IP for `/iptocurrency`

## Response and error notes
Observed response patterns from the docs:
- latest/historical responses include top-level fields such as `date`, `base`, and `rates`
- conversion responses are route-specific and are based on `from`, `to`, and `amount`
- XML is supported across endpoints when `format=xml` is present

The docs include an `HTTP Error Codes` section, but during this manual pass I only confirmed the presence of that section, not a complete numeric table.

## Rate limits
The reviewed docs explicitly state:
- all free and paid plans have hard request quotas
- when quota is exhausted, requests stop being served
- outside the plan quota, the provider says it does not impose separate daily or hourly rate limits

The numeric quota depends on subscription tier/pricing rather than a universal per-second limit.

## Important usage notes
- `/supported-currencies` is documented as public/no-key.
- Unauthenticated client-side API-key use is explicitly discouraged.
- `base` and `symbols` are implemented as filters on `/rates/latest`, not separate routes.
- The docs show a mix of fiat, crypto, and metals coverage.

## fireROUTE notes
Expose `base`, `symbols`, `date`, `startDate`, `endDate`, `from`, `to`, `amount`, `ip`, and `format` as passthrough parameters where relevant.