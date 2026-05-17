# Flowdash

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `flowdash`
- Docs/pages reviewed manually:
  - `https://docs.flowdash.com/docs/api-introduction`
  - `https://docs.flowdash.com/docs/api`
  - `https://docs.flowdash.com/docs/api/authorization`
  - `https://docs.flowdash.com/docs/api/actions-api`
  - `https://docs.flowdash.com/docs/api/checklist-api`
  - `https://docs.flowdash.com/docs/api/comments-api`
  - `https://docs.flowdash.com/docs/api/data-syncs-api`
  - `https://docs.flowdash.com/docs/api/fields-api`
  - `https://docs.flowdash.com/docs/api/files-api`
  - `https://docs.flowdash.com/docs/api/roles-api`
  - `https://docs.flowdash.com/docs/api/stages-api`
  - `https://docs.flowdash.com/docs/api/tasks-api`
  - `https://docs.flowdash.com/docs/api/users-api`
  - `https://docs.flowdash.com/docs/api/workflows-api`
  - `https://docs.flowdash.com/docs/api/workspace-api`
  - `https://docs.flowdash.com/docs/api/analytics-export`
- Confirmed API base URL: `https://app.flowdash.com/api/v1`
- Primary exchange format: JSON over HTTPS
- Manually confirmed routes in this pass: `28`
- Route-method breakdown confirmed from the current official docs:
  - `17` `GET`
  - `6` `POST`
  - `2` `PUT`
  - `3` `DELETE`

## What the official docs confirm
- The original `api-introduction` docs URL currently resolves into the main API reference at `https://docs.flowdash.com/docs/api`.
- Flowdash exposes a workspace-key-authenticated API rooted at `https://app.flowdash.com/api/v1`.
- The current official docs expose `28` concrete method+path operations across task, workflow, user, checklist, analytics, and automation-related families.
- The docs are prose/tutorial style rather than an OpenAPI reference, so route details are spread across multiple API-family pages.

## Authentication
From the current official Authorization page:
- Every request must include a workspace API key in the `Authorization` header.
- Header format:
  - `Authorization: Bearer YOUR_API_KEY`
- API keys are created and revoked from `Workspace Settings > API`.

## Rate limits and pagination
- No global numeric rate limit was published on the reviewed official Flowdash API pages.
- No shared pagination contract was published for the reviewed list endpoints.
- The reviewed docs mainly show direct list returns and route-specific filtering.
- The analytics export flow is explicitly asynchronous and uses an export ID/status polling pattern rather than pagination.

## Request, format, and parameter conventions
From the current official docs:
- Base path family: `/api/v1/...`
- Workflow-scoped resources commonly use:
  - `workflow-id`
  - `unique-id`
  - `user_id`
  - `execution-id`
  - `blob_id`
  - `export-id`
- Task filtering is query-string driven and the docs show filters based on workflow field names, for example:
  - `Assigned To`
  - `Stage`
  - any other configured field such as `Company ID`
- File-field updates on tasks can include file objects with:
  - `blobId`
  - `contentType`
  - `filename`
  - `base64contents`
  - remote downloadable URL input
- Analytics export creation requires JSON body fields:
  - `start_date`
  - `end_date`
- Checklist routes support stage filtering with:
  - `Stage`

## Error notes
The reviewed docs surface these concrete error/status behaviors:
- `2xx` indicates task creation/update success on the tasks API
- `422` on task create/update when request data is invalid; example response uses an `errors` object keyed by field name
- `404` on `PUT` task update when the specified unique-id does not already exist
- `422` on action execution when required conditions/checklists/assignments are missing; example response uses:
  - `status: "Fail"`
  - `errors: [...]`
- `204` on successful user deletion
- Action execution polling returns statuses:
  - `Pending`
  - `Success`
  - `Fail`

## Important usage notes
- Flowdash optionally supports a workflow-level Unique ID field; if configured, task writes are keyed off that field.
- `POST` on the tasks collection has upsert semantics.
- `PUT` on the tasks collection has update-only semantics and returns `404` if the task does not already exist.
- Linked tasks are included in task-list responses and have their own dedicated docs page, but the reviewed linked-task page did not add new distinct HTTP route paths beyond the main tasks surface.
- The analytics export flow is asynchronous: create export, then poll the export ID until `file_url` is available.

## Confirmed route surface summary
The current official Flowdash docs expose `28` operations across these route families:
- `Tasks API` -> `6`
- `Actions API` -> `3`
- `Checklist API` -> `5`
- `Users API` -> `3`
- `Comments API` -> `2`
- `Analytics Export API` -> `2`
- `Data Syncs API` -> `1`
- `Fields API` -> `1`
- `Files API` -> `1`
- `Roles API` -> `1`
- `Stages API` -> `1`
- `Workflows API` -> `1`
- `Workspace API` -> `1`

## Exact route inventory confirmed from the current official docs

### Actions API (`3` routes)
- `GET /workflows/<workflow-id>/tasks/<unique-id>/actions`
- `POST /workflows/<workflow-id>/executions`
- `GET /workflows/<workflow-id>/executions/<execution-id>`

### Checklist API (`5` routes)
- `GET /workflows/<workflow-id>/tasks/<unique_id>/checklist_items`
- `GET /workflows/<workflow-id>/tasks/<unique_id>/checklist_items/<id>`
- `POST /workflows/<workflow-id>/tasks/<unique_id>/checklist_items`
- `PUT /workflows/<workflow-id>/tasks/<unique_id>/checklist_items/<id>`
- `DELETE /workflows/<workflow-id>/tasks/<unique_id>/checklist_items/<id>`

Note: the list endpoint also supports the documented optional filter form `?Stage=...`; this is a query variation of the same `GET` route, not a separate route path.

### Comments API (`2` routes)
- `GET /workflows/<workflow-id>/tasks/<unique_id>/comments`
- `POST /workflows/<workflow-id>/tasks/<unique_id>/comments`

### Data Syncs API (`1` route)
- `POST /workflows/<workflow-id>/data_syncs`

### Fields API (`1` route)
- `GET /workflows/<workflow-id>/fields`

### Files API (`1` route)
- `GET /files/<blob_id>`

### Roles API (`1` route)
- `GET /workflows/<workflow-id>/roles`

### Stages API (`1` route)
- `GET /workflows/<workflow-id>/stages`

### Tasks API (`6` routes)
- `GET /workflows/<workflow-id>/tasks`
- `GET /workflows/<workflow-id>/tasks/active`
- `GET /workflows/<workflow-id>/tasks/<unique-id>`
- `POST /workflows/<workflow-id>/tasks`
- `PUT /workflows/<workflow-id>/tasks`
- `DELETE /workflows/<workflow-id>/tasks/<unique-id>`

### Users API (`3` routes)
- `GET /workflows/<workflow-id>/users`
- `GET /workflows/<workflow-id>/users/<user_id>`
- `DELETE /workflows/<workflow-id>/users/<user_id>`

### Workflows API (`1` route)
- `GET /workflows`

### Workspace API (`1` route)
- `GET /workspace`

### Analytics Export API (`2` routes)
- `POST /workflows/<workflow-id>/analytics/exports`
- `GET /workflows/<workflow-id>/analytics/exports/<export-id>`

## Route-specific parameter/body notes from the reviewed docs
Representative officially documented request details include:
- `GET /workflows/<workflow-id>/tasks`
  - query filters can use workflow field names such as `Stage`, `Assigned To`, and other configured field labels
- `POST /workflows/<workflow-id>/tasks`
  - body includes workflow field values plus optional built-in fields such as `Stage` and `Assigned To`
  - file fields can include `base64contents` or remote downloadable URLs
- `PUT /workflows/<workflow-id>/tasks`
  - same body style as `POST`, but update-only semantics
- `POST /workflows/<workflow-id>/executions`
  - body: `task_id`, `action_id`, optional `performed_by`
- `POST /workflows/<workflow-id>/tasks/<unique_id>/checklist_items`
  - body includes `title`, `Stage`, and optional checklist fields
- `PUT /workflows/<workflow-id>/tasks/<unique_id>/checklist_items/<id>`
  - body can update values such as `status`
- `POST /workflows/<workflow-id>/tasks/<unique_id>/comments`
  - body: `body`
- `POST /workflows/<workflow-id>/analytics/exports`
  - body: `start_date`, `end_date`

## Integration notes for fireROUTE
- Expect field-name-driven payloads and filters rather than a rigid normalized schema.
- Preserve Unique-ID semantics when mapping task writes.
- Treat analytics export as a job flow, not a direct download route.
- Preserve Flowdash file-field structures rather than flattening them too aggressively.