# Noctua

## Provider metadata
- Category: `Science & Math`
- Provider slug: `noctua`
- Official docs/pages used:
  - `https://api.noctuasky.com/api/v1/swaggerdoc/` (official Swagger UI)
  - `https://api.noctuasky.com/api/v1/openapi.json` (official OpenAPI document linked from the Swagger UI)
  - Live endpoint checks against public and auth-protected routes on the same official host
- Current public API base URL: `https://api.noctuasky.com/api/v1`
- Auth model: mixed public/private access; the OpenAPI document defines header auth named `APIToken`, using the `Authorization` header, and the login route returns an `access_token` for subsequent calls
- Methods confirmed from the official docs: `GET`, `POST`, `PUT`, `DELETE`
- Response format notes: JSON responses throughout the reviewed OpenAPI document and live endpoint checks
- Rate-limit notes: no public numeric rate-limit policy was published in the reviewed Swagger/OpenAPI pages
- Manually confirmed route-family count: `14`

## Canonical route families
1. `GET /locations/`
   - Get all locations for the current user.
   - Auth required.
   - Query params: `page`, `page_size`.
2. `POST /locations/`
   - Create a new location.
   - Auth required.
   - Body schema: `Location`.
3. `GET /locations/{id}`
   - Get a location by ID.
   - Auth required.
4. `PUT /locations/{id}`
   - Update a location.
   - Auth required.
   - Body schema: `Location`.
5. `DELETE /locations/{id}`
   - Delete a location.
   - Auth required.
6. `GET /observations/`
   - Get all observations for the current user.
   - Auth required.
   - Query params: `page`, `page_size`.
7. `POST /observations/`
   - Add a new observation.
   - Auth required.
   - Body schema: `Observation`.
8. `GET /observations/{id}`
   - Get an observation by ID.
   - Auth required.
9. `PUT /observations/{id}`
   - Update an observation.
   - Auth required.
   - Body schema: `Observation`.
10. `DELETE /observations/{id}`
    - Delete an observation.
    - Auth required.
11. `GET /skysources/name/{str}`
    - Get one sky source fully matching the passed name.
    - Public route.
12. `GET /skysources/`
    - Query the list of sky sources.
    - Public route.
    - Query params: `q`, `limit`.
13. `GET /skysources/stats/`
    - Return statistics about sky-source database content.
    - Public route.
14. `POST /users/login`
    - Login a user and return a JWT-style access token for later calls.
15. `POST /users/change_password/{id}`
    - Change a user's password.
    - Auth required.
16. `POST /users/`
    - Register a new user.
17. `POST /users/reset_password/{id}`
    - Reset a user's password using a reset token and notify the user by email.
18. `POST /users/confirm/{id}`
    - Confirm a user's email using a token.
19. `POST /users/forgot_password`
    - Send a password-reset email.
20. `GET /users/{id}`
    - Get a user by ID.
    - Auth required.
    - The docs explicitly allow the special path value `me`.
21. `PUT /users/{id}`
    - Update a user.
    - Auth required.
22. `DELETE /users/{id}`
    - Delete a user.
    - Auth required.

## Parameters and request bodies
### Shared auth behavior
- Protected routes use the `Authorization` header.
- The OpenAPI document declares auth as `APIToken` in header `Authorization`.
- Live unauthenticated checks against protected routes returned `401` with JSON body `{"msg":"Missing Authorization Header"}`.

### Pagination and filtering
- `GET /locations/` and `GET /observations/` accept:
  - `page` - optional integer
  - `page_size` - optional integer
- `GET /skysources/` accepts:
  - `q` - optional string search query
  - `limit` - optional integer result cap

### Path parameters
- `{id}` is a required string identifier on the location, observation, password, confirmation, reset, and user detail routes.
- `{str}` on `/skysources/name/{str}` is a required exact-match source name string.
- The docs explicitly note that `/users/{id}` supports the special ID value `me`.

### User/account body schemas
- `POST /users/login`
  - required body fields: `email`, `password`
- `POST /users/`
  - required body fields: `email`, `first_name`, `last_name`, `password`
- `POST /users/forgot_password`
  - required body field: `email`
- `POST /users/reset_password/{id}`
  - required body fields: `token`, `password`
- `POST /users/confirm/{id}`
  - required body field: `token`
- `POST /users/change_password/{id}`
  - required body fields: `password`, `new_password`

### `Location` model fields
Required by the OpenAPI schema:
- `country`
- `lat`
- `lng`
- `short_name`

Additional reviewed fields include:
- `alt`
- `owner`
- `street_address`
- `updated_at`
- `id`

### `Observation` model fields
Required by the OpenAPI schema:
- `location`
- `observing_setup`
- `time`

Additional reviewed fields include:
- `comment`
- `difficulty`
- `owner`
- `updated_at`
- `rating`
- `target`
- `duration`
- `id`

## Response notes
- Live public route check:
  - `GET /skysources/stats/` returned `200` JSON with top-level keys `by_types` and `nb_skysources`.
- Live public route check:
  - `GET /skysources/name/andromeda` returned `200` JSON with fields such as `interest`, `match`, `model`, `model_data`, `names`, `short_name`, and `types`.
- The OpenAPI success responses documented in the reviewed schema are:
  - `200` for most reads and token flows
  - `201` for creates such as `POST /locations/`, `POST /observations/`, and `POST /users/`
  - `204` for updates/deletes and password change
- Login, registration, and user-detail responses expose a user object schema containing:
  - `id`
  - `email`
  - `first_name`
  - `last_name`
  - `updated_at`
  - `access_token`

## Errors and edge cases
- Protected routes without auth return `401` JSON with `{"msg":"Missing Authorization Header"}`.
- The reviewed OpenAPI document mostly lists success responses and does not publish a full error-code catalog.
- No separate rate-limit, retry, or pagination-response schema page was published in the reviewed official docs.

## Usage notes
- Treat the API as partly public:
  - `skysources` routes are readable without auth
  - user-owned resources under `locations`, `observations`, and user detail/update/delete require auth
- Use `POST /users/login` or `POST /users/` to obtain an `access_token`, then send it in `Authorization` for protected calls.
- `GET /skysources/` is a search/list route, while `GET /skysources/name/{str}` is an exact-name lookup route.
- The Swagger UI presents the base URL as `/api/v1`, so normalize against the host `https://api.noctuasky.com` plus that prefix.

## fireROUTE normalization notes
- Normalize against `https://api.noctuasky.com/api/v1`.
- Keep public and auth-required route families distinct in downstream notes.
- Preserve the special `/users/{id}` behavior where `id` can be `me`.
- Preserve `page`, `page_size`, `q`, and `limit` as documented query parameters.
- Treat `Location` and `Observation` as named body schemas rather than inventing stricter field requirements beyond the reviewed OpenAPI document.