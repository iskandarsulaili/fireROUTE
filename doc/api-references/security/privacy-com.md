# Privacy.com

## Provider metadata
- Category: `Security`
- Provider slug: `privacy-com`
- Docs used manually:
  - `https://privacy.com/developer/docs`
  - `https://developers.privacy.com/docs/getting-started`
  - `https://developers.privacy.com/docs/api-basics`
  - `https://developers.privacy.com/reference/get_cards-1`
  - `https://developers.privacy.com/reference/post_cards-1`
  - `https://developers.privacy.com/reference/get_cards-card-token-1`
  - `https://developers.privacy.com/reference/patch_cards-card-token-1`
  - `https://developers.privacy.com/reference/post_cards-card-token-share`
  - `https://developers.privacy.com/reference/get_funding-sources-1`
  - `https://developers.privacy.com/reference/get_transactions-1`
  - `https://developers.privacy.com/reference/get_status-1`
- Confirmed API base URL: `https://api.privacy.com/v1`
- Authentication model: API key in the `Authorization` header
- Primary response format: JSON
- Manually confirmed routes in this pass: `8`

## Authentication
From the official API Basics page:
- An API key is required.
- Requests use an `Authorization` header in the form `Authorization: YOUR_API_KEY`.
- The API Basics example also sends `Accept: application/json`.
- Write operations require an Issuing API key; the `401` table explicitly says write access requires an Issuing API key.

## Response format and schema notes
From the official API Basics page:
- HTTP request bodies must be valid JSON.
- `Content-Type` must be `application/json` when sending a body.
- Amounts are integers in the smallest unit of the currency.
- Dates are ISO 8601 unless otherwise specified.
- The docs warn that additional fields may be added to response payloads at any time.
- GET responses are wrapped in a pagination envelope of the form:
  - `data`
  - `page`
  - `total_entries`
  - `total_pages`

## Pagination
From the reviewed list endpoints:
- List endpoints use page-number pagination.
- `page` defaults to `1`.
- `page_size` defaults to `50`.
- `page_size` is documented as `1` to `100` on list endpoints reviewed in this pass.

## Errors and rate limits
From the official API Basics page and route response tables:
- `400` - invalid query parameter / request parameter mismatch
- `401` - invalid, missing, inactive, or malformed API key; also used for insufficient privileges / missing Issuing API key
- `404` - specified resource was not found
- `409` - conflict with current target-resource state (explicitly documented on card sharing)
- `422` - unprocessable entity; the API Basics page includes simulation-related authorization failure under this status
- `429` - too many requests; documented causes include too many requests per second, daily limit reached, and too many different API keys from one IP
- `500` - internal server error

## Common parameters confirmed in reviewed pages
- `card_token` - UUID path parameter for card-specific routes
- `begin` - ISO 8601 lower-bound timestamp filter
- `end` - ISO 8601 upper-bound timestamp filter
- `page` - page number for list pagination
- `page_size` - page size for list pagination
- `funding_token` - funding source UUID when creating a card
- `memo` - friendly card label
- `spend_limit` - integer amount in cents
- `spend_limit_duration` - enum such as `ANNUALLY`, `FOREVER`, `MONTHLY`, `TRANSACTION`
- `state` - card state enum
- `type` - card type enum
- `account_token` - optional funding-source filter
- `result` - transaction result filter with `APPROVED` and `DECLINED`
- `recipient_email` - target email for secure card sharing
- `theme` - card-sharing theme enum with `DEFAULT`, `PRIVACY`, `CONFETTI`

## Confirmed routes with exact paths
1. `GET /cards` - list cards
   - query params confirmed: `begin`, `end`, `page`, `page_size`
2. `POST /cards` - create a new virtual card
   - body params confirmed: `exp_month`, `exp_year`, `funding_token`, `memo`, `spend_limit`, `spend_limit_duration`, `state`, `type`
3. `GET /cards/{card_token}` - get card configuration
   - path param confirmed: `card_token`
4. `PATCH /cards/{card_token}` - update card properties
   - path param confirmed: `card_token`
   - body params confirmed: `memo`, `spend_limit`, `spend_limit_duration`, `state`
5. `POST /cards/{card_token}/share` - share a card securely by email
   - path param confirmed: `card_token`
   - body params confirmed: `recipient_email`, `theme`
6. `GET /funding_sources` - list funding sources associated with the account
   - query param confirmed: `account_token`
7. `GET /transactions` - list transactions
   - query params confirmed: `card_token`, `result`, `begin`, `end`, `page`, `page_size`
8. `GET /status` - API reachability / status check

## Important usage notes
- The getting-started page says users are responsible for all financial activity associated with their API key.
- The getting-started page also says end-user identity must pass Privacy's Customer Identification Program before they can transact.
- Closing a card is final; the update-card page says setting a card to `CLOSED` cannot be undone.
- Creating `UNLOCKED` cards requires additional privileges.
- Sharing card details by email requires a subscription, and the shared link expires after a set period.

## Verification notes
This file was manually rebuilt from the current official Privacy developer guides and route reference pages. The current ReadMe-hosted reference clearly exposes eight routable HTTP endpoints under `https://api.privacy.com/v1`.