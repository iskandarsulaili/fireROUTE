# UrlBae

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `urlbae`
- Docs used manually:
  - `https://urlbae.com/developers`
- Confirmed API base URL: `https://urlbae.com/api`
- Primary media type: JSON
- Authentication model surfaced in docs: Bearer API key in `Authorization`
- Manually confirmed routes in this pass: `33`

## Authentication
From the official UrlBae developer page:
- every reviewed API request sends `Authorization: Bearer YOURAPIKEY`
- the docs say an API key is generated automatically when a user registers
- the docs say requests fail if the API key is missing or expired
- reviewed examples also send `Content-Type: application/json`

## Common request/response conventions
- Base URL: `https://urlbae.com/api`
- the reviewed surface uses `GET`, `POST`, `PUT`, and `DELETE`
- the docs say all API responses are returned in JSON format by default
- the shared error example on the official page is:
  - `{"error": 1, "message": "An error occurred"}`
- successful examples use either:
  - `error` + `data`
  - `error` + `message`
- the official page publishes a rate limit of `30` requests per `1 minute`
- the reviewed page also documents these response headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Manually confirmed endpoint set

### Account
1) Get account
- Method: `GET`
- Path: `/account`
- Full URL: `https://urlbae.com/api/account`
- Purpose: return account information for the authenticated user
- Response fields shown in the official example include:
  - `id`
  - `email`
  - `username`
  - `avatar`
  - `status`
  - `expires`
  - `registered`

2) Update account
- Method: `PUT`
- Path: `/account/update`
- Full URL: `https://urlbae.com/api/account/update`
- Purpose: update account data
- Request body fields shown in the official example:
  - `email`
  - `password`

### Branded domains
3) List branded domains
- Method: `GET`
- Path: `/domains`
- Full URL pattern: `https://urlbae.com/api/domains?limit=2&page=1`
- Query parameters confirmed in the official table/examples:
  - `limit`
  - `page`

4) Create a branded domain
- Method: `POST`
- Path: `/domain/add`
- Full URL: `https://urlbae.com/api/domain/add`

5) Update domain
- Method: `PUT`
- Path: `/domain/:id/update`
- Full URL pattern: `https://urlbae.com/api/domain/:id/update`
- Path parameters confirmed by the official URL template:
  - `:id`

6) Delete domain
- Method: `DELETE`
- Path: `/domain/:id/delete`
- Full URL pattern: `https://urlbae.com/api/domain/:id/delete`
- Path parameters confirmed by the official URL template:
  - `:id`

### CTA overlays
7) List CTA overlays
- Method: `GET`
- Path: `/overlay`
- Full URL pattern: `https://urlbae.com/api/overlay?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

### Campaigns
8) List campaigns
- Method: `GET`
- Path: `/campaigns`
- Full URL pattern: `https://urlbae.com/api/campaigns?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

9) Create a campaign
- Method: `POST`
- Path: `/campaign/add`
- Full URL: `https://urlbae.com/api/campaign/add`

10) Assign a link to a campaign
- Method: `POST`
- Path: `/campaign/:campaignid/assign/:linkid`
- Full URL pattern: `https://urlbae.com/api/campaign/:campaignid/assign/:linkid`
- Path parameters confirmed by the official URL template:
  - `:campaignid`
  - `:linkid`

11) Update campaign
- Method: `PUT`
- Path: `/campaign/:id/update`
- Full URL pattern: `https://urlbae.com/api/campaign/:id/update`
- Path parameters:
  - `:id`

12) Delete campaign
- Method: `DELETE`
- Path: `/campaign/:id/delete`
- Full URL pattern: `https://urlbae.com/api/campaign/:id/delete`
- Path parameters:
  - `:id`

### Channels
13) List channels
- Method: `GET`
- Path: `/channels`
- Full URL pattern: `https://urlbae.com/api/channels?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

14) List channel items
- Method: `GET`
- Path: `/channel/:id`
- Full URL pattern: `https://urlbae.com/api/channel/:id?limit=1&page=1`
- Path parameters:
  - `:id`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

15) Create a channel
- Method: `POST`
- Path: `/channel/add`
- Full URL: `https://urlbae.com/api/channel/add`

16) Assign an item to a channel
- Method: `POST`
- Path: `/channel/:channelid/assign/:type/:itemid`
- Full URL pattern: `https://urlbae.com/api/channel/:channelid/assign/:type/:itemid`
- Path parameters confirmed by the official URL template:
  - `:channelid`
  - `:type`
  - `:itemid`

17) Update channel
- Method: `PUT`
- Path: `/channel/:id/update`
- Full URL pattern: `https://urlbae.com/api/channel/:id/update`
- Path parameters:
  - `:id`

18) Delete channel
- Method: `DELETE`
- Path: `/channel/:id/delete`
- Full URL pattern: `https://urlbae.com/api/channel/:id/delete`
- Path parameters:
  - `:id`

### Custom splash pages
19) List custom splash pages
- Method: `GET`
- Path: `/splash`
- Full URL pattern: `https://urlbae.com/api/splash?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

### Links
20) List links
- Method: `GET`
- Path: `/urls`
- Full URL pattern: `https://urlbae.com/api/urls?limit=2&page=1&order=date`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`
  - `order`
- The reviewed example uses `order=date`

21) Get a single link
- Method: `GET`
- Path: `/url/:id`
- Full URL pattern: `https://urlbae.com/api/url/:id`
- Path parameters:
  - `:id`

22) Shorten a link
- Method: `POST`
- Path: `/url/add`
- Full URL: `https://urlbae.com/api/url/add`

23) Update link
- Method: `PUT`
- Path: `/url/:id/update`
- Full URL pattern: `https://urlbae.com/api/url/:id/update`
- Path parameters:
  - `:id`

24) Delete a link
- Method: `DELETE`
- Path: `/url/:id/delete`
- Full URL pattern: `https://urlbae.com/api/url/:id/delete`
- Path parameters:
  - `:id`

### Pixels
25) List pixels
- Method: `GET`
- Path: `/pixels`
- Full URL pattern: `https://urlbae.com/api/pixels?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

26) Create a pixel
- Method: `POST`
- Path: `/pixel/add`
- Full URL: `https://urlbae.com/api/pixel/add`

27) Update pixel
- Method: `PUT`
- Path: `/pixel/:id/update`
- Full URL pattern: `https://urlbae.com/api/pixel/:id/update`
- Path parameters:
  - `:id`

28) Delete pixel
- Method: `DELETE`
- Path: `/pixel/:id/delete`
- Full URL pattern: `https://urlbae.com/api/pixel/:id/delete`
- Path parameters:
  - `:id`

### QR codes
29) List QR codes
- Method: `GET`
- Path: `/qr`
- Full URL pattern: `https://urlbae.com/api/qr?limit=2&page=1`
- Query parameters confirmed in the official example URL:
  - `limit`
  - `page`

30) Get a single QR code
- Method: `GET`
- Path: `/qr/:id`
- Full URL pattern: `https://urlbae.com/api/qr/:id`
- Path parameters:
  - `:id`

31) Create a QR code
- Method: `POST`
- Path: `/qr/add`
- Full URL: `https://urlbae.com/api/qr/add`

32) Update QR code
- Method: `PUT`
- Path: `/qr/:id/update`
- Full URL pattern: `https://urlbae.com/api/qr/:id/update`
- Path parameters:
  - `:id`

33) Delete a QR code
- Method: `DELETE`
- Path: `/qr/:id/delete`
- Full URL pattern: `https://urlbae.com/api/qr/:id/delete`
- Path parameters:
  - `:id`

## Pagination
- the official docs repeatedly use `limit` and `page` on list endpoints
- reviewed list examples with pagination parameters include:
  - `/domains`
  - `/campaigns`
  - `/channels`
  - `/channel/:id`
  - `/overlay`
  - `/splash`
  - `/urls`
  - `/pixels`
  - `/qr`

## Rate limits
- the official developer page says the default rate limit is `30 requests per 1 minute`
- the docs say this rate may change according to the subscribed plan
- the reviewed page explicitly shows these headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error and response notes
- the reviewed docs did not publish a full HTTP status-code table
- the shared JSON error example is:
  - `{"error": 1, "message": "An error occurred"}`
- successful examples use `error: 0`
- successful payloads either return a `message` or a nested `data` object

## Important usage notes
- the docs present the surface as one authenticated API rooted at `https://urlbae.com/api`
- the developer page mixes resource collections (`/domains`, `/campaigns`, `/channels`, `/urls`, `/pixels`, `/qr`) with action-style endpoints such as `/add`, `/update`, `/delete`, and assignment routes
- the authentication example at the top of the page shows `POST https://urlbae.com/api/account`, but the route-specific account section only documents `GET /account`; because that top snippet is not paired with a named operation, it was treated as an auth example and excluded from the confirmed route count
- reviewed examples consistently show JSON requests even for update/create flows

## Verification notes
This file was manually rebuilt from the official UrlBae developer page using browser inspection.