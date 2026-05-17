# PostStack

Official docs manually reviewed:
- https://poststack.dev/docs
- https://poststack.dev/llms.txt
- https://poststack.dev/llms-full.txt

## Overview
PostStack is an EU-hosted email platform that exposes a REST API for transactional sending, domains, contacts, templates, broadcasts, segments, subscription topics, workflows, inbound email, webhooks, tracking, SMTP relay, and test-mode delivery.

Confirmed from the reviewed official docs:
- Base URL: `https://api.poststack.dev`
- Authentication: HTTP Bearer token using API keys such as `sk_live_...` or `sk_test_...`
- Response format: JSON for API responses; CSV for contact export
- Optional SMTP relay host: `smtp.poststack.dev`
- SMTP ports: `587` (STARTTLS) and `465` (implicit TLS)

## Authentication
The reviewed docs explicitly require a bearer token on all API requests.

Confirmed example from the docs:

```bash
curl https://api.poststack.dev/emails \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json"
```

The official docs also confirm:
- API key permission levels: `full_access` and `sending_access`
- API keys may be scoped to specific verified domains
- `sk_test_...` keys enable test mode with full validation but no real delivery
- SMTP auth uses username `poststack` and the API key as the password

## Confirmed endpoints
The official docs and official `llms-full.txt` export expose these currently documented routes.

### Emails
| Method | Path |
|---|---|
| POST | `/emails` |
| POST | `/emails/batch` |
| GET | `/emails` |
| GET | `/emails/:id` |
| POST | `/emails/:id/cancel` |

### Domains
| Method | Path |
|---|---|
| POST | `/domains` |
| GET | `/domains` |
| GET | `/domains/:id` |
| PATCH | `/domains/:id` |
| DELETE | `/domains/:id` |
| POST | `/domains/:id/verify` |

### Contacts
| Method | Path |
|---|---|
| POST | `/contacts` |
| GET | `/contacts` |
| GET | `/contacts/:id` |
| PATCH | `/contacts/:id` |
| DELETE | `/contacts/:id` |
| POST | `/contacts/:id/unsubscribe` |
| POST | `/contacts/import` |
| GET | `/contacts/export` |

### Templates
| Method | Path |
|---|---|
| POST | `/templates` |
| GET | `/templates` |
| GET | `/templates/:id` |
| PATCH | `/templates/:id` |
| DELETE | `/templates/:id` |
| POST | `/templates/:id/publish` |
| POST | `/templates/:id/unpublish` |
| POST | `/templates/:id/duplicate` |
| GET | `/templates/presets` |

### Broadcasts
| Method | Path |
|---|---|
| POST | `/broadcasts` |
| GET | `/broadcasts` |
| GET | `/broadcasts/:id` |
| POST | `/broadcasts/:id/send` |
| POST | `/broadcasts/:id/test` |
| POST | `/broadcasts/:id/cancel` |

### Segments
| Method | Path |
|---|---|
| POST | `/segments` |
| GET | `/segments` |
| GET | `/segments/:id` |
| GET | `/segments/:id/preview` |
| POST | `/segments/:id/contacts` |
| DELETE | `/segments/:id/contacts` |
| DELETE | `/segments/:id` |

### Subscription topics
| Method | Path |
|---|---|
| POST | `/subscription-topics` |
| GET | `/subscription-topics` |
| PATCH | `/subscription-topics/:id` |
| DELETE | `/subscription-topics/:id` |
| POST | `/subscription-topics/:id/subscribers` |
| DELETE | `/subscription-topics/:id/subscribers/:contactId` |

### Workflows
| Method | Path |
|---|---|
| POST | `/workflows` |
| GET | `/workflows` |
| GET | `/workflows/:id` |
| POST | `/workflows/:id/activate` |
| POST | `/workflows/:id/pause` |
| DELETE | `/workflows/:id` |

### Inbound email
| Method | Path |
|---|---|
| GET | `/inbound-emails` |
| GET | `/inbound-emails/:id` |

### Webhooks
| Method | Path |
|---|---|
| POST | `/webhooks` |
| GET | `/webhooks` |
| PATCH | `/webhooks/:id` |
| DELETE | `/webhooks/:id` |
| POST | `/webhooks/:id/test` |

Manual route count confirmed from the official docs: **59**.

## Important parameters and request notes
Confirmed from the reviewed docs:
- Common path variables include `:id` and `:contactId`
- `POST /emails` requires `from`, `to`, `subject`, and at least one of `html` or `text`
- `POST /emails/batch` accepts up to `100` emails per request
- Email send payloads may include `reply_to`, `headers`, `tags`, `attachments`, `idempotency_key`, `scheduled_at`, template variables, and per-email tracking overrides
- `GET /emails` supports `page`, `per_page`, `status`, `domain`, and `tag`
- `POST /domains` accepts a domain `name`
- `PATCH /domains/:id` supports domain-level options including `open_tracking`, `click_tracking`, `custom_return_path`, `tracking_domain`, `inbound_enabled`, `bimi_logo_url`, and `bimi_selector`
- `GET /contacts` supports `search`, `segment_id`, `page`, and `per_page`
- `POST /contacts/import` uses multipart form-data with a CSV file; `email` is the required CSV column
- `GET /contacts/export` returns CSV and supports `segment_id`
- Template variables use Handlebars-style `{{variable}}` placeholders
- `POST /broadcasts` accepts `segment_id`, `topic_id`, and optional `scheduled_at`
- Segment rules use operators including `equals`, `not_equals`, `contains`, `not_contains`, `starts_with`, `greater_than`, `less_than`, `is_set`, and `is_not_set`
- Workflow triggers include `contact.created`, `contact.updated`, `contact.subscribed`, and `manual`
- Workflow steps include `send_email`, `wait`, and `condition`
- `GET /inbound-emails` supports `domain`, `page`, and `per_page`
- Webhook creation accepts `url`, `events`, and `description`; using `"*"` subscribes to all events

## Pagination
The reviewed docs explicitly document page-based pagination on list endpoints.

Confirmed pagination fields/parameters include:
- request parameters: `page`, `per_page`
- response metadata such as `total`, `page`, `per_page`, and `total_pages`

The docs show this shape on endpoints such as:
- `GET /emails`
- `GET /contacts`
- `GET /broadcasts`
- `GET /inbound-emails`

## Errors
The official docs state that all errors return JSON with this general shape:

```json
{
  "error": "Human-readable error message"
}
```

Confirmed status codes from the docs:
- `400` — malformed request
- `401` — missing or invalid API key
- `403` — insufficient permissions
- `404` — resource not found
- `409` — conflict / resource already exists
- `422` — validation failed
- `429` — rate limited
- `500` — internal server error

Confirmed documented examples include errors such as:
- `Invalid API key`
- `API key does not have permission`
- `Domain not verified`
- `Contact already exists`
- `Batch size exceeds limit`
- `Template not published`

## Rate limits
The reviewed docs do **not** publish fixed global numeric quotas.

What the official docs do confirm:
- `429 Too Many Requests` is used when rate limited
- a `Retry-After` header is returned when the client should wait before retrying
- the official SDK handles exponential backoff automatically
- test mode still performs validation and rate-limit checks

Because no universal per-minute or per-day quota is published in the reviewed docs, fireROUTE should treat numeric rate limits as plan/runtime controlled rather than hard-coded.

## Response format
Confirmed from the reviewed docs:
- JSON is the standard API response format
- contact export returns CSV
- list endpoints commonly return either `data` arrays plus `meta`, or resource-specific arrays/objects depending on route
- webhook payloads are JSON and include `id`, `type`, `timestamp`, and nested `data`

Confirmed example fields seen in official responses include:
- email objects with `status`, `created_at`, `sent_at`, `delivered_at`, and `events`
- domain objects with `dns_records[]` and per-record verification status
- contact objects with `properties` and unsubscribe metadata
- inbound email objects with `headers`, `attachments`, and `received_at`

## Webhooks and security notes
The official docs publish a concrete webhook-signature contract:
- header name: `X-PostStack-Signature`
- format: `sha256={hex_digest}`
- signature algorithm: `HMAC-SHA256`
- signed content: raw JSON request body
- verification secret: webhook `signing_secret`

The docs also note that `signing_secret` is returned on webhook creation and should be stored securely because it is only shown then.

## Important usage notes
- `sk_test_...` keys provide full validation, simulated events, and no billing impact, but do not perform real SMTP delivery.
- Custom tracking domains require a DNS CNAME pointing to `track.poststack.dev`.
- Inbound email requires enabling inbound on the domain plus an MX record targeting `inbound.poststack.dev` with priority `10`.
- Tracking events are surfaced through webhooks such as `email.opened` and `email.clicked`.
- SMTP relay supports custom headers like `X-PostStack-Tags`, `X-PostStack-Template-Id`, `X-PostStack-Variables`, and `X-PostStack-Idempotency-Key`.
- PostStack’s official docs position the platform as more than simple sending: it includes mailing-list, automation, and inbound-mail surfaces.

## fireROUTE notes
- Preserve PostStack as a broad email-platform provider, not just a single `send email` endpoint.
- The most integration-ready route groups are emails, domains, templates, contacts, and webhooks.
- Keep bearer-token auth primary, but note the SMTP alternative for users who choose SMTP transport instead of REST.
- When modeling routes, preserve PostStack’s separate resources for broadcasts, segments, subscription topics, and workflows instead of collapsing them into generic marketing abstractions.
