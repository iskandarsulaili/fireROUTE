# SpaceX

## Provider metadata
- Category: `Science & Math`
- Provider slug: `spacex-2`
- Description: `Official SpaceX Land GraphQL explorer surface for launch, rocket, mission, ship, and related SpaceX data`
- Official docs/pages used:
  - `https://spacex.land/`
  - `https://spacex.land/api-sub/graphql.html`
  - `https://api.spacex.land/graphql/` (historical host rechecked in this run; not resolving)
- Current public API/docs base URL: `https://spacex.land`
- Official public API entry surface confirmed in this run: `https://spacex.land/api-sub/graphql.html`
- Auth model: no authentication requirement, login gate, token field, or key header was shown on the reviewed official pages
- Methods confirmed from the reviewed official pages:
  - `GET` for the public homepage and GraphiQL explorer surface
  - the reviewed official pages do not publish a separate raw HTTP method table for the underlying GraphQL transport, so fireROUTE does not invent undocumented POST/GET behavior beyond the visible explorer entry page
- Response/data format notes:
  - the reviewed official surface is an interactive GraphiQL explorer with schema docs and a live query editor
  - the visible API interaction model is GraphQL, with a query document editor and a separate `query variables` editor
- Rate limits: no numeric rate-limit policy, quota header guide, or throttling note was published on the reviewed official pages
- Manually confirmed route count: `1`

## API shape and behavior observed on the official site
- `https://spacex.land/` loaded a live official homepage titled `SpaceX Land | Explore Missions, Rockets & Real-Time Launch Data`.
- The homepage exposes an `Explore the API` call-to-action, confirming that the public API/docs surface is still provider-controlled under `spacex.land`.
- `https://spacex.land/api-sub/graphql.html` loaded `GraphiQL Explorer`.
- The reviewed GraphiQL page visibly includes:
  - a `Docs` button
  - a query editor
  - a `query variables` editor
  - a preloaded sample query beginning with `launchesPast(limit: 10)`
- The sample query on the reviewed official page shows representative field access for launch data, including:
  - `mission_name`
  - `launch_date_local`
  - `launch_site { site_name_long }`
  - `links { article_link video_link }`
  - `rocket { rocket_name first_stage { cores { flight core { reuse_count status } } } second_stage { payloads { payload_type payload_mass_kg payload_mass_lbs } } }`
- The historical host `https://api.spacex.land/graphql/` no longer resolves in this run (`net::ERR_NAME_NOT_RESOLVED`), so the current official surface should be normalized on `spacex.land` instead.

## Canonical endpoint
1. `GET /api-sub/graphql.html`
   - Official public SpaceX Land GraphiQL explorer / API entry page.
   - The reviewed page does not publish REST-style route families; it exposes one GraphQL entry surface instead.

## Parameters and request-model notes
- The reviewed GraphiQL surface visibly supports two request inputs:
  - GraphQL query document text
  - GraphQL `query variables` JSON
- The only argument explicitly visible in the reviewed sample query is `limit` on `launchesPast(limit: 10)`.
- No separate official parameter table was published on the reviewed pages outside the live GraphiQL schema/docs UI.

## Pagination, errors, and format notes
- The reviewed sample query demonstrates schema-level limiting through the GraphQL argument `limit`.
- No standalone pagination guide, rate-limit header section, or retry policy was published on the reviewed official pages.
- No standalone error-reference page or structured error schema was published on the reviewed official pages.
- The official surface is GraphiQL-based rather than a static REST reference, so schema discovery happens through the live explorer's `Docs` panel.

## Important usage notes
- Prefer the current `spacex.land` GraphiQL explorer surface over the retired `api.spacex.land` hostname.
- Do not synthesize REST-style per-field routes from the explorer UI; the official surface reviewed in this run is a single GraphQL entry point.
- The preloaded `launchesPast(limit: 10)` query is the clearest officially visible starting point for understanding the data model from the current public site.

## fireROUTE normalization notes
- Normalize this provider on `https://spacex.land` with official public API/docs entry path `/api-sub/graphql.html`.
- Treat this provider as a single GraphQL surface rather than inventing separate REST endpoints for launches, rockets, missions, or ships.
- Do not preserve the retired `api.spacex.land` hostname as canonical.
