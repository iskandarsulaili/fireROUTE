# Open Disease

## Provider metadata
- Category: `Health`
- Provider slug: `open-disease`
- Official docs/pages used:
  - `https://disease.sh/`
  - `https://disease.sh/docs/`
  - `https://disease.sh/apidocs/swagger_v3.json`
- Current public API base URL: `https://disease.sh`
- Auth model: no authentication required for the reviewed public endpoints
- Response format: JSON
- License note from official docs: `GNU V3`
- Published version in the reviewed docs: `3.0.0`
- Public rate-limit note: no numeric rate limit was published in the reviewed homepage, Swagger UI, or OpenAPI document
- Manually confirmed route count: `41`

## Authentication and access
- The reviewed homepage and Swagger UI expose public `GET` endpoints with no API key, bearer token, or OAuth flow.
- The official docs describe disease.sh as a third-party API for reliable global disease information.
- The reviewed OpenAPI document exposes only read operations.

## Canonical endpoints
### COVID-19: Worldometers
1. `GET /v3/covid-19/all` - global totals
2. `GET /v3/covid-19/states` - all US states
3. `GET /v3/covid-19/states/{states}` - one or more US states
4. `GET /v3/covid-19/continents` - all continents
5. `GET /v3/covid-19/continents/{continent}` - one continent
6. `GET /v3/covid-19/countries` - all countries
7. `GET /v3/covid-19/countries/{country}` - one country
8. `GET /v3/covid-19/countries/{countries}` - multiple countries

### COVID-19: JHUCSSE
9. `GET /v3/covid-19/jhucsse` - all countries and provinces
10. `GET /v3/covid-19/jhucsse/counties` - all US counties
11. `GET /v3/covid-19/jhucsse/counties/{county}` - one county
12. `GET /v3/covid-19/historical` - all countries and provinces historical series
13. `GET /v3/covid-19/historical/all` - global historical series
14. `GET /v3/covid-19/historical/{country}` - one country historical series
15. `GET /v3/covid-19/historical/{countries}` - multiple countries historical series
16. `GET /v3/covid-19/historical/{country}/{province}` - one province in one country
17. `GET /v3/covid-19/historical/{country}/{provinces}` - multiple provinces in one country
18. `GET /v3/covid-19/historical/usacounties` - list supported US states for USA counties history
19. `GET /v3/covid-19/historical/usacounties/{state}` - all counties in one US state

### COVID-19: NYT
20. `GET /v3/covid-19/nyt/states` - historical series for all states
21. `GET /v3/covid-19/nyt/states/{state}` - historical series for one or more states
22. `GET /v3/covid-19/nyt/counties` - historical series for all available counties
23. `GET /v3/covid-19/nyt/counties/{county}` - historical series for one or more counties
24. `GET /v3/covid-19/nyt/usa` - historical series for the whole USA

### COVID-19: Apple mobility
25. `GET /v3/covid-19/apple/countries` - supported countries
26. `GET /v3/covid-19/apple/countries/{country}` - supported subregions for one country
27. `GET /v3/covid-19/apple/countries/{country}/{subregions}` - mobility data for one or more subregions

### COVID-19: Government
28. `GET /v3/covid-19/gov/` - supported countries for government-reported data
29. `GET /v3/covid-19/gov/{country}` - one country's government-reported data

### COVID-19: Vaccine
30. `GET /v3/covid-19/vaccine` - vaccine trial data
31. `GET /v3/covid-19/vaccine/coverage` - total global doses administered
32. `GET /v3/covid-19/vaccine/coverage/countries` - coverage for all countries
33. `GET /v3/covid-19/vaccine/coverage/countries/{country}` - coverage for one country
34. `GET /v3/covid-19/vaccine/coverage/states` - coverage for all states
35. `GET /v3/covid-19/vaccine/coverage/states/{state}` - coverage for one state

### COVID-19: Therapeutics
36. `GET /v3/covid-19/therapeutics` - therapeutics trial data

### COVID-19: Variants
37. `GET /v3/covid-19/variants/countries/` - supported countries for variants data
38. `GET /v3/covid-19/variants/countries/{country}` - one country's variants data

### Influenza: CDC
39. `GET /v3/influenza/cdc/ILINet` - influenza-like illness data
40. `GET /v3/influenza/cdc/USCL` - US clinical labs influenza report data
41. `GET /v3/influenza/cdc/USPHL` - US public health labs influenza report data

## Parameter notes
Common query parameters documented in the official OpenAPI:
- `yesterday` - available on current-stat endpoints for prior-day data
- `twoDaysAgo` - available on selected global/continent/country endpoints
- `sort` - supported on list endpoints such as states, continents, and countries
- `allowNull` - return nulls instead of coercing missing values to `0`
- `strict` - available on singular continent/country lookups for exact matching control
- `lastdays` - historical and vaccine-coverage window selector
- `fullData` - vaccine coverage endpoints can return a fuller data shape

Common required path parameters documented in the official OpenAPI:
- `states` - comma-separated state name list
- `continent` - continent name
- `country` / `countries` - one country or comma-separated country list
- `province` / `provinces` - province selector(s) for historical series
- `state` - US state for county history, NYT state history, or vaccine state coverage
- `county` - county selector for JHUCSSE or NYT county history
- `subregions` - Apple mobility subregion selector(s)

Examples of path-specific parameter patterns from the official OpenAPI:
- `/v3/covid-19/all` supports `yesterday`, `twoDaysAgo`, and `allowNull`
- `/v3/covid-19/continents/{continent}` supports `strict` in addition to `yesterday`, `twoDaysAgo`, and `allowNull`
- `/v3/covid-19/historical*` endpoints center on `lastdays`
- `/v3/covid-19/vaccine/coverage*` endpoints use `lastdays` and `fullData`

## Response, pagination, and error notes
- The reviewed OpenAPI publishes JSON responses and only advertises `200` responses; it does not publish a shared error schema.
- The API is not documented with offset/page pagination; the main time-window control is `lastdays`.
- List ordering, where offered, is controlled by the `sort` query parameter rather than a pagination model.
- Because the docs expose both singular and plural country/state path variants, fireROUTE should preserve both forms rather than collapsing them.

## Usage notes from the official docs
- The homepage and Swagger UI present disease.sh as a multi-source, public disease data API.
- The Swagger tags explicitly call out freshness expectations by source family, including 10-minute, 24-hour, and weekly update cadences.
- The vaccine and therapeutics endpoints are documented as RAPS-derived trial datasets.
- The variants endpoints are documented as ECDC/TESSy-derived datasets.

## fireROUTE normalization notes
- Normalize this provider as a public, read-only JSON API rooted at `/v3`.
- Preserve the source-family groupings because the semantics differ materially between Worldometers, JHUCSSE, NYT, Apple, government, vaccine, variants, and influenza data.
- Keep singular and plural country/state path variants distinct; the official OpenAPI documents them separately.
- Model `lastdays`, `yesterday`, `twoDaysAgo`, `strict`, `allowNull`, `sort`, and `fullData` as first-class query controls.