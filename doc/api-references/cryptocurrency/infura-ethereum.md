# INFURA Ethereum

Official pages manually reviewed:
- https://infura.io/product/ethereum
- https://docs.metamask.io/services
- https://docs.metamask.io/services/reference/ethereum/
- https://docs.metamask.io/services/reference/ethereum/quickstart

## Overview
Infura’s current Ethereum documentation now lives under MetaMask Services. The reviewed first-party docs confirm hosted Ethereum JSON-RPC access through network-specific Infura endpoints, with the quickstart explicitly showing the mainnet HTTPS RPC template.

Confirmed from the reviewed official docs:
- Mainnet HTTPS JSON-RPC template: `https://mainnet.infura.io/v3/{API_KEY}`
- The reviewed Services docs treat Ethereum as a JSON-RPC API method library
- Official quickstart requires an API key with the Ethereum network enabled
- Manual route/method count confirmed from the expanded Ethereum JSON-RPC sidebar: **12** representative methods

## Confirmed JSON-RPC methods
| Transport | Method |
|---|---|
| POST `/v3/{API_KEY}` | `eth_accounts` |
| POST `/v3/{API_KEY}` | `eth_blockNumber` |
| POST `/v3/{API_KEY}` | `eth_call` |
| POST `/v3/{API_KEY}` | `eth_chainId` |
| POST `/v3/{API_KEY}` | `eth_estimateGas` |
| POST `/v3/{API_KEY}` | `eth_feeHistory` |
| POST `/v3/{API_KEY}` | `eth_gasPrice` |
| POST `/v3/{API_KEY}` | `eth_getBalance` |
| POST `/v3/{API_KEY}` | `eth_getBlockByHash` |
| POST `/v3/{API_KEY}` | `eth_getBlockByNumber` |
| POST `/v3/{API_KEY}` | `eth_getLogs` |
| POST `/v3/{API_KEY}` | `eth_sendRawTransaction` |

## Authentication
- Infura uses project/API-key authentication embedded in the endpoint URL template shown on the official quickstart pages.
- The reviewed docs repeatedly instruct callers to replace `<YOUR-API-KEY>` with an Infura API key.

## Parameters and request notes
- Calls are standard JSON-RPC POST requests with `jsonrpc`, `method`, `params`, and `id` fields.
- The quickstart examples send `Content-Type: application/json`.
- The Services reference exposes many additional Ethereum JSON-RPC methods beyond the representative set listed above, including block, transaction, proof, fee, uncle, and simulation methods.

## Rate limits
- The reviewed pages did not expose a concrete numeric rate-limit table in the captured first-party text for this pass.
- Pricing and account-plan information are linked from the Services docs and Infura product pages.

## Response and error notes
- The quickstart demonstrates standard JSON-RPC request/response formatting.
- The Ethereum reference is method-oriented rather than REST-resource-oriented; fireROUTE should preserve JSON-RPC semantics rather than forcing resource-style path abstractions.

## Important usage notes
- Infura’s docs are now branded under MetaMask Services, but the product and endpoint templates remain Infura-hosted.
- The reviewed reference also exposes additional chain families and Gas API/IPFS services; this file only documents the Ethereum JSON-RPC surface.
