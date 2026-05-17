# Tredict

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `tredict`
- Official docs/pages used:
  - `https://www.tredict.com/blog/oauth_docs/`
- Current public API base URLs:
  - `https://www.tredict.com/user/oauth/v2`
  - `https://www.tredict.com/api/oauth/v2`
- Auth model: OAuth2 / OAuth2.1 with PKCE support for public clients; bearer-token based API access after authorization
- Response format: JSON
- Public rate-limit note: the official docs include a dedicated `Rate limits` section in the table of contents, but the numeric quota details were not visible in the manually captured excerpts from this run
- Manually confirmed route count: `23`

## Authentication and access
- The official guide says Tredict supports both the standard OAuth2 flow and the OAuth2.1 PKCE flow.
- The guide explicitly recommends PKCE for public clients such as mobile and single-page applications.
- To apply for client credentials, the docs instruct developers to contact `support@tredict.com` with app details, callback URLs, privacy statement, requested scopes, and client-flow details.
- The visible `Apply` section says the default granted scopes are `activityWrite`, `activityRead`, `bodyvaluesWrite`, and `bodyvaluesRead`.
- The docs compare the Personal API with the OAuth2 API and describe OAuth2 as the path for multi-user application integrations.

## Canonical endpoints
### Token lifecycle
1. `POST /user/oauth/v2/token` - exchange authorization material for an access token
2. `DELETE /user/oauth/v2/token` - deregistration / token revocation endpoint

### Activity endpoints
3. `GET /api/oauth/v2/activityList` - list activities
4. `GET /api/oauth/v2/activity/{activityId}` - fetch one activity
5. `POST /api/oauth/v2/activity/update/{activityId}` - update one activity
6. `GET /api/oauth/v2/activity/file/{activityId}` - download an activity file
7. `POST /api/oauth/v2/activity/upload` - upload an activity file

### Planned training endpoints
8. `GET /api/oauth/v2/plannedTrainingList` - list planned trainings
9. `GET /api/oauth/v2/plannedTraining/file/fit/{trainingId}` - download planned training as FIT
10. `GET /api/oauth/v2/plannedTraining/file/json/{trainingId}` - download planned training as JSON
11. `POST /api/oauth/v2/plannedTraining/changeDate` - move a planned training to a new date
12. `POST /api/oauth/v2/plan` - create a plan
13. `POST /api/oauth/v2/plan/training` - add training to a plan

### Performance and wellness endpoints
14. `GET /api/oauth/v2/efforts` - download training efforts
15. `GET /api/oauth/v2/bodyvalues` - download health/body values
16. `POST /api/oauth/v2/bodyvalues` - upload health/body values
17. `GET /api/oauth/v2/capacity` - download capacity values
18. `GET /api/oauth/v2/hrv` - download HRV data
19. `POST /api/oauth/v2/hrv` - upload HRV data
20. `GET /api/oauth/v2/sleep` - download sleep data
21. `POST /api/oauth/v2/sleep` - upload sleep data
22. `GET /api/oauth/v2/zones` - download zones
23. `GET /api/oauth/v2/equipmentList` - download equipment list

## Parameters and request notes
### OAuth parameters visible in the official guide
- `client_id`
- `redirect_uri`
- `code`
- `state`
- `code_challenge`
- `code_challenge_method`
- `code_verifier`

### API query parameters visible in the official guide/examples
- `startdate`
- `pagesize`
- `sporttype`
- `language`
- `extraValues` / `extravalues`

### Path parameters
- `activityId` - activity identifier used on activity read/update/file routes
- `trainingId` - planned-training identifier used on training-file routes

## Response, pagination, and error notes
- The official guide is JSON-oriented.
- Collection routes exposed in the docs include list-style endpoints such as `activityList` and `plannedTrainingList`; examples in the official guide show `pagesize` and `startdate` filters for list retrieval.
- The guide is organized as a long-form integration document rather than a standalone OpenAPI spec, so common error schemas were not visible in the manually captured excerpts.
- The docs contain dedicated sections for `Rate limits` and `Security notes`, which should be re-opened directly before production adapter work if exact quota numbers or extra hardening rules are needed.

## Usage notes from the official docs
- The official intro says the API is for authorizing users into third-party applications, downloading activities, and uploading health data into user accounts.
- The guide explicitly distinguishes the Personal API from the OAuth2 API and positions OAuth2 for multi-user integrations.
- The docs surface endpoint groups for activities, planned training, health/body values, capacity, HRV, sleep, zones, equipment, and plan creation.

## fireROUTE normalization notes
- Model this provider as an OAuth-protected JSON API split across `/user/oauth/v2` token management and `/api/oauth/v2` resource endpoints.
- Preserve the current route casing from the official guide (`activityList`, `equipmentList`, `plannedTrainingList`, etc.) because the docs present those names explicitly.
- Preserve separate write/read route pairs for body values, HRV, and sleep instead of collapsing them into one pseudo-resource.