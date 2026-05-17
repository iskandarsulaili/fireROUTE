# Google Firebase

## Provider metadata
- Category: `Development`
- Provider slug: `google-firebase`
- Docs used manually:
  - `https://firebase.google.com/docs/reference/firebase-management/rest`
  - `https://firebase.googleapis.com/$discovery/rest?version=v1beta1`
- Reviewed API surface: Firebase Management REST API (`v1beta1`)
- Confirmed base URL: `https://firebase.googleapis.com`
- Discovery document: `https://firebase.googleapis.com/$discovery/rest?version=v1beta1`
- Primary format: JSON
- Manually confirmed routes in this pass: `11`

## Authentication
The reviewed official Firebase Management API docs do **not** use a simple public API-key model for management calls.

Confirmed from the official discovery document:
- Auth type: OAuth 2.0 Bearer token.
- Supported OAuth scopes:
  - `https://www.googleapis.com/auth/cloud-platform`
  - `https://www.googleapis.com/auth/cloud-platform.read-only`
  - `https://www.googleapis.com/auth/firebase`
  - `https://www.googleapis.com/auth/firebase.readonly`
- Write operations like project/app creation use write scopes (`cloud-platform` or `firebase`).
- Read operations also allow read-only scopes (`cloud-platform.read-only` or `firebase.readonly`).

Important auth nuance:
- Firebase app **configuration artifacts** may include API-key values for client SDK use, but those are not the auth mechanism for calling the Firebase Management API itself.
- The old category index metadata said `apiKey`; the currently reviewed official management reference shows OAuth 2.0 instead.

## Common request/response conventions
- All reviewed URIs are relative to `https://firebase.googleapis.com`.
- Version family reviewed: `/v1beta1/...`.
- Request and response bodies use JSON.
- Google-style long-running operations are returned for provisioning flows.
- Long-running operation responses use the standard `Operation` shape with fields like:
  - `name`
  - `done`
  - `metadata`
  - `response`
  - `error`
- Error payloads use Google `Status` / `google.rpc.Status` semantics with:
  - `code`
  - `message`
  - `details`

## Manually confirmed endpoint set

### 1) List projects that can still have Firebase added
- Method: `GET`
- Path: `/v1beta1/availableProjects`
- Full URL: `https://firebase.googleapis.com/v1beta1/availableProjects`
- Purpose: list Google Cloud projects that are eligible to have Firebase resources added.
- Query parameters confirmed from the official discovery/reference:
  - `pageSize` - optional integer page size
  - `pageToken` - optional pagination token
- Response notes:
  - returns a paginated JSON response
  - this is the pre-provisioning discovery surface for candidate Google Cloud projects

### 2) Poll a long-running operation
- Method: `GET`
- Path: `/v1beta1/{name=operations/**}`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{name=operations/**}`
- Required path parameter:
  - `name` - operation resource name matching `operations/...`
- Purpose: check progress/result for long-running create/link/provision operations.
- Response fields explicitly documented in `Operation`:
  - `name`
  - `done`
  - `metadata`
  - `response`
  - `error`

### 3) Add Firebase to an existing Google Cloud project
- Method: `POST`
- Path: `/v1beta1/{project=projects/*}:addFirebase`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{project=projects/*}:addFirebase`
- Required path parameter:
  - `project` - `projects/{PROJECT_IDENTIFIER}`
- Request body:
  - `locationId` - documented but explicitly deprecated/possibly ignored for newly provisioned projects after October 30, 2024
- Response:
  - returns a long-running `Operation`
  - successful operation response resolves to a `FirebaseProject`
  - failed operation resolves to a Google `Status` error
- Important usage note from the docs:
  - caller needs the documented IAM permissions including `firebase.projects.update`, `resourcemanager.projects.get`, and service usage permissions

### 4) List Firebase projects accessible to the caller
- Method: `GET`
- Path: `/v1beta1/projects`
- Full URL: `https://firebase.googleapis.com/v1beta1/projects`
- Query parameters:
  - `pageSize` - optional maximum results
  - `pageToken` - optional continuation token
  - `showDeleted` - optional boolean to include deleted projects
- Response schema fields confirmed from `ListFirebaseProjectsResponse`:
  - `results` - array of `FirebaseProject`
  - `nextPageToken` - short-lived pagination token
- Official consistency note:
  - listing is eventually consistent with project mutations
  - only `ACTIVE` projects are returned unless `showDeleted=true`

### 5) Get one Firebase project
- Method: `GET`
- Path: `/v1beta1/{name=projects/*}`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{name=projects/*}`
- Required path parameter:
  - `name` - `projects/{PROJECT_IDENTIFIER}`
- Response fields confirmed on the `FirebaseProject` schema include:
  - `name`
  - `displayName`
  - `projectId`
  - `projectNumber`
  - `annotations`
  - `etag`
  - `state`

### 6) Update a Firebase project
- Method: `PATCH`
- Path: `/v1beta1/{name=projects/*}`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{name=projects/*}`
- Required parameters:
  - path `name` - project resource name
  - query `updateMask` - field mask selecting mutable fields to update
- Request body:
  - `FirebaseProject` object
- Important docs note:
  - immutable fields include `name`, `project_id`, and `project_number`
  - project lifecycle/state changes are handled through Google Cloud Resource Manager endpoints instead of this patch call

### 7) Search all apps under a Firebase project
- Method: `GET`
- Path: `/v1beta1/{parent=projects/*}:searchApps`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{parent=projects/*}:searchApps`
- Required path parameter:
  - `parent` - `projects/{PROJECT_IDENTIFIER}`
- Query parameters:
  - `filter` - AIP-160 filter string; official docs call out fields like `app_id`, `namespace`, `platform`, plus virtual fields such as `sha1_hash`, `sha256_hash`, `app_store_id`, and `team_id`
  - `pageSize`
  - `pageToken`
  - `showDeleted`
- Response schema fields:
  - `apps`
  - `nextPageToken`

### 8) Create an Android app in a Firebase project
- Method: `POST`
- Path: `/v1beta1/{parent=projects/*}/androidApps`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{parent=projects/*}/androidApps`
- Required path parameter:
  - `parent` - project resource name
- Request body uses the `AndroidApp` schema. Confirmed writable/request-relevant fields include:
  - `displayName`
  - `packageName`
  - `apiKeyId`
  - `sha1Hashes`
  - `sha256Hashes`
  - `etag`
- Response:
  - long-running `Operation`
- Important usage note:
  - if `apiKeyId` is omitted, Firebase can auto-associate or provision a valid API key for the app

### 9) Download Android app config
- Method: `GET`
- Path: `/v1beta1/{name=projects/*/androidApps/*/config}`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{name=projects/*/androidApps/*/config}`
- Required path parameter:
  - `name` - app config resource name
- Officially documented alternate addressing note:
  - because `APP_ID` is globally unique, the docs also allow the unique-resource shortcut form `projects/-/androidApps/APP_ID/config`
- Response fields confirmed in `AndroidAppConfig`:
  - `configFilename` (for example `google-services.json`)
  - `configFileContents` (base64-encoded bytes)

### 10) Create a web app in a Firebase project
- Method: `POST`
- Path: `/v1beta1/{parent=projects/*}/webApps`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{parent=projects/*}/webApps`
- Required path parameter:
  - `parent` - project resource name
- Request body uses the `WebApp` schema. Confirmed request-relevant fields include:
  - `displayName`
  - `apiKeyId`
  - `appUrls`
  - `etag`
- Response:
  - long-running `Operation`
- Important usage note:
  - the reviewed schema shows `webId` as deprecated and recommends using `appId`

### 11) Download web app config
- Method: `GET`
- Path: `/v1beta1/{name=projects/*/webApps/*/config}`
- Full URL pattern: `https://firebase.googleapis.com/v1beta1/{name=projects/*/webApps/*/config}`
- Required path parameter:
  - `name` - web-app config resource name
- Officially documented alternate addressing note:
  - the docs also allow `projects/-/webApps/APP_ID/config`
- Response fields confirmed in `WebAppConfig` include:
  - `apiKey`
  - `appId`
  - `authDomain`
  - `databaseURL` (deprecated)
  - `locationId` (deprecated)
  - `measurementId`
  - `messagingSenderId`
  - `projectId`
  - `projectNumber`
  - `realtimeDatabaseUrl`
  - `storageBucket` (deprecated)
  - `version`

## Pagination, long-running operations, and errors
- Pagination is explicitly documented through `pageToken` request parameters and `nextPageToken` response fields.
- `nextPageToken` values are described as short-lived and should not be persisted long term.
- Provisioning calls return long-running `Operation` resources that must be polled with `GET /v1beta1/{name=operations/**}` until `done=true`.
- Failed operations and other API failures use Google `Status` objects with `code`, `message`, and `details`.
- Two reviewed legacy location endpoints are explicitly decommissioned and documented to return `404` if called:
  - `GET /v1beta1/{parent=projects/*}/availableLocations`
  - `POST /v1beta1/{parent=projects/*}/defaultLocation:finalize`

## Rate limits / quotas
- The reviewed official reference and discovery document did **not** publish a numeric per-minute rate-limit table.
- The docs instead emphasize OAuth scopes, IAM permissions, long-running operations, and standard Google API behavior.
- Any enforcement beyond that should be treated as product quota / Google Cloud policy that was not numerically specified on the reviewed pages.

## Important usage notes
- The reviewed reference is specifically the **Firebase Management API**, not every Firebase product API.
- Project and app creation calls are asynchronous and should be integrated with operation polling.
- The docs repeatedly recommend using project numbers where possible for stable project identification.
- Several older “default location” fields/endpoints are now deprecated or decommissioned; product-specific APIs should be used for resource locations instead.
- The API reference exposes many more routes than the ones documented here; this file records only the routes manually inspected in this pass.

## Verification notes
This file was manually rebuilt from Firebase’s official Management API reference page plus the official discovery document, replacing the earlier autogenerated summary.