# CircleCI

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `circleci`
- Docs used manually:
  - `https://circleci.com/docs/api/v2/`
- Confirmed REST API base URL: `https://circleci.com/api/v2`
- Primary media type: JSON
- Versioning note: reviewed docs are for API `v2`
- Manually confirmed routes in this pass: `6`

## Authentication
From the official CircleCI API v2 documentation page:
- reviewed operations all list the same supported auth schemes:
  - `api_key_header`
  - `basic_auth`
  - `api_key_query`
- the rendered docs page did not surface the concrete header/query parameter names in the reviewed text blocks, so I am documenting the official scheme names exactly as shown rather than guessing

## Common request/response conventions
- Base URL: `https://circleci.com/api/v2`
- responses are JSON objects or JSON collections according to the route descriptions
- many collection endpoints use a `page-token` query parameter for pagination
- common explicitly shown error statuses across reviewed routes include `400`, `401`, `404`, `429`, and `500`
- the docs repeatedly refer to `project-slug` values in the form `vcs-slug/org-name/repo-name`, with special `circleci/.../...` slug rules for GitLab and GitHub App projects

## Manually confirmed endpoint set

### 1) Get current user information
- Method: `GET`
- Path: `/me`
- Full URL: `https://circleci.com/api/v2/me`
- Purpose: return information about the currently signed-in user
- Request parameters: none shown on the reviewed route block
- Response notes from the official page:
  - `200` - user login information
  - default error response otherwise

### 2) List all pipelines for a project
- Method: `GET`
- Path: `/project/{project-slug}/pipeline`
- Full URL: `https://circleci.com/api/v2/project/{project-slug}/pipeline`
- Purpose: return all pipelines for a specific project
- Path parameters:
  - `project-slug` - required; format described as `vcs-slug/org-name/repo-name`, with `circleci/{org-id}/{project-id}` used for GitLab/GitHub App projects
- Query parameters confirmed on the official page:
  - `branch` - optional VCS branch name filter
  - `page-token` - optional token for the next page of results
- Response notes from the official page:
  - `200` - a sequence of pipelines
  - default error response otherwise

### 3) Trigger a new pipeline on a project (legacy project-slug trigger)
- Method: `POST`
- Path: `/project/{project-slug}/pipeline`
- Full URL: `https://circleci.com/api/v2/project/{project-slug}/pipeline`
- Purpose: trigger a new pipeline for a project
- Path parameters:
  - `project-slug` - required
- Request body fields confirmed on the official page:
  - `branch` - mutually exclusive with `tag`; docs include PR ref guidance like `pull/<number>/head` or `pull/<number>/merge` for GitHub
  - `tag` - mutually exclusive with `branch`
  - `parameters` - object of pipeline parameters; docs state size limits of `100` max entries, `128` max key length, and `512` max value length
- Response notes from the official page:
  - `201` - created pipeline
  - default error response otherwise
- Important usage note from the official page:
  - this endpoint is explicitly marked as superseded by the newer Trigger Pipeline API and does not support GitLab or GitHub App integrated pipelines

### 4) Trigger a new pipeline (recommended route)
- Method: `POST`
- Path: `/project/{provider}/{organization}/{project}/pipeline/run`
- Full URL: `https://circleci.com/api/v2/project/{provider}/{organization}/{project}/pipeline/run`
- Purpose: trigger a pipeline using a pipeline definition ID
- Path parameters confirmed on the official page:
  - `provider` - enum includes `github`, `gh`, `bitbucket`, `bb`, `circleci`
  - `organization` - second slash-separated slug segment
  - `project` - third slash-separated slug segment
- Request body fields confirmed on the official page:
  - `definition_id` - required pipeline definition UUID
- Important usage notes from the official page:
  - currently supported only for pipeline definitions whose `config_source.provider` is `github_app`, `github_server`, `github_oauth`, `bitbucket_dc`, or `bitbucket_oauth`
  - project slugs may be human-readable or opaque IDs depending on organization type

### 5) Get a workflow
- Method: `GET`
- Path: `/workflow/{id}`
- Full URL: `https://circleci.com/api/v2/workflow/{id}`
- Purpose: return summary fields of a workflow by ID
- Path parameters:
  - `id` - required workflow UUID
- Response notes explicitly shown on the official page:
  - `200` - workflow object
  - `400` - invalid workflow ID
  - `401` - invalid credentials
  - `404` - entity not found
  - `429` - API rate limits exceeded
  - `500` - internal server error

### 6) Get jobs for a workflow
- Method: `GET`
- Path: `/workflow/{id}/job`
- Full URL: `https://circleci.com/api/v2/workflow/{id}/job`
- Purpose: return jobs for a workflow
- Path parameters:
  - `id` - required workflow UUID
- Response notes from the official page:
  - `200` - a paginated sequence of jobs
  - default error response otherwise

## Pagination
From the reviewed CircleCI route blocks:
- `GET /project/{project-slug}/pipeline` exposes `page-token`
- the docs describe `page-token` as a token to retrieve the next page of results
- `GET /workflow/{id}/job` is explicitly described as returning a paginated sequence of jobs

## Rate limits
- the reviewed official route pages repeatedly document HTTP `429` with the message `API rate limits exceeded`
- the reviewed pages did not publish numeric rate-limit quotas or reset windows

## Error and response notes
- reviewed operations use JSON response bodies with route-specific objects/collections such as user information, pipeline sequences, workflow objects, and job sequences
- CircleCI documents a generic `default` error response on several reviewed routes
- explicitly surfaced error statuses in the reviewed route blocks include:
  - `400`
  - `401`
  - `404`
  - `429`
  - `500`
- the docs separate success descriptions from schema details; in the reviewed anonymous UI, route-level prose was clearer than the full response-model expansion for the selected operations

## Important usage notes
- `project-slug` formatting differs for GitLab/GitHub App projects versus ordinary GitHub/Bitbucket slugs
- CircleCI now prefers the `/project/{provider}/{organization}/{project}/pipeline/run` trigger route for newer pipeline-definition-based triggering
- the legacy trigger route remains documented but is explicitly marked as superseded
- pipeline parameter size limits are documented on the legacy trigger route and should be respected even when automating trigger payload generation

## Verification notes
This file was manually rebuilt from the official CircleCI API v2 documentation page using browser inspection.