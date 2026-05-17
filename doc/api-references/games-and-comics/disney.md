# Disney

## Overview
- Provider: Disney API
- Category: Games & Comics
- Official docs: `https://disneyapi.dev/`
- REST base URL: `https://api.disneyapi.dev`
- GraphQL endpoint: `https://api.disneyapi.dev/graphql`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: page-based on the character collection route
- Rate limits: no numeric rate limit documented on the official docs page
- Access note: the documentation explicitly says the API is GET-only and requires no authentication

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/character` | optional `page`, `pageSize` | Returns paginated character results. |
| GET | `/character/:id` | required `id` path parameter | Returns one character record. |
| GET | `/character` | filter query string documented generally as `queryParams`; explicit example shown for `name` | Filter/search form of the same character collection route. |
| GET | `/graphql` | GraphQL query parameters/transport not expanded on the docs page; GraphQL queries are documented for the endpoint | GraphQL surface published alongside the REST API. |

## REST response notes
- The docs show list responses shaped as:
  - `info.totalPages`
  - `info.count`
  - `info.previousPage`
  - `info.nextPage`
  - `data[]`
- Character objects in the examples include fields such as:
  - `_id`
  - `films`
  - `shortFilms`
  - `tvShows`
  - `videoGames`
  - `parkAttractions`
  - `allies`
  - `enemies`
  - `sourceUrl`
  - `name`
  - `imageUrl`
  - `createdAt`
  - `updatedAt`
  - `url`
  - `__v`
- Single-character responses return `info.count` plus a single `data` object.

## Pagination
- The docs explicitly document:
  - `page` — page number, default `1`
  - `pageSize` — items per page, default `50`

## Filtering notes
- The documentation exposes a general filter route pattern `https://api.disneyapi.dev/character?queryParams`.
- The visible example confirms `name` as a REST query parameter via `https://api.disneyapi.dev/character?name=Mickey%20Mouse`.
- The same docs page does not visibly enumerate the full REST query-parameter list in the reviewed section, so only generic query filtering and the `name` example are directly confirmed here.

## GraphQL notes
- The docs publish the GraphQL endpoint as `https://api.disneyapi.dev/graphql`.
- Visible documented query surface:
  - `characters(page: Int, pagSize: Int, filter: CharacterFilterInput)`
- Visible `CharacterFilterInput` fields:
  - `id`
  - `name`
  - `films`
  - `shortFilms`
  - `tvShows`
  - `videoGames`
  - `alignment`
  - `parkAttractions`
  - `allies`
  - `enemies`

## Schema notes
- The documentation states the API provides access to a database of 9820 Disney characters.
- The visible schema table lists these character fields and types:
  - `_id` — Integer
  - `url` — String
  - `name` — String
  - `sourceUrl` — String
  - `films` — `[String]`
  - `shortFilms` — `[String]`
  - `tvShows` — `[String]`
  - `videoGames` — `[String]`
  - `alignment` — String
  - `parkAttractions` — `[String]`
  - `allies` — `[String]`
  - `enemies` — `[String]`

## Error handling
- The official docs page reviewed here does not publish a dedicated error schema or a list of HTTP error codes.
- Consumers should expect standard HTTP failures for invalid character IDs or unsupported filter combinations.

## Integration notes for fireROUTE
- Model `/character` as a single route family with list, pagination, and filter use-cases.
- Preserve GraphQL as a separate endpoint rather than trying to flatten it into REST semantics.
- Keep authentication disabled unless the official docs change, because the docs explicitly say no auth is required.

## Sources inspected
- `https://disneyapi.dev/`
- `https://disneyapi.dev/docs`
