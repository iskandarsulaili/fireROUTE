# Open Topo Data

## Provider metadata
- Category: `Geocoding`
- Provider slug: `open-topo-data`
- Official docs used manually: `https://www.opentopodata.org/api/`
- Public API host documented by provider: `https://api.opentopodata.org`
- Transport: HTTPS
- Auth model: no authentication is shown on the public testing API docs page
- Response formats documented: JSON by default, plus GeoJSON for elevation lookups when `format=geojson`

## Service notes
- The docs state that `api.opentopodata.org` is a public API available for testing.
- Elevation queries operate on named datasets under `/v1/<dataset_name>`.
- Dataset names must match entries configured on the server.
- Coordinates must be supplied in `EPSG:4326` / WGS-84.
- Multiple datasets may be supplied as a comma-separated dataset path segment; the server will query them in order until a non-null elevation is found.

## Rate limit / usage notes
- No numeric rate limit is published on the inspected API page.
- The page describes the public host as a testing API, so it should be treated as a shared public service rather than an unlimited production endpoint.

## Confirmed API surface
The official API docs list these endpoints:
- `GET /v1/{dataset_name}`
- `POST /v1/{dataset_name}`
- `GET /health`
- `GET /datasets`

## 1) Elevation lookup by query string
- Method: `GET`
- Path pattern: `/v1/{dataset_name}`
- Full URL pattern: `https://api.opentopodata.org/v1/{dataset_name}`
- Purpose: return elevation or bathymetry values for one or more locations from a named dataset

Path parameter:
- `dataset_name` - required dataset or comma-separated dataset chain

Documented query parameters:
- `locations` - required; either pipe-separated `latitude,longitude` pairs or a Google polyline string
- `samples` - optional; if set, sample equally spaced points along the supplied path instead of using the path vertices directly
- `interpolation` - optional; one of `nearest`, `bilinear`, `cubic`; default `bilinear`
- `nodata_value` - optional; one of `null`, `nan`, or an integer such as `-9999`; default `null`
- `format` - optional; `json` or `geojson`, default `json`

Default JSON response notes:
- docs say the JSON shape is compatible with the Google Maps Elevation API
- `status` is `OK` for success, `INVALID_REQUEST` for 4xx input problems, and `SERVER_ERROR` for 5xx failures
- `error` contains a human-readable description when `status` is not `OK`
- `results` contains one entry per requested location on success
- `results[].elevation` may be `null` if the point is outside dataset bounds or if a dataset NODATA value is returned and `nodata_value` is left at `null`
- `results[].location.lat`
- `results[].location.lng`
- `results[].dataset`

Documented elevation caveats:
- integer rasters may yield rounded interpolated elevations due to rasterio/GDAL behavior
- `null` can mean either out-of-bounds coverage or dataset NODATA unless `nodata_value` is changed

GeoJSON mode:
- if `format=geojson` is supplied, the docs state the API returns a `FeatureCollection`
- each feature is a `Point` whose z-coordinate is the elevation
- the feature `properties.dataset` field identifies the source dataset

## 2) Elevation lookup by POST body
- Method: `POST`
- Path pattern: `/v1/{dataset_name}`
- Full URL pattern: `https://api.opentopodata.org/v1/{dataset_name}`
- Purpose: submit the same elevation request arguments in a body instead of the query string when many points would make the URL too long

Path parameter:
- `dataset_name` - required dataset or comma-separated dataset chain

Documented body encoding options:
- JSON-encoded body
- form data

Documented request arguments:
- same arguments as the GET route: `locations`, `samples`, `interpolation`, `nodata_value`, and optional `format`

Response note:
- the docs state that the response is the same as for the GET request

## 3) Health check
- Method: `GET`
- Path: `/health`
- Full URL: `https://api.opentopodata.org/health`
- Purpose: health check for monitoring and load balancing

Documented response notes:
- returns a JSON object with `status`
- `status` is `OK` when healthy
- HTTP status is `200` when healthy and `500` otherwise

Official example response:
- `{ "status": "OK" }`

## 4) List datasets
- Method: `GET`
- Path: `/datasets`
- Full URL: `https://api.opentopodata.org/datasets`
- Purpose: return the datasets available on the server

Documented response fields:
- `datasets` - list of dataset entries
- `datasets[].name` - dataset name used in the elevation URL path
- `datasets[].child_datasets` - populated for multi-dataset entries, otherwise `[]`
- `status` - `OK` when the server is running and the config loads; otherwise `SERVER_ERROR`

## Canonical fireROUTE notes
- Treat Open Topo Data as a dataset-driven elevation API, not a generic address geocoder.
- The main route is one path exposed with both GET and POST semantics.
- `format=geojson` materially changes the response envelope and should be modeled separately from default JSON.
- `dataset_name` can itself be a comma-separated fallback chain, which is important for adapter normalization.

## Verification notes
This file was manually rebuilt from the live official Open Topo Data API documentation using browser tools.