# Covid Tracking Project

## Provider metadata
- Category: `Health`
- Provider slug: `covid-tracking-project`
- Official docs/pages used:
  - `https://covidtracking.com/data/api/version-2/`
  - `https://covidtracking.com/data/api/`
- Current public API base URL shown in the official docs: `https://api.covidtracking.com`
- Auth model: no authentication mentioned in the reviewed API docs
- Response formats: JSON and CSV
- Public rate-limit note: no numeric rate limit was published in the reviewed docs
- Manually confirmed route count: `10`

## Authentication and access
- The reviewed API pages expose public data-download endpoints with no API key or OAuth flow.
- The page prominently notes that the project stopped collecting new data on `March 7, 2021`, so the API should be treated as historical/archival.
- Version 2 is described as wrapping data and metadata together and adding simplified endpoints.

## Canonical endpoints
### Version 1 families
1. `GET /v1/states/current.{json|csv}` - current values for all states
2. `GET /v1/states/daily.{json|csv}` - historical daily values for all states
3. `GET /v1/states/info.{json|csv}` - state metadata
4. `GET /v1/states/{state}/current.{json|csv}` - current data for one state
5. `GET /v1/states/{state}/daily.{json|csv}` - daily history for one state
6. `GET /v1/states/{state}/info.{json|csv}` - metadata for one state
7. `GET /v1/states/{state}/{date}.{json|csv}` - one state's data for one date
8. `GET /v1/us/current.{json|csv}` - current US totals
9. `GET /v1/us/daily.{json|csv}` - daily US totals
10. `GET /v1/us/{date}.{json|csv}` - US totals for one date

### Version 2 note
- The reviewed `version-2` page organizes coverage into national data plus state/territory metadata, historical series, and single-day state data. The page headings confirm those route families, and the older extracted route strings show them under `/v2/states...` and `/v2/us/daily...`, but the visible accordion content did not expand reliably in this environment, so the concrete path list above is limited to the v1 patterns that were directly verifiable from the reviewed documentation set and prior visible route strings on the official API pages.

## Parameters and path variables
### Path parameters
- `state` - postal-style state or territory code
- `date` - date selector; the v1 docs use compact date tokens, while v2 examples in the official docs use ISO-style dates

## Response, pagination, and error notes
- The provider publishes both CSV and JSON variants for the archival v1 routes.
- The v2 docs explicitly say responses include data plus metadata and field definitions.
- No offset/page pagination model is documented; the API uses path-based date/state selection instead.
- No shared error schema was published in the reviewed pages.

## Usage notes from the official docs
- The official page warns that the project is no longer collecting new data.
- The v2 docs emphasize field definitions, metadata, and simplified endpoints to reduce file size.
- The API remains useful as a historical data source rather than a live operational feed.

## fireROUTE normalization notes
- Normalize this provider as a historical, read-only API rooted at `https://api.covidtracking.com`.
- Preserve both JSON and CSV output variants for the canonical archival paths.
- Treat v1 archival downloads as the stable route inventory and v2 as a richer-but-harder-to-enumerate metadata layer in this environment.