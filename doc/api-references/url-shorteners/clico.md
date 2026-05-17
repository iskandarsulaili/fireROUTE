# Clico

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `clico`
- Official docs/pages attempted in this review:
  - `https://cli.com/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config`
  - `https://cli.com/`
- Confirmed API base URL in this review: none
- Manually confirmed route count: `0`

## Manual review result
I could not extract a current official API surface for Clico in this environment because both the indexed Swagger URL and the official root host redirected to a domain-sale landing page rather than API documentation.

## What the official pages did show
Across both reviewed first-party pages, the browser ended on an Afternic sales landing page for the domain:
- final host: `https://www.afternic.com/forsale/cli.com...`
- page title: `cli.com`
- prominent visible text: `The domain name cli.com is for sale!`
- additional page markers: `PREMIUM`, `VERIFIED DOMAIN`, and purchase/contact forms

Those reviewed pages therefore exposed domain-sale content instead of a live Swagger UI, route list, auth reference, or request/response documentation.

## Official pages reviewed
### 1) Indexed Swagger page
- URL: `https://cli.com/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config`
- Result in this review: redirected to Afternic domain-sale content for `cli.com`

### 2) Official site root
- URL: `https://cli.com/`
- Result in this review: same Afternic `cli.com is for sale` landing page

## What could not be confirmed manually
Because the reviewed official host is currently a domain-sale landing page, I could not responsibly confirm:
- a live API base URL
- endpoint paths or methods
- request parameters
- API-key or auth header details
- rate limits
- pagination rules
- response formats
- error semantics

## fireROUTE normalization notes
- Keep this provider marked as `manually_documented` but blocked.
- Route count remains `0` because no current official API documentation was reachable on the reviewed first-party host.
- Do not carry forward historical route assumptions from stale copies or third-party references.
- Revisit only if `cli.com` returns to provider-controlled API documentation.

## Verification notes
This file was manually rebuilt as an explicit blocker note after checking the indexed Swagger URL and the official root host. Both redirected to the same Afternic domain-sale landing page.