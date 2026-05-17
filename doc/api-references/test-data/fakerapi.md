# FakerAPI

## Provider metadata
- Category: `Test Data`
- Provider slug: `fakerapi`
- Official pages reviewed manually:
  - `https://fakerapi.it/`
  - `https://fakerapi.it/fake-data-download`
- Confirmed current API base URL: `https://fakerapi.it/api/v2`
- Authentication: none
- Primary format: JSON
- Manually confirmed routes: `11`

## What the official site currently documents
The current official Faker API homepage is live again and exposes a browser-readable API guide. The page describes Faker API as a free mock-data generator with no registration, no tokens, and no authentication.

The reviewed docs explicitly publish:
- shared base pattern `https://fakerapi.it/api/{version}`
- latest version `v2`
- shared resource pattern `https://fakerapi.it/api/{version}/{resource}`
- common response envelope fields `status`, `code`, `locale`, `seed`, `total`, and `data`
- shared query parameters `_locale`, `_quantity`, and `_seed`
- max `_quantity` of `1000`
- resource list covering `Addresses`, `Books`, `Companies`, `Credit Cards`, `Images`, `Persons`, `Places`, `Products`, `Texts`, `Users`, and `Custom`

I also manually verified the documented `v2` resource paths against the live API from the official site context.

## Authentication
- No auth is required.
- The official homepage explicitly says: `No registration is required. No tokens, no authentication.`

## Common request conventions
- Base URL: `https://fakerapi.it/api/v2`
- Method for all reviewed routes: `GET`
- Shared query parameters documented on the homepage:
  - `_locale` - locale for generated data; default `en_US`
  - `_quantity` - row count; default `10`, min `1`, max `1000`
  - `_seed` - integer seed for repeatable output
- Shared response envelope:
  - `status`
  - `code`
  - `locale`
  - `seed`
  - `total`
  - `data`

## Manually confirmed endpoint set

### 1) Addresses
- Method: `GET`
- Path: `/addresses`
- Full URL: `https://fakerapi.it/api/v2/addresses`
- Shared params: `_locale`, `_quantity`, `_seed`
- Extra documented parameter:
  - `_country_code` - force the address country; docs say ISO 3166-1 two-letter format or locale format like `en_US`
- Sample response fields confirmed from a live request:
  - `id`, `street`, `streetName`, `buildingNumber`, `city`, `zipcode`, `country`, `country_code`, `latitude`, `longitude`

### 2) Books
- Method: `GET`
- Path: `/books`
- Full URL: `https://fakerapi.it/api/v2/books`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `id`, `title`, `author`, `genre`, `description`, `isbn`, `image`, `published`, `publisher`

### 3) Companies
- Method: `GET`
- Path: `/companies`
- Full URL: `https://fakerapi.it/api/v2/companies`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `id`, `name`, `email`, `vat`, `phone`, `country`, `addresses`, `website`, `image`, `contact`

### 4) Credit Cards
- Method: `GET`
- Path: `/creditCards`
- Full URL: `https://fakerapi.it/api/v2/creditCards`
- Shared params: `_locale`, `_quantity`, `_seed`
- Important path note:
  - the live `v2` path is camel-case `creditCards`
  - a snake-case guess like `/credit_cards` returned `404` in this review
- Sample response fields confirmed from a live request:
  - `type`, `number`, `expiration`, `owner`

### 5) Images
- Method: `GET`
- Path: `/images`
- Full URL: `https://fakerapi.it/api/v2/images`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `title`, `description`, `url`
- Official changelog note reviewed on the homepage:
  - the image resource was updated on `30 August 2024`
  - the changelog says the resource now has only a reduced set of types, but the exact request parameter contract for those types was not spelled out in the visible top-level docs text reviewed here

### 6) Persons
- Method: `GET`
- Path: `/persons`
- Full URL: `https://fakerapi.it/api/v2/persons`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `id`, `firstname`, `lastname`, `email`, `phone`, `birthday`, `gender`, `address`, `website`, `image`
- Official changelog note reviewed on the homepage:
  - a new `other` gender value was added on `30 August 2024`

### 7) Places
- Method: `GET`
- Path: `/places`
- Full URL: `https://fakerapi.it/api/v2/places`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `latitude`, `longitude`

### 8) Products
- Method: `GET`
- Path: `/products`
- Full URL: `https://fakerapi.it/api/v2/products`
- Shared params: `_locale`, `_quantity`, `_seed`
- Extra documented note from the official changelog:
  - `_categories_number` was added to control how many product categories are returned
- Sample response fields confirmed from a live request:
  - `id`, `name`, `description`, `ean`, `upc`, `image`, `images`, `net_price`, `taxes`, `price`, `categories`, `tags`

### 9) Texts
- Method: `GET`
- Path: `/texts`
- Full URL: `https://fakerapi.it/api/v2/texts`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `title`, `author`, `genre`, `content`

### 10) Users
- Method: `GET`
- Path: `/users`
- Full URL: `https://fakerapi.it/api/v2/users`
- Shared params: `_locale`, `_quantity`, `_seed`
- Sample response fields confirmed from a live request:
  - `id`, `uuid`, `firstname`, `lastname`, `username`, `password`, `email`, `ip`, `macAddress`, `website`, `image`

### 11) Custom
- Method: `GET`
- Path: `/custom`
- Full URL: `https://fakerapi.it/api/v2/custom`
- Shared params: `_locale`, `_quantity`, `_seed`
- The custom route is driven by field-name query parameters. Visible field names on the official page during this review included:
  - `word`, `number`, `date`, `dateTime`, `email`, `uuid`, `phone`, `website`, `country`, `city`, `latitude`, `longitude`, `streetAddress`, `streetName`, `buildingNumber`, `card_type`, `card_number`, `card_expiration`, `company_name`, `pokemon`, `upc`, `ean`, `vat`, `boolean`, `boolean_digit`, `null`, `text`, `longText`, `firstName`, `lastName`, `image`
- Live test note:
  - `GET /custom?word=1&number=1` returned JSON objects with `word` and `number` keys
  - `GET /custom` without field parameters still returned `200`, but the `data` array contained empty arrays rather than populated objects

## Pagination
- No page-number or cursor pagination is documented.
- FakerAPI is quantity-based instead.
- The official docs say `_quantity` has a hard maximum of `1000`.
- In a live test, requesting `_quantity=1001` still returned `200` and capped the result `total` at `1000`.

## Rate limits
- The reviewed official docs did not publish a numeric request-per-second or per-day rate limit.
- The only hard limit clearly documented on the page is the per-request maximum `_quantity=1000`.

## Error handling
- Invalid resources return JSON errors.
- In a live test, requesting an unknown resource returned:
  - HTTP `404`
  - body: `{"message":"Resource not found"}`

## Format notes
- Responses are JSON.
- The docs and live calls both confirm the shared envelope fields `status`, `code`, `locale`, `seed`, `total`, and `data`.
- The docs explicitly say data are always wrapped inside `data`.

## Important usage notes
- The official homepage is the canonical public documentation surface right now.
- FakerAPI is publicly callable without registration.
- The public docs emphasize deterministic generation through `_seed`, which is useful for repeatable tests.
- The `Credit Cards` route uses camel-case `/creditCards`, not snake-case.

## Verification note
This file was rebuilt manually from the current official Faker API homepage and first-party site content, with live route checks performed through browser-based review only.