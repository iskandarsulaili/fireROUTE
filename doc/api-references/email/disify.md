# Disify

Official docs manually reviewed:
- https://disify.com/

## Overview
Disify provides a simple email-validation API for single checks, bulk checks, and retrieval of valid results from a bulk-validation session.

- Base URL: `https://disify.com/api`
- Response format: JSON
- Auth: none required for the basic REST API according to the reviewed docs

## Authentication
The reviewed docs explicitly describe the API as a free REST API and state that no auth is required for basic checks. They also mention optional accounts/plans for higher limits and pro features.

## Confirmed endpoints
The homepage API reference explicitly shows these paths, and the same page states that all endpoints accept both `GET` and `POST`.

| Method(s) | Path | Purpose | Key parameters |
|---|---|---|---|
| GET or POST | `/api/email/{email}` | Validate one email address | Path `{email}` |
| GET or POST | `/api/email/{emails}/mass` | Validate multiple email addresses in one call | Path `{emails}` as comma/space/newline separated list |
| GET or POST | `/api/view/{session}` | Retrieve valid results from a bulk-validation job | Path `{session}`; optional query/controls `download`, `separator` |

Manual route count confirmed from the reviewed docs: **3**.

## Single email validation
Confirmed request example:

```text
GET https://disify.com/api/email/your@example.com
```

Confirmed response fields from the reviewed docs:
- `format`
- `domain`
- `disposable`
- `dns`
- `role`
- `free`
- `confidence`

## Bulk email validation
Confirmed request example:

```text
GET https://disify.com/api/email/a@example.com,b@mail.com/mass
```

The docs say multiple addresses may be separated by comma, space, or newline.

Confirmed response fields:
- `total`
- `invalid_format`
- `invalid_dns`
- `disposable`
- `unique`
- `valid`
- `session`

## Retrieve valid results
Confirmed request pattern:

```text
GET https://disify.com/api/view/{session}
```

The reviewed docs explicitly mention:
- use the `session` value from a bulk check
- optional controls `download` and `separator`
- sessions expire after about 1 hour
- each new bulk request overwrites the previous session

## Rate limits
The reviewed docs do not publish a complete free-tier numeric limit on the API reference section, but they do explicitly advertise:
- `Pro: 500 req/min`
- free accounts get higher limits than anonymous use

## Pagination
No pagination is documented.

## Errors
The reviewed docs do not publish a dedicated error schema. Consumers should expect plain JSON validation results rather than a complex paginated API envelope.

## Important usage notes
- Every documented endpoint accepts both `GET` and `POST`.
- Bulk sessions are ephemeral; fetch exported results before the roughly one-hour expiry.
- A new bulk request overwrites the previous bulk session state.

## fireROUTE notes
- Disify is a lightweight validation provider with one core single-check route and two bulk/result helpers.
- Preserve raw provider booleans like `disposable`, `dns`, `role`, and `free`; they map naturally into normalized validation signals.
