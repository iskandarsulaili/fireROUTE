# UPS

## Provider metadata
- Category: `Tracking`
- Provider slug: `ups`
- Official docs used manually:
  - `https://www.ups.com/upsdeveloperkit`
  - `https://developer.ups.com/`
  - `https://developer.ups.com/api/reference?loc=en_US&tag=Tracking`
  - `https://developer.ups.com/api/documentation?partnerCode=00&api=&locale=en_US&tag=Tracking`
  - `https://raw.githubusercontent.com/UPS-API/api-documentation/refs/heads/main_mainSpec/mainspec1.yaml`
  - `https://raw.githubusercontent.com/UPS-API/api-documentation/refs/heads/main/Tracking.yaml`
  - `https://raw.githubusercontent.com/UPS-API/api-documentation/refs/heads/main/OAuthClientCredentials.yaml`
  - `https://developer.ups.com/api/reference/tracking/product-info`

## Overview
UPS’s legacy developer-kit URL is no longer the correct route reference. In this manual pass it redirected into the current UPS Developer Portal flow and the current tracking reference was confirmed from the live developer portal plus UPS’s official GitHub-hosted OpenAPI documents.

Confirmed current tracking API environments:
- Customer Integration Environment: `https://wwwcie.ups.com/api`
- Production: `https://onlinetools.ups.com/api`

Confirmed current OAuth token endpoints for client-credentials auth:
- CIE: `https://wwwcie.ups.com/security/v1/oauth/token`
- Production: `https://onlinetools.ups.com/security/v1/oauth/token`

Primary response format: JSON

Manually confirmed tracking routes in this pass: `3`

## Authentication
UPS’s current tracking APIs use OAuth bearer tokens.

From the official UPS OAuth Client Credentials spec:
- token route: `POST /security/v1/oauth/token`
- auth scheme on the token route: HTTP Basic
  - username = Client ID
  - password = Client Secret
- required form field: `grant_type=client_credentials`
- optional header: `x-merchant-id` = 6-digit UPS account number
- success response fields include:
  - `token_type`
  - `issued_at`
  - `client_id`
  - `access_token`
  - `scope`
  - `expires_in`
  - `refresh_count`
  - `status`

From the Tracking spec:
- tracking operations use OAuth bearer auth after token creation
- every reviewed tracking operation requires these request headers:
  - `transId` - unique request identifier
  - `transactionSrc` - calling client/source identifier

## Confirmed API surface
| Method | Path | Purpose | Key parameters / official notes |
|---|---|---|---|
| `GET` | `/track/v1/details/{inquiryNumber}` | track one shipment/inquiry number | path `inquiryNumber`; optional `locale`, `returnSignature`, `returnMilestones`, `returnPOD`; requires `transId` and `transactionSrc` headers |
| `GET` | `/track/v1/reference/details/{referenceNumber}` | track by reference number | path `referenceNumber`; optional `locale`, pickup-date range, destination filters, shipper number, `refNumType`; requires `transId` and `transactionSrc` headers |
| `GET` | `/track/v1/shipment/details/{inquiryNumber}` | list packages inside a shipment | path `inquiryNumber`; optional `locale`, `offset`, `count`; requires `transId` and `transactionSrc` headers |

## Route details

### 1) GET /track/v1/details/{inquiryNumber}
Full URL pattern:
- CIE: `https://wwwcie.ups.com/api/track/v1/details/{inquiryNumber}`
- Production: `https://onlinetools.ups.com/api/track/v1/details/{inquiryNumber}`

Required path/header inputs:
- `inquiryNumber` - tracking number, 7 to 34 characters according to the spec
- `transId`
- `transactionSrc`

Optional query parameters:
- `locale` - default `en_US`
- `returnSignature` - default `false`; returns signature image bytecodes when available
- `returnMilestones` - default `false`
- `returnPOD` - proof-of-delivery flag

Official response codes:
- `200` tracking information found
- `400` invalid request
- `403` blocked merchant
- `404` tracking information not found
- `500` internal server error
- `503` resource unavailable

### 2) GET /track/v1/reference/details/{referenceNumber}
Full URL pattern:
- CIE: `https://wwwcie.ups.com/api/track/v1/reference/details/{referenceNumber}`
- Production: `https://onlinetools.ups.com/api/track/v1/reference/details/{referenceNumber}`

Required path/header inputs:
- `referenceNumber`
- `transId`
- `transactionSrc`

Optional query parameters:
- `locale` - default `en_US`
- `fromPickUpDate` - docs describe the search start date; default shown as `currentDate-14`
- `toPickUpDate` - docs describe the search end date; default shown as `currentDate`
- `destCountry`
- `destZip`
- `shipperNum` - UPS account number
- `refNumType` - documented default text says valid values are `SmallPackage` and `fgv`

Official response codes:
- `200`, `400`, `403`, `404`, `500`, `503`

### 3) GET /track/v1/shipment/details/{inquiryNumber}
Full URL pattern:
- CIE: `https://wwwcie.ups.com/api/track/v1/shipment/details/{inquiryNumber}`
- Production: `https://onlinetools.ups.com/api/track/v1/shipment/details/{inquiryNumber}`

Required path/header inputs:
- `inquiryNumber`
- `transId`
- `transactionSrc`

Optional query parameters:
- `locale` - default `en_US`
- `offset` - 0-based starting record index
- `count` - maximum packages to return from the offset; default `50`

Pagination notes:
- this is the only reviewed tracking route that explicitly documents pagination behavior
- `offset` is 0-based
- `count` controls page size

Official response codes:
- `200`, `400`, `403`, `404`, `500`, `503`

## Product behavior and usage notes
From UPS’s official tracking spec and product overview:
- the Track API supports Small Package 1Z, InfoNotice, Mail Innovations, FGV, and UPS Freight shipment lookups
- tracking responses can include current shipment status, activity history, delivery details, package details, destination UPS Access Point information, and expected delivery dates/times
- UPS says tracking data is rolled off after a `120` day retention period
- the product overview highlights detailed tracking history, proof of delivery, and signature visibility as primary business capabilities

## Rate limits
The reviewed tracking spec did not publish a numeric per-minute or per-day rate limit for the three tracking routes.

What was explicitly documented:
- the OAuth Client Credentials route documents `429` as `Quota Limit Exceeded`
- the tracking routes themselves document the response codes above, but no numeric public quota was stated on the reviewed route pages/specs

## Error model
Tracking routes return JSON and reference these schema families:
- success: `TrackApiResponse`
- errors: `Response`

OAuth token route error responses use `tokenErrorResponse`, whose nested fields include:
- `response.errors[].code`
- `response.errors[].message`

## Format notes
- UPS’s current public contract is OpenAPI-based.
- The developer portal points the public tracking reference to UPS’s official GitHub raw YAML.
- Tracking operations are JSON APIs over HTTPS.

## Important integration notes
- The legacy `upsdeveloperkit` page should not be treated as the canonical current route reference.
- fireROUTE integrations should model OAuth token acquisition separately from the tracking calls themselves.
- `shipment/details` is the only reviewed route with explicit pagination knobs.
- Signature/POD retrieval on `details/{inquiryNumber}` is optional and controlled by query flags.
