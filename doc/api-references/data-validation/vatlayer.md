# VATlayer

Official docs manually reviewed:
- https://vatlayer.com/documentation
- https://docs.apilayer.com/vatlayer/docs/api-documentation?utm_source=VATlayerHomePage&utm_medium=Referral
- https://docs.apilayer.com/vatlayer/docs/vatlayer-api-v-1-0-0

## Overview
VATlayer is a JSON REST API for EU VAT-number validation, VAT-rate lookup, all-country rate retrieval, VAT-inclusive/exclusive price calculation, and reduced-rate type discovery.

Confirmed from the reviewed official docs:
- Base URL: `https://apilayer.net/api`
- All documented operations reviewed here use `GET`
- Authentication: `access_key` query parameter
- Optional response helpers: `callback` for JSONP and `format=1` for pretty-printed JSON

## Authentication
The reviewed docs consistently require an API access key as the `access_key` query parameter.

Confirmed canonical request pattern:

```text
https://apilayer.net/api/<endpoint>?access_key=YOUR_ACCESS_KEY
```

Confirmed common optional query parameters across the reviewed routes:
- `callback` — JSONP wrapper function name
- `format` — pretty-print toggle (`0` or `1`)

## Confirmed endpoints
The reviewed official API reference exposes these routes.

| Method | Path | Purpose |
|---|---|---|
| GET | `/validate` | Validate a VAT number and retrieve associated company information when available |
| GET | `/rate` | Retrieve VAT rates for one country, by country code or IP-based country detection |
| GET | `/rate_list` | Retrieve VAT rates for all EU member states |
| GET | `/price` | Calculate VAT-compliant prices using standard or reduced rates |
| GET | `/types` | Retrieve the list of reduced VAT type identifiers |

Manual route count confirmed from the official docs: **5**.

## Endpoint details

### `GET /validate`
Confirmed required query parameters:
- `access_key`
- `vat_number`

Confirmed optional query parameters:
- `callback`
- `format`

Confirmed response fields include:
- `valid`
- `database`
- `format_valid`
- `query`
- `country_code`
- `vat_number`
- `company_name`
- `company_address`

### `GET /rate`
Confirmed required query parameters:
- `access_key`

Confirmed optional selector parameters:
- `country_code` — 2-letter country code
- `ip_address` — IPv4 address for geo-based lookup
- `use_client_ip` — `0`/`1`
- `callback`
- `format`

The docs explicitly say to use only one of:
- `country_code`
- `ip_address`
- `use_client_ip`

Confirmed response fields include:
- `success`
- `country_code`
- `country_name`
- `standard_rate`
- `reduced_rates`

The reviewed docs also expose provider-specific error statuses `310` and `311` on this route in addition to standard HTTP-style errors.

### `GET /rate_list`
Confirmed required query parameter:
- `access_key`

Confirmed optional query parameters:
- `callback`
- `format`

Confirmed response fields include:
- `success`
- `rates` — mapping of country codes to rate-info objects

### `GET /price`
Confirmed required query parameters:
- `access_key`
- `amount`

Confirmed optional query parameters:
- `country_code`
- `ip_address`
- `use_client_ip`
- `incl` — whether the input amount already includes VAT
- `type` — reduced-rate type identifier such as `medical`
- `callback`
- `format`

Confirmed response fields include:
- `success`
- `country_code`
- `country_name`
- `price_excl_vat`
- `price_incl_vat`
- `vat_rate`

### `GET /types`
Confirmed required query parameter:
- `access_key`

Confirmed optional query parameters:
- `callback`
- `format`

Confirmed response fields include:
- `success`
- `types` — array of reduced VAT type identifiers

## Response format
Confirmed from the reviewed docs:
- responses are JSON by default
- JSONP is available through the `callback` query parameter
- pretty-printed JSON is available with `format=1`

The docs explicitly describe VATlayer as a JSON-based REST API and the reviewed operation pages all show `application/json` response bodies.

## Errors
Confirmed from the reviewed docs:
- common operation pages publish standard error tabs including `400`, `401`, `429`, and `500`
- `404` is also shown on the `validate` route page
- the `rate` route additionally shows provider-specific `310` and `311` error statuses

The reviewed docs did not expose a single unified prose error table on one page, so adapter logic should preserve raw provider responses where possible.

## Rate limits
The reviewed official pages did **not** publish a numeric rate-limit table in the operation pages I reviewed.

What is explicitly confirmed:
- `429` is a documented response status on the reviewed route pages

## Pagination
Not applicable. The documented VATlayer operations return single calculations/lookups or a single all-countries map, not paginated collections.

## Important usage notes
- Route selection is query-driven; the API uses several GET endpoints rather than one generic function parameter.
- `/rate` and `/price` both allow country selection via explicit `country_code`, a supplied `ip_address`, or `use_client_ip=1`.
- `/price` supports reduced-rate calculations through the `type` parameter and reverse calculations through `incl=1`.
- `/types` is the companion discovery route for valid reduced-rate category names.
- The docs still present the legacy APILayer host `apilayer.net/api` as the operational API base URL.

## fireROUTE notes
- Preserve VATlayer as a multi-purpose VAT workflow provider, not just a VAT-number validator.
- Expose `/types` alongside `/price`; the two are operationally linked.
- `country_code`, `ip_address`, and `use_client_ip` are mutually exclusive selectors on relevant routes and should be validated accordingly.
- Because the provider supports JSONP, avoid assumptions that every consumer is server-side, but prefer plain JSON for fireROUTE integrations.
