# Studio Ghibli

## Overview
- Provider: Studio Ghibli API
- Category: Anime
- Official docs: `https://ghibliapi.vercel.app/`
- Official repo linked from docs: `https://github.com/deywersonp/ghibliapi`
- Base URL: `https://ghibliapi.vercel.app`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented; collection endpoints instead expose a `limit` query parameter
- Rate limits: no numeric rate limit is documented on the official docs page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/films` | optional `fields`, `limit` | Returns an array of film objects. |
| GET | `/films/{id}` | required `id`; optional `fields` | Returns a single film by UUID. |
| GET | `/people` | optional `fields`, `limit` | Returns an array of people / character records. |
| GET | `/people/{id}` | required `id`; optional `fields` | Returns a single person by UUID. |
| GET | `/locations` | optional `fields`, `limit` | Returns an array of locations. |
| GET | `/locations/{id}` | required `id`; optional `fields` | Returns a single location by UUID. |
| GET | `/species` | optional `fields`, `limit` | Returns an array of species records. |
| GET | `/species/{id}` | required `id`; optional `fields` | Returns a single species by UUID. |
| GET | `/vehicles` | optional `fields`, `limit` | Returns an array of vehicles. |
| GET | `/vehicles/{id}` | required `id`; optional `fields` | Returns a single vehicle by UUID. |

## Common parameter notes
- `fields` — optional comma-separated list of fields to include in the response.
- `limit` — list endpoints only; documented default is `50` and documented maximum is `250`.
- `id` — UUID-like path parameter used on each single-resource route.

## Resource schema notes
- Film objects shown in the docs include fields such as:
  - `id`
  - `title`
  - `original_title`
  - `original_title_romanised`
  - `description`
  - `director`
  - `producer`
  - `release_date`
  - `running_time`
  - `rt_score`
  - relation arrays like `people`, `species`, `locations`, `vehicles`
  - `url`
- People objects shown in the docs include:
  - `id`
  - `name`
  - `gender`
  - `age`
  - `eye_color`
  - `hair_color`
  - `films`
  - `species`
  - `url`
- Location objects shown in the docs include:
  - `id`
  - `name`
  - `climate`
  - `terrain`
  - `surface_water`
  - `residents`
  - `films`
  - `url`
- Species objects shown in the docs include:
  - `id`
  - `name`
  - `classification`
  - `eye_colors`
  - `hair_colors`
  - `people`
  - `films`
  - `url`
- Vehicle objects shown in the docs include:
  - `id`
  - `name`
  - `description`
  - `vehicle_class`
  - `length`
  - `pilot`
  - `films`
  - `url`

## Response and relationship notes
- Collection routes return JSON arrays.
- Single-item routes return a single JSON object.
- The docs show related resources as absolute URLs pointing back into the API, not embedded expanded objects.
- Example workflow documented by the provider:
  - query `/species?name=spirit`
  - follow linked `/people/{id}` URLs
  - combine the results client-side
- The workflow example demonstrates that relation traversal is part of the intended usage model even when relations are surfaced as links.

## Error handling
- The ReDoc page documents these response codes for each operation:
  - `200` — success
  - `400` — bad request
  - `404` — not found
- No richer error-body schema or rate-limit header contract is described on the public docs page.

## Usage notes
- The Public APIs index still points at the deprecated Heroku hostname, but the provider’s current official docs and examples are served from `ghibliapi.vercel.app`; use the Vercel base URL for current integrations.
- The docs’ example curl requests send `Content-Type: application/json` even for GET requests, but no request body is required.
- Because all primary resources are cross-linked by URL, fireROUTE adapters can preserve relation URLs directly or follow them lazily when a caller requests expanded data.

## Integration notes for fireROUTE
- Model this provider as five resource families, each with a list route plus a single-item-by-id route.
- Preserve the provider’s native link-based relationships rather than flattening them away.
- If downstream consumers request sparse projections, map them onto the documented `fields` query parameter.
- Do not assume offset/page pagination; only `limit` is documented.

## Sources inspected
- `https://ghibliapi.vercel.app/`
- `https://github.com/deywersonp/ghibliapi`
