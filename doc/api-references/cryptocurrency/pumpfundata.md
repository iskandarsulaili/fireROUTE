# PumpFunData

Official pages manually reviewed:
- https://pumpfundata.com/docs

## Overview
PumpFunData’s official docs are simple and concrete. The reviewed page confirms a dedicated API host, API-key header auth, a very small route surface focused on historical parquet downloads, and a published per-minute rate limit.

What was confirmed from the reviewed docs:
- API base URL: `https://api.pumpfundata.com`
- Auth header: `X-API-Key`
- Rate limit: `30 requests per minute`
- Supported exchange values: `pump_fun` and `pump_amm`
- Each downloaded hourly parquet file costs `1 credit`
- Manual exact route count confirmed from the reviewed page: **2**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/range` |
| GET | `/download` |

## Parameters
### `GET /range`
The reviewed docs explicitly show:
- `exchange` — required; must be `pump_fun` or `pump_amm`

The visible example is:
- `GET https://api.pumpfundata.com/range?exchange=pump_fun`

Example JSON response shown in the docs:
- `exchange`
- `start`
- `end`
- `files`

### `GET /download`
The reviewed docs explicitly show:
- `exchange` — required
- `date` — required; `YYYY-MM-DD`
- `hour` — required; `HH`

The docs say this route streams the parquet file directly.

## Authentication
- Requests use header `X-API-Key: pfd_your_key_here` in the reviewed examples.
- The docs tell users to connect their wallet on the account page and generate an API key.

## Response and format notes
- `/range` returns JSON metadata about the available historical date range.
- `/download` streams a parquet file rather than a JSON payload.
- The reviewed docs also publish a schema reference for event fields such as `event_type`, `signature`, `slot_number`, `timestamp`, `token_mint`, `token_creator`, `action`, `user_wallet`, `token_amount`, `lamports_amount`, and more.

## Important usage notes
- This is a historical-data product, not a general trading or token-metadata API.
- Data is published as hourly parquet files for `pump_fun` bonding-curve data and `pump_amm` graduated-AMM data.
- The docs are explicit that `exchange` must be one of the two named values; adapter validation should reject anything else early.