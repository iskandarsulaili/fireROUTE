# IBANforge

Official docs manually reviewed:
- https://api.ibanforge.com/
- https://ibanforge.com/en/docs
- https://ibanforge.com/en/docs/iban-validate
- https://ibanforge.com/en/docs/iban-batch
- https://ibanforge.com/en/docs/bic-lookup

## Overview
IBANforge provides REST endpoints for IBAN validation, batch validation, and BIC/SWIFT lookup.

Confirmed base URL:
- `https://api.ibanforge.com`

Confirmed transport/format:
- HTTPS only
- JSON request and response bodies for POST endpoints

Confirmed auth/payment models across the reviewed official pages:
- homepage pricing and quickstart advertise bearer-token access for the free/API-key tier
- endpoint docs currently describe x402 micropayment auth using the `X-PAYMENT` header
- homepage quickstart also shows the same validation route working with an `Authorization` bearer-token header

Because the current official site presents both models, fireROUTE should treat auth as **provider-specific and plan-dependent** rather than assuming a single universal header.

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters/body |
|---|---|---|---|
| POST | `/v1/iban/validate` | Validate one IBAN and enrich it with bank/SEPA/risk data | JSON body field `iban` |
| POST | `/v1/iban/batch` | Validate 1 to 100 IBANs in one request | JSON body field `ibans[]` |
| GET | `/v1/bic/{code}` | Look up a BIC/SWIFT code | path parameter `code` |
| GET | `/v1/demo` | Fetch free demo/example validation data | none confirmed |
| GET | `/health` | Service health check | none confirmed |

Manual route count confirmed from the reviewed official docs: **5** routes.

## Authentication and billing
The reviewed official pages show two current usage paths:

### 1) API-key / bearer-token flow
Homepage quickstart example:

```text
POST https://api.ibanforge.com/v1/iban/validate
Content-Type: application/json
```

The homepage quickstart pairs this request with an `Authorization` bearer-token header on the API-key tier.

Homepage pricing notes confirm:
- free tier with `200 requests/month`
- bearer-token auth
- all endpoints included on the API-key tier

### 2) x402 micropayment flow
Endpoint docs for validated/batch/BIC routes describe:

```text
X-PAYMENT: <x402 payment token>
```

Homepage pricing also advertises pay-per-call usage with no signup and no API key.

## Endpoint details

### `POST /v1/iban/validate`
Validated on the docs page as the primary single-IBAN route.

Confirmed headers:
- `Content-Type: application/json`
- `X-PAYMENT` for x402 usage
- homepage quickstart additionally shows an `Authorization` bearer-token header for API-key usage

Confirmed request body:

```json
{
  "iban": "CH93 0076 2011 6238 5295 7"
}
```

Confirmed behavior and response fields:
- input is case-insensitive
- spaces and hyphens are stripped automatically
- response includes `iban`, `valid`, `country`, `check_digits`, `bban`, `bic`, `sepa`, `issuer`, `risk_indicators`, `formatted`, `cost_usdc`, `processing_ms`
- invalid results can include `error` and `error_detail`

### `POST /v1/iban/batch`
Confirmed request body shape:

```json
{
  "ibans": ["CH93...", "DE89...", "GB29..."]
}
```

Confirmed official constraints:
- `ibans` is an array of `1` to `100` items
- each IBAN is processed independently
- one invalid IBAN does not fail the whole batch

Confirmed response shape:
- top-level `results` array
- each result item mirrors the single-validation schema

### `GET /v1/bic/{code}`
Confirmed path parameter:
- `code` = BIC/SWIFT code, 8 or 11 characters, case-insensitive

Confirmed success fields:
- `bic`
- `institution`
- `country`
- `countryCode`
- `city`
- `branch`
- `lei`

Confirmed documented errors:
- `400 invalid_bic_format`
- `404 bic_not_found`

### `GET /v1/demo`
The docs introduction page explicitly presents this as a free testing endpoint returning pre-validated example IBANs.

### `GET /health`
The docs introduction page explicitly links `/health` as the API status/health route.

## Response and domain notes
The reviewed docs explicitly describe these enriched response domains on IBAN validation:
- BIC/SWIFT institution lookup
- SEPA membership and scheme support
- issuer classification such as `bank`, `digital_bank`, `emi`, and `payment_institution`
- risk indicators including country risk and SEPA / VoP signals

## Pricing and rate limits
Reviewed official pricing notes:
- free API-key tier: `200 requests/month`
- x402 path: pay-per-call pricing shown publicly on the homepage
- homepage says x402 has `Unlimited volume`
- docs text does not publish a generic per-second throttle for the bearer-token flow

Reviewed public per-endpoint costs shown on the homepage:
- `POST /v1/iban/validate` — `$0.005`
- `POST /v1/iban/batch` — `$0.002/IBAN`
- `GET /v1/bic/:code` — `$0.003`

## Errors
The endpoint docs show structured JSON errors, for example:

```json
{
  "error": {
    "code": "bic_not_found",
    "message": "No institution found for BIC code XXXXCHZZXXX"
  }
}
```

## Pagination
No pagination model is documented for the confirmed endpoints.

## Important usage notes
- The provider markets IBAN coverage for 75+/80+ countries; exact wording varies slightly across the reviewed pages.
- The batch endpoint is officially positioned as cheaper than individual validation.
- The current public docs surface only the three core business endpoints directly in navigation; the homepage additionally confirms `/v1/demo` and `/health`.
- Because the official site currently mixes bearer-token and x402 examples, production integrations should keep auth configurable per account/payment path.
