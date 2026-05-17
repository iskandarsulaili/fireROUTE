# Transport for Atlanta, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-atlanta-us`
- Official docs used manually:
  - `https://itsmarta.com/app-developer-resources.aspx`
- Base URLs confirmed from the official MARTA developer page:
  - `https://itsmarta.com`
  - `https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService`
  - `https://developerservices.itsmarta.com:18096/itsmarta`
- Authentication:
  - no auth documented for the static GTFS ZIP feed
  - no auth documented for the bus GTFS-realtime protobuf feeds
  - the rail realtime REST endpoint requires a query parameter named `apiKey`
- Primary response / payload formats:
  - ZIP for the static GTFS feed
  - GTFS-realtime protobuf for the bus realtime feeds
  - JSON for the rail realtime REST endpoint
- Transport scope documented here: MARTA static schedule feed, bus GTFS-realtime feeds, and rail realtime arrivals

## Important official usage notes
- MARTA says this page contains the information needed to build an app using its open schedule and real-time data.
- The static GTFS feed is updated periodically and published at the same URL for each refresh; MARTA also links to GTFS archives for previous versions.
- MARTA describes the bus GTFS-realtime feeds as snapshots of all active buses operating at the moment.
- The rail realtime REST endpoint returns real-time train arrivals for all MARTA train stations.
- MARTA links an API-key signup page specifically for the rail realtime service.
- The same official page includes a prohibition on using MARTA trademarks and logos in apps, websites, or other digital media without prior written consent.

## Rate limits, pagination, and errors
- No numeric rate limits are published on the inspected MARTA developer page.
- No pagination is documented for any confirmed route.
- No structured error schema is published for the confirmed routes.
- The inspected page provides a sample JSON response for the rail realtime endpoint but does not publish explicit non-200 response definitions.

## Confirmed API surface
The official MARTA developer page currently exposes 4 routes / feed URLs:
1. `GET /google_transit_feed/google_transit.zip`
2. `GET /TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb`
3. `GET /TMGTFSRealTimeWebService/tripupdate/tripupdates.pb`
4. `GET /railrealtimearrivals/developerservices/traindata`

## Common request and response notes
- The static GTFS feed is a downloadable ZIP archive rather than a paginated JSON API.
- The bus realtime feeds use the GTFS-realtime protobuf standard and are intended to be consumed as binary protobuf payloads.
- The rail realtime endpoint is shown as a RESTful GET URL with `apiKey` supplied in the query string.
- The official sample rail response includes these fields: `DESTINATION`, `DIRECTION`, `EVENT_TIME`, `IS_REALTIME`, `LINE`, `NEXT_ARR`, `STATION`, `TRAIN_ID`, `WAITING_SECONDS`, `WAITING_TIME`, `DELAY`, `LATITUDE`, and `LONGITUDE`.

## 1) Download the active static GTFS feed
- Method: `GET`
- Path: `/google_transit_feed/google_transit.zip`
- Full URL: `https://itsmarta.com/google_transit_feed/google_transit.zip`
- Purpose: download MARTA's current GTFS schedule feed as a ZIP archive

Documented parameters:
- None documented on the official page

Documented response notes:
- Response is a ZIP file (`google_transit.zip`)
- MARTA says the file is updated periodically and the same URL is reused for each new update
- MARTA links a separate archive page for previous GTFS versions

## 2) Get bus vehicle positions feed
- Method: `GET`
- Path: `/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb`
- Full URL: `https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb`
- Purpose: retrieve MARTA bus vehicle positions as a GTFS-realtime protobuf feed

Documented parameters:
- None documented on the official page

Documented response notes:
- Payload format is GTFS-realtime protobuf
- MARTA describes the bus realtime feed family as a snapshot of all active buses operating at the moment

## 3) Get bus trip updates feed
- Method: `GET`
- Path: `/TMGTFSRealTimeWebService/tripupdate/tripupdates.pb`
- Full URL: `https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/tripupdate/tripupdates.pb`
- Purpose: retrieve MARTA bus trip updates as a GTFS-realtime protobuf feed

Documented parameters:
- None documented on the official page

Documented response notes:
- Payload format is GTFS-realtime protobuf
- The official page groups this feed with the vehicle-position feed under MARTA Bus GTFS-realtime

## 4) Get rail realtime arrivals for all stations
- Method: `GET`
- Path: `/railrealtimearrivals/developerservices/traindata`
- Full URL: `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata`
- Purpose: retrieve real-time train arrivals for all MARTA train stations

Documented parameters:
- `apiKey` - required query parameter; obtained by signing up through MARTA's rail realtime API key page

Documented response notes:
- The official page provides a sample JSON object with destination, direction, event time, realtime flag, line, next arrival time, station, train ID, waiting-time values, delay, and train latitude/longitude
- No additional filtering parameters are documented on the inspected page

## Sources inspected
- `https://itsmarta.com/app-developer-resources.aspx`
