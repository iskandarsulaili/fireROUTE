# RandomUser

## Provider metadata
- Category: `Test Data`
- Provider slug: `randomuser`
- Docs used manually:
  - `https://randomuser.me/documentation`
- Confirmed base URLs:
  - `https://randomuser.me/api/`
  - `https://randomuser.me/api/1.4/`
  - portrait URLs shown in the official docs are served from `https://randomuser.me/api/portraits/...`
- Primary response/content types confirmed from the docs: JSON, PrettyJSON, CSV, YAML, XML, and JSONP
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `5`

## Authentication
- The official documentation presents Random User Generator as a free unauthenticated API.
- No API key, OAuth flow, or custom auth header is shown on the reviewed official page.

## Common request/response conventions
- The main API is documented as a `GET` request to `https://randomuser.me/api/`.
- The default response format is JSON.
- The docs show a top-level response object with:
  - `results`
  - `info.seed`
  - `info.results`
  - `info.page`
  - `info.version`
- The official docs say you can request up to `5,000` generated users in a single request using the `results` parameter.
- The docs show version pinning via `https://randomuser.me/api/1.4/`.

## Manually confirmed endpoint set

### 1) Generate random users
- Method: `GET`
- Path: `/api/`
- Full URL: `https://randomuser.me/api/`
- Purpose: generate random test-user records
- Confirmed query parameters from the official docs:
  - `results` - number of users to return; docs say up to `5000`
  - `gender` - `male` or `female`
  - `password` - password-generation rules such as `upper,lower,1-16`
  - `seed` - stable deterministic seed string
  - `format` - output format selector
  - `nat` - one or more nationalities, comma-separated
  - `page` - page number for seeded pagination
  - `inc` - include only selected fields
  - `exc` - exclude selected fields
  - `dl` - download response with matching format extension
  - `noinfo` - omit the `info` metadata object
  - `callback` - JSONP callback name
- Confirmed field-list values for `inc` / `exc` from the official docs:
  - `gender`
  - `name`
  - `location`
  - `email`
  - `login`
  - `registered`
  - `dob`
  - `phone`
  - `cell`
  - `id`
  - `picture`
  - `nat`

### 2) Generate users from a pinned API version
- Method: `GET`
- Path: `/api/1.4/`
- Full URL: `https://randomuser.me/api/1.4/`
- Purpose: lock callers to API version `1.4` so future updates do not change behavior
- Important note from the official docs:
  - calling `/api/` uses the latest version automatically
  - callers who want a stable version should request a specific versioned path

### 3) Retrieve large portrait images referenced in generated user objects
- Method: `GET`
- Path pattern: `/api/portraits/{gender}/{imageNumber}.jpg`
- Full URL example from the official docs: `https://randomuser.me/api/portraits/men/75.jpg`
- Purpose: retrieve the `picture.large` asset referenced by generated user payloads

### 4) Retrieve medium portrait images referenced in generated user objects
- Method: `GET`
- Path pattern: `/api/portraits/med/{gender}/{imageNumber}.jpg`
- Full URL example from the official docs: `https://randomuser.me/api/portraits/med/men/75.jpg`
- Purpose: retrieve the `picture.medium` asset referenced by generated user payloads

### 5) Retrieve thumbnail portrait images referenced in generated user objects
- Method: `GET`
- Path pattern: `/api/portraits/thumb/{gender}/{imageNumber}.jpg`
- Full URL example from the official docs: `https://randomuser.me/api/portraits/thumb/men/75.jpg`
- Purpose: retrieve the `picture.thumbnail` asset referenced by generated user payloads

## Pagination
- The official docs document pagination with the `page` query parameter.
- The docs explicitly say pagination should be combined with a fixed `seed` to get reproducible results.
- Official example: `?page=3&results=10&seed=abc`

## Rate limits
- The reviewed official docs do not publish a numeric rate-limit policy or quota headers.

## Error handling
- The official docs say server-side problems return a simple JSON object with an `error` field.
- Confirmed example shape from the docs:
  - `{ error: "Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you." }`

## Response format notes
- Officially documented formats:
  - `JSON` default
  - `PrettyJSON`
  - `CSV`
  - `PrettyCSV`
  - `YAML`
  - `XML`
- JSONP is also documented via the `callback` query parameter and is only available with JSON formats.
- The `noinfo` flag removes metadata fields like seed, page, results, and version from the response.

## Important usage notes
- `nat` accepts a comma-separated list, for example `us,dk,fr,gb`.
- The docs list version-specific nationality support and show the current `v1.4` set as: `AU, BR, CA, CH, DE, DK, ES, FI, FR, GB, IE, IN, IR, MX, NL, NO, NZ, RS, TR, UA, US`.
- Password generation defaults to 8-64 characters when bounds are not supplied.
- `inc` can improve performance by skipping expensive fields like `login`.

## Verification notes
This file was manually rebuilt from Random User Generator's official documentation page, replacing the earlier generated placeholder that failed to capture the actual route and parameter surface.