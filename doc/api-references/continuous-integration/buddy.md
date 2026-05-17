# Buddy

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `buddy`
- Docs used manually:
  - `https://buddy.works/docs/api/getting-started/overview`
  - `https://buddy.works/docs/api/environment/list`
  - `https://buddy.works/docs/api/environment/create`
  - `https://buddy.works/docs/api/environment/get`
  - `https://buddy.works/docs/api/environment/edit`
  - `https://buddy.works/docs/api/environment/delete`
- Confirmed API base URLs:
  - `https://api.buddy.works` for US cloud accounts
  - `https://api.eu.buddy.works` for EU cloud accounts
  - `https://YOUR-IP-ADDRESS/api` for self-hosted Buddy installations
- Primary media type: JSON
- Versioning note: the reviewed docs are Buddy's current unversioned HTTPS API docs
- Manually confirmed routes in this pass: `5`

## Authentication
From the official Buddy overview page:
- authentication is performed with OAuth 2.0
- requests with an access token use the header:
  - `Authorization: Bearer <access_token>`
- the API is disabled by default for each workspace and must be explicitly enabled in **Workspace Settings -> Workspace -> Developer API**
- route-level permissions follow the same permission rules as the Buddy web application

## Common request/response conventions
- all requests and responses are JSON
- all API calls must use HTTPS
- empty fields are returned as `NULL` rather than being omitted
- the docs state dates are returned in ISO format:
  - `yyyy-MM-dd'T'HH:mm:ssZ`
- list operations return summary objects, while single-resource fetches return more detailed objects
- the reviewed environment routes use workspace slugs in the path:
  - `/workspaces/:workspace/...`

## Manually confirmed endpoint set

### 1) List environments
- Method: `GET`
- Path: `/workspaces/{workspace}/environments`
- Full URL example: `https://api.buddy.works/workspaces/{workspace}/environments`
- Purpose: get all environments in a workspace
- Required scope: `ENVIRONMENT_INFO`
- Path parameters:
  - `workspace` - required human-readable workspace ID
- Query parameters confirmed on the official page:
  - `project_name` - optional project name filter
- Response notes:
  - returns a JSON array of summary environment objects
  - reviewed fields include `url`, `html_url`, `name`, `identifier`, `id`, `tags`, and `scope`
  - official example status: `200 OK`

### 2) Create environment
- Method: `POST`
- Path: `/workspaces/{workspace}/environments`
- Full URL example: `https://api.buddy.works/workspaces/{workspace}/environments`
- Purpose: create a new environment
- Required scope: `ENVIRONMENT_MANAGE`
- Path parameters:
  - `workspace` - required human-readable workspace ID
- Request body fields confirmed on the official page:
  - `name` - required environment name
  - `identifier` - required human-readable ID; alphanumeric, underscores, and hyphens are allowed, but hyphens cannot appear at the start or end
  - `tags` - optional string array
  - `icon` - optional string
  - `public_url` - optional string
  - `pipelines_access_level` - optional enum controlling whether all pipelines can inherit to this environment
  - `environments_access_level` - optional enum controlling whether all pipelines can use this environment
  - `allowed_pipelines` - optional list of pipeline references
  - `allowed_environments` - optional list of environment references
  - `project` - optional project reference
  - `permissions` - optional permissions object
  - `base_environments` - optional string array of base environment references
  - `base_only` - optional boolean
  - `scope` - optional enum
- Response notes:
  - returns a JSON environment object
  - official example status: `201 Created`

### 3) Get environment by ID
- Method: `GET`
- Path: `/workspaces/{workspace}/environments/{environment_id}`
- Full URL example: `https://api.buddy.works/workspaces/{workspace}/environments/{environment_id}`
- Purpose: fetch one specific environment
- Required scope: `ENVIRONMENT_INFO`
- Path parameters:
  - `workspace` - required human-readable workspace ID
  - `environment_id` - required environment ID
- Response notes:
  - returns a detailed JSON environment object
  - reviewed fields include `create_date`, `targets`, `project`, `permissions`, `base_environments`, `base_only`, and `scope` in addition to the list-route summary fields
  - official example uses `200 OK`

### 4) Edit environment
- Method: `PATCH`
- Path: `/workspaces/{workspace}/environments/{environment_id}`
- Full URL example: `https://api.buddy.works/workspaces/{workspace}/environments/{environment_id}`
- Purpose: update environment configuration
- Required scope: `ENVIRONMENT_MANAGE`
- Path parameters:
  - `workspace` - required human-readable workspace ID
  - `environment_id` - required environment ID
- Request body fields confirmed on the official page:
  - `name`
  - `identifier`
  - `tags`
  - `icon`
  - `public_url`
  - `pipelines_access_level`
  - `environments_access_level`
  - `allowed_pipelines`
  - `allowed_environments`
  - `project`
  - `permissions`
  - `base_environments`
  - `base_only`
  - `scope`
- Response notes:
  - returns the updated environment object as JSON
  - official example status: `200 OK`

### 5) Delete environment
- Method: `DELETE`
- Path: `/workspaces/{workspace}/environments/{environment_id}`
- Full URL example: `https://api.buddy.works/workspaces/{workspace}/environments/{environment_id}`
- Purpose: delete an environment
- Required scope: `ENVIRONMENT_MANAGE`
- Path parameters:
  - `workspace` - required human-readable workspace ID
  - `environment_id` - required environment ID
- Response notes:
  - official example status: `204 Environment deleted successfully`
  - reviewed page did not show a JSON body for the success case

## Pagination
- no pagination controls were documented on the reviewed environment routes
- the overview page notes that list endpoints may return summary objects rather than fully detailed objects

## Rate limits
- the reviewed Buddy overview and environment pages did not publish numeric rate-limit quotas or reset headers

## Error and response notes
- the reviewed route pages were more explicit about success responses than about error schemas
- the docs emphasize JSON over HTTPS and return `NULL` for empty fields
- permission enforcement mirrors the Buddy web app, so authorization failures depend on the caller's workspace/project privileges

## Important usage notes
- you must enable the Developer API in each workspace before these endpoints are usable
- the cloud API host differs by region (`api.buddy.works` vs `api.eu.buddy.works`)
- self-hosted installs use a host-relative API root ending in `/api`
- environment permissions and inheritance controls are part of the environment payload itself, so fireROUTE adapters should preserve those structures rather than flattening them

## Verification notes
This file was manually rebuilt from the official Buddy API docs using browser inspection.