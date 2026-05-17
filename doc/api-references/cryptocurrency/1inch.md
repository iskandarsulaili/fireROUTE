# 1inch

Official pages manually reviewed:
- https://1inch.com/api/
- https://business.1inch.com/portal/documentation/overview
- https://business.1inch.com/portal/documentation/apis/authentication
- https://business.1inch.com/portal/llms-full.txt

## Overview
1inch’s current public developer surface lives on the 1inch Business Portal rather than the marketing landing page. The current docs expose a broad paid API suite on the shared gateway `https://api.1inch.com`, covering swap execution, history, traces, portfolio, balances, pricing, NFTs, domains, token metadata, Web3 RPC, OAuth, and MCP access.

Confirmed from the reviewed official docs:
- Primary API base: `https://api.1inch.com`
- MCP endpoint: `https://api.1inch.com/mcp/protocol`
- REST auth methods: `Authorization: Bearer {API_KEY}` header or `apiKey={YOUR_API_KEY}` query parameter
- OAuth support: OAuth 2.1 with discovery on `/.well-known/oauth-authorization-server`
- WebSocket support is documented for Web3 RPC and swap/resolver flows
- Manual route count confirmed in this pass: **20** concrete routes/patterns

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/swap/v5.2/1/tokens` | documented token-list example for classic swap auth |
| GET | `/swap/v6.1/{chainId}` | current classic swap base pattern shown in docs/LLM export |
| POST | `/oauth/register` | dynamic OAuth client registration |
| GET | `/.well-known/oauth-authorization-server` | OAuth server metadata discovery |
| POST | `/oauth/token` | OAuth token exchange |
| POST | `/mcp/protocol` | MCP server transport |
| GET | `/history/v2.0/history` | history API base route shown in LLM docs |
| GET | `/traces/v1.0/chain/{chainId}/synced-interval` | chain trace sync interval |
| GET | `/traces/v1.0/chain/{chainId}/block-trace/{blockNumber}` | full block trace |
| GET | `/traces/v1.0/chain/{chainId}/block-trace/{blockNumber}/tx-hash/{txHash}` | single transaction trace inside block context |
| GET | `/portfolio/portfolio/v5.0/general/current_value` | current portfolio valuation |
| GET | `/portfolio/portfolio/v5.0/general/profit_and_loss` | P&L over a timerange |
| GET | `/portfolio/portfolio/v5.0/tokens/snapshot` | token holdings snapshot |
| GET | `/portfolio/portfolio/v5.0/protocols/snapshot` | protocol holdings snapshot |
| GET | `/portfolio/portfolio/v5.0/general/chart` | portfolio chart series |
| GET | `/balance/v1.2/{chainId}/balances/{walletAddress}` | wallet balances by chain |
| GET | `/gas-price/v1.6/{chainId}` | gas-price quote endpoint |
| GET | `/price/v1.1/{chainId}` | spot-price API base route |
| GET | `/nft/v2/byaddress` | NFT holdings by address |
| POST | `/web3/{chainId}` | chain-specific Web3 RPC / WebSocket family |

## Parameters and request notes
Confirmed from reviewed examples and route families:
- `chainId` is embedded in many route families; reviewed docs explicitly list support for Ethereum `1`, Solana `501`, Base `8453`, BNB Chain `56`, zkSync `324`, Gnosis `100`, Optimism `10`, Polygon `137`, Linea `59144`, Sonic `146`, Unichain `130`, Arbitrum `42161`, Avalanche `43114`, and Monad `143` for RPC
- `walletAddress` appears as a path parameter on Balance API routes
- Trace routes use path parameters such as `blockNumber` and `txHash`
- Portfolio examples use query parameters including `addresses=`, `timerange=`, `chain_id=`, and `contract_address=`
- Authentication docs confirm the same bearer token can be passed either in the `Authorization` header or as `apiKey=` in the query string

## Authentication
- The current Business Portal documents two auth models:
  - API key auth via `Authorization: Bearer {YOUR_API_KEY}`
  - OAuth 2.1 bearer tokens for client-credentials and authorization-code-plus-PKCE flows
- OAuth discovery is published at `GET /.well-known/oauth-authorization-server`
- The docs also mention portal-scoped access tokens for some application-management flows such as client registration

## Rate limits and errors
- The reviewed auth docs explicitly document an `X-Request-Id` response header for support/debug correlation
- The reviewed pages do not publish a single universal numeric request-per-second ceiling across the whole product suite; limits are subscription-plan dependent
- API troubleshooting and error-message FAQ pages are linked in the official docs navigation and should be consulted per product family

## Response and pagination notes
- JSON is the standard response format across the reviewed REST examples
- Web3 RPC uses JSON-RPC semantics on chain-specific endpoints/websockets
- Portfolio endpoints return structured snapshots/metrics/chart series rather than raw chain-native RPC responses

## Important usage notes
- The old `1inch.io/api` landing page now redirects to marketing content; the real current API reference is on `business.1inch.com`
- The LLM export at `https://business.1inch.com/portal/llms-full.txt` is unusually useful and explicitly described by 1inch as the canonical source for versions and endpoints for automation use cases
- 1inch now treats this as a subscription SaaS platform; even though the legacy public-apis index says “No auth”, the current official docs require API keys or OAuth tokens for the documented Business APIs
- The reviewed docs expose many more product families than a simple swap API, including history, traces, portfolio, balances, gas, spot price, token metadata, domains, charts, transaction gateway, and Web3 RPC
