# Ducks Unlimited

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ducks-unlimited`
- Official docs/pages used manually:
  - `https://gis.ducks.org/datasets/du-university-chapters/api`
  - `https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm`
  - `https://services2.arcgis.com/5I7u4SJE1vUr79JC/arcgis/rest/services/UniversityChapters_Public/FeatureServer/0?f=json`
- Public API base URL confirmed from the official API Explorer: `https://services2.arcgis.com/5I7u4SJE1vUr79JC/arcgis/rest/services/UniversityChapters_Public/FeatureServer/0`
- Transport: `HTTPS`
- Auth model: none documented or required on the checked official pages
- Response formats confirmed from live layer metadata: `JSON`, `geoJSON`, `PBF`

## Service overview
- The live Ducks Unlimited `DU University Chapters` API page is an ArcGIS Hub `API Explorer` page, not an empty placeholder.
- The explorer tells users to `Create a query URL from the available options to get a JSON response` and links to the full ArcGIS REST `Query (Feature Service/Layer)` reference.
- The dataset page exposes the layer fields `University_Chapter`, `City`, `State`, `ChapterID`, and `MEVR_RD`; live layer metadata also confirms the system `OBJECTID` field.
- Live layer metadata reports:
  - `capabilities: Query`
  - `supportsPagination: true`
  - `maxRecordCount: 1000`

## Confirmed API surface
The official Ducks Unlimited dataset page currently exposes `1` query route family:
- `GET /query`

## 1) DU University Chapters query
- Methods: `GET`, `POST`
- Path: `/query`
- Full URL pattern: `https://services2.arcgis.com/5I7u4SJE1vUr79JC/arcgis/rest/services/UniversityChapters_Public/FeatureServer/0/query`
- Purpose: query Ducks Unlimited university-chapter point features, attributes, IDs, counts, and geometry from the published ArcGIS layer
- Authentication: none documented

Confirmed request parameters from the official Ducks API Explorer and the linked ArcGIS REST query reference:
- `where` - required SQL-style filter expression; the API Explorer default is `1=1`
- `outFields` - requested output fields; the explorer example uses `*`
- `outSR` - output spatial reference for returned geometry; the explorer example uses `4326`
- `f` - response format; the explorer example uses `json`, while live layer metadata advertises `JSON`, `geoJSON`, and `PBF`
- `geometryType` - optional spatial-input geometry type; the Ducks API Explorer visibly offers `None` and `Envelope`
- `returnGeometry` - optional boolean toggle for geometry output
- `returnIdsOnly` - optional boolean toggle to return only object IDs
- `returnCountOnly` - optional boolean toggle to return only a matching feature count
- `resultOffset` - optional pagination offset; the linked ArcGIS docs say it applies when `supportsPagination` is true
- `resultRecordCount` - optional pagination size; the linked ArcGIS docs say the maximum is the layer's `maxRecordCount`, which is `1000` here

Live success example exposed directly by the official Ducks API Explorer:
- `https://services2.arcgis.com/5I7u4SJE1vUr79JC/arcgis/rest/services/UniversityChapters_Public/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

Live response characteristics confirmed from the provider's own query URL:
- top-level keys include `objectIdFieldName`, `uniqueIdField`, `geometryType`, `spatialReference`, `fields`, and `features`
- returned fields include `OBJECTID`, `University_Chapter`, `City`, `State`, `ChapterID`, and `MEVR_RD`
- returned geometries are point coordinates in EPSG `4326`

## Errors, pagination, and rate limits
- Pagination is supported. The live layer metadata exposes `supportsPagination: true` and `maxRecordCount: 1000`.
- The checked official Ducks Unlimited / ArcGIS pages do not publish a Ducks-specific rate-limit or quota table.
- A live invalid query against the provider's own `/query` route returned this ArcGIS-style JSON error envelope:
  - HTTP-style error code: `400`
  - message: `Cannot perform query. Invalid query parameters.`
  - details: `['where' parameter is invalid]`
- The linked ArcGIS platform docs also point users to the broader `Feature service error codes` reference for additional platform-level failures.

## Response-format notes
- The Ducks API Explorer constructs JSON query URLs by default with `f=json`.
- The live layer metadata advertises supported query formats `JSON, geoJSON, PBF`, so callers should set `f` explicitly when they need a specific output format.
- No XML, CSV, or JSONP support was advertised on the checked official pages.

## Important usage notes
- This is a dataset-query layer, not a general-purpose address geocoder.
- The provider surface currently exposes one ArcGIS layer query entry point rather than multiple bespoke Ducks endpoints.
- Clients that need full result sets should respect the published `maxRecordCount` of `1000` and paginate with `resultOffset` / `resultRecordCount` when necessary.

## Canonical fireROUTE notes
- Canonical base: `https://services2.arcgis.com/5I7u4SJE1vUr79JC/arcgis/rest/services/UniversityChapters_Public/FeatureServer/0`
- Canonical route family: `GET|POST /query`
- Minimum practical inputs: `where`, `outFields`, and `f`
- Prefer `f=json` unless a caller explicitly needs `geoJSON` or `PBF`

## Verification notes
- This file was manually rebuilt from the live official Ducks Unlimited ArcGIS Hub API Explorer, the live layer metadata endpoint, the live provider query URL, and the linked official ArcGIS REST query reference using browser CDP tools only.
