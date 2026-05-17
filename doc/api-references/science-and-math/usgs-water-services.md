# USGS Water Services

## Provider metadata
- Category: `Science & Math`
- Provider slug: `usgs-water-services`
- Official docs/pages used:
  - `https://waterservices.usgs.gov/` (official Water Services landing page)
  - `https://waterservices.usgs.gov/docs/site-service/site-service-details/` (official service-details page)
  - `https://waterservices.usgs.gov/docs/dv-service/daily-values-service-details/` (official daily-values details)
  - `https://waterservices.usgs.gov/docs/groundwater-levels/` and its linked `Service details` page (official groundwater service docs)
- Current public API base URL pattern: `https://waterservices.usgs.gov/nwis`
- Auth model: no authentication documented
- Methods confirmed from the official docs: `GET`
- Response formats documented across the reviewed pages: WaterML/XML, JSON, RDB/tab-delimited, KML (site service), plus JSON-rendered groundwater output
- Rate-limit notes: no numeric public quota is published in the reviewed docs; the docs repeatedly instruct clients to minimize result size and query scope
- Lifecycle note: the official landing page states WaterServices will be decommissioned in early `2027` and applications must migrate to `https://api.waterdata.usgs.gov`
- Manually confirmed route count: `5`

## Canonical endpoints
1. `GET /nwis/iv/`
   - Instantaneous Values Service for recent and historical time-series readings.
2. `GET /nwis/dv/`
   - Daily Values Service for historical summarized daily values.
3. `GET /nwis/site/`
   - Site Service for hydrologic site metadata and filters.
4. `GET /nwis/stat/`
   - Statistics Service for daily, monthly, or annual statistics based on approved data.
5. `GET /nwis/gwlevels`
   - Groundwater Levels Service for manually recorded groundwater levels.

## Core query-parameter families
The reviewed pages show a common URL-query style across services, with route-specific parameter support.

### Output / transport
- `format`
- `indent`
- gzip compression is supported via `Accept-Encoding: gzip, compress`

### Site / geography selectors seen in the official docs
- `site`
- `sites`
- `stateCd`
- `countyCd`
- `huc`
- `bbox`
- `agencyCd`
- `siteStatus`
- `siteType`

### Time / update selectors
- `startDT`
- `endDT`
- `period`
- `modifiedSince`

### Measurement / statistic selectors
- `parameterCd`
- `statCd`
- `variable`

### Additional service-specific filters surfaced on the reviewed USGS pages and examples
- `aquiferCd`
- `localAquiferCd`
- `altMin`, `altMax`
- `drainAreaMin`, `drainAreaMax`
- `holeDepthMin`, `holeDepthMax`
- `wellDepthMin`, `wellDepthMax`

## Service-specific notes
### Instantaneous Values (`/nwis/iv/`)
- The docs say this returns recent and historical values for streamflow and other regular time-series parameters.
- Data from `2007-10-01` onward can be returned in one request, with some operational data subject to shorter retention windows.

### Daily Values (`/nwis/dv/`)
- Returns summarized daily hydrologic values.
- The docs say the default output is `format=waterml`.

### Site Service (`/nwis/site/`)
- Returns information about hydrologic sites.
- Officially documented outputs include RDB/tab-delimited and KML-friendly formats.

### Statistics Service (`/nwis/stat/`)
- Returns daily, monthly, or annual statistics.
- The docs explicitly say statistics are based on approved data only.

### Groundwater Levels (`/nwis/gwlevels`)
- Returns historical manually recorded groundwater levels.
- The docs direct users needing automated real-time groundwater measurements to the instantaneous-values service instead.

## Response notes
- The reviewed pages repeatedly describe the APIs as REST-friendly browser-accessible GET services.
- WaterML/XML and JSON are primary machine-readable formats across the time-series services.
- The site service emphasizes legacy RDB/tab-delimited output and KML support.
- Groundwater levels are documented as JSON rendering of WaterML-equivalent data.

## Error notes
- The docs state application errors are reported through HTTP status codes/headers.
- The reviewed groundwater details page explicitly instructs clients to treat non-`200` responses as exceptions.
- No compact numeric rate-limit table is published on the reviewed pages.

## Usage notes
- Always request the minimum data needed; that guidance is repeated throughout the official docs.
- Prefer smaller scoped filters and date ranges for large national datasets.
- Plan migration away from WaterServices because the official landing page announces decommissioning in early 2027.
- Water Quality Services are linked from the landing page, but that link goes to the separate joint `waterqualitydata.us` service rather than another `waterservices.usgs.gov/nwis` endpoint family.

## fireROUTE normalization notes
- Normalize this provider around five read-only endpoint families under `https://waterservices.usgs.gov/nwis`.
- Keep service-specific query parameters available instead of flattening them into a single universal schema.
- Default to JSON when a route supports it, but preserve WaterML/XML and RDB compatibility where the service docs make them canonical.
- Surface the deprecation / migration warning in adapter metadata.
