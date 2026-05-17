# Bank Data API

Official docs manually reviewed:
- https://apilayer.com/marketplace/bank_data-api
- https://marketplace.apilayer.com/bank_data-api
- Official APILayer code widgets embedded in the marketplace docs for each reviewed endpoint

## Overview
APILayer’s Bank Data API is a REST API for IBAN, SWIFT/BIC, German BLZ, US routing, and bank-directory lookup workflows. The reviewed marketplace documentation exposes an HTTPS JSON API with an `apikey` header and eleven documented GET routes.

- Base URL: `https://api.apilayer.com/bank_data`
- Transport: HTTPS + JSON responses
- Auth: API key in custom `apikey` request header
- Manual route count confirmed from the reviewed official marketplace docs and embedded code widgets: **11**

## Authentication
The reviewed marketplace docs explicitly state:
- all requests must be made over HTTPS
- all requests must include a custom HTTP header named `apikey`
- unauthenticated requests fail

Confirmed auth pattern:

```http
apikey: YOUR_API_KEY
```

The docs also warn not to expose secret API keys in public repositories or client-side code.

## Confirmed endpoints
| Method | Path | Purpose | Confirmed query parameters |
|---|---|---|---|
| GET | `/all` | Get all major banks’ SWIFT and IBAN codes, optionally filtered by country | `country`, `page`, `per_page` |
| GET | `/all_us` | List US banks with optional filtering | `state_code`, `search_term`, `per_page`, `page`, `main_bank_id` |
| GET | `/banks_by_country` | List banks for a specific country code | `country_code` |
| GET | `/check_blz_code` | Validate or look up a German BLZ bank code | `blz_code` |
| GET | `/iban_fields` | Return country-specific IBAN field information | `country` |
| GET | `/iban_generate` | Generate an IBAN candidate from country, bank code, and account number | `country`, `bank_code`, `account_number` |
| GET | `/iban_structure` | Return IBAN structure details for a country | `country` |
| GET | `/iban_validate` | Validate an IBAN number | `iban_number` |
| GET | `/swift_check` | Validate or look up a SWIFT/BIC code | `swift_code` |
| GET | `/us_banks_by_state` | List US banks for a state | `state_code` |
| GET | `/us_routing` | Validate or look up a US routing number | `us_routing` |

## Endpoint details
### `GET /all`
The reviewed docs describe this route as:
- “Get all major banks SWIFT and IBAN codes”

Confirmed query parameters:
- `country` — optional country name or code
- `page` — optional page offset
- `per_page` — optional items per page

The reviewed docs explicitly note:
- if `country` is omitted, banks from all countries except the US are shown
- if `country` is supplied, results are filtered to that country

### `GET /all_us`
The reviewed code widget confirms these query parameters:
- `state_code`
- `search_term`
- `per_page`
- `page`
- `main_bank_id`

The reviewed docs present this as the US-specific bank directory counterpart to the broader `/all` listing.

### `GET /banks_by_country`
Confirmed query parameter:
- `country_code`

Use this route for country-specific bank listing when you already know the ISO-like country selector the provider expects.

### `GET /check_blz_code`
Confirmed query parameter:
- `blz_code`

The reviewed marketplace page’s visible response example for this provider shows a JSON payload shaped like:

```json
{
  "bank_data": {
    "bic": "HYVEDEMM488",
    "city": "BERLIN",
    "name": "UNICREDIT BANK AG (HYPOVEREINSBANK)",
    "zip": "10896"
  },
  "blz_code": "10020890",
  "valid": true
}
```

This confirms a representative response pattern of:
- lookup metadata in `bank_data`
- echo of the submitted code
- boolean-style validity flag

### `GET /iban_fields`
Confirmed query parameter:
- `country`

This route is for discovering the country-specific IBAN field layout required before constructing or validating account identifiers.

### `GET /iban_generate`
Confirmed query parameters:
- `country`
- `bank_code`
- `account_number`

The reviewed widget presents this as an IBAN-generation helper rather than a POST body workflow; inputs are query-string encoded in official examples.

### `GET /iban_structure`
Confirmed query parameter:
- `country`

Use this route when you need the structural rules for a country’s IBAN format rather than validating one specific value.

### `GET /iban_validate`
Confirmed query parameter:
- `iban_number`

The reviewed docs expose this as the direct IBAN validation route.

### `GET /swift_check`
Confirmed query parameter:
- `swift_code`

This route is the SWIFT/BIC validation and lookup operation.

### `GET /us_banks_by_state`
Confirmed query parameter:
- `state_code`

This route is the state-filtered US bank listing endpoint.

### `GET /us_routing`
Confirmed query parameter:
- `us_routing`

This route validates or looks up a US routing number.

## Pagination
The reviewed docs expose explicit pagination controls on list-style routes.

Confirmed pagination parameters:
- `/all`: `page`, `per_page`
- `/all_us`: `page`, `per_page`

The marketplace documentation does not publish a universal pagination envelope schema on the reviewed page, so preserve raw response metadata if discovered at runtime.

## Rate limits
The reviewed APILayer documentation does not publish one fixed provider-wide numeric limit because quotas depend on subscription plan.

What the reviewed docs do explicitly confirm:
- each subscription has daily and monthly limits based on the chosen plan
- exceeding quota returns HTTP `429 Too many requests`
- reminder emails are sent when usage reaches 80% and 90%
- rate-limit information is available in response headers:
  - `x-ratelimit-limit-month`
  - `x-ratelimit-remaining-month`
  - `x-ratelimit-limit-day`
  - `x-ratelimit-remaining-day`

Confirmed `429` example body from the docs:

```json
{
  "message": "You have exceeded your daily/monthly API rate limit. Please review and upgrade your subscription plan at https://apilayer.com/subscriptions to continue."
}
```

## Errors
The reviewed docs publish standard HTTP error guidance and explicitly document these statuses:
- `400 Bad Request` — missing or unacceptable parameter(s)
- `401 Unauthorized` — no valid API key provided
- `404 Not Found` — requested resource does not exist
- `429 Too many requests` — rate limit exceeded
- `5xx Server Error` — provider-side failure

The reviewed docs say that non-200 responses are JSON and contain a `message` field explaining the problem.

## Response format
The reviewed docs explicitly state:
- responses are JSON-encoded
- the API uses standard HTTP response codes and verbs

Observed response characteristics from the reviewed marketplace page:
- validation routes return object-shaped JSON
- lookup/list routes use query-string filters
- response schema varies by endpoint (directory listing vs. validator vs. structure helper)

## Important usage notes
- Although the generic APILayer boilerplate says the API “accepts form-encoded request bodies,” the reviewed Bank Data operations are all documented as `GET` routes with query parameters.
- The official marketplace docs rely heavily on embedded code widgets; those widgets were manually reviewed to confirm exact route paths and parameter names.
- Country inputs are not fully normalized across endpoints: some routes use `country`, others use `country_code`, and `/all` accepts a country name or code.
- US and non-US bank directory operations are split across different routes (`/all`, `/all_us`, `/us_banks_by_state`, `/us_routing`).

## fireROUTE notes
- This provider is a good fit for normalized finance/identity helpers around IBAN validation, SWIFT validation, bank lookup, and routing lookup.
- Preserve upstream parameter names exactly because the provider distinguishes similar concepts (`country` vs `country_code`, `blz_code`, `us_routing`, `main_bank_id`).
- Keep a raw passthrough option for less-common helper routes like `/iban_fields` and `/iban_structure`.
