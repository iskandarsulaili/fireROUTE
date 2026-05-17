# 1pt

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `1pt`
- Docs used manually:
  - `https://github.com/1pt-co/api/blob/main/README.md`
- Confirmed API base URL from the official README: `https://csclub.uwaterloo.ca/~phthakka/1pt-express`
- Legacy base URL noted in the official README: `https://csclub.uwaterloo.ca/~phthakka/1pt`
- Primary media type: JSON
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the official 1pt API README:
- the API is public
- no API key, OAuth flow, or account setup is documented

## Common request/response conventions
- Primary documented base URL: `https://csclub.uwaterloo.ca/~phthakka/1pt-express`
- documented legacy base URL: `https://csclub.uwaterloo.ca/~phthakka/1pt`
- reviewed API surface uses `POST`
- responses are JSON objects
- the official example response includes `short` and `long`

## Manually confirmed endpoint set

### 1) Create a shortened URL
- Method: `POST`
- Path: `/addURL`
- Full URL: `https://csclub.uwaterloo.ca/~phthakka/1pt-express/addURL`
- Purpose: shorten a long URL into a 1pt short code
- Request parameters confirmed in the official README:
  - `long` - required long URL to shorten
  - `short` - optional requested short code; if omitted or already taken, the service returns a random 5-letter string instead
- Response fields confirmed in the official README example:
  - `short` - created short code
  - `long` - original long URL
- Important usage notes from the official README:
  - if the requested `short` value is already taken, the API still succeeds by returning a random 5-letter short code
  - the README says a flag named `receivedRequestedShort: false` is included when the requested short code could not be honored
  - the older non-`-express` endpoint is still live but explicitly marked as soon to be deprecated

## Pagination
- none documented

## Rate limits
- no published rate limits or quota windows were shown in the reviewed official README

## Error and response notes
- the reviewed README does not publish an HTTP status table
- the documented successful response is JSON
- the README explicitly documents the fallback behavior when a requested short code is unavailable instead of describing that case as a hard error

## Important usage notes
- the API documentation is currently maintained in the official GitHub repository rather than on a separate hosted developer portal
- the `short` parameter is advisory rather than guaranteed
- clients integrating this API should prefer the `1pt-express` base URL because the older base is marked for deprecation in the official README

## Verification notes
This file was manually rebuilt from the official 1pt API README using browser inspection.