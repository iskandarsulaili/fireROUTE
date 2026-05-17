# Yelp

## Provider metadata
- Category: `Open Data`
- Provider slug: `yelp`
- Description: `Yelp Places API plus related Yelp OAuth endpoints currently documented on the official Yelp Developer Portal`
- Official docs/pages used:
  - `https://www.yelp.com/developers/documentation/v3` (indexed legacy docs URL; currently returns Yelp's official 404 page)
  - `https://www.yelp.com/developers` (official Yelp Developers landing page linking to the current portal)
  - `https://docs.developer.yelp.com/` (official Yelp Developer Portal)
  - `https://docs.developer.yelp.com/docs/places-intro` (official Yelp Places API overview)
  - `https://docs.developer.yelp.com/docs/places-authentication` (official authentication guide)
  - `https://docs.developer.yelp.com/docs/places-rate-limiting` (official rate-limiting guide)
  - `https://business.yelp.com/data/products/places-api/` (official product/pricing page)
- Public API base URLs confirmed from the reviewed official pages:
  - `https://api.yelp.com/v3` for Yelp Places routes
  - `https://api.yelp.com/oauth2` for OAuth token-management routes
  - `https://api.yelp.com/ai/chat/v2` for the Yelp AI chat endpoint listed in the same official reference
- Auth model:
  - Yelp Places endpoints use a private API key via bearer-token `Authorization` header
  - OAuth endpoints use `client_id` and `client_secret` form fields for token issuance/revocation flows
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON for API responses and errors; OAuth token endpoints use `application/x-www-form-urlencoded` request bodies and return JSON; authorization-style errors are also documented on specific OAuth pages
- Rate limits: documented queries-per-second throttling plus daily quota headers; the trial guide states development-stage clients may be limited to hundreds of calls per 24 hours and the business product page publishes monthly paid plans with overage pricing
- Manually confirmed route count: `17`

## API shape and behavior
- The indexed legacy v3 docs URL is no longer the authoritative reference; it now returns Yelp's official 404 page.
- The current authoritative documentation is the official Yelp Developer Portal at `docs.developer.yelp.com`.
- The Yelp Places overview page explicitly says all Yelp Places endpoints live under `https://api.yelp.com/v3`.
- The current official reference page enumerates Places, Events, Categories, Reviews, AI chat, and OAuth routes in one API catalog.
- This file focuses on the public Yelp Places route families exposed by the official overview plus the token-management endpoints needed to understand the current auth surface.

## Canonical endpoints
1. `GET /businesses/search`
   - Search for businesses by keyword, category, location, price, and other filters.
2. `GET /businesses/search/phone`
   - Find businesses by phone number.
3. `GET /businesses/matches`
   - Match a business from external source data using exact business details.
4. `GET /businesses/{business_id_or_alias}`
   - Return detailed business information.
5. `GET /transactions/{transaction_type}/search`
   - Search businesses supporting a given transaction type; currently documented for food delivery.
6. `GET /businesses/engagement`
   - Return business engagement metrics.
7. `GET /businesses/{business_id_or_alias}/service_offerings`
   - Return active and eligible service offerings.
8. `GET /businesses/{business_id_or_alias}/reviews`
   - Return review excerpts for a business.
9. `GET /businesses/{business_id_or_alias}/review_highlights`
   - Return review highlights for a business.
10. `GET /events`
   - Search Yelp events.
11. `GET /events/{event_id}`
   - Return detailed event information.
12. `GET /events/featured`
   - Return the featured event for a location.
13. `GET /categories`
   - Return all Yelp business categories.
14. `GET /categories/{alias}`
   - Return details for one category alias.
15. `GET /autocomplete`
   - Return suggestions for terms, businesses, and categories.
16. `POST /oauth2/revoke`
   - Revoke an access token.
17. `POST /oauth2/token/v3`
   - Exchange an authorization code or refresh token for access tokens.

## Confirmed parameters
### Shared Yelp Places auth and localization
- Bearer-token `Authorization` header - required bearer auth for Yelp Places endpoints.
- `locale` - optional on many read endpoints; format `{language code}_{country code}`.

### `GET /businesses/search`
Confirmed from the official endpoint reference:
- `location` - required unless latitude/longitude are both provided.
- `latitude` - required if `location` is omitted; must be paired with `longitude`.
- `longitude` - required if `location` is omitted; must be paired with `latitude`.
- `term` - optional free-text query.
- `radius` - optional search radius in meters; max `40000`.
- `categories` - optional comma-delimited category aliases.
- `price` - optional comma-delimited pricing levels `1..4`.
- `open_now` - optional boolean.
- `open_at` - optional Unix timestamp; cannot be combined with `open_now`.
- `attributes` - optional attribute filter list; docs include public filters such as `hot_and_new`, `request_a_quote`, `reservation`, `waitlist_reservation`, `gender_neutral_restrooms`, `open_to_all`, `wheelchair_accessible`, plus additional premium-plan filters.
- `sort_by` - optional; `best_match`, `rating`, `review_count`, or `distance`.
- `limit` - optional; `0..50`, default `20`.
- `offset` - optional; `0..1000`.
- Additional reservation-related parameters visible on the official page include `device_platform`, `reservation_date`, `reservation_time`, `reservation_covers`, and `matches_party_size_param`.

### `GET /businesses/search/phone`
- `phone` - required E.164-style number beginning with `+`.
- `locale` - optional.

### `GET /businesses/matches`
Confirmed from the official page:
- `name` - required business name.
- `address1` - required first address line.
- `address2` - optional.
- `address3` - optional.
- `city` - required.
- `state` - required ISO 3166-2 style state code.
- `country` - required ISO 3166-1 alpha-2 code.
- `postal_code` - optional.
- `latitude` / `longitude` - optional location coordinates shown on the page.
- `phone` - optional on the full endpoint page.
- `locale` - optional.

### `GET /businesses/{business_id_or_alias}`
- Path parameter `business_id_or_alias` - required Yelp business ID or alias.
- `locale` - optional.
- `device_platform` - optional enum: `android`, `ios`, `mobile-generic`.

### `GET /transactions/{transaction_type}/search`
- Path parameter `transaction_type` - required; current docs show only `delivery`.
- `latitude` / `longitude` or `location` - required location inputs.
- `term` - optional.
- `categories` - optional.
- `price` - optional.

### `GET /businesses/{business_id_or_alias}/reviews`
- Path parameter `business_id_or_alias` - required.
- `locale` - optional.
- `offset` - optional `0..1000`.
- `limit` - optional `0..50`, default `20`.
- `sort_by` - optional enum; docs currently show `yelp_sort`.

### `GET /events`
- `location` or `latitude` + `longitude` - required location input.
- `offset` - optional `0..1000`.
- `limit` - optional `0..50`, default `3`.
- `sort_by` - optional `asc` or `desc`.
- `sort_on` - optional `popularity` or `time_start`.
- `start_date` - optional Unix timestamp.
- `end_date` - optional Unix timestamp.
- `categories` - optional event category aliases.
- `is_free` - optional boolean.
- `excluded_events` - optional list of event IDs.
- `radius` - optional meters, max `40000`.
- `locale` - optional.

### `GET /events/{event_id}`
- Path parameter `event_id` - required event identifier.
- `locale` - optional on the official event-detail page.

### `GET /events/featured`
- `location` or `latitude` + `longitude` - required location input.
- `locale` - optional.

### `GET /categories`
- `locale` - optional locale filter / translation selector.

### `GET /categories/{alias}`
- Path parameter `alias` - required category alias.
- `locale` - optional.

### `GET /autocomplete`
- `text` - required search text.
- `locale` - optional.
- `latitude` / `longitude` - optional but recommended location context.

### `POST /oauth2/token/v3`
Confirmed from the official token-v3 page:
- `client_id` - required.
- `client_secret` - required.
- `grant_type` - required; `authorization_code` or `refresh_token` depending on the flow.
- `code` - required for authorization-code exchange.
- `redirect_uri` - conditionally required.
- `refresh_token` - required for refresh flow.
- Body format: `application/x-www-form-urlencoded`.

### `POST /oauth2/revoke`
- `client_id` - required.
- `client_secret` - required.
- `token` - required token to revoke.
- `token_type_hint` - optional; `access_token` or `refresh_token`.
- Body format: `application/x-www-form-urlencoded`.

## Response, pagination, and rate-limit notes
- Search results are capped to `240` businesses total according to the official Search page, with paged access via `limit` and `offset`.
- The rate-limiting guide documents both per-second throttling and daily quota limits.
- The guide shows rate-limit response headers:
  - `RateLimit-DailyLimit`
  - `RateLimit-Remaining`
  - `RateLimit-ResourceDailyLimit`
  - `RateLimit-ResourceRemaining`
  - `RateLimit-ResetTime`
- The rate-limiting guide documents two distinct `429` error codes:
  - `TOO_MANY_REQUESTS_PER_SECOND`
  - `ACCESS_LIMIT_REACHED`
- The business product page also publishes current monthly plan tiers and overage pricing for commercial Places API access.

## Response and error notes
### Yelp Places endpoint response families repeatedly documented on the reviewed official pages
- `200` - success
- `400` - bad request / invalid request
- `401` - unauthorized; examples include `UNAUTHORIZED_API_KEY` and `TOKEN_INVALID`
- `403` - authorization error / insufficient scope or plan
- `404` - resource not found
- `413` - payload too large / request too long
- `429` - QPS or daily-rate-limit breach
- `500` - internal server error
- `503` - service unavailable

### Generic API error structure from Yelp's official error guide
- Non-200 responses return JSON with an `errors` array.
- The guide documents fields including:
  - `object`
  - `error_code`
  - `error_message`
  - `more_info`
- Common listed generic error codes include `FIELD_REQUIRED`, `VALIDATION_ERROR`, `UNAUTHORIZED`, and `INTERNAL_SERVER_ERROR`.

## Important usage notes
- The old `www.yelp.com/developers/documentation/v3` URL should be treated as stale; use `docs.developer.yelp.com` instead.
- The official auth guide says private API keys are created through the Yelp developer app-management workflow and must be kept secret.
- The official docs repeatedly note that Yelp Places endpoints do not return businesses without reviews.
- The transaction-search page says only food delivery in the US is currently supported for `transaction_type`.
- The reviews endpoint page says access requires at least the Enhanced or Premium Places plan.
- The product page shows plan-gated features such as review excerpts, review highlights, photo counts, and premium search filters.

## fireROUTE normalization notes
- Preserve the `https://api.yelp.com/v3` prefix for Places endpoints.
- Preserve path parameters exactly as documented (`business_id_or_alias`, `transaction_type`, `event_id`, `alias`).
- Keep Yelp's native `limit` + `offset` pagination instead of remapping it.
- Preserve the provider's bearer-token auth and rate-limit headers in passthrough mode.
- Treat OAuth token-management routes under `/oauth2` as separate from the private-API-key Places surface, even though both live on `api.yelp.com`.