# Digi-Key

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://www.digikey.com/en/resources/api-solutions`
  - `https://developer.digikey.com/`
  - `https://api.digikey.com/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The reviewed official DigiKey `API Solutions` page is a marketing/overview page rather than a route reference.
- That page confirms DigiKey offers APIs for product information, real-time price and availability, quoting, ordering, order-status changes, myLists integration, and supply-chain program workflows, but it does not expose a browsable method/path inventory.
- The same page links to a `Launch Developer Portal`, but the direct official developer host could not be manually browsed in this run.
- Because the route reference itself was not reachable from the reviewed official hosts, no current base URL, endpoint path list, parameter schema, auth flow details beyond the index's OAuth label, pagination rules, or error format can be confirmed from first-party docs.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://www.digikey.com/en/resources/api-solutions`
- Result: page loaded successfully with title `API Solutions | DigiKey`
- Visible evidence:
  - the page markets `DigiKey Digital Solutions`
  - it says `DigiKey offers a wide range of APIs at no cost`
  - it lists business functions including `Search for Product Information`, `Receive Real-Time Price and Availability`, `Lock in Pricing with Quoting`, `Place an Order`, `View Order Status and Change Orders`, `Integrate with myLists`, and `Manage Supply Chain Program`
  - it offers a `Launch Developer Portal` link, but no route table or endpoint reference is visible on the reviewed page itself

### Official page attempt 2
- URL: `https://developer.digikey.com/`
- Result: browser navigation failed with `net::ERR_ABORTED`
- Interpretation: the obvious official developer-portal host was not manually inspectable in this environment

### Official page attempt 3
- URL: `https://api.digikey.com/`
- Result: browser navigation failed with `net::ERR_HTTP_RESPONSE_CODE_FAILURE`
- Interpretation: the obvious API host did not expose a browsable public reference page in this run

## Integration notes
- Keep Digi-Key blocked at `0` confirmed routes until the official developer portal or another first-party reference page becomes manually inspectable.
- Do not invent endpoint paths from the marketing summary alone.
- Revisit this provider if the official developer portal becomes accessible, because the marketing page strongly suggests that a richer first-party API surface still exists.

## Sources inspected
- `https://www.digikey.com/en/resources/api-solutions`
- `https://developer.digikey.com/`
- `https://api.digikey.com/`
