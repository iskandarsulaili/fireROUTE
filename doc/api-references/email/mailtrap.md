# Mailtrap

Official docs manually reviewed:
- https://docs.mailtrap.io/developers
- https://docs.mailtrap.io/developers/authentication
- https://docs.mailtrap.io/developers/rate-limits
- https://docs.mailtrap.io/developers/email-sending/transactional
- https://docs.mailtrap.io/developers/email-sending/bulk
- https://docs.mailtrap.io/developers/email-sandbox/projects
- https://docs.mailtrap.io/developers/email-sandbox/sandboxes-inboxes
- https://docs.mailtrap.io/developers/email-sandbox/messages
- https://docs.mailtrap.io/developers/email-sandbox/attachments
- https://docs.mailtrap.io/developers/email-sandbox/send-test-emails
- https://docs.mailtrap.io/developers/account-management/accounts
- https://docs.mailtrap.io/developers/openapi-specs
- https://github.com/mailtrap/mailtrap-openapi

## Overview
Mailtrap exposes multiple REST API surfaces under different hosts for production sending, bulk sending, sandbox inbox management, and account administration. The reviewed official docs are current GitBook pages, not the obsolete Apiary URL in the existing README row.

Confirmed base URLs from the reviewed official docs:
- `https://send.api.mailtrap.io` — transactional production sending
- `https://bulk.api.mailtrap.io` — bulk/promotional sending
- `https://sandbox.api.mailtrap.io` — sandbox send-to-inbox testing
- `https://mailtrap.io` — account, project, inbox, message, and attachment management APIs

## Authentication
The reviewed `Authentication` page explicitly documents two accepted auth header styles:

```http
Api-Token: {api_token}
```

or

```http
Authorization: Bearer {api_token}
```

Additional reviewed auth notes:
- API tokens are managed on the Mailtrap API Tokens page
- API tokens do not expire automatically; the docs say you reset them manually
- all requests must use HTTPS

Across the reviewed endpoint pages, the operation consoles consistently show `Api-Token` auth for the documented routes.

## Confirmed endpoints
The following routes were manually confirmed from the reviewed official docs.

| Method | Base URL | Path | Purpose |
|---|---|---|---|
| POST | `https://send.api.mailtrap.io` | `/api/send` | Send one transactional email |
| POST | `https://send.api.mailtrap.io` | `/api/batch` | Send a transactional batch |
| POST | `https://bulk.api.mailtrap.io` | `/api/send` | Send one bulk/promotional email payload |
| GET | `https://mailtrap.io` | `/api/accounts` | List accounts accessible to the token |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/projects` | List sandbox projects |
| POST | `https://mailtrap.io` | `/api/accounts/{account_id}/projects` | Create a sandbox project |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/projects/{project_id}` | Get one project |
| DELETE | `https://mailtrap.io` | `/api/accounts/{account_id}/projects/{project_id}` | Delete one project |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/projects/{project_id}` | Update one project |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes` | List sandboxes/inboxes |
| POST | `https://mailtrap.io` | `/api/accounts/{account_id}/projects/{project_id}/inboxes` | Create sandbox inbox in a project |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}` | Get one inbox |
| DELETE | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}` | Delete one inbox |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}` | Update inbox settings |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/clean` | Remove inbox messages |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/all_read` | Mark all messages as read |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/reset_credentials` | Reset inbox credentials |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/toggle_email_username` | Toggle generated email username support |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/reset_email_username` | Reset generated email username |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages` | List inbox messages |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}` | Get one message |
| DELETE | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}` | Delete one message |
| PATCH | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}` | Update a message |
| POST | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/forward` | Forward a captured message |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/spam_report` | Get spam report |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/analyze` | Analyze one message |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/body.txt` | Get text body |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/body.raw` | Get raw body |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/body.htmlsource` | Get original HTML source |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/body.html` | Get rendered HTML body |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/body.eml` | Download EML |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/mail_headers` | Get raw message headers |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/attachments` | List message attachments |
| GET | `https://mailtrap.io` | `/api/accounts/{account_id}/inboxes/{inbox_id}/messages/{message_id}/attachments/{attachment_id}` | Get one attachment |
| POST | `https://sandbox.api.mailtrap.io` | `/api/send/{inbox_id}` | Send one test email to a sandbox inbox |
| POST | `https://sandbox.api.mailtrap.io` | `/api/batch/{inbox_id}` | Send a batch of test emails to a sandbox inbox |

Manual route count confirmed from the reviewed official docs: **36**.

## Endpoint notes
### Production sending
Confirmed sending surfaces:
- transactional host: `https://send.api.mailtrap.io`
- bulk host: `https://bulk.api.mailtrap.io`
- sandbox testing host: `https://sandbox.api.mailtrap.io`

The reviewed transactional and bulk docs say these endpoints support text, HTML, and template-driven sending variants. The operation consoles visibly show alternative request-body shapes such as:
- text only
- HTML only
- text + HTML
- from template

### Accounts
`GET /api/accounts` returns account details accessible to the authenticated token.

Reviewed response note:
- organization-level tokens can return multiple accounts
- `access_levels` can include `1000` (owner), `100` (admin), `10` (viewer)

### Projects
The reviewed Projects page confirms full CRUD-style management of sandbox projects under an account:
- list
- create
- retrieve
- delete
- patch/update

### Sandboxes / inboxes
The reviewed Sandboxes page confirms inbox-management routes for:
- list
- create within project
- retrieve
- delete
- update
- clean messages
- mark all read
- reset credentials
- toggle generated email username
- reset generated email username

The docs also explain how to obtain a sandbox inbox ID either from the UI URL or from the list-inboxes API.

### Messages
The reviewed Messages page confirms a large message-inspection surface.

Confirmed list endpoint details for `GET /api/accounts/{account_id}/inboxes/{inbox_id}/messages`:
- response contains up to **30 messages** per call
- use `last_id` or `page` to retrieve more

Confirmed query parameters on the list route:
- `search` — matches `subject`, `to_email`, and `to_name`
- `last_id` — cursor-like pagination control; overrides `page` if both are sent
- `page` — page-number access

Confirmed message-detail route family includes:
- fetch message
- delete message
- patch/update message
- forward message
- spam report
- analyze message
- text/raw/html/htmlsource/eml bodies
- raw mail headers

Reviewed response-shape note on the message page:
- body URLs are often under `/api/testing_message_parts/...` rather than nested only under `/api/accounts/.../messages/...`
- `blacklists_report_info` may contain only a result or a fuller report
- `template_variables` is set when a message came from a template

### Attachments
Confirmed attachments routes:
- list attachments for a message
- get one attachment by `attachment_id`

Confirmed query parameter on attachment listing:
- `attachment_type` (example shown: `inline`)

### Sandbox send API
The reviewed Send Test Emails page confirms two sandbox-send routes on `sandbox.api.mailtrap.io`:
- `POST /api/send/{inbox_id}`
- `POST /api/batch/{inbox_id}`

These endpoints accept structured email payloads and are meant to deliver into a Mailtrap sandbox inbox instead of real recipient mailboxes.

## Path and body parameters
Common path parameters visible throughout the reviewed docs include:
- `account_id`
- `project_id`
- `inbox_id`
- `message_id`
- `attachment_id`

Common parameter/body patterns confirmed:
- production send endpoints accept JSON email payloads with text/HTML/template variations
- sandbox send endpoints accept JSON email payloads targeting a specific `inbox_id`
- message listing supports `search`, `last_id`, and `page`
- attachment listing supports `attachment_type`

## Pagination
Pagination behavior explicitly confirmed from the reviewed docs:
- sandbox message listing uses `page`
- sandbox message listing also supports `last_id`, which overrides `page` when both are present
- the messages page explicitly says one response contains up to 30 messages

No universal cross-product pagination contract was published for every Mailtrap surface in the reviewed pages, so preserve per-endpoint provider semantics.

## Rate limits
The reviewed Rate Limits page explicitly documents:

### General limit
- **150 requests per 10 seconds per API token** for all API endpoints

### API-specific limits
- Contacts API: `200 requests / 60 seconds / per account`
- Stats API: `10 requests / 60 seconds / per account`
- Suppressions API: `10 requests / 60 seconds / per account`
- Email Logs API `List email logs`: `60 requests / 60 seconds / per account`
- Email Logs API `Get an email log message by ID`: `1000 requests / 60 seconds / per account`

For the routes documented in this file, assume the general limit unless a narrower Mailtrap product page says otherwise.

## Response codes and errors
The reviewed Authentication page lists these common response codes:
- `200 OK`
- `204 No Content`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `422 Unprocessable Entity`
- `429 Too Many Requests`

Documented meanings include:
- `401` — auth failure or insufficient permissions
- `403` — access denied
- `422` — invalid values in request data
- `429` — rate limit exceeded

The reviewed pages do not expose one single universal error schema for every product area in the same way that the auth/rate pages centralize status behavior, so handle errors per route family.

## Response format notes
The reviewed APIs are JSON-first.

Examples visible in reviewed operation pages include:
- project/inbox/message/account objects returned as `application/json`
- sandbox lists with nested inbox/message metadata
- message resources including body/report/template-related metadata
- attachment resources with attachment metadata and download access paths

## Important usage notes
- The legacy Apiary URL in the README is obsolete; the live official docs now live on `docs.mailtrap.io`.
- Mailtrap is multi-hosted: do not assume all routes live under one hostname.
- Production transactional sending, bulk sending, sandbox testing, and inbox-management routes are intentionally separated by host and product area.
- All reviewed routes require HTTPS.
- You usually need to discover `account_id`, then `project_id` and `inbox_id`, before calling deeper sandbox-management routes.

## fireROUTE notes
- Treat Mailtrap as multiple upstream providers behind one brand: production send, bulk send, sandbox send, and sandbox/account management.
- Preserve host-level routing exactly; collapsing everything to one base URL would break integrations.
- `last_id`-style pagination on sandbox messages is worth exposing because it behaves differently from simple page-number-only pagination.
