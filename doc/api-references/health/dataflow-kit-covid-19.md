# Dataflow Kit COVID-19

## Provider metadata
- Category: `Health`
- Provider slug: `dataflow-kit-covid-19`
- Official docs/pages used:
  - `https://covid-19.dataflowkit.com/`
- Current public API base URL: `https://covid-19.dataflowkit.com`
- Auth model: no authentication required
- Response format: JSON
- Public rate-limit note: no numeric rate limit was published on the reviewed page
- Manually confirmed route count: `2`

## Authentication and access
- The reviewed landing page describes the API as a free API for Coronavirus (COVID-19) data.
- No API key, bearer token, or account requirement was documented for the `/v1` API routes.
- The same official page also publishes embeddable widget iframes, but those widget URLs are separate from the data API routes.

## Canonical endpoints
1. `GET /v1` - list all COVID-19 case summaries per country
2. `GET /v1/{contry}` - return the case summary for one country or aggregate target such as `world`

## Parameters and path notes
### Path parameters
- `contry` - official docs typo preserved from the page; this path slot takes a country slug such as `spain` or `USA`, and the docs explicitly say `world` returns global summary data

### Query parameters
- No query parameters were documented for the reviewed API routes.

## Response, pagination, and error notes
- The reviewed page shows JSON array responses containing fields such as `Active Cases_text`, `Country_text`, `Last Update`, `New Cases_text`, `New Deaths_text`, `Total Cases_text`, `Total Deaths_text`, and `Total Recovered_text`.
- The `/v1` route returns the full dataset; the `/{contry}` route returns the filtered dataset for the requested country/aggregate target.
- The reviewed docs do not publish offset, page-number, or cursor pagination.
- The reviewed docs do not publish a structured error schema.

## Usage notes from the official docs
- The same official page markets embeddable COVID-19 statistic widgets and the free API side by side.
- The docs say widgets auto-localize to a visitor's location, but the API section only documents the two `/v1` routes above.
- The example links on the page reference `world`, `spain`, and `USA` as valid `/{contry}` examples.
- The official page also exposes JavaScript example links under `covid-19-sub/v1*.js`, but the human-readable docs text names the canonical API routes as `/v1` and `/v1/{contry}`.

## fireROUTE normalization notes
- Normalize this provider as a tiny unauthenticated read-only JSON API rooted at `https://covid-19.dataflowkit.com`.
- Preserve the official `contry` typo in the documented path placeholder rather than silently renaming it.
- Treat widget iframe examples as separate embed products, not additional API routes.
- Do not infer undocumented filtering or historical drill-down routes beyond the two paths published on the landing page.