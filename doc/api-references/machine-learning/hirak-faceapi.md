# Hirak FaceAPI

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `hirak-faceapi`
- Official pages manually reviewed in this pass:
  - `https://faceapi.hirak.site/`
  - `https://hirak.site/`
- Manual review outcome: `docs_unreachable`
- Confirmed routes in this pass: `0`

## Manual blocker summary
I manually reviewed the listed FaceAPI host and the official apex-domain alternative.

### Listed FaceAPI host result
- Reviewed URL: `https://faceapi.hirak.site/`
- Browser result in this pass: `net::ERR_ABORTED`
- The listed FaceAPI host did not expose usable provider documentation during this review.

### Official apex-domain alternative result
- Reviewed URL: `https://hirak.site/`
- Final browser result in this pass: redirected to `http://ww1.hirak.site/`
- The final loaded page state was effectively empty and did not expose provider documentation, onboarding instructions, or route listings.

## What could be confirmed
- The reviewed Hirak FaceAPI-related hosts did not expose usable provider-controlled API documentation in this pass.
- The listed FaceAPI subdomain failed to load a usable page.
- The official apex-domain alternative redirected to an empty parked-style page rather than FaceAPI documentation.
- No reviewed official page exposed a verifiable public FaceAPI HTTP route surface.

## What could not be confirmed
Because the reviewed official pages did not expose usable developer documentation, none of the following could be grounded from official sources in this pass:
- API base URL
- endpoint paths
- HTTP methods
- request parameters
- request and response formats
- authentication format
- pagination rules
- rate limits
- error schema
- usage notes tied to concrete routes

## Confirmed routes
No concrete HTTP route could be manually confirmed.

Manual route count confirmed: **0**.

## fireROUTE status
Treat this provider as `docs_unreachable` until the official Hirak hosts again expose provider-controlled FaceAPI documentation.

## Verification notes
This file was manually rebuilt from live browser review of the listed FaceAPI host plus the official apex-domain alternative.
