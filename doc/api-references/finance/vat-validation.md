# VAT Validation

Official docs manually reviewed:
- https://www.abstractapi.com/api/vat-validation-rates-api
- https://docs.abstractapi.com/api/vat-validation
- https://docs.abstractapi.com/api/vat-validation/validate
- https://docs.abstractapi.com/api/vat-validation/calculate
- https://docs.abstractapi.com/api/vat-validation/categories

## Overview
Abstract API's VAT Validation and Rates product exposes three documented REST endpoints: VAT-number validation, VAT calculation, and VAT-category/rate lookup.

- Base URL family: `https://vat.abstractapi.com/v1`
- Response format: JSON
- Auth: API key in query parameter `api_key`
- Transport: TLS 1.2+ required according to the official docs

## Authentication
The official docs state that every request requires a product-specific API key appended to the request URL as `api_key`. Abstract also notes that API keys are unique per API product.

## Confirmed endpoints

| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/v1/validate` | Validate a VAT number and return company details when valid | `api_key`, `vat_number` |
| GET | `/v1/calculate` | Calculate VAT-inclusive/exclusive values for an amount and country | `api_key`, `amount`, `country_code`, optional `is_vat_incl`, `vat_category` |
| GET | `/v1/categories` | Return standard/reduced VAT categories and rates for a country | `api_key`, `country_code` |

Manual route count confirmed from the reviewed docs: **3**.

## Endpoint details

### 1) Validate VAT number
Confirmed request pattern:

```text
GET https://vat.abstractapi.com/v1/validate?api_key=YOUR_UNIQUE_API_KEY&vat_number=SE556656688001
```

Confirmed request parameters:
- `api_key` — required API key
- `vat_number` — required VAT number to validate

Confirmed response fields from the docs/sample:
- `vat_number`
- `valid`
- `company.name`
- `company.address`
- `country.code`
- `country.name`

### 2) Calculate VAT
Confirmed request pattern:

```text
GET https://vat.abstractapi.com/v1/calculate?api_key=YOUR_UNIQUE_API_KEY&amount=175&country_code=DE
```

Confirmed request parameters:
- `api_key` — required API key
- `amount` — required amount to calculate from
- `country_code` — required ISO 3166-1 alpha-2 country code
- `is_vat_incl` — optional boolean; when `true`, reverse-calculates VAT from an amount that already includes VAT
- `vat_category` — optional category used to apply reduced rates where supported

Confirmed response fields from the docs/sample:
- `amount_excluding_vat` / docs prose also refers to `amount_excl_vat`
- `amount_including_vat` / docs prose also refers to `amount_incl_vat`
- `vat_amount`
- `vat_category`
- `vat_rate`
- `country.code`
- `country.name`

### 3) VAT categories
Confirmed request pattern:

```text
GET https://vat.abstractapi.com/v1/categories?api_key=YOUR_UNIQUE_API_KEY&country_code=DE
```

Confirmed request parameters:
- `api_key` — required API key
- `country_code` — required ISO 3166-1 alpha-2 country code

Confirmed response fields from the docs/sample:
- `country_code`
- `rate`
- `category`
- `description`

The reviewed docs describe this endpoint as returning both the standard rate and reduced-rate categories for the requested country.

## Supported countries
The official VAT docs list supported country codes including:
`AT`, `BE`, `BG`, `CY`, `CZ`, `DE`, `DK`, `EE`, `EL`, `ES`, `FI`, `FR`, `HR`, `HU`, `IR`, `IT`, `LT`, `LU`, `LV`, `MT`, `NL`, `PL`, `PT`, `RO`, `SE`, `SI`, `SK`, and `XI`.

## Rate limits
The reviewed docs explicitly state:
- free plans are limited to **1 request per second**
- `422` is used when free-plan credits are exhausted
- `429` is returned when the requests-per-second limit is exceeded

## Pagination
No pagination is documented for any of the three endpoints.

## Errors
The official docs list these status codes:
- `200` — success
- `400` — bad request
- `401` — unauthorized / missing or incorrect API key
- `422` — quota reached / insufficient API credits
- `429` — too many requests
- `500` — internal server error
- `503` — service unavailable

The docs say errors are also returned in JSON format, but the reviewed pages do not publish a more detailed error-object schema.

## Important usage notes
- Abstract versions this API at `v1`.
- All requests must use HTTPS with TLS 1.2 or greater.
- `calculate` supports reverse calculations via `is_vat_incl=true`.
- `categories` is the route to consult before applying reduced-rate `vat_category` values programmatically.

## fireROUTE notes
- This provider is broader than a simple validator: it spans identity validation (`validate`) and finance/rates workflows (`calculate`, `categories`).
- Preserve the provider's country and category payloads rather than flattening them too aggressively; reduced-rate reasoning is domain-specific.
