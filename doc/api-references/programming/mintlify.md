# Mintlify

## Provider metadata
- Category: `Programming`
- Provider slug: `mintlify`
- Docs used manually:
  - `https://www.mintlify.com/docs/api/introduction`
  - `https://www.mintlify.com/docs/api/update/trigger`
  - `https://www.mintlify.com/docs/api/update/status`
  - `https://www.mintlify.com/docs/api/preview/trigger`
  - `https://www.mintlify.com/docs/api/agent/v2/create-agent-job`
  - `https://www.mintlify.com/docs/api/agent/v2/get-agent-job`
  - `https://www.mintlify.com/docs/api/agent/v2/send-message`
  - `https://www.mintlify.com/docs/api/assistant/create-assistant-message-v2`
  - `https://www.mintlify.com/docs/api/assistant/search`
  - `https://www.mintlify.com/docs/api/assistant/get-page-content`
- Confirmed REST API bases in this pass:
  - `https://api.mintlify.com/v1`
  - `https://api.mintlify.com/v2`
  - `https://api.mintlify.com/discovery/v1`
  - `https://api.mintlify.com/discovery/v2`
- Primary media type: JSON
- Authentication model surfaced in docs: Bearer tokens, split between admin keys (`mint_...`) and assistant keys (`mint_dsc_...`)
- Manually confirmed routes in this pass: `9`

## Authentication
From the official Mintlify API introduction and reviewed route pages:
- admin endpoints use `Authorization: Bearer ADMIN_API_KEY`
- admin API keys are generated from the dashboard API keys page, are organization-scoped, begin with `mint_`, and are explicitly documented as server-side secrets
- assistant endpoints use `Authorization: Bearer ASSISTANT_API_KEY`
- assistant API keys begin with `mint_dsc_` and are explicitly documented as safe for client-side/frontend use
- the introduction says an organization can create up to `10` API keys per hour

## Common request/response conventions
- the docs describe this as a REST API for deployments, assistant access, analytics export, and agent-based documentation edits
- request and response bodies are JSON on the reviewed routes
- deployment-triggering operations return a `statusId` that is then used with the deployment-status route
- agent operations are asynchronous; the docs repeatedly instruct clients to poll the get-agent-job route until the job reaches a terminal status
- assistant discovery routes are domain-scoped and use the docs-domain identifier as a path parameter

## Manually confirmed endpoint set

### Admin deployment endpoints
1. `POST /project/update/{projectId}`
   - Full URL: `https://api.mintlify.com/v1/project/update/{projectId}`
   - Auth: admin API key
   - Path parameter:
     - `projectId` - project identifier from the dashboard API keys page
   - Response:
     - `202` with `statusId`
   - Purpose: queue a deployment update for the configured docs branch

2. `GET /project/update-status/{statusId}`
   - Full URL: `https://api.mintlify.com/v1/project/update-status/{statusId}`
   - Auth: admin API key
   - Path parameter:
     - `statusId` - deployment/update status identifier returned by a trigger call
   - Response fields explicitly shown on the official page include:
     - `_id`
     - `projectId`
     - `createdAt`
     - `endedAt`
     - `status` - `queued`, `in_progress`, `success`, `failure`
     - `summary`
     - `logs`
     - `subdomain`
     - `screenshot`, `screenshotLight`, `screenshotDark`
     - `author`
     - `commit`
     - `source`

3. `POST /project/preview/{projectId}`
   - Full URL: `https://api.mintlify.com/v1/project/preview/{projectId}`
   - Auth: admin API key
   - Availability note: the official page says preview deployments are available on Pro and Enterprise plans
   - Path parameter:
     - `projectId`
   - JSON body fields confirmed:
     - `branch` - required Git branch name
   - Response:
     - `202` with `statusId` and `previewUrl`
   - Rate limit explicitly shown: `5` requests per minute per organization

### Agent endpoints
4. `POST /agent/{projectId}/job`
   - Full URL: `https://api.mintlify.com/v2/agent/{projectId}/job`
   - Auth: admin API key
   - Path parameter:
     - `projectId`
   - JSON body fields confirmed:
     - `prompt` - required instruction, minimum length `1`
   - Response status: `201`
   - Response fields shown:
     - `id`
     - `status` - `active`, `completed`, `archived`, `failed`
     - `source`
     - `model`
     - `prLink`
     - `createdAt`
     - `archivedAt`
   - Rate limit explicitly shown: `100` uses per Mintlify project per hour

5. `GET /agent/{projectId}/job/{id}`
   - Full URL: `https://api.mintlify.com/v2/agent/{projectId}/job/{id}`
   - Auth: admin API key
   - Path parameters:
     - `projectId`
     - `id` - agent job identifier
   - Purpose: poll background job progress
   - Response returns the same core job fields as create-agent-job, including terminal-state tracking and eventual `prLink`

6. `POST /agent/{projectId}/job/{id}/message`
   - Full URL: `https://api.mintlify.com/v2/agent/{projectId}/job/{id}/message`
   - Auth: admin API key
   - Path parameters:
     - `projectId`
     - `id` - existing agent job identifier
   - JSON body fields confirmed:
     - `prompt` - required follow-up instruction, minimum length `1`
   - Response status: `200`
   - Rate limit explicitly shown: `100` uses per Mintlify project per hour

### Assistant/discovery endpoints
7. `POST /assistant/{domain}/message`
   - Full URL: `https://api.mintlify.com/discovery/v2/assistant/{domain}/message`
   - Auth: assistant API key
   - Compatibility note: the official page says this `v2` endpoint is for AI SDK `v5+`
   - Path parameter:
     - `domain` - docs-domain identifier from the dashboard URL
   - JSON body fields explicitly shown:
     - `fp` - required fingerprint/user identifier
     - `messages` - required message array
     - `threadId` - optional conversation continuity identifier
     - `retrievalPageSize` - optional, default `5`
     - `filter` - optional filtering object
     - `context` - optional array of contextual snippets such as `code` or `textSelection`
   - Rate limits explicitly shown on the page:
     - `10,000` requests per Mintlify organization per hour
     - `10,000` requests per IP per day

8. `POST /search/{domain}`
   - Full URL: `https://api.mintlify.com/discovery/v1/search/{domain}`
   - Auth: assistant API key
   - Path parameter:
     - `domain`
   - JSON body fields confirmed:
     - `query` - required
     - `pageSize` - optional integer, default `10`, range `1..50`
     - `scoreThreshold` - optional number, range `0..1`
     - `filter.version`
     - `filter.language`
     - `filter.tag`
   - Response items shown on the page include:
     - `content`
     - `path`
     - `metadata`
   - Rate limit explicitly shown: `10,000` requests per Mintlify organization per hour

9. `POST /page/{domain}`
   - Full URL: `https://api.mintlify.com/discovery/v1/page/{domain}`
   - Auth: assistant API key
   - Path parameter:
     - `domain`
   - JSON body fields confirmed:
     - `path` - required page slug/path; the page notes this corresponds to the page/path returned by search results
   - Response:
     - `200` with `path` and `content`
   - The official page also shows a `404` response possibility
   - Rate limit explicitly shown: `10,000` requests per Mintlify organization per hour

## Pagination
From the reviewed Mintlify pages:
- `POST /search/{domain}` supports result-size control via `pageSize`
- the reviewed search page did not expose a cursor or opaque page token; pagination is essentially size-limited result retrieval rather than cursor-based scrolling on the visible docs
- the reviewed deployment and agent routes are asynchronous/job-based rather than paginated

## Rate limits
Explicitly documented on the reviewed official pages:
- assistant message API: `10,000` requests per Mintlify organization per hour and `10,000` requests per IP per day
- assistant search API: `10,000` requests per Mintlify organization per hour
- assistant page-content API: `10,000` requests per Mintlify organization per hour
- agent create/follow-up APIs: `100` uses per Mintlify project per hour
- preview deployment API: `5` requests per minute per organization
- API keys creation: up to `10` keys per hour per organization

## Error and response notes
- deployment-trigger routes return `202` and expect clients to follow up with the status endpoint
- agent routes are asynchronous and expose terminal statuses `completed`, `archived`, and `failed`
- assistant page-content explicitly documents a `404` possibility when the page cannot be found
- the reviewed route pages were much clearer about response fields than about a single global error schema; I documented only the response/error details that were explicitly visible on the official pages

## Important usage notes
- Mintlify splits admin and assistant APIs cleanly; using the wrong token class is likely to fail even if the route path is otherwise correct
- preview deployments are plan-gated to Pro and Enterprise
- assistant v2 message generation is the currently recommended path for AI SDK `v5+`; the page explicitly calls out a separate v1 route for older AI SDK integrations
- agent jobs may create pull requests automatically, surfaced via `prLink`
- Mintlify also exposes analytics routes in the official API navigation, but this pass focused on the deployment, agent, and assistant routes above and only counts those routes as manually confirmed

## Verification notes
This file was manually rebuilt from Mintlify’s official API introduction plus the reviewed official route reference pages listed above.