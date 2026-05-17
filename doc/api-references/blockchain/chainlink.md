# Chainlink

Official docs manually reviewed:
- https://dev.chain.link/
- https://docs.chain.link/data-feeds/api-reference
- https://docs.chain.link/quickstarts/historical-price-feeds-api

## Overview
Chainlink’s current official developer docs are primarily smart-contract, oracle-network, and SDK documentation. During manual review I did **not** find a single provider-hosted public REST API base URL comparable to a typical SaaS API.

What the official docs do expose:
- onchain contract/interface references (Data Feeds, Functions, Automation, CCIP, Data Streams)
- SDK/library references
- a QuickStart that shows how to deploy **your own** offchain Historical Price Feeds API locally

## Base URLs manually confirmed
Provider-controlled docs hosts:
- `https://dev.chain.link`
- `https://docs.chain.link`

Self-hosted tutorial example from the official QuickStart:
- `http://localhost:3000`

## Canonical route findings
### Provider-hosted public HTTP API
No Chainlink-managed public REST base URL or endpoint catalog was exposed on the reviewed official docs pages.

### Self-hosted tutorial route shown in official docs
| Method | Path | Host | Notes |
|---|---|---|---|
| GET | `/api/price` | `http://localhost:3000` | Official Historical Price Feeds API tutorial example; this is a self-hosted sample app, not a Chainlink-operated public API |

Manual route count confirmed for provider-hosted Chainlink HTTP APIs: **0**.

## Parameters and request model
From the reviewed Historical Price Feeds API QuickStart:
- the sample route is used to fetch historical price-feed data
- the tutorial text explicitly says you specify a time range
- for a single-round lookup, the docs say to use the same start and end timestamps
- the response is described as JSON

Because the reviewed page is a build-your-own example rather than a hosted Chainlink API contract, the exact query schema should be treated as tutorial code rather than a stable vendor API guarantee.

## Auth model
- No centralized public API-key or bearer-token auth model was documented for a Chainlink-hosted REST API on the reviewed pages.
- Product-specific access in Chainlink is generally organized around blockchain usage, contracts, nodes, feeds, and developer tooling rather than a single REST gateway.

## Response / error notes
From the reviewed QuickStart:
- the sample API returns JSON
- the page includes dedicated `Response` and `Errors` sections
- the tutorial also includes an explicit disclaimer that the sample is provided as an example and should not be treated as production-ready without additional auditing and hardening

## Important usage notes
- Chainlink should **not** currently be modeled as a normal provider-hosted REST API in fireROUTE.
- The official docs are real and active, but they document protocol products and interfaces more than a centralized HTTP API service.
- If fireROUTE ever needs Chainlink support, it will likely be via protocol-specific adapters, smart-contract interactions, or a user-deployed helper service rather than a single vendor REST integration.
- The official Historical Price Feeds API page is best read as a self-hosted reference implementation, not as a public Chainlink API surface.

## Blocker note
I manually reviewed both the general Chainlink developer hub and an official alternative docs page. The blocker is **not** site reachability; it is that the currently public official documentation does not expose a provider-hosted, endpoint-level HTTP API reference suitable for a normal fireROUTE passthrough adapter.
