# TomTom

## Provider metadata
- Category: `Geocoding`
- Provider slug: `tomtom`
- Official docs used manually:
  - `https://developer.tomtom.com/geocoding-api/documentation/product-information/introduction`
  - `https://developer.tomtom.com/geocoding-api/documentation/geocode`
  - `https://developer.tomtom.com/geocoding-api/documentation/structured-geocode`
- Public API base URL documented by provider: `https://api.tomtom.com/search/2`
- Region-specific base URL also shown by provider: `https://kr-api.tomtom.com/search/2`
- Transport: `HTTPS`
- Auth model: API key passed as query parameter `key`
- Response formats documented: `json`, `xml`

## Product and access notes
- The inspected official intro page describes TomTom Geocoding API service version `2`.
- TomTom says this product is for traditional geocoding and does not return POIs.
- The intro page says the geocoder is tolerant of typos, incomplete addresses, and partial address strings.
- TomTom exposes separate endpoint pages for free-form geocoding and structured geocoding.
- The checked pages point to TomTom's API Explorer for interactive execution, but the request formats are fully documented in the endpoint pages themselves.
- Reverse geocoding is documented by TomTom as a separate product page, so this file keeps the scope to the Geocoding API pages inspected in this run.

## Confirmed API surface
The inspected official docs confirm these `2` geocoding request patterns:
1. `GET /search/2/geocode/{query}.{ext}`
2. `GET /search/2/structuredGeocode.{ext}`

## Shared request rules
- Base route family: `https://api.tomtom.com/search/2`
- The docs also list `kr-api.tomtom.com` as an allowed regional base URL on the geocoding pages.
- Authentication uses the required query parameter `key`.
- Output format is selected by the path extension placeholder `{ext}` with JSON and XML called out on the intro page.
- Pagination/result-window controls are parameter-based rather than page-number based.
- The pages explicitly say required parameters must be supplied or the call will fail.

## 1) Free-form geocode
- Method: `GET`
- Path pattern: `/geocode/{query}.{ext}`
- Full URL pattern: `https://{baseURL}/search/{versionNumber}/geocode/{query}.{ext}?key=***&storeResult={storeResult}&typeahead={typeahead}&limit={limit}&ofs={ofs}&lat={lat}&lon={lon}&countrySet={countrySet}&radius={radius}&topLeft={topLeft}&btmRight={btmRight}&language={language}&extendedPostalCodesFor={extendedPostalCodesFor}&view={view}&mapcodes={mapcodes}&entityTypeSet={entityTypeSet}`
- Example shown by TomTom: https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154%2C%201011%20AC%2C%20Amsterdam.json?key=***
- Purpose: convert a free-form address or partial address string into a matched address record and coordinates

Documented required inputs visible on the inspected page:
- `baseURL` - the docs show `api.tomtom.com` and `kr-api.tomtom.com`
- `versionNumber` - shown as service version `2`
- `query` - free-form address or place text encoded into the path
- `ext` - response format extension
- `key` - API key

Documented optional parameters visible in the request template:
- `storeResult`
- `typeahead`
- `limit`
- `ofs`
- `lat`
- `lon`
- `countrySet`
- `radius`
- `topLeft`
- `btmRight`
- `language`
- `extendedPostalCodesFor`
- `view`
- `mapcodes`
- `entityTypeSet`

Important official notes:
- TomTom positions this endpoint for address look-up only and says no POIs are returned.
- The endpoint is intended for machine-to-machine geocoding of incomplete or imperfect address text.
- Result paging is parameter-driven through `limit` plus the `ofs` offset parameter rather than a separate page token.

## 2) Structured geocode
- Method: `GET`
- Path pattern: `/structuredGeocode.{ext}`
- Full URL pattern: `https://{baseURL}/search/{versionNumber}/structuredGeocode.{ext}?key={Your_API_Key}&countryCode={countryCode}&limit={limit}&ofss={ofss}&streetNumber={streetNumber}&streetName={streetName}&crossStreet={crossStreet}&municipality={municipality}&municipalitySubdivision={municipalitySubdivision}&countryTertiarySubdivision={countryTertiarySubdivision}&countrySecondarySubdivision={countrySecondarySubdivision}&countrySubdivision={countrySubdivision}&postalCode={postalCode}&language={language}&extendedPostalCodesFor={extendedPostalCodesFor}&view={view}&mapcodes={mapcodes}&entityTypeSet={entityTypeSet}`
- Example shown by TomTom: `https://api.tomtom.com/search/2/structuredGeocode.json?key={Your_API_Key}&streetName=De%20Ruijterkade&streetNumber=154&postalCode=1011%20AC&municipality=Amsterdam&countryCode=NL`
- Purpose: geocode an address that has already been split into separate structured components

Documented address-component parameters visible in the inspected request template:
- `countryCode`
- `streetNumber`
- `streetName`
- `crossStreet`
- `municipality`
- `municipalitySubdivision`
- `countryTertiarySubdivision`
- `countrySecondarySubdivision`
- `countrySubdivision`
- `postalCode`

Additional optional parameters visible in the template:
- `limit`
- `ofss` - this exact offset-style parameter name is what the current official request template shows
- `language`
- `extendedPostalCodesFor`
- `view`
- `mapcodes`
- `entityTypeSet`

Important official notes:
- TomTom describes this endpoint as the better fit when address data has already been split into fields.
- The page repeats that no POIs are returned.
- The structured-geocode request template currently displays `ofss={ofss}`; preserve this exact naming unless TomTom clarifies or changes the published template.

## Pagination, errors, rate limits, and format notes
- The checked endpoint pages expose `limit` and offset-style parameters (`ofs` on free-form geocode and `ofss` in the published structured template) rather than page-number pagination.
- The intro page says responses can be returned in JSON or XML depending on `{ext}`.
- The inspected endpoint pages state that required parameters must be present or the call fails, but no standalone HTTP error-code table was surfaced in the portions of the official docs inspected during this run.
- No numeric rate-limit quota was surfaced on the inspected official Geocoding API pages in this run.
- The checked pages are documentation pages, not anonymous test consoles; practical quota and billing details are tied to TomTom account/API-key management.

## Canonical fireROUTE notes
- Keep TomTom free-form geocoding and structured geocoding as separate operations even though both live under the same `/search/2` family.
- Preserve TomTom's query-string API-key model as documented instead of converting it to an authorization-header abstraction.
- Preserve the region-specific base URL option (`kr-api.tomtom.com`) because the official parameter table calls it out directly.
- Preserve the published `ofss` spelling from the structured-geocode template until an official correction is verified.
- Do not invent POI-search behavior for this provider file; the inspected Geocoding API pages explicitly exclude POI results.

## Verification notes
- This file was manually rebuilt from live official TomTom documentation pages using browser tools only.
