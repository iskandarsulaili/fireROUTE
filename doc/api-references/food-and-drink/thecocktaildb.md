# TheCocktailDB

Official page manually reviewed:
- https://www.thecocktaildb.com/api.php

## Overview
- Public API base URL for documented examples: `https://www.thecocktaildb.com/api/json/v1/1`
- Authentication: the docs provide a public test key `1`; the page says production app-store use requires a premium key
- Response format: JSON

Manual route count confirmed from the reviewed homepage: **15**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/search.php?s={name}` | Search cocktails by name |
| GET | `/search.php?f={letter}` | List cocktails by first letter |
| GET | `/search.php?i={name}` | Search ingredients by name |
| GET | `/lookup.php?i={id}` | Lookup full cocktail details by cocktail ID |
| GET | `/lookup.php?iid={id}` | Lookup ingredient details by ingredient ID |
| GET | `/random.php` | Get one random cocktail |
| GET | `/randomselection.php` | Get 10 random cocktails (premium only) |
| GET | `/popular.php` | List popular cocktails (premium only) |
| GET | `/latest.php` | List latest cocktails (premium only) |
| GET | `/filter.php?i={ingredient}` | Filter cocktails by ingredient |
| GET | `/filter.php?i={ingredient1},{ingredient2},...` | Filter by multiple ingredients (premium only) |
| GET | `/filter.php?a={alcoholic}` | Filter by alcoholic/non-alcoholic status |
| GET | `/filter.php?c={category}` | Filter by category |
| GET | `/filter.php?g={glass}` | Filter by glass |
| GET | `/list.php?c=list|g=list|i=list|a=list` | List categories, glasses, ingredients, or alcoholic filters |

## Parameters and auth notes
- The docs explicitly say the developer test key is `1`
- Premium routes are labeled on the homepage
- Example values shown include `margarita`, `a`, `vodka`, `11007`, `552`, `Alcoholic`, `Ordinary_Drink`, and `Cocktail_glass`

## Response notes
- Search and lookup endpoints return JSON cocktail or ingredient records
- The site also documents image conventions for drink thumbnails and ingredient thumbnails

## Rate limits
No numeric request-per-minute limit is published on the reviewed page.

## Pagination
No pagination scheme is documented on the reviewed homepage.

## Important usage notes
- Public/basic use is free, but public app-store releases are directed to premium access.
- Multi-ingredient filtering, popular, latest, and random-selection are explicitly premium features.
- Some endpoints return cocktails, while others return ingredient metadata.

## fireROUTE notes
- Keep the API-key-in-path convention intact for passthrough requests.
- Treat `search.php`, `lookup.php`, `filter.php`, and `list.php` as the four core route families.
