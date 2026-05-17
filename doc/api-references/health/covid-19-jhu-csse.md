# Covid-19 JHU CSSE

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-jhu-csse`
- Official docs/pages used:
  - `https://nuttaphat.com/covid19-api/`
  - `https://nuttaphat.com/covid19-api/api_docs/v1/`
  - `https://nuttaphat.com/covid19-api/api_docs/v2/`
  - `https://github.com/nat236919/covid19-api/`
- Current documented API base URLs: deployment-dependent; the official docs use local examples (`http://localhost`) and list historical example deployments `https://covid19api.azurewebsites.net/` and `https://covid2019-api.herokuapp.com/`
- Auth model: no authentication documented for the reviewed v1/v2 endpoints
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed docs pages
- Manually confirmed route count: `20`

## Authentication and access
- The official homepage describes the project as a FastAPI-powered API for COVID-19 case exploration using Johns Hopkins University CSSE data.
- The reviewed v1 and v2 docs pages show only public `GET` examples and do not document API keys, OAuth, or session-based auth.
- The project docs also document self-hosting via `uvicorn main:app`, Docker Compose, and a Docker Hub image, which is why the route examples use `http://localhost` placeholders.

## Canonical endpoints
### v1
1. `GET /current` - current global country-keyed object
2. `GET /current_list` - current global list/array form
3. `GET /total` - total confirmed, deaths, and recovered
4. `GET /confirmed` - total confirmed count
5. `GET /deaths` - total death count
6. `GET /recovered` - total recovered count
7. `GET /countries` - list reportedly affected countries
8. `GET /country/{query}` - fetch one country by key name or ISO alpha-2 code
9. `GET /timeseries/{case}` - fetch v1 time series for `confirmed`, `deaths`, or `recovered`

### v2
10. `GET /v2/current` - current data for all affected countries
11. `GET /v2/total` - global totals
12. `GET /v2/confirmed` - total confirmed count
13. `GET /v2/deaths` - total death count
14. `GET /v2/recovered` - total recovered count
15. `GET /v2/active` - total active count
16. `GET /v2/country/{query}` - one country by key name or ISO alpha-2 code
17. `GET /v2/timeseries/global` - global time series aggregate
18. `GET /v2/timeseries/{case}` - global case time series by `confirmed`, `deaths`, or `recovered`
19. `GET /v2/timeseries/US/{case}` - US-only time series by `confirmed` or `deaths`
20. `GET /v2/current/US` - current US state-level data

## Parameters and path notes
### `GET /country/{query}` and `GET /v2/country/{query}`
- `query` - country key name or ISO alpha-2 code
- The docs explicitly say spaces may need URL encoding for country-name lookups
- Official examples include `china`, `kr`, `th`, and `united%20kingdom`

### `GET /timeseries/{case}` and `GET /v2/timeseries/{case}`
- `case` - `confirmed`, `deaths`, or `recovered`

### `GET /v2/timeseries/US/{case}`
- `case` - `confirmed` or `deaths` in the reviewed docs examples

## Response, pagination, and error notes
- The reviewed v2 examples consistently return a top-level JSON object containing `data`, `dt`, and `ts`.
- The reviewed v1 examples return JSON objects keyed directly by country or metric, again with `dt` and `ts` fields included in the payload examples.
- No pagination parameters were documented on the reviewed v1 or v2 pages.
- No structured error schema, retry guidance, or quota headers were published on the reviewed docs pages.
- The homepage describes the dataset as daily updated.

## Usage notes from the official docs
- The project homepage identifies Johns Hopkins University CSSE as the upstream data source.
- The docs retain both v1 and v2 references, so fireROUTE should treat this as a versioned historical API surface rather than a single unversioned interface.
- The official examples page points to historical hosted deployments, but the primary official documentation is now the project docs and repository rather than a guaranteed long-lived hosted production endpoint.

## fireROUTE normalization notes
- Treat this provider as a historical read-only JSON API with two documented route families: legacy v1 and preferred v2.
- Preserve the provider's native timestamp fields (`dt`, `ts`) because they are part of the documented response structure.
- Normalize country lookup as a single route family with a flexible path token rather than splitting ISO and name lookup into separate fireROUTE operations.
- Flag hosted-base-url selection as deployment-specific during adapter setup because the official docs emphasize self-hosting and example deployments rather than one stable canonical host.
