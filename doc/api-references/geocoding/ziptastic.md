# Ziptastic

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ziptastic`
- Official docs used manually:
  - `https://ziptasticapi.com/`
- Public base URL documented on the official site: `https://ziptasticapi.com`
- Transport observed: the homepage examples still use `http://ZiptasticAPI.com/...`, but the live service responds over HTTPS
- Auth model: none documented or required
- Response formats observed: JSON, plus JSONP when `callback` is supplied

## Service overview
- The official homepage describes Ziptastic as a simple API that returns the `Country, State, City` of the zip code you supply.
- The visible getting-started section documents one core path-based lookup route and shows an optional `callback` parameter for JSONP.

## Rate limits / access notes
- No rate-limit section was visible on the official homepage during manual review.
- No signup, token, or API key requirement is documented on the public page.

## Authentication
- `No authentication required.`

## Pagination
- None documented.
- The API returns a single lookup result rather than collections or paginated resources.

## Confirmed API surface
The official docs page exposes `2` request patterns:
1. `GET /{zipcode}`
2. `GET /{zipcode}?callback={callback}`

## 1) Zip-code lookup (JSON)
- Method: `GET`
- Path pattern: `/{zipcode}`
- Full URL pattern: `https://ziptasticapi.com/{zipcode}`
- Purpose: return country, state, and city information for the supplied zip code

Path parameter:
- `zipcode` - required zip code to look up

Observed live success response from the provider's own host:
```json
{"country":"US","state":"CA","city":"BEVERLY HILLS"}
```

Observed live behavior:
- valid lookup returned HTTP `200`
- the response body is JSON even though the response content type is currently `text/html;charset=UTF-8`

## 2) Zip-code lookup with JSONP callback
- Method: `GET`
- Path pattern: `/{zipcode}`
- Query parameter:
  - `callback` - wraps the JSON object in a JavaScript function call
- Full URL pattern: `https://ziptasticapi.com/{zipcode}?callback={callback}`
- Purpose: JSONP variant of the same zip-code lookup

Official getting-started text:
- `Step 1: Make an API call to http://ZiptasticAPI.com/ZIPCODE OR http://ZiptasticAPI.com/ZIPCODE?callback=myCallback`

Observed live JSONP response:
```javascript
myCallback({"country":"US","state":"CA","city":"BEVERLY HILLS"})
```

## Error notes
- The official homepage does not provide a separate error-model section.
- Manual verification of an invalid zip code returned HTTP `200` with this JSON error payload:
```json
{"error":"Zip Code not found!"}
```
- Because the provider returns an application-level error body instead of a non-2xx status for this case, fireROUTE should not assume HTTP status alone is enough for failure detection.

## Response-format notes
- Default body format is JSON.
- Optional `callback` switches the output to JSONP.
- The live responses currently advertise `text/html` content types even when the body is JSON/JSONP.
- No XML, CSV, or authenticated variant is documented on the inspected official page.

## Important usage notes
- The official page only documents zip-code lookup; it does not expose bulk, reverse-geocode, or list endpoints.
- The homepage is intentionally minimal, so undocumented route expansion should not be assumed.
- Because content-type headers do not currently match the JSON payload, downstream clients may need to parse the body defensively.

## Canonical fireROUTE notes
- Canonical base: `https://ziptasticapi.com`
- Canonical lookup route: `GET /{zipcode}`
- Preserve JSONP as a separate raw route mode because it changes the wire format materially.

## Verification notes
- This file was manually rebuilt from the official Ziptastic homepage.
- Live requests to the provider's own documented example route were checked for JSON success, JSONP callback behavior, and the provider's invalid-zip error payload.