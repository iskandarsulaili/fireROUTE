# Pinterest

## Provider metadata
- Category: `Social`
- Provider slug: `pinterest`
- Official docs pages manually reviewed in this correction pass:
  - `https://developers.pinterest.com/docs/api/v5/introduction/`
  - `https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/`
- Official docs data manually inspected from the live page DOM in this pass:
  - the `apiRefPaths` application/json payload embedded in the v5 introduction page
  - the `allEndpointDetails` application/json payload embedded in the auth/docs page
- Main API base URL confirmed from the live docs payload: `https://api.pinterest.com/v5`
- Sandbox API base URL documented by Pinterest's official auth docs for this provider: `https://api-sandbox.pinterest.com/v5`
- OAuth browser endpoint: `https://www.pinterest.com/oauth/`
- Auth models used by the official Pinterest docs for this provider:
  - OAuth 2.0 authorization code flow
  - OAuth 2.0 client credentials flow
  - OAuth 2.0 refresh token flow
  - Bearer access tokens for API calls
  - HTTP Basic auth with `client_id:client_secret` for token operations
- Request/response formats observed across the official docs: browser redirects for OAuth approval, form-urlencoded token requests, bearer-token API requests, and JSON API responses
- Manually confirmed route count from the current official embedded route catalog: `256`

## Authentication
- Pinterest's official auth docs still route browser authorization through `https://www.pinterest.com/oauth/`.
- Token operations are part of the official v5 HTTPS API surface and are documented under the same provider docs as the REST API.
- API calls use bearer access tokens in the `Authorization` header.
- Token-generation operations use HTTP Basic auth with `client_id:client_secret`.
- The official auth docs for this provider describe `authorization_code`, `client_credentials`, and `refresh_token` grant usage.

## Core auth endpoints confirmed

### 1) Start OAuth authorization
- Method: `GET`
- URL: `https://www.pinterest.com/oauth/`
- Purpose: send the user through Pinterest approval and redirect back with an authorization code
- Official auth-guide parameters documented for this provider:
  - `client_id`
  - `redirect_uri`
  - `response_type=code`
  - `scope`
  - `state`

### 2) Generate OAuth access token
- Method: `POST`
- Path: `/oauth/token`
- Base URL: `https://api.pinterest.com/v5`
- Purpose: exchange an authorization code, client-credentials request, or refresh token for an access token depending on grant type
- Auth: HTTP Basic auth using `client_id:client_secret`
- Content type: `application/x-www-form-urlencoded`

### 3) Generate conversion-specific OAuth token
- Method: `POST`
- Path: `/oauth/conversion_token`
- Base URL: `https://api.pinterest.com/v5`
- Purpose: mint the long-lived OAuth token dedicated to the conversions API
- Auth: HTTP Basic auth using `client_id:client_secret`

### 4) Revoke token
- Method: `POST`
- Path: `/oauth/token/revoke`
- Base URL: `https://api.pinterest.com/v5`
- Purpose: revoke an access token or refresh token
- Official docs note observed in the live endpoint catalog: only tokens issued for system users are currently supported

## Official route inventory confirmed from the current docs payload
- The live Pinterest docs embed `256` distinct method+path operations.
- The current docs group them into these provider-controlled route families:
  - `Pin and Boards` - `39` operations
  - `Campaign Management` - `54` operations
  - `Targeting` - `28` operations
  - `Ad Formats` - `16` operations
  - `Billing` - `14` operations
  - `Business Access` - `27` operations
  - `Conversions` - `16` operations
  - `Others` - `28` operations
  - `Shopping` - `34` operations

## Representative endpoint paths by official route group

### Pin and Boards
Representative confirmed operations from the live route catalog:
- `POST /pins` - create pin
- `GET /pins` - list pins
- `GET /pins/analytics` - get multiple pin analytics
- `GET /pins/{pin_id}` - get pin
- `PATCH /pins/{pin_id}` - update pin
- `DELETE /pins/{pin_id}` - delete pin
- `GET /pins/{pin_id}/analytics` - get pin analytics
- `POST /pins/{pin_id}/save` - save pin
- `POST /boards` - create board
- `GET /boards` - list boards
- `GET /boards/{board_id}` - get board
- `PATCH /boards/{board_id}` - update board
- `DELETE /boards/{board_id}` - delete board
- `GET /boards/{board_id}/pins` - list pins on board
- `GET /boards/{board_id}/sections` - list board sections
- `POST /boards/{board_id}/sections` - create board section
- `DELETE /boards/{board_id}/sections/{section_id}` - delete board section
- `PATCH /boards/{board_id}/sections/{section_id}` - update board section
- `GET /boards/{board_id}/sections/{section_id}/pins` - list pins on board section
- `GET /media` / `POST /media` / `GET /media/{media_id}` - media upload registration and status
- `POST /pins/{pin_id}/product_tags` / `GET /pins/{pin_id}/product_tags` / `POST /pins/{pin_id}/product_tags/bulk-delete` - product tagging on pins
- `GET /user_account` - get user account
- `GET /user_account/analytics` - get user-account analytics
- `GET /user_account/analytics/top_pins` - top pin analytics
- `GET /user_account/analytics/top_video_pins` - top video pin analytics
- `GET /user_account/businesses` - list linked businesses
- `GET /user_account/followers` - list followers
- `GET /user_account/following` - list following
- `GET /user_account/following/boards` - list followed boards
- `POST /user_account/following/{username}` - follow user
- `GET /user_account/websites` / `POST /user_account/websites` / `DELETE /user_account/websites` - website-claim lifecycle
- `GET /user_account/websites/verification` - website verification code
- `GET /users/{username}/interests/follow` - list followed interests

Important usage notes visible in the official descriptions:
- Many content routes are scoped to the current `operation user_account`.
- Several content routes support optional `ad_account_id` business-access context.
- Some analytics and pin-update routes are explicitly marked beta or restricted in the official descriptions.

### Campaign Management
Representative confirmed operations:
- `GET /ad_accounts`
- `POST /ad_accounts`
- `GET /ad_accounts/{ad_account_id}`
- `GET /ad_accounts/{ad_account_id}/analytics`
- `GET|POST /ad_accounts/{ad_account_id}/mmm_reports`
- `GET|POST /ad_accounts/{ad_account_id}/reports`
- plus extensive campaign, ad-group, ad, keyword, targeting-template, report, and analytics surfaces inside the same official group

### Targeting
Representative confirmed operations:
- `POST /ad_accounts/{ad_account_id}/audiences`
- `GET /ad_accounts/{ad_account_id}/audiences`
- `PATCH /ad_accounts/{ad_account_id}/audiences/{audience_id}`
- `GET /ad_accounts/{ad_account_id}/audiences/{audience_id}`
- `GET|POST /ad_accounts/{ad_account_id}/customer_lists`
- `GET|PATCH /ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}`
- plus additional targeting-template and audience-management routes in the same official group

### Ad Formats
Representative confirmed operations:
- `GET|POST|PATCH /ad_accounts/{ad_account_id}/lead_forms`
- `GET /ad_accounts/{ad_account_id}/lead_forms/{lead_form_id}`
- `POST /ad_accounts/{ad_account_id}/lead_forms/{lead_form_id}/test`
- `GET|POST /ad_accounts/{ad_account_id}/leads/subscriptions`
- `GET /ad_accounts/{ad_account_id}/leads/subscriptions/{subscription_id}`
- plus related lead-ads subscription and format-specific management routes

### Billing
Representative confirmed operations:
- `GET /ad_accounts/{ad_account_id}/ads_credit/discounts`
- `POST /ad_accounts/{ad_account_id}/ads_credit/redeem`
- `GET /ad_accounts/{ad_account_id}/billing_invoice/{billing_invoice_id}/download`
- `GET /ad_accounts/{ad_account_id}/billing_invoices`
- `GET /ad_accounts/{ad_account_id}/billing_profiles`
- `GET /ad_accounts/{ad_account_id}/ssio/accounts`
- `POST|PATCH /ad_accounts/{ad_account_id}/ssio/insertion_orders`

### Business Access
Representative confirmed operations:
- `POST|PATCH|DELETE /businesses/{business_id}/asset_groups`
- `GET /businesses/{business_id}/assets`
- `GET /businesses/{business_id}/assets/{asset_id}/members`
- `GET /businesses/{business_id}/assets/{asset_id}/partners`
- `PATCH|DELETE /businesses/{business_id}/members/assets/access`
- plus further business-member, partner, invite, and permission-management routes in the same official group

### Conversions
Representative confirmed operations:
- `POST /ad_accounts/{ad_account_id}/events` - send conversions
- `GET /ad_accounts/{ad_account_id}/conversion_eqs`
- `GET|POST /ad_accounts/{ad_account_id}/conversion_tags`
- `GET /ad_accounts/{ad_account_id}/conversion_tags/ocpm_eligible`
- `GET /ad_accounts/{ad_account_id}/conversion_tags/page_visit`
- `GET /ad_accounts/{ad_account_id}/conversion_tags/{conversion_tag_id}`
- `GET /ad_accounts/{ad_account_id}/advertiser_defined_events`

### Others
Representative confirmed operations:
- `POST /advanced_auction/items/get`
- `POST /advanced_auction/items/submit`
- `GET /integrations`
- `POST /integrations/commerce`
- `DELETE|GET|PATCH /integrations/commerce/{external_business_id}`
- `POST /integrations/logs`
- plus additional utility and integration routes under the same official group

### Shopping
Representative confirmed operations:
- `GET|POST /catalogs`
- `GET /catalogs/available_filter_values`
- `GET|POST /catalogs/feeds`
- `GET|PATCH|DELETE /catalogs/feeds/{feed_id}`
- plus broader catalog, product-group, hotel, creative-assets, item-processing, and retailer/shopping-management routes in the same official group

## Parameters, pagination, and format notes
- The live embedded route catalog clearly exposes methods, paths, summaries, and route-group membership for the `256` confirmed operations.
- In this pass, the rendered Pinterest docs did not expose stable parameter tables inline through the browser snapshot for every route, so parameter-level details remain endpoint-specific and should be rechecked on the official operation page when implementing a particular call.
- Pinterest's API is JSON-over-HTTPS for normal REST routes, while token-exchange routes use form-urlencoded request bodies.
- List and analytics endpoints are numerous, but the current structured docs payload reviewed in this pass did not expose one provider-wide pagination contract; treat pagination and filter parameters as per-operation concerns.

## Rate limits
- The official pages and embedded route catalog reviewed in this pass did not expose a stable global numeric rate-limit table.
- No provider-wide request-per-minute cap was manually confirmable from the current official docs surface during this correction pass.

## Errors and usage notes
- The official route descriptions repeatedly distinguish between the token user and the effective `operation user_account`.
- Multiple routes note optional `ad_account_id` business-access behavior in the official descriptions.
- Some analytics and update routes are explicitly marked beta or restricted in the official descriptions and should not be assumed available to every app.
- The official route catalog is much broader than the previous weak doc's subset; fireROUTE should treat Pinterest as a large multi-surface REST provider rather than an 8-route integration.

## fireROUTE normalization note
- Model Pinterest as one OAuth-protected REST provider with a very large route surface spread across content, ads, targeting, business access, conversions, integrations, and shopping.
- Prefer endpoint-family routing and scoped capabilities instead of flattening the provider down to only the token and basic board/pin endpoints.
