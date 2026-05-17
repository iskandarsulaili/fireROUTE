# Charity Search

Official pages manually reviewed:
- https://charityapi.com/
- https://charityapi.com/docs-introduction
- https://charityapi.com/charity-api-summary-search
- https://charityapi.com/charity-api-ntee-documentation
- https://charityapi.com/charity-api-basic-documentation
- https://charityapi.com/charity-api-geolocation-documentation
- https://charityapi.com/charity-api-financial-documentation
- https://charityapi.com/charity-api-premium-documentation
- https://charityapi.com/stripe-meta-data
- https://charityapi.com/docs-support

## Overview
OrgHunter's current Charity API documentation is published on `charityapi.com`, but the actual documented request targets still use the legacy OrgHunter data host `data.orghunter.com` over plain HTTP.

The browsable first-party docs currently expose six concrete Charity API endpoints:
- one multi-result search route
- one category/NTEE lookup route
- four EIN-based detail routes with increasing levels of detail

The current docs navigation is slightly inconsistent:
- the homepage is live and links into the docs successfully
- the left-nav `Documentation` link resolves to `/documentation`, which currently returns a `404`
- the actual intro page is `https://charityapi.com/docs-introduction`

## Base URL manually confirmed
- `http://data.orghunter.com/v1`

## Canonical routes manually confirmed
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| POST | `/charitysearch` | Search the IRS-registered nonprofit database | Query: `user_key` required; optional `ein`, `searchTerm`, `city`, `state`, `zipCode`, `form990_amount_min`, `form990_amount_max`, `latitude`, `longitude`, `distance`, `category`, `eligible`, `rows`, `start` |
| POST | `/categories` | Return the NTEE/OrgHunter category list used for filtering | Query: `user_key` |
| POST | `/charitybasic` | Return basic EIN-level charity detail | Query: `user_key`, `ein` |
| POST | `/charitygeolocation` | Return EIN-level detail with map/location-oriented fields | Query: `user_key`, `ein` |
| POST | `/charityfinancial` | Return EIN-level financial/Form 990 detail | Query: `user_key`, `ein` |
| POST | `/charitypremium` | Return the most comprehensive EIN-level detail set | Query: `user_key`, `ein` |

Manual route count confirmed from the reviewed official pages: **6**.

## Auth model
- Authentication is by API key passed as the `user_key` query parameter.
- The reviewed request examples consistently use URL patterns such as `?user_key=yourKey`.
- I did not find any OAuth, bearer-token, or signed-request scheme in the reviewed first-party docs.

## Request and parameter notes
### Shared transport pattern
- All six documented API routes are shown as `POST` operations.
- Even though the methods are `POST`, the docs place parameters in the query string rather than in documented JSON request bodies.
- The docs examples use plain `http://` request URLs, not `https://`.

### `/charitysearch`
From the reviewed `Charity Search Summary API - Start Here` page:
- supports lookup by `ein`, keyword/name via `searchTerm`, `city`, `state`, `zipCode`, and `category`
- supports Form 990 revenue filtering through `form990_amount_min` and `form990_amount_max`
- supports GIS search through `latitude`, `longitude`, and `distance`
- the docs explicitly say `distance` is measured in miles and has a `10 mile maximum`
- `eligible=1` restricts results to tax-deductible organizations in good standing with the IRS
- `rows` defaults to `20`
- `start` is the offset/start-position style paging control shown by the docs
- the docs note that multiple `category` values can be passed, separated by commas

### `/categories`
From the reviewed `Charity NTEE Classification API` page:
- returns category records with `categoryId` and `categoryDesc`
- the example response uses a wrapper with top-level `code`, `msg`, and `data`
- the docs explicitly tie category filtering to the NTEE classification system

### EIN detail routes
Across the reviewed `basic`, `geolocation`, `financial`, and `premium` pages:
- all require `ein` plus `user_key`
- all return a large shared charity-detail field set including organization identity, address, IRS-status, deductibility, classification, and filing descriptors
- `charitygeolocation` is positioned for mapping/location use cases
- `charityfinancial` is positioned for Form 990 and financial-chart use cases
- `charitypremium` is positioned as the most comprehensive single-call route, combining detailed financial and location-oriented data

## Response-format notes
- The reviewed docs present JSON-style response examples.
- The categories page explicitly documents a wrapper shape of `code`, `msg`, and `data`.
- The search page documents result fields including `ein`, `charityName`, `category`, `url`, `city`, `state`, `zipCode`, `website`, `missionStatement`, `longitude`, and `latitude`.
- The EIN detail pages document broad field inventories rather than a compact schema; examples include identity, address, NTEE, tax-period, deductibility, asset/income, and revocation-related fields.

## Errors
The reviewed first-party docs did not publish a single centralized error-handling guide, but the category page does enumerate common status-style codes:
- `200` — OK
- `403` — Not Authorized
- `404` — No Results Found
- `500` — Server Error

## Pagination
- Pagination is documented only on `/charitysearch`.
- The reviewed search docs expose `rows` for page size and `start` for start position / record offset.
- I did not find separate page-number or cursor semantics for the single-EIN detail routes.

## Rate limits
- I did not find a concrete public rate-limit table on the reviewed first-party docs pages.
- The intro page discusses fees/plans at a high level, but no request-per-second or request-per-day quota was published on the pages reviewed in this run.

## Additional official notes
- The docs navigation also includes `Stripe Meta Data`, but that page documents required metadata fields for Stripe-based grant processing rather than exposing an additional Charity API route.
- The support page currently directs users to `support@orghunter.com`.
- The homepage markets the dataset as covering IRS-registered nonprofits and highlights geolocation coverage for roughly 2.5M charities.

## Important usage notes
- fireROUTE should treat `http://data.orghunter.com/v1` as the currently documented API base unless runtime testing proves an HTTPS equivalent.
- fireROUTE should preserve the provider's query-parameter API-key model (`user_key`) instead of normalizing it into bearer auth.
- Because the visible docs still rely on plain HTTP examples, downstream consumers should verify transport/security behavior before production use.
- The correct browsable docs entry is `https://charityapi.com/docs-introduction`; the site-wide `Documentation` nav link currently lands on a `404` page and should not be used as the canonical docs URL.
