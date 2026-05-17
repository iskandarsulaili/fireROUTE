# Tomba email finder

Official pages manually reviewed:
- https://tomba.io/api
- https://tomba.io/api/phone-validator
- https://tomba.io/reverse-email-lookup
- https://tomba.io/bulks
- https://tomba.io/api/bulk/domain-search
- https://tomba.io/api/bulk/phone-validator
- https://docs.tomba.io/

## Overview
Tomba publishes a REST API for email finding, verification, enrichment, domain intelligence, and phone validation.

Confirmed from the reviewed official pages:
- Base URL: `https://api.tomba.io`
- Primary version shown in reviewed examples: `v1`
- Auth headers: `X-Tomba-Key` and `X-Tomba-Secret`
- Primary response format: JSON
- The official site separately markets asynchronous bulk API workflows for several products
- The current docs surface is split between the marketing/reference pages on `tomba.io` and the broader product/docs root at `docs.tomba.io`

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/domain-search` | Find emails for a company domain |
| GET | `/v1/email-finder` | Find an email from name + domain |
| GET | `/v1/email-verifier` | Verify deliverability of an email |
| GET | `/v1/author-finder` | Find the email behind a blog post or article |
| GET | `/v1/company-enrichment` | Company enrichment by domain |
| GET | `/v1/email-enrichment` | Contact enrichment by email |
| GET | `/v1/linkedin-finder` | Find emails from LinkedIn profile URLs |
| GET | `/v1/phone-finder` | Find phone numbers from email addresses |
| GET | `/v1/domain-similar` | Find similar company domains |
| POST | `/v1/reveal/search` | Company reveal / intelligence lookup |
| GET | `/v1/email-count` | Email stats by domain / department / seniority |
| GET | `/v1/email-format` | Detect a company's email pattern |
| GET | `/v1/location` | Employee geographic distribution by country |
| GET | `/v1/technology-checker` | Detect technologies used by a domain |
| GET | `/v1/people/find` | Person enrichment / Clearbit-alternative person lookup |
| GET | `/v1/companies/find` | Company enrichment / Clearbit-alternative company lookup |
| GET | `/v1/combined/find` | Combined person + company enrichment |
| GET | `/v1/phone-validator` | Validate a phone number and return carrier / format metadata |

Manual route count confirmed from the reviewed official pages: **18**.

## Authentication
The official curl examples show header-based auth:
- `X-Tomba-Key: ta_...`
- `X-Tomba-Secret: ts_...`

The main API landing page also links account creation / API-key issuance through the hosted Tomba app.

## Parameters and request model
Confirmed or directly visible request details from the reviewed official pages:
- `domain` query parameter on `/v1/domain-search` via the official curl example
- person/company-identifying inputs vary by route and are described through the official route cards and linked per-product pages
- `/v1/reveal/search` is the only reviewed route explicitly shown as `POST`
- `/v1/phone-validator` is documented as a `GET` route returning phone-validation metadata

Provider-specific request observations from the reviewed official pages:
- reverse email lookup on `https://tomba.io/reverse-email-lookup` currently points to the `Email Enrichment` API docs rather than a separate reverse-lookup-only API route
- the `Phone Validator API` page currently shows a phone-oriented UI and phone-shaped response object, but the visible curl snippet uses `?email=john.doe@stripe.com`; this appears to be a first-party docs inconsistency that should be runtime-verified before hard-coding the request parameter name

## Response format
JSON is the standard API response format on the reviewed pages.

Observed fields from the reviewed `Phone Validator API` example response:
- `data.phone`
- `data.valid`
- `data.type`
- `data.country_code`
- `data.carrier`
- `data.local_format`
- `data.international_format`
- `data.e164`

## Bulk / async notes
The official bulk pages confirm a broader asynchronous bulk API surface beyond the single-record routes above.

What was directly confirmable from the reviewed official bulk pages:
- bulk product families currently advertised: `Domain Search`, `Domain Similar`, `Email Finder`, `Author Finder`, `Email Verifier`, `Email Enrichment`, `LinkedIn Finder`, `Phone Finder`, `Phone Validator`, and `Company Enrichment`
- bulk jobs are described as asynchronous API operations with status tracking
- reviewed bulk pages advertise CSV upload plus CSV or JSON export workflows
- reviewed capacity claims vary by product page:
  - bulk domain-search marketing page says `up to 1,000 domains at once`
  - the bulk domain-search infrastructure section separately says `up to 100,000 rows`
  - the bulk phone-validator pages say `up to 100,000 numbers at once`
- reviewed bulk API FAQ prompts explicitly mention webhook support

Important limitation:
- the reviewed browser-visible bulk API pages did **not** expose exact public `api.tomba.io` method/path templates, so those bulk operations are documented here as confirmed product surfaces but are **not** counted in the exact route total above

## Rate limits, credits, and usage notes
I did not find a numeric requests-per-second throttle table in the reviewed public pages.

What was manually confirmable from the reviewed official pages:
- the provider advertises `<200ms` average API response time
- the provider advertises `99.9%` uptime on the main API landing page and `99.988%` uptime on the docs homepage stats strip
- plans are credit-based
- the main API landing page and product pages advertise free verification credits bundled with plans
- the Phone Validator page explicitly says `1 Credit Per Check`
- the Phone Validator page also states invalid or malformed inputs are rejected at no cost
- the site advertises `13+` official libraries / SDKs

## Important usage notes
- Tomba now has a broader official surface than the older repo file captured: in addition to the long-standing email and enrichment routes, the official site now exposes a dedicated `Phone Validator API` page with a concrete `GET /v1/phone-validator` route.
- The provider mixes classic single-request REST routes with separately marketed asynchronous bulk workflows; adapters should keep those concepts distinct.
- Reverse-email-lookup is currently a product/use-case page layered over `Email Enrichment`, not a separately confirmed API route.
- Because the current public docs are split across multiple first-party surfaces and include at least one visible docs inconsistency on phone-validator parameters, any production adapter should preserve provider-native field names and verify live request syntax against the current dashboard/full docs before shipping.

## Verification notes
This file was manually rebuilt from the reviewed official Tomba pages listed above using browser inspection only.