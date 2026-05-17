# Covid-19 Datenhub

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-datenhub`
- Official docs/pages attempted:
  - `https://npgeo-corona-npgeo-de.hub.arcgis.com/`
  - `https://npgeo-corona-npgeo-de.hub.arcgis.com/search?collection=Dataset`
- Result: the official ArcGIS Hub root and the official dataset-search page both loaded only a minimal Hub shell with `Sign In` prompts and no route-level API reference, dataset detail pages, or downloadable route inventory visible in this environment.
- Manually confirmed route count: `0`

## Blocker note
I re-checked the official site directly instead of relying on the older index status.

The reviewed official pages did load, but the visible public content was limited to an ArcGIS Hub shell (`Close`, `Sign In`, `Recent Downloads`) without any exposed REST path list, dataset IDs, parameter reference, or OpenAPI/Swagger material that could be manually verified from the page.

Because the public official pages available in this environment did not expose route-level documentation, I could not confidently confirm:
- a stable public API base URL
- canonical endpoint paths
- required or optional parameters
- authentication expectations
- rate limits
- pagination or error behavior

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by missing route-level documentation on the current official public pages.
- Keep the route count at `0` until the official ArcGIS Hub pages expose dataset/API details that can be verified directly.
- Do not backfill routes from third-party mirrors, scraped ArcGIS guesses, or stale blog posts.