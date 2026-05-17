# Grab

## Provider metadata
- Category: `Transportation`
- Provider slug: `grab`
- Official docs used manually:
  - `https://developer.grab.com/docs/`
  - `https://developer.grab.com/docs/partner-farefeed/`
  - `https://developer.grab.com/docs/gfb/`
  - `https://developer.grab.com/docs/gfb/api-environment/`
  - `https://developer.grab.com/docs/gfb/auth-generate-token-for-API/`
  - `https://developer.grab.com/docs/gfb/get-transactions/`
- Base URL used for the confirmed production routes: `https://partner-api.grab.com`
- Additional official environment note:
  - the Partner Farefeed page says testing uses `https://partner-api.stg-myteksi.com`
- Authentication: OAuth 2.0 bearer tokens in the `Authorization` header
- Primary response format: JSON
- Transport scope documented here: ride fare estimation and Grab For Business transaction retrieval

## Important official usage notes
- The main Grab docs landing page groups this provider across product families rather than one single OpenAPI file, so the confirmed routes in this file come from the official Farefeed and Grab For Business pages plus the official Grab For Business auth page.
- The Partner Farefeed page explicitly says the OAuth scope is `ride.estimate`.
- The Grab For Business authentication page documents the scope `gfb.partners.api` for partner transaction access.
- The Grab For Business auth page says access tokens are valid for `1 hour`.
- The Grab For Business API environment page says all requests must use HTTPS and that HTTP requests will fail with a dropped connection.
- The Grab For Business transaction page documents a `GET` route, but its example still sends a JSON body. That inconsistency is present on the official page and should be treated carefully during implementation.

## Rate limits, pagination, and errors
- The Grab For Business overview page publishes a rate limit of `50 requests per minute per partner`.
- The inspected Farefeed page does not publish a numeric quota.
- Pagination is documented only for `GET /gfb/partner/v1/transactions`:
  - clients must start with `page=1`
  - increment the page number when the response contains `hasNextPage: true`
  - stop when `hasNextPage: false`
- Officially documented error behavior:
  - Farefeed: `200`, `400`, `401`, `404`
  - Grab For Business overview: `200`, `400`, `401`, `403`, `404`, `429`, `500`
- The inspected official pages do not publish a structured cross-product JSON error schema.

## Confirmed API surface
The inspected official Grab pages currently expose 3 routes relevant to this provider entry:
1. `POST /grabid/v1/oauth2/token`
2. `POST /farefeed/v1/estimate`
3. `GET /gfb/partner/v1/transactions`

## Common request and response notes
- All confirmed routes use JSON request / response bodies in the official examples.
- OAuth token requests use `application/json` and return `access_token`, `token_type`, and `expires_in`.
- Farefeed responses return a top-level `services` array with ride-service metadata such as `serviceID`, `serviceName`, `eta`, `fare`, `deepLink`, `directDeepLink`, `iconLink`, and `surgeNotice`.
- Grab For Business transaction responses return `page`, `hasNextPage`, and `transactions[]`, with vertical-specific nested objects such as `transport`, `express`, `food`, and `mart`.

## 1) Generate an OAuth token
- Method: `POST`
- Path: `/grabid/v1/oauth2/token`
- Full URL: `https://partner-api.grab.com/grabid/v1/oauth2/token`
- Purpose: obtain the OAuth 2.0 bearer token used by Grab For Business APIs
- Documented request headers:
  - `Cache-Control: no-cache`
  - `Content-Type: application/json`
- Documented request-body fields:
  - `client_id` - required client identifier
  - `client_secret` - required client secret
  - `grant_type` - required; documented value `client_credentials`
  - `scope` - required; official Grab For Business page documents `gfb.partners.api`
- Documented success response:
  - `200 OK`
- Documented response-body fields:
  - `access_token`
  - `token_type`
  - `expires_in`
- Official token-management note: tokens are valid for `1 hour`

## 2) Fetch ride fare estimates
- Method: `POST`
- Path: `/farefeed/v1/estimate`
- Full URL (production): `https://partner-api.grab.com/farefeed/v1/estimate`
- Full URL (staging noted on the official page): `https://partner-api.stg-myteksi.com/farefeed/v1/estimate`
- Purpose: fetch estimated fare and ETA information for available ride services
- Authentication: Bearer token with scope `ride.estimate`
- Documented request headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Documented request-body fields:
  - `pickUp.latitude`
  - `pickUp.longitude`
  - `pickUp.address`
  - `dropOff.latitude`
  - `dropOff.longitude`
  - `dropOff.address`
- Documented response fields:
  - `services[]`
  - `services[].serviceID`
  - `services[].serviceName`
  - `services[].eta`
  - `services[].fare.currency`
  - `services[].fare.maxFare`
  - `services[].fare.minFare`
  - `services[].deepLink`
  - `services[].directDeepLink`
  - `services[].iconLink`
  - `services[].surgeNotice`
- Documented response-header note:
  - `X-Grabkit-Grab-Requestid` is returned and should be referenced when raising issues
- Officially documented errors:
  - `200 OK`
  - `400 Bad Request` when latitude / longitude are missing or invalid
  - `401 Unauthorized` when the bearer token is missing, invalid, or expired
  - `404 Not Found` when Grab does not provide service at the supplied coordinates

## 3) Get Grab For Business transactions
- Method: `GET`
- Path: `/gfb/partner/v1/transactions`
- Full URL: `https://partner-api.grab.com/gfb/partner/v1/transactions`
- Purpose: query transaction records within a specified date range
- Authentication: Bearer token obtained through Grab OAuth with scope `gfb.partners.api`
- Official request notes:
  - the page says this endpoint requires OAuth2 authentication
  - the example also sends `X-GFB-Company-ID: <Company ID>`
- Documented request parameters:
  - `vertical` - required string; possible values `TRANSPORT`, `EXPRESS`, `FOOD`, `MART`
  - `fromDate` - required string in `YYYY-MM-DD`
  - `toDate` - required string in `YYYY-MM-DD`
  - `page` - required integer page number starting at `1`
- Documented pagination behavior:
  - start with `page=1`
  - if `hasNextPage` is `true`, increment `page` by `1`
  - stop when `hasNextPage` is `false`
- Documented response fields:
  - `page`
  - `hasNextPage`
  - `transactions[]`
  - `transactions[].creationTime`
  - `transactions[].completionTime`
  - `transactions[].bookingID`
  - `transactions[].vertical`
  - `transactions[].source`
  - `transactions[].type`
  - `transactions[].userInfo`
  - `transactions[].fare`
  - `transactions[].transport` / `food` / `mart` / `express`
  - `transactions[].expenseCode`
  - `transactions[].expenseDescription`
  - `transactions[].updatedTime`
  - `transactions[].refundTransactions[]`
- Additional documented nested objects:
  - `userInfo` with company / employee / group / trip fields
  - `fare` with amounts, currency, promo, surcharges, payment methods, billing type, fees, insurance, tip, etc.
  - `transport` with taxi type, country, pickup / dropoff location objects, optional intermediate dropoffs, and distance
  - `express`, `food`, and `mart` variants with location / merchant / distance / item details
- Officially documented rate limit for the broader Grab For Business Partner API family: `50 requests per minute per partner`

## Sources inspected
- `https://developer.grab.com/docs/`
- `https://developer.grab.com/docs/partner-farefeed/`
- `https://developer.grab.com/docs/gfb/`
- `https://developer.grab.com/docs/gfb/api-environment/`
- `https://developer.grab.com/docs/gfb/auth-generate-token-for-API/`
- `https://developer.grab.com/docs/gfb/get-transactions/`
