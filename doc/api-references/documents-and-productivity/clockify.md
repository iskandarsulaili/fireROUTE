# Clockify

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `clockify`
- Docs used manually:
  - `https://docs.clockify.me/`
- Confirmed primary API bases from the official docs:
  - regular API: `https://api.clockify.me/api/v1`
  - reports API: `https://reports.api.clockify.me/v1`
- Additional official host examples shown by the docs:
  - regional regular API example: `https://euc1.clockify.me/api/v1`
  - regional reports example: `https://use2.clockify.me/report/v1`
  - subdomain-scoped examples under `{workspace-subdomain}.clockify.me`
- Primary response format: JSON
- Authentication styles confirmed on the official docs page:
  - `X-Api-Key`
  - `X-Addon-Token`
- Manually confirmed routes in this pass: `7`

## Authentication
From the official introduction/authentication section:
- send either `X-Api-Key` or `X-Addon-Token` in the request header
- `X-Api-Key` is the standard user/workspace API key flow
- `X-Addon-Token` is the add-on token flow used for marketplace/integration contexts
- Important official note:
  - if a workspace is on a subdomain such as `subdomain.clockify.me`, users need a newly generated API key from Profile Settings that works for that workspace specifically

## Common request/response conventions
- The docs present the public API as `Clockify API (v1)`
- Request and response bodies on the reviewed operation pages are JSON
- Reviewed route pages use path parameters such as `workspaceId`, `userId`, `projectId`, and `webhookId`
- Reports use a distinct base host family from the main operational API
- The docs are more explicit about success schemas and request-body fields than about a single global error-envelope schema

## Manually confirmed endpoint set

### 1) Get the current user
- Method: `GET`
- Path: `/v1/user`
- Full URL: `https://api.clockify.me/api/v1/user`
- Auth shown by the docs: API-key/token auth on the request header
- Purpose: return the authenticated user profile
- Confirmed response fields from the reviewed sample include:
  - `activeWorkspace`
  - `defaultWorkspace`
  - `email`
  - `id`
  - `memberships`
  - `name`
  - `profilePicture`
  - `settings`
  - `status`

### 2) List workspaces
- Method: `GET`
- Path: `/v1/workspaces`
- Full URL: `https://api.clockify.me/api/v1/workspaces`
- Purpose: list accessible workspaces
- Confirmed response fields include:
  - `cakeOrganizationId`
  - `costRate`
  - `currencies`
  - `featureSubscriptionType`
  - `features`
  - `hourlyRate`
  - `id`
  - `imageUrl`
  - `memberships`
  - `name`
  - `subdomain`
  - `workspaceSettings`

### 3) Create a workspace
- Method: `POST`
- Path: `/v1/workspaces`
- Purpose: create a new workspace
- Request body fields confirmed:
  - `name` - required string, length `1..50`
  - `organizationId` - optional/available Cake organization identifier
- Confirmed response code and body behavior:
  - `201 Created`
  - returns a populated workspace object including rates, features, memberships, and subdomain info

### 4) Create a project
- Method: `POST`
- Path: `/v1/workspaces/{workspaceId}/projects`
- Purpose: create a project inside a workspace
- Auth shown by the reviewed route page:
  - `ApiKeyAuth`
  - `AddonKeyAuth`
- Path parameter:
  - `workspaceId` - required workspace identifier
- Request body fields directly visible on the reviewed page include:
  - `billable`
  - `clientId`
  - `color`
  - `costRate`
  - `estimate`
  - `hourlyRate`
  - `isPublic`
  - `memberships`
  - `name`
  - `note`
  - `tasks`
- Confirmed success code:
  - `201 Created`
- Confirmed response fields include:
  - `archived`
  - `billable`
  - `budgetEstimate`
  - `clientId`
  - `clientName`
  - `color`
  - `costRate`
  - `duration`
  - `estimate`
  - `estimateReset`
  - `hourlyRate`
  - `id`
  - `memberships`
  - `name`
  - `note`
  - `public`
  - `template`
  - `timeEstimate`
  - `workspaceId`

### 5) Create a time entry
- Method: `POST`
- Path: `/v1/workspaces/{workspaceId}/time-entries`
- Purpose: create a time entry in a workspace
- Auth shown by the reviewed route page:
  - `ApiKeyAuth`
  - `AddonKeyAuth`
- Path parameter:
  - `workspaceId` - required workspace identifier
- Request body fields confirmed on the reviewed page include:
  - `billable`
  - `customAttributes`
  - `customFields`
  - `description`
  - `end`
  - `projectId`
  - `start`
  - `tagIds`
  - `taskId`
  - `type`
- Confirmed response fields include:
  - `billable`
  - `customFieldValues`
  - `description`
  - `id`
  - `isLocked`
  - `kioskId`
  - `projectId`
  - `tagIds`
  - `taskId`
  - `timeInterval`
  - `type`
  - `userId`
  - `workspaceId`
- Confirmed success code:
  - `201 Created`

### 6) Create a webhook
- Method: `POST`
- Path: `/v1/workspaces/{workspaceId}/webhooks`
- Purpose: register a webhook in a workspace
- Auth shown by the reviewed route page:
  - `ApiKeyAuth`
  - `AddonKeyAuth`
- Path parameter:
  - `workspaceId` - required workspace identifier
- Request body fields confirmed:
  - `name`
  - `triggerSource`
  - `triggerSourceType`
  - `url`
  - `webhookEvent`
- Confirmed response fields include:
  - `authToken`
  - `deliveryEnabled`
  - `enabled`
  - `id`
  - `name`
  - `planEnabled`
  - `triggerSource`
  - `triggerSourceType`
  - `url`
  - `userId`
  - `webhookEvent`
  - `workspaceId`
- Confirmed success code:
  - `201 Created`

### 7) Run a detailed report
- Method: `POST`
- Path: `/v1/workspaces/{workspaceId}/reports/detailed`
- Full URL example base: `https://reports.api.clockify.me/v1/workspaces/{workspaceId}/reports/detailed`
- Purpose: produce a detailed time-entry report
- Request body shape confirmed from the reviewed official example includes filters such as:
  - `amountShown`
  - `amounts`
  - `approvalState`
  - `archived`
  - `attendanceFilter`
  - `billable`
  - `clients`
  - `currency`
  - `customFields`
  - `dateRangeStart`
  - `dateRangeEnd`
  - `dateRangeType`
  - `description`
  - `detailedFilter.page`
  - `detailedFilter.pageSize`
  - `exportType`
  - `invoicingState`
  - `projects`
  - `rounding`
  - `sortOrder`
  - `tags`
  - `tasks`
  - `timeZone`
  - `userGroups`
  - `users`
  - `weekStart`
- Important route note:
  - the official docs present reports on a separate report-oriented base host family, not under the main `api.clockify.me/api/v1` host

## Pagination
From the official Pagination section:
- synchronous list-oriented `GET` endpoints may support:
  - `page`
  - `pageSize`
- `page` is 1-indexed and defaults to `1`
- endpoints that support pagination return a custom `Last-Page` header
  - `true` means the current page is the final page
  - `false` means more data is available
- the detailed reports example also shows report-specific nested pagination fields such as `detailedFilter.page` and `detailedFilter.pageSize`

## Rate limits
From the official Rate limiting section:
- a specific published limit exists for add-on-token traffic:
  - `50` requests per second
  - scoped "by addon on one workspace"
  - applies when using `X-Addon-Token`
- exceeding that limit returns an error with description `Too many requests`
- the reviewed public docs page did **not** expose a separate numeric per-second/per-minute limit for ordinary `X-Api-Key` traffic, so this file does not invent one

## Error and response notes
Confirmed from the reviewed docs:
- route pages focus heavily on success samples and request schemas
- the publicly visible docs session does not expose one concise global error-schema page for all operations
- the add-on-token rate-limit section explicitly mentions a `Too many requests` error on limit exceedance
- many route pages expose direct success response examples with concrete field lists

## Important usage notes
- Clockify documents both a main operational API and separate report-host examples; fireROUTE should keep those host families distinct
- The official API-URLs section mixes global, regional, and subdomain examples. The host portion is therefore deployment-sensitive even though the path families stay stable
- Webhook quotas are plan-dependent according to the official prose:
  - FREE: up to `3` webhooks
  - BASIC / STANDARD / PRO: up to `10` per user and `100` per workspace
  - ENTERPRISE: up to `100` per user and `300` per workspace
- The current docs are route-rich; this manual rewrite only counts the seven operations directly reviewed in this pass, not the entire Clockify surface

## Verification notes
This file was manually rebuilt from the official Clockify documentation reachable in this browser session, replacing the earlier low-fidelity generated summary.
