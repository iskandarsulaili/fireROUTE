# Kakao Maps

## Provider metadata
- Category: `Geocoding`
- Provider slug: `kakao-maps`
- Official pages reviewed manually:
  - `https://developers.kakao.com/docs/en/local/common`
  - `https://developers.kakao.com/docs/en/local/dev-guide`
  - `https://developers.kakao.com/docs/en/getting-started/quota`
  - `https://apis.map.kakao.com/web/documentation/#services_Geocoder`
- Product documented: `Kakao Local REST API` under the Kakao Map product family
- Public API base URL documented by provider: `https://dapi.kakao.com/v2/local`
- Transport: `HTTPS`
- Auth model confirmed in the reviewed docs: send `Authorization: KakaoAK ${REST_API_KEY}` in the request header; the Local concepts page also requires a registered app with the Kakao Map API activated in app settings
- Response formats documented by provider: `JSON` and `XML` via the `{FORMAT}` path suffix; the docs default to `json`

## Product and access notes
- The Local concepts page describes the Local API as Kakao's REST surface for place search, category search, and coordinate/address conversion.
- The same concepts page says callers must register an application and activate the Kakao Map API in app settings before using Local API routes.
- The concepts page also notes that, starting `December 1, 2024`, new apps that need to call the Kakao Map API must activate the Kakao Map feature in app settings.
- The Kakao Maps JavaScript docs still expose a separate browser-side `Geocoder` service area, but fireROUTE should model the HTTP Local REST API routes documented on `developers.kakao.com` rather than SDK method names.

## Confirmed API surface
The reviewed official docs confirm these `6` published `GET` route families under `https://dapi.kakao.com/v2/local`:
1. `GET /search/address.{FORMAT}`
2. `GET /geo/coord2regioncode.{FORMAT}`
3. `GET /geo/coord2address.{FORMAT}`
4. `GET /geo/transcoord.{FORMAT}`
5. `GET /search/keyword.{FORMAT}`
6. `GET /search/category.{FORMAT}`

## Shared request, auth, pagination, and format rules
- Base route family: `https://dapi.kakao.com/v2/local/{group}/{operation}.{FORMAT}`
- `FORMAT` supports `json` or `xml`; the docs say the default is `json`.
- All reviewed REST routes require the header `Authorization: KakaoAK ${REST_API_KEY}`.
- Reviewed success responses use `content-type: application/json;charset=UTF-8` or `text/xml;charset=UTF-8` depending on requested format.
- The address and place-search routes use page-based pagination fields in `meta`, including `pageable_count` and `is_end`.
- A live unauthenticated browser fetch to the official address-search endpoint returned `401` with JSON body `{"errorType":"AccessDeniedError","message":"cannot find Authorization : KakaoAK header"}`.
- The public quota page says quotas are tracked per app and can be checked under `[My Applications] > [Statistics] > [Quotas]`. It also publishes a general free monthly quota of `3,000,000` requests across all APIs, but it does not expose a Local-specific public hard request-per-minute number on the reviewed pages.

## 1) Convert address to coordinates
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/search/address.{FORMAT}`
- Purpose: geocode a land-lot number address or road-name address into coordinates and normalized address records

Documented required parameters:
- `query` - address search string

Documented optional parameters:
- `analyze_type` - `similar` or `exact`; defaults to `similar`
- `page` - page number from `1` to `45` (default `1`)
- `size` - documents per page from `1` to `30` (default `10`)

Documented response notes:
- `meta.total_count`
- `meta.pageable_count`
- `meta.is_end`
- `documents[]` objects include `address_name`, `address_type`, `x`, `y`, `address`, and `road_address`
- `address_type` can be `REGION`, `ROAD`, `REGION_ADDR`, or `ROAD_ADDR`

Important official notes:
- The docs call out the `analyze_type` addition as a newer parameter for improving search results.
- The route supports both road-name and land-lot address systems and returns either JSON or XML.

## 2) Convert coordinates to region code
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.{FORMAT}`
- Purpose: convert coordinates into administrative and legal-status area information

Documented required parameters:
- `x` - longitude / X coordinate
- `y` - latitude / Y coordinate

Documented optional parameters:
- `input_coord` - one of `WGS84`, `WCONGNAMUL`, `CONGNAMUL`, `WTM`, `TM` (default `WGS84`)
- `output_coord` - one of `WGS84`, `WCONGNAMUL`, `CONGNAMUL`, `WTM`, `TM` (default `WGS84`)

Documented response notes:
- `meta.total_count`
- `documents[]` include `region_type`, `address_name`, `region_1depth_name`, `region_2depth_name`, `region_3depth_name`, `region_4depth_name`, `code`, `x`, and `y`
- `region_type` is documented as `H` for administrative area or `B` for legal-status area

## 3) Convert coordinates to address
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/geo/coord2address.{FORMAT}`
- Purpose: reverse-geocode coordinates into land-lot and road-name address records

Documented required parameters:
- `x` - longitude / X coordinate
- `y` - latitude / Y coordinate

Documented optional parameters:
- `input_coord` - one of `WGS84`, `WCONGNAMUL`, `CONGNAMUL`, `WTM`, `TM` (default `WGS84`)

Documented response notes:
- `meta.total_count` is documented as `0` or `1`
- `documents[]` contain `address` and `road_address`
- `address` includes fields such as `address_name`, `region_1depth_name`, `region_2depth_name`, `region_3depth_name`, `mountain_yn`, `main_address_no`, `sub_address_no`, and deprecated `zip_code`
- `road_address` includes fields such as `address_name`, `region_1depth_name`, `region_2depth_name`, `region_3depth_name`, `road_name`, `underground_yn`, `main_building_no`, `sub_building_no`, `building_name`, and `zone_no`

Important official note:
- The docs explicitly state that some coordinates may not convert to a road-name address.

## 4) Transform coordinates
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/geo/transcoord.{FORMAT}`
- Purpose: convert coordinates from one coordinate system into another

Documented required parameters:
- `x`
- `y`
- `output_coord` - target coordinate system

Documented optional parameters:
- `input_coord` - source coordinate system; defaults to `WGS84`

Supported coordinate systems listed on the reviewed page:
- `WGS84`
- `WCONGNAMUL`
- `CONGNAMUL`
- `WTM`
- `TM`
- `KTM`
- `UTM`
- `BESSEL`
- `WKTM`
- `WUTM`

Documented response notes:
- `meta.total_count`
- `documents[]` with converted `x` and `y`

## 5) Search place by keyword
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/search/keyword.{FORMAT}`
- Purpose: search places by free-text keyword with optional location biasing and category filtering

Documented required parameters:
- `query` - keyword to search

Documented optional parameters:
- `category_group_code` - major category filter
- `x` - center longitude for proximity search
- `y` - center latitude for proximity search
- `radius` - meters from `0` to `20000`; used with `x` and `y`
- `rect` - rectangle as `leftX,leftY,rightX,rightY`
- `page` - `1` to `45` (default `1`)
- `size` - `1` to `15` (default `15`)
- `sort` - `accuracy` or `distance`; `distance` requires `x` and `y`

Documented response notes:
- `meta.total_count`
- `meta.pageable_count` (the docs note a maximum of `45`)
- `meta.is_end`
- `meta.same_name` with `region`, `keyword`, and `selected_region`
- `documents[]` include `id`, `place_name`, `category_name`, `category_group_code`, `category_group_name`, `phone`, `address_name`, `road_address_name`, `x`, `y`, `place_url`, and `distance`
- `distance` is returned only when `x` and `y` are provided

Documented category-group examples listed on the reviewed page:
- `MT1` supermarket
- `CS2` convenience store
- `PS3` daycare center / kindergarten
- `SC4` school
- `AC5` hagwon / cram school
- `PK6` parking lot
- `OL7` gas station / LPG station
- `SW8` subway station
- `BK9` bank
- `CT1` cultural facility
- `AG2` real estate agency
- `PO3` public institutions
- `AT4` attractions
- `AD5` accommodation
- `FD6` restaurant
- `CE7` cafe
- `HP8` hospital
- `PM9` pharmacy

## 6) Search place by category
- Method: `GET`
- Full route pattern: `https://dapi.kakao.com/v2/local/search/category.{FORMAT}`
- Purpose: search places by predefined category-group code within a bounded area

Documented required parameters:
- `category_group_code`
- Either all of `x`, `y`, and `radius`, or `rect`

Documented optional parameters:
- `page` - `1` to `45` (default `1`)
- `size` - `1` to `15` (default `15`)
- `sort` - `accuracy` or `distance`; `distance` requires reference coordinates

Documented response notes:
- `meta.total_count`
- `meta.pageable_count`
- `meta.is_end`
- `meta.same_name` with `region`, `keyword`, and `selected_region`
- `documents[]` follow the same place-document structure as keyword search
- The reviewed page notes that `category_group_code` and `category_group_name` are returned when category filtering is specified

## Response, error, rate-limit, and format notes
- The reviewed Local REST docs consistently show JSON and XML response support via the path suffix.
- Successful examples use `application/json;charset=UTF-8` for JSON responses.
- The public Local docs reviewed in this pass do not expose a standalone route-by-route error-code table, but the live missing-auth check confirms `401` JSON errors are returned when the `Authorization: KakaoAK ...` header is absent.
- Search pagination is page-based rather than cursor-based, using `page`, `size`, and `meta.is_end`.
- The general Kakao quota guide says quotas can be counted either by request volume or data throughput depending on API usage, and that additional billing configuration is required when usage needs to exceed free quotas.

## Canonical fireROUTE notes
- Treat Kakao Maps geocoding/location support as the `Kakao Local REST API` on `https://dapi.kakao.com/v2/local`, not as the separate JavaScript SDK geocoder methods exposed on `apis.map.kakao.com`.
- Preserve the `Authorization: KakaoAK ${REST_API_KEY}` header model exactly; the live missing-auth response proves the service enforces that header format.
- Model JSON as the preferred normalization format, but keep XML support noted because the official routes explicitly allow both `json` and `xml` path suffixes.
- Search endpoints share one pagination pattern, while the coordinate-conversion endpoints do not expose paged result traversal.

## Verification notes
- This file was manually rebuilt from live official Kakao documentation pages using browser tools only.
