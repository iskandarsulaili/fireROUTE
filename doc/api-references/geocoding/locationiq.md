# LocationIQ

## Provider metadata
- Category: `Geocoding`
- Provider slug: `locationiq`
- Official docs used manually:
  - `https://locationiq.com/`
  - `https://docs.locationiq.com/docs/introduction`
  - `https://docs.locationiq.com/reference/search`
  - `https://docs.locationiq.com/reference/search-structured`
  - `https://docs.locationiq.com/reference/search-postalcode`
  - `https://docs.locationiq.com/reference/reverse-api`
  - `https://docs.locationiq.com/reference/autocomplete-2`
- Public API base URL documented by provider: `https://us1.locationiq.com/v1`
- Transport: HTTPS
- Auth model: LocationIQ access token managed from the dashboard and supplied through the docs' `key` credential field / query-parameter auth flow
- Response formats documented: `json`, `xml`, `xmlv1.1`; JSONP is supported on search-style endpoints through `json_callback`

## Product and access notes
- The homepage positions LocationIQ as a lower-cost alternative to Google Maps style location services, covering geocoding, maps, and routing.
- The homepage advertises plans ranging from `10,000` calls per day up to `10 billion` and says the service is built on OpenStreetMap, OpenAddresses, and other sources.
- The introduction page groups the geocoding-relevant APIs under Search / Forward Geocoding, Reverse Geocoding, Autocomplete, Nearby, Timezone, and Balance.

## Confirmed API surface
The inspected official docs confirm these `8` geocoding-relevant GET routes under the `v1` API base:
1. `GET /search`
2. `GET /search/structured`
3. `GET /search/postalcode`
4. `GET /reverse`
5. `GET /autocomplete`
6. `GET /nearby`
7. `GET /timezone`
8. `GET /balance`

## Shared request and formatting notes
Across the inspected API reference pages:
- the docs use `https://us1.locationiq.com/v1` as the explicit base URL for geocoding operations
- `format` commonly defaults to `xml`
- `json`, `xml`, and `xmlv1.1` are documented on search and reverse-style endpoints
- many endpoints support localization through `accept-language`
- result limits are typically capped at `50` where list-style responses are returned

Common error/HTTP notes visible in the search reference:
- `400` Bad Request
- `401` Unauthorized
- `403` unauthorized domain for some requests
- `404` no location or places found
- `429` account rate limit exceeded
- `500` Internal Server Error

## 1) Free-form forward geocoding
- Method: `GET`
- Path: `/search`
- Full URL pattern: `https://us1.locationiq.com/v1/search?q={query}&key={token}`
- Purpose: free-form address/place search to coordinates and structured location results

Documented required parameter:
- `q` - free-form query string

Documented optional parameters visible on the reference page:
- `format` - `xml`, `json`, or `xmlv1.1`; defaults to `xml`
- `addressdetails`
- `statecode`
- `viewbox`
- `bounded`
- `limit` - `1` to `50`, default `10`
- `accept-language` - default `en`; can also use `native`
- `countrycodes`
- `normalizeaddress`
- `normalizecity`
- `postaladdress`
- `matchquality`
- `source` - docs note `nom` for OpenStreetMap/Nominatim-only sourcing
- `normalizeimportance`
- `dedupe`
- `namedetails`
- `extratags`
- `polygon_geojson`
- `polygon_kml`
- `polygon_svg`
- `polygon_text`
- `json_callback`
- `polygon_threshold`

Response notes:
- documented as an array of result objects
- fields shown include `place_id`, `osm_type`, `osm_id`, `lat`, `lon`, `display_name`, `class`, `type`, `importance`, `address`, and `boundingbox`

## 2) Structured forward geocoding
- Method: `GET`
- Path: `/search/structured`
- Full URL pattern: `https://us1.locationiq.com/v1/search/structured?...&key={token}`
- Purpose: geocode addresses from separately supplied components instead of one free-form string

Documented structured address inputs:
- `street`
- `city`
- `county`
- `state`
- `country`
- `postalcode`

Additional documented controls largely mirror `/search`, including:
- `format`
- `addressdetails`
- `statecode`
- `viewbox`
- `bounded`
- `limit`
- `accept-language`
- `countrycodes`
- `normalizeaddress`
- `normalizecity`
- `postaladdress`
- `matchquality`
- polygon output flags and related controls

## 3) Postal-code search
- Method: `GET`
- Path: `/search/postalcode`
- Full URL pattern: `https://us1.locationiq.com/v1/search/postalcode?postalcode={postalcode}&key={token}`
- Purpose: look up location data when only a postal or ZIP code is known

Documented required parameter:
- `postalcode`

Documented optional parameters visible on the reference page:
- `countrycodes`
- `format`
- `addressdetails`
- `statecode`
- `viewbox`
- `bounded`
- `limit`
- `accept-language`
- `normalizeaddress`
- `normalizecity`
- `postaladdress`
- `matchquality`
- polygon output flags and related controls

## 4) Reverse geocoding
- Method: `GET`
- Path: `/reverse`
- Full URL pattern: `https://us1.locationiq.com/v1/reverse?lat={lat}&lon={lon}&key={token}`
- Purpose: convert latitude/longitude to a readable address or place hierarchy

Documented required parameters:
- `lat`
- `lon`

Documented optional parameters visible on the reference page:
- `format` - `xml`, `json`, or `xmlv1.1`; defaults to `xml`
- `zoom` - `0` to `18`, default `18`
- `accept-language`
- `addressdetails` - default `1`
- `normalizeaddress`
- `normalizecity`
- `postaladdress`
- `oceans` - when set to `1`, can return ocean/sea naming when coordinates fall in water
- `showdistance`

Official zoom/address detail table shown:
- `3` country
- `5` state
- `8` county
- `10` city
- `14` suburb
- `16` street
- `18` building

## 5) Autocomplete
- Method: `GET`
- Path: `/autocomplete`
- Full URL pattern: `https://us1.locationiq.com/v1/autocomplete?q={query}&key={token}`
- Purpose: type-ahead place/address predictions while users type

Documented required parameter:
- `q`

Documented optional parameters visible on the reference page:
- `countrycodes`
- `tag` - restrict by OSM class/type combinations
- `layers` - supported values include `road`, `neighbourhood`, `suburb`, `city`, `county`, `state`, `country`, `postcode`

Important official note:
- the docs say the Autocomplete API endpoint offers Anycast routing and that manually pinning a region is not recommended for end-user experience

## 6) Nearby - Places
- Method: `GET`
- Path: `/nearby`
- Full URL pattern: `https://us1.locationiq.com/v1/nearby?lat={lat}&lon={lon}&key=<access_token>`
- Purpose: search for nearby places/POIs around a coordinate

Documented required parameters:
- `lat`
- `lon`

Documented notable optional parameter:
- `tag` - restrict results by common single-word tags or advanced OSM key/value tags

Important official notes:
- the docs describe this endpoint as `Public BETA`
- results can include POIs such as cafes, hospitals, airports, and also place-level features such as cities depending on the requested tag

## 7) Timezone
- Method: `GET`
- Path: `/timezone`
- Full URL pattern: `https://us1.locationiq.com/v1/timezone?lat={lat}&lon={lon}&key=<access_token>`
- Purpose: return timezone information for a coordinate

Documented required parameters:
- `lat`
- `lon`

Documented optional parameter:
- `timestamp` - Unix epoch seconds; defaults to current time when omitted

Documented response fields visible on the reference page include:
- `timezone.name`
- `timezone.now_in_dst`
- `timezone.offset_sec`
- `timezone.short_name`

## 8) Balance
- Method: `GET`
- Path: `/balance`
- Full URL pattern: `https://us1.locationiq.com/v1/balance?key=<access_token>`
- Purpose: inspect remaining daily request credits and bonus credits for the authenticated account

Documented response fields visible on the reference page:
- `status`
- `balance.day`
- `balance.bonus`

Important official note:
- the balance resets at midnight UTC (`00:00 UTC`) each day

## Normalization and data-shaping notes
The forward/reverse docs expose several nontrivial result-shaping controls:
- `normalizeaddress=1` returns a predictable address schema with normalized keys such as `house_number`, `road`, `city`, `state`, `postcode`, and `country_code`
- `normalizecity=1` backfills `city` from nearby locality-like fields when city is absent
- `postaladdress=1` returns country-specific postal formatting for selected countries
- `matchquality=1` adds a `matchquality` object
- geometry outputs can be requested as GeoJSON, KML, SVG, or WKT using the `polygon_*` parameters

## Pagination and limits
- `/search`, `/search/structured`, and `/search/postalcode` all document `limit` with an allowed range of `1` to `50` and a default of `10`.
- No cursor or page-token pagination model was documented on the inspected pages.
- The docs rely on limit-based result trimming rather than a richer pagination contract.

## Authentication and rate-limit notes
- The inspected docs navigation explicitly refers to a `LocationIQ Access Token` and the public product uses token-based access.
- The homepage advertises plan sizes ranging from `10,000` calls per day up to `10 billion`.
- The search reference explicitly documents `429` when the request exceeds the rate limits set on the account.
- No single global requests-per-second table was visible on the inspected pages.

## Response-format notes
- Search and reverse references document `format` values `xml`, `json`, and `xmlv1.1` with `xml` as the default.
- Search-style endpoints support `json_callback` for JSONP.
- Search responses are array-shaped; reverse geocoding returns a single resolved object for a coordinate.

## Important usage notes
- LocationIQ v1 search endpoints intentionally preserve OpenStreetMap/Nominatim compatibility while reserving some enhancements for `json` or `xmlv1.1` output.
- `/search`, `/search/structured`, and `/search/postalcode` are separate routes and should not be collapsed into one operation in fireROUTE.
- Reverse geocoding has additional water-aware behavior via `oceans=1`.
- Autocomplete is optimized for end-user typing flows and has different filtering semantics than full forward geocoding.

## Canonical fireROUTE notes
- Canonical base URL: `https://us1.locationiq.com/v1`
- Confirmed geocoding-relevant routes:
  - `GET /search`
  - `GET /search/structured`
  - `GET /search/postalcode`
  - `GET /reverse`
  - `GET /autocomplete`
  - `GET /nearby`
  - `GET /timezone`
  - `GET /balance`
- Preserve normalization, geometry-output, and localization flags because they materially change payload shape.

## Verification notes
- This file was manually rebuilt from the live official LocationIQ site and official LocationIQ docs using browser tools.