# WorldCoinIndex

Official pages manually reviewed:
- https://www.worldcoinindex.com/apiservice

## Overview
WorldCoinIndex still publishes a first-party API service page on its main domain. The reviewed page documents a simple JSON API, API-key requirement, a 5-minute data refresh cadence, and multiple query-style GET endpoints.

Confirmed from the reviewed official docs:
- Base path family: `https://www.worldcoinindex.com/apiservice`
- API requires a `key` query parameter
- Data refresh cadence: every **5 minutes**
- Limit stated on the reviewed intro page: **70 requests per hour**, one API key per IP
- Manual route count confirmed from the reviewed page: **4**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/apiservice/ticker` | accepts `key`, `label`, and `fiat` |
| GET | `/apiservice/v2getmarkets` | accepts `key` and `fiat` |
| GET | `/apiservice/getmarkets` | deprecated |
| GET | `/apiservice/json` | deprecated all-markets endpoint |

## Authentication
- Access requires an API key.
- The key is passed as a query parameter named `key`.
- The official page says users can request an API key from the provider.

## Parameters and request notes
- `ticker` uses `label` to request one or more market labels such as `ethbtc-ltcbtc`.
- Market endpoints support a `fiat` parameter.
- Responses are JSON with a `Markets` array and fields such as `Label`, `Name`, `Price`, `Volume_24h`, and `Timestamp`.

## Important usage notes
- The page explicitly marks `getmarkets` and `json` as deprecated.
- fireROUTE integrations should prefer the documented `ticker` and `v2getmarkets` routes over deprecated variants.
