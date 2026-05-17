# License-API

## Provider metadata
- Category: `Development`
- Provider slug: `license-api`
- Docs used manually:
  - `https://github.com/cmccandless/license-api/blob/master/README.md`
  - official source file `https://github.com/cmccandless/license-api/blob/master/api.py`
  - official source file `https://github.com/cmccandless/license-api/blob/master/VERSION.txt`
- Confirmed API base URL: `https://licenseapi.herokuapp.com`
- Primary media types: JSON for license/rule resources; plain text for `/version` and current disabled-service responses
- Authentication: none
- Manually confirmed routes in this pass: `6`

## Authentication
- The official README and source code do not require API keys, bearer tokens, cookies, or signed query parameters.
- Requests are rate-limited per source host/IP by the Flask-Limiter middleware in the official source.

## Common request/response conventions
- Base URL: `https://licenseapi.herokuapp.com`
- All documented routes use `GET`.
- The Flask app sets `strict_slashes = False`, so the documented paths are tolerant of trailing-slash variants.
- The source registers one shared resource for both `/` and `/licenses`.
- `license_id` is the only path parameter documented in the reviewed source.
- The current official source hard-disables most data routes by raising `ServiceDisabled()` before normal handler logic runs.

## Manually confirmed endpoint set

### 1) Get all licenses via root alias
- Method: `GET`
- Path: `/`
- Full URL: `https://licenseapi.herokuapp.com/`
- Purpose: alternate entry point for the same all-licenses resource exposed at `/licenses`
- Parameters: none
- Response notes:
  - intended success shape from source: JSON object with top-level `licenses`
  - current source behavior: immediately returns a disabled-service error instead of license data

### 2) Get all licenses
- Method: `GET`
- Path: `/licenses`
- Full URL: `https://licenseapi.herokuapp.com/licenses`
- Purpose: return the full license collection parsed from ChooseALicense data
- Parameters: none
- Response notes:
  - intended success shape from source: JSON object with top-level `licenses`
  - current source behavior: immediately returns the disabled-service error

### 3) Get one license by identifier
- Method: `GET`
- Path: `/licenses/{license_id}`
- Full URL example: `https://licenseapi.herokuapp.com/licenses/gpl-3.0`
- Purpose: return one license record by slug/id
- Path parameters:
  - `license_id` - a license identifier from the all-licenses dataset, such as `gpl-3.0`
- Response notes:
  - intended success path returns a single parsed license document
  - the underlying source includes a `404` branch for unknown licenses with body `License {id} doesn't exist`
  - current source behavior still raises the disabled-service error before that lookup logic executes

### 4) Get rules
- Method: `GET`
- Path: `/rules`
- Full URL: `https://licenseapi.herokuapp.com/rules`
- Purpose: return the rule list used by the license dataset
- Parameters: none
- Response notes:
  - intended success shape from source: JSON object with top-level `rules`
  - current source behavior: immediately returns the disabled-service error

### 5) Service status
- Method: `GET`
- Path: `/status`
- Full URL: `https://licenseapi.herokuapp.com/status`
- Purpose: lightweight status endpoint
- Parameters: none
- Response notes:
  - this route is exempt from the general Flask-Limiter quotas in source
  - intended success body in source would be plain text `OK`
  - current source behavior: immediately returns the disabled-service error instead

### 6) Service version
- Method: `GET`
- Path: `/version`
- Full URL: `https://licenseapi.herokuapp.com/version`
- Purpose: return the deployed application version string
- Parameters: none
- Response notes:
  - returns the raw contents of `VERSION.txt`
  - the reviewed official source currently stores version `1.1.0`
  - response format is plain text rather than JSON

## Pagination
- None documented in the official README or source.
- All reviewed resources are whole-response fetches rather than cursor- or page-based collections.

## Rate limits
- The official source configures Flask-Limiter defaults of:
  - `200 per day`
  - `50 per hour`
- `/status` is explicitly marked limiter-exempt in source.
- No other public quota model was documented in the reviewed materials.

## Error handling
- The official source defines a custom `ServiceDisabled` exception with message:
  - `License API disabled due to excessive requests. If you see this message, please comment on the issue at https://github.com/cmccandless/license-api/issues/2`
- That exception is registered to return HTTP `503` with the text message body above.
- `/licenses/{license_id}` also contains a documented `404` branch for unknown license IDs, but the current hard-disable happens first.
- There is no documented structured JSON error envelope in the reviewed source.

## Response format notes
- Successful data responses are intended to be JSON.
- `/version` is plain text.
- Current disabled-service failures are also plain text.

## Important usage notes
- This provider is explicitly described by its maintainer as an unofficial REST API for `choosealicense.com`.
- The official source currently hard-disables the data-serving routes, so route inventory and intent can be documented reliably but live usability should not be assumed.
- fireROUTE should treat `/` and `/licenses` as duplicate route aliases for the same collection resource.

## Verification notes
This file was manually rebuilt from the official GitHub README and the current official application source files in the provider repository using browser-based source inspection.