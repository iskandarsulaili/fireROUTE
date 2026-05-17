# Blockfrost Cardano

Official pages manually reviewed:
- https://blockfrost.io/
- https://blockfrost.dev/start-building
- https://blockfrost.dev/start-building/cardano

## Overview
Blockfrost’s current first-party docs are live on `blockfrost.dev` and the product site. The reviewed pages confirm separate network-specific API bases for Cardano mainnet, Cardano preprod, Cardano preview, and IPFS, with Cardano examples documented under `/api/v0`.

Confirmed from the reviewed official docs:
- Cardano mainnet base: `https://cardano-mainnet.blockfrost.io/api/v0/`
- Cardano preprod base: `https://cardano-preprod.blockfrost.io/api/v0/`
- Cardano preview base: `https://cardano-preview.blockfrost.io/api/v0/`
- IPFS base: `https://ipfs.blockfrost.io/api/v0/`
- Auth header used in all examples: `project_id: {PROJECT_ID}`
- Manual route count confirmed from the Cardano guide’s live example URLs: **20**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/accounts/{stake_address}` |
| GET | `/accounts/{stake_address}/addresses` |
| GET | `/addresses/{address}` |
| GET | `/addresses/{address}/transactions` |
| GET | `/assets/{asset}` |
| GET | `/assets/{asset}/transactions` |
| GET | `/blocks/{hash_or_number}` |
| GET | `/blocks/latest` |
| GET | `/blocks/{hash}/txs` |
| GET | `/txs/{hash}` |
| GET | `/txs/{hash}/redeemers` |
| GET | `/scripts/{script_hash}` |
| GET | `/epochs/latest` |
| GET | `/epochs/{number}` |
| GET | `/pools/{pool_id}` |
| GET | `/mempool` |
| GET | `/network` |
| POST | `/ipfs/add` |
| GET | `/ipfs/pin/list` |
| POST | `/ipfs/pin/add/{ipfs_path}` |

## Authentication
- Blockfrost uses per-network project tokens.
- Requests send the token in the `project_id` header.
- The docs explicitly warn that using a token for the wrong network returns **403** with message `Network token mismatch`.

## Parameters and request notes
Confirmed from the reviewed Start Building pages:
- Most collection endpoints default to **100** results per page.
- Pagination starts at `page=1`.
- Many list endpoints support `order=desc` to reverse the default ascending order.
- Cardano amounts are returned in **lovelaces** (`1 ADA = 1,000,000 lovelaces`).
- Addresses, stake addresses, and pool identifiers use Bech32; assets, policies, scripts, transactions, and blocks are queried in lowercase hex unless otherwise noted.

## Rate limits
Confirmed from the official limits section:
- Per-IP rate limit: **10 requests/second**.
- Burst allowance: **500 requests**, cooling down at **10 requests/second**.
- Daily quota depends on plan.
- The product homepage also advertises current free, hobby, developer, and enterprise tiers.

## Response and error notes
- The docs say endpoints return either a JSON object or a JSON array.
- Pagination and ordering are provider-wide conventions.
- A 403 can indicate token/network mismatch rather than malformed credentials.

## Important usage notes
- Blockfrost’s Cardano guide explicitly says the full API is very large and the tutorial only samples a subset of categories.
- The homepage advertises 100+ endpoints, but the reviewed Cardano guide provided enough first-party example URLs to confirm the representative route surface above.
- fireROUTE adapters should preserve network selection explicitly because mainnet, preprod, preview, and IPFS each use separate hosts and separate tokens.
