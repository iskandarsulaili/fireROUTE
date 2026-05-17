# SuperHeroes

## Overview
- Provider: SuperHero API
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::8`
- Official docs inspected: `https://superheroapi.com/`
- Base URL: `https://superheroapi.com/api/{access-token}`
- Auth: access token embedded in the path after `/api/`; the official site says you need a GitHub account to generate the token
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `8`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/{character-id}` | path `character-id` | Returns the full character document with powerstats, biography, appearance, work, connections, and image. |
| GET | `/{character-id}/powerstats` | path `character-id` | Returns intelligence, strength, speed, durability, power, and combat fields. |
| GET | `/{character-id}/biography` | path `character-id` | Returns full name, alter egos, aliases, birthplace, first appearance, publisher, and alignment. |
| GET | `/{character-id}/appearance` | path `character-id` | Returns gender, race, height, weight, eye color, and hair color. |
| GET | `/{character-id}/work` | path `character-id` | Returns occupation and base. |
| GET | `/{character-id}/connections` | path `character-id` | Returns group affiliation and relatives. |
| GET | `/{character-id}/image` | path `character-id` | Returns the character image URL. |
| GET | `/search/{name}` | path `name` | Name search that returns matching character records and IDs. |

## Authentication and parameter notes
- The homepage explicitly says: `You need a GitHub account to get your access token.`
- All documented requests place the token in the path, not in a header or query parameter.
- Shared path parameters:
  - `{access-token}` — the generated personal API token
  - `{character-id}` — numeric hero ID from the official character list
  - `{name}` — search text used in `/search/{name}`
- The docs also expose a `CHARACTER IDS` page from the navbar for looking up IDs before calling the character routes.

## Response-format notes
- All reviewed examples are JSON objects.
- Successful responses include `"response": "success"`.
- `/{character-id}` returns a merged document with nested objects for:
  - `powerstats`
  - `biography`
  - `appearance`
  - `work`
  - `connections`
  - `image`
- `/search/{name}` returns:
  - `response`
  - `results-for`
  - `results` array of character objects
- The reviewed `/image` example returns a small JSON object with `response`, `id`, `name`, and `url`.

## Pagination, errors, and rate limits
- Pagination: none documented on the official page.
- Rate limits: no published numeric limit was found on the reviewed official docs page.
- Error handling:
  - the reviewed official page shows successful examples but does not publish a dedicated error-reference section
  - the `Getting a single card`-style error examples used by some other providers do not exist here; this provider's official page is success-example-focused

## Important usage notes
- The site describes the API as REST.
- All reviewed routes are documented as `GET`.
- The official docs page contains a typo in the combined full-character sample where the nested image URL is written as `httpss://...`; the dedicated `/image` endpoint sample uses the normal `https://...` form.
- The project positions itself as a unified superhero/villain dataset spanning comic universes.

## Integration notes for fireROUTE
- Model this provider as a small authenticated JSON API with token-in-path auth.
- Do not treat it as header-based bearer auth.
- Expect a fixed 8-route surface from the reviewed official docs page.
- Keep `/search/{name}` separate from `/{character-id}` lookups because the search route returns multi-result collections.

## Sources inspected
- `https://superheroapi.com/`
