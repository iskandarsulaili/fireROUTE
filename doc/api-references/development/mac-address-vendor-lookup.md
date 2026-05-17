# MAC address vendor lookup

## Provider metadata
- Category: `Development`
- Provider slug: `mac-address-vendor-lookup`
- Docs used manually:
  - `https://macaddress.io/api/documentation/making-requests`
  - `https://macaddress.io/api/documentation/error-codes`
  - `https://macaddress.io/api/documentation/credits-balance`
  - provider overview: `https://macaddress.io/api`
  - live endpoint check without credentials: `https://api.macaddress.io/v1?output=json&search=44:38:39:ff:ef:57`
- Confirmed API base URL: `https://api.macaddress.io`
- Primary response/content types confirmed from the docs used in this pass: plain text (`vendor` mode), JSON, XML, and CSV
- Authentication model confirmed from the docs used in this pass:
  - query-parameter API key via `apiKey`
  - header-based API key via `X-Authentication-Token`
- Manually confirmed routes in this pass: `2`

## Authentication
- The official docs publish two authentication styles:
  - query-based authentication with `apiKey=YOUR_API_KEY`
  - header-based authentication with `X-Authentication-Token: YOUR_API_KEY`
- The `making-requests` page shows both auth modes for the main lookup endpoint.
- The docs note that it can take up to a minute after registration for an account to activate.
- A live unauthenticated request to the published lookup endpoint returned an access error in this session, confirming that credentials are actually enforced.

## Common request/response conventions
- Base URL: `https://api.macaddress.io`
- The public docs describe two endpoint families on the `v1` surface:
  - `GET /v1` for MAC/OUI lookup
  - `GET /v1/credits` for balance checks
- Output format is selected with the `output` query parameter.
- Confirmed output options for the lookup route:
  - `json` - full MAC-address information in JSON
  - `xml` - full information in XML
  - `csv` - full information in CSV
  - `vendor` - vendor company name only in plain text; the docs mark this as the default
- Confirmed output options for the credits route:
  - `json`
  - `xml`
  - `csv`
- The provider overview page advertises the lookup response surface as including vendor details, block details, virtual-machine detection, applications, Wireshark notes, transmission type, and administration type.

## Manually confirmed endpoint set

### 1) Look up vendor and metadata for a MAC address or OUI
- Method: `GET`
- Path: `/v1`
- Full URL examples:
  - query-auth form: `https://api.macaddress.io/v1?apiKey=YOUR_API_KEY&output=json&search=44:38:39:ff:ef:57`
  - header-auth form: `https://api.macaddress.io/v1?output=json&search=44:38:39:ff:ef:57`
- Purpose: retrieve vendor, registration-block, and address-analysis details for a MAC address or OUI.
- Confirmed authentication:
  - query `apiKey`
  - or header `X-Authentication-Token`
- Confirmed query parameters:
  - `search` - required MAC address or OUI; any octet delimiters are accepted, including `:`, `.`, or no delimiter; at least `6` base-16 characters are required
  - `output` - optional; `json`, `xml`, `csv`, or `vendor` (default)
  - `apiKey` - required when using query-based auth
- Confirmed request body: none; the docs present the route as a GET endpoint.
- Confirmed success response notes:
  - JSON mode returns a full object with nested data such as `vendorDetails`, `blockDetails`, and `macAddressDetails`
  - plain-text `vendor` mode returns only the vendor company name
  - XML and CSV are also documented output choices
- Confirmed error/edge behavior:
  - unauthenticated live requests are rejected
  - invalid MAC/OUI inputs are documented as `422`

### 2) Check remaining API credits
- Method: `GET`
- Path: `/v1/credits`
- Full URL example: `https://api.macaddress.io/v1/credits?apiKey=YOUR_API_KEY`
- Purpose: retrieve the current API credit balance.
- Confirmed authentication:
  - query-auth example is explicitly shown on the reviewed page
  - the credits docs page also exposes the same query-vs-header auth navigation model used elsewhere in the API docs
- Confirmed query parameters:
  - `apiKey` - required in the reviewed query-auth example
  - `output` - optional; `json`, `xml`, or `csv`
- Confirmed request body: none.
- Confirmed success response notes:
  - JSON example: `{ "credits": 998 }`
  - XML and CSV output modes are also documented

## Pagination
- None. The reviewed official pages describe direct lookup and balance-check endpoints only.

## Rate limits
- The provider overview page advertises `100 FREE requests daily`.
- The error-code page also documents `429 Too many requests`.
- The reviewed official pages do not publish a more detailed per-second or per-minute throttle table.

## Error handling
The official error-codes page documents these statuses:
- `400` - invalid parameters
- `401` - access restricted; enter the correct API key
- `402` - access restricted; check credits balance
- `422` - invalid MAC or OUI address
- `429` - too many requests; try again later
- `500` - internal server error

## Response format notes
- Lookup endpoint outputs:
  - plain text vendor name in default `vendor` mode
  - JSON
  - XML
  - CSV
- Credits endpoint outputs:
  - JSON
  - XML
  - CSV
- The provider overview page shows that JSON lookup responses can include nested sections such as:
  - `vendorDetails`
  - `blockDetails`
  - `macAddressDetails`

## Important usage notes
- The `search` parameter accepts either a full MAC address or an OUI.
- The docs explicitly allow multiple delimiter styles or no delimiter at all.
- The provider overview says the API can detect virtual machines, possible applications, Wireshark notes, transmission type, and administration type in addition to vendor/block data.
- Because the reviewed docs are output-format-driven rather than resource-collection-driven, fireROUTE should treat this as a compact utility API with two primary GET routes.

## Verification notes
This file was manually rebuilt from MacAddress.io's official documentation pages and a live credential-free probe of the published lookup endpoint, which confirmed that API-key enforcement is active.
