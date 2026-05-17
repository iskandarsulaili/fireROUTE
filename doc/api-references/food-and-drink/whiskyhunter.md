# WhiskyHunter

Official page manually reviewed:
- https://whiskyhunter.net/api/

## Overview
- Public API base URL: `https://whiskyhunter.net/api`
- Docs surface: Swagger UI
- Authentication: the reviewed Swagger page shows an `Authorize` control and `Django Login`, but all listed operations were displayed as readable GET endpoints on the public docs page
- Currency note from the docs: all trading volumes and winning bids are stated in `GBP`

Manual route count confirmed from the reviewed docs: **5**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/auction_data/{slug}/` | Retrieve data for one auction |
| GET | `/auctions_data/` | Retrieve auction data collection |
| GET | `/auctions_info` | Retrieve auction info summary |
| GET | `/distilleries_info/` | Retrieve distillery info collection |
| GET | `/distillery_data/{slug}/` | Retrieve data for one distillery |

## Parameters
- `slug` is the path parameter used for auction-specific and distillery-specific lookups

## Response notes
- The reviewed docs do not expose the full schema in the snapshot, but they clearly present the five GET operations above.
- The docs state volume calculations for auctions or distilleries include only lots actually sold and exclude lots that failed to reach reserve price.

## Rate limits
No numeric rate limit is published on the reviewed Swagger page.

## Pagination
No pagination details were visible in the reviewed snapshot.

## Important usage notes
- The docs are presented as API `v1`.
- Monetary values are documented in GBP regardless of auction base currency.

## fireROUTE notes
- This provider is primarily a market-data source with a small public read surface.
- Preserve the provider's `slug` identifiers in passthrough routes.
