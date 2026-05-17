# Open Data Minneapolis

## Provider metadata
- Category: `Open Data`
- Provider slug: `open-data-minneapolis`
- Description: `City of Minneapolis ArcGIS Hub open-data catalog with official OGC search and feed APIs`
- Official docs/pages used:
  - `https://opendata.minneapolismn.gov/search?collection=dataset` (official Minneapolis dataset-search page)
  - `https://opendata.minneapolismn.gov/api/search/definition/` (official Search API definition page)
  - `https://opendata.minneapolismn.gov/api/feed/definition/` (official Feed API definition page)
- Current public API base URLs confirmed from the reviewed official pages:
  - `https://opendata.minneapolismn.gov/api/search/v1`
  - `https://opendata.minneapolismn.gov/api/feed`
- Auth model: public GET APIs; the official Search API docs expose an optional `token` query parameter on search routes for access to the underlying ArcGIS item when needed, but no reviewed route required auth for public catalog access
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON for catalog/root/collection/feed routes, GeoJSON (`application/geo+json`) for item-list responses, and RSS XML (`application/rss+xml`) for the RSS feed route
- Rate limits: no numeric public quota or throttling rules were published on the reviewed official pages
- Manually confirmed route count: `16`

## API shape and official portal notes
- The official Minneapolis portal is built with ArcGIS Hub and exposes an `Explore Feeds` control directly on the official search page.
- The official feed modal on that page surfaces copyable feed URLs for RSS and DCAT variants.
- The official Search API definition says the service conforms to OGC API - Records.
- Live official responses confirmed that `GET /api/search/v1/collections/dataset/items` returns `application/geo+json`, while feed routes return JSON or RSS depending on the feed family.

## Canonical endpoints
### Search API
1. `GET /api/search/v1`
   - OGC root / landing page for the Minneapolis search API.
2. `GET /api/search/v1/conformance`
   - Conformance declarations for the API.
3. `GET /api/search/v1/catalog`
   - Site and catalog metadata.
4. `GET /api/search/v1/collections`
   - List catalog collections.
5. `GET /api/search/v1/collections/{collectionId}`
   - Fetch a collection definition.
6. `GET /api/search/v1/collections/{collectionId}/queryables`
   - List the minimal queryable properties for a collection.
7. `GET /api/search/v1/collections/{collectionId}/items`
   - Search / filter records in a collection.
8. `GET /api/search/v1/collections/{collectionId}/items/{itemId}`
   - Fetch one item by item ID.
9. `GET /api/search/v1/collections/{collectionId}/items/{recordId}/related`
   - Search related items for a record.
10. `GET /api/search/v1/collections/{collectionId}/items/{recordId}/connected`
    - Search connected items for a record.
11. `GET /api/search/v1/collections/{collectionId}/aggregations`
    - Return aggregations for a collection.

### Feed API
12. `GET /api/feed/dcat-ap/2.0.1`
    - DCAT AP 2.0.1 JSON feed.
13. `GET /api/feed/dcat-ap/2.1.1`
    - DCAT AP 2.1.1 JSON feed.
14. `GET /api/feed/dcat-ap/3.0.0`
    - DCAT AP 3.0.0 JSON feed.
15. `GET /api/feed/dcat-us/1.1`
    - DCAT US 1.1 JSON feed.
16. `GET /api/feed/rss/2.0`
    - RSS 2.0 XML feed.

## Core parameters and path conventions
### Shared search-route parameters
- `token` - optional ArcGIS token on root, catalog, collection, queryables, and other search routes
- `collectionId` - required path parameter on collection-specific routes; official examples use `dataset`

### Item-search parameters (`GET /api/search/v1/collections/{collectionId}/items` and the related/connected variants)
- `q` - general text search filter
- `bbox` - bounding-box filter; must be four comma-separated coordinates
- `filter` - CQL filter expression following the OGC Common Query Language guidance linked from the official docs
- `limit` - number of results; official schema minimum `0`, maximum `100`
- `startindex` - 1-based starting index for pagination
- `type` - resource type filter
- `title` - title filter
- `recordId` - record identifier filter; the official docs say it may be `itemId` or `itemId_layerId`
- `sortBy` - sort field(s), prefixed with `+` for ascending or `-` for descending; `+` is assumed when omitted
- `tags` - tags filter
- `openData` - boolean-style flag for items shared to the Open Data group

### Aggregation parameters
- `exampleAggregationName` - example aggregation-expression query parameter shown in the official docs; the parameter name is intentionally arbitrary and alphabetic in real use
- `filter` - optional CQL filter to refine the aggregation search
- `limit` - optional bucket/result limit
- `token` - optional ArcGIS token

### Feed parameters
All five feed routes accept the same optional query parameters:
- `q` - free-text search query
- `updated` - restrict results to items updated within the last specified number of hours
- `sort` - sort enum values documented as `Date Created|created|asc`, `Date Created|created|desc`, `Date Modified|modified|asc`, `Date Modified|modified|desc`
- `id` - include only a specific item ID

## Response, pagination, and error notes
- `GET /api/search/v1` returns JSON with hypermedia links including links to `collections` and the OpenAPI definition.
- `GET /api/search/v1/collections` returns JSON collection metadata; live official output showed a `dataset` collection with CRS and filter metadata.
- `GET /api/search/v1/collections/{collectionId}/items` returns GeoJSON (`application/geo+json`) with a top-level `FeatureCollection`.
- `GET /api/search/v1/conformance` returns JSON listing supported OGC conformance URIs.
- The four DCAT feed routes return JSON (`application/json`), and `GET /api/feed/rss/2.0` returns RSS XML (`application/rss+xml`).
- Search pagination is handled with `limit` and `startindex`.
- The official Swagger pages mostly document `200` success responses. During live checks against official Minneapolis endpoints, an invalid aggregation expression returned a JSON `400 Bad Request` body of the form `{"message": ..., "error": "Bad Request", "statusCode": 400}`.

## Important usage notes
- The official Minneapolis `Explore Feeds` modal exposed copyable feed URLs with `.json` suffixes for the JSON feeds (for example `/api/feed/dcat-us/1.1.json` and `/api/feed/dcat-ap/2.1.1.json`). Live official requests confirmed those `.json` aliases work alongside the canonical Swagger paths without the suffix.
- The feed routes are collection-wide catalog feeds; use the Search API when you need richer filtering, pagination, item lookup, or OGC-style records navigation.
- The official Search API docs point to OGC API - Records behavior, so preserve query semantics like `bbox`, `filter`, and `sortBy` instead of flattening them into generic keyword-only search.

## fireROUTE normalization notes
- Normalize Minneapolis as a dual-surface provider with a Search API rooted at `/api/search/v1` and a Feed API rooted at `/api/feed`.
- Treat collection-aware search routes and feed routes as separate families.
- Preserve `collectionId`, `itemId`, and `recordId` path variables as documented.
- Expose `limit` and `startindex` pagination controls on searchable item-list routes.
- Treat `.json` feed URLs as working aliases, but keep the canonical route inventory anchored to the official Swagger route definitions above.
