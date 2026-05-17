# Community Transit

## Provider metadata
- Category: `Transportation`
- Provider slug: `community-transit`
- Official docs used manually in this pass:
  - `https://github.com/transitland/transitland-datastore/blob/master/README.md#api-endpoints`
  - `https://www.communitytransit.org/`
  - `https://www.communitytransit.org/open-data`
- Base URLs confirmed from the official Community Transit open-data page:
  - `https://www.communitytransit.org`
  - `http://s3.amazonaws.com/commtrans-realtime-prod`
- Authentication:
  - no API key or auth header is documented for the published GTFS and GTFS-RT feed URLs
  - the open-data page says that by accessing Community Transit data you acknowledge the Open Data Terms of Use
- Primary response / payload formats:
  - GTFS schedule ZIP archives
  - GTFS Realtime protobuf feeds
- Transport scope documented here: Community Transit schedule feeds plus trip updates, vehicle positions, and service alerts

## Important official usage notes
- The assigned GitHub URL is not Community Transit API documentation; it is an archived Transitland Datastore repository README and therefore a mis-mapped source for this provider.
- The official Community Transit homepage is reachable and links directly to `Open Data`.
- The official `Open Data` page says Community Transit makes schedule information, real-time arrival predictions and vehicle locations, service alerts, and GIS data available to developers and researchers.
- The same page says Community Transit typically has four service changes throughout the year: two larger changes in spring and fall and two minor changes in summer and winter.
- The page publishes two GTFS schedule-download links:
  - `Current GTFS Data`
  - `Future GTFS Data`
- The page publishes three GTFS-RT feed links:
  - `Trip Updates`
  - `Vehicle Positions`
  - `Alerts`
- The open-data page also says Community Transit has stopped publishing GIS data and suggests deriving GIS outputs from GTFS instead.

## Rate limits, pagination, and errors
- No numeric rate limits are published on the inspected official Community Transit pages.
- No pagination is documented for any confirmed route; each confirmed route is a downloadable feed URL.
- No structured error schema or provider-specific HTTP status table is published on the inspected official Community Transit pages.
- The inspected page delegates payload semantics to the GTFS and GTFS Realtime specifications.
- No user-supplied query parameters are documented for the feeds, although the published GTFS download links include site-managed `sfvrsn` query strings.

## Confirmed API surface
The official Community Transit open-data page currently exposes 5 documented feed URLs:
1. `GET /docs/default-source/open-data/gtfs/current.zip`
2. `GET /docs/default-source/open-data/gtfs/future.zip`
3. `GET /commtrans-realtime-prod/tripupdates.pb`
4. `GET /commtrans-realtime-prod/vehiclepositions.pb`
5. `GET /commtrans-realtime-prod/alerts.pb`

## Common request and response notes
- The two GTFS schedule feeds are published from `https://www.communitytransit.org` as ZIP downloads.
- The three realtime feeds are published from the official page as direct S3 feed URLs under `http://s3.amazonaws.com/commtrans-realtime-prod`.
- The static GTFS links are point-in-time archive URLs rather than parameterized collection endpoints.
- The realtime links are GTFS-RT protobuf feeds rather than paginated JSON endpoints.

## 1) Download the current GTFS schedule feed
- Method: `GET`
- Path: `/docs/default-source/open-data/gtfs/current.zip`
- Full published URL: `https://www.communitytransit.org/docs/default-source/open-data/gtfs/current.zip?sfvrsn=988306d7_106`
- Purpose: download the current Community Transit GTFS schedule feed

Documented parameters:
- No user-supplied parameters are documented on the official page
- The published URL includes a site-managed `sfvrsn` query string

Documented response notes:
- Response is a GTFS ZIP archive
- The official page says consumers should keep GTFS data up to date because Community Transit changes service multiple times per year

## 2) Download the future GTFS schedule feed
- Method: `GET`
- Path: `/docs/default-source/open-data/gtfs/future.zip`
- Full published URL: `https://www.communitytransit.org/docs/default-source/open-data/gtfs/future.zip?sfvrsn=dc64b86_51`
- Purpose: download the future Community Transit GTFS schedule feed

Documented parameters:
- No user-supplied parameters are documented on the official page
- The published URL includes a site-managed `sfvrsn` query string

Documented response notes:
- Response is a GTFS ZIP archive
- The page presents this as the upcoming schedule dataset alongside the current GTFS archive

## 3) Get trip updates feed
- Method: `GET`
- Path: `/commtrans-realtime-prod/tripupdates.pb`
- Full published URL: `http://s3.amazonaws.com/commtrans-realtime-prod/tripupdates.pb`
- Purpose: retrieve GTFS-RT trip updates with predicted arrivals / departures and cancellation or reroute information

Documented parameters:
- None documented on the official page

Documented response notes:
- Response format is GTFS Realtime protobuf
- The page says this feed provides predicted arrival or departure times for stops throughout a trip and information on trips or stops that have been cancelled or re-routed

## 4) Get vehicle positions feed
- Method: `GET`
- Path: `/commtrans-realtime-prod/vehiclepositions.pb`
- Full published URL: `http://s3.amazonaws.com/commtrans-realtime-prod/vehiclepositions.pb`
- Purpose: retrieve GTFS-RT live vehicle positions

Documented parameters:
- None documented on the official page

Documented response notes:
- Response format is GTFS Realtime protobuf
- The page says this feed provides the locations of vehicles currently in service

## 5) Get service alerts feed
- Method: `GET`
- Path: `/commtrans-realtime-prod/alerts.pb`
- Full published URL: `http://s3.amazonaws.com/commtrans-realtime-prod/alerts.pb`
- Purpose: retrieve GTFS-RT service alerts

Documented parameters:
- None documented on the official page

Documented response notes:
- Response format is GTFS Realtime protobuf
- The page says this feed provides information on disruptions to service

## Sources inspected
- `https://github.com/transitland/transitland-datastore/blob/master/README.md#api-endpoints`
- `https://www.communitytransit.org/`
- `https://www.communitytransit.org/open-data`
