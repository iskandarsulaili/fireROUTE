# paralelo.bo

Official docs manually reviewed:
- https://paralelo.bo/api

## Overview
paralelo.bo publishes both a public REST API and a remote MCP server for Bolivian parallel-dollar pricing data.

Confirmed from the reviewed official page:
- Base host: `https://paralelo.bo`
- REST API is public, no API key, no registration
- MCP server endpoint: `https://paralelo.bo/mcp`
- Data license note shown on the page: Creative Commons `CC-BY 4.0`
- The page says there are no aggressive limits

## Confirmed routes and transports
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/rate` | Current median/buy/sell/spread/timestamp in JSON; docs note 60-second cache |
| GET | `/api/v1/rate.txt` | Plain-text single-line pipeline-friendly rate output |
| GET | `/api/v1/historical.json` | Daily historical series in JSON; points look like `{ t: ISO, v: median }` |
| GET | `/api/v1/historical.csv` | Same historical series in CSV with `date,median_bob_per_usd` header |
| GET | `/api/openapi.json` | Full OpenAPI 3.1 document |
| POST | `/mcp` | Streamable HTTP JSON-RPC 2.0 transport for MCP clients |

Manual route/transport count confirmed from the official page: **6**.

## Auth and transport model
### REST
- No API key
- No registration
- Public GET access

### MCP
- Transport: streamable HTTP
- Protocol: JSON-RPC 2.0 over `POST`
- Endpoint: `https://paralelo.bo/mcp`

The page includes example MCP calls for:
- `initialize`
- `tools/list`
- `tools/call`

## Confirmed MCP tools shown on the page
The official page names these tools:
- `get_current_rate()`
- `get_historical_rate({ date })`
- `compare_exchanges()`
- `get_bank_limits({ bank? })`
- `convert_currency({ amount, from, to, direction? })`

These are MCP tool names, not separate REST paths, so they are documented here as capability notes rather than counted as HTTP routes.

## Response and format notes
Confirmed formats from the page:
- JSON on `/api/v1/rate` and `/api/v1/historical.json`
- plain text on `/api/v1/rate.txt`
- CSV on `/api/v1/historical.csv`
- OpenAPI JSON on `/api/openapi.json`
- JSON-RPC request/response bodies on `/mcp`

## Rate limits
The reviewed page explicitly says the public API is available `sin límites agresivos` and without registration. No numeric requests-per-second ceiling was published on the page I reviewed.

## Important usage notes
- `/api/v1/rate` is cached for 60 seconds.
- `get_historical_rate` is documented as returning the nearest earlier available value if the exact day has no data.
- `convert_currency` supports `from/to` in `{USD, BOB}` and optional `direction` in `{parallel, official}`, defaulting to `parallel`.
- The provider explicitly positions the MCP endpoint as a first-party alternative to scraping.

## fireROUTE notes
- Treat the REST surface as the primary integration path.
- Keep the MCP transport documented for agent-style integrations, but do not confuse MCP tool names with normal REST routes.