# NASA

## Provider metadata
- Category: `Science & Math`
- Provider slug: `nasa`
- Description: `NASA data, including imagery`
- Official docs/pages used:
  - `https://api.nasa.gov/` (official NASA API portal with auth, quota, and per-service route examples)
  - `https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf` (official Image and Video Library API document linked from the portal)
  - `https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf` (official InSight weather API document linked from the portal)
  - `https://ssd-api.jpl.nasa.gov/` and linked `doc/*.html` pages referenced by the portal for SSD/CNEOS service families
  - `https://sscweb.gsfc.nasa.gov/WebServices/REST/` (official SSC REST root linked from the portal)
- Current public API base URLs confirmed on the reviewed official pages:
  - `https://api.nasa.gov`
  - `https://images-api.nasa.gov`
  - `https://osdr.nasa.gov`
  - `https://sscweb.gsfc.nasa.gov/WebServices/REST`
  - `https://ssd-api.jpl.nasa.gov`
- Auth model: the portal says you do not need to authenticate to explore the data, but most concrete examples use query parameter `api_key=DEMO_KEY`; a personal NASA developer key is recommended for sustained use
- Methods officially documented on the reviewed pages: primarily `GET`
- Response formats officially documented on the reviewed pages: JSON for most API calls; binary/image responses for EPIC archive and tile services; XML for WMTS capabilities; JSON also explicitly documented for the NASA Image and Video Library API, including JSON error payloads
- Rate limits published on the reviewed official pages:
  - Default key limit: `1,000 requests per hour`
  - `DEMO_KEY` limit: `30 requests per IP per hour`, `50 requests per IP per day`
  - InSight weather page: `no more than 2000 hits per IP per hour`
- Manually confirmed route count: `48`

## Cross-service usage notes from the official portal
- The official NASA API portal is an aggregator of multiple service families, not one single homogeneous backend.
- The portal explicitly notes that the Earth API has been archived and replaced with the Earthdata GIBS API.
- The portal also notes that the Mars Rover API has been archived.
- `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers are documented as the primary way to inspect current quota usage.

## Canonical endpoints confirmed on the reviewed official pages
### APOD
1. `GET /planetary/apod`
   - Astronomy Picture of the Day.
   - Official query params shown: `date`, `start_date`, `end_date`, `count`, `thumbs`, `api_key`.

### Asteroids NeoWs
2. `GET /neo/rest/v1/feed`
   - Near-Earth object feed for a date range.
3. `GET /neo/rest/v1/neo/{asteroid_id}`
   - Lookup one asteroid by SPK-ID.
4. `GET /neo/rest/v1/neo/browse`
   - Browse the overall asteroid dataset.

### DONKI
5. `GET /DONKI/CME`
6. `GET /DONKI/CMEAnalysis`
7. `GET /DONKI/GST`
8. `GET /DONKI/IPS`
9. `GET /DONKI/FLR`
10. `GET /DONKI/SEP`
11. `GET /DONKI/MPC`
12. `GET /DONKI/RBE`
13. `GET /DONKI/HSS`
14. `GET /DONKI/WSAEnlilSimulations`
15. `GET /DONKI/notifications`
- Common documented params include `startDate`, `endDate`, and `api_key`.
- Additional documented service-specific params include `mostAccurateOnly`, `completeEntryOnly`, `speed`, `halfAngle`, `catalog`, `keyword`, `location`, and `type`.

### EPIC
16. `GET /EPIC/api/natural/images`
17. `GET /EPIC/api/natural/date/{date}`
18. `GET /EPIC/api/natural/all`
19. `GET /EPIC/api/natural/available`
20. `GET /EPIC/api/enhanced/images`
21. `GET /EPIC/api/enhanced/date/{date}`
22. `GET /EPIC/api/enhanced/all`
23. `GET /EPIC/api/enhanced/available`
24. `GET /EPIC/archive/{collection}/{YYYY}/{MM}/{DD}/{image_format}/{image_name}`
- The official EPIC section documents `api_key` and date-based access patterns.

### InSight weather
25. `GET /insight_weather/`
- Official query params shown: `api_key`, `feedtype=json`, `ver=1.0`.

### NASA Image and Video Library
26. `GET /`
   - API root on `https://images-api.nasa.gov`.
27. `GET /search`
28. `GET /asset/{nasa_id}`
29. `GET /metadata/{nasa_id}`
30. `GET /captions/{nasa_id}`
- Official docs say this API is REST-oriented and returns JSON, including errors.

### Open Science Data Repository (OSDR)
31. `GET /osdr/data/osd/files/{OSD_STUDY_IDs}`
32. `GET /osdr/data/osd/meta/{study_id}`
33. `GET /osdr/data/search`
34. `GET /bio/repo/search`
35. `GET /geode-py/ws/api/experiments`
36. `GET /geode-py/ws/api/missions`
37. `GET /geode-py/ws/api/payloads`
38. `GET /geode-py/ws/api/hardware`
39. `GET /geode-py/ws/api/vehicles`
40. `GET /geode-py/ws/api/subjects`
41. `GET /geode-py/ws/api/biospecimens`
42. `GET /geode-py/ws/api/mission/{mission_name}`
43. `GET /geode-py/ws/api/vehicle/{vehicle_name}`
- The official OSDR examples also show direct file-download URLs under `/geode-py/ws/studies/{study}/download?...` generated from returned metadata.

### TechTransfer
44. `GET /techtransfer`
- The official portal documents patents, issued-patent data, software, and spinoff searches under the TechTransfer endpoint family.

### TLE API
45. `GET /api/tle?search={q}`
46. `GET /api/tle/{q}`
- These are documented by the official portal as part of the NASA API catalog entry for the TLE service.

### Trek / WMTS catalogs
47. `GET /mars-wmts/catalog/`
48. `GET /vesta-wmts/catalog/`
- The official Trek section also documents per-product HTML catalog pages and per-product `WMTSCapabilities.xml` resources beneath those catalog roots.

## Important parameters and pagination notes
### Shared platform parameter
- `api_key` - the main query parameter used throughout the portal examples; `DEMO_KEY` is the documented starter value.

### APOD parameters
- `date` - single date in `YYYY-MM-DD`
- `start_date`, `end_date` - range query pair
- `count` - random image count
- `thumbs` - include video thumbnails when applicable
- `concept_tags` - mentioned on the portal, but the page explicitly says concept tags are now disabled

### NeoWs parameters
- `start_date`, `end_date`
- `asteroid_id` path variable
- `api_key`

### DONKI parameters
- `startDate`, `endDate`
- `mostAccurateOnly`, `completeEntryOnly`, `speed`, `halfAngle`, `catalog`, `keyword`, `location`, `type`
- The official page documents default date windows for several DONKI endpoints.

### EPIC parameters
- Collection/value families `natural` and `enhanced`
- Date path segments in `YYYY-MM-DD` or archive path form `YYYY/MM/DD`
- `api_key`

### OSDR parameters
- `{OSD_STUDY_IDs}` accepts comma-separated values, ranges, and decimal version references according to the official examples
- `page` / `size` paginate study-file requests
- The official page says `size` has a maximum of `25`
- `all_files` controls hidden file inclusion
- Search examples show `term`, `from`, `type`, repeated `ffield`, and repeated `fvalue`

### WMTS notes
- The Trek section documents WMTS tile templates of the form `/{service}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{ext}` after discovering values from `WMTSCapabilities.xml`.

## Response and format notes
- Most reviewed NASA APIs return JSON.
- The Image and Video Library docs explicitly state JSON is returned for success and error responses.
- EPIC archive routes return image files.
- Trek catalog capabilities are exposed as XML documents.
- OSDR search/data endpoints return metadata-rich JSON with pagination fields such as page number, page size, and total counts.

## Error and reliability notes
- The central portal documents rate-limit blocking rather than a single cross-service error schema.
- Image and Video Library docs rely on HTTP status codes plus JSON errors.
- Several service families on the portal defer to service-specific linked docs for deeper error behavior.

## Usage notes
- Treat NASA as a multi-origin provider family rather than one monolithic REST API.
- Preserve service-specific roots (`planetary`, `neo`, `DONKI`, `EPIC`, `insight_weather`, `images-api`, `osdr`, `sscweb`, `ssd-api`, Trek catalogs).
- Do not assume every NASA catalog entry shares the same pagination, auth, or output format behavior.
- Archived services called out on the portal should not be normalized as active targets.

## fireROUTE normalization notes
- Preserve the exact service prefix when routing requests.
- Keep `api_key` passthrough support at the top level because it appears across multiple NASA-hosted services.
- Separate metadata JSON endpoints from binary/image/XML download endpoints.
- Model DONKI as a family of event-type endpoints rather than one generic route.
- Keep OSDR study/file metadata, metadata retrieval, search, and geode entity APIs as separate adapter families.