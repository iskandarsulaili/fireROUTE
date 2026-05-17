# Wger

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `wger`
- Official docs/pages used:
  - `https://wger.de/en/software/api`
  - `https://wger.readthedocs.io/en/latest/api/api.html`
  - `https://wger.de/api/v2/schema`
- Current official API base URL: `https://wger.de`
- Current API root: `https://wger.de/api/v2/`
- Reviewed schema version: `OpenAPI 3.0.3`
- Reviewed product/version notes:
  - the official schema identifies the API title as `wger`
  - the reviewed schema version string was `2.6.0a2`
- Auth model:
  - public read access is available for some endpoints such as exercises and ingredients
  - authenticated endpoints support three official mechanisms exposed in the reviewed schema:
    - session-cookie auth via `sessionid`
    - JWT bearer auth via `Authorization: Bearer <access-token>`
    - permanent token auth via `Authorization: Token <token>`
- Response formats:
  - JSON by default
  - the official docs also publish `.json` suffixes for raw JSON and `.api` suffixes for the browsable HTML API view
  - the official `/api/v2/schema` endpoint publishes the route inventory as an OpenAPI schema
- Public rate-limit note:
  - `/api/v2/login/` and `/api/v2/token` are limited to `10 requests/min`
  - `/api/v2/userprofile/` is limited to `5 requests/min`
  - `/api/v2/ingredient/` and `/api/v2/ingredientinfo/` list routes are limited to `120 requests/min`
  - `/api/v2/ingredient/{id}/` and `/api/v2/ingredientinfo/{id}/` detail routes are limited to `300 requests/min`
  - `/api/v2/ingredient-sync/` is limited to `600 requests/min`
  - exceeding a limit returns HTTP `429` with a `Retry-After` header
  - the official API guide says all other endpoints are unthrottled
- Manually confirmed route count: `129` concrete paths (`257` operations)

## Authentication and access
- The official API guide says the REST API is served under `/api/v2/` and uses standard HTTP verbs and status codes.
- The guide explicitly distinguishes between:
  - public endpoints, such as exercise and ingredient lists, which can be accessed without authentication
  - user-owned objects, such as routines, which require authentication
- The official guide recommends JWT auth over the older permanent-token flow.
- JWT flow from the reviewed official guide:
  - `POST /api/v2/token` exchanges username/password for access and refresh JWTs
  - `POST /api/v2/token/verify` verifies a token
  - `POST /api/v2/token/refresh` rotates/refreshes the token pair
- Permanent token flow from the reviewed official guide:
  - generate a key from the logged-in web app's API-key settings page, or
  - obtain a token programmatically via `POST /api/v2/login/`
- The reviewed schema's `tokenAuth` security scheme requires the `Authorization` header with the `Token` prefix.
- The reviewed schema's `jwtAuth` security scheme uses HTTP bearer auth with `JWT` bearer format.

## Common parameters and behavior
### Pagination
- The official guide says list endpoints are paginated to `20` elements per page by default.
- `limit` overrides the page size.
- `offset` selects the starting index.
- Paginated responses include `count`, `next`, `previous`, and `results`.
- The official guide says there is no hard cap on `limit`, but very large pages may be slow and add load.

### Ordering
- The official guide documents `?ordering=<fieldname>`.
- Multiple ordering fields can be combined with commas.
- Prefixing a field with `-` reverses sort order.

### Filtering
- The official guide says list endpoints accept query filters of the form `?<fieldname>=<value>` and combine multiple filters with AND semantics.
- Boolean filters must be `True` or `False` exactly; values like `1`, `0`, or lowercase `false` are ignored.
- The guide says repeating the same field for OR-style multi-value filtering is not currently supported.
- The reviewed schema confirms endpoint-specific query filters, including:
  - exercise filters such as `category`, repeated `equipment`, `muscles`, and `muscles_secondary`
  - routine filters such as `created`, `description`, `start`, `end`, `is_public`, `is_template`, and `name`
  - ingredient filters including nutrient fields, created-date comparisons, ID range filters, `id__in`, and barcode/code-style lookups
  - meal filters such as `order`, `plan`, and `time`
  - `check-permission` with a required `permission` query parameter

### Formats and discovery
- The official guide says `/api/v2/` returns a JSON endpoint listing for discovery, or an HTML index in a browser.
- The official API landing page links these discovery/reference views:
  - `https://wger.de/api/v2/`
  - `https://wger.de/api/v2/schema`
  - `https://wger.de/api/v2/schema/ui`
  - `https://wger.de/api/v2/schema/redoc`

### Error notes
- The official guide says the API uses standard HTTP status codes.
- The official guide explicitly documents HTTP `429` plus `Retry-After` for throttled routes.
- The reviewed schema includes explicit non-success examples such as:
  - `GET /api/v2/check-permission/` returning `400` when the `permission` parameter is missing
- Auth flows and token expiry behavior in the official guide imply standard auth failures when expired or invalid credentials are used.

## Canonical endpoint inventory
The reviewed official OpenAPI schema exposes these `129` concrete paths.

### Discovery, auth, registration, and account utilities
- POST `/api/v2/check-language/` - detect the language of a submitted string
- GET `/api/v2/check-permission/` - check whether the current user has a named Django permission
- POST `/api/v2/login/` - obtain or return the older permanent token
- POST `/api/v2/register/` - register a user account
- GET `/api/v2/schema` - fetch the published OpenAPI schema
- POST `/api/v2/token` - obtain access and refresh JWTs
- POST `/api/v2/token/refresh` - refresh/rotate JWT credentials
- POST `/api/v2/token/verify` - verify a JWT
- GET, POST `/api/v2/userprofile/` - list/update the current user's profile collection view
- GET, PUT, PATCH, DELETE `/api/v2/userprofile/{id}/` - operate on one user profile resource
- GET `/api/v2/userprofile/verify-email/` - verify email flow
- GET `/api/v2/version/` - API/server version endpoint
- GET `/api/v2/min-app-version/` - minimum supported app version
- GET `/api/v2/min-server-version/` - minimum compatible server version

### Reference and taxonomy data
- GET `/api/v2/deletion-log/`
- GET `/api/v2/deletion-log/{id}/`
- GET `/api/v2/equipment/`
- GET `/api/v2/equipment/{id}/`
- GET `/api/v2/exercisecategory/`
- GET `/api/v2/exercisecategory/{id}/`
- GET `/api/v2/ingredient-image/`
- GET `/api/v2/ingredient-image/{id}/`
- GET `/api/v2/ingredientweightunit/`
- GET `/api/v2/ingredientweightunit/{id}/`
- GET `/api/v2/language/`
- GET `/api/v2/language/{id}/`
- GET `/api/v2/license/`
- GET `/api/v2/license/{id}/`
- GET `/api/v2/muscle/`
- GET `/api/v2/muscle/{id}/`
- GET `/api/v2/setting-repetitionunit/`
- GET `/api/v2/setting-repetitionunit/{id}/`
- GET `/api/v2/setting-weightunit/`
- GET `/api/v2/setting-weightunit/{id}/`
- GET `/api/v2/trophy/`
- GET `/api/v2/trophy/{id}/`
- GET `/api/v2/trophy/progress/`

### Exercise library and media
- GET, POST `/api/v2/exercise/`
- GET, PUT, PATCH, DELETE `/api/v2/exercise/{id}/`
- POST `/api/v2/exercise-submission/`
- GET, POST `/api/v2/exercise-translation/`
- GET, PUT, PATCH, DELETE `/api/v2/exercise-translation/{id}/`
- GET, POST `/api/v2/exercisealias/`
- GET, PUT, PATCH, DELETE `/api/v2/exercisealias/{id}/`
- GET, POST `/api/v2/exercisecomment/`
- GET, PUT, PATCH, DELETE `/api/v2/exercisecomment/{id}/`
- GET, POST `/api/v2/exerciseimage/`
- GET, PUT, PATCH, DELETE `/api/v2/exerciseimage/{id}/`
- GET `/api/v2/exerciseimage/{id}/thumbnails/`
- GET `/api/v2/exerciseinfo/` - read-only expanded exercise view
- GET `/api/v2/exerciseinfo/{id}/`
- GET, POST `/api/v2/gallery/`
- GET, PUT, PATCH, DELETE `/api/v2/gallery/{id}/`
- GET, POST `/api/v2/video/`
- GET, PUT, PATCH, DELETE `/api/v2/video/{id}/`

### Ingredient and nutrition catalog data
- GET `/api/v2/ingredient/`
- GET `/api/v2/ingredient/{id}/`
- GET `/api/v2/ingredient/{id}/get_values/`
- GET `/api/v2/ingredient-sync/`
- GET `/api/v2/ingredient-sync/{id}/`
- GET `/api/v2/ingredientinfo/`
- GET `/api/v2/ingredientinfo/{id}/`
- GET `/api/v2/ingredientinfo/{id}/get_values/`

### Meal planning and nutrition tracking
- GET, POST `/api/v2/meal/`
- GET, PUT, PATCH, DELETE `/api/v2/meal/{id}/`
- GET `/api/v2/meal/{id}/nutritional_values/`
- GET, POST `/api/v2/mealitem/`
- GET, PUT, PATCH, DELETE `/api/v2/mealitem/{id}/`
- GET `/api/v2/mealitem/{id}/nutritional_values/`
- GET, POST `/api/v2/nutritiondiary/`
- GET, PUT, PATCH, DELETE `/api/v2/nutritiondiary/{id}/`
- GET `/api/v2/nutritiondiary/{id}/nutritional_values/`
- GET, POST `/api/v2/nutritionplan/`
- GET, PUT, PATCH, DELETE `/api/v2/nutritionplan/{id}/`
- GET `/api/v2/nutritionplan/{id}/nutritional_values/`
- GET, POST `/api/v2/nutritionplaninfo/`
- GET, PUT, PATCH, DELETE `/api/v2/nutritionplaninfo/{id}/`
- GET `/api/v2/nutritionplaninfo/{id}/nutritional_values/`

### Routine, scheduling, and template management
- GET, POST `/api/v2/day/`
- GET, PUT, PATCH, DELETE `/api/v2/day/{id}/`
- GET, POST `/api/v2/routine/`
- GET, PUT, PATCH, DELETE `/api/v2/routine/{id}/`
- GET `/api/v2/routine/{id}/date-sequence-display/`
- GET `/api/v2/routine/{id}/date-sequence-gym/`
- GET `/api/v2/routine/{id}/logs/`
- GET `/api/v2/routine/{id}/stats/`
- GET `/api/v2/routine/{id}/structure/`
- GET, POST `/api/v2/slot/`
- GET, PUT, PATCH, DELETE `/api/v2/slot/{id}/`
- GET, POST `/api/v2/slot-entry/`
- GET, PUT, PATCH, DELETE `/api/v2/slot-entry/{id}/`
- GET `/api/v2/templates/`
- GET `/api/v2/templates/{id}/`
- GET `/api/v2/public-templates/`
- GET `/api/v2/public-templates/{id}/`

### Workout logging, body metrics, and progress statistics
- GET, POST `/api/v2/measurement/`
- GET, PUT, PATCH, DELETE `/api/v2/measurement/{id}/`
- GET, POST `/api/v2/measurement-category/`
- GET, PUT, PATCH, DELETE `/api/v2/measurement-category/{id}/`
- GET, POST `/api/v2/weightentry/`
- GET, PUT, PATCH, DELETE `/api/v2/weightentry/{id}/`
- GET, POST `/api/v2/workoutlog/`
- GET, PUT, PATCH, DELETE `/api/v2/workoutlog/{id}/`
- GET, POST `/api/v2/workoutsession/`
- GET, PUT, PATCH, DELETE `/api/v2/workoutsession/{id}/`
- GET `/api/v2/user-statistics/`
- GET `/api/v2/user-statistics/{id}/`
- GET `/api/v2/user-trophy/`
- GET `/api/v2/user-trophy/{id}/`

### Training-parameter configuration resources
- GET, POST `/api/v2/max-repetitions-config/`
- GET, PUT, PATCH, DELETE `/api/v2/max-repetitions-config/{id}/`
- GET, POST `/api/v2/max-rest-config/`
- GET, PUT, PATCH, DELETE `/api/v2/max-rest-config/{id}/`
- GET, POST `/api/v2/max-rir-config/`
- GET, PUT, PATCH, DELETE `/api/v2/max-rir-config/{id}/`
- GET, POST `/api/v2/max-sets-config/`
- GET, PUT, PATCH, DELETE `/api/v2/max-sets-config/{id}/`
- GET, POST `/api/v2/max-weight-config/`
- GET, PUT, PATCH, DELETE `/api/v2/max-weight-config/{id}/`
- GET, POST `/api/v2/repetitions-config/`
- GET, PUT, PATCH, DELETE `/api/v2/repetitions-config/{id}/`
- GET, POST `/api/v2/rest-config/`
- GET, PUT, PATCH, DELETE `/api/v2/rest-config/{id}/`
- GET, POST `/api/v2/rir-config/`
- GET, PUT, PATCH, DELETE `/api/v2/rir-config/{id}/`
- GET, POST `/api/v2/sets-config/`
- GET, PUT, PATCH, DELETE `/api/v2/sets-config/{id}/`
- GET, POST `/api/v2/weight-config/`
- GET, PUT, PATCH, DELETE `/api/v2/weight-config/{id}/`

## Parameters and payload notes
### Shared list parameters
- Many collection endpoints expose the documented shared trio `limit`, `offset`, and `ordering`.
- Many resource-specific list routes also expose direct field filters, usually matching Django/DRF field names.

### Exercise route parameters confirmed in the reviewed schema
- `GET /api/v2/exercise/` supports:
  - `category`
  - repeated `equipment` integers
  - repeated `muscles` integers
  - repeated `muscles_secondary` integers
  - `limit`
  - `offset`
  - `ordering`
- The schema notes `/api/v2/exerciseinfo/` as the read-only expanded exercise view.

### Ingredient route parameters confirmed in the reviewed schema
- `GET /api/v2/ingredient/` exposes a wide filter surface including:
  - nutrient fields such as `carbohydrates`, `carbohydrates_sugar`, `energy`, `fat`, `fat_saturated`, and `fiber`
  - identifier/code fields such as `id`, `id__gt`, `id__gte`, `id__lt`, `id__lte`, `id__in`, and `code`
  - creation-date filters such as `created`, `created__gt`, and `created__lt`
- The schema marks `id__in` as a comma-separated multi-value query parameter.

### Routine route parameters confirmed in the reviewed schema
- `GET /api/v2/routine/` supports:
  - `created`
  - `description`
  - `end`
  - `is_public`
  - `is_template`
  - `name`
  - `start`
  - `limit`
  - `offset`
  - `ordering`
- The extra routine subroutes publish derived views for date sequences, logs, stats, and structure.

### Auth and registration payload notes confirmed in the reviewed schema/docs
- `POST /api/v2/login/` accepts JSON, form-encoded, or multipart payloads using the `UserLoginRequest` schema.
- `POST /api/v2/token` accepts JSON, form-encoded, or multipart username/password input and returns access/refresh JWTs.
- `POST /api/v2/token/refresh` accepts JSON, form-encoded, or multipart refresh-token input.
- `POST /api/v2/register/` accepts JSON, form-encoded, or multipart registration data via `UserRegistrationRequest`.
- The official guide says `POST /api/v2/userprofile/` is unusual: it updates the current user's profile via POST rather than PATCH.

## Response, pagination, and format notes
- The official guide says JSON is the default response format.
- The guide documents `application/json` and `application/json; indent=4` via `Accept` headers.
- The guide also documents format suffixes:
  - `.json` for raw JSON
  - `.api` for the browsable HTML API representation
- Paginated list responses include `count`, `next`, `previous`, and `results`.
- The reviewed schema publishes many list-response component names such as `PaginatedExerciseList`, `PaginatedRoutineList`, `PaginatedMealList`, and similar DRF-style envelopes.

## Important usage notes from the official docs
- The official API page says the OpenAPI specification is generated automatically from the codebase.
- The same page links browsable API, ReDoc, Swagger UI, and downloadable schema views.
- The official guide says JWT access tokens are short-lived and refresh tokens are long-lived; the reviewed docs example described a `10 minute` Docker-default access-token lifetime and `120 day` refresh-token lifetime, both configurable by environment variables.
- The official guide says refresh-token rotation blacklists the old refresh token immediately after use.
- The official guide says some endpoints are public, but user-owned resources such as routines require authentication.
- The official guide warns that very large `limit` values may be slow and place load on the server.

## fireROUTE normalization notes
- Treat `wger` as a broad workout/nutrition platform API, not a single-purpose exercise catalog.
- Preserve the distinction between:
  - public read-only catalog data, and
  - authenticated user-owned training/nutrition/progress resources
- Preserve both auth styles in fireROUTE docs:
  - recommended JWT bearer auth, and
  - legacy permanent-token auth with the `Token` prefix
- Keep route counts path-based: the reviewed official schema exposes `129` concrete paths and `257` operations.
- Preserve `/api/v2/schema`, `/api/v2/schema/ui`, and `/api/v2/schema/redoc` as first-party discovery surfaces rather than collapsing them into third-party docs references.
