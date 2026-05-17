# Wizard World

Official page manually reviewed:
- https://wizard-world-api.herokuapp.com/swagger/index.html

## Overview
- Public API base URL: the reviewed Swagger UI presents relative paths under the provider host `https://wizard-world-api.herokuapp.com`
- Docs surface: Swagger UI / OpenAPI 3.0
- Authentication: no auth requirement was shown for the read endpoints; one feedback endpoint is also publicly listed
- Response format: JSON via Swagger-documented schemas

Manual route count confirmed from the reviewed official docs: **13**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/Elixirs` | List elixirs |
| GET | `/Elixirs/{id}` | Get one elixir |
| POST | `/Feedback` | Submit feedback |
| GET | `/Houses` | List houses |
| GET | `/Houses/{id}` | Get one house |
| GET | `/Ingredients` | List ingredients |
| GET | `/Ingredients/{id}` | Get one ingredient |
| GET | `/MagicalCreature` | List magical creatures |
| GET | `/MagicalCreature/{id}` | Get one magical creature |
| GET | `/Spells` | List spells |
| GET | `/Spells/{id}` | Get one spell |
| GET | `/Wizards` | List wizards |
| GET | `/Wizards/{id}` | Get one wizard |

## Parameters and schema signals
- The docs clearly expose `id` as the path parameter for all detail endpoints.
- Swagger schema names visible on the official page include `ElixirDto`, `HouseDto`, `IngredientDto`, `MagicalCreatureDto`, `SpellDto`, `WizardDto`, and `SendFeedbackCommand`.
- Query helper schemas shown in the docs include `GetHousesQuery` and `GetMagicalCreaturesQuery`, which signal provider-specific filter/query objects on at least those list endpoints.

## Auth, errors, and format notes
- The official page exposes an OpenAPI/Swagger UI with JSON-style DTO schemas.
- No API key, OAuth flow, or bearer-token requirement was visible in the reviewed snapshot.
- The Swagger page links to `/swagger/v1/swagger.json`, indicating an underlying machine-readable OpenAPI description exists on the official host.

## Rate limits
- No numeric rate limit was visible on the reviewed Swagger page.

## Important usage notes
- The API surface is almost entirely read-only; the only non-GET operation shown is `POST /Feedback`.
- Resource naming and path casing are provider-specific and should be preserved exactly as documented.
- fireROUTE should preserve the provider's capitalized path segments when building passthrough routes.

## fireROUTE notes
- This provider is a good fit for raw passthrough because the docs expose stable collection/detail pairs.
- Preserve provider query parameters for list endpoints rather than forcing a canonical filter model too early.
