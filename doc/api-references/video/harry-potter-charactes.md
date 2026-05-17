# Harry Potter Charactes

## Provider metadata
- Category: `Video`
- Provider slug: `harry-potter-charactes`
- Official pages manually reviewed:
  - `https://hp-api.herokuapp.com/` (legacy indexed host; currently serves Heroku's `No such app` page)
  - `https://hp-api.onrender.com/` (current official interactive homepage)
  - `https://github.com/KostaSav/hp-api` (official source repository linked from the homepage)
  - `https://raw.githubusercontent.com/KostaSav/hp-api/master/server.js` (official server source used to confirm route behavior)
- Main API base URL: `https://hp-api.onrender.com/api`
- Auth model: none
- Supported request method: `GET`
- Response format notes: JSON arrays for all documented data routes; unknown API paths return plain-text `404` responses
- Manually confirmed route count: `6`

## Authentication
- The official homepage explicitly says: `No API key required.`
- The reviewed homepage and source do not document OAuth, API keys, cookies, bearer tokens, or signed requests.

## Canonical endpoints

### 1) List all characters
- Method: `GET`
- Path: `/characters`
- Purpose: return the full character dataset.

Parameters:
- None documented.

Response notes:
- Returns a JSON array of character objects.
- The first live object reviewed included fields such as `id`, `name`, `alternate_names`, `species`, `gender`, `house`, `dateOfBirth`, `yearOfBirth`, `wizard`, `ancestry`, `eyeColour`, `hairColour`, `wand`, `patronus`, `hogwartsStudent`, `hogwartsStaff`, `actor`, `alternate_actors`, `alive`, and `image`.

### 2) Get character by ID
- Method: `GET`
- Path: `/character/{id}`
- Purpose: return the character whose ID matches the supplied identifier.

Path parameters:
- `id` - character ID; the official homepage example uses `9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8`.

Important behavior confirmed from the official source and live endpoint:
- The server lowercases the incoming `id` before comparison, so matching is case-insensitive.
- The route returns a JSON array, not a single object wrapper.
- A non-existent ID returns `200 OK` with `[]` rather than a `404`.

### 3) List Hogwarts students
- Method: `GET`
- Path: `/characters/students`
- Purpose: return characters whose `hogwartsStudent` flag is true.

Parameters:
- None documented.

### 4) List Hogwarts staff
- Method: `GET`
- Path: `/characters/staff`
- Purpose: return characters whose `hogwartsStaff` flag is true.

Parameters:
- None documented.

### 5) List characters by house
- Method: `GET`
- Path: `/characters/house/{house}`
- Purpose: filter characters by Hogwarts house.

Path parameters:
- `house` - house name; the official homepage example uses `gryffindor`.

Important behavior confirmed from the official source:
- The server lowercases the incoming `house` value before comparison, so callers should prefer lowercase slugs even though mixed-case input still matches.

### 6) List spells
- Method: `GET`
- Path: `/spells`
- Purpose: return the spell catalogue.

Parameters:
- None documented.

Response notes:
- Returns a JSON array of spell objects.
- The first live spell object reviewed included `id`, `name`, and `description`.

## Pagination
- The reviewed homepage and server source do not document pagination parameters.
- The live endpoints reviewed return full JSON arrays without paging metadata.

## Rate limits
- No numeric rate limits, quota windows, or retry headers are documented on the reviewed official pages.

## Errors and format notes
- Unknown API routes currently return HTTP `404` with the plain-text body `Sorry can't find that!`.
- Successful data routes return `application/json; charset=utf-8`.
- `/api/character/{id}` uses an empty array to represent "not found" rather than a structured error object.
- The official server source sets `Access-Control-Allow-Origin: *` for `/api` routes.

## Important usage notes
- The public-apis index still points at the old Heroku host, but the official repository README now lists `https://hp-api.onrender.com` as the main host and `https://hp-api.herokuapp.com` as a fallback; the Heroku fallback currently serves `No such app`.
- All currently documented public routes are read-only `GET` endpoints under `/api`.
- Because the provider returns arrays for both collection and single-record lookups, fireROUTE adapters should not assume `/character/{id}` yields a bare object.

## fireROUTE normalization notes
- Preserve the provider's path structure exactly; there is no official alternate REST versioning scheme documented.
- Treat not-found character lookups as provider-specific empty-array responses rather than inventing a synthetic 404 mapping.
