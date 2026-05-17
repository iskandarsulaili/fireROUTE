# Block

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `block`
- Official docs/pages manually reviewed:
  - `https://block.io/docs/basic`
  - `https://block.io/`
  - `https://chain.so/`
  - `https://chain.so/api/`
- API product described by the reviewed docs: `SoChain Blockchain APIs (current Block.io-linked public API surface)`
- Base URL manually confirmed from the reviewed docs/examples: `https://chain.so`
- Primary path prefix manually confirmed from the reviewed routes: `/api/v3`
- Manually confirmed route count: `13`
- Response format shown on the reviewed docs: `JSON` (`application/json`)

## Overview
The legacy Block.io public doc entrypoints now funnel into the SoChain / `chain.so` property rather than a standalone Block.io developer portal. In this browser environment, the current `https://chain.so/` homepage still stops on a Cloudflare `Performing security verification` interstitial, but the first-party API reference at `https://chain.so/api/` is browsable and exposes a compact v3 blockchain-data API plus one authenticated account endpoint.

The reviewed reference describes read-only Bitcoin, Dogecoin, Litecoin, and testnet lookups rooted at `https://chain.so/api/v3`. All currently visible route entries are `GET` endpoints, even though the intro text says the API can be accessed with `GET` or `POST` HTTPS requests. For fireROUTE purposes, the current official surface is much better treated as a SoChain-hosted successor to the old Block.io docs rather than as a live Block.io-branded reference.

## Manually confirmed endpoints
| Method | Path | What the reviewed docs show |
|---|---|---|
| GET | `/api/v3/transactions/{{network}}/{{address}}/{{page}}` | Paginated transaction history for one address, returned in descending time order |
| GET | `/api/v3/transaction_counts/{{network}}/{{address}}` | Sent / received / total transaction counts for one address |
| GET | `/api/v3/unspent_outputs/{{network}}/{{address}}/{{page}}` | Paginated UTXO list for one address, returned in ascending time order |
| GET | `/api/v3/balance/{{network}}/{{address}}` | Confirmed and unconfirmed balance lookup for one address |
| GET | `/api/v3/address_summary/{{network}}/{{address}}` | Basic address-level statistics |
| GET | `/api/v3/is_valid_address/{{network}}/{{address}}` | Helper validation check for whether an address is valid on the target network |
| GET | `/api/v3/transaction/{{network}}/{{hash}}` | Full data lookup for one transaction ID |
| GET | `/api/v3/latest_blocks_summary/{{network}}` | Summary of the latest `10` indexed blocks for the target network |
| GET | `/api/v3/block/{{network}}/{{block_hash_or_height}}` | Full data lookup for one block by hash or height-style identifier |
| GET | `/api/v3/best_block_hash/{{network}}` | Latest indexed block hash for the target network |
| GET | `/api/v3/price/{{network}}/{{unix_timestamp}}` | Native-coin price at a given UNIX timestamp; docs say omitting the timestamp returns the latest price |
| GET | `/api/v3/network_info/{{network}}` | Basic network and mempool statistics |
| GET | `/api/v3/account_info` | Basic information for the authenticated account |

## Parameters and request notes
### Shared path parameters
Confirmed from the reviewed docs and examples:
- `network` — network acronym from the visible supported-network table: `BTC`, `DOGE`, `LTC`, `BTCTEST`, `DOGETEST`, `LTCTEST`
- `address` — blockchain address string for the selected network
- `page` — page number used on the two paginated address-history routes
- `hash` — transaction ID for `/transaction/...`
- `block_hash_or_height` — block identifier placeholder used by the block-lookup route
- `unix_timestamp` — UNIX timestamp for historical price lookup; the docs explicitly say the latest price is returned when no timestamp is provided

### Route-specific behavior visible in the docs
- `/transactions/.../{{page}}` returns up to `10` results per page in descending time order.
- `/unspent_outputs/.../{{page}}` returns up to `10` results per page in ascending time order.
- `/latest_blocks_summary/{{network}}` is documented as a fixed summary of the latest `10` blocks.
- `/network_info/{{network}}` includes a docs caution that mempool data depends on what SoChain nodes see and may vary across nodes / explorers / APIs.
- The reviewed public reference did **not** expose any request-body schema for the visible routes.

## Authentication
- The reviewed docs say you need an API key to access the API.
- The documented auth mechanism is an `API-KEY` request header, shown in examples such as:
  - `curl "https://chain.so/api/v3/balance/{{network}}/{{address}}" -H "API-KEY: {{api_key}}"`
- The intro explicitly warns that the API key `must not be published client-side`.
- The docs say users obtain keys by logging in or signing up.
- No OAuth flow, bearer-token scheme, HMAC-signature contract, or session-cookie auth model was exposed in the reviewed public reference.

## Rate limits, pagination, errors, and format notes
- Response format is documented as `application/json`.
- Successful responses use a top-level envelope shaped like:
  - `{ "status": "success", "data": { ... } }`
- Failed responses are documented with HTTP `401`, `404`, or `429` and a fail envelope shaped like:
  - `{ "status": "fail", "data": { "error_message": "..." } }`
- The public docs mention `429` but do **not** publish a numeric quota table, burst policy, or rate-limit response headers.
- The currently visible official route inventory is entirely `GET`-only.
- Pagination is route-specific rather than cursor-based:
  - `/transactions/.../{{page}}` -> up to `10` results per page
  - `/unspent_outputs/.../{{page}}` -> up to `10` results per page
- The reviewed docs did not expose a standalone error-code catalog beyond the shared `401` / `404` / `429` note and the `error_message` field.

## Important usage notes
- The practically usable first-party docs host is now `https://chain.so/api/`, not the older standalone Block.io documentation surface.
- The current reviewed public API is focused on blockchain data retrieval plus account inspection; the browsable docs did **not** expose old-style wallet-management or transaction-broadcast/write routes.
- Because the Block.io branding has clearly shifted toward SoChain, downstream adapters should runtime-verify hostnames and branding before assuming long-term stability.
- The `https://chain.so/` site root still presented a Cloudflare verification wall in this environment even though the API reference itself was reachable, so future manual verification passes may see mixed browser behavior depending on the exact page entered.
