# Utah AGRC

## Provider metadata
- Category: `Geocoding`
- Provider slug: `utah-agrc`
- Official docs used manually:
  - `https://api.mapserv.utah.gov/`
  - `https://api.mapserv.utah.gov/getting-started/`
  - `https://api.mapserv.utah.gov/docs/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/geocoding/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/milepost/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/reverse-geocoding/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/reverse-milepost/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/searching/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/feature-class-names/`
  - `https://api.mapserv.utah.gov/docs/v1/endpoints/feature-class-attributes/`
- Public API base URL documented by provider: `https://api.mapserv.utah.gov/api/v1`
- Transport: `HTTPS`
- Auth model: query-string API key `apikey`, with separate browser-key and desktop-key creation flows in the official self-service docs
- Response formats documented/observed: default `JSON`; several endpoint pages explicitly document optional `geojson` and `esrijson` output; the docs also mention JSONP via `callback`

## Product and access notes
- The official overview says the UGRC API exposes `7` endpoints total: `4` geocoding endpoints, `2` informational endpoints, and `1` searching endpoint.
- The root page positions the API as Utah-specific geospatial/search infrastructure backed by SGID data.
- The getting-started page says the API is free to use, is currently not rate limited, and asks users to act responsibly because abusive users can still be blocked.
- The same getting-started page says API keys are created per application and differ by origin model:
  - browser keys are tied to allowed referrer URL patterns
  - desktop keys are tied to the public IP address that originates requests
- The docs explicitly note CORS support and discourage legacy JSONP `callback` usage.
- Reserved characters in address text must be escaped or geocoding requests can fail.

## Confirmed API surface
The inspected official docs confirm these `7` GET route families:
1. `GET /geocode/{street}/{zone}`
2. `GET /geocode/milepost/{route}/{milepost}`
3. `GET /geocode/reverse/{x}/{y}`
4. `GET /geocode/milepost/{x}/{y}`
5. `GET /search/{table}/{fields}`
6. `GET /info/featureClassNames`
7. `GET /info/fieldnames/{tableName}`

## Shared request rules
- Base URL: `https://api.mapserv.utah.gov/api/v1`
- Authentication is by query parameter `apikey`.
- The getting-started guide explicitly tells users to read response bodies on failed requests because the service returns corrective guidance there.
- The docs repeatedly describe UTM Zone 12N (`26912`) as the default and preferred Utah spatial reference for accurate measurements.
- No cursor or page-number pagination model is documented on the inspected endpoint pages.

## 1) Street and zone geocoding
- Method: `GET`
- Path: `/geocode/{street}/{zone}`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/geocode/{street}/{zone}?apikey=YOUR_API_KEY`
- Purpose: geocode a Utah street address plus place/ZIP zone into coordinates

Required path parameters documented by provider:
- `street` - Utah street address text; the docs say a deliverable mailing address does not need to exist if the house number can be interpolated from road ranges
- `zone` - Utah place name or 5-digit ZIP code

Optional query parameters documented by provider:
- `acceptScore` - numeric score floor, default `70`, range `0-100`
- `pobox` - include P.O. Box handling, default `false`
- `locators` - `all`, `addressPoints`, or `roadCenterlines`; default `all`
- `suggest` - additional candidate count, default `0`, range `0-5`
- `scoreDifference` - include tie-distance information, default `false`
- `spatialReference` - output WKID, default `26912`
- `format` - geocoding page explicitly documents `esrijson` and `geojson`
- `callback` - JSONP callback name

Important official notes:
- The page warns this endpoint should not be used as a mailing-address validator.
- The page says `matchAddress` reflects the address-system quadrant/provider match, not necessarily a preferred mailing city.
- The docs recommend omitting sub-address values such as apartment/unit information for best results.

## 2) Route and milepost geocoding
- Method: `GET`
- Path: `/geocode/milepost/{route}/{milepost}`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/geocode/milepost/{route}/{milepost}?apikey=YOUR_API_KEY`
- Purpose: convert a Utah highway number plus milepost into coordinates

Required path parameters documented by provider:
- `route` - Utah highway number; the docs say to omit interstate/state-route prefixes unless `fullRoute=true`
- `milepost` - milepost numeric value, with up to 3 decimal places

Optional query parameters documented by provider:
- `side` - `increasing` or `decreasing`; default `increasing`
- `fullRoute` - when `true`, lets callers pass the full UDOT route identifier string and ignore `side`; default `false`
- `spatialReference` - output WKID, default `26912`
- `format` - page explicitly documents `esrijson` and `geojson`
- `callback` - JSONP callback name

Important official notes:
- The page says this endpoint uses the UDOT Roads and Highways system as the authoritative source.
- `side` only applies to divided highways.

## 3) Reverse geocoding
- Method: `GET`
- Path: `/geocode/reverse/{x}/{y}`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/geocode/reverse/{x}/{y}?apikey=YOUR_API_KEY`
- Purpose: convert a coordinate into the nearest street address

Required path parameters documented by provider:
- `x` - longitude/easting/horizontal coordinate value
- `y` - latitude/northing/vertical coordinate value

Optional query parameters documented by provider:
- `distance` - search radius in meters, default `5`, range `0-2000`
- `spatialReference` - input/output WKID, default `26912`
- `callback` - JSONP callback name

Important official notes:
- The page warns the returned address can be an address along a road segment even if no structure or mail delivery exists there.

## 4) Reverse route and milepost geocoding
- Method: `GET`
- Path: `/geocode/milepost/{x}/{y}`
- Full URL pattern published by provider: `https://api.mapserv.utah.gov/api/v1/geocode/milepost/{x}/{y}?apikey=YOUR_API_KEY`
- Purpose: find the route and milepost nearest a coordinate

Required path parameters documented by provider:
- `x` - longitude/easting/horizontal coordinate value
- `y` - latitude/northing/vertical coordinate value

Optional query parameters documented by provider:
- `buffer` - search radius in meters, default `100`, range `0-200`
- `includeRampSystem` - include ramps/collectors/federal-aid routes, default `false`
- `suggest` - additional candidate count, default `0`, range `0-5`
- `spatialReference` - coordinate WKID, default `26912`
- `format` - the reverse-milepost page includes a documented `format` section
- `callback` - JSONP callback name

Important official notes:
- The currently published docs place this reverse lookup under the same `/geocode/milepost/{...}/{...}` family as forward milepost geocoding, but with coordinate semantics instead of `{route}/{milepost}`.
- fireROUTE should preserve this as a separate documented operation because the provider gives it a separate endpoint page, separate parameter set, and separate response behavior.

## 5) Searching
- Method: `GET`
- Path: `/search/{table}/{fields}`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/search/{table}/{fields}?apikey=YOUR_API_KEY`
- Purpose: query attribute and geometry data from Open SGID tables

Required path parameters documented by provider:
- `table` - schema-qualified Open SGID table name such as `boundaries.county_boundaries`
- `fields` - comma-separated field list to return

Optional query parameters documented by provider:
- `predicate` - PostgreSQL-style filter expression, default `1=1`
- `geometry` - spatial filter geometry expressed as `geometryType:ArcGIS Server JSON`
- `buffer` - geometry buffer in meters, default `0`, max `2000`
- `attributeStyle` - `lower`, `upper`, or `input`; default `lower`
- `spatialReference` - WKID, default `26912`
- `format` - documented on the page as a dedicated parameter section
- `callback` - JSONP callback name

Important official notes:
- The search page says this endpoint can query geometries and attributes from any table in the Open SGID.
- Geometry filters support `point`, `polyline`, `polygon`, `multipoint`, and `envelope` forms.
- The docs describe search as result-filtering/querying rather than page-based pagination.

## 6) Table name information
- Method: `GET`
- Path: `/info/featureClassNames`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/info/featureClassNames?apikey=YOUR_API_KEY`
- Purpose: list searchable table names from SGID categories

Optional query parameters documented by provider:
- `sgidCategory` - category filter; the page lists values including `bioscience`, `boundaries`, `cadastre`, `climate`, `demographic`, `economy`, `elevation`, `energy`, `environment`, `farming`, `geoscience`, `health`, `history`, `indices`, `location`, `planning`, `political`, `public`, `recreation`, `society`, `transportation`, `utilities`, and `water`
- `callback` - JSONP callback name

Important official notes:
- The docs warn that the legacy `SGID.category.table` format will no longer work in version 2.

## 7) Table attribute information
- Method: `GET`
- Path: `/info/fieldnames/{tableName}`
- Full URL pattern: `https://api.mapserv.utah.gov/api/v1/info/fieldnames/{tableName}?apikey=YOUR_API_KEY`
- Purpose: list field/attribute names for a specific Open SGID table

Required path parameter documented by provider:
- `tableName` - Open SGID table name; the page gives `county_boundaries` as an example

Optional query parameters documented by provider:
- `category` - optional SGID category filter with the same category family listed on the page
- `callback` - JSONP callback name

Important official notes:
- The page repeats that table names must exactly match Open SGID naming and that the old `SGID.category.table` format is legacy-only.

## Pagination, errors, rate limits, and format notes
- The getting-started guide says the API is currently not rate limited, but abusive users can still be blocked.
- No page-number, cursor, or offset pagination model is documented on the inspected pages.
- Several geocoding endpoint pages explicitly document `format=esrijson|geojson`; default output is JSON when `format` is omitted.
- The docs repeatedly mention CORS support and allow a legacy JSONP `callback` parameter.
- A live manual request to `GET /info/featureClassNames` without `apikey` returned HTTP `400` JSON: `Your API key is missing from your request. Add an apikey={key} to the request as a query string parameter.`
- A live manual request with `apikey=invalid` returned HTTP `400` JSON indicating the key did not match the allowed pattern created in self service.
- The endpoint pages include `Error Example` sections, but the inspected pages did not surface a standalone cross-endpoint HTTP status matrix beyond those examples and the live `400` auth failures checked in this run.

## Canonical fireROUTE notes
- Preserve Utah AGRC as a Utah-specific geocoding/search provider rather than a generic nationwide geocoder.
- Preserve the provider's query-string `apikey` model instead of converting it into an authorization-header abstraction.
- Keep browser-key and desktop-key auth notes because request origin/referrer matching is part of practical access.
- Treat reverse route-and-milepost lookup as its own operation even though the current docs publish it under the same `/geocode/milepost/{...}/{...}` path family as forward milepost geocoding.
- Do not add pagination abstractions that are not documented by the provider.

## Verification notes
- This file was manually rebuilt from live official Utah AGRC pages using browser tools only.
- It replaces the previous blocker record because the official documentation surface is now reachable and route-level details could be confirmed.
