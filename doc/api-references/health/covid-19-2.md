# Covid-19

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-2`
- Official docs/pages used:
  - `https://github.com/M-Media-Group/Covid-19-API`
  - `https://raw.githubusercontent.com/M-Media-Group/Covid-19-API/master/README.md`
- Current public API base URL: `https://covid-api.mmediagroup.fr/v1`
- Auth model: no authentication documented in the official README
- Response format: JSON
- Public rate-limit note: the reviewed README publishes only qualitative limits; abusive traffic can be blocked, frequent polling is discouraged because data updates roughly once per hour, and the maintainers ask callers to cache responses for at least 10 minutes
- Manually confirmed route count: `3`

## Authentication and access
- The official README states: `No authorisation is required to fetch data from the API.`
- The same README also marks the API as deprecated as of `31 October 2022`.
- The maintainers still describe the service as the code powering `covid-api.mmediagroup.fr/v1`.

## Canonical endpoints
1. `GET /cases` - live cases data
2. `GET /history` - historical cases data
3. `GET /vaccines` - vaccines data

## Parameters and request notes
### Shared location filters
The reviewed README repeats these filters on `/cases`, `/history`, and `/vaccines`:
- `country` - country name; the README says it is case sensitive
- `ab` - country ISO abbreviation such as `FR`; the README says this takes precedence over `country`
- `continent` - continent filter such as `Europe`; the README says this takes precedence over `country`

### Route-specific parameters
- `GET /history`
  - `status` - required; reviewed values were `Confirmed`, `Deaths`, and `Recovered`, with `Recovered` explicitly marked `DEPRECIATED` in the official README

## Response, pagination, and error notes
- All documented examples return JSON objects.
- The `/cases` and `/vaccines` examples return an `All` object plus region/province entries when applicable.
- The `/history` example returns an `All` object plus a `dates` object keyed by `YYYY-MM-DD`.
- I did not find documented pagination controls.
- I did not find a published machine-readable error schema.

## Usage notes from the official docs
- The reviewed README describes the API as free and intended for developers, machines, programs, and websites.
- The maintainers say the API returns near-real-time data updated once every hour.
- The README asks callers to cache responses locally to avoid unnecessary cost and bans for excessive usage.
- Published data sources in the README include JHU CSSE historical data, an ArcGIS CSV for realtime data, a country-json repository for population metadata, and GOVEX vaccine data.

## fireROUTE normalization notes
- Normalize the provider root as `https://covid-api.mmediagroup.fr/v1`.
- Keep `/history` distinct from the live `/cases` and `/vaccines` routes because it requires the extra `status` selector and returns date-keyed history payloads.
- Mark the provider as deprecated/archival in downstream metadata.
- Preserve the precedence behavior of `ab` and `continent` over the plain `country` filter.