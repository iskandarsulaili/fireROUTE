# Tax Data API

Official docs manually reviewed:
- https://marketplace.apilayer.com/tax_data-api
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/validate
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/price
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/rate_list
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/tax_rates
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/types
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/us_rate_list
- https://marketplace.apilayer.com/code/widget?api_id=232&method=get&endpoint=/canada_rate_list

## Overview
APILayer’s Tax Data API provides tax-rate lookup and VAT/tax validation endpoints for international, US, and Canada-focused workflows.

Confirmed from the reviewed official docs:
- Base URL: `https://api.apilayer.com/tax_data`
- Protocol: HTTPS only
- Authentication: custom request header `apikey: <your key>`
- Request style described by the docs: REST with predictable resource-oriented URLs
- Response format: JSON

## Authentication
The reviewed docs explicitly require an API key in a custom HTTP header named `apikey`.

Confirmed example from the official code widgets:

```bash
curl "https://api.apilayer.com/tax_data/validate?vat_number={vat_number}&country_code={country_code}" \
  -H "apikey: {API-KEY}"
```

The reviewed main reference page also explicitly states:
- API keys are managed from the APILayer account area
- unauthenticated requests fail
- plain HTTP requests fail

## Confirmed endpoints
The reviewed official marketplace reference exposes these routes.

| Method | Path |
|---|---|
| GET | `/canada_rate_list` |
| GET | `/price` |
| GET | `/rate_list` |
| GET | `/tax_rates` |
| GET | `/types` |
| GET | `/us_rate_list` |
| GET | `/validate` |

Manual route count confirmed from the official docs: **7**.

## Important parameters and request notes
Confirmed from the reviewed docs and official code widgets:
- `GET /canada_rate_list` — no parameters documented
- `GET /price` supports `amount`
- `GET /rate_list` supports `per_page`
- `GET /tax_rates` supports:
  - `zip`
  - `use_client_ip`
  - `street`
  - `state`
  - `ip_address`
  - `country`
  - `city`
- `GET /types` — no parameters documented
- `GET /us_rate_list` supports `state`
- `GET /validate` supports:
  - `vat_number`
  - `country_code`

The main product page’s visible response examples also confirm the API returns structured tax-rate objects for:
- Canada province/state lookups
- international VAT rate lookups
- US locality/state/county rate lookups

## Pagination
The reviewed docs do **not** publish a universal pagination contract.

What is explicitly visible:
- `GET /rate_list` exposes a `per_page` query parameter

Because no page cursor or standard response-pagination schema was published on the reviewed reference page, fireROUTE should treat pagination as limited/endpoint-specific rather than as a guaranteed global contract.

## Errors
The reviewed docs publish these HTTP error codes:
- `400` — bad request; commonly missing required parameters
- `401` — unauthorized; no valid API key provided
- `404` — requested resource does not exist
- `429` — too many requests
- `5xx` — server-side APILayer failure

The docs also explicitly state:
- non-`200` responses indicate failure
- error responses are JSON
- the response body includes a `message` field describing the error

Confirmed `429` example from the reviewed docs:

```json
{
  "message": "You have exceeded your daily/monthly API rate limit. Please review and upgrade your subscription plan at https://apilayer.com/subscriptions to continue."
}
```

## Rate limits
The reviewed official docs do publish rate-limit behavior, but not one fixed numeric quota for all users.

Confirmed details:
- rate limits are plan-dependent
- both daily and monthly limits are enforced
- exceeded limits return `429 Too Many Requests`
- warning emails are sent at `80%` and `90%` usage

Confirmed rate-limit headers:
- `x-ratelimit-limit-month`
- `x-ratelimit-remaining-month`
- `x-ratelimit-limit-day`
- `x-ratelimit-remaining-day`

## Response format
Confirmed from the reviewed docs:
- responses are JSON
- success payloads vary by endpoint and are tax-data specific
- error payloads use a `message` field

Visible official example-response fields include:
- international rate responses with `country_code`, `country_name`, `eu`, `standard_rate`, and `other_rates`
- US rate responses with `city`, `county`, `state`, `zip`, `state_rate`, `county_rate`, `city_rate`, and `combined_rate`
- Canada responses with `country`, `state`, `combined_rate`, `gst`, `hst`, `pst`, and `type`

## Important usage notes
- APILayer hosts the API under the shared `api.apilayer.com` domain, but this provider’s resource prefix is specifically `/tax_data`.
- Authentication uses a custom `apikey` header rather than bearer auth.
- The official reviewed surface is entirely `GET`-based.
- The API spans three different styles of tax data: VAT validation, generic rate lists/types, and country-specific US/Canada lookup helpers.

## fireROUTE notes
- Preserve the `tax_data` resource prefix exactly when building routes.
- Treat `/validate` as the main VAT-validation route, with the other endpoints as rate/tax-reference helpers.
- Do not reuse the erroneous `404_watch` routes from older generated output; the current official marketplace docs clearly expose the seven routes above.
