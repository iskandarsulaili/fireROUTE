# Transport for Ottawa, Canada

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-ottawa-canada`
- Official docs used manually:
  - `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers`
  - `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc`
  - `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-terms/`
- Base URLs confirmed from the official pages:
  - `https://nextrip-public-api.azure-api.net/octranspo`
  - `https://oct-gtfs-emasagcnfmcgeham.z01.azurefd.net/public-access`
  - `https://www.octranspo.com/feeds`
- Authentication:
  - GTFS-RT API routes require the `Ocp-Apim-Subscription-Key` header
  - access is tied to the OC Transpo Azure developer portal and product subscriptions available to authorised users
  - the static GTFS ZIP download and public RSS feeds are published without additional documented auth parameters
- Primary response / payload formats:
  - GTFS Realtime protobuf by default for the GTFS-RT API
  - optional JSON for the GTFS-RT API via `format=json`
  - ZIP for the static GTFS schedule download
  - RSS/XML for the public service-alert feeds
- Transport scope documented here: current OC Transpo GTFS-RT feeds, public static GTFS download, and public service-alert RSS feeds

## Important official usage notes
- OC Transpo says the old stop-based `API 2.0` was retired on `April 30, 2025` after the move to GTFS-RT.
- The developer landing page says OC Transpo's GTFS-RT offering currently provides `vehicle locations` and `trip updates`; it explicitly says `service alerts is not available at this time` in the GTFS-RT feed.
- The same page publishes separate public RSS feeds for service alerts in English and French.
- The developer portal says the current API version is `v1` and the GTFS-RT feed defaults to `protobuf` unless `format=json` is requested.
- OC Transpo recommends downloading the static GTFS schedule file daily so the GTFS-RT feed stays compatible with the local schedule data.
- The preferred time for the daily static GTFS download is listed as `between midnight and 2 am EST`, just before the service day begins.
- The public Terms of Use page says API-served data is separately licensed under the City of Ottawa Open Data Terms of Use.

## Rate limits, pagination, and errors
- No public numeric rate-limit or quota table was published on the inspected OC Transpo pages.
- No pagination is documented for any confirmed route; all confirmed routes are feed-style resources or direct file downloads.
- The public pages do not publish a structured provider-specific error schema.
- The official GTFS-RT examples consistently show `Ocp-Apim-Subscription-Key` in the request header for authenticated feed access.
- The `format` query parameter is documented as optional and accepts `json` or `protobuf`; the default is `protobuf`.

## Confirmed API surface
The currently accessible official pages expose 5 routes / feed URLs:
1. `GET /gtfs-rt-vp/beta/v1/VehiclePositions`
2. `GET /gtfs-rt-tp/beta/v1/TripUpdates`
3. `GET /public-access/GTFSExport.zip`
4. `GET /feeds/updates-en/`
5. `GET /feeds/updates-fr/`

## Common request and response notes
- The GTFS-RT API routes share the same base host prefix: `https://nextrip-public-api.azure-api.net/octranspo`.
- Both GTFS-RT routes use versioning in the URL path and are documented under `v1` beta route families.
- The GTFS-RT API exposes the same route in either protobuf or JSON form through the optional `format` query parameter rather than separate path variants.
- The static GTFS resource is a direct ZIP download, not a paginated JSON endpoint.
- The RSS feeds are public feed URLs intended for alert subscription rather than API-key-gated REST calls.

## 1) Get GTFS-RT vehicle positions
- Method: `GET`
- Path: `/gtfs-rt-vp/beta/v1/VehiclePositions`
- Full URL: `https://nextrip-public-api.azure-api.net/octranspo/gtfs-rt-vp/beta/v1/VehiclePositions`
- Purpose: return OC Transpo vehicle positions as a GTFS Realtime feed

Documented parameters:
- `format` - optional query parameter; valid values are `json` and `protobuf`; default is `protobuf`
- `Ocp-Apim-Subscription-Key` - required request header for authenticated access

Documented response notes:
- The official examples show protobuf output when no `format` parameter is supplied
- JSON output is available via `?format=json`
- The feed is part of OC Transpo's GTFS-RT replacement for the retired stop-based API

## 2) Get GTFS-RT trip updates
- Method: `GET`
- Path: `/gtfs-rt-tp/beta/v1/TripUpdates`
- Full URL: `https://nextrip-public-api.azure-api.net/octranspo/gtfs-rt-tp/beta/v1/TripUpdates`
- Purpose: return GTFS Realtime trip updates including arrival and departure times

Documented parameters:
- `format` - optional query parameter; valid values are `json` and `protobuf`; default is `protobuf`
- `Ocp-Apim-Subscription-Key` - required request header for authenticated access

Documented response notes:
- The official examples show both protobuf and JSON request forms
- OC Transpo says this feed contains trip updates with arrival and departure times
- The developer portal explicitly notes that GTFS-RT service alerts are not available at this time

## 3) Download the static GTFS schedule file
- Method: `GET`
- Path: `/public-access/GTFSExport.zip`
- Full URL: `https://oct-gtfs-emasagcnfmcgeham.z01.azurefd.net/public-access/GTFSExport.zip`
- Purpose: download the current OC Transpo GTFS static schedule package as a ZIP archive

Documented parameters:
- None documented on the inspected public page

Documented response notes:
- Response is a compressed GTFS ZIP archive
- OC Transpo recommends downloading it daily
- The official page says the preferred refresh window is between midnight and 2 am EST

## 4) Get English service-alert RSS feed
- Method: `GET`
- Path: `/feeds/updates-en/`
- Full URL: `https://www.octranspo.com/feeds/updates-en/`
- Purpose: retrieve the public English OC Transpo service-alert RSS feed

Documented parameters:
- None documented on the inspected public page

Documented response notes:
- The developer page lists this as the English service-alert RSS subscription URL
- This feed is the public alert mechanism published alongside the GTFS-RT migration notes

## 5) Get French service-alert RSS feed
- Method: `GET`
- Path: `/feeds/updates-fr/`
- Full URL: `https://www.octranspo.com/feeds/updates-fr/`
- Purpose: retrieve the public French OC Transpo service-alert RSS feed

Documented parameters:
- None documented on the inspected public page

Documented response notes:
- The developer page lists this as the French service-alert RSS subscription URL
- This feed provides the public alert feed alternative because GTFS-RT service alerts are not currently offered

## Sources inspected
- `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers`
- `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc`
- `https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-terms/`
- `https://nextrip-public-api.developer.azure-api.net/`
