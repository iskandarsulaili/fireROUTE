# Smartsheet

Official docs manually reviewed:
- https://developers.smartsheet.com/
- https://developers.smartsheet.com/api/smartsheet/guides/basics/authentication
- https://developers.smartsheet.com/api/smartsheet/guides/basics/limitations
- https://developers.smartsheet.com/api/smartsheet/guides/basics/pagination
- https://developers.smartsheet.com/api/smartsheet/guides/advanced-topics/scalability-options
- https://developers.smartsheet.com/api/smartsheet/openapi

## Overview
Smartsheet’s official REST API is documented as a versioned HTTPS API rooted at:

- `https://api.smartsheet.com/2.0`

Confirmed from the reviewed official docs:
- Base URL: `https://api.smartsheet.com/2.0`
- Auth: bearer access tokens (Smartsheet’s docs also describe them as API keys)
- Response format: JSON
- The reviewed OpenAPI reference currently exposes **127** method/path pairs across **34** named resource groups
- The reviewed OpenAPI reference is labeled **`Smartsheet OpenAPI Reference (2.0.0)`**
- The reviewed OpenAPI overview explicitly notes the API is restricted to users on **Business and Enterprise plans**

## Confirmed resource groups
The reviewed sidebar and OpenAPI reference currently expose these resource groups:
- `Alternate Email addresses`
- `Attachments`
- `Automation Rules`
- `Cell Images`
- `Cells`
- `Columns`
- `Comments`
- `Contacts`
- `Cross-sheet References`
- `Dashboards`
- `Discussions`
- `Events`
- `Favorites`
- `Folders`
- `Group Members`
- `Groups`
- `Home`
- `Imports`
- `Proofs`
- `Reports`
- `Rows`
- `Search`
- `Send via Email`
- `Server Info`
- `Sharing`
- `Sheet Summary`
- `Sheets`
- `Templates`
- `Tokens`
- `Update Requests`
- `Users`
- `Webhooks`
- `Workspaces`
- `Schemas`

## Concrete endpoints confirmed from the reviewed OpenAPI reference
| Method | Path | Notes |
|---|---|---|
| GET | `/users/{userId}/alternateemails` | list alternate email addresses |
| POST | `/users/{userId}/alternateemails` | add alternate email |
| GET | `/users/{userId}/alternateemails/{alternateEmailId}` | get one alternate email |
| DELETE | `/users/{userId}/alternateemails/{alternateEmailId}` | delete alternate email |
| POST | `/users/{userId}/alternateemails/{alternateEmailId}/makeprimary` | make alternate email primary |
| GET | `/sheets/{sheetId}/attachments` | list sheet attachments |
| POST | `/sheets/{sheetId}/attachments` | upload attachment |
| GET | `/sheets/{sheetId}/attachments/{attachmentId}` | get attachment metadata |
| DELETE | `/sheets/{sheetId}/attachments/{attachmentId}` | delete attachment |
| GET | `/sheets/{sheetId}/attachments/{attachmentId}/versions` | list attachment versions |
| POST | `/sheets/{sheetId}/attachments/{attachmentId}/versions` | upload new attachment version |
| GET | `/sheets/{sheetId}/automationrules` | list automation rules |
| GET | `/sheets/{sheetId}/automationrules/{automationRuleId}` | get automation rule |
| PUT | `/sheets/{sheetId}/automationrules/{automationRuleId}` | update automation rule |
| DELETE | `/sheets/{sheetId}/automationrules/{automationRuleId}` | delete automation rule |
| POST | `/imageurls` | create cell-image upload URL |
| POST | `/sheets/{sheetId}/rows/{rowId}/columns/{columnId}/cellimages` | attach cell image |
| GET | `/sheets/{sheetId}/rows/{rowId}/columns/{columnId}/history` | get cell history |
| GET | `/sheets/{sheetId}/columns` | list columns |
| POST | `/sheets/{sheetId}/columns` | create columns |

Manual route count confirmed from the reviewed official OpenAPI reference: **127** method/path pairs.

## Authentication
The reviewed authentication guide explicitly states:
- the API authenticates using **access tokens (API keys)**
- each request requires a bearer token in the `Authorization` header
- Smartsheet Gov and Smartsheet Regions Europe use **separate tokens** from Smartsheet.com

Example pattern shown in the docs:

```http
Authorization: Bearer {API_TOKEN}
```

The guide also explicitly recommends:
- OAuth for user-consent / user-interaction scenarios
- raw token-over-HTTPS requests for strict machine-to-machine scenarios
- never committing tokens to source control

## Pagination
Confirmed from the reviewed pagination guide:
- Smartsheet uses **two pagination strategies**: token-based pagination and offset-based pagination

### Token-based pagination
The reviewed page explicitly documents:
- `paginationType=token` for endpoints that support token paging
- `maxItems` to request a page size
- `lastKey` to fetch the next page
- response bodies include a `lastKey` token when more results remain

Reviewed docs example:
- `GET /workspaces?maxItems=100&paginationType=token`

### Offset-based pagination
The reviewed guide also describes offset-based pagination for other endpoints, where page traversal is based on positional offsets instead of `lastKey`.

## Limitations and scalability notes
Confirmed from the reviewed limitations page:
- add/update-row calls should be limited to **500 rows per request**
- a sheet cannot exceed **500,000 cells**
- a sheet can have up to **500,000 inbound cell links** (`100,000` on Smartsheet Gov)
- a cell cannot contain more than **4,000 characters**
- `GET /reports/{reportId}` with paging defaults to **100 rows** and can return up to **10,000 rows per request**
- reports are limited to **50,000 rows**
- sharing emails can send **1000 per API call**

The reviewed docs did not expose one flat requests-per-second rate-limit table; instead, the official guidance emphasized pagination, scalability strategies, and hard payload/object-size limits.

## Errors and response notes
Confirmed from the reviewed docs:
- error codes have a dedicated reference page in the current docs set
- responses are JSON
- pagination metadata differs depending on whether the endpoint uses token-based or offset-based paging
- the API docs consistently model nested resources deeply, so consumers should preserve resource hierarchy rather than flattening early

## Important usage notes
- Smartsheet’s API surface is broad and sheet-centric; nested routes under `/sheets/{sheetId}/...` are very common.
- The docs explicitly distinguish between Business/Enterprise availability and region-specific token separation.
- Pagination is not uniform across every endpoint; fireROUTE should preserve whether an operation uses token-based or offset-based paging.
- Large-sheet/report integrations should enforce the documented row/cell ceilings before sending writes or assuming one-shot reads will succeed.