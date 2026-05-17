# Edamam nutrition

Official pages manually reviewed:
- https://developer.edamam.com/edamam-docs-nutrition-api
- https://api.edamam.com/doc/open-api/nutrition-analysis-v1.yaml

## Overview
- API base URL: `https://api.edamam.com`
- Authentication: required query credentials `app_id` and `app_key`
- Optional account-tracking header: `Edamam-Account-User` when the account is configured for active user tracking
- Request/response format: JSON for both documented endpoints; the recipe-analysis endpoint accepts a JSON request body
- Product focus: recipe nutrition analysis and single-line ingredient/food-text analysis

Manual route count confirmed from the reviewed official docs and OpenAPI spec: **2**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/nutrition-details` | Analyze a full recipe from title plus ingredient list |
| GET | `/api/nutrition-data` | Analyze one ingredient or short food text line |

## Confirmed parameters

### `POST /api/nutrition-details`
Required:
- `app_id` query parameter
- `app_key` query parameter
- JSON request body matching the documented `Recipe` schema, with required fields:
  - `title`
  - `ingr` (array of ingredient lines)

Optional query parameters and headers shown in the reviewed spec:
- `Edamam-Account-User` header: account user ID, only for accounts configured for active user tracking
- `beta`: enable beta features
- `If-None-Match` header: resubmission/ETag workflow
- `force`: force re-evaluation even when `If-None-Match` is valid
- `kitchen`: `home` or `commercial`
- `Content-Language` header: one of `ar`, `de`, `en`, `es`, `fr`, `it`, `nl`, `pt`, `ru`, `tr`
- `field`: repeatable field selector; docs say `*` includes all fields

Optional JSON body fields shown in the reviewed spec:
- `url`
- `summary`
- `yield`
- `time`
- `img`
- `prep`

### `GET /api/nutrition-data`
Required:
- `app_id` query parameter
- `app_key` query parameter
- `ingr`: ingredient text to analyze

Optional query parameters and headers:
- `Edamam-Account-User` header: account user ID when active user tracking is enabled
- `nutrition-type`: `cooking` or `logging`; defaults to `cooking`
- `If-None-Match` header

## Auth, pricing, and rate-limit notes
- The reviewed docs require `app_id` and `app_key` on both documented endpoints.
- The docs say active user tracking makes the user ID header mandatory for configured apps, and invalid use of that feature causes an error.
- No numeric request-per-second or request-per-minute rate limit is published on the reviewed documentation page.
- The reviewed docs say recipe analysis incurs monthly licensing fees for each newly analyzed recipe and recommend using the ETag/`If-None-Match` flow when resubmitting a known recipe.

## Response, error, and caching notes
- Both routes return JSON.
- Documented success code for both routes: `200`.
- Documented shared error/status responses: `304`, `404`, `409`, `422`, `555`.
- `POST /api/nutrition-details` also documents `406` for unsupported locales.
- The reviewed docs say successful recipe processing returns an `ETag` response header that should be stored for later resubmission.

## Important usage notes
- The docs describe `nutrition-type=logging` as the switch that enables the food-logging behavior on the GET route.
- In logging mode, Edamam can infer expected serving size and only matches directly consumable foods.
- The reviewed docs state logging mode handles single items and two-part compound items only.
- The `field` selector on the POST route can reduce the response to only requested sections.

## fireROUTE notes
- Keep both routes separate because one is a JSON POST recipe workflow and the other is a GET text-line workflow.
- Preserve the ETag/`If-None-Match` behavior for cache-aware resubmission.
- Expose `nutrition-type` on the GET route because it changes parsing context materially.
