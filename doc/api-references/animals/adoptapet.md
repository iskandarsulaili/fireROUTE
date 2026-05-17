# AdoptAPet

## Manual review status
- Category: Animals
- Official docs URL from index: `https://www.adoptapet.com/public/apis/pet_list.html`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed official docs page: `https://www.adoptapet.com/public/apis/pet_list.html`
- Same-host official alternative: `https://www.adoptapet.com/public/apis/`

## Blocker summary
- Both reviewed official URLs currently load CloudFront `403 ERROR` pages instead of provider documentation.
- The error text explicitly says: `The Amazon CloudFront distribution is configured to block access from your country.`
- Because the official documentation host is geo-blocking this environment, I cannot confirm a live base URL, route inventory, methods, parameters, auth rules, pagination, rate limits, or error formats from first-party material.

## Evidence from manual browser inspection
- Visiting `https://www.adoptapet.com/public/apis/pet_list.html` loaded title `ERROR: The request could not be satisfied` and body text beginning with `403 ERROR` plus the country-block message above.
- Visiting `https://www.adoptapet.com/public/apis/` produced the same CloudFront `403 ERROR` page and the same country-block language.

## fireROUTE note
- Keep AdoptAPet blocked until the official docs host becomes reachable from this environment or the provider publishes a new first-party reference URL.
- Re-check both the indexed HTML page and the same-host `/public/apis/` directory before restoring any route assumptions.

## Sources inspected
- `https://www.adoptapet.com/public/apis/pet_list.html`
- `https://www.adoptapet.com/public/apis/`
