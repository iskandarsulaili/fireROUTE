# Alchemy Ethereum

Official pages manually reviewed:
- https://docs.alchemy.com/alchemy/ (redirected to a current docs 404)
- https://www.alchemy.com/docs/llms.txt
- https://www.alchemy.com/docs/node/llms.txt
- https://www.alchemy.com/docs/node.md
- https://www.alchemy.com/docs/reference/node-supported-chains.md
- https://www.alchemy.com/docs/reference/ethereum-api-quickstart

## Overview
The original docs URL in the index is stale, but Alchemy’s current official docs are live at `www.alchemy.com/docs`. For Ethereum, Alchemy documents an HTTP JSON-RPC endpoint family on `https://eth-*.g.alchemy.com/v2/{API_KEY}` plus corresponding WebSocket endpoints, alongside trace/debug/subscription methods and additional chain-specific products.

Confirmed from the reviewed official docs:
- Current Ethereum mainnet HTTP base: `https://eth-mainnet.g.alchemy.com/v2/{API_KEY}`
- Ethereum testnet HTTP bases visible on the supported-networks page: `eth-sepolia`, `eth-holesky`, `eth-hoodi`
- Ethereum beacon endpoints are exposed on separate `eth-*-beacon.g.alchemy.com/v2/{API_KEY}` hosts
- Product type for this provider file: low-level Node / JSON-RPC access to Ethereum
- Manual route/method count confirmed in this pass: **10** concrete endpoint/method patterns

## Confirmed endpoints and methods
| Method / Transport | Path or RPC method | Notes |
|---|---|---|
| POST | `/v2/{API_KEY}` on `eth-mainnet.g.alchemy.com` | standard Ethereum JSON-RPC transport |
| WebSocket | `wss://eth-mainnet.g.alchemy.com/v2/{API_KEY}` | current Ethereum subscription transport pattern |
| JSON-RPC | `eth_blockNumber` | reviewed via Ethereum quickstart as the first example task |
| JSON-RPC | `eth_getBalance` | reviewed via Ethereum quickstart balance example |
| JSON-RPC | `eth_call` | listed as part of standard EVM JSON-RPC support on Node overview |
| JSON-RPC | `eth_getLogs` | listed as part of standard EVM JSON-RPC support on Node overview |
| JSON-RPC | `eth_sendRawTransaction` | listed as part of standard EVM JSON-RPC support on Node overview |
| WebSocket subscription | `alchemy_pendingTransactions` | current Alchemy subscription method |
| WebSocket subscription | `alchemy_minedTransactions` | current Alchemy subscription method |
| JSON-RPC / trace-debug | `trace_block`, `trace_call`, `trace_filter`, `trace_transaction`, `debug_traceCall`, `debug_traceTransaction` | official trace/debug method families confirmed from current Node docs |

## Parameters and request notes
- Alchemy authenticates node access by embedding the key in the path: `/v2/{API_KEY}`
- The current Ethereum quickstart shows direct HTTP use of `https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY`
- Subscription APIs are documented for WebSockets; reviewed methods include Alchemy-specific subscriptions as well as standard `newPendingTransactions`, `newHeads`, and `logs`
- The supported-networks page shows separate endpoint hostnames per network rather than one shared hostname with a network parameter

## Authentication
- API access is keyed by project/API key in the URL path for Node endpoints
- The reviewed quickstart pages direct users to create an Alchemy API key in the dashboard before sending requests
- No separate bearer-token or OAuth flow was documented for the Node/Ethereum surface reviewed here

## Rate limits and errors
- The reviewed pages do not publish a single Ethereum-wide numeric rate limit on the inspected pages
- Alchemy positions these as production node endpoints and documents best-practice pages for WebSocket usage rather than a universal simple quota note
- Because limits can depend on plan/product, fireROUTE should treat burst behavior and response throttling as plan-sensitive

## Response format notes
- HTTP uses JSON-RPC request/response envelopes for Node methods
- WebSockets are used for subscription-style streaming updates
- Trace/debug methods return chain-native structured trace/debug payloads rather than simplified exchange-style JSON

## Important usage notes
- The index URL `https://docs.alchemy.com/alchemy/` is outdated and currently lands on a 404; the correct official docs now live under `https://www.alchemy.com/docs`
- Alchemy’s current docs expose far more than plain Ethereum RPC, but this provider file is scoped to the Ethereum node surface represented by `alchemy-ethereum`
- The supported-networks page is the best current first-party source for real live endpoint hostnames
- The `node/llms.txt` export is useful for discovering the currently supported subscription, trace, and debug method families without relying on the JS-heavy docs UI alone
