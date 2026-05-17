# Transport for Vancouver, Canada

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-vancouver-canada`
- Official docs used manually:
  - `https://developer.translink.ca/`
  - `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources`
  - `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/rtti`
  - `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-realtime`
- Base URL: `https://gtfsapi.translink.ca/v3`
- Authentication: API key passed as the required `apikey` query parameter
- Primary response format: GTFS Realtime protobuf feeds
- Transport scope documented here: current TransLink GTFS Realtime replacement API after retirement of the older RTTI Open API

## Important official usage notes
- The main App Developer Resources page says developers must register for an API key before using the TransLink Open API.
- The RTTI page says the older Real Time Transit Information Open API was retired on `December 3, 2024`.
- The same RTTI page directs developers to the new GTFS-RT V3 API instead.
- The GTFS Realtime page describes the feeds as an implementation of Google's GTFS Realtime specification and links out to Google's spec for message details.
- The `gtfs` landing page was offline during review, but the dedicated GTFS Realtime page was live and contained the route reference and example URLs.

## Rate limits, pagination, and errors
- No numeric rate-limit or quota table is published on the inspected public TransLink pages.
- No pagination is documented; each route is described as a feed endpoint.
- The inspected GTFS Realtime page does not publish HTTP status-code tables or a provider-specific error schema.
- Because the feeds follow GTFS Realtime, payload interpretation depends on the protobuf schema referenced by Google's GTFS Realtime documentation.

## Confirmed API surface
The accessible official GTFS Realtime page documents 3 GET routes:
1. `GET /gtfsrealtime`
2. `GET /gtfsposition`
3. `GET /gtfsalerts`

## Common request and response notes
- All confirmed routes use the same host and version prefix: `https://gtfsapi.translink.ca/v3`.
- Every confirmed route requires the `apikey` query parameter.
- The public TransLink page provides only example URLs and high-level descriptions; it delegates the message format details to Google's GTFS Realtime spec.
- The routes are feed-style endpoints rather than paginated REST collection endpoints.

## 1) Trip Update feed
- Method: `GET`
- Path: `/gtfsrealtime`
- Full URL: `https://gtfsapi.translink.ca/v3/gtfsrealtime?apikey=***`
- Purpose: return the GTFS Realtime trip-update feed

Documented parameters:
- `apikey` - required query string API key

Documented response notes:
- The page labels this route `Trip Update`
- The page says to see Google's GTFS Realtime page for feed-format details

## 2) Position Update feed
- Method: `GET`
- Path: `/gtfsposition`
- Full URL: `https://gtfsapi.translink.ca/v3/gtfsposition?apikey=***`
- Purpose: return the GTFS Realtime vehicle-position feed

Documented parameters:
- `apikey` - required query string API key

Documented response notes:
- The page labels this route `Position Update`
- The route is described as the GTFS Realtime position feed

## 3) Service Alerts feed
- Method: `GET`
- Path: `/gtfsalerts`
- Full URL: `https://gtfsapi.translink.ca/v3/gtfsalerts?apikey=***`
- Purpose: return GTFS Realtime service alerts

Documented parameters:
- `apikey` - required query string API key

Documented response notes:
- The page labels this route `Service Alerts`
- The page again points developers to Google's GTFS Realtime documentation for message semantics

## Sources inspected
- `https://developer.translink.ca/`
- `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources`
- `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/rtti`
- `https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-realtime`
