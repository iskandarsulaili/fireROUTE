# JIRA

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `jira`
- Docs/pages reviewed manually:
  - `https://developer.atlassian.com/server/jira/platform/rest-apis/`
  - `https://developer.atlassian.com/server/jira/platform/rest/v11002/intro/#gettingstarted`
  - `https://dac-static.atlassian.com/server/jira/platform/jira_software_dc_11002_swagger.v3.json?_v=1.1230.0`
- Confirmed API base URL pattern from the current official OpenAPI:
  - `http://{baseurl}/rest`
  - default documented server variable: `localhost:8090`
- Confirmed API path families from the current intro page:
  - `/auth/1/...`
  - `/agile/1.0/...`
  - `/api/2/...`
- Primary exchange format: JSON over HTTP(S)
- Manually confirmed routes in this pass: `435`
- Route-method breakdown confirmed from the current official OpenAPI:
  - `210` `GET`
  - `89` `POST`
  - `72` `PUT`
  - `64` `DELETE`

## What the official docs confirm
- The original REST landing page currently redirects to the Jira Data Center REST reference for version `v11002`.
- Atlassian currently publishes a large Jira Software Data Center OpenAPI file that exposes `435` concrete method+path operations on `288` unique paths.
- The Jira Data Center REST surface is split across three API-name families documented on the intro page:
  - `auth` (current version `1`)
  - `agile` (current version `1`)
  - `api` (current version `2`)
- The intro page also documents the symbolic version `latest`, which resolves to the latest version supported by the target Jira instance.

## Authentication
From the current official intro page:
- Recommended auth methods:
  - OAuth `2.0`
  - Personal access token (`PAT`)
- Other documented auth methods:
  - OAuth `1.0a` (explicitly marked deprecated)
  - Basic HTTP auth
- Browser-side Jira pages use cookie-based auth in the browser.
- The intro page explicitly says you can `POST` to `/auth/1/session` to reproduce Jira login-page behavior for programmatic login handling.

### OpenAPI security-scheme note
- The reviewed OpenAPI file still publishes a `basic` HTTP auth security scheme.
- The prose intro page is broader and more current than the OpenAPI security block, so adapters should treat the intro page as the source of truth for supported auth models.

## Rate limits
- No global numeric rate-limit policy was published on the reviewed Jira Data Center intro page.
- No `429`-style shared throttle policy was surfaced in the reviewed official reference pages.

## Pagination, ordering, expansion, and format notes
From the current official intro page:
- Jira uses JSON as its communication format.
- Pagination fields:
  - `startAt`
  - `maxResults`
  - `total` (documented as optional when expensive to calculate)
  - paged result array key: `values`
- The docs explicitly warn that each resource may enforce different maximum page sizes and may return fewer items than requested.
- Ordering uses the `orderBy` query parameter.
- Ordering can be ascending or descending with examples such as:
  - `?orderBy=name`
  - `?orderBy=+name`
  - `?orderBy=-name`
- Resource expansion uses the `expand` query parameter.
- Many response objects expose canonical `self` links.

## Special headers
From the current official intro page:
- `X-AUSERNAME`
  - response header containing the authenticated username or `anonymous`
- `X-Atlassian-Token: no-check`
  - required by multipart/form-data methods
- `X-ExperimentalApi: true`
  - required for methods marked `EXPERIMENTAL`

## Error notes
From the current official Error responses section:
- Jira commonly returns an `Error Collection` JSON object with:
  - `errorMessages` -> array of strings
  - `errors` -> object of field-to-message mappings
  - `status` -> integer
- The intro page presents this as the usual shared error-body shape for many resources.

## Field/input format notes explicitly called out in the intro page
Representative examples from the current official appendix include:
- `summary` -> single-line text
- `description` -> multi-line text
- `components` -> array of objects addressed by `name`
- `duedate` -> `YYYY-MM-DD`
- `labels` -> array of strings
- custom field option values addressable by either `value` or `id`

## Important usage notes
- Jira Data Center route versioning is family-specific; do not assume one global `/v1` prefix.
- Experimental methods require explicit opt-in via `X-ExperimentalApi: true`.
- Multipart endpoints require `X-Atlassian-Token: no-check`.
- The current docs still distinguish Jira Data Center from older Jira Core / Jira Software pre-10.0 references; version alignment with the target instance matters.

## Confirmed route surface summary
The current official OpenAPI exposes `435` operations across these route families/tags:
- `issue` -> `53`
- `project` -> `38`
- `user` -> `36`
- `workflowscheme` -> `26`
- `board` -> `20`
- `version` -> `16`
- `sprint` -> `14`
- `filter` -> `14`
- `issuetype` -> `13`
- `screens` -> `13`
- `permissionscheme` -> `11`
- `issuetypescheme` -> `10`
- `cluster` -> `9`
- `role` -> `9`
- `monitoring` -> `8`
- `epic` -> `7`
- `issueLinkType` -> `7`
- `reindex` -> `7`
- `component` -> `6`
- `dashboard` -> `6`
- plus a long tail of smaller families including `attachment`, `comment`, `group`, `priorityschemes`, `applicationrole`, `session`, `search`, `settings`, `status`, `workflow`, `websudo`, and many others

## Representative exact route inventory from the current official docs
The full Jira surface is too large to inline exhaustively here, but the following exact routes were directly confirmed from the current first-party OpenAPI.

### Board (`20` routes)
- `GET /agile/1.0/board`
- `POST /agile/1.0/board`
- `GET /agile/1.0/board/{boardId}`
- `DELETE /agile/1.0/board/{boardId}`
- `GET /agile/1.0/board/{boardId}/backlog`
- `GET /agile/1.0/board/{boardId}/configuration`
- `GET /agile/1.0/board/{boardId}/epic`
- `GET /agile/1.0/board/{boardId}/epic/none/issue`

### Issue (`53` routes)
Representative routes:
- `PUT /agile/1.0/issue/rank`
- `GET /agile/1.0/issue/{issueIdOrKey}`
- `GET /agile/1.0/issue/{issueIdOrKey}/estimation`
- `PUT /agile/1.0/issue/{issueIdOrKey}/estimation`
- `POST /api/2/issue`
- `POST /api/2/issue/archive`
- `POST /api/2/issue/bulk`
- `GET /api/2/issue/createmeta/{projectIdOrKey}/issuetypes`
- plus many more issue create/edit/archive/meta/watcher/history-style operations in the current OpenAPI

### Sprint (`14` routes)
- `POST /agile/1.0/sprint`
- `PUT /agile/1.0/sprint/unmap`
- `PUT /agile/1.0/sprint/unmap-all`
- `GET /agile/1.0/sprint/{sprintId}`
- `PUT /agile/1.0/sprint/{sprintId}`
- `POST /agile/1.0/sprint/{sprintId}`
- `DELETE /agile/1.0/sprint/{sprintId}`
- `GET /agile/1.0/sprint/{sprintId}/issue`

### Filter (`14` routes)
- `POST /api/2/filter`
- `GET /api/2/filter/defaultShareScope`
- `PUT /api/2/filter/defaultShareScope`
- `GET /api/2/filter/favourite`
- `GET /api/2/filter/{id}`
- `PUT /api/2/filter/{id}`
- `DELETE /api/2/filter/{id}`
- `GET /api/2/filter/{id}/columns`

### Project (`38` routes)
Representative routes:
- `GET /api/2/project`
- `POST /api/2/project`
- `GET /api/2/project/type`
- `GET /api/2/project/type/{projectTypeKey}`
- `GET /api/2/project/type/{projectTypeKey}/accessible`
- `GET /api/2/project/{projectIdOrKey}`
- `PUT /api/2/project/{projectIdOrKey}`
- `DELETE /api/2/project/{projectIdOrKey}`
- plus many more project avatar, category, role, property, and validation routes in the current OpenAPI

### User (`36` routes)
Representative routes:
- `GET /api/2/user`
- `PUT /api/2/user`
- `POST /api/2/user`
- `DELETE /api/2/user`
- `GET /api/2/user/a11y/personal-settings`
- `GET /api/2/user/anonymization`
- `POST /api/2/user/anonymization`
- `GET /api/2/user/anonymization/progress`

### Version (`16` routes)
Representative routes:
- `GET /api/2/version`
- `POST /api/2/version`
- `GET /api/2/version/remotelink`
- `GET /api/2/version/{id}`
- `PUT /api/2/version/{id}`
- `PUT /api/2/version/{id}/mergeto/{moveIssuesTo}`
- `POST /api/2/version/{id}/move`
- `GET /api/2/version/{id}/relatedIssueCounts`

### Workflow scheme (`26` routes)
Representative routes:
- `POST /api/2/workflowscheme`
- `GET /api/2/workflowscheme/{id}`
- `PUT /api/2/workflowscheme/{id}`
- `DELETE /api/2/workflowscheme/{id}`
- `POST /api/2/workflowscheme/{id}/createdraft`
- `GET /api/2/workflowscheme/{id}/default`
- `PUT /api/2/workflowscheme/{id}/default`
- `DELETE /api/2/workflowscheme/{id}/default`

### Session / auth-adjacent routes
Representative routes visible in the current OpenAPI include:
- `GET /auth/1/session`
- `POST /auth/1/session`
- `DELETE /auth/1/session`

## Integration notes for fireROUTE
- Route mapping should preserve the Jira family split between `/api/2`, `/agile/1.0`, and `/auth/1`.
- Keep pagination support generic around `startAt` and `maxResults`.
- Preserve `expand`, `orderBy`, and `self`-link semantics where possible.
- Expect very broad provider-specific coverage; a thin canonical adapter should expose raw passthrough capability for the long tail.