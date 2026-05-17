# PandaDoc

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `pandadoc`
- Official docs/pages reviewed manually:
  - `https://developers.pandadoc.com/reference/about`
  - `https://developers.pandadoc.com/reference/limits`
  - `https://developers.pandadoc.com/reference/list-documents`
  - `https://developers.pandadoc.com/reference/create-document`
  - `https://developers.pandadoc.com/reference/template-details`
  - `https://developers.pandadoc.com/reference/list-webhooks-subscriptions`
  - `https://developers.pandadoc.com/openapi/pandadoc-public-api.json`
- Confirmed REST API base URL: `https://api.pandadoc.com`
- Primary response format: JSON
- Manually confirmed route count in the current official OpenAPI document: `124`
- Route-method breakdown confirmed from the official OpenAPI document:
  - `55` `GET`
  - `38` `POST`
  - `16` `PATCH`
  - `12` `DELETE`
  - `3` `PUT`

## Authentication
The official docs currently publish two first-party auth models:

### API key auth
- Header name: `Authorization`
- Required value format: `API-Key {api_key}`
- The official security-scheme description explicitly says the header must be prefixed with `API-Key` followed by a space and the actual key.

### OAuth 2.0 auth code flow
- Authorization URL: `https://app.pandadoc.com/oauth2/authorize`
- Token URL: `https://api.pandadoc.com/oauth2/access_token`
- Refresh URL: `https://api.pandadoc.com/oauth2/access_token`
- Reviewed scope published in the official spec: `read+write`
- The auth docs describe the usual authorization-code redirect flow with `client_id`, `redirect_uri`, `scope=read+write`, and `response_type=code`.

## Base URL and route shape
- API server published in the current OpenAPI document: `https://api.pandadoc.com`
- Main path families are split across:
  - `/public/v1/...`
  - `/public/v2/...`
  - `/public/beta/...`
  - `/oauth2/...`
- fireROUTE note: preserve versioned paths exactly because PandaDoc mixes `v1`, `v2`, and beta routes in the same public surface.

## Request and response conventions
- The reviewed official docs describe PandaDoc as a REST API.
- Primary request/response media type in the reviewed OpenAPI document: `application/json`
- The official spec also uses multipart upload variants for file-based creation flows.
- Upload-style operations are published as exact path variants rather than separate hosts, for example:
  - `POST /public/v1/documents?upload`
  - `POST /public/v1/documents?upload-markdown`
  - `POST /public/v1/content-library-items?upload`
  - `POST /public/v1/templates?upload`
  - `POST /public/v1/documents/{id}/attachments?upload`
  - `POST /public/v1/documents/{document_id}/sections/uploads?upload`
- The reviewed error schema is wrapped as:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Rate limits and payload limits
From the official `Limits` page:
- limits are per user, not per API key
- limits use a rolling `60`-second sliding window
- reviewed production-key per-endpoint RPM examples:
  - `Create from PDF, Document` -> `300`
  - `Create from PDF, Section` -> `50`
  - `Create from Template, Document` -> `500`
  - `Create from Template, Section` -> `300`
  - `Send Document` -> `400`
  - `Document Details` -> `600`
  - `Template/CLI Details` -> `300`
  - `List, Status, Delete` -> `2000`
  - `Download Document` -> `100`
  - `Download Protected Document` -> `300`
  - `Create Notarization Request` -> `100`
- sandbox API keys are documented at `10 requests/minute` for any endpoint
- throttled requests return HTTP `429 Too Many Requests`
- maximum request body size: `2 MB`
- maximum uploaded PDF size for document creation: `50 MB`
- the limits page explicitly says oversized PDF uploads return `413 Request entity too large`

## Pagination and parameter notes
Confirmed from the official OpenAPI document and reviewed route pages:
- list-style PandaDoc routes commonly use page-number pagination via `page` + `count`
- `GET /public/v1/documents` confirms filters such as:
  - `template_id`, `form_id`, `folder_uuid`, `contact_id`
  - `count`, `page`, `order_by`
  - `created_from`, `created_to`, `completed_from`, `completed_to`
  - `modified_from`, `modified_to`
  - `deleted`, `id`, `membership_id`, `metadata`, `q`, `status`, `status__ne`, `tag`
- `GET /public/v1/templates` confirms:
  - `q`, `shared`, `deleted`, `count`, `page`, `id`, `folder_uuid`, `tag`, `fields`
- reviewed create/update routes confirm route-specific query modifiers such as:
  - `editor_ver`
  - `use_form_field_properties`
  - `fields`
- the reviewed docs do not expose a single shared cursor contract across the whole API; pagination remains route-family-specific.

## Error and status notes
From the reviewed official OpenAPI document and limits page:
- common documented response codes across sampled routes include `400`, `401`, `403`, `404`, `409`, and `429`
- `201` is used on successful creates
- `204` is used on several update/delete flows
- `429` is the published throttle response
- the current public error payload documents two required fields inside `error`:
  - `code`
  - `message`

## Confirmed route inventory
The current official OpenAPI document exposes `124` concrete method+path operations.

### OAuth 2.0 Authentication (`1` route)
- `POST /oauth2/access_token`

### Documents (`27` routes)
- `GET /public/v1/documents`
- `POST /public/v1/documents`
- `DELETE /public/v1/documents`
- `POST /public/v1/documents?upload`
- `POST /public/v1/documents?upload-markdown`
- `GET /public/v1/documents/{id}`
- `DELETE /public/v1/documents/{id}`
- `PATCH /public/v1/documents/{id}`
- `GET /public/v1/documents/{document_id}/esign-disclosure`
- `PATCH /public/v1/documents/{id}/status`
- `PATCH /public/v1/documents/{id}/status?upload`
- `POST /public/v1/documents/{id}/draft`
- `GET /public/v1/documents/{id}/details`
- `POST /public/v1/documents/{id}/send`
- `POST /public/v1/documents/{id}/editing-sessions`
- `POST /public/v1/documents/{id}/session`
- `GET /public/v1/documents/{id}/download`
- `GET /public/v1/documents/{id}/download-protected`
- `PATCH /public/v1/documents/{id}/ownership`
- `PATCH /public/v1/documents/ownership`
- `POST /public/v1/documents/{id}/move-to-folder/{folder_id}`
- `POST /public/v1/documents/{id}/append-content-library-item`
- `POST /public/beta/documents/{document_id}/docx-export-tasks`
- `GET /public/beta/documents/{document_id}/docx-export-tasks/{task_id}`
- `GET /public/beta/documents/{document_id}/summary`
- `GET /public/beta/documents/{document_id}/content`
- `GET /public/beta/documents/search`

### Document Reminders (`4` routes)
- `PATCH /public/v1/documents/{document_id}/auto-reminders`
- `GET /public/v1/documents/{document_id}/auto-reminders`
- `GET /public/v1/documents/{document_id}/auto-reminders/status`
- `POST /public/v1/documents/{document_id}/send-reminder`

### Document Link to CRM (`4` routes)
- `GET /public/v1/documents/linked-objects`
- `GET /public/v1/documents/{id}/linked-objects`
- `POST /public/v1/documents/{id}/linked-objects`
- `DELETE /public/v1/documents/{id}/linked-objects/{linked_object_id}`

### Document Attachments (`6` routes)
- `GET /public/v1/documents/{id}/attachments`
- `POST /public/v1/documents/{id}/attachments`
- `POST /public/v1/documents/{id}/attachments?upload`
- `GET /public/v1/documents/{id}/attachments/{attachment_id}`
- `DELETE /public/v1/documents/{id}/attachments/{attachment_id}`
- `GET /public/v1/documents/{id}/attachments/{attachment_id}/download`

### Document Fields (`3` routes)
- `GET /public/v1/documents/{id}/fields`
- `PATCH /public/v1/documents/{id}/fields`
- `POST /public/v1/documents/{id}/fields`

### Document Audit Trail (`1` route)
- `GET /public/v2/documents/{document_id}/audit-trail`

### Document Settings (`2` routes)
- `GET /public/v2/documents/{document_id}/settings`
- `PATCH /public/v2/documents/{document_id}/settings`

### Document Recipients (`4` routes)
- `POST /public/v1/documents/{id}/recipients`
- `DELETE /public/v1/documents/{id}/recipients/{recipient_id}`
- `PATCH /public/v1/documents/{id}/recipients/recipient/{recipient_id}`
- `POST /public/v1/documents/{id}/recipients/{recipient_id}/reassign`

### Document Sections / Bundles (`6` routes)
- `GET /public/v1/documents/{document_id}/sections`
- `POST /public/v1/documents/{document_id}/sections/uploads`
- `POST /public/v1/documents/{document_id}/sections/uploads?upload`
- `GET /public/v1/documents/{document_id}/sections/uploads/{upload_id}`
- `GET /public/v1/documents/{document_id}/sections/{section_id}`
- `DELETE /public/v1/documents/{document_id}/sections/{section_id}`

### Document Structure View (`1` route)
- `POST /public/v2/dsv/{document_id}/add-named-items`

### Content Library Items (`5` routes)
- `GET /public/v1/content-library-items`
- `POST /public/v1/content-library-items`
- `POST /public/v1/content-library-items?upload`
- `GET /public/v1/content-library-items/{id}`
- `GET /public/v1/content-library-items/{id}/details`

### Templates (`8` routes)
- `GET /public/v1/templates`
- `POST /public/v1/templates`
- `POST /public/v1/templates?upload`
- `GET /public/v1/templates/{id}/details`
- `DELETE /public/v1/templates/{id}`
- `GET /public/v1/templates/{id}`
- `PATCH /public/v1/templates/{id}`
- `POST /public/v1/templates/{id}/editing-sessions`

### Template Settings (`2` routes)
- `GET /public/v2/templates/{template_id}/settings`
- `PATCH /public/v2/templates/{template_id}/settings`

### API Logs (`4` routes)
- `GET /public/v1/logs`
- `GET /public/v1/logs/{id}`
- `GET /public/v2/logs`
- `GET /public/v2/logs/{id}`

### Forms (`1` route)
- `GET /public/v1/forms`

### Folders (`6` routes)
- `GET /public/v1/documents/folders`
- `POST /public/v1/documents/folders`
- `PUT /public/v1/documents/folders/{id}`
- `GET /public/v1/templates/folders`
- `POST /public/v1/templates/folders`
- `PUT /public/v1/templates/folders/{id}`

### Webhook subscriptions (`6` routes)
- `GET /public/v1/webhook-subscriptions`
- `POST /public/v1/webhook-subscriptions`
- `GET /public/v1/webhook-subscriptions/{id}`
- `PATCH /public/v1/webhook-subscriptions/{id}`
- `DELETE /public/v1/webhook-subscriptions/{id}`
- `PATCH /public/v1/webhook-subscriptions/{id}/shared-key`

### Contacts (`5` routes)
- `GET /public/v1/contacts`
- `POST /public/v1/contacts`
- `GET /public/v1/contacts/{id}`
- `DELETE /public/v1/contacts/{id}`
- `PATCH /public/v1/contacts/{id}`

### Members (`4` routes)
- `GET /public/v1/members`
- `GET /public/v1/members/current`
- `GET /public/v1/members/{id}`
- `POST /public/v1/members/{member_id}/token`

### Webhook events (`2` routes)
- `GET /public/v1/webhook-events`
- `GET /public/v1/webhook-events/{id}`

### Product catalog (`5` routes)
- `GET /public/v2/product-catalog/items/search`
- `POST /public/v2/product-catalog/items`
- `GET /public/v2/product-catalog/items/{item_uuid}`
- `PATCH /public/v2/product-catalog/items/{item_uuid}`
- `DELETE /public/v2/product-catalog/items/{item_uuid}`

### Notary (`5` routes)
- `GET /public/v2/notary/notaries`
- `GET /public/v2/notary/notarization-requests`
- `POST /public/v2/notary/notarization-requests`
- `GET /public/v2/notary/notarization-requests/{session_request_id}`
- `DELETE /public/v2/notary/notarization-requests/{session_request_id}`

### User and Workspace management (`10` routes)
- `GET /public/v1/workspaces`
- `POST /public/v1/workspaces`
- `POST /public/v1/workspaces/{workspace_id}/deactivate`
- `GET /public/v1/users`
- `POST /public/v1/users`
- `GET /public/v1/users/{user_id}`
- `POST /public/v1/workspaces/{workspace_id}/members`
- `DELETE /public/v1/workspaces/{workspace_id}/members/{member_id}`
- `PATCH /public/v1/workspaces/{workspace_id}/members/{member_id}/role`
- `POST /public/v1/workspaces/{workspace_id}/api-keys`

### Quotes (`1` route)
- `PUT /public/v1/documents/{document_id}/quotes/{quote_id}`

### Communication Preferences (`1` route)
- `GET /public/v1/sms-opt-outs`

## Important usage notes
- PandaDoc exposes both route-level API reference pages and a downloadable official OpenAPI document; the OpenAPI document is currently the most complete source of exact method/path inventory.
- Exact upload variants matter. The official surface treats `?upload` and `?upload-markdown` as separate documented operations with their own request semantics.
- Some newer surfaces already live under `/public/v2/...` while much of the mature document/template workflow remains on `/public/v1/...`.
- Beta document-summary/content/DOCX-export operations are documented under `/public/beta/...`; keep them optional or feature-gated in adapters.
- The sandbox and production auth models share the same host, but the reviewed rate-limit page gives sandbox keys their own much lower limit tier.

## Verification note
This file was manually rebuilt from PandaDoc's current official API reference, limits page, and downloadable first-party OpenAPI document using browser inspection only.