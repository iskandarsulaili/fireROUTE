# GeneradorDNI

## Provider metadata
- Category: `Test Data`
- Provider slug: `generadordni`
- Docs used manually in this pass:
  - `https://api.generadordni.es/`
  - `https://api.generadordni.es/api-docs/`
- Confirmed base URLs:
  - `https://api.generadordni.es/v2`
  - the homepage still shows a copy-paste base of `http://api.generadordni.es/v2/`, but the reviewed Swagger server list uses HTTPS; prefer the HTTPS server URL
- Primary response/content types confirmed from the reviewed docs: JSON (`application/json`)
- Authentication model confirmed from the reviewed docs: subscription-backed API-key-style headers
- Manually confirmed routes in this pass: `37`

## Authentication
- The reviewed Swagger `Authorize` dialog exposes two header-based `apiKey` inputs:
  - `customer_id`
  - `authorization`
- The homepage navigation also includes `Ver planes` and `Mi suscripción`, which matches the provider's subscription-oriented access model.
- The reviewed docs do not show OAuth or a bearer-token flow.
- Important inconsistency: the Swagger page labels top-level security as `Authorization`, but the visible authorization modal names the actual header inputs `customer_id` and `authorization`. Verify the exact issued header values from a live account before implementation.

## Common request/response conventions
- Every route confirmed in this pass is a `GET` endpoint.
- The reviewed Swagger server list names `https://api.generadordni.es/v2` as production.
- Responses are JSON.
- Simple generator routes return arrays of strings.
- Rich generator routes such as profile, bank-account, and card routes return arrays of JSON objects.
- The shared `results` query parameter is widely reused across generator endpoints.
- Reviewed Swagger shared-parameter details for `results`:
  - type: integer
  - default: `10`
  - maximum: `50`
- Important docs discrepancy: the homepage endpoint table says generator calls default to `10` results and allow up to `100`, while the reviewed Swagger shared parameter caps `results` at `50`.
- Object-style endpoints use optional comma-separated field filters:
  - `include_fields`
  - `exclude_fields`
- The reviewed Swagger responses document `409 Conflict` when both `include_fields` and `exclude_fields` are sent together.
- No cursor, page, offset, or token-style pagination contract was documented on the reviewed pages.
- No numeric rate-limit or quota table was published on the reviewed homepage or Swagger page.

## Manually confirmed endpoint inventory

### DOI / identity numbers (`4`)
1. `GET /doi/nif`
   - Purpose: generate NIF values.
   - Confirmed query parameters:
     - `results`
     - `countrycode` — country code for the requested NIF variant; the reviewed docs list many allowed values and default to `es`
   - Confirmed responses: `200`, `400`, `500`
2. `GET /doi/nie`
   - Purpose: generate NIE values.
   - Confirmed from the reviewed route summary and homepage endpoint table.
3. `GET /doi/cif`
   - Purpose: generate CIF values.
   - Confirmed from the reviewed route summary and homepage endpoint table.
4. `GET /doi/nif/countries`
   - Purpose: list the available country codes for NIF generation.

### Profiles (`2`)
5. `GET /profiles/person`
   - Purpose: generate person profiles.
   - Confirmed query parameters:
     - `results`
     - `gender` — `male` or `female`
     - `include_fields`
     - `exclude_fields`
   - Confirmed example response fields include identifiers, personal names, address data, banking data, card data, social-security data, and passport data.
   - Confirmed responses: `200`, `400`, `409`, `500`
6. `GET /profiles/company`
   - Purpose: generate company profiles.
   - Confirmed from the reviewed route summary and homepage endpoint table.

### Bank and cards (`3`)
7. `GET /bank/account`
   - Purpose: generate bank-account data.
   - Confirmed query parameters:
     - `results`
     - `include_fields`
     - `exclude_fields`
   - Confirmed example response fields include `ccc`, `ccc_formatted`, `iban`, `iban_formatted`, `bic`, and `entity`.
   - Confirmed responses: `200`, `400`, `409`, `500`
8. `GET /bank/card`
   - Purpose: generate credit-card data.
   - Confirmed query parameters:
     - `results`
     - `include_fields`
     - `exclude_fields`
     - `issuer_code` — reviewed Swagger enum values: `3`, `4`, `5`, `6`
   - Confirmed responses: `200`, `400`, `409`, `500`
9. `GET /bank/card/issuers`
   - Purpose: list the available card-issuer types.

### Text (`4`)
10. `GET /text/characters`
    - Purpose: generate character-based text.
11. `GET /text/words`
    - Purpose: generate word-based text.
    - Confirmed query parameters:
      - `results`
      - `words` — reviewed Swagger default `100`, maximum `5000`
      - `language` — reviewed Swagger enum values: `SPANISH`, `ENGLISH`, `LATIN`
12. `GET /text/paragraphs`
    - Purpose: generate paragraph text.
13. `GET /text/languages`
    - Purpose: list the available text languages.

### Vehicle (`3`)
14. `GET /vehicle/platenumber`
    - Purpose: generate vehicle plate numbers.
    - Confirmed query parameters:
      - `results`
      - `type` — reviewed Swagger enum values: `C`, `R`, `E`, `T`, `H`; default note says the omitted value returns a tourism/car plate
15. `GET /vehicle/platenumber/types`
    - Purpose: list the available vehicle/plate types.
16. `GET /vehicle/vin`
    - Purpose: generate VIN values.

### Person (`4`)
17. `GET /person/passport`
    - Purpose: generate passport values.
18. `GET /person/ss`
    - Purpose: generate social-security numbers.
19. `GET /person/email`
    - Purpose: generate email addresses.
    - Confirmed query parameter: `results`
20. `GET /person/password`
    - Purpose: generate passwords.
    - Confirmed query parameter: `results`

### Miscellaneous (`10`)
21. `GET /misc/phonenumber`
22. `GET /misc/birthdate`
23. `GET /misc/futuredate`
24. `GET /misc/city`
25. `GET /misc/zipcode`
26. `GET /misc/lei`
27. `GET /misc/imei`
28. `GET /misc/isin`
29. `GET /misc/cadastre`
30. `GET /misc/cups`
- The reviewed Swagger and homepage both present these as additional JSON generator endpoints.

### Custom payload builder (`2`)
31. `GET /custom/custom`
    - Purpose: build a custom mixed payload with requested data families.
    - Confirmed query parameters:
      - shared `results`
      - many per-field counters such as `nif`, `nie`, `cif`, `name`, `surname`, `surnames`, `fullname`, `phonenumber`, `address`, `birthdate`, `futuredate`, `username`, `companyname`, `cnae`, `city`, `zipcode`, `personprofile`, `companyprofile`, `ssn`, `passport`, `lei`, `imei`, `cups`, `cups_electricity`, `cups_gas`, `cadastre_random`, `cadastre_urban`, `cadastre_rustik`, `isin`, `email`, `password`, `bankaccount`, `creditcard`, `shorttext`, `largetext`, `platenumber`, and `vin`
      - each reviewed per-field counter is optional, integer-typed, and defaults to `1` with max `100`
    - Confirmed responses: `200`, `400`, `401`, `409`, `500`
    - Important usage note from the reviewed description: the endpoint accepts many query keys at once to assemble one mixed JSON payload.
32. `GET /custom/types`
    - Purpose: list the available custom field/type keys.

### Holidays (`4`)
33. `GET /holidays/countries`
    - Purpose: list available countries.
34. `GET /holidays/states`
    - Purpose: list available states for a country.
    - Confirmed required query parameter:
      - `country`
35. `GET /holidays/regions`
    - Purpose: list available regions for a country/state combination.
36. `GET /holidays/holidays`
    - Purpose: list holidays for the requested scope.
    - Confirmed query parameters:
      - required `year`
      - required `country`
      - optional `state`
      - optional `region`
    - Confirmed responses: `200`, `400`, `500`

### Voucher (`1`)
37. `GET /voucher/voucher`
    - Purpose: generate promotional / voucher codes.

## Errors confirmed from the reviewed docs
- `400 Bad params`
- `401 Not allowed` on at least some protected operations such as `GET /custom/custom`
- `409 Conflict` for incompatible `include_fields` + `exclude_fields` usage
- `500 Internal server error`

## Response format notes
- The reviewed Swagger examples show direct arrays rather than paginated envelopes.
- Primitive generator endpoints commonly return arrays of strings.
- Rich generator endpoints return arrays of objects with provider-specific field sets.
- The homepage explicitly markets the API as returning JSON for testing, integration, and demo use cases.

## Important usage notes
- The homepage positions the service as rule-based test-data generation for QA, integration, demos, and validation-sensitive workflows.
- The official homepage says the same JSON examples shown in the endpoint table come from the same source as Swagger.
- The homepage copy-paste base URL and the Swagger server URL disagree on HTTP vs HTTPS; use the HTTPS server advertised by Swagger unless the provider documents otherwise for your account.
- The homepage's `results` maximum (`100`) and Swagger's shared `results` maximum (`50`) currently disagree; treat this as a live-doc inconsistency that should be tested against a real subscribed account.

## Sources inspected
- `https://api.generadordni.es/`
- `https://api.generadordni.es/api-docs/`

## Verification note
This file was rebuilt from the provider's current official homepage and official Swagger/OpenAPI page, replacing the earlier generated placeholder.
