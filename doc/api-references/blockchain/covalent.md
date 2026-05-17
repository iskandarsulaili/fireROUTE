# Covalent

Official docs manually reviewed:
- https://www.covalenthq.com/docs/api/ (currently redirects into GoldRush docs)
- https://goldrush.mintlify.app/api-reference/foundational-api/cross-chain/get-address-activity
- https://goldrush.mintlify.app/api-reference/pipeline-api/list-pipelines
- https://goldrush.mintlify.app/api-reference/pipeline-api/create-pipeline

## Overview
Covalent’s current public API docs live under the **GoldRush** branding. The reviewed pages expose three distinct API surfaces:
- Foundational REST API on `api.covalenthq.com`
- Pipeline API on `api.covalenthq.com/platform/pipeline-api/`
- Streaming GraphQL API on `streaming.goldrushdata.com/graphql`

The legacy docs URL now lands inside the GoldRush documentation set rather than the older CovalentHQ docs site.

## Base URLs manually confirmed
From the reviewed current docs HTML and examples:
- `https://api.covalenthq.com/v1`
- `https://api.covalenthq.com/platform/pipeline-api/`
- `https://streaming.goldrushdata.com/graphql`
- `https://hypercore.goldrushdata.com/info` (shown in the docs HTML for the Hyperliquid/Hypercore surface)
- `https://x402.goldrush.dev/v1` (shown in current docs HTML for the x402 section)

## Canonical routes manually confirmed
| Method | Path | Surface | Purpose | Confirmed parameters |
|---|---|---|---|---|
| GET | `/v1/address/{walletAddress}/activity` | Foundational API | Get activity across all chains for an address | Path: `walletAddress`; query: `testnets` |
| GET | `/v1/{chainName}/address/{address}/balances_v2/` | Foundational API | Token balances for an address on a specific chain | Path: `chainName`, `address`; reviewed docs HTML also shows optional query such as `no-spam=true` and legacy `key=API_KEY` examples |
| GET | `/platform/pipeline-api/` | Pipeline API | List pipelines | Query: `page_number`, `page_size`; bearer auth |
| POST | `/platform/pipeline-api/` | Pipeline API | Create a pipeline | JSON body fields shown in official example include `name`, `project`, `topic`, `destination_type`, `destination_config`, `execution_mode`, `description`, `transforms`, `execution_start_from`, `execution_stop_from`, `abi_file`, `abi_contract_addresses`, `abi_unmatched`, `status` |
| POST | `/graphql` | Streaming API | GraphQL queries/subscriptions against GoldRush streaming data | GraphQL request body |

Manual route count concretely confirmed from reviewed endpoint pages and current docs HTML: **5**.

## Auth model
The reviewed official docs currently expose two auth patterns:
- **Bearer token auth** in current endpoint pages and “Try it” panels (`Authorization: Bearer <token>`)
- **Legacy query-key examples** still visible in current docs HTML for `api.covalenthq.com/v1` routes (`?key=API_KEY`)

For fireROUTE, prefer the current bearer-auth model when possible, while noting that some first-party examples still surface `key=` query auth on the foundational API.

## Response / error notes
From the reviewed pages:
- Foundational API responses are JSON
- the reviewed address-activity page returns fields such as `updated_at`, `address`, and `items`
- Pipeline API endpoint pages document success and error tabs such as `200`, `201`, `400`, `401`, `403`, and `422`

## Pagination / quotas
### Foundational API
- the reviewed address-activity page shows **credit cost** information (`0.5 per call`) and marks processing as realtime
- no universal requests-per-second limit was visible on the reviewed pages

### Pipeline API
- list endpoint supports `page_number` and `page_size`

## Important usage notes
- The provider should now be documented as **Covalent / GoldRush**, not only as the old CovalentHQ docs brand.
- The old docs URL still matters because it redirects into the live GoldRush documentation set.
- The public docs currently mix newer bearer-auth examples with older `key=` examples; that inconsistency should be called out in any integration notes.
- The reviewed GoldRush docs clearly show multiple API products, so fireROUTE should not assume one single homogeneous route family.
