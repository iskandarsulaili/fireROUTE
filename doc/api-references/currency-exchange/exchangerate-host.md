# Exchangerate.host

Official docs manually reviewed:
- https://exchangerate.host/documentation
- https://docs.apilayer.com/exchangerate/docs/api-documentation?utm_source=ExchangerateHostHomePage&utm_medium=Referral
- https://docs.apilayer.com/exchangerate/docs/getting_started

## Overview
The current official Exchangerate.host documentation resolves to an APILayer-hosted documentation set for an authenticated JSON API. The reviewed docs describe six REST endpoints under a single HTTPS base URL.

- Base URL: `https://api.exchangerate.host/`
- Auth: API key in query string as `access_key`
- Methods confirmed: `GET`
- Response format: JSON
- Product note: the current official docs are APILayer-branded and describe plan-dependent access to some features

## Authentication
The reviewed `Getting Started` page states that every user receives a personal API access key and that authentication is done by appending it to endpoint URLs:

```text
?access_key=YOUR_ACCESS_KEY
```

The docs do not show bearer-token or header-only authentication for this product.

## Confirmed endpoints
| Method | Path | Purpose | Parameters confirmed |
|---|---|---|---|
| GET | `/live` | Most recent exchange rates for all or selected currencies | `access_key`, `source` or base/source-currency controls in docs examples, `currencies`/`symbols`, `callback`, `format` |
| GET | `/historical` | Historical rates for a specific date | `access_key`, `date`, optional source/base and currency filters, `callback`, `format` |
| GET | `/convert` | Convert one amount from one currency to another | `access_key`, `from`, `to`, `amount`, optional `date`, `callback`, `format` |
| GET | `/timeframe` | Exchange-rate data across a date range | `access_key`, `start_date`, `end_date`, optional source/base and currency filters, `callback`, `format` |
| GET | `/change` | Absolute/percentage change metrics over time | `access_key`, `start_date`, `end_date`, `currencies`/`symbols`, optional source/base controls, `callback`, `format` |
| GET | `/list` | Supported-currency list | `access_key`, optional `callback`, `format` |

Manual route count confirmed from the reviewed official documentation: **6** GET routes.

## Request / response model confirmed from the docs
The reviewed documentation shows standard JSON responses containing fields such as:
- `success`
- `terms`
- `privacy`
- `timestamp`
- `source`
- `quotes`
- `currencies`

The exact payload shape varies by endpoint:
- `/live` returns quote data keyed by pair
- `/list` returns a currency-code dictionary
- `/convert` / `/historical` / `/timeframe` / `/change` return endpoint-specific objects based on request parameters

## Error handling
The reviewed official docs publish a shared error object shape:

```json
{
  "success": false,
  "error": {
    "code": 104,
    "info": "Your monthly usage limit has been reached. Please upgrade your subscription plan."
  }
}
```

Confirmed error codes listed on the official page include:
- `404` — requested resource does not exist
- `101` — missing or invalid access key
- `102` — account not active
- `103` — non-existent API function
- `104` — monthly request allowance reached/exceeded
- `105` — current plan does not support the requested API function
- `106` — query returned no results
- `201` — invalid source currency
- `202` — one or more invalid currency codes
- `301` — missing date (`historical`)
- `302` — invalid date (`historical`, `convert`)
- `401` — invalid `from` (`convert`)
- `402` — invalid `to` (`convert`)
- `403` — missing or invalid `amount` (`convert`)
- `501` — missing timeframe (`timeframe`, `convert` per docs wording)
- `502` — invalid `start_date`
- `503` — invalid `end_date`
- `504` — invalid timeframe
- `505` — timeframe longer than 365 days

## Rate limits and quotas
The reviewed docs do **not** publish a single per-second rate-limit table.

What they do publish:
- requests are plan-dependent
- error `104` is used when the monthly request allowance has been reached
- error `105` is used when the current subscription plan does not include an API function

So monthly entitlement limits are documented, but a universal requests-per-second ceiling is not published on the reviewed pages.

## Pagination
No cursor or page-number pagination model is documented.

For historical-style data, the API uses:
- a single `date` on `/historical`
- `start_date` / `end_date` on `/timeframe` and `/change`

## JSONP / caching / transport notes
The reviewed docs also confirm:
- JSONP via `callback=CALLBACK_FUNCTION`
- a debugging-oriented `format=1` parameter for pretty output
- support for HTTP ETags, including `If-None-Match` and `If-Modified-Since`
- `304 Not Modified` behavior when cached data is unchanged
- HTTPS support for all customers
- CORS support

## Important usage notes
- Although the old provider listing described this as a free/no-auth service, the current official docs clearly describe an **authenticated APILayer product** using `access_key`.
- The official docs use both `symbols` and `currencies` wording across pages/examples; adapters should preserve the exact documented parameter names used by the chosen endpoint page.
- The current official docs present `/live` as the latest-rates endpoint rather than the older no-key `/{date}` style seen in earlier exchangerate.host incarnations.
- fireROUTE should treat the modern official surface as the APILayer-managed route set documented above.

## fireROUTE notes
- Model this provider as an authenticated GET-only JSON API on `https://api.exchangerate.host/`.
- Preserve the upstream error code and `info` text because plan-level failures are meaningful operationally.
- For normalized use cases, the main logical operations are latest, historical, convert, timeframe, change, and list-supported-currencies.
