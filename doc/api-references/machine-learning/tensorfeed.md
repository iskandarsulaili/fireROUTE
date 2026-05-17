# TensorFeed

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `tensorfeed`
- Docs used manually:
  - `https://tensorfeed.ai/`
  - `https://tensorfeed.ai/api-reference`
  - `https://tensorfeed.ai/developers/agent-payments`
- Confirmed API base URL: `https://tensorfeed.ai`
- Authentication model confirmed in this pass:
  - free endpoints: no auth
  - premium endpoints: bearer token returned by the payment flow, sent as `Authorization: Bearer <token>`
  - documented fallback payment flow: `402` response + `X-Payment-Tx` and `X-Payment-Quote` headers on retry
- Confirmed response format in this pass: JSON
- Manually confirmed routes in this pass: `51`

## Authentication
- The official API reference states that free endpoints require no authentication.
- The official payment docs state that premium access is obtained by:
  1. `POST /api/payment/buy-credits` with `amount_usd` and `sender_wallet`
  2. sending USDC on Base to the returned wallet
  3. `POST /api/payment/confirm` with `tx_hash` and the returned `nonce`
  4. using the returned bearer token as `Authorization: Bearer <token>`
- The payment docs explicitly say `nonce` is required on `/api/payment/confirm` and that a sender-wallet mismatch returns `sender_mismatch`.
- The reviewed payment page also documents an x402-style fallback for first-touch premium requests:
  - call a premium endpoint with no auth
  - receive `402` payment instructions
  - bind a quote with `POST /api/payment/buy-credits`
  - retry with `X-Payment-Tx` and `X-Payment-Quote`
  - receive a token in `X-Payment-Token`

## Pricing and rate-limit notes
- The official API reference labels most premium routes as `1 credit` per call.
- The payment docs say the base rate is `50 credits per $1 USDC`, with automatic volume discounts for larger bundles.
- Credits do not expire, per the reviewed payment docs.
- The only numeric public rate limit exposed on the reviewed pages is:
  - `GET /api/preview/routing` -> `Free (5/day/IP)` / `5 calls per UTC day per IP`
- The reviewed docs do not publish a broader requests-per-second or global burst-limit table for the rest of the API.

## Request and response format notes
- The reviewed API reference describes the service as a JSON API.
- Confirmed free and premium endpoints on the reviewed pages are mostly `GET`, with these documented `POST` exceptions:
  - `POST /api/premium/watches`
  - `POST /api/payment/buy-credits`
  - `POST /api/payment/confirm`
- The payment docs show JSON request bodies for payment-flow routes.
- The reviewed pages document date-window and range-style parameters on many history endpoints instead of offset/page pagination.

## Error handling
- The payment docs explicitly document a `402` payment-required flow for premium endpoints when no valid token/payment context is present.
- The payment docs explicitly document these payment-flow failure conditions / behaviors:
  - `sender_mismatch` if the on-chain sender does not match the quote-bound `sender_wallet`
  - duplicate confirmation is rejected because the confirm flow is described as idempotent and the same tx submitted twice is rejected
- The payment page states: `Code-enforced no-charge on 5xx, breaker, schema fail, or stale data.`
- The reviewed pages do not expose a universal HTTP status-code table beyond those premium-payment notes and route-specific examples.

## Pagination
- The reviewed TensorFeed pages do not document classic page-number or cursor pagination.
- Instead, history-style endpoints use explicit date filters and documented window caps such as:
  - up to `30` days on some news/history routes
  - up to `90` days on several pricing, benchmark, uptime, and source-health series routes
- `GET /api/payment/usage` is documented as returning the `last 100 calls` aggregated by endpoint for the current token.

## Important usage notes
- The official API reference splits the surface into free public endpoints and premium pay-per-call endpoints.
- The premium system is tied to USDC on Base mainnet rather than a conventional dashboard-issued API key.
- The payment docs say premium calls can also be paid through the x402-compatible fallback path.
- The API reference says MCP tools wrap both free and premium tiers for Claude Desktop / Claude Code style consumption.
- `POST /api/premium/watches` is documented as registering webhook watches with HMAC-signed POST delivery.
- The reviewed pages describe several endpoints as daily or near-real-time derived products rather than raw upstream passthrough APIs.

## Confirmed routes

### News and briefing
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/news` | free; docs mention `category` and `limit` filters |
| GET | `/api/premium/news/search` | premium; docs mention full-text search with date / provider / category filters and recency boost |
| GET | `/api/premium/history/news/verified` | premium; verified multi-source news clusters |
| GET | `/api/premium/history/news/clusters/full` | premium; supports single `date` or `from` / `to` range |
| GET | `/api/premium/history/news/full` | premium; supports single `date` or `from` / `to` range; range max `30` days |
| GET | `/api/premium/history/news/source-health` | premium; `from`, `to`; range max `90` days |
| GET | `/api/premium/whats-new` | premium; docs describe last `1-7` days summary |

### Status and monitoring
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/status` | free live provider status |
| GET | `/api/premium/status/leaderboard` | premium; custom-range uptime ranking |
| GET | `/api/premium/probe/series` | premium; provider latency / error-rate / TTFB history |
| GET | `/api/premium/history/status/uptime` | premium; `provider`, `from`, `to`; range max `90` days |

### Models, benchmarks, and comparison
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/models` | free model catalog |
| GET | `/api/benchmarks` | free benchmark catalog |
| GET | `/api/harnesses` | free cross-harness benchmark leaderboard |
| GET | `/api/multimodal` | free multimodal model catalog |
| GET | `/api/embeddings` | free embedding / reranker catalog |
| GET | `/api/inference-providers` | free hosted-inference price matrix |
| GET | `/api/inference-providers/cheapest` | free; docs say sorts can use blended/input/output/output-TPS style ranking |
| GET | `/api/premium/compare/models` | premium; compares `2-5` models side-by-side |
| GET | `/api/premium/cost/projection` | premium; projects workload across `1-10` models |
| GET | `/api/premium/clean/openrouter/{model_id}` | premium; path param `model_id` |
| GET | `/api/premium/packages/pypi/momentum` | premium weekly AI/ML PyPI momentum |
| GET | `/api/preview/routing` | free preview; docs show `task`; limited to `5/day/IP` |
| GET | `/api/premium/routing` | premium; docs explicitly show `task`, `budget`, `top_n`, `w_quality`, `w_cost`, plus weight controls |

### Attention and history series
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/attention` | free attention index |
| GET | `/api/attention/history` | free list of snapshot dates |
| GET | `/api/premium/attention/series` | premium date-range attention series |
| GET | `/api/premium/history/pricing/series` | premium; `model`, `from`, `to`; max `90` days |
| GET | `/api/premium/history/benchmarks/series` | premium; `model`, `benchmark`, `from`, `to`; max `90` days |

### Security, policy, economy, and research
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/premium/security/verified/{cve_id}` | premium; path param `cve_id` |
| GET | `/api/premium/security/epss/top` | premium; top-N EPSS view as of a UTC date |
| GET | `/api/premium/security/kev/full` | premium complete KEV catalog |
| GET | `/api/premium/security/cve/range` | premium UTC date-range CVE query |
| GET | `/api/premium/security/epss/series` | premium EPSS time series for one CVE |
| GET | `/api/premium/security/kev/series` | premium KEV additions over date range |
| GET | `/api/premium/economy/recession-watch` | premium macroeconomic composite |
| GET | `/api/premium/policy/timeline` | premium AI policy timeline |
| GET | `/api/premium/research/velocity` | premium research-output velocity |

### Climate and public-data feeds
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/climate/weather-alerts` | free US weather alerts |
| GET | `/api/climate/earthquakes` | free; docs mention magnitude bucket + period bucket |

### Agents, providers, and vector infrastructure
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/agents/opportunities` | free daily AI-agent ecosystem scan |
| GET | `/api/vector-dbs` | free vector database catalog |
| GET | `/api/premium/agents/directory` | premium enriched agents directory |
| GET | `/api/premium/providers/{name}` | premium provider deep-dive; path param `name` |

### Webhooks and watches
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| POST | `/api/premium/watches` | premium; webhook watch registration; docs mention price-change, status-transition, and digest watch types; HMAC-signed POST delivery |

### Payment and token lifecycle
| Method | Path | Key confirmed parameters / notes |
|---|---|---|
| GET | `/api/payment/info` | free; wallet address, pricing tiers, supported flows, verification metadata |
| POST | `/api/payment/buy-credits` | free; required body fields `amount_usd`, `sender_wallet`; returns `memo`, `credits`, `expires_at`, `ttl_seconds` |
| POST | `/api/payment/confirm` | free; required body fields `tx_hash`, `nonce`; returns bearer token |
| GET | `/api/payment/balance` | bearer token required |
| GET | `/api/payment/usage` | bearer token required; last `100` calls aggregated by endpoint |
| GET | `/api/payment/history` | bearer token required |

## Verification notes
This file was manually rebuilt from TensorFeed's official homepage, official API reference page, and official agent-payments page. Route confirmations, auth behavior, payment flow, and the documented `5/day/IP` preview-routing limit all come from those reviewed official pages.