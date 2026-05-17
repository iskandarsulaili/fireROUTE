# OpenAPIHub

## Provider metadata
- Category: `Development`
- Provider slug: `openapihub`
- Docs/site reviewed manually:
  - `https://hub.openapihub.com/`
  - `https://hub.openapihub.com/assets/json/runtime.json`
  - `https://www.openapihub.com/en-us/about`
  - `https://hub.openapihub.com/js/app.625a17e6.js`
  - `https://hub.openapihub.com/js/chunk-50711a20.f224de69.js`
- Confirmed API base URL in this pass: `https://marketplace-api.openapihub.com`
- Additional first-party API hosts exposed by official runtime config but not route-counted here:
  - `https://developer-portal-api.openapihub.com`
  - `https://provider-portal-api.openapihub.com`
- Primary media type observed: `application/json`
- Manually confirmed routes in this pass: `13`

## Manual first-party findings
- The live marketplace homepage is no longer just marketing copy. Its official runtime configuration and shipped first-party JavaScript expose a current OpenAPIHub marketplace API host and concrete route inventory used by the public site.
- `https://hub.openapihub.com/assets/json/runtime.json` returned JSON with:
  - `API_URL = https://marketplace-api.openapihub.com`
  - `DEVELOPER_PORTAL_API_URL = https://developer-portal-api.openapihub.com`
  - `PROVIDER_PORTAL_API_URL = https://provider-portal-api.openapihub.com`
- The reviewed first-party JavaScript bundles explicitly construct request URLs, HTTP methods, query parameters, and in some cases POST bodies for marketplace operations.
- Live browser fetches against the marketplace API confirmed JSON responses and current error behavior on the reviewed routes.

## Authentication
Observed from the official site runtime and live responses:
- public listing/data routes can be called without an interactive login, but some guest routes still enforce policy checks and may return `403` with `{"opa_result":{"allow":false},"message":"Unauthorized by OPA"}` depending on the route/filters/context
- developer-scoped routes return `401` when called without an authenticated developer session
- no public API key, Bearer token format, or rate-limit header contract was published on the reviewed marketplace pages
- the official site also exposes developer/provider portal API hosts, which strongly suggests session-based authenticated flows outside the marketplace listing surface, but those route inventories were not confirmed in this pass

## Common request/response conventions
- Confirmed base URL: `https://marketplace-api.openapihub.com`
- Confirmed route styles:
  - REST-like collection route: `/static_content_store`
  - RPC-style routes under `/rpc/...`
  - supporting auth/billing paths such as `/oauth/expired` and `/billing/stripe/checkout-session`
- Confirmed response format: JSON arrays or JSON objects with `content-type: application/json; charset=utf-8`
- Confirmed list-query conventions from first-party JS and live calls:
  - `limit`
  - `offset`
  - `order`
  - field filters such as `provider_short_id=eq.{value}` and `category=eq.{value}`
  - text search such as `search_text={value}`
- Confirmed list-count behavior:
  - first-party JS sends `Prefer: count=exact` on listing routes
  - live responses include `content-range` headers such as `0-1/*`, `0-44/*`, and `*/0`

## Manually confirmed endpoint set

### 1) Static content store
- Method: `GET`
- Path: `/static_content_store`
- Full base pattern: `https://marketplace-api.openapihub.com/static_content_store`
- Purpose: fetch marketplace taxonomy/reference data used by the public site
- Confirmed query parameter:
  - `category_code=eq.{value}`
- Confirmed official usages from first-party JS and live fetches:
  - `category_code=eq.api_category`
  - `category_code=eq.provider_industry`
- Confirmed response shape:
  - JSON array of objects with fields such as `id`, `category_code`, `content_key`, and `content_value`

### 2) OAuth expired check
- Method: `GET`
- Path: `/oauth/expired`
- Full URL: `https://marketplace-api.openapihub.com/oauth/expired`
- Purpose: session/auth state check used by the marketplace frontend
- Live response observed without auth: `401` with empty body

### 3) Listing page API cards
- Method: `GET`
- Path: `/rpc/listing_page_get_api_cards`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/listing_page_get_api_cards`
- Purpose: return API catalogue cards for public listing pages
- Confirmed query parameters from first-party JS:
  - `order=verification_status.desc,request_count.desc.nullslast,name.asc`
  - `limit`
  - `offset`
  - `my_uploaded_api=eq.{bool}`
  - `subscribed_api=eq.{bool}`
  - `accessibility=eq.{apiType}`
  - `groups=cs.{group}`
  - `category=eq.{encodedCategory}`
  - `provider_short_id=eq.{shortId}`
  - `provider_tier=neq.Starter` when the frontend hides starter-tier providers
  - `search_text={lowercased text}`
- Confirmed request header used by the site: `Prefer: count=exact`
- Live response observed: `200` with JSON API-card objects and `content-range`

### 4) Listing page provider cards
- Method: `GET`
- Path: `/rpc/listing_page_get_provider_cards`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/listing_page_get_provider_cards`
- Purpose: return provider cards for the public marketplace listing pages
- Confirmed query parameters from first-party JS:
  - `limit`
  - `offset`
  - `industry=eq.{industryName}`
  - `provider_short_id=eq.{shortId}`
  - `search_text={text}`
- Confirmed request header used by the site: `Prefer: count=exact`
- Live response observed: `200` with JSON array and `content-range`; the unfiltered call returned an empty array in this pass

### 5) Guest accessible API cards
- Method: `GET`
- Path: `/rpc/guest_get_accessible_api_cards`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/guest_get_accessible_api_cards`
- Purpose: guest-scoped API-card retrieval route used by the frontend
- Confirmed query parameters from first-party JS:
  - `order=verification_status.desc,request_count.desc.nullslast,name.asc`
  - `limit`
  - optional `provider_short_id=eq.{shortId}`
  - optional `provider_tier=neq.Starter`
- Live responses observed:
  - `403` with `{"opa_result":{"allow":false},"message":"Unauthorized by OPA"}` on a direct anonymous call without additional context
  - `200` with `[]` on a filtered call using `provider_short_id=eq.74old`

### 6) Guest accessible provider info
- Method: `GET`
- Path: `/rpc/guest_get_accessible_provider_info`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/guest_get_accessible_provider_info`
- Purpose: fetch guest-visible provider detail by short ID
- Confirmed query parameter:
  - `short_id`
- Live response observed for `short_id=74old`: `400` with `{"code":"P0001","message":"Provider Migrated"}`

### 7) Guest accessible API info
- Method: `GET`
- Path: `/rpc/guest_get_accessible_api_info`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/guest_get_accessible_api_info`
- Purpose: fetch guest-visible API detail by short ID
- Confirmed query parameters from first-party JS:
  - `short_id`
  - optional `subscription_plan_id`
- Live response observed for `short_id=o8ec6`: `400` with `{"code":"P0001","message":"API Migrated"}`

### 8) Developer accessible API cards
- Method: `GET`
- Path: `/rpc/developer_get_accessible_api_cards`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/developer_get_accessible_api_cards`
- Purpose: developer-session variant of the accessible API-card listing flow
- Confirmed query parameters from first-party JS:
  - `order=verification_status.desc,request_count.desc.nullslast,name.asc`
  - `limit`
  - `offset`
  - `my_uploaded_api=eq.{bool}`
  - `subscribed_api=eq.{bool}`
  - `accessibility=eq.{apiType}`
  - `groups=cs.{group}`
  - `category=eq.{encodedCategory}`
  - `provider_short_id=eq.{shortId}`
  - `provider_tier=neq.Starter`
  - `search_text={lowercased text}`
- Live response observed without auth: `401`

### 9) Developer accessible provider info
- Method: `GET`
- Path: `/rpc/developer_get_accessible_provider_info`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/developer_get_accessible_provider_info`
- Purpose: developer-session provider-detail lookup by short ID
- Confirmed query parameter:
  - `short_id`
- Live response observed without auth: `401`

### 10) Developer accessible API info
- Method: `GET`
- Path: `/rpc/developer_get_accessible_api_info`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/developer_get_accessible_api_info`
- Purpose: developer-session API-detail lookup by short ID
- Confirmed query parameters from first-party JS:
  - `short_id`
  - optional `subscription_plan_id`
- Live response observed without auth: `401`

### 11) Developer current subscribed plan
- Method: `GET`
- Path: `/rpc/developer_current_subscribed_plan`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/developer_current_subscribed_plan`
- Purpose: retrieve a developer's current subscription plan for an API
- Confirmed query parameter from first-party JS:
  - `api_id`
- Live response observed without auth: `401`

### 12) Developer subscribe API plan
- Method: `POST`
- Path: `/rpc/developer_subscribe_api_plan`
- Full base pattern: `https://marketplace-api.openapihub.com/rpc/developer_subscribe_api_plan`
- Purpose: create/update a developer subscription to an API plan
- Confirmed JSON body fields from first-party JS:
  - `plan_id`
  - `plan_version`
- Live responses observed:
  - `401` on a POST without an authenticated developer session
  - `404` with `{"message":"no Route matched with those values"}` when incorrectly called as `GET`

### 13) Stripe checkout session
- Method: `POST`
- Path: `/billing/stripe/checkout-session`
- Full base pattern: `https://marketplace-api.openapihub.com/billing/stripe/checkout-session`
- Purpose: create a Stripe checkout session for an API subscription purchase
- Confirmed JSON body fields from first-party JS:
  - `developer_profile_id`
  - `api_subscription_plan_id`
  - `api_subscription_plan_version`
  - `success_url`
  - `cancel_url`
- Live response observed with dummy payload: `500` with `{"message":"Internal Server Error"}`

## Pagination
- `listing_page_get_api_cards` and `listing_page_get_provider_cards` both use offset pagination via `limit` and `offset`
- the frontend explicitly requests exact counts with `Prefer: count=exact`
- live responses expose `content-range`, which is useful for total/result-window handling
- guest/developer accessible card routes also accept `limit`, and the developer-card variant accepts `offset`

## Rate limits and quotas
- no request-per-second, burst, or quota header contract was published in the reviewed first-party marketplace pages or runtime assets
- pricing/subscription concepts exist on the site, but the reviewed material did not expose a public API rate-limit table for the marketplace endpoints themselves

## Error and response notes
Observed directly from live official responses in this pass:
- `400` application errors can return structured JSON such as:
  - `{"code":"P0001","message":"Provider Migrated"}`
  - `{"code":"P0001","message":"API Migrated"}`
- `401` is used for unauthenticated developer/session-required routes and for `/oauth/expired`
- `403` can return an OPA policy payload: `{"opa_result":{"allow":false},"message":"Unauthorized by OPA"}`
- `404` can return `{"message":"no Route matched with those values"}` when the wrong method/path combination is used
- `500` can return `{"message":"Internal Server Error"}`

## Important usage notes
- OpenAPIHub's currently visible platform API is a marketplace/supporting API rather than a classic hand-written public developer reference page
- the strongest route evidence in this pass came from official runtime config, official first-party shipped JavaScript, and live first-party JSON responses from the marketplace API host
- the reviewed site exposes three API hostnames, but only the marketplace host had route-level evidence strong enough for fireROUTE documentation in this pass
- several routes are clearly session-sensitive; fireROUTE should treat anonymous and authenticated developer flows separately
- some entity-detail lookups can return migration errors instead of canonical records, so callers should handle moved/migrated catalogue entries gracefully

## Verification notes
This file was manually rebuilt from live official-site browser review plus direct inspection of official first-party runtime and JavaScript assets using browser/file tools only.
