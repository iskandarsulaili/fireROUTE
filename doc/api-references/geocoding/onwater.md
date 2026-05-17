# OnWater

## Provider metadata
- Category: `Geocoding`
- Provider slug: `onwater`
- Official pages checked manually:
  - `https://onwater.io/`
  - `https://isitwater.com/`
- Public API base URL shown on the official site: `https://api.isitwater.com`
- Transport: HTTPS
- Auth model: bearer token required
- Response format shown on the official site: JSON for successful API responses

## Service overview
- The indexed `onwater.io` page currently resolves to the provider's current public site at `isitwater.com`.
- The official homepage describes the service as a simple API that answers whether a latitude/longitude coordinate is on water or land.
- The hero example shows a single documented endpoint under `/v1/locations/water`.

## Rate limits / access notes
- No per-minute or per-second rate limit is documented on the visible official page.
- The official pricing section says:
  - `1,000 free credits on signup`
  - pay-as-you-go pricing starting at `$1` for `2,500` API calls
  - no monthly subscriptions
  - credits never expire
  - optional auto-recharge
- Because the visible docs talk in credits rather than rate quotas, treat throughput limits as undocumented.

## Authentication
- The official curl example uses an `Authorization` header with a bearer token.
- A live request to the documented endpoint without a token returned HTTP `401` with plaintext `HTTP Token: Access denied.`

## Pagination
- None documented.
- The visible official docs expose a single point-query endpoint rather than list or batch resources.

## Confirmed API surface
The official site currently exposes `1` public route / route pattern:
1. `GET /v1/locations/water`

## 1) Water-or-land lookup
- Method: `GET`
- Path: `/v1/locations/water`
- Full URL pattern: `https://api.isitwater.com/v1/locations/water?latitude={latitude}&longitude={longitude}`
- Purpose: determine whether a coordinate is on water or land
- Authentication: bearer token in the `Authorization` header

Documented query parameters visible in the official example:
- `latitude` - required latitude value
- `longitude` - required longitude value

Documented success example fields on the official homepage:
- `request_id`
- `water`
- `features`
- `latitude`
- `longitude`

Official example response:
```json
{
  "request_id": "0e56c6d8-1cd3-499a-b21f-b676e5395239",
  "water": true,
  "features": ["ocean"],
  "latitude": "41.9029192",
  "longitude": "-70.2652276"
}
```

## Error notes
- The visible official homepage does not publish a full error-schema section.
- Manual verification against the provider's documented endpoint without auth returned:
  - HTTP status `401`
  - response body `HTTP Token: Access denied.`
  - content type `text/plain; charset=utf-8`
- No official pagination, retry, or throttling error model was visible on the inspected page.

## Response-format notes
- The official success example is JSON.
- Unauthorized access currently returns plaintext rather than the JSON success schema.
- No XML, CSV, JSONP, or batch export format is documented on the inspected official pages.

## Important usage notes
- This provider appears to have rebranded or moved from `onwater.io` to `isitwater.com`; the API host itself is `api.isitwater.com`.
- The service is a single-purpose coordinate classifier, not a general geocoder.
- The returned `features` array can provide more detail than a bare boolean, so fireROUTE should preserve it.
- Because auth is mandatory, this provider should not be treated like the category's public anonymous postcode APIs.

## Canonical fireROUTE notes
- Canonical base: `https://api.isitwater.com`
- Canonical route: `GET /v1/locations/water`
- Required inputs: `latitude`, `longitude`, and a bearer token

## Verification notes
- This file was manually rebuilt from the official `onwater.io` / `isitwater.com` site.
- The documented unauthenticated endpoint behavior was also checked live against the provider's own API host.