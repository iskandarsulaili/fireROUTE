# owo

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `owo`
- Official pages reviewed manually:
  - `https://owo.vc/api`
  - `https://owo.vc/`
- Current extraction outcome: explicit docs-surface failure / no readable first-party route reference blocker
- Confirmed current public API base URL: none confidently confirmed
- Manually confirmed current route count: `0`

## Manual review result
The owo root site is still reachable, but the indexed API-docs URL did not expose a readable route reference during this pass.

Because the reviewed first-party pages did not provide stable route-level documentation, I could not safely confirm any current API operations from the provider's own materials.

## What the official pages showed
### 1) Indexed API documentation URL
- Requested: `https://owo.vc/api`
- Final loaded URL during browser review: `https://owo.vc/api`
- Visible page title: none
- Visible browser output: only a raw-response style viewer with a `Pretty-print` checkbox was exposed in the reviewed session
- Outcome: no readable endpoint table, method list, auth guide, parameter reference, pagination notes, error schema, or rate-limit guidance was visible from the indexed docs path

### 2) Official root tried as the alternative first-party page
- Requested: `https://owo.vc/`
- Final loaded URL during browser review: `https://owo.vc/`
- Visible page title: `owo`
- Visible landing-page content included:
  - heading `owo`
  - subtitle `A simple link obfuscator`
  - textbox labeled `owo.vc link to get info on...`
  - links labeled `katlyn`, `GitHub`, `API documentation`, and `changelog`
- Outcome: the root confirms the product still has a live public landing page, but it did not itself expose route paths, HTTP methods, request parameters, auth requirements, pagination, or error documentation that could be safely counted as API routes

## Missing information caused by the blocker
Because the reviewed official pages did not expose a readable route reference, I could not responsibly confirm:
- current API base URL
- endpoint paths
- supported HTTP methods
- request parameters or payload fields
- authentication requirements beyond the old index metadata saying `No`
- rate limits
- pagination behavior
- response formats
- error formats

## fireROUTE integration note
Keep owo marked as a blocker-style `manually_documented` provider with `0` confirmed routes unless a readable first-party API reference becomes accessible again on the provider-controlled site.

## Verification note
This file was manually rebuilt from the indexed owo API-docs URL plus the official root using browser inspection only. No current routes were counted because the reviewed first-party surfaces did not expose a trustworthy readable route reference in this run.