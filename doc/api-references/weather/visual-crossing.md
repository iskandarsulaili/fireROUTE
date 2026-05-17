# Visual Crossing

## Provider metadata
- Category: `Weather`
- Provider slug: `visual-crossing`
- Official docs used manually:
  - `https://www.visualcrossing.com/weather-api/`
  - `https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/`
- Confirmed API base URL: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services`
- Response formats confirmed from docs: JSON, CSV
- Authentication model: query-string API key via `key`
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint family
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/timeline/[location]/[date1]/[date2]` | Unified historical, current, and forecast weather retrieval | required `key`; path includes `location` and optional date/time bounds; docs examples show `include`, `elements`, and dynamic date periods like `last30days` |

## Documentation notes
- The official docs describe the Timeline Weather API as the primary unified endpoint for past, present, and future weather data.
- Example requests on the docs page show variants such as:
  - `/timeline/London,UK?key=YOUR_API_KEY`
  - `/timeline/38.9697,-77.385?key=YOUR_API_KEY`
  - `/timeline/London,UK/2020-10-01/2020-12-31?key=YOUR_API_KEY`
  - `/timeline/London,UK/last30days?key=YOUR_API_KEY`
- The docs say responses can be returned in a consistent JSON structure or as CSV text.
- The page also links official OpenAPI descriptors in JSON and YAML forms.

## Rate limits, pagination, and errors
- No pagination model was documented for the timeline endpoint.
- The inspected pages did not expose a simple public numeric rate-limit table.
- The docs include a dedicated `HTTP Response Code and Error Handling` section in the timeline documentation page, but this pass focused on confirming the primary route family and request shape.

## Important fireROUTE notes
- Visual Crossing's API is strongly endpoint-family oriented: one timeline route covers many temporal use cases.
- Query options such as `include` and `elements` materially change payload size and semantics.
- The provider also advertises LLX, maps, historical-forecast, and stored-dataset APIs, but those were not route-confirmed in detail in this pass.

## Verification notes
This file was manually rebuilt from Visual Crossing's official weather API landing page and timeline API documentation.