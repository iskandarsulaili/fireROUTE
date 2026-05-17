# MailCheck.ai

Official docs manually reviewed:
- https://www.mailcheck.ai/#documentation
- https://www.usercheck.com/docs/api/introduction
- https://www.usercheck.com/docs/api/authentication
- https://www.usercheck.com/docs/api/domain-endpoint
- https://www.usercheck.com/docs/api/email-endpoint
- https://www.usercheck.com/docs/api/blocklist-endpoint
- https://www.usercheck.com/docs/api/status-endpoint
- https://www.usercheck.com/docs/api/rate-limits

## Overview
The legacy MailCheck.ai documentation now redirects to **UserCheck**, which is the current official product/docs surface. The reviewed docs describe a REST API for validating emails and domains, managing a custom domain blocklist, and checking account status/usage.

Confirmed from the reviewed official docs:
- Current official API brand/docs: **UserCheck**
- Base URL: `https://api.usercheck.com`
- API style: REST with JSON request/response bodies
- Primary auth model: bearer API key in the `Authorization` header
- Alternative auth model documented but discouraged: `?key=YOUR_API_KEY`
- Core email/domain validation plus Pro-only blocklist management are part of the documented route surface

## Authentication
The official docs explicitly state that the API uses API key authentication.

Confirmed auth details:
- Preferred header: `Authorization` with a bearer API key value
- Alternative query parameter: `key` (documented as **not recommended**)
- The authentication docs use `GET /status` as the verification call for testing credentials

Confirmed example shape from the official docs:

```bash
curl -X GET "https://api.usercheck.com/email/test@example.com" \
  -H "Authorization: <bearer-api-key>"
```

## Confirmed endpoints
The reviewed official docs expose these routes.

| Method | Path | Purpose |
|---|---|---|
| GET | `/domain/{domain}` | Validate/classify a domain |
| GET | `/email/{email}` | Validate/classify an email address |
| GET | `/blocklist` | List blocklisted domains for the current environment |
| POST | `/blocklist` | Add one domain to the blocklist |
| POST | `/blocklist/bulk` | Add multiple domains to the blocklist |
| GET | `/blocklist/{domain}` | Check whether one domain is blocklisted |
| DELETE | `/blocklist/{domain}` | Remove one domain from the blocklist |
| GET | `/status` | Retrieve plan/account/usage information |

Manual route count confirmed from the official docs: **8**.

## Parameters and request notes
Confirmed from the reviewed docs:

### Domain validation
- `GET /domain/{domain}`
  - path parameter: `domain`
  - example: `github.com`

### Email validation
- `GET /email/{email}`
  - path parameter: `email`
  - example: `octocat@github.com`

### Blocklist management
- `GET /blocklist`
  - query parameter: `per_page`
  - documented range/default: min `1`, max `100`, default `25`
- `POST /blocklist`
  - JSON body field: `domain` (required)
- `POST /blocklist/bulk`
  - JSON body field: `domains` (required array)
  - documented max: **1,000 domains** per request
- `GET /blocklist/{domain}`
  - path parameter: `domain`
- `DELETE /blocklist/{domain}`
  - path parameter: `domain`

### Status
- `GET /status`
  - no documented request parameters beyond authentication

## Response format
Confirmed from the reviewed docs:
- responses are JSON
- validation endpoints return a top-level `status` plus classification/detail fields
- blocklist listing is paginated and returns Laravel-style `data`, `links`, and `meta`
- status responses include nested `account` and `usage`

Confirmed documented response fields include:
- email/domain validation:
  - `status`
  - `email` or `domain`
  - `normalized_email` (email route)
  - `domain_authority`
  - `tld_trust`
  - `domain_age_in_days`
  - `mx`
  - `mx_records`
  - `mx_providers`
  - `disposable`
  - `public_domain`
  - `relay_domain`
  - `alias` (email route)
  - `role_account` (email route)
  - `spam`
  - `did_you_mean`
  - `blocklisted`
- blocklist list route:
  - `data`
  - `links`
  - `meta`
- blocklist create route:
  - `domain`
  - `created_at`
- bulk blocklist route:
  - `succeeded`
  - `failed`
  - `success`
  - `errors`
- status route:
  - `account.plan.name`
  - `account.plan.credits`
  - `account.plan.rate_limit`
  - `account.user.name`
  - `account.user.email`
  - `usage.limit`
  - `usage.current`
  - `usage.remaining`
  - `usage.reset_at`

The docs also mark some enrichment fields as **Pro Plan Only**, including `domain_authority` and `tld_trust`.

## Pagination
Confirmed from the reviewed docs:
- blocklist listing is paginated
- `GET /blocklist` supports `per_page`
- response pagination metadata includes `first`, `last`, `prev`, `next`, `current_page`, `last_page`, `per_page`, and `total`

## Errors
The reviewed docs explicitly document or show these notable error cases:
- `400` — malformed email/domain input on validation routes
- `401` — unauthorized / invalid API key
- `422` — validation failure on blocklist mutations, including duplicate-domain cases
- `429` — rate limit exceeded

Confirmed official duplicate-domain error example for `POST /blocklist`:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "domain": [
      "The domain has already been blocklisted for this environment."
    ]
  }
}
```

## Rate limits
The reviewed official rate-limit page explicitly states:
- Free plan: **1 request per second**
- Pro plans: **5 to 50 requests per second** depending on plan tier
- Unauthenticated requests: **5 requests per hour**
- `429 Too Many Requests` is returned on overage
- continued abuse can trigger a **5-minute IP block**

Note: the authentication page still describes API key auth as the standard mode for API usage; fireROUTE should not rely on unauthenticated operation except where the official product explicitly permits it.

## Important usage notes
- The legacy MailCheck.ai docs URL now lands on the UserCheck documentation/site, so fireROUTE should treat this provider as effectively rebranded.
- Blocklist management is explicitly documented as a **Pro-account** feature.
- Validation routes return more than simple disposable/not-disposable booleans; they also expose MX, trust, public-domain, relay, alias, and blocklist signals.
- `GET /status` exposes the current plan rate limit and remaining billing-period credits, which is useful for adapter health/status introspection.

## fireROUTE notes
- Model this provider primarily as an email/domain screening API with optional account-level blocklist management.
- Preserve the current UserCheck base URL and auth model even though the provider file keeps the legacy MailCheck.ai name.
- The most reusable fields for canonical normalization are `disposable`, `public_domain`, `relay_domain`, `role_account`, `mx`, and `blocklisted`.
- Treat blocklist routes as an advanced authenticated administrative surface rather than part of basic email validation.
