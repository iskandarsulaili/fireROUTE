# Oikolab

## Provider metadata
- Category: `Weather`
- Provider slug: `oikolab`
- Official docs used manually:
  - `https://docs.oikolab.com/`
  - `https://docs.oikolab.com/quickstart/`
  - `https://docs.oikolab.com/references/`
- Confirmed API base URL from examples/docs: `https://api.oikolab.com`
- Response formats confirmed from official docs: JSON, CSV, NetCDF
- Authentication model: API key passed in request header `api-key`
- Manually confirmed routes in this pass: `6`

## Authentication
The Quick Start guide shows requests with `headers={'api-key': api_key}` and tells users they can find the API key in their account profile.

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/weather` | Main entry point for historical and forecast weather data | `param`, `start`, `end`, `freq`, `resample_method`, `location`, `location_id`, `lat`, `lon`, bounding-box fields |
| GET | `/archivedforecast` | Archived forecast retrieval | listed in the official API Reference navigation |
| GET | `/airquality` | Air-quality data endpoint | listed in the official API Reference navigation |
| GET | `/epw` | EPW-format data endpoint | listed in the official API Reference navigation |
| GET | `/datasets` | Dataset metadata / selection endpoint | listed in the official API Reference navigation |
| GET | `/account` | Account information endpoint | listed in the official API Reference navigation |

## `/weather` parameter notes confirmed from the official reference
- `param`: weather parameter list; docs also publish a default parameter set.
- `start`, `end`: date strings in `YYYY-MM-DD`; defaults are 3 days in the past and 7 days into the future if omitted.
- `freq`: `H`, `D`, or `M` for hourly, daily, or monthly.
- `resample_method`: `max`, `mean`, `min`, or `sum` for aggregated output.
- `location`: free-text address/city/zipcode lookup.
- `lat`, `lon`: coordinate inputs.
- The reference also documents multiple-coordinate and region/NetCDF variants under `/weather`.

## Response, rate-limit, and usage notes
- The overview and quickstart pages describe payload sizes ranging from small JSON responses to very large downloads.
- The docs explicitly mention JSON, CSV, and NetCDF delivery options.
- The docs do not show a simple public pagination model for the endpoints inspected.
- No public numeric rate-limit table was visible on the pages inspected.

## Important fireROUTE notes
- Oikolab is flexible enough to support free-text locations, coordinates, and regional bounding boxes.
- Header auth (`api-key`) is preferred over query-string auth.
- `/weather` is the core route for both historical and forecast weather; the other documented endpoints are more specialized.

## Verification notes
This file was manually rebuilt from Oikolab's overview, quickstart, and API reference pages.