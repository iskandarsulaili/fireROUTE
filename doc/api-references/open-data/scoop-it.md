# Scoop.it

## Provider metadata
- Category: `Open Data`
- Provider slug: `scoop-it`
- Official docs/pages used:
  - `https://www.scoop.it/dev`
  - `https://www.scoop.it/dev/api/1/intro`
  - `https://www.scoop.it/dev/api/1/urls`
- Canonical API base URL: `https://www.scoop.it`
- Auth model:
  - official docs support `OAuth 2.0` bearer tokens
  - official docs also still describe `OAuth 1.0a` as deprecated
  - anonymous mode is allowed for part of the read surface
  - every data-modifying `POST` request must be performed in authenticated mode
- Response format notes:
  - successful API responses are `application/json`
  - failed OAuth authentication returns `application/x-www-form-urlencoded`
  - request and response encoding is documented as UTF-8
- Rate-limit notes: no numeric public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `24`

## Canonical endpoints
1. `GET /api/1/profile`
2. `GET /api/1/topic`
3. `POST /api/1/topic`
4. `GET /api/1/post`
5. `POST /api/1/post`
6. `GET /api/1/test`
7. `GET /api/1/notifications`
8. `GET /api/1/compilation`
9. `GET /api/1/search`
10. `GET /api/1/resolver`
11. `GET /api/1/interest`
12. `GET /api/1/interest-list`
13. `GET /api/1/sse`
14. `POST /api/1/sse`
15. `GET /api/1/se`
16. `POST /api/1/se`
17. `GET /api/1/se/{engine_id}/sources`
18. `DELETE /api/1/se/{engine_id}/sources/{source_id}`
19. `POST /api/1/se/{engine_id}/sources/{source_id}`
20. `PUT /api/1/se/{engine_id}/sources`
21. `GET /api/1/sugs`
22. `POST /api/1/sugs`
23. `GET /api/1/recipients-list`
24. `POST /api/1/recipients-list`

## Route-group notes
### Profile, topic, and post routes
- `GET /api/1/profile` returns a user profile and supports filters such as `id`, `shortName`, `curated`, `curable`, `ncomments`, and several booleans controlling nested topic/tag/stats inclusion.
- `GET /api/1/topic` supports `id` or `urlName`, plus topic paging/filter controls such as `curated`, `page`, `curable`, `curablePage`, `order`, `tag`, `q`, `since`, `to`, `ncomments`, and `showScheduled`.
- `POST /api/1/topic` is an action endpoint with `edit`, `reorder`, `follow`, `unfollow`, and `markread` modes.
- `GET /api/1/post` retrieves one post with `id` and optional `ncomments`.
- `POST /api/1/post` is a large action endpoint covering `prepare`, `create`, `comment`, `thank`, `accept`, `forward`, `refuse`, `delete`, `edit`, `pin`, `rescoop`, and `share`.

### Diagnostic and feed/search routes
- `GET /api/1/test` verifies credentials and returns the connected user or `null` in anonymous mode.
- `GET /api/1/notifications` supports `since`.
- `GET /api/1/compilation` supports `sort`, `topicIds`, `topicGroupId`, `since`, `count`, `page`, `ncomments`, `getTags`, `getCreator`, and related booleans.
- `GET /api/1/search` supports `type`, `query`, `count`, `page`, `lang`, `topicId`, and several flags for topic/post metadata inclusion.
- `GET /api/1/resolver` resolves `User` or `Topic` objects from `shortName`.

### Interest and suggestion-engine routes
- `GET /api/1/interest` supports lookup by `id` or `shortName`+`lang`, plus optional paging booleans such as `getTopics`, `getUsers`, `getPosts`, `page`, `count`, and `curated`.
- `GET /api/1/interest-list` returns interests by `lang`.
- `GET|POST /api/1/sse` reads or updates Smart Source Engine configuration with `topic`, `active`, and `keyword` values.
- `GET|POST /api/1/se` lists or updates suggestion engines; the update route documents parameters such as `id`, `sorter`, `maxSuggestionAge`, `keywords`, `includedDomains`, `excludedDomains`, `containsAllKeyword`, `containsAnyKeyword`, and `doesNotContainKeywords`.
- `GET /api/1/se/{engine_id}/sources`, `PUT /api/1/se/{engine_id}/sources`, `POST /api/1/se/{engine_id}/sources/{source_id}`, and `DELETE /api/1/se/{engine_id}/sources/{source_id}` manage user-controlled suggestion-engine sources.
- `GET|POST /api/1/sugs` retrieves or refreshes suggestion lists with parameters such as `id`, `savedSearchId`, `count`, and `sugId`.

### Recipient-list routes
- `GET /api/1/recipients-list` lists accessible recipient lists.
- `POST /api/1/recipients-list` subscribes/unsubscribes email recipients using `id`, `email`, and `action` (`subscribe` or `unsubscribe`).

## Pagination and parameter notes
- Reviewed docs repeatedly use zero-based page numbering (`page` defaults to `0`).
- Count-like parameters vary by route: `count`, `curated`, `curable`, `ncomments`, and route-specific paging controls.
- Several routes use boolean include-flags such as `getTags`, `getCreator`, `getStats`, `getTopics`, `getUsers`, and `getPosts` to control nested payload size.
- The post-create/share flow includes structured values such as `shareOn` JSON arrays and scheduling timestamps.

## Error and transport notes
- Official intro page documents these status meanings:
  - `200` successful operation
  - `400` bad request / invalid or missing parameters
  - `401` operation not allowed in anonymous mode
  - `403` forbidden for current user
  - `404` resource not found
  - `405` method not allowed
  - `503` service unavailable
- The docs explicitly recommend sending `Accept-Encoding: gzip,deflate`.
- OAuth authentication failures return `application/x-www-form-urlencoded`; authenticated API responses otherwise return `application/json` except provider-side `502` / `503` cases.

## Important usage notes
- Scoop.it’s API is action-heavy: several resource paths are multi-action RPC-style endpoints rather than one-method-per-action REST resources.
- Anonymous mode covers much of the read surface, but write operations are explicitly authenticated-only.
- OAuth 1.0a remains documented only as deprecated compatibility guidance; new integrations should prefer OAuth 2.0 bearer auth.
- The docs do not publish one global numeric quota or throttle ceiling.

## fireROUTE normalization notes
- Use `https://www.scoop.it` as the canonical upstream base and preserve the `/api/1/...` prefix.
- Model `POST /api/1/topic` and `POST /api/1/post` as action endpoints keyed by the required `action` parameter.
- Preserve provider-native parameter names and zero-based paging semantics.
- Expect mixed anonymous/authenticated behavior depending on route and operation type.