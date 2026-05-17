# USGS Earthquake Hazards Program

## Provider metadata
- Category: `Science & Math`
- Provider slug: `usgs-earthquake-hazards-program`
- Official docs/pages used:
  - `https://earthquake.usgs.gov/fdsnws/event/1/` (Earthquake Catalog API documentation)
  - `https://earthquake.usgs.gov/earthquakes/feed/` (official real-time feed page linked from the docs as the preferred automated-feed option)
- Current public API base URL: `https://earthquake.usgs.gov/fdsnws/event/1`
- Auth model: no authentication documented for the event web service
- Response formats explicitly documented: QuakeML/XML, GeoJSON, CSV, KML, plain text, WADL, JSON for application metadata
- Rate limits: no formal public rate-limit quota is published on the documentation page used here
- Manually confirmed route count: `7`

## Access notes
- The documentation describes this API as an implementation of the **FDSN Event Web Service Specification**.
- USGS explicitly advises automated applications displaying near-real-time earthquake information to prefer the official real-time GeoJSON feeds where possible for better performance and availability.

## Canonical endpoints
1. `GET /application.json`
   - Returns known enumerated parameter values for the interface.
2. `GET /application.wadl`
   - Returns the service WADL description.
3. `GET /catalogs`
   - Returns available catalogs.
4. `GET /contributors`
   - Returns available contributors.
5. `GET /count`
   - Count-only variant of a search.
   - Uses the same search parameters as `query`.
6. `GET /query`
   - Primary event search endpoint.
7. `GET /version`
   - Returns the full service version number.

## Core query parameters
The docs say all query parameters are submitted as `key=value` pairs over HTTP GET and should not be repeated.

### Output and paging
- `format` - default `quakeml`; documented values include `csv`, `geojson`, `kml`, `quakeml`, `text`, and `xml`
- `limit` - integer `1..20000`; queries exceeding 20000 return `400 Bad Request`
- `offset` - integer offset starting at `1`
- `orderby` - documented values:
  - `time`
  - `time-asc`
  - `magnitude`
  - `magnitude-asc`
- `nodata` - documented values `204` or `404`; default `204`

### Time filters
- `starttime`
- `endtime`
- `updatedafter`

### Location / radius filters
- `minlatitude`
- `maxlatitude`
- `minlongitude`
- `maxlongitude`
- `latitude`
- `longitude`
- `maxradius`
- `maxradiuskm`

### Depth / magnitude filters
- `mindepth`
- `maxdepth`
- `minmagnitude`
- `maxmagnitude`

### Catalog / contributor / event selectors
- `catalog`
- `contributor`
- `eventid`

### Inclusion flags
- `includeallmagnitudes`
- `includeallorigins`
- `includearrivals`
- `includedeleted`
- `includesuperseded`

### Additional documented filters
- `alertlevel` / `minalertlevel` / `maxalertlevel`
- `eventtype`
- `producttype`
- `productcode`
- `reviewstatus`
- `mincdi`, `maxcdi`
- `minfelt`
- `mingap`, `maxgap`
- `minsig`, `maxsig`
- `minmmi`, `maxmmi`

### Format-specific extras
- GeoJSON extras: `callback`, `jsonerror`
- KML extras: `kmlanimated`, `kmlcolorby`

## Response notes
- If no `format` is specified, `quakeml` is returned by default.
- `count` is available in plain text by default and also in `geojson` and `xml`.
- `text` format is only available for `count`, `query`, and `version`.
- The documentation notes that XML output depends on the method used.

## Error notes
- The `limit` parameter explicitly documents an HTTP `400 Bad Request` when a query exceeds 20000 results.
- `nodata` controls whether empty-result queries return `204` or `404`.
- The docs also document a `409 Conflict` condition in the parameter tables.

## Usage notes
- `eventid` implies `includeallorigins` and `includeallmagnitudes`; the docs also say associated moment tensor and focal-mechanism information are included for specific-event requests.
- This is a read-only GET API.
- For fireROUTE, the natural mapping is list/search (`query`), count (`count`), metadata (`catalogs`, `contributors`, `application.json`, `application.wadl`), and service-info (`version`).

## fireROUTE normalization notes
- Normalize the service around `GET /query` plus six metadata/support routes.
- Preserve USGS parameter names directly; they are already concise and stable.
- Prefer GeoJSON for general routing adapters unless XML/QuakeML is specifically required.
