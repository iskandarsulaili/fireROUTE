# Transport for Finland

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-finland`
- Provider identity confirmed from official docs: `Digitransit`
- Official docs used manually:
  - `https://digitransit.fi/en/developers/`
  - `https://digitransit.fi/en/developers/api-registration/`
  - `https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/`
  - `https://digitransit.fi/en/developers/apis/1-routing-api/1-graphiql/`
  - `https://digitransit.fi/en/developers/apis/1-routing-api/routes/`
  - `https://digitransit.fi/en/developers/apis/1-routing-api/stops/`
  - `https://api.digitransit.fi/graphiql/hsl/v2/gtfs/v1`
- Confirmed production base URL prefix for the public routing GraphQL surface: `https://api.digitransit.fi/routing/v2`
- Authentication: registration required; send the API key either as query parameter `digitransit-subscription-key` or header `digitransit-subscription-key`
- Primary request formats: `application/graphql` or `application/json`
- Primary response format: JSON

## Important official usage notes
- The official Digitransit developer landing page says production use of `api.digitransit.fi`, `cdn.digitransit.fi`, and `digitransit-prod-cdn-origin.azureedge.net` requires registration and API keys.
- The official GraphQL page says Digitransit Routing API uses a single GraphQL endpoint per configured region instead of many REST-style resource URLs.
- The official GraphiQL page says Digitransit hosts browser explorers for four available regions and that the browser versions have the correct endpoints configured.
- The hosted GraphiQL bundle on the official API host exposes the production router URLs for `hsl`, `waltti`, `finland`, and `varely` under `/routing/v2/{router}/gtfs/v1`.
- The official Routes and Stops pages confirm the transport-focused top-level GraphQL query surface includes objects such as `routes`, `pattern`, `trip`, `stop`, `stops`, `stations`, `stopsByRadius`, and `nearest`.
- Digitransit says real-time predictions are returned through the Routing API, while separate GTFS-RT style feeds have been deprecated or moved to other official sources.

## Rate limits, pagination, and errors
- The official registration page says rate and quota limiting have been enforced since `31.1.2024`.
- The public docs do not publish numeric quota or requests-per-minute values.
- Digitransit says that if consumers encounter rate/quota issues they may receive HTTP `403` and should contact `digitransit-api@hsl.fi`.
- For large computation jobs with thousands of consecutive requests, Digitransit recommends adding a `0.5 - 1 s` delay between requests.
- The GraphQL page says pagination is supported only on query types that expose Relay cursor connections; when pagination is supported, clients use arguments such as `first` and `after` and inspect `pageInfo` / cursors in the response.
- The GraphQL page also says supported query types can be used without pagination by omitting `first` and `after`, in which case all data is returned on one page.
- The public docs do not publish a canonical provider-wide non-403 error table or a structured GraphQL error schema for these routes.

## Confirmed API surface
The official Digitransit routing surface currently exposes these 4 production GraphQL endpoints for the public hosted regions:

1. `POST /hsl/gtfs/v1`
2. `POST /waltti/gtfs/v1`
3. `POST /finland/gtfs/v1`
4. `POST /varely/gtfs/v1`

All 4 routes share the same request conventions:
- Method: `POST`
- Base URL prefix: `https://api.digitransit.fi/routing/v2`
- Auth: required `digitransit-subscription-key` in header or query string
- Content-Type: `application/graphql` with a raw GraphQL document body, or `application/json` with at least a `query` field
- Optional JSON-body fields documented by the GraphQL page: `variables`, and an operation name when variables are used
- Response: JSON GraphQL response object; example docs show a top-level `data` object

## Common request and response notes
- With `application/graphql`, the request body is the GraphQL document itself.
- With `application/json`, the request body contains a GraphQL `query` string; the docs also describe a `variables` object for more complex requests.
- The official docs show transport-specific query examples for route search by name and mode, pattern lookup by ID, trip lookup by ID, stop lookup by ID, stop search by name, station lookup, nearby stops, and nearby departure rows.
- Stop IDs are documented in `FeedId:StopId` format, for example `HSL:1140447`.
- `stopsByRadius` is explicitly documented as a paginatable query type.
- Example successful responses in the official docs return JSON objects shaped like `{ "data": { ... } }`.

## 1) Helsinki region routing GraphQL endpoint
- Method: `POST`
- Path: `/hsl/gtfs/v1`
- Full URL: `https://api.digitransit.fi/routing/v2/hsl/gtfs/v1`
- Purpose: query Digitransit routing data for the HSL region through the GTFS-backed GraphQL schema

Documented parameters and body notes:
- Header or query parameter `digitransit-subscription-key` - required API key
- GraphQL request body - required
- `query` - required when using `application/json`
- `variables` - optional JSON object for parameterized GraphQL operations
- Operation name - required by the docs when variables are used in a JSON request

Transport query examples documented on official pages:
- `routes(name: ...)`
- `routes(name: ..., transportModes: BUS|TRAM)`
- `pattern(id: ...)`
- `trip(id: ...)`
- `stop(id: ...)`
- `stops(name: ...)`
- `stations(name: ...)`
- `stopsByRadius(lat: ..., lon: ..., radius: ..., first: ...)`
- `nearest(..., filterByPlaceTypes: DEPARTURE_ROW)`

## 2) Waltti regions routing GraphQL endpoint
- Method: `POST`
- Path: `/waltti/gtfs/v1`
- Full URL: `https://api.digitransit.fi/routing/v2/waltti/gtfs/v1`
- Purpose: query Digitransit routing data for Waltti regions through the GTFS-backed GraphQL schema

Documented parameters and body notes:
- Header or query parameter `digitransit-subscription-key` - required API key
- GraphQL request body - required
- `query` - required when using `application/json`
- `variables` - optional JSON object
- Operation name - documented for variable-based JSON requests

Format notes:
- Uses the same GraphQL request conventions, auth, and response model described for the HSL endpoint
- The official GraphiQL page lists Waltti as one of the four hosted public regions

## 3) Finland routing GraphQL endpoint
- Method: `POST`
- Path: `/finland/gtfs/v1`
- Full URL: `https://api.digitransit.fi/routing/v2/finland/gtfs/v1`
- Purpose: query Digitransit routing data for the Finland region through the GTFS-backed GraphQL schema

Documented parameters and body notes:
- Header or query parameter `digitransit-subscription-key` - required API key
- GraphQL request body - required
- `query` - required when using `application/json`
- `variables` - optional JSON object
- Operation name - documented for variable-based JSON requests

Format notes:
- Uses the same GraphQL request conventions, auth, and response model described for the HSL endpoint
- The official GraphiQL page lists Finland as one of the four hosted public regions

## 4) VARELY routing GraphQL endpoint
- Method: `POST`
- Path: `/varely/gtfs/v1`
- Full URL: `https://api.digitransit.fi/routing/v2/varely/gtfs/v1`
- Purpose: query Digitransit routing data for the VARELY region through the GTFS-backed GraphQL schema

Documented parameters and body notes:
- Header or query parameter `digitransit-subscription-key` - required API key
- GraphQL request body - required
- `query` - required when using `application/json`
- `variables` - optional JSON object
- Operation name - documented for variable-based JSON requests

Format notes:
- Uses the same GraphQL request conventions, auth, and response model described for the HSL endpoint
- The official GraphiQL page lists VARELY as one of the four hosted public regions

## Sources inspected
- `https://digitransit.fi/en/developers/`
- `https://digitransit.fi/en/developers/api-registration/`
- `https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/`
- `https://digitransit.fi/en/developers/apis/1-routing-api/1-graphiql/`
- `https://digitransit.fi/en/developers/apis/1-routing-api/routes/`
- `https://digitransit.fi/en/developers/apis/1-routing-api/stops/`
- `https://api.digitransit.fi/graphiql/hsl/v2/gtfs/v1`
