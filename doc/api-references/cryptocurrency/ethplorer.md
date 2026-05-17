# Ethplorer

Official pages manually reviewed:
- https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API

## Overview
Ethplorer’s official GitHub wiki is currently detailed and usable. The reviewed page confirms multichain explorer bases, query-string API-key authentication, explicit free-key and personal-key limits, and a large set of concrete GET routes for tokens, addresses, transactions, rankings, and holder data.

What was confirmed from the reviewed official docs:
- Main Ethereum base URL: `https://api.ethplorer.io/`
- Additional reviewed official explorer bases: `https://sepolia-api.ethplorer.io/`, `https://holesky-api.ethplorer.io/`, `https://hoodi-api.ethplorer.io/`, `https://api.binplorer.com/`, `https://api.lineaplorer.build/`
- Auth model: `apiKey` query parameter
- Free development key: `freekey`
- Manual exact route count confirmed from reviewed route examples: **12**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/getLastBlock` |
| GET | `/getTokenInfo/{address}` |
| GET | `/getAddressInfo/{address}` |
| GET | `/getTxInfo/{transactionHash}` |
| GET | `/getTokenHistory/{address}` |
| GET | `/getAddressHistory/{address}` |
| GET | `/getAddressTransactions/{address}` |
| GET | `/getTop` |
| GET | `/getTopTokens` |
| GET | `/getTopTokenHolders/{address}` |
| GET | `/getTokensNew` |
| GET | `/getAddressInfo/{address}?token={contractAddress}` |

## Authentication
- Ethplorer authenticates requests with the `apiKey` query parameter.
- The reviewed docs explicitly document the development key `freekey`.
- The provider recommends using a personal API key rather than `freekey` for production workloads.

## Rate limits
### `freekey`
The reviewed docs explicitly publish these fair-use limits for `freekey`:
- `2` requests/second
- `30` requests/minute
- `200` requests/hour
- `1000` requests/24 hours
- `3000` requests/week
- Max number of transactions/operations in response: `100`
- Max allowed timestamp age: `30 days`

### Personal key
The reviewed docs explicitly publish:
- `10` requests/second
- Max number of transactions/operations in response: `1000`
- Max allowed timestamp age: `1 year`

## Parameters and response notes
The reviewed official examples expose these concrete inputs and behaviors:
- `apiKey` query parameter on essentially every request
- `token` optional query parameter on `/getAddressInfo/{address}` to restrict the response to one token
- `type` and `limit` shown on `/getTokenHistory/{address}` examples
- `criteria=cap` shown on `/getTop`
- `limit=100` shown on `/getTopTokenHolders/{address}`

The reviewed docs also explicitly note:
- For tracking many addresses at once, use the provider’s `Bulk API Monitor`
- The same endpoint surface is reused across supported chains with different base addresses

## Important usage notes
- The reviewed docs state that the API service is free, but sites using Ethplorer are required to place references to the Ethplorer API or direct Ethplorer links.
- The docs recommend one personal key per project and explicitly say creating several keys to exceed limits violates policy.
- For non-Ethereum chains, the docs say to interpret `ETH` in endpoint semantics/responses as that chain’s gas token equivalent (for example BNB on BNB Chain).