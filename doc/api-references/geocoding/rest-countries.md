# REST Countries

## Provider metadata
- Category: `Geocoding`
- Provider slug: `rest-countries`
- Official docs used manually:
  - `https://restcountries.com/`
  - `https://gitlab.com/restcountries/restcountries/-/blob/master/FIELDS.md` (linked from the official site as field documentation)
  - `https://gitlab.com/restcountries/restcountries/-/blob/master/README.md` (linked from the official site as documentation)
- Public API base URL: `https://restcountries.com`
- Current stable version shown on the official site: `v3.1`
- Preview version mentioned on the official site: `v4`
- Transport: HTTPS
- Auth model: none
- Response format: JSON

## Service notes
- The official site describes REST Countries as an open-source, free-to-use REST API for country information.
- The home page highlights `4M+` daily requests and `250+` countries/territories represented.
- The quick-start section explicitly says the current stable API version is `v3.1` and that `v4` is in preview.
- The site links its field-level schema documentation in `FIELDS.md` on the official GitLab repository.

## Rate limits / usage notes
- No formal rate-limit policy or quota section was published on the official site page reviewed here.
- The site does describe the service as free to use and notes multi-million daily request volume, but that is capacity context rather than a contractual limit.
- One explicit usage constraint is documented for the `all` endpoint:
  - you **must** specify `fields` when calling `/v3.1/all`
  - the quick-start section says you may request up to `10` fields there
  - otherwise the service returns a `bad request` response

## Authentication
- `No authentication required.`
- No API key, token, or OAuth flow is described anywhere on the official site page.

## Pagination / batching
- No pagination model is documented on the official site.
- Collection endpoints return full filtered result sets directly.
- Bulk code lookup is handled by the `alpha?codes=` query style rather than a paginated or POST batching model.

## Error notes
Explicitly documented on the official home page:
- `/v3.1/all` without `fields` returns a `bad request`

Not explicitly documented on the reviewed official page:
- a complete HTTP error matrix
- formal rate-limit error behavior

## Common query modifiers
### `fields`
The official site documents a response filter modifier:
- pattern: `/v3.1/{service}?fields={field},{field}`
- quick-start note: up to `10` fields on `/v3.1/all`
- example shown: `/v3.1/all?fields=name,capital,currencies`

### `fullText`
Used on the full country-name lookup route:
- `/v3.1/name/{name}?fullText=true`

### `status`
Used on the independence filter route:
- `/v3.1/independent?status=true`
- official example combines it with field filtering: `?status=true&fields=languages,capital`

## Confirmed API surface
The official site currently documents `13` public route patterns:
1. `GET /v3.1/all?fields=...`
2. `GET /v3.1/name/{name}`
3. `GET /v3.1/name/{name}?fullText=true`
4. `GET /v3.1/alpha/{code}`
5. `GET /v3.1/alpha?codes={code},{code}`
6. `GET /v3.1/currency/{currency}`
7. `GET /v3.1/lang/{language}`
8. `GET /v3.1/capital/{capital}`
9. `GET /v3.1/region/{region}`
10. `GET /v3.1/subregion/{subregion}`
11. `GET /v3.1/demonym/{demonym}`
12. `GET /v3.1/translation/{translation}`
13. `GET /v3.1/independent?status=true`

## 1) All countries
- Method: `GET`
- Path pattern: `/v3.1/all`
- Full URL pattern: `https://restcountries.com/v3.1/all?fields=...`
- Purpose: retrieve all countries

Required usage note from official docs:
- must specify `fields`
- quick-start section says you may request up to `10` fields
- otherwise the endpoint returns a bad request

Example shown by provider:
- `/v3.1/all?fields=name,flags`

## 2) Search by country name
- Method: `GET`
- Path pattern: `/v3.1/name/{name}`
- Full URL pattern: `https://restcountries.com/v3.1/name/{name}`
- Purpose: search by country common name or official name value

Path parameter:
- `name` - country name term to search

Example shown by provider:
- `/v3.1/name/peru`

## 3) Search by full country name
- Method: `GET`
- Path pattern: `/v3.1/name/{name}`
- Full URL pattern: `https://restcountries.com/v3.1/name/{name}?fullText=true`
- Purpose: perform a full-text country-name lookup rather than broader name matching

Path parameter:
- `name` - full common or official country name

Query parameter:
- `fullText=true` - require full-name matching

Example shown by provider:
- `/v3.1/name/aruba?fullText=true`

## 4) Search by country code
- Method: `GET`
- Path pattern: `/v3.1/alpha/{code}`
- Full URL pattern: `https://restcountries.com/v3.1/alpha/{code}`
- Purpose: search by `cca2`, `ccn3`, `cca3`, or `cioc` code

Path parameter:
- `code` - country code in one of the documented formats

Examples shown by provider:
- `/v3.1/alpha/co`
- `/v3.1/alpha/col`
- `/v3.1/alpha/170`

## 5) Search multiple country codes
- Method: `GET`
- Path: `/v3.1/alpha`
- Full URL pattern: `https://restcountries.com/v3.1/alpha?codes={code},{code}`
- Purpose: fetch multiple countries by code in a single request

Query parameter:
- `codes` - comma-separated list of country codes

Example shown by provider:
- `/v3.1/alpha?codes=170,no,est,pe`

## 6) Search by currency
- Method: `GET`
- Path pattern: `/v3.1/currency/{currency}`
- Full URL pattern: `https://restcountries.com/v3.1/currency/{currency}`
- Purpose: search by currency code or currency name

Path parameter:
- `currency` - currency code or name

Example shown by provider:
- `/v3.1/currency/cop`

## 7) Search by language
- Method: `GET`
- Path pattern: `/v3.1/lang/{language}`
- Full URL pattern: `https://restcountries.com/v3.1/lang/{language}`
- Purpose: search by language code or language name

Path parameter:
- `language` - language code or name

Example shown by provider:
- `/v3.1/lang/spanish`

## 8) Search by capital city
- Method: `GET`
- Path pattern: `/v3.1/capital/{capital}`
- Full URL pattern: `https://restcountries.com/v3.1/capital/{capital}`
- Purpose: search countries by capital city

Path parameter:
- `capital` - capital city name

Example shown by provider:
- `/v3.1/capital/tallinn`

## 9) Filter by region
- Method: `GET`
- Path pattern: `/v3.1/region/{region}`
- Full URL pattern: `https://restcountries.com/v3.1/region/{region}`
- Purpose: return countries in a region

Path parameter:
- `region` - region name

Example shown by provider:
- `/v3.1/region/europe`

## 10) Filter by subregion
- Method: `GET`
- Path pattern: `/v3.1/subregion/{subregion}`
- Full URL pattern: `https://restcountries.com/v3.1/subregion/{subregion}`
- Purpose: return countries in a subregion

Path parameter:
- `subregion` - subregion name

Example shown by provider:
- `/v3.1/subregion/Northern Europe`

## 11) Search by demonym
- Method: `GET`
- Path pattern: `/v3.1/demonym/{demonym}`
- Full URL pattern: `https://restcountries.com/v3.1/demonym/{demonym}`
- Purpose: search by the term used for a country's citizens

Path parameter:
- `demonym` - citizen descriptor

Example shown by provider:
- `/v3.1/demonym/peruvian`

## 12) Search by translation
- Method: `GET`
- Path pattern: `/v3.1/translation/{translation}`
- Full URL pattern: `https://restcountries.com/v3.1/translation/{translation}`
- Purpose: search by translated country names

Path parameter:
- `translation` - translated name text

Example shown by provider:
- `/v3.1/translation/alemania`

## 13) Filter by independence status
- Method: `GET`
- Path: `/v3.1/independent`
- Full URL pattern: `https://restcountries.com/v3.1/independent?status=true`
- Purpose: return independent or non-independent countries

Query parameter:
- `status` - boolean-like selector for independence state; official example uses `true`

Official example:
- `/v3.1/independent?status=true`
- the docs also show combining this with field filtering: `?status=true&fields=languages,capital`

## Response-shape notes
- The official site describes the service as JSON-based and all examples are JSON responses.
- `fields` can be used on service routes to trim the response payload to only requested properties.
- The linked `FIELDS.md` page is the official reference for individual field names and meanings.

## Canonical fireROUTE notes
- This is an unauthenticated country-information API with a single stable documented namespace: `/v3.1`.
- `/v3.1/all` is the only route on the home page with a documented mandatory `fields` requirement.
- The API is largely read-only and path-driven; there are no POST routes or pagination constructs in the official docs reviewed here.
- `fields` is the main payload-shaping control across the API surface.

## Verification notes
This file was manually rebuilt from the official REST Countries website and the official GitLab pages linked from that site, using browser tools only.