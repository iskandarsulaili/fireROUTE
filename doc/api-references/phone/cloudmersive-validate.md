# Cloudmersive Validate

Official docs manually reviewed:
- https://cloudmersive.com/phone-number-validation-API
- https://api.cloudmersive.com/docs/validate.asp
- https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/validate/phonenumber/basic

## Overview
Cloudmersive exposes phone-number validation as part of its broader Data Validation API.

Confirmed from the reviewed official pages:
- API endpoint root: `https://api.cloudmersive.com`
- API version shown on the reference page: `v1`
- Product page positions the API as global phone-number validation and normalization
- Auth model: API key in request header named `Apikey`

## Authentication
The official reference page lists a single API-key scheme:

| Field | Value |
|---|---|
| Type | `apiKey` |
| Name | `Apikey` |
| In | `header` |

Example shape from the reviewed docs:

```http
Apikey: YOUR_API_KEY
Content-Type: application/json
```

## Confirmed endpoint
The reviewed official reference exposes this phone-specific operation:

| Method | Path | Purpose |
|---|---|---|
| POST | `/validate/phonenumber/basic` | Validate a phone number by analyzing its syntax and normalizing it into standard formats |

Manual route count confirmed from the official docs reviewed in the browser: **1**.

## Endpoint details

### `POST /validate/phonenumber/basic`
Official description on the reference page: "Validate a phone number by analyzing the syntax"

Confirmed request body schema name:
- `PhoneNumberValidateRequest`

Confirmed request content types:
- `application/json`
- `text/json`

Confirmed request body fields:
- `PhoneNumber` — string containing the phone number to validate
- `DefaultCountryCode` — fallback country code to use when the number is not self-identifying

The official example guidance specifically suggests trying a number such as `1.800.463.3339` and either leaving `DefaultCountryCode` blank or using `US`.

Confirmed response schema name:
- `PhoneNumberValidationResponse`

Confirmed success response content types:
- `application/json`
- `text/json`
- `application/xml`
- `text/xml`

Confirmed response fields from the official example schema:
- `IsValid`
- `Successful`
- `PhoneNumberType`
- `E164Format`
- `InternationalFormat`
- `NationalFormat`
- `CountryCode`
- `CountryName`

The product page’s live example also visibly shows these kinds of normalized outputs:
- phone valid flag
- phone type
- E.164 format
- international format
- national format
- country code
- country name

## Rate limits
The reviewed official product page advertises:
- `600 free API calls/month, with no expiration`

The reviewed reference pages did not publish a more detailed per-minute or per-second rate-limit table for this specific operation.

## Pagination
Not applicable. This endpoint validates one request payload at a time and no pagination scheme is documented.

## Errors
The reviewed product/reference pages did not expose a phone-specific status-code table on the phone operation itself in the browser excerpts reviewed.

The broader Cloudmersive reference is schema-driven and operation-based, so fireROUTE should expect normal HTTP error handling around API-key validation, malformed JSON, and request validation failures even though a phone-specific error example was not surfaced on the reviewed page.

## Response format
Confirmed from the official docs:
- request body: JSON
- response formats: JSON or XML
- response contains both validation status and normalized phone-number representations

## Important usage notes
- Cloudmersive groups phone validation under a much larger Data Validation API product rather than a standalone phone-only API reference.
- The product page and the reference page are consistent about the core capability: syntax validation plus normalization/standardization.
- The official docs reviewed only exposed one phone-validation route; additional phone-related operations were not visible in the reviewed reference.

## fireROUTE notes
- Map this provider as a single-operation phone-validation adapter.
- Preserve the provider’s response fields for normalized formats instead of collapsing them too aggressively.
- Send the API key in the `Apikey` header exactly as documented.
