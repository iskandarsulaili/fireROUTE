# Open Government, New South Wales

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-new-south-wales`
- Official docs/pages used:
  - `https://api.nsw.gov.au/`
  - `https://api.nsw.gov.au/ProductCatalogue?apiCategoryId=0`
  - `https://api.nsw.gov.au/Product/Index/22`
  - `https://apinsw.onegov.nsw.gov.au/api/swagger/spec/22`
- Current documented API host: `https://api.onegov.nsw.gov.au`
- Current documented API path families:
  - `/oauth/client_credential/accesstoken`
  - `/FuelCheckRefData/...`
  - `/FuelPriceCheck/...`
- Auth model: API key + API secret -> OAuth bearer token, plus `apikey` header on the protected data routes
- Response format: JSON
- Manually confirmed route count: `13`

## Official usage notes
- The reviewed official NSW API catalogue page exposes the Fuel API product as the current route-documented public API on the assigned provider host.
- The official product page says v1 endpoints return NSW data only, while v2 endpoints can return NSW and Tasmania (`TAS`) data.
- The official product page publishes rate-limit tiers rather than per-route burst numbers: `Free` is `2500 calls / month`, while `Premium` is custom by agreement.
- The official product page says the OAuth authorization token lasts approximately `12` hours.
- The live official Swagger document uses `https://api.onegov.nsw.gov.au` as the API host and uses case-sensitive path names such as `/FuelPriceCheck/...`; preserve that casing.

## Canonical endpoints confirmed from the official Swagger document
1. `GET /oauth/client_credential/accesstoken`
   - Base URL: `https://api.onegov.nsw.gov.au`
   - Purpose: exchange API key + secret for an OAuth access token
   - Required inputs:
     - query `grant_type=client_credentials`
     - header `Authorization: Basic {base64(api_key:api_secret)}`
   - Documented responses: `200`, `401`

2. `GET /FuelCheckRefData/v1/fuel/lovs`
   - Purpose: return reference lists used by later pricing requests
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
     - `if-modified-since`
   - Documented responses: `200`, `400`, `401`, `500`

3. `GET /FuelCheckRefData/v2/fuel/lovs`
   - Purpose: return reference lists for NSW/TAS-aware clients
   - Same required headers as the v1 route
   - Optional query parameters:
     - `states` - `|`-delimited state list such as `NSW|TAS`
   - Documented responses: `200`, `400`, `401`, `500`

4. `POST /FuelPriceCheck/v1/fuel/prices/location`
   - Purpose: return prices for one fuel type in a named location such as a suburb or postcode
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
   - Documented request body fields:
     - `fueltype`
     - `brand[]`
     - `namedlocation`
     - `referencepoint`
     - `sortby`
     - `sortascending`
   - Documented responses: `200`, `400`, `401`, `500`

5. `POST /FuelPriceCheck/v2/fuel/prices/location`
   - Purpose: v2 location-price lookup across NSW/TAS-supported data
   - Required headers and body shape match the v1 route
   - Documented responses: `200`, `400`, `401`, `500`

6. `POST /FuelPriceCheck/v1/fuel/prices/nearby`
   - Purpose: return prices for one fuel type within a specified radius from a reference point
   - Official note: if no stations exist within the radius, the closest `10` stations are returned
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
   - Documented request body fields:
     - `fueltype`
     - `brand[]`
     - `namedlocation`
     - `latitude`
     - `longitude`
     - `radius`
     - `sortby`
     - `sortascending`
   - Documented responses: `200`, `400`, `401`, `500`

7. `POST /FuelPriceCheck/v2/fuel/prices/nearby`
   - Purpose: v2 nearby-price lookup across NSW/TAS-supported data
   - Required headers and body shape match the v1 route
   - Documented responses: `200`, `400`, `401`, `500`

8. `GET /FuelPriceCheck/v1/fuel/prices`
   - Purpose: return all current prices for all service stations in NSW
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
   - Official note: response can exceed `2 MB` and may be request-frequency restricted
   - Documented responses: `200`, `400`, `401`, `500`

9. `GET /FuelPriceCheck/v2/fuel/prices`
   - Purpose: return all current prices for NSW and optionally TAS
   - Required headers match the v1 route
   - Optional query parameters:
     - `states` - `|`-delimited state list such as `NSW|TAS`
   - Official note: response can exceed `2 MB`
   - Documented responses: `200`, `400`, `401`, `500`

10. `GET /FuelPriceCheck/v1/fuel/prices/new`
   - Purpose: return newly submitted prices since the caller's last same-day full-price or new-price request using that API key
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
   - Documented responses: `200`, `400`, `401`, `500`

11. `GET /FuelPriceCheck/v2/fuel/prices/new`
   - Purpose: return newly submitted NSW/TAS-aware price updates since the caller's last same-day tracked request
   - Required headers match the v1 route
   - Optional query parameters:
     - `states` - `|`-delimited state list such as `NSW|TAS`
   - Documented responses: `200`, `400`, `401`, `500`

12. `GET /FuelPriceCheck/v1/fuel/prices/station/{stationCode}`
   - Purpose: return prices for one station in NSW
   - Path parameters:
     - `stationCode` - station code from the reference-data route
   - Required headers:
     - `Authorization: Bearer {token}`
     - `Content-Type: application/json; charset=utf-8`
     - `apikey`
     - `transactionid`
     - `requesttimestamp`
   - Documented responses: `200`, `400`, `401`, `500`

13. `GET /FuelPriceCheck/v2/fuel/prices/station/{stationCode}`
   - Purpose: return prices for one station with optional multi-state disambiguation
   - Path parameters:
     - `stationCode` - station code from the reference-data route
   - Optional query parameters:
     - `state` - station state such as `NSW` or `TAS`; the docs say omitted values default to `NSW`
   - Required headers match the v1 route
   - Documented responses: `200`, `400`, `401`, `500`

## Pagination, filtering, and format notes
- The reviewed Swagger document is JSON-based and all listed operations produce `application/json`.
- No page/offset pagination parameters are documented on the Fuel API routes.
- Incremental retrieval is handled through the dedicated `.../prices/new` routes rather than page cursors.
- The v2 reference-data and price routes use either `states` or `state` query parameters for NSW/TAS scoping.
- The location and nearby POST bodies support sorting inputs via `sortby` and `sortascending`.

## Error, auth, and access notes
- Token creation returns either `200` or `401` on the reviewed Swagger page.
- Fuel data routes consistently document `200`, `400`, `401`, and `500`.
- The protected data routes all require both an OAuth bearer token and the provider-issued `apikey` header.
- The product page also says credential pairs are provisioned by API NSW and stored for later validation.
- The official pricing page did not publish per-second or per-minute throttles beyond the `2500 calls / month` free-tier plan and custom premium agreements.

## fireROUTE normalization notes
- Treat `https://api.onegov.nsw.gov.au` as the canonical API host for route execution, even though discovery happens on `https://api.nsw.gov.au/`.
- Preserve the exact case of `/FuelCheckRefData/...` and `/FuelPriceCheck/...` paths.
- Model auth as a two-step flow: first fetch a bearer token from `/oauth/client_credential/accesstoken`, then send the bearer token in the `Authorization` header together with the `apikey` header on the data routes.
- Keep v1 and v2 route families separate because their geography coverage and optional state parameters differ.