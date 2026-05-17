# Steem

Official docs manually reviewed:
- https://developers.steem.io/
- https://developers.steem.io/apidefinitions/

## Overview
Steem’s official developer docs describe the API as an **Appbase / JSON-RPC** interface rather than a path-rich REST API. The reviewed docs expose many API namespaces and methods, but they are all invoked through the same JSON-RPC request surface.

## Base URL manually confirmed
- `https://api.steemit.com`

## Canonical route model manually confirmed
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| POST | `/` | Submit JSON-RPC requests to Steem API namespaces such as `condenser_api`, `database_api`, `network_broadcast_api`, `account_history_api`, `tags_api`, and others | JSON body fields confirmed from the docs include `jsonrpc`, `method`, `params`, and `id` |

Manual route count confirmed: **1** canonical HTTP route.

## JSON-RPC request model
From the reviewed official docs:
- example body: `{"jsonrpc":"2.0", "method":"condenser_api.get_dynamic_global_properties", "params":[], "id":1}`
- example appbase body: `{"jsonrpc":"2.0", "method":"database_api.get_dynamic_global_properties", "id":1}`
- when not using `condenser_api`, the docs say `params` may be omitted for methods without arguments

## API namespaces / method families visible in the current docs
The reviewed API Definitions page currently lists namespaces including:
- `condenser_api`
- `bridge`
- `account_by_key_api`
- `account_history_api`
- `block_api`
- `database_api`
- `debug_node_api`
- `follow_api`
- `market_history_api`
- `network_broadcast_api`
- `rc_api`
- `reputation_api`
- `rewards_api`
- `tags_api`
- `transaction_status_api`
- `witness_api`

The same reviewed page also exposes a very large list of concrete method names, especially under `condenser_api`.

## Important official note
The reviewed page includes this warning:
- `condenser_api.*` calls are ready for use
- all other appbase methods are currently works in progress and may change or be unsuitable for production use

That warning is important for fireROUTE routing decisions.

## Auth model
- No API-key or OAuth requirement was shown on the reviewed public docs pages.
- The reviewed public endpoint appears openly callable as a blockchain JSON-RPC service.

## Response / error notes
- Responses are JSON-RPC JSON objects.
- Successful responses use the normal JSON-RPC envelope.
- Method-specific request and expected-response examples are published inline throughout the API Definitions page.

## Important usage notes
- fireROUTE should model Steem as a **single JSON-RPC POST provider** rather than trying to flatten every method into separate path-based routes.
- The docs explicitly differentiate between the production-ready `condenser_api` family and less-stable appbase methods.
- Because the route is method-driven, canonicalization should focus on JSON body fields and namespace/method names rather than URL paths.
