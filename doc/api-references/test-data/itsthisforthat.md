# ItsThisForThat

## Provider metadata
- Category: `Test Data`
- Provider slug: `itsthisforthat`
- Official docs used manually:
  - `https://itsthisforthat.com/api.php`
  - output-mode links exposed on that official API page:
    - `http://itsthisforthat.com/api.php?json`
    - `http://itsthisforthat.com/api.php?call=myfunc`
    - `http://itsthisforthat.com/api.php?text`
- Confirmed API base URL: `https://itsthisforthat.com`
- Primary response formats surfaced in the official API page: JSON, JSON callback/JSONP, and plain text
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `3`

## Authentication
From the reviewed official API page:
- no API key, OAuth flow, or account requirement is published
- the API is presented as a public generator for random startup ideas

## Common request/response conventions
- the official API page documents a single path, `/api.php`, with output mode selected by query parameters
- the reviewed page still prints legacy `http://` example links even though the docs page itself is reachable over HTTPS
- all reviewed entrypoints are GET-style URL links
- no pagination, quota, or formal error documentation was shown on the reviewed official page

## Manually confirmed endpoint set

### 1) Return a JSON startup-idea payload
- Method: `GET`
- Path: `/api.php`
- Full URL pattern shown on the official page: `http://itsthisforthat.com/api.php?json`
- Purpose: return a random startup idea as JSON
- Confirmed query-mode selector:
  - `json` - enables JSON output
- Important note:
  - the official page presents this as a bare query switch rather than a key/value parameter

### 2) Return a JSONP callback response
- Method: `GET`
- Path: `/api.php`
- Full URL pattern shown on the official page: `http://itsthisforthat.com/api.php?call=myfunc`
- Purpose: return the generated idea wrapped in a JavaScript callback
- Confirmed query parameter:
  - `call` - callback function name; the official example uses `myfunc`
- Format note:
  - the docs label this mode as `JSON Callback`

### 3) Return a plain-text startup idea
- Method: `GET`
- Path: `/api.php`
- Full URL pattern shown on the official page: `http://itsthisforthat.com/api.php?text`
- Purpose: return the generated idea as plain text
- Confirmed query-mode selector:
  - `text` - enables text output

## Pagination
- none documented

## Rate limits
- no published rate limits or request quotas were shown on the reviewed official API page

## Errors and format notes
- the official page documents output-mode links only; it does not publish a dedicated error table
- route behavior is mode-driven on one shared endpoint path
- the publicly documented output formats are JSON, JSON callback/JSONP, and plain text

## Important usage notes
- the API docs are extremely minimal and expose only three link-based output modes
- because the official page still shows `http://` examples, callers should verify whether they want to normalize requests to HTTPS in their own integration layer
- the docs do not publish parameter schemas beyond the visible mode selectors and the `call` callback name

## Verification notes
This file was manually rebuilt from the official ItsThisForThat API page using browser-based review only.