# Transport for Czech Republic

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-czech-republic`
- Provider identified from the assigned official URL as: `CHAPS / IDOS Internet`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://www.chaps.cz/eng/products/idos-internet`
  - official alternative page: `https://www.chaps.cz/`
  - additional official retry attempted in this pass: `http://www.chaps.cz/eng/products/idos-internet`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- A direct manual attempt to load the assigned HTTPS CHAPS page returned a browser navigation failure with `net::ERR_ABORTED` before a readable page rendered.
- A manual attempt to load the official CHAPS homepage `https://www.chaps.cz/` timed out without producing a readable provider-controlled document.
- An additional manual HTTP retry for the assigned product page `http://www.chaps.cz/eng/products/idos-internet` also timed out without producing a readable provider-controlled document.
- In this pass, none of the reviewed official CHAPS pages produced a stable readable API reference, endpoint list, auth section, parameter schema, or format reference.

## fireROUTE publication fields
- Provider API base URL: not publicly confirmed from a readable official page in this pass.
- Endpoint paths: not publicly confirmed.
- HTTP methods: not publicly confirmed.
- Parameters or request bodies: not publicly confirmed.
- Authentication: not publicly confirmed.
- Rate limits: not publicly confirmed.
- Pagination: not publicly confirmed.
- Errors:
  - browser-level navigation failures and timeouts prevented route-level inspection
- Response formats: not publicly confirmed.
- Important usage notes:
  - no trustworthy provider-controlled CHAPS / IDOS documentation became readable in this browser session
  - the assigned product page and official alternative page failed before route-level review was possible

## Why this provider remains blocked
- I manually retried the assigned CHAPS URL and an official CHAPS alternative in this pass.
- The provider-controlled pages did not render a stable readable documentation surface that could be trusted for fireROUTE publication.
- Because no official endpoint inventory, base URL, method list, parameter contract, auth model, pagination behavior, rate limits, or error documentation became available, this provider remains `manual_blocked`.

## Sources inspected
- `https://www.chaps.cz/eng/products/idos-internet`
- `https://www.chaps.cz/`
- `http://www.chaps.cz/eng/products/idos-internet`
