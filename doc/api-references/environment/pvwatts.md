# PVWatts

## Provider metadata
- Category: `Environment`
- Provider slug: `pvwatts`
- Official docs inspected manually:
  - `https://developer.nrel.gov/docs/solar/pvwatts/v6/`
- Confirmed API base URL: `https://developer.nlr.gov/api/pvwatts/v6`
- Response formats confirmed from docs: JSON and XML
- Authentication model: query-string `api_key`
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/api/pvwatts/v6.{format}` | Model photovoltaic system output using PVWatts v6 | required `format` (`json` or `xml`), required `api_key`, required `system_capacity`, required `module_type`, required `losses`, required `array_type`, required `tilt`, required `azimuth`, required site coordinates or station inputs |

## Parameter notes
The official parameter table explicitly documents fields including:
- `system_capacity`
- `module_type`
- `losses`
- `array_type`
- `tilt`
- `azimuth`
- `lat`
- `lon`
- `dataset`
- `timeframe`
- `radius`

## Rate limits and errors
- The page includes dedicated sections for rate limits and errors.
- The inspected page did not show a single simple numeric quota table in the visible summary, but it clearly requires an NREL developer API key.
- The docs note that version 6 has been replaced by version 8 and is on a future decommissioning path.

## Important fireROUTE notes
- PVWatts is a model-calculation endpoint, not a weather observation feed.
- The official docs now advise new integrations to prefer PVWatts v8, but v6 remains documented and reachable at the inspected official page.

## Verification notes
This file was manually rebuilt from the official PVWatts v6 API documentation page.