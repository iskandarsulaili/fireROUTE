# WooCommerce

## Provider metadata
- Category: `Shopping`
- Provider slug: `woocommerce`
- Docs used manually:
  - `https://developer.woocommerce.com/docs/apis/rest-api/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/authentication/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/v3/api-reference/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/v3/coupons/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/v3/customers/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/v3/orders/`
  - `https://developer.woocommerce.com/docs/apis/rest-api/v3/products/`
- Confirmed REST API base URL pattern: `https://{store-host}/wp-json/wc/v3`
- Related application-auth URL pattern: `https://{store-host}/wc-auth/v1/authorize`
- Primary media type: JSON
- Authentication model surfaced in docs: WooCommerce consumer key / consumer secret credentials, plus application-auth key-generation flow
- Manually confirmed routes in this pass: `28`

## Requirements and platform notes
From the official WooCommerce docs:
- requires WooCommerce `3.5+`
- requires WordPress `4.4+`
- requires pretty permalinks; default permalinks do not work
- API can be used over HTTP or HTTPS, but WooCommerce explicitly recommends HTTPS where possible
- WooCommerce notes that `501 Method Not Implemented` errors can appear with ModSecurity setups

## Authentication
From the official authentication page:
- over HTTPS, the docs recommend HTTP Basic Auth
- username is the consumer key
- password is the consumer secret
- example request form:
  - `curl https://www.example.com/wp-json/wc/v3/orders -u consumer_key:consumer_secret`
- if a server does not parse the `Authorization` header correctly, WooCommerce says you may send credentials as query parameters instead
  - `consumer_key`
  - `consumer_secret`
- the docs also state that WooCommerce can authenticate through any WordPress REST API authentication plugin or method supported by the site

### Application authentication endpoint
WooCommerce separately documents an app-connection flow for generating API keys:
- Method: `GET`
- Path: `/wc-auth/v1/authorize`
- Full URL pattern: `https://{store-host}/wc-auth/v1/authorize`
- Purpose: let a store user grant an app access and generate consumer credentials for that app
- Required query parameters confirmed on the official page:
  - `app_name`
  - `scope` - `read`, `write`, or `read_write`
  - `user_id` - the app's own user identifier, not the WooCommerce user ID
  - `return_url`
  - `callback_url` - WooCommerce notes this should be HTTPS
- Response / flow notes confirmed on the official page:
  - the user is redirected back to `return_url` with `success` and `user_id`
  - WooCommerce POSTs JSON to `callback_url` containing `key_id`, `user_id`, `consumer_key`, `consumer_secret`, and `key_permissions`
- Important usage note from the docs:
  - WooCommerce explicitly warns that this endpoint is for app authorization / key generation, not as a customer login method

## Common request and response conventions
- Reviewed v3 REST endpoints live under `https://{store-host}/wp-json/wc/v3`.
- The reviewed examples use standard HTTP verbs and JSON request bodies.
- The v3 index route is public according to the docs.
- The docs describe WooCommerce as using WordPress REST API authentication methods and JSON responses.

## Manually confirmed endpoint set

### 1) API index
- Method: `GET`
- Path: `/wp-json/wc/v3`
- Full URL pattern: `https://{store-host}/wp-json/wc/v3`
- Purpose: return information about the site's available WooCommerce v3 endpoints
- Auth note: the official API Reference page says authentication is not required for the index

### 2) Coupon routes
Confirmed on the official Coupons page:
- `POST /wp-json/wc/v3/coupons`
- `GET /wp-json/wc/v3/coupons/{id}`
- `GET /wp-json/wc/v3/coupons`
- `PUT /wp-json/wc/v3/coupons/{id}`
- `DELETE /wp-json/wc/v3/coupons/{id}`
- `POST /wp-json/wc/v3/coupons/batch`

Important request/response notes confirmed on the page:
- create requires coupon `code`
- coupon objects include fields such as `id`, `code`, `amount`, `discount_type`, `date_expires`, `usage_count`, `product_ids`, `excluded_product_ids`, `usage_limit`, `free_shipping`, and category/email restriction fields

### 3) Customer routes
Confirmed on the official Customers page:
- `POST /wp-json/wc/v3/customers`
- `GET /wp-json/wc/v3/customers/{id}`
- `GET /wp-json/wc/v3/customers`
- `PUT /wp-json/wc/v3/customers/{id}`
- `DELETE /wp-json/wc/v3/customers/{id}`
- `POST /wp-json/wc/v3/customers/batch`
- `GET /wp-json/wc/v3/customers/{id}/downloads`

Important request/response notes confirmed on the page:
- create requires `email`
- customer payloads include `first_name`, `last_name`, `username`, `password` (write-only), `billing`, `shipping`, and `meta_data`
- `role`, `avatar_url`, and several timestamps are documented as read-only

### 4) Order routes
Confirmed on the official Orders page:
- `POST /wp-json/wc/v3/orders`
- `GET /wp-json/wc/v3/orders/{id}`
- `GET /wp-json/wc/v3/orders`
- `PUT /wp-json/wc/v3/orders/{id}`
- `DELETE /wp-json/wc/v3/orders/{id}`
- `POST /wp-json/wc/v3/orders/batch`

Important request/response notes confirmed on the page:
- order payloads include `status`, `currency`, `customer_id`, `customer_note`, `billing`, `shipping`, `payment_method`, `transaction_id`, `meta_data`, `line_items`, `shipping_lines`, `fee_lines`, and `coupon_lines`
- `set_paid` is write-only and, per the docs, sets the status to processing and reduces stock items
- many totals and timestamps are read-only

### 5) Product routes
Confirmed on the official Products page:
- `POST /wp-json/wc/v3/products`
- `GET /wp-json/wc/v3/products/{id}`
- `GET /wp-json/wc/v3/products`
- `POST /wp-json/wc/v3/products/{product_id}/duplicate`
- `PUT /wp-json/wc/v3/products/{id}`
- `DELETE /wp-json/wc/v3/products/{id}`
- `POST /wp-json/wc/v3/products/batch`

Important request/response notes confirmed on the page:
- product payloads include fields such as `name`, `slug`, `type`, `status`, `featured`, `catalog_visibility`, `description`, `short_description`, `sku`, `price`, `regular_price`, `sale_price`, `date_on_sale_from`, `date_on_sale_to`, `virtual`, `downloadable`, `categories`, `tags`, `images`, `attributes`, and `default_attributes`
- the duplicate route is explicitly documented as `POST /wp-json/wc/v3/products/{product_id}/duplicate`

## Query parameters manually confirmed
### Application-auth route
- `app_name`
- `scope`
- `user_id`
- `return_url`
- `callback_url`

### Products list route (`GET /wp-json/wc/v3/products`)
The official Products page explicitly documents:
- `context`
- `page`
- `per_page`
- `search`
- `search_fields`
- `after`
- `before`
- `modified_after`
- `modified_before`
- `dates_are_gmt`
- `exclude`
- `include`
- `offset`
- `order`
- `orderby`
- `parent`
- `parent_exclude`
- `slug`
- `status`
- `include_status`
- `exclude_status`

### Customers list route (`GET /wp-json/wc/v3/customers`)
The official Customers page explicitly shows / documents:
- `context`
- `page`
- `per_page`
- `search`
- `exclude`
- `include`
- `offset`
- `order`
- `orderby`
- `email`
- `role`

## Pagination
The reviewed WooCommerce pages document collection pagination through route parameters rather than a single platform-wide pagination guide:
- `page` selects the current collection page
- `per_page` controls page size; the reviewed Products page says the default is `10`
- `offset` is available on reviewed collection routes such as products and customers
- `order` / `orderby` are documented for list sorting on reviewed collection routes

The reviewed official pages in this pass did not expose a separate global numeric rate-limit table or a dedicated global pagination-header section.

## Errors and response notes
From the reviewed official pages:
- responses are JSON in the reviewed REST examples
- if HTTPS auth headers are not parsed correctly, WooCommerce says the server may respond with a `Consumer key is missing` error
- the general REST docs call out possible `501 Method Not Implemented` issues with ModSecurity
- the reviewed route pages focus on resource schemas and examples more than a centralized status-code matrix

## Important usage notes
- WooCommerce's v3 API base is site-relative; every store hosts its own API under its own WordPress site URL.
- The API index route is public, but normal write and private-data operations require authentication matching the site's WordPress/WooCommerce permissions.
- The app-authorization flow posts generated credentials to the caller's `callback_url`; callers need to read the raw JSON body, not assume form-encoded POST fields.
- The reviewed docs are route-rich, but they spread parameter and behavior details across each resource page instead of one OpenAPI-style schema document.

## Verification notes
This file was manually rebuilt from WooCommerce's official REST API docs and sampled v3 resource pages using browser inspection.