# Rappi

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://dev-portal.rappi.com/en/api-reference/`
  - `https://dev-portal.rappi.com/en/api-reference/authentication/`
  - `https://dev-portal.rappi.com/en/api-reference/rests-api-availability/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `8`

## API overview
- Base URL model: `https://{NEW_DOMAIN}`
- Official sample/developer environment used in the reviewed docs: `https://api.dev.rappi.com`
- Reviewed product scope:
  - restaurant integrations
  - authentication token issuance
  - menu availability management for products, toppings, and combined items
- Authentication:
  - the getting-started and authentication pages say you receive `client_id` and `client_secret` credentials after approval by the Rappi team
  - protected requests use header `x-authorization: Bearer <access_token>`
  - the docs call this a Bearer scheme, but they do not use the standard `Authorization` header name in the reviewed examples
- Formats:
  - request bodies are JSON on all reviewed auth and availability endpoints
  - response bodies are JSON on the reviewed pages
- Pagination:
  - no pagination rules were published on the reviewed auth and availability pages
- Rate limits:
  - no numeric rate-limit quota was published on the reviewed pages

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/restaurants/auth/v1/token/login/integrations` | JSON body `client_id`, `client_secret` | Generates an access token for integration services. |
| POST | `/restaurants/auth/v1/token/login/utils` | JSON body `client_id`, `client_secret` | Generates an access token for utils services. |
| PATCH | `/restaurants/menu/v1/stores/{storeId}/products/{identityType}/stock` | path `storeId`, `identityType`; JSON body `available`, `unavailable` | Asynchronously enables/disables product availability in bulk. |
| POST | `/restaurants/menu/v1/stores/{storeId}/products/{identityType}/stock/status` | path `storeId`, `identityType`; JSON body `products` | Validates product availability in bulk. |
| PATCH | `/restaurants/menu/v1/stores/{storeId}/toppings/{identityType}/stock` | path `storeId`, `identityType`; JSON body `available`, `unavailable` | Asynchronously enables/disables topping availability in bulk. |
| POST | `/restaurants/menu/v1/stores/{storeId}/toppings/{identityType}/stock/status` | path `storeId`, `identityType`; JSON body `toppings` | Validates topping availability in bulk. |
| PATCH | `/restaurants/menu/v1/stores/{storeId}/items/{identityType}/stock` | path `storeId`, `identityType`; JSON body `available`, `unavailable` | Asynchronously enables/disables combined item availability in bulk. |
| POST | `/restaurants/menu/v1/stores/{storeId}/items/{identityType}/stock/status` | path `storeId`, `identityType`; JSON body `items` | Validates combined item availability in bulk. |

## Confirmed parameters and behavior notes
### Auth/login routes
- Both login routes take the same required JSON body fields:
  - `client_id`: client id from Rappi credentials
  - `client_secret`: client secret from Rappi credentials
- The authentication page says the token returned by login is used for subsequent protected requests.
- The same page documents response fields:
  - `access_token`
  - `token_type`
  - `expires_in`

### Availability routes
- `storeId`: Rappi-side store identifier
- `identityType`: documented values `RAPPI` or `SKU`
  - use `RAPPI` when the activation/deactivation identifiers are Rappi IDs
  - use `SKU` when merchant identifiers are used
- Availability write endpoints use JSON arrays named `available` and `unavailable`.
- Availability status endpoints use collection-specific array fields such as `products`, `toppings`, or `items`.
- Reviewed examples set `Content-Type: application/json` and `x-authorization: Bearer <access_token>`.

## Response, pagination, and error notes
- Auth login docs publish `200 Success` and `403 Unauthorized`.
- Availability docs publish `200 Successful request`, `412 Precondition Failed`, and `424 Failed Dependency`.
- Reviewed successful availability examples return a JSON message like `Your request has been accepted`.
- The getting-started page says the docs include pagination guidance in general, but no pagination parameters were visible on the reviewed auth and availability endpoints.

## Important usage notes
- The getting-started page says integration requires direct contact and approval from the Rappi team before credentials are issued.
- The reviewed docs use endpoint tags such as `NEW`, `STABLE`, and `DEPRECATED`; the getting-started page recommends preferring stable endpoints and avoiding deprecated ones in new integrations.
- The authentication page contains a timing ambiguity: one note says the access token has a validity of `1 week`, while the sample response shows `expires_in: 86400` seconds. fireROUTE should treat token lifetime as provider-defined and verify it against real credentials rather than assume one fixed value from the docs alone.

## Sources inspected
- `https://dev-portal.rappi.com/en/api-reference/`
- `https://dev-portal.rappi.com/en/api-reference/authentication/`
- `https://dev-portal.rappi.com/en/api-reference/rests-api-availability/`
