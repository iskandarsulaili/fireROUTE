# AnimeFacts

## Overview
- Provider: anime-facts-rest-api
- Category: Anime
- Official docs: `https://chandan-02.github.io/anime-facts-rest-api/`
- Documented base URL: `https://anime-facts-rest-api.herokuapp.com/api/v1`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official docs page
- Availability note: the docs warn that the project was hosted on a free Heroku dyno and first requests could be delayed

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | Returns the list of available anime titles with IDs and image URLs. |
| GET | `/:anime_name` | required `anime_name` path parameter | Returns all facts for a specific anime. |
| GET | `/:anime_name/:fact_id` | required `anime_name` and `fact_id` path parameters | Returns one specific fact for a specific anime. |

## Response format
- The home route example returns:
  - `success`
  - `data[]`
  - per-item fields such as `anime_id`, `anime_name`, and `anime_img`
- The anime-facts route example returns:
  - `success`
  - `total_facts`
  - `anime_img`
  - `data[]` with `fact_id` and `fact`
- The specific-fact route example returns:
  - `success`
  - `data.fact_id`
  - `data.fact`

## Parameter notes
- `anime_name` must come from the available options exposed by the home route.
- `fact_id` is selected from the fact IDs returned for a given anime.

## Error handling
- The official docs do not publish a formal error schema or list of HTTP status codes.
- Consumers should expect standard HTTP failures when an unknown anime name or invalid fact ID is supplied.

## Integration notes for fireROUTE
- Keep the provider versioned under `/api/v1` exactly as documented.
- Surface the root route first because it is the discovery mechanism for valid `anime_name` values.
- Preserve the provider's simple JSON shapes instead of over-normalizing nested fact responses.

## Sources inspected
- `https://chandan-02.github.io/anime-facts-rest-api/`
