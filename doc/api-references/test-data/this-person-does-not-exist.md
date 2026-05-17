# This Person Does not Exist

## Provider metadata
- Category: `Test Data`
- Provider slug: `this-person-does-not-exist`
- Docs used manually:
  - `https://thispersondoesnotexist.com`
- Confirmed API base URL: `https://thispersondoesnotexist.com`
- Primary response media type: `image/jpeg`
- Authentication model surfaced in docs/site: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the reviewed official site:
- no API key, bearer token, OAuth flow, or account setup is shown
- the site itself is the endpoint

## Common request/response conventions
- Base URL: `https://thispersondoesnotexist.com`
- the reviewed surface is a public `GET` endpoint at the site root
- the generated-research fetch and live browser navigation both indicate the root response is an image rather than JSON or HTML docs
- the previously captured fetch metadata for the official URL reported `status=200` and `type=image/jpeg`
- the browser navigation title rendered as `thispersondoesnotexist.com (1024×1024)`, which is consistent with the root returning a directly renderable image asset

## Manually confirmed endpoint set

### 1) Return a generated face image
- Method: `GET`
- Path: `/`
- Full URL: `https://thispersondoesnotexist.com/`
- Purpose: return a newly generated face image for a person who does not exist
- Authentication: none shown
- Query parameters: none were documented or surfaced on the reviewed official site
- Response format:
  - directly served image response
  - previously captured fetch metadata identified the content type as `image/jpeg`
- Important usage note:
  - the reviewed official site behaves as the API response itself rather than as a separate documentation landing page

## Pagination
- none documented

## Rate limits
- no published rate limits or quota windows were shown on the reviewed official site

## Error and response notes
- the reviewed official site did not expose a structured error schema or status-code table
- the visible successful behavior is a direct image response from the root URL

## Important usage notes
- consumers should treat this provider as a media endpoint, not a JSON API
- because the site returns a rendered image directly, clients that expect JSON or text will need special handling
- no separate versioning or alternate route families were surfaced during review

## Verification notes
This file was manually rebuilt from the official site using browser inspection. The root endpoint was confirmed as the active response surface.