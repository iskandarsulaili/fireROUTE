# Time Door

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `time-door`
- Official pages manually reviewed in this pass:
  - `https://timedoor.io/`
  - `https://timedoor.io/docs`
  - `https://timedoor.io/sandbox`
- Manual review outcome: `docs_reached_no_routes_detected`
- Confirmed routes in this pass: `0`

## Manual review summary
I manually reviewed the official Time Door site and the official alternative pages that should have exposed the API reference.

### Official homepage result
- Reviewed URL: `https://timedoor.io/`
- Browser result during review: `net::ERR_ABORTED`
- The root homepage did not yield a stable route reference in this pass.

### Official documentation and sandbox results
- Reviewed URL: `https://timedoor.io/docs`
- Result in this pass: `Internal Server Error` page with traceback ending in `404 Not Found`.
- Reviewed URL: `https://timedoor.io/sandbox`
- Result in this pass: `Internal Server Error` page with traceback ending in `404 Not Found`.
- The reviewed Time Door pages did not expose a concrete base API URL, endpoint list, HTTP method catalog, auth instructions, pagination rules, rate limits, or error schema.

## What could be confirmed
- The Time Door domain is still live enough to serve provider-controlled error pages.
- The official `/docs` and `/sandbox` paths currently fail with provider-served `Internal Server Error` responses ending in `404 Not Found` tracebacks.
- No reviewed official Time Door page exposed a usable public route reference in this pass.

## What could not be confirmed
Because the public documentation paths did not expose a usable API reference, none of the following could be grounded with sufficient confidence:
- API base URL
- endpoint paths
- HTTP methods
- formal request schema
- authentication details
- pagination behavior
- rate limits
- error schema for real API responses
- usage notes tied to concrete routes

## Confirmed routes
No concrete HTTP route could be manually confirmed.

Manual route count confirmed: **0**.

## fireROUTE status
Treat this provider as `docs_reached_no_routes_detected`: the official domain is still live, but the reviewed documentation paths only exposed provider error pages rather than route-level API documentation.

## Verification notes
This file was manually rebuilt from live browser review of the official Time Door domain plus the official `/docs` and `/sandbox` pages.
