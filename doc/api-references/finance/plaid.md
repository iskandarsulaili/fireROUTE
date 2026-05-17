# Plaid

Official docs manually reviewed:
- https://plaid.com/docs/api/
- https://plaid.com/docs/api/link/#linktokencreate
- https://plaid.com/docs/api/items/#itempublic_tokenexchange
- https://plaid.com/docs/api/accounts/#accountsget
- https://plaid.com/docs/api/products/transactions/#transactionssync

## Overview
Plaid is a JSON-over-HTTPS API for bank-linking, account retrieval, and financial data products. The official overview page confirms the platform-wide auth/header rules and environment hosts; product pages expose endpoint families and request fields.

- Sandbox host: `https://sandbox.plaid.com`
- Production host: `https://production.plaid.com`
- Protocol: JSON over HTTPS TLS 1.2
- Content type: `application/json`
- Requests: POST requests
- Auth: `client_id` + `secret`, supplied either in JSON body or headers `PLAID-CLIENT-ID` and `PLAID-SECRET`

## Authentication
Confirmed from the overview page:
- Nearly all endpoints require `client_id` and `secret`
- They may be supplied in the request body or via headers:
  - `PLAID-CLIENT-ID`
  - `PLAID-SECRET`
- Every response includes `request_id`

## Confirmed endpoints
### Link
- `POST /link/token/create` — create a token for initializing Link
- `POST /link/token/get` — fetch details about a completed Link session

### Items
- `POST /item/get` — retrieve an Item
- `POST /item/remove` — remove an Item
- `POST /item/webhook/update` — update webhook URL for an Item
- `POST /item/public_token/exchange` — exchange a Link `public_token` for an `access_token`
- `POST /item/access_token/invalidate` — rotate an access token

### Accounts
- `POST /accounts/get` — retrieve linked accounts for an Item

### Transactions
- `POST /transactions/sync` — incremental transaction updates via cursor
- `POST /transactions/get` — fetch transaction data
- `POST /transactions/recurring/get` — fetch recurring transaction data
- `POST /transactions/refresh` — trigger refresh of transaction data
- `POST /categories/get` — list transaction categories

Manual route count confirmed from the reviewed product pages: **13**.

## Endpoint details
### `POST /link/token/create`
The Link docs describe this endpoint as the backend step used to initialize a Link session.

The page also cross-links:
- `/item/public_token/exchange`
- `/sandbox/public_token/create`
- `/sandbox/item/reset_login`
- `/session/token/create`

### `POST /item/public_token/exchange`
The Items page confirms the token-exchange flow and positions this endpoint as the bridge from Link completion to long-lived API access.

Use it to exchange a short-lived `public_token` for an `access_token`.

### `POST /accounts/get`
Confirmed from the Accounts page:
- Returns active bank accounts linked to an Item
- Uses cached account information rather than a real-time balance refresh
- For fresher balances, the docs point users to `/accounts/balance/get` or `/signal/evaluate`

Confirmed request fields shown on page:
- `client_id`
- `secret`
- `access_token` required
- optional account selection/filter fields further down the page

### `POST /transactions/sync`
Confirmed behavior from the Transactions page:
- Retrieves transaction updates incrementally using a cursor
- Supports credit, depository, and some loan-type accounts (student subtype loans noted)
- Returns empty arrays when transactions data is not ready yet
- Requires special pagination handling: if pagination is interrupted during a sync update, restart from the original cursor for the first page of that update set

Important sync-specific notes explicitly documented:
- Track both the latest `next_cursor` and the original cursor that started a paginated update loop
- A pagination mutation error requires restarting the full pagination loop

## Pagination and cursoring
Plaid does not use generic `limit/offset` pagination on the reviewed endpoints.

Confirmed patterns:
- Link/Item/Account endpoints are single-shot POSTs
- `transactions/sync` uses cursor-based incremental sync, not offset paging
- Responses include `request_id` for diagnostics

## Errors
The overview page confirms:
- application-level errors are exposed in JSON bodies as `error_code` and `error_type`
- these should be preferred over raw HTTP status codes when interpreting API failures

The Transactions page also documents webhook/error conditions around sync update availability and pagination mutation handling.

## Important usage notes
- Sandbox and Production are separate environments; Items cannot be moved between them.
- All requests must use HTTPS with TLS 1.2.
- Tokens other than `public_token` and `link_token` are sensitive and should never be exposed client-side.
- `request_id`, `account_id`, `item_id`, and `link_session_id` are explicitly called out as useful operational identifiers.

## fireROUTE notes
- Plaid should remain a raw passthrough-capable provider because product-specific request bodies differ substantially.
- A minimal normalized Plaid surface can center on Link token creation, token exchange, account listing, and transaction sync.
- Preserve Plaid’s cursor semantics and `request_id` in responses; both are operationally important.
