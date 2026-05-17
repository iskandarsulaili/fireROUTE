# Fitbit

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `fitbit`
- Official docs/pages used:
  - `https://dev.fitbit.com/`
  - `https://developers.google.com/health`
  - `https://developers.google.com/health/get-started`
  - `https://developers.google.com/health/scopes`
  - `https://developers.google.com/health/reference/rest`
  - `https://developers.google.com/health/reference/rest/v4/projects.subscribers/create`
  - `https://developers.google.com/health/reference/rest/v4/users/getProfile`
  - `https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/list`
- Current official API base URL: `https://health.googleapis.com`
- Current API generation reviewed: `Google Health API v4`
- Legacy-platform note from the official Fitbit developer homepage: the legacy Fitbit Web API is being deprecated in `September 2026`, and Fitbit developers are directed to migrate to the Google Health API
- Response formats: JSON by default; `exportExerciseTcx` publishes a TCX export route
- Auth model:
  - Google OAuth 2.0 user-consent scopes for user profile/settings/data routes
  - `cloud-platform` OAuth scope plus IAM permission requirements for project-level subscriber-management routes
- Public rate-limit note: no numeric quota or rate-limit table was published on the reviewed Fitbit or Google Health API pages
- Manually confirmed route count: `18`

## Authentication and access
- The official Fitbit developer homepage now points Fitbit Web API developers to the Google Health API developer site.
- The Google Health API `Get started` guide says developers should set up Google Cloud and OAuth before making calls.
- The official scopes page says all Google Health API user-data scopes begin with `https://www.googleapis.com/auth/googlehealth`.
- The reviewed scopes table documents these scope families:
  - `activity_and_fitness` and `activity_and_fitness.readonly`
  - `health_metrics_and_measurements` and `health_metrics_and_measurements.readonly`
  - `location.readonly`
  - `nutrition` and `nutrition.readonly`
  - `profile` and `profile.readonly`
  - `settings` and `settings.readonly`
  - `sleep` and `sleep.readonly`
- The official `projects.subscribers.create` method page separately requires the OAuth scope `https://www.googleapis.com/auth/cloud-platform` and IAM permission `health.subscribers.create` on the parent project.

## Canonical endpoints
### Project subscriber management
1. `POST /v4/{parent=projects/*}/subscribers` - register a webhook subscriber endpoint
2. `DELETE /v4/{name=projects/*/subscribers/*}` - delete one subscriber registration
3. `GET /v4/{parent=projects/*}/subscribers` - list subscribers in a Google Cloud project
4. `PATCH /v4/{subscriber.name=projects/*/subscribers/*}` - update one subscriber configuration

### User identity and profile/settings
5. `GET /v4/{name=users/*/identity}` - fetch the authenticated user's identity
6. `GET /v4/{name=users/*/profile}` - fetch profile details
7. `GET /v4/{name=users/*/settings}` - fetch settings details
8. `PATCH /v4/{profile.name=users/*/profile}` - update profile details
9. `PATCH /v4/{settings.name=users/*/settings}` - update settings details

### User data-type data points
10. `POST /v4/{parent=users/*/dataTypes/*}/dataPoints:batchDelete` - delete a batch of identifiable data points
11. `POST /v4/{parent=users/*/dataTypes/*}/dataPoints` - create one identifiable data point
12. `POST /v4/{parent=users/*/dataTypes/*}/dataPoints:dailyRollUp` - roll up supported data points over civil-time intervals
13. `GET /v4/{name=users/*/dataTypes/*/dataPoints/*}:exportExerciseTcx` - export exercise data in TCX format
14. `GET /v4/{name=users/*/dataTypes/*/dataPoints/*}` - fetch one identifiable data point
15. `GET /v4/{parent=users/*/dataTypes/*}/dataPoints` - list/query user health and fitness data points
16. `PATCH /v4/{dataPoint.name=users/*/dataTypes/*/dataPoints/*}` - update one identifiable data point
17. `GET /v4/{parent=users/*/dataTypes/*}/dataPoints:reconcile` - reconcile data points from multiple data sources into one stream
18. `POST /v4/{parent=users/*/dataTypes/*}/dataPoints:rollUp` - roll up supported data points over physical-time intervals

## Parameters and path notes
### Shared resource-name patterns
- `projects/*` - Google Cloud project resource for webhook-subscriber management
- `users/*` - user resource; the reviewed docs repeatedly use `users/me/...` in examples for the authenticated user
- `dataTypes/*` - data-type identifier under one user, for example `users/me/dataTypes/steps` or `users/me/dataTypes/weight`
- `dataPoints/*` - one identifiable data-point resource under a user/data-type pair

### Subscriber-management specifics
From the official `projects.subscribers.create` page:
- `parent` - required project resource, format `projects/{project}`
- `subscriberId` - optional query parameter on create; must be `4-36` characters and use lowercase `a-z`
- Subscriber endpoint verification is mandatory:
  - Google Health sends `POST` `{"type":"verification"}` with the configured Authorization secret and expects `201 Created`
  - Google Health also sends a second unauthenticated verification POST and expects `401 Unauthorized` or `403 Forbidden`
- Successful subscriber creation returns a long-running `Operation`

### User profile/settings specifics
From the official `users.getProfile` page:
- `name` is required and takes the form `users/{user}/profile`
- The docs use `users/me/profile` as the example resource name
- Profile read access requires one of the `googlehealth.profile` scopes

### Data-point listing, filtering, and pagination
From the official `users.dataTypes.dataPoints.list` page:
- `parent` is required and takes the form `users/{user}/dataTypes/{dataType}`
- `pageSize` - optional page size
  - default maximum return is `1440` data points when unspecified
  - maximum page size is `10000`
  - for `exercise` and `sleep`, the default is `25` and the maximum is also `25`
- `pageToken` - optional token from a previous response
- `filter` - optional AIP-160 filter expression
  - supports time-range filtering for interval, sample, daily-summary, exercise, and sleep shapes
  - examples on the page use RFC-3339 timestamps and ISO-8601 civil dates/times
- The list response includes `dataPoints[]` and `nextPageToken`

## Response, pagination, and error notes
- The reference overview describes the API as a REST service served from `https://health.googleapis.com` and links a discovery document at `https://health.googleapis.com/$discovery/rest?version=v4`.
- Standard response format is JSON; `exportExerciseTcx` is the notable non-JSON route published in the overview.
- Pagination is explicitly documented on `users.dataTypes.dataPoints.list` with `pageSize`, `pageToken`, and `nextPageToken`.
- The method pages say the URLs use gRPC Transcoding syntax.
- The method pages defer concrete error details to a `service error catalog`; I did not find a stable public numeric error table or quota table on the reviewed pages.
- The Google Health API landing page warns that breaking changes may still occur until the end of May 2026.

## Usage notes from the official docs
- The Google Health API landing page describes this platform as the next generation of the Fitbit Web API.
- The landing page says the new platform consolidates `100+ legacy endpoints` into a streamlined set of health-data bundles.
- The landing page highlights support for data from Fitbit, Pixel Watch, and other third-party devices and apps.
- The `Get started` page recommends waiting until the end of May 2026 to officially launch integrations so they align with legacy Fitbit account deprecation milestones.

## fireROUTE normalization notes
- Treat `fitbit` as the officially migrated Google Health API surface rather than the old legacy Fitbit Web API docs tree.
- Preserve the separation between:
  - project-level webhook subscriber administration, and
  - user-level profile/settings/data access
- Keep OAuth scope requirements explicit because they vary significantly by data family.
- Preserve Google resource-name placeholders (`users/*`, `projects/*`, `dataTypes/*`, `dataPoints/*`) rather than collapsing them into ad-hoc path parameters.
- Preserve TCX export as a format-specific route instead of forcing it into JSON-only assumptions.