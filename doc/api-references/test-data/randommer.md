# Randommer

## Provider metadata
- Category: `Test Data`
- Provider slug: `randommer`
- Official docs/pages reviewed manually:
  - `https://randommer.io/randommer-api`
  - `https://randommer.io/api/docs/index.html`
  - `https://randommer.io/api/docs/v1/swagger.json`
- Confirmed API base URL: `https://randommer.io`
- Confirmed route prefix: `/api`
- Primary transport confirmed by the official docs/OpenAPI file: JSON-oriented HTTP API
- Manually confirmed route count in the current official OpenAPI document: `25`
- Route-method breakdown:
  - `18` `GET`
  - `7` `POST`

## Authentication
From the reviewed official docs:
- every reviewed route documents the same required header parameter:
  - `X-Api-Key`
- the public docs label the header simply as `Enter your key`
- no OAuth flow, bearer-token scheme, or signed-request alternative was exposed in the reviewed official docs

## Request and response conventions
- Confirmed API origin: `https://randommer.io`
- Confirmed path family: `/api/...`
- The official docs are published through a ReDoc UI backed by `swagger.json`
- The reviewed anonymous public spec consistently documents `200 OK` responses, but many routes do not expose detailed response schemas in the public UI
- Because the official public docs are schema-light, exact response object shapes should be runtime-verified before adapter hardening

## Pagination, rate limits, and error notes
- The reviewed official docs did not publish any shared pagination contract
- No official numeric rate-limit table was visible in the reviewed docs
- No shared structured error-envelope page was exposed in the reviewed docs
- Most reviewed operations only surfaced a generic `200 OK` response entry in the public spec

## Confirmed route inventory
The current official Swagger/OpenAPI document exposes `25` concrete routes.

### Card (`2` routes)
- `GET /api/Card`
  - purpose: generate a card number/value by `type`
  - confirmed query parameter: `type`
- `GET /api/Card/Types`
  - purpose: list available card types

### Finance (`5` routes)
- `GET /api/Finance/CryptoAddress/Types`
  - purpose: list supported crypto address types
- `GET /api/Finance/CryptoAddress`
  - purpose: generate a crypto address
  - confirmed query parameter: `cryptoType`
- `GET /api/Finance/Iban/{countryCode}`
  - purpose: generate an IBAN for a country
  - confirmed path parameter: `countryCode`
- `GET /api/Finance/Countries`
  - purpose: list supported finance countries
- `POST /api/Finance/Vat/Validator`
  - purpose: validate a VAT number
  - confirmed parameters: `country`, `vat`

### Misc (`2` routes)
- `GET /api/Misc/Cultures`
  - purpose: list available cultures
- `GET /api/Misc/Random-Address`
  - purpose: generate random addresses
  - confirmed query parameters:
    - `number` - required, integer `1..1000`
    - `culture` - optional, default `en`

### Name (`5` routes)
- `GET /api/Name`
  - purpose: generate first names, surnames, or full names
  - confirmed query parameters:
    - `nameType` - enum `firstname`, `surname`, `fullname`
    - `quantity` - required, integer `1..5000`
- `GET /api/Name/Suggestions`
  - purpose: get business-name suggestions
  - confirmed query parameter: `startingWords`
- `GET /api/Name/Cultures`
  - purpose: list supported name cultures
- `POST /api/Name/BusinessName`
  - purpose: generate business names for a specific culture
  - confirmed parameters:
    - `number`
    - `cultureCode` - default `en_US`
- `POST /api/Name/BrandName`
  - purpose: generate brand-name suggestions
  - confirmed parameter: `startingWords`

### Phone (`4` routes)
- `GET /api/Phone/Generate`
  - purpose: generate bulk telephone numbers
  - confirmed parameters:
    - `CountryCode`
    - `Quantity`
- `GET /api/Phone/IMEI`
  - purpose: generate IMEI values
  - confirmed parameter: `Quantity`
- `GET /api/Phone/Validate`
  - purpose: validate a phone number
  - confirmed parameters:
    - `telephone`
    - `CountryCode`
- `GET /api/Phone/Countries`
  - purpose: list supported phone countries

### SocialNumber (`2` routes)
- `GET /api/SocialNumber`
  - purpose: generate a social-security / identity number
- `POST /api/SocialNumber`
  - purpose: validate VAT or identity numbers
  - confirmed parameter: `idType`

### Text (`5` routes)
- `GET /api/Text/LoremIpsum`
  - purpose: generate lorem ipsum text
  - confirmed parameters:
    - `loremType`
    - `type`
    - `number`
- `GET /api/Text/Password`
  - purpose: generate passwords
  - confirmed parameters:
    - `length`
    - `hasDigits`
    - `hasUppercase`
    - `hasSpecial`
- `POST /api/Text/Humanize`
  - purpose: humanize text
- `POST /api/Text/Transform`
  - purpose: transform text
  - confirmed parameters:
    - `textActionType`
    - `caseType`
    - `find`
    - `replace`
- `POST /api/Text/Review`
  - purpose: generate reviews
  - confirmed parameters:
    - `product`
    - `quantity`
  - official note in the summary: max quantity `500`

## Important usage notes
- The official site exposes the current API most clearly through the ReDoc page and downloadable Swagger document, not the marketing landing page.
- The current official public spec documents fewer operations (`25`) than the earlier shallow repo note had inferred (`31`); the manually confirmed count here only includes exact method+path combinations present in the current official Swagger file.
- Parameter naming is not perfectly normalized across route families; some routes use lower camel case while others use Pascal-style names such as `CountryCode` and `Quantity`.
- Because the public docs do not expose strong shared error/limit guidance, production adapters should treat retry and validation behavior as something to verify with live keys.

## Verification note
This file was manually rebuilt from Randommer's current official docs UI and first-party Swagger document using browser inspection only.