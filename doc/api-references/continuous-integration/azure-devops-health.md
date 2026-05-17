# Azure DevOps Health

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `azure-devops-health`
- Docs used manually:
  - `https://learn.microsoft.com/en-us/rest/api/resourcehealth/availability-statuses?view=rest-resourcehealth-2025-05-01`
  - `https://learn.microsoft.com/en-us/rest/api/resourcehealth/availability-statuses/get-by-resource?view=rest-resourcehealth-2025-05-01&tabs=HTTP`
  - `https://learn.microsoft.com/en-us/rest/api/resourcehealth/availability-statuses/list?view=rest-resourcehealth-2025-05-01&tabs=HTTP`
  - `https://learn.microsoft.com/en-us/rest/api/resourcehealth/availability-statuses/list-by-resource-group?view=rest-resourcehealth-2025-05-01&tabs=HTTP`
  - `https://learn.microsoft.com/en-us/rest/api/resourcehealth/availability-statuses/list-by-subscription-id?view=rest-resourcehealth-2025-05-01&tabs=HTTP`
- Confirmed REST API base URL: `https://management.azure.com`
- Service shown in docs: `Resource Health`
- API version reviewed: `2025-05-01`
- Primary media type: JSON
- Authentication model surfaced in docs: Azure Active Directory OAuth2 (`user_impersonation` scope shown on reviewed pages)
- Manually confirmed routes in this pass: `4`

## Authentication and authorization
From the reviewed Microsoft Learn reference pages:
- all reviewed operations use the `azure_auth` security scheme
- the docs describe this as Azure Active Directory OAuth2
- the reviewed route pages show:
  - Authorization URL: `https://login.microsoftonline.com/common/oauth2/authorize`
  - Scope: `user_impersonation`
- in practice these operations are Azure Resource Manager calls under `management.azure.com`, so clients should send a standard ARM Bearer token in the `Authorization` header

## Common request/response conventions
- Base URL: `https://management.azure.com`
- every reviewed route requires `api-version=2025-05-01`
- responses are JSON objects
- list-style endpoints return an `availabilityStatusListResult`
- sample response payloads on the official pages show availability entities with:
  - top-level `id`, `name`, `type`, `location`
  - nested `properties` including `availabilityState`, `title`, `summary`, `reasonType`, `context`, `category`, `detailedStatus`, `reportedTime`, and optional recommended actions / service-impacting events

## Manually confirmed endpoint set
1. `GET /{resourceUri}/providers/Microsoft.ResourceHealth/availabilityStatuses/current`
   - Full URL pattern: `https://management.azure.com/{resourceUri}/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2025-05-01`
   - Purpose: get the current availability status for a single resource
   - Required path parameter:
     - `resourceUri` - fully qualified Azure Resource Manager resource ID
   - Optional query parameters confirmed on the page:
     - `$expand` - `recommendedactions` expansion is explicitly documented
     - `$filter`
   - Success response: `200` with an `availabilityStatus` object

2. `GET /{resourceUri}/providers/Microsoft.ResourceHealth/availabilityStatuses`
   - Full URL pattern: `https://management.azure.com/{resourceUri}/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2025-05-01`
   - Purpose: list historical availability transitions and impacting events for a single resource
   - Required path parameter:
     - `resourceUri`
   - Optional query parameters:
     - `$expand`
     - `$filter`
   - Success response: `200` with `availabilityStatusListResult`

3. `GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceHealth/availabilityStatuses`
   - Full URL pattern: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2025-05-01`
   - Purpose: list current availability statuses for all resources in a resource group
   - Required path parameters:
     - `subscriptionId`
     - `resourceGroupName` - docs note max length `90` and case-insensitive matching
   - Optional query parameters:
     - `$expand`
     - `$filter`
   - Success response: `200` with `availabilityStatusListResult`

4. `GET /subscriptions/{subscriptionId}/providers/Microsoft.ResourceHealth/availabilityStatuses`
   - Full URL pattern: `https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2025-05-01`
   - Purpose: list current availability statuses for all resources in a subscription
   - Required path parameter:
     - `subscriptionId`
   - Optional query parameters:
     - `$expand`
     - `$filter`
   - Success response: `200` with `availabilityStatusListResult`
   - The official sample response explicitly includes `nextLink`, showing server-driven pagination

## Pagination
From the reviewed official docs:
- the subscription-level list example explicitly returns `nextLink`
- that means clients should follow `nextLink` when present rather than constructing their own next-page URL
- the resource-group and per-resource list pages use the same list-result type, so similar continuation behavior is plausible, but I am only treating subscription-level `nextLink` as explicitly confirmed in this pass

## Rate limits
- the reviewed Microsoft Learn route pages did not publish numeric per-route rate limits
- standard Azure Resource Manager throttling behavior may still apply, but I am not inventing a quota figure that was not explicitly visible on the reviewed pages

## Error and response notes
- all reviewed route pages document:
  - `200 OK` on success
  - `Other Status Codes` returning `ErrorResponse`
- the official `ErrorResponse` schema exposes:
  - `code`
  - `details`
  - `message`
- current-status responses may include `recommendedActions`
- history/list responses may include `serviceImpactingEvents`
- enum values explicitly shown for `availabilityState` include:
  - `Available`
  - `Unavailable`
  - `Degraded`
  - `Unknown`

## Important usage notes
- this provider row is named `azure-devops-health`, but the official documentation currently points to Azure Resource Health under Azure Resource Manager, not to Azure DevOps build/test health endpoints
- the current-resource route uses `/current`, while the history route omits `/current` and returns the broader availability history list
- the docs explicitly support `$expand=recommendedactions`
- the docs also expose rich event-history details such as `serviceImpactingEvents`, `incidentProperties`, and timestamps like `occuredTime`, `reportedTime`, and `resolutionETA`

## Verification notes
This file was manually rebuilt from the official Microsoft Learn Azure Resource Health REST reference pages listed above.