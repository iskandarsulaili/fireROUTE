# Battuta

## Provider metadata
- Category: `Geocoding`
- Provider slug: `battuta`
- Official docs used manually:
  - `http://battuta.medunes.net/`
- Public API base URL documented by provider: `http://battuta.medunes.net/api`
- Transport: `HTTP` only on the inspected official page
- Auth model: API key in query parameter `key`
- Response formats documented: `JSON`; JSONP is supported on city search through the `callback` query parameter

## Product and access notes
- Battuta presents itself as a country / region / city location API.
- The page says every request requires a `32 byte long` hash key.
- The docs show this missing-key response:
  - `{"error":"Missing API key. Please visit battuta.medunes.net to get an API key. Also read the documentation for more information."}`
- The docs show this invalid-key response:
  - `{"message":"Authentication credentials could not be found."}`
- The page says the maximum number of API requests is `500 requests`, but it does not specify a time window on the inspected page.
- The docs say all API requests use the `HTTP GET` method.

## Confirmed API surface
The inspected official page documents these `7` route families:
1. `GET /quota/`
2. `GET /country/all/`
3. `GET /country/code/{country_code}/`
4. `GET /country/search/`
5. `GET /region/{country_code}/all/`
6. `GET /{country_code}/region/search/`
7. `GET /city/{country_code}/search/`

## Shared request and error notes
- All requests require `key={YOUR_API_KEY}` as a query parameter.
- The page says unsupported parameters return `HTTP_BAD_REQUEST` with a JSON body.
- The example bad-parameter response is:
  - `{"error":"Unknown parameters: wrongParam. PLease check the API documentation for more details."}`
- Empty result sets are returned as `[]` for documented no-match cases.
- The docs explicitly say some country and region routes accept no additional parameters, while search routes accept only specific parameter combinations.

## 1) Quota monitoring
- Method: `GET`
- Path: `/quota/`
- Full URL pattern: `http://battuta.medunes.net/api/quota/?key={YOUR_API_KEY}`
- Purpose: check remaining request quota without consuming quota

Documented request notes:
- required query parameter: `key`
- the page explicitly says this request does not decrease quota

## 2) List all countries
- Method: `GET`
- Path: `/country/all/`
- Full URL pattern: `http://battuta.medunes.net/api/country/all/?key={YOUR_API_KEY}`
- Purpose: list all countries in the dataset

Documented response shape:
- array of objects with:
  - `name`
  - `code` - ISO 3166-1 alpha-2 country code

Rules shown on the docs page:
- no parameters are allowed besides `key`

## 3) Country by code
- Method: `GET`
- Path: `/country/code/{country_code}/`
- Full URL pattern: `http://battuta.medunes.net/api/country/code/{country_code}/?key={YOUR_API_KEY}`
- Purpose: fetch a country record from its alpha-2 code

Path parameter:
- `country_code` - ISO 3166-1 alpha-2 code such as `kr`

Response notes:
- successful example returns an array containing one object with `name` and `code`
- if the country code does not exist, the docs show an empty array `[]`

## 4) Country search
- Method: `GET`
- Path: `/country/search/`
- Full URL pattern: `http://battuta.medunes.net/api/country/search/?country={COUNTRY_NAME_HINT}&region={REGION_NAME_HINT}&city={CITY_NAME_HINT}&key={YOUR_API_KEY}`
- Purpose: search countries by country-name text, region-name text, city-name text, or combinations of those hints

Documented optional query parameters:
- `country` - text that should appear in the country name
- `region` - text that should appear in any region belonging to the country
- `city` - text that should appear in any city belonging to the country

Combination rules stated on the page:
- allowed combinations range from `0` to `3` of those parameters
- no parameters behaves like listing all countries
- supported combinations are:
  - `country`
  - `region`
  - `city`
  - `country + region`
  - `country + city`
  - `region + city`
  - `country + region + city`

Response notes:
- returns an array of `{name, code}` country objects
- no matches return `[]`

## 5) List all regions for a country
- Method: `GET`
- Path: `/region/{country_code}/all/`
- Full URL pattern: `http://battuta.medunes.net/api/region/{COUNTRY_CODE}/all/?key={YOUR_API_KEY}`
- Purpose: list every region in a single country

Path parameter:
- `country_code` - required alpha-2 country code

Response fields shown:
- `region`
- `code` - country code

Rule shown on the docs page:
- no additional parameters are allowed besides `key`

## 6) Region search within a country
- Method: `GET`
- Path: `/{country_code}/region/search/`
- Full URL pattern: `http://battuta.medunes.net/api/{COUNTRY_CODE}/region/search/?region={REGION_NAME_HINT}&city={CITY_NAME_HINT}&key={YOUR_API_KEY}`
- Purpose: search regions inside one country by region-name hint and/or city-name hint

Important official note:
- the docs say region-oriented searches must be relative to a unique country represented by its alpha-2 code

Documented optional query parameters:
- `region` - text that should appear in the region name
- `city` - text that should appear in any city belonging to the region

Combination rules stated on the page:
- allowed combinations range from `0` to `2`
- no parameters behaves like listing all regions for the country
- supported combinations are `region`, `city`, or `region + city`

Response notes:
- the docs describe an array of region results associated with the supplied country code
- no matches return `[]`

## 7) City search within a country
- Method: `GET`
- Path: `/city/{country_code}/search/`
- Full URL pattern: `http://battuta.medunes.net/api/city/{COUNTRY_CODE}/search/?region={REGION_NAME_HINT}&city={CITY_NAME_HINT}&key={YOUR_API_KEY}`
- Purpose: search cities inside one country by city-name hint and/or region-name hint

Important official notes:
- the docs say city-oriented searches must be relative to a unique country represented by its alpha-2 code
- the page says listing all cities of a country is not available
- city and region hints must be at least `3` characters long for city-oriented search
- the docs show this validation response when a hint is too short:
  - `{"error":"The region parameter must be at least three (3) characters long. Check documentation for more details."}`

Documented optional query parameters:
- `city` - text that should appear in the city name
- `region` - text that should appear in a region containing the city
- `callback` - enables JSONP for AJAX-style requests

Combination rules stated on the page:
- the allowed parameter set is `city`, `region`, or both together
- at least one of `city` or `region` must be supplied

Response fields shown:
- `city`
- `region`
- `country`
- `latitude`
- `longitude`

JSONP note:
- the page says AJAX callers may need JSONP because of CORS restrictions
- the official example appends `callback=?`

## Pagination, limits, and formats
- No page-number, offset, or cursor pagination model is documented on the inspected page.
- Search endpoints return arrays and rely on hint filtering rather than documented pagination controls.
- The only explicit usage ceiling shown is `500 requests`; no requests-per-second figure or reset period was provided on the inspected page.
- Responses are documented as JSON, with JSONP available on city search.

## Canonical fireROUTE notes
- Keep the country-code segment on region and city searches. The prose examples on the page contain a couple of inconsistent generic URLs, but the concrete request examples show country-specific route shapes.
- `/country/search/` is broader than `/country/all/` because it can filter on nested region and city hints.
- `/quota/` is a real documented route and should not be inferred from homepage prose alone.

## Verification notes
- This file was manually rebuilt from the live official Battuta documentation page using browser tools.
