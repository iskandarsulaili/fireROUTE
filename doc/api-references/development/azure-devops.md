# Azure DevOps

## Provider metadata
- Category: `Development`
- Provider slug: `azure-devops`
- Docs used manually:
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/authentication-guidance?view=azure-devops`
  - `https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits?view=azure-devops`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/core/projects/list?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/list?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/get-repository?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/pipelines/list?view=azure-devops-rest-7.2`
  - `https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/runs/run-pipeline?view=azure-devops-rest-7.2`
- Confirmed REST API base URL pattern: `https://dev.azure.com/{organization}`
- Core resource path pattern from Microsoft Learn: `/_apis[/{area}]/{resource}?api-version={version}`
- Primary media type: JSON
- Manually confirmed routes in this pass: `6`

## Authentication
Microsoft Learn's Azure DevOps authentication guidance recommends Microsoft Entra ID for new Azure DevOps Services integrations.

Confirmed auth models from official docs:
- Microsoft Entra ID / OAuth-based flows for Azure DevOps Services
- Azure DevOps OAuth 2.0 scopes on REST reference pages (for example `vso.project`, `vso.code`, `vso.build`, `vso.build_execute`)
- personal access tokens (PATs), which Microsoft says should be used sparingly
- Basic auth with PATs via `Authorization: Basic BASE64PATSTRING` or tooling that supplies username plus PAT

Important auth notes from Microsoft Learn:
- OAuth 2.0 and Microsoft Entra ID are available for Azure DevOps Services, not Azure DevOps Server
- PAT usage is considered higher risk than Entra authentication
- the generic REST docs show the PAT form `curl -u {username}[:{personalaccesstoken}] ...`

## Common request/response conventions
- Azure DevOps Services instance format: `https://dev.azure.com/{organization}`
- Generic request pattern: `VERB https://dev.azure.com/{organization}/_apis[/{area}]/{resource}?api-version={version}`
- Every request should include `api-version`
- Collection responses commonly use top-level `count` and `value`
- Some endpoints use continuation-based pagination via `continuationToken`
- Preview APIs are explicitly versioned with preview suffixes like `7.2-preview.4`

## Manually confirmed endpoint set

### 1) List projects
- Method: `GET`
- Path: `/_apis/projects`
- Full URL: `https://dev.azure.com/{organization}/_apis/projects?api-version=7.2-preview.4`
- Purpose: list projects the authenticated user can access
- Path parameters:
  - `organization` - required Azure DevOps organization name
- Confirmed query parameters:
  - `stateFilter` - filter projects by project state
  - `$top` - maximum number of projects to return
  - `$skip`
  - `continuationToken` - pointer showing how many projects have already been fetched
  - `getDefaultTeamImageUrl`
  - `api-version` - required
- Confirmed response code:
  - `200 OK`
- Official scopes:
  - `vso.profile`
  - `vso.project`
- Response notes:
  - sample response uses `count` plus `value`
  - project items include `id`, `name`, `description`, `url`, and `state`

### 2) List Git repositories
- Method: `GET`
- Path: `/{project}/_apis/git/repositories`
- Full URL: `https://dev.azure.com/{organization}/{project}/_apis/git/repositories?api-version=7.2-preview.2`
- Purpose: retrieve Git repositories for a project or organization context
- Path parameters:
  - `organization` - required
  - `project` - optional project ID or project name according to the route docs
- Confirmed query parameters:
  - `includeLinks` - include reference links
  - `includeAllUrls` - include all remote URLs
  - `includeHidden` - include hidden repositories
  - `api-version` - required
- Confirmed response code:
  - `200 OK`
- Official scope:
  - `vso.code`
- Response notes:
  - returns `GitRepository[]`
  - example route also works as `https://dev.azure.com/fabrikam/_apis/git/repositories?...`

### 3) Get a Git repository
- Method: `GET`
- Path: `/{project}/_apis/git/repositories/{repositoryId}`
- Full URL: `https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}?api-version=7.2-preview.2`
- Purpose: retrieve a repository by name or ID
- Path parameters:
  - `organization` - required
  - `project` - optional project ID or project name
  - `repositoryId` - required repository name or ID
- Confirmed response code:
  - `200 OK`
- Official scope:
  - `vso.code`
- Response notes:
  - response type is `GitRepository`
  - docs examples include repository URLs and remote URL metadata in the payload

### 4) List builds
- Method: `GET`
- Path: `/{project}/_apis/build/builds`
- Full URL: `https://dev.azure.com/{organization}/{project}/_apis/build/builds?api-version=7.2-preview.8`
- Purpose: list builds with extensive filtering
- Path parameters:
  - `organization` - required
  - `project` - required project ID or project name
- Confirmed query parameters:
  - `definitions`
  - `queues`
  - `buildNumber`
  - `minTime`
  - `maxTime`
  - `requestedFor`
  - `reasonFilter`
  - `statusFilter`
  - `resultFilter`
  - `tagFilters`
  - `properties`
  - `$top`
  - `continuationToken`
  - `maxBuildsPerDefinition`
  - `deletedFilter`
  - `queryOrder`
  - `branchName`
  - `buildIds`
  - `repositoryId`
  - `repositoryType`
  - `api-version` - required
- Confirmed response code:
  - `200 OK`
- Official scope:
  - `vso.build`
- Response notes:
  - returns `Build[]`
  - the docs classify many filters as enums such as `BuildReason`, `BuildStatus`, `BuildResult`, and `QueryDeletedOption`

### 5) List pipelines
- Method: `GET`
- Path: `/{project}/_apis/pipelines`
- Full URL: `https://dev.azure.com/{organization}/{project}/_apis/pipelines?api-version=7.2-preview.1`
- Purpose: list pipelines in a project
- Path parameters:
  - `organization` - required
  - `project` - required
- Confirmed query parameters:
  - `orderBy` - sort expression, defaults to `name asc`
  - `$top` - maximum number of pipelines to return
  - `continuationToken` - fetch next page of results
  - `api-version` - required
- Confirmed response code:
  - `200 OK`
- Official scope:
  - `vso.build`
- Response notes:
  - returns `Pipeline[]`

### 6) Run a pipeline
- Method: `POST`
- Path: `/{project}/_apis/pipelines/{pipelineId}/runs`
- Full URL: `https://dev.azure.com/{organization}/{project}/_apis/pipelines/{pipelineId}/runs?api-version=7.2-preview.1`
- Purpose: queue or preview a pipeline run
- Path parameters:
  - `organization` - required
  - `project` - required
  - `pipelineId` - required integer pipeline ID
- Confirmed query parameters:
  - `pipelineVersion`
  - `api-version` - required
- Confirmed request body fields:
  - `previewRun` - if true, return parsed final YAML without creating a run
  - `resources`
  - `stagesToSkip`
  - `templateParameters`
  - `variables`
  - `yamlOverride`
- Confirmed response code:
  - `200 OK`
- Official scope:
  - `vso.build_execute`
- Response notes:
  - returns a `Run` resource
  - preview mode is explicitly documented as a dry-run-style YAML expansion path

## Pagination
Official Microsoft Learn endpoint pages confirm continuation-based pagination on multiple Azure DevOps APIs:
- projects listing supports `continuationToken`
- builds listing supports `continuationToken`
- pipelines listing supports `continuationToken`
- list responses commonly return `count` and `value`
- clients should continue making requests with the returned continuation token until the result set is exhausted

## Rate limits
From Microsoft's official rate and usage limits page:
- Azure DevOps can delay requests when shared resources are at risk or when a user exceeds `200` times the consumption of a typical user within a sliding five-minute window
- delays can range from a few milliseconds up to `30 seconds` per request
- when blocked, clients receive `429 Too Many Requests`
- documented error example: `TF400733: The request has been canceled: Request was blocked due to exceeding usage of resource ...`

Important usage/throughput notes from Microsoft:
- rate limiting is based on abstract Azure DevOps throughput units (TSTUs)
- throttling is not presented as a single fixed request-per-hour number for the entire API surface
- throttling may be delayed first and blocked later depending on sustained usage

## Error format and troubleshooting notes
- route reference pages document security requirements per endpoint using OAuth scopes
- throttled requests return HTTP `429`
- the generic REST docs emphasize pinning `api-version` to avoid future breaking changes as APIs evolve
- preview API versions are explicitly named and should be treated as less stable than non-preview versions

## Important usage notes
- Azure DevOps Services and Azure DevOps Server use different instance patterns; for cloud integrations, the docs consistently use `https://dev.azure.com/{organization}`
- Microsoft recommends Microsoft Entra authentication for new Azure DevOps Services integrations and only sparing PAT use
- some REST reference pages allow `project` to be omitted while still accepting organization-scoped requests
- many endpoints in the reference are still preview-versioned even under REST API 7.2, so the exact `api-version` string matters

## Verification notes
This file was manually rebuilt from official Microsoft Learn Azure DevOps documentation, replacing the earlier low-fidelity autogenerated summary.
