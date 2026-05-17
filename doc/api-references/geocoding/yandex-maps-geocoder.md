# Yandex.Maps Geocoder

## Provider metadata
- Category: `Geocoding`
- Provider slug: `yandex-maps-geocoder`
- Official docs used manually:
  - `https://yandex.com/maps-api/products/geocoder-api`
  - `https://yandex.com/dev/geocode/doc/en/`
  - `https://yandex.com/maps-api/docs/geocoder-api/quickstart.html`
  - `https://yandex.com/maps-api/docs/geocoder-api/request.html`
  - `https://yandex.com/maps-api/docs/geocoder-api/response.html`
- Public API base URL documented by provider: `https://geocode-maps.yandex.ru/v1`
- Transport: HTTPS
- Auth model: API key in query parameter `apikey`
- Response format documented on the inspected HTTP API pages: JSON

## Product and access notes
- The product page describes the API as converting addresses to coordinates and coordinates back to addresses.
- The commercial product page exposes annual request quotas rather than a simple free public quota table.
- The docs explicitly warn that systems sending requests to the Geocoder must support the TLS SNI extension.

## Rate limits and quota notes
The visible official product page exposes annual request bands for the Geocoder product:
- `2.5M` requests/year
- `10M` requests/year
- `25M` requests/year
- `50M` requests/year

Additional official notes:
- exceeding annual limits costs extra
- unlimited licensing is stated as unavailable
- the quick-start page says key activation can take up to `15 minutes`
- the response page documents HTTP `429` when there are too many requests in a short time, but it does not publish a numeric per-second threshold on the inspected pages

## Confirmed API surface
The official Geocoder HTTP docs expose a single endpoint pattern:
1. `GET /` on the Geocoder host, driven by query parameters for forward geocoding, reverse geocoding, bounding, and pagination

## 1) Geocoder API request
- Method: `GET`
- Host/base URL: `https://geocode-maps.yandex.ru/v1`
- Full URL pattern: `https://geocode-maps.yandex.ru/v1/?apikey={key}&geocode={query}&lang={lang}&...`
- Purpose: forward geocode addresses or reverse geocode coordinates using the same HTTP route

Required parameters:
- `apikey` - API key from the Developer Dashboard
- `geocode` - address text for forward geocoding, coordinates for reverse geocoding, or a `uri` value from Geosuggest-linked flows
- `lang` - response language and regional map settings in `language_region` form

Documented optional parameters:
- `sco` - coordinate order for reverse-geocoding input; `longlat` or `latlong`, default `longlat`
- `kind` - reverse-geocoding target type; `house`, `street`, `metro`, `district`, or `locality`
- `rspn` - restrict search to the specified area; `0` or `1`, default `0`
- `ll` - center of search area as `longitude,latitude`
- `spn` - search span as longitude delta and latitude delta
- `bbox` - search box as `x1,y1~x2,y2`
- `results` - max number of returned objects; default `10`, maximum `50`
- `skip` - number of leading results to skip; requires `results` and must divide evenly by `results`
- `uri` - alternate object identifier value returned by related Yandex suggestion flows
- `format` - response format; the request page documents `json`

## Forward geocoding behavior
Officially documented meaning:
- if `geocode` contains an address or place name, the service performs forward geocoding
- results are sorted by similarity to the requested address or name

Official quick-start example:
- `https://geocode-maps.yandex.ru/v1/?apikey=YOUR_API_KEY&geocode=Mohammed+Bin+Rashid+Boulevard+1&lang=en_US&format=json`

## Reverse geocoding behavior
Officially documented meaning:
- if `geocode` contains coordinates, the service performs reverse geocoding
- results are sorted from the smallest enclosing geometry upward, such as house, street, district, then city

Official quick-start example:
- `https://geocode-maps.yandex.ru/v1/?apikey=YOUR_API_KEY&geocode=25.197300,55.274243&lang=en_US&format=json`

Reverse-geocoding-specific notes from the docs:
- `kind` is only used when `geocode` provides coordinates
- `rspn`, `bbox`, and `ll`/`spn` are ignored for reverse geocoding
- if `kind=district`, the `spn` parameter is ignored

## Supported language settings
The request page lists these supported `lang` values:
- `ru_RU`
- `uk_UA`
- `be_BY`
- `en_RU`
- `en_US`
- `tr_TR`

The docs say unsupported locale variants are mapped to the closest supported language.

## Coordinate-input notes
The request page documents multiple coordinate input forms for `geocode`, including:
- signed decimal `longitude,latitude`
- directional decimal coordinates such as `E134.854, S25.828`
- degree/minute/second formats with direction letters
- NMEA-style coordinate input

Additional doc notes:
- spaces, commas, or semicolons can be used as delimiters
- semicolons must be URL-encoded as `%3B`

## Response notes
The response page documents these important response structures:
- `response`
- `GeoObjectCollection`
- `metaDataProperty`
- `GeocoderResponseMetaData`
- `featureMember`
- `GeoObject`
- `GeocoderMetaData`
- `Address`
- `name`
- `description`
- `boundedBy`
- `uri`
- `Point.pos`

Documented metadata fields include:
- `request`
- `found`
- `results`
- `skip`
- optional spelling-correction fields such as `fix` and `suggest`

Important address-format note:
- the docs explicitly mark `AddressDetails` as obsolete and say `Address` should be used instead

## Error handling
The official response page documents these HTTP error codes:
- `400` - missing required parameter or invalid parameter value
- `403` - invalid `apikey`
- `429` - too many requests in a short time

Published error examples include JSON objects with:
- `statusCode`
- `error`
- `message`

Representative official messages shown:
- `Parameter "geocode": "geocode" is not allowed to be empty`
- `"Request" must contain at least one of [geocode, uri]`
- `Missing apikey`
- `Invalid apikey`

## Pagination
The Geocoder endpoint supports offset-style pagination through query parameters:
- `results` controls page size, default `10`, maximum `50`
- `skip` controls the number of leading results omitted from the response
- if `skip` is used, `results` must also be supplied
- `skip` must divide evenly by `results`

## Response-format notes
- The inspected quick-start, request, and response pages consistently show JSON requests and JSON response/error examples.
- The request page documents `format=json` on the endpoint.
- No XML or CSV response mode was documented on the inspected Geocoder HTTP pages.

## Important usage notes
- Yandex exposes one HTTP route whose behavior changes based on the shape of `geocode`.
- Bounding parameters are only meaningful for forward geocoding searches.
- `kind` is a reverse-geocoding refinement rather than a separate endpoint.
- Clients must support TLS SNI when calling the service.

## Canonical fireROUTE notes
- Canonical base URL: `https://geocode-maps.yandex.ru/v1`
- Canonical route: `GET /`
- Model this as one parameter-driven operation with two common modes:
  - forward geocoding via address/place text
  - reverse geocoding via coordinates
- Preserve `results` and `skip` because the provider documents them as the native pagination controls.

## Verification notes
- This file was manually rebuilt from the live official Yandex Maps Geocoder product page and HTTP API documentation using browser tools.