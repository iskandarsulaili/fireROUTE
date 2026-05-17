# Currencylayer

Official docs manually reviewed:
- https://docs.apilayer.com/currencylayer/docs/api-documentation?utm_source=CurrencylayerHomePage&utm_medium=Referral
- https://docs.apilayer.com/currencylayer/docs/getting-started

## Overview
Currencylayer is APILayer’s REST foreign-exchange API.

Confirmed from the reviewed official docs:
- Base URL: `https://api.currencylayer.com`
- Transport: HTTPS + JSON
- Auth: API key passed as query parameter `access_key`
- Default source currency called out by the docs: `USD`
- Current docs describe coverage for `168` currencies and precious metals

## Authentication
The Getting Started page shows the standard authentication pattern:
- `https://api.currencylayer.com/live?access_key=YOUR_ACCESS_KEY`

The reviewed docs did not expose OAuth or bearer-header authentication for the core API; the documented auth model is query-string API-key auth.

## Confirmed endpoints
The reviewed APILayer Currencylayer docs currently expose these six canonical endpoints:

| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/list` | List supported currencies | `access_key` |
| GET | `/live` | Real-time exchange rates | `access_key`, `source`, `currencies` |
| GET | `/historical` | Rates for a specific date | `access_key`, `date`, optional filters |
| GET | `/convert` | Convert an amount between currencies | `access_key`, `from`, `to`, `amount`, optional `date` |
| GET | `/timeframe` | Rates over a date range | `access_key`, `start_date`, `end_date`, optional `source`, optional `currencies` |
| GET | `/change` | Change/fluctuation between dates | `access_key`, optional `start_date`, optional `end_date`, optional `currencies` |

Manual route count confirmed from the reviewed docs: **6**.

## Response format
The reviewed Getting Started page shows the standard Currencylayer response envelope for live quotes:
- `success`
- `terms`
- `privacy`
- `timestamp`
- `source`
- `quotes`

The docs explicitly describe:
- `source` as the currency all quotes are relative to
- `quotes` as key/value currency-pair exchange rates like `USDAED`

## Endpoint notes
### `GET /live`
Confirmed from the endpoint summary and Getting Started page:
- returns real-time rates
- supports `source` and `currencies` filtering
- example response uses `source: "USD"`

### `GET /list`
Confirmed from the reviewed Getting Started page:
- returns supported currency codes and names
- available via the list endpoint with `access_key`

### `GET /historical`
Confirmed from the endpoint summary:
- retrieves FX data for a specific date
- date is passed as a query parameter rather than a path segment

### `GET /convert`
Confirmed from the endpoint summary:
- converts an amount between two currencies
- supports optional historical conversion via `date`

### `GET /timeframe`
Confirmed from the endpoint summary:
- returns rates between `start_date` and `end_date`
- supports optional `source` and `currencies` filters

### `GET /change`
Confirmed from the endpoint summary:
- provides change/margin/fluctuation style information over a date range
- uses a similar filter model to timeframe

## Pagination
No pagination model is described on the reviewed Currencylayer pages.

The confirmed routes return single JSON documents rather than paged collection results.

## Errors and limits
The reviewed docs describe standard JSON responses and plan-gated functionality, but the pages manually reviewed in this pass did not expose one numeric rate-limit table.

What is explicitly confirmed from the reviewed pages:
- API access is controlled by `access_key`
- responses carry a `success` property
- endpoint availability may vary by subscription plan

## Important usage notes
- Use the API host `api.currencylayer.com`, not the landing page.
- Currencylayer’s live-rate model is source-currency + quoted pairs, not base-plus-rates objects like some other providers.
- The current APILayer docs organize the platform around six main GET endpoints.
- fireROUTE should preserve Currencylayer’s query naming (`source`, `currencies`, `start_date`, `end_date`) in passthrough mode.

## fireROUTE notes
- A minimal normalized Currencylayer surface can center on list, live, historical, convert, timeframe, and change.
- Preserve the provider’s `quotes` response shape and source-currency semantics when exposing raw responses.
