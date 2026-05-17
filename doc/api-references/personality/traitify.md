# Traitify

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://app.traitify.com/developer`
  - `https://app.traitify.com/developer/documentation/decks`
  - `https://app.traitify.com/developer/documentation/assessments`
  - `https://app.traitify.com/developer/documentation/slides#update`
  - `https://app.traitify.com/developer/documentation/results`
  - `https://app.traitify.com/developer/documentation/matching#specific-career-matches`
- Manual review outcome: `manually_documented`
- Confirmed route count: `8`

## API overview
- Base URL: `https://api.traitify.com/v1`
- Authentication:
  - the quickstart page says you receive both a public key and a secret key
  - documented API examples use HTTP Basic auth with the key as the username and `x` as the password placeholder
  - `POST /assessments` is shown with the secret key
  - the read/update/get routes shown in the reviewed docs use the public key
- Response format: JSON
- Assessment rendering helper:
  - the official widget docs use `https://cdn.traitify.com/js/v2/traitify.js`
  - the widget host is set to `https://api.traitify.com`
- Rate limits: no numeric rate-limit table was visible in the reviewed pages

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/decks` | none | Lists active decks that can be used when creating assessments. |
| POST | `/assessments` | body `deck_id` | Creates a new assessment for one user. |
| GET | `/assessments/{assessment_id}/slides` | `assessment_id` path parameter | Lists slides for an assessment in presentation order. |
| PUT | `/assessments/{assessment_id}/slides` | `assessment_id`; bulk body array of `id`, `response`, `time_taken` | Bulk-updates slide answers for one assessment. |
| PUT | `/assessments/{assessment_id}/slides/{slide_id}` | `assessment_id`, `slide_id`; body `id`, `response`, `time_taken` | Updates a single slide answer. |
| GET | `/assessments/{assessment_id}` | `assessment_id`; optional `data`, `image_pack` | Returns completed assessment results, or slides when the assessment is not complete. |
| GET | `/assessments/{assessment_id}/matches/careers` | `assessment_id`; optional `number_of_matches`, `experience_levels`, `career_ids` | Returns top career matches for `career-deck` assessments. |
| POST | `/assessments/{assessment_id}/matches/careers` | `assessment_id`; body array of `career_ids` / O*NET codes | Returns scores for a supplied set of career IDs. |

## Confirmed parameters and response details
### `GET /decks`
- No request parameters were shown on the reviewed deck page
- Example response fields include:
  - `id`
  - `name`
  - `description`
  - `personality_group`
  - `slide_count`
  - `badges[]`

### `POST /assessments`
- Required body field: `deck_id`
- The docs show example deck IDs such as:
  - `core`
  - `career-deck`
  - `super-hero`
- Example response fields include:
  - `id`
  - `deck_id`
  - `completed_at`
  - `created_at`

### `GET /assessments/{assessment_id}/slides`
- Example slide fields include:
  - `id`
  - `position`
  - `caption`
  - `image_desktop`
  - `image_desktop_retina`
  - `response`
  - `time_taken`
  - `completed_at`
  - `created_at`
  - `focus_x`
  - `focus_y`

### `PUT /assessments/{assessment_id}/slides`
- Request body is an array of slide updates
- Each array item requires:
  - `id`
  - `response` (`true` for “me”, `false` for “not me”)
  - `time_taken` in milliseconds

### `PUT /assessments/{assessment_id}/slides/{slide_id}`
- Required body fields match the bulk-update structure:
  - `id`
  - `response`
  - `time_taken`
- The path also includes `slide_id`

### `GET /assessments/{assessment_id}`
- Optional query parameters:
  - `data` — comma-separated result sections such as `blend`, `types`, `traits`, `career_matches`
  - `image_pack` — icon pack selection such as `flat` or `linear`
- The docs say incomplete assessments return slides by default
- Completed assessment responses can include:
  - base assessment metadata (`id`, `deck_id`, `completed_at`, `created_at`)
  - `personality_blend`
  - `personality_types`
  - `personality_traits`
  - `career_matches`

### Career matching routes
- These matching routes are explicitly limited to assessments created from the `career-deck`
- `GET /assessments/{assessment_id}/matches/careers` optional query parameters:
  - `number_of_matches` — default `20`, maximum `60`
  - `experience_levels` — list of values from `1` to `5`
  - `career_ids` — optional list of O*NET codes when the URL stays within practical length limits
- `POST /assessments/{assessment_id}/matches/careers` body:
  - array of O*NET career codes such as `39-5094.00`
- Matching responses include:
  - nested `career` objects
  - `score`
  - career metadata such as `title`, `description`, `majors`, `experience_level`, salary and employment projection data, and `bright_outlooks`

## Response, pagination, and errors
- The reviewed Traitify pages document JSON responses for all confirmed routes
- No general pagination model was documented on the reviewed pages
- No global error-schema or rate-limit page was surfaced in the reviewed material
- Example responses show successful `200 OK` retrieval/update responses for the route families above

## Important usage notes
- Traitify’s quickstart explicitly says a fresh assessment should be created for each user
- The public widget integration uses the public key client-side but still requires the server-side assessment creation step first
- The docs distinguish public-key and secret-key usage by example instead of publishing one centralized auth matrix, so adapters should preserve that distinction
- The reviewed results page appears to contain a minor typo in one prose line (`https://api.traitify.com/v1developer/...`), but the example request immediately below confirms the actual route shape is `/v1/assessments/{assessment_id}`

## Sources inspected
- `https://app.traitify.com/developer`
- `https://app.traitify.com/developer/documentation/decks`
- `https://app.traitify.com/developer/documentation/assessments`
- `https://app.traitify.com/developer/documentation/slides#update`
- `https://app.traitify.com/developer/documentation/results`
- `https://app.traitify.com/developer/documentation/matching#specific-career-matches`
