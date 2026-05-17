# Best Buy

## Provider metadata
- Category: `Shopping`
- Provider slug: `best-buy`
- Docs used manually:
  - `https://bestbuyapis.github.io/api-documentation/#overview`
  - `https://bestbuyapis.github.io/api-documentation/#getting-started`
  - `https://bestbuyapis.github.io/api-documentation/#products-api`
  - `https://bestbuyapis.github.io/api-documentation/#buying-options-open-box-api`
  - `https://bestbuyapis.github.io/api-documentation/#categories-api`
  - `https://bestbuyapis.github.io/api-documentation/#recommendations-api`
  - `https://bestbuyapis.github.io/api-documentation/#stores-api`
  - `https://bestbuyapis.github.io/api-documentation/#commerce-api`
- Confirmed API base URL: `https://api.bestbuy.com`
- Primary media type: JSON or XML for products / stores / categories; JSON-only for recommendations
- Authentication model surfaced in docs: query-parameter API key via `apiKey`
- Manually confirmed routes in this pass: `17`

## Authentication
From the official Getting Started and Errors sections:
- Best Buy requires an API key before you can call the APIs
- examples consistently place the credential in the query string as `apiKey=...`
- the docs tell users to sign up for a key and activate it by email before sending requests
- HTTP `403` is documented both for invalid API keys and for exceeded allocated call limits

## Common request and response conventions
From the official Overview / Response Format sections:
- Products, Stores, and Categories support `JSON` and `XML`
- for single-item products / stores / categories, the response format is selected with a path extension such as `.json`
- for collections, the response format is selected with the `format` query parameter
- if no format is specified for products / stores / categories, the docs say XML is returned by default
- Recommendations endpoints return JSON; XML is not supported there
- the docs repeatedly use a search-expression style path grammar such as `/v1/products(type=Movie)` or `/v1/stores(region=ut)`

## Manually confirmed endpoint set

### 1) Product collection search
- Method: `GET`
- Path pattern: `/v1/products`
- Example path shown in docs: `/v1/products`
- Purpose: retrieve product collections; additional search expressions can be embedded in the path

### 2) Product detail
- Method: `GET`
- Path pattern: `/v1/products/{sku}.{format}`
- Example path shown in docs: `/v1/products/8880044.json`
- Purpose: retrieve a single product by SKU

### 3) Product warranties
- Method: `GET`
- Path pattern: `/v1/products/{sku}/warranties.{format}`
- Example path shown in docs: `/v1/products/5005633/warranties.json`

### 4) Open box for one SKU
- Method: `GET`
- Path pattern: `/beta/products/{sku}/openBox`
- Example path shown in docs: `/beta/products/8610161/openBox`

### 5) Open box search by criteria
- Method: `GET`
- Path pattern: `/beta/products/openBox({search-expression})`
- Example path forms shown in docs:
  - `/beta/products/openBox(sku in(...))`
  - `/beta/products/openBox(categoryId=abcat0400000)`

### 6) Category collection
- Method: `GET`
- Path pattern: `/v1/categories`
- Example path shown in docs: `/v1/categories`

### 7) Category search by path/name expression
- Method: `GET`
- Path pattern: `/v1/categories({search-expression})`
- Example path shown in docs: `/v1/categories(name=Sony%20DSLR%20Camera*)`

### 8) Trending viewed products
- Method: `GET`
- Path pattern: `/v1/products/trendingViewed({search-expression})`
- Example path shown in docs: `/v1/products/trendingViewed(categoryId=abcat0400000)`

### 9) Most viewed products
- Method: `GET`
- Path pattern: `/v1/products/mostViewed({search-expression})`
- Example path shown in docs: `/v1/products/mostViewed(categoryId=abcat0107000)`

### 10) Also viewed recommendations
- Method: `GET`
- Path pattern: `/v1/products/{sku}/alsoViewed[.json]`
- Example path forms shown in docs:
  - `/v1/products/8880044/alsoViewed`
  - `/v1/products/6534009/alsoViewed.json`

### 11) Also bought recommendations
- Method: `GET`
- Path pattern: `/v1/products/{sku}/alsoBought`
- Example path shown in docs: `/v1/products/8880044/alsoBought`

### 12) Viewed-ultimately-bought recommendations
- Method: `GET`
- Path pattern: `/v1/products/{sku}/viewedUltimatelyBought`
- Example path shown in docs: `/v1/products/8880044/viewedUltimatelyBought`

### 13) Store collection
- Method: `GET`
- Path pattern: `/v1/stores`
- Example path shown in docs: `/v1/stores`

### 14) Store search by expression
- Method: `GET`
- Path pattern: `/v1/stores({search-expression})`
- Example path forms shown in docs:
  - `/v1/stores(postalCode=55423)`
  - `/v1/stores(area(55423,10))`
  - `/v1/stores(storeId=1118)`

### 15) In-store availability for a product
- Method: `GET`
- Path pattern: `/v1/products/{sku}/stores.{format}`
- Example path shown in docs: `/v1/products/4807511/stores.json`
- Important query note: the official example pairs this with `postalCode`

### 16) Commerce PDP click URL
- Method: `GET`
- Path pattern: `/click/{campaignId}/{sku}/pdp`
- Example path forms shown in docs:
  - `/click/5592e2b895800000/12345678/pdp`
  - `/click/-/6323759/pdp`

### 17) Commerce add-to-cart click URL
- Method: `GET`
- Path pattern: `/click/{campaignId}/{sku}/cart`
- Example path forms shown in docs:
  - `/click/5592e2b895800000/12345678/cart`
  - `/click/-/6323759/cart`

## Query and path parameters manually confirmed
### Cross-cutting / collection parameters
The official Overview sections explicitly document or example these parameters:
- `apiKey`
- `format`
- `show`
- `sort`
- `facet`
- `page`
- `pageSize`
- `cursorMark`

### Search-expression path operands shown in official examples
The docs explicitly show search expressions using fields such as:
- `categoryPath.id`
- `categoryPath.name`
- `manufacturer`
- `salePrice`
- `wifiReady`
- `platform`
- `releaseDate`
- `customerReviewAverage`
- `search`
- `type`
- `postalCode`
- `region`
- `storeId`
- `categoryId`

### Route-specific parameters confirmed in reviewed examples
- collection routes use `format=json` and `show=...` in the official examples
- product-store availability examples use `postalCode`
- store area examples use `area(zip,radius)` inside the path expression
- recommendations examples identify products by `{sku}` in the path

## Pagination
From the official Pagination section:
- many APIs return paged results
- default page size is `10`
- maximum `pageSize` is `100`
- `page` selects which page to return
- the docs recommend using `cursorMark` instead of deep page walking when a result set is more than `10` pages

The same section documents collection metadata such as:
- `canonicalUrl`
- `currentPage`
- `from`
- `to`
- `total`
- `totalPages`

## Cursor-mark pagination
From the official Cursor Marks section:
- supported for Products, Stores, and Categories
- start with `cursorMark=*`
- the response includes `nextCursorMark`
- Best Buy explicitly says to URL-encode the returned cursor hash before reusing it
- when the cursor sequence is exhausted, the result becomes empty
- the docs suggest pairing this with `itemUpdateDate` and `active=*` when walking deltas / catalog changes

## Errors and response notes
From the official Errors section:
- `200` - success
- `400` - request missing key information or malformed
- `403` - invalid API key or allocated call limit exceeded
- `404` - requested item not found
- `405` - method not allowed
- `500`, `501`, `503` - server-side Best Buy errors

## Important usage notes
From the official docs:
- Best Buy's product / store / category APIs use a path-embedded search grammar rather than only query-string filters.
- The docs explicitly say response links in product content expire after `7` days and may only be cached temporarily under the terms of service.
- Recommendations routes are JSON-only even though core catalog routes can return JSON or XML.
- The docs describe `show=all` as the way to return hidden / non-default attributes for large resources such as products and stores.

## Verification notes
This file was manually rebuilt from Best Buy's official documentation site using browser inspection.