# NOWNodes

Official docs manually reviewed:
- https://nownodes.io/
- https://nownodes.gitbook.io/documentation
- the official Getting Started, NodeAPIs, Monitoring, and WebSocket pages in the GitBook docs

## Overview
NOWNodes is a multi-chain node-access provider rather than one fixed single-chain API. The reviewed docs expose three concrete public access patterns:
- chain-specific HTTP node endpoints
- monitoring/status endpoint(s)
- chain-specific WebSocket endpoints

## Base URLs and endpoint patterns manually confirmed
From the reviewed official docs:
- `https://{ticker}.nownodes.io/{api_key}` — HTTP node access pattern shown in the Getting Started example
- `https://watcher.nownodes.io/api/v1.0/networks/status` — monitoring endpoint
- `wss://{network}.nownodes.io/wss/{YOUR_API_KEY}` — WebSocket endpoint pattern

Reviewed official WebSocket examples include hosts such as:
- `wss://eth.nownodes.io/wss/{YOUR_API_KEY}`
- `wss://eth-blockbook.nownodes.io/wss/{YOUR_API_KEY}`
- `wss://btc.nownodes.io/wss/{YOUR_API_KEY}`
- `wss://sol.nownodes.io/wss/{YOUR_API_KEY}`
- `wss://base.nownodes.io/wss/{YOUR_API_KEY}`

## Canonical routes manually confirmed
| Method / Transport | Path or pattern | Purpose | Confirmed parameters |
|---|---|---|---|
| POST | `/{api_key}` on `https://{ticker}.nownodes.io` | Access a chain node over HTTP JSON-RPC / chain-native RPC | API key can be embedded in URL; official example sends JSON body with `jsonrpc`, `method`, `params`, `id` |
| GET | `/api/v1.0/networks/status` on `https://watcher.nownodes.io` | Get network/node monitoring status | Query: `tickers` (comma-separated node tickers) |
| WebSocket | `/wss/{YOUR_API_KEY}` on `wss://{network}.nownodes.io` | Subscribe to supported chain/node WebSocket feeds | API key embedded in path |

Manual route/pattern count confirmed from the reviewed docs: **3**.

## Auth model
From the official Getting Started page:
- one API key is created in the dashboard
- the same key can be used across the available methods in the documentation
- the docs explicitly say the key can be added **to the request URL or header**

The reviewed Getting Started example shows:
- URL auth pattern: `https://eth.nownodes.io/your_api_key`
- JSON-RPC request body with `Content-Type: application/json`

## Response / error notes
### Monitoring
The reviewed monitoring page shows a JSON response keyed by ticker, with per-interface values such as:
- `interface`
- `height`
- `heightDeviation`
- `status`

### HTTP node access
- Response format depends on the target chain’s own RPC protocol (for example Ethereum-style JSON-RPC on EVM chains).

## Rate limits / quotas
- The reviewed docs emphasize plan selection and free-vs-paid access, but I did not find a universal requests-per-second table on the reviewed pages.
- The free plan documentation says users select a limited set of networks to test.

## Important usage notes
- fireROUTE should model NOWNodes as an infrastructure provider with **host-template routing by chain ticker/network**, not as a single static API host.
- Response schema is not fully normalized across chains; it depends on the underlying blockchain RPC.
- The monitoring endpoint is the clearest provider-specific HTTP route separate from the chain RPC passthrough itself.
- The official docs also expose Archive Nodes and Trace/Debug products, but the concrete route shapes were not as clearly published on the reviewed pages as the three patterns documented above.
