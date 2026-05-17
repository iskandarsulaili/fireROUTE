# Coronavirus

## Provider metadata
- Category: `Health`
- Provider slug: `coronavirus`
- Official docs/pages attempted:
  - `https://pipedream.com/@pravin/http-api-for-latest-wuhan-coronavirus-data-2019-ncov-p_G6CLVM/readme` (category-index docs URL; browser navigation aborted in this environment)
  - `https://pipedream.com/@pravin/http-api-for-latest-wuhan-coronavirus-data-2019-ncov-p_G6CLVM` (public Pipedream workflow page)
- Result: the reviewed official pages describe a reusable workflow template, not a fixed public API with a stable provider-owned base URL
- Manually confirmed route count: `0`

## Blocker note
The public workflow page identifies this as a Pipedream template named `HTTP API for Latest Covid-19 Data`. The manually reviewable page shows that users must deploy their own copy to generate a unique HTTP trigger URL.

The reviewed public page explicitly says:
- `Deploy to generate unique URL`
- the trigger step is an `HTTP API` / webhook-style entrypoint
- the underlying data source is described as Johns Hopkins CSSE data published to GitHub, but the public page does not expose a canonical shared production endpoint

Because the public template does not publish a stable route inventory, I could not manually confirm:
- a provider-owned base URL
- reusable endpoint paths and HTTP methods
- parameter contracts for a shared public API
- auth, quotas, pagination, or common error behavior for a canonical hosted service

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked because the official public page is a deploy-your-own workflow template rather than a route-level API reference.
- Keep route count at `0` unless an official fixed-host API reference page becomes publicly reachable.
- Do not backfill a fireROUTE adapter from third-party mirrors or inferred webhook URLs.