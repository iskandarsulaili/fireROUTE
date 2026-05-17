# US ZipCode

## Provider metadata
- Category: `Geocoding`
- Provider slug: `us-zipcode`
- Official docs used manually:
  - `https://www.smarty.com/docs/apis/us-zipcode-api/reference`
- Public API base URL documented by provider: `https://us-zipcode.api.smarty.com`
- Transport: `HTTPS` only; the reference explicitly says non-secure `http` is not supported
- Auth model: the inspected reference examples use query parameters `auth-id` and `auth-token`; the same page also states that embedded-key authentication is `GET`-only, while secret-key authentication allows both `GET` and `POST`
- Response format documented in the inspected reference: `JSON`

## Product and access notes
- The inspected Smarty reference documents one lookup path, `/lookup`, with separate single-input and multi-input request modes.
- The API is for looking up and validating `city` / `state` / `ZIP Code` combinations.
- The response body should only be parsed on `200` responses according to the official page.
- Only non-blank fields are returned in the JSON response.

## Confirmed API surface
The inspected official reference confirms these `2` business operations on the same path:
1. `GET /lookup` - single lookup via query string
2. `POST /lookup` - multi-lookup via JSON array body

The page also notes support for `OPTIONS` requests for browser preflight handling, but it is not documented as a separate business endpoint.

## Shared request details
- Hostname: `us-zipcode.api.smarty.com`
- Path: `/lookup`
- Trailing slash: the page explicitly says there is no trailing slash
- Supported methods: `GET`, `POST`, `OPTIONS`
- Common input fields:
  - `city` - string, max `64` characters
  - `state` - string, max `32` characters; state name or two-letter abbreviation
  - `zipcode` - string, max `16` characters
  - `input_id` - string, max `36` characters; echoed back in output
- ZIP Code handling notes:
  - ZIP Codes are treated as digit strings, not numbers
  - leading zeros are significant and the API attempts to compensate for spreadsheet-style numeric coercion
  - a zero-value ZIP Code combined with non-blank city/state can be normalized differently than a literal ZIP-only lookup; the docs call out `invalid_zipcode` for literal zero-style invalid lookups

## 1) Single lookup
- Method: `GET`
- Path: `/lookup`
- Full URL pattern shown by the provider: `https://us-zipcode.api.smarty.com/lookup?auth-id={auth_id}&auth-token={auth_token}&city={city}&state={state}&zipcode={zipcode}`
- Purpose: validate one ZIP / city / state combination and return matching city-state and ZIP metadata

Documented request behavior:
- send exactly one input through the query string
- query string values must be URL-encoded
- the examples use `auth-id` and `auth-token` in the query string
- the page describes the input as `ZIP Code and/or city/state combination`, which means a blank lookup is invalid but all three fields are not strictly required together

Response shape notes from the inspected page:
- `200` responses return a JSON array containing zero or more matches
- each result can include:
  - `input_index`
  - `input_id`
  - `city_states`
  - `zipcodes`
  - `status`
  - `reason`

## 2) Batch lookup
- Method: `POST`
- Path: `/lookup`
- Full URL pattern shown by the provider: `https://us-zipcode.api.smarty.com/lookup?auth-id={auth_id}&auth-token={auth_token}`
- Body format: JSON array of lookup objects using the same field names as the single-input mode
- Purpose: submit multiple lookups in one request

Documented request constraints:
- maximum `100` inputs per request
- maximum request-body size `16K` (`16,384` bytes)
- request body must be valid JSON
- `Content-Type: application/json; charset=utf-8` is required when posting JSON

Example body shape shown on the official page:
```json
[
  {"city":"North Pole","state":"AK"},
  {"zipcode":"12345"},
  {"city":"cupertino","state":"CA","zipcode":"95014"}
]
```

## Required headers noted by the provider
The inspected reference explicitly lists these headers:
- `Content-Type: application/json; charset=utf-8`
- `Host: us-zipcode.api.smarty.com`

Practical note:
- `Content-Type` matters for `POST`; the reference nevertheless presents the header table as required request headers generally

## Response fields confirmed on the official page
### Root result object
- `input_index` - positional index of the input associated with the result
- `input_id` - caller-provided identifier copied from the input
- `city_states` - list of matching city/state combinations
- `zipcodes` - list of matching ZIP metadata objects
- `status` - failure classifier for no-match lookups
- `reason` - human-readable explanation for no-match lookups

### Failure statuses documented
- `blank` - blank lookup; must provide ZIP and/or city/state
- `invalid_state`
- `invalid_city`
- `invalid_zipcode`
- `conflict` - conflicting ZIP/city/state information

### `city_states` item fields
- `city`
- `state_abbreviation`
- `state`
- `mailable_city` - boolean USPS-mailability flag

### `zipcodes` item fields
- `zipcode`
- `zipcode_type` - one of:
  - `S` standard
  - `M` military / APO / FPO / DPO
  - `P` PO box
  - `U` unique
- `default_city`
- `county_fips`
- `county_name`
- `state_abbreviation`
- `state`
- `latitude`
- `longitude`
- `precision` - documented values: `None`, `Zip5`, `Zip6`, `Zip7`, `Zip8`, `Zip9`
- `alternate_counties` - optional county-sharing metadata for ZIPs spanning multiple counties

## Errors, limits, pagination, and format notes
- No pagination scheme is documented.
- `GET` is for one input; `POST` is for multiple inputs.
- Published response / error statuses:
  - `200` - success; parse the JSON body
  - `400` - malformed POST payload
  - `401` - invalid or inactive credentials; the page also calls out a cloud/VPN embedded-key edge case
  - `402` - no active subscription on the associated account
  - `413` - request body exceeds `16K`
  - `429` - too many requests, especially under public embedded-key usage
- Embedded-key traffic can be restricted by source and the docs recommend adding an authorized host to reduce `429` risk.

## Canonical fireROUTE notes
- Treat Smarty US ZipCode as a single canonical path, `/lookup`, with two documented request modes rather than separate resources.
- This provider is ZIP-validation oriented, not a full general geocoder.
- Keep the result-status taxonomy because it gives structured failure reasons useful for normalized fireROUTE error mapping.

## Verification notes
- This file was manually rebuilt from the live official Smarty US ZIP Code API reference using browser tools.
