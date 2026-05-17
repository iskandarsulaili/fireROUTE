# Shopee

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://open.shopee.com/`
  - `https://open.shopee.com/documents?version=1`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The reviewed official Shopee Open Platform host did not yield a usable route reference in this browser session.
- The official root loaded only a thin platform shell rather than a browsable endpoint catalog.
- The indexed documentation entrypoint loaded without any usable route content in this run.
- Because no first-party method/path reference was manually inspectable from the reviewed official pages, no current base URL, endpoint list, auth contract, parameter schema, pagination model, or error format can be confirmed from official sources.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://open.shopee.com/`
- Result: page loaded with title `Shopee Open Platform`
- Visible evidence: the reviewed page surfaced only a shallow platform shell rather than a route-level API reference

### Official page attempt 2
- URL: `https://open.shopee.com/documents?version=1`
- Result: page loaded with title `Shopee Open Platform`
- Visible evidence: the documentation entrypoint rendered without usable route content in this browser session

## Integration notes
- Keep Shopee blocked at `0` confirmed routes until the official docs page becomes manually inspectable again.
- Do not infer Shopee routes from third-party mirrors or old examples while the current official docs surface is non-browsable.

## Sources inspected
- `https://open.shopee.com/`
- `https://open.shopee.com/documents?version=1`
