# Citi

Official pages manually reviewed:
- https://sandbox.developerhub.citi.com/api-catalog-list
- https://partner.citi.com/developers

## Manual review result
**Blocked for public endpoint-level documentation.**

The original index URL now redirects to Citi’s current Partner Portal (`https://partner.citi.com/home`), and the reviewed developer page (`https://partner.citi.com/developers`) is a marketing/onboarding surface rather than a public route reference.

## What was confirmed from the reviewed official pages
The current official Citi partner/developer pages publicly confirm that Citi offers:
- an API catalog
- an API playground / sandbox experience
- onboarding/workspace concepts
- support for OAuth 2.0 authorization
- TLS 1.2 encryption
- Swagger documentation for partners
- JSON-based APIs with optional XML conversion mentioned on the public developer page
- broad scale claims such as 10 API categories and 85+ APIs

## Why this provider is blocked
After reviewing both the legacy developerhub URL and Citi’s current official partner developer page:
- the old public catalog URL no longer exposes endpoint details and redirects into the partner portal
- the public developer page does **not** list concrete base URLs, endpoint paths, methods, or parameter schemas
- the page strongly implies that actual API catalog and sandbox details require sign-on / partner onboarding
- no public Swagger/OpenAPI document, route table, or unauthenticated endpoint reference was reachable from the reviewed pages

Because of that, I could **not** manually confirm any concrete live API route, auth header format, pagination contract, or error schema from publicly accessible official Citi docs in this pass.

## Base URLs
No concrete public API base URL was manually confirmable from the reviewed official pages.

## Authentication
Only high-level signals were publicly visible:
- OAuth 2.0 is mentioned on the official developer page
- TLS 1.2 is mentioned as the transport-security requirement

No concrete token URL, client-auth method, header names, or scope model was publicly visible without portal access.

## Confirmed routes
No concrete endpoint paths were publicly confirmable from the reviewed official pages.

Manual route count confirmed: **0**.

## Pagination, errors, and rate limits
No public pagination contract, error schema, or rate-limit table was exposed on the reviewed official pages.

## Recommended next step if this provider is revisited
If Citi later exposes a public API catalog or unauthenticated Swagger/OpenAPI export, revisit this file and document the concrete route surface from that first-party source.

## fireROUTE note
Treat Citi as **blocked / access-gated** for manual public documentation at the moment. Do not infer routes from marketing copy alone.
