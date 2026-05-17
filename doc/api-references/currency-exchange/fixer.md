# Fixer

Official docs manually reviewed:
- https://docs.apilayer.com/fixer/docs/api-documentation?utm_source=FixerHomePage&utm_medium=Referral
- https://docs.apilayer.com/fixer/docs/getting-started

## Overview
Fixer is APILayer’s REST exchange-rate API.

Confirmed from the reviewed official docs:
- Base URL: `https://data.fixer.io/api`
- Transport: HTTPS + JSON
- Auth: API key passed as query parameter `access_key`
- Default/base response currency noted in the Getting Started page: `EUR`

## Authentication
The reviewed docs explicitly say authentication is done by appending `access_key` to the request URL.

Example shown in the docs:
- `https://data.fixer.io/api/latest?access_key=API_KEY`

No bearer-token or OAuth flow was exposed on the reviewed Fixer docs pages.

## Confirmed endpoints
The live APILayer Fixer docs currently publish these six canonical endpoints:

| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/symbols` | List supported currency codes and names | `access_key` |
| GET | `/latest` | Latest exchange rates | `access_key`, optional `base`, optional `symbols` |
| GET | `/{date}` | Historical rates for a specific `YYYY-MM-DD` date | `access_key`, optional `base`, optional `symbols`, path date |
| GET | `/convert` | Convert an amount between currencies | `access_key`, `from`, `to`, `amount`, optional `date` |
| GET | `/timeseries` | Daily rates across a date range | `access_key`, `start_date`, `end_date`, optional `base`, optional `symbols` |
| GET | `/fluctuation` | Currency fluctuation between two dates | `access_key`, `start_date`, `end_date`, optional `base`, optional `symbols` |

Manual route count confirmed from the reviewed docs: **6**.

## Response format
The Getting Started page shows the standard Fixer JSON shape for latest-rate responses:
- `success`
- `timestamp`
- `base`
- `date`
- `rates`

The reviewed docs say all responses are returned in JSON over HTTPS.

## Endpoint notes
### `GET /latest`
Confirmed behavior from the reviewed docs:
- returns the most recent exchange rates
- supports optional `base` and `symbols` filters
- example response uses `base: "EUR"`

### `GET /symbols`
Confirmed from the endpoint summary:
- returns the list of supported currency codes and names
- available on all plans according to the reviewed docs navigation/plan tags

### `GET /{date}`
Confirmed from the endpoint summary:
- path component is a date string in `YYYY-MM-DD` format
- returns historical rates for that date

### `GET /convert`
Confirmed from the endpoint summary:
- performs amount conversion between `from` and `to`
- supports an optional historical `date`

### `GET /timeseries`
Confirmed from the endpoint summary:
- requires `start_date` and `end_date`
- returns date-range historical data

### `GET /fluctuation`
Confirmed from the endpoint summary:
- compares currencies between two dates
- uses the same date-range/filter style as timeseries

## Pagination
No pagination model is documented for the reviewed Fixer endpoints.

The confirmed endpoints are all single-document GET responses rather than paged collection APIs.

## Errors and limits
The reviewed pages describe error handling as part of the documentation set, but the pages manually reviewed in this pass did not expose a single numeric rate-limit table.

What is explicitly confirmed from the reviewed docs:
- API authentication depends on `access_key`
- responses include a `success` flag
- plan availability can affect which endpoints/features are accessible

## Important usage notes
- Fixer’s reviewed docs use the `data.fixer.io` API host, not the marketing-site root.
- The docs position `base` and `symbols` as the main response-shaping filters.
- Historical lookups use a path date route (`/{date}`), while timeseries and fluctuation use explicit query date ranges.
- fireROUTE should preserve Fixer’s query-parameter model rather than trying to normalize it into path-heavy currency-pair routes.

## fireROUTE notes
- A minimal normalized Fixer surface can map to symbols, latest, historical, convert, timeseries, and fluctuation.
- Preserve provider-native query names (`access_key`, `base`, `symbols`, `start_date`, `end_date`) in passthrough mode.
