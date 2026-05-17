# Helium

Official docs manually reviewed:
- https://docs.helium.com/network-data/legacy-blockchain-data/
- https://docs.helium.com/network-data/api-providers/entity-api/

## Overview
Helium’s current docs distinguish between:
- legacy blockchain snapshot data from the pre-Solana Helium chain
- current network data sources and API providers
- a free **Entity API** for lightweight hotspot and wallet metadata

The reviewed Entity API page is the current public HTTP API surface relevant to fireROUTE.

## Base URL manually confirmed
- `https://entities.nft.helium.io/v2`

## Canonical routes manually confirmed
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/wallet/{walletPublicKey}` | Get wallet info by wallet public key, including hotspot count, hotspot records, and token balances | Path: `walletPublicKey` |
| GET | `/hotspots/pagination-metadata` | Get pagination metadata for hotspots in a subnetwork | Query: `subnetwork` |
| GET | `/hotspots` | List hotspots by subnetwork with cursor pagination | Query: `subnetwork`, `cursor` |
| GET | `/hotspot/{keyToAssetKey}` | Get hotspot details by key-to-asset key mapping | Path: `keyToAssetKey` |
| GET | `/oui/all` | List all OUIs | none confirmed |
| GET | `/oui/{id}` | Get a specific OUI | Path: `id` |

Manual route count confirmed from the current official Entity API page: **6**.

## Auth model
- The reviewed Entity API page says the API is provided **free of charge by Helium**.
- No API key, bearer token, or signed-auth requirement was shown on the reviewed route pages.

## Pagination / response notes
- `GET /hotspots` uses cursor-based pagination.
- `GET /hotspots/pagination-metadata` exposes page-size and total-count style metadata for a given subnetwork.
- Responses are JSON.

## Important usage notes
From the reviewed official docs:
- the API focuses on **infrequently changing hotspot attributes** such as owner and asserted location
- it is intended for **light use cases** and is provided without guarantees of uptime or support
- latitude/longitude is deliberately obfuscated to H3 resolution 8 for anonymity
- the docs explicitly say **Active/Inactive status is deprecated** and returns `false` on all routes
- for deeper analysis, the docs point users to Oracles and Solana on-chain data instead

## Legacy-data note
The separate legacy blockchain data page documents a requestor-pays AWS S3 snapshot and torrent artifacts for the pre-Solana Helium L1. That page is archival and should not be mistaken for the current public API surface.
