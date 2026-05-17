# GeoNames

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geonames`
- Official docs used manually:
  - `https://www.geonames.org/export/web-services.html`
- Public API base URL documented by provider: `http://api.geonames.org`
- Transport: the inspected official examples use `HTTP`
- Auth model: the inspected documentation examples consistently use query parameter `username`; the docs page also links to account setup pages for enabling the webservice
- Response formats documented in the inspected sections: `XML` and `JSON`

## Product and access notes
- The inspected page is GeoNames' main web-services documentation page.
- The visible geocoding sections cover postal-code search, postal-code lookup, nearby postal-code reverse geocoding, postal-code country availability, and nearby populated-place reverse geocoding.
- The page links to additional sections such as JSON services, credits per request, and exceptions, but the route details below are limited to the endpoint sections visibly inspected on the official page.

## Confirmed API surface
The inspected official documentation visibly confirms these `7` geocoding-related route families:
1. `GET /postalCodeSearch`
2. `GET /postalCodeSearchJSON`
3. `GET /postalCodeLookupJSON`
4. `GET /findNearbyPostalCodes`
5. `GET /findNearbyPostalCodesJSON`
6. `GET /postalCodeCountryInfo`
7. `GET /findNearbyPlaceName`

## Shared request and format notes
- All inspected examples include `username={username}`.
- XML endpoints use the provider's `style` verbosity values `SHORT`, `MEDIUM`, `LONG`, and `FULL` where documented.
- JSON endpoints are separate paths ending in `JSON` rather than a content-negotiation toggle.
- No OAuth flow, API key header, or bearer-token scheme was shown in the inspected sections.

## 1) Postal code search (XML)
- Method: `GET`
- Path: `/postalCodeSearch`
- Full URL pattern: `http://api.geonames.org/postalCodeSearch?postalcode={postalcode}&maxRows={maxRows}&username={username}`
- Purpose: search places by postal code and/or place name

Documented parameters visible on the official page:
- `postalcode` - string; `postalcode` or `placename` is required
- `postalcode_startsWith` - string prefix filter
- `placename` - string; `postalcode` or `placename` is required
- `placename_startsWith` - string prefix filter
- `country` - ISO 3166 country code; may appear more than once
- `countryBias` - prioritize results from one country
- `maxRows` - integer; default `10`
- `style` - `SHORT`, `MEDIUM`, `LONG`, `FULL`; default `MEDIUM`
- `operator` - `AND` or `OR`; default `AND`
- `charset` - default `UTF8`
- `isReduced` - `true`/`false`; default `false`
- `east`, `west`, `north`, `south` - optional bounding box filters
- `username`

Response notes:
- documented as an XML document
- the page says results include postal code, place name, country, and admin-name fields

Important official notes:
- `country` can be repeated, for example `country=FR&country=GP`
- `isReduced=true` returns only UK outer codes or NL 4-digit codes

## 2) Postal code search (JSON)
- Method: `GET`
- Path: `/postalCodeSearchJSON`
- Full URL pattern: `http://api.geonames.org/postalCodeSearchJSON?postalcode={postalcode}&maxRows={maxRows}&username={username}`
- Purpose: JSON variant of postal-code / place-name search

Documented notes:
- the docs explicitly present this as the JSON format of `/postalCodeSearch`
- parameter behavior follows the postal-code search section above

## 3) Placename lookup by postal code (JSON)
- Method: `GET`
- Path: `/postalCodeLookupJSON`
- Full URL pattern: `http://api.geonames.org/postalCodeLookupJSON?postalcode={postalcode}&country={country}&username={username}`
- Purpose: return the places associated with a single postal code in JSON

Documented parameters visible on the official page:
- `postalcode`
- `country`
- `maxRows` - default `20`
- `callback`
- `charset` - default `UTF-8`
- `username`

Response notes:
- the page says the response is a list of places sorted by `postalcode,placename`
- this section is documented as `REST /JSON`

## 4) Nearby postal codes / reverse geocoding (XML)
- Method: `GET`
- Path: `/findNearbyPostalCodes`
- Full URL pattern: `http://api.geonames.org/findNearbyPostalCodes?lat={lat}&lng={lng}&username={username}`
- Purpose: reverse geocode coordinates to nearby postal codes and places

Documented parameters visible on the official page:
- `lat`
- `lng`
- `radius` - in kilometers
- `maxRows` - default `5`
- `style` - `SHORT`, `MEDIUM`, `LONG`, `FULL`
- `country` - defaults to all countries
- `localCountry` - `true` restricts border-area searches to the local country
- `isReduced=true` - returns only the first part of the code for GB and NL
- `username`

Official limits shown in this section:
- radius limit: `30 km` on the free service
- radius limit: `160 km` on the premium service
- max rows: `500` on the free service
- max rows: `2500` on the premium service

Response notes:
- documented as XML
- results are sorted by distance
- for Canada, the docs say the returned code is the FSA (first 3 characters)
- examples show both coordinate-driven lookup and postalcode+country lookup with radius

## 5) Nearby postal codes / reverse geocoding (JSON)
- Method: `GET`
- Path: `/findNearbyPostalCodesJSON`
- Full URL pattern: `http://api.geonames.org/findNearbyPostalCodesJSON?postalcode={postalcode}&country={country}&radius={radius}&username={username}`
- Purpose: JSON variant of nearby postal-code reverse geocoding

Documented notes:
- the docs explicitly present this as the JSON version of `/findNearbyPostalCodes`
- the visible example uses `postalcode`, `country`, `radius`, and `username`

## 6) Postal-code country availability
- Method: `GET`
- Path: `/postalCodeCountryInfo`
- Full URL pattern: `http://api.geonames.org/postalCodeCountryInfo?username={username}`
- Purpose: list countries for which postal-code geocoding is available

Documented request notes:
- no extra route-specific parameters were shown beyond `username`
- the endpoint is documented as `REST`

## 7) Nearby populated place / reverse geocoding
- Method: `GET`
- Path: `/findNearbyPlaceName`
- Full URL pattern: `http://api.geonames.org/findNearbyPlaceName?lat={lat}&lng={lng}&username={username}`
- Purpose: return the closest populated place for a coordinate pair

Documented parameters visible on the official page:
- `lat`
- `lng`
- `lang` - language of the returned `name`; the pseudo-language `local` returns the local-language name
- `radius` - optional kilometers
- `maxRows` - default `10`
- `style` - `SHORT`, `MEDIUM`, `LONG`, `FULL`; default `MEDIUM`
- `localCountry=true` - restricts border-area searches to the local country
- `cities` - optional filter with values `cities1000`, `cities5000`, or `cities15000`
- `username`

Response notes:
- documented as XML
- returns populated places only (`feature class=P` on the official page)
- the distance unit is `km`

## Pagination, rate limits, errors, and format notes
- No cursor or page-token pagination scheme was shown in the inspected sections.
- The inspected endpoints use `maxRows` limits rather than page-number pagination.
- The only explicit quantitative limits visible in the inspected sections are on `/findNearbyPostalCodes` (`30 km` free radius, `160 km` premium radius, `500` free maxRows, `2500` premium maxRows).
- The page links to separate `credits per request` and `Exceptions - error handling` sections, but no endpoint-specific error table was visible in the inspected sections captured for this rewrite.
- JSON output is provided through dedicated `...JSON` routes rather than a shared `format=json` parameter in the inspected sections.

## Canonical fireROUTE notes
- Keep XML and JSON route families distinct because GeoNames documents them as separate paths.
- `postalCodeSearch` accepts either a postal code or a placename and is broader than `postalCodeLookupJSON`, which is a postal-code lookup endpoint.
- `findNearbyPostalCodes` is the strongest documented reverse-geocoding route in the inspected sections because the official page includes both coordinate parameters and explicit free-vs-premium limits.

## Verification notes
- This file was manually rebuilt from the live official GeoNames web-services documentation page using browser tools.
