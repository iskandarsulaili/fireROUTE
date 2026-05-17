# Kroger

Official pages manually reviewed:
- https://developer.kroger.com/documentation
- https://developer.kroger.com/documentation/public/security/service-to-service
- https://developer.kroger.com/documentation/public/security/customer
- https://developer.kroger.com/documentation/support/api-troubleshooting/troubleshooting
- https://developer.kroger.com/api-products/api/cart-api-public
- https://developer.kroger.com/api-products/api/identity-api-public
- https://developer.kroger.com/api-products/api/location-api-public
- https://developer.kroger.com/api-products/api/product-api-public

## Overview
- Production base URL shown in the reviewed API references: `https://api.kroger.com`
- Certification base URL shown in the reviewed API references: `https://api-ce.kroger.com`
- Versioned API root used in all reviewed examples: `/v1`
- Primary response format: JSON
- Authentication: OAuth 2.0 only; public data uses the Client Credentials grant, customer-context APIs use the Authorization Code grant, and refresh tokens are supported for customer re-auth flows
- App registration is required before requesting OAuth credentials or tokens

Manual route count confirmed from the reviewed official docs: **15**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/connect/oauth2/authorize` | Start customer OAuth authorization-code flow |
| POST | `/v1/connect/oauth2/token` | Exchange client credentials, authorization code, or refresh token for an access token |
| PUT | `/v1/cart/add` | Add items to an authenticated customer's cart |
| GET | `/v1/identity/profile` | Get the authenticated customer's Kroger profile ID |
| GET | `/v1/products` | Search the product catalog |
| GET | `/v1/products/{id}` | Get one product by product ID or UPC |
| GET | `/v1/locations` | Search locations |
| GET | `/v1/locations/{locationId}` | Get one location |
| HEAD | `/v1/locations/{locationId}` | Check whether a location exists |
| GET | `/v1/chains` | List chains owned by The Kroger Co. |
| GET | `/v1/chains/{name}` | Get one chain by name |
| HEAD | `/v1/chains/{name}` | Check whether a chain exists |
| GET | `/v1/departments` | List departments |
| GET | `/v1/departments/{id}` | Get one department by department ID |
| HEAD | `/v1/departments/{id}` | Check whether a department exists |

## Confirmed parameters

### `GET /v1/connect/oauth2/authorize`
Official customer-auth docs require these query parameters:
- `scope`: requested customer scopes
- `response_type=code`
- `client_id`: registered application client ID
- `redirect_uri`: one of the application's registered redirect URLs

### `POST /v1/connect/oauth2/token`
- Content type in the reviewed examples: `application/x-www-form-urlencoded`
- Client-credentials and authorization-code examples require `Authorization: Basic {{base64(client_id:client_secret)}}`
- Officially documented body parameters by grant:
  - Client Credentials flow:
    - `grant_type=client_credentials`
    - `scope`
  - Authorization Code flow:
    - `grant_type=authorization_code`
    - `code`
    - `redirect_uri`
  - Refresh Token flow:
    - `grant_type=refresh_token`
    - `refresh_token`

### `PUT /v1/cart/add`
- Customer OAuth token required (`CustomerContext` in the reviewed reference)
- JSON request body contains `items`
- The reviewed official sample payload shows each item with:
  - `quantity`
  - `upc`
  - `modality` (sample value: `DELIVERY`)

### `GET /v1/identity/profile`
- No path or query parameters are documented on the reviewed page
- Requires customer OAuth token (`CustomerContext`)

### `GET /v1/products`
The reviewed product reference says an initial search value is required, using one of:
- `filter.term`
- `filter.brand`
- `filter.productId`

Additional documented query parameters:
- `filter.locationId`: 8-character location ID
- `filter.fulfillment`: one or more of `ais`, `csp`, `dth`, `sth`
- `filter.start`: integer `1..250`
- `filter.limit`: integer `1..50`

Additional documented behaviors:
- `filter.term` must be at least 3 characters and is limited to 8 words
- `filter.brand` is case-sensitive and pipe-separated for multiple brands
- `filter.productId` accepts comma-separated IDs and causes other query parameters to be ignored

### `GET /v1/products/{id}`
- Path parameter: `id` (`productId` or UPC in the reviewed reference)
- Optional query parameter:
  - `filter.locationId`

### `GET /v1/locations`
Documented query parameters:
- Starting-point filters:
  - `filter.zipCode.near`
  - `filter.latLong.near`
  - `filter.lat.near`
  - `filter.lon.near`
- Additional filters:
  - `filter.radiusInMiles`: integer `1..100`, default `10`
  - `filter.limit`: integer `1..200`, default `10`
  - `filter.chain`
  - `filter.department`: 2-character department ID, comma-separated list supported
  - `filter.locationId`: comma-separated 8-character location IDs

### `GET` and `HEAD /v1/locations/{locationId}`
- Path parameter: `locationId` (8 characters)

### `GET` and `HEAD /v1/chains/{name}`
- Path parameter: `name`
- The reviewed docs note chain names come from `/v1/chains` as `name` and from `/v1/locations` as `chain`

### `GET /v1/departments`
- No path or query parameters are documented on the reviewed page

### `GET` and `HEAD /v1/departments/{id}`
- Path parameter: `id` (2-character department ID)

## Auth and rate limits
- Service-to-service access uses OAuth 2.0 Client Credentials.
- Customer-context access uses OAuth 2.0 Authorization Code and customer consent.
- The reviewed token examples show `expires_in: 1800` seconds for access tokens.
- The reviewed customer-auth docs show refresh tokens are returned for authorization-code flows and can be exchanged for a new access token.
- Official per-product rate limits documented on the reviewed pages:
  - Cart API: `5,000` calls/day
  - Identity API: `5,000` calls/day
  - Products API: `10,000` calls/day across `/products` operations
  - Locations API: `1,600` calls/day per endpoint family, with separate limits for `/locations`, `/chains`, and `/departments`
- The reviewed troubleshooting page says missing required scopes return `403 Forbidden`.

## Pagination and response notes
- `GET /v1/products` supports pagination with `filter.start` and `filter.limit`; the reviewed docs say the default page size is `10`.
- The reviewed products docs warn that `filter.term` searches are fuzzy, so result ordering can change between requests.
- The reviewed locations docs say there is no pagination; responses are one page with a default limit of `10`, and `filter.limit` can raise that to `200`.
- `PUT /v1/cart/add` returns `204` on success.
- `GET /v1/identity/profile` returns `200` with `data.id`.
- The existence-check routes (`HEAD` on location, chain, and department resources) return `204 No Content` on success.
- Route-level response codes shown across the reviewed refs include combinations of `400`, `401`, `403`, `404`, and `500` depending on endpoint.

## Important usage notes
- The reviewed quick-start and security docs require creating a developer account and registering an application before requesting tokens.
- The reviewed troubleshooting page says expired or invalid access tokens return `401 Unauthorized` with `error=invalid_token`.
- The same troubleshooting page says redirect-URI mismatches during OAuth return `400 INVALID_REQUEST`.
- Customer-consent denial is returned to the redirect URL as an OAuth `access_denied` error.
- Cart and identity routes are customer-context APIs; products and locations are documented for service-to-service access.
- Product price, availability, aisle, and inventory data require `filter.locationId`.
- The cart reference's official sample and error examples show Kroger validates item `upc` and `modality` values.
- The locations docs note you may need to increase `filter.radiusInMiles` when increasing `filter.limit`.

## fireROUTE notes
- Treat `/v1/connect/oauth2/token` as one shared auth route whose required body fields vary by grant type.
- Keep customer-context routes (`/v1/cart/add`, `/v1/identity/profile`, and OAuth authorize flow) separate from client-credentials routes.
- Preserve raw query passthrough for `/v1/products` and `/v1/locations` because the official docs expose several filter combinations.
- Keep production and certification hosts configurable because the reviewed refs expose both `api.kroger.com` and `api-ce.kroger.com`.
