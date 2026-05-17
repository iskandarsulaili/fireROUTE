# Transport for Toronto, Canada

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-toronto-canada`
- Official docs used manually:
  - `https://myttc.ca/developers`
  - `https://myttc.ca/finch_station.json`
  - `https://myttc.ca/near/43.6557074,-79.3850234.json`
  - `https://myttc.ca/near/steeles_and_bathurst.json`
  - `https://myttc.ca/vehicles/near/bay_and_dundas.json`
- Base URL: `https://myttc.ca`
- Authentication: none
- Primary response formats: JSON and XML
- Transport scope documented here: TTC stop/station/location lookups plus nearby-stop and nearby-vehicle discovery helpers

## Important official usage notes
- The developer page says any normal MyTTC stop/station web URL can be requested as JSON or XML by adding the corresponding extension.
- The same page says MyTTC also honors the HTTP `Accept` header, so clients can request JSON or XML without changing the path.
- The provider explicitly says it does not use API keys.
- The developer page asks consumers to be respectful and not hammer the servers.
- For heavy or bulk usage, the provider recommends downloading the full dataset from the MyTTC Google Group in raw SQL or GTFS form.
- The page labels the `near` and `vehicles/near` endpoints as undocumented/experimental and warns they may change unexpectedly.

## Rate limits, pagination, and errors
- No numeric rate limit is published.
- The only official quota guidance is a qualitative anti-abuse note: do not hammer the servers; use dataset dumps for heavy usage.
- No pagination parameters are documented.
- No formal HTTP error table is documented on the inspected page.
- The commented JSON example shows timestamped structured responses rather than paginated collections.

## Confirmed API surface
The official MyTTC developer page currently exposes or explicitly examples 6 GET route patterns:
1. `GET /{uri}`
2. `GET /{uri}.json`
3. `GET /{uri}.xml`
4. `GET /near/{latitude},{longitude}.json`
5. `GET /near/{place}.json`
6. `GET /vehicles/near/{place}.json`

## Common request and response notes
- All confirmed routes are read-only `GET` routes.
- `/{uri}` is the core resource pattern; the page describes locations as human-readable unique URIs representing intersections, stations, addresses, routes, and other TTC resources.
- The `.json` and `.xml` suffixes are the explicit format selectors documented on the page.
- The developer page says JSON/XML can also be negotiated through the `Accept` header.
- The commented JSON example for a location shows fields such as `name`, `uri`, `time`, and `stops[]`.
- The same example explains that a location can group multiple stops and that stop records also have their own human-readable `uri` values.
- The experimental `near` routes are only shown as examples on the page, not as a separately versioned reference section.

## 1) Get a TTC resource as the default representation
- Method: `GET`
- Path: `/{uri}`
- Full URL pattern: `https://myttc.ca/{uri}`
- Purpose: retrieve the normal MyTTC page for a stop, station, location, or similar TTC resource

Documented path parameters:
- `uri` - required human-readable identifier for the target resource

Documented behavior notes:
- The developer page uses `finch_station` as the example URI.
- The same page explains that the API machinery is built from the normal web URL structure.
- When clients send an `Accept` header for JSON or XML, the provider says it will return the requested machine-readable format automatically.

## 2) Get a TTC resource as JSON
- Method: `GET`
- Path: `/{uri}.json`
- Full URL pattern: `https://myttc.ca/{uri}.json`
- Example full URL: `https://myttc.ca/finch_station.json`
- Purpose: retrieve a TTC stop/station/location resource as JSON

Documented path parameters:
- `uri` - required human-readable resource identifier

Documented response notes:
- The developer page links to a commented JSON example and says the JSON response can represent locations containing multiple stops.
- The visible commented example includes fields such as `name`, `uri`, `time`, and `stops`.

## 3) Get a TTC resource as XML
- Method: `GET`
- Path: `/{uri}.xml`
- Full URL pattern: `https://myttc.ca/{uri}.xml`
- Example full URL: `https://myttc.ca/finch_station.xml`
- Purpose: retrieve a TTC stop/station/location resource as XML

Documented path parameters:
- `uri` - required human-readable resource identifier

Documented response notes:
- The developer page documents XML as a first-class response format alongside JSON.
- No XML schema table is published on the inspected page.

## 4) Get nearby TTC locations by latitude/longitude
- Method: `GET`
- Path: `/near/{latitude},{longitude}.json`
- Full URL pattern: `https://myttc.ca/near/{latitude},{longitude}.json`
- Example full URL: `https://myttc.ca/near/43.6557074,-79.3850234.json`
- Purpose: return nearby TTC data for a geographic point

Documented path parameters:
- `latitude` - required decimal latitude embedded in the path example
- `longitude` - required decimal longitude embedded in the path example

Official note:
- The developer page places this route under `Undocumented APIs` and says such endpoints may change unexpectedly.

## 5) Get nearby TTC locations by place identifier
- Method: `GET`
- Path: `/near/{place}.json`
- Full URL pattern: `https://myttc.ca/near/{place}.json`
- Example full URL: `https://myttc.ca/near/steeles_and_bathurst.json`
- Purpose: return nearby TTC data using a named place/location slug instead of explicit coordinates

Documented path parameters:
- `place` - required location slug or place identifier

Official note:
- This route is also listed under `Undocumented APIs` and may change unexpectedly.

## 6) Get nearby TTC vehicles by place identifier
- Method: `GET`
- Path: `/vehicles/near/{place}.json`
- Full URL pattern: `https://myttc.ca/vehicles/near/{place}.json`
- Example full URL: `https://myttc.ca/vehicles/near/bay_and_dundas.json`
- Purpose: return nearby vehicle information for a named location

Documented path parameters:
- `place` - required location slug or place identifier

Official note:
- This route is likewise listed as undocumented/experimental on the developer page.

## Sources inspected
- `https://myttc.ca/developers`
- `https://myttc.ca/finch_station.json`
- `https://myttc.ca/near/43.6557074,-79.3850234.json`
- `https://myttc.ca/near/steeles_and_bathurst.json`
- `https://myttc.ca/vehicles/near/bay_and_dundas.json`
