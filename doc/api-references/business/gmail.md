# Gmail

Official docs manually reviewed:
- https://developers.google.com/workspace/gmail/api/reference/rest
- https://developers.google.com/workspace/gmail/api/reference/quota

## Overview
The Gmail API is Google’s REST API for mailbox data such as messages, drafts, threads, labels, settings, and push watches.

Confirmed from the reviewed official docs:
- Service endpoint / base URL: `https://gmail.googleapis.com`
- Discovery document: `https://gmail.googleapis.com/$discovery/rest?version=v1`
- Auth: OAuth 2.0 bearer tokens
- Response format: JSON
- The reviewed REST reference currently exposes **79** method rows for `v1`

## Confirmed resource families
The reviewed REST reference showed these current REST resources:
- `users`
- `users.drafts`
- `users.history`
- `users.labels`
- `users.messages`
- `users.messages.attachments`
- `users.settings`
- `users.settings.cse.identities`
- `users.settings.cse.keypairs`
- `users.settings.delegates`
- `users.settings.filters`
- `users.settings.forwardingAddresses`
- `users.settings.sendAs`
- `users.settings.sendAs.smimeInfo`
- `users.threads`

## Concrete endpoints confirmed from the reviewed reference
| Method | Path | Notes |
|---|---|---|
| GET | `/gmail/v1/users/{userId}/profile` | get the current user profile |
| POST | `/gmail/v1/users/{userId}/stop` | stop push notifications |
| POST | `/gmail/v1/users/{userId}/watch` | create/update a mailbox watch |
| POST | `/gmail/v1/users/{userId}/drafts` | create a draft |
| POST | `/upload/gmail/v1/users/{userId}/drafts` | media-upload variant for draft creation |
| GET | `/gmail/v1/users/{userId}/drafts` | list drafts |
| GET | `/gmail/v1/users/{userId}/drafts/{id}` | get one draft |
| PUT | `/gmail/v1/users/{userId}/drafts/{id}` | replace a draft |
| POST | `/gmail/v1/users/{userId}/drafts/send` | send an existing draft |
| GET | `/gmail/v1/users/{userId}/history` | list mailbox history changes |
| POST | `/gmail/v1/users/{userId}/labels` | create label |
| GET | `/gmail/v1/users/{userId}/labels` | list labels |
| GET | `/gmail/v1/users/{userId}/labels/{id}` | get label |
| PATCH | `/gmail/v1/users/{userId}/labels/{id}` | patch label |
| GET | `/gmail/v1/users/{userId}/messages` | list messages |
| GET | `/gmail/v1/users/{userId}/messages/{id}` | get message |
| POST | `/gmail/v1/users/{userId}/messages/send` | send message |
| GET | `/gmail/v1/users/{userId}/messages/{messageId}/attachments/{id}` | fetch attachment payload |
| GET | `/gmail/v1/users/{userId}/threads` | list threads |
| GET | `/gmail/v1/users/{userId}/threads/{id}` | get thread |

Manual route count confirmed from the reviewed official REST reference: **79** method rows.

## Parameters, pagination, and responses
Confirmed from the reviewed docs:
- common path parameters include `userId`, `id`, `messageId`, and `threadId`
- list-style endpoints use standard Google pagination patterns such as `maxResults` and `pageToken`
- the API exposes typed resources such as Message, Thread, Draft, Label, and multiple Settings resources
- upload-capable operations have `/upload/...` variants in the official reference
- responses and errors are JSON

## Rate limits and quota notes
Confirmed from the reviewed quota page:
- per-minute per-project quota: `1,200,000` quota units
- per-minute per-user-per-project quota: `6,000` quota units
- Gmail API limits are expressed in quota units rather than a flat request count
- the quota page explicitly notes API quota changes effective May 1, 2026 for newly created cloud projects

## Important usage notes
- Gmail’s official REST reference is broad; message/draft send flows can use upload endpoints as well as metadata-only endpoints.
- Push-notification integrations depend on the `watch` / `stop` lifecycle.
- fireROUTE should preserve Google’s resource hierarchy instead of flattening nested resources like `users.settings.sendAs.smimeInfo`.