# iLovePDF

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `ilovepdf`
- Official docs/pages reviewed manually:
  - `https://developer.ilovepdf.com/` -> current official developer site redirects to `https://www.iloveapi.com/`
  - `https://www.iloveapi.com/docs/api-reference`
- Confirmed API style: REST workflow API for PDF, image, and signature processing
- Confirmed control/auth base URL: `https://api.ilovepdf.com/v1`
- Confirmed task-scoped processing base pattern: `https://{server}/v1`
- Manually confirmed route count: `21`
- Route-method breakdown:
  - `9` `GET`
  - `10` `POST`
  - `2` `DELETE`

## What the official docs confirm
- The historical `developer.ilovepdf.com` entrypoint now resolves into the current iLoveAPI developer site.
- The API is organized as a multi-step workflow rather than a flat CRUD surface.
- Standard PDF/image processing follows four official steps:
  - start task
  - upload files
  - process files
  - download output
- Signature flows reuse the start/upload pattern but expose a separate signature-management family instead of the generic process/download workflow.

## Authentication
From the reviewed official docs:
- iLoveAPI uses JWT bearer authentication.
- Requests send `Authorization: Bearer {signed_token}`.
- Signed tokens expire after `1 hour`.
- The docs describe two official ways to authenticate:
  - generate a signed JWT locally with your project secret key
  - request a token from the official auth server using the public project key
- The reviewed docs also describe domain restrictions for browser-side auth flows.

## Request/response and format notes
- The API is REST-oriented and returns JSON for metadata/status endpoints.
- Uploads use `form-data` for local-file uploads.
- Processing responses include task-oriented output metadata such as:
  - `download_filename`
  - `filesize`
  - `output_filesize`
  - `output_filenumber`
  - `output_extensions`
  - `timer`
  - `status`
- Download responses are binary/array-buffer style rather than JSON.
- The task list is paginated in `50` results per page.
- Signature listing uses `page` and `per-page`, with reviewed docs showing `per-page` accepted values in `[1, 100]`.

## Errors, lifecycle, and usage notes
From the reviewed API reference:
- The docs have a dedicated `Errors` section, but the workflow pages themselves are more explicit about some route-specific failures than a single shared global table.
- The process step explicitly documents `400` behavior for `WrongPassword` cases while leaving the task in `TaskWaiting` so the caller can retry with passwords.
- Tasks and their related files are deleted after `two hours` of being processed.
- If you need immediate cleanup, the docs explicitly direct you to delete the task.
- The reviewed developer landing page advertises a free account with `250` files processed per month.

## Confirmed route inventory
### Authentication and task bootstrap
- `POST /v1/auth`
  - purpose: obtain a bearer token from the official auth server using `public_key`
- `GET /v1/start/{tool}/{region}`
  - purpose: get the assigned processing server and task ID
  - confirmed path parameters:
    - `tool`
    - `region`
  - confirmed region values listed by the docs:
    - `eu`
    - `us`
    - `fr`
    - `de`
    - `pl`

### Core PDF/image workflow
- `POST /v1/upload`
  - purpose: upload a local file or a cloud/public URL into a task
  - confirmed parameters include:
    - `task`
    - `file`
    - `chunk`
    - `chunks`
    - `cloud_file`
- `DELETE /v1/upload/{task}/{server_filename}`
  - purpose: remove an already uploaded file from the assigned server before processing
- `POST /v1/process`
  - purpose: execute the chosen PDF/image tool on uploaded files
  - confirmed shared parameters include:
    - `task`
    - `tool`
    - `files`
    - optional `webhook`
- `GET /v1/download/{task}`
  - purpose: download processed output files

### Task inspection and chaining
- `GET /v1/task`
  - purpose: list and filter processed tasks
  - confirmed query parameters:
    - `secret_key`
    - `page`
    - `tool`
    - `status`
    - `custom_int`
- `DELETE /v1/task/{task}`
  - purpose: delete a task and all related files immediately
- `POST /v1/task/next`
  - purpose: create a connected follow-up task from the output of a previous task
  - confirmed parameters:
    - `task`
    - `tool`

### Signature routes
- `POST /v1/signature`
  - purpose: create a signature request from a `sign` task
- `GET /v1/signature/list`
  - purpose: list created signature requests
- `GET /v1/signature/requesterview/{token_requester}`
  - purpose: retrieve signature-request status/details for the requester view
- `GET /v1/signature/receiver/info/{receiver_token_requester}`
  - purpose: retrieve receiver info/status
- `GET /v1/signature/{token_requester}/download-audit`
  - purpose: download signature audit output
- `GET /v1/signature/{token_requester}/download-original`
  - purpose: download original files for a signature request
- `GET /v1/signature/{token_requester}/download-signed`
  - purpose: download signed files
- `POST /v1/signature/receiver/fix-email/{receiver_token_requester}`
  - purpose: fix the receiver email on a signature request
- `POST /v1/signature/signer/fix-phone/{signer_token_requester}`
  - purpose: fix signer phone information
- `POST /v1/signature/sendReminder/{token_requester}`
  - purpose: send signature reminders
- `POST /v1/signature/void/{token_requester}`
  - purpose: void a signature request
- `POST /v1/signature/increase-expiration-days/{token_requester}`
  - purpose: increase signature expiration days

## Important usage notes
- The docs clearly split control-plane calls on `api.ilovepdf.com` from task-scoped calls that must use the `server` returned by the start endpoint.
- The reviewed API reference uses the current iLoveAPI branding even though the provider slug remains `ilovepdf` in this repo.
- Tool names are passed as route parameters or request fields instead of being modeled as separate REST resources for each PDF/image feature.
- Signature processing is not a generic extension of `/process`; it has its own endpoint family and retrieval/download routes.

## Verification note
This file was manually rebuilt from iLovePDF/iLoveAPI's current official developer site and current official API reference using browser inspection only.