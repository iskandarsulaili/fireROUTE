# Open Charge Map

## Provider metadata
- Category: `Transportation`
- Provider slug: `open-charge-map`
- Official docs used manually:
  - `https://openchargemap.org/develop#api`
  - `https://openchargemap.org/develop/api`
  - `https://raw.githubusercontent.com/openchargemap/ocm-docs/master/Model/schema/ocm-openapi-spec.yaml`
- Base URL: `https://api.openchargemap.io/v3`
- Authentication:
  - API key via query parameter `key`
  - API key via header `X-API-Key`
  - bearer-token auth for authenticated user actions such as comment/check-in submission and media upload
- Primary response formats seen in official docs:
  - JSON
  - GeoJSON
  - XML
  - CSV
  - plain-text OpenAPI YAML for the self-describing spec route
- Transport scope: EV charging locations, reference data, user auth, comments/check-ins, media uploads, and OpenAPI export

## Important official usage notes
- The docs describe Open Charge Map as an open-data charging-location registry and explicitly position `/poi` as the main endpoint for charging-site retrieval.
- The docs say free API keys are available after signing in and registering an application.
- The fair-usage section says clients should send a custom HTTP user-agent string.
- The fair-usage section also warns against duplicate or indiscriminate repeated queries and says abusive callers can be banned at the administrator's discretion.
- For high-volume use, the docs recommend hosting a private API mirror or importing the data into your own API.
- Data attribution matters: the docs say returned data has mixed licensing and the correct data-provider attribution must be shown to end users.

## Rate limits, pagination, and errors
- No numeric rate-limit quota is published in the inspected docs.
- Instead, Open Charge Map documents a fair-usage policy with anti-abuse guidance and discretionary banning for excessive usage.
- The inspected route docs do not describe classic page-number pagination.
- The main `/poi` endpoint uses result limiting and incremental filters such as `maxresults`, `modifiedsince`, and `greaterthanid` instead.
- The route docs publish `200` responses broadly, and `POST /comment` additionally documents `400 Bad Request`.
- No single provider-wide structured error schema was published in the inspected docs.

## Confirmed API surface
The official docs currently expose 6 routes:
1. `GET /poi`
2. `GET /referencedata`
3. `POST /profile/authenticate`
4. `POST /comment`
5. `POST /mediaitem`
6. `GET /openapi`

## Common request and response notes
- `GET /poi` is the main retrieval endpoint and supports multiple output formats.
- The docs say `GET /referencedata` is useful for hydrating compact POI responses back into richer objects.
- Authenticated write endpoints use bearer auth after a login flow that returns a JWT access token.
- The self-describing `GET /openapi` route returns the current OpenAPI YAML definition for tooling, testing, and client generation.

## 1) Retrieve POI list (sites)
- Method: `GET`
- Path: `/poi`
- Full URL: `https://api.openchargemap.io/v3/poi`
- Purpose: fetch charging-site / point-of-interest records, optionally filtered geographically or by many reference attributes

Documented query parameters seen in the official OpenAPI spec:
- `output` - optional output format; docs list `json`, `geojson`, `xml`, and `csv`; default `json`
- `client` - optional client identifier string
- `maxresults` - optional integer result limit; default `100`
- `countrycode` - optional 2-character ISO country code filter
- `countryid` - optional numeric country-id filter; comma-separated list
- `latitude` - optional latitude for distance calculation and filtering
- `longitude` - optional longitude for distance calculation and filtering
- `distance` - optional max-distance filter from the supplied latitude/longitude
- `distanceunit` - optional distance unit; docs list `miles` or `km`; default `Miles`
- `operatorid` - optional operator-id filter; comma-separated list
- `connectiontypeid` - optional connection-type filter; comma-separated list
- `levelid` - optional charging-level filter; marked deprecated in the spec
- `usagetypeid` - optional usage-type filter; comma-separated list
- `statustypeid` - optional status-type filter; comma-separated list
- `dataproviderid` - optional data-provider-id filter; comma-separated list
- `opendata` - optional boolean; `true` returns only OCM-provided open data
- `includecomments` - optional boolean; include user comments and media items; default `false`
- `verbose` - optional boolean; set `false` for smaller results with null items removed; default `true`
- `compact` - optional boolean; set `true` to remove expanded reference-data objects and return IDs instead; default `false`
- `camelcase` - optional boolean; return camelCase property names; default `false`
- `chargepointid` - optional exact match on one or more OCM POI IDs
- `boundingbox` - optional bounding-box filter using top-left and bottom-right corners
- `polygon` - optional encoded-polyline polygon filter
- `polyline` - optional encoded polyline for corridor-style searches; use with `distance`
- `sortby` - optional sort override; docs list `modified_asc` and `id_asc`
- `modifiedsince` - optional date filter for modified results
- `greaterthanid` - optional filter for items with IDs greater than the given value

Documented response notes:
- The spec describes this as the primary method for most applications and services.
- Response `200` returns a list of `POI` records.
- The docs note that verbose mode expands reference objects, while compact mode returns IDs for common reference data.

## 2) Core reference data
- Method: `GET`
- Path: `/referencedata`
- Full URL: `https://api.openchargemap.io/v3/referencedata`
- Purpose: retrieve the core reference data used for IDs such as connection types, operators, and countries

Documented query parameters:
- `countryid` - optional country-id filter; comma-separated list

Documented response notes:
- Response `200` returns `CoreReferenceData` in JSON.
- The docs say this endpoint is useful when consuming lighter non-verbose POI responses and then hydrating the IDs back into richer objects.

## 3) Authenticate user
- Method: `POST`
- Path: `/profile/authenticate`
- Full URL: `https://api.openchargemap.io/v3/profile/authenticate`
- Purpose: authenticate a user and receive a reusable JWT bearer token

Documented request body:
- JSON object with:
  - `emailaddress` - string
  - `password` - string

Documented response notes:
- Response `200` returns JSON including `Data.UserProfile`, `Data.access_token`, and `Metadata.StatusCode`.
- The docs explicitly describe `access_token` as a JWT bearer token for subsequent authenticated requests.

## 4) Submit comment or check-in
- Method: `POST`
- Path: `/comment`
- Full URL: `https://api.openchargemap.io/v3/comment`
- Purpose: submit a user comment or check-in for a specific charging location
- Auth requirement: bearer auth (`UserAuthentication`) according to the official spec

Documented JSON body fields:
- `chargePointID` - required integer OCM POI ID
- `commentTypeID` - optional integer comment-type ID from `UserCommentTypes` in core reference data
- `userName` - optional display name for the submission
- `comment` - optional text comment, max length `4000`
- `rating` - optional integer rating, with docs describing `1` as worst and `5` as best
- `relatedURL` - optional related website URL
- `checkinStatusTypeID` - optional check-in status category ID

Documented response notes:
- Response `200` returns JSON with `status` and `description`
- Response `400` is also documented

## 5) Add media item (photo)
- Method: `POST`
- Path: `/mediaitem`
- Full URL: `https://api.openchargemap.io/v3/mediaitem`
- Purpose: submit a photo for a specific charging location
- Auth requirement: bearer auth (`UserAuthentication`) according to the official spec

Documented JSON body fields:
- `chargePointID` - required integer OCM POI/site ID
- `comment` - optional image/context description
- `imageDataBase64` - required base64-encoded image data

Documented response notes:
- Response `200` returns JSON with `status` and optional `description`

## 6) Retrieve OpenAPI definition
- Method: `GET`
- Path: `/openapi`
- Full URL: `https://api.openchargemap.io/v3/openapi`
- Purpose: retrieve the current OpenAPI YAML definition for documentation tools, mocking, testing, and client generation

Documented response notes:
- Response `200` returns plain-text OpenAPI YAML according to the spec
- The route is specifically described as useful for documentation tooling and client generation

## Sources inspected
- `https://openchargemap.org/develop#api`
- `https://openchargemap.org/develop/api`
- `https://raw.githubusercontent.com/openchargemap/ocm-docs/master/Model/schema/ocm-openapi-spec.yaml`
