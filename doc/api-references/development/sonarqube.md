# SonarQube

## Provider metadata
- Category: `Development`
- Provider slug: `sonarqube`
- Docs used manually:
  - `https://sonarcloud.io/web_api`
  - `https://docs.sonarsource.com/sonarqube-cloud/`
  - `https://sonarcloud.io/api/webservices/list?` (official web-service catalog used by the Web API UI)
  - `https://api-docs.sonarsource.com/` (official v2 portal linked from the legacy catalog)
- Confirmed API base URL: `https://sonarcloud.io`
- Route style: legacy Web API routes live under `/api/<service>/<action>`
- Primary format: JSON metadata and JSON response bodies for the reviewed Web API surface
- Authentication/authorization signals surfaced in the reviewed official docs:
  - the Web API catalog is readable anonymously
  - `GET /api/authentication/validate` explicitly returns `true` for anonymous users
  - many operations require SonarQube permissions such as `Browse`, `Create Projects`, `Administer`, or `Administer System`
  - `POST /api/user_tokens/generate` creates an access token for the authenticated user
- Manually confirmed operations in this pass: `156` across `33` route families

## Authentication
- The reviewed official Web API catalog does not present a single global auth paragraph for the entire legacy surface, but it repeatedly documents permission-gated operations.
- Anonymous access exists for at least some catalog and validation flows:
  - `GET /api/authentication/validate` says it returns `true` for anonymous users.
- Authenticated-user token management is part of the public surface:
  - `POST /api/user_tokens/generate`
  - `POST /api/user_tokens/revoke`
  - `GET /api/user_tokens/search`
- Many administrative routes explicitly require project or system permissions, for example:
  - project creation requires `Create Projects`
  - project deletion and bulk deletion require `Administer System` or project-level `Administer`
  - webhook creation requires project `Administer`
  - issue search requires `Browse`

## Common request/response conventions
- Base URL: `https://sonarcloud.io`
- All confirmed catalog routes are under `/api/...`.
- The reviewed legacy surface uses only `GET` and `POST` methods.
- Search/list endpoints commonly use:
  - `p` for 1-based page number
  - `ps` for page size, commonly max `500` where documented
  - `q` for text filtering
- Common scoping parameters across the catalog include:
  - `organization`
  - `project` or `projectKey`
  - `branch`
  - `pullRequest`
  - `component` / `componentKeys`
- Most reviewed routes expose JSON response examples in the official catalog.
- The official catalog exposes a large number of deprecations and changelog notes inline, so callers should treat parameter names and response fields as version-sensitive.

## Manually confirmed route family inventory
1. `api/authentication` (`2`)
   - `POST /api/authentication/logout`
   - `GET /api/authentication/validate`
2. `api/ce` (`4`)
   - `GET /api/ce/activity`
   - `GET /api/ce/activity_status`
   - `GET /api/ce/component`
   - `GET /api/ce/task`
3. `api/components` (`3`)
   - `GET /api/components/search`
   - `GET /api/components/show`
   - `GET /api/components/tree`
4. `api/duplications` (`1`)
   - `GET /api/duplications/show`
5. `api/favorites` (`3`)
   - `POST /api/favorites/add`
   - `POST /api/favorites/remove`
   - `GET /api/favorites/search`
6. `api/favourites` (`1`)
   - `GET /api/favourites/index`
7. `api/hotspots` (`3`)
   - `POST /api/hotspots/change_status`
   - `GET /api/hotspots/search`
   - `GET /api/hotspots/show`
8. `api/issues` (`13`)
   - `POST /api/issues/add_comment`
   - `POST /api/issues/assign`
   - `GET /api/issues/authors`
   - `POST /api/issues/bulk_change`
   - `GET /api/issues/changelog`
   - `POST /api/issues/delete_comment`
   - `POST /api/issues/do_transition`
   - `POST /api/issues/edit_comment`
   - `GET /api/issues/search`
   - `POST /api/issues/set_severity`
   - `POST /api/issues/set_tags`
   - `POST /api/issues/set_type`
   - `GET /api/issues/tags`
9. `api/languages` (`1`)
   - `GET /api/languages/list`
10. `api/measures` (`3`)
   - `GET /api/measures/component`
   - `GET /api/measures/component_tree`
   - `GET /api/measures/search_history`
11. `api/metrics` (`3`)
   - `GET /api/metrics/domains`
   - `GET /api/metrics/search`
   - `GET /api/metrics/types`
12. `api/notifications` (`3`)
   - `POST /api/notifications/add`
   - `GET /api/notifications/list`
   - `POST /api/notifications/remove`
13. `api/permissions` (`17`)
   - `POST /api/permissions/add_group`
   - `POST /api/permissions/add_group_to_template`
   - `POST /api/permissions/add_project_creator_to_template`
   - `POST /api/permissions/add_user`
   - `POST /api/permissions/add_user_to_template`
   - `POST /api/permissions/apply_template`
   - `POST /api/permissions/bulk_apply_template`
   - `POST /api/permissions/create_template`
   - `POST /api/permissions/delete_template`
   - `POST /api/permissions/remove_group`
   - `POST /api/permissions/remove_group_from_template`
   - `POST /api/permissions/remove_project_creator_from_template`
   - `POST /api/permissions/remove_user`
   - `POST /api/permissions/remove_user_from_template`
   - `GET /api/permissions/search_templates`
   - `POST /api/permissions/set_default_template`
   - `POST /api/permissions/update_template`
14. `api/project_analyses` (`7`)
   - `POST /api/project_analyses/create_event`
   - `POST /api/project_analyses/delete`
   - `POST /api/project_analyses/delete_event`
   - `GET /api/project_analyses/search`
   - `POST /api/project_analyses/set_baseline`
   - `POST /api/project_analyses/unset_baseline`
   - `POST /api/project_analyses/update_event`
15. `api/project_badges` (`3`)
   - `GET /api/project_badges/ai_code_assurance`
   - `GET /api/project_badges/measure`
   - `GET /api/project_badges/quality_gate`
16. `api/project_branches` (`3`)
   - `POST /api/project_branches/delete`
   - `GET /api/project_branches/list`
   - `POST /api/project_branches/rename`
17. `api/project_links` (`3`)
   - `POST /api/project_links/create`
   - `POST /api/project_links/delete`
   - `GET /api/project_links/search`
18. `api/project_pull_requests` (`2`)
   - `POST /api/project_pull_requests/delete`
   - `GET /api/project_pull_requests/list`
19. `api/project_tags` (`2`)
   - `GET /api/project_tags/search`
   - `POST /api/project_tags/set`
20. `api/projects` (`7`)
   - `POST /api/projects/bulk_delete`
   - `POST /api/projects/bulk_update_key`
   - `POST /api/projects/create`
   - `POST /api/projects/delete`
   - `GET /api/projects/search`
   - `POST /api/projects/update_key`
   - `POST /api/projects/update_visibility`
21. `api/properties` (`1`)
   - `GET /api/properties/index`
22. `api/qualitygates` (`16`)
   - `POST /api/qualitygates/copy`
   - `POST /api/qualitygates/create`
   - `POST /api/qualitygates/create_condition`
   - `POST /api/qualitygates/delete_condition`
   - `POST /api/qualitygates/deselect`
   - `POST /api/qualitygates/destroy`
   - `GET /api/qualitygates/get_by_project`
   - `GET /api/qualitygates/list`
   - `GET /api/qualitygates/project_status`
   - `POST /api/qualitygates/rename`
   - `GET /api/qualitygates/search`
   - `POST /api/qualitygates/select`
   - `POST /api/qualitygates/set_as_default`
   - `GET /api/qualitygates/show`
   - `POST /api/qualitygates/unset_default`
   - `POST /api/qualitygates/update_condition`
23. `api/qualityprofiles` (`22`)
   - `POST /api/qualityprofiles/activate_rule`
   - `POST /api/qualityprofiles/activate_rules`
   - `POST /api/qualityprofiles/add_project`
   - `GET /api/qualityprofiles/backup`
   - `POST /api/qualityprofiles/change_parent`
   - `GET /api/qualityprofiles/changelog`
   - `POST /api/qualityprofiles/copy`
   - `POST /api/qualityprofiles/create`
   - `POST /api/qualityprofiles/deactivate_rule`
   - `POST /api/qualityprofiles/deactivate_rules`
   - `POST /api/qualityprofiles/delete`
   - `GET /api/qualityprofiles/export`
   - `GET /api/qualityprofiles/exporters`
   - `GET /api/qualityprofiles/importers`
   - `GET /api/qualityprofiles/inheritance`
   - `GET /api/qualityprofiles/projects`
   - `POST /api/qualityprofiles/remove_project`
   - `POST /api/qualityprofiles/rename`
   - `POST /api/qualityprofiles/restore`
   - `POST /api/qualityprofiles/restore_built_in`
   - `GET /api/qualityprofiles/search`
   - `POST /api/qualityprofiles/set_default`
24. `api/rules` (`5`)
   - `GET /api/rules/repositories`
   - `GET /api/rules/search`
   - `GET /api/rules/show`
   - `GET /api/rules/tags`
   - `POST /api/rules/update`
25. `api/settings` (`4`)
   - `GET /api/settings/list_definitions`
   - `POST /api/settings/reset`
   - `POST /api/settings/set`
   - `GET /api/settings/values`
26. `api/sources` (`3`)
   - `GET /api/sources/raw`
   - `GET /api/sources/scm`
   - `GET /api/sources/show`
27. `api/timemachine` (`1`)
   - `GET /api/timemachine/index`
28. `api/user_groups` (`7`)
   - `POST /api/user_groups/add_user`
   - `POST /api/user_groups/create`
   - `POST /api/user_groups/delete`
   - `POST /api/user_groups/remove_user`
   - `GET /api/user_groups/search`
   - `POST /api/user_groups/update`
   - `GET /api/user_groups/users`
29. `api/user_properties` (`1`)
   - `GET /api/user_properties/index`
30. `api/user_tokens` (`3`)
   - `POST /api/user_tokens/generate`
   - `POST /api/user_tokens/revoke`
   - `GET /api/user_tokens/search`
31. `api/users` (`1`)
   - `GET /api/users/groups`
32. `api/webhooks` (`6`)
   - `POST /api/webhooks/create`
   - `POST /api/webhooks/delete`
   - `GET /api/webhooks/deliveries`
   - `GET /api/webhooks/delivery`
   - `GET /api/webhooks/list`
   - `POST /api/webhooks/update`
33. `api/webservices` (`2`)
   - `GET /api/webservices/list`
   - `GET /api/webservices/response_example`

## High-value parameter and usage notes from the official catalog

### Authentication and tokens
- `GET /api/authentication/validate`
  - validation endpoint for the current credentials
  - explicitly documented to return `true` for anonymous users
- `POST /api/user_tokens/generate`
  - creates a token for the authenticated user
  - required parameter: `name`
  - deprecated/ignored parameter: `login`
- `POST /api/user_tokens/revoke`
  - revokes a token by name
- `GET /api/user_tokens/search`
  - lists tokens for the authenticated user

### Projects
- `POST /api/projects/create`
  - required: `organization`, `project`, `name`
  - optional: `visibility`, `newCodeDefinitionType`, `newCodeDefinitionValue`
  - requires `Create Projects`
- `GET /api/projects/search`
  - required: `organization`
  - common filters: `q`, `projects`, `analyzedBefore`, `onProvisionedOnly`
  - pagination: `p`, `ps` with documented max `500`
- `POST /api/projects/bulk_delete`
  - at least one of `analyzedBefore`, `projects`, or `q` is required
  - requires `Administer System`
- `POST /api/projects/update_visibility`
  - required: `project`, `visibility`
  - visibility values: `private`, `public`

### Issues
- `GET /api/issues/search`
  - requires `Browse` on the specified project scope
  - common filters include `organization`, `componentKeys`, `branch`, `pullRequest`, `issueStatuses`, `impactSoftwareQualities`, `impactSeverities`, `languages`, `tags`, `rules`, `facets`, `createdAfter`, `createdBefore`
  - pagination: `p`, `ps` with documented max `500`
  - several legacy filters are marked deprecated in the live catalog (`types`, `severities`, `statuses`, `resolutions`)
- `POST /api/issues/bulk_change`
  - bulk issue modification surface in the same family
- `POST /api/issues/add_comment`, `edit_comment`, `delete_comment`
  - comment lifecycle routes
- `POST /api/issues/set_severity`, `set_tags`, `set_type`, `do_transition`
  - issue mutation routes for triage flows

### Measures and analysis views
- `GET /api/measures/component`
  - requires one of `component` or deprecated `componentId`
  - required: `metricKeys`
  - optional scoping: `branch`, `pullRequest`
  - optional `additionalFields=metrics,periods`
- `GET /api/measures/component_tree`
  - component-scoped listing of descendants with selected metrics
  - paginated
- `GET /api/measures/search_history`
  - time-series metric history endpoint

### Branches and pull requests
- `GET /api/project_branches/list`
  - requires `project` or `branchIds`
  - `branchIds` accepts up to `50` IDs
  - accessible with `Browse` or `Execute Analysis` rights
- `POST /api/project_branches/delete`
  - branch deletion route
- `POST /api/project_branches/rename`
  - branch rename route
- `GET /api/project_pull_requests/list`
  - required: `project`
  - accessible with `Browse` or `Execute Analysis` rights
- `POST /api/project_pull_requests/delete`
  - delete pull request decoration state

### Quality gates and profiles
- `GET /api/qualitygates/project_status`
  - accepts one of `analysisId`, `projectId`, or `projectKey`
  - optional: `branch`, `pullRequest`
  - documented statuses: `OK`, `WARN`, `ERROR`, `NONE`
  - documented `404` when the analysis associated with the task is not found
- `GET /api/qualitygates/list`, `search`, `show`, `get_by_project`
  - retrieval routes for gates and gate/project bindings
- `POST /api/qualitygates/create`, `copy`, `rename`, `destroy`
  - quality-gate lifecycle routes
- `POST /api/qualitygates/create_condition`, `update_condition`, `delete_condition`
  - condition management routes
- `GET /api/qualityprofiles/search`
  - required: `organization`
  - optional filters: `defaults`, `language`, `project`, `qualityProfile`
- `GET /api/qualityprofiles/changelog`, `projects`, `inheritance`, `backup`, `export`
  - profile inspection and export routes
- `POST /api/qualityprofiles/create`, `copy`, `rename`, `delete`, `set_default`, `change_parent`
  - profile lifecycle routes
- `POST /api/qualityprofiles/activate_rule`, `activate_rules`, `deactivate_rule`, `deactivate_rules`
  - rule activation surfaces

### Webhooks
- `POST /api/webhooks/create`
  - required: `name`, `organization`, `url`
  - optional: `project`, `secret`
  - if `secret` is set, SonarQube signs payloads with `X-Sonar-Webhook-HMAC-SHA256`
  - requires project `Administer`
- `GET /api/webhooks/list`, `delivery`, `deliveries`
  - delivery inspection routes
- `POST /api/webhooks/update`, `delete`
  - webhook maintenance routes

## Pagination
The official live catalog exposes pagination on at least these reviewed routes:
- `GET /api/ce/activity`
- `GET /api/components/search`
- `GET /api/components/tree`
- `GET /api/favorites/search`
- `GET /api/hotspots/search`
- `GET /api/issues/authors`
- `GET /api/issues/search`
- `GET /api/issues/tags`
- `GET /api/languages/list`
- `GET /api/measures/component_tree`
- `GET /api/measures/search_history`
- `GET /api/metrics/search`
- `GET /api/project_analyses/search`
- `GET /api/project_tags/search`
- `GET /api/projects/search`
- `GET /api/qualitygates/search`
- `GET /api/qualityprofiles/changelog`
- `GET /api/qualityprofiles/projects`
- `GET /api/rules/search`
- `GET /api/rules/tags`
- `GET /api/user_groups/search`
- `GET /api/user_groups/users`
- `GET /api/users/groups`
- `GET /api/webhooks/deliveries`

Across the reviewed actions, pagination is primarily handled with:
- `p` - 1-based page number
- `ps` - page size, commonly documented with max `500`

## Rate limits and quotas
- No explicit numeric API-wide rate limit was surfaced in the reviewed official SonarCloud Web API catalog.
- The reviewed official pages focus on permissions, parameter limits, and deprecations instead of request-per-second quotas.
- Explicit documented limits found during review include:
  - `GET /api/project_branches/list`: up to `50` `branchIds`
  - many search/list endpoints: `ps` max `500`
  - `POST /api/projects/create`: project key maximum length `400`
  - `POST /api/webhooks/create`: `secret` max `200`, `url` max `512`

## Error and response notes
- `GET /api/qualitygates/project_status` explicitly documents `404` when the related analysis is missing.
- Permission requirements are embedded directly in many action descriptions and should be treated as common authorization-failure points.
- The official catalog exposes response examples for many endpoints via `GET /api/webservices/response_example`.
- The live catalog also records many deprecations and response-field migrations, especially in `issues`, `projects`, `qualityprofiles`, and `qualitygates`.

## Important usage notes
- The indexed SonarCloud Web API is a large legacy action-style surface, not a modern resource-only REST design.
- The legacy catalog itself links to the newer official v2 portal at `https://api-docs.sonarsource.com/`, but the indexed legacy surface still exposes a much larger public route inventory today.
- Organization scoping is central: `organization` appears throughout the catalog and is required on many administrative endpoints.
- Branch and pull-request analysis are first-class concerns in the current cloud API and appear repeatedly across projects, measures, and quality-gate routes.
- Token lifecycle is user-scoped; the reviewed token-generation route explicitly creates tokens for the authenticated user.

## Verification notes
This file was manually rebuilt from the official SonarCloud Web API UI, the linked official Sonar documentation, and the official catalog JSON backing the Web API page.