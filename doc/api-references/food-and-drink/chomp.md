# Chomp

Official pages manually reviewed in this run:
- https://chompthis.com/api/
- https://chompthis.com/api/build.php
- https://chompthis.com/api/v2/docs/
- https://app.swaggerhub.com/apis-docs/chomp/Chomp/1.0.0-oas3

## Overview
- Provider: Chomp
- Category: Food & Drink
- Status: `manually_documented`
- Confirmed route count from this review: **8**
- Confirmed base URL: `https://chompthis.com/api/v2`
- Confirmed transport: `HTTPS`
- Confirmed method family from the reviewed docs: `GET`
- Confirmed response format from the reviewed docs: `application/json`

## Authentication
- The recovered official Swagger docs state that an `api_key` is required.
- The docs distinguish two key types:
  - Food endpoints require a `Food Data API` key.
  - Recipe endpoints require a `Recipe Data API` key.
- The docs also state that Premium subscribers must append a `user_id` query parameter on every endpoint call.

## Confirmed route inventory

| Method | Path | What the official docs say | Key parameters confirmed from docs |
|---|---|---|---|
| GET | `/food/branded/barcode.php` | Get a branded food item using a barcode | `code` required; `user_id` optional unless Premium |
| GET | `/food/branded/name.php` | Get a branded food item by name | `name` required; optional `limit`, `page`, `user_id` |
| GET | `/food/branded/search.php` | Get branded food data using various search parameters | optional `allergen`, `brand`, `category`, `country`, `diet`, `ingredient`, `keyword`, `mineral`, `nutrient`, `palm_oil`, `trace`, `vitamin`, `limit`, `page`, `user_id` |
| GET | `/food/ingredient/search.php` | Get raw/generic ingredient item(s) | `find` required; optional `limit`, `user_id` |
| GET | `/recipe/search.php` | Get recipes using a title and optional filters | `title` required; optional `excluded_cuisine`, `included_cuisine`, `excluded_ingredient`, `included_ingredient`, `nutrients_required`, `limit`, `page`, `user_id` |
| GET | `/recipe/ingredient.php` | Get recipes using a list of ingredients | `list` required; optional `limit`, `page`, `user_id` |
| GET | `/recipe/random.php` | Get random popular recipes | optional `limit`, `user_id` |
| GET | `/recipe/id.php` | Get a recipe by ID | `id` required; optional `user_id` |

## Parameter and pagination notes confirmed from docs
- `GET /food/branded/name.php`
  - `limit` allowed values shown in the docs: `1` through `10`
  - `page` defaults to `1`
- `GET /food/branded/search.php`
  - the docs show broad filter support across brand/category/country/diet/ingredient/allergen/nutrient-style filters
  - the docs explicitly warn that some filters cannot be used alone, including `allergen`, `country`, `diet`, `keyword`, `nutrient`, and `trace`
- `GET /food/ingredient/search.php`
  - `find` accepts either a single ingredient or a comma-separated list
  - the docs explicitly cap a comma-separated lookup at `10` ingredients per call
  - `limit` allowed values shown: `1`, `2`, `3`
- `GET /recipe/search.php`
  - `limit` allowed values shown: `1` through `5`
  - `page` defaults to `1`
  - `nutrients_required` allowed values shown: `1` or `0`
- `GET /recipe/ingredient.php`
  - `list` accepts a single ingredient or a comma-separated list of up to `3` ingredients
  - `limit` allowed values shown: `1`, `2`, `3`
  - `page` defaults to `1`
- `GET /recipe/random.php`
  - `limit` allowed values shown: `1` through `5`

## Plan and product notes confirmed from official pages
- The public Chomp API marketing page is live and still links to the official docs, query builder, search tool, status page, SLA page, and pricing flows.
- The recovered Swagger docs plus the live Query Builder page align on the advanced branded-search surface.
- The official docs say these food-search endpoints are only available to Standard and Premium subscribers:
  - `GET /food/branded/name.php`
  - `GET /food/branded/search.php`
  - `GET /food/ingredient/search.php`
- The live Query Builder page also says the Advanced Search endpoint is exclusive to Standard or Premium plans and that the Limited plan only provides basic barcode lookups.

## Response and error notes confirmed from docs
- The reviewed Swagger operations consistently document these response codes:
  - `200` valid request / matching object or objects returned
  - `400` validation error / invalid parameters or request
  - `401` unauthorized / invalid API key, unauthorized access, or usage limits exceeded
  - `404` not found / no matching food or recipe items found
  - `500` internal server error
- The response schemas shown in the docs are JSON objects with top-level `items` arrays.
- Food responses include branded-food or ingredient-oriented objects.
- Recipe responses include recipe metadata, ingredients, and nutrient sections.

## Important usage notes
- The Swagger docs currently resolve through SwaggerHub at `https://app.swaggerhub.com/apis-docs/chomp/Chomp/1.0.0-oas3` from the official Chomp docs URL.
- The official server selector in the recovered docs shows `https://chompthis.com/api/v2` as the production server.
- The docs explicitly say Premium subscribers must add `user_id` to every endpoint call.
- The public API site also links to a separate recipe product page at `https://chompthis.com/api/recipes`, which the Swagger intro references for recipe keys.

## Verification notes
This file was rebuilt from the recovered official Chomp API landing page, live Query Builder page, and the official SwaggerHub documentation that now loads from the Chomp docs URL.