# Foreca

## Provider metadata
- Category: `Weather`
- Provider slug: `foreca`
- Official docs used manually:
  - `https://developer.foreca.com/`
- Confirmed API path families from official docs: `/authorize/*` and `/api/v1/*`
- Authentication model: bearer token in header `Authorization: Bearer [token]` for data calls; username/password used to create or manage tokens
- Manually confirmed routes in this pass: `30`

## Authentication and limits
The Authorization tab of the official docs explicitly says:
- access tokens are provided to data API calls in the header `Authorization: Bearer [token]`
- username and password should be kept secret and not used openly
- QPS is limited by subscription package
- monthly request limits are soft limits
- free trial accounts are limited to 1000 Point Forecast API requests/day and 1000 Map API requests/day

## Manually confirmed routes from the official docs
| Method | Path | Purpose |
|---|---|---|
| POST | `/authorize/token` | Create expiring or non-expiring access token |
| POST | `/authorize/key` | Fetch list of API keys / non-expiring tokens |
| GET | `/api/v1/location/search/:query` | Search location |
| GET | `/api/v1/location/:location` | Resolve location details |
| GET | `/api/v1/observation/latest/:location` | Latest observation |
| GET | `/api/v1/current/:location` | Current weather |
| GET | `/api/v1/forecast/minutely/:location` | Minutely forecast |
| GET | `/api/v1/forecast/15minutely/:location` | 15-minute forecast |
| GET | `/api/v1/forecast/hourly/:location` | Hourly forecast |
| GET | `/api/v1/forecast/3hourly/:location` | 3-hourly forecast |
| GET | `/api/v1/forecast/daily/:location` | Daily forecast |
| GET | `/api/v1/capabilities` | Map/API capabilities |
| GET | `/api/v1/image/tile/:z/:x/:y/:time/:id` | Map tile image |
| GET | `/api/v1/legend/:colorscheme/:id` | Map legend |
| GET | `/api/v1/air-quality/forecast/hourly/:location` | Hourly air-quality forecast |
| GET | `/api/v1/air-quality/forecast/daily/:location` | Daily air-quality forecast |
| GET | `/api/v1/pollen/forecast/hourly/:location` | Hourly pollen forecast |
| GET | `/api/v1/pollen/forecast/daily/:location` | Daily pollen forecast |
| GET | `/api/v1/climate/monthly/:location` | Monthly climate data |
| GET | `/api/v1/climate/daily/:location` | Daily climate data |
| GET | `/api/v1/warning/:location` | Warnings for a location |
| GET | `/api/v1/warning/types` | Warning types |
| GET | `/api/v1/marine/forecast/hourly/:location` | Hourly marine forecast |
| GET | `/api/v1/marine/forecast/daily/:location` | Daily marine forecast |
| GET | `/api/v1/ski/current/:location` | Current ski data |
| GET | `/api/v1/agriculture/forecast/hourly/:location` | Hourly agriculture forecast |
| GET | `/api/v1/agriculture/forecast/daily/:location` | Daily agriculture forecast |
| GET | `/api/v1/energy/forecast/15minutely/:location` | 15-minute energy forecast |
| GET | `/api/v1/energy/forecast/hourly/:location` | Hourly energy forecast |
| GET | `/api/v1/hurricane/current` | Current hurricane data |

## Response and usage notes
- The product landing page describes Foreca Weather API standard Stratus access as including point forecasts, weather maps, and air-quality APIs.
- Additional features such as warning, marine, pollen, climate, history, and agriculture depend on package/features.
- The docs explicitly note that API usage is aggregated at the account level, not token level.
- Map API usage is measured by tiles served, with each tile counting as one request.

## Pagination and errors
- No cursor/page-based pagination model was documented on the main documentation page inspected.
- Exceeding the hard QPS limit results in an error according to the request/query limits section.

## Important fireROUTE notes
- Foreca has a wide surface area; route families extend well beyond plain forecast lookup.
- Separate token-management routes exist; server-side integrations should cache bearer tokens responsibly.
- Package entitlements matter for route availability.

## Verification notes
This file was manually rebuilt from Foreca's live developer documentation site.