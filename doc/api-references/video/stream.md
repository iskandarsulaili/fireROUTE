# Stream

## Provider metadata
- Category: `Video`
- Provider slug: `stream`
- Official pages manually reviewed:
  - `https://api.stream.cz/graphiql`
  - `https://api.stream.cz/`
- Main confirmed endpoint URL: `https://api.stream.cz/graphiql`
- Auth model confirmed in this pass: no API key or bearer token was required for schema introspection and public read queries; user/admin fields exist but return `null` when unauthenticated
- Request/response format confirmed in this pass: GraphQL over HTTP with JSON `data` and `errors` payloads
- Manually confirmed route count: `1`

## Authentication
- The reviewed GraphiQL page exposes the schema and accepted public read queries without an API key.
- An unauthenticated query for `{ user { __typename } adminUser { __typename } }` returned `{"data":{"user":null,"adminUser":null}}`.
- The schema description for `adminUser` explicitly says admin access requires being logged in via `muj.stream.cz`.
- The reviewed pages did not publish a standalone authentication guide, so cookie/session details for privileged operations remain undocumented in this pass.

## Canonical endpoint

### 1) Execute a GraphQL operation
- Methods confirmed: `GET`, `POST`
- URL: `https://api.stream.cz/graphiql`
- Purpose: execute GraphQL queries and mutations against Stream.cz's published schema.

Confirmed request shapes:
- `GET /graphiql?query=...` works and returns JSON.
- `POST /graphiql` with `Content-Type: application/json` and a body such as `{"query":"{ __schema { queryType { name } } }"}` works and returns JSON.
- `POST /graphiql` with JSON `variables` was also confirmed with `query($first:Int){ allTags(first:$first){ __typename } }` plus `{"first":1}`.

Schema-driven parameters confirmed from the official GraphiQL page:
- Transport-level parameters confirmed directly:
  - `query` - GraphQL document to execute
  - `variables` - JSON variables object for parameterized operations
- Public query-root field examples confirmed by introspection:
  - `allTags(categories, mediaTypes, before, after, first, last, offset)`
  - `tag(id, urlName, category, episodesLimit, episodesOffset, originTagEpisodeLimit)`
  - `episode(id, vpId, ccid, urlName, recommendedLimit, originTagEpisodeLimit)`
  - `playout(id, timeFrom, timeTo, cutTvAds)`
  - `playlist(id, limit, offset)`
  - `playlists(limit, offset, episodeLimit, episodeOffset)`
  - `searchTag(query, episodeLimit, originalTagEpisodeLimit)`
  - `searchEpisode(query, originalTagEpisodeLimit)`
  - `promo(limit)`
  - `tvMenuItems(main, before, after, first, last)`
  - `tvSubmenus(before, after, first, last)`
- Mutation-root field examples confirmed by introspection:
  - `addFavourite(tagId)`
  - `addWatchLater(episodeId)`
  - `deleteWatchLater(episodeId)`
  - `deleteFavourite(tagId)`
  - `deleteContinueWatching(episodeId)`
  - `deleteVideoHistory(episodeId)`
  - `createEpisodeDraft(input)`
  - `editEpisodeDraft(id, input)`
  - `createTagSeries(input)`
  - `deleteMedia(id)`

## Pagination
- Pagination is schema-driven rather than REST-style.
- Cursor-style arguments are published on several connection queries, including `before`, `after`, `first`, and `last`.
- Offset-style pagination is also present on some fields, including `offset`, `limit`, `episodeOffset`, and `episodeLimit`.
- From the reviewed schema, `allTags` combines cursor arguments with `offset`, while `tvMenuItems` and `tvSubmenus` expose cursor-style arguments only.

## Rate limits
- The reviewed GraphiQL page and same-host root page do not publish numeric rate limits or quota headers.

## Errors and format notes
- `GET https://api.stream.cz/graphiql` without a GraphQL query returns JSON containing `{"errors":[{"message":"Must provide query string."}]}`.
- An invalid field such as `{ nope }` returns HTTP `400` with a GraphQL validation error like `Cannot query field "nope" on type "Query"`.
- Successful requests reviewed in this pass returned JSON with a `data` object, for example `{"data":{"allTags":{"__typename":"TagConnection"}}}`.
- The same-host root page `https://api.stream.cz/` returns a standard `404 Not Found` HTML page; the working API surface is the `/graphiql` endpoint.

## Important usage notes
- This provider should be treated as a single GraphQL endpoint rather than expanded into synthetic REST paths.
- The reviewed schema currently exposes `37` query root fields and `29` mutation root fields through introspection.
- Public content reads worked unauthenticated in this pass, but user-specific and admin-specific functionality appears session-bound.
- fireROUTE should preserve raw GraphQL query capability for this provider instead of trying to freeze the full schema into a small fixed REST mapping.
