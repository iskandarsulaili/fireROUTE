# YNAB

Official docs manually reviewed:
- https://api.ynab.com/
- https://api.ynab.com/v1

## Overview
YNAB’s current official API is a JSON-over-HTTPS API centered on `plans` and related resources. The public docs site also retains important auth, error, delta-request, and rate-limit guidance.

- Primary base URL: `https://api.ynab.com/v1`
- Legacy base URL still mentioned by the docs: `https://api.youneedabudget.com/v1`
- Transport: HTTPS + JSON
- Auth: Bearer access token
- Access token sources: personal access token or OAuth application flow
- Manual route count confirmed from the current official OpenAPI page: **44** HTTP API routes under `/v1`

## Authentication
The docs say **all API resources require a valid access token**.

### Personal access tokens
The documentation describes personal access tokens as the easiest option for developers accessing their own YNAB account.

### OAuth applications
The docs also document OAuth for third-party apps.

Confirmed official OAuth URLs from the docs:
- Authorization endpoint: `https://app.ynab.com/oauth/authorize`
- Token endpoint: `https://app.ynab.com/oauth/token`

Confirmed OAuth query/body patterns shown by the docs:
- `client_id`
- `redirect_uri`
- `response_type=token` or `response_type=code`
- optional `scope=read-only`
- PKCE example uses `code_challenge` and `code_challenge_method=S256`

Confirmed token usage header:
```http
Authorization: Bearer <ACCESS_TOKEN>
```

## Confirmed API routes
### User
- `GET /user`

### Plans
- `GET /plans`
- `GET /plans/{plan_id}`
- `GET /plans/{plan_id}/settings`

### Accounts
- `GET /plans/{plan_id}/accounts`
- `POST /plans/{plan_id}/accounts`
- `GET /plans/{plan_id}/accounts/{account_id}`

### Categories and category groups
- `GET /plans/{plan_id}/categories`
- `POST /plans/{plan_id}/categories`
- `GET /plans/{plan_id}/categories/{category_id}`
- `PATCH /plans/{plan_id}/categories/{category_id}`
- `GET /plans/{plan_id}/months/{month}/categories/{category_id}`
- `PATCH /plans/{plan_id}/months/{month}/categories/{category_id}`
- `POST /plans/{plan_id}/category_groups`
- `PATCH /plans/{plan_id}/category_groups/{category_group_id}`

### Payees and payee locations
- `GET /plans/{plan_id}/payees`
- `POST /plans/{plan_id}/payees`
- `GET /plans/{plan_id}/payees/{payee_id}`
- `PATCH /plans/{plan_id}/payees/{payee_id}`
- `GET /plans/{plan_id}/payee_locations`
- `GET /plans/{plan_id}/payee_locations/{payee_location_id}`
- `GET /plans/{plan_id}/payees/{payee_id}/payee_locations`

### Months
- `GET /plans/{plan_id}/months`
- `GET /plans/{plan_id}/months/{month}`

### Money movements
- `GET /plans/{plan_id}/money_movements`
- `GET /plans/{plan_id}/months/{month}/money_movements`
- `GET /plans/{plan_id}/money_movement_groups`
- `GET /plans/{plan_id}/months/{month}/money_movement_groups`

### Transactions
- `GET /plans/{plan_id}/transactions`
- `POST /plans/{plan_id}/transactions`
- `PATCH /plans/{plan_id}/transactions`
- `POST /plans/{plan_id}/transactions/import`
- `GET /plans/{plan_id}/transactions/{transaction_id}`
- `PUT /plans/{plan_id}/transactions/{transaction_id}`
- `DELETE /plans/{plan_id}/transactions/{transaction_id}`
- `GET /plans/{plan_id}/accounts/{account_id}/transactions`
- `GET /plans/{plan_id}/categories/{category_id}/transactions`
- `GET /plans/{plan_id}/payees/{payee_id}/transactions`
- `GET /plans/{plan_id}/months/{month}/transactions`

### Scheduled transactions
- `GET /plans/{plan_id}/scheduled_transactions`
- `POST /plans/{plan_id}/scheduled_transactions`
- `GET /plans/{plan_id}/scheduled_transactions/{scheduled_transaction_id}`
- `PUT /plans/{plan_id}/scheduled_transactions/{scheduled_transaction_id}`
- `DELETE /plans/{plan_id}/scheduled_transactions/{scheduled_transaction_id}`

## Key parameters and request-body notes
### Common path parameters
The reviewed OpenAPI page confirms these path parameters across the route surface:
- `plan_id`
- `account_id`
- `category_id`
- `category_group_id`
- `payee_id`
- `payee_location_id`
- `month`
- `transaction_id`
- `scheduled_transaction_id`

Important `plan_id` note explicitly documented:
- `plan_id` may be a real UUID
- `plan_id="last-used"` is supported
- `plan_id="default"` is supported when default-plan selection is enabled

### Confirmed query parameters
- `GET /plans` supports `include_accounts` (boolean)
- `GET /plans/{plan_id}` supports `last_knowledge_of_server` (integer, int64) for delta-style responses

The docs’ narrative page also states that some endpoints support **Delta Requests** and recommends using them to reduce load and make client processing more efficient.

### Confirmed transaction body fields
From the official `POST /plans/{plan_id}/transactions` and `PATCH /plans/{plan_id}/transactions` pages, reviewed body fields include:
- `id`
- `import_id`
- `account_id`
- `date`
- `amount`
- `payee_id`
- `payee_name`
- `category_id`
- `memo`
- `cleared`
- `approved`
- `flag_color`
- `subtransactions`

Important transaction constraints explicitly documented:
- transaction `amount` is in **milliunits**
- `date` uses ISO date format, e.g. `2016-12-01`
- future-dated transactions cannot be created on the regular transactions create endpoint
- split transactions can use `category_id: null` plus `subtransactions`
- `PATCH /plans/{plan_id}/transactions` updates by `id` or `import_id`
- the multi-update route returns HTTP `209`

### Example response wrappers
The current OpenAPI examples show YNAB’s API using a top-level `data` wrapper on success, for example:
- `data.user`
- `data.plans`
- `data.plan`
- `data.transaction`
- `data.transaction_ids`

## Response format and data conventions
The docs say the API is REST based and uses JSON.

Confirmed response conventions from the docs and examples:
- success payloads are wrapped in `data`
- entity ids are UUID-like strings
- dates are ISO strings
- transaction amounts are milliunits
- list endpoints return structured arrays inside `data`

## Errors
The narrative docs publish a centralized error table and show that errors are indicated both by HTTP status code and by a JSON error body.

Confirmed documented statuses and names:
- `400 / bad_request`
- `401 / not_authorized`
- `403.1 / subscription_lapsed`
- `403.2 / trial_expired`
- `403.3 / unauthorized_scope`
- `403.4 / data_limit_reached`
- `404.1 / not_found`
- `404.2 / resource_not_found`
- `409 / conflict`
- `429 / too_many_requests`
- `500 / internal_server_error`
- `503 / service_unavailable`

The docs’ 429 example uses this error shape:
```json
{
  "error": {
    "id": "429",
    "name": "too_many_requests",
    "detail": "Too many requests"
  }
}
```

Important service-availability note from the docs:
- `503` can also represent request timeout when a request processes a large amount of data for more than 30 seconds

## Rate limits
The official docs explicitly state:
- an access token may be used for up to **200 requests per hour**
- the limit is enforced in a **rolling one-hour window**
- exceeding the limit returns `429 Too Many Requests`

## Important usage notes
- The docs say the canonical current hostname is `api.ynab.com`; the older `api.youneedabudget.com` host remains mentioned only as a legacy compatibility base URL.
- The full-plan route `GET /plans/{plan_id}` is described as effectively a full plan export.
- Use `last_knowledge_of_server` / delta-request support where available to reduce payload sizes.
- OAuth apps must comply with YNAB’s API Terms of Service and OAuth requirements.
- Bearer tokens are the only auth model documented for API calls; OAuth is only how apps obtain tokens.

## fireROUTE notes
- YNAB is broad enough that raw passthrough should remain available.
- The best normalized subset is likely user, plan listing, plan export, accounts, categories, payees, transactions, and scheduled transactions.
- Preserve milliunit semantics, `data` wrappers, and YNAB’s named error structure; all three are important for adapter correctness.