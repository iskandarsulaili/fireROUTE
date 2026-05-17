# Etherscan

Official docs manually reviewed:
- https://docs.etherscan.io/introduction
- https://docs.etherscan.io/getting-started
- https://docs.etherscan.io/resources/rate-limits
- https://docs.etherscan.io/v2-migration
- a current endpoint page visible in the docs navigation: `Get Native Balance for an Address`

## Overview
Etherscan API V2 uses a unified multichain request model across 60+ supported EVM-compatible chains.

Confirmed canonical base URL:
- `https://api.etherscan.io/v2/api`

Confirmed transport/auth model:
- HTTP method shown throughout the reviewed REST endpoint pages: `GET`
- API key required
- multichain selection is done with the `chainid` query parameter

The reviewed migration page explicitly states that legacy V1 endpoints were deprecated on **2025-08-15** and that V2 should now be used.

## Canonical route model
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/v2/api` | Unified Etherscan API route; logical endpoint chosen by query parameters such as `module`, `action`, and `chainid` | `chainid`, `apikey`, plus endpoint-specific parameters such as `module`, `action`, `address`, `tag`, `contractaddress`, `startblock`, `endblock`, `page`, `offset`, `sort`, `txhash` |

Manual route count confirmed from the reviewed official docs: **1** canonical HTTP route.

## Official migration examples
The reviewed V2 migration page gives these exact examples:

```text
Before (V1)
https://api.etherscan.io/api?&action=balance&apikey=YOUR_API_KEY

After (V2)
https://api.etherscan.io/v2/api?chainid=1&action=balance&apikey=YOUR_API_KEY
```

It also shows the same V2 base path being used to replace explorer-specific hosts such as PolygonScan by switching only `chainid`.

## Auth and account model
The Getting Started page confirms:
- users create an Etherscan account and API key from the API dashboard
- one V2 API key can be used across all supported chains
- requests are authenticated to prevent abuse and manage rate limits

## Confirmed logical endpoint families visible in the current docs navigation
The docs navigation and reviewed endpoint page confirm many logical operations behind `GET /v2/api`, including modules for:
- Account
- Blocks
- Contracts
- Gas Tracker
- Geth/Parity Proxy
- Logs
- Stats
- Transactions
- Tokens
- L2 Deposits/Withdrawals
- Nametags
- Usage

Within `Account`, the currently visible docs list includes examples such as:
- Get Native Balance for an Address
- Get Native Balance for Multiple Addresses
- Get Historical Native Balance for an Address
- Get Normal Transactions By Address
- Get ERC20 Token Transfers by Address
- Get ERC721 Token Transfers by Address
- Get ERC1155 Token Transfers by Address
- Get Internal Transactions by Address
- Get Internal Transactions by Block Range
- Get Internal Transactions by Transaction Hash
- Get Blocks Validated by Address
- Get Beacon Chain Withdrawals by Address
- Get Address Funded By

## Query model and response notes
From the reviewed docs pages:
- `chainid` selects the target network
- endpoint behavior is then selected by action/module-style query parameters
- responses use the longstanding Etherscan JSON pattern with fields such as `status`, `message`, and `result`

The migration page shows this deprecation/error example:

```json
{
  "status":"0",
  "message":"NOTOK",
  "result":"You are using a deprecated V1 endpoint, switch to Etherscan API V2."
}
```

## Rate limits
The reviewed official rate-limits page currently publishes:

| Tier | Limit |
|---|---|
| Free | `3 calls/second`, up to `100,000 calls/day`, selected chains only |
| Lite | `5 calls/second`, up to `100,000 calls/day` |
| Standard | `10 calls/second`, up to `200,000 calls/day` |
| Advanced | `20 calls/second`, up to `500,000 calls/day` |
| Professional | `30 calls/second`, up to `1,000,000 calls/day` |
| Pro Plus | `30 calls/second`, up to `1,500,000 calls/day` |
| Dedicated/Custom | contact sales |

The same table also notes whether API PRO availability is included by plan.

## Pagination
The reviewed navigation and visible endpoint names indicate classic list-style transaction/token endpoints that use endpoint-specific paging parameters. The docs snapshot visibly exposes common Etherscan-style parameters such as `page` and `offset` on the unified route model, but pagination is not global; it is per logical action.

## Important usage notes
- V2 is now the supported REST surface; V1 is deprecated.
- Etherscan has moved to one host and one API key across many chains rather than per-explorer hosts/keys.
- fireROUTE should model Etherscan as a query-driven provider on a single canonical route rather than as dozens of different path-based endpoints.
