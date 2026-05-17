# BdAPIs

## Provider metadata
- Category: `Geocoding`
- Provider slug: `bdapis`
- Official docs used manually:
  - `https://bdapis.com/`
  - `https://documenter.getpostman.com/view/7856105/2sA3JNbfos`
- Public API base URL documented by provider:
  - `https://bdapis.com/api/v1.2`
- Transport: `HTTPS`
- Response format documented on the inspected official pages: `JSON`
- Auth model: no API key or other authentication requirement was documented on the inspected v1.2 pages

## Version and availability notes
- The official homepage says `v1.2` is the current version.
- The homepage and the Postman documentation both say versions `1.0` and `1.1` are deprecated.
- The homepage explicitly separates `v1.x Routes Available` from `v2.x Routes Not Available`.
- The `v2.x` route ideas shown on the homepage are not currently available and should not be treated as a live API surface.

## Confirmed API surface
The current official v1.2 docs expose `4` route families under `https://bdapis.com/api/v1.2`:
1. `GET /divisions` - list all Bangladesh divisions
2. `GET /districts` - list all Bangladesh districts
3. `GET /division/{divisionName}` - list the districts and upazillas for one division
4. `GET /district/{districtName}` - list the upazillas for one district

## Route details

### 1) List all divisions
- Method: `GET`
- Path: `/divisions`
- Full URL: `https://bdapis.com/api/v1.2/divisions`
- Documented fields per item:
  - `division`
  - `divisionbn`
  - `coordinates`

### 2) List all districts
- Method: `GET`
- Path: `/districts`
- Full URL: `https://bdapis.com/api/v1.2/districts`
- Documented fields per item:
  - `district`
  - `districtbn`
  - `coordinates`

### 3) Division lookup
- Method: `GET`
- Path pattern: `/division/{divisionName}`
- Full URL pattern: `https://bdapis.com/api/v1.2/division/{divisionName}`
- Example shown by the provider: `https://bdapis.com/api/v1.2/division/rangpur`
- Path parameter:
  - `divisionName` - division name; the official example uses the lowercase English slug `rangpur`
- Documented response content:
  - `district`
  - `coordinates`
  - `upazilla` array/list

### 4) District lookup
- Method: `GET`
- Path pattern: `/district/{districtName}`
- Full URL pattern: `https://bdapis.com/api/v1.2/district/{districtName}`
- Path parameter:
  - `districtName` - district name in the provider's route naming style
- Documented response content:
  - `district`
  - `districtbn`
  - `coordinates`
  - `upazilla` array/list

## Response and data-shape notes
- The official examples show a JSON envelope with top-level `status` and `data`.
- The example `status` object contains:
  - `code`
  - `message`
  - `date`
- The homepage says the endpoints provide Bangladesh administrative names in both Bangla and English.
- Example coordinate values are returned as strings like `22.3811, 90.3372`, not as separate numeric latitude/longitude fields.

## Pagination, rate-limit, and error notes
- No pagination parameters were documented on the inspected v1.2 pages.
- No authentication or rate-limit policy was documented on the inspected v1.2 pages.
- The inspected official examples only showed successful `200` / `ok` responses; no formal error catalog or alternative HTTP status table was published on the pages reviewed in this run.

## Important usage notes
- Treat `v1.2` as the live supported namespace.
- Do not implement the `v2.x` routes listed on the homepage as if they were available; the page explicitly labels them `Not Available`.
- The official examples use direct browser-style URL retrieval and do not publish request bodies or non-GET methods for the currently available routes.
- Because the docs only show English route examples but promise Bangla and English fields in responses, fireROUTE should preserve returned bilingual fields rather than trying to normalize them away.

## Verification notes
This file was manually rebuilt from the live official BdAPIs homepage and the linked official Postman documentation using browser tools only.