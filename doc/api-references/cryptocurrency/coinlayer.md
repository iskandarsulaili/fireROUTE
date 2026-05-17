# Coinlayer

Official pages manually reviewed:
- https://coinlayer.com/
- https://coinlayer.com/documentation

## Overview
Coinlayer is APILayer’s cryptocurrency exchange-rates API. The current official docs expose a small REST surface on a single base host.

Confirmed from the reviewed official docs:
- Base URL: `https://api.coinlayer.com`
- Auth: `access_key` query parameter on every endpoint
- Response format: JSON
- Transport: HTTPS GET requests
- Manual route count confirmed from the official operations list: **6**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/list` | supported cryptocurrency symbols/listing |
| GET | `/live` | latest real-time crypto exchange rates |
| GET | `/historical` | historical rates snapshot |
| GET | `/convert` | convert one amount between currencies/assets |
| GET | `/timeframe` | rates across a date range |
| GET | `/change` | change/fluctuation data |

## Authentication
- Every request requires an API key passed as `access_key`.
- The reviewed docs describe auth only as query-parameter based; no bearer-header variant was shown on the operations page reviewed in this pass.

## Parameters and request notes
Confirmed from the reviewed docs structure and operation naming:
- Coinlayer uses query parameters rather than path parameters for its current REST operations.
- `/historical`, `/timeframe`, and `/change` are date-oriented operations.
- `/convert` is the dedicated conversion operation.
- The docs expose named response schemas such as `ListResponse`, `LiveResponse`, `HistoricalResponse`, `ConvertResponse`, `TimeframeResponse`, and `ChangeResponse`.

## Errors and responses
- The official docs include a dedicated `ApiError` schema.
- Successful responses are JSON objects specific to each operation.
- Because the docs are APILayer-style product docs, plan and feature availability can vary by subscription tier.

## Important usage notes
- The docs and homepage both point to the same live production host, `https://api.coinlayer.com`.
- Coinlayer’s current official surface is compact and GET-only.
- fireROUTE should preserve query-string API-key injection for this provider rather than assuming header auth.