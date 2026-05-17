# PatentsView

## Provider metadata
- Category: `Patent`
- Provider slug: `patentsview`
- Official pages manually reviewed in this pass:
  - `https://data.uspto.gov/support/transition-guide/patentsview`
  - `https://search.patentsview.org/api`
- Current official status confirmed from the reviewed pages: USPTO explicitly treats the legacy PatentsView PatentSearch API as transition-interrupted, and the former API hostname no longer resolved in this session
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the official USPTO PatentsView transition guide and the legacy PatentsView API hostname itself. The official USPTO guidance is now explicit: PatentsView is being migrated into the Open Data Portal, bulk datasets have transition mappings, and the old PatentSearch API is temporarily interrupted with no published launch-date estimate for updated API functions. Because USPTO still has not published a current PatentsView-specific route inventory, this provider remains a `0`-route blocker.

## What the reviewed official pages currently confirm
1. `https://data.uspto.gov/support/transition-guide/patentsview` is the current official PatentsView transition page and states that the legacy `www.patentsview.org` website is migrating to the USPTO Open Data Portal (`https://data.uspto.gov`) starting on `March 20, 2026`.
2. The reviewed transition page currently includes an ODP registration banner stating that access to the Open Data Portal will require signing in with a valid USPTO.gov account starting on `June 18, 2026`.
3. The transition guide maps legacy PatentsView bulk-data areas into ODP dataset pages, including:
   - `https://data.uspto.gov/bulkdata/datasets/pvgpatdis`
   - `https://data.uspto.gov/bulkdata/datasets/pvgpattxt`
   - `https://data.uspto.gov/bulkdata/datasets/pvpgpubdis`
   - `https://data.uspto.gov/bulkdata/datasets/pvpgpubtxt`
   - `https://data.uspto.gov/bulkdata/datasets/pvsorted`
   - `https://data.uspto.gov/bulkdata/datasets/pvannual`
4. The same official transition guide explicitly says that temporary interruptions are expected to affect the `PatentsView PatentSearch API` previously available at `search.patentsview.org/api`.
5. USPTO says it plans to reintroduce PatentsView API functions in updated forms as the transition progresses, but `there is currently no estimate for the launch date of these API functions on ODP`.
6. USPTO also says previously issued PatentSearch API keys will not be compatible with ODP APIs and that users will need new ODP API keys obtained through the ODP API getting-started flow.
7. The transition guide indicates that bulk dataset migration is already live, but that does not provide a current PatentsView route-by-route REST catalog.
8. In this session, the legacy API hostname `https://search.patentsview.org/api` did not load a docs or API surface and failed at navigation time with `net::ERR_NAME_NOT_RESOLVED`.

## Current blocker
This remains an explicit official transition/interruption blocker rather than a simple missing-docs blocker:
- USPTO confirms the old PatentsView PatentSearch API is temporarily interrupted
- USPTO has not yet published a replacement PatentsView-specific endpoint inventory
- the former legacy API hostname no longer resolved in this session
- the official transition guide maps bulk datasets and migration status, not current PatentsView REST operations

Because of that blocker, I could not responsibly confirm:
- a live PatentsView-specific base URL
- current endpoint paths or HTTP methods
- request parameters or bodies for a live PatentsView API
- PatentsView authentication header format for current routes
- pagination rules for a current PatentsView route surface
- numeric rate limits
- canonical response formats or error envelopes

## Important usage notes
- Treat PatentsView as a migration-interrupted provider, not as an active documented API surface.
- For current live USPTO patent APIs, review the separate `USPTO` provider entry rather than silently substituting broader ODP patent endpoints here.
- Bulk dataset migration is already live on ODP, but the transition guide does not expose a current route-by-route PatentsView API replacement.
- Any future PatentsView route recovery will likely depend on the ODP transition and updated ODP credentials, not historical PatentsView API keys.

## fireROUTE normalization notes
- Keep PatentsView marked `manually_documented` with an explicit transition/interruption blocker narrative.
- Preserve the confirmed route count at `0` until USPTO publishes a current PatentsView-specific endpoint inventory or an explicit one-to-one official replacement map.
- Keep the category README docs URL pointed at the official transition guide.
- Do not backfill routes from historical PatentsView examples, third-party wrappers, or generic USPTO ODP patent endpoints without an explicit official PatentsView mapping.
