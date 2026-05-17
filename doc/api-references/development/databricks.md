# Databricks

## Provider metadata
- Category: `Development`
- Provider slug: `databricks`
- Docs used manually:
  - `https://docs.databricks.com/aws/en/reference/api`
  - `https://docs.databricks.com/api/workspace/introduction`
  - `https://docs.databricks.com/api/workspace/repos/list`
  - `https://docs.databricks.com/api/workspace/repos/create`
  - `https://docs.databricks.com/api/workspace/repos/get`
  - `https://docs.databricks.com/api/workspace/repos/update`
  - `https://docs.databricks.com/api/workspace/repos/delete`
- Confirmed API base URL pattern: `https://{workspace-host}` with versioned workspace routes under `/api/2.0/...`
- Primary response format: JSON
- Authentication style confirmed in the reviewed docs:
  - OAuth is the recommended auth model for both user and service-principal access
  - personal access tokens (PATs) are still supported as a fallback when OAuth is not available
- Manually confirmed routes in this pass: `5`

## Authentication
From the official introduction page reviewed here:
- Databricks **strongly recommends OAuth** for both user and service-principal authorization when calling the REST API
- the docs explicitly point to separate official OAuth flows for:
  - interactive user access
  - unattended service-principal access
- if OAuth is not available for the environment, the docs say callers can use **Databricks personal access tokens (PATs)**
- the introduction also points users toward unified client authentication across environment variables, `.databrickscfg`, Terraform, the Databricks CLI, and Databricks SDKs

## Common request/response conventions
- Workspace-level REST calls are host-relative and use the caller's own workspace deployment host, for example:
  - `https://{workspace-host}/api/2.0/repos`
- The introduction page explicitly says Databricks REST calls often include:
  - the workspace instance name
  - the HTTP method (`GET`, `POST`, `PATCH`, `DELETE`, etc.)
  - the operation path such as `/api/2.0/clusters/get`
  - authentication information
  - request payload or query parameters when applicable
- The reviewed Repos reference pages expose an `API scopes` block for each operation; the five sampled repo routes all require the `workspace` scope
- Request and response bodies are JSON on the reviewed reference pages

## Manually confirmed endpoint set

### 1) List repos
- Method: `GET`
- Path: `/api/2.0/repos`
- Full URL pattern: `https://{workspace-host}/api/2.0/repos`
- Purpose: return Git folders (repos) that the calling user has `Manage` permissions on
- API scopes: `workspace`
- Query parameters confirmed on the official page:
  - `path_prefix` - filter repos whose workspace path starts with the provided prefix
  - `next_page_token` - continue pagination from a prior result page
- Response notes confirmed on the page:
  - success returns repo objects plus pagination info
  - if `next_page_token` is present, more results are available
  - reviewed repo fields include `branch`, `path`, `provider`, `sparse_checkout`, `url`, `head_commit_id`, and `id`
- Confirmed HTTP codes:
  - `200`
  - `401`
  - `404`
  - `500`

### 2) Create a repo
- Method: `POST`
- Path: `/api/2.0/repos`
- Purpose: create a workspace repo linked to a remote Git repository
- API scopes: `workspace`
- Important official note:
  - repos created programmatically **must** be linked to a remote Git repository, unlike some browser-created repos
- Request body fields confirmed on the official page:
  - `path` - desired workspace path
  - `provider` - required, case-insensitive Git provider
  - `url` - required remote repository URL
  - `branch` - optional initial branch
  - `sparse_checkout` - optional sparse-checkout configuration
- Git providers explicitly listed on the page:
  - `gitHub`
  - `bitbucketCloud`
  - `gitLab`
  - `azureDevOpsServices`
  - `gitHubEnterprise`
  - `bitbucketServer`
  - `gitLabEnterpriseEdition`
  - `awsCodeCommit` (explicitly labeled deprecated by AWS / not accepting new customers)
- Confirmed response fields include:
  - `branch`
  - `head_commit_id`
  - `id`
  - `path`
  - `provider`
  - `sparse_checkout`
  - `url`
- Confirmed HTTP codes:
  - `200`
  - `400`
  - `401`
  - `404`
  - `500`

### 3) Get a repo
- Method: `GET`
- Path: `/api/2.0/repos/{repo_id}`
- Purpose: fetch one repo by Databricks repo ID
- API scopes: `workspace`
- Path parameter:
  - `repo_id` - required `int64` repo identifier
- Confirmed response fields on the reviewed page:
  - `branch`
  - `head_commit_id`
  - `id`
  - `path`
  - `provider`
  - `sparse_checkout`
  - `url`
- Confirmed HTTP codes:
  - `200`
  - `401`
  - `403`
  - `404`
  - `500`

### 4) Update a repo
- Method: `PATCH`
- Path: `/api/2.0/repos/{repo_id}`
- Purpose: move the repo to another branch or tag, or refresh to the latest commit on the current branch
- API scopes: `workspace`
- Path parameter:
  - `repo_id` - required repo ID
- Request body fields confirmed:
  - `branch` - target branch
  - `tag` - target tag
  - `sparse_checkout` - sparse-checkout update payload
- Important official note:
  - checking out a `tag` puts the repo in a detached `HEAD` state; the docs explicitly warn that users should move back to a branch before committing changes
- Confirmed HTTP codes:
  - `200`
  - `400`
  - `401`
  - `403`
  - `404`
  - `500`

### 5) Delete a repo
- Method: `DELETE`
- Path: `/api/2.0/repos/{repo_id}`
- Purpose: delete a repo from the workspace
- API scopes: `workspace`
- Path parameter:
  - `repo_id` - required repo ID
- Response note:
  - the reviewed page shows an empty `{}` response sample on success
- Confirmed HTTP codes:
  - `200`
  - `401`
  - `403`
  - `404`
  - `500`

## Pagination
From the official pages reviewed here:
- Repos listing uses token-based pagination via `next_page_token`
- the list response includes a response-level `next_page_token`
- callers pass that token back as the `next_page_token` query parameter on the next `GET /api/2.0/repos` call
- the reviewed create/get/update/delete repo operations do not expose pagination

## Rate limits
From the official introduction page:
- Databricks enforces rate limits for **all REST API calls**
- limits are set **per endpoint** and **per workspace**
- requests that exceed the limit return HTTP `429`
- the reviewed public intro page does **not** publish concrete numeric per-endpoint quotas, so this file intentionally does not invent them

## Error and response notes
Confirmed from the official introduction and repo route pages:
- `429` is the documented generic rate-limit status
- repo pages list operation-specific possible HTTP codes instead of a single universal error schema
- reviewed repo routes commonly advertise combinations of:
  - `400`
  - `401`
  - `403`
  - `404`
  - `500`
- the reference UI exposes structured field-level response schemas and examples for success payloads

## Important usage notes
- The original README URL now lands on an overview/index page; route-level details are clearer on the current workspace REST reference pages under `https://docs.databricks.com/api/workspace/...`
- Workspace hostnames are tenant-specific, so fireROUTE should treat the hostname as configuration and the reviewed `/api/2.0/...` path patterns as canonical
- The introduction page explicitly calls out runtime-version-string handling elsewhere in the API; many non-repo Databricks routes depend on those version strings, but that detail was outside the five repo operations reviewed here
- This manual rebuild only counts the five repo operations directly inspected in this pass, not the full Databricks platform surface

## Verification notes
This file was manually rebuilt from the official Databricks documentation pages reachable in this browser session, replacing the earlier low-fidelity generated summary.
