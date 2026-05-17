# Tebex

## Overview
- Provider: Tebex Plugin API
- Category: Games & Comics
- Official docs: `https://docs.tebex.io/plugin`
- Base URL: `https://plugin.tebex.io`
- Auth: server secret in `X-Tebex-Secret` on all Plugin API routes
- HTTPS: yes; the official auth page explicitly says all requests must be sent via HTTPS
- Response format: JSON
- Confirmed routes: `34`
- Important index correction: the category index still says `X-Mashape-Key`, but the current official Tebex docs require `X-Tebex-Secret`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/information` | none | Returns account and server metadata for the authenticated game server. |
| GET | `/queue` | none | Returns due players plus `meta.next_check`; docs warn clients must obey `next_check` or risk key revocation / IP bans. |
| GET | `/queue/offline-commands` | none | Returns offline commands that should be executed immediately. |
| GET | `/queue/online-commands/{player-id}` | path `player-id` | Returns commands due for one online player. |
| DELETE | `/queue` | none | Removes processed commands from the queue; docs show `204 No Content`. |
| GET | `/listing` | none | Deprecated. Docs say the associated documentation was removed and recommend the Headless API for in-game catalog display. |
| GET | `/packages` | none | Deprecated. Docs say the associated documentation was removed and recommend the Headless API. |
| GET | `/package/{package}` | path `package` | Deprecated package lookup route. |
| PUT | `/package/{package}` | path `package`; body `disabled`, `name`, `price` | Updates a package on the webstore. |
| GET | `/community_goals` | none | Lists all community goals on the account. |
| GET | `/community_goals/{community_goal}` | path `community_goal` | Retrieves one community goal by ID. |
| GET | `/payments` | query optional `limit` | Returns latest payments; docs say up to `100` payments. |
| GET | `/payments/{transaction}` | path `transaction` | Retrieves a payment by transaction ID. |
| GET | `/payments/fields/{package}` | path `package` | Returns required custom fields/options for creating a manual payment for a package. |
| POST | `/payments` | body `note`, `packages[]`, `packages[][id]`, `packages[][options]`, `price`, `ign` | Creates a manual payment from the control-panel side of Tebex. |
| PUT | `/payments/{transaction}` | path `transaction`; body `username`, `status` | Updates a payment; docs allow `status` values `complete`, `chargeback`, or `refund`. |
| POST | `/payments/{transaction}/note` | path `transaction`; body `note` | Adds a note to a payment. |
| POST | `/checkout` | body `package_id`, `username` | Creates a checkout URL and expiry timestamp for redirecting a player to the store. |
| GET | `/gift-cards` | none | Lists gift cards. |
| GET | `/gift-cards/{id}` | path `id` | Retrieves one gift card by numeric/string ID. |
| GET | `/gift-cards/lookup/{code}` | path `code` | Looks up a gift card by its code string. |
| POST | `/gift-cards` | body `amount`, optional `note`, optional `expires_at` | Creates a gift card of a specified amount. |
| DELETE | `/gift-cards/{id}` | path `id` | Voids a gift card so it cannot be used. |
| PUT | `/gift-cards/{id}` | path `id`; body `amount` | Tops up an existing gift card. |
| GET | `/coupons` | none documented | Returns a paginated coupon list. |
| GET | `/coupons/{id}` | path `id` | Retrieves one coupon by ID. |
| POST | `/coupons` | body `code`, `effective_on`, `packages[]`, `categories[]`, `discount_type`, `discount_amount`, `discount_percentage`, `redeem_unlimited`, `expire_never`, `expire_limit`, `expire_date`, `start_date`, `basket_type`, `minimum`, `discount_application_method`, `username`, `note` | Creates a coupon. Docs define `effective_on` as `package`, `category`, or `cart`. |
| DELETE | `/coupons/{id}` | path `id` | Deletes a coupon. |
| GET | `/bans` | none | Lists bans on the account. |
| POST | `/bans` | body `reason`, `ip`, `user` | Creates a ban against a player and/or IP address. |
| GET | `/sales` | none | Lists active sales on the account. |
| GET | `/user/{user}` | path `user` | Player lookup route. Docs say it is available only on Ultimate and above plans. |
| GET | `/player/:id/packages` | path `id`; query optional `package` | Lists active non-expired packages for a customer; docs use colon placeholder syntax here and expose optional package filtering. |
| POST | `/rpc/` | body `method`, `params.SecretKey`, `params.Path`, optional `params.Body` | JSON-RPC wrapper that forwards a Plugin API request; docs require the trailing slash. |

## Authentication
- Every Plugin API route in the reviewed docs requires the `X-Tebex-Secret` header.
- The authentication page says you obtain that secret from the game-server settings in the Tebex creator portal.
- The docs explicitly require HTTPS for all API requests.
- Live check: navigating to `https://plugin.tebex.io/information` without the header returned `403` with JSON:
  - `{"error_message":"Please specify a secret key via the X-Tebex-Secret header.","error_code":403}`

## Parameters and request-body notes
- Queue processing:
  - `GET /queue` returns `meta.next_check`; the docs say clients must wait that many seconds before the next poll.
  - `GET /queue/online-commands/{player-id}` uses the internal plugin player ID, not the external username/UUID field shown in queue results.
- Payments:
  - `GET /payments` supports `limit` and the docs also show paginated access with a `paged/page` query convention.
  - `GET /payments/fields/{package}` is the prerequisite for populating `packages[][options]` on manual payment creation.
  - `PUT /payments/{transaction}` uses `status` values `complete`, `chargeback`, or `refund`.
- Checkout:
  - `POST /checkout` requires `package_id` and `username`.
- Gift cards:
  - `POST /gift-cards` supports optional expiry timestamps in `yyyy-mm-dd hh:mm:ss`.
  - `PUT /gift-cards/{id}` only documents an `amount` body field for top-ups.
- Coupons:
  - `effective_on`: `package`, `category`, or `cart`
  - `discount_type`: `percentage` or `value`
  - `basket_type`: `single`, `subscription`, or `both`
  - `discount_application_method`: `0` apply to each package, `1` apply to basket before sales, `2` apply to basket after sales
- Customer purchases:
  - docs present the route as `/player/:id/packages?package=<package>`
  - query `package` filters to one package ID when you only need a yes/no purchase check
- RPC:
  - required JSON body fields are `method` and `params`
  - `params` must include `SecretKey` and `Path`
  - `params.Body` is used when forwarding POST/PUT style operations

## Pagination, rate limits, and errors
- Official rate limit: up to `500 requests` per `5 minutes`, scoped to the secret key.
- `GET /payments` has two documented list styles:
  - latest-payments view with optional `limit`
  - paginated view, where the docs show `GET /payments?paged=1` and response links such as `next_page_url=https://plugin.tebex.io/payments?page=3`
- `GET /coupons` returns a `pagination` object with `totalResults`, `currentPage`, `lastPage`, `previous`, and `next`.
- Queue-specific throttling note: the `next_check` value is mandatory, not advisory.
- Official error handling notes:
  - errors are JSON and based on standard HTTP status codes
  - invalid secret keys are documented as `403 Forbidden`
  - the `error_message` object/string is documented as user-friendly and suitable to show directly to clients
- RPC-specific documented responses include `400` for malformed RPC bodies, `403` for invalid secret keys, and forwarded `200` / `201` / `204` statuses from the underlying Plugin API route.

## Response-format notes
- All reviewed routes return JSON, including list responses, single-resource objects, and error bodies.
- Typical wrapper shapes vary by family:
  - plain objects for `/information`, `/checkout`, and RPC errors
  - `{ "data": ... }` for gift cards, coupons, bans, and sales
  - arrays for some payment and community-goal responses
- Payment and coupon list endpoints expose built-in pagination metadata in the JSON payload rather than headers.

## Important usage notes
- The Plugin API is primarily for game-server integrations and command execution, not generic storefront browsing.
- Tebex repeatedly points display/catalog use cases toward the separate Headless API; the old `/listing` and `/packages` discovery routes are still present in the docs but are deprecated.
- Player lookup is plan-gated: `/user/{user}` is documented as Ultimate-and-above only.
- RPC requires a trailing slash at `/rpc/`; the docs explicitly mark `/rpc` without the slash as incorrect.
- The docs mix placeholder styles in different sections (`{id}` vs `:id`) so fireROUTE should preserve the published path strings while normalizing variables internally.

## Integration notes for fireROUTE
- Treat Tebex as an authenticated game-server back-office API, not a public catalog/search API.
- Model queue polling carefully: `next_check` and offline-vs-online command separation are core provider semantics.
- Keep deprecated listing/package browse routes behind passthrough only and prefer the provider's Headless API if fireROUTE later documents that separate product.
- Preserve raw coupon and payment payload fields because Tebex uses store-specific concepts such as creator codes, custom option fields, and payment notes.

## Sources inspected
- `https://docs.tebex.io/plugin`
- `https://docs.tebex.io/plugin/rate-limits`
- `https://docs.tebex.io/plugin/authentication`
- `https://docs.tebex.io/plugin/error-handling`
- `https://docs.tebex.io/plugin/rpc`
- `https://docs.tebex.io/plugin/endpoints/information`
- `https://docs.tebex.io/plugin/endpoints/command-queue`
- `https://docs.tebex.io/plugin/endpoints/listing`
- `https://docs.tebex.io/plugin/endpoints/packages`
- `https://docs.tebex.io/plugin/endpoints/community-goals`
- `https://docs.tebex.io/plugin/endpoints/payments`
- `https://docs.tebex.io/plugin/endpoints/checkout`
- `https://docs.tebex.io/plugin/endpoints/gift-cards`
- `https://docs.tebex.io/plugin/endpoints/coupons`
- `https://docs.tebex.io/plugin/endpoints/bans`
- `https://docs.tebex.io/plugin/endpoints/sales`
- `https://docs.tebex.io/plugin/endpoints/player-lookup`
- `https://docs.tebex.io/plugin/endpoints/customer-purchases`
- live auth/error check: `https://plugin.tebex.io/information`
