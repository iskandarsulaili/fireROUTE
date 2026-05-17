# Covid-19

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19`
- Official docs/pages used:
  - `https://documenter.getpostman.com/view/10808728/SzS8rjbc` (official Postman collection reached after the homepage timed out twice in this environment)
- Current public API base URL shown in the official docs: `https://api.covid19api.com`
- Auth model shown in the reviewed docs: Basic Auth is configured in the published Postman collection; the collection also exposes access-key and subscription-management endpoints
- Response format: JSON
- Public rate-limit note: the reviewed docs did not publish a numeric quota
- Manually confirmed route count: `13`

## Authentication and access
- The official Postman collection is marked `Public`.
- The visible collection uses `Basic Auth` at collection level and also exposes `Create Access Key` and `Subscriptions` operations, so downstream adapters should treat access control as provider-managed rather than anonymous.
- Several routes are labelled `Premium`, indicating tiered access.

## Canonical endpoints confirmed from the reviewed docs
1. `GET /` - route index / API default overview
2. `GET /summary` - global and per-country summary
3. `GET /countries` - supported countries and province associations
4. `GET /dayone/country/{country}/status/{status}` - first-recorded-case timeline by status
5. `GET /dayone/country/{country}/status/{status}/live` - day-one timeline with live count
6. `GET /total/dayone/country/{country}/status/{status}` - day-one totals by status
7. `GET /country/{country}/status/{status}` - country/province timeline by status
8. `GET /country/{country}/status/{status}/live` - country/province live series by status
9. `GET /total/country/{country}/status/{status}` - country totals by status
10. `GET /live/country/{country}/status/{status}` - live case list by country and status
11. `GET /live/country/{country}/status/{status}/date/{date}` - live case list after a date
12. `GET /all` - full dataset export in JSON response form
13. `POST /webhook` - register a webhook for new-data notifications

## Parameters and path variables
### Path parameters
- `country` - country slug from `/countries`
- `status` - case type; the docs explicitly list `confirmed`, `recovered`, and `deaths`
- `date` - date selector for the after-date live route

## Response, pagination, and error notes
- The reviewed examples are JSON-based.
- The docs explicitly warn that `/all` returns `8MB+` and can take `5+ seconds`.
- No offset/page pagination model is documented on the reviewed pages.
- No shared error schema was visible in the reviewed excerpts.

## Usage notes from the official docs
- The route index response enumerates major public paths and describes `/countries` as the source of valid `country_slug` values.
- The live routes are described as ungrouped case records pulled every 10 minutes.
- The collection also advertises additional premium/admin operations such as premium country data, tests, travel data, version, subscriptions, and access-key management, but the 13 paths above were the ones whose concrete route strings were directly visible in the reviewed excerpts.

## fireROUTE normalization notes
- Normalize this provider as a JSON API rooted at `https://api.covid19api.com`.
- Preserve the distinction between raw country/province series, `total/*` routes, and `live/*` routes because the official docs describe them separately.
- Treat premium and subscription-management features as separate capability tiers rather than assuming all public routes are anonymously callable.