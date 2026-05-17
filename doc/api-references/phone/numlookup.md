# Numlookup

Official docs manually reviewed:
- https://numlookupapi.com/
- https://numlookupapi.com/documentation
- https://numlookupapi.com/documentation/authentication
- https://numlookupapi.com/documentation/rate-limit-and-quotas
- https://numlookupapi.com/documentation/request-status-codes
- https://numlookupapi.com/documentation/status-endpoint
- https://numlookupapi.com/documentation/phone-number-validation-endpoint

## Overview
numlookupapi.com is a JSON REST API for validating phone numbers and retrieving carrier/location data.

From the reviewed homepage and docs:
- Base URL: `https://api.numlookupapi.com`
- Version documented: `v1`
- Auth: API key
- Response format: JSON
- Coverage claim shown on the homepage/footer: phone data for `230+` countries

## Authentication
The official authentication guide documents two supported auth methods:

### Recommended: HTTP header
```http
apikey: YOUR-API-KEY
```

Example from the reviewed docs:

```bash
curl "https://api.numlookupapi.com/v1/status" \
  -H "apikey: YOUR-API-KEY"
```

### Alternative: query parameter
The docs also allow API keys as a GET query parameter:

```text
apikey=YOUR-API-KEY
```

Example from the reviewed docs:

```bash
curl "https://api.numlookupapi.com/v1/status?apikey=YOUR-API-KEY"
```

The docs explicitly recommend header auth because query-string auth may expose keys in logs.

## Confirmed endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/status` | Return account/quota status without consuming quota |
| GET | `/v1/validate/{phone_number}` | Validate a phone number and return carrier/location metadata |

Manual route count confirmed from the reviewed official docs: **2**.

## Endpoint details

### `GET /v1/status`
Official description: returns information about the current quota.

Important official note:
- Requests to this endpoint **do not count** against quota or rate limit.

Confirmed response fields from the reviewed example:
- `account_id`
- `quotas.month.total`
- `quotas.month.used`
- `quotas.month.remaining`
- `quotas.grace.total`
- `quotas.grace.used`
- `quotas.grace.remaining`

Reviewed example request:

```bash
curl -G https://api.numlookupapi.com/v1/status \
    -H "apikey: YOUR-API-KEY"
```

Reviewed example response:

```json
{
  "account_id": 313373133731337,
  "quotas": {
    "month": {
      "total": 300,
      "used": 72,
      "remaining": 229
    },
    "grace": {
      "total": 0,
      "used": 0,
      "remaining": 0
    }
  }
}
```

### `GET /v1/validate/{phone_number}`
Official description: validate a phone number and retrieve carrier and location information.

Confirmed path parameter:
- `phone_number` — required string path parameter; docs say it may include the country prefix, or you can omit the prefix and provide `country_code`

Confirmed optional parameter:
- `country_code` — optional ISO alpha-2 country code for localizing/qualifying the input number

Confirmed response fields from the reviewed example:
- `valid`
- `number`
- `local_format`
- `international_format`
- `country_prefix`
- `country_code`
- `country_name`
- `location`
- `carrier`
- `line_type`

Confirmed `line_type` values explicitly listed by the docs:
- `landline`
- `mobile`
- `satellite`
- `paging`
- `special_services`
- `premium_rate`
- `toll_free`
- `N/A`

Reviewed example request:

```bash
curl -G https://api.numlookupapi.com/v1/validate/+14158586273 \
    -H "apikey: YOUR-API-KEY"
```

Reviewed example response:

```json
{
  "valid": true,
  "number": "14158586273",
  "local_format": "4158586273",
  "international_format": "+14158586273",
  "country_prefix": "+1",
  "country_code": "US",
  "country_name": "United States of America",
  "location": "Novato",
  "carrier": "AT&T Mobility LLC",
  "line_type": "mobile"
}
```

## Rate limits and quotas
The official rate-limit guide states:
- request volume is plan-based and measured monthly
- some plans also have a minute-level rate limit
- exceeding either returns HTTP `429`
- only **successful** calls count against quota/rate limit
- validation errors and provider-side errors do **not** count

Confirmed response headers:
- `X-RateLimit-Limit-Quota-Minute`
- `X-RateLimit-Limit-Quota-Month`
- `X-RateLimit-Remaining-Quota-Minute`
- `X-RateLimit-Remaining-Quota-Month`

The reviewed homepage also advertises a free tier of **100 free requests / month**.

## Pagination
No pagination is documented for either confirmed endpoint.

## Errors
The official request-status page documents these statuses:
- `200` — success
- `403` — endpoint not allowed on current plan
- `404` — endpoint does not exist
- `422` — validation error
- `429` — rate limit or monthly limit exceeded
- `500` — internal server error

Confirmed validation error example from the docs:
- `Invalid country_code` — “The selected country_code is invalid … should be an ISO Alpha 2 … code”

## Response format
The reviewed docs and examples consistently show:
- JSON responses
- simple GET request model
- API key auth via header or query string

## Important usage notes
- Prefer header auth over `apikey=` query auth to avoid leaking credentials into logs.
- Use `/v1/status` for health/quota checks because it does not consume quota.
- When the input number omits a country prefix, pass `country_code` explicitly.
- `line_type` is provider-specific and should be preserved as-is in fireROUTE responses.

## fireROUTE notes
- Canonicalize Numlookup as a lightweight phone-validation provider with one quota/status route and one lookup route.
- Default adapter mapping should target `GET /v1/validate/{phone_number}`.
- Preserve raw response fields like `carrier`, `location`, and `line_type` because they are the main value of the API.
