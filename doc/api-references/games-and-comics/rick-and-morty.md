# Rick and Morty

## Overview
- Provider: The Rick and Morty API
- Category: Games & Comics
- Official docs: `https://rickandmortyapi.com/`
- REST base URL: `https://rickandmortyapi.com/api`
- GraphQL endpoint: `https://rickandmortyapi.com/graphql`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: page-based with an `info` object in collection responses
- Rate limits: no numeric rate limit documented on the official docs page
- Request model: the docs explicitly say all REST requests are `GET`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | API index returning the available top-level resources. |
| GET | `/character` | optional `page` | Returns all characters in paginated form. |
| GET | `/character/:id` | required `id` path parameter | Returns one character. |
| GET | `/character/:ids` | comma-separated character IDs in the path | Returns multiple characters by ID list, e.g. `1,183`. |
| GET | `/character/` | optional filter params `name`, `status`, `species`, `type`, `gender`, plus `page` for paginated filter results | Filtered character search on the collection route. |
| GET | `/location` | optional `page` | Returns all locations in paginated form. |
| GET | `/location/:id` | required `id` path parameter | Returns one location. |
| GET | `/location/:ids` | comma-separated location IDs in the path | Returns multiple locations by ID list. |
| GET | `/location/` | optional filter params `name`, `type`, `dimension`, plus `page` | Filtered location search on the collection route. |
| GET | `/episode` | optional `page` | Returns all episodes in paginated form. |
| GET | `/episode/:id` | required `id` path parameter | Returns one episode. |
| GET | `/episode/:ids` | comma-separated episode IDs in the path | Returns multiple episodes by ID list. |
| GET | `/episode/` | optional filter params `name`, `episode`, plus `page` | Filtered episode search on the collection route. |
| GET | `/graphql` | GraphQL query endpoint published in the docs | GraphQL alternative to the REST surface. |

## Top-level index
- The docs show `GET https://rickandmortyapi.com/api` returning:
  ```json
  {
    "characters": "https://rickandmortyapi.com/api/character",
    "locations": "https://rickandmortyapi.com/api/location",
    "episodes": "https://rickandmortyapi.com/api/episode"
  }
  ```

## Pagination
- The docs state the API automatically paginates responses and returns up to 20 documents per page.
- Collection responses include an `info` object with:
  - `count`
  - `pages`
  - `next`
  - `prev`
- Collection payloads return results in a `results` array.

## Character resource notes
- Character filters confirmed from the docs:
  - `name`
  - `status`
  - `species`
  - `type`
  - `gender`
- Example filtered request shown by the docs: `GET https://rickandmortyapi.com/api/character/?name=rick&status=alive`
- Example character objects include:
  - `id`
  - `name`
  - `status`
  - `species`
  - `type`
  - `gender`
  - `origin`
  - `location`
  - `image`
  - `episode`
  - `url`
  - `created`

## Location resource notes
- Location filters confirmed from the docs:
  - `name`
  - `type`
  - `dimension`
- Location schema sections are published on the docs page alongside single, multiple, and filtered retrieval patterns.

## Episode resource notes
- Episode filters confirmed from the docs:
  - `name`
  - `episode`
- Episode schema sections are published on the docs page alongside single, multiple, and filtered retrieval patterns.

## GraphQL notes
- The docs publish `https://rickandmortyapi.com/graphql` and show example GraphQL queries that access:
  - `characters(page:, filter:)`
  - `location(id:)`
  - `episodesByIds(ids:)`
- The documentation presents GraphQL as a first-class alternative to the REST API rather than a separate product.

## Error handling
- The reviewed docs page does not publish a dedicated error-schema section.
- Consumers should expect standard HTTP failures for unknown IDs or filter combinations that produce no results.

## Integration notes for fireROUTE
- Keep REST and GraphQL as separate route families.
- Preserve comma-separated multi-ID paths because the official docs treat them as distinct retrieval patterns.
- Model pagination consistently across `character`, `location`, and `episode` because the docs use the same `info` envelope pattern.

## Sources inspected
- `https://rickandmortyapi.com/`
- `https://rickandmortyapi.com/documentation`
