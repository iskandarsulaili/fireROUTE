# CountryStateCity

## Provider metadata
- Category: `Geocoding`
- Provider slug: `countrystatecity`
- Official docs used manually:
  - `https://countrystatecity.in/`
  - `https://countrystatecity.in/product/api/`
  - `https://docs.countrystatecity.in/`
  - `https://docs.countrystatecity.in/llms.txt`
- Public API base URL documented by provider: `https://api.countrystatecity.in/v1`
- Transport: `HTTPS`
- Auth model: API key sent in header `X-CSCAPI-KEY`
- Response formats documented: `JSON`

## Product and access notes
- The official docs describe CountryStateCity as a geographical data platform covering `247+ countries`, `5,000+ states/provinces`, and `150,000+ cities` worldwide.
- The product page calls the API `production-ready`, advertises `50M+ requests monthly`, and shows `99.9%`/`99.98%` uptime claims depending on page context.
- The docs text describes `sub-100ms` global response times, while the marketing page also describes average responses under `200ms`.
- The product page's live code example explicitly uses the API base `https://api.countrystatecity.in/v1` with header `X-CSCAPI-KEY`.
- The docs index says the API uses consistent REST/JSON responses and lists common HTTP status codes `200`, `401`, `404`, `429`, and `500`.
- The pricing section says the free `Community` plan includes `3,000 API Requests/month (100/day)`, and `Starter` includes `9,000 API Requests/month (300/day)`.
- The same pricing text says the community tier includes `States by country and cities by state endpoints`, but the exact city route path was not shown in the snippets I could manually inspect in this run.

## Confirmed API surface
The inspected official pages confirm these `2` concrete request patterns:
1. `GET /countries`
2. `GET /countries/{countryIso2}/states`

## Shared request rules
- Base route family: `https://api.countrystatecity.in/v1`
- Authentication: send `X-CSCAPI-KEY: {your-api-key}`.
- Responses are JSON.
- No pagination scheme was visible on the manually inspected official pages in this run.
- The docs describe broader endpoint coverage for countries, states, and cities, but only the two paths above were shown explicitly in the inspected official code examples.

## 1) List countries
- Method: `GET`
- Path pattern: `/countries`
- Full URL pattern: `https://api.countrystatecity.in/v1/countries`
- Purpose: return country records from the CSC dataset.

Documented request details visible on the official product page:
- Required header: `X-CSCAPI-KEY`
- No query parameters were shown in the inspected official example.

Response notes visible on the official product page:
- The page shows JSON responses.
- A live response example includes fields such as `id`, `name`, `iso2`, `capital`, `currency`, `phone_code`, and `emoji`.

## 2) List states in a country
- Method: `GET`
- Path pattern: `/countries/{countryIso2}/states`
- Full URL pattern: `https://api.countrystatecity.in/v1/countries/{countryIso2}/states`
- Purpose: return states / provinces for a selected country.

Documented request details visible on the official product page:
- Required header: `X-CSCAPI-KEY`
- Path parameter: `countryIso2`
- The official code example uses `IN`, which strongly indicates ISO 3166-1 alpha-2 country codes.

Response notes:
- The official product page shows this endpoint as a JSON-returning request in the same fetch example style as the countries endpoint.

## Errors, rate limits, and format notes
- The official docs index explicitly lists these status codes as part of the API architecture notes:
  - `200`
  - `401`
  - `404`
  - `429`
  - `500`
- The inspected official pages do not document a cursor, offset, or page-number pagination model.
- The free-plan pricing page provides the clearest visible quota numbers from the inspected official pages:
  - `3,000 API Requests/month (100/day)` on Community
  - `9,000 API Requests/month (300/day)` on Starter
- The docs describe `high-performance JSON responses` and RESTful design.

## Canonical fireROUTE notes
- Keep CSC auth in a request-header model using `X-CSCAPI-KEY`; the inspected official pages did not show query-string auth.
- Treat the country list and country-to-states lookup as confirmed routes.
- The provider clearly advertises additional city-level coverage, but do not add extra paths unless a route-level official page exposes the exact canonical path strings.

## Verification notes
- This file was manually rebuilt from live official CountryStateCity pages using browser tools only.
