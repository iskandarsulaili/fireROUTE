# Mercedes-Benz

## Provider metadata
- Category: `Vehicle`
- Provider slug: `mercedes-benz`
- Official docs used manually:
  - `https://developer.mercedes-benz.com/products`
  - `https://developer.mercedes-benz.com/products/vehicle_status_15`
  - `https://developer.mercedes-benz.com/products/vehicle_status_15/docs`
- Confirmed product-catalog page: `https://developer.mercedes-benz.com/products`
- Confirmed Vehicle Status 1.5 Management API base URLs:
  - ECE: `https://service.connect-business.net`
  - AMAP/NA: `https://service.amap.connect-business.net`
- Confirmed OAuth token endpoints:
  - ECE: `https://ssoalpha.dvb.corpinter.net/v1/token`
  - AMAP/NA: `https://ssoalpha.am.dvb.corpinter.net/v1/token`
- Confirmed Push/Kafka bootstrap servers:
  - ECE: `bootstrap.streaming.connect-business.net:443`
  - AMAP/NA: `bootstrap.streaming.amap.connect-business.net:443`
- Primary response formats: JSON for reviewed Management API routes; Kafka message streams for the reviewed Push API transport
- Authentication model:
  - OAuth2 client-credentials-style bearer tokens for Management API access
  - separate vehicle-owner consent token for service activation flows
- Manually confirmed routes/transports in this pass: `7`

## Scope note
The generic Mercedes-Benz developer platform currently lists many product families, but the exact browsable route surface I could manually confirm in this pass came from the current official `Vehicle Status 1.5` product documentation. The provider file below therefore documents the concrete official HTTP/Kafka surface that was actually visible and route-level enough to verify.

## Authentication
From the reviewed official Vehicle Status 1.5 docs:
- Management API calls require a bearer token obtained from the region-specific token endpoint
- the token request uses:
  - `Content-Type: application/x-www-form-urlencoded`
  - `grant_type=client_credentials`
  - `scope=...`
  - `client_id`
  - `client_secret`
- the reviewed token example returns:
  - `access_token`
  - `token_type` = `Bearer`
  - `expires_in` = `3599`
  - `id_token`
- service activation/deactivation additionally requires a vehicle-owner `consentToken`
- the docs explicitly name the vehicle-owner scope `mb:vehicle:mbdata:vehiclestatus15`

## Rate limits and operational limits
From the reviewed docs:
- the Management API suite `may throttle API access during periods of unusually high demand`
- the docs do not publish a numeric request-per-minute table on the reviewed pages
- the token should be reused during its one-hour validity period to avoid throttling from the authorization server
- activation only succeeds when the vehicle is reachable via mobile network and the required Mercedes me services are enabled by the vehicle owner

## Manually confirmed endpoint / transport set

| # | Method / transport | Path / endpoint | Purpose |
|---:|---|---|---|
| 1 | `POST` | token endpoint family `https://ssoalpha.{region}.dvb.corpinter.net/v1/token` | obtain bearer token for Management API / Push access |
| 2 | `GET` | `/api/v1/accounts/vehicles/{VIN}/compatibilities` | check whether a vehicle supports the relevant services |
| 3 | `POST` | `/api/v1/accounts/vehicles` | add one or more vehicles to the customer account |
| 4 | `POST` | `/api/v1/accounts/vehicles/{VIN}/services/vehicle-owner-consent` | activate or deactivate services using a consent token |
| 5 | `GET` | `/api/v2/accounts/vehicles/{VIN}/services` | query current service activation status |
| 6 | `DELETE` | `/api/v1/accounts/vehicles` | remove one or more vehicles from the customer account |
| 7 | `Kafka / Push API` | customer-specific topic on `bootstrap.streaming.{region}.connect-business.net:443` | consume vehicle signals once services are active |

## Route details

### 1) Obtain an OAuth bearer token
- Method: `POST`
- Endpoint family:
  - ECE: `https://ssoalpha.dvb.corpinter.net/v1/token`
  - AMAP/NA: `https://ssoalpha.am.dvb.corpinter.net/v1/token`
- Purpose: authenticate against the Management API and Push API
- Request details confirmed from the official example:
  - content type `application/x-www-form-urlencoded`
  - `grant_type=client_credentials`
  - `scope`
  - `client_id`
  - `client_secret`
- Response fields explicitly shown:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `id_token`
- Important usage note:
  - the docs say the token is valid for one hour and should be reused during that validity period

### 2) Check vehicle compatibility
- Method: `GET`
- Path: `/api/v1/accounts/vehicles/{VIN}/compatibilities`
- Full URL example: `https://service.connect-business.net/api/v1/accounts/vehicles/<VIN>/compatibilities`
- Purpose: see which services a vehicle supports before adding it
- Path parameters:
  - `VIN` - vehicle identification number
- Headers explicitly shown:
  - `Authorization: Bearer <AccessToken>`
  - `Content-Type: application/json`
- Response fields explicitly shown:
  - `vin`
  - `vehicleProvidesConnectivity`
  - `vehicleType`
  - `services[]` with `serviceId`, `serviceName`, and `available`
- Important note from the docs:
  - compatibility results are indicative and do not guarantee final service availability

### 3) Add vehicles to the account
- Method: `POST`
- Path: `/api/v1/accounts/vehicles`
- Full URL example: `https://service.connect-business.net/api/v1/accounts/vehicles`
- Purpose: register one or more vehicles in the customer's account before activating services
- Headers explicitly shown:
  - `Authorization: Bearer <AccessToken>`
  - `Content-Type: application/json`
- Request body explicitly shown:
  - JSON array of vehicle objects such as:
    - `{ "vin": "S0FTCARMB00000021" }`
- Response behavior explicitly shown:
  - `HTTP 201`
- Important usage notes:
  - the docs say this route supports bulk add operations
  - the docs say this call is idempotent
  - successful registration also results in a Kafka registration message on the customer topic

### 4) Activate or deactivate services on a vehicle
- Method: `POST`
- Path: `/api/v1/accounts/vehicles/{VIN}/services/vehicle-owner-consent`
- Full URL example: `https://service.connect-business.net/api/v1/accounts/vehicles/S0FTCARMB00000021/services/vehicle-owner-consent`
- Purpose: change service status for a vehicle once owner consent has been collected
- Path parameters:
  - `VIN`
- Headers explicitly shown:
  - `Authorization: Bearer <AccessToken>`
  - `Content-Type: application/json`
- Request body fields explicitly shown:
  - `consentToken`
  - `services[]`
  - `services[].desiredStatus` with reviewed examples `ACTIVE` and `INACTIVE`
  - `services[].serviceId` with reviewed example `2004`
- Response behavior explicitly shown:
  - `HTTP 202`
  - example body includes `tokenExpirationTime`
- Important usage notes:
  - the reviewed docs use this same route for both activation and deactivation by changing `desiredStatus`
  - the reviewed docs say consent tokens are valid for one hour
  - the service only becomes active after the vehicle has connectivity and the ignition has been turned on at least once

### 5) Query service status
- Method: `GET`
- Path: `/api/v2/accounts/vehicles/{VIN}/services`
- Full URL example: `https://service.connect-business.net/api/v2/accounts/vehicles/S0FTCARMB00000021/services`
- Purpose: check whether requested services are `ACTIVE`, `ACTIVATION_PENDING`, or another documented state
- Path parameters:
  - `VIN`
- Headers explicitly shown:
  - `Authorization: Bearer <AccessToken>`
- Response fields explicitly shown:
  - `services[]`
  - `services[].orderTime`
  - `services[].serviceId`
  - `services[].status`
  - `vin`

### 6) Remove vehicles from the account
- Method: `DELETE`
- Path: `/api/v1/accounts/vehicles`
- Full URL example: `https://service.connect-business.net/api/v1/accounts/vehicles`
- Purpose: deregister one or more vehicles from the account
- Headers explicitly shown:
  - `Authorization: Bearer <AccessToken>`
  - `Content-Type: application/json`
- Request body explicitly shown:
  - JSON array of vehicle objects such as:
    - `{ "vin": "S0FTCARMB00000021" }`
- Response behavior explicitly shown:
  - `HTTP 200`
- Important usage notes:
  - the docs say removing a vehicle automatically deactivates its active services
  - the docs say this call is not idempotent; removing the same vehicle twice leads to `HTTP 404`

### 7) Consume vehicle signals via the Push API
- Transport: `Kafka`
- Bootstrap server family:
  - ECE: `bootstrap.streaming.connect-business.net:443`
  - AMAP/NA: `bootstrap.streaming.amap.connect-business.net:443`
- Purpose: receive vehicle signals after services are active
- Confirmed operational details from the reviewed docs:
  - each customer gets a unique Kafka topic
  - a Kafka consumer plus consumer configuration is required
  - the client system must trust the Let's Encrypt trust chain
  - the docs link to official Kafka setup material and Mercedes-Benz integration samples
- Important note:
  - this is not an HTTP route, but it is a first-party transport surface explicitly documented as part of the product's API solution

## Pagination / streaming notes
- the reviewed Management API routes do not expose conventional page-number pagination on the sampled workflow endpoints
- the Push API is stream-based rather than paginated
- service-state updates and vehicle signals are delivered through Kafka topics instead of REST polling once the workflow is set up

## Error and format notes
- the reviewed docs do not publish one unified numeric error-code table on the pages I inspected
- the product guide repeatedly notes that missing/expired tokens, missing owner consent, disabled Mercedes me services, lack of ignition, and lack of connectivity can prevent activation or stop data flow
- service-termination examples in the docs show JSON Push messages such as `vehicle_owner_consent_status_change`

## Important usage notes
- the currently browsable Mercedes-Benz platform catalogs `29` products, but only some product pages expose route-level guidance without extra contract/login steps
- the confirmed route set above comes specifically from the browsable `Vehicle Status 1.5` product guide
- the docs distinguish between two credential families:
  - `API platform credentials` for Management/Push access
  - separate `consent collection credentials` for collecting vehicle-owner consent
- API URLs are region-specific, so European versus AMAP/NA customers must switch both service base URLs and token/bootstrap endpoints

## Verification notes
This file was manually rebuilt from the official Mercedes-Benz developer product catalog plus the browsable Vehicle Status 1.5 product overview and development-guide pages.