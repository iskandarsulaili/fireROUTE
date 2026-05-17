# Huobi

Official pages manually reviewed:
- https://huobiapi.github.io/docs/spot/v1/en/

## Overview
Huobi’s current first-party spot API documentation remains published on GitHub Pages. The reviewed page is a long single-document reference covering REST, WebSocket market data, WebSocket account/order streams, and spot account/trading/wallet management.

Confirmed from the reviewed official docs:
- Official spot docs host: `https://huobiapi.github.io/docs/spot/v1/en/`
- The live page exposes sections for Reference Data, Market Data, Account, Wallet, Sub-user Management, Trading, Conditional Order, Margin Loan, and WebSocket APIs
- Manual route count confirmed from concrete endpoint paths visible in the changelog and section bodies reviewed on the page: **10**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/v1/common/symbols` |
| GET | `/v2/settings/common/market-symbols` |
| GET | `/v1/settings/common/symbols` |
| GET | `/v1/settings/common/chains` |
| GET | `/v1/account/accounts/{account-id}/balance` |
| GET | `/v1/account/history` |
| POST | `/v1/order/orders/place` |
| POST | `/v1/order/batch-orders` |
| POST | `/v1/dw/withdraw/api/create` |
| POST | `/v2/sub-user/api-key-generation` |

## Authentication
Confirmed from the reviewed official page:
- Huobi requires an API key and secret for private endpoints.
- The docs include a dedicated API Access section and repeated signed-request examples with API key/secret placeholders.
- Private WebSocket/account streams are documented separately from public market streams.

## Parameters and request notes
- Huobi uses path parameters such as `{account-id}` for account-scoped operations.
- The changelog shows active evolution of request parameters including `self-match-prevent`, `client-order-id`, and account sequence-number fields.
- The docs include both spot REST and WebSocket topics on a single page, so transport selection matters when implementing low-latency consumers.

## Rate limits
- The reviewed page includes a dedicated `SPOT API Rate Limits` section, confirming first-party rate-limit documentation exists.
- During this pass, the visible body text confirmed the presence of a rate-limit table but did not expose the full numeric table in the extracted browser text segment used for manual notes.
- fireROUTE adapters should therefore treat Huobi rate limits as officially documented but not fully transcribed in this file until a dedicated per-endpoint table is manually copied page-by-page.

## Response and error notes
- The official page contains a dedicated Errors section.
- REST and WebSocket examples are both embedded inline on the same doc page.
- The changelog highlights backward-compatible-but-important field additions; consumers should tolerate additive fields.

## Important usage notes
- The reviewed spot documentation is very large and doubles as Huobi’s changelog, so many concrete routes are surfaced first in release notes before deeper endpoint sections.
- The official docs clearly separate reference/market/account/wallet/trading domains; fireROUTE mappings should keep those domains distinct rather than collapsing them into a single generic exchange surface.
