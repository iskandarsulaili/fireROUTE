# WatchData

Official docs manually reviewed:
- https://docs.watchdata.io/
- https://docs.watchdata.io/powered-api/transfers/watch_gettransfers
- https://docs.watchdata.io/powered-api/transfers/watch_gettransfersbyaddress

## Overview
WatchData documents a blockchain data platform with multiple product families, but the reviewed endpoint pages show a JSON-RPC style integration model built around chain-specific hosts and method names.

The clearest concrete endpoint pattern exposed during manual review was the chain JSON-RPC host template used for the custom `watch_*` methods.

## Base URL pattern manually confirmed
From the reviewed official docs:
- `https://{chain}.api.watchdata.io/node/jsonrpc?api_key=your_api_key`

Concrete reviewed example:
- `https://ethereum.api.watchdata.io/node/jsonrpc?api_key=your_api_key`

The docs home also says the currently supported chains include Ethereum, Tron, Binance Smart Chain, Bitcoin, and Polygon.

## Canonical route model manually confirmed
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| POST | `/node/jsonrpc` | Invoke WatchData JSON-RPC methods on a chain-specific host | Query: `api_key`; JSON-RPC body with provider-specific methods such as `watch_getTransfers` and `watch_getTransfersByAddress` |

Manual route count confirmed: **1** canonical HTTP route pattern.

## Confirmed provider-specific methods from reviewed endpoint pages
### `watch_getTransfers`
The reviewed official page describes this method as returning transfers filtered by block parameters, smart contracts, or transfer types.

Confirmed request fields listed on the page:
- minimum block number
- maximum block number
- transfer type (`trx`, `erc20`, `erc721`)
- contract address or array of contract addresses
- offset
- limit

### `watch_getTransfersByAddress`
The reviewed official docs expose this as a second custom transfers method on the same JSON-RPC route.

## Auth model
- API key is passed as the `api_key` query parameter on the chain-specific endpoint URL.
- No OAuth or bearer-token flow was shown on the reviewed pages.

## Response / error notes
- The reviewed pages are JSON-RPC oriented rather than REST-resource oriented.
- WatchData publishes a separate official `Error Reference` page in the docs navigation.
- Method-specific responses are shown inline in the endpoint docs.

## Rate limits
- The docs navigation includes an official `Pricing and Limits` section.
- I did not manually confirm a universal numeric rate-limit table from the reviewed endpoint pages themselves, so I am not asserting one here.

## Important usage notes
- fireROUTE should model WatchData as a chain-hosted JSON-RPC provider rather than as a conventional REST API.
- The primary routing dimension is the **host** (`ethereum.api.watchdata.io`, etc.) plus JSON-RPC method name.
- The reviewed docs clearly expose custom WatchData methods on top of the JSON-RPC transport.
