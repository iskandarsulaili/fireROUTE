# SpaceX

## Provider metadata
- Category: `Science & Math`
- Provider slug: `spacex`
- Description: `Company, vehicle, launchpad, launch, roadster, Starlink, and related SpaceX data`
- Official docs/pages used:
  - `https://github.com/r-spacex/SpaceX-API`
  - `https://raw.githubusercontent.com/r-spacex/SpaceX-API/master/docs/README.md`
  - `https://raw.githubusercontent.com/r-spacex/SpaceX-API/master/docs/queries.md`
  - reviewed route docs under the official `docs/` tree, including representative route pages such as:
    - `docs/launches/v5/latest.md`
    - `docs/launches/v5/query.md`
    - `docs/capsules/v4/query.md`
    - `docs/starlink/v4/query.md`
    - `docs/roadster/v4/get.md`
    - `docs/roadster/v4/query.md`
  - reviewed official GitHub docs-tree route inventory pages for `docs/roadster/v4` and related resource folders to confirm the full documented route set
- Current public API base URL: `https://api.spacexdata.com`
- Versioning model: routes are individually versioned; the docs also mention `https://api.spacexdata.com/latest` as a moving alias that may introduce breaking changes
- Auth model:
  - reviewed public read routes are documented as unauthenticated
  - the official docs say destructive routes (`create`, `update`, `delete`) require header `spacex-key`
  - protected routes return `401` without a valid key
- Methods officially documented on the reviewed pages: `GET`, `POST`, `DELETE`
- Response formats officially documented on the reviewed pages: `JSON`
- Rate limits: no numeric rate-limit policy was published on the reviewed official docs
- Manually confirmed route count: `46`

## API shape and behavior
- The provider docs expose a large read API organized mostly around `v4` resources.
- Launches are documented in both `v4` and `v5`.
- Collection discovery is a mix of plain `GET` routes and `POST /query` routes.
- The shared `/query` pattern accepts Mongo-style filters and pagination options.
- The docs also document response caching behavior, but not a hard request-rate quota.

## Shared query and pagination model
- All standard `/query` routes use a JSON body of the form:
  - `query` - any valid MongoDB `find()` query
  - `options` - pagination/output controls
- Common `options` fields documented in the official query guide:
  - `select`
  - `sort`
  - `offset`
  - `page`
  - `limit`
  - `pagination`
  - `populate`
- Standard paginated `/query` responses include:
  - `docs`
  - `totalDocs`
  - `offset`
  - `limit`
  - `totalPages`
  - `page`
  - `pagingCounter`
  - `hasPrevPage`
  - `hasNextPage`
  - `prevPage`
  - `nextPage`
- The official examples also show `populate` replacing referenced IDs with linked documents.
- Special case: `POST /v4/roadster/query` is documented as non-paginated and only supports `options.select`.

## Cache and operational notes
- The docs say Redis caching is used for all `GET` requests and for `POST` requests on `/query` endpoints.
- Standard cache durations published in the docs:
  - launches: `20 seconds`
  - capsules, cores, launchpads, landpads, crew, ships, payloads: `5 minutes`
  - dragons, rockets: `24 hours`
- No numeric request-rate throttle is documented on the reviewed pages.

## Error notes
- Reviewed `/query` docs publish `400 Bad Request` for invalid Mongoose queries.
- The top-level docs publish `401` for protected routes used without a valid `spacex-key`.
- The reviewed materials do not publish a broader structured error schema.

## Canonical endpoints

### Cache/admin
1. `DELETE /admin/cache`

### Capsules (`v4`)
2. `GET /v4/capsules`
3. `GET /v4/capsules/:id`
4. `POST /v4/capsules/query`

### Company (`v4`)
5. `GET /v4/company`

### Cores (`v4`)
6. `GET /v4/cores`
7. `GET /v4/cores/:id`
8. `POST /v4/cores/query`

### Crew (`v4`)
9. `GET /v4/crew`
10. `GET /v4/crew/:id`
11. `POST /v4/crew/query`

### Dragons (`v4`)
12. `GET /v4/dragons`
13. `GET /v4/dragons/:id`

### History (`v4`)
14. `GET /v4/history`
15. `GET /v4/history/:id`

### Landpads (`v4`)
16. `GET /v4/landpads`
17. `GET /v4/landpads/:id`

### Launchpads (`v4`)
18. `GET /v4/launchpads`
19. `GET /v4/launchpads/:id`

### Payloads (`v4`)
20. `GET /v4/payloads`
21. `GET /v4/payloads/:id`
22. `POST /v4/payloads/query`

### Roadster (`v4`)
23. `GET /v4/roadster`
24. `POST /v4/roadster/query`

### Rockets (`v4`)
25. `GET /v4/rockets`
26. `GET /v4/rockets/:id`

### Ships (`v4`)
27. `GET /v4/ships`
28. `GET /v4/ships/:id`
29. `POST /v4/ships/query`

### Starlink (`v4`)
30. `GET /v4/starlink`
31. `GET /v4/starlink/:id`
32. `POST /v4/starlink/query`

### Launches (`v4`)
33. `GET /v4/launches`
34. `GET /v4/launches/:id`
35. `GET /v4/launches/latest`
36. `GET /v4/launches/next`
37. `GET /v4/launches/past`
38. `GET /v4/launches/upcoming`
39. `POST /v4/launches/query`

### Launches (`v5`)
40. `GET /v5/launches`
41. `GET /v5/launches/:id`
42. `GET /v5/launches/latest`
43. `GET /v5/launches/next`
44. `GET /v5/launches/past`
45. `GET /v5/launches/upcoming`
46. `POST /v5/launches/query`

## Response notes
- JSON is the documented response format for all reviewed routes.
- Collection `GET` routes return arrays or collection payloads depending on the resource.
- `/query` routes return paginated wrapper objects with `docs` and pagination metadata.
- Example launch objects include nested structures such as `fairings`, `links`, `cores`, and arrays of referenced IDs for related resources like `payloads`, `capsules`, `ships`, and `crew`.
- Starlink records include nested `spaceTrack` orbital/TLE metadata.
- Roadster returns a single object describing the Tesla Roadster's orbital state and associated metadata.

## Important usage notes
- The docs explicitly recommend avoiding the moving `/latest` base alias unless clients are willing to accept breaking changes.
- Only launches are documented in both `v4` and `v5` on the reviewed pages; the other documented resource families remain under `v4` in the inspected docs tree.
- `/query` routes are the official way to do advanced filtering, sorting, field selection, and population of linked documents.
- `POST /v4/roadster/query` is unusual: it is not a normal paginated collection query and is effectively a field-selection wrapper around the singleton roadster document.
- The main docs say destructive routes exist and require `spacex-key`, but the reviewed public route inventory is dominated by read-only data access plus the documented cache-clear admin route.

## fireROUTE normalization notes
- Normalize on `https://api.spacexdata.com`.
- Preserve route-version differences; do not collapse `v4` and `v5` launches into a single synthetic path.
- Preserve `/query` as body-driven POST search surfaces distinct from plain collection GET routes.
- Surface the documented auth nuance accurately: public read routes are open, while protected destructive/admin behavior uses `spacex-key` and can return `401`.
