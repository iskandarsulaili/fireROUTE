# staffSign

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `staffsign`
- Official docs used manually:
  - `https://staffsign.de/docs/`
- Official documentation version note shown on the page: `Version 1.0 · Stand 2026-03-31`
- Documented API base URL: `https://api.promotionbasis.de/staffsign`
- Primary response formats documented:
  - `application/json` when `Accept: application/json`
  - `application/ld+json` on list endpoints when the lightweight JSON `Accept` header is omitted
- Authentication: API key in `X-Api-Key`
- Manually confirmed routes in this pass: `14`

## Authentication and common conventions
From the reviewed official docs:
- API keys are created in the iPM dashboard under `staffSign > API-Zugang`
- every request must send `X-Api-Key: <dein-api-key>`
- documented API key format is `{userId}.{randomPart}`
  - the page shows a UUID prefix plus a 32-character random suffix
- each API key is bound to one organization and data is automatically isolated to that organization
- requests use `Content-Type: application/json`
- sending `Accept: application/json` returns lean JSON without Hydra metadata
- without that `Accept` header, list endpoints return `application/ld+json`

## Confirmed API surface
The reviewed route overview explicitly documents these endpoints:
- `POST /staffsign/contracts`
- `GET /staffsign/contracts`
- `GET /staffsign/contracts/{id}`
- `POST /staffsign/contracts/{id}/send`
- `POST /staffsign/contracts/{id}/cancel`
- `DELETE /staffsign/contracts/{id}`
- `POST /staffsign/contracts/preview`
- `POST /staffsign/contract_templates`
- `GET /staffsign/contract_templates`
- `GET /staffsign/contract_templates/{id}`
- `PATCH /staffsign/contract_templates/{id}`
- `POST /staffsign/contract_templates/{id}/activate`
- `DELETE /staffsign/contract_templates/{id}`
- `POST /staffsign/contract_templates/validate`

## 1) Create contract
- Method: `POST`
- Path: `/staffsign/contracts`
- Purpose: create a new contract from a template

Documented request body fields visible on the reviewed page:
- `contractTemplateId` - required template UUID
- `signatureLevel` - required enum such as `signature_level.qes`
- `contractType` - required contract type key
- `participants` - required array; docs state at least 2 participants with different roles are required

Documented participant-level fields visible in the reviewed example:
- `role`
- `signingMethod`
- `participantId`
- `participantData`

Documented participantData fields visible in the reviewed example:
- `email`
- `firstName`
- `lastName`
- `company`
- `gender`
- `street`
- `zipcode`
- `city`
- `country`

## 2) List contracts
- Method: `GET`
- Path: `/staffsign/contracts`
- Purpose: list contracts for the current organization

Documented pagination parameters:
- `page` - default `1`
- `itemsPerPage` - default `30`, max `100`

Documented content-negotiation note:
- with `Accept: application/ld+json`, list responses include Hydra metadata such as `hydra:totalItems`

## 3) Get contract by id
- Method: `GET`
- Path: `/staffsign/contracts/{id}`
- Purpose: return one full contract record

Documented path parameter:
- `id` - contract UUID

## 4) Send contract
- Method: `POST`
- Path: `/staffsign/contracts/{id}/send`
- Purpose: send a draft contract to participants for signature

Documented path parameter:
- `id`

## 5) Cancel contract
- Method: `POST`
- Path: `/staffsign/contracts/{id}/cancel`
- Purpose: cancel a contract that is in a cancellable state

Documented path parameter:
- `id`

## 6) Delete contract
- Method: `DELETE`
- Path: `/staffsign/contracts/{id}`
- Purpose: delete a contract

Documented path parameter:
- `id`

Important error note from the docs:
- trying to delete a contract that is no longer in draft state is listed as a `422` scenario

## 7) Preview contract
- Method: `POST`
- Path: `/staffsign/contracts/preview`
- Purpose: generate a contract preview before creation/sending

Documentation note:
- the reviewed route inventory explicitly includes this endpoint, but the nearby route excerpt in the inspected page focused more on the surrounding contract/template flows than a separate parameter table for preview

## 8) Create contract template
- Method: `POST`
- Path: `/staffsign/contract_templates`
- Purpose: create a new contract template

Documented request body fields:
- `name` - required, `2–255` characters
- `description` - optional, max `1000` characters
- `content` - required markdown template content

Documented lifecycle note:
- new templates start in status `contract_template_status.draft`
- they must be activated separately before contract creation can use them

## 9) List contract templates
- Method: `GET`
- Path: `/staffsign/contract_templates`
- Purpose: list templates

Documented pagination behavior:
- the same `page` / `itemsPerPage` convention described in the general pagination section applies to list endpoints

## 10) Get contract template by id
- Method: `GET`
- Path: `/staffsign/contract_templates/{id}`
- Purpose: fetch one template

Documented path parameter:
- `id`

## 11) Update contract template
- Method: `PATCH`
- Path: `/staffsign/contract_templates/{id}`
- Purpose: update an existing template

Documented path parameter:
- `id`

## 12) Activate contract template
- Method: `POST`
- Path: `/staffsign/contract_templates/{id}/activate`
- Purpose: activate a draft template so it can be used for contract creation

Documented path parameter:
- `id`

## 13) Archive contract template
- Method: `DELETE`
- Path: `/staffsign/contract_templates/{id}`
- Purpose: archive a template

Documented path parameter:
- `id`

## 14) Validate contract template
- Method: `POST`
- Path: `/staffsign/contract_templates/validate`
- Purpose: validate template content and placeholders without creating the template

Documentation note:
- the route inventory explicitly lists this endpoint
- the reviewed error table names invalid placeholders as a `422` scenario for template validation / creation flows

## Status codes, date formats, and errors
The reviewed official docs explicitly publish these status codes:
- `200` - success with response body
- `201` - resource created with response body
- `204` - success without response body; docs explicitly associate this with cancel, delete, activate, update, and validate actions
- `401` - invalid or missing API key
- `403` - no permission for the resource
- `404` - resource not found
- `422` - validation error
- `500` - internal server error

Documented date/time formats:
- request dates: `YYYY-MM-DD`
- request times: `HH:MM`
- response dates: `YYYY-MM-DD`
- response timestamps: `YYYY-MM-DD HH:MM:SS`
- signed / webhook timestamps: ISO 8601

Documented validation error shape:
- `violations[]`
- each violation includes `propertyPath`, `message`, and `code`

Examples of explicitly documented `422` scenarios:
- missing required fields
- trying to delete a contract that is not in draft state
- trying to cancel a contract that is not in status `sent`
- using an inactive template
- duplicate participant email addresses
- invalid placeholders in templates

## Webhooks and retries
The same official page also documents outgoing webhooks for events such as:
- `contract.created`
- `contract.sent`
- `contract.recipient_signed`
- `contract.organization_signed`
- `contract.completed`
- `contract.document_ready`
- `contract.cancelled`
- `contract.expired`
- `identification.completed`

Operational webhook notes:
- timeout: `10` seconds
- retry schedule: about `10 s`, then `40 s`, then `160 s`
- after 3 retries, delivery is abandoned
- after `30` failures, the webhook is auto-disabled until reactivated in the dashboard

## Pagination, rate limits, and representation notes
- List pagination uses `page` and `itemsPerPage`.
- The reviewed docs do not publish a numeric API rate limit.
- The docs distinguish between lean JSON and Hydra JSON-LD responses based on `Accept`.
- Enum values are documented as machine keys such as `category.value`, and the docs say requests should use the key form.

## fireROUTE notes
- staffSign is a relatively compact HR/document-signing API centered on contract and contract-template lifecycles rather than generic file storage.
- Use `Accept: application/json` unless your adapter explicitly wants Hydra metadata.
- The docs page displays a base URL of `https://api.promotionbasis.de/staffsign` while the route table also shows `/staffsign/...` paths; preserve the official route strings exactly and validate final composed URLs during implementation.
- Webhook behavior is documented on the same official page even though webhook configuration itself is dashboard-driven rather than represented as a REST resource in the reviewed route table.

## Verification notes
This file was manually rebuilt from the live official staffSign API documentation using browser inspection.