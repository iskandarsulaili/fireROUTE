# Calendarific

## Provider metadata
- Category: `Calendar`
- Provider slug: `calendarific`
- Docs used manually:
  - `https://calendarific.com/`
  - `https://calendarific.com/api-documentation`
- Confirmed API base URL: `https://calendarific.com/api/v2`
- Authentication model: API key passed as the `api_key` query parameter
- Primary response format: JSON
- Manually confirmed routes in this pass: `3`

## Authentication
- The official API documentation says every request requires an API key.
- The key is sent as the `api_key` URL parameter.
- The docs explicitly show requests like: https://calendarific.com/api/v2/holidays?api_key=YOUR_KEY .
- The docs also say the key is retrieved from the account pages after signup.

## Common request/response conventions
- Base URL: `https://calendarific.com/api/v2`
- The docs say the API is REST-based and HTTPS-only.
- Successful responses are wrapped in a top-level JSON envelope with:
  - `meta`
    - includes `code` (for example `200`)
  - `response`
    - contains the route-specific payload such as `holidays`
- The published sample holiday object includes:
  - `name`
  - `description`
  - `date.iso`
  - `date.datetime.year`
  - `date.datetime.month`
  - `date.datetime.day`
  - `type` (array)
- The docs say requests to any endpoint count against API-hit quota.

## Manually confirmed endpoint set

### 1) List holidays
- Method: `GET`
- Path: `/holidays`
- Full URL: `https://calendarific.com/api/v2/holidays`
- Purpose: return holidays/observances for a country and year.
- Required query parameters confirmed in the docs:
  - `api_key` - account API key
  - `country` - ISO-3166 country code
  - `year` - numeric year; docs say historical and future years are supported through `2049`
- Optional query parameters confirmed in the docs:
  - `day` - numeric day filter `1..31`
  - `month` - numeric month filter `1..12`
  - `location` - ISO-3166 subdivision code, such as `us-ny`
  - `type` - comma-separated holiday types; docs list `national`, `local`, `religious`, and `observance`
  - `language` - premium parameter; 2-letter ISO-639 language code
  - `uuid` - premium boolean-style flag to return a UUID for each holiday
  - `callback` - JSONP callback parameter referenced by the docs' JSONP section
- Response notes confirmed in the docs:
  - JSON envelope with `meta.code` and `response.holidays`
  - each holiday contains name/description/date/type fields
- Important notes:
  - docs state some optional parameters are limited to paid plans
  - using premium-only parameters without the required subscription causes an error

### 2) List supported languages
- Method: `GET`
- Path: `/languages`
- Full URL: `https://calendarific.com/api/v2/languages`
- Purpose: return the languages supported by Calendarific.
- Confirmed query parameters:
  - `api_key` - required authentication parameter
  - `callback` - JSONP callback support is documented generally for the API
- Response notes confirmed in the docs:
  - used to retrieve language names and ISO codes programmatically
  - docs note that not every holiday is available in every language; if unavailable, results default to the country's official language or English in most cases

### 3) List supported countries
- Method: `GET`
- Path: `/countries`
- Full URL: `https://calendarific.com/api/v2/countries`
- Purpose: return supported countries and languages.
- Confirmed query parameters:
  - `api_key` - required; the docs explicitly say this is the only required parameter for `/countries`
  - `callback` - JSONP callback support is documented generally for the API
- Response notes confirmed in the docs:
  - used to retrieve country names and ISO codes programmatically
  - docs position it as the index for supported countries and languages

## Pagination
- No page, cursor, offset, or limit parameters were documented on the reviewed official pages.
- The confirmed endpoints appear to return full result sets for the requested resource/filter combination.

## Rate limits and quotas
- The documentation says free usage is limited to `1,000` API requests per day.
- If the free-plan daily limit is exceeded, the API returns HTTP `429`.
- Paid plans use monthly limits and configurable alerts.

## Error handling
### HTTP status codes explicitly documented
- `200` - success
- `401` - unauthorized; docs describe this as missing or incorrect API token
- `422` - unprocessable entity / invalid request data
- `429` - too many requests / API limits reached
- `500` - internal server error
- `503` - service unavailable during planned outages

### API error codes explicitly documented for `422` responses
- `600` - maintenance
- `601` - unauthorized / missing or incorrect API token
- `602` - invalid query parameters
- `603` - authorized subscription level required

## Response format notes
- Primary response format is JSON.
- The docs say Calendarific tries to auto-detect API callers and return JSON instead of HTML.
- The docs also say JSON can be forced by either:
  - adding `/json` to the URL, or
  - sending an `Accept: application/json` header
- JSONP is supported through a `callback` parameter.
- CORS support is explicitly documented.

## Important usage notes
- The v2 API is the current documented version; the docs page prominently says v1 has been deprecated.
- All requests are expected to use HTTPS.
- Holiday-type filtering is taxonomy-based rather than route-based.
- `language` and `uuid` are documented as premium parameters.
- `location` filtering uses ISO-3166 subdivision identifiers rather than free-form place names.

## Verification notes
This file was manually rebuilt from Calendarific's official homepage and official API documentation page using browser inspection.