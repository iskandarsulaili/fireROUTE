# Smartcar

## Provider metadata
- Category: `Vehicle`
- Provider slug: `smartcar`
- Official docs used manually:
  - `https://smartcar.com/docs/api-reference/intro`
  - `https://smartcar.com/docs/api-reference/authorization/overview`
  - `https://smartcar.com/docs/api-reference/authorization/request-access-token`
  - `https://smartcar.com/docs/api-reference/authorization/auth-code-exchange`
  - `https://smartcar.com/docs/api-reference/authorization/refreshing-access-token`
  - `https://smartcar.com/docs/api-reference/list-connections`
  - `https://smartcar.com/docs/api-reference/get-connection`
  - `https://smartcar.com/docs/api-reference/remove-connection`
  - `https://smartcar.com/docs/api-reference/remove-user`
  - `https://smartcar.com/docs/api-reference/get-vehicle`
  - `https://smartcar.com/docs/api-reference/list-signals`
  - `https://smartcar.com/docs/api-reference/get-signal`
  - `https://smartcar.com/docs/api-reference/create-subscription`
  - `https://smartcar.com/docs/api-reference/list-subscriptions`
  - `https://smartcar.com/docs/api-reference/get-subscription`
  - `https://smartcar.com/docs/api-reference/remove-subscription`
  - `https://smartcar.com/docs/api-reference/security/lock-doors`
  - `https://smartcar.com/docs/api-reference/security/unlock-doors`
  - `https://smartcar.com/docs/api-reference/charging/start-charging`
  - `https://smartcar.com/docs/api-reference/charging/stop-charging`
  - `https://smartcar.com/docs/api-reference/charging/set-charge-limit`
  - `https://smartcar.com/docs/api-reference/navigation/set-destination`
  - `https://smartcar.com/docs/api-reference/headers`
  - `https://smartcar.com/docs/api-reference/api-errors`
- Confirmed API bases:
  - `https://vehicle.api.smartcar.com/v3`
  - `https://management.api.smartcar.com/v3`
  - `https://iam.smartcar.com/oauth2/token`
  - `https://auth.smartcar.com/oauth/token`
- Primary response format: JSON
- Authentication:
  - machine-to-machine API Authentication uses OAuth 2.0 client credentials against `https://iam.smartcar.com/oauth2/token`
  - Connect-style user token exchange uses `https://auth.smartcar.com/oauth/token`
  - application API calls use `Authorization: Bearer <token>`
  - vehicle signal and command calls also require `sc-user-id: {userId}`
- Manually confirmed routes in this pass: `20`

## Authentication models and token handling
From the reviewed official pages:
- Smartcar currently documents two token patterns.
- API Authentication is the server-to-server model for Smartcar's Vehicle API and Management API:
  - OAuth 2.0 client credentials flow
  - request a single application-level access token
  - token lifetime is `1 hour`
  - no refresh token is issued for this flow
- Connect user-token exchange is still documented separately:
  - exchange an authorization code at `https://auth.smartcar.com/oauth/token`
  - use HTTP Basic auth with `base64({client_id}:{client_secret})`
  - body is `application/x-www-form-urlencoded`
  - access token lifetime is `2 hours`
  - refresh tokens are supported for this flow
  - refresh tokens are invalidated `10 minutes` after use, and Smartcar explicitly says to persist both the newly issued access token and refresh token
- For vehicle-scoped signals and commands, Smartcar's reviewed docs repeatedly require both:
  - bearer token
  - `sc-user-id` header
- The reviewed auth overview also says the `/connections` endpoint accepts `sc-user-id` as a filter aid.

## Confirmed API surface

| Method | Base | Path | Purpose | Key request details from reviewed docs |
|---|---|---|---|---|
| `POST` | `https://iam.smartcar.com` | `/oauth2/token` | request application access token | form body includes `grant_type=client_credentials`, `client_id`, `client_secret` |
| `POST` | `https://auth.smartcar.com` | `/oauth/token` | exchange authorization code for user access token | Basic auth header; form body includes `grant_type=authorization_code`, `code`, `redirect_uri` |
| `POST` | `https://auth.smartcar.com` | `/oauth/token` | refresh a user access token | Basic auth header; form body includes `grant_type=refresh_token`, `refresh_token` |
| `GET` | `https://vehicle.api.smartcar.com/v3` | `/connections` | list vehicle connections for the application | optional filters `filter[userId]`, `filter[vehicleId]`, `filter[vehicle.mode]`; pagination with `page[number]`, `page[size]` |
| `GET` | `https://vehicle.api.smartcar.com/v3` | `/connections/{connectionId}` | fetch one application connection | required path param `connectionId` |
| `DELETE` | `https://vehicle.api.smartcar.com/v3` | `/connections/{connectionId}` | remove one connection | required path param `connectionId`; success is `204 No Content` |
| `DELETE` | `https://vehicle.api.smartcar.com/v3` | `/users/{userId}` | purge one user and all connections | required path param `userId`; success is `204 No Content` |
| `GET` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}` | fetch vehicle resource by id | required path param `vehicleId` |
| `GET` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/signals` | list signals for a vehicle | required `vehicleId` path param and `sc-user-id` header |
| `GET` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/signals/{signalCode}` | fetch one signal by code | required `vehicleId`, `signalCode`, and `sc-user-id` |
| `POST` | `https://management.api.smartcar.com/v3` | `/subscriptions` | create webhook subscription | JSON body requires `webhookId`, `userId`, `vehicleId`; success is `202 Accepted` with creation in progress |
| `GET` | `https://management.api.smartcar.com/v3` | `/subscriptions` | list webhook subscriptions | optional filters `filter[userId]`, `filter[webhookId]`, `filter[vehicleId]`, `filter[vehicle.mode]`; pagination `page[number]`, `page[size]` |
| `GET` | `https://management.api.smartcar.com/v3` | `/subscriptions/{subscriptionId}` | fetch one webhook subscription | required path param `subscriptionId` |
| `DELETE` | `https://management.api.smartcar.com/v3` | `/subscriptions/{subscriptionId}` | delete one webhook subscription | required path param `subscriptionId`; success is `204 No Content` |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/security/lock` | lock all vehicle doors | required `vehicleId` and `sc-user-id`; success may be `200` or `202` |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/security/unlock` | unlock all vehicle doors | required `vehicleId` and `sc-user-id`; success may be `200` or `202` |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/charge/start` | initiate charging | required `vehicleId` and `sc-user-id`; success may be `200` or `202` |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/charge/stop` | stop charging | required `vehicleId` and `sc-user-id`; success may be `200` or `202` |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/charge/set-limit` | set EV charge limit | required `vehicleId` and `sc-user-id`; JSON request body includes charge-limit percent |
| `POST` | `https://vehicle.api.smartcar.com/v3` | `/vehicles/{vehicleId}/commands/navigation/set-destination` | send destination to vehicle navigation | required `vehicleId` and `sc-user-id`; JSON request body includes destination coordinates |

## Route notes by area

### Token routes
1. `POST https://iam.smartcar.com/oauth2/token`
- purpose: obtain application access token for API Authentication
- request content type: `application/x-www-form-urlencoded` in the reviewed examples
- documented fields: `grant_type`, `client_id`, `client_secret`
- success response includes `access_token`, `token_type`, `expires_in`
- documented token lifetime: `3600` seconds / `1 hour`
- documented error examples:
  - `400 invalid_request`
  - `401 invalid_client`

2. `POST https://auth.smartcar.com/oauth/token` for authorization-code exchange
- purpose: exchange Connect authorization code for a user token pair
- required headers: `Authorization: Basic base64({client_id}:{client_secret})`, `Content-Type: application/x-www-form-urlencoded`, valid `User-Agent`
- documented body fields: `code`, `grant_type=authorization_code`, `redirect_uri`
- important note: reviewed docs say `redirect_uri` must match the Connect redirect URI that was originally used
- reviewed docs refer to a token-pair response, not just an access token

3. `POST https://auth.smartcar.com/oauth/token` for refresh-token exchange
- purpose: mint a fresh user access token without sending the user back through Connect
- required headers: Basic auth, form-urlencoded body, valid `User-Agent`
- documented body fields: `grant_type=refresh_token`, `refresh_token`
- important note: reviewed docs say the refresh token is invalidated 10 minutes after use

### Connection and vehicle routes
4. `GET /connections`
- lists application connections
- optional filters:
  - `filter[userId]`
  - `filter[vehicleId]`
  - `filter[vehicle.mode]` with documented enum `live` or `simulated`
- pagination fields:
  - `page[number]` default `1`
  - `page[size]` default `10`
- reviewed OpenAPI shows `meta` and `links` pagination objects in the response

5. `GET /connections/{connectionId}`
- gets one connection resource
- response example includes permissions, vehicle make/model/year/mode/powertrain, and related vehicle/user resource links

6. `DELETE /connections/{connectionId}`
- removes one connection
- success response is `204`

7. `DELETE /users/{userId}`
- removes one user and purges all associated data and connections for the application
- success response is `204`

8. `GET /vehicles/{vehicleId}`
- returns one vehicle resource
- reviewed example attributes include `make`, `model`, `year`, `powertrainType`, and `mode`

### Signal routes
9. `GET /vehicles/{vehicleId}/signals`
- lists signal resources for a vehicle
- requires `sc-user-id`
- reviewed schema shows paged response-style `meta` and `links`
- reviewed response shape includes `included.vehicle`

10. `GET /vehicles/{vehicleId}/signals/{signalCode}`
- gets one signal by code
- requires `vehicleId`, `signalCode`, and `sc-user-id`
- reviewed example signal body shows signal metadata plus value/unit payload, timestamps, and a self link

### Subscription routes
11. `POST /subscriptions`
- creates a Management API webhook subscription
- JSON request body requires:
  - `data.attributes.webhookId`
  - `data.attributes.userId`
  - `data.attributes.vehicleId`
- success response is `202 Accepted` with message `subscription creation in progress`
- reviewed responses also include `409 Conflict`

12. `GET /subscriptions`
- lists subscriptions
- filters:
  - `filter[userId]`
  - `filter[webhookId]`
  - `filter[vehicleId]`
  - `filter[vehicle.mode]`
- pagination:
  - `page[number]` default `1`
  - `page[size]` default `25`, maximum `100`

13. `GET /subscriptions/{subscriptionId}`
- retrieves one subscription resource
- reviewed schema shows subscription attributes, timestamps, and related webhook/user/vehicle references

14. `DELETE /subscriptions/{subscriptionId}`
- deletes one subscription
- success response is `204`

### Command routes
15. `POST /vehicles/{vehicleId}/commands/security/lock`
16. `POST /vehicles/{vehicleId}/commands/security/unlock`
17. `POST /vehicles/{vehicleId}/commands/charge/start`
18. `POST /vehicles/{vehicleId}/commands/charge/stop`
19. `POST /vehicles/{vehicleId}/commands/charge/set-limit`
20. `POST /vehicles/{vehicleId}/commands/navigation/set-destination`

Shared command behavior from the reviewed command pages:
- all reviewed commands require both `vehicleId` and `sc-user-id`
- success may return either:
  - `200 OK` when the command completed synchronously, or
  - `202 Accepted` when Smartcar used a keep-alive response and the body still contains the final command result
- reviewed command responses return a `command-execution` resource with execution metadata such as timestamps and duration
- reviewed request-body specifics:
  - set-charge-limit includes a charge limit percentage (`percent` in the reviewed example)
  - set-destination includes latitude and longitude in the reviewed example payload/response

## Headers, units, and response metadata
From the reviewed `headers` page:
- optional request header `SC-Unit-System` supports `metric` and `imperial`
- reviewed response headers include:
  - `SC-Data-Age` — when the returned data was recorded by the vehicle
  - `SC-Fetched-At` — when Smartcar fetched data from the OEM
  - `SC-Unit-System` — unit system used in the response
  - `SC-Request-Id` — support/debug request identifier

## Pagination notes
From the reviewed OpenAPI pages:
- `GET /connections` is explicitly paginated with `page[number]` and `page[size]`
- `GET /subscriptions` is explicitly paginated with `page[number]` and `page[size]`
- `GET /vehicles/{vehicleId}/signals` exposes paged-style `meta` and `links` response objects in the reviewed schema
- list responses use JSON API-style `data`, `meta`, and `links` structures rather than flat arrays

## Rate limits and throttling
From the reviewed official pages:
- Smartcar's reviewed error catalog documents `RATE_LIMIT` failures with HTTP `429`
- the reviewed `api-errors` page distinguishes both `RATE_LIMIT / SMARTCAR_API` and `RATE_LIMIT / VEHICLE`
- the reviewed pages used here did not publish one global numeric request quota that applies to every route in this file
- fireROUTE should therefore treat rate limiting as documented behavior without assuming a single public requests-per-minute number

## Error and format notes
From the reviewed `api-errors` page and route OpenAPI blocks:
- Smartcar uses standard HTTP success/failure classes:
  - `2XX` success
  - `4XX` invalid request / auth / missing resource / conflict conditions
  - `5XX` Smartcar or upstream issues
- reviewed route pages repeatedly document `400`, `401`, `403`, `404`, and `500`
- some reviewed routes also document:
  - `409 Conflict` on subscription creation
  - `429 Too Many Requests` via the official error catalog
- reviewed error responses use an `errors` array with fields including:
  - `status`
  - `type`
  - `code`
  - `title`
  - `detail`
  - sometimes `resolution`, `suggestedUserMessage`, `links.about`, and debug metadata
- reviewed error categories include:
  - `AUTHENTICATION`
  - `BILLING`
  - `COMPATIBILITY`
  - `CONNECTED_SERVICES_ACCOUNT`
  - `RATE_LIMIT`
  - `RESOURCE_NOT_FOUND`
  - `SERVER`
  - `UPSTREAM`
  - `VALIDATION`
  - `VEHICLE_STATE`

## fireROUTE notes
- Smartcar is not one host and one auth model; it currently spans a vehicle API host, a management API host, a client-credentials token host, and a Connect token host.
- Vehicle signals and commands need explicit user context through `sc-user-id`; a bearer token alone is not enough for those reviewed routes.
- Management subscription creation is asynchronous (`202 Accepted`) and should not be modeled as an immediate synchronous create.
- Command routes should preserve the possibility of both `200` and `202` success responses with final execution metadata.
- Do not collapse the two token flows into one: the reviewed docs clearly distinguish machine-to-machine API Authentication from Connect code exchange/refresh behavior.

## Verification notes
This file was manually rebuilt from the live official Smartcar documentation and route-reference pages using browser inspection.