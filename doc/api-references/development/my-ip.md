# MY IP

## Provider metadata
- Category: `Development`
- Provider slug: `my-ip`
- Docs used manually:
  - `https://www.myip.com/api-docs/`
  - live endpoint check: `https://api.myip.com/`
- Confirmed API base URL: `https://api.myip.com`
- Primary response/content type confirmed from the docs used in this pass: JSON
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `1`

## Authentication
- The official MY IP docs describe the API as public and do not require an API key, OAuth flow, cookie, or custom authorization header.
- The live endpoint responded directly in this session without any credential.

## Common request/response conventions
- Base URL: `https://api.myip.com`
- The official docs present a single JSON endpoint rather than a multi-resource REST surface.
- Official example response:
  - `{ "ip": "66.249.75.9", "country": "United States", "cc": "US" }`
- A live browser check of `https://api.myip.com/` returned the same top-level JSON shape with keys:
  - `ip`
  - `country`
  - `cc`
- The docs explicitly define the fields as:
  - `ip` - IP address
  - `country` - IP country location in English
  - `cc` - two-letter ISO 3166-1 alpha-2 country code
- The docs also state that when location data is unavailable:
  - `cc` becomes `XX`
  - `country` becomes `Unknown`

## Manually confirmed endpoint set

### 1) Get IP geolocation details for the caller
- Method: `GET`
- Path: `/`
- Full URL: `https://api.myip.com/`
- Purpose: return the requester's IP address plus country name and country code.
- Confirmed query parameters: none documented.
- Confirmed request body: none.
- Confirmed success response:
  - JSON object containing `ip`, `country`, and `cc`
- Confirmed response notes:
  - the docs show JSON only; no XML, CSV, or alternate path variants were published
  - the live endpoint returned JSON directly in this session

## Pagination
- None. The official docs describe a single one-shot lookup response and publish no paginated collections.

## Rate limits
- The official docs say there is `no request limit`.
- The same section qualifies that the practical restriction is server capacity, which the operator says they try to keep running smoothly.
- No finer-grained per-minute or per-day throttle table is published.

## Error handling
- The reviewed official docs do not publish a structured HTTP error table or JSON error schema.
- The only fallback/edge-case behavior explicitly documented is the `XX` / `Unknown` location-data response when geographic data is missing.

## Response format notes
- Successful responses are JSON objects.
- The officially documented fields are:
  - `ip`
  - `country`
  - `cc`

## Important usage notes
- The service is explicitly described as free.
- The docs say commercial use is allowed and request attribution to `myip.com` if possible.
- The docs also note that excluding selected response parameters is not currently supported, though the operator says that feature may be added later.

## Verification notes
This file was manually rebuilt from the official MY IP docs page and a live browser check of the published API endpoint.