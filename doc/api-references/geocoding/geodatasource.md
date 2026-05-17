# GeoDataSource

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geodatasource`
- Official docs used manually:
  - `https://www.geodatasource.com/web-service`
- Public API base URL documented by provider: `https://api.geodatasource.com`
- Transport: `HTTPS` (the page also says HTTP requests are supported)
- Auth model: API key passed as query parameter `key`
- Response formats documented: `json` and `xml`

## Product and access notes
- The official page describes this product as a latitude/longitude lookup service for the nearest city or nearest cities within `20km`.
- The provider says the free plan supports up to `500` queries per month over HTTP or HTTPS.
- The pricing table on the page also advertises paid credit bundles at `10,000`, `50,000`, and `250,000` credits per month.
- The docs describe two APIs only: `Nearest City API` and `Nearest Cities API`.

## Confirmed API surface
The inspected official page confirms these `2` route families:
1. `GET /v2/city`
2. `GET /v2/cities`

Important official path note:
- The route headings on the page use `https://api.geodatasource.com/v2/city` and `https://api.geodatasource.com/v2/cities`.
- The same page's sample code and curl examples still call `https://api.geodatasource.com/city?...` and `https://api.geodatasource.com/cities?...` without `/v2`.
- fireROUTE should treat this as a live documentation inconsistency and preserve a raw passthrough mode until runtime testing confirms whether the provider expects the legacy or `/v2` form.

## Shared request and response rules
Shared request parameters documented on both APIs:
- `key` - required API key
- `lat` - required latitude as `double`
- `lng` - required longitude as `double`
- `format` - optional output selector; valid values are `json` and `xml`; default is `json`

Shared response fields documented on both APIs:
- `country` - ISO 3166 two-character country code
- `region` - region or state name
- `city` - city name
- `latitude`
- `longitude`
- `currency_code` - ISO 4217 code
- `currency_name`
- `currency_symbol`
- `sunrise` - local `hh:mm`
- `sunset` - local `hh:mm`
- `time_zone` - UTC offset with DST support
- `distance_km` - distance from the supplied coordinate to the returned city

Pagination and rate-limit notes:
- No pagination model is documented.
- The only published quota on the inspected page is `500` monthly requests for the free plan.

## 1) Nearest city lookup
- Method: `GET`
- Path shown in route heading: `/v2/city`
- Legacy sample-code path shown on the same page: `/city`
- Full URL patterns shown by the provider:
  - `https://api.geodatasource.com/v2/city`
  - `https://api.geodatasource.com/city?key=Enter_API_Key&format=json&lat=37.3861&lng=-122.084`
- Purpose: return the single nearest city to a supplied coordinate

Response notes from the example payload:
- returns one object, not an array
- example fields include `country`, `region`, `city`, `latitude`, `longitude`, `currency_code`, `currency_name`, `currency_symbol`, `sunrise`, `sunset`, `time_zone`, and `distance_km`

## 2) Nearest cities lookup
- Method: `GET`
- Path shown in route heading: `/v2/cities`
- Legacy sample-code path shown on the same page: `/cities`
- Full URL patterns shown by the provider:
  - `https://api.geodatasource.com/v2/cities`
  - `https://api.geodatasource.com/cities?key=Enter_API_Key&format=json&lat=37.3861&lng=-122.084`
- Purpose: return the list of cities within `20km` of the supplied coordinate

Response notes from the example payload:
- returns an array of city objects
- each array element uses the same field set documented for the single-city lookup

## Error model
The inspected page publishes these provider-specific error codes:
- `10000` - Missing parameter.
- `10001` - Invalid API key.
- `10002` - API key disabled.
- `10003` - API key expired.
- `10004` - Insufficient credits.
- `10005` - Unknown error.
- `10006` - No record found.
- `10007` - Invalid format value.
- `10008` - Invalid latitude value.
- `10009` - Invalid longitude value.

Official example error payload:
```json
{
  "error": {
    "error_code": 10000,
    "error_message": "Missing parameter."
  }
}
```

## Canonical fireROUTE notes
- This provider is a simple coordinate-to-city lookup service, not a full structured geocoder.
- Keep `key` query auth provider-specific.
- Preserve the provider's documented JSON/XML output toggle instead of forcing a single format assumption.
- Because the official page mixes `/v2/...` headings with legacy non-`/v2` code samples, adapter work should keep that mismatch visible rather than silently normalizing it away.

## Verification notes
- This file was manually rebuilt from the live official GeoDataSource Location Search Web Service page using browser tools only.
