# Transport for Auckland, New Zealand

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-auckland-new-zealand`
- Provider identity confirmed from the reviewed official pages in this pass as: `Auckland Transport developer portal`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://dev-portal.at.govt.nz/`
  - official alternative page: `https://dev-portal.at.govt.nz/apis`
  - additional official pages reviewed in this pass:
    - `https://dev-portal.at.govt.nz/products`
    - `https://dev-portal.at.govt.nz/realtime-api`
    - `https://dev-portal.at.govt.nz/GTFS-API`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The official home page loaded successfully with title `Home - Auckland Transport developer portal`.
- The home page publicly states that registration is free and that users should subscribe through the portal's Products page.
- The same home page publishes two anonymous-view quota numbers:
  - `600 calls/minute`
  - `35,000 calls/week`
- The home page publicly documents two ways to send the subscription key:
  - `Ocp-Apim-Subscription-Key` HTTP header
  - `subscription-key` query parameter if the header is not present
- The home page publicly names two API families for this provider row:
  - `Realtime Compat API`
  - `GTFS API`
- The official public API catalog page `https://dev-portal.at.govt.nz/apis` loaded with title `APIs: List - Auckland Transport developer portal` but the visible anonymous catalog state was only:
  - `APIs`
  - `Group by tag`
  - `Name`
  - `Description`
  - `Type`
  - `No APIs found`
- The official public products page `https://dev-portal.at.govt.nz/products` was also manually reviewed in this pass and the anonymous page state was `No products found`.
- The official Realtime page loaded successfully with title `Getting started with the realtime API - Auckland Transport developer portal`.
- The Realtime page confirms:
  - the API covers buses, trains, and ferries
  - the model follows GTFS Realtime concepts
  - JSON is the default response format
  - protobuf is available when `Accept: application/x-protobuf` is sent
  - the feed updates at least every `30 seconds`
  - the aggregate realtime feed combines Trip Update, Vehicle Position, and Service Alerts data
  - query parameters can filter by vehicles or trips
- The official GTFS page loaded successfully with title `Getting started with the GTFS API - Auckland Transport developer portal`.
- The GTFS page confirms:
  - the API is a REST interface over currently active GTFS Static data
  - the implementation follows a subset of `JSON:API`
  - only a subset of GTFS entities is implemented
  - only non-null / non-empty fields are returned
- Across all reviewed official Auckland pages in this pass, no public operation inventory, canonical base URL for live endpoints, per-route path list, request examples, pagination rules, or error-schema reference became readable.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://dev-portal.at.govt.nz/`
- Public portal catalog pages reviewed:
  - `https://dev-portal.at.govt.nz/apis`
  - `https://dev-portal.at.govt.nz/products`
- Publicly named API families:
  - `Realtime Compat API`
  - `GTFS API`
- Provider API base URL for concrete operations: not publicly exposed on the reviewed anonymous official pages in this pass.
- Endpoint paths: not publicly exposed.
- HTTP methods:
  - GTFS is described as a REST API
  - no endpoint-by-endpoint method table was publicly exposed
- Parameters:
  - auth fallback parameter: `subscription-key`
  - realtime pages say filtering by vehicles or trips is supported
  - no stable endpoint-level parameter catalog was publicly exposed
- Request bodies: not publicly exposed.
- Authentication:
  - registration and product subscription required
  - `Ocp-Apim-Subscription-Key` header supported
  - `subscription-key` query parameter supported
- Rate limits:
  - `600 calls/minute`
  - `35,000 calls/week`
- Pagination: not publicly documented on the reviewed anonymous pages in this pass.
- Errors:
  - anonymous `APIs` catalog view currently shows `No APIs found`
  - anonymous `Products` view currently shows `No products found`
  - no provider route-level error schema was publicly exposed
- Response formats:
  - realtime: JSON by default, protobuf when `Accept: application/x-protobuf`
  - GTFS page describes JSON:API-style resource and error objects
- Important usage notes:
  - Auckland Transport still publicly markets the developer portal and both API families
  - the public informational pages expose access, quota, and format guidance
  - the anonymous catalog views do not expose the route-level contract needed for fireROUTE publication

## Why this provider remains blocked
- I manually reviewed the official home page first, then the public API catalog page, then additional official Auckland pages for Products, Realtime, and GTFS in this pass.
- The official pages clearly confirm that Auckland Transport still operates a developer portal, requires subscription keys, and publishes quota and format guidance.
- However, the route inventory itself is not publicly readable in the anonymous portal state, and the reviewed public pages stop short of listing canonical endpoint URLs and operation-level request contracts.
- Because no trustworthy route-level endpoint inventory became publicly readable from official sources in this pass, this provider remains `manual_blocked`.

## Sources inspected
- `https://dev-portal.at.govt.nz/`
- `https://dev-portal.at.govt.nz/apis`
- `https://dev-portal.at.govt.nz/products`
- `https://dev-portal.at.govt.nz/realtime-api`
- `https://dev-portal.at.govt.nz/GTFS-API`
