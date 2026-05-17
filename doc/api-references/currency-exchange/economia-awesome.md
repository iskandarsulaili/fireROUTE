# Economia.Awesome

Official docs manually reviewed:
- https://docs.awesomeapi.com.br/api-de-moedas

## Overview
AwesomeAPI publishes a currency quotation API with real-time, historical, and sequential quote endpoints.

Confirmed from the reviewed docs:
- Main API host: `https://economia.awesomeapi.com.br`
- Auth model: API key recommended for real-time/no-cache access, but several routes are publicly callable without one
- Unauthenticated requests are cached for 1 minute according to the docs
- Formats shown: JSON and XML depending on path

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/xml/available` | Full list of available currency combinations |
| GET | `/xml/available/uniq` | Currency-name list / unique codes view |
| GET | `/json/last/:moedas` | Latest quote for one or more comma-separated pairs |
| GET | `/json/daily/:moeda/:numero_dias` | Daily close series for the last N days |
| GET | `/:moeda/:quantidade` | Closing data for a requested pair and quantity window |
| GET | `/:format/:moeda` | Sequential quote series for a single pair in the requested format |

Manual route count confirmed from the official docs: **6**.

## Parameters and request model
Confirmed path parameters from the reviewed page:
- `:moedas` — comma-separated list like `USD-BRL,EUR-BRL,BTC-BRL`
- `:moeda` — single pair like `USD-BRL`
- `:numero_dias` — number of trailing daily records to return
- `:quantidade` — requested number of sequential records
- `:format` — output format segment such as `json`

The docs also call out special pair families including tourism quotes (`USD-BRLT`, `EUR-BRLT`) and PTAX pairs (`USD-BRLPTAX`, `EUR-BRLPTAX`).

## Response format
Observed response formats:
- JSON on the `/json/...` routes
- XML on the `/xml/...` routes

Observed JSON fields on latest quote examples include:
- `code`
- `codein`
- `name`
- `high`
- `low`
- `varBid`
- `pctChange`
- `bid`
- `ask`
- `timestamp`
- `create_date`

## Errors
The reviewed docs show at least a `404` case for an invalid currency (`Moeda especificada não existe`). I did not manually enumerate a broader error table beyond that visible example.

## Rate limits
What was explicitly visible on the reviewed docs page:
- unauthenticated requests are cached for 1 minute
- users can register for an API key to avoid cache interference and obtain real-time data
- the page markets a free allowance up to 100,000 requests with registration

## Important usage notes
- Path design is not purely versioned REST; several routes are content-format-first (`/json/...`, `/xml/...`).
- The docs are especially pair-oriented (`USD-BRL`, `EUR-BRL`, `BTC-BRL`) rather than generic resource collections.
- If you need truly real-time behavior, the docs explicitly steer users toward an API key instead of the unauthenticated cached access path.