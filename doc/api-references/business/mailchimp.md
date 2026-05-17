# Mailchimp

Official docs manually reviewed:
- https://mailchimp.com/developer/marketing/api/
- https://mailchimp.com/developer/marketing/guides/quick-start/
- https://mailchimp.com/developer/marketing/docs/fundamentals/
- https://mailchimp.com/developer/marketing/docs/methods-parameters/

## Overview
Mailchimp’s current official Marketing API is a versioned REST API rooted at:

- `https://<dc>.api.mailchimp.com/3.0/`

The `<dc>` placeholder is the account’s data-center prefix, such as the `us19` style value shown in the quick-start guide.

Confirmed from the reviewed official docs:
- Base URL: `https://<dc>.api.mailchimp.com/3.0/`
- Auth: API key over HTTP Basic auth for direct account access
- OAuth 2.0 is the recommended alternative when acting on behalf of other Mailchimp users
- Response format: JSON, except DELETE responses can be header-only / no JSON body
- The reviewed Marketing API reference currently exposes **292** method/path pairs
- The reviewed reference page is currently version-labeled **`3.0.91`**

## Confirmed resource families
The reviewed official reference navigation currently exposes these top-level resource families:
- `API Root`
- `Account Exports`
- `Audiences (BETA)`
- `Authorized Apps`
- `Automation Flows (Previously Customer Journeys)`
- `Batch Operations`
- `Batch Webhooks`
- `Campaign Folders`
- `Campaigns`
- `Chimp Chatter Activity`
- `Classic Automations`
- `Connected Sites`
- `Conversations`
- `E-Commerce Stores`
- `Facebook Ads`
- `File Manager`
- `Landing Pages`
- `Lists/Audiences`
- `Ping`
- `Reporting`
- `Reports`
- `SMS Campaigns`
- `Search Campaigns`
- `Search Members`
- `Template Folders`
- `Templates`
- `Verified Domains`

## Concrete endpoints confirmed from the reviewed reference
| Method | Path | Notes |
|---|---|---|
| GET | `/` | API root links and account details |
| GET | `/account-exports` | list account exports |
| POST | `/account-exports` | create account export |
| GET | `/account-exports/{export_id}` | get one account export |
| GET | `/audiences` | list beta audiences |
| GET | `/audiences/{audience_id}` | get one beta audience |
| GET | `/audiences/{audience_id}/contacts` | list beta contacts |
| POST | `/audiences/{audience_id}/contacts` | create beta contact |
| GET | `/audiences/{audience_id}/contacts/{contact_id}` | get one beta contact |
| PATCH | `/audiences/{audience_id}/contacts/{contact_id}` | update beta contact |
| POST | `/audiences/{audience_id}/contacts/{contact_id}/actions/archive` | archive contact |
| POST | `/audiences/{audience_id}/contacts/{contact_id}/actions/forget` | forget contact |
| GET | `/authorized-apps` | list connected apps |
| GET | `/authorized-apps/{app_id}` | get connected app |
| POST | `/customer-journeys/journeys/{journey_id}/steps/{step_id}/actions/trigger` | trigger customer-journey step |
| GET | `/batches` | list batch jobs |
| POST | `/batches` | create batch job |
| GET | `/batches/{batch_id}` | get batch status/result metadata |
| DELETE | `/batches/{batch_id}` | cancel/delete batch |
| GET | `/batch-webhooks` | list batch webhooks |
| POST | `/batch-webhooks` | create batch webhook |
| GET | `/batch-webhooks/{batch_webhook_id}` | get batch webhook |
| PATCH | `/batch-webhooks/{batch_webhook_id}` | update batch webhook |
| DELETE | `/batch-webhooks/{batch_webhook_id}` | delete batch webhook |
| GET | `/campaign-folders` | list campaign folders |
| POST | `/campaign-folders` | create campaign folder |
| GET | `/campaigns` | list campaigns |
| POST | `/campaigns` | create campaign |
| GET | `/campaigns/{campaign_id}` | get campaign |
| PATCH | `/campaigns/{campaign_id}` | update campaign |
| DELETE | `/campaigns/{campaign_id}` | delete campaign |
| POST | `/campaigns/{campaign_id}/actions/send` | send campaign |
| POST | `/campaigns/{campaign_id}/actions/schedule` | schedule campaign |
| POST | `/campaigns/{campaign_id}/actions/unschedule` | unschedule campaign |
| POST | `/campaigns/{campaign_id}/actions/pause` | pause campaign |
| POST | `/campaigns/{campaign_id}/actions/resume` | resume campaign |
| GET | `/ping` | health-check endpoint |

Manual route count confirmed from the reviewed official Marketing API reference: **292** method/path pairs.

## Authentication
### API key / Basic auth
The reviewed quick-start guide shows the current direct-auth pattern:

```http
Authorization: Basic anystring:{API_KEY}
```

Its curl example uses:

```bash
curl "https://${dc}.api.mailchimp.com/3.0/ping" --user "anystring:${apikey}"
```

Important notes confirmed by the reviewed docs:
- API keys provide **full account access**
- Mailchimp does **not** support client-side Marketing API calls using CORS with API keys
- API keys should not be used in mobile apps

### OAuth 2.0
The reviewed fundamentals and quick-start pages explicitly direct multi-tenant integrations to OAuth 2.0 when accessing Mailchimp on behalf of other Mailchimp users.

## Parameters, pagination, and request/response conventions
Confirmed from the reviewed methods-and-parameters page:
- supported HTTP methods: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`
- Mailchimp also supports `X-HTTP-Method-Override` when firewalls block `PATCH` or `DELETE`; the override only works on a `POST` request
- request bodies for `POST`, `PATCH`, and `PUT` are JSON
- DELETE calls always return headers only and may not include a JSON body
- `204 No Content` responses do not include JSON body content

### Path parameters
The reviewed methods page explicitly documents nested resource paths such as:
- `https://<dc>.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}/notes/{id}`

### Query parameters
The reviewed methods page explicitly documents query-string use for:
- filtering
- pagination
- partial responses

Confirmed query-string parameters and behavior:
- `count` — page size, default `10`, maximum `1000`
- `offset` — starting offset, default `0`
- `fields` — include only selected response fields
- `exclude_fields` — remove selected response fields from the response

Example pattern shown on the reviewed docs:
- `https://usX.api.mailchimp.com/3.0/campaigns?count=10&offset=10`

## Rate limits and timeout notes
Confirmed from the reviewed fundamentals page:
- the Marketing API has a limit of **10 simultaneous connections**
- hitting that limit returns **HTTP 429**
- at exceptionally high volumes, Mailchimp may return **HTTP 429 or 403 without a JSON body**
- the Marketing API has a **120-second timeout** on API calls
- the docs explicitly recommend using pagination and the Batch endpoint for long-running or very large jobs
- the reviewed docs state there are currently **no per-customer options to raise the limit**

## Important usage notes
- Mailchimp’s API surface is broad and heavily action-oriented; some operations live under `/actions/...` rather than pure CRUD resource paths.
- The quick-start guide explicitly uses `/ping` as the canonical first-call / health-check route.
- Beta audiences/contact endpoints are documented separately from the long-standing `lists` audience surface, so fireROUTE should not assume those are interchangeable.
- The docs explicitly promote batches as the escape hatch for large sync workloads that would otherwise hit throttling or timeout limits.
- Partial-response support via `fields` / `exclude_fields` is worth preserving because Mailchimp responses can get large quickly.