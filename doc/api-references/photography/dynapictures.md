# DynaPictures

## Overview
- Provider: DynaPictures Image Generation API
- Category: Photography
- Official docs: `https://dynapictures.com/docs/`
- Base URL: `https://api.dynapictures.com`
- Auth: required API key in the `Authorization: Bearer <api-key>` header
- HTTPS: yes
- Response format:
  - JSON for generation, batch, webhook, template, workspace, and media-library operations
  - generated-image responses are returned as URLs inside JSON objects
  - generated PDF responses are also returned as URLs inside JSON objects
  - deleting a generated image is documented as success with no response body
- Pagination: no public pagination controls were clearly documented on the inspected page
- Rate limits: no public request-per-minute or request-per-hour quota was published on the inspected page

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/designs/{UID}` | path `UID`; body uses `params` for single-page templates, or `pages` for multipage/image/PDF generation; optional `format`, `metadata` | Main image-generation endpoint used for normal images, multipage templates, and PDF output. |
| DELETE | `/images/{IMAGE_PATH}` | path `IMAGE_PATH` | Deletes a previously generated image asset. |
| POST | `/batch` | body uses `templateId`, optional top-level `format`, `metadata`, and `pages[]` with per-page `layers` and optional per-page `templateId` | Batch / multipage PDF generation endpoint. |
| POST | `/hooks` | webhook target URL and webhook subscription payload | Subscribe a webhook. |
| DELETE | `/hooks` | webhook unsubscription payload | Unsubscribe a webhook. |
| GET | `/templates` | none clearly documented beyond auth | List templates. |
| GET | `/templates/{UID}` | path `UID` | Get one template. |
| GET | `/workspaces` | none clearly documented beyond auth | List workspaces. |
| POST | `/workspaces` | workspace creation body | Create a workspace. |
| PUT | `/workspaces/{ID}` | path `ID`; workspace update body | Update a workspace. |
| DELETE | `/workspaces/{ID}` | path `ID` | Delete a workspace. |
| GET | `/media/{workspaceId}/assets` | path `workspaceId` | List media-library assets in a workspace. |
| POST | `/media/{workspaceId}/assets` | path `workspaceId`; multipart/file upload body | Upload an image asset into a workspace. |
| GET | `/media/{workspaceId}/assets/{ID}` | path `workspaceId`, `ID` | Load one asset. |
| PUT | `/media/{workspaceId}/assets/{ID}` | path `workspaceId`, `ID`; asset update body | Update one asset. |
| DELETE | `/media/{workspaceId}/assets/{ID}` | path `workspaceId`, `ID` | Delete one asset. |

Confirmed route count: **16**.

## Request-body and parameter notes
- `POST /designs/{UID}` is the core endpoint and supports:
  - single-page generation via `params[]`
  - multipage template generation via `pages[]`
  - PDF generation by setting `format: pdf`
  - optional `metadata` that is echoed back in responses and can be reused in webhook workflows
- Layer/body examples on the inspected docs page include text, image replacement, colors, borders, radius, opacity, image fit/alignment, CSS-like filter values, and canvas/background settings.
- Supported output formats explicitly shown in the docs examples include `png`, `jpeg`, `webp`, `avif`, and `pdf`.
- The media-library endpoints use `workspaceId` and asset `ID` path parameters.
- The docs distinguish template `UID` values from workspace/media `ID` values.

## Auth and usage notes
- Every route shown on the inspected page uses the same bearer-token style API-key header:
  - `Authorization: Bearer <api-key>`
- The docs tell users to obtain the key from the account page or the API console attached to a template.
- Widget Integration sections are documented separately and use browser-side embedded widgets; they are not separate REST routes.

## Response and error notes
- Successful generation responses return JSON with IDs plus generated `imageUrl`, `thumbnailUrl`, and for PDFs a `pdfUrl`.
- The delete-generated-image route is documented as success with no body.
- The current docs page's `Errors` section appears to be a generic template placeholder rather than provider-specific endpoint guidance, so the inspected page does not give a trustworthy DynaPictures-specific public error matrix.

## Important usage notes
- The same `/designs/{UID}` route is reused across image, multipage-template, and PDF flows; the request body determines the behavior.
- `metadata` is useful for correlating generated outputs with downstream automation and webhook deliveries.
- The batch endpoint can mix pages from different templates in one PDF request according to the example payload.
- The API is strongly template-driven: users are expected to create templates first in the DynaPictures product UI, then render against those template IDs through the REST API.

## fireROUTE integration notes
- Treat DynaPictures as a compact authenticated generation API with four route families: rendering, webhook management, template/workspace management, and media-library asset CRUD.
- Preserve `/designs/{UID}` as a single flexible route instead of inventing separate image and PDF endpoints.
- Do not invent undocumented pagination or quota rules; the inspected official docs page did not publish them.

## Sources inspected
- `https://dynapictures.com/docs/`
