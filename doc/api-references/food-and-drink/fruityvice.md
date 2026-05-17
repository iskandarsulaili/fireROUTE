# Fruityvice

Official pages manually reviewed:
- https://www.fruityvice.com/api/fruit/all
- https://www.fruityvice.com/

## Overview
- Public API base URL: `https://www.fruityvice.com/api/fruit`
- Authentication: none mentioned
- Response format: JSON

Manual route count confirmed from the official site/docs review: **3**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/all` | List all fruits |
| GET | `/{id}` | Fetch one fruit by numeric ID |
| GET | `/{name}` | Fetch one fruit by name |

## Parameters
- `id` is a numeric fruit identifier
- `name` is a fruit name slug/string

## Response notes
Observed records from the official API response include:
- `name`
- `id`
- `family`
- `order`
- `genus`
- `nutritions.calories`
- `nutritions.fat`
- `nutritions.sugar`
- `nutritions.carbohydrates`
- `nutritions.protein`

## Rate limits
No numeric rate limit is published on the reviewed site.

## Pagination
No pagination scheme is documented for `/all` on the reviewed site.

## Errors
No formal error schema is documented on the reviewed site.

## fireROUTE notes
- `/all` is the obvious bootstrap route for local caching or lookups.
- The provider appears to support both numeric-ID and name-based item lookup patterns.
