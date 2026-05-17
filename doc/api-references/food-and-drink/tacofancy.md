# TacoFancy

Official pages manually reviewed:
- https://github.com/evz/tacofancy-api
- https://github.com/evz/tacofancy-api/tree/master/app
- https://github.com/evz/tacofancy-api/blob/master/app/api.py

## Overview
- Documented deployment model from the reviewed README: self-hosted Flask app
- Base URL shown in the reviewed README development setup: `http://localhost:5000/`
- Authentication: none documented for API consumers
- Response format from the reviewed source routes: JSON on API endpoints
- Hosted-production note: the reviewed official pages did not publish a public hosted base URL; only the local/self-hosted base was documented

Manual route count confirmed from the reviewed official README and source: **15**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/random/` | Return either random taco components or a full taco |
| GET | `/base_layers/` | List all base-layer recipes |
| GET | `/base_layers/{slug}/` | Fetch one base-layer recipe by slug |
| GET | `/condiments/` | List all condiment recipes |
| GET | `/condiments/{slug}/` | Fetch one condiment recipe by slug |
| GET | `/mixins/` | List all mixin recipes |
| GET | `/mixins/{slug}/` | Fetch one mixin recipe by slug |
| GET | `/seasonings/` | List all seasoning recipes |
| GET | `/seasonings/{slug}/` | Fetch one seasoning recipe by slug |
| GET | `/shells/` | List all shell recipes |
| GET | `/shells/{slug}/` | Fetch one shell recipe by slug |
| GET | `/contributions/` | List all contributors |
| GET | `/contributions/{username}/` | Fetch one contributor and their contributions |
| GET | `/contributors/{layer_type}/` | List `{name, slug}` mappings for one recipe type |
| GET | `/contributors/{recipe_type}/{recipe_slug}/` | List contributors for one specific recipe |

## Confirmed parameters

### `GET /random/`
- Optional query parameter from the reviewed README and source:
  - `full-taco=true`: return a full taco recipe instead of separate random ingredients

### Recipe collection routes
These collection routes take no documented query parameters in the reviewed source:
- `GET /base_layers/`
- `GET /condiments/`
- `GET /mixins/`
- `GET /seasonings/`
- `GET /shells/`
- `GET /contributions/`

### Recipe item routes
These routes use a single required path parameter:
- `GET /base_layers/{slug}/`
- `GET /condiments/{slug}/`
- `GET /mixins/{slug}/`
- `GET /seasonings/{slug}/`
- `GET /shells/{slug}/`

Documented path parameter:
- `slug`: recipe slug for the selected category

### `GET /contributions/{username}/`
- Required path parameter:
  - `username`: GitHub username

### `GET /contributors/{layer_type}/`
- Required path parameter:
  - `layer_type`
- Valid types explicitly documented in the reviewed README:
  - `base_layers`
  - `mixins`
  - `seasonings`
  - `condiments`
  - `shells`

### `GET /contributors/{recipe_type}/{recipe_slug}/`
- Required path parameters:
  - `recipe_type`
  - `recipe_slug`
- The reviewed README uses `base_layers/delengua_beef_tongue` as the canonical example.

## Auth and rate limits
- The reviewed official README and source do not document any authentication requirement for API clients.
- The reviewed official pages do not publish rate limits, quotas, or pagination controls.
- The reviewed README mentions `GITHUB_TOKEN` only for the project's internal data-loading workflow, not for consuming the API routes above.

## Response, pagination, and error notes
- The reviewed source returns JSON arrays for collection endpoints and JSON objects for individual-resource endpoints.
- No pagination parameters or cursor mechanisms are implemented in the reviewed route definitions.
- The reviewed source returns `404` JSON errors for several missing/invalid cases, including:
  - missing recipe slug on recipe-item routes
  - missing contributor username on `/contributions/{username}/`
  - invalid `layer_type` on `/contributors/{layer_type}/`
  - invalid `recipe_type` or missing recipe on `/contributors/{recipe_type}/{recipe_slug}/`
  - no full tacos available on `/random/?full-taco=true`

## Important usage notes
- TacoFancy is documented as a self-hosted API for the TacoFancy dataset, not a public hosted SaaS endpoint.
- The reviewed source shows all confirmed API routes are `GET` only.
- `/random/` changes its response shape depending on whether `full-taco` is present.
- `/contributors/{layer_type}/` returns slug mappings, while `/contributors/{recipe_type}/{recipe_slug}/` returns contributor records for one recipe.

## fireROUTE notes
- Treat the provider as self-hosted and make the base URL configurable instead of assuming a public production host.
- Preserve trailing slashes because the reviewed Flask route registrations include them explicitly.
- Model all confirmed endpoints as read-only `GET` operations with no pagination.
- Surface `404` responses directly because the reviewed source uses them for both invalid route parameters and missing records.