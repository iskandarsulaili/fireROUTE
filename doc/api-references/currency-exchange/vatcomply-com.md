# VATComply.com

Official docs manually reviewed:
- https://www.vatcomply.com/api/root/
- https://www.vatcomply.com/api/vat-validation/
- https://www.vatcomply.com/api/exchange-rates/
- https://www.vatcomply.com/api/geolocation/
- https://www.vatcomply.com/api/iban-validation/
- https://www.vatcomply.com/rate-limiting/

## Overview
VATComply exposes a small no-auth REST API that mixes VAT validation, ECB exchange-rate data, geolocation, IBAN validation, and reference metadata.

Confirmed base URL:
- `https://api.vatcomply.com`

Confirmed auth model:
- no authentication required

Confirmed response format:
- JSON for success and error responses

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/` | API root / discovery document | none |
| GET | `/vat` | Validate a VAT number via VIES | `vat_number` |
| GET | `/rates` | Latest or historical ECB exchange rates | optional `base`, optional `symbols`, optional `date` |
| GET | `/geolocate` | Detect visitor country from CDN headers | none |
| GET | `/iban` | Validate an IBAN and return bank/country details | `iban` |
| GET | `/countries` | Country reference data | none confirmed |
| GET | `/currencies` | Currency reference data | none confirmed |

Manual route count confirmed from the reviewed official docs: **7** routes.

## Authentication and rate limits
The reviewed rate-limiting page explicitly states:
- no authentication required
- anonymous requests are limited to `2 requests per second`
- rate limits are applied per IP address

## Common error behavior
The reviewed rate-limiting page documents these status codes:
- `200` success
- `400` bad request
- `404` not found
- `422` validation error
- `429` rate limit exceeded

Reviewed generic error formats:

```json
{
  "error": "Description of what went wrong."
}
```

Validation errors may also return field-specific arrays, for example:

```json
{
  "field_name": ["Error message for this field."]
}
```

## Endpoint details

### `GET /`
The API root returns general information about the service.

Confirmed response fields from the root page:
- `name`
- `version`
- `status`
- `description`
- `documentation`
- `openapi`
- `endpoints`
- `contact`

The current example response also exposes discovery URLs for:
- `/countries`
- `/currencies`
- `/geolocate`
- `/iban`
- `/vat`
- `/rates`

### `GET /vat`
Official request shape:

```text
GET https://api.vatcomply.com/vat?vat_number=BE0123456789
```

Confirmed parameter:
- `vat_number` — required VAT number including the country prefix

Confirmed response fields:
- `valid`
- `vat_number`
- `name`
- `address`
- `country_code`

Important official notes:
- supports EU member states plus Northern Ireland with the `XI` prefix
- UK `GB` VAT numbers are not supported after Brexit; docs explicitly direct users to `XI` for Northern Ireland

### `GET /rates`
Official request shape:

```text
GET https://api.vatcomply.com/rates
```

Confirmed optional parameters:
- `base` — base currency, default `EUR`
- `symbols` — comma-separated list of currencies to return
- `date` — historical date in `YYYY-MM-DD` format

The docs explicitly show all three styles:
- latest rates: `/rates`
- base conversion: `/rates?base=USD`
- symbol filtering: `/rates?symbols=USD,GBP`
- historical rates: `/rates?date=2018-01-01`
- combined parameters in one request

Confirmed response fields:
- `date`
- `base`
- `rates`

Official source note:
- rates come from the European Central Bank

### `GET /geolocate`
This endpoint uses CDN-provided country headers.

Confirmed official behavior:
- no query parameters required
- hosted `api.vatcomply.com` already runs behind a CDN
- self-hosted usage requires Cloudflare or Bunny.net headers

Confirmed response fields include:
- `iso2`
- `iso3`
- `country_code`
- `name`
- `numeric_code`
- `phone_code`
- `capital`
- `currency`
- `tld`
- `region`
- `subregion`
- `latitude`
- `longitude`
- `emoji`
- `ip`

### `GET /iban`
The reviewed IBAN page documents a query-driven validator.

Confirmed request model:
- required query parameter `iban`

Confirmed response fields include:
- `valid`
- `iban`
- `bank_name`
- `bic`
- `country_code`
- `country_name`
- `checksum_digits`
- `bank_code`
- `branch_code`
- `account_number`
- `bban`
- `in_sepa_zone`

### `GET /countries`
The API root example lists `/countries` as a current public endpoint. During this pass the route was confirmed from the provider's own root discovery document, but its dedicated per-field page was not separately inspected.

### `GET /currencies`
The API root example lists `/currencies` as a current public endpoint. During this pass the route was confirmed from the provider's own root discovery document, but its dedicated per-field page was not separately inspected.

## Pagination
No pagination model is documented on the reviewed pages.

## Important usage notes
- VATComply mixes multiple utility domains under one unauthenticated API surface; not every route is strictly currency-exchange related.
- `/rates` is the main currency-exchange route and supports latest, filtered, base-adjusted, and historical lookups through query parameters on the same path.
- Because `/geolocate` depends on CDN headers, behavior differs between the hosted service and self-hosted deployments.
