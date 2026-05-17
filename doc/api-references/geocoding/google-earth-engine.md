# Google Earth Engine

## Provider metadata
- Category: `Geocoding`
- Provider slug: `google-earth-engine`
- Official docs used manually:
  - `https://developers.google.com/earth-engine/reference/rest`
  - `https://developers.google.com/earth-engine/reference/rest/v1/projects/listAssets`
  - `https://developers.google.com/earth-engine/apidocs`
- Public API service endpoint documented by provider: `https://earthengine.googleapis.com`
- Discovery documents published by provider:
  - `https://earthengine.googleapis.com/$discovery/rest?version=v1`
  - `https://earthengine.googleapis.com/$discovery/rest?version=v1beta`
  - `https://earthengine.googleapis.com/$discovery/rest?version=v1alpha`
- Transport: `HTTPS`
- Response format signals in the inspected REST reference: `JSON`

## Product and access notes
- The official REST overview describes Earth Engine as a platform for geospatial data storage, analysis, and visualization.
- The overview explicitly recommends Google-provided client libraries, but it also publishes the direct REST service endpoint and route catalog.
- The REST pages use Google gRPC-transcoding path syntax such as `/v1/{name=projects/*/config}`.
- The old index metadata that labeled this provider as `apiKey` auth is stale. The inspected REST method pages instead document OAuth scopes and IAM permissions.
- On the inspected `projects.listAssets` method page, Google lists these OAuth scopes: `https://www.googleapis.com/auth/earthengine`, `https://www.googleapis.com/auth/earthengine.readonly`, `https://www.googleapis.com/auth/cloud-platform`, and `https://www.googleapis.com/auth/cloud-platform.read-only`.

## Confirmed API surface
The official REST overview currently publishes these `51` stable `v1` route families under `https://earthengine.googleapis.com`.

### Project configuration and discovery
1. `GET /v1/{name=projects/*/config}` - `projects.getConfig`
2. `GET /v1/{parent=projects/*}:listAssets` - `projects.listAssets`
3. `PATCH /v1/{projectConfig.name=projects/*/config}` - `projects.updateConfig`
4. `GET /v1/{parent=projects/*}/algorithms` - `projects.algorithms.list`

### Asset management
5. `POST /v1/{sourceName=projects/*/assets/**}:copy` - `projects.assets.copy`
6. `POST /v1/{parent=projects/*}/assets` - `projects.assets.create`
7. `DELETE /v1/{name=projects/*/assets/**}` - `projects.assets.delete`
8. `GET /v1/{name=projects/*/assets/**}` - `projects.assets.get`
9. `POST /v1/{resource=projects/*/assets/**}:getIamPolicy` - `projects.assets.getIamPolicy`
10. `POST /v1/{name=projects/*/assets/**}:getPixels` - `projects.assets.getPixels`
11. `GET /v1/{parent=projects/*/assets/**}:listAssets` - `projects.assets.listAssets`
12. `GET /v1/{asset=projects/*/assets/**}:listFeatures` - `projects.assets.listFeatures`
13. `POST /v1/{sourceName=projects/*/assets/**}:move` - `projects.assets.move`
14. `PATCH /v1/{asset.name=projects/*/assets/**}` - `projects.assets.patch`
15. `POST /v1/{resource=projects/*/assets/**}:setIamPolicy` - `projects.assets.setIamPolicy`
16. `POST /v1/{resource=projects/*/assets/**}:testIamPermissions` - `projects.assets.testIamPermissions`

### Feature views, classifiers, and visual products
17. `POST /v1/{project=projects/*}/classifier:export` - `projects.classifier.export`
18. `POST /v1/{parent=projects/*}/featureView` - `projects.featureView.create`
19. `POST /v1/{parent=projects/*}/featureViews` - `projects.featureViews.create`
20. `GET /v1/{parent=projects/*/featureViews/*}/tiles/{zoom}/{x}/{y}` - `projects.featureViews.tiles.get`
21. `POST /v1/{parent=projects/*}/filmstripThumbnails` - `projects.filmstripThumbnails.create`
22. `GET /v1/{name=projects/*/filmstripThumbnails/*}:getPixels` - `projects.filmstripThumbnails.getPixels`
23. `POST /v1/{project=projects/*}/image:computePixels` - `projects.image.computePixels`
24. `POST /v1/{project=projects/*}/image:export` - `projects.image.export`
25. `POST /v1/{project=projects/*}/image:import` - `projects.image.import`
26. `POST /v1/{project=projects/*}/imageCollection:computeImages` - `projects.imageCollection.computeImages`
27. `POST /v1/{project=projects/*}/map:export` - `projects.map.export`
28. `POST /v1/{parent=projects/*}/maps` - `projects.maps.create`
29. `GET /v1/{parent=projects/*/maps/*}/tiles/{zoom}/{x}/{y}` - `projects.maps.tiles.get`
30. `POST /v1/{parent=projects/*}/thumbnails` - `projects.thumbnails.create`
31. `GET /v1/{name=projects/*/thumbnails/*}:getPixels` - `projects.thumbnails.getPixels`
32. `POST /v1/{project=projects/*}/video:export` - `projects.video.export`
33. `POST /v1/{parent=projects/*}/videoThumbnails` - `projects.videoThumbnails.create`
34. `GET /v1/{name=projects/*/videoThumbnails/*}:getPixels` - `projects.videoThumbnails.getPixels`

### Region-specific creation endpoints
35. `POST /v1/{parent=projects/*/locations/*}/assets` - `projects.locations.assets.create`
36. `POST /v1/{parent=projects/*/locations/*}/filmstripThumbnails` - `projects.locations.filmstripThumbnails.create`
37. `POST /v1/{parent=projects/*/locations/*}/maps` - `projects.locations.maps.create`
38. `POST /v1/{parent=projects/*/locations/*}/tables` - `projects.locations.tables.create`
39. `POST /v1/{parent=projects/*/locations/*}/thumbnails` - `projects.locations.thumbnails.create`
40. `POST /v1/{parent=projects/*/locations/*}/videoThumbnails` - `projects.locations.videoThumbnails.create`

### Operations, table processing, and scalar evaluation
41. `POST /v1/{name=projects/*/operations/**}:cancel` - `projects.operations.cancel`
42. `DELETE /v1/{name=projects/*/operations/**}` - `projects.operations.delete`
43. `GET /v1/{name=projects/*/operations/**}` - `projects.operations.get`
44. `GET /v1/{name=projects/*}/operations` - `projects.operations.list`
45. `POST /v1/{name=projects/*/operations/**}:wait` - `projects.operations.wait`
46. `POST /v1/{project=projects/*}/table:computeFeatures` - `projects.table.computeFeatures`
47. `POST /v1/{project=projects/*}/table:export` - `projects.table.export`
48. `POST /v1/{project=projects/*}/table:import` - `projects.table.import`
49. `POST /v1/{parent=projects/*}/tables` - `projects.tables.create`
50. `GET /v1/{name=projects/*/tables/*}:getFeatures` - `projects.tables.getFeatures`
51. `POST /v1/{project=projects/*}/value:compute` - `projects.value.compute`

## Common parameter and request patterns
- Common path variables published in the route catalog include `name`, `parent`, `project`, `resource`, `sourceName`, `asset`, `zoom`, `x`, and `y`.
- The inspected `projects.listAssets` page documents these notable query parameters:
  - `pageSize`
  - `pageToken`
  - `filter`
  - `view`
- `projects.listAssets` requires a `parent` resource name such as `projects/[PROJECT]` or `projects/[PROJECT]/assets/...`.
- Write routes mostly use `POST` or `PATCH` with JSON request bodies; Google’s docs describe the request and response schemas on each method page rather than flattening them into one generic parameter table.
- Tile endpoints use path-based `zoom`, `x`, and `y` variables rather than query-only lookup parameters.

## Pagination, operations, errors, and quota notes
- Pagination is explicitly documented on list-style methods such as `projects.listAssets`, which uses `pageSize` and `pageToken` and returns `ListAssetsResponse.next_page_token` for continuation.
- Long-running work is represented through the `projects.operations` resource family, including `get`, `list`, `wait`, `cancel`, and `delete`.
- The inspected REST reference does not publish a single global error-code table or a single per-minute rate-limit number.
- Instead, the method pages emphasize OAuth scopes, IAM permissions, and request/response schemas.
- The API Reference page currently carries a product-wide notice about Earth Engine noncommercial quota tiers taking effect on `2026-04-27`; that is the clearest quota signal exposed on the inspected public docs.
- For fireROUTE purposes, expect normal Google API HTTP errors plus permission/scope failures when callers lack required IAM grants or OAuth scopes.

## Format and integration notes
- All inspected REST routes are relative to `https://earthengine.googleapis.com`.
- The REST overview publishes parallel `v1beta` and `v1alpha` route families, but this file counts only the stable `v1` surface above.
- The route catalog is broader than classic address geocoding: this provider covers geospatial assets, imagery, maps, tiles, tables, exports, and computed values.
- Resource names are strongly project-scoped; fireROUTE adapters should preserve provider-native resource identifiers rather than trying to flatten them into generic address-only paths.

## Verification notes
- This file was manually rebuilt from the live official Google Earth Engine REST overview, the API Reference index, and a live `projects.listAssets` method page using browser tools only.
