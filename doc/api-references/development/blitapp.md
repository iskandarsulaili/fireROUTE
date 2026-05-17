# Blitapp

## Provider metadata
- Category: `Development`
- Provider slug: `blitapp`
- Docs used manually:
  - `https://blitapp.com/api/`
  - `https://blitapp.com/api/swagger.yaml`
- Confirmed API base URL: `https://blitapp.com/api`
- Authentication: API key via header or query parameter
- Primary response format: JSON
- Manually confirmed routes in this pass: `24`

## Authentication
The official Blit Swagger docs say every API call requires an API key generated from a Blit account.

Documented auth forms:
- header API key: intro prose says `API-Key`
- query API key: `key`

Important auth note:
- the Swagger `securityDefinitions` block spells the header name as `Api-key`, while the intro text on the same official docs page says `API-Key`; I documented that inconsistency explicitly instead of guessing which capitalization is canonical.

## Common request/response conventions
- Base URL: `https://blitapp.com/api`
- Swagger version reviewed: `2.0`
- Scheme published in the spec: `https`
- Main media type across the reviewed routes: `application/json`
- Common response codes repeatedly documented in the official spec:
  - `200`
  - `400 Bad request` / `Invalid request`
  - `401 Authentication failed`
- The API is organized around scheduled screenshot jobs, run history, cloud-delivery apps, and API-key management.

## Manually confirmed endpoint set

### Scheduled captures
1. `GET /scheduledcapture` — list all scheduled captures for the authenticated account.
2. `POST /scheduledcapture` — create a scheduled capture from a JSON `ScheduledCapture` body.
3. `GET /scheduledcapture/{id}` — retrieve one scheduled capture by UUID.
4. `PUT /scheduledcapture/{id}` — update one scheduled capture by UUID with a JSON `ScheduledCapture` body.
5. `DELETE /scheduledcapture/{id}` — delete one scheduled capture by UUID.
6. `PUT /scheduledcapture/multiple/all` — bulk-update multiple scheduled captures from a JSON array of `ScheduledCapture` objects.
7. `PUT /scheduledcapture/{id}/pause` — pause a scheduled capture.
8. `PUT /scheduledcapture/{id}/resume` — resume a scheduled capture.
9. `PUT /scheduledcapture/{id}/duplicate` — duplicate a scheduled capture.
10. `PUT /scheduledcapture/test/external` — retrieve URLs from an RSS feed or sitemap.

Confirmed parameters and body notes from the official spec:
- `id` is a required path parameter on the single-capture routes and is documented as a UUID.
- `POST /scheduledcapture` and `PUT /scheduledcapture/{id}` take a required JSON body matching the `ScheduledCapture` schema.
- `PUT /scheduledcapture/multiple/all` takes a required JSON array of `ScheduledCapture` objects.
- `PUT /scheduledcapture/test/external` requires query parameter `url` for the RSS feed or sitemap to inspect.

Confirmed `ScheduledCapture` schema fields visible in the official spec include:
- required top-level fields: `id`, `name`, `captureRequest`, `schedule`, `paused`
- additional top-level fields shown: `comment`, `createdAt`, `updatedAt`
- visible nested `captureRequest` fields include `apps`, `browser`, `country`, and other screenshot-capture settings
- the reviewed enum snippet for `browser` includes `Chrome`, `Firefox`, `iPhone`, and `iPhone 12`

### Web capture execution
11. `GET /webcapture/capture/{id}` — run a scheduled web capture immediately.

Confirmed parameters:
- `id` is a required UUID path parameter.

Confirmed response note:
- the reviewed spec shows a JSON success object containing `status`, with example value `success`.

### Capture history
12. `GET /capturehistory` — get account-wide capture history, page by page.
13. `GET /capturehistory/{scheduledCaptureId}` — get history for one scheduled capture, page by page.
14. `GET /capturehistory/image/{fileId}` — retrieve a screenshot image by file ID.
15. `GET /capturehistory/image/thumbnail/{scheduledCaptureId}` — retrieve the latest thumbnail for a scheduled capture.

Confirmed pagination/filter parameters:
- `GET /capturehistory` supports `captureId`, `pageIndex`, `startDate`, `endDate`, and `tags`.
- `GET /capturehistory/{scheduledCaptureId}` supports required path param `scheduledCaptureId` plus query params `pageIndex`, `pageSize`, `startDate`, and `endDate`.

Confirmed response-format notes from the official spec:
- history routes return a `CaptureHistory` object.
- visible `CaptureHistory` fields include `pageCount` and `pageIndex`.

### App management
16. `GET /apps/all` — list all configured Blit apps.
17. `GET /apps/app/{appId}` — retrieve one app.
18. `POST /apps/app` — create an app from a JSON `App` body.
19. `PUT /apps/app/{appId}` — update an app by UUID.
20. `DELETE /apps/app/{appId}` — delete an app by UUID.
21. `PUT /apps/app/test/verify` — verify an app configuration.

Confirmed app parameters/body notes:
- `appId` is a required UUID path parameter on the single-app routes.
- `POST /apps/app` takes required JSON body `App`.
- `PUT /apps/app/test/verify` takes required JSON body `App`.

Confirmed visible `App` schema fields:
- required fields shown: `id`, `name`, `domain`, `folder`, `file`
- additional fields shown: `authentication`, `createdAt`, `updatedAt`, `type`, `verified`
- visible `type` enum values: `S3`, `Azure`, `GDrive`, `Dropbox`, `RSS`, `Slack`, `FTP`, `Webhook`, `SFTP`

### API-key management
22. `POST /keys` — create a new API key.
23. `GET /keys` — list API keys.
24. `DELETE /keys/{key}` — disable/delete a specific API key by literal key value.

Confirmed key notes:
- `DELETE /keys/{key}` uses required path parameter `key`.
- the official docs note that keys are actually disabled rather than physically deleted, to avoid later accidental recreation of the same value.
- visible `Key` schema fields are `key` and `createdAt`.

## Pagination
From the reviewed official Swagger spec:
- capture-history routes are explicitly paginated.
- official pagination fields visibly documented in the `CaptureHistory` schema include `pageCount` and `pageIndex`.
- official query parameters include `pageIndex` and, on the per-scheduled-capture route, `pageSize`.
- the official docs describe history endpoints as returning results "page by page".

## Rate limits
- No numeric rate-limit or quota table was published on the reviewed official Blit docs page or its linked Swagger file.
- I did not infer undocumented throttles.

## Error handling
Common error behavior visible across the reviewed spec:
- `400` for invalid/bad requests
- `401` for authentication failure
- success responses typically return either an object, an array of objects, or a one-element count array such as `[1]`

The reviewed spec does not publish one centralized JSON error-envelope schema.

## Response format notes
- The reviewed routes mostly return JSON objects or arrays.
- Create/update/delete helper routes sometimes return arrays with counts, not boolean envelopes.
- The screenshot-retrieval route is listed under the same JSON-focused Swagger surface, but its purpose is to retrieve an image asset rather than metadata.

## Important usage notes
- Blit is a screenshot scheduling and delivery service rather than a generic one-shot screenshot API.
- The official schema shows integrations for multiple delivery targets such as S3, Azure, Google Drive, Dropbox, RSS, Slack, FTP, Webhook, and SFTP.
- The public docs are Swagger-based and route-rich; the YAML file was the clearest official source for parameter names and schema fragments in this session.
- Because the auth-header capitalization is inconsistent inside the official documentation, fireROUTE should verify the accepted header spelling during adapter implementation.

## Verification notes
This file was manually rebuilt from Blitapp's official Swagger UI and its official Swagger YAML, replacing the autogenerated stub.