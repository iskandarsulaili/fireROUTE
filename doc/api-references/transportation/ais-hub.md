# AIS Hub

## Provider metadata
- Category: `Transportation`
- Provider slug: `ais-hub`
- Official docs used manually:
  - `https://www.aishub.net/api`
- Base URL: `https://data.aishub.net`
- Authentication:
  - `username` query parameter for an AISHub member account
- Primary response formats seen in official docs:
  - XML
  - JSON
  - CSV
  - optional ZIP, GZIP, or BZIP2 compressed output
- Transport scope: live AIS vessel-position retrieval and AISHub station metadata

## Important official usage notes
- The official docs say AISHub members may access the webservice and retrieve data in XML, JSON, or CSV format.
- The official docs explicitly warn: do not access the webservice more frequently than once per minute.
- The docs say the service will return nothing if called more frequently than once per minute.
- The AIS data endpoint supports either global retrieval, geographic bounding-box filtering, or vessel-specific filtering by MMSI and IMO lists.
- The station endpoint optionally filters to one station by station ID.

## Rate limits, pagination, and errors
- Official rate-limit guidance: no more than one request per minute.
- The docs do not publish pagination.
- The docs do not publish a structured error schema.
- The docs say overly frequent calls return nothing rather than documenting a status-code-based throttling contract.

## Confirmed API surface
The official docs currently expose 2 routes:
1. `GET /ws.php`
2. `GET /stations.php`

## Common request and response notes
- Both routes are GET endpoints documented through query parameters.
- Both routes require `username`.
- Both routes can return XML, JSON, or CSV.
- Both routes support optional compression values `0` (none), `1` (ZIP), `2` (GZIP), or `3` (BZIP2).
- The AIS data route can emit either raw AIS-style encoded values or human-readable values depending on `format`.
- The station route always documents human-readable station metadata fields.

## 1) Retrieve AIS vessel data
- Method: `GET`
- Path: `/ws.php`
- Full URL template: `https://data.aishub.net/ws.php?username=A&format=B&output=C&compress=D&latmin=E&latmax=F&lonmin=G&lonmax=H&mmsi=I&imo=J&interval=K`
- Purpose: retrieve AIS vessel-position data, optionally filtered by bounding box, MMSI list, IMO list, and maximum data age

Documented query parameters:
- `username` - required AISHub username received after joining AISHub
- `format` - optional data-value format; `0` = AIS encoding, `1` = human-readable format; default `0`
- `output` - optional output format; `xml`, `json`, or `csv`; default `xml`
- `compress` - optional compression; `0` = none, `1` = ZIP, `2` = GZIP, `3` = BZIP2; default `0`
- `latmin` - optional south/minimum latitude; default `-90`
- `latmax` - optional north/maximum latitude; default `+90`
- `lonmin` - optional west/minimum longitude; default `-180`
- `lonmax` - optional east/maximum longitude; default `+180`
- `mmsi` - optional MMSI number or comma-separated list; returns data for the requested vessels only
- `imo` - optional IMO number or comma-separated list; returns data for the requested vessels only
- `interval` - optional maximum age of returned positions, in minutes

Documented response notes:
- XML responses are shown as repeated `<vessel .../>` records.
- JSON responses are shown as vessel objects with AIS fields such as `MMSI`, `TIME`, `LONGITUDE`, `LATITUDE`, `COG`, `SOG`, `HEADING`, `ROT`, `NAVSTAT`, `IMO`, `NAME`, `CALLSIGN`, `TYPE`, `A`, `B`, `C`, `D`, `DRAUGHT`, `DEST`, and `ETA`.
- CSV responses are shown with vessel columns such as `MMSI`, `TSTAMP`, `LATITUDE`, `LONGITUDE`, `COG`, `SOG`, `HEADING`, `NAVSTAT`, `IMO`, `NAME`, `CALLSIGN`, `TYPE`, `A`, `B`, `C`, `D`, `DRAUGHT`, `DEST`, and `ETA`.
- The docs also define many field meanings, including:
  - `TIME` / `TSTAMP` as the data timestamp
  - `LONGITUDE` and `LATITUDE` as AIS-encoded or degree values depending on `format`
  - `COG` and `SOG` as course/speed over ground
  - `NAVSTAT` as navigational status
  - `TYPE` as vessel type
  - `DEVICE` as positioning-device type

## 2) Retrieve AISHub stations
- Method: `GET`
- Path: `/stations.php`
- Full URL template: `https://data.aishub.net/stations.php?username=A&output=B&compress=C&id=D`
- Purpose: retrieve all AISHub stations or a single station by station ID

Documented query parameters:
- `username` - required AISHub username received after joining AISHub
- `output` - optional output format; `xml`, `json`, or `csv`; default `xml`
- `compress` - optional compression; `0` = none, `1` = ZIP, `2` = GZIP, `3` = BZIP2; default `0`
- `id` - optional station ID; when provided, the webservice returns data for the represented station only

Documented response notes:
- XML responses are shown as `<station .../>` records with fields such as `ID`, `LASTUPDATE`, `COUNTRY`, `LOCATION`, `SHIPS`, `DISTINCT`, and `CONTRIBUTOR`.
- JSON responses are shown as station objects with `ID`, `LASTUPDATE`, `COUNTRY`, `LOCATION`, `SHIPS`, `DISTINCT`, and `CONTRIBUTOR`.
- CSV responses are shown with columns `SID`, `LASTUPDATE`, `COUNTRY`, `LOCATION`, `SHIPS`, and `DISTINCT`.
- The docs define the core fields as:
  - `SID` / `ID` - unique station ID
  - `LASTUPDATE` - UTC timestamp
  - `COUNTRY` - station country
  - `LOCATION` - station location
  - `SHIPS` - count of ships in coverage
  - `DISTINCT` - count of unique ships

## Sources inspected
- `https://www.aishub.net/api`
