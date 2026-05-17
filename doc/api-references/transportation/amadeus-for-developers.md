# Amadeus for Developers

## Provider metadata
- Category: `Transportation`
- Provider slug: `amadeus-for-developers`
- Official docs/pages and official repositories used manually in this pass:
  - `https://developers.amadeus.com/self-service`
  - `https://developers.amadeus.com/self-service/apis-docs`
  - `https://github.com/amadeus4dev/amadeus-open-api-specification`
  - `https://github.com/amadeus4dev/developer-guides`
  - raw official spec / guide files reviewed from those official repositories during this pass, including:
    - `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/Authorizaton_v1_swagger_specification.yaml`
    - `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightOffersSearch_v2_swagger_specification.yaml`
    - `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/API-Keys/authorization.md`
    - `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/API-Keys/moving-to-production.md`
    - `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/api-rate-limits.md`
    - `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/pagination.md`
    - `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/common-errors.md`

## Manual review result
- Status for this pass: `manually_documented`
- Route count confirmed from current official public API-reference coverage in this pass: `36`

## What I confirmed manually in this pass
- The official Self-Service catalog page is readable and says the catalog spans six categories: `Flights`, `Destination experiences`, `Cars and Transfers`, `Hotels`, `Market Insights`, and `Itinerary Management APIs`.
- The current official `Self-Service APIs Documentation` page is readable and publicly lists `25` current API-reference entries.
- I manually matched those `25` current public API-reference entries against the official `amadeus-open-api-specification` repository and counted the currently listed route operations from the corresponding official OpenAPI files.
- I also counted the official OAuth token routes from the current official `Authorizaton_v1_swagger_specification.yaml` file because Amadeus publishes them as part of the public Self-Service integration flow.
- I did not count older repository-only specs that are no longer listed on the current public `Self-Service APIs Documentation` page, such as older market-insight and prediction APIs that are present in the repository but not in the current public API-reference list.

## Canonical base URLs and formats
- Test host used in the official current specs and auth guide: `https://test.api.amadeus.com`
- Production host from the official `moving-to-production` guide: `https://api.amadeus.com`
- Versioning is in the path, with current public routes spread across `v1`, `v2`, and `v3` paths.
- Primary API media type across most current route specs: `application/vnd.amadeus+json`
- Transfer APIs explicitly accept and return both:
  - `application/vnd.amadeus+json`
  - `application/json`
- OAuth token request format from the official authorization guide and auth spec:
  - request body: `application/x-www-form-urlencoded`
  - response: JSON

## Authentication and production access
- Amadeus Self-Service APIs use OAuth `Client Credentials Grant`.
- The official token endpoint is:
  - `POST /v1/security/oauth2/token`
- Official required form fields for token creation:
  - `grant_type=client_credentials`
  - `client_id`
  - `client_secret`
- Official token response fields include:
  - `type`
  - `username`
  - `application_name`
  - `client_id`
  - `token_type`
  - `access_token`
  - `expires_in`
  - `state`
  - `scope`
- The official authorization guide says access tokens expire after `1799` seconds in the sample response and instructs clients to renew tokens when expired.
- Every API call must send an `Authorization` header using the bearer-token form shown in the official guide, e.g. `Authorization: Bearer <access_token>`.
- The official production guide says production access requires a separate production key request, billing details, signed terms, and validation.
- The official production guide says the first production application is usually validated within `72 hours`.
- The official production guide says production keys work for all Self-Service APIs except `Flight Create Orders API`, which has special production requirements.
- The official production guide says `Flight Create Orders` production access additionally requires ticket-issuance/consolidator readiness, country eligibility, and local-regulatory compliance.

## Rate limits, pagination, and errors
### Rate limits
From the official `API Rate Limits` guide:
- `Tours and Activities` is in the special `Artificial Intelligence and Partners' APIs` bucket:
  - `20 transactions per second, per user`
  - `No more than 1 request every 50ms`
- All other current Self-Service APIs are documented with these per-user environment limits:
  - Test: `10 transactions per second`
  - Production: `40 transactions per second`
  - Test also states: `No more than 1 request every 100ms`

### Pagination
From the official `Pagination Guide for APIs`:
- Not all Self-Service APIs support pagination.
- Among the currently listed public API-reference entries documented in this row, the guide explicitly names:
  - `Airport Nearest Relevant`
  - `Airport & City Search`
- The guide shows pagination through response links under `meta.links` such as `next` and `last`.
- The guide says page indexing uses the `page[offset]` query parameter.
- The current `Airport & City Search` spec explicitly defines:
  - `page[limit]` with default `10`
  - `page[offset]` with default `0`
- Other search/list endpoints commonly use route-specific result-size controls such as `max`, rather than the `page[offset]` pattern.

### Errors
From the official `Common Errors` guide and current route specs:
- Common client and server status families are `4xx` and `5xx`.
- Official auth / platform examples include:
  - `400 unsupported_grant_type`
  - `401 invalid access token`
  - `401 invalid client`
  - `401 invalid HTTP header`
  - `401 access token expired`
  - `401 access token revoked`
  - `401 API key revoked`
  - `401 invalid API key`
  - `403 Forbidden`
  - `429 Too many requests`
  - `429 Quota limit exceeded`
  - `404 Resource not found`
  - `500 Internal error`
- Current route specs commonly model error payloads as JSON with an `errors` array containing fields such as:
  - `status`
  - `code`
  - `title`
  - `detail`
  - optional `source.parameter` or `source.pointer`

## Confirmed current API surface
I confirmed `36` current public Self-Service route operations in this pass.

### OAuth / authorization
1. `POST /v1/security/oauth2/token`
2. `GET /v1/security/oauth2/token/{access_token}`

### Flights
3. `POST /v2/shopping/flight-offers`
4. `GET /v2/shopping/flight-offers`
5. `POST /v1/shopping/flight-offers/pricing`
6. `POST /v1/booking/flight-orders`
7. `GET /v1/booking/flight-orders/{flight-orderId}`
8. `DELETE /v1/booking/flight-orders/{flight-orderId}`
9. `GET /v1/shopping/seatmaps`
10. `POST /v1/shopping/seatmaps`
11. `POST /v1/shopping/flight-offers/upselling`
12. `POST /v1/shopping/availability/flight-availabilities`
13. `GET /v1/reference-data/recommended-locations`
14. `GET /v2/schedule/flights`
15. `GET /v1/reference-data/locations`
16. `GET /v1/reference-data/locations/{locationId}`
17. `GET /v1/reference-data/locations/airports`
18. `GET /v1/airport/direct-destinations`
19. `GET /v2/reference-data/urls/checkin-links`
20. `GET /v1/reference-data/airlines`
21. `GET /v1/airline/destinations`

### Destination experiences
22. `GET /v1/shopping/activities`
23. `GET /v1/shopping/activities/by-square`
24. `GET /v1/shopping/activities/{activityId}`
25. `GET /v1/reference-data/locations/cities`

### Cars and transfers
26. `POST /v1/ordering/transfer-orders`
27. `POST /v1/ordering/transfer-orders/{orderId}/transfers/cancellation`
28. `POST /v1/shopping/transfer-offers`

### Hotels
29. `GET /v1/reference-data/locations/hotels/by-hotels`
30. `GET /v1/reference-data/locations/hotels/by-city`
31. `GET /v1/reference-data/locations/hotels/by-geocode`
32. `GET /v3/shopping/hotel-offers`
33. `GET /v3/shopping/hotel-offers/{offerId}`
34. `POST /v2/booking/hotel-orders`
35. `GET /v2/e-reputation/hotel-sentiments`
36. `GET /v1/reference-data/locations/hotel`

## Route-family parameter and usage notes
### 1) Authorization
- `POST /v1/security/oauth2/token`
  - request body fields: `grant_type`, `client_id`, `client_secret`
  - content type: `application/x-www-form-urlencoded`
- `GET /v1/security/oauth2/token/{access_token}`
  - path parameter: `access_token`
  - purpose: retrieve information about the access token

### 2) Flight shopping and booking
- `GET /v2/shopping/flight-offers`
  - official required query parameters include `originLocationCode`, `destinationLocationCode`, `departureDate`, and `adults`
  - official optional examples include `returnDate`, `maxPrice`, and `max`
- `POST /v2/shopping/flight-offers`
  - takes a structured request body for richer flight-search criteria
- `POST /v1/shopping/flight-offers/pricing`
  - re-prices a chosen offer before booking
- `POST /v1/booking/flight-orders`
  - creates a flight booking order
- `GET /v1/booking/flight-orders/{flight-orderId}` and `DELETE /v1/booking/flight-orders/{flight-orderId}`
  - path parameter: `flight-orderId`
- `GET /v1/shopping/seatmaps` and `POST /v1/shopping/seatmaps`
  - supports seat-map retrieval from either query-style or posted offer context
- `POST /v1/shopping/flight-offers/upselling`
  - returns branded fare upsell content for a selected offer
- `POST /v1/shopping/availability/flight-availabilities`
  - availability lookup from posted search criteria

### 3) Flight reference and discovery endpoints
- `GET /v1/reference-data/recommended-locations`
  - official examples use `cityCodes` and `travelerCountryCode`
- `GET /v2/schedule/flights`
  - flight-status / schedule query route
- `GET /v1/reference-data/locations`
  - airport/city search endpoint
  - official required query parameters: `subType`, `keyword`
  - official optional query parameters include `countryCode`, `page[limit]`, `page[offset]`, `sort`, and `view`
- `GET /v1/reference-data/locations/{locationId}`
  - path parameter: `locationId`
- `GET /v1/reference-data/locations/airports`
  - airport-nearest route used by the official pagination guide with latitude/longitude-based examples
- `GET /v1/airport/direct-destinations`
  - airport-routes lookup
- `GET /v2/reference-data/urls/checkin-links`
  - the official auth guide shows an example using the `airline` query parameter for Iberia (`IB`)
- `GET /v1/reference-data/airlines`
  - airline metadata lookup by code(s)
- `GET /v1/airline/destinations`
  - airline-destinations lookup

### 4) Destination experiences
- `GET /v1/shopping/activities`
  - query parameters include `latitude`, `longitude`, and optional `radius`
- `GET /v1/shopping/activities/by-square`
  - query parameters include `north`, `west`, `south`, and `east`
- `GET /v1/shopping/activities/{activityId}`
  - path parameter: `activityId`
- `GET /v1/reference-data/locations/cities`
  - city-search endpoint
  - official required query parameter: `keyword`
  - official optional query parameters include `countryCode` and `max`

### 5) Transfers
- `POST /v1/shopping/transfer-offers`
  - posted transfer search criteria body
- `POST /v1/ordering/transfer-orders`
  - transfer booking creation body
- `POST /v1/ordering/transfer-orders/{orderId}/transfers/cancellation`
  - path parameter: `orderId`
  - cancellation request body / action route

### 6) Hotels
- `GET /v1/reference-data/locations/hotels/by-hotels`
  - requires `hotelIds`
- `GET /v1/reference-data/locations/hotels/by-city`
  - city-based hotel reference lookup
- `GET /v1/reference-data/locations/hotels/by-geocode`
  - geocode / radius-based hotel reference lookup
- `GET /v3/shopping/hotel-offers`
  - hotel-search route with hotel list / stay criteria
- `GET /v3/shopping/hotel-offers/{offerId}`
  - path parameter: `offerId`
- `POST /v2/booking/hotel-orders`
  - hotel-booking creation route
- `GET /v2/e-reputation/hotel-sentiments`
  - hotel ratings / sentiment route
- `GET /v1/reference-data/locations/hotel`
  - hotel name autocomplete route

## Important official usage notes
- The current public `Self-Service APIs Documentation` page lists `25` current API-reference entries; this document counts the route operations for those current entries plus the official OAuth routes.
- The official documentation and specs consistently use the `test.api.amadeus.com` host for the public test environment.
- The official `moving-to-production` guide says production calls use `https://api.amadeus.com` with production keys.
- The official guides say the test environment is based on a subset of production data.
- The `Flight Offers Search` page says low-cost-carrier flights are currently unavailable.
- The same `Flight Offers Search` page says flights from `American Airlines`, `Delta`, and `British Airways` are currently unavailable.
- The docs page visibly warns that `Flight Create Orders` needs legal requirements validation before production use.
- The production guide says that once the free transaction threshold is exceeded, monthly billing applies automatically.

## Sources inspected
- `https://developers.amadeus.com/self-service`
- `https://developers.amadeus.com/self-service/apis-docs`
- `https://github.com/amadeus4dev/amadeus-open-api-specification`
- `https://github.com/amadeus4dev/developer-guides`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/Authorizaton_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightOffersSearch_v2_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightOffersPrice_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightCreateOrders_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightOrderManagement_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/SeatMapDisplay_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/BrandedFaresUpsell_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightAvailabilitiesSearch_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/TravelRecommendations_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/ToursandActivities_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/CitySearch_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/OnDemandFlightStatus_v2_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/AirportCitySearch_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/AirportNearestRelevant_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/AirportRoutes_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/FlightCheck-inLinks_v2_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/AirlineCodeLookUp_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/AirlineRoutes_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/TransferBook_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/TransferManagement_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/TransferSearch_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/HotelList_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/HotelSearch_v3_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/HotelBooking_v2_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/HotelRatings_v2_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/amadeus-open-api-specification/main/spec/yaml/HotelNameAutocomplete_v1_swagger_specification.yaml`
- `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/API-Keys/authorization.md`
- `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/API-Keys/moving-to-production.md`
- `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/api-rate-limits.md`
- `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/pagination.md`
- `https://raw.githubusercontent.com/amadeus4dev/developer-guides/master/docs/common-errors.md`
