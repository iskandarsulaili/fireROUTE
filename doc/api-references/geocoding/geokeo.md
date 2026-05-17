# Geokeo

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geokeo`
- Official docs used manually:
  - `https://geokeo.com/`
  - `https://geokeo.com/documentation.php`
  - official endpoint behavior checked manually: `https://geokeo.com/geocode/v1/search.php?q=empire+state+building`
- Public API base URL documented by provider: `https://geokeo.com/geocode/v1`
- Transport: `HTTPS`
- Auth model: required API key in query parameter `api`
- Response formats documented: `JSON`, `XML`

## Product and access notes
- The official homepage describes Geokeo as a forward and reverse geocoding API with worldwide coverage.
- The homepage says new users can sign up without a credit card and receive `2500` free API requests daily.
- The documentation page exposes only two route families under the `geocode/v1` namespace: forward search and reverse geocoding.

## Confirmed API surface
The inspected official docs confirm `2` route families:
1. `GET /search.php`
2. `GET /reverse.php`

## 1) Forward geocoding search
- Method: `GET`
- Path: `/search.php`
- Full URL pattern: `https://geokeo.com/geocode/v1/search.php?q={query}&api={api_key}`
- Purpose: geocode a free-form place or address query into one or more location matches

Required query parameters:
- `q` - free-form search query; the docs say queries should stay within a `50` character limit
- `api` - API key from the dashboard

Optional query parameters:
- `country` - ISO `3166-1 alpha-2` country code used to bias or constrain the search
- `format` - `json` or `xml`; default is `json`

Documented response fields for each result:
- `class`
- `type`
- `address_components.name`
- `address_components.island`
- `address_components.neighbourhood`
- `address_components.street`
- `address_components.subdistrict`
- `address_components.district`
- `address_components.city`
- `address_components.state`
- `address_components.postcode`
- `address_components.country`
- `formatted_address`
- `geometry.location.lat`
- `geometry.location.lng`
- `geometry.viewport.northeast.lat`
- `geometry.viewport.northeast.lng`
- `geometry.viewport.southwest.lat`
- `geometry.viewport.southwest.lng`
- `osmurl`
- top-level `credits`
- top-level `status`

## 2) Reverse geocoding lookup
- Method: `GET`
- Path: `/reverse.php`
- Full URL pattern: `https://geokeo.com/geocode/v1/reverse.php?lat={latitude}&lng={longitude}&api={api_key}`
- Purpose: convert WGS84 latitude/longitude coordinates into the nearest known address or place record

Required query parameters:
- `lat` - latitude to reverse-geocode
- `lng` - longitude to reverse-geocode
- `api` - API key from the dashboard

Optional query parameters:
- `format` - `json` or `xml`; default is `json`

Additional documented reverse-response field:
- `distance` - distance between the supplied coordinates and the returned place, in kilometers

Shared response fields:
- `results`
- `address_components.*`
- `formatted_address`
- `geometry.location.*`
- `geometry.viewport.*`
- `osmurl`
- `credits`
- `status`

## Errors, rate limits, and pagination
Documented status codes from the official docs:
- `OK` - request completed successfully and results are available
- `INVALID_REQUEST` - required parameters are missing or invalid
- `ACCESS_DENIED` - invalid access context, including invalid/missing key or dashboard IP/HTTP restriction failures
- `OVER_QUERY_LIMIT` - usage exceeded the allowed quota; the docs say responses are throttled when traffic exceeds roughly `30%` above the plan's daily quota
- `ZERO_RESULTS` - request was valid but no results matched; the docs say these requests are not charged

Observed live endpoint behavior:
- A manual browser check of `https://geokeo.com/geocode/v1/search.php?q=empire+state+building` without an API key returned JSON with `{"status":"INVALID_REQUEST"}`.

Rate-limit notes from the docs:
- Free plan: `2500` API requests per day
- Free-plan quota resets at midnight `UTC`
- Paid plans refresh at midnight `UTC` and are described as having no hard limit, but the docs still warn of throttling at roughly `30%` above the daily quota
- Custom limits are available through provider contact according to the docs

Pagination notes:
- No page-number, cursor, offset, or token-based pagination model is documented on the inspected official docs.
- Both documented routes return ranked result lists directly in the response body.

## Format and usage notes
- The docs explicitly support `json` and `xml` output through the `format` query parameter.
- Result ranking is described as relevance/importance based, with larger or more important places ranked above lower-priority amenities.
- The docs say caching is allowed indefinitely: stored results may be kept and reused without a stated expiration limit.
- Dashboard-level IP restrictions and HTTP restrictions are documented under API settings.
- The HTTP restriction text says the service checks the `Access-Control-Allow-Origin` header against a preset domain; treat that as the provider's published wording even though that header description is technically unusual.
- The privacy section says customer account details are stored, query requests are not stored, and IPs for requests without API keys are stored to reduce abuse and rate-limit anonymous traffic.

## Canonical fireROUTE notes
- Canonical base URL: `https://geokeo.com/geocode/v1`
- Canonical route families: `GET /search.php` and `GET /reverse.php`
- Treat `json` vs `xml` as a format parameter, not as separate routes.
- Preserve `country` on forward geocoding because it materially changes result selection.
- Preserve `distance` as a reverse-only response field.

## Verification notes
- This file was manually rebuilt from the live Geokeo homepage, live Geokeo documentation page, and a live official endpoint check using browser/CDP tools only.
