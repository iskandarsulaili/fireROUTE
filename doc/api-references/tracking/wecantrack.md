# WeCanTrack

## Provider metadata
- Category: `Tracking`
- Provider slug: `wecantrack`
- Official docs used manually: `https://docs.wecantrack.com/`
- Main authenticated API base URL: `https://api.wecantrack.com`
- Public clickout base URL documented separately: `https://wct-1.com`
- Auth model: API key required for private API; send as `api_key` query parameter or `X-API-Key` header
- Response formats documented: JSON for API endpoints, JavaScript for website script retrieval

## Authentication and rate limiting
Official docs state:
- every private API call requires an API key
- API key may be sent as `?api_key=...` or `X-API-Key: ...`
- rate limit headers include:
  - `x-ratelimit-limit`
  - `x-ratelimit-remaining`
  - `x-ratelimit-reset` (UNIX timestamp)
- each endpoint can have a different limit depending on cost
- exceeding the limit returns HTTP `429 Too Many Request`
- the public clickout endpoint is specifically IP-throttled to `30 requests per minute`

## Confirmed API surface
Official docs enumerate these route families and operations:
- `POST /api/v1/clickout`
- `GET /api/v1/websites`
- `POST /api/v1/websites`
- `PATCH /api/v1/websites`
- `DELETE /api/v1/websites`
- `GET /api/v1/websites/script`
- `GET /api/v2/network_accounts`
- `GET /api/v2/networks`
- `GET /api/v2/clicks/aggregation`
- `GET /api/v3/transactions`
- `POST /api/public/v1/clickout`

## 1) Private clickout
- Method: `POST`
- Path: `/api/v1/clickout`
- Full URL: `https://api.wecantrack.com/api/v1/clickout`
- Purpose: register a click and return a modified affiliate URL containing tracking data

Request headers:
- `Content-Type: application/json`

Documented body parameters:
- `affiliate_url` - required for click tracking and attribution; RFC 3986 URL-encoded affiliate URL
- `clickout_url` - optional for click tracking, required for attribution
- `redirect_url` - optional
- `_ga` - optional for click tracking, required for attribution
- `_wctrck` - optional for click tracking, required for attribution
- `metadata` - optional JSON object
- `custom_index_1..5` - optional custom indexed values
- `user_click_reference` - optional custom click reference
- `click_id_placeholder` - optional placeholder defining where click ID should be injected
- `ip` - optional IP address
- `ua` - optional user agent

Documented responses:
- `200` with body containing modified `affiliate_url`
- `299` warning body with `warning`
- `400` error body with `error`

Provider implementation note:
- docs explicitly recommend a fallback that redirects users to the original affiliate URL if the API call takes too long or fails

## 2) List websites
- Method: `GET`
- Path: `/api/v1/websites`
- Full URL: `https://api.wecantrack.com/api/v1/websites`
- Purpose: retrieve website records

Documented query parameters:
- `id` - optional website ID
- `url` - optional website URL

Response notes:
- example returns an array of website objects with fields such as `id`, `url`, and `active`

## 3) Create website
- Method: `POST`
- Path: `/api/v1/websites`
- Full URL: `https://api.wecantrack.com/api/v1/websites`
- Purpose: create a website/integration record

Request headers:
- `Content-Type: application/json`

Documented payload fields:
- `url` - required valid URL
- `active` - optional boolean
- `ga_tracking_id` - optional UA-style tracking ID
- `fb_pixel_id` - optional integer
- `fb_access_token` - optional string
- `microsoft_ads_tag_id` - optional integer
- `pop_ads_aid`, `tiktok_access_token`, `tiktok_pixel_code`, `revcontent_key`, `propellerads_tid`, `propellerads_aid`, `snapchat_pixel_id`, `zeropark_account_id`, `adsterra_username`, `ga_api_secret`, `ga_measurement_id` - optional integration fields
- `mgid_currency_id` - optional; one of `USD`, `EUR`, `CAD`, `AUD`, `INR`, `GBP`, `ZAR`
- `google_ads_tag_id` - optional string in `AW-.../...` shape
- `dynamic_content` - optional boolean
- `wordpress` - optional boolean
- `redirect_through` - optional; one of `default`, `https://wct-2.com`, `https://wct-1.com`, `https://offer-go.com/r`, `custom`
- `proxy` - optional valid URL
- `do_not_modify_links` - optional boolean
- `ip_anonymization` - optional integer in `0`, `1`, `2`
- `auto_tagging` - optional boolean

## 4) Update website
- Method: `PATCH`
- Path: `/api/v1/websites`
- Full URL: `https://api.wecantrack.com/api/v1/websites`
- Purpose: update an existing website identified by URL

Documented request parameters:
- `url` - required website URL parameter

Documented patchable fields:
- same optional configuration payload fields as create-website (`active`, tracking IDs, proxy/redirect options, anonymization, auto-tagging, etc.)

## 5) Delete website
- Method: `DELETE`
- Path: `/api/v1/websites`
- Full URL: `https://api.wecantrack.com/api/v1/websites`
- Purpose: delete a website record

Documented request parameters:
- `url` - required website URL

## 6) Get website script
- Method: `GET`
- Path: `/api/v1/websites/script`
- Full URL: `https://api.wecantrack.com/api/v1/websites/script`
- Purpose: return embeddable JavaScript for a configured website

Documented request parameters:
- `url` - required website URL

Documented response format:
- `Content-Type: text/javascript`
- example response is a JavaScript snippet loading `https://wct-2.com/wct.js`

## 7) Get network accounts
- Method: `GET`
- Path: `/api/v2/network_accounts`
- Full URL: `https://api.wecantrack.com/api/v2/network_accounts`
- Purpose: list connected affiliate network accounts

Documented query parameters:
- `ids` - optional array; docs say arrays can be chained like `&ids[]=1&ids[]=2`

Example response fields include:
- `id`
- `created_at`
- `updated_at`
- `deleted_at`
- `disabled_at`
- `network_id`
- `user_id`
- `name`
- `tags`
- `is_enabled`
- `frontend_network_id`

## 8) Get networks
- Method: `GET`
- Path: `/api/v2/networks`
- Full URL: `https://api.wecantrack.com/api/v2/networks`
- Purpose: list supported affiliate networks

Example response fields:
- `id`
- `name`

## 9) Click aggregation
- Method: `GET`
- Path: `/api/v2/clicks/aggregation`
- Full URL: `https://api.wecantrack.com/api/v2/clicks/aggregation`
- Purpose: aggregate clicks and commission totals by network/account/custom indexes

Documented query parameters:
- `last_clicks` - required integer; max `75000`
- `group_by` - optional; `networks`, `network_accounts`, `custom_index_1..5`; comma-separated grouping allowed; default `networks`
- `custom_index_1..5` - optional filters
- `networks` - optional comma-separated network IDs; max 5 elements
- `network_accounts` - optional comma-separated network account IDs; max 5 elements
- `order_by` - optional; `clicks`, `commissions`, `sales`, `custom_index_1..5`; default `commissions`
- `order_direction` - optional `desc` or `asc`; default `desc`
- `page` - optional page cursor; default `1`
- `limit` - optional result limit; max `1000`

Example response fields include:
- `total_commission_USD`
- `total_commission_EUR`
- grouping fields such as `custom_index_1`
- `clicks`
- `sales`

## 10) Get transactions
- Method: `GET`
- Path: `/api/v3/transactions`
- Full URL: `https://api.wecantrack.com/api/v3/transactions`
- Purpose: paginated transaction retrieval

Documented query parameters:
- `date_type` - required; one of `order_date`, `modified_date`, `click_date`, `validation_date`, `last_wct_update`
- `start_date` - required datetime in `Y-m-d\TH:i:s`
- `end_date` - required datetime in `Y-m-d\TH:i:s`
- `status` - optional array of `pending`, `approved`, `declined`
- `network_id` - optional string
- `network_account_id` - optional integer
- `network_account_tags` - optional array
- `website_id` - optional integer
- `page` - optional; default `1`
- `limit` - optional; max `1000`

Documented pagination/response notes:
- docs say all dates in the response are UTC
- response includes pagination fields such as `current_page`, `data`, `first_page_url`, `last_page`, `next_page_url`, `path`, `per_page`, and `total`

Example transaction fields include:
- `transaction_id`
- `last_wct_update`
- `modified_date`
- `reference`
- `sub_ids`
- `sale_amount`
- `commission_amount`
- `currency_id`
- `status`
- `order_date`
- `click_date`
- `validation_date`
- `advertiser_id`
- `advertiser_name`
- `decline_reason`
- `click_metadata`

## 11) Public clickout
- Method: `POST`
- Path: `/api/public/v1/clickout`
- Full URL: `https://wct-1.com/api/public/v1/clickout`
- Purpose: public click-registration endpoint for client-side integrations

Differences from private clickout:
- public endpoint is IP throttled to `30 requests per minute`
- request body additionally requires `uid` (user ID)
- response headers shown in docs include:
  - `X-RateLimit-Limit: 30`
  - `X-RateLimit-Remaining: 29`

Documented body parameters:
- `uid` - required account user ID
- `affiliate_url` - required
- `clickout_url` - optional for click tracking, required for attribution
- `redirect_url` - optional
- `_ga` - optional for click tracking, required for attribution
- `_wctrck` - optional for click tracking, required for attribution
- `metadata` - optional JSON
- `custom_index_1..5` - optional
- `user_click_reference` - optional
- `click_id_placeholder` - optional

Documented responses:
- `200` success with `affiliate_url`
- `299` warning with `warning`
- `400` error with `error`

## Canonical fireROUTE notes
- The provider mixes private operational APIs (`api.wecantrack.com`) with a separate public redirect helper host (`wct-1.com`).
- Private auth can be normalized into either query-key or header-key form.
- `websites` uses the website URL as the update/delete identifier rather than a RESTful path ID.
- Clickout endpoints are side-effecting POST routes that generate modified outbound affiliate links; treat them as operational tracking primitives, not lookup APIs.
- Transaction responses are paginated and UTC-normalized.

## Verification notes
This file was manually rebuilt from the live official WeCanTrack documentation using browser tools.