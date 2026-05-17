# TheMealDB

Official page manually reviewed:
- https://www.themealdb.com/api.php

## Overview
- Public API base URL for documented examples: `https://www.themealdb.com/api/json/v1/1`
- Authentication: the docs provide a developer test key `1`; the page says public app-store releases should use a supporter key
- Response format: JSON

Manual route count confirmed from the reviewed homepage: **14**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/search.php?s={name}` | Search meals by name |
| GET | `/search.php?f={letter}` | List meals by first letter |
| GET | `/lookup.php?i={id}` | Lookup full meal details by meal ID |
| GET | `/random.php` | Get a random meal |
| GET | `/randomselection.php` | Get 10 random meals (premium only; shown under `/api/json/v2/1/`) |
| GET | `/categories.php` | List meal categories |
| GET | `/latest.php` | List latest meals (premium only; shown under `/api/json/v2/1/`) |
| GET | `/list.php?c=list` | List categories |
| GET | `/list.php?a=list` | List areas |
| GET | `/list.php?i=list` | List ingredients |
| GET | `/filter.php?i={ingredient}` | Filter by ingredient |
| GET | `/filter.php?i={ingredient1},{ingredient2},...` | Filter by multiple ingredients (premium only; shown under `/api/json/v2/1/`) |
| GET | `/filter.php?c={category}` | Filter by category |
| GET | `/filter.php?a={area}` | Filter by area |

## Parameters and auth notes
- The docs explicitly say the developer test key is `1`
- Premium routes are labeled on the homepage
- Example values shown include `Arrabiata`, `a`, `52772`, `chicken_breast`, `Seafood`, and `Canadian`

## Response notes
- Search, lookup, random, and filter endpoints return JSON meal records or summaries
- The page also documents static image URL conventions for meal thumbnails and ingredient thumbnails

## Rate limits
No numeric rate limit is published on the reviewed homepage.

## Pagination
No pagination scheme is documented on the reviewed homepage.

## Important usage notes
- The homepage distinguishes v1 public/test routes from premium v2 routes for some features.
- Multi-ingredient filtering, latest meals, and 10-random-meal selection are premium-only.

## fireROUTE notes
- Keep the API-key-in-path pattern intact.
- Treat `search.php`, `lookup.php`, `list.php`, `categories.php`, and `filter.php` as the main route families.
