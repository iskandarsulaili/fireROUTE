# bng2latlong

## Provider metadata
- Category: `Geocoding`
- Provider slug: `bng2latlong`
- Official docs used manually:
  - `https://www.getthedata.com/bng2latlong`
- Public API base URL: `https://api.getthedata.com/bng2latlong`
- Transport: HTTPS
- Auth model: none documented or required
- Response formats documented: JSON by default, XML with a trailing `/xml` path segment

## Service overview
- The official page describes this API as a converter from OSGB36 easting/northing values in the British National Grid to WGS84 latitude/longitude.
- The docs explicitly show the canonical syntax as `https://api.getthedata.com/bng2latlong/[easting]/[northing]`.
- The same page says XML output is requested by appending `/xml`.

## Rate limits / access notes
- No request-rate limit was documented on the official page during manual review.
- The licence section says the API is free to use for any purpose.
- The page says a credit and a link back are appreciated but not required.

## Authentication
- `No authentication required.`
- No API key, bearer token, or account requirement is documented on the official page.

## Pagination
- None documented.
- This is a single-conversion API and the official docs do not expose paginated or batched resources.

## Confirmed API surface
The official docs expose `2` request patterns:
1. `GET /{easting}/{northing}`
2. `GET /{easting}/{northing}/xml`

## Common path parameters
- `easting` - required OSGB36 easting value
- `northing` - required OSGB36 northing value

Validation note from the official docs:
- both values must be provided
- both must be positive integers
- both must be within range

## 1) Convert BNG coordinates to latitude/longitude (JSON default)
- Method: `GET`
- Path pattern: `/{easting}/{northing}`
- Full URL pattern: `https://api.getthedata.com/bng2latlong/{easting}/{northing}`
- Purpose: convert British National Grid coordinates to WGS84 latitude and longitude
- Response format: JSON

Documented response fields:
- `status` - `ok` or `error`
- `error` - present when `status=error`
- `easting` - echoed request value
- `northing` - echoed request value
- `latitude` - converted latitude
- `longitude` - converted longitude

Observed official API behavior during manual verification:
- valid example returned HTTP `200` with `application/json`
- invalid example also returned HTTP `200` with JSON `{ "status":"error", ... }`

## 2) Convert BNG coordinates to latitude/longitude (XML)
- Method: `GET`
- Path pattern: `/{easting}/{northing}/xml`
- Full URL pattern: `https://api.getthedata.com/bng2latlong/{easting}/{northing}/xml`
- Purpose: same conversion as the JSON route, but with XML output
- Response format: XML

Official output note:
- the docs say XML is requested by adding `/xml` to the end of the request URL

## Error notes
The official page includes explicit JSON and XML error examples. The documented error message is:
- `Both <easting> and <northing> must be provided, must be positive integers, and must be within range. Where provided, <format> must be "xml" or "json".`

Operational behavior confirmed from the live API:
- invalid input returns a structured JSON error body with `status="error"`
- the error example does not redirect to a separate error route

## Response-format notes
- JSON is the default output format
- XML is available via the `/xml` suffix
- The docs do not document CSV, GeoJSON, JSONP, or bulk output modes

## Important usage notes
- This provider is a coordinate-conversion utility, not a place-search API.
- The input coordinate system is OSGB36 / British National Grid.
- The output coordinates are WGS84 latitude/longitude.
- fireROUTE should preserve the XML suffix form as a separate raw route because the format is path-driven rather than query-driven.

## Canonical fireROUTE notes
- Canonical base: `https://api.getthedata.com/bng2latlong`
- Primary operation: convert `{easting}` + `{northing}` into WGS84 coordinates
- Output-format selection is encoded in the path, not with headers or query parameters

## Verification notes
- This file was manually rebuilt from the official GetTheData bng2latlong documentation page.
- Live example requests against the provider's own documented API URLs were also checked to confirm JSON success/error behavior and content type.