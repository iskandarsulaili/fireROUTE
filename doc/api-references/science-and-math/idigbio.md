# iDigBio

## Provider metadata
- Category: `Science & Math`
- Provider slug: `idigbio`
- Description: `Access millions of museum specimens from organizations around the world`
- Official docs/pages used:
  - `https://github.com/idigbio/idigbio-search-api/wiki`
  - `https://raw.githubusercontent.com/wiki/idigbio/idigbio-search-api/Home.md` (same official GitHub wiki content, reviewed in-browser for readable route details)
- Current public API base URL: `https://search.idigbio.org/v2`
- Auth model: no authentication documented on the reviewed official wiki
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: `JSON`, `GeoJSON`, `UTFGrid JSON`, `PNG`
- Rate limits: no numeric rate-limit policy was published on the reviewed official wiki
- Manually confirmed route count: `48`

## API shape and behavior
- The official wiki describes the iDigBio Search API as a read-only RESTful wrapper around Elasticsearch.
- The public API supports `GET` and `POST` for search-style read operations.
- `GET` requests must be URL-encoded.
- `POST` requests must send JSON and set `Content-Type: application/json`.
- Most search and summary endpoints use provider-specific query parameters rather than page-number pagination.
- Several legacy/deprecated routes are still documented alongside their preferred replacements.

## Shared parameter conventions
- Search query parameters:
  - `rq` - record query in iDigBio Query Format
  - `mq` - media query in iDigBio Query Format
  - `rsq` - recordset query in iDigBio Query Format
- Common result-shaping parameters:
  - `sort`
  - `fields`
  - `fields_exclude`
  - `limit`
  - `offset`
  - `no_attribution`
- Summary-specific parameters:
  - `top_fields`
  - `count`
  - `date_field` / `dateField`
  - `min_date` / `minDate`
  - `max_date` / `maxDate`
  - `date_interval` / `dateInterval`
- Mapping-specific parameters:
  - `style`
  - `type` - map type, documented as `geohash` or `points`
  - `lat`
  - `lon`
  - `zoom`
- Stats-specific parameters:
  - `recordset`
  - path parameter `t` - one of `api`, `digest`, `search`
- Path parameter enums called out by the docs:
  - `{type}` for `/v2/view/{type}/{uuid}` and `/v2/meta/fields/{type}`: `records`, `mediarecords`, `recordsets`, `publishers`
  - `{type}` for `/v2/search/{type}/`: `records`, `mediarecords`, `recordsets`

## Pagination and response notes
- Search-like collection endpoints document `limit` and `offset` rather than page-number pagination.
- The API returns JSON documents for search, view, summary, and metadata endpoints.
- Mapping tile routes return representation-specific payloads:
  - `/y.json` -> GeoJSON
  - `/y.grid.json` -> UTFGrid JSON
  - `/y.png` -> PNG tile image
- The docs state that each request also returns a top-level attribution block containing recordset information unless disabled with `no_attribution` where supported.

## Error notes
- The reviewed official wiki does not publish a dedicated HTTP error table or a structured error schema.
- The docs do state request-format requirements for `GET` URL encoding and `POST` JSON bodies, so invalid query encoding/body shape should be treated as client-side request errors even though exact payloads are not documented.

## Canonical endpoints

### View
1. `GET /v2/view/{uuid}`
2. `GET /v2/view/{type}/{uuid}`

### Generic search
3. `GET /v2/search/{type}/`

### Record search
4. `GET /v2/search/records/`
5. `POST /v2/search/records/`
6. `GET /v2/search/`  (deprecated legacy record-search route)
7. `POST /v2/search/`  (deprecated legacy record-search route)

### Media search
8. `GET /v2/search/media/`
9. `POST /v2/search/media/`
10. `GET /v2/media/`  (deprecated legacy media-search route)
11. `POST /v2/media/`

### Recordset search
12. `GET /v2/search/recordsets/`
13. `POST /v2/search/recordsets/`

### Mapping
14. `GET /v2/mapping/`
15. `POST /v2/mapping/`
16. `GET /v2/mapping/{s}`
17. `GET /v2/mapping/{s}/{z}/{x}/{y.json}`
18. `POST /v2/mapping/{s}/{z}/{x}/{y.json}`
19. `GET /v2/mapping/{s}/{z}/{x}/{y.grid.json}`
20. `POST /v2/mapping/{s}/{z}/{x}/{y.grid.json}`
21. `GET /v2/mapping/{s}/{z}/{x}/{y.png}`
22. `POST /v2/mapping/{s}/{z}/{x}/{y.png}`
23. `GET /v2/mapping/{s}/points`
24. `POST /v2/mapping/{s}/points`

### Summary: top-N
25. `GET /v2/summary/top/records/`
26. `POST /v2/summary/top/records/`
27. `GET /v2/summary/top/basic/`  (deprecated legacy records summary route)
28. `POST /v2/summary/top/basic/`
29. `GET /v2/summary/top/media/`
30. `POST /v2/summary/top/media/`

### Summary: counts
31. `GET /v2/summary/count/records/`
32. `POST /v2/summary/count/records/`
33. `GET /v2/summary/count/basic/`  (deprecated legacy records count route)
34. `POST /v2/summary/count/basic/`
35. `GET /v2/summary/count/media/`
36. `POST /v2/summary/count/media/`
37. `GET /v2/summary/count/recordsets/`
38. `POST /v2/summary/count/recordsets/`

### Summary: modified/date/stats
39. `GET /v2/summary/modified/records/`
40. `POST /v2/summary/modified/records/`
41. `GET /v2/summary/modified/media/`
42. `POST /v2/summary/modified/media/`
43. `GET /v2/summary/datehist`
44. `POST /v2/summary/datehist`
45. `GET /v2/summary/stats/{t}`
46. `POST /v2/summary/stats/{t}`

### Metadata
47. `GET /v2/meta/fields/{type}`
48. `POST /v2/meta/fields/{type}`

## Important usage notes
- `/v2/search/records/` is the preferred records endpoint; `/v2/search/` is still documented but marked deprecated.
- `/v2/search/media/` is the preferred media endpoint; `/v2/media/` is still documented but marked deprecated.
- `/v2/summary/top/records/` is the preferred records top-N route; `/v2/summary/top/basic/` is the deprecated predecessor.
- `/v2/summary/count/records/` is the preferred records count route; `/v2/summary/count/basic/` is the deprecated predecessor.
- Map creation returns a short code `{s}` and tile URLs that power the follow-on mapping routes.
- `top_fields` can be nested to build hierarchical top-N summaries.
- `datehist` supports raw dates and Elasticsearch-style date math strings for min/max bounds.
- `stats/{t}` returns different data depending on whether `t` is `api`, `digest`, or `search`.

## fireROUTE normalization notes
- Normalize on the versioned public base URL `https://search.idigbio.org/v2`.
- Preserve the provider-native query parameter names exactly, especially `rq`, `mq`, `rsq`, `top_fields`, and the camelCase/snake_case date parameter aliases.
- Treat deprecated legacy paths as compatibility aliases, not the preferred canonical routes.
- Keep mapping tile formats distinct from JSON search endpoints because their response media types differ materially.
