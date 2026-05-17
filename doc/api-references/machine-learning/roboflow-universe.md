# Roboflow Universe

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `roboflow-universe`
- Docs used manually:
  - `https://universe.roboflow.com/`
  - `https://docs.roboflow.com/developer/rest-api/fork-a-universe-project`
  - `https://docs.roboflow.com/developer/rest-api/async-tasks`
  - `https://docs.roboflow.com/developer/rest-api/run-a-model-on-an-image`
  - `https://docs.roboflow.com/developer/authentication/scoped-api-keys`
  - `https://docs.roboflow.com/developer/errors-and-status-codes`
- Confirmed API base URLs in this pass:
  - `https://api.roboflow.com`
  - `https://serverless.roboflow.com`
- Primary response format confirmed in this pass: JSON
- Authentication model confirmed in this pass: API key required; Roboflow examples pass it either as the `api_key` query parameter or as `api_key` in the JSON body for workflow inference
- Manually confirmed routes in this pass: `4`

## Authentication
- Roboflow's reviewed REST examples use `api_key` on the query string.
- The reviewed Serverless v2 workflow example sends `api_key` inside the JSON request body.
- The reviewed model-inference example sends `api_key` on the query string.
- Scoped API keys are available for Enterprise customers.
- The Universe-fork route explicitly requires an API key with the `project:create` scope.
- Async-task polling must use an API key that has access to the same workspace named in the request path.

## Common request/response conventions
- REST base URL for workspace management and async-task polling: `https://api.roboflow.com`
- Hosted inference base URL for current Serverless v2 inference: `https://serverless.roboflow.com`
- The reviewed docs consistently describe JSON responses for REST and async-task APIs.
- The current hosted model route uses multipart form upload in the official cURL example.
- The current hosted workflow route uses `Content-Type: application/json`.
- Roboflow says the legacy task-specific hosts `detect.roboflow.com`, `classify.roboflow.com`, `outline.roboflow.com`, and `segment.roboflow.com` are deprecated; new integrations should use `serverless.roboflow.com`.

## Manually confirmed endpoint set

### 1) Fork a public Roboflow Universe project into a workspace
- Method: `POST`
- Path: `/{workspace}/projects/fork`
- Full URL pattern: https://api.roboflow.com/{workspace}/projects/fork with `api_key` query authentication
- Purpose: copy a public Universe project into a target Roboflow workspace as a new project
- Auth notes:
  - API key required
  - reviewed docs require `project:create` scope
- Path parameters:
  - `workspace` - target workspace slug that will receive the forked project
- Body parameters confirmed on the official page:
  - `url` - optional string full Universe project URL; required unless `source_project` is provided
  - `source_project` - optional string source Universe project slug; required unless `url` is provided
- Request format:
  - `Content-Type: application/json`
- Response notes:
  - returns `202 Accepted`
  - response includes `taskId` and a polling `url`
  - forking is asynchronous; completion details come from the async-task endpoint
- Explicitly documented route errors:
  - `402` insufficient credits or image quota in the target workspace
  - `403` source project is not public
  - `404` source project not found, API key missing required scope, or API key not tied to target workspace
  - `409` target workspace already owns the source project
  - `422` required parameters missing or supplied URL does not contain a project slug

### 2) Poll an async task
- Method: `GET`
- Path: `/{workspace}/asynctasks/{id}`
- Full URL pattern: https://api.roboflow.com/{workspace}/asynctasks/{id} with `api_key` query authentication
- Purpose: check progress and final result for asynchronous jobs such as Universe-project forks
- Path parameters:
  - `workspace` - workspace that owns the task
  - `id` - async task ID returned by an earlier asynchronous API call
- Query parameters confirmed in the official example:
  - `api_key` - required API key
- Response fields documented on the official page:
  - `taskId` - string task identifier
  - `status` - common values include `created`, `running`, `completed`, `failed`
  - `progress` - optional object with `current` and `total`
  - `result` - object present on success
  - `error` - string present on failure
- Important route note:
  - tasks from other workspaces return `404`
- Explicitly documented route errors:
  - `404` task not found or task belongs to another workspace

### 3) Run a hosted model on an image with Serverless v2
- Method: `POST`
- Path: `/infer/{workspace}/{project}/{version}`
- Full URL pattern: `https://serverless.roboflow.com/infer/{workspace}/{project}/{version}?api_key=...&confidence=...`
- Purpose: run hosted inference against a specific Roboflow model version
- Path parameters confirmed in the reviewed docs:
  - `workspace` - workspace slug
  - `project` - project slug
  - `version` - model version identifier
- Query parameters directly shown in the official example:
  - `api_key` - API key
  - `confidence` - confidence threshold
- Request body / upload notes:
  - official example uses multipart form data with `file=@photo.jpg`
- Usage notes:
  - Roboflow positions this as the current default hosted inference endpoint
  - the page says deeper request/response details live in the deployment/product docs section

### 4) Run a hosted workflow with Serverless v2
- Method: `POST`
- Path: `/infer/workflows/{workspace}/{workflow}`
- Full URL pattern: `https://serverless.roboflow.com/infer/workflows/{workspace}/{workflow}`
- Purpose: execute a Roboflow Workflow on hosted infrastructure
- Path parameters:
  - `workspace` - workspace slug
  - `workflow` - workflow identifier
- Request format:
  - `Content-Type: application/json`
- JSON body fields directly shown in the official example:
  - `api_key` - API key string
  - `inputs` - object of workflow inputs
  - `inputs.image.type` - example value `url`
  - `inputs.image.value` - image URL string
- Usage notes:
  - the official page says the full request/response reference, including streaming, batching, and task-specific response shapes, lives in the deployment docs

## Pagination
- None of the four reviewed Roboflow Universe-related routes document pagination.
- The async-task route returns a single task status object rather than a list.

## Rate limits
- The reviewed Roboflow docs do not publish a numeric public requests-per-minute table for these routes.
- Roboflow's shared error reference states that `429` means the client is rate limited and should retry with exponential backoff.

## Error handling
From Roboflow's shared error reference and the route-specific pages reviewed in this pass:
- `200` success with JSON response body
- `202` accepted for asynchronous fork creation
- `204` success with no body for some other Roboflow PATCH/DELETE endpoints; not specifically shown for the four routes above
- `400` malformed request
- `401` missing or invalid API key, or key lacking required scope
- `402` insufficient credits or quota on Universe project fork
- `403` authenticated but forbidden, including private/non-public source project on fork
- `404` missing resource, hidden resource, wrong workspace, or missing required scope on some route-specific cases
- `409` conflicting resource state, including attempting to fork a project already owned by the target workspace
- `423` workspace billing paused
- `429` rate limited; retry with backoff
- `5xx` server-side error; Roboflow says these are safe to retry with backoff
- Standard REST error bodies include at least a top-level `error` field in JSON

## Response format notes
- Async-task polling returns JSON status objects and, on completion, a JSON `result` object.
- The official async-task page shows a completed Universe-fork result containing fields such as `forked`, `datasetUrl`, `id`, `name`, and `url`.
- Roboflow's error-reference page says successful REST responses use JSON and error responses include a top-level `error` field.

## Important usage notes
- Universe project forking is asynchronous; clients should not expect project details in the initial `202` response.
- A full Universe URL can include extra path segments like `/browse` and query parameters; the fork endpoint still accepts it as long as the project slug is present.
- New code should use `serverless.roboflow.com`; Roboflow explicitly labels the older task-specific inference hosts as deprecated compatibility surfaces.
- Scoped API keys matter for production integrations because route access can fail even when a key is otherwise valid for the workspace.

## Verification notes
This file was manually rebuilt from Roboflow's official Universe site and official Roboflow documentation pages for Universe project forking, async tasks, hosted inference, scoped API keys, and shared error behavior.