# RecipeAPI

Official pages manually reviewed:
- https://recipeapi.io/
- https://recipeapi.io/docs/
- https://recipeapi.io/docs/api-reference/
- https://recipeapi.io/docs/resources/recipes/
- https://recipeapi.io/docs/resources/ingredients/

## Overview
- Public API base URL: `https://recipeapi.io/api/v1`
- Authentication: API key required on every request
- Supported auth methods:
  - `Authorization` header using the Bearer token scheme
  - `X-API-Key` header
  - `apikey` query parameter
- Response format: JSON
- Localization: `lang` query parameter supports `en`, `fr`, and `es`; non-English responses require a paid plan

Manual route count confirmed from the official docs review: **5**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/recipes` | List recipes with search, filters, sorting, pagination, and ingredient matching |
| GET | `/recipes/random` | Return one random recipe, optionally narrowed by the same filter set as `/recipes` except pagination/sort controls |
| GET | `/recipes/{id}` | Fetch one recipe by numeric ID |
| GET | `/ingredients` | List ingredients with search/category filters and pagination |
| GET | `/ingredients/{id}` | Fetch one ingredient by numeric ID |

## Authentication
- The docs require an account-generated API key for all endpoints.
- The homepage sample request uses bearer auth against `GET /api/v1/recipes?search=pasta`.
- The API reference explicitly accepts bearer auth, `X-API-Key`, or an `apikey` query parameter.
- Missing or invalid credentials return `401` with:
  - `error.code: UNAUTHENTICATED`
  - `error.message` explaining that the key can be sent via the Bearer `Authorization` header, the `X-API-Key` header, or the `apikey` query parameter

## Endpoint details

### GET `/recipes`
List endpoint for the recipe catalog.

Query parameters confirmed in the official docs:
- `lang` string: response language; `en` default; paid for non-English
- `search` string: case-insensitive recipe-name search with English fallback
- `search_in` string: `name`, `description`, or `both`
- `ingredients` string: comma-separated ingredient names; case-insensitive partial matching; when used without explicit sort, results are ordered by number of matching ingredients first
- `cuisine` string: cuisine filter
- `meal_type` string: meal-type filter
- `difficulty` string: difficulty filter
- `dietary_tags` string: dietary-tag filter; currently one value only
- `prep_time_min` integer
- `prep_time_max` integer
- `cook_time_min` integer
- `cook_time_max` integer
- `calories_per_serving_min` integer
- `calories_per_serving_max` integer
- `protein_min` integer
- `protein_max` integer
- `sort` string: `name`, `prep_time`, `cook_time`, `calories_per_serving`, or `protein`
- `order` string: `asc` or `desc`
- `per_page` integer: default `10`, max depends on plan
- `page` integer: default `1`

Enum values documented on the recipes page:
- `cuisine`: `american`, `french`, `greek`, `italian`, `japanese`, `mexican`, `portuguese`, `spanish`, `thai`, `turkish`
- `meal_type`: `starter`, `main`, `dessert`, `appetizer`, `breakfast`, `brunch`, `snack`, `side_dish`, `soup`, `drink`, `sauce`
- `difficulty`: `easy`, `medium`, `hard`
- `dietary_tags`: `vegetarian`, `vegan`, `gluten_free`, `dairy_free`, `nut_free`, `halal`, `kosher`

Official usage notes:
- Ingredient search is partial-match and case-insensitive.
- `dietary_tags` currently accepts only a single value.
- Search defaults to recipe names unless `search_in` is set.

### GET `/recipes/random`
Return a single random recipe.

Official behavior notes:
- Returns the same full recipe structure as `GET /recipes/{id}`.
- Supports the same filter family as `GET /recipes`.
- The docs explicitly exclude `page`, `per_page`, `sort`, and `order` for this endpoint.
- If no record matches the filters, the docs show `422` with:
  - `error.code: NO_RECIPE_FOUND`
  - `error.message: No recipe found matching your filters.`

### GET `/recipes/{id}`
Return one recipe with full details.

Path parameters:
- `id` integer: recipe ID

Query parameters:
- `lang` string: `en` default; `fr` and `es` on paid plans

Documented response fields include:
- `data.id`
- `data.name`
- `data.description`
- `data.difficulty`
- `data.meal_type`
- `data.cuisine`
- `data.dietary_tags[]`
- `data.servings`
- `data.prep_time`
- `data.cook_time`
- `data.calories_per_serving`
- `data.protein`
- `data.instructions[]`
- `data.ingredients[]` with nested fields such as `id`, `name`, `category`, `quantity`, `unit`, and `optional`
- `meta.language`

### GET `/ingredients`
List endpoint for ingredient records.

Query parameters:
- `lang` string: response language; `en` default; non-English paid-only
- `search` string: case-insensitive ingredient-name search with English fallback
- `category` string: ingredient category filter
- `per_page` integer: default `10`, max depends on plan
- `page` integer: default `1`

Documented category values:
- `vegetable`, `fruit`, `meat`, `poultry`, `fish`, `seafood`, `dairy`, `egg`, `grain`, `legume`, `herb`, `spice`, `oil`, `condiment`, `sweetener`, `nut`, `beverage`, `other`

Observed response structure from the official examples:
- `data[]` items with `id`, `name`, and `category`
- `links.first`, `links.last`, `links.prev`, `links.next`
- `meta.current_page`, `meta.last_page`, `meta.path`, `meta.per_page`, `meta.total`, `meta.language`

### GET `/ingredients/{id}`
Return one ingredient.

Path parameters:
- `id` integer: ingredient ID

Query parameters:
- `lang` string: `en` default; `fr` and `es` on paid plans

Documented response structure:
- `data.id`
- `data.name`
- `data.category`
- `meta.language`

## Pagination
- The API reference documents `page` and `per_page` for all list endpoints.
- Default pagination values:
  - `page=1`
  - `per_page=10`
- Plan-specific `per_page` caps:
  - Free: `10`
  - Essential: `25`
  - Business: `50`
  - Enterprise: `100`
- The docs state that values above a plan's cap are automatically reduced to the allowed maximum.
- Paginated responses use `data`, `links`, and `meta` envelopes.

## Rate limits and quotas
- Global request-rate limit published in the API reference: `10 requests per second per user`
- Exceeding the rate limit returns `429` with `error.code: RATE_LIMIT`
- Published monthly request limits:
  - Free: `500`
  - Essential: `50,000`
  - Business: `300,000`
  - Enterprise: `1,000,000`
- Exceeding the monthly quota returns `429` with `error.code: USAGE_LIMIT_EXCEEDED`

## Errors
Officially documented error patterns include:
- `401 UNAUTHENTICATED` for missing/invalid API keys
- `402 PLAN_FEATURE_UNAVAILABLE` when a free-plan request asks for non-English content
- `404 NOT_FOUND` for missing recipe/ingredient IDs
- `422` for unsupported language values
- `422 NO_RECIPE_FOUND` when filtered random-recipe selection finds no match
- `429 RATE_LIMIT` for per-second throttling
- `429 USAGE_LIMIT_EXCEEDED` for monthly quota exhaustion

## fireROUTE notes
- The active public docs are under `/docs/`; the older guessed `/documentation` path is a 404 and should not be treated as the official reference anymore.
- The main API surface is intentionally small: three recipe routes and two ingredient routes.
- The dashboard query builder is an official companion tool, but the route inventory itself is fully exposed in the public docs.
- Localization applies to recipe `name`, `description`, and `instructions`, and to ingredient names.
