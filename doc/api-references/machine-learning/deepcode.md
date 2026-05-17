# Deepcode

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `deepcode`
- Official pages manually reviewed in this pass:
  - `https://snyk.io/platform/deepcode-ai/`
  - `https://docs.snyk.io/`
- Manual review outcome: `docs_reached_no_routes_detected`
- Confirmed routes in this pass: `0`

## Manual review summary
I manually reviewed the official Snyk DeepCode AI product page and the official Snyk documentation entry point.

### Official product page result
- Reviewed URL: `https://snyk.io/platform/deepcode-ai/`
- Page title during review: `DeepCode AI | AI Code Review | AI Security for SAST | Snyk AI | Snyk`
- The live page presents DeepCode AI as a capability inside the broader Snyk platform.
- The reviewed page exposed product and marketing content about AI code review, AppSec coverage, prioritization, and autofix assistance, but it did not expose a standalone Deepcode API base URL, endpoint list, HTTP method catalog, auth guide, pagination model, rate-limit guidance, or error schema.

### Official alternative page result
- Reviewed URL: `https://docs.snyk.io/`
- Page title during review: `Homepage | Snyk User Docs`
- The official Snyk documentation site was reachable in this pass.
- The reviewed docs entry point did not expose a standalone Deepcode-specific public route family or provider-specific API reference.

## What could be confirmed
- DeepCode AI is still officially presented by Snyk.
- The official product page is reachable at `https://snyk.io/platform/deepcode-ai/`.
- The official Snyk documentation homepage is reachable at `https://docs.snyk.io/`.
- The reviewed official material did not expose a dedicated standalone public Deepcode API surface.

## What could not be confirmed
Because the reviewed official pages did not publish standalone Deepcode route documentation, none of the following could be grounded for Deepcode as its own provider surface:
- API base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- pagination behavior
- rate limits
- error schema
- request and response formats
- provider-specific usage notes tied to concrete routes

## Confirmed routes
No concrete Deepcode-specific HTTP route could be manually confirmed.

Manual route count confirmed: **0**.

## fireROUTE status
Treat this provider as `docs_reached_no_routes_detected`: the official product and docs pages are reachable, but the official material reviewed in this pass still does not expose a standalone public Deepcode API reference.

## Verification notes
This file was manually rebuilt from live browser review of the official Snyk DeepCode AI product page and the official Snyk documentation homepage.
