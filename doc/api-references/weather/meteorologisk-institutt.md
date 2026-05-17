# Meteorologisk Institutt (MET Norway)

## Provider metadata
- Category: `Weather`
- Provider slug: `meteorologisk-institutt`
- Official docs used manually:
  - `https://api.met.no/weatherapi/documentation`
  - `https://api.met.no/weatherapi/locationforecast/2.0/locations`
- Confirmed API family base URL: `https://api.met.no/weatherapi/locationforecast/2.0`
- Response formats confirmed from official docs/resources: GeoJSON/JSON and XML
- Authentication model: no API key documented, but the official docs warn about `403 Forbidden` and require a valid `User-Agent`
- Manually confirmed routes in this pass: `3`

## Authentication and access notes
- The docs banner explicitly warns users getting `403 Forbidden` to check the FAQ and their `User-Agent` header.
- No API key requirement was documented on the pages inspected for Locationforecast.

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/locationforecast/2.0/compact` | Compact JSON/GeoJSON weather forecast for a coordinate | required `lat`, `lon` |
| GET | `/locationforecast/2.0/complete` | More complete JSON/GeoJSON weather forecast for a coordinate | required `lat`, `lon` |
| GET | `/locationforecast/2.0/classic` | XML output variant for a coordinate | required `lat`, `lon` |

## Response and usage notes
- The top-level Weather API documentation page lists `Locationforecast 2.0` as the product for weather forecasts for any location on earth.
- The machine-readable locations resource advertises `compact`, `complete`, and `classic` resources with `lat` and `lon` parameters.
- The locations resource is itself returned as JSON/GeoJSON-style metadata describing supported areas and resources.
- The wider MET Weather API catalog exposes many additional weather products, but this provider file focuses on the location forecast product family.

## Rate limits, pagination, and errors
- No cursor/page-based pagination was documented for the Locationforecast endpoint family.
- The inspected docs do not publish a simple numeric request quota table.
- `403 Forbidden` due to missing/poor `User-Agent` handling is explicitly signposted by the official docs.

## Important fireROUTE notes
- Set a descriptive `User-Agent` for MET Norway requests.
- This provider is coordinate-first; there is no documented free-text location route in the Locationforecast family.
- Preserve output-format differences between `compact`, `complete`, and `classic`.

## Verification notes
This file was manually rebuilt from MET Norway's live Weather API catalog and Locationforecast resource metadata.