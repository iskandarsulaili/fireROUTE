# Phone Validation

Official docs manually reviewed:
- https://www.abstractapi.com/phone-validation-api
- https://docs.abstractapi.com/phone-validation

## Overview
Abstract’s Phone Validation API is a REST JSON API for validating and enriching a phone number with formatting, country, location, line type, and carrier details. The reviewed public docs expose a single versioned HTTP route with query-string parameters.

- Base URL: `https://phonevalidation.abstractapi.com`
- Current API version in reviewed docs: `v1`
- Canonical route: `GET /v1/`
- Auth model: API key in query string
- Response format: JSON
- Manual route count confirmed from the reviewed official docs: **1**

## Authentication
The reviewed docs state that each Abstract API has its own unique key and that requests are authenticated by appending the API key to the base URL.

Confirmed auth parameter:
- `api_key` — required query parameter

Reviewed auth note:
- keys are product-specific, so a Phone Validation key is distinct from keys for other Abstract APIs

## Confirmed endpoint
| Method | Path | Purpose | Confirmed query parameters |
|---|---|---|---|
| GET | `/v1/` | Validate and enrich a phone number | `api_key` required, `phone` required, `country` optional |

## Endpoint details
### `GET /v1/`
The reviewed docs describe this route as validating a phone number and returning validity plus additional metadata.

Confirmed query parameters:
- `api_key` — required API key
- `phone` — required phone number to validate
- `country` — optional ISO country code; when supplied, Abstract uses it to append the corresponding country code during analysis

Confirmed response fields:
- `phone`
- `valid`
- `format`
- `format.international`
- `format.local`
- `country`
- `country.code`
- `country.name`
- `country.prefix`
- `location`
- `type`
- `carrier`

Confirmed `type` values mentioned by the docs:
- `Landline`
- `Mobile`
- `Satellite`
- `Premium`
- `Paging`
- `Special`
- `Toll_Free`
- `Unknown`

Example request pattern shown in the docs:

```text
GET https://phonevalidation.abstractapi.com/v1/?api_key=YOUR_UNIQUE_API_KEY&phone=14154582468
```

Example success shape shown in the docs:

```json
{
  "phone": "14152007986",
  "valid": true,
  "format": {
    "international": "+14152007986",
    "local": "(415) 200-7986"
  },
  "country": {
    "code": "US",
    "name": "United States",
    "prefix": "+1"
  },
  "location": "California",
  "type": "mobile",
  "carrier": "T-Mobile USA, Inc."
}
```

## Rate limits
The reviewed docs explicitly state that on free plans:
- requests are limited to **1 request per second**
- exceeding this results in HTTP `429 Too many requests`

The reviewed product marketing page advertises plan-level throughput and bulk features, but the API reference page is the source used here for the documented public REST limit.

## Pagination
No pagination is documented for the reviewed public REST route.

The provider surface reviewed here is a single-record validation endpoint.

## Errors
The reviewed docs publish explicit response/error codes:
- `200 OK`
- `400 Bad request`
- `401 Unauthorized` — missing or incorrect API key
- `422 Quota reached` — insufficient API credits on free plans
- `429 Too many requests` — per-second rate limit exceeded
- `500 Internal server error`
- `503 Service unavailable`

The reviewed docs also state that failed requests still return JSON with an error code and description.

## Response format
The reviewed docs state that the API returns a universal lightweight JSON format.

Confirmed response families:
- success payloads with normalized phone metadata
- JSON error payloads on failure

## Important usage notes
- All communications must use TLS 1.2 or greater according to the reviewed docs.
- This provider is versioned; the reviewed public version is `v1`.
- Credits are consumed per request, not only per successful validation. The docs explicitly note that even invalid inputs count as one credit.
- The reviewed docs mention bulk CSV upload best practices as a product capability, but they do **not** publish a separate public REST bulk-upload endpoint on the reviewed page, so the manually confirmed route count remains one.

## fireROUTE notes
- Treat this provider as a single-route query API.
- Keep the raw upstream response fields (`format`, `country`, `location`, `type`, `carrier`) because they already form a clean normalized schema.
- Expose `country` as a passthrough hint rather than making it mandatory; the official docs define it as optional.
