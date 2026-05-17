# Uber

## Provider metadata
- Category: `Transportation`
- Provider slug: `uber`
- Official docs used manually:
  - `https://developer.uber.com/products`
  - `https://developer.uber.com/docs/riders/introduction`
  - `https://developer.uber.com/docs/riders/references/api`
  - `https://developer.uber.com/docs/riders/guides/authentication/introduction`
  - `https://developer.uber.com/docs/riders/guides/rate-limiting`
  - route reference pages inspected during review, including:
    - `https://developer.uber.com/docs/riders/references/api/v2/authorize-get`
    - `https://developer.uber.com/docs/riders/references/api/v2/token-post`
    - `https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get`
    - `https://developer.uber.com/docs/riders/references/api/v1.2/requests-post`
- Current production base URL from the Riders API reference: `https://api.uber.com/v1.2`
- Current sandbox base URL from the Riders API reference: `https://sandbox-api.uber.com/v1.2`
- Current auth / OAuth reference family in the docs: `v2` routes such as `/authorize` and `/token`
- Primary response format: JSON
- Request format note from the API reference:
  - the Riders API says it `speaks exclusively in JSON`
  - the docs say clients should set `Content-Type: application/json`
- CORS note from the official Riders API reference:
  - Uber says the API supports CORS for approved domains
  - callers must whitelist an `Origin URI` in the application's security settings

## Important official usage notes
- The `Products` page lists three developer products, but the most detailed publicly reachable transportation reference in this review was the `Riders API` documentation.
- The Riders introduction says `Access to this API endpoint requires approval from Uber` and directs developers to an Uber Business Development representative or point of contact.
- The Riders API reference says the current API version is `v1.2` and that production requests use `https://api.uber.com/<version>`.
- The same reference says sandbox requests use `https://sandbox-api.uber.com/<version>`.
- Uber says server tokens are being phased out: no new server tokens are issued, but existing tokens continue to work until developers migrate to scope-based access tokens.
- The docs separate auth by endpoint type:
  - server token or bearer token for product / estimate style endpoints that do not require rider context
  - OAuth 2.0 user access token for rider-context endpoints
  - request-creation and ride-management flows require the `request` scope, and `POST /requests` is explicitly marked as a privileged-scope endpoint for broad production use
- The official sidebar still links a few legacy `v1` reference pages, but the main Riders API reference declares `v1.2` as current. I therefore counted the current `v1.2` route set plus the `v2` auth routes and did not count the duplicated legacy `v1` pages separately.

## Rate limits, pagination, and errors
The official `Rate Limiting` guide publishes these defaults:

| Type | Entity level | Default limit |
|---|---|---:|
| All requests burst limit | App | `500 requests per 5 seconds` |
| Server token | App | `2000 requests per hour` |
| OAuth bearer token | User | `2000 requests per hour` |

Additional official notes:
- The docs say there can also be endpoint-specific rate limits.
- `429` responses return JSON like `{"message":"Exceeded rate limit","code":"rate_limited"}`.
- The API reference overview says paginated endpoints use `limit` and `offset` query parameters following a PostgreSQL-style pattern.
- The overview specifically calls out Rider History as a paginated endpoint family.
- The API reference overview publishes these general HTTP status codes: `200`, `201`, `302`, `400`, `401`, `403`, `404`, `406`, `409`, `422`, `429`, `500`, and `503`.
- The general error-body shape is JSON with keys including `message`, `code`, and optional `fields`.

## Confirmed API surface
The currently published Riders API reference exposes these `19` current routes:

### Authentication (`v2`)
1. `GET /authorize`
2. `POST /token`

### Riders (`v1.2`)
3. `GET /me`
4. `PATCH /me`
5. `GET /payment-methods`
6. `GET /history`
7. `GET /places/{place_id}`
8. `PUT /places/{place_id}`

### Ride Products (`v1.2`)
9. `GET /products`
10. `GET /products/{product_id}`

### Ride Estimates (`v1.2`)
11. `GET /estimates/price`
12. `GET /estimates/time`

### Ride Requests (`v1.2`)
13. `POST /requests/estimate`
14. `POST /requests`
15. `GET /requests/{request_id}`
16. `DELETE /requests/{request_id}`
17. `PATCH /requests/{request_id}`
18. `GET /requests/{request_id}/map`
19. `GET /requests/{request_id}/receipts`

## Authentication and authorization details
- The Riders auth guide describes three auth mechanisms:
  - `server token` for endpoints that do not require Uber user context
  - `user access token` via OAuth 2.0 for endpoints that do require rider context
  - mobile `SSO` through the Uber SDKs for iOS / Android
- The auth guide says server-token access is limited to:
  - `GET /products`
  - `GET /products/{product_id}`
  - `GET /estimates/price`
  - `GET /estimates/time`
- The auth guide says user access tokens are required for:
  - `GET /me`
  - `PATCH /me`
  - `GET /history`
  - `GET /places/{place_id}`
  - `PUT /places/{place_id}`
  - `POST /requests/estimate`
  - `POST /requests`
  - `GET /requests/{request_id}`
  - `DELETE /requests/{request_id}`
  - `PATCH /requests/{request_id}`
  - `GET /requests/{request_id}/map`
  - `GET /requests/{request_id}/receipts`
- The auth reference family is versioned separately (`v2`).
- The OAuth docs and examples show token exchange through the token endpoint and standard bearer-token use in the `Authorization` header.

## Route-family parameter and behavior notes

### 1) Auth routes
- `GET /authorize`
  - purpose: send the rider through Uber's OAuth authorization flow
  - family notes: part of the `v2` auth flow documented separately from the main `v1.2` API
- `POST /token`
  - purpose: exchange OAuth grant data for tokens
  - family notes: the public auth examples use standard OAuth 2 token exchange semantics

### 2) Rider profile and account routes
- `GET /me`
  - purpose: retrieve user profile information for the authenticated rider
  - auth: OAuth 2.0 user access token
- `PATCH /me`
  - purpose: apply a user promotion
  - auth: OAuth 2.0 user access token
- `GET /payment-methods`
  - purpose: list available rider payment methods
  - auth: OAuth 2.0 user access token
- `GET /history`
  - purpose: retrieve rider trip history
  - auth: OAuth 2.0 user access token
  - pagination: the overview says paginated routes use `limit` and `offset`, and Rider History is the main example called out
- `GET /places/{place_id}` / `PUT /places/{place_id}`
  - purpose: retrieve or update a saved place
  - path parameter: `place_id`
  - auth: OAuth 2.0 user access token

### 3) Product and estimate routes
- `GET /products`
  - purpose: list products at a given location
  - auth: server token or OAuth bearer token
  - typical parameters: latitude / longitude context for the queried location
- `GET /products/{product_id}`
  - purpose: retrieve details for one product
  - path parameter: `product_id`
  - auth: server token or OAuth bearer token
- `GET /estimates/price`
  - purpose: return estimated price ranges for products between a start and end location
  - auth: server token or OAuth 2.0 user access token with any valid scope
  - documented query parameters:
    - `start_latitude`
    - `start_longitude`
    - `end_latitude`
    - `end_longitude`
    - optional `seat_count` for `uberPOOL`
  - documented response fields include `product_id`, `currency_code`, `display_name`, `localized_display_name`, `estimate`, `minimum`, `low_estimate`, `high_estimate`, `surge_multiplier`, `duration`, and `distance`
  - documented error example: `422 validation_failed` when required coordinates are missing
  - important usage note: the page warns that this endpoint does not reflect real-time availability and says to use Time Estimates for live availability / ETA
- `GET /estimates/time`
  - purpose: return estimated pickup times for available products at a location
  - auth: server token or OAuth bearer token
  - family notes: used alongside `/estimates/price` for availability / ETA checks

### 4) Ride-request routes
- `POST /requests/estimate`
  - purpose: calculate a request estimate before creating the ride
  - auth: OAuth 2.0 user access token
- `POST /requests`
  - purpose: create a ride request on behalf of a rider
  - auth: OAuth 2.0 user access token with the `request` scope
  - privileged-scope note: the route page explicitly marks this endpoint as requiring privileged scope for broad production use by all riders
  - required high-level request data noted by the docs:
    - start location
    - end location
    - `fare_id`
  - documented body fields include:
    - `fare_id`
    - `product_id`
    - start-location fields: `start_latitude`, `start_longitude`, optional `start_place_id`, `start_nickname`, `start_address`
    - end-location fields: `end_latitude`, `end_longitude`, optional `end_place_id`, `end_nickname`, `end_address`
    - optional `surge_confirmation_id`
    - optional `payment_method_id`
    - optional `seat_count`
    - optional Uber for Business fields `expense_code` and `expense_memo`
  - documented response notes:
    - returns `202 Accepted`
    - response fields include `request_id`, `product_id`, `status`, `vehicle`, `driver`, `location`, `eta`, and `surge_multiplier`
  - documented conflict handling:
    - `409 surge` responses can return `surge_confirmation_id`, `href`, `multiplier`, and `expires_at`
  - documented request-creation errors include many rider-state / billing / eligibility failures such as `invalid_payment`, `invalid_payment_method`, `missing_payment_method`, `product_not_allowed`, `user_not_allowed`, and `too_many_cancellations`
- `GET /requests/{request_id}`
  - purpose: retrieve ride-request details
  - path parameter: `request_id`
  - auth: OAuth 2.0 user access token
- `DELETE /requests/{request_id}`
  - purpose: cancel a ride request
  - path parameter: `request_id`
  - auth: OAuth 2.0 user access token
- `PATCH /requests/{request_id}`
  - purpose: update a ride request
  - path parameter: `request_id`
  - auth: OAuth 2.0 user access token
- `GET /requests/{request_id}/map`
  - purpose: fetch the tracking map for an in-progress request
  - path parameter: `request_id`
  - auth: OAuth 2.0 user access token
- `GET /requests/{request_id}/receipts`
  - purpose: fetch the ride receipt
  - path parameter: `request_id`
  - auth: OAuth 2.0 user access token

## Additional official integration notes
- The overview says IDs are not guaranteed to be UUIDs and can be variable length.
- Dates / times are represented as Unix-epoch seconds in UTC unless a route-specific page says otherwise.
- Country codes are expressed as ISO 3166-1 alpha-3 codes.
- The docs use `Accept-Language: en_US` in request examples.
- The API reference warns that using Uber's price-estimate endpoints for competitive third-party price comparisons violates the API Terms of Use.

## Sources inspected
- `https://developer.uber.com/products`
- `https://developer.uber.com/docs/riders/introduction`
- `https://developer.uber.com/docs/riders/references/api`
- `https://developer.uber.com/docs/riders/guides/authentication/introduction`
- `https://developer.uber.com/docs/riders/guides/rate-limiting`
- `https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get`
- `https://developer.uber.com/docs/riders/references/api/v1.2/requests-post`
