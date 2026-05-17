# Mempool

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `mempool`
- Official docs/pages manually reviewed:
  - `https://mempool.space/api` (redirects to the REST reference)
  - `https://mempool.space/docs/api/rest`
- Primary public REST base URL confirmed from the reviewed examples: `https://mempool.space/api`
- Main versioned prefix used throughout the reviewed docs: `https://mempool.space/api/v1`
- API surface confirmed from the reviewed official page: Bitcoin REST API plus Lightning and transaction-accelerator endpoints
- Manually confirmed route count from the visible official REST sidebar: `91` operations (`83` `GET`, `8` `POST`)

## Overview
The current first-party mempool.space REST reference is large, public, and unusually implementation-friendly. The reviewed official page exposes a single navigable REST reference covering:
- core Bitcoin chain and mempool data
- mining and fee-estimation data
- transaction lookup and broadcast
- Lightning Network discovery/statistics endpoints
- public and authenticated transaction-accelerator endpoints

The reviewed `https://mempool.space/api` landing path currently redirects into the documentation page rather than a separate landing document, and the official cURL examples consistently use the live `https://mempool.space/api...` host.

## Confirmed route-family breakdown
| Family | Operations manually visible in the official sidebar |
|---|---:|
| General | 3 |
| Addresses | 6 |
| Blocks | 15 |
| Mining | 16 |
| Fees | 3 |
| Mempool | 5 |
| Transactions | 12 |
| Lightning | 17 |
| Accelerator (Public) | 5 |
| Accelerator (Authenticated) | 9 |
| **Total** | **91** |

## Representative officially documented endpoints
The official page exposes many more routes than the sample below; these are concrete method/path pairs manually confirmed from the live first-party reference and its rendered endpoint-detail panels.

| Method | Path | Notes from the reviewed official docs |
|---|---|---|
| GET | `/api/v1/difficulty-adjustment` | Returns difficulty-adjustment details such as progress, remaining blocks, and estimated retarget date. |
| GET | `/api/v1/prices` | Returns latest BTC prices in major currencies. |
| GET | `/api/v1/historical-price?currency={currency}&timestamp={unix}` | Historical BTC price lookup; docs show `currency` and `timestamp` query parameters. |
| GET | `/api/address/{address}` | Returns `address`, `chain_stats`, and `mempool_stats`. |
| GET | `/api/address/{address}/txs` | Address history; docs say it returns up to 50 mempool txs plus the first 25 confirmed txs. |
| GET | `/api/address/{address}/txs/chain` | Confirmed-only address history; docs say it returns 25 transactions per page. |
| GET | `/api/address/{address}/txs/mempool` | Unconfirmed-only address history; docs say up to 50 transactions and no paging. |
| GET | `/api/address/{address}/utxo` | UTXO set for the address. |
| GET | `/api/v1/validate-address/{address}` | Address validation helper. |
| GET | `/api/block/{hash}` | Block details by hash. |
| GET | `/api/block/{hash}/header` | Returns the block header as a hex-encoded string. |
| GET | `/api/block/{hash}/raw` | Returns the raw block representation in binary. |
| GET | `/api/block/{hash}/status` | Returns confirmation status / best-chain information. |
| GET | `/api/block/{hash}/txs[/{start_index}]` | Block transactions, with optional start index for paging through long blocks. |
| GET | `/api/blocks[/{startHeight}]` | Block-list traversal by height. |
| GET | `/api/v1/blocks-bulk/{minHeight}[/{maxHeight}]` | Block-range fetch; docs say responses are limited to 10 blocks. |
| GET | `/api/v1/mining/pools[/{timePeriod}]` | Mining-pool overview by time period. |
| GET | `/api/v1/mining/pool/{slug}` | Mining-pool details by slug. |
| GET | `/api/v1/mining/hashrate/{timePeriod}` | Hashrate history by interval. |
| GET | `/api/v1/mining/difficulty-adjustments/{interval}` | Difficulty-adjustment history by interval. |
| GET | `/api/v1/fees/recommended` | Integer feerate recommendations. |
| GET | `/api/v1/fees/precise` | Decimal feerates down to sub-sat precision. |
| GET | `/api/mempool` | Current mempool backlog statistics. |
| GET | `/api/mempool/txids` | Full mempool txid list. |
| GET | `/api/v1/replacements` | RBF replacement-tracking feed. |
| GET | `/api/v1/fullrbf/replacements` | Full-RBF replacement feed. |
| GET | `/api/tx/{txid}` | Transaction lookup. |
| GET | `/api/tx/{txid}/hex` | Returns a transaction serialized as hex. |
| GET | `/api/tx/{txid}/outspends` | Outspend information for all outputs in the transaction. |
| GET | `/api/tx/{txid}/status` | Confirmation status for the transaction. |
| GET | `/api/v1/transaction-times?txId[]={txid}` | Returns first-seen mempool timestamps for supplied txids. |
| POST | `/api/tx` | Broadcasts a raw transaction; docs say the request body should contain hex and the txid is returned on success. |
| GET | `/api/v1/lightning/statistics/{interval}` | Lightning network-wide statistics. |
| GET | `/api/v1/lightning/search?searchText={query}` | Full-text search across nodes and channels. |
| GET | `/api/v1/lightning/nodes/country/{country}` | Lightning nodes for an ISO Alpha-2 country code. |
| GET | `/api/v1/lightning/nodes/{pubKey}` | Lightning node details. |
| GET | `/api/v1/lightning/channels/{channelId}` | Lightning channel details. |
| GET | `/api/v1/lightning/channels?public_key={pubKey}&status={channelStatus}` | Channel listing filtered by node public key and status. |
| POST | `/api/v1/services/accelerator/estimate` | Public accelerator cost estimate; docs say `X-Mempool-Auth` is optional for customized estimation. |
| POST | `/api/v1/services/accelerator/invoice` | Generates an acceleration invoice for a transaction. |
| GET | `/api/v1/services/accelerator/accelerations` | Pending / current public accelerations. |
| GET | `/api/v1/services/accelerator/accelerations/history` | Public acceleration history with filters and pagination. |
| GET | `/api/v1/services/accelerator/accelerations/stats` | Aggregate acceleration statistics. |
| POST | `/api/v1/services/accelerator/top-up` | Authenticated accelerator-credit top-up invoice generation. |
| GET | `/api/v1/services/accelerator/balance` | Authenticated accelerator balance / hold / fees-paid lookup. |
| POST | `/api/v1/services/accelerator/accelerate` | Authenticated accelerate-now request. |
| POST | `/api/v1/services/accelerator/cancel` | Authenticated cancellation of an accelerating request. |
| POST | `/api/v1/services/accelerator/auto-accelerate` | Authenticated auto-acceleration request with trigger conditions. |
| GET | `/api/v1/services/accelerator/auto-accelerate/history` | Authenticated auto-acceleration history. |
| POST | `/api/v1/services/accelerator/auto-accelerate/cancel` | Authenticated cancellation of an auto-acceleration rule. |
| GET | `/api/v1/services/accelerator/history?status={status}&details={details}` | Authenticated per-user acceleration history. |

## Parameters, filters, and pagination notes
Confirmed from the reviewed endpoint-detail panels:
- `GET /api/v1/historical-price` supports `currency` and `timestamp` query parameters; without parameters the docs say it returns full price history for all currencies.
- `GET /api/address/{address}/txs` supports continued traversal using an `after_txid` query parameter.
- `GET /api/address/{address}/txs/chain` returns `25` confirmed transactions per page; the docs say more can be requested by specifying the last txid seen by the previous query.
- `GET /api/address/{address}/txs/mempool` returns up to `50` unconfirmed transactions and does not page.
- `GET /api/block/{hash}/txs[/{start_index}]` uses an optional path segment for paging through transactions in a block.
- `GET /api/v1/blocks-bulk/{minHeight}[/{maxHeight}]` is capped at `10` blocks per request.
- `GET /api/v1/transaction-times` uses repeated `txId[]` query parameters.
- `GET /api/v1/lightning/search` uses `searchText`.
- `GET /api/v1/lightning/nodes/country/{country}` expects an ISO Alpha-2 country code.
- `GET /api/v1/lightning/channels?public_key={pubKey}&status={channelStatus}` uses query parameters for node filtering and channel status.
- `GET /api/v1/services/accelerator/accelerations/history` documents these filters: `status`, `timeframe`, `minedByPoolUniqueId`, `blockHash`, `blockHeight`, `page`, `pageLength`, `from`, and `to`. The docs explicitly say `page` minimum `1` and `pageLength` minimum `1`, maximum `50`.
- `GET /api/v1/services/accelerator/accelerations/stats` documents these filters: `timeframe`, `poolUniqueId`, `blockHash`, `blockHeight`, `from`, and `to`.
- `POST /api/v1/services/accelerator/top-up` documents a minimum amount of `1,000,000` sats.
- `POST /api/v1/services/accelerator/auto-accelerate` documents a required `type` chosen from `time_delay`, `block_height`, `timestamp`, or `next_block`; `value` is required for every type except `next_block` and has type-specific constraints.
- `GET /api/v1/services/accelerator/history` requires `status`; the docs show allowed values `all`, `requested`, `accelerating`, `mined`, `completed`, and `failed`, plus optional `details=true` for expanded history.

## Authentication
Confirmed from the reviewed official docs and cURL examples:
- Core Bitcoin REST endpoints are documented without authentication.
- Lightning endpoints are also shown without authentication.
- Public accelerator routes are generally shown without mandatory auth, but `POST /api/v1/services/accelerator/estimate` explicitly says `X-Mempool-Auth` may be provided optionally for customized estimation.
- Authenticated accelerator routes consistently use the `X-Mempool-Auth` request header in the official examples.
- The reviewed public docs did not expose an alternative bearer-token or OAuth flow; `X-Mempool-Auth` is the only concrete auth mechanism visible in the reviewed authenticated examples.

## Response-format notes
The reviewed REST reference is primarily JSON-oriented, but it is not JSON-only:
- Standard resource routes return JSON objects or arrays.
- `GET /api/block/{hash}/header` returns a hex-encoded string.
- `GET /api/block-height/{height}` returns a block hash string.
- `GET /api/tx/{txid}/hex` returns serialized transaction hex.
- `GET /api/block/{hash}/raw` returns the raw block representation in binary.
- `POST /api/tx` returns the txid on success according to the reviewed description.

## Rate limits and errors
Confirmed from the reviewed REST overview text:
- mempool.space enforces rate limits.
- Exceeding the limits returns `HTTP 429`.
- Repeatedly exceeding the limits may result in the client being banned from the service.
- The docs explicitly point users toward `enterprise sponsorship` if higher API limits are needed.

## Important usage notes
- The official docs mix unversioned `/api/...` paths with versioned `/api/v1/...` paths; fireROUTE should preserve the documented path exactly instead of forcing everything into one prefix.
- The official accelerator `POST` endpoint headings render as `/v1/services/...` in some detail panels, but the same panels' cURL examples use full live URLs under `https://mempool.space/api/v1/services/...`; the live request path therefore includes the `/api` prefix.
- The reviewed documentation is broad enough to treat mempool.space as more than a simple blockchain explorer: it is a combined Bitcoin data, Lightning data, and paid accelerator platform.
- The confirmed route count in this file is based on the currently visible official REST sidebar inventory on the reviewed page, not on third-party mirrors or inferred hidden endpoints.
