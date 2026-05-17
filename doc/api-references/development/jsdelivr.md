# jsDelivr

## Provider metadata
- Category: `Development`
- Provider slug: `jsdelivr`
- Docs used manually:
  - `https://github.com/jsdelivr/data.jsdelivr.com`
  - `https://www.jsdelivr.com/docs/data.jsdelivr.com`
  - official OpenAPI spec linked from the docs/README: `https://data.jsdelivr.com/v1/spec.yaml`
- Confirmed API base URL: `https://data.jsdelivr.com`
- Primary media type: JSON
- Authentication: none (`Not Supported` is shown on the reviewed route pages/spec)
- Manually confirmed routes in this pass: `46`

## Authentication
- The reviewed docs and official OpenAPI spec do not define an auth scheme.
- The public docs explicitly present the API as free to use.
- The reviewed docs ask high-volume users to include a descriptive `User-Agent` and to contact jsDelivr before sustaining `100+ RPM` for long periods.

## Common request/response conventions
- Base URL: `https://data.jsdelivr.com`
- Versioned route prefix: `/v1`
- The API returns JSON responses on the reviewed routes.
- The GitHub README and official docs both state:
  - the API is free to use
  - there are no formal rate limits
  - usage statistics are delayed by about `48 hours`
  - data older than one year may not always be available
- The official README also documents size restrictions:
  - GitHub packages larger than `50 MB` are not supported for file-list metadata
  - npm packages larger than `100 MB` are not supported for file-list metadata
  - attempting to list files for oversized packages can return `403`
- The official spec defines reusable pagination/query parameters including `page`, `limit`, `period`, `periodStatic`, `by`, `type`, `country`, `continent`, `style`, and `type` for badges.
- Paginated routes document RFC 8288 `Link` headers so callers can follow pagination without manually constructing the next `page` value.

## Manually confirmed endpoint inventory
All routes below were confirmed from the official docs/OpenAPI spec in this pass. Every reviewed path uses `GET`.

### Package metadata: GitHub
1. `/v1/packages/gh/{user}/{repo}`
2. `/v1/packages/gh/{user}/{repo}/resolved`
3. `/v1/packages/gh/{user}/{repo}@{version}`

### Package metadata: npm
4. `/v1/packages/npm/{package}`
5. `/v1/packages/npm/@{scope}/{package}`
6. `/v1/packages/npm/{package}/resolved`
7. `/v1/packages/npm/@{scope}/{package}/resolved`
8. `/v1/packages/npm/{package}@{version}`
9. `/v1/packages/npm/@{scope}/{package}@{version}`
10. `/v1/packages/npm/{package}@{version}/entrypoints`
11. `/v1/packages/npm/@{scope}/{package}@{version}/entrypoints`

### Stats: global/package indexes
12. `/v1/stats/periods`
13. `/v1/stats/packages`

### Stats: GitHub packages
14. `/v1/stats/packages/gh/{user}/{repo}`
15. `/v1/stats/packages/gh/{user}/{repo}/versions`
16. `/v1/stats/packages/gh/{user}/{repo}@{version}`
17. `/v1/stats/packages/gh/{user}/{repo}@{version}/files`
18. `/v1/stats/packages/gh/{user}/{repo}/badge`

### Stats: npm packages
19. `/v1/stats/packages/npm/{package}`
20. `/v1/stats/packages/npm/@{scope}/{package}`
21. `/v1/stats/packages/npm/{package}/versions`
22. `/v1/stats/packages/npm/@{scope}/{package}/versions`
23. `/v1/stats/packages/npm/{package}@{version}`
24. `/v1/stats/packages/npm/@{scope}/{package}@{version}`
25. `/v1/stats/packages/npm/{package}@{version}/files`
26. `/v1/stats/packages/npm/@{scope}/{package}@{version}/files`
27. `/v1/stats/packages/npm/{package}/badge`
28. `/v1/stats/packages/npm/@{scope}/{package}/badge`

### Stats: network
29. `/v1/stats/network`
30. `/v1/stats/network/content`
31. `/v1/stats/network/countries`

### Stats: browsers
32. `/v1/stats/browsers`
33. `/v1/stats/browsers/versions`
34. `/v1/stats/browsers/{name}/countries`
35. `/v1/stats/browsers/{name}/platforms`
36. `/v1/stats/browsers/{name}/versions`
37. `/v1/stats/browsers/{name}/versions/{version}/countries`

### Stats: platforms
38. `/v1/stats/platforms`
39. `/v1/stats/platforms/versions`
40. `/v1/stats/platforms/{name}/browsers`
41. `/v1/stats/platforms/{name}/countries`
42. `/v1/stats/platforms/{name}/versions`
43. `/v1/stats/platforms/{name}/versions/{version}/countries`

### Stats: proxies
44. `/v1/stats/proxies/{name}`
45. `/v1/stats/proxies/{name}/files`

### Lookup
46. `/v1/lookup/hash/{hash}`

## Key route details confirmed from the official docs/spec

### GitHub metadata routes
- `GET /v1/packages/gh/{user}/{repo}` lists repository versions and related links.
- `GET /v1/packages/gh/{user}/{repo}/resolved` accepts query parameter `specifier`, documented as a valid semver range or tag, defaulting to `latest`.
- `GET /v1/packages/gh/{user}/{repo}@{version}` returns version metadata and accepts query parameter `structure` with enum `tree|flat`.
- Path parameters:
  - `user` - GitHub username
  - `repo` - GitHub repository name
  - `version` - exact package version

### npm metadata routes
- npm routes are exposed in both unscoped and scoped forms.
- `GET /v1/packages/npm/{package}` and `GET /v1/packages/npm/@{scope}/{package}` list tags/versions.
- `GET .../resolved` uses the same `specifier` query parameter model as the GitHub resolver routes.
- `GET ...@{version}` returns version metadata and supports `structure=tree|flat`.
- `GET ...@{version}/entrypoints` returns version entry-point data.

### Stats routes
- `GET /v1/stats/periods` publishes what data exists for which time periods.
- Stats routes use official query parameters including:
  - `period` - floating periods such as `day`, `week`, `month`, `quarter`, `year`, plus date/date-range forms as documented in the spec
  - `periodStatic` - static periods such as `s-month`, `s-quarter`, `s-year`, plus documented date/date-range forms
  - `by` - sort field, enum `hits|bandwidth`
  - `type` - package-type filter, enum `gh|npm`
  - `limit` - integer `1..100`, default `100`
  - `page` - integer `1..100`, default `1`
- Country/continent filter parameters are also defined in the official spec for relevant stats endpoints.
- Badge routes define query params including:
  - `style`
  - `type` where the official spec documents `hits`, `rank`, and `type-rank`

### Lookup route
- `GET /v1/lookup/hash/{hash}` resolves file metadata from a file hash.
- The path parameter is `hash`.

## Pagination
- The official spec documents `page` and `limit` on the paginated stats/listing routes.
- `limit` defaults to `100` and has documented bounds `1..100`.
- `page` defaults to `1` and has documented bounds `1..100`.
- The official spec explicitly notes that paginated responses provide RFC 8288 `Link` headers.

## Rate limits
- The official docs/README say the API imposes no formal rate limits.
- However, jsDelivr asks users to get in touch before making `100+ RPM` for longer periods.
- I documented that request literally rather than converting it into a hard quota the docs do not state.

## Error handling
- The reviewed route pages/spec repeatedly document `404` for missing resources.
- Oversized file-list metadata requests can return `403` according to the README/spec restrictions.
- The docs are otherwise much stronger on endpoint schema and parameter documentation than on a centralized reusable JSON error-envelope description.

## Response format notes
- Metadata and stats routes return JSON objects/arrays.
- Metadata responses include links to related resources.
- Stats data are delayed relative to real time; the official docs say usage statistics are available with roughly a `48 hour` delay.

## Important usage notes
- There is deliberately no package-search endpoint; the official README directs users to the npm APIs for search.
- File-list metadata support is size-limited, and the limits differ between GitHub (`50 MB`) and npm (`100 MB`).
- Old stats may not always exist; the official README notes that data older than one year may be unavailable.
- High-volume consumers should send a useful `User-Agent` so jsDelivr can identify integrations.

## Verification notes
This file was manually rebuilt from the official jsDelivr docs site, the official repository README, and the linked official OpenAPI spec at `https://data.jsdelivr.com/v1/spec.yaml`.