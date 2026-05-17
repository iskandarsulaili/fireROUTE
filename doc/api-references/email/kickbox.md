# Kickbox

Official docs manually reviewed:
- https://open.kickbox.com/
- https://open.kickbox.com/assets/scripts/client.js
- https://open.kickbox.com/v1/disposable/mailinator.com

## Overview
Kickbox exposes a lightweight public disposable-email checker. The reviewed landing page provides the official UI, and the reviewed first-party client script reveals the exact public endpoint used by that UI.

- Base URL: `https://open.kickbox.com`
- Canonical API path: `GET /v1/disposable/{email_or_domain}`
- Auth: none
- Response format: JSON

## Authentication
The reviewed public checker does not require an API key or bearer token. The official landing page uses the endpoint directly from browser-side JavaScript.

## Confirmed endpoint
| Method | Path | Purpose | Key inputs |
|---|---|---|---|
| GET | `/v1/disposable/{email_or_domain}` | Check whether an email address/domain is disposable | Path parameter populated from the official UI field named `emailOrDomain` |

Manual route count confirmed from the reviewed official page and first-party client script: **1**.

## Evidence from official client script
The reviewed script contains:

```javascript
const endpoint = "/v1/disposable/";
const data = await fetch(endpoint + encodeURIComponent(input.value))
```

The same script binds the input field with id `emailOrDomain`, which is the clearest official indication that the path segment accepts the user-supplied email address or domain string.

## Response format
The reviewed live endpoint returns a simple JSON payload. Example confirmed from the official endpoint:

```json
{
  "disposable": true
}
```

This implies the primary response contract is a boolean disposable signal.

## Rate limits
No numeric rate limits were published on the reviewed public checker page or in the reviewed client script.

## Pagination
No pagination is documented or applicable.

## Errors
The reviewed public checker page does not publish a formal error schema or status-code matrix.

For integration purposes, preserve HTTP status and raw response bodies because the official material only documents the success payload shape.

## Important usage notes
- The public checker is intentionally minimal and is separate from Kickbox’s broader paid email verification products.
- The official landing page positions this specifically as a disposable-address check, not a full deliverability/verification API.
- The documented public response shape is extremely small; do not assume richer metadata fields unless using a different Kickbox product.

## fireROUTE notes
- Model Kickbox here as a single boolean lookup provider for `disposable` classification.
- Preserve the raw path-input behavior because the official UI uses one free-form field rather than separate email/domain endpoints.
