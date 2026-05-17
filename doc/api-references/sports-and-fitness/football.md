# Football

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `football`
- Official docs/pages used:
  - `https://rapidapi.com/GiulianoCrescimbeni/api/football98/`
- Current public API host shown in the official marketplace docs: RapidAPI-hosted product page for the Football API V2
- Published route style in the reviewed docs: path-based REST routes under a championship slug
- Auth model: RapidAPI subscription with marketplace key/header (`X-Mashape-Key` / RapidAPI-style key flow)
- Response format: JSON examples shown in the marketplace docs
- Public rate-limit note: plan-based quotas are published (`BASIC`, `PRO`, `ULTRA`, `MEGA`), but the reviewed page did not expose per-endpoint numeric request ceilings
- Manually confirmed route count: `8`

## Authentication and access
- The reviewed official page is a RapidAPI product listing, so requests are tied to a RapidAPI subscription plan.
- The category index advertises `X-Mashape-Key`, which matches the RapidAPI key/header model.
- The page exposes an "Open playground" button, but the visible route inventory is available without signing in.

## Canonical endpoints
1. `GET /competitions/` - list all implemented championships
2. `GET /{championship}/table` - standings/table for one championship
3. `GET /{championship}/squadname/{squadname}` - lookup a squad by name
4. `GET /{championship}/squadposition/{squadposition}` - lookup a squad by standing position
5. `GET /{championship}/results/` - recent results for one championship
6. `GET /{championship}/fixtures/` - fixtures for one championship
7. `GET /{championship}/news/` - recent news for one championship
8. `GET /{championship}/transfers/` - recent transfers for one championship

## Parameters and path variables
### Path parameters
- `championship` - competition identifier such as `premierleague`, `ligue1`, `seriea`, or `championsleague`
- `squadname` - team-name search token; the docs say partial strings are accepted
- `squadposition` - single-digit squad position within the chosen championship

### Parameter notes from the official docs
- `championship` is the core route discriminator across table, team, results, fixtures, news, and transfers paths.
- `squadname` is documented as fuzzy enough to match corresponding results that contain the supplied letters.
- The marketplace page also mentions a full competitions list in linked documentation, but the route family itself is already summarized on the official product page.

## Response, pagination, and error notes
- The reviewed marketplace page presents the API as JSON-based.
- No offset/page pagination model was documented on the visible route summary.
- No shared error schema was published in the visible docs excerpt.
- Because this is a RapidAPI-hosted product, downstream adapters should expect marketplace-style auth and quota enforcement ahead of any provider-native error behavior.

## Usage notes from the official docs
- The provider advertises coverage for 315+ competitions, with the catalog increasing over time.
- The marketplace description says the API is dynamic and refreshed when endpoints are called.
- The official examples use clean path slugs rather than query-driven search routes.

## fireROUTE normalization notes
- Treat this provider as a path-driven football feed keyed primarily by `championship`.
- Preserve the separate squad lookup modes (`squadname` vs `squadposition`) because the official docs describe different lookup semantics.
- Keep RapidAPI subscription/auth handling in adapter configuration rather than collapsing it into a public unauthenticated API.