# IPS Online

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `ips-online`
- Description from catalog: `Face and License Plate Anonymization`
- Official pages manually reviewed in this pass:
  - `https://docs.identity.ps/docs`
  - `https://identity.ps/`
  - `https://www.identity.ps/`
- Expected auth signal from the catalog/index: `apiKey`
- Manual review outcome: `docs_unreachable`
- Confirmed routes in this pass: `0`

## Manual blocker summary
I manually retried the listed official documentation URL and the official same-brand domain alternatives.

### Attempt 1: listed docs host
- URL: `https://docs.identity.ps/docs`
- Browser result: `net::ERR_NAME_NOT_RESOLVED`
- Outcome: the listed documentation hostname did not resolve, so no official API documentation content could be inspected.

### Attempt 2: official apex-domain alternative
- URL: `https://identity.ps/`
- Browser result: `net::ERR_NAME_NOT_RESOLVED`
- Outcome: the official apex domain was also unreachable.

### Attempt 3: official `www` alternative
- URL: `https://www.identity.ps/`
- Browser result: `net::ERR_NAME_NOT_RESOLVED`
- Outcome: the `www` hostname also failed to expose any reachable official API or documentation page.

## What could be confirmed
- The listed docs host `docs.identity.ps` was not reachable in this environment.
- The official alternatives `identity.ps` and `www.identity.ps` were also unreachable.
- No reviewed official IPS Online page exposed API reference content, route examples, or a machine-readable schema in this pass.

## What could not be confirmed
Because none of the reviewed official hostnames loaded usable documentation, I could not ground any of the following from official sources during this pass:
- API base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication details beyond the catalog's historical `apiKey` hint
- pagination behavior
- rate limits
- error schema
- request and response format notes
- usage notes tied to specific routes

## Confirmed routes
No concrete HTTP route could be manually confirmed.

Manual route count confirmed: **0**.

## fireROUTE status
Treat this provider as `docs_unreachable` until an official `identity.ps` hostname becomes reachable again.

## Verification notes
This file was manually rebuilt from live browser review of the listed docs URL plus the official apex and `www` domain alternatives.
