# administrative-divisons-db

## Provider metadata
- Category: `Geocoding`
- Provider slug: `administrative-divisons-db`
- Official docs used manually:
  - `https://github.com/kamikazechaser/administrative-divisions-db`
  - `https://github.com/kamikazechaser/administrative-divisions-db/tree/master/api`
- Public base URL documented by provider: `https://rawcdn.githack.com/kamikazechaser/administrative-divisions-db/master/api`
- Transport: `HTTPS`
- Auth model: none documented
- Response format documented: `JSON`

## Product notes
- The official README describes this project as "Administrative divisons of countries as a JSON API over Github".
- The same README says the data is sourced from GeoNames.
- The provider is implemented as static country files served over GitHub/Cloudflare CDN, not as a multi-resource authenticated SaaS API.

## Confirmed API surface
The official README exposes one public route pattern:
- `GET /master/api/{COUNTRY_CODE}.json`

## 1) Country administrative-division lookup
- Method: `GET`
- Path pattern: `/master/api/{COUNTRY_CODE}.json`
- Full URL pattern: `https://rawcdn.githack.com/kamikazechaser/administrative-divisions-db/master/api/{COUNTRY_CODE}.json`
- Purpose: return the administrative divisions for a single country as a JSON document

Path parameter:
- `COUNTRY_CODE` - required country code used as the JSON filename in the repo's `api/` directory

Official examples shown in the README:
- `https://rawcdn.githack.com/kamikazechaser/administrative-divisions-db/master/api/KE.json`

Usage notes:
- The repo's `api/` directory is the canonical published dataset surface; each country is represented by a separate static JSON file.
- The official README uses an uppercase country-code example (`KE.json`), while GitHub folder listings show country JSON files in the same `api/` directory.
- No additional query parameters, pagination controls, or alternate formats are documented.

## Errors, pagination, and rate limits
- No pagination model is documented; each request returns one full country file.
- No authentication, quota, or rate-limit policy is documented in the inspected official pages.
- No structured error schema is documented. Because this is a static-file CDN pattern, missing countries should be treated as ordinary file/CDN failures rather than provider-defined API errors unless later official docs say otherwise.

## Canonical fireROUTE notes
- Preserve this provider as a simple country-code-to-static-JSON lookup.
- Do not infer extra listing, search, or metadata routes from the GitHub UI; the official README only documents the per-country JSON-file pattern.
- Because the provider is file-backed, caching is likely safe, but freshness policy is not documented.

## Verification notes
- This file was manually rebuilt from the official GitHub repository README and API-folder pages using browser tools.
