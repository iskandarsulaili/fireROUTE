# Icanhazip

## Provider metadata
- Category: `Development`
- Provider slug: `icanhazip`
- Docs used manually:
  - `https://major.io/icanhazip-com-faq/`
  - `https://major.io/p/a-new-future-for-icanhazip/`
  - live service check: `https://icanhazip.com/`
- Confirmed API base URL: `https://icanhazip.com`
- Primary response type: plain text (`text/plain` behavior observed)
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
- No authentication is described on the reviewed official pages.
- The live service responded directly without any token, header, cookie, or query-key requirement.

## Common request/response conventions
- Base URL: `https://icanhazip.com`
- The public service is intentionally minimal: the official ownership/history pages describe it as a site that returns the caller's external IP address and nothing else.
- In this browser session, visiting the root returned a single IP address followed by a trailing newline.
- No official JSON envelope, pagination model, or parameterized API surface was published on the reviewed official pages.

## Manually confirmed endpoint set

### 1) Get the caller's public IP address
- Method: `GET`
- Path: `/`
- Full URL: `https://icanhazip.com/`
- Purpose: return the requester's public IP address in plain text.
- Confirmed request parameters: none documented and none required in the reviewed session.
- Confirmed response notes:
  - response body is plain text rather than JSON
  - the observed response was a single IPv6 address plus a newline
  - the service concept, per the official ownership/history pages, is to return the external IP address and nothing else

## Pagination
- None. No paginated route family is documented or implied by the reviewed official pages.

## Rate limits
- No numeric public rate limit was published on the reviewed official pages.
- I did not infer any quota that the official pages did not explicitly state.

## Error handling
- No official error schema was published on the reviewed official pages.
- In practice, the service behaves like a simple plain-text responder rather than a documented JSON API with typed error envelopes.

## Response format notes
- Successful responses are plain text.
- The reviewed official material does not document JSON, XML, or alternative response formats for this provider.

## Important usage notes
- The FAQ and follow-up ownership post confirm that icanhazip.com is now operated by Cloudflare.
- The official history post repeatedly describes the service as intentionally narrow and minimal.
- Because the official pages do not publish route-level error or quota documentation, fireROUTE should treat this provider as a minimal one-route utility rather than a feature-rich REST API.

## Verification notes
This file was manually rebuilt from the official FAQ/history pages and a live browser check of the root service endpoint.