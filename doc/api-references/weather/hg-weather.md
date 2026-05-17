# HG Weather

## Provider metadata
- Category: `Weather`
- Provider slug: `hg-weather`
- Official docs used manually:
  - `https://hgbrasil.com/weather`
  - `https://hgbrasil.com/docs/weather`
  - `https://hgbrasil.com/docs/weather/historical`
- Confirmed API base URL: `https://api.hgbrasil.com`
- Response format confirmed from docs: JSON
- Authentication model: integration key required via `key`
- Manually confirmed routes in this pass: `2`

## Authentication
The official docs explicitly state that API access requires an integration key.

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/weather` | Current weather and forecast for a city/region | required `key`; location can be supplied by city name, WOEID, coordinates, or IP; optional `locale` |
| GET | `/weather/historical` | Historical weather retrieval | required `key`; location selectors as above; date filters include `start_date`, `end_date`, `date`, or `days_ago`; optional `mode` |

## Parameter and response notes
- `locale` is documented with `pt` as default and `en` as the alternate supported language.
- Historical requests document date filters in `yyyy-mm-dd` format.
- Historical `mode` supports `all`, `hourly`, or `summary`.
- The docs show JSON responses with top-level fields such as `by`, `valid_key`, and `results`.

## Rate limits, pagination, and errors
- No public pagination model is documented for the weather endpoints.
- No explicit numeric rate-limit table was visible on the weather docs pages inspected.
- The docs have a dedicated general `Erros` guide in the documentation tree, but detailed endpoint-specific error tables were not needed to confirm the routes above.

## Important fireROUTE notes
- HG Weather is a single-host JSON API with a simple query-auth model.
- Location lookup is flexible, so fireROUTE can map both coordinate and text-based queries.
- Historical access appears to be plan-gated according to the official docs.

## Verification notes
This file was manually rebuilt from HG Brasil's live product and documentation pages.