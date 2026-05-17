# Nordigen

Official docs manually reviewed:
- https://nordigen.com/en/account_information_documenation/integration/quickstart_guide/ (original index URL; host no longer resolves)
- https://developer.gocardless.com/bank-account-data/overview/
- https://developer.gocardless.com/bank-account-data/quick-start-guide/
- https://developer.gocardless.com/bank-account-data/endpoints/

## Overview
The original Nordigen Bank Account Data product is now documented on GoCardless’s developer site. The reviewed official GoCardless pages confirm the current Bank Account Data API host, token flow, and endpoint set.

Confirmed from the reviewed official docs:
- Current base host: `https://bankaccountdata.gocardless.com`
- Current API base path: `/api/v2`
- Current documentation owner/brand: GoCardless Bank Account Data
- Primary response format: JSON
- Authentication model: obtain tokens from user secrets, then call API endpoints with `Authorization: Bearer ACCESS_TOKEN`

## Authentication
The reviewed quickstart and overview pages document a two-step token model.

### 1) Create refresh token
Confirmed endpoint:
- `POST /api/v2/token/new/`

Confirmed JSON body fields:
- `secret_id`
- `secret_key`

Confirmed example response fields:
- `refresh`
- `refresh_expires`

The quickstart example shows `refresh_expires: 2592000`.

### 2) Exchange refresh token for access token
Confirmed endpoint:
- `POST /api/v2/token/refresh/`

Confirmed JSON body field:
- `refresh`

Confirmed example response fields:
- `access`
- `access_expires`

The quickstart example shows `access_expires: 86400`.

### 3) Call API routes
Confirmed auth header:
- `Authorization: Bearer ACCESS_TOKEN`

## Confirmed endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v2/accounts/{id}/` | Retrieve one account resource |
| GET | `/api/v2/accounts/{id}/balances/` | Retrieve balances for one account |
| GET | `/api/v2/accounts/{id}/details/` | Retrieve account details |
| GET | `/api/v2/accounts/{id}/transactions/` | Retrieve booked and pending transactions |
| GET | `/api/v2/agreements/enduser/` | List end-user agreements |
| POST | `/api/v2/agreements/enduser/` | Create an end-user agreement |
| GET | `/api/v2/agreements/enduser/{id}/` | Retrieve one end-user agreement |
| DELETE | `/api/v2/agreements/enduser/{id}/` | Delete an end-user agreement |
| PUT | `/api/v2/agreements/enduser/{id}/accept/` | Mark/record agreement acceptance |
| GET | `/api/v2/agreements/enduser/{id}/reconfirm/` | Retrieve reconfirmation info |
| POST | `/api/v2/agreements/enduser/{id}/reconfirm/` | Reconfirm an agreement |
| GET | `/api/v2/institutions/` | List institutions/banks |
| GET | `/api/v2/institutions/{id}/` | Retrieve one institution |
| GET | `/api/v2/requisitions/` | List requisitions |
| POST | `/api/v2/requisitions/` | Create a requisition/link flow |
| GET | `/api/v2/requisitions/{id}/` | Retrieve a requisition and linked accounts |
| DELETE | `/api/v2/requisitions/{id}/` | Delete a requisition |
| POST | `/api/v2/token/new/` | Create refresh token from secrets |
| POST | `/api/v2/token/refresh/` | Refresh access token |

Manual route count confirmed from the official GoCardless endpoint page: **19** concrete routes.

## Endpoint details

### Institution discovery
The quickstart explicitly documents institution selection.

Confirmed query parameter on `GET /api/v2/institutions/`:
- `country` — two-letter ISO 3166 country code

Confirmed example:
- `GET https://bankaccountdata.gocardless.com/api/v2/institutions/?country=gb`

Confirmed example institution fields:
- `id`
- `name`
- `bic`
- `transaction_total_days`
- `countries`
- `logo`
- `max_access_valid_for_days`
- `max_access_valid_for_days_reconfirmation`

### Agreement creation
The quickstart documents `POST /api/v2/agreements/enduser/`.

Confirmed required body field:
- `institution_id`

Confirmed optional body fields:
- `max_historical_days`
- `access_valid_for_days`
- `access_scope`

Confirmed example response fields:
- `id`
- `created`
- `max_historical_days`
- `access_valid_for_days`
- `access_scope`
- `accepted`
- `institution_id`

### Requisition creation
The quickstart documents `POST /api/v2/requisitions/` as the link-building step.

Confirmed required body fields:
- `redirect`
- `institution_id`

Confirmed optional body fields:
- `reference`
- `agreement`
- `user_language`

The docs say `user_language` uses a two-letter code and defaults to the browser language if omitted.

Confirmed example response fields:
- `id`
- `created`
- `redirect`
- `status`
- `institution_id`
- `agreement`
- `reference`
- `accounts`
- `user_language`
- `link`

### Requisition lookup / account listing
The quickstart uses `GET /api/v2/requisitions/{id}/` to retrieve linked accounts after the user completes the bank flow.

Confirmed example response fields:
- `id`
- `status`
- `agreements`
- `accounts`
- `reference`

### Account access
The reviewed endpoint page confirms four account routes:
- `GET /api/v2/accounts/{id}/`
- `GET /api/v2/accounts/{id}/details/`
- `GET /api/v2/accounts/{id}/balances/`
- `GET /api/v2/accounts/{id}/transactions/`

Confirmed common path parameter:
- `{id}` — account identifier returned by the requisition flow

Confirmed transaction response structure from the quickstart:
- top-level `transactions`
- `booked` array
- `pending` array

Confirmed example transaction fields:
- `transactionId`
- `debtorName`
- `debtorAccount.iban`
- `transactionAmount.currency`
- `transactionAmount.amount`
- `bookingDate`
- `valueDate`
- `remittanceInformationUnstructured`
- `bankTransactionCode`

## Rate limits
The reviewed overview page publishes explicit qualitative rate-limit guidance.

Confirmed notes:
- banks may impose their own limits
- limits can be as low as **4 API calls per day for every account**
- `details`, `balances`, and `transactions` each have their own limit
- exceeding the limit returns an error

Confirmed rate-limit headers listed on the official overview page:
- `HTTP_X_RATELIMIT_LIMIT`
- `HTTP_X_RATELIMIT_REMAINING`
- `HTTP_X_RATELIMIT_RESET`
- `HTTP_X_RATELIMIT_ACCOUNT_SUCCESS_LIMIT`
- `HTTP_X_RATELIMIT_ACCOUNT_SUCCESS_REMAINING`
- `HTTP_X_RATELIMIT_ACCOUNT_SUCCESS_RESET`

## Pagination
No cursor/page contract was described on the reviewed overview, quickstart, or endpoints pages.

The reviewed examples for list-style routes return arrays/objects directly. If pagination exists for specific operations, it was not documented on the pages manually reviewed in this pass.

## Errors
The reviewed pages confirm these error-handling facts:
- all endpoints require an authorization token
- exceeding bank/API rate limits returns an error
- the docs navigation references a dedicated “Statuses and Error code” page

However, the reviewed pages used in this pass did **not** expose a consolidated error-body schema or a compact endpoint-by-endpoint status table that could be manually confirmed without relying on hidden/generated content.

For fireROUTE integration, preserve:
- upstream HTTP status codes
- provider JSON error payloads when returned
- requisition/agreement status fields such as `status`

## Response format
The overview page explicitly says:
- all responses are shown in JSON format

Confirmed example response families:
- token objects (`refresh`, `access`, expiries)
- institution arrays
- agreement objects
- requisition objects with `accounts` and `link`
- account transaction objects with `booked` and `pending`

## Important usage notes
- The original Nordigen host from the index no longer resolves; the live official documentation is now on GoCardless.
- The product supports up to **24 months** of transaction history and up to **90 days** of continuous account access according to the reviewed overview page.
- Default agreement terms are applied if you do not create a custom end-user agreement.
- Requisitions are the central link-building object used to send an end user to their bank and later recover account IDs.
- You must query balances/details/transactions per account ID; the requisition response only gives you the linked account identifiers.

## fireROUTE notes
- Treat Nordigen as a GoCardless-hosted PSD2 account-information API.
- Preserve the two-step token exchange exactly as documented (`token/new` then `token/refresh`).
- Model requisitions, institutions, agreements, and accounts as separate provider resource families.
- Preserve bank-specific rate-limit headers and do not assume a single global quota.
