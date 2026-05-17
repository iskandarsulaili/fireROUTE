# Foursquare

## Provider metadata
- Category: `Social`
- Provider slug: `foursquare`
- Official docs pages used:
  - `https://foursquare.com/developer/`
  - `https://docs.foursquare.com/fsq-developers-places/reference/foursquare-apis-overview`
  - `https://docs.foursquare.com/fsq-developers-places/reference/authentication`
  - `https://docs.foursquare.com/fsq-developers-places/reference/place-search`
  - `https://docs.foursquare.com/fsq-developers-places/reference/rate-limits`
  - `https://docs.foursquare.com/fsq-developers-places/reference/errors`
- Main Places API base URL confirmed from the reviewed route pages: `https://places-api.foursquare.com`
- Users API base URL confirmed from the reviewed authentication page: `https://users-api.foursquare.com`
- OAuth host confirmed from the reviewed authentication page: `https://app.foursquare.com`
- Auth models confirmed by the reviewed authentication page:
  - service-key bearer auth
  - managed-user bearer auth minted via the Users API
  - third-party OAuth 2.0 authorization-code flow for Foursquare user accounts
- Request/response formats confirmed in the reviewed docs: query-string `GET` requests, bearer-token auth headers, JSON responses, version headers on Places and Users API calls
- Manually confirmed route count: `6`

## Authentication
- The reviewed official authentication page presents three supported modes: `Service Keys`, `Managed Users`, and `3rd Party Authentication`.
- Service keys authenticate Places API and Users API requests through `Authorization: Bearer <Service API Key>`.
- The reviewed Places examples use header `X-Places-Api-Version: 2025-06-17`.
- The reviewed Users API examples use header `X-Users-Api-Version: 2025-06-17`.
- Managed-user flows are created and refreshed with organization service keys, then return user-scoped access tokens for later Places API calls.
- Third-party auth uses an OAuth 2.0 authorization-code flow on `app.foursquare.com`.

## API-wide behavior
- The overview page groups the platform into Places API, Users API, Placemaker endpoints, Geotagging endpoints, and Offline Jobs endpoints.
- The reviewed docs explicitly separate Places routes on `places-api.foursquare.com` from Users routes on `users-api.foursquare.com`.
- The reviewed `Place Search` page confirms JSON responses and documented response codes `200`, `400`, and `401`.
- The official overview page lists many additional Places, Placemaker, Geotagging, and Offline Jobs routes beyond the subset manually extracted below.
- In this browser session, the official `Rate Limits` page rendered only its heading and the official `Errors` page later failed to render reliably, so no global numeric quota table or central error matrix could be confirmed from those two pages.

## Canonical endpoints

### 1) Search places
- Method: `GET`
- URL: `https://places-api.foursquare.com/places/search`
- Purpose: search the FSQ Places database by text plus a geographic bias or boundary
- Required header: `X-Places-Api-Version: 2025-06-17`
- Auth: bearer token in `Authorization`

Confirmed query parameters from the reviewed `Place Search` page:
- `query` - free-text match against place name, category, phone number, taste, chain name, and tips
- `ll` - latitude/longitude pair such as `41.8781,-87.6298`
- `radius` - bias radius in meters, `0` to `100000`; default shown as `22000`
- `fsq_category_ids` - comma-separated Foursquare category IDs
- `fsq_chain_ids` - comma-separated Foursquare chain IDs
- `exclude_fsq_chain_ids` - comma-separated chain IDs to exclude
- `exclude_all_chains` - boolean filter for places not known to be part of any chain
- `fields` - comma-separated response-field selector
- `min_price` - integer `1` to `4`
- `max_price` - integer `1` to `4`
- `open_at` - local day/time value in `DOWTHHMM` format, for example `1T2130`
- `open_now` - boolean filter for places open at request time
- `tel_format` - `NATIONAL` or `E164`
- `ne` - north/east coordinate of a rectangular search box
- `sw` - south/west coordinate of a rectangular search box
- `near` - geocodable locality string such as `Chicago, IL`
- `sort` - `RELEVANCE`, `RATING`, `DISTANCE`, or `POPULARITY`
- `limit` - number of results to return, `1` to `50`, default `10`

Important notes from the reviewed page:
- Location may be provided with `ll` plus optional `radius`, with `near`, or with `ne` plus `sw`.
- If none of those location inputs is passed, the docs say Place Search defaults to IP-biased geolocation with the optional `radius` parameter.
- Using `radius` omits global search results.
- The page says `open_at` cannot be used together with `open_now`.

Confirmed response codes shown on the reviewed page:
- `200` success
- `400` bad request
- `401` unauthorized

### 2) Create a managed user
- Method: `POST`
- URL: `https://users-api.foursquare.com/users/managed-user/create`
- Purpose: mint a managed user identity and access token without requiring the end user to have a Foursquare account
- Required header: `X-Users-Api-Version: 2025-06-17`
- Auth: `Authorization: Bearer <ORGANIZATION_SERVICE_KEY>`

Confirmed query parameters from the reviewed authentication page:
- `first_name` - optional first name used to identify the managed user
- `last_name` - optional last name used to identify the managed user

Confirmed response fields shown on the reviewed page:
- `user_id`
- `access_token`

### 3) Refresh a managed-user access token
- Method: `POST`
- URL: `https://users-api.foursquare.com/users/managed-user/refresh-token`
- Purpose: retrieve a fresh managed-user access token for a previously created managed user
- Required header: `X-Users-Api-Version: 2025-06-17`
- Auth: `Authorization: Bearer <ORGANIZATION_SERVICE_KEY>`

Confirmed query parameter from the reviewed authentication page:
- `target_user_id` - managed-user ID whose token should be refreshed

Confirmed response field shown on the reviewed page:
- `access_token`

### 4) Start third-party OAuth authorization
- Method: `GET`
- URL: `https://app.foursquare.com/oauth2/authenticate`
- Purpose: redirect a Foursquare user to approve the application and return an authorization code

Confirmed query parameters from the reviewed authentication page:
- `client_id` - required application client ID
- `response_type` - required and must be `code`
- `redirect_uri` - required registered callback URL
- `mode` - optional application-context selector; the reviewed page explicitly documents `mode=placemaker`

Flow note from the reviewed page:
- After approval, Foursquare redirects to the configured `redirect_uri` with `?code=CODE`.

### 5) Exchange an authorization code for an access token
- Method: `GET`
- URL: `https://app.foursquare.com/oauth2/access_token`
- Purpose: exchange an OAuth authorization code for a user access token

Confirmed query parameters from the reviewed authentication page:
- `client_id` - required client ID
- `client_secret` - required client secret
- `grant_type` - required and must be `authorization_code`
- `redirect_uri` - required and must exactly match the redirect URI used during authorization
- `code` - required temporary authorization code

Confirmed response field shown on the reviewed page:
- `access_token`

### 6) Create a short-lived Placemaker session token
- Method: `POST`
- URL: `https://users-api.foursquare.com/auth/session-token`
- Purpose: create a short-lived session token for embedded Placemaker web UI access
- Required header: `X-Users-Api-Version: 2025-06-17`
- Auth: `Authorization: Bearer <USERS_ACCESS_TOKEN>`

Confirmed response field shown on the reviewed authentication page:
- `session_token`

Important usage notes from the reviewed page:
- The returned token is used as `session_token` in `https://foursquare.com/placemakers/home?session_token=<SESSION_TOKEN>`.
- The reviewed docs say this session token expires after `10` minutes.

## Pagination
- The reviewed `Place Search` page exposes `limit` with a maximum of `50` and default `10`.
- No cursor, page-number, or offset parameter was visible on the reviewed search page.
- The reviewed official overview page lists other collection endpoints, but their pagination details were not manually expanded in this pass.

## Errors and rate limits
- The reviewed `Place Search` route page explicitly lists `200`, `400`, and `401` responses.
- The official `Rate Limits` page was reachable during review, but in this session it rendered only its heading and did not expose a numeric quota table.
- The official `Errors` page did not render reliably enough in this session to confirm a central error schema beyond the route-level codes visible on the reviewed endpoint page.

## Important usage notes
- The overview page makes clear that Foursquare's current developer offering is broader than one simple Places search API; it includes Places, Users, Placemaker, Geotagging, and Offline Jobs families.
- The authentication page recommends choosing the auth model based on whether you need organization-level automation, per-user attribution without Foursquare accounts, or direct Foursquare user authorization.
- Managed users are specifically positioned by the official docs as the path for per-user attribution in native product integrations where users do not need Foursquare accounts.
- The reviewed search docs rely heavily on `fields`, so fireROUTE adapters should request only the response fields they actually need.
