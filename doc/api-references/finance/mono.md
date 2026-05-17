# Mono

Official pages manually reviewed:
- https://mono.co/
- https://docs.mono.co/api
- https://docs.mono.co/api/customer/create-a-customer
- https://docs.mono.co/api/customer/retrieve-a-customer
- https://docs.mono.co/api/customer/list-all-customers
- https://docs.mono.co/api/customer/get-all-customer-transactions
- https://docs.mono.co/api/customer/fetch-all-linked-accounts
- https://docs.mono.co/api/customer/update-a-customer
- https://docs.mono.co/api/customer/delete-a-customer
- https://docs.mono.co/api/lookup/bank-listing-nip

## Overview
Mono’s current official docs expose a multi-product API spanning customer management, account linking, payments, lookup, and identity verification workflows.

What was manually confirmed from the official site and current API reference:
- primary API host patterns on the reviewed pages use `https://api.withmono.com`
- current route pages visibly use both `/v2/...` and `/v3/...` families
- secret-key auth is passed in a custom request header named `mono-sec-key`
- the public API reference homepage links to customer, connect, payments, lookup, prove, and misc product groups

Manual route count confirmed from concrete endpoint pages opened in this pass: **9**.

## Authentication
The reviewed endpoint pages consistently show the same secret-key header:

```http
mono-sec-key: YOUR_SECRET_KEY
accept: application/json
```

POST/PATCH pages also show JSON request bodies with:

```http
content-type: application/json
```

The public docs page includes a “Get API keys” entrypoint, confirming that developer-issued keys are part of the intended auth flow.

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters/body fields |
|---|---|---|---|
| POST | `/v2/customers` | Create an individual customer | body includes `identity.type`, `identity.number`, `email`, `type`, `last_name`, `first_name`, `address`, `phone` |
| GET | `/v2/customers/{id}` | Retrieve a single customer | path param `id` |
| GET | `/v2/customers` | List all customers | query params section present on official page; exact parameter names not expanded during this pass |
| GET | `/v2/customers/{id}/transactions` | Get customer payment transactions | path param `id`; example query params `period`, `page`, `account` |
| GET | `/v2/accounts` | Fetch all linked accounts | query params section present on official page |
| PATCH | `/v2/customers/{id}` | Update a customer | path param `id`; body shows `identity`, `address`, `phone`, `type`, `first_name`, `last_name`, `business_name` |
| DELETE | `/v2/customers/{id}` | Delete a customer | path param `id` |
| GET | `/v3/lookup/banks` | List banks supported under NIBSS/NIP | no query parameters shown on reviewed page |
| POST | `/v2/customers` | Create a business customer via the same customer collection family | official API homepage links a dedicated “Business Customer” POST page in the customer section |

## Additional product families confirmed from the official API homepage
The API reference homepage also links official route pages for these product areas, confirming that the provider currently documents them:
- Bank Data (`/api/bank-data/...` docs section)
- One-time payments (`/api/directpay/initiate` docs section)
- Recurring payments (`/api/direct-debit/mandate/initiate-mandate-authorisation` docs section)
- Money operations (`/api/money-operations/payout` docs section)
- Disburse (`/api/disburse/create-source-account` docs section)
- BVN lookup (`/api/bvn/initiate` docs section)
- CAC lookup (`/api/cac/business` docs section)
- Watchlist screening (`/api/watchlist/submit-screening` docs section)
- identity lookup routes such as address, passport, TIN, NIN, driver’s license, account-number lookup, credit history, and mashup
- Prove (`/api/prove/initiate` docs section)
- Misc bank coverage (`/api/miscellaneous/bank-coverage` docs section)

I did not open every one of those pages in this pass, so only the concrete routes listed in the table above are counted as manually confirmed endpoint paths here.

## Pagination and query parameters
The reviewed docs explicitly show or imply:
- customer transaction retrieval supports `period`, `page`, and `account`
- list-style endpoints expose query-parameter sections on the official docs pages

Because some parameter accordions were not expanded during this pass, only the visible query names above are recorded as confirmed.

## Response format and errors
The reviewed Mono pages consistently present:
- JSON requests and responses
- example response tabs per endpoint
- endpoint-specific error examples such as:
  - `400 - Customer already exists` on individual-customer creation
  - `400 - Invalid Customer Id` on retrieve/delete flows
  - `404` on customer-transactions retrieval

## Rate limits
No public numeric rate-limit table was visible on the reviewed Mono pages during this pass.

## Important usage notes
- Mono currently documents mixed-version routes: customer workflows on reviewed pages use `/v2/...`, while at least one lookup page uses `/v3/lookup/banks`.
- Preserve the provider’s custom auth header name exactly: `mono-sec-key`.
- The API reference homepage is broad; route coverage extends well beyond customer CRUD into bank data, payments, identity lookup, prove, and miscellaneous operational APIs.
- The public docs pages are well-suited to future expansion if fireROUTE later needs more than the currently confirmed customer and bank-listing routes.

## fireROUTE notes
- Mono is a strong fit for finance + identity hybrid adapters because the same official reference spans customer management, account linking, payments, and government-ID/lookup workflows.
- Keep versioning explicit in adapters because Mono’s public docs currently mix `/v2` and `/v3` route families.
- Preserve raw passthrough support for Mono-specific lookup/prove flows that do not map cleanly onto generic finance abstractions.
