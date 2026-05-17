# Helium

Official pages manually reviewed:
- https://heliumtrades.com/mcp-page/
- https://heliumtrades.com/mcp-page/ (current first-party MCP configuration page and pricing/details content)

## Overview
The current official Helium Trades page does **not** expose a traditional REST finance API reference. Instead, it documents a Model Context Protocol (MCP) server that gives AI clients access to market/news/options tools.

- Current documented transport: MCP over HTTPS
- Confirmed endpoint: `https://heliumtrades.com/mcp`
- Manual route count confirmed from the official page: **1** transport endpoint

## Authentication and access model
The official MCP page explicitly states:
- the first **50 queries** are free
- free usage is enforced **per network / IP**
- no sign-up is needed for the initial free allowance
- unlimited usage is available at **$0.02 per query**, billed daily
- paid usage includes a **dedicated API key** and priority access

The public MCP configuration snippet shown on the page for free access is:

```json
{
  "mcpServers": {
    "helium": {
      "url": "https://heliumtrades.com/mcp"
    }
  }
}
```

The current page does not publish the exact HTTP header name for the paid API key on the public marketing/config page.

## Confirmed endpoint
| Transport | Endpoint | Purpose |
|---|---|---|
| MCP / HTTPS | `https://heliumtrades.com/mcp` | Connect AI clients to Helium’s market/news/options tools |

## Tool / capability notes visible on the official page
The page explicitly advertises these tool families behind the MCP server:
- `search_news`
- `search_balanced_news`
- `get_source_bias`
- `get_bias_from_url`
- `get_all_source_biases`
- `get_ticker`
- `get_option_price`
- `get_historical_options_data`
- `get_top_trading_strategies`
- `search_memes`

These are useful capability names for fireROUTE planning, but the public page does not expose endpoint-per-tool HTTP paths because the product is documented as an MCP server rather than a REST route set.

## Rate limits and pricing
The official page currently confirms:
- free tier: 50 total queries per network/IP
- paid tier: metered at $0.02 per query
- paid tier includes unlimited queries

No additional requests-per-second cap or HTTP 429 schema is publicly shown on the reviewed page.

## Response format
The reviewed page is configuration-oriented and does not publish sample JSON responses for the underlying tool calls. Because the product is exposed as MCP, response structure is client/tool-call specific rather than documented as a simple REST envelope on the public page.

## Important usage notes
- This provider’s current public documentation is for an MCP server, not a classic REST finance API.
- The page markets access to real-time news, bias scoring, market data, and options intelligence, but does not publish endpoint-level REST paths for those capabilities.
- fireROUTE should treat this as a transport/integration endpoint rather than infer undocumented HTTP resource routes.

## fireROUTE note
Use this provider only where MCP-based integration is acceptable. Do not invent REST routes for the advertised tools unless Helium later publishes a first-party HTTP reference with concrete per-tool request paths and auth headers.
