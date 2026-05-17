# Nager.Date

## Provider metadata
- Category: `Calendar`
- Provider slug: `nager-date`
- Docs used manually:
  - `https://date.nager.at/scalar/#api-version-3`
  - `https://date.nager.at/api/v3/publicholidays/2024/US`
- Confirmed base URLs:
  - `https://date.nager.at`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `8`

## Authentication
- The official Scalar reference describes Nager.Date as a free public service.
- No API key, OAuth flow, or custom auth header is shown on the reviewed official API reference.

## Common request/response conventions
- The reviewed official reference is versioned under `v3`.
- Confirmed route prefix: `/api/v3`
- The introduction says the API supports public-holiday lookups, long-weekend lookups, country metadata, upcoming holidays, and holiday checks for the current day.
- Responses are JSON.
- Holiday responses include local and English names, national-vs-subdivision applicability, and holiday type classification information according to the official descriptions.

## Manually confirmed endpoint set

### 1) Get detailed country metadata
- Method: `GET`
- Path: `/api/v3/CountryInfo/{countryCode}`
- Full URL: `https://date.nager.at/api/v3/CountryInfo/{countryCode}`
- Purpose: retrieve metadata for a supported country
- Path parameters:
  - `countryCode` - 2-letter ISO 3166-1 alpha-2 country code such as `US` or `GB`
- Confirmed responses from the docs:
  - `200` requested country information returned
  - `404` invalid or unrecognized country code

### 2) List all available countries
- Method: `GET`
- Path: `/api/v3/AvailableCountries`
- Full URL: `https://date.nager.at/api/v3/AvailableCountries`
- Purpose: retrieve the complete list of countries supported by the API

### 3) Retrieve long weekends for a country and year
- Method: `GET`
- Path: `/api/v3/LongWeekend/{year}/{countryCode}`
- Full URL: `https://date.nager.at/api/v3/LongWeekend/{year}/{countryCode}`
- Purpose: list long weekends for a specific year and country
- Path parameters:
  - `year` - integer target year
  - `countryCode` - ISO 3166-1 alpha-2 country code

### 4) Retrieve all public holidays for a year and country
- Method: `GET`
- Path: `/api/v3/PublicHolidays/{year}/{countryCode}`
- Full URL: `https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}`
- Purpose: list all officially recognized public holidays for a given year and country
- Path parameters:
  - `year` - target year
  - `countryCode` - valid ISO 3166-1 alpha-2 country code
- Confirmed responses from the official docs:
  - `200` successfully retrieved holiday list
  - `400` invalid request / validation details
  - `404` invalid or unrecognized country code
- Confirmed response notes from the official description:
  - each holiday entry includes local and English holiday names
  - entries indicate whether the holiday is national or subdivision-scoped
  - entries include holiday type classification information

### 5) Check whether today is a public holiday
- Method: `GET`
- Path: `/api/v3/IsTodayPublicHoliday/{countryCode}`
- Full URL: `https://date.nager.at/api/v3/IsTodayPublicHoliday/{countryCode}`
- Purpose: determine whether today is a public holiday for a country
- Path parameters:
  - `countryCode`
- Confirmed parameter note from the docs introduction/sidebar text:
  - the operation can be adjusted by a UTC offset

### 6) Retrieve next public holidays for a country
- Method: `GET`
- Path: `/api/v3/NextPublicHolidays/{countryCode}`
- Full URL: `https://date.nager.at/api/v3/NextPublicHolidays/{countryCode}`
- Purpose: list upcoming public holidays occurring within the next 365 days for a country
- Path parameters:
  - `countryCode`

### 7) Retrieve upcoming public holidays worldwide
- Method: `GET`
- Path: `/api/v3/NextPublicHolidaysWorldwide`
- Full URL: `https://date.nager.at/api/v3/NextPublicHolidaysWorldwide`
- Purpose: list public holidays occurring worldwide within the next 7 days

### 8) Get API version information
- Method: `GET`
- Path: `/api/v3/Version`
- Full URL: `https://date.nager.at/api/v3/Version`
- Purpose: retrieve version information for the API

## Pagination
- None was documented on the reviewed official pages.
- The reviewed endpoints are described as direct list or lookup responses without page/cursor parameters.

## Rate limits
- The reviewed official pages do not publish a numeric rate-limit table or quota headers.
- The API is described as a free public service, but no formal throttling contract was confirmed in the reviewed docs.

## Error handling
- Explicitly confirmed from reviewed route docs:
  - `400` invalid request / validation details for at least the public-holidays route
  - `404` invalid or unrecognized country code on country/holiday lookups
- Error responses are documented as JSON.

## Response format notes
- Responses are JSON.
- Country metadata responses return country names, region information, and neighboring-country data when available according to the official description.
- Holiday list responses return arrays of holiday objects.

## Important usage notes
- Use ISO 3166-1 alpha-2 country codes.
- The public-holiday route is year-specific and country-specific.
- The `IsTodayPublicHoliday` route is documented as optionally adjustable by UTC offset.
- The API reference is explicitly versioned as `v3`.

## Verification notes
This file was manually rebuilt from Nager.Date's current official Scalar API reference, replacing the earlier generated placeholder.